# VIRELO — YouTube Extraction System Audit

## 1. Executive Summary

This audit reviews the extraction pipeline, YouTube challenge resolution mechanisms, format discovery, and client credential requirements within the VIRELO application deployed on Render (`https://virelo-2hu8.onrender.com/`).

### Production Verification (Live Health Endpoint)
Inspection of `https://virelo-2hu8.onrender.com/api/health` confirmed:
- **Deno Runtime**: Active and verified (`/usr/local/bin/deno`)
- **Node.js Runtime**: Active (`/usr/bin/node`)
- **FFmpeg & FFprobe**: Active and verified (`/usr/bin/ffmpeg`, `/usr/bin/ffprobe`)
- **Disk Free**: 64.4 GB available scratch space

---

## 2. Root Cause Analysis: Why Certain Videos Triggered Platform Detection

Testing across production revealed a critical bifurcation:
- **Public General Content (`dQw4w9WgXcQ`)**: Succeeded on production (`HTTP 200 OK`, 49 formats, 4K to 144p).
- **Commercial Music/Film Content (`k1OU4CqguLw`, `L5Z-1JlL5ss`, `-ZnYdmreOrk`)**: Failed on production with `[YOUTUBE_CHALLENGE_REQUIRED]` (`Sign in to confirm you’re not a bot`).

### Root Cause 1: Cloud Datacenter IP Gating on `web` Client
YouTube enforces strict BotGuard Proof-of-Origin (PO) token verification on commercial music videos when requests originate from cloud datacenter IP subnets (such as AWS Oregon / Render). When accessed via the default desktop `web` client without a GVS PO Token, YouTube refuses stream extraction and returns a bot verification requirement.

### Root Cause 2: `bgutil-ytdlp-pot-provider` Daemon Absence
The `bgutil-ytdlp-pot-provider` Python plugin expects an external background HTTP daemon running at `http://127.0.0.1:4416`. Because no daemon was running on port 4416, yt-dlp encountered connection transport errors (`GET http://127.0.0.1:4416/ping`), delayed extraction by 5 seconds, and failed to generate PO tokens.

### Root Cause 3: Client Fallback Architecture
YouTube's mobile `android` and `mweb` InnerTube endpoints do not enforce desktop BotGuard PO token restrictions on datacenter IPs. By implementing an automated fallback from `web` to `['android', 'mweb']`, VIRELO extracts and downloads copyrighted media streams cleanly on cloud servers without requiring user cookies.

### Root Cause 4: Queue Manager Return Indentation Defect
In `queue_manager.py`, the return statement for audio and video files was indented inside exception/else branches. When downloads succeeded, the function returned `None`, triggering a downstream `TypeError` that was mistakenly classified as `[YOUTUBE_EXTRACTION_FAILED]`.

### Root Cause 5: Regex Bracket Stripping in `clean_ansi()`
The regex in `formatters.py` was stripping `[Y` from strings like `[YOUTUBE_CHALLENGE_REQUIRED]`, rendering them as `OUTUBE_CHALLENGE_REQUIRED`. Fixed to require the escape control sequence `\x1b[`.

---

## 3. Extraction Pipeline Audit Matrix

| Pipeline Component | Production Status | Resolution |
| :--- | :--- | :--- |
| **yt-dlp Core Engine** | `2025.02.19` | Updated and pinned |
| **JavaScript Runtime** | Deno v2.2.3 (`/usr/local/bin/deno`) | Installed & verified live |
| **Node.js Runtime** | Node.js v20.x (`/usr/bin/node`) | Installed & verified live |
| **PO Token Provider** | Disengaged from port 4416 | Replaced with mobile client fallback |
| **Client Strategy** | Dynamic: `web` → `['android', 'mweb']` | Full 4K on open streams, resilient delivery on gated streams |
| **Format Resolution** | Multi-tier degradation ladder | Prevents "format unavailable" exceptions |
| **Error Classification** | Categorized into 8 distinct codes | Transparent, honest error reporting |
| **User Experience** | Cookie upload prompts removed | Zero cookie pressure on visitors |
