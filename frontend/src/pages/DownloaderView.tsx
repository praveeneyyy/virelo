import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Search, 
  Film, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Clock,
  Layers,
  HardDrive
} from 'lucide-react';
import { MediaInfo, MediaType, DownloadPayload, DownloadJob } from '../types';
import { extractMedia, startDownload, getFileDownloadUrl } from '../services/api';

interface DownloaderProps {
  initialUrl?: string;
  onJobStarted?: (job: DownloadJob) => void;
  activeJob?: DownloadJob | null;
}

export const DownloaderView: React.FC<DownloaderProps> = ({
  initialUrl = '',
  onJobStarted,
  activeJob,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [extracting, setExtracting] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Configuration Form State
  const [mediaType, setMediaType] = useState<MediaType>('video');
  const [videoQuality, setVideoQuality] = useState('best');
  const [videoFormat, setVideoFormat] = useState('mp4');
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [audioBitrate, setAudioBitrate] = useState('320');
  const [imageFormat, setImageFormat] = useState('png');
  const [embedThumbnail, setEmbedThumbnail] = useState(true);
  const [embedSubtitles, setEmbedSubtitles] = useState(false);
  const [customFilename, setCustomFilename] = useState('');
  const [startingDownload, setStartingDownload] = useState(false);

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setExtracting(true);
    setExtractError(null);
    setMediaInfo(null);

    try {
      const data = await extractMedia(cleanUrl);
      setMediaInfo(data);
      // Auto-set media type based on extraction probe
      if (data.media_type) {
        setMediaType(data.media_type);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to extract media.';
      setExtractError(msg);
    } finally {
      setExtracting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const handleTriggerDownload = async () => {
    if (!url.trim()) return;

    setStartingDownload(true);
    try {
      const payload: DownloadPayload = {
        url: url.trim(),
        media_type: mediaType,
        format: mediaType === 'video' ? videoFormat : (mediaType === 'audio' ? audioFormat : (mediaType === 'image' ? imageFormat : 'original')),
        quality: videoQuality,
        bitrate: audioBitrate,
        embed_thumbnail: embedThumbnail,
        embed_subtitles: embedSubtitles,
        title: mediaInfo?.title,
        custom_filename: customFilename.trim() || undefined,
      };

      const job = await startDownload(payload);
      if (onJobStarted) {
        onJobStarted(job);
      }
    } catch (err: any) {
      alert(`Download trigger error: ${err.response?.data?.detail || err.message}`);
    } finally {
      setStartingDownload(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Universal URL Ingest Deck */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-4 shadow-xl">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
            <span>UNIVERSAL INGESTION TERMINAL</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            1,700+ media sites (YouTube, Pinterest, TikTok, Instagram, Reddit, SoundCloud) or direct files
          </p>
        </div>

        <form onSubmit={handleExtract} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste media link or direct file URL..."
              className="w-full h-12 pl-4 pr-24 rounded-xl bg-[#0e0e11] border border-white/10 text-neutral-100 placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-neutral-200 text-xs font-mono border border-white/5 transition-colors"
            >
              Paste
            </button>
          </div>
          <button
            type="submit"
            disabled={extracting || !url.trim()}
            className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            {extracting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Search size={15} />
                <span>Analyze Link</span>
              </>
            )}
          </button>
        </form>

        {/* Extraction Error Notice */}
        {extractError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertTriangle size={15} className="shrink-0 text-rose-400 mt-0.5" />
            <div>
              <div className="font-semibold">Extraction Failed</div>
              <div className="text-[11px] text-rose-300/80 mt-0.5 font-mono">{extractError}</div>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Media Inspection & Format Configuration */}
      {mediaInfo && (
        <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-6 shadow-xl animate-in fade-in duration-200">
          
          {/* Metadata Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-4 rounded-xl bg-[#0e0e11] border border-white/5">
            {mediaInfo.thumbnail && (
              <div className="md:col-span-1 rounded-lg overflow-hidden bg-black/40 border border-white/5 aspect-video relative flex items-center justify-center">
                <img
                  src={mediaInfo.thumbnail}
                  alt={mediaInfo.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-neutral-300">
                  {mediaInfo.duration || 'STREAM'}
                </span>
              </div>
            )}
            
            <div className={`space-y-2 ${mediaInfo.thumbnail ? 'md:col-span-3' : 'md:col-span-4'}`}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-semibold">
                  {mediaInfo.platform}
                </span>
                {mediaInfo.is_direct_file && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px]">
                    Direct Stream
                  </span>
                )}
                {mediaInfo.is_playlist && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px]">
                    Playlist ({mediaInfo.playlist_count} items)
                  </span>
                )}
              </div>

              <h3 className="text-sm font-semibold text-neutral-100 line-clamp-2">
                {mediaInfo.title}
              </h3>

              <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono">
                {mediaInfo.uploader && (
                  <span>By: <span className="text-neutral-200">{mediaInfo.uploader}</span></span>
                )}
                {mediaInfo.duration && (
                  <span>Duration: <span className="text-neutral-200">{mediaInfo.duration}</span></span>
                )}
                {mediaInfo.file_size_str && (
                  <span>Size: <span className="text-neutral-200">{mediaInfo.file_size_str}</span></span>
                )}
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 tracking-wider">
              SELECT EXTRACTION PIPELINE
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  mediaType === 'video'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#0e0e11] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                }`}
              >
                <Film size={15} />
                <span>Video (Multiplex)</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('audio')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  mediaType === 'audio'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#0e0e11] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                }`}
              >
                <Music size={15} />
                <span>Audio Only</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  mediaType === 'image'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#0e0e11] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                }`}
              >
                <ImageIcon size={15} />
                <span>Image / Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('file')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  mediaType === 'file'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#0e0e11] border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                }`}
              >
                <FileText size={15} />
                <span>Direct File</span>
              </button>
            </div>
          </div>

          {/* Mode Specific Options Form */}
          {mediaType === 'video' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0e0e11] border border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Target Resolution</label>
                <select
                  value={videoQuality}
                  onChange={(e) => setVideoQuality(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="best">Best Available (Max Source Quality)</option>
                  <option value="2160">4K Ultra HD (2160p)</option>
                  <option value="1440">Quad HD (1440p)</option>
                  <option value="1080">Full HD (1080p)</option>
                  <option value="720">HD (720p)</option>
                  <option value="480">SD (480p)</option>
                  <option value="360">Low (360p)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Container Format</label>
                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="mp4">MP4 (H.264 / AAC Universal)</option>
                  <option value="mkv">MKV (Matroska Lossless Passthrough)</option>
                  <option value="webm">WebM (VP9 / Opus Open Standard)</option>
                  <option value="mov">MOV (Apple QuickTime)</option>
                  <option value="avi">AVI (Legacy Format)</option>
                  <option value="ts">TS (MPEG Transport Stream)</option>
                  <option value="gif">GIF (Animated 2-Pass Palette)</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2 flex items-center gap-6 text-xs text-neutral-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={embedThumbnail}
                    onChange={(e) => setEmbedThumbnail(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#141417] text-emerald-500 focus:ring-0"
                  />
                  <span>Embed Cover Poster Art</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={embedSubtitles}
                    onChange={(e) => setEmbedSubtitles(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-[#141417] text-emerald-500 focus:ring-0"
                  />
                  <span>Embed Subtitles Track (SRT/VTT)</span>
                </label>
              </div>
            </div>
          )}

          {mediaType === 'audio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0e0e11] border border-white/5">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Audio Codec / Format</label>
                  <select
                    value={audioFormat}
                    onChange={(e) => setAudioFormat(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                  >
                    <option value="mp3">MP3 (MPEG-1 Audio Layer III)</option>
                    <option value="m4a">M4A (AAC Apple Audio)</option>
                    <option value="flac">FLAC (Free Lossless Audio Codec)</option>
                    <option value="wav">WAV (Uncompressed PCM)</option>
                    <option value="opus">Opus (High-Fidelity Low Bitrate)</option>
                    <option value="ogg">OGG (Ogg Vorbis)</option>
                    <option value="alac">ALAC (Apple Lossless)</option>
                    <option value="aiff">AIFF (Audio Interchange)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Target Bitrate</label>
                  <select
                    value={audioBitrate}
                    onChange={(e) => setAudioBitrate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                  >
                    <option value="320">320 kbps (Maximum Studio Quality)</option>
                    <option value="256">256 kbps (High Quality)</option>
                    <option value="192">192 kbps (Standard Quality)</option>
                    <option value="128">128 kbps (Compact Size)</option>
                    <option value="64">64 kbps (Speech / Low Bandwidth)</option>
                  </select>
                </div>

                <div className="md:col-span-2 pt-1 flex items-center gap-6 text-xs text-neutral-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={embedThumbnail}
                      onChange={(e) => setEmbedThumbnail(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-[#141417] text-emerald-500 focus:ring-0"
                    />
                    <span>Embed Album Cover Artwork & ID3 Tags via Mutagen</span>
                  </label>
                </div>
              </div>

              {/* Lossless Acoustic Integrity Notice */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400">
                <span className="text-neutral-300 font-semibold">Acoustic Fidelity Notice:</span> Web streaming platforms (e.g. YouTube, SoundCloud) provide lossy Opus/AAC source streams. Transcoding into FLAC or WAV preserves clean bit-depth without restoring high frequencies already lost in upstream compression.
              </div>
            </div>
          )}

          {mediaType === 'image' && (
            <div className="p-4 rounded-xl bg-[#0e0e11] border border-white/5 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Output Image Format</label>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value)}
                  className="w-full md:w-64 h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                >
                  <option value="png">PNG (Lossless High Detail)</option>
                  <option value="jpg">JPG (Standard Photo)</option>
                  <option value="webp">WEBP (Modern Compressed Web)</option>
                  <option value="bmp">BMP (Bitmap)</option>
                </select>
              </div>
              <div className="text-[11px] text-neutral-500">
                Pinterest image pins are automatically resolved to their highest resolution uncompressed original master image.
              </div>
            </div>
          )}

          {mediaType === 'file' && (
            <div className="p-4 rounded-xl bg-[#0e0e11] border border-white/5 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Custom Filename (Optional)</label>
                <input
                  type="text"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder="Auto-detected from Content-Disposition headers"
                  className="w-full h-10 px-3 rounded-lg bg-[#141417] border border-white/10 text-neutral-200 text-xs font-mono focus:outline-none focus:border-emerald-500/40"
                />
              </div>
              <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Chunked streaming with HTTP Range resume verification enabled</span>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              Output folder: <span className="text-neutral-400 font-mono">downloads/</span>
            </div>

            <button
              type="button"
              onClick={handleTriggerDownload}
              disabled={startingDownload}
              className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              {startingDownload ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Enqueuing Job...</span>
                </>
              ) : (
                <>
                  <DownloadCloud size={16} />
                  <span>Start Ingest Job</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Real-time Ingest Telemetry Card if Job in progress */}
      {activeJob && (
        <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-300 tracking-wider">
                ACTIVE JOB TELEMETRY
              </span>
              <div className="text-xs font-medium text-neutral-200 mt-0.5 truncate max-w-lg">
                {activeJob.title}
              </div>
            </div>
            <span className="text-sm font-mono font-semibold text-emerald-400">
              {activeJob.progress}%
            </span>
          </div>

          {/* Meter Bar */}
          <div className="w-full h-2 bg-[#0e0e11] rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                activeJob.status === 'failed' 
                  ? 'bg-rose-500' 
                  : (activeJob.status === 'completed' ? 'bg-emerald-400' : 'bg-emerald-500')
              }`}
              style={{ width: `${activeJob.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono text-neutral-400">
            <div>Speed: <span className="text-neutral-200">{activeJob.speed_str}</span></div>
            <div>ETA: <span className="text-neutral-200">{activeJob.eta_str}</span></div>
            <div>State: <span className="text-emerald-400 uppercase">{activeJob.status}</span></div>
          </div>

          {activeJob.status === 'completed' && activeJob.file_name && (
            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <span className="text-xs text-neutral-400">
                Finished: <span className="text-neutral-200 font-mono">{activeJob.file_name}</span> ({activeJob.file_size_str})
              </span>
              <a
                href={getFileDownloadUrl(activeJob.id)}
                download={activeJob.file_name || 'download'}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-xs transition-colors shadow-sm"
              >
                Save to Downloads
              </a>
            </div>
          )}

          {activeJob.status === 'failed' && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <span className="font-semibold">Error:</span> {activeJob.error}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
