"""
VIRELO Error Classifier Module.
Routes to YouTube error taxonomy for YouTube URLs and provides unified error categorization.
Guarantees no internal server paths, stack traces, or credentials are exposed.
"""
from typing import Tuple
from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    classify_youtube_error as classify_yt_err,
    ERROR_DEFINITIONS
)


def classify_youtube_error(exc_str: str) -> Tuple[str, str]:
    """
    Analyzes raw error string and returns (error_code_str, clean_user_message).
    Maintains compatibility with all callers expecting string error codes.
    """
    code, msg = classify_yt_err(exc_str)
    return code.value if isinstance(code, YouTubeErrorCode) else str(code), msg
