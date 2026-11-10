"""
VIRELO YouTube Service - Error Taxonomy & Classification.
Defines the strict 14-category error taxonomy for all YouTube operations.
Guarantees clean, secure user-facing messages without leaking server paths or secrets.
"""
from enum import Enum
from typing import Tuple, List, Optional
import re


class YouTubeErrorCode(str, Enum):
    CLOUD_IP_RESTRICTED = "YOUTUBE_CLOUD_IP_RESTRICTED"
    INVALID_URL = "YOUTUBE_INVALID_URL"
    VIDEO_UNAVAILABLE = "YOUTUBE_VIDEO_UNAVAILABLE"
    PRIVATE_VIDEO = "YOUTUBE_PRIVATE_VIDEO"
    AGE_RESTRICTED = "YOUTUBE_AGE_RESTRICTED"
    GEO_RESTRICTED = "YOUTUBE_GEO_RESTRICTED"
    LIVE_STREAM_UNSUPPORTED = "YOUTUBE_LIVE_STREAM_UNSUPPORTED"
    MEMBERS_ONLY = "YOUTUBE_MEMBERS_ONLY"
    PREMIERE_UNPLAYED = "YOUTUBE_PREMIERE_UNPLAYED"
    FORMAT_UNAVAILABLE = "YOUTUBE_FORMAT_UNAVAILABLE"
    RATE_LIMITED = "YOUTUBE_RATE_LIMITED"
    CHALLENGE_REQUIRED = "YOUTUBE_CHALLENGE_REQUIRED"
    DOWNLOAD_FAILED = "YOUTUBE_DOWNLOAD_FAILED"
    AUTHENTICATION_REQUIRED = "YOUTUBE_AUTHENTICATION_REQUIRED"


# Canonical honest notice for hosting environment restrictions
CLOUD_RESTRICTION_MESSAGE = (
    "YouTube is currently restricting automated downloads from our hosting environment. "
    "Your link may be valid, but VIRELO cannot retrieve this media at the moment. "
    "You can try again later or use an available alternative."
)

ERROR_DEFINITIONS = [
    (
        YouTubeErrorCode.CLOUD_IP_RESTRICTED,
        [
            "sign in to confirm you’re not a bot",
            "confirm you're not a bot",
            "automated challenge",
            "bot challenge",
            "cloud ip",
            "datacenter ip",
            "blocked ip",
            "playabilitystatus: login_required",
            "gvs po token",
            "requires a gvs po token",
        ],
        CLOUD_RESTRICTION_MESSAGE
    ),
    (
        YouTubeErrorCode.CHALLENGE_REQUIRED,
        [
            "challenge required",
            "captcha",
            "solve the puzzle",
            "bot detection",
            "recaptcha",
        ],
        CLOUD_RESTRICTION_MESSAGE
    ),
    (
        YouTubeErrorCode.INVALID_URL,
        [
            "is not a valid url",
            "invalid url",
            "incomplete youtube id",
            "unable to extract video id",
        ],
        "The provided link is not a recognized YouTube video, Shorts, or playlist URL."
    ),
    (
        YouTubeErrorCode.PRIVATE_VIDEO,
        [
            "this video is private",
            "private video",
            "sign in if you've been granted access to this video",
        ],
        "This YouTube video is set to Private by its creator and cannot be accessed."
    ),
    (
        YouTubeErrorCode.MEMBERS_ONLY,
        [
            "members-only",
            "join this channel to get access to members-only content",
            "membership required",
        ],
        "This video is exclusive to channel members and requires a paid membership."
    ),
    (
        YouTubeErrorCode.AGE_RESTRICTED,
        [
            "sign in to confirm your age",
            "age-restricted",
            "age verification required",
        ],
        "This video is age-restricted by YouTube and requires account age verification."
    ),
    (
        YouTubeErrorCode.GEO_RESTRICTED,
        [
            "not available in your country",
            "uploader has not made this video available in your country",
            "geoblocked",
            "geo restricted",
        ],
        "This video is geoblocked and not available in the region of our hosting servers."
    ),
    (
        YouTubeErrorCode.LIVE_STREAM_UNSUPPORTED,
        [
            "this live event will begin",
            "live stream recording is not available",
            "is a live stream",
            "live stream",
        ],
        "Live streams currently broadcasting cannot be downloaded until the stream has ended."
    ),
    (
        YouTubeErrorCode.PREMIERE_UNPLAYED,
        [
            "premiere",
            "premieres in",
            "upcoming premiere",
        ],
        "This video is an upcoming YouTube Premiere and has not premiered yet."
    ),
    (
        YouTubeErrorCode.VIDEO_UNAVAILABLE,
        [
            "video unavailable",
            "this video has been removed",
            "this video is no longer available",
            "video has been deleted",
            "account associated with this video has been terminated",
        ],
        "This video is unavailable or has been removed from YouTube."
    ),
    (
        YouTubeErrorCode.RATE_LIMITED,
        [
            "http error 429",
            "429 too many requests",
            "too many requests",
            "rate limit",
        ],
        "YouTube is temporarily rate-limiting requests. Please try again in a few moments."
    ),
    (
        YouTubeErrorCode.FORMAT_UNAVAILABLE,
        [
            "requested format is not available",
            "format is not available",
            "no suitable format found",
        ],
        "The requested video quality or audio format is not available for this stream."
    ),
    (
        YouTubeErrorCode.AUTHENTICATION_REQUIRED,
        [
            "login required",
            "sign in to view this video",
            "requires authentication",
        ],
        "This YouTube content requires user authentication or special permissions."
    ),
    (
        YouTubeErrorCode.DOWNLOAD_FAILED,
        [
            "http error 403",
            "forbidden",
            "connection reset",
            "network is unreachable",
            "ffmpeg failed",
            "transcode failed",
            "disk write error",
        ],
        "Media stream download encountered a network or encoding interruption. Please retry."
    ),
]


class YouTubeError(Exception):
    """Structured YouTube domain exception."""
    def __init__(self, code: YouTubeErrorCode, message: str, raw_error: Optional[str] = None):
        super().__init__(f"[{code.value}] {message}")
        self.code = code
        self.message = message
        self.raw_error = raw_error or ""


def classify_youtube_error(exc_str: str) -> Tuple[YouTubeErrorCode, str]:
    """
    Analyzes raw yt-dlp / HTTP / subprocess exception and maps to canonical 14-code taxonomy.
    """
    clean = exc_str.lower()
    
    for code, triggers, user_msg in ERROR_DEFINITIONS:
        if any(t in clean for t in triggers):
            return code, user_msg

    # Default fallback
    return YouTubeErrorCode.DOWNLOAD_FAILED, (
        "Unable to retrieve YouTube stream metadata. Please verify the URL is public and try again."
    )
