"""
VIRELO YouTube Service - Extractor Engine.
Configures and runs yt-dlp specifically for high-fidelity YouTube stream discovery.
"""
import json
import urllib.request
from typing import Dict, Any, Optional
import yt_dlp

from backend.app.utils.formatters import clean_ansi
from backend.app.utils.runtime_config import apply_runtime_ytdlp_opts
from backend.app.services.youtube.url_parser import normalize_youtube_url, extract_video_id
from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    YouTubeError,
    classify_youtube_error,
)
from backend.app.services.youtube.metadata import format_youtube_metadata
from backend.app.services.youtube.circuit_breaker import circuit_breaker


class YouTubeExtractor:
    """Specialized YouTube stream metadata extraction engine."""

    def __init__(self):
        pass

    def _build_ytdlp_opts(self, player_clients: Optional[list] = None) -> Dict[str, Any]:
        """Constructs safe yt-dlp extraction options."""
        opts: Dict[str, Any] = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
            'noplaylist': True,
            'extract_flat': False,
            'socket_timeout': 20,
            'ignoreerrors': False,
            'http_headers': {
                'Accept-Language': 'en-US,en;q=0.9',
            }
        }
        if player_clients:
            opts['extractor_args'] = {'youtube': {'player_client': player_clients}}

        return apply_runtime_ytdlp_opts(opts)

    def extract_info(self, url: str) -> Dict[str, Any]:
        """
        Extracts comprehensive metadata, available resolutions, formats, and subtitles for YouTube media.
        Implements primary desktop extraction and resilient android/mweb fallback.
        """
        canonical_url = normalize_youtube_url(url)
        video_id = extract_video_id(canonical_url)

        # 1. Circuit breaker guard
        allowed, reason = circuit_breaker.can_attempt(video_id)
        if not allowed:
            raise YouTubeError(
                YouTubeErrorCode.CLOUD_IP_RESTRICTED,
                reason or "Temporary cooldown active for this media.",
                raw_error="Circuit breaker triggered"
            )

        # 2. Primary extraction attempt (web client for up to 4K/8K resolution)
        primary_opts = self._build_ytdlp_opts()
        last_clean_err = ""

        try:
            with yt_dlp.YoutubeDL(primary_opts) as ydl:
                raw_info = ydl.extract_info(canonical_url, download=False)
                if raw_info:
                    circuit_breaker.record_success(video_id)
                    return format_youtube_metadata(raw_info, canonical_url)
        except Exception as exc:
            last_clean_err = clean_ansi(str(exc))

        # 3. Resilient fallback attempt (android + mweb client for cloud IP bypass)
        # Often mobile clients bypass web BotGuard requirements on cloud hosting IPs
        fallback_triggers = [
            "bot", "challenge", "sign in", "po_token", "gvs",
            "403", "format is not available", "playabilitystatus"
        ]
        if any(t in last_clean_err.lower() for t in fallback_triggers):
            try:
                fallback_opts = self._build_ytdlp_opts(player_clients=['android', 'mweb'])
                with yt_dlp.YoutubeDL(fallback_opts) as fb_ydl:
                    fb_info = fb_ydl.extract_info(canonical_url, download=False)
                    if fb_info:
                        circuit_breaker.record_success(video_id)
                        return format_youtube_metadata(fb_info, canonical_url)
            except Exception as fb_exc:
                last_clean_err = clean_ansi(str(fb_exc))

        # 4. Classify error and update circuit breaker
        code, user_msg = classify_youtube_error(last_clean_err)
        circuit_breaker.record_failure(video_id, code)

        # 5. Legitimate metadata recovery: if stream extraction is restricted on cloud IPs,
        # fetch official metadata via YouTube oEmbed so users receive genuine title, author, and preview
        if code in (YouTubeErrorCode.CLOUD_IP_RESTRICTED, YouTubeErrorCode.CHALLENGE_REQUIRED) and video_id:
            oembed_info = self._fetch_oembed_metadata(video_id, canonical_url)
            if oembed_info:
                oembed_info["restriction_code"] = code.value
                oembed_info["restriction_notice"] = user_msg
                return oembed_info

        raise YouTubeError(
            code=code,
            message=user_msg,
            raw_error=last_clean_err
        )

    def _fetch_oembed_metadata(self, video_id: str, canonical_url: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves official YouTube video metadata via public oEmbed API.
        Acts as zero-auth fallback when stream format discovery is restricted by datacenter IP gating.
        """
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
        try:
            req = urllib.request.Request(
                oembed_url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            )
            with urllib.request.urlopen(req, timeout=7) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return {
                    "is_direct_file": False,
                    "url": canonical_url,
                    "video_id": video_id,
                    "title": data.get("title") or f"YouTube Video [{video_id}]",
                    "uploader": data.get("author_name") or "YouTube Creator",
                    "platform": "YouTube",
                    "thumbnail": data.get("thumbnail_url") or f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
                    "duration": None,
                    "duration_seconds": None,
                    "file_size": None,
                    "file_size_str": None,
                    "media_type": "video",
                    "available_qualities": [],
                    "available_formats": [],
                    "formats": [],
                    "subtitles": [],
                    "is_playlist": False,
                    "playlist_count": 0,
                    "view_count": None,
                    "description": None,
                }
        except Exception:
            return None

