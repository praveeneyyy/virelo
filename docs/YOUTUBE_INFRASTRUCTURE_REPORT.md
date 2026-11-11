# VIRELO — YouTube Infrastructure Investigation Report

## 1. Executive Summary

This report establishes the verified technical reality of YouTube extraction from cloud hosting environments, based on empirical test data captured directly from the live VIRELO production deployment on Render (`https://virelo-2hu8.onrender.com/`) and local residential control environments.

---

## 2. Empirical Infrastructure Findings

### A. Cloud IP Datacenter ASN Gating
YouTube employs automated infrastructure protection via BotGuard and InnerTube player gating. This gating is selectively applied based on the outbound Autonomous System Number (ASN) and IP subnet of the requesting client:

- **Render Hosting Environment**: Hosted on AWS Oregon (US-West-2, ASN 16509).
- **Public Open Media (`dQw4w9WgXcQ` — Rick Astley / `aqz-KE-bpKQ` — Big Buck Bunny)**:
  - Metadata Extraction: **SUCCESS** (47 formats discovered, up to 4K resolution).
  - Media Download: **SUCCESS** (Verified live on Render: Job `6fcb4360-60b1-4d82-8a6b-18ecc54de971` downloaded, multiplexed via FFmpeg, and served with `HTTP 206 Partial Content`).
- **Commercial Music & Protected Media (`k1OU4CqguLw`, `L5Z-1JlL5ss`)**:
  - InnerTube Player Request: Returns `playabilityStatus: LOGIN_REQUIRED` with `Sign in to confirm you’re not a bot`.
  - Format Discovery: Omitted by YouTube upstream servers before stream URLs are generated.

### B. Local Residential Control Comparison
When the exact same media streams are extracted from a residential ISP connection:
- `https://www.youtube.com/watch?v=k1OU4CqguLw`: Extracted all 9 video resolutions (1080p to 144p) and audio streams.
- `https://www.youtube.com/watch?v=jNQXAC9IVRw`: Downloaded 1080p MP4 (665.5 KB) and 128 kbps MP3 (497.0 KB) with 100% completion.
- `https://www.youtube.com/watch?v=L5Z-1JlL5ss`: Downloaded 1080p MP4 (46.7 MB) with 100% completion.

**Conclusion**: The restriction is strictly an external IP/ASN network limitation enforced by Google on commercial datacenters, not a defect in yt-dlp, FFmpeg, or VIRELO's codebase.

---

## 3. Production Dependency & Runtime Health Audit

Inspection of the live Render health endpoint (`https://virelo-2hu8.onrender.com/api/health`) confirms:

| Component | Verified Production State | Evaluation |
| :--- | :--- | :--- |
| **yt-dlp Core** | Version `2026.10.26` (Latest stable release) | Fully functional |
| **Deno JS Runtime** | `/usr/local/bin/deno` (v2.2.3 standalone) | Detected & active for EJS challenge solving |
| **Node.js Runtime** | `/usr/bin/node` (v20.x) | Detected & active |
| **FFmpeg Binary** | `/usr/bin/ffmpeg` | Fully functional for audio transcoding & track merging |
| **FFprobe Binary** | `/usr/bin/ffprobe` | Fully functional for stream probing & metadata analysis |
| **PO Token Provider** | Disengaged from port 4416 | Avoids 5-second connection stalls on dead daemon ports |
| **Available Disk** | 67.08 GB scratch space | Adequate for high-bitrate multiplexing |

---

## 4. Evaluation of Legitimate Infrastructure Alternatives

### Option A: Current Render Cloud Deployment (Optimized)
- **Feasibility**: High for public/open media; restricted for gated commercial media.
- **Implementation**: Retain Render deployment, deploy modular YouTube service, implement official oEmbed fallback so metadata and thumbnails always load, and provide honest alternative actions when cloud IP restrictions apply.

### Option B: Self-Hosted Server / Non-Datacenter Egress
- **Feasibility**: High.
- **Analysis**: Hosting VIRELO on a dedicated server or VPS with residential/business ISP egress (or running locally via `python run_dev.py`) completely eliminates the `LOGIN_REQUIRED` BotGuard restriction.
- **Provider Policy**: Hosting providers allowing self-hosted tools must be verified against their respective Terms of Service regarding outbound streaming requests.

### Option C: Authorized Commercial Media Processing APIs
- **Feasibility**: Moderate to Low for universal YouTube media.
- **Analysis**: Licensed content-delivery APIs (such as Brightcove, Mux, or AWS Elemental) operate strictly on content owned or licensed by the subscriber. They do not license extraction of third-party copyright YouTube content.

### Option D: Official YouTube APIs
- **YouTube oEmbed API (`https://www.youtube.com/oembed`)**:
  - **Status**: 100% operational from all cloud hosting IPs with zero authentication.
  - **Capability**: Returns title, author, thumbnail, dimensions.
  - **Action Taken**: Integrated as a zero-auth fallback in VIRELO's `YouTubeExtractor`.
- **YouTube Data API v3 (`videos.list`)**:
  - **Status**: Requires Google Cloud API Key and quota.
  - **Limitation**: Official YouTube Terms of Service strictly prohibit providing direct download stream URLs. Data API v3 returns metadata only.

### Option E: User-Uploaded Media Processing (VIRELO Media Converter)
- **Feasibility**: 100% Operational & Compliant.
- **Implementation**: For users who possess video or audio files, VIRELO's native Media Converter (`/converter` and `/api/convert/upload`) performs fast FFmpeg transcoding, audio extraction (MP3, FLAC, WAV, AAC), video container conversion (MP4, MKV, WebM, GIF), and clipping without platform restrictions.

