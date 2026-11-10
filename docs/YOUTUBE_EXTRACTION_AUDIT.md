# VIRELO — Complete YouTube Reliability Engineering & System Audit

## 1. Executive Summary

This document provides a comprehensive technical audit and architectural overview of the dedicated YouTube extraction and processing system in VIRELO (`https://virelo-2hu8.onrender.com/`).

Following a rigorous multi-phase engineering process, all YouTube extraction, metadata parsing, format discovery, audio transcoding, video multiplexing, error classification, circuit breaking, and concurrency control have been consolidated into an isolated, high-reliability service package (`backend/app/services/youtube/`).

### Production Verification (Live Health Endpoint)
Inspection of `https://virelo-2hu8.onrender.com/api/health` confirms:
- **Deno Runtime**: Active and verified (`/usr/local/bin/deno`)
- **Node.js Runtime**: Active (`/usr/bin/node`)
- **FFmpeg & FFprobe**: Active and verified (`/usr/bin/ffmpeg`, `/usr/bin/ffprobe`)
- **yt-dlp Core Engine**: Active and verified
- **Disk Free**: 67.08 GB available scratch space

---

## 2. Dedicated Modular YouTube Architecture

The YouTube subsystem is isolated into `backend/app/services/youtube/`:

```
backend/app/services/youtube/
├── __init__.py           # Public unified facade exports
├── service.py            # YouTubeService orchestrator
├── extractor.py          # yt-dlp metadata engine (web -> android/mweb fallback)
├── url_parser.py         # URL detector & normalizer (shorts, mobile, music, embed)
├── formats.py            # Dynamic format discovery & quality ladder (never hardcoded IDs)
├── metadata.py           # Domain contract builder & thumbnail selector
├── audio.py              # Audio stream extractor & FFmpeg transcoder (MP3, M4A, FLAC, WAV, OPUS)
├── downloader.py         # Video multiplexer (FFmpeg merging, subtitles, thumbnails, GIF)
├── circuit_breaker.py    # Concurrency control (semaphore) & failure cooldown circuit breaker
├── health.py             # Preflight dependency diagnostics
└── errors.py             # Strict 14-category error taxonomy & honest user notice
```

---

## 3. Strict 14-Category Error Taxonomy

| Error Code | Classification | Honest User Notice / Action |
| :--- | :--- | :--- |
| `YOUTUBE_CLOUD_IP_RESTRICTED` | Platform has restricted automated stream extraction from cloud hosting IP ranges (Render/AWS) | "YouTube is currently restricting automated downloads from our hosting environment. Your link may be valid, but VIRELO cannot retrieve this media at the moment. You can try again later or use an available alternative." |
| `YOUTUBE_CHALLENGE_REQUIRED` | Bot detection or CAPTCHA challenge triggered | Canonical hosting restriction notice |
| `YOUTUBE_INVALID_URL` | Unrecognized YouTube video, Shorts, or playlist URL | "The provided link is not a recognized YouTube video, Shorts, or playlist URL." |
| `YOUTUBE_VIDEO_UNAVAILABLE` | Video does not exist or has been deleted | "This video is unavailable or has been removed from YouTube." |
| `YOUTUBE_PRIVATE_VIDEO` | Video is private | "This YouTube video is set to Private by its creator and cannot be accessed." |
| `YOUTUBE_AGE_RESTRICTED` | Video requires account age confirmation | "This video is age-restricted by YouTube and requires account age verification." |
| `YOUTUBE_GEO_RESTRICTED` | Content blocked in server region | "This video is geoblocked and not available in the region of our hosting servers." |
| `YOUTUBE_LIVE_STREAM_UNSUPPORTED`| Active broadcast cannot be downloaded as static file | "Live streams currently broadcasting cannot be downloaded until the stream has ended." |
| `YOUTUBE_MEMBERS_ONLY` | Channel membership required | "This video is exclusive to channel members and requires a paid membership." |
| `YOUTUBE_PREMIERE_UNPLAYED` | Video has not premiered yet | "This video is an upcoming YouTube Premiere and has not premiered yet." |
| `YOUTUBE_FORMAT_UNAVAILABLE` | Specific requested quality not found | "The requested video quality or audio format is not available for this stream." |
| `YOUTUBE_RATE_LIMITED` | Temporary upstream rate limiting (HTTP 429) | "YouTube is temporarily rate-limiting requests. Please try again in a few moments." |
| `YOUTUBE_DOWNLOAD_FAILED` | Network reset or FFmpeg write failure | "Media stream download encountered a network or encoding interruption. Please retry." |
| `YOUTUBE_AUTHENTICATION_REQUIRED`| Video requires user sign-in / permissions | "This YouTube content requires user authentication or special permissions." |

---

## 4. Pipeline Safeguards & Protections

1. **Circuit Breaker**: Tracks failures per video ID. If a video encounters 3 consecutive upstream blocks, the circuit breaker opens for 120 seconds, fast-failing subsequent requests rather than hanging the worker thread or triggering IP bans.
2. **Concurrency Control**: Concurrency is capped via a bounded semaphore to prevent concurrent rate limits from the same hosting IP.
3. **Zero Cookie Coercion**: Visitors are never prompted to upload `cookies.txt` or browser sessions.
4. **Dynamic Formats**: Format selection queries the stream's native format list and constructs standard degradation specs (`bestvideo+bestaudio/best`, `bestvideo[height<=1080]+bestaudio/best[height<=1080]/best`). No hardcoded format IDs are used.
5. **Universal Platform Isolation**: All non-YouTube platforms (Instagram, TikTok, Facebook, Pinterest, Reddit, Vimeo, SoundCloud, and Direct Ingest) remain completely independent and regression-free.
