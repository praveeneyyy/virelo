# VIRELO — Universal Media Downloader & Transcode Workstation

<div align="center">
  <img src="frontend/public/brand/virelo-logo.svg" alt="VIRELO Logo" width="220" />
  <p><strong>Your Media. Your Way.</strong></p>
  <p>Fast, high-fidelity stream extraction and local format conversion across 1,700+ websites.</p>

  [![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![FFmpeg](https://img.shields.io/badge/FFmpeg-9.0-007808.svg?logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)
  [![yt--dlp](https://img.shields.io/badge/yt--dlp-Nightly-red.svg?logo=youtube&logoColor=white)](https://github.com/yt-dlp/yt-dlp)
  [![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
</div>

---

## Overview

**VIRELO** is an industrial-grade, privacy-respecting universal media workstation designed to extract, decouple, multiplex, and transcode digital media directly from public URLs to local storage with zero advertising injection, tracking cookies, or quality loss.

Powered by a unified **FastAPI** asynchronous backend, native **FFmpeg 9.0**, **yt-dlp**, and a high-performance **React 18 + Tailwind** client, VIRELO provides direct container stream extraction up to 4K UHD 60fps and 320 kbps constant bitrate MP3 with automated Mutagen ID3 artwork tagging.

---

## Key Features

- **1,700+ Streaming Networks & Direct Links**: Deep support for YouTube (Shorts & 4K), TikTok (Watermark-free), Instagram (Reels & Carousels), Facebook (Watch & Reels), Pinterest (Original Master HD Images), Reddit (Automatic v.redd.it audio-video muxing), Vimeo, SoundCloud, Twitch, and direct HTTP media URLs.
- **Native FFmpeg 9.0 Transcode Suite**: Convert between MP4, MKV, WebM, MP3, M4A, FLAC, WAV, and animated GIF directly in your browser or from uploaded files (`/convert`).
- **Studio 320 kbps Audio Tagging**: Extracts pristine audio tracks and automatically embeds title, artist, and original high-resolution album cover art into the container using **Mutagen**.
- **Automated 30-Minute Ephemeral Storage**: Privacy-first background garbage collector automatically purges completed media files and queue records older than 30 minutes.
- **SSRF Hardened Boundary**: Multi-layer security protecting private subnets (RFC 1918), loopback interfaces, and cloud metadata services (`169.254.169.254`).
- **Production Technical SEO & Pre-Rendering**: 14 dedicated search-optimized landing pages with dynamic JSON-LD structured data, OpenGraph cards, XML sitemaps, and clean URLs.
- **Real-Time Telemetry Bus**: Asynchronous WebSocket event streaming (`/ws/downloads`) reporting download speed, transfer percentage, and transcode stages.

---

## Dedicated Routes & Supported Workflows

| Route | Functionality |
| :--- | :--- |
| **`/`** | Complete 11-section universal media downloader and homepage |
| **`/youtube-downloader`** | Ultra HD 4K, 1080p 60fps, Shorts, and 320 kbps MP3 YouTube extractor |
| **`/instagram-downloader`**| High-definition Instagram Reels, video posts, and carousel slides |
| **`/tiktok-downloader`** | Clean TikTok MP4 video downloader without watermark overlays |
| **`/facebook-downloader`** | Full HD 1080p Facebook Watch and Reels saver |
| **`/pinterest-downloader`**| Proprietary heuristic uncompressed Pinterest master image extraction |
| **`/reddit-downloader`** | Hardware-accelerated multiplexing for silent v.redd.it video and audio |
| **`/convert`** | Drag-and-drop file transcode workstation (Video, Audio, Animated GIF) |
| **`/platforms`** | Searchable directory of 1,700+ supported extractors |
| **`/about`** | Architectural specifications, codec engine, and system philosophy |
| **`/faq`** | Comprehensive help center with categorized answers |
| **`/contact`** | Direct developer communications & support channels |
| **`/terms`** & **`/privacy`**| Statutory DMCA Safe Harbor (17 U.S.C. § 512) and Zero-Log privacy standards |

---

## Technology Stack

```
VIRELO
├── backend/
│   ├── app/
│   │   ├── api/             # REST & WebSocket endpoints (extract, download, convert, queue, sitemap)
│   │   ├── core/            # Config, database, SSRF guard, SEO registry & pre-renderer
│   │   ├── models/          # SQLite job and history models
│   │   ├── services/        # yt-dlp wrapper, FFmpeg 9.0 pipeline, direct streaming, Mutagen
│   │   ├── utils/           # Path sanitization, unit formatting, telemetry helpers
│   │   ├── workers/         # Asynchronous queue worker & WebSocket broadcast manager
│   │   └── main.py          # FastAPI application entrypoint with SPA serving
│   ├── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── public/              # Brand logos, icons, sitemap.xml, robots.txt, OG card
│   ├── src/
│   │   ├── components/      # Modular UI components (DedicatedPlatformView, VireloHero, FormatControls)
│   │   ├── context/         # Theme & Toast context providers
│   │   ├── pages/           # Dedicated route views (About, FAQ, Contact, Platforms, Converter)
│   │   ├── types/           # Strict TypeScript contracts
│   │   ├── App.tsx          # Client routing & HTML5 history synchronization
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── Dockerfile               # Multi-stage production container build
├── docker-compose.yml       # Production Docker orchestration
├── run_dev.py               # Unified local dev runner (FastAPI + Vite concurrently)
├── requirements.txt         # Root Python requirements
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python**: 3.12 or newer
- **Node.js**: 20 or newer
- **FFmpeg**: 9.0+ installed on system PATH (or auto-provisioned via `imageio-ffmpeg`)

### Option 1: Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/virelo.git
   cd virelo
   ```

2. **Install Python backend requirements:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Frontend dependencies and build:**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Launch the server:**
   ```bash
   python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
   ```
   Open your browser to **`http://localhost:8000`**.

### Option 2: Full Dev Mode with Hot Reloading

Run both the FastAPI backend and Vite frontend hot-reloader concurrently using the included launcher:
```bash
python run_dev.py
```
- **Frontend with HMR**: `http://localhost:5173`
- **Backend API & Swagger Docs**: `http://localhost:8000/docs`

### Option 3: Docker Deployment

Deploy with a single command via Docker Compose:
```bash
docker compose up -d --build
```
Access the application on port **`8000`**.

---

## Environment Variables

Copy `.env.example` to `.env` to configure runtime parameters:

```ini
APP_NAME=VIRELO
HOST=0.0.0.0
PORT=8000
DOWNLOADS_PATH=./downloads
DB_PATH=./backend/data/virelo.db
FILE_RETENTION_MINUTES=30
MAX_CONCURRENT_DOWNLOADS=3
DEFAULT_VIDEO_QUALITY=best
DEFAULT_VIDEO_FORMAT=mp4
DEFAULT_AUDIO_FORMAT=mp3
DEFAULT_AUDIO_BITRATE=320
AUTO_EMBED_THUMBNAIL=true
AUTO_EMBED_SUBTITLES=false
```

---

## Security & Compliance Notice

- **Zero-Log Ephemeral Privacy**: VIRELO does not log user IP addresses or maintain user profiles. All media files and temporary records are erased on a 30-minute automated schedule.
- **Statutory Fair Use**: Designed for lawful personal archival, research, and non-commercial fair use under **17 U.S.C. § 107**.
- **DRM Protection**: VIRELO strictly does not circumvent DRM (such as Widevine or FairPlay), paywalls, or authenticated subscriber streams.

---

## Author & Contact

- **Lead Engineer & Maintainer**: *Praveen kumar*
- **Contact Email**: [praveensky2006@gmail.com](mailto:praveensky2006@gmail.com)
- **Feedback & Issues**: Inquiries, bug reports, and extractor improvements are welcome.
