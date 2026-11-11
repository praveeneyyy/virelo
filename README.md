# VIRELO — Universal Media Downloader & Transcode Workstation

<div align="center">
  <img src="frontend/public/brand/virelo-logo.svg" alt="VIRELO Logo" width="220" />
  <p><strong>Your Media. Your Way.</strong></p>
  <p>High-fidelity stream extraction, FFmpeg transcoding, and direct device delivery across 1,700+ websites.</p>

  [![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![FFmpeg](https://img.shields.io/badge/FFmpeg-9.0-007808.svg?logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)
  [![yt--dlp](https://img.shields.io/badge/yt--dlp-Nightly-red.svg?logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp)
  [![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
</div>

---

## 🌟 Overview

**VIRELO** is an open-source, privacy-focused universal media ingest and transcoding workstation. It allows users to extract, decouple, multiplex, and transcode digital media from public URLs directly to their personal devices with zero advertising, tracking cookies, or artificial quality compression.

Powered by a unified **FastAPI** asynchronous backend, **FFmpeg 9.0**, **yt-dlp**, and a responsive **React 18 + Tailwind CSS** frontend, VIRELO delivers:
- Video stream downloads up to **4K UHD (2160p)** and 60fps.
- Studio-grade **320 kbps constant bitrate MP3** extraction with automated Mutagen ID3 album artwork embedding.
- Hardware-accelerated client delivery directly into the requesting user's default OS `Downloads` folder.

---

## 🚀 Key Architectural Highlights

### 1. Direct Client-Device Downloads
When a transcode or download job completes, VIRELO delivers the media file directly to the **requesting client's device** using RFC 6266 `Content-Disposition: attachment; filename="..."; filename*=UTF-8''...` headers. Regardless of whether the site is accessed from a desktop PC, Mac, Android phone, or iPhone:
- **Windows**: Saves automatically to `C:\Users\<user>\Downloads`.
- **macOS**: Saves automatically to `~/Downloads`.
- **Android**: Saves to local device storage `/Download`.
- **iOS / iPadOS**: Prompts download directly to the Files app `Downloads`.
- The user is also provided with a prominent **"Save to Device Downloads"** button for immediate one-click re-download.

### 2. Hybrid Residential Worker Architecture ($0.00 Cost)
Major media providers (such as YouTube BotGuard) restrict automated stream discovery when requests originate from cloud hosting datacenter IP ranges (AWS, Render, Google Cloud).
VIRELO solves this with a **zero-cost hybrid edge architecture**:
- **Cloud Gateway (Render)**: Hosts the public web interface, SSL certificates, queue manager, and handles standard direct platforms.
- **Residential Edge Node (Cloudflare Tunnel)**: If a cloud hosting datacenter IP encounters upstream gating or BotGuard challenges, the cloud gateway transparently forwards the extraction and download request to a paired residential worker via an encrypted Cloudflare Tunnel (`trycloudflare.com`).
- The stream discovery and download complete with residential ISP legitimacy, stream the finished media file back to the cloud node, and deliver it to the user without any paid proxy subscriptions.

### 3. High-Speed Unthrottled Stream Discovery
- **Protocol Prioritization (`protocol^=http`)**: Strictly prefers direct HTTPS DASH and progressive streams (`formats 137, 248, 399`) over throttled HLS `m3u8` playlists, accelerating download throughput from minutes down to **5–8 seconds**.
- **Multi-Stream Weighted Telemetry**: WebSocket progress reporting tracks video streams (0%–75%), audio tracks (75%–92%), and FFmpeg multiplexing (92%–100%) so users receive smooth, real-time feedback without frozen progress bars.
- **Concurrent Fragment Acceleration**: Multi-threaded chunk workers (`concurrent_fragment_downloads: 4`) with 1MB ring buffers maximize network pipe saturation.

### 4. Privacy-First Ephemeral Storage (30-Min TTL)
- Background garbage collection sweeps every 60 seconds, automatically erasing downloaded media files, temporary transcode caches, and database entries older than 30 minutes.
- Strict Zero-Log policy: No user IP logging, no tracking cookies, and no personal data retention.

---

## 🛠️ Supported Platforms & Workflows

| Platform | Features Supported |
| :--- | :--- |
| **YouTube** | 4K Ultra HD (2160p), 1440p Quad HD, 1080p Full HD, Shorts, 320 kbps MP3 with embedded thumbnail |
| **Instagram** | High-definition Reels, video posts, audio tracks, and carousel images |
| **TikTok** | Watermark-free clean MP4 video downloads and extracted MP3 audio |
| **Facebook** | 1080p Full HD Watch, public video posts, and Reels |
| **Pinterest** | Uncompressed original master image and video extraction |
| **Reddit** | High-speed automatic multiplexing of separated `v.redd.it` video and audio streams |
| **Media Converter** | Drag-and-drop local file conversion: MP4, MKV, WebM, MP3, M4A, FLAC, WAV, and animated GIF |
| **1,700+ Others** | Vimeo, SoundCloud, Twitch, Twitter/X, Dailymotion, direct HTTP/HTTPS media URLs |

---

## 📁 Repository Structure

```
youtubevideodownload/
├── backend/
│   ├── app/
│   │   ├── api/             # REST & WebSocket routes (extract, download, queue, health, sitemap)
│   │   ├── core/            # Configuration, SQLite persistence, rate limiting, SSRF guard
│   │   ├── schemas/         # Pydantic v2 data models & API contracts
│   │   ├── services/        # Extractor, media converter, direct stream downloader
│   │   │   └── youtube/     # Dedicated YouTube engine (formats, circuit breaker, residential fallback)
│   │   ├── utils/           # FFmpeg runtime resolver, formatters, ANSI cleaners
│   │   ├── workers/         # Asynchronous download queue & WebSocket broadcaster
│   │   └── main.py          # FastAPI application entrypoint & static SPA server
│   ├── data/                # Ephemeral SQLite database storage
│   ├── downloads/           # Local 30-minute retention cache
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── public/              # Brand icons, favicons, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/      # UI components (VireloHero, FormatControls, Navbar, Footer)
│   │   ├── pages/           # Dedicated views (Downloader, Converter, Platforms, History, About, FAQ)
│   │   ├── services/        # Axios API client & WebSocket streaming service
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/                    # Production deployment guides and audits
├── tests/                   # Python unit test suite (28 passing tests)
├── Dockerfile               # Multi-stage production container build
├── docker-compose.yml       # Production Docker deployment
├── render.yaml              # Render Cloud deployment blueprint
├── requirements.txt         # Root requirements file
└── run_dev.py               # Unified concurrent development launcher
```

---

## ⚡ Quick Start & Development

### Prerequisites
- **Python**: 3.12 or newer
- **Node.js**: 20 or newer
- **FFmpeg**: Installed and available on system PATH

### Option 1: Unified Development Launcher (Recommended)
Launch both the FastAPI backend and Vite frontend hot-reloader concurrently with a single command:
```bash
python run_dev.py
```
- **Frontend with HMR**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`

### Option 2: Production Build & Run
```bash
# 1. Build frontend bundle
cd frontend
npm install
npm run build
cd ..

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Start production server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
Open **`http://localhost:8000`** in your browser.

### Option 3: Docker Deployment
```bash
docker compose up -d --build
```
Access the application at **`http://localhost:8000`**.

---

## ☁️ Cloud Deployment (Render)

VIRELO is pre-configured for automated deployment on Render using `render.yaml`:
1. Connect your GitHub repository to Render.
2. Select **Web Service** using Docker or Python runtime.
3. Build Command: `cd frontend && npm install && npm run build && cd .. && pip install -r requirements.txt`
4. Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. *(Optional for YouTube datacenter bypass)* Set Environment Variable:
   - `RESIDENTIAL_WORKER_URL`: URL of your paired Cloudflare tunnel residential node.

---

## 🔒 Security & Safe Harbor Compliance

- **SSRF Hardening**: All user-submitted URLs pass strict hostname resolution filtering to block private RFC 1918 subnets, loopbacks (`127.0.0.1`), and cloud metadata APIs (`169.254.169.254`).
- **Path Traversal Guard**: Filename sanitization blocks non-alphanumeric directory escapes and forces output into bounded downloads directories.
- **Statutory Fair Use**: Designed strictly for lawful personal archival, education, and fair use under **17 U.S.C. § 107**.
- **No DRM Circumvention**: VIRELO does not decrypt encrypted streams (Widevine, FairPlay), bypass paid paywalls, or circumvent subscriber authentication.

---

## 🧪 Testing

Run the full automated test suite:
```bash
python -m unittest discover -s tests -p "test_*.py"
```

---

## 👤 Author & Support

- **Lead Engineer & Maintainer**: Praveen kumar
- **Email**: [praveensky2006@gmail.com](mailto:praveensky2006@gmail.com)
- **Repository**: [https://github.com/praveeneyyy/virelo](https://github.com/praveeneyyy/virelo)
