# VIRELO — YouTube Fix Log

## Engineering Change Log

### Phase 1: Modular YouTube Service Package
- **Package Creation**: Architected `backend/app/services/youtube/` containing 11 dedicated, decoupled modules.
- **Service Integration**: Routed all YouTube requests in `backend/app/services/extractor.py` and `backend/app/workers/queue_manager.py` through `youtube_service`.
- **Zero Non-YouTube Regression**: Verified Pinterest, Instagram, TikTok, Facebook, Reddit, and direct URL extractors remain completely intact.

### Phase 2: Runtime Environment Hardening
- **Standalone Deno Installation**: Direct download and unzip of standalone Deno binary to `/usr/local/bin/deno`, bypassing `/dev/tty` failure in headless Docker builds.
- **Dependency Cleanup**: Removed `bgutil-ytdlp-pot-provider` package, eliminating 5-second `http://127.0.0.1:4416/ping` connection timeout stalls.
- **Telemetry Verification**: Live health endpoint `/api/health` reports Deno runtime, FFmpeg, FFprobe, and yt-dlp version.

### Phase 3: Dynamic Format Discovery & Selector Pipeline
- **Removed Hardcoded IDs**: Replaced static YouTube format assumptions with dynamic format parsing in `formats.py`.
- **Audio Extraction**: Dynamic `bestaudio/bestvideo+bestaudio/best` stream selection transcoded to MP3, M4A, FLAC, WAV, OPUS, OGG, or AAC with custom bitrates.
- **Video Multiplexing**: Native FFmpeg merging combining best video + best audio tracks into MP4/MKV/WebM.
- **Indentation Defect Repair**: Corrected return statement indentation in `queue_manager.py` that caused finished downloads to return `None` and fail.

### Phase 4: Strict 14-Code Error Taxonomy & Honest Messaging
- **14 Taxonomy Codes**: Comprehensive mapping covering cloud IP blocks, age gating, geo blocks, premieres, live streams, memberships, and network errors.
- **Honest Cloud IP Notice**: Accurately informs users when cloud hosting IP blocks occur rather than blaming user links or demanding browser cookies.
- **Frontend Refinement**: Updated `VireloHero.tsx` and `DedicatedPlatformView.tsx` with styled notice for `YOUTUBE_CLOUD_IP_RESTRICTED` and `YOUTUBE_CHALLENGE_REQUIRED`.

### Phase 5: Circuit Breaker & Concurrency Limiting
- **YouTubeCircuitBreaker**: Implemented failure threshold tracking (3 strikes), 120s cooldown, and half-open retry mechanism.
- **Semaphore Concurrency**: Thread-safe concurrency capping preventing simultaneous request bursts from the server IP.

### Phase 6: Automated Testing Suite
- **Test Suite**: Created `tests/test_youtube.py` with 25 unit and integration tests.
- **Pass Rate**: 25/25 passing (100% success rate in 17s).
- **End-to-End Real Downloads**: Verified 46.7 MB MP4 (`L5Z-1JlL5ss`), 665.5 KB MP4 (`jNQXAC9IVRw`), and 497.0 KB MP3 (`jNQXAC9IVRw`) successfully written to disk.
