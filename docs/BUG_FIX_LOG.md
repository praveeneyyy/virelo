# VIRELO — Bug Fix Log

### Bug #001: YouTube Bot Verification Challenge (`Sign in to confirm you're not a bot`)
* **Discovered On:** YouTube URLs when queried from automated clients or flagged IP blocks.
* **Root Cause:** YouTube actively serves JavaScript challenges (`n`-sig and player tokens). Missing Node.js runtime prevented challenge solving.
* **Fix Implemented:**
  1. Configured automated Node.js detection (`get_node_path()`).
  2. Integrated `remote_components: {'ejs:github'}`.
  3. Created YouTube Cookie Assistant modal (`CookieBannerModal.tsx`) with file upload, direct text paste, and 10-second export guide.
  4. Added contextual recovery banner in Hero and Dedicated Platform views.
* **Verification:** Successfully parsed `k1OU4CqguLw` and `-ZnYdmreOrk`.

---

### Bug #002: YouTube Format Availability Failure (`Requested format is not available`)
* **Discovered On:** `https://www.youtube.com/watch?v=L5Z-1JlL5ss`.
* **Root Cause:**
  1. Hardcoded client override `['tv', 'android', 'web']` triggered YouTube's DRM experiment bug (yt-dlp issue #12563) and SABR experiment, causing yt-dlp to skip 1080p and audio formats.
  2. Rigid format selector strings threw errors when requested resolution combinations were not available.
* **Fix Implemented:**
  1. Removed forced `player_client` overrides.
  2. Implemented multi-tier fallback selector: `bestvideo[height<=H]+bestaudio/best[height<=H]/bestvideo+bestaudio/best`.
  3. Audio selector updated to `bestaudio/bestvideo+bestaudio/best`.
* **Verification:** Downloaded 1080p MP4 (46.7 MB) and 320 kbps MP3 (9.8 MB) of `L5Z-1JlL5ss` with zero errors.

---

### Bug #003: Pydantic Validation Error on Floating-Point Durations
* **Discovered On:** SoundCloud tracks returning fractional seconds (e.g. `10905.525s`).
* **Root Cause:** `ExtractResponse` strictly typed `duration_seconds: Optional[int] = None`.
* **Fix Implemented:**
  1. Updated `duration_seconds: Optional[Union[int, float]] = None` in `backend/app/schemas/media.py`.
  2. Applied safe rounding `int(round(float(raw.get('duration'))))` in `backend/app/services/extractor.py`.
* **Verification:** SoundCloud tracks extract and download cleanly.

---

### Bug #004: Duplicated Crawler SEO Content
* **Discovered On:** Public routes (`/youtube-downloader`, `/platforms`, `/convert`, etc.).
* **Root Cause:** `generate_crawler_html` in `backend/app/core/seo_data.py` returned an identical generic paragraph for all routes.
* **Fix Implemented:** Re-architected `seo_data.py` to generate genuinely unique, platform-tailored HTML for each route with accurate technical descriptions.
* **Verification:** All routes render distinct H1, H2, and instructions.

---

### Bug #005: Misleading Download Copy
* **Discovered On:** Frontend and SEO templates stating files are "saved straight to your downloads directory".
* **Root Cause:** Browsers do not permit websites to silently write to arbitrary local directories.
* **Fix Implemented:** Rewrote copy to state: "Download your processed file directly to your device" with verified `Content-Disposition: attachment` headers.
* **Verification:** Tested standard browser file delivery on desktop and mobile viewports.
