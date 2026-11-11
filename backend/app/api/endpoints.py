"""
FastAPI REST API and WebSocket endpoints for VIRELO.
"""
import os
import sys
import subprocess
import shutil
import urllib.parse
import uuid
import time
from typing import List, Dict, Any, Optional
import yt_dlp
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Query, UploadFile, File, Form, Request
from fastapi.responses import FileResponse

from backend.app.core.config import settings
from backend.app.core.security import validate_url, is_safe_path
from backend.app.core.rate_limiter import extract_limiter, download_limiter
from backend.app.core.database import (
    get_all_jobs, get_job, delete_job_db, get_history, clear_history,
    save_setting, get_all_settings, save_job
)
from backend.app.schemas.media import (
    ExtractRequest, ExtractResponse, DownloadRequest, JobStatus,
    ConvertRequest, SettingsUpdate, HealthResponse,
    CookieStatusResponse, CookieUpdateRequest
)
from backend.app.services.extractor import MediaExtractor
from backend.app.services.media_converter import MediaConverter
from backend.app.workers.queue_manager import queue_manager, ws_manager
from backend.app.utils.ffmpeg import get_ffmpeg_info, get_js_runtime_info
from backend.app.utils.formatters import get_disk_free_gb, clean_ansi, format_bytes
from backend.app.utils.runtime_config import ensure_server_cookies, get_server_proxy

router = APIRouter()
extractor = MediaExtractor()
converter = MediaConverter()


# -----------------------------------------------------------------------------
# 1. Extraction Endpoint
# -----------------------------------------------------------------------------
@router.post("/extract", response_model=ExtractResponse)
def extract_media_info(req: ExtractRequest, request: Request):
    """
    Validates URL and extracts available resolutions, formats, and metadata.
    Enforces IP-based rate limiting to protect upstream streaming servers.
    """
    extract_limiter.check(request)
    valid, res = validate_url(req.url)
    if not valid:
        raise HTTPException(status_code=400, detail=res)

    try:
        data = extractor.extract_info(req.url)
        return ExtractResponse(
            success=True,
            url=req.url,
            platform=data.get("platform", "Unknown"),
            title=data.get("title", "Untitled"),
            uploader=data.get("uploader"),
            thumbnail=data.get("thumbnail"),
            duration=data.get("duration"),
            duration_seconds=data.get("duration_seconds"),
            file_size_str=data.get("file_size_str"),
            is_direct_file=data.get("is_direct_file", False),
            media_type=data.get("media_type", "video"),
            available_qualities=data.get("available_qualities", []),
            available_formats=data.get("available_formats", []),
            formats=data.get("formats", []),
            subtitles=data.get("subtitles", []),
            is_playlist=data.get("is_playlist", False),
            playlist_count=data.get("playlist_count", 0),
            restriction_notice=data.get("restriction_notice"),
            restriction_code=data.get("restriction_code"),
        )
    except Exception as e:
        clean_msg = clean_ansi(str(e))
        raise HTTPException(status_code=400, detail=clean_msg or "Failed to inspect media URL.")


# -----------------------------------------------------------------------------
# 2. Download Ingestion & Queue Endpoints
# -----------------------------------------------------------------------------
@router.post("/download", response_model=JobStatus)
def enqueue_download(req: DownloadRequest, request: Request):
    """
    Enqueues a new media or file download job into the queue.
    Enforces IP-based rate limiting to prevent queue flooding and worker exhaustion.
    """
    download_limiter.check(request)
    valid, res = validate_url(req.url)
    if not valid:
        raise HTTPException(status_code=400, detail=res)

    job = queue_manager.enqueue_job(req.model_dump())
    return JobStatus(**job)


@router.get("/download/{job_id}", response_model=JobStatus)
def get_download_job(job_id: str):
    """
    Retrieves real-time status, progress, speed, and ETA of a specific job.
    """
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Download job not found.")
    return JobStatus(**job)


@router.get("/download/{job_id}/file")
def serve_download_file(job_id: str):
    """
    Streams downloaded/transcoded media file to client browser with Content-Disposition.
    Automatically guards against expired files (purged after 30 minutes).
    """
    job = get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=410,
            detail=f"This download link has expired. Media links and files are automatically purged from the database after {settings.FILE_RETENTION_MINUTES} minutes."
        )

    file_path = job.get("file_path")
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(
            status_code=410,
            detail=f"The requested media file is no longer available. Files are automatically deleted from storage after {settings.FILE_RETENTION_MINUTES} minutes."
        )

    if not is_safe_path(file_path, settings.DOWNLOADS_PATH):
        raise HTTPException(status_code=403, detail="File path violation.")

    filename = job.get("file_name") or os.path.basename(file_path)
    encoded_filename = urllib.parse.quote(filename)
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"; filename*=UTF-8\'\'{encoded_filename}'
    }
    return FileResponse(
        path=file_path,
        filename=filename,
        headers=headers,
        media_type="application/octet-stream"
    )


@router.post("/open-downloads-folder")
def open_local_downloads_folder():
    """
    Opens the local host machine's downloads directory in the native file manager (Explorer / Finder / Files).
    """
    folder = settings.DOWNLOADS_PATH
    os.makedirs(folder, exist_ok=True)
    try:
        if os.name == 'nt':
            os.startfile(folder)
        elif sys.platform == 'darwin':
            subprocess.Popen(['open', folder])
        else:
            subprocess.Popen(['xdg-open', folder])
        return {"success": True, "path": folder}
    except Exception as e:
        return {"success": False, "error": str(e), "path": folder}


@router.delete("/download/{job_id}")
def delete_download_job(job_id: str, delete_file: bool = Query(False)):
    """
    Removes job from database and optionally deletes the file from disk.
    """
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if delete_file and job.get("file_path") and os.path.exists(job["file_path"]):
        if is_safe_path(job["file_path"], settings.DOWNLOADS_PATH):
            try:
                os.remove(job["file_path"])
            except Exception:
                pass

    delete_job_db(job_id)
    return {"success": True, "message": f"Job {job_id} deleted."}


@router.post("/download/{job_id}/cancel")
def cancel_download_job(job_id: str):
    """
    Cancels an active or queued download job.
    """
    success = queue_manager.cancel_job(job_id)
    if not success:
        raise HTTPException(status_code=400, detail="Job could not be cancelled or has already completed.")
    return {"success": True, "message": "Job cancellation dispatched."}


@router.post("/download/{job_id}/retry", response_model=JobStatus)
def retry_download_job(job_id: str):
    """
    Retries a failed or cancelled download job.
    """
    job = queue_manager.retry_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found to retry.")
    return JobStatus(**job)


@router.get("/queue", response_model=List[JobStatus])
def get_current_queue():
    """
    Returns all jobs sorted by submission timestamp.
    """
    jobs = get_all_jobs()
    return [JobStatus(**j) for j in jobs]


# -----------------------------------------------------------------------------
# 3. Transcoding / Conversion Endpoint
# -----------------------------------------------------------------------------
@router.post("/convert")
def convert_existing_file(req: ConvertRequest):
    """
    Explicitly converts an existing file to another format through FFmpeg.
    """
    if not os.path.exists(req.input_file_path):
        raise HTTPException(status_code=404, detail="Target input file not found.")

    if not is_safe_path(req.input_file_path, settings.DOWNLOADS_PATH):
        raise HTTPException(status_code=403, detail="Path access violation.")

    try:
        fmt = req.target_format.lower()
        if fmt in ["mp3", "m4a", "flac", "wav", "opus", "ogg", "aac", "wma", "alac", "aiff"]:
            out = converter.transcode_audio(req.input_file_path, fmt, bitrate=req.target_bitrate or "320")
        elif fmt in ["mp4", "mkv", "webm", "mov", "avi", "ts", "gif"]:
            out = converter.transcode_video(req.input_file_path, fmt, target_quality=req.target_quality)
        elif fmt in ["png", "jpg", "jpeg", "webp", "bmp"]:
            out = converter.convert_image(req.input_file_path, fmt)
        else:
            raise ValueError(f"Unsupported target format: '{fmt}'.")

        return {
            "success": True,
            "output_file": out,
            "filename": os.path.basename(out),
            "file_size": os.path.getsize(out)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=clean_ansi(str(e)))


@router.post("/convert/upload")
async def upload_and_convert(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    target_quality: Optional[str] = Form(None),
    target_bitrate: Optional[str] = Form(None)
):
    """
    Directly converts an uploaded media file (video, audio, image) using FFmpeg.
    """
    job_id = str(uuid.uuid4())
    upload_dir = settings.DOWNLOADS_PATH
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save input file to downloads folder
    original_ext = os.path.splitext(file.filename or "")[1] or ".tmp"
    temp_in = os.path.join(upload_dir, f"upload_{job_id}{original_ext}")
    
    with open(temp_in, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        fmt = target_format.lower()
        if fmt in ["mp3", "m4a", "flac", "wav", "opus", "ogg", "aac"]:
            out = converter.transcode_audio(temp_in, fmt, bitrate=target_bitrate or "320")
            media_type = "audio"
        elif fmt in ["mp4", "mkv", "webm", "mov", "avi", "gif"]:
            out = converter.transcode_video(temp_in, fmt, target_quality=target_quality or "1080")
            media_type = "video" if fmt != "gif" else "gif"
        elif fmt in ["png", "jpg", "jpeg", "webp", "bmp"]:
            out = converter.convert_image(temp_in, fmt)
            media_type = "image"
        else:
            raise ValueError(f"Unsupported conversion format: {fmt}")
            
        file_size = os.path.getsize(out)
        file_name = os.path.basename(out)
        size_str = format_bytes(file_size)
        
        # Register in database so /api/download/{job_id}/file can serve it with 30-min retention
        now = time.time()
        save_job({
            "id": job_id,
            "url": f"upload://{file.filename}",
            "title": file.filename or "Converted Media",
            "platform": "Media Converter",
            "media_type": media_type,
            "target_format": fmt,
            "target_quality": target_quality or "original",
            "target_bitrate": target_bitrate or "320",
            "thumbnail": None,
            "status": "completed",
            "progress": 100.0,
            "speed_str": "Completed",
            "eta_str": "0s",
            "downloaded_bytes": file_size,
            "total_bytes": file_size,
            "file_path": out,
            "file_name": file_name,
            "file_size_str": size_str,
            "error": None,
            "created_at": now,
            "updated_at": now,
            "completed_at": now
        })
        
        # Clean up the raw upload input file if it was converted into a different output file
        if temp_in != out and os.path.exists(temp_in):
            try:
                os.remove(temp_in)
            except Exception:
                pass
                
        return {
            "success": True,
            "job_id": job_id,
            "download_url": f"/api/download/{job_id}/file",
            "filename": file_name,
            "file_size_str": size_str
        }
    except Exception as e:
        if os.path.exists(temp_in):
            try:
                os.remove(temp_in)
            except Exception:
                pass
        raise HTTPException(status_code=400, detail=clean_ansi(str(e)))


# -----------------------------------------------------------------------------
# 4. History Endpoints
# -----------------------------------------------------------------------------
@router.get("/history")
def fetch_history(limit: int = 100):
    """
    Returns persistent historical download log.
    """
    return get_history(limit=limit)


@router.delete("/history")
def remove_history():
    """
    Clears historical download records.
    """
    clear_history()
    return {"success": True, "message": "History cleared."}


# -----------------------------------------------------------------------------
# 5. Platforms Directory Endpoint
# -----------------------------------------------------------------------------
@router.get("/platforms")
def get_supported_platforms():
    """
    Returns supported extraction integrations and URL patterns.
    """
    return {
        "total_supported": "1,700+",
        "popular": MediaExtractor.get_supported_platforms_list()
    }


# -----------------------------------------------------------------------------
# 6. Settings Endpoints
# -----------------------------------------------------------------------------
@router.get("/settings")
def get_settings():
    """
    Returns current active system and user configuration.
    """
    user_settings = get_all_settings()
    return {
        "downloads_path": settings.DOWNLOADS_PATH,
        "max_concurrent_downloads": user_settings.get("max_concurrent_downloads", settings.MAX_CONCURRENT_DOWNLOADS),
        "default_video_quality": user_settings.get("default_video_quality", settings.DEFAULT_VIDEO_QUALITY),
        "default_video_format": user_settings.get("default_video_format", settings.DEFAULT_VIDEO_FORMAT),
        "default_audio_format": user_settings.get("default_audio_format", settings.DEFAULT_AUDIO_FORMAT),
        "default_audio_bitrate": user_settings.get("default_audio_bitrate", settings.DEFAULT_AUDIO_BITRATE),
        "auto_embed_thumbnail": user_settings.get("auto_embed_thumbnail", settings.AUTO_EMBED_THUMBNAIL),
        "auto_embed_subtitles": user_settings.get("auto_embed_subtitles", settings.AUTO_EMBED_SUBTITLES),
        "auto_cleanup_failed_hours": user_settings.get("auto_cleanup_failed_hours", settings.AUTO_CLEANUP_FAILED_HOURS),
    }


@router.post("/settings")
def update_settings(update: SettingsUpdate):
    """
    Saves user preferences into persistent SQLite settings.
    """
    d = update.model_dump(exclude_none=True)
    for k, v in d.items():
        save_setting(k, v)
    return {"success": True, "settings": get_settings()}


# -----------------------------------------------------------------------------
# 7. Health & System Diagnostics
# -----------------------------------------------------------------------------
@router.get("/health", response_model=HealthResponse)
def get_system_health():
    """
    Comprehensive diagnostics reporting FFmpeg, FFprobe, Node/Deno JS runtime, disk space, and active jobs.
    """
    f_info = get_ffmpeg_info()
    js_info = get_js_runtime_info()
    node_path = shutil.which("node") or (js_info.get("path") if js_info.get("runtime") == "node" else None)
    jobs = get_all_jobs()
    active = sum(1 for j in jobs if j.get("status") in ("downloading", "converting"))
    queued = sum(1 for j in jobs if j.get("status") == "queued")

    pot_available = False
    try:
        import yt_dlp_plugins.extractor.getpot_bgutil  # noqa: F401
        pot_available = True
    except ImportError:
        pass

    cookie_file = ensure_server_cookies()
    has_server_cookies = bool(cookie_file and os.path.isfile(cookie_file))
    has_server_proxy = bool(get_server_proxy())

    return HealthResponse(
        status="healthy",
        app_version=settings.VERSION,
        ytdlp_version=yt_dlp.version.__version__,
        ffmpeg_available=bool(f_info.get("ffmpeg")),
        ffmpeg_path=f_info.get("ffmpeg"),
        ffprobe_available=bool(f_info.get("ffprobe")),
        ffprobe_path=f_info.get("ffprobe"),
        node_available=bool(node_path or js_info.get("available")),
        node_path=node_path or js_info.get("path"),
        js_runtime=js_info.get("runtime"),
        js_runtime_path=js_info.get("path"),
        pot_provider_available=pot_available,
        server_cookies_active=has_server_cookies,
        server_proxy_active=has_server_proxy,
        disk_free_gb=get_disk_free_gb(settings.DOWNLOADS_PATH),
        active_jobs=active,
        queue_length=queued,
        downloads_dir=settings.DOWNLOADS_PATH,
    )


@router.get("/diagnose_yt")
def diagnose_youtube(url: str = "https://www.youtube.com/watch?v=_ju1xmmTjf8"):
    """Internal diagnostic endpoint returning exact yt-dlp logs and exception."""
    from backend.app.services.youtube.formats import YOUTUBE_PRIMARY_CLIENTS
    from backend.app.utils.runtime_config import apply_runtime_ytdlp_opts

    opts = {
        'quiet': False,
        'skip_download': True,
        'extractor_args': {'youtube': {'player_client': YOUTUBE_PRIMARY_CLIENTS}}
    }
    opts = apply_runtime_ytdlp_opts(opts)
    logs = []

    class DiagnosticLogger:
        def debug(self, msg): logs.append(f"[debug] {msg}")
        def info(self, msg): logs.append(f"[info] {msg}")
        def warning(self, msg): logs.append(f"[warning] {msg}")
        def error(self, msg): logs.append(f"[error] {msg}")

    opts['logger'] = DiagnosticLogger()

    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "success": True,
                "title": info.get("title"),
                "formats": len(info.get("formats", [])),
                "logs": logs[-30:]
            }
    except Exception as e:
        return {
            "success": False,
            "error_type": str(type(e)),
            "error_str": str(e),
            "logs": logs[-30:]
        }


# -----------------------------------------------------------------------------
# 8. WebSocket for Real-Time Progress Stream
# -----------------------------------------------------------------------------
@router.websocket("/ws/downloads")
async def websocket_downloads_endpoint(websocket: WebSocket):
    """
    WebSocket channel for instant telemetry updates (progress, speed, ETA, status).
    """
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep-alive ping/pong
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception:
        await ws_manager.disconnect(websocket)


# -----------------------------------------------------------------------------
# 9. Cookie Management Endpoints (Bypass YouTube Bot Check)
# -----------------------------------------------------------------------------
COOKIES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "cookies.txt"))

@router.get("/cookies", response_model=CookieStatusResponse)
def get_cookie_status():
    """Returns whether cookies.txt exists and how many entries it has."""
    if os.path.isfile(COOKIES_FILE):
        size = os.path.getsize(COOKIES_FILE)
        mtime = os.path.getmtime(COOKIES_FILE)
        line_count = 0
        try:
            with open(COOKIES_FILE, "r", encoding="utf-8", errors="ignore") as f:
                lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
                line_count = len(lines)
        except Exception:
            pass
        return CookieStatusResponse(
            has_cookies=True,
            file_path=COOKIES_FILE,
            file_size_bytes=size,
            line_count=line_count,
            last_modified=mtime,
            message=f"Active cookies.txt loaded ({line_count} records, {format_bytes(size)})"
        )
    return CookieStatusResponse(
        has_cookies=False,
        message="No cookies.txt loaded. YouTube bot challenges may require cookies."
    )


@router.post("/cookies/upload", response_model=CookieStatusResponse)
async def upload_cookie_file(file: UploadFile = File(...)):
    """Upload Netscape-format cookies.txt file directly."""
    os.makedirs(os.path.dirname(COOKIES_FILE), exist_ok=True)
    content = await file.read()
    with open(COOKIES_FILE, "wb") as f:
        f.write(content)
    return get_cookie_status()


@router.post("/cookies/text", response_model=CookieStatusResponse)
def save_cookie_text(payload: CookieUpdateRequest):
    """Save raw pasted Netscape cookie string."""
    os.makedirs(os.path.dirname(COOKIES_FILE), exist_ok=True)
    text = payload.content.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Cookie text cannot be empty.")
    with open(COOKIES_FILE, "w", encoding="utf-8") as f:
        f.write(text)
    return get_cookie_status()


@router.delete("/cookies", response_model=CookieStatusResponse)
def delete_cookie_file():
    """Purge cookies.txt file."""
    if os.path.isfile(COOKIES_FILE):
        try:
            os.remove(COOKIES_FILE)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete cookies: {e}")
    return get_cookie_status()

