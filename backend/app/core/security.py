"""
Security and URL validation utilities:
- SSRF prevention (blocking RFC1918, localhost, IPv6 loopback, cloud metadata endpoints)
- Safe filename generation
- Directory traversal defenses
"""
import os
import re
import ipaddress
import socket
import urllib.parse
from typing import Tuple


BLOCKED_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),       # Link-local & cloud metadata (e.g. 169.254.169.254)
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

WINDOWS_RESERVED_NAMES = {
    "CON", "PRN", "AUX", "NUL",
    "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
    "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
}


def validate_url(url: str, allow_private: bool = False) -> Tuple[bool, str]:
    """
    Validates a URL for format and SSRF safety.
    Returns (is_valid, error_reason_or_normalized_url)
    """
    if not url or not isinstance(url, str):
        return False, "URL cannot be empty."

    url = url.strip()
    try:
        parsed = urllib.parse.urlparse(url)
    except Exception:
        return False, "Malformed URL structure."

    if parsed.scheme.lower() not in ("http", "https"):
        return False, f"Unsupported URL protocol: '{parsed.scheme}'. Only HTTP and HTTPS are permitted."

    hostname = parsed.hostname
    if not hostname:
        return False, "URL lacks a valid hostname."

    # In dev or testing, if explicit loopback is disabled, block private ranges
    if not allow_private:
        # Check if hostname directly resolves to private/loopback IP
        try:
            # Resolve all IPs
            addr_info = socket.getaddrinfo(hostname, parsed.port or (443 if parsed.scheme == "https" else 80))
            for family, _, _, _, sockaddr in addr_info:
                ip_str = sockaddr[0]
                ip_obj = ipaddress.ip_address(ip_str)
                for net in BLOCKED_NETWORKS:
                    if ip_obj in net:
                        return False, f"Access to private/local network address ({ip_str}) is restricted."
        except socket.gaierror:
            # May be domain not found, which yt-dlp will report on download
            pass
        except Exception:
            pass

    return True, url


def sanitize_filename(filename: str, max_length: int = 180) -> str:
    """
    Converts arbitrary string into a safe, valid cross-platform filename.
    Guards against directory traversal (../), path injection, and Windows reserved device names.
    """
    if not filename:
        return "downloaded_file"

    # Strip null bytes and control chars
    clean = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', filename)
    
    # Strip illegal filename characters on Windows/Linux: < > : " / \ | ? *
    clean = re.sub(r'[<>:"/\\|?*]', '_', clean)

    # Prevent directory traversal
    clean = clean.replace('..', '_').strip(' .')

    # Guard against Windows reserved names
    name_root = clean.split('.')[0].upper()
    if name_root in WINDOWS_RESERVED_NAMES:
        clean = f"safe_{clean}"

    # Truncate length while keeping extension
    if len(clean) > max_length:
        base, ext = os.path.splitext(clean)
        clean = base[:max_length - len(ext)] + ext

    return clean or "downloaded_file"


def is_safe_path(target_path: str, base_directory: str) -> bool:
    """
    Verifies that target_path is strictly within base_directory to prevent directory traversal.
    """
    resolved_target = os.path.abspath(target_path)
    resolved_base = os.path.abspath(base_directory)
    return resolved_target.startswith(resolved_base)
