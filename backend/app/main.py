"""
VIRELO Backend Application Entrypoint.
FastAPI modular application with WebSockets, CORS, and background worker lifecycle.
"""
import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

from backend.app.core.config import settings
from backend.app.core.database import init_db, purge_expired_jobs_and_files
from backend.app.api.endpoints import router as api_router
from backend.app.workers.queue_manager import queue_manager, ws_manager
from backend.app.core.seo_data import SEO_ROUTES, inject_seo_to_html


async def retention_cleanup_loop():
    """Background task running every 60s to purge jobs and files older than 30 minutes."""
    retention_seconds = settings.FILE_RETENTION_MINUTES * 60
    while True:
        try:
            purged = purge_expired_jobs_and_files(retention_seconds)
            if purged > 0:
                print(f"[{settings.APP_NAME} Retention] Automatically purged {purged} expired job(s) and media file(s) exceeding {settings.FILE_RETENTION_MINUTES}-minute TTL.")
        except Exception as e:
            print(f"[{settings.APP_NAME} Retention Error] {e}")
        await asyncio.sleep(60)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()

    # Hydrate cookies from environment variable if configured (useful for Render/Docker deployments)
    env_cookies = os.getenv("YOUTUBE_COOKIES") or os.getenv("YTDLP_COOKIES_TEXT")
    if env_cookies and env_cookies.strip():
        cookie_dest = os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "cookies.txt"))
        os.makedirs(os.path.dirname(cookie_dest), exist_ok=True)
        try:
            with open(cookie_dest, "w", encoding="utf-8") as f:
                f.write(env_cookies.strip())
            print(f"[{settings.APP_NAME}] Loaded YouTube cookies from environment variable ({len(env_cookies)} bytes).")
        except Exception as e:
            print(f"[{settings.APP_NAME} Cookie Env Error] {e}")

    loop = asyncio.get_running_loop()
    queue_manager.set_event_loop(loop)
    cleanup_task = asyncio.create_task(retention_cleanup_loop())
    print(f"[{settings.APP_NAME}] Initialized database & background worker queue. Automatic {settings.FILE_RETENTION_MINUTES}-min retention active.")
    yield
    # Shutdown
    cleanup_task.cancel()
    print(f"[{settings.APP_NAME}] Graceful shutdown.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Universal 1,700+ Platform Media Ingest and File Processing Engine",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router under /api
app.include_router(api_router, prefix="/api")

# Also support direct /ws/downloads for client connections
from backend.app.api.endpoints import websocket_downloads_endpoint
app.add_api_websocket_route("/ws/downloads", websocket_downloads_endpoint)

# Serve static frontend if built
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")
    
    brand_dir = os.path.join(FRONTEND_DIST, "brand")
    if os.path.exists(brand_dir):
        app.mount("/brand", StaticFiles(directory=brand_dir), name="brand")

    @app.get("/favicon.ico")
    async def get_favicon():
        fav_png = os.path.join(FRONTEND_DIST, "favicon.png")
        if os.path.exists(fav_png):
            return FileResponse(fav_png, media_type="image/png")
        fav_svg = os.path.join(FRONTEND_DIST, "favicon.svg")
        if os.path.exists(fav_svg):
            return FileResponse(fav_svg, media_type="image/svg+xml")
        raise HTTPException(status_code=404)

    @app.get("/sitemap.xml")
    async def get_sitemap():
        sitemap_dist = os.path.join(FRONTEND_DIST, "sitemap.xml")
        if os.path.exists(sitemap_dist):
            return FileResponse(sitemap_dist, media_type="application/xml")
        public_sitemap = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "sitemap.xml"))
        if os.path.exists(public_sitemap):
            return FileResponse(public_sitemap, media_type="application/xml")
        raise HTTPException(status_code=404, detail="Sitemap not found")

    @app.get("/robots.txt")
    async def get_robots():
        robots_dist = os.path.join(FRONTEND_DIST, "robots.txt")
        if os.path.exists(robots_dist):
            return FileResponse(robots_dist, media_type="text/plain")
        public_robots = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "robots.txt"))
        if os.path.exists(public_robots):
            return FileResponse(public_robots, media_type="text/plain")
        return Response(content="User-agent: *\nAllow: /\nSitemap: /sitemap.xml\nDisallow: /api/\nDisallow: /ws/\n", media_type="text/plain")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str, request: Request):
        # Allow /api or /ws to pass through
        if full_path.startswith("api/") or full_path.startswith("ws/"):
            return None

        # Check if the requested file exists in FRONTEND_DIST (e.g. virelo-og.png, favicon.svg, etc.)
        candidate_file = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(candidate_file):
            return FileResponse(candidate_file)

        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            clean_path = "/" + full_path.strip("/") if full_path else "/"
            base_url = str(request.base_url).rstrip("/")
            
            # If route is in SEO registry, dynamically inject metadata and pre-rendered semantic HTML
            if clean_path in SEO_ROUTES:
                try:
                    with open(index_file, "r", encoding="utf-8") as f:
                        raw_html = f.read()
                    rendered = inject_seo_to_html(raw_html, clean_path, base_url)
                    return HTMLResponse(content=rendered, status_code=200)
                except Exception as e:
                    print(f"[SEO Inject Error] {e}")
                    return FileResponse(index_file)
            
            # Fallback SPA response
            return FileResponse(index_file)

        return HTMLResponse("<h1>VIRELO API active</h1><p>Frontend dist not found.</p>")
else:
    @app.get("/")
    async def root_info():
        return {
            "app": settings.APP_NAME,
            "version": settings.VERSION,
            "status": "ready",
            "docs": "/docs",
            "health": "/api/health",
            "message": "FastAPI backend running. Start frontend with npm run dev."
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
