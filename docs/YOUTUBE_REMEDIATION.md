# VIRELO — YouTube Subsystem Remediation & Implementation Guide

## 1. Architectural Overhaul: Modular YouTube Service

All YouTube-specific logic has been decoupled from the general extractor and consolidated into `backend/app/services/youtube/`:

```
backend/app/services/youtube/
├── __init__.py           # Public unified facade exports
├── service.py            # Central orchestrator
├── url_parser.py         # URL detector & canonical normalizer
├── formats.py            # Dynamic format discovery (no hardcoded IDs)
├── metadata.py           # Contract builder & thumbnail selector
├── extractor.py          # yt-dlp metadata engine & oEmbed fallback
├── audio.py              # Audio stream extractor & FFmpeg transcoder
├── downloader.py         # Video multiplexer (FFmpeg merging)
├── circuit_breaker.py    # Concurrency limiting & failure cooldown
├── health.py             # Dependency diagnostics
└── errors.py             # Strict 14-code taxonomy & honest notices
```

---

## 2. Key Engineering Fixes Applied

### A. Worker Return Indentation Defect Repair
In `backend/app/workers/queue_manager.py`, the return statements for audio and video files were indented inside exception/else blocks. After downloading 100% of a file, the worker returned `None`, triggering a downstream `TypeError`. This was fixed by placing `return res_file` and `return final_file` outside the blocks.

### B. Regex Bracket Stripping Repair
In `backend/app/utils/formatters.py`, `clean_ansi()` used `re.sub(r'\[[0-9;]*[a-zA-Z]', '', text)`, which stripped `[Y` from tags like `[YOUTUBE_...`. Fixed by requiring the escape byte: `(?:\x1b|\033|\u001b)\[[0-9;]*[a-zA-Z]`.

### C. Zero-Auth Official oEmbed Fallback
When yt-dlp encounters a `LOGIN_REQUIRED` BotGuard response from a cloud datacenter IP, `YouTubeExtractor` queries YouTube's official public oEmbed API (`https://www.youtube.com/oembed?url=...&format=json`). This guarantees that:
- The actual video title is displayed.
- The author/channel name is verified.
- The thumbnail image preview is loaded.
- Users never experience a broken or empty screen.

### D. Actionable User Experience with Real Alternatives
When a stream is restricted on cloud hosting, the user interface presents verified metadata and clear legitimate alternatives:
1. **Convert Existing Media**: Direct link to the VIRELO Converter to transcode, extract MP3/FLAC, or create GIFs.
2. **Watch on YouTube**: Direct link to open and stream the video on YouTube.
3. **Run Locally**: Information on running VIRELO locally (`python run_dev.py`) for unrestricted personal downloads.

### E. Elimination of Cookie Coercion
All misleading banners demanding browser `cookies.txt` uploads have been removed. Server-side cookie provisioning via `YTDLP_COOKIES_TEXT` or `YTDLP_COOKIES_B64` remains supported for system administrators.

---

## 3. Strict 14-Code Error Taxonomy

1. `YOUTUBE_CLOUD_IP_RESTRICTED`
2. `YOUTUBE_INVALID_URL`
3. `YOUTUBE_VIDEO_UNAVAILABLE`
4. `YOUTUBE_PRIVATE_VIDEO`
5. `YOUTUBE_AGE_RESTRICTED`
6. `YOUTUBE_GEO_RESTRICTED`
7. `YOUTUBE_LIVE_STREAM_UNSUPPORTED`
8. `YOUTUBE_MEMBERS_ONLY`
9. `YOUTUBE_PREMIERE_UNPLAYED`
10. `YOUTUBE_FORMAT_UNAVAILABLE`
11. `YOUTUBE_RATE_LIMITED`
12. `YOUTUBE_CHALLENGE_REQUIRED`
13. `YOUTUBE_DOWNLOAD_FAILED`
14. `YOUTUBE_AUTHENTICATION_REQUIRED`

