"""
VIRELO YouTube Service - URL Parser & Normalizer.
Detects, parses, and normalizes YouTube URLs across standard, mobile, shorts, music, and embed variants.
"""
import re
import urllib.parse
from typing import Optional, Tuple, Dict, Any


# 11-character YouTube video ID regex
YOUTUBE_ID_REGEX = re.compile(r'^[a-zA-Z0-9_-]{11}$')

YOUTUBE_DOMAINS = {
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
    'youtu.be',
    'www.youtu.be',
}


def is_youtube_url(url: str) -> bool:
    """Checks whether the given URL belongs to YouTube."""
    if not url or not isinstance(url, str):
        return False
    try:
        parsed = urllib.parse.urlparse(url.strip())
        netloc = parsed.netloc.lower()
        # Remove port if present
        if ':' in netloc:
            netloc = netloc.split(':')[0]
        return any(netloc == d or netloc.endswith('.' + d) for d in YOUTUBE_DOMAINS)
    except Exception:
        return False


def extract_video_id(url: str) -> Optional[str]:
    """
    Extracts canonical 11-character video ID from any YouTube URL.
    Supports:
      - https://www.youtube.com/watch?v=dQw4w9WgXcQ
      - https://youtu.be/dQw4w9WgXcQ
      - https://www.youtube.com/shorts/dQw4w9WgXcQ
      - https://www.youtube.com/embed/dQw4w9WgXcQ
      - https://www.youtube.com/v/dQw4w9WgXcQ
      - https://www.youtube.com/live/dQw4w9WgXcQ
      - https://music.youtube.com/watch?v=dQw4w9WgXcQ
    """
    if not url or not isinstance(url, str):
        return None

    cleaned = url.strip()

    # If raw 11-char ID is passed directly
    if YOUTUBE_ID_REGEX.match(cleaned):
        return cleaned

    try:
        parsed = urllib.parse.urlparse(cleaned)
        netloc = parsed.netloc.lower()
        if ':' in netloc:
            netloc = netloc.split(':')[0]

        # youtu.be/<id>
        if 'youtu.be' in netloc:
            path_parts = parsed.path.strip('/').split('/')
            if path_parts and YOUTUBE_ID_REGEX.match(path_parts[0]):
                return path_parts[0]

        # /watch?v=<id>
        if 'watch' in parsed.path:
            qs = urllib.parse.parse_qs(parsed.query)
            if 'v' in qs and qs['v'] and YOUTUBE_ID_REGEX.match(qs['v'][0]):
                return qs['v'][0]

        # /shorts/<id>, /embed/<id>, /v/<id>, /live/<id>
        path_match = re.search(r'/(?:shorts|embed|v|live)/([a-zA-Z0-9_-]{11})', parsed.path)
        if path_match:
            return path_match.group(1)

    except Exception:
        pass

    return None


def normalize_youtube_url(url: str) -> str:
    """
    Converts any valid YouTube URL to standard canonical desktop URL:
    https://www.youtube.com/watch?v=<id>
    Preserves playlists if no specific video ID is present.
    """
    vid = extract_video_id(url)
    if vid:
        return f"https://www.youtube.com/watch?v={vid}"

    # Check for playlist-only URL
    try:
        parsed = urllib.parse.urlparse(url.strip())
        qs = urllib.parse.parse_qs(parsed.query)
        if 'list' in qs and qs['list']:
            return f"https://www.youtube.com/playlist?list={qs['list'][0]}"
    except Exception:
        pass

    return url.strip()
