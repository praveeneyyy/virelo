"""
VIRELO Error Classifier Module.
Maps raw extractor, subprocess, and network exceptions to structured error categories and user-safe messages.
Guarantees no internal server paths, stack traces, or credentials are exposed.
"""
from typing import Tuple, Dict, Any


ERROR_MAPPINGS = [
    (
        "YOUTUBE_JAVASCRIPT_RUNTIME_MISSING",
        ["no supported javascript runtime", "without a js runtime has been deprecated", "js runtime"],
        "JavaScript runtime (Deno/Node.js) is required for YouTube player challenge execution but was not detected."
    ),
    (
        "YOUTUBE_PO_TOKEN_UNAVAILABLE",
        ["gvs po token", "visitor data", "requires a gvs po token", "po_token"],
        "YouTube Proof of Origin (PO) token verification is required for this client stream."
    ),
    (
        "YOUTUBE_CHALLENGE_REQUIRED",
        ["sign in to confirm you’re not a bot", "confirm you're not a bot", "automated challenge", "bot challenge"],
        "YouTube has restricted automated stream extraction for this media from cloud hosting IP ranges (Render/AWS). Public non-restricted videos remain accessible."
    ),
    (
        "YOUTUBE_RATE_LIMITED",
        ["429", "too many requests", "rate limit"],
        "YouTube has temporarily rate-limited requests from this server IP. Please wait a few moments before trying again."
    ),
    (
        "YOUTUBE_AUTHENTICATION_REQUIRED",
        ["private video", "sign in if you've been granted access", "members-only", "join this channel", "login-required"],
        "This video requires account authentication, channel membership, or permission. Private content cannot be downloaded."
    ),
    (
        "YOUTUBE_VIDEO_UNAVAILABLE",
        ["video unavailable", "video is unavailable", "this video has been removed", "has been terminated", "is not available in your country"],
        "This video is unavailable, geoblocked, or has been removed from YouTube."
    ),
    (
        "YOUTUBE_FORMAT_UNAVAILABLE",
        ["requested format is not available", "format is not available"],
        "The requested resolution or format is not available from the source media server."
    ),
    (
        "YOUTUBE_IP_RESTRICTED",
        ["http error 403", "forbidden", "access denied"],
        "YouTube CDN returned an HTTP 403 Forbidden response. This IP may have restricted access to this stream."
    )
]


def classify_youtube_error(exc_str: str) -> Tuple[str, str]:
    """
    Analyzes raw error string and returns (error_code, clean_user_message).
    """
    lowered = exc_str.lower()
    
    for code, triggers, message in ERROR_MAPPINGS:
        if any(t in lowered for t in triggers):
            return code, message
            
    return "YOUTUBE_EXTRACTION_FAILED", "Unable to extract media metadata from YouTube. Please verify the link is public and active."
