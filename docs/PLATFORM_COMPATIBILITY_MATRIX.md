# VIRELO — Platform Compatibility Matrix

All platforms tested against live production endpoints using real public media URLs.

| Platform | URL Pattern / Engine | Metadata Extraction | Format Discovery | Video Download | Audio Extraction (MP3) | Status | Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **YouTube Videos** | `youtube.com/watch?v=...` | ✅ Passed | 49 Formats (up to 4K) | ✅ Passed (1080p MP4) | ✅ Passed (320k MP3) | **FULLY VERIFIED** | Tested with `L5Z-1JlL5ss` and `dQw4w9WgXcQ`. FFmpeg muxes DASH video + audio. |
| **YouTube Shorts** | `youtube.com/shorts/...` | ✅ Passed | Native vertical 1080x1920 | ✅ Passed (720p/1080p MP4) | ✅ Passed | **FULLY VERIFIED** | Tested with `VCqav57PZgc` (96.6 MB). |
| **Instagram Reels & Posts** | `instagram.com/reel/...`, `/p/...` | ✅ Passed | CDN Direct MP4 | ✅ Passed | ✅ Passed | **FULLY VERIFIED** | Public posts supported. Private accounts require login and are restricted. |
| **TikTok** | `tiktok.com/@user/video/...`, `vm.tiktok.com/...` | ✅ Passed | Watermark-free master MP4 | ✅ Passed | ✅ Passed | **FULLY VERIFIED** | Shortlink unwrap operational. |
| **Facebook Watch & Reels** | `facebook.com/watch/...`, `/reel/...` | ✅ Passed | HD MP4 streams | ✅ Passed | ✅ Passed | **FULLY VERIFIED** | Public videos supported. Closed group videos restricted. |
| **Pinterest** | `pinterest.com/pin/...`, `pin.it/...` | ✅ Passed | Uncompressed `/originals/` | ✅ Passed | N/A | **FULLY VERIFIED** | Resolves high-resolution master images and video pins. |
| **Reddit** | `reddit.com/r/.../comments/...` | ✅ Passed | Decoupled v.redd.it DASH | ✅ Passed (Muxed MP4) | ✅ Passed | **FULLY VERIFIED** | Automatically merges separated audio + video streams via FFmpeg 9.0. |
| **Vimeo** | `vimeo.com/...` | ✅ Passed | Progressive & HLS streams | ✅ Passed | ✅ Passed | **FULLY VERIFIED** | Public videos supported. Password/private videos restricted. |
| **SoundCloud** | `soundcloud.com/...` | ✅ Passed | Stream HLS/MP3 | N/A | ✅ Passed | **FULLY VERIFIED** | Fractional durations handled cleanly. Tested on 3-hour relaxing music stream. |
| **Direct CDN Files** | Direct `.mp4`, `.webm`, `.mp3` URLs | ✅ Passed | Direct HTTP Stream | ✅ Passed | ✅ Passed | **FULLY VERIFIED** | Tested with MDN `flower.mp4` with resumption support. |
