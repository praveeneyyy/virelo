"""
Pydantic schemas for VIRELO API contracts.
"""
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field


class ExtractRequest(BaseModel):
    url: str = Field(..., description="Target media or direct file URL to analyze")


class MediaFormatInfo(BaseModel):
    format_id: str
    ext: str
    resolution: Optional[str] = None
    filesize: Optional[int] = None
    filesize_str: Optional[str] = None
    vcodec: Optional[str] = None
    acodec: Optional[str] = None
    fps: Optional[float] = None
    tbr: Optional[float] = None


class ExtractResponse(BaseModel):
    success: bool
    url: str
    platform: str
    title: str
    uploader: Optional[str] = None
    thumbnail: Optional[str] = None
    duration: Optional[str] = None
    duration_seconds: Optional[Union[int, float]] = None
    file_size_str: Optional[str] = None
    is_direct_file: bool = False
    media_type: str  # video, audio, image, file
    available_qualities: List[int] = []
    available_formats: List[str] = []
    formats: List[MediaFormatInfo] = []
    subtitles: List[str] = []
    is_playlist: bool = False
    playlist_count: int = 0


class DownloadRequest(BaseModel):
    url: str
    media_type: str = "video"  # video, audio, image, gif, file
    format: str = "mp4"
    quality: str = "best"      # best, 2160, 1440, 1080, 720, 480, 360
    bitrate: str = "320"       # 320, 256, 192, 128, 64
    embed_thumbnail: bool = True
    embed_subtitles: bool = False
    subtitle_langs: List[str] = ["en"]
    title: Optional[str] = None
    custom_filename: Optional[str] = None
    # GIF / Clip and Image Frame Extraction Tuning Controls
    start_time: Optional[float] = None     # Start time in seconds (e.g. 10.5)
    duration: Optional[float] = None       # Clip duration in seconds (e.g. 5.0)
    fps: Optional[int] = 15                # 10, 15, 24, 30 fps
    scale_width: Optional[int] = 480       # 320, 480, 640, 720 px
    speed: Optional[float] = 1.0           # 0.5, 1.0, 1.5, 2.0x


class ConvertRequest(BaseModel):
    input_file_path: str
    target_format: str
    target_quality: Optional[str] = None
    target_bitrate: Optional[str] = None


class JobStatus(BaseModel):
    id: str
    url: str
    title: Optional[str] = None
    platform: str
    media_type: str
    target_format: str
    target_quality: Optional[str] = None
    target_bitrate: Optional[str] = None
    thumbnail: Optional[str] = None
    status: str  # queued, downloading, converting, completed, failed, cancelled, paused
    progress: float = 0.0
    speed_str: str = "0 B/s"
    eta_str: str = "--"
    downloaded_bytes: int = 0
    total_bytes: int = 0
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    file_size_str: Optional[str] = None
    download_url: Optional[str] = None
    error: Optional[str] = None
    created_at: float
    completed_at: Optional[float] = None

    class Config:
        extra = "ignore"


class SettingsUpdate(BaseModel):
    max_concurrent_downloads: Optional[int] = None
    default_video_quality: Optional[str] = None
    default_video_format: Optional[str] = None
    default_audio_format: Optional[str] = None
    default_audio_bitrate: Optional[str] = None
    auto_embed_thumbnail: Optional[bool] = None
    auto_embed_subtitles: Optional[bool] = None
    auto_cleanup_failed_hours: Optional[int] = None


class HealthResponse(BaseModel):
    status: str
    app_version: str
    ffmpeg_available: bool
    ffmpeg_path: Optional[str] = None
    ffprobe_available: bool
    ffprobe_path: Optional[str] = None
    node_available: bool
    node_path: Optional[str] = None
    js_runtime: Optional[str] = None
    js_runtime_path: Optional[str] = None
    pot_provider_available: bool = True
    server_cookies_active: bool = False
    server_proxy_active: bool = False
    disk_free_gb: float
    active_jobs: int
    queue_length: int
    downloads_dir: str


class CookieStatusResponse(BaseModel):
    has_cookies: bool
    file_path: Optional[str] = None
    file_size_bytes: int = 0
    line_count: int = 0
    last_modified: Optional[float] = None
    message: str


class CookieUpdateRequest(BaseModel):
    content: str

