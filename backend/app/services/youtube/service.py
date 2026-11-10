"""
VIRELO YouTube Service - Unified Facade.
Central entry point for all YouTube extraction, format discovery, audio transcoding, and video multiplexing.
"""
import os
import threading
from typing import Dict, Any, Optional, Callable

from backend.app.core.config import settings
from backend.app.services.youtube.url_parser import is_youtube_url, normalize_youtube_url, extract_video_id
from backend.app.services.youtube.errors import YouTubeErrorCode, YouTubeError, classify_youtube_error
from backend.app.services.youtube.extractor import YouTubeExtractor
from backend.app.services.youtube.audio import YouTubeAudioExtractor
from backend.app.services.youtube.downloader import YouTubeDownloader
from backend.app.services.youtube.health import check_youtube_health
from backend.app.services.youtube.circuit_breaker import circuit_breaker


class YouTubeService:
    """Unified service orchestrator for all YouTube operations."""

    def __init__(self, output_dir: Optional[str] = None):
        self.output_dir = output_dir or settings.DOWNLOADS_PATH
        self.extractor = YouTubeExtractor()
        self.audio_extractor = YouTubeAudioExtractor(self.output_dir)
        self.video_downloader = YouTubeDownloader(self.output_dir)

    def is_youtube_url(self, url: str) -> bool:
        """Determines if the given URL targets YouTube."""
        return is_youtube_url(url)

    def extract(self, url: str) -> Dict[str, Any]:
        """
        Extracts verified metadata, dynamic format resolutions, and audio tracks.
        """
        return self.extractor.extract_info(url)

    def download(
        self,
        job: Dict[str, Any],
        progress_hook: Optional[Callable[[Dict[str, Any]], None]] = None,
        cancel_token: Optional[threading.Event] = None
    ) -> str:
        """
        Dispatches download to either audio transcoding or video multiplexing.
        """
        url = job["url"].strip()
        media_type = job.get("media_type", "video").lower()
        target_format = job.get("target_format", "mp4").lower()
        quality = job.get("target_quality", "best")
        bitrate = job.get("target_bitrate", "320")

        if media_type == "audio":
            return self.audio_extractor.download_audio(
                url=url,
                target_format=target_format,
                bitrate=bitrate,
                embed_thumbnail=job.get("embed_thumbnail", True),
                progress_hook=progress_hook,
                cancel_token=cancel_token
            )
        else:
            gif_options = {
                "fps": job.get("fps", 15),
                "scale_width": job.get("scale_width", 480),
                "start_time": job.get("start_time"),
                "duration": job.get("duration"),
                "speed": job.get("speed", 1.0)
            }
            return self.video_downloader.download_video(
                url=url,
                target_format=target_format,
                quality=quality,
                embed_thumbnail=job.get("embed_thumbnail", True),
                embed_subtitles=job.get("embed_subtitles", False),
                subtitle_langs=job.get("subtitle_langs", ["en"]),
                progress_hook=progress_hook,
                cancel_token=cancel_token,
                gif_options=gif_options
            )

    def get_health(self) -> Dict[str, Any]:
        """Returns YouTube subsystem health."""
        return check_youtube_health()


# Global YouTube service instance
youtube_service = YouTubeService()

