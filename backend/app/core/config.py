"""
VIRELO Core Configuration
"""
import os
from pathlib import Path
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DOWNLOADS_DIR = os.path.abspath(os.path.join(BASE_DIR, "downloads"))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, "data"))
os.makedirs(DOWNLOADS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)


class Settings(BaseModel):
    APP_NAME: str = "VIRELO"
    VERSION: str = "2.4.0"
    API_PREFIX: str = "/api"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Storage (Preserve existing DB if present)
    DOWNLOADS_PATH: str = os.getenv("DOWNLOADS_PATH", DOWNLOADS_DIR)
    DB_PATH: str = os.getenv(
        "DB_PATH", 
        os.path.join(DATA_DIR, "omnidownloader.db") if os.path.exists(os.path.join(DATA_DIR, "omnidownloader.db")) 
        else os.path.join(DATA_DIR, "virelo.db")
    )
    
    # Concurrency and limits
    MAX_CONCURRENT_DOWNLOADS: int = int(os.getenv("MAX_CONCURRENT_DOWNLOADS", "3"))
    MAX_FILE_SIZE_BYTES: int = 20 * 1024 * 1024 * 1024  # 20 GB default limit
    REQUEST_TIMEOUT_SECONDS: int = 30
    
    # Defaults
    DEFAULT_VIDEO_QUALITY: str = "best"
    DEFAULT_VIDEO_FORMAT: str = "mp4"
    DEFAULT_AUDIO_FORMAT: str = "mp3"
    DEFAULT_AUDIO_BITRATE: str = "320"
    AUTO_EMBED_THUMBNAIL: bool = True
    AUTO_EMBED_SUBTITLES: bool = False
    AUTO_CLEANUP_FAILED_HOURS: int = 24
    FILE_RETENTION_MINUTES: int = int(os.getenv("FILE_RETENTION_MINUTES", "10"))  # Ephemeral storage: uncollected temporary scratch purged after 10 min
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]


settings = Settings()
