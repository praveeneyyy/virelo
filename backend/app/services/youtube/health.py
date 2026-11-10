"""
VIRELO YouTube Service - Runtime Health & Dependency Diagnostics.
Inspects local/cloud runtime readiness for YouTube stream processing.
"""
from typing import Dict, Any
import yt_dlp

from backend.app.utils.ffmpeg import get_ffmpeg_info, get_js_runtime_info
from backend.app.utils.runtime_config import ensure_server_cookies, get_server_proxy
from backend.app.services.youtube.circuit_breaker import circuit_breaker


def check_youtube_health() -> Dict[str, Any]:
    """
    Returns complete diagnostic status of all YouTube extraction prerequisites.
    """
    ffmpeg_info = get_ffmpeg_info()
    js_info = get_js_runtime_info()
    cookie_file = ensure_server_cookies()
    proxy = get_server_proxy()

    has_cookies = bool(cookie_file)
    has_proxy = bool(proxy)
    has_ffmpeg = bool(ffmpeg_info.get("ffmpeg"))
    has_ffprobe = bool(ffmpeg_info.get("ffprobe"))
    has_js = bool(js_info.get("available"))

    healthy = has_ffmpeg and has_js

    return {
        "status": "ready" if healthy else "degraded",
        "ytdlp_version": yt_dlp.version.__version__,
        "js_runtime": js_info.get("runtime"),
        "js_runtime_path": js_info.get("path"),
        "js_runtime_available": has_js,
        "ffmpeg_available": has_ffmpeg,
        "ffmpeg_path": ffmpeg_info.get("ffmpeg"),
        "ffprobe_available": has_ffprobe,
        "ffprobe_path": ffmpeg_info.get("ffprobe"),
        "server_cookies_active": has_cookies,
        "server_proxy_active": has_proxy,
        "circuit_breaker_active_downloads": circuit_breaker.active_downloads_count,
    }

