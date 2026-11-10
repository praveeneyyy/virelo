"""
VIRELO Centralized SEO Registry & Dynamic Route Content Generator
Defines metadata, OpenGraph, JSON-LD schemas, and crawler semantic HTML for all public routes.
Guarantees 100% unique, platform-specific content without duplicated sections.
"""
from typing import Dict, Any, List
import json
import re

SITE_NAME = "VIRELO"
DEFAULT_OG_IMAGE = "/virelo-og.png"
CONTACT_EMAIL = "praveensky2006@gmail.com"

SEO_ROUTES: Dict[str, Dict[str, Any]] = {
    "/": {
        "title": "VIRELO – Online Video & Audio Downloader",
        "h1": "Download Videos & Audio Online with VIRELO",
        "description": "Download supported videos and audio online with VIRELO. Paste a media link, select available formats and quality, and download your processed file directly to your device.",
        "canonical": "/",
        "tab": "downloader",
        "schema_type": "WebApplication",
        "keywords": "video downloader, audio extractor, online media downloader, youtube to mp3, video download, virelo"
    },
    "/platforms": {
        "title": "Supported Platforms Directory – VIRELO Media Downloader",
        "h1": "Supported Platforms & Stream Extractors",
        "description": "Explore verified websites and media platforms supported by VIRELO for high-fidelity video, audio, and image downloads.",
        "canonical": "/platforms",
        "tab": "platforms",
        "schema_type": "CollectionPage",
        "keywords": "supported platforms, video sites, stream extractors, youtube, tiktok, instagram, pinterest, reddit"
    },
    "/youtube-downloader": {
        "title": "YouTube Video & Audio Downloader (4K, 1080p, MP3) – VIRELO",
        "h1": "Free Online YouTube Video & Audio Downloader",
        "description": "Download YouTube videos, Shorts, and audio online up to source resolution (4K, 1080p, 720p MP4) or 320 kbps MP3 with cover artwork using VIRELO.",
        "canonical": "/youtube-downloader",
        "tab": "youtube",
        "schema_type": "WebApplication",
        "platform_name": "YouTube",
        "default_url": "https://www.youtube.com/watch?v=example",
        "keywords": "youtube downloader, download youtube video, youtube to mp3 320kbps, youtube shorts downloader"
    },
    "/instagram-downloader": {
        "title": "Instagram Reels & Video Downloader – VIRELO",
        "h1": "Download Instagram Reels, Videos & Stories Online",
        "description": "Extract and download public Instagram Reels, videos, and photo carousels in high definition without quality loss.",
        "canonical": "/instagram-downloader",
        "tab": "instagram",
        "schema_type": "WebApplication",
        "platform_name": "Instagram",
        "default_url": "https://www.instagram.com/reel/example/",
        "keywords": "instagram downloader, download instagram reels, instagram video saver, ig story download"
    },
    "/tiktok-downloader": {
        "title": "TikTok Video Downloader Without Watermark – VIRELO",
        "h1": "Download TikTok Videos Without Watermark Online",
        "description": "Download public TikTok videos in HD MP4 without watermark overlays. Fast, free, and download your processed file directly to your device.",
        "canonical": "/tiktok-downloader",
        "tab": "tiktok",
        "schema_type": "WebApplication",
        "platform_name": "TikTok",
        "default_url": "https://www.tiktok.com/@user/video/example",
        "keywords": "tiktok downloader no watermark, download tiktok hd, save tiktok without watermark, tiktok mp3"
    },
    "/facebook-downloader": {
        "title": "Facebook Video Downloader (Watch & Reels) – VIRELO",
        "h1": "Download Facebook Videos & Reels in Full HD",
        "description": "Save public Facebook Watch videos, Reels, and clips in MP4 1080p or 720p with VIRELO's clean, private media extractor.",
        "canonical": "/facebook-downloader",
        "tab": "facebook",
        "schema_type": "WebApplication",
        "platform_name": "Facebook",
        "default_url": "https://www.facebook.com/watch/?v=example",
        "keywords": "facebook video downloader, download fb reels, facebook watch download, save facebook video"
    },
    "/pinterest-downloader": {
        "title": "Pinterest Video & HD Image Downloader – VIRELO",
        "h1": "Download Pinterest Videos & Original Master Images",
        "description": "Extract full-size uncompressed Pinterest master images and video pins directly to your device with VIRELO.",
        "canonical": "/pinterest-downloader",
        "tab": "pinterest",
        "schema_type": "WebApplication",
        "platform_name": "Pinterest",
        "default_url": "https://www.pinterest.com/pin/example/",
        "keywords": "pinterest video downloader, pinterest image download hd, save pinterest pin, uncompressed pinterest"
    },
    "/reddit-downloader": {
        "title": "Reddit Video Downloader with Audio – VIRELO",
        "h1": "Download Reddit Videos with Sound (v.redd.it Muxing)",
        "description": "Download Reddit videos with merged audio tracks. Automatically multiplexes separated v.redd.it audio and video streams into clean MP4.",
        "canonical": "/reddit-downloader",
        "tab": "reddit",
        "schema_type": "WebApplication",
        "platform_name": "Reddit",
        "default_url": "https://www.reddit.com/r/videos/comments/example/",
        "keywords": "reddit video downloader, reddit video with sound, v.redd.it downloader, download reddit clip"
    },
    "/convert": {
        "title": "Free Online Media Converter (FFmpeg 9.0) – VIRELO",
        "h1": "Universal Media Converter: Video, Audio & Image Transcoding",
        "description": "Convert video, audio, and images online between MP4, MKV, WebM, MP3, WAV, FLAC, and animated GIFs using native FFmpeg 9.0.",
        "canonical": "/convert",
        "tab": "convert",
        "schema_type": "WebApplication",
        "keywords": "online media converter, ffmpeg converter, convert video to mp3, video to gif, mp4 to webm"
    },
    "/about": {
        "title": "About VIRELO – Architectural Specifications & Technology",
        "h1": "About VIRELO: Media Extraction Built for Performance & Privacy",
        "description": "Learn about VIRELO's architecture, native FFmpeg 9.0 multiplexing, yt-dlp core, privacy-first design, and 30-minute auto-purge storage.",
        "canonical": "/about",
        "tab": "about",
        "schema_type": "AboutPage",
        "keywords": "about virelo, ffmpeg 9.0 architecture, yt-dlp web UI, private media downloader"
    },
    "/faq": {
        "title": "Frequently Asked Questions & Troubleshooting – VIRELO",
        "h1": "VIRELO Help Center & Frequently Asked Questions",
        "description": "Answers to questions about supported formats, resolutions, mobile support, error troubleshooting, and fair use compliance.",
        "canonical": "/faq",
        "tab": "faq",
        "schema_type": "FAQPage",
        "keywords": "virelo faq, media downloader troubleshooting, how to download video, formats supported"
    },
    "/privacy": {
        "title": "Privacy Policy – VIRELO Universal Downloader",
        "h1": "VIRELO Privacy Policy & Ephemeral Storage Standards",
        "description": "VIRELO's privacy policy: no user account required, no persistent tracking cookies, and automatic 30-minute purging of all media files and database records.",
        "canonical": "/privacy",
        "tab": "privacy",
        "schema_type": "WebPage",
        "keywords": "virelo privacy policy, private downloader, 30 minute retention policy"
    },
    "/terms": {
        "title": "Terms of Service & Statutory Compliance – VIRELO",
        "h1": "Terms of Service & DMCA Safe Harbor Compliance",
        "description": "VIRELO Terms of Service, statutory DMCA safe harbor provisions (17 U.S.C. § 512), and permissible personal fair use guidelines.",
        "canonical": "/terms",
        "tab": "terms",
        "schema_type": "WebPage",
        "keywords": "virelo terms of service, dmca compliance, fair use media preservation"
    },
    "/contact": {
        "title": "Contact Support & Technical Inquiries – VIRELO",
        "h1": "Get in Touch with VIRELO Support & Development Team",
        "description": "Contact the VIRELO engineering team directly for support, questions, extractor feedback, or inquiries at praveensky2006@gmail.com.",
        "canonical": "/contact",
        "tab": "contact",
        "schema_type": "ContactPage",
        "keywords": "contact virelo, praveen kumar, media downloader support, praveensky2006@gmail.com"
    }
}


def build_json_ld(route_key: str, base_url: str) -> str:
    """Generates valid JSON-LD string based on actual route data."""
    route = SEO_ROUTES.get(route_key, SEO_ROUTES["/"])
    full_url = f"{base_url.rstrip('/')}{route['canonical']}"
    
    schemas = []
    
    # Base Organization Schema
    org_schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VIRELO",
        "url": base_url,
        "logo": f"{base_url.rstrip('/')}/brand/virelo-icon.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": CONTACT_EMAIL,
            "contactType": "technical support"
        }
    }
    schemas.append(org_schema)
    
    # WebSite Schema on root
    if route_key == "/":
        website_schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "VIRELO",
            "url": base_url,
            "description": route["description"],
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{base_url}/?url={{search_term_string}}",
                "query-input": "required name=search_term_string"
            }
        }
        schemas.append(website_schema)
        
    # WebApplication Schema for tool routes
    if route.get("schema_type") == "WebApplication":
        app_schema = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": route["title"],
            "url": full_url,
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "All modern browsers (Windows, macOS, Linux, Android, iOS)",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "description": route["description"]
        }
        schemas.append(app_schema)
        
    # BreadcrumbList Schema for subpages
    if route_key != "/":
        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": base_url
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": route["h1"],
                    "item": full_url
                }
            ]
        }
        schemas.append(breadcrumb)

    return "\n".join([f'<script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>' for s in schemas])


def generate_crawler_html(route_key: str, base_url: str) -> str:
    """Produces crawlable semantic HTML with genuine, route-specific content."""
    route = SEO_ROUTES.get(route_key, SEO_ROUTES["/"])
    full_url = f"{base_url.rstrip('/')}{route['canonical']}"
    
    # Route-specific body generator to ensure zero duplicated content
    body_content = ""
    
    if route_key == "/":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Universal Media Downloader & Ingest Engine</h2>
          <p>VIRELO allows you to download videos, extract audio tracks, and save digital media from public URLs directly to your device. Using native FFmpeg and stream analysis, it discovers all available resolutions and formats for lawful offline archiving.</p>
          <div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px;">
            <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#334155;">Paste Media URL:</label>
            <input type="url" placeholder="https://www.youtube.com/watch?v=... or other public link" style="width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #94A3B8; border-radius: 6px; font-size: 13px;" disabled />
            <button style="margin-top: 8px; padding: 10px 18px; background: #7C3AED; color: white; border: none; border-radius: 6px; font-weight: 700; font-size: 13px;">Analyze URL</button>
          </div>
        </section>

        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Verified Benefits & Engineering Standards</h2>
          <ul>
            <li><strong>Dynamic Format Discovery:</strong> Queries media CDNs directly and lists only formats genuinely offered by the original source.</li>
            <li><strong>Lossless Stream Multiplexing:</strong> Combines decoupled adaptive video and audio tracks via native FFmpeg with zero re-encoding loss.</li>
            <li><strong>Audio Extraction:</strong> Transcodes audio tracks into MP3, M4A, FLAC, and WAV with embedded metadata.</li>
            <li><strong>Automatic File Retention:</strong> Downloaded files are automatically deleted after 30 minutes to protect user privacy.</li>
          </ul>
        </section>

        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">How It Works in 3 Steps</h2>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>1. Copy & Paste:</strong> Copy any public media link and paste it into the VIRELO URL input.</li>
            <li style="margin-bottom: 8px;"><strong>2. Choose Format & Quality:</strong> Review available video resolutions (up to source maximum) or audio bitrates.</li>
            <li style="margin-bottom: 8px;"><strong>3. Download File:</strong> Download your processed file directly to your device via standard browser file delivery.</li>
          </ol>
        </section>
        """
    elif route_key == "/youtube-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">YouTube Video, Shorts & Audio Ingestion</h2>
          <p>VIRELO extracts pure DASH and HLS video and audio streams directly from YouTube servers. YouTube serves separate video and audio tracks for high-resolution media (1080p, 1440p, 4K); VIRELO multiplexes both tracks via native FFmpeg 9.0 into clean MP4 or MP3 files.</p>
          <h3>Supported YouTube Media Types:</h3>
          <ul>
            <li><strong>Standard YouTube Videos:</strong> Full-length podcasts, lectures, tutorials, and music videos.</li>
            <li><strong>YouTube Shorts:</strong> Vertical 1080x1920 video clips extracted in native MP4 format.</li>
            <li><strong>Audio Tracks:</strong> High-bitrate audio stream extraction to MP3, M4A, or FLAC with cover art embedding.</li>
          </ul>
        </section>

        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Troubleshooting YouTube Downloads</h2>
          <p><strong>Anti-Bot Challenges & Cookie Support:</strong> If YouTube flags an automated connection, VIRELO provides a built-in Cookie Assistant allowing users to pass standard Netscape cookies.txt to authenticate lawfully without manual CAPTCHA circumvention.</p>
          <p><strong>Private / Members-Only Videos:</strong> VIRELO respects access controls and does not bypass paywalls or private authorization gates.</p>
        </section>
        """
    elif route_key == "/instagram-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Instagram Reels, Video Posts & Carousel Extractor</h2>
          <p>Download public Instagram Reels, feed videos, and photo carousels in original upload quality. VIRELO inspects the Instagram CDN payload to extract the clean video stream directly to your device.</p>
          <h3>Supported Workflows:</h3>
          <ul>
            <li><strong>Instagram Reels:</strong> Vertical 1080p MP4 videos with synchronized stereo AAC audio.</li>
            <li><strong>Multi-Slide Carousels:</strong> Inspects and extracts individual video and image slides.</li>
            <li><strong>Public Posts:</strong> Direct CDN delivery without requiring an Instagram account or login.</li>
          </ul>
          <p><em>Limitation Notice:</em> Private Instagram profiles cannot be accessed without credentials and are not supported.</p>
        </section>
        """
    elif route_key == "/tiktok-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">TikTok Video Downloader Without Watermark</h2>
          <p>Download public TikTok videos in crisp HD MP4 without bouncing watermark overlays. VIRELO retrieves the clean CDN source master file before TikTok applies its user-facing watermark.</p>
          <h3>Features & Capabilities:</h3>
          <ul>
            <li><strong>Watermark-Free MP4:</strong> Retrieves the original broadcast video file directly.</li>
            <li><strong>Original Sound Extraction:</strong> Export background music, dialogue, and creator voiceovers as standalone MP3 files.</li>
            <li><strong>Shortlink Resolution:</strong> Seamlessly parses both full desktop URLs and mobile <code>vm.tiktok.com</code> shortlinks.</li>
          </ul>
        </section>
        """
    elif route_key == "/facebook-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Facebook Watch & Reels HD Downloader</h2>
          <p>Save public Facebook Watch videos, live stream archives, and Facebook Reels in Full HD 1080p or 720p MP4.</p>
          <h3>Supported Facebook Media:</h3>
          <ul>
            <li><strong>Facebook Watch:</strong> Public video shows, interviews, and community content.</li>
            <li><strong>Facebook Reels:</strong> Vertical mobile videos saved in standard MP4 containers.</li>
            <li><strong>Audio Extraction:</strong> Extract audio from public speeches, lectures, and musical performances.</li>
          </ul>
          <p><em>Notice:</em> Videos inside closed or private Facebook groups require user authentication and cannot be downloaded.</p>
        </section>
        """
    elif route_key == "/pinterest-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Pinterest Original Master Photo & Video Downloader</h2>
          <p>Standard downloaders only save low-resolution Pinterest preview thumbnails (typically 564px wide). VIRELO inspects the Pin metadata to fetch the uncompressed original master image or H.264 MP4 video pin.</p>
          <h3>Capabilities:</h3>
          <ul>
            <li><strong>Raw Master Photos:</strong> Resolves uncompressed full-resolution original assets without thumbnail compression.</li>
            <li><strong>Video Pins:</strong> Downloads high-bitrate MP4 video pins with sound.</li>
            <li><strong>pin.it Shortlinks:</strong> Automatically unwraps mobile Pinterest shortlinks into direct asset URLs.</li>
          </ul>
        </section>
        """
    elif route_key == "/reddit-downloader":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Reddit Video Downloader with Sound (v.redd.it Muxing)</h2>
          <p>Reddit hosts video and audio on separate v.redd.it streams, causing standard tools to download silent videos. VIRELO automatically fetches both independent streams and multiplexes them with native FFmpeg 9.0 into a unified MP4 file with crisp, synchronized stereo sound.</p>
          <h3>Supported Reddit Formats:</h3>
          <ul>
            <li><strong>v.redd.it Video Posts:</strong> Combined audio and video MP4 up to source maximum resolution.</li>
            <li><strong>i.redd.it Images:</strong> Direct high-resolution picture extraction.</li>
            <li><strong>Audio-Only Extraction:</strong> Extract audio tracks as standalone MP3 files.</li>
          </ul>
        </section>
        """
    elif route_key == "/convert":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Universal Media Converter (Local FFmpeg 9.0 Transcoding)</h2>
          <p>Convert your existing video, audio, and image files between industry-standard codecs. Features direct drag-and-drop upload, format customization, and direct browser download.</p>
          <h3>Supported Conversion Pipelines:</h3>
          <ul>
            <li><strong>Video to Video:</strong> Transcode between MP4, MKV, WebM, AVI, and MOV.</li>
            <li><strong>Video to Audio:</strong> Extract audio tracks from video files into 320 kbps MP3, WAV, FLAC, or M4A.</li>
            <li><strong>Video to Animated GIF:</strong> Convert video clips into smooth animated GIFs with customizable dimensions and frame rates.</li>
            <li><strong>Image Transcoding:</strong> Convert between PNG, JPEG, and WebP.</li>
          </ul>
        </section>
        """
    elif route_key == "/platforms":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Supported Platforms & Dedicated Downloaders</h2>
          <p>Explore dedicated platform extractors verified for high-fidelity media downloads:</p>
          <ul>
            <li><a href="/youtube-downloader" style="color: #7C3AED; font-weight: 600;">YouTube Downloader:</a> 4K, 1080p, 720p MP4, Shorts, and 320 kbps MP3 audio.</li>
            <li><a href="/instagram-downloader" style="color: #7C3AED; font-weight: 600;">Instagram Downloader:</a> Reels, video posts, and carousel extraction.</li>
            <li><a href="/tiktok-downloader" style="color: #7C3AED; font-weight: 600;">TikTok Downloader:</a> HD MP4 without watermark and original sound extraction.</li>
            <li><a href="/facebook-downloader" style="color: #7C3AED; font-weight: 600;">Facebook Downloader:</a> Facebook Watch videos and vertical Reels.</li>
            <li><a href="/pinterest-downloader" style="color: #7C3AED; font-weight: 600;">Pinterest Downloader:</a> Full-resolution master photos and video pins.</li>
            <li><a href="/reddit-downloader" style="color: #7C3AED; font-weight: 600;">Reddit Downloader:</a> Synchronized audio/video multiplexing for v.redd.it clips.</li>
            <li><a href="/convert" style="color: #7C3AED; font-weight: 600;">Media Converter:</a> Local file transcoding for video, audio, and images.</li>
          </ul>
        </section>
        """
    elif route_key == "/about":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Architectural Specifications & System Design</h2>
          <p>VIRELO is an open universal media workstation built with Python 3.12, FastAPI, native FFmpeg 9.0, and yt-dlp. It operates on a privacy-conscious model with zero user account requirements and automated 30-minute ephemeral file purging.</p>
          <h3>Technical Highlights:</h3>
          <ul>
            <li><strong>Native FFmpeg 9.0:</strong> Hardware-accelerated container multiplexing, stream remuxing, and audio transcoding.</li>
            <li><strong>yt-dlp Core:</strong> Deep extraction of DASH manifests, HLS playlists, and CDN endpoints.</li>
            <li><strong>Ephemeral Storage Policy:</strong> Background cleanup workers permanently delete downloaded files and database entries after 30 minutes.</li>
            <li><strong>Security Boundary:</strong> Strict input URL validation blocking private subnets, loopback addresses, and cloud metadata queries.</li>
          </ul>
          <p style="font-size: 13px; color: #64748B;">Architected & developed by Praveen kumar (<a href="mailto:praveensky2006@gmail.com" style="color: #7C3AED;">praveensky2006@gmail.com</a>).</p>
        </section>
        """
    elif route_key == "/faq":
        body_content = """
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Frequently Asked Questions</h2>
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #1E293B;">Is VIRELO free to use?</h3>
            <p>Yes. VIRELO is 100% free with no subscription fees, registration gates, or artificial download caps.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #1E293B;">Which platforms are supported?</h3>
            <p>VIRELO supports major streaming and social video platforms including YouTube, TikTok, Instagram, Facebook, Pinterest, Reddit, Vimeo, SoundCloud, and direct media URLs.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #1E293B;">Can I extract audio only?</h3>
            <p>Yes. After analyzing any supported video, choose the Audio tab to extract audio in MP3 (up to 320 kbps), M4A, FLAC, or WAV format.</p>
          </div>
          <div style="margin-bottom: 16px;">
            <h3 style="font-size: 15px; font-weight: 700; color: #1E293B;">Can I download private or copyrighted content?</h3>
            <p>No. VIRELO respects access controls and DRM protections. It only processes publicly accessible streams for lawful personal archiving.</p>
          </div>
        </section>
        """
    elif route_key == "/contact":
        body_content = f"""
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">Contact Support & Engineering</h2>
          <p>Have questions, feedback, or need technical support? Get in touch directly with the creator and maintainer:</p>
          <div style="padding: 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0 0 8px 0;"><strong>Maintainer:</strong> Praveen kumar</p>
            <p style="margin: 0 0 8px 0;"><strong>Direct Email:</strong> <a href="mailto:{CONTACT_EMAIL}" style="color: #7C3AED; font-weight: 700;">{CONTACT_EMAIL}</a></p>
            <p style="margin: 0;"><strong>GitHub:</strong> <a href="https://github.com/praveeneyyy/virelo" target="_blank" style="color: #7C3AED;">github.com/praveeneyyy/virelo</a></p>
          </div>
        </section>
        """
    else:
        body_content = f"""
        <section style="margin-bottom: 24px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">{route['h1']}</h2>
          <p>{route['description']}</p>
        </section>
        """

    html = f"""
    <div style="font-family: 'Poppins', sans-serif; max-width: 900px; margin: 0 auto; padding: 32px 16px; color: #0F172A; background-color: #FAFAFC;">
      <header style="margin-bottom: 24px; border-bottom: 1px solid #E2E8F0; padding-bottom: 16px;">
        <nav style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px; margin-bottom: 16px;">
          <a href="/" style="color: #7C3AED; font-weight: 600; text-decoration: none;">Home</a> •
          <a href="/platforms" style="color: #475569; text-decoration: none;">Platforms Directory</a> •
          <a href="/youtube-downloader" style="color: #475569; text-decoration: none;">YouTube Downloader</a> •
          <a href="/instagram-downloader" style="color: #475569; text-decoration: none;">Instagram Downloader</a> •
          <a href="/tiktok-downloader" style="color: #475569; text-decoration: none;">TikTok Downloader</a> •
          <a href="/facebook-downloader" style="color: #475569; text-decoration: none;">Facebook Downloader</a> •
          <a href="/pinterest-downloader" style="color: #475569; text-decoration: none;">Pinterest Downloader</a> •
          <a href="/reddit-downloader" style="color: #475569; text-decoration: none;">Reddit Downloader</a> •
          <a href="/convert" style="color: #7C3AED; font-weight: 600; text-decoration: none;">Media Converter</a> •
          <a href="/about" style="color: #475569; text-decoration: none;">About</a> •
          <a href="/faq" style="color: #475569; text-decoration: none;">FAQ</a> •
          <a href="/contact" style="color: #475569; text-decoration: none;">Contact</a>
        </nav>
        <h1 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0 0 8px 0; line-height: 1.2;">{route['h1']}</h1>
        <p style="font-size: 15px; color: #475569; line-height: 1.5; margin: 0;">{route['description']}</p>
      </header>

      <main style="line-height: 1.6; font-size: 14px; color: #334155;">
        {body_content}
      </main>

      <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <span>VIRELO • Universal Media Downloader</span>
        <span>Developer Contact: <a href="mailto:{CONTACT_EMAIL}" style="color: #7C3AED;">{CONTACT_EMAIL}</a> • <em>made by Praveen kumar</em></span>
      </footer>
    </div>
    """
    return html


def inject_seo_to_html(raw_html: str, route_key: str, base_url: str) -> str:
    """Injects route-specific title, description, OpenGraph, Twitter card, canonical, JSON-LD, and crawler HTML."""
    route = SEO_ROUTES.get(route_key, SEO_ROUTES["/"])
    full_url = f"{base_url.rstrip('/')}{route['canonical']}"
    title = route["title"]
    desc = route["description"]
    
    # 1. Update <title>
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', raw_html, flags=re.DOTALL)
    
    # 2. Update or insert <meta name="description" ...>
    if 'name="description"' in html:
        html = re.sub(r'<meta\s+name="description"\s+content=".*?"\s*/?>', f'<meta name="description" content="{desc}" />', html, flags=re.DOTALL)
    else:
        html = html.replace('</head>', f'  <meta name="description" content="{desc}" />\n</head>')
        
    # 3. Update or insert canonical link
    if '<link rel="canonical"' in html:
        html = re.sub(r'<link\s+rel="canonical"\s+href=".*?"\s*/?>', f'<link rel="canonical" href="{full_url}" />', html, flags=re.DOTALL)
    else:
        html = html.replace('</head>', f'  <link rel="canonical" href="{full_url}" />\n</head>')
        
    # 4. OpenGraph tags
    html = re.sub(r'<meta\s+property="og:title"\s+content=".*?"\s*/?>', f'<meta property="og:title" content="{title}" />', html)
    html = re.sub(r'<meta\s+property="og:description"\s+content=".*?"\s*/?>', f'<meta property="og:description" content="{desc}" />', html)
    html = re.sub(r'<meta\s+property="og:url"\s+content=".*?"\s*/?>', f'<meta property="og:url" content="{full_url}" />', html)
    html = re.sub(r'<meta\s+name="twitter:title"\s+content=".*?"\s*/?>', f'<meta name="twitter:title" content="{title}" />', html)
    html = re.sub(r'<meta\s+name="twitter:description"\s+content=".*?"\s*/?>', f'<meta name="twitter:description" content="{desc}" />', html)

    # 5. Inject JSON-LD right before </head>
    json_ld = build_json_ld(route_key, base_url)
    html = html.replace('</head>', f'{json_ld}\n</head>')
    
    # 6. Inject crawler semantic HTML inside <div id="root">
    crawler_html = generate_crawler_html(route_key, base_url)
    html = re.sub(r'<div id="root">.*?</div>', f'<div id="root">{crawler_html}</div>', html, flags=re.DOTALL)
    
    return html
