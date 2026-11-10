import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  Sliders, 
  FileVideo, 
  FileAudio, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap
} from 'lucide-react';
import { ViewTab, MediaInfo, DownloadPayload, DownloadJob } from '../types';
import { FormatControls } from './FormatControls';
import { MediaPreview } from './MediaPreview';
import { DownloadProgress } from './DownloadProgress';
import { PlatformIcon } from './PlatformIcons';

export type DedicatedPlatformKey = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'pinterest' | 'reddit';

interface DedicatedPlatformViewProps {
  platform: DedicatedPlatformKey;
  onNavigate: (tab: ViewTab) => void;
  // Ingest Pipeline Hooks
  url: string;
  setUrl: (url: string) => void;
  isExtracting: boolean;
  extractError: string | null;
  mediaInfo: MediaInfo | null;
  onExtract: () => void;
  onStartDownload: (payload: DownloadPayload) => void;
  isStartingDownload: boolean;
  activeJob: DownloadJob | null;
  onCancelJob: (id: string) => void;
  onRetryJob: (id: string) => void;
}

interface PlatformConfig {
  name: string;
  badge: string;
  h1: string;
  tagline: string;
  description: string;
  placeholder: string;
  sampleUrl: string;
  color: string;
  features: { title: string; desc: string }[];
  steps: { title: string; desc: string }[];
  troubleshooting: { q: string; a: string }[];
  faqs: { q: string; a: string }[];
}

const PLATFORM_CONFIGS: Record<DedicatedPlatformKey, PlatformConfig> = {
  youtube: {
    name: 'YouTube',
    badge: 'YouTube Extractor Engine',
    h1: 'Free Online YouTube Video & Audio Downloader',
    tagline: 'Save YouTube Videos, Shorts & Playlists in 4K, 1080p, or 320 kbps MP3',
    description: 'VIRELO extracts pure DASH and HLS video and audio streams directly from YouTube servers. Decoupled audio/video tracks are automatically multiplexed into standard MP4 or MP3 files with zero transcoding loss.',
    placeholder: 'Paste YouTube URL (e.g., https://www.youtube.com/watch?v=... or shorts/...)',
    sampleUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    color: '#FF0000',
    features: [
      { title: '4K & 1080p 60fps', desc: 'Preserves raw VP9 and AV1 high-bitrate video streams without compression artifacts.' },
      { title: '320 kbps Studio Audio', desc: 'Direct audio track extraction to MP3, M4A, or FLAC with embedded ID3 metadata & cover art.' },
      { title: 'Shorts & Playlists', desc: 'Full support for vertical YouTube Shorts links and complete multi-video playlist parsing.' }
    ],
    steps: [
      { title: '1. Copy the YouTube Link', desc: 'Open YouTube in your browser or app, click Share, and copy the video, Short, or audio URL.' },
      { title: '2. Paste and Analyze', desc: 'Paste the URL into the VIRELO box above and press "Analyze & Download".' },
      { title: '3. Choose Quality & Save', desc: 'Select your preferred resolution (4K, 1080p, 720p) or MP3 bitrate. The file downloads directly to your device.' }
    ],
    troubleshooting: [
      { q: 'Why do some videos only offer 720p without audio multiplexing?', a: 'YouTube provides combined audio+video streams up to 720p only. For 1080p and 4K, YouTube serves separated video and audio tracks. VIRELO automatically multiplexes both tracks via native FFmpeg 9.0 to deliver seamless 1080p and 4K MP4 files.' },
      { q: 'Can I download private or members-only videos?', a: 'No. VIRELO strictly adheres to security protocols and will not bypass authentication paywalls, DRM, or private authorization gates.' },
      { q: 'Are YouTube Shorts supported?', a: 'Yes! Simply paste any standard youtube.com/shorts/... URL and VIRELO will parse the vertical video stream at native 1080x1920 resolution.' }
    ],
    faqs: [
      { q: 'Is there a limit on YouTube video duration?', a: 'VIRELO handles both short clips and lengthy multi-hour podcasts or concerts without arbitrary time capping.' },
      { q: 'Does VIRELO inject watermarks into downloaded YouTube videos?', a: 'Never. All files are 100% clean and identical to the original broadcast stream.' },
      { q: 'Can I extract MP3 audio only?', a: 'Yes, select the Audio tab after analysis to extract 320 kbps MP3 with full artist and title tags.' }
    ]
  },
  instagram: {
    name: 'Instagram',
    badge: 'Instagram Reels & Stories Engine',
    h1: 'Download Instagram Reels, Videos & Stories Online',
    tagline: 'High-Definition MP4 and JPEG Carousel Extraction from Public Profiles',
    description: 'Easily save Instagram Reels, timeline video posts, carousel photos, and public stories. VIRELO extracts the primary CDN video stream directly to your local drive without compression.',
    placeholder: 'Paste Instagram URL (e.g., https://www.instagram.com/reel/... or /p/...)',
    sampleUrl: 'https://www.instagram.com/reel/C3x4yZz1234/',
    color: '#E4405F',
    features: [
      { title: 'Full 1080p HD Reels', desc: 'Downloads vertical Reels in their native 1080x1920 portrait format.' },
      { title: 'Multi-Slide Carousels', desc: 'Inspects and extracts individual video and photo slides from carousel posts.' },
      { title: 'Clean MP4 Containers', desc: 'Ensures immediate playback on iOS, Android, macOS, and Windows media players.' }
    ],
    steps: [
      { title: '1. Copy the Instagram Reel Link', desc: 'Tap the three dots (⋯) or Share icon on Instagram and select "Copy Link".' },
      { title: '2. Paste into VIRELO', desc: 'Insert the copied link into the input field above and click "Analyze & Download".' },
      { title: '3. Save Directly', desc: 'Choose MP4 video or MP3 audio and save your file locally with one click.' }
    ],
    troubleshooting: [
      { q: 'Why did the extraction fail for a specific Instagram post?', a: 'The account hosting the post may be set to Private. VIRELO cannot access private profiles without authorization. Verify that the post is viewable in an incognito window.' },
      { q: 'How do I download multiple photos from a carousel?', a: 'Paste the carousel URL. VIRELO scans the multi-item payload and offers each media asset individually.' }
    ],
    faqs: [
      { q: 'Do I need an Instagram account or login?', a: 'No. VIRELO requires no login, passwords, or personal credentials.' },
      { q: 'Are audio tracks in Reels preserved?', a: 'Yes, audio is fully synchronized with the video stream in high-fidelity stereo AAC.' }
    ]
  },
  tiktok: {
    name: 'TikTok',
    badge: 'TikTok No-Watermark Extractor',
    h1: 'Download TikTok Videos Without Watermark Online',
    tagline: 'Clean HD MP4 Video & Original Audio Sound Extraction',
    description: 'Download public TikTok videos in pristine HD without the bouncing watermark overlay. Save original creator audio tracks as MP3 for offline remixing and reference.',
    placeholder: 'Paste TikTok URL (e.g., https://www.tiktok.com/@user/video/... or https://vm.tiktok.com/...)',
    sampleUrl: 'https://www.tiktok.com/@creator/video/1234567890123456789',
    color: '#00F2FE',
    features: [
      { title: 'No Watermark Overlay', desc: 'Retrieves the clean server master file before TikTok overlays the moving logo.' },
      { title: 'Original Sound MP3', desc: 'Extract background songs and voiceovers as independent high-bitrate audio files.' },
      { title: 'Shortlink Support', desc: 'Accepts both full web URLs and mobile vm.tiktok.com or vt.tiktok.com shortlinks.' }
    ],
    steps: [
      { title: '1. Copy TikTok Link', desc: 'Tap Share on any TikTok video and select "Copy Link".' },
      { title: '2. Paste in VIRELO', desc: 'Paste the link in the input bar and click "Analyze & Download".' },
      { title: '3. Download Watermark-Free', desc: 'Select the clean MP4 video format and download straight to your storage.' }
    ],
    troubleshooting: [
      { q: 'Why does the video show a watermark if I download through other tools?', a: 'Many basic tools record the user-facing playback canvas. VIRELO queries the original video CDN origin, retrieving the pre-watermarked source MP4.' },
      { q: 'Can I download private TikTok videos?', a: 'No. The video must be set to public visibility by the creator.' }
    ],
    faqs: [
      { q: 'Is downloading TikTok videos free?', a: 'Yes, 100% free with unlimited downloads and no daily bandwidth throttle.' },
      { q: 'Does it work on mobile phones?', a: 'Yes, fully responsive on iPhone (Safari) and Android (Chrome) devices.' }
    ]
  },
  facebook: {
    name: 'Facebook',
    badge: 'Facebook Watch & Reels Hub',
    h1: 'Download Facebook Videos & Reels in Full HD',
    tagline: 'Save Public Facebook Watch, Group & Timeline Videos in 1080p MP4',
    description: 'Download Facebook Watch videos, live stream archives, Reels, and community clips in crystal-clear Full HD 1080p or 720p without compression artifacts.',
    placeholder: 'Paste Facebook Video URL (e.g., https://www.facebook.com/watch/?v=... or /reel/...)',
    sampleUrl: 'https://www.facebook.com/watch/?v=123456789',
    color: '#1877F2',
    features: [
      { title: '1080p Full HD Streams', desc: 'Extracts the highest available bitrate stream directly from Facebook video CDNs.' },
      { title: 'Facebook Reels Support', desc: 'Optimized parsing for vertical short-form Facebook Reels.' },
      { title: 'Audio Extraction', desc: 'Convert speech, lectures, and musical performances to MP3 audio.' }
    ],
    steps: [
      { title: '1. Copy Facebook Video URL', desc: 'Click the Share button on the Facebook video and copy the link to clipboard.' },
      { title: '2. Paste in VIRELO', desc: 'Insert the URL in the box above and click "Analyze & Download".' },
      { title: '3. Choose HD Resolution', desc: 'Select 1080p or 720p MP4 and save to your computer or phone.' }
    ],
    troubleshooting: [
      { q: 'Can VIRELO download videos from private Facebook groups?', a: 'No. VIRELO only processes publicly accessible videos that can be viewed without logging in.' },
      { q: 'What if Facebook only shows SD quality?', a: 'VIRELO displays all resolutions published by the original uploader. If 1080p is available, it will be listed in the quality dropdown.' }
    ],
    faqs: [
      { q: 'Are live streams supported?', a: 'Completed live stream recordings can be downloaded once Facebook finishes processing the archive.' },
      { q: 'Can I extract MP3 audio from Facebook talks?', a: 'Yes, toggle the Audio tab after analysis to extract pure audio.' }
    ]
  },
  pinterest: {
    name: 'Pinterest',
    badge: 'Pinterest HD Master Extractor',
    h1: 'Download Pinterest Videos & Original Master Images',
    tagline: 'Direct Extraction of High-Resolution Pins & Uncompressed Master Photos',
    description: 'Most tools only download low-resolution Pinterest thumbnails. VIRELO proprietary heuristic parsing reconstructs original uncompressed master photography and video pins at their absolute highest fidelity.',
    placeholder: 'Paste Pinterest Pin URL (e.g., https://www.pinterest.com/pin/... or https://pin.it/...)',
    sampleUrl: 'https://www.pinterest.com/pin/1234567890/',
    color: '#BD081C',
    features: [
      { title: 'Raw Master Photo Extraction', desc: 'Converts 236x/564x thumbnails into raw uncompressed /originals/ image files.' },
      { title: 'Pinterest Video Pins', desc: 'Extracts H.264 MP4 video pins with clean stereo audio tracks.' },
      { title: 'pin.it Shortlink Parser', desc: 'Automatically unwraps mobile Pinterest shortlinks into direct asset URLs.' }
    ],
    steps: [
      { title: '1. Copy Pinterest Pin Link', desc: 'Open the Pin, click the Share icon, and select "Copy link".' },
      { title: '2. Paste into VIRELO', desc: 'Paste the link above and click "Analyze & Download".' },
      { title: '3. Download Uncompressed Asset', desc: 'Click to download the full-resolution master photo or video pin.' }
    ],
    troubleshooting: [
      { q: 'Why are other websites giving me blurry Pinterest pictures?', a: 'Other tools grab the preview image displayed on the Pinterest page (usually 564px wide). VIRELO rewrites the URL protocol to fetch the original resolution image uploaded by the creator.' },
      { q: 'Are pin.it shortlinks supported?', a: 'Yes, mobile shortlinks like https://pin.it/abc123 are automatically resolved to their full pin destination.' }
    ],
    faqs: [
      { q: 'Can I download animated GIF pins?', a: 'Yes, GIF pins are extracted as native animated GIFs or converted to MP4 for maximum compatibility.' }
    ]
  },
  reddit: {
    name: 'Reddit',
    badge: 'Reddit v.redd.it Audio Muxer',
    h1: 'Download Reddit Videos with Sound (v.redd.it Muxing)',
    tagline: 'Automatic Hardware-Accelerated Multiplexing for Reddit Video & Audio',
    description: 'Reddit hosts video and audio on separate v.redd.it streams, which is why standard downloaders produce silent videos. VIRELO automatically multiplexes the independent video and audio streams using native FFmpeg 9.0 into a unified, high-definition MP4 file with crisp sound.',
    placeholder: 'Paste Reddit Post URL (e.g., https://www.reddit.com/r/.../comments/...)',
    sampleUrl: 'https://www.reddit.com/r/videos/comments/example_post/',
    color: '#FF4500',
    features: [
      { title: 'Synchronized Stereo Audio', desc: 'Automatically binds decoupled DASH audio and video streams together.' },
      { title: '1080p & 720p HD MP4', desc: 'Fetches the highest bitrate MP4 container without video re-encoding.' },
      { title: 'Reddit GIF & Image Posts', desc: 'Also supports i.redd.it images and third-party Imgur/Gfycat embeds.' }
    ],
    steps: [
      { title: '1. Copy Reddit Post Link', desc: 'Click Share on any Reddit post containing a video and copy the link.' },
      { title: '2. Paste in VIRELO', desc: 'Paste the URL into the input field above and click "Analyze & Download".' },
      { title: '3. Save Unified MP4 with Audio', desc: 'VIRELO merges the sound track and delivers a ready-to-watch MP4 directly to your device.' }
    ],
    troubleshooting: [
      { q: 'Why did my Reddit video have no sound when downloaded elsewhere?', a: 'Reddit uses adaptive DASH streaming, keeping video files (DASH_1080.mp4) completely separate from audio files (DASH_audio.mp4). VIRELO downloads both and uses local FFmpeg 9.0 to remux them in milliseconds.' },
      { q: 'Are NSFW or 18+ Reddit posts supported?', a: 'As long as the post is publicly accessible on Reddit without account login gating, VIRELO will parse and extract the media.' }
    ],
    faqs: [
      { q: 'Does VIRELO compress Reddit videos?', a: 'No. Stream copying is used so the original video codec and bitrate are preserved 1:1.' },
      { q: 'Can I download just the audio track?', a: 'Yes, select the Audio tab to save the extracted sound as an MP3.' }
    ]
  }
};

const ALL_PLATFORMS: { key: DedicatedPlatformKey; name: string; path: string; tab: ViewTab }[] = [
  { key: 'youtube', name: 'YouTube', path: '/youtube-downloader', tab: 'youtube' },
  { key: 'instagram', name: 'Instagram', path: '/instagram-downloader', tab: 'instagram' },
  { key: 'tiktok', name: 'TikTok', path: '/tiktok-downloader', tab: 'tiktok' },
  { key: 'facebook', name: 'Facebook', path: '/facebook-downloader', tab: 'facebook' },
  { key: 'pinterest', name: 'Pinterest', path: '/pinterest-downloader', tab: 'pinterest' },
  { key: 'reddit', name: 'Reddit', path: '/reddit-downloader', tab: 'reddit' }
];

export const DedicatedPlatformView: React.FC<DedicatedPlatformViewProps> = ({
  platform,
  onNavigate,
  url,
  setUrl,
  isExtracting,
  extractError,
  mediaInfo,
  onExtract,
  onStartDownload,
  isStartingDownload,
  activeJob,
  onCancelJob,
  onRetryJob
}) => {
  const config = PLATFORM_CONFIGS[platform];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const otherPlatforms = ALL_PLATFORMS.filter(p => p.key !== platform);

  const handlePasteSample = () => {
    setUrl(config.sampleUrl);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onExtract();
    }
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION 1: DEDICATED HERO & INGESTION BOX */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        
        {/* Platform Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-700">
          <PlatformIcon platform={config.name} size={15} />
          <span>{config.badge}</span>
        </div>

        {/* SEO H1 Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {config.h1}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          {config.tagline}
        </p>

        {/* URL Input Box */}
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            
            <div className="flex-1 flex items-center px-3 py-1.5 gap-2.5 min-w-0">
              <PlatformIcon platform={config.name} size={20} className="shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={config.placeholder}
                aria-label={`Enter ${config.name} URL`}
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none truncate font-medium"
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setUrl(text);
                  } catch {
                    // Clipboard access restricted
                  }
                }}
                className="hidden sm:inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Paste
              </button>

              <button
                type="button"
                onClick={onExtract}
                disabled={isExtracting || !url.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Analyze & Download</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Quick Helper Subtext */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2.5 px-2 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>Direct CDN stream discovery & zero re-encoding</span>
            </div>
            <button
              onClick={handlePasteSample}
              className="text-violet-600 hover:text-violet-700 font-medium underline"
            >
              Try sample {config.name} link
            </button>
          </div>
        </div>

        {extractError && (
          (extractError.includes('YOUTUBE_CLOUD_IP_RESTRICTED') || extractError.includes('YOUTUBE_CHALLENGE_REQUIRED') || extractError.includes('restricting automated downloads from our hosting environment')) ? (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-left text-xs sm:text-sm text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <strong className="font-semibold block text-amber-950">Platform Restriction Notice</strong>
                <span className="leading-snug block">
                  YouTube is currently restricting automated downloads from our hosting environment. Your link may be valid, but VIRELO cannot retrieve this media at the moment. You can try again later or use an available alternative.
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-left text-xs text-red-700 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-semibold block text-red-900 mb-0.5">Stream Analysis Notice</strong>
                <span>{extractError}</span>
              </div>
            </div>
          )
        )}

      </section>

      {/* SECTION 2: LIVE MEDIA PREVIEW & CONTROLS IF URL EXTRACTED */}
      {mediaInfo && (
        <section className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Stream Verified</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{mediaInfo.platform}</span>
          </div>

          <MediaPreview mediaInfo={mediaInfo} />

          {mediaInfo.restriction_notice ? (
            <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-amber-950">Automated Stream Extraction Restricted by Upstream Platform</h4>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    YouTube has restricted automated stream retrieval for this specific media from cloud hosting provider IP ranges (Render/AWS). Metadata, thumbnail, and author details were verified successfully via YouTube’s official API.
                  </p>
                </div>
              </div>

              {/* Actionable Alternatives */}
              <div className="pt-2 border-t border-amber-200/80 space-y-3">
                <span className="text-xs font-semibold text-amber-950 block">Available Legitimate Alternatives:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/70 space-y-2">
                    <span className="text-xs font-semibold text-slate-900 block flex items-center gap-1.5">
                      <RefreshCw size={13} className="text-purple-600" />
                      Convert Existing Media
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Already have this file on your device? Transcode, extract MP3/FLAC/WAV audio, or create GIFs with native FFmpeg processing.
                    </p>
                    <a
                      href="/converter"
                      className="inline-block px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors"
                    >
                      Open Media Converter →
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/70 space-y-2">
                    <span className="text-xs font-semibold text-slate-900 block flex items-center gap-1.5">
                      <ExternalLink size={13} className="text-blue-600" />
                      Watch on YouTube
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Access and stream this media directly on YouTube via official player applications.
                    </p>
                    <a
                      href={mediaInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                    >
                      Watch on YouTube ↗
                    </a>
                  </div>
                </div>

                <div className="text-[11px] text-amber-800/90 pt-1">
                  💡 <strong>Tip for local users:</strong> Run VIRELO locally via <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-amber-900">python run_dev.py</code> to download any video without cloud hosting IP restrictions.
                </div>
              </div>
            </div>
          ) : (
            <FormatControls
              mediaInfo={mediaInfo}
              onDownload={onStartDownload}
              isLoading={isStartingDownload}
            />
          )}
        </section>
      )}

      {/* SECTION 3: ACTIVE DOWNLOAD PROGRESS */}
      {activeJob && (
        <section className="max-w-3xl mx-auto">
          <DownloadProgress
            job={activeJob}
            onCancel={onCancelJob}
            onRetry={onRetryJob}
          />
        </section>
      )}

      {/* SECTION 4: PLATFORM CORE CAPABILITIES */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {config.features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-violet-300 transition-all space-y-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: STEP-BY-STEP HOW TO DOWNLOAD */}
      <section className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            How to Download from {config.name} in 3 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No software installation required. Save videos and audio directly from your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {config.steps.map((step, idx) => (
            <div key={idx} className="space-y-2 relative">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: SUPPORTED CODECS & SPECIFICATIONS TABLE */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sliders size={18} className="text-violet-600" />
            <span>{config.name} Stream Specifications & Codec Support</span>
          </h2>
          <p className="text-xs text-slate-500">
            VIRELO dynamically detects available container streams and bitrates directly from the host CDN.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Output Format</th>
                <th className="py-3 px-4">Max Quality / Resolution</th>
                <th className="py-3 px-4">Underlying Codec</th>
                <th className="py-3 px-4">Compatibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                  <FileVideo size={14} className="text-violet-600" />
                  <span>MP4 Video</span>
                </td>
                <td className="py-3 px-4">4K UHD (2160p) / 1080p FHD</td>
                <td className="py-3 px-4 font-mono">H.264 / AVC1 / VP9</td>
                <td className="py-3 px-4">Universal (iOS, Android, Mac, PC, TV)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                  <FileVideo size={14} className="text-violet-600" />
                  <span>WebM / MKV</span>
                </td>
                <td className="py-3 px-4">8K / 4K 60fps HDR</td>
                <td className="py-3 px-4 font-mono">AV01 / VP9.2</td>
                <td className="py-3 px-4">VLC, Modern Browsers, Media Servers</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                  <FileAudio size={14} className="text-emerald-600" />
                  <span>MP3 Audio</span>
                </td>
                <td className="py-3 px-4">320 kbps Constant Bitrate</td>
                <td className="py-3 px-4 font-mono">MPEG Layer 3 (Mutagen tagged)</td>
                <td className="py-3 px-4">Car audio, MP3 players, smartphones</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                  <FileAudio size={14} className="text-emerald-600" />
                  <span>M4A / AAC</span>
                </td>
                <td className="py-3 px-4">256 kbps Native Stream</td>
                <td className="py-3 px-4 font-mono">Advanced Audio Coding</td>
                <td className="py-3 px-4">Apple Music, iTunes, QuickTime</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 7: PLATFORM SPECIFIC TROUBLESHOOTING & FAQ */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle size={18} className="text-violet-600" />
            <span>Frequently Asked Questions & Troubleshooting</span>
          </h2>
          <p className="text-xs text-slate-500">
            Answers to common questions regarding {config.name} stream parsing, errors, and formatting.
          </p>
        </div>

        <div className="space-y-2.5">
          {[...config.troubleshooting, ...config.faqs].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-900">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-violet-600 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 8: INTERNAL CROSS-LINKING GRID */}
      <section className="max-w-5xl mx-auto pt-6 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Explore Other Supported Downloaders</h3>
            <p className="text-xs text-slate-500">Fast, private extraction across all major media networks</p>
          </div>
          <button
            onClick={() => onNavigate('platforms')}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
          >
            <span>View all 1,700+ platforms</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {otherPlatforms.map((p) => (
            <button
              key={p.key}
              onClick={() => onNavigate(p.tab)}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-violet-400 hover:shadow-sm text-center flex flex-col items-center gap-2 transition-all group"
            >
              <PlatformIcon platform={p.name} size={22} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-800">{p.name}</span>
            </button>
          ))}
          <button
            onClick={() => onNavigate('convert')}
            className="p-3 rounded-xl bg-violet-50/50 border border-violet-200 hover:border-violet-400 text-center flex flex-col items-center gap-2 transition-all group col-span-2 sm:col-span-1"
          >
            <Zap size={22} className="text-violet-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-violet-900">Media Converter</span>
          </button>
        </div>
      </section>

    </div>
  );
};
