"""
Runtime Configuration Helper for VIRELO.
Centralizes JS runtime resolution, server-side cookies provisioning, and proxy configuration.
"""
import os
import base64
import logging
from typing import Dict, Any, Optional

from backend.app.utils.ffmpeg import get_ffmpeg_info, get_js_runtime_info

logger = logging.getLogger("virelo.runtime")

DEFAULT_COOKIE_FILE = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "cookies.txt")
)


def ensure_server_cookies() -> Optional[str]:
    """
    Checks environment variables (YTDLP_COOKIES_TEXT, YTDLP_COOKIES_B64, YOUTUBE_COOKIES)
    or existing file on disk. If environment variable is set, writes to disk automatically.
    This enables Render/Docker server-side authentication with zero end-user action.
    """
    # 1. Check for raw Netscape cookie text in environment variable
    raw_text = os.getenv("YTDLP_COOKIES_TEXT") or os.getenv("YOUTUBE_COOKIES")
    if raw_text and raw_text.strip():
        try:
            os.makedirs(os.path.dirname(DEFAULT_COOKIE_FILE), exist_ok=True)
            with open(DEFAULT_COOKIE_FILE, "w", encoding="utf-8") as f:
                f.write(raw_text.strip() + "\n")
            logger.info("Successfully provisioned server cookies from YTDLP_COOKIES_TEXT.")
            return DEFAULT_COOKIE_FILE
        except Exception as e:
            logger.warning(f"Failed writing cookies from YTDLP_COOKIES_TEXT: {e}")

    # 2. Check for base64 encoded cookies in environment variable
    b64_text = os.getenv("YTDLP_COOKIES_B64")
    if b64_text and b64_text.strip():
        try:
            decoded = base64.b64decode(b64_text.strip()).decode("utf-8", errors="ignore")
            os.makedirs(os.path.dirname(DEFAULT_COOKIE_FILE), exist_ok=True)
            with open(DEFAULT_COOKIE_FILE, "w", encoding="utf-8") as f:
                f.write(decoded.strip() + "\n")
            logger.info("Successfully provisioned server cookies from YTDLP_COOKIES_B64.")
            return DEFAULT_COOKIE_FILE
        except Exception as e:
            logger.warning(f"Failed decoding/writing cookies from YTDLP_COOKIES_B64: {e}")

    # 3. Check for specified cookie path in environment variable
    env_path = os.getenv("YTDLP_COOKIES_PATH") or os.getenv("COOKIE_FILE")
    if env_path and os.path.isfile(env_path):
        return env_path

    # 4. Check known paths on disk
    candidates = [
        DEFAULT_COOKIE_FILE,
        os.path.abspath("cookies.txt"),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "cookies.txt")),
        "/app/data/cookies.txt",
    ]
    for cand in candidates:
        if os.path.isfile(cand) and os.path.getsize(cand) > 10:
            return cand

    return None


def get_server_proxy() -> Optional[str]:
    """Returns proxy configured in environment variables, if any."""
    return os.getenv("YTDLP_PROXY") or os.getenv("HTTP_PROXY") or os.getenv("HTTPS_PROXY") or None


def apply_runtime_ytdlp_opts(opts: Dict[str, Any]) -> Dict[str, Any]:
    """
    Applies FFmpeg, JavaScript runtime (Deno/Node), cookies, and proxy to yt-dlp options dictionary.
    """
    ffmpeg_info = get_ffmpeg_info()
    loc = ffmpeg_info.get("dir") or ffmpeg_info.get("ffmpeg")
    if loc:
        opts["ffmpeg_location"] = loc

    # Configure proper JS runtime for yt-dlp EJS challenges
    js_info = get_js_runtime_info()
    if js_info.get("available") and js_info.get("runtime"):
        runtime_name = js_info["runtime"]  # 'deno' or 'node'
        runtime_path = js_info.get("path")
        if runtime_path:
            opts["js_runtimes"] = {runtime_name: {"path": runtime_path}}
        else:
            opts["js_runtimes"] = {runtime_name: {}}
    else:
        opts["js_runtimes"] = {"node": {}}

    opts["remote_components"] = {"ejs:github"}

    # Server-side cookies
    cookie_path = ensure_server_cookies()
    if cookie_path and os.path.isfile(cookie_path):
        opts["cookiefile"] = cookie_path

    # Server-side proxy
    proxy = get_server_proxy()
    if proxy:
        opts["proxy"] = proxy

    return opts

