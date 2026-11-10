"""
VIRELO Centralized SEO Registry
Defines metadata, OpenGraph, JSON-LD schemas, and crawler semantic HTML for all public routes.
"""
from typing import Dict, Any, List

SITE_NAME = "VIRELO"
DEFAULT_OG_IMAGE = "/virelo-og.png"
CONTACT_EMAIL = "praveensky2006@gmail.com"

SEO_ROUTES: Dict[str, Dict[str, Any]] = {
    "/": {
        "title": "VIRELO – Online Video & Audio Downloader",
        "h1": "Download Videos & Audio Online with VIRELO",
        "description": "Download supported videos and audio online with VIRELO. Paste a media link, select available formats and quality, and save your file in a few steps.",
        "canonical": "/",
        "tab": "downloader",
        "schema_type": "WebApplication",
        "keywords": "video downloader, audio extractor, online media downloader, youtube to mp3, 4k video download, virelo"
    },
    "/platforms": {
        "title": "Supported Platforms Directory – VIRELO Media Downloader",
        "h1": "Supported Platforms & Stream Extractors",
        "description": "Explore 1,700+ verified websites and media platforms supported by VIRELO for high-fidelity video, audio, and image downloads.",
        "canonical": "/platforms",
        "tab": "platforms",
        "schema_type": "CollectionPage",
        "keywords": "supported platforms, video sites, stream extractors, youtube, tiktok, instagram, pinterest, reddit"
    },
    "/youtube-downloader": {
        "title": "YouTube Video & Audio Downloader (4K, 1080p, MP3) – VIRELO",
        "h1": "Free Online YouTube Video & Audio Downloader",
        "description": "Download YouTube videos, Shorts, and audio online in 4K, 1080p, 720p MP4 or 320 kbps MP3 with cover artwork using VIRELO.",
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
        "description": "Download public TikTok videos in HD MP4 without watermark overlays. Fast, free, and saved directly to your local folder.",
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
        "description": "Learn about VIRELO's architecture, native FFmpeg 9.0 multiplexing, yt-dlp core, zero-log guarantee, and 30-minute auto-purge storage.",
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
        "h1": "VIRELO Zero-Log Privacy Policy & Ephemeral Storage Standards",
        "description": "VIRELO's zero-log privacy policy: no IP tracking, no persistent cookies, and automatic 30-minute purging of all media files and database records.",
        "canonical": "/privacy",
        "tab": "privacy",
        "schema_type": "WebPage",
        "keywords": "virelo privacy policy, zero log downloader, 30 minute retention policy"
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
    import json
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
    """Produces crawlable semantic HTML with H1, description, instructions, and internal navigation."""
    route = SEO_ROUTES.get(route_key, SEO_ROUTES["/"])
    full_url = f"{base_url.rstrip('/')}{route['canonical']}"
    
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
        <section style="margin-bottom: 28px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">High-Fidelity Media Ingestion Engine</h2>
          <p>VIRELO is an industrial-grade universal media ingest workstation. Powered by native FFmpeg 9.0 and yt-dlp, it extracts high-resolution video and studio audio directly from public URLs without third-party ad networks, trackers, or persistent cookies.</p>
          <ul>
            <li><strong>Video Decoupling:</strong> Fetches separated DASH/HLS audio and video tracks up to 4K UHD 60fps and multiplexes them without re-encoding quality loss.</li>
            <li><strong>Audio Transcoding:</strong> High-bitrate audio export to 320 kbps MP3, M4A, FLAC, and WAV with Mutagen ID3 cover art embedding.</li>
            <li><strong>Zero-Log Ephemeral Privacy:</strong> Automatic 30-minute queue purge cycle permanently wipes files and database records.</li>
            <li><strong>SSRF Guard:</strong> Multi-layer defense preventing private subnet querying, loopback exploits, and cloud metadata access.</li>
          </ul>
        </section>

        <section style="margin-bottom: 28px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0F172A; margin-top: 0;">How to Use VIRELO</h2>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Paste Media URL:</strong> Insert a link from YouTube, Instagram, TikTok, Facebook, Pinterest, Reddit, or any of 1,700+ supported sites.</li>
            <li style="margin-bottom: 8px;"><strong>Select Format:</strong> Choose MP4 video (4K, 1080p, 720p) or studio MP3 audio.</li>
            <li style="margin-bottom: 8px;"><strong>Save to Local Folder:</strong> The file is processed locally and saved straight to your downloads directory.</li>
          </ol>
        </section>
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
    import re
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
    og_block = f"""
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{full_url}" />
    <meta property="og:site_name" content="VIRELO" />
    <meta property="og:image" content="{base_url.rstrip('/')}/virelo-og.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{base_url.rstrip('/')}/virelo-og.png" />
    """
    # Replace old OpenGraph or append
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

