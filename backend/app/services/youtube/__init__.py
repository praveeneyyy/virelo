"""
VIRELO YouTube Service Package.
High-reliability modular integration for YouTube stream discovery, dynamic format parsing,
audio transcoding, FFmpeg track merging, and cloud-IP restriction resiliency.
"""

from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    YouTubeError,
    classify_youtube_error,
    CLOUD_RESTRICTION_MESSAGE,
)
from backend.app.services.youtube.url_parser import (
    is_youtube_url,
    normalize_youtube_url,
    extract_video_id,
)
from backend.app.services.youtube.formats import (
    parse_and_sort_formats,
    extract_available_qualities,
    build_video_format_spec,
    build_audio_format_spec,
)
from backend.app.services.youtube.metadata import (
    format_youtube_metadata,
)
from backend.app.services.youtube.circuit_breaker import (
    circuit_breaker,
    YouTubeCircuitBreaker,
)
from backend.app.services.youtube.health import (
    check_youtube_health,
)
from backend.app.services.youtube.service import (
    YouTubeService,
    youtube_service,
)

__all__ = [
    "YouTubeService",
    "youtube_service",
    "YouTubeError",
    "YouTubeErrorCode",
    "classify_youtube_error",
    "CLOUD_RESTRICTION_MESSAGE",
    "is_youtube_url",
    "normalize_youtube_url",
    "extract_video_id",
    "parse_and_sort_formats",
    "extract_available_qualities",
    "build_video_format_spec",
    "build_audio_format_spec",
    "format_youtube_metadata",
    "circuit_breaker",
    "YouTubeCircuitBreaker",
    "check_youtube_health",
]

