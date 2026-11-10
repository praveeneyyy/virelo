"""
VIRELO YouTube Service - Metadata Parser.
Transforms raw yt-dlp extracted dictionaries into structured, validated domain contracts.
"""
from typing import Dict, Any, List, Optional
from backend.app.utils.formatters import format_seconds, format_bytes
from backend.app.services.youtube.formats import parse_and_sort_formats, extract_available_qualities


def select_best_thumbnail(raw_thumbnails: List[Dict[str, Any]], video_id: Optional[str] = None) -> Optional[str]:
    """
    Selects the highest resolution thumbnail available, falling back to YouTube maxresdefault.
    """
    if raw_thumbnails and isinstance(raw_thumbnails, list):
        sorted_thumbs = sorted(
            [t for t in raw_thumbnails if isinstance(t, dict) and t.get('url')],
            key=lambda x: (x.get('preference', 0), (x.get('width') or 0) * (x.get('height') or 0)),
            reverse=True
        )
        if sorted_thumbs:
            return sorted_thumbs[0]['url']

    if video_id:
        return f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"

    return None


def format_youtube_metadata(raw_info: Dict[str, Any], original_url: str) -> Dict[str, Any]:
    """
    Normalizes yt-dlp video info dictionary into the standard VIRELO response contract.
    """
    video_id = raw_info.get('id')
    title = raw_info.get('title') or "YouTube Video"
    uploader = (
        raw_info.get('uploader') or
        raw_info.get('channel') or
        raw_info.get('creator') or
        "YouTube Creator"
    )

    duration_sec = None
    if raw_info.get('duration') is not None:
        try:
            duration_sec = int(round(float(raw_info['duration'])))
        except (ValueError, TypeError):
            pass

    duration_str = format_seconds(duration_sec) if duration_sec is not None else None

    # Thumbnail resolution
    thumbnail = (
        select_best_thumbnail(raw_info.get('thumbnails', []), video_id) or
        raw_info.get('thumbnail')
    )

    # Formats & Qualities
    raw_formats = raw_info.get('formats') or []
    sorted_formats = parse_and_sort_formats(raw_formats, duration_sec)
    available_qualities = extract_available_qualities(raw_formats)

    # Subtitles
    subs = list((raw_info.get('subtitles') or {}).keys()) + list((raw_info.get('automatic_captions') or {}).keys())
    unique_subs = sorted(list(set(subs)))

    # Filesize estimation
    filesize = raw_info.get('filesize') or raw_info.get('filesize_approx')
    if not filesize and sorted_formats:
        for f in sorted_formats:
            if f.get('filesize'):
                filesize = f['filesize']
                break

    # Playlist info
    is_playlist = raw_info.get('is_playlist', False)
    playlist_count = raw_info.get('playlist_count', 0)
    if 'entries' in raw_info and raw_info['entries']:
        is_playlist = True
        playlist_count = len([e for e in raw_info['entries'] if e])

    return {
        "is_direct_file": False,
        "url": original_url,
        "video_id": video_id,
        "title": title,
        "uploader": uploader,
        "platform": "YouTube",
        "thumbnail": thumbnail,
        "duration": duration_str,
        "duration_seconds": duration_sec,
        "file_size": filesize,
        "file_size_str": format_bytes(filesize) if filesize else None,
        "media_type": "video",
        "available_qualities": available_qualities,
        "available_formats": ["mp4", "mkv", "webm", "mp3", "m4a", "flac", "wav", "opus"],
        "formats": sorted_formats,
        "subtitles": unique_subs,
        "is_playlist": is_playlist,
        "playlist_count": playlist_count,
        "view_count": raw_info.get('view_count'),
        "description": (raw_info.get('description') or '')[:500] if raw_info.get('description') else None,
    }
