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
        Seamlessly falls back to distributed residential worker if cloud datacenter IP encounters restrictions.
        """
        url = job["url"].strip()
        media_type = job.get("media_type", "video").lower()
        target_format = job.get("target_format", "mp4").lower()
        quality = job.get("target_quality", "best")
        bitrate = job.get("target_bitrate", "320")

        try:
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
        except (YouTubeError, Exception) as exc:
            upstream = os.getenv("RESIDENTIAL_WORKER_URL", "https://accordance-learners-transmission-drinking.trycloudflare.com")
            if upstream and upstream.startswith("http") and not os.getenv("IS_RESIDENTIAL_WORKER"):
                print(f"[YouTubeService] Cloud download blocked or failed: {exc}. Delegating to residential worker {upstream}...")
                delegated_file = self._delegate_download_to_residential_worker(job, upstream, progress_hook, cancel_token)
                if delegated_file:
                    return delegated_file
            raise exc

    def _delegate_download_to_residential_worker(
        self,
        job: Dict[str, Any],
        upstream_worker: str,
        progress_hook: Optional[Callable[[Dict[str, Any]], None]],
        cancel_token: Optional[threading.Event]
    ) -> Optional[str]:
        """
        Delegates media download to the residential worker when cloud datacenter IP is blocked.
        Polls worker progress and streams the resulting media file directly to local disk.
        """
        import json
        import urllib.request
        import time

        try:
            payload = {
                "url": job["url"],
                "media_type": job.get("media_type", "video"),
                "format": job.get("target_format") or job.get("format", "mp4"),
                "quality": job.get("target_quality") or job.get("quality", "1080"),
                "custom_filename": job.get("custom_filename"),
                "embed_thumbnail": job.get("embed_thumbnail", True),
                "embed_subtitles": job.get("embed_subtitles", False),
                "subtitle_langs": job.get("subtitle_langs", ["en"]),
                "start_time": job.get("start_time"),
                "duration": job.get("duration"),
                "fps": job.get("fps", 15),
                "scale_width": job.get("scale_width", 480),
                "speed": job.get("speed", 1.0)
            }
            worker_base = upstream_worker.rstrip('/')
            req = urllib.request.Request(
                f"{worker_base}/api/download",
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json", "User-Agent": "VireloCloudCluster/1.0", "X-Virelo-Worker": "residential"}
            )
            with urllib.request.urlopen(req, timeout=15) as resp:
                remote_job = json.loads(resp.read().decode('utf-8'))
                remote_id = remote_job.get("id")

            if not remote_id:
                return None

            start_poll = time.time()
            while time.time() - start_poll < 600:
                if cancel_token and cancel_token.is_set():
                    try:
                        c_req = urllib.request.Request(f"{worker_base}/api/download/{remote_id}/cancel", data=b'', headers={"User-Agent": "VireloCloudCluster/1.0"})
                        urllib.request.urlopen(c_req, timeout=5)
                    except Exception:
                        pass
                    raise InterruptedError("Download cancelled by user.")

                time.sleep(0.7)
                poll_req = urllib.request.Request(
                    f"{worker_base}/api/download/{remote_id}",
                    headers={"User-Agent": "VireloCloudCluster/1.0"}
                )
                with urllib.request.urlopen(poll_req, timeout=10) as p_resp:
                    poll_data = json.loads(p_resp.read().decode('utf-8'))

                status = poll_data.get("status")
                if progress_hook:
                    progress_hook({
                        "status": "downloading" if status in ("downloading", "converting", "queued") else status,
                        "downloaded_bytes": int(poll_data.get("progress", 0) * 1024 * 1024),
                        "total_bytes": 100 * 1024 * 1024,
                        "_percent_str": f"{poll_data.get('progress', 0):.1f}%",
                        "_speed_str": poll_data.get("speed_str", ""),
                        "_eta_str": poll_data.get("eta_str", ""),
                    })

                if status == "completed":
                    file_name = poll_data.get("file_name") or f"media_{remote_id}.mp4"
                    local_dest = os.path.join(self.output_dir, file_name)
                    file_url = f"{worker_base}/api/download/{remote_id}/file"

                    file_req = urllib.request.Request(file_url, headers={"User-Agent": "VireloCloudCluster/1.0"})
                    with urllib.request.urlopen(file_req, timeout=120) as f_resp:
                        with open(local_dest, "wb") as out_f:
                            while True:
                                chunk = f_resp.read(262144)
                                if not chunk:
                                    break
                                out_f.write(chunk)

                    if os.path.exists(local_dest) and os.path.getsize(local_dest) > 0:
                        return local_dest

                elif status == "failed":
                    raise YouTubeError(
                        YouTubeErrorCode.YOUTUBE_DOWNLOAD_FAILED,
                        poll_data.get("error") or "Residential download node encountered an error."
                    )

            return None
        except Exception as exc:
            print(f"[Residential Worker Download Fallback] Error: {exc}")
            return None

    def get_health(self) -> Dict[str, Any]:
        """Returns YouTube subsystem health."""
        return check_youtube_health()


# Global YouTube service instance
youtube_service = YouTubeService()

