"""
VIRELO YouTube Service - Dynamic Format Discovery & Classifier.
Parses, filters, and classifies YouTube video and audio streams dynamically.
Never relies on hardcoded YouTube format IDs (e.g. 22, 18, 137).
"""
import re
from typing import Dict, Any, List, Set, Optional
from backend.app.utils.formatters import format_bytes


STANDARD_VIDEO_QUALITIES = [4320, 2160, 1440, 1080, 720, 480, 360, 240, 144]
SUPPORTED_VIDEO_CONTAINERS = ["mp4", "mkv", "webm"]
SUPPORTED_AUDIO_CODECS = ["mp3", "m4a", "flac", "wav", "opus", "ogg", "aac"]


def parse_and_sort_formats(raw_formats: List[Dict[str, Any]], duration_seconds: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    Normalizes raw yt-dlp format dictionaries into a clean, structured list.
    Calculates estimated filesize from bitrate and duration when filesize is None.
    """
    formatted: List[Dict[str, Any]] = []

    for f in (raw_formats or []):
        fid = str(f.get("format_id") or "")
        ext = f.get("ext", "mp4")
        width = f.get("width")
        height = f.get("height")
        vcodec = f.get("vcodec") or "none"
        acodec = f.get("acodec") or "none"
        fps = f.get("fps")
        tbr = f.get("tbr")  # total bitrate in kbps
        vbr = f.get("vbr")
        abr = f.get("abr")

        # Filesize calculation or approximation
        filesize = f.get("filesize") or f.get("filesize_approx")
        if not filesize and duration_seconds and (tbr or vbr or abr):
            bitrate_kbps = tbr or ((vbr or 0) + (abr or 0))
            if bitrate_kbps and bitrate_kbps > 0:
                filesize = int((bitrate_kbps * 1000 / 8) * duration_seconds)

        # Build clean resolution label
        resolution = f.get("resolution")
        if not resolution:
            if width and height:
                resolution = f"{width}x{height}"
            elif height:
                resolution = f"{height}p"
            elif acodec != "none" and vcodec == "none":
                resolution = "audio only"

        # Check stream type
        is_video = (vcodec != "none")
        is_audio = (acodec != "none")

        formatted.append({
            "format_id": fid,
            "ext": ext,
            "width": width,
            "height": height,
            "resolution": resolution,
            "fps": fps,
            "vcodec": vcodec,
            "acodec": acodec,
            "tbr": tbr,
            "vbr": vbr,
            "abr": abr,
            "filesize": filesize,
            "filesize_str": format_bytes(filesize) if filesize else None,
            "is_video": is_video,
            "is_audio": is_audio,
        })

    return formatted


def extract_available_qualities(raw_formats: List[Dict[str, Any]]) -> List[int]:
    """
    Extracts all distinct, descending vertical resolutions (e.g. [2160, 1080, 720, 480, 360]).
    """
    qualities: Set[int] = set()
    for f in (raw_formats or []):
        h = f.get("height")
        if h and isinstance(h, int) and h >= 144:
            qualities.add(h)
    return sorted(list(qualities), reverse=True)


def build_video_format_spec(target_quality: str) -> str:
    """
    Builds dynamic yt-dlp format selector string based on desired resolution.
    Never hardcodes format IDs.
    Examples:
      - 'best' -> 'bestvideo+bestaudio/best'
      - '1080' -> 'bestvideo[height<=1080]+bestaudio/best[height<=1080]/bestvideo+bestaudio/best'
    """
    q_str = str(target_quality).lower().strip()
    if q_str in ["best", "highest", "max", "auto", "original"]:
        return "bestvideo+bestaudio/best"

    digits = re.findall(r'\d+', q_str)
    if digits:
        h = int(digits[0])
        return f"bestvideo[height<={h}]+bestaudio/best[height<={h}]/bestvideo+bestaudio/best"

    return "bestvideo+bestaudio/best"


def build_audio_format_spec() -> str:
    """
    Builds dynamic yt-dlp format selector for audio stream extraction.
    """
    return "bestaudio/bestvideo+bestaudio/best"

