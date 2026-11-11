"""
Universal Media Extraction Engine.
Integrates yt-dlp (1,700+ extractors), Pinterest HD Pin resolution, and direct HTTP file probing.
"""
import os
import re
import shutil
import urllib.parse
from typing import Dict, Any, List, Optional
import requests
import yt_dlp
from yt_dlp.extractor import gen_extractors

from backend.app.utils.ffmpeg import get_ffmpeg_info, get_node_path, get_js_runtime_info
from backend.app.utils.formatters import format_bytes, format_seconds, clean_ansi
from backend.app.utils.error_classifier import classify_youtube_error
from backend.app.utils.runtime_config import apply_runtime_ytdlp_opts
from backend.app.services.youtube import youtube_service, YouTubeError

COMMON_EXTS = {
    'video': {'mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', '3gp', 'ts', 'm4v'},
    'audio': {'mp3', 'm4a', 'flac', 'wav', 'opus', 'ogg', 'aac', 'wma', 'alac', 'aiff'},
    'image': {'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'tiff'},
    'file':  {'pdf', 'zip', 'rar', '7z', 'tar', 'gz', 'iso', 'exe', 'docx', 'xlsx', 'pptx', 'csv', 'txt', 'apk'}
}


class MediaExtractor:
    def __init__(self):
        info = get_ffmpeg_info()
        self.ffmpeg_dir = info.get('dir')
        self.ffmpeg_binary = info.get('ffmpeg')
        self.node_path = get_node_path()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/131.0.0.0 Safari/537.36'
            ),
            'Accept-Language': 'en-US,en;q=0.9',
        })

    def _base_opts(self) -> Dict[str, Any]:
        opts: Dict[str, Any] = {
            'quiet': True,
            'no_warnings': True,
            'skip_download': True,
            'noplaylist': True,
            'extract_flat': False,
            'socket_timeout': 20,
            'ignoreerrors': False,
            'http_headers': {
                'Accept-Language': 'en-US,en;q=0.9',
            }
        }
        return apply_runtime_ytdlp_opts(opts)

    def _probe_direct_file(self, url: str) -> Optional[Dict[str, Any]]:
        """Checks if URL directly points to a media or document file via HTTP headers."""
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.lower()

        all_known = set()
        for s in COMMON_EXTS.values():
            all_known.update(s)

        has_hint = any(path.endswith(f".{ext}") for ext in all_known)

        try:
            head = self.session.head(url, allow_redirects=True, timeout=7)
            ct = head.headers.get('Content-Type', '').lower()
            cl = int(head.headers.get('Content-Length', 0))

            if has_hint or ('text/html' not in ct and ct):
                # Extract filename
                filename = ""
                cd = head.headers.get('Content-Disposition', '')
                if 'filename=' in cd:
                    filename = cd.split('filename=')[-1].strip('"\' ;')
                if not filename:
                    filename = os.path.basename(parsed.path) or "downloaded_file"

                # Classify media type
                media_type = "file"
                if any(v in ct for v in ['video', 'mp4', 'mkv', 'webm']) or any(path.endswith(f".{e}") for e in COMMON_EXTS['video']):
                    media_type = "video"
                elif any(a in ct for a in ['audio', 'mpeg', 'wav', 'ogg', 'flac']) or any(path.endswith(f".{e}") for e in COMMON_EXTS['audio']):
                    media_type = "audio"
                elif any(i in ct for i in ['image', 'jpeg', 'png', 'webp', 'gif']) or any(path.endswith(f".{e}") for e in COMMON_EXTS['image']):
                    media_type = "image"

                return {
                    "is_direct_file": True,
                    "title": filename,
                    "uploader": parsed.netloc,
                    "platform": "Direct File",
                    "file_size": cl if cl > 0 else None,
                    "media_type": media_type,
                    "thumbnail": url if media_type == "image" else None,
                    "url": url,
                    "available_qualities": [],
                    "available_formats": [filename.split('.')[-1].lower()] if '.' in filename else [],
                    "formats": [],
                    "subtitles": [],
                    "is_playlist": False,
                    "playlist_count": 0,
                }
        except Exception:
            pass
        return None

    def _extract_pinterest_pin(self, url: str) -> Optional[Dict[str, Any]]:
        """Resolves Pinterest image pin and converts image URL to maximum uncompressed HD original."""
        try:
            resp = self.session.get(url, allow_redirects=True, timeout=10)
            if resp.status_code == 200:
                html = resp.text
                m = re.search(r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
                if not m:
                    m = re.search(r'name=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html)
                if m:
                    img_url = m.group(1)
                    # Convert to maximum uncompressed original resolution
                    orig_url = re.sub(r'/(236x|474x|736x)/', '/originals/', img_url)

                    t_match = re.search(r'property=["\']og:title["\']\s+content=["\']([^"\']+)["\']', html)
                    title = t_match.group(1) if t_match else "Pinterest Image Pin"

                    return {
                        "is_direct_file": True,
                        "title": title,
                        "uploader": "Pinterest",
                        "platform": "Pinterest",
                        "media_type": "image",
                        "thumbnail": orig_url,
                        "url": orig_url,
                        "file_size": None,
                        "available_qualities": [],
                        "available_formats": ["jpg", "png", "webp"],
                        "formats": [],
                        "subtitles": [],
                        "is_playlist": False,
                        "playlist_count": 0,
                    }
        except Exception:
            pass
        return None

    def extract_info(self, url: str) -> Dict[str, Any]:
        """Comprehensive metadata extraction across streaming networks and direct URLs."""
        url = url.strip()

        # 1. Specialized Modular YouTube Service (resilient clients, circuit breaker, 14-code taxonomy)
        if youtube_service.is_youtube_url(url):
            try:
                return youtube_service.extract(url)
            except YouTubeError as yt_err:
                code_str = yt_err.code.value if hasattr(yt_err.code, 'value') else str(yt_err.code)
                raw_snippet = f" (Details: {yt_err.raw_error[:200]})" if yt_err.raw_error else ""
                print(f"[YouTube Extraction Diagnostic] Code: {code_str} | Message: {yt_err.message} | Raw: {yt_err.raw_error[:200]}")
                raise ValueError(f"[{code_str}] {yt_err.message}{raw_snippet}")
            except Exception as exc:
                clean_err = clean_ansi(str(exc))
                code, user_msg = classify_youtube_error(clean_err)
                print(f"[YouTube Extraction Diagnostic] Code: {code} | Error: {clean_err[:200]}")
                raise ValueError(f"[{code}] {user_msg} (Details: {clean_err[:200]})")

        # 2. Fast check if direct file URL
        direct_info = self._probe_direct_file(url)
        if direct_info:
            return direct_info

        # 3. Extract universal platforms with yt-dlp (Instagram, TikTok, Facebook, Reddit, Vimeo, SoundCloud, etc.)
        opts = self._base_opts()
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if info:
                    if 'entries' in info and info['entries']:
                        entries = [e for e in info['entries'] if e]
                        first = entries[0] if entries else info
                        first['is_playlist'] = True
                        first['playlist_count'] = len(entries)
                        return self._format_ytdlp_info(first, url)
                    return self._format_ytdlp_info(info, url)
        except Exception as yt_err:
            clean_err = clean_ansi(str(yt_err))

            # 4. Fallback for Pinterest Pin image
            if 'pinterest' in url.lower() or 'pin.it' in url.lower():
                pin = self._extract_pinterest_pin(url)
                if pin:
                    return pin

            # 5. Fallback direct probe
            forced_probe = self._probe_direct_file(url)
            if forced_probe:
                return forced_probe

            raise ValueError(clean_err or "Unable to extract media metadata from the provided URL.")

    def _format_ytdlp_info(self, raw: Dict[str, Any], url: str) -> Dict[str, Any]:
        """Normalizes raw yt-dlp dict into standardized contract."""
        platform = self.get_platform_name(raw)

        # Detect media type
        media_type = "video"
        if raw.get('vcodec') == 'none' and raw.get('acodec') != 'none':
            media_type = "audio"
        elif 'image' in (raw.get('ext') or ''):
            media_type = "image"

        # Compute available qualities
        qualities = set()
        formats = raw.get('formats', [])
        formatted_formats = []
        for f in formats:
            h = f.get('height')
            if h and isinstance(h, int) and h >= 144:
                qualities.add(h)
            formatted_formats.append({
                "format_id": str(f.get("format_id")),
                "ext": f.get("ext", "mp4"),
                "resolution": f.get("resolution") or (f"{f.get('width')}x{f.get('height')}" if f.get('width') and f.get('height') else None),
                "filesize": f.get("filesize") or f.get("filesize_approx"),
                "filesize_str": format_bytes(f.get("filesize") or f.get("filesize_approx")),
                "vcodec": f.get("vcodec"),
                "acodec": f.get("acodec"),
                "fps": f.get("fps"),
                "tbr": f.get("tbr"),
            })

        sorted_qualities = sorted(list(qualities), reverse=True)

        # Available subtitles
        subs = list((raw.get('subtitles') or {}).keys()) + list((raw.get('automatic_captions') or {}).keys())
        unique_subs = sorted(list(set(subs)))

        return {
            "is_direct_file": False,
            "url": url,
            "title": raw.get('title') or "Untitled Media",
            "uploader": raw.get('uploader') or raw.get('channel') or raw.get('creator') or platform,
            "platform": platform,
            "thumbnail": raw.get('thumbnail'),
            "duration": format_seconds(raw.get('duration')),
            "duration_seconds": int(round(float(raw.get('duration')))) if raw.get('duration') is not None else None,
            "file_size": raw.get('filesize') or raw.get('filesize_approx'),
            "media_type": media_type,
            "available_qualities": sorted_qualities,
            "available_formats": ["mp4", "mkv", "webm", "mp3", "m4a", "flac", "wav", "gif"],
            "formats": formatted_formats,
            "subtitles": unique_subs,
            "is_playlist": raw.get('is_playlist', False),
            "playlist_count": raw.get('playlist_count', 0),
        }

    def get_platform_name(self, info: Dict[str, Any]) -> str:
        """Determines clean platform name from extractor."""
        extractor = info.get('extractor_key') or info.get('extractor') or ''
        el = extractor.lower()
        if 'youtube' in el:
            return 'YouTube'
        if 'pinterest' in el:
            return 'Pinterest'
        if 'instagram' in el:
            return 'Instagram'
        if 'tiktok' in el:
            return 'TikTok'
        if 'twitter' in el or el == 'x':
            return 'Twitter / X'
        if 'reddit' in el:
            return 'Reddit'
        if 'facebook' in el:
            return 'Facebook'
        if 'twitch' in el:
            return 'Twitch'
        if 'vimeo' in el:
            return 'Vimeo'
        if 'soundcloud' in el:
            return 'SoundCloud'
        if 'bilibili' in el:
            return 'Bilibili'
        if 'direct' in el:
            return 'Direct File'
        return extractor.capitalize() if extractor else 'Online Platform'

    @staticmethod
    def get_supported_platforms_list() -> List[Dict[str, str]]:
        """Returns dynamic catalogue of supported platforms from yt-dlp."""
        popular = [
            {"name": "YouTube", "category": "Video & Music", "url_pattern": "youtube.com, youtu.be"},
            {"name": "Pinterest", "category": "Images & Video Pins", "url_pattern": "pinterest.com, pin.it"},
            {"name": "Instagram", "category": "Reels, Posts & Stories", "url_pattern": "instagram.com"},
            {"name": "TikTok", "category": "Short Video", "url_pattern": "tiktok.com"},
            {"name": "Twitter / X", "category": "Social Media Videos", "url_pattern": "twitter.com, x.com"},
            {"name": "Reddit", "category": "Media Posts & V.Redd.it", "url_pattern": "reddit.com, v.redd.it"},
            {"name": "Facebook", "category": "Reels & Public Videos", "url_pattern": "facebook.com"},
            {"name": "SoundCloud", "category": "Hi-Fi Audio Streams", "url_pattern": "soundcloud.com"},
            {"name": "Vimeo", "category": "High Quality Video", "url_pattern": "vimeo.com"},
            {"name": "Twitch", "category": "Clips & VODs", "url_pattern": "twitch.tv"},
            {"name": "Bilibili", "category": "Anime & Video", "url_pattern": "bilibili.com"},
            {"name": "Direct File Ingest", "category": "Any Direct URL", "url_pattern": "http://*, https://*"},
        ]
        return popular
