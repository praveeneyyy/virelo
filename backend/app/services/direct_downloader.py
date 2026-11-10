"""
Chunked Direct HTTP Stream Ingest Engine.
Supports large file streaming, HTTP Range resumption, cancellation tokens, and live telemetry.
"""
import os
import time
import urllib.parse
from typing import Optional, Callable, Dict, Any
import requests

from backend.app.core.security import sanitize_filename
from backend.app.utils.formatters import format_bytes


class DirectStreamDownloader:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/131.0.0.0 Safari/537.36'
            ),
            'Accept': '*/*',
        })

    def download(
        self,
        url: str,
        custom_filename: Optional[str] = None,
        progress_callback: Optional[Callable[[Dict[str, Any]], None]] = None,
        is_cancelled: Optional[Callable[[], bool]] = None
    ) -> str:
        """
        Streams remote file to disk in 64KB chunks with real-time speed/ETA metrics.
        """
        # Initial probe
        head = self.session.head(url, allow_redirects=True, timeout=15)
        total_size = int(head.headers.get('Content-Length', 0))

        # Determine target filename
        filename = custom_filename
        if not filename:
            cd = head.headers.get('Content-Disposition', '')
            if 'filename=' in cd:
                filename = cd.split('filename=')[-1].strip('"\' ;')
            if not filename:
                parsed = urllib.parse.urlparse(url)
                filename = os.path.basename(parsed.path) or "downloaded_file"

        safe_name = sanitize_filename(filename)
        output_path = os.path.join(self.output_dir, safe_name)

        # Check existing file for resumption if server supports Range
        resume_byte_pos = 0
        accepts_ranges = 'bytes' in head.headers.get('Accept-Ranges', '').lower()
        if os.path.exists(output_path) and accepts_ranges and total_size > 0:
            resume_byte_pos = os.path.getsize(output_path)
            if resume_byte_pos >= total_size:
                # Already fully downloaded
                if progress_callback:
                    progress_callback({
                        "downloaded_bytes": total_size,
                        "total_bytes": total_size,
                        "percent": 100.0,
                        "speed": 0,
                        "eta": 0,
                        "status": "finished"
                    })
                return output_path

        headers = {}
        mode = "wb"
        if resume_byte_pos > 0 and accepts_ranges:
            headers['Range'] = f"bytes={resume_byte_pos}-"
            mode = "ab"

        response = self.session.get(url, headers=headers, stream=True, allow_redirects=True, timeout=20)
        response.raise_for_status()

        downloaded = resume_byte_pos
        start_time = time.time()
        chunk_size = 64 * 1024

        with open(output_path, mode) as f:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if is_cancelled and is_cancelled():
                    response.close()
                    raise InterruptedError("Download cancelled by user.")

                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    now = time.time()
                    elapsed = max(now - start_time, 0.001)
                    speed = (downloaded - resume_byte_pos) / elapsed
                    eta = int((total_size - downloaded) / speed) if total_size > 0 and speed > 0 else 0
                    pct = round((downloaded / total_size * 100), 1) if total_size > 0 else 0.0

                    if progress_callback:
                        progress_callback({
                            "downloaded_bytes": downloaded,
                            "total_bytes": total_size,
                            "percent": pct,
                            "speed": speed,
                            "eta": eta,
                            "status": "downloading"
                        })

        if progress_callback:
            progress_callback({
                "downloaded_bytes": downloaded,
                "total_bytes": total_size or downloaded,
                "percent": 100.0,
                "speed": 0,
                "eta": 0,
                "status": "finished"
            })

        return output_path
