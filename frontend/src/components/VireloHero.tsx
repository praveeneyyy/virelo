import React, { useState, useRef, useEffect } from 'react';
import { 
  Link2, 
  Play, 
  Check, 
  Download, 
  Music, 
  Film,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileCheck,
  CornerDownLeft,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  Layers,
  HardDrive,
  Scissors,
  Sliders,
  Clock,
  Image as ImageIcon,
  FastForward,
  Palette,
  Folder,
  CheckCircle2
} from 'lucide-react';
import { MediaInfo, DownloadPayload, DownloadJob, ViewTab, MediaType } from '../types';
import { getFileDownloadUrl, openDownloadsFolder } from '../services/api';
import { 
  YouTubeIcon, 
  InstagramIcon, 
  TikTokIcon, 
  PinterestIcon, 
  FacebookIcon, 
  XTwitterIcon, 
  RedditIcon, 
  VimeoIcon, 
  TwitchIcon, 
  SoundCloudIcon,
  BrowserIcon,
  ChromeIcon
} from './PlatformIcons';

interface HeroProps {
  url: string;
  setUrl: (url: string) => void;
  isExtracting: boolean;
  extractError: string | null;
  mediaInfo: MediaInfo | null;
  onExtract: () => Promise<void>;
  onStartDownload: (payload: DownloadPayload) => Promise<void>;
  isStartingDownload: boolean;
  activeJob: DownloadJob | null;
  onCancelJob: (id: string) => Promise<void>;
  onRetryJob: (id: string) => Promise<void>;
  onSelectTab?: (tab: ViewTab) => void;
}

export const VireloHero: React.FC<HeroProps> = ({
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
  onRetryJob,
  onSelectTab,
}) => {
  // Mode selection: 'video' | 'audio' | 'gif' | 'image'
  const [activeMode, setActiveMode] = useState<'video' | 'audio' | 'gif' | 'image'>('video');

  // Video settings
  const [selectedQuality, setSelectedQuality] = useState('1080');
  const [selectedVideoFormat, setSelectedVideoFormat] = useState('mp4');

  // Audio settings
  const [selectedAudioFormat, setSelectedAudioFormat] = useState('mp3');
  const [audioBitrate, setAudioBitrate] = useState('320');

  // GIF / Clip Editing Tool State
  const [gifStartTime, setGifStartTime] = useState(0);
  const [gifDuration, setGifDuration] = useState(5);
  const [gifFps, setGifFps] = useState(15);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifSpeed, setGifSpeed] = useState(1.0);
  const [gifFormat, setGifFormat] = useState<'gif' | 'webp'>('gif');

  // Image Frame Grab State
  const [selectedImageFormat, setSelectedImageFormat] = useState('jpg');
  const [imageTimestamp, setImageTimestamp] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const autoDownloadedJobIdsRef = useRef<Set<string>>(new Set());

  // Auto-download to user's local folder as soon as processing completes
  useEffect(() => {
    if (activeJob && activeJob.status === 'completed' && activeJob.download_url && !autoDownloadedJobIdsRef.current.has(activeJob.id)) {
      autoDownloadedJobIdsRef.current.add(activeJob.id);
      try {
        const downloadLink = document.createElement('a');
        downloadLink.href = getFileDownloadUrl(activeJob.id);
        downloadLink.setAttribute('download', activeJob.file_name || 'download');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (err) {
        console.warn('Auto-download notice:', err);
      }
    }
  }, [activeJob]);

  const handleOpenFolder = async () => {
    try {
      const res = await openDownloadsFolder();
      if (!res.success && res.error) {
        alert(`Folder location: ${res.path || 'backend/downloads'}\n(${res.error})`);
      }
    } catch (e: any) {
      alert(`Could not open folder automatically: ${e.message}`);
    }
  };

  // Fast paste handler
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        if (inputRef.current) inputRef.current.focus();
      }
    } catch {
      if (inputRef.current) inputRef.current.focus();
    }
  };

  // Platform chip click
  const handlePlatformClick = (platformName: string) => {
    if (platformName === 'More') {
      if (onSelectTab) onSelectTab('platforms');
      return;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Submit extraction
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onExtract();
    }
  };

  // Trigger Download
  const handleTriggerDownload = () => {
    if (!url.trim()) return;

    let mediaType: MediaType = 'video';
    let format = selectedVideoFormat;

    if (activeMode === 'audio') {
      mediaType = 'audio';
      format = selectedAudioFormat;
    } else if (activeMode === 'gif') {
      mediaType = 'gif';
      format = gifFormat;
    } else if (activeMode === 'image') {
      mediaType = 'image';
      format = selectedImageFormat;
    }

    const payload: DownloadPayload = {
      url: url.trim(),
      media_type: mediaType,
      format: format,
      quality: selectedQuality,
      bitrate: audioBitrate,
      embed_thumbnail: true,
      embed_subtitles: false,
      title: mediaInfo?.title,
      start_time: (activeMode === 'gif' || activeMode === 'image') ? (activeMode === 'gif' ? gifStartTime : imageTimestamp) : undefined,
      duration: activeMode === 'gif' ? gifDuration : undefined,
      fps: activeMode === 'gif' ? gifFps : undefined,
      scale_width: activeMode === 'gif' ? gifWidth : undefined,
      speed: activeMode === 'gif' ? gifSpeed : undefined,
    };

    onStartDownload(payload);
  };

  const formatSecondsToTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-10 pt-2 pb-12">
      
      {/* 1. Precision Editorial Hero Headline (Billion-Dollar Company Standard) */}
      <div className="space-y-4 text-center max-w-3xl mx-auto pt-4 sm:pt-6">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <span>UNIVERSAL MEDIA DOWNLOADER</span>
        </div>

        {/* Headline & Description specified by prompt */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-center leading-[1.15] text-slate-900 max-w-4xl mx-auto">
            Everything you love.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 font-serif italic font-normal tracking-normal">
              One download away.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto px-4">
            Download videos, audio and media from your favourite platforms with one simple link.
          </p>
        </div>
      </div>

      {/* 2. Billion-Dollar Main URL Input Card */}
      <div className="max-w-3xl mx-auto space-y-3">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-purple-500/5 hover:border-purple-300 focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            
            <div className="flex items-center gap-3 pl-3 flex-1 min-w-0">
              <Link2 size={20} className="text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your media URL here..."
                className="w-full h-12 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
              
              {url.trim() && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 border border-slate-200 transition-all cursor-pointer"
              >
                Paste
              </button>
            </div>

            <button
              type="submit"
              disabled={isExtracting || !url.trim()}
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-md shadow-purple-600/20"
            >
              {isExtracting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze URL</span>
                  <CornerDownLeft size={14} className="opacity-80" />
                </>
              )}
            </button>

          </div>
        </form>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-normal px-2">
          <span>Paste a link from a supported platform. VIRELO will analyze compatible download options.</span>
        </div>

        {extractError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-3 shadow-xs">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <div className="space-y-1">
              <span className="leading-snug font-medium block">{extractError}</span>
              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('error')}
                className="text-xs underline font-semibold text-red-800 hover:opacity-80 cursor-pointer"
              >
                View Diagnostic Error Guide & Recovery →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Platform Badges + Browser Web Link Icon */}
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          
          <button
            type="button"
            onClick={() => handlePlatformClick('YouTube')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <YouTubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />
            <span>YouTube</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('Instagram')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-[#E4405F]" />
            <span>Instagram</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('TikTok')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-[var(--text-primary)]" />
            <span>TikTok</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('Pinterest')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <PinterestIcon className="w-3.5 h-3.5 text-[#E60023]" />
            <span>Pinterest HD</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('Facebook')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('XTwitter')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <XTwitterIcon className="w-3.5 h-3.5 text-[var(--text-primary)]" />
            <span>X (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('Reddit')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <RedditIcon className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>Reddit</span>
          </button>

          {/* Dedicated Direct Browser Web Link Icon */}
          <button
            type="button"
            onClick={() => handlePlatformClick('Browser')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-primary)] hover:bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] text-xs text-[var(--accent)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-mono font-semibold"
            title="Download directly from any browser URL (Chrome, Firefox, Safari, Edge)"
          >
            <ChromeIcon className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Browser Web Link</span>
          </button>

          <button
            type="button"
            onClick={() => handlePlatformClick('More')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer font-medium"
          >
            <span>+1,700 more</span>
          </button>

        </div>
      </div>

      {/* 4. Complete Conversion Workspace & Editing Suite */}
      {mediaInfo && (
        <div className="max-w-3xl mx-auto p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-purple-500/5 space-y-6">
          
          {/* Header Preview Strip */}
          <div className="flex flex-col sm:flex-row gap-4 items-start border-b border-slate-100 pb-5">
            
            {/* Thumbnail */}
            <div className="relative w-full sm:w-48 h-28 sm:h-32 bg-black shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={mediaInfo.thumbnail || '/placeholder-thumb.jpg'}
                alt={mediaInfo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-md">
                  <Play size={14} className="fill-black ml-0.5" />
                </div>
              </div>
              {mediaInfo.duration && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white font-medium">
                  {mediaInfo.duration}
                </span>
              )}
            </div>

            {/* Media Information */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {mediaInfo.platform || 'Verified'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {mediaInfo.file_size_str || 'Stream source'}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                  {mediaInfo.title}
                </h3>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveMode('video')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                    activeMode === 'video'
                      ? 'border-purple-600 bg-purple-600 text-white font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Film size={14} />
                  <span>Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('audio')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                    activeMode === 'audio'
                      ? 'border-purple-600 bg-purple-600 text-white font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Music size={14} />
                  <span>Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('gif')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                    activeMode === 'gif'
                      ? 'border-purple-600 bg-purple-600 text-white font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Scissors size={14} />
                  <span>GIF / Clip Tool</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMode('image')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                    activeMode === 'image'
                      ? 'border-purple-600 bg-purple-600 text-white font-semibold shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Frame Capture</span>
                </button>
              </div>

            </div>

          </div>

          {/* 4A. VIDEO MODE CONTROLS */}
          {activeMode === 'video' && (
            <div className="space-y-4">
              {/* Format selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[var(--text-secondary)] font-medium uppercase tracking-wider block">
                  Select Output Container
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['mp4', 'mkv', 'webm', 'mov', 'avi', 'ts'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedVideoFormat(fmt)}
                      className={`p-2 border text-center uppercase text-xs font-mono font-bold transition-colors cursor-pointer ${
                        selectedVideoFormat === fmt
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                          : 'border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Grid */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[var(--text-secondary)] font-medium uppercase tracking-wider block">
                  Select Stream Resolution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: '4K Ultra HD', res: '2160' },
                    { label: '1440p Quad HD', res: '1440' },
                    { label: '1080p Full HD', res: '1080' },
                    { label: '720p HD', res: '720' },
                  ].map((item) => {
                    const isSelected = selectedQuality === item.res;
                    return (
                      <button
                        key={item.res}
                        type="button"
                        onClick={() => setSelectedQuality(item.res)}
                        className={`p-2.5 border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
                            : 'border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">{item.res}p transcode</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4B. AUDIO MODE CONTROLS */}
          {activeMode === 'audio' && (
            <div className="space-y-4">
              {/* Audio Format */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[var(--text-secondary)] font-medium uppercase tracking-wider block">
                  Select Audio Codec
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { fmt: 'mp3', desc: 'Universal ID3 Tagged' },
                    { fmt: 'flac', desc: '24-bit Lossless Studio' },
                    { fmt: 'm4a', desc: 'Apple AAC High-Efficiency' },
                    { fmt: 'wav', desc: 'Raw Uncompressed PCM' },
                    { fmt: 'opus', desc: 'Next-Gen Voice/Music' },
                    { fmt: 'ogg', desc: 'Ogg Vorbis Open Format' },
                    { fmt: 'aac', desc: 'MPEG-4 Audio Stream' },
                  ].map((item) => (
                    <button
                      key={item.fmt}
                      type="button"
                      onClick={() => setSelectedAudioFormat(item.fmt)}
                      className={`p-2.5 border text-left transition-colors cursor-pointer ${
                        selectedAudioFormat === item.fmt
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold'
                          : 'border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--border-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase font-mono">{item.fmt}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitrate Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-[var(--text-secondary)] font-medium uppercase tracking-wider block">
                  Target Acoustic Bitrate
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { rate: '320', label: '320 kbps (Lossless/Max)' },
                    { rate: '256', label: '256 kbps (High Fidelity)' },
                    { rate: '192', label: '192 kbps (Standard)' },
                    { rate: '128', label: '128 kbps (Compact)' },
                  ].map((item) => (
                    <button
                      key={item.rate}
                      type="button"
                      onClick={() => setAudioBitrate(item.rate)}
                      className={`p-2 border text-center font-mono text-xs transition-colors cursor-pointer ${
                        audioBitrate === item.rate
                          ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-bold'
                          : 'border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4C. GIF / CLIP MAKER EDITING TOOL */}
          {activeMode === 'gif' && (
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-4">
              
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-[var(--accent)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                    Video-to-GIF Clipper Tool
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--accent)]">
                  2-Pass Lanczos Palettegen
                </span>
              </div>

              {/* Timecode Range Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Start Time */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Clip Start Time</span>
                    <span className="text-[var(--accent)] font-bold">{formatSecondsToTime(gifStartTime)} ({gifStartTime}s)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={mediaInfo.duration_seconds ? Math.max(mediaInfo.duration_seconds - 5, 0) : 300}
                    step="1"
                    value={gifStartTime}
                    onChange={(e) => setGifStartTime(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    {[0, 5, 15, 30, 60].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setGifStartTime(sec)}
                        className="px-2 py-0.5 bg-[var(--surface-primary)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        +{sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Clip Duration</span>
                    <span className="text-[var(--accent)] font-bold">{gifDuration} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={gifDuration}
                    onChange={(e) => setGifDuration(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 pt-1">
                    {[3, 5, 8, 10, 15].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setGifDuration(sec)}
                        className="px-2 py-0.5 bg-[var(--surface-primary)] border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Resolution, Framerate & Playback Speed */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[var(--border-color)]">
                
                {/* Resolution / Width */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">GIF Resolution</label>
                  <select
                    value={gifWidth}
                    onChange={(e) => setGifWidth(parseInt(e.target.value))}
                    className="w-full h-8 px-2 bg-[var(--surface-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)]"
                  >
                    <option value="320">320px (Compact Mobile)</option>
                    <option value="480">480px (Standard Web)</option>
                    <option value="640">640px (High Definition)</option>
                    <option value="720">720px (Crisp Quality)</option>
                  </select>
                </div>

                {/* Frame Rate */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Framerate (FPS)</label>
                  <select
                    value={gifFps}
                    onChange={(e) => setGifFps(parseInt(e.target.value))}
                    className="w-full h-8 px-2 bg-[var(--surface-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)]"
                  >
                    <option value="10">10 FPS (Smallest File)</option>
                    <option value="15">15 FPS (Smooth Default)</option>
                    <option value="24">24 FPS (Cinematic)</option>
                    <option value="30">30 FPS (Ultra Fluid)</option>
                  </select>
                </div>

                {/* Playback Speed */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Playback Speed</label>
                  <select
                    value={gifSpeed}
                    onChange={(e) => setGifSpeed(parseFloat(e.target.value))}
                    className="w-full h-8 px-2 bg-[var(--surface-primary)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent)]"
                  >
                    <option value="0.5">0.5x (Slow Motion)</option>
                    <option value="1.0">1.0x (Original Speed)</option>
                    <option value="1.5">1.5x (Fast Clip)</option>
                    <option value="2.0">2.0x (Double Speed)</option>
                  </select>
                </div>

              </div>

              {/* Live Preview Summary Bar */}
              <div className="p-2.5 bg-[var(--surface-primary)] border border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--text-secondary)]">
                  Range: <strong>{formatSecondsToTime(gifStartTime)}</strong> → <strong>{formatSecondsToTime(gifStartTime + gifDuration)}</strong>
                </span>
                <span className="text-[var(--accent)] font-semibold">
                  {gifWidth}px @ {gifFps}fps ({gifSpeed}x speed)
                </span>
              </div>

            </div>
          )}

          {/* 4D. IMAGE FRAME CAPTURE CONTROLS */}
          {activeMode === 'image' && (
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-4">
              
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-[var(--accent)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">
                    High-Res Frame Snapshot & Poster Extraction
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Image Format */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">Image Container</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['jpg', 'png', 'webp'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setSelectedImageFormat(fmt)}
                        className={`p-2 border text-center font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
                          selectedImageFormat === fmt
                            ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                            : 'border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Capture Frame at Timecode</span>
                    <span className="text-[var(--accent)] font-bold">{formatSecondsToTime(imageTimestamp)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={mediaInfo.duration_seconds || 300}
                    step="1"
                    value={imageTimestamp}
                    onChange={(e) => setImageTimestamp(parseFloat(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />
                </div>

              </div>

            </div>
          )}

          {/* Start Download Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTriggerDownload}
              disabled={isStartingDownload}
              className="w-full h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-600/20"
            >
              {isStartingDownload ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Initializing Pipeline...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>
                    {activeMode === 'video' && `Start ${selectedVideoFormat.toUpperCase()} (${selectedQuality}p) Download`}
                    {activeMode === 'audio' && `Extract ${selectedAudioFormat.toUpperCase()} (${audioBitrate}k) Audio`}
                    {activeMode === 'gif' && `Render & Transcode High-Res GIF`}
                    {activeMode === 'image' && `Extract ${selectedImageFormat.toUpperCase()} Snapshot`}
                  </span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* 5. Live Processing Telemetry (If Active Job Present) */}
      {activeJob && (
        <div className="max-w-3xl mx-auto p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-purple-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
              <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                {activeJob.status === 'downloading' ? 'Active Media Ingestion' : activeJob.status === 'converting' ? 'Hardware Transcoding' : 'Stream Pipeline'}
              </span>
            </div>
            <span className="text-sm font-bold text-purple-700 font-mono">
              {Math.round(activeJob.progress || 0)}%
            </span>
          </div>

          <div className="text-xs sm:text-sm font-medium text-slate-700 truncate">
            {activeJob.title}
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${Math.max(activeJob.progress || 0, 4)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
            <span>Speed: {activeJob.speed_str || 'Negotiating stream'}</span>
            <span>ETA: {activeJob.eta_str || '--'}</span>
          </div>

          {activeJob.status === 'completed' && activeJob.download_url && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Transcoded & Saved to Local Folder!</span>
                  </div>
                  <p className="text-xs font-mono text-emerald-700 truncate max-w-md">
                    {activeJob.file_name || 'Downloaded media file'} ({activeJob.file_size_str || 'Ready'})
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleOpenFolder}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    title="Open local downloads folder in Windows Explorer / File Manager"
                  >
                    <Folder size={14} className="text-purple-600" />
                    <span>Open Folder</span>
                  </button>

                  <a
                    href={getFileDownloadUrl(activeJob.id)}
                    download={activeJob.file_name || 'download'}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Download size={14} />
                    <span>Save Again</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Rounded Metrics Row */}
      <div className="max-w-3xl mx-auto pt-2">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              1000+
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Supported Sites
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              HD / 4K
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Video Quality
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Free Forever
            </div>
          </div>

        </div>
      </div>

      {/* 7. Rounded 6-Feature Architecture Highlights */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Globe2 size={15} className="text-purple-600" />
              <span>1,700+ Extractors</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              yt-dlp core with live stream discovery.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Cpu size={15} className="text-purple-600" />
              <span>FFmpeg 9.0 Core</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Hardware accelerated stream multiplexing.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Music size={15} className="text-purple-600" />
              <span>320k Lossless Audio</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Automatic Mutagen ID3 cover art tagging.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Zap size={15} className="text-purple-600" />
              <span>Zero Re-encoding</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Direct container remuxing preservation.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck size={15} className="text-purple-600" />
              <span>SSRF Guarded</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Private subnets and metadata protected.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Check size={15} className="text-purple-600" />
              <span>No Sign-Up</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              100% private local queue processing.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
