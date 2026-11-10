"""
Formatting and calculation utilities for media telemetry, file sizes, and ANSI cleaning.
"""
import re
import shutil
from typing import Optional


def format_bytes(bytes_num: Optional[int]) -> str:
    """Format bytes to human-readable string (KB, MB, GB, TB)."""
    if not bytes_num or bytes_num <= 0:
        return "0 B"
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_num < 1024.0:
            return f"{bytes_num:.1f} {unit}"
        bytes_num /= 1024.0
    return f"{bytes_num:.1f} PB"


def format_seconds(seconds: Optional[int]) -> str:
    """Format duration in seconds to HH:MM:SS or MM:SS."""
    if not seconds or seconds <= 0:
        return "00:00"
    m, s = divmod(int(seconds), 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def clean_ansi(text: str) -> str:
    """
    Strips terminal ANSI color codes and control sequences from output strings.
    """
    if not text:
        return ""
    # Strip ANSI escape sequences: \x1b[..., \033[..., or bare [0;31m
    text = re.sub(r'(?:\x1b|\033|\u001b)?\[[0-9;]*[a-zA-Z]', '', text)
    # Strip control characters
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
    # Remove leading ERROR: if duplicated
    text = re.sub(r'^(?:ERROR:\s*)+', '', text, flags=re.IGNORECASE)
    return text.strip()


def get_disk_free_gb(path: str) -> float:
    """Calculates free disk space in Gigabytes for the specified path."""
    try:
        total, used, free = shutil.disk_usage(path)
        return round(free / (1024 ** 3), 2)
    except Exception:
        return 0.0
