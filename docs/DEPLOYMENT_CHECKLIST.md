# VIRELO — Production Deployment Checklist (Render & Docker)

Use this checklist before and after every production release to https://virelo-2hu8.onrender.com/.

---

## 1. Environment & Dependencies
* [x] **Python Runtime:** Python 3.12+ (Render environment matches `requirements.txt`).
* [x] **FFmpeg 9.0:** FFmpeg and FFprobe installed and available in PATH (or `imageio-ffmpeg` fallback configured).
* [x] **Node.js:** Node runtime installed for yt-dlp EJS challenge solving.
* [x] **yt-dlp:** Current release with EJS support (`remote_components: {'ejs:github'}`).
* [x] **Database:** SQLite initialized automatically at `backend/data/virelo.db`.

---

## 2. Environment Variables Configuration (Render Dashboard)
Configure the following in your Render Web Service settings:

| Variable | Description | Recommended Value |
| :--- | :--- | :--- |
| `PYTHONUNBUFFERED` | Immediate stream logs | `1` |
| `PORT` | Listening server port | `8000` (or Render standard `$PORT`) |
| `FILE_RETENTION_MINUTES` | Ephemeral file cleanup TTL | `30` |
| `YOUTUBE_COOKIES` | Optional Netscape cookies.txt string | Paste your cookies if IP bot challenge triggers |

---

## 3. Build & Run Commands
* **Build Command:**
  ```bash
  pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..
  ```
* **Start Command:**
  ```bash
  python -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
  ```

---

## 4. Post-Deployment Verification Smoke Tests
1. **Health Check:** `GET /api/health` returns status `healthy` with FFmpeg and disk info.
2. **Homepage:** `GET /` returns 200 with `<title>VIRELO – Online Video & Audio Downloader</title>`.
3. **Dedicated Route:** `GET /youtube-downloader` returns 200 with platform-specific content and JSON-LD schema.
4. **Sitemap:** `GET /sitemap.xml` contains all canonical public routes.
5. **Robots:** `GET /robots.txt` points to `sitemap.xml` and blocks internal routes (`/api/`, `/download/`).
6. **Live Extraction Test:** Test `https://www.youtube.com/watch?v=dQw4w9WgXcQ` via `POST /api/extract` returns 49 formats.

