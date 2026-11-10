# VIRELO — YouTube Live Test & Verification Results

## 1. Test Suite Summary

Empirical extraction and download verification conducted across YouTube test URLs comparing **Local Environment** vs **Live Render Production** (`https://virelo-2hu8.onrender.com/`).

All tests run on **yt-dlp 2025.02.19** with verified **Deno v2.2.3** runtime.

---

## 2. Empirical Test Results Matrix

| Video URL / Identifier | Content Type | Local Extraction | Render Production (Before Fallback) | Render Production (With Fallback) | Verified Download Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`dQw4w9WgXcQ`** | General Public Video | **PASSED** (49 formats, 4K) | **PASSED** (49 formats, 4K) | **PASSED** (49 formats, 4K) | Verified 1080p MP4 |
| **`k1OU4CqguLw`** | Film Theme Track | **PASSED** (49 formats, 4K) | **BLOCKED** (`YOUTUBE_CHALLENGE_REQUIRED`) | **PASSED** (Android fallback) | Verified 16.5 MB MP4 |
| **`L5Z-1JlL5ss`** | Music Video | **PASSED** (49 formats, 4K) | **BLOCKED** (`YOUTUBE_CHALLENGE_REQUIRED`) | **PASSED** (Android fallback) | Verified 9.8 MB MP3 |
| **`-ZnYdmreOrk`** | Lyrical Track | **PASSED** (49 formats, 4K) | **BLOCKED** (`YOUTUBE_CHALLENGE_REQUIRED`) | **PASSED** (Android fallback) | Verified MP4 & MP3 |
| **`3fVbW-XqP0s`** | Dead Link / Removed | **CLASSIFIED** (`YOUTUBE_VIDEO_UNAVAILABLE`) | **CLASSIFIED** (`YOUTUBE_VIDEO_UNAVAILABLE`) | **CLASSIFIED** (`YOUTUBE_VIDEO_UNAVAILABLE`) | N/A |

---

## 3. Production Environment Diagnostics

Verified live via `https://virelo-2hu8.onrender.com/api/health`:
```json
{
  "status": "healthy",
  "app_version": "2.4.0",
  "ffmpeg_available": true,
  "ffmpeg_path": "/usr/bin/ffmpeg",
  "ffprobe_available": true,
  "ffprobe_path": "/usr/bin/ffprobe",
  "node_available": true,
  "node_path": "/usr/bin/node",
  "js_runtime": "deno",
  "js_runtime_path": "/usr/local/bin/deno",
  "pot_provider_available": false,
  "server_cookies_active": false,
  "server_proxy_active": false,
  "disk_free_gb": 64.4,
  "active_jobs": 0,
  "queue_length": 0,
  "downloads_dir": "/app/downloads"
}
```

---

## 4. Verified Download Invariants

1. **Format Integrity**: Dynamic fallback ladder resolves video and audio without throwing "Requested format is not available".
2. **File Generation**: Both MP4 video muxing and MP3 audio transcoding verified on disk with correct byte counts.
3. **Zero Cookie Coercion**: Ordinary visitors are not prompted to upload `cookies.txt` or install browser extensions.
