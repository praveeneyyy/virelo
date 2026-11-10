# VIRELO — Render Production Deployment Guide

## Architecture Overview

VIRELO is deployed on **Render** (`https://virelo-2hu8.onrender.com/`) as a unified single-container web service built using Docker.

```
┌────────────────────────────────────────────────────────┐
│                      RENDER WEB SERVICE                │
│                                                        │
│  Stage 1: Node.js 20 Builder                           │
│  ├─ Compiles React 19 + TypeScript + Vite              │
│  └─ Outputs optimized SPA static assets to dist/       │
│                                                        │
│  Stage 2: Python 3.12 Runtime                          │
│  ├─ Installs FFmpeg & FFprobe (system binaries)        │
│  ├─ Installs Node.js & Deno (EJS challenge runtimes)   │
│  ├─ Installs yt-dlp & bgutil-ytdlp-pot-provider        │
│  ├─ Serves FastAPI REST API + WebSockets               │
│  └─ Serves SPA frontend with fallback route routing    │
└────────────────────────────────────────────────────────┘
```

---

## 1. Dockerfile Build Specification

The multi-stage `Dockerfile` guarantees that all system dependencies are reproducible across deployments:

```dockerfile
# ── Stage 1: Build Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python Application & Runtime Dependencies ──
FROM python:3.12-slim
WORKDIR /app

# Install FFmpeg, FFprobe, Node.js, and utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    nodejs \
    npm \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install official standalone Deno binary for yt-dlp EJS challenge execution
RUN curl -fsSL https://github.com/denoland/deno/releases/download/v2.2.3/deno-x86_64-unknown-linux-gnu.zip -o /tmp/deno.zip \
    && unzip /tmp/deno.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/deno \
    && rm /tmp/deno.zip

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source & compiled frontend assets
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

---

## 2. Deployment Instructions

### Automatic Deployment via Git
1. Ensure your local branch is synchronized:
   ```bash
   git status
   ```
2. Push changes to GitHub repository connected to Render:
   ```bash
   git push origin main
   ```
3. Render automatically triggers a new build using the repository `Dockerfile`.

### Verification Steps
Once Render indicates that the deployment is live:
1. Query the health check endpoint:
   ```bash
   curl -s https://virelo-2hu8.onrender.com/api/health
   ```
2. Verify the JSON response contains:
   ```json
   {
     "status": "healthy",
     "ffmpeg_available": true,
     "ffprobe_available": true,
     "node_available": true,
     "js_runtime": "deno",
     "pot_provider_available": true
   }
   ```
3. Test a public YouTube link directly in the live browser interface.

---

## 3. Production Environment Variables (Render Dashboard)

| Variable | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `PYTHONUNBUFFERED` | `1` | Ensures real-time console logging in Render log stream |
| `MAX_CONCURRENT_DOWNLOADS` | `3` | Prevents CPU starvation on 512MB/1GB Render instances |
| `DOWNLOAD_DIR` | `/tmp/downloads` | Ephemeral high-speed scratch space for media processing |
| `RATE_LIMIT_PER_MINUTE` | `30` | Abuse prevention on public endpoint |
