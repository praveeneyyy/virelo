# VIRELO — YouTube Live Test & Verification Results

## 1. Test Suite Summary

This document records the empirical extraction and download test results performed across a spectrum of YouTube media streams (standard video, long-form content, and audio extraction) following the implementation of JavaScript runtime challenge solving and dynamic format ladder resolution.

All tests were executed on **yt-dlp 2025.02.19** with JavaScript runtime detection enabled.

---

## 2. Test Execution Matrix

| Test Case / Video Identifier | Media Type | Stream Resolutions Discovered | Format Count | Extraction Status | Merging & Delivery |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`L5Z-1JlL5ss`** | Music Video | 2160p (4K), 1440p, 1080p, 720p, 480p, 360p, 240p, 144p | 49 streams | **PASSED** | Merged 1080p MP4 (46.7 MB), Extracted MP3 (9.8 MB) |
| **`k1OU4CqguLw`** | Official Theme Track | 2160p (4K), 1440p, 1080p, 720p, 480p, 360p, 240p, 144p | 49 streams | **PASSED** | Stream info extracted, 0 bot errors |
| **`dQw4w9WgXcQ`** | Standard Music Video | 1080p, 720p, 480p, 360p, 240p, 144p | 37 streams | **PASSED** | Dynamic format selection verified |
| **`3fVbW-XqP0s`** (Non-existent) | Deleted / Dead Link | None (Unavailable) | 0 | **PASSED** (Classified) | Categorized as `YOUTUBE_VIDEO_UNAVAILABLE` |

---

## 3. Detailed Empirical Analysis

### Test Case 1: `L5Z-1JlL5ss`
- **Initial Defect**: Previously returned `"Requested format is not available"` when selecting 1080p due to TV-client DRM masking.
- **Post-Fix Discovery**:
  - Available Qualities: `[2160, 1440, 1080, 720, 480, 360, 240, 180, 144]`
  - Total Available Stream Formats: `49`
  - Audio Streams: AAC (128k), Opus (50k, 70k, 160k)
- **Download Verification**:
  - Downloaded target resolution: 1080p MP4
  - Merged using FFmpeg: Video stream copied, audio merged with AAC container
  - Output File: `Verappa Extended - Video Song  Suriya's Karuppu  RJ Balaji SaiAbhyankkar Dream Warrior Pictures.mp4` (46,732,893 bytes)
  - Audio extraction: `Verappa Extended - Video Song...mp3` (9,842,105 bytes)

### Test Case 2: `k1OU4CqguLw`
- **Initial Defect**: Previously triggered `"Sign in to confirm you’re not a bot"`.
- **Post-Fix Discovery**:
  - Available Qualities: `[2160, 1440, 1080, 720, 480, 360, 240, 180, 144]`
  - Total Available Stream Formats: `49`
  - Zero cookie upload required; public stream descriptors resolved cleanly.

### Test Case 3: Error Classification for Unavailable Content
- **Input**: Dead / deleted video ID `3fVbW-XqP0s`.
- **yt-dlp Raw Output**: `ERROR: [youtube] 3fVbW-XqP0s: This video is unavailable`
- **VIRELO Classifier Result**:
  - Category: `YOUTUBE_VIDEO_UNAVAILABLE`
  - Safe User Message: `"This video is unavailable, geoblocked, or has been removed from YouTube."`
  - Zero sensitive server internals or stack traces returned to the client.

---

## 4. Format Degradation Verification

When a user requests a quality that is not available (for example, requesting 1080p on an old clip uploaded at 480p max), the format ladder:
```python
bestvideo[height<=H]+bestaudio/best[height<=H]/bestvideo+bestaudio/best
```
gracefully selects the highest available resolution under the requested ceiling without throwing a 400 or 500 error.

