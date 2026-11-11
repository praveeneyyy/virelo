"""
VIRELO YouTube Service - Audio Stream Extractor & Transcoder.
Downloads raw audio streams and transcodes into high-fidelity MP3, M4A, FLAC, WAV, OPUS, OGG, or AAC.
"""
import os
import threading
from typing import Dict, Any, Optional, Callable
import yt_dlp

from backend.app.utils.ffmpeg import get_ffmpeg_info
from backend.app.utils.formatters import clean_ansi
from backend.app.utils.runtime_config import apply_runtime_ytdlp_opts
from backend.app.services.media_converter import MediaConverter
from backend.app.services.youtube.url_parser import normalize_youtube_url, extract_video_id
from backend.app.services.youtube.formats import (
    build_audio_format_spec,
    SUPPORTED_AUDIO_CODECS,
    YOUTUBE_PRIMARY_CLIENTS,
    YOUTUBE_FALLBACK_CLIENTS,
)
from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    YouTubeError,
    classify_youtube_error,
)
from backend.app.services.youtube.circuit_breaker import circuit_breaker


class YouTubeAudioExtractor:
    """Handles audio extraction and FFmpeg transcoding for YouTube streams."""

    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.converter = MediaConverter()

    def download_audio(
        self,
        url: str,
        target_format: str = "mp3",
        bitrate: str = "320",
        embed_thumbnail: bool = True,
        progress_hook: Optional[Callable[[Dict[str, Any]], None]] = None,
        cancel_token: Optional[threading.Event] = None
    ) -> str:
        """
        Extracts the highest fidelity audio stream from YouTube and transcodes into target format.
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

        ffmpeg_info = get_ffmpeg_info()
        has_ffprobe = bool(ffmpeg_info.get('ffprobe'))

        target_fmt = target_format.lower()
        if target_fmt not in SUPPORTED_AUDIO_CODECS:
            target_fmt = "mp3"

        standard_ytdlp_codecs = ["mp3", "m4a", "flac", "wav", "opus", "ogg", "aac"]
        intermediate_fmt = target_fmt if target_fmt in standard_ytdlp_codecs else "wav"

        opts: Dict[str, Any] = {
            'outtmpl': os.path.join(self.output_dir, '%(title).150B [%(id)s].%(ext)s'),
            'windowsfilenames': True,
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': False,
            'format': build_audio_format_spec(),
            'extractor_args': {'youtube': {'player_client': YOUTUBE_PRIMARY_CLIENTS}},
        }
        if progress_hook:
            opts['progress_hooks'] = [progress_hook]

        postprocessors = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': intermediate_fmt,
            'preferredquality': str(bitrate),
        }]

        if embed_thumbnail and has_ffprobe and target_fmt in ["mp3", "m4a", "flac"]:
            opts['writethumbnail'] = True
            postprocessors.append({'key': 'EmbedThumbnail'})

        opts['postprocessors'] = postprocessors
        opts = apply_runtime_ytdlp_opts(opts)

        prep_file = None
        last_clean_err = ""

        # Primary extraction attempt with high-fidelity TV/VisionOS player clients
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                down_info = ydl.extract_info(canonical_url, download=True)
                prep_file = ydl.prepare_filename(down_info)
                circuit_breaker.record_success(video_id)
        except Exception as dl_err:
            last_clean_err = clean_ansi(str(dl_err))

        # Fallback to secondary client hierarchy if challenge triggered
        fallback_triggers = [
            "bot", "challenge", "sign in", "po_token", "gvs",
            "403", "format is not available", "playabilitystatus"
        ]
        if not prep_file and any(t in last_clean_err.lower() for t in fallback_triggers):
            try:
                fb_opts = dict(opts)
                fb_opts['extractor_args'] = {'youtube': {'player_client': YOUTUBE_FALLBACK_CLIENTS}}
                fb_opts['format'] = 'bestaudio/best'
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

        # Locate produced file
        base, _ = os.path.splitext(prep_file)
        expected_file = f"{base}.{intermediate_fmt}"
        res_file = expected_file if os.path.exists(expected_file) else prep_file

        # Additional FFmpeg transcoding if intermediate differs from target
        if intermediate_fmt != target_fmt and os.path.exists(res_file):
            res_file = self.converter.transcode_audio(res_file, target_fmt, bitrate=str(bitrate))

        if not os.path.exists(res_file):
            raise FileNotFoundError(f"Transcoded audio file not found on disk: {res_file}")

        return res_file

