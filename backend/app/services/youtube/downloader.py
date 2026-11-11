"""
VIRELO YouTube Service - Video Download & Merging Pipeline.
Downloads and multiplexes separated DASH/HLS audio and video streams using native FFmpeg.
"""
import os
import re
import threading
from typing import Dict, Any, Optional, Callable
import yt_dlp

from backend.app.utils.ffmpeg import get_ffmpeg_info
from backend.app.utils.formatters import clean_ansi
from backend.app.utils.runtime_config import apply_runtime_ytdlp_opts
from backend.app.services.media_converter import MediaConverter
from backend.app.services.youtube.url_parser import normalize_youtube_url, extract_video_id
from backend.app.services.youtube.formats import (
    build_video_format_spec,
    SUPPORTED_VIDEO_CONTAINERS,
    YOUTUBE_PRIMARY_CLIENTS,
    YOUTUBE_FALLBACK_CLIENTS,
)
from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    YouTubeError,
    classify_youtube_error,
)
from backend.app.services.youtube.circuit_breaker import circuit_breaker


class YouTubeDownloader:
    """Handles full video stream downloading, FFmpeg track merging, and formatting."""

    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.converter = MediaConverter()

    def download_video(
        self,
        url: str,
        target_format: str = "mp4",
        quality: str = "best",
        embed_thumbnail: bool = True,
        embed_subtitles: bool = False,
        subtitle_langs: Optional[list] = None,
        progress_hook: Optional[Callable[[Dict[str, Any]], None]] = None,
        cancel_token: Optional[threading.Event] = None,
        gif_options: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Downloads highest video stream and highest audio stream, multiplexing into MP4/MKV/WebM via FFmpeg.
        Enforces concurrency limit and circuit breaker protection.
        """
        canonical_url = normalize_youtube_url(url)
        video_id = extract_video_id(canonical_url)

        # 1. Circuit breaker guard
        allowed, reason = circuit_breaker.can_attempt(video_id)
        if not allowed:
            raise YouTubeError(
                YouTubeErrorCode.CLOUD_IP_RESTRICTED,
                reason or "Temporary cooldown active for this media."
            )

        # 2. Acquire concurrency slot
        if not circuit_breaker.acquire_slot(timeout=15.0):
            raise YouTubeError(
                YouTubeErrorCode.RATE_LIMITED,
                "The server is currently processing the maximum number of concurrent YouTube downloads. Please retry in a few moments."
            )

        try:
            return self._execute_download(
                canonical_url=canonical_url,
                video_id=video_id,
                target_format=target_format,
                quality=quality,
                embed_thumbnail=embed_thumbnail,
                embed_subtitles=embed_subtitles,
                subtitle_langs=subtitle_langs,
                progress_hook=progress_hook,
                cancel_token=cancel_token,
                gif_options=gif_options
            )
        finally:
            circuit_breaker.release_slot()

    def _execute_download(
        self,
        canonical_url: str,
        video_id: Optional[str],
        target_format: str,
        quality: str,
        embed_thumbnail: bool,
        embed_subtitles: bool,
        subtitle_langs: Optional[list],
        progress_hook: Optional[Callable[[Dict[str, Any]], None]],
        cancel_token: Optional[threading.Event],
        gif_options: Optional[Dict[str, Any]]
    ) -> str:
        ffmpeg_info = get_ffmpeg_info()
        ffmpeg_bin = ffmpeg_info.get('ffmpeg')
        has_ffprobe = bool(ffmpeg_info.get('ffprobe'))

        target_fmt = target_format.lower()
        is_gif = (target_fmt == "gif")

        # Container selection
        if target_fmt in SUPPORTED_VIDEO_CONTAINERS:
            merge_fmt = target_fmt
        else:
            merge_fmt = "mp4"

        format_spec = build_video_format_spec(quality)

        opts: Dict[str, Any] = {
            'outtmpl': os.path.join(self.output_dir, '%(title).150B [%(id)s].%(ext)s'),
            'windowsfilenames': True,
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': False,
            'format': format_spec,
            'merge_output_format': merge_fmt,
            'concurrent_fragment_downloads': 4,
            'buffersize': 1024 * 1024,
            'retries': 5,
            'fragment_retries': 5,
            'extractor_args': {'youtube': {'player_client': YOUTUBE_PRIMARY_CLIENTS}},
        }
        if progress_hook:
            opts['progress_hooks'] = [progress_hook]

        postprocessors = []

        if embed_thumbnail and has_ffprobe and not is_gif:
            opts['writethumbnail'] = True
            postprocessors.append({'key': 'EmbedThumbnail'})

        if embed_subtitles and ffmpeg_bin and not is_gif:
            opts['writesubtitles'] = True
            opts['writeautomaticsub'] = True
            opts['subtitleslangs'] = subtitle_langs or ["en"]
            postprocessors.append({'key': 'FFmpegEmbedSubtitle'})

        # If user requested legacy format (avi, mov, flv, wmv, 3gp)
        if target_fmt in ["avi", "mov", "flv", "wmv", "3gp", "ts"] and ffmpeg_bin:
            postprocessors.append({
                'key': 'FFmpegVideoConvertor',
                'preferedformat': target_fmt,
            })

        if postprocessors:
            opts['postprocessors'] = postprocessors

        opts = apply_runtime_ytdlp_opts(opts)

        prep_file = None
        last_clean_err = ""

        # Attempt 1: Modern high-fidelity TV/VisionOS player clients
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                down_info = ydl.extract_info(canonical_url, download=True)
                prep_file = ydl.prepare_filename(down_info)
                circuit_breaker.record_success(video_id)
        except Exception as dl_err:
            last_clean_err = clean_ansi(str(dl_err))

        # Check cancellation
        if cancel_token and cancel_token.is_set():
            raise InterruptedError("Download cancelled by user.")

        # Attempt 2: Resilient fallback client hierarchy
        fallback_triggers = [
            "bot", "challenge", "sign in", "po_token", "gvs",
            "403", "format is not available", "playabilitystatus"
        ]
        if not prep_file and any(t in last_clean_err.lower() for t in fallback_triggers):
            try:
                fb_opts = dict(opts)
                fb_opts['extractor_args'] = {'youtube': {'player_client': YOUTUBE_FALLBACK_CLIENTS}}
                fb_opts['format'] = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/best'
                with yt_dlp.YoutubeDL(fb_opts) as fb_ydl:
                    down_info = fb_ydl.extract_info(canonical_url, download=True)
                    prep_file = fb_ydl.prepare_filename(down_info)
                    circuit_breaker.record_success(video_id)
            except Exception as fb_err:
                last_clean_err = clean_ansi(str(fb_err))

        if not prep_file:
            code, user_msg = classify_youtube_error(last_clean_err)
            circuit_breaker.record_failure(video_id, code)
            raise YouTubeError(code, user_msg, raw_error=last_clean_err)

        # Locate final file
        if os.path.exists(prep_file):
            final_file = prep_file
        else:
            base, _ = os.path.splitext(prep_file)
            candidate = f"{base}.{merge_fmt}"
            final_file = candidate if os.path.exists(candidate) else prep_file

        if not os.path.exists(final_file):
            raise FileNotFoundError(f"Downloaded video file not found on disk: {final_file}")

        # Post-download conversion for GIF
        if is_gif:
            gif_opts = gif_options or {}
            final_file = self.converter.video_to_gif(
                final_file,
                fps=gif_opts.get("fps", 15),
                scale_width=gif_opts.get("scale_width", 480),
                start_time=gif_opts.get("start_time"),
                duration=gif_opts.get("duration"),
                speed=gif_opts.get("speed", 1.0)
            )

        return final_file

