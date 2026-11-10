"""
Async Download Queue and Background Execution Manager.
Provides persistent job tracking, worker concurrency control, cancellation tokens,
and real-time WebSocket state broadcasting.
"""
import os
import re
import time
import uuid
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, List, Optional, Set
import yt_dlp
from fastapi import WebSocket

from backend.app.core.config import settings
from backend.app.core.database import save_job, get_job, get_all_jobs, add_history_entry
from backend.app.core.security import sanitize_filename
from backend.app.services.extractor import MediaExtractor
from backend.app.services.media_converter import MediaConverter
from backend.app.services.direct_downloader import DirectStreamDownloader
from backend.app.utils.ffmpeg import get_ffmpeg_info
from backend.app.utils.formatters import format_bytes, format_seconds, clean_ansi


class ConnectionManager:
    """Manages active WebSocket connections for live progress streaming."""
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self.active_connections.add(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            self.active_connections.discard(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        async with self._lock:
            dead = []
            for connection in self.active_connections:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead.append(connection)
            for d in dead:
                self.active_connections.discard(d)


ws_manager = ConnectionManager()


class QueueManager:
    def __init__(self):
        self.output_dir = settings.DOWNLOADS_PATH
        self.extractor = MediaExtractor()
        self.converter = MediaConverter()
        self.direct_downloader = DirectStreamDownloader(self.output_dir)
        self.active_cancellations: Dict[str, threading.Event] = {}
        self.executor = ThreadPoolExecutor(max_workers=settings.MAX_CONCURRENT_DOWNLOADS)
        self.loop: Optional[asyncio.AbstractEventLoop] = None

    def set_event_loop(self, loop: asyncio.AbstractEventLoop):
        self.loop = loop

    def notify_job_update(self, job: Dict[str, Any]):
        """Persists job and emits WebSocket update on event loop."""
        save_job(job)
        if self.loop and self.loop.is_running():
            asyncio.run_coroutine_threadsafe(
                ws_manager.broadcast({"type": "job_update", "job": job}),
                self.loop
            )

    def enqueue_job(self, req_data: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new download job, stores in DB, and dispatches to thread pool."""
        job_id = str(uuid.uuid4())
        job = {
            "id": job_id,
            "url": req_data["url"],
            "title": req_data.get("title") or "Resolving Title...",
            "platform": req_data.get("platform") or "Detecting...",
            "media_type": req_data.get("media_type", "video"),
            "target_format": req_data.get("format", "mp4").lower(),
            "target_quality": req_data.get("quality", "best"),
            "target_bitrate": req_data.get("bitrate", "320"),
            "thumbnail": req_data.get("thumbnail"),
            "status": "queued",
            "progress": 0.0,
            "speed_str": "0 B/s",
            "eta_str": "--",
            "downloaded_bytes": 0,
            "total_bytes": 0,
            "file_path": None,
            "file_name": None,
            "file_size_str": None,
            "error": None,
            "created_at": time.time(),
            "completed_at": None,
            # Config options
            "embed_thumbnail": req_data.get("embed_thumbnail", True),
            "embed_subtitles": req_data.get("embed_subtitles", False),
            "subtitle_langs": req_data.get("subtitle_langs", ["en"]),
            "custom_filename": req_data.get("custom_filename"),
            # GIF / Clipper Tuning Options
            "start_time": req_data.get("start_time"),
            "duration": req_data.get("duration"),
            "fps": req_data.get("fps", 15),
            "scale_width": req_data.get("scale_width", 480),
            "speed": req_data.get("speed", 1.0),
        }

        save_job(job)
        self.active_cancellations[job_id] = threading.Event()
        self.executor.submit(self._worker_execute, job_id, job)
        self.notify_job_update(job)
        return job

    def cancel_job(self, job_id: str) -> bool:
        """Signals cancellation to the running worker."""
        if job_id in self.active_cancellations:
            self.active_cancellations[job_id].set()

        job = get_job(job_id)
        if job and job["status"] not in ("completed", "failed", "cancelled"):
            job["status"] = "cancelled"
            job["error"] = "Download cancelled by user."
            self.notify_job_update(job)
            add_history_entry(job)
            return True
        return False

    def retry_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Re-enqueues a previously failed or cancelled job."""
        job = get_job(job_id)
        if not job:
            return None

        job["status"] = "queued"
        job["progress"] = 0.0
        job["speed_str"] = "0 B/s"
        job["eta_str"] = "--"
        job["error"] = None
        self.active_cancellations[job_id] = threading.Event()
        self.executor.submit(self._worker_execute, job_id, job)
        self.notify_job_update(job)
        return job

    def _worker_execute(self, job_id: str, job: Dict[str, Any]):
        """Main background worker running in dedicated thread."""
        cancel_token = self.active_cancellations.get(job_id)

        try:
            job["status"] = "downloading"
            self.notify_job_update(job)

            url = job["url"].strip()
            media_type = job["media_type"].lower()
            target_format = job["target_format"].lower()

            # 1. Inspect metadata if title/platform missing
            info = self.extractor.extract_info(url)
            job["title"] = info.get("title") or job.get("title") or "Untitled Media"
            job["platform"] = info.get("platform") or job.get("platform") or "Web"
            job["thumbnail"] = info.get("thumbnail") or job.get("thumbnail")
            self.notify_job_update(job)

            if cancel_token and cancel_token.is_set():
                raise InterruptedError("Download cancelled.")

            # 2. Progress reporting hook
            def progress_hook(d: Dict[str, Any]):
                if cancel_token and cancel_token.is_set():
                    raise InterruptedError("Download cancelled.")

                status = d.get("status")
                if status == "downloading":
                    total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
                    downloaded = d.get("downloaded_bytes", 0)
                    pct = round((downloaded / total * 100), 1) if total > 0 else d.get("percent", 0.0)
                    speed = d.get("speed") or 0
                    eta = d.get("eta") or 0

                    job.update({
                        "progress": pct,
                        "downloaded_bytes": downloaded,
                        "total_bytes": total,
                        "speed_str": f"{format_bytes(speed)}/s" if speed else "0 B/s",
                        "eta_str": f"{eta}s" if eta else "--",
                    })
                    self.notify_job_update(job)
                elif status == "finished":
                    job.update({
                        "progress": 99.0,
                        "speed_str": "Finishing...",
                        "eta_str": "0s",
                    })
                    self.notify_job_update(job)

            # 3. Handle Direct File Download
            if info.get("is_direct_file"):
                direct_url = info.get("url") or url
                downloaded_file = self.direct_downloader.download(
                    direct_url,
                    custom_filename=job.get("custom_filename"),
                    progress_callback=progress_hook,
                    is_cancelled=lambda: cancel_token.is_set() if cancel_token else False
                )

                # Format transcoding if target differs from source
                ext = downloaded_file.split('.')[-1].lower()
                final_file = downloaded_file
                if target_format and ext != target_format:
                    job["status"] = "converting"
                    self.notify_job_update(job)
                    if media_type == "image":
                        final_file = self.converter.convert_image(downloaded_file, target_format)
                    elif media_type == "audio":
                        final_file = self.converter.transcode_audio(downloaded_file, target_format, bitrate=job.get("target_bitrate", "320"))
                    elif media_type == "video":
                        final_file = self.converter.transcode_video(downloaded_file, target_format)

            # 4. Handle Streaming Platform (yt-dlp)
            else:
                final_file = self._execute_ytdlp_download(job, info, progress_hook, cancel_token)

            # 5. Completion
            if not os.path.exists(final_file):
                raise FileNotFoundError(f"Resulting file was not found on disk: {final_file}")

            f_size = os.path.getsize(final_file)
            f_name = os.path.basename(final_file)

            job.update({
                "status": "completed",
                "progress": 100.0,
                "speed_str": "0 B/s",
                "eta_str": "Done",
                "file_path": final_file,
                "file_name": f_name,
                "file_size_str": format_bytes(f_size),
                "completed_at": time.time(),
                "error": None
            })
            self.notify_job_update(job)
            add_history_entry(job)

        except InterruptedError:
            job["status"] = "cancelled"
            job["error"] = "Download cancelled by user."
            self.notify_job_update(job)
            add_history_entry(job)
        except Exception as exc:
            clean_err = clean_ansi(str(exc))
            job["status"] = "failed"
            job["error"] = clean_err or "Download process encountered an unexpected failure."
            self.notify_job_update(job)
            add_history_entry(job)
        finally:
            if job_id in self.active_cancellations:
                del self.active_cancellations[job_id]

    def _execute_ytdlp_download(
        self,
        job: Dict[str, Any],
        info: Dict[str, Any],
        progress_hook: Any,
        cancel_token: Optional[threading.Event]
    ) -> str:
        """Drives yt-dlp to download and convert video or audio with post-processors."""
        ffmpeg_info = get_ffmpeg_info()
        ffmpeg_dir = ffmpeg_info.get('dir')
        ffmpeg_bin = ffmpeg_info.get('ffmpeg')
        has_ffprobe = bool(ffmpeg_info.get('ffprobe'))

        media_type = job["media_type"].lower()
        target_fmt = job["target_format"].lower()
        quality = job.get("target_quality", "best")
        bitrate = job.get("target_bitrate", "320")

        opts: Dict[str, Any] = {
            'outtmpl': os.path.join(self.output_dir, '%(title).150B [%(id)s].%(ext)s'),
            'windowsfilenames': True,
            'noplaylist': True,
            'quiet': True,
            'no_warnings': True,
            'ignoreerrors': False,
            'remote_components': {'ejs:github'},
            'extractor_args': {
                'youtube': {
                    'player_client': ['tv', 'android', 'web'],
                    'player_skip': ['webpage', 'configs']
                }
            },
            'progress_hooks': [progress_hook],
        }

        loc = ffmpeg_dir or ffmpeg_bin
        if loc:
            opts['ffmpeg_location'] = loc

        node_path = self.extractor.node_path
        if node_path:
            opts['js_runtimes'] = {'node': {'path': node_path}}
        else:
            opts['js_runtimes'] = {'node': {}}

        # Check for cookies file to bypass bot challenges
        cookie_path = os.getenv("YTDLP_COOKIES_PATH") or os.getenv("COOKIE_FILE")
        if not cookie_path:
            candidates = [
                os.path.abspath("cookies.txt"),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "cookies.txt")),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "cookies.txt")),
            ]
            for cand in candidates:
                if os.path.isfile(cand):
                    cookie_path = cand
                    break
        if cookie_path and os.path.isfile(cookie_path):
            opts['cookiefile'] = cookie_path

        postprocessors = []

        if media_type == "audio":
            opts['format'] = 'bestaudio/best'
            standard_audio = ["mp3", "m4a", "flac", "wav", "opus", "ogg", "aac"]
            intermediate_fmt = target_fmt if target_fmt in standard_audio else "wav"

            postprocessors.append({
                'key': 'FFmpegExtractAudio',
                'preferredcodec': intermediate_fmt,
                'preferredquality': bitrate,
            })

            # Embed thumbnail only if ffprobe is present and supported format
            if job.get("embed_thumbnail") and has_ffprobe and target_fmt in ["mp3", "m4a", "flac"]:
                opts['writethumbnail'] = True
                postprocessors.append({'key': 'EmbedThumbnail'})

            opts['postprocessors'] = postprocessors

            with yt_dlp.YoutubeDL(opts) as ydl:
                down_info = ydl.extract_info(job["url"], download=True)
                prep_file = ydl.prepare_filename(down_info)
                base, _ = os.path.splitext(prep_file)
                expected_file = f"{base}.{intermediate_fmt}"
                res_file = expected_file if os.path.exists(expected_file) else prep_file

                if intermediate_fmt != target_fmt:
                    res_file = self.converter.transcode_audio(res_file, target_fmt, bitrate=bitrate)
                return res_file

        else:  # Video or GIF
            is_gif = (target_fmt == "gif")
            if quality.lower() in ["best", "highest", "max", "auto"]:
                format_spec = "bestvideo+bestaudio/best"
            else:
                h = int(re.sub(r'\D', '', quality)) if re.search(r'\d+', quality) else 1080
                format_spec = f"bestvideo[height<={h}]+bestaudio/best[height<={h}]/best"

            opts['format'] = format_spec
            merge_fmt = "mp4" if is_gif else (target_fmt if target_fmt in ["mp4", "mkv", "webm"] else "mp4")
            opts['merge_output_format'] = merge_fmt

            if job.get("embed_thumbnail") and has_ffprobe and not is_gif:
                opts['writethumbnail'] = True
                postprocessors.append({'key': 'EmbedThumbnail'})

            if job.get("embed_subtitles") and ffmpeg_bin and not is_gif:
                opts['writesubtitles'] = True
                opts['writeautomaticsub'] = True
                opts['subtitleslangs'] = job.get("subtitle_langs", ["en"])
                postprocessors.append({'key': 'FFmpegEmbedSubtitle'})

            if target_fmt in ["avi", "mov", "flv", "wmv", "3gp", "ts"] and ffmpeg_bin:
                postprocessors.append({
                    'key': 'FFmpegVideoConvertor',
                    'preferedformat': target_fmt,
                })

            if postprocessors:
                opts['postprocessors'] = postprocessors

            with yt_dlp.YoutubeDL(opts) as ydl:
                down_info = ydl.extract_info(job["url"], download=True)
                prep_file = ydl.prepare_filename(down_info)
                if os.path.exists(prep_file):
                    final_file = prep_file
                else:
                    base, _ = os.path.splitext(prep_file)
                    potential = f"{base}.{merge_fmt}"
                    final_file = potential if os.path.exists(potential) else prep_file

                if is_gif:
                    job["status"] = "converting"
                    self.notify_job_update(job)
                    final_file = self.converter.video_to_gif(
                        final_file,
                        fps=job.get("fps") or 15,
                        scale_width=job.get("scale_width") or 480,
                        start_time=job.get("start_time"),
                        duration=job.get("duration"),
                        speed=job.get("speed") or 1.0
                    )
                elif media_type == "image":
                    job["status"] = "converting"
                    self.notify_job_update(job)
                    final_file = self.converter.extract_frame_image(
                        final_file,
                        target_format=target_fmt if target_fmt in ["jpg", "png", "webp"] else "jpg",
                        timestamp=job.get("start_time") or 1.0
                    )
                return final_file


queue_manager = QueueManager()
