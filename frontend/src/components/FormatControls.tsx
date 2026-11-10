import React, { useState } from 'react';
import { Film, Music, Image as ImageIcon, FileText, Download, Loader2, Check } from 'lucide-react';
import { MediaInfo, MediaType, DownloadPayload } from '../types';

interface FormatControlsProps {
  mediaInfo: MediaInfo;
  onDownload: (payload: DownloadPayload) => void;
  isLoading: boolean;
}

export const FormatControls: React.FC<FormatControlsProps> = ({
  mediaInfo,
  onDownload,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<MediaType>(mediaInfo.media_type || 'video');

  // Video Options
  const [videoQuality, setVideoQuality] = useState(
    mediaInfo.available_qualities && mediaInfo.available_qualities.length > 0
      ? mediaInfo.available_qualities[0].toString()
      : 'best'
  );
  const [videoFormat, setVideoFormat] = useState('mp4');
  const [embedSubtitles, setEmbedSubtitles] = useState(false);
  const [embedThumbnail, setEmbedThumbnail] = useState(true);

  // Audio Options
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [audioBitrate, setAudioBitrate] = useState('320');

  // Image & File Options
  const [imageFormat, setImageFormat] = useState('png');
  const [customFilename, setCustomFilename] = useState('');

  const handleStart = () => {
    let fmt = videoFormat;
    if (activeTab === 'audio') fmt = audioFormat;
    else if (activeTab === 'image') fmt = imageFormat;
    else if (activeTab === 'file') fmt = 'original';

    onDownload({
      url: mediaInfo.url,
      media_type: activeTab,
      format: fmt,
      quality: videoQuality,
      bitrate: audioBitrate,
      embed_thumbnail: embedThumbnail,
      embed_subtitles: embedSubtitles,
      title: mediaInfo.title,
      custom_filename: customFilename.trim() || undefined,
    });
  };

  return (
    <div className="w-full bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-xl p-5 space-y-4 shadow-xs transition-colors">
      
      {/* Segmented Pipeline Selector */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Export Configuration
        </div>

        <div className="flex items-center gap-1 bg-[var(--surface-secondary)] p-1 rounded-lg border border-[var(--border-color)]">
          {[
            { id: 'video', label: 'Video', icon: <Film size={12} /> },
            { id: 'audio', label: 'Audio', icon: <Music size={12} /> },
            { id: 'image', label: 'Image', icon: <ImageIcon size={12} /> },
            { id: 'file', label: 'Direct File', icon: <FileText size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MediaType)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Video Settings */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quality Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Resolution Quality
              </label>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="best">Best Available (Max Source Quality)</option>
                {mediaInfo.available_qualities && mediaInfo.available_qualities.length > 0 ? (
                  mediaInfo.available_qualities.map((q) => (
                    <option key={q} value={q.toString()}>
                      {q >= 2160 ? '4K ' : q >= 1440 ? '2K ' : q >= 1080 ? 'Full HD ' : q >= 720 ? 'HD ' : ''}{q}p
                    </option>
                  ))
                ) : (
                  <>
                    <option value="1080">1080p Full HD</option>
                    <option value="720">720p HD</option>
                    <option value="480">480p SD</option>
                  </>
                )}
              </select>
            </div>

            {/* Container Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Container Format
              </label>
              <select
                value={videoFormat}
                onChange={(e) => setVideoFormat(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="mp4">MP4 (H.264 / AAC Universal)</option>
                <option value="mkv">MKV (Lossless Stream Copy)</option>
                <option value="webm">WebM (VP9 / Opus)</option>
                <option value="mov">MOV (Apple QuickTime)</option>
                <option value="avi">AVI (Legacy)</option>
                <option value="gif">GIF (Animated 2-Pass Palette)</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-[var(--text-secondary)] font-normal">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={embedThumbnail}
                onChange={(e) => setEmbedThumbnail(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[var(--border-color)] accent-[var(--accent)]"
              />
              <span>Embed Cover Thumbnail</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={embedSubtitles}
                onChange={(e) => setEmbedSubtitles(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[var(--border-color)] accent-[var(--accent)]"
              />
              <span>Embed Subtitles (SRT/VTT)</span>
            </label>
          </div>
        </div>
      )}

      {/* Audio Settings */}
      {activeTab === 'audio' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Audio Codec
              </label>
              <select
                value={audioFormat}
                onChange={(e) => setAudioFormat(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="mp3">MP3 (MPEG-1 Audio Layer III)</option>
                <option value="m4a">M4A (AAC Apple Audio)</option>
                <option value="flac">FLAC (Free Lossless Audio Codec)</option>
                <option value="wav">WAV (Uncompressed PCM)</option>
                <option value="opus">Opus (High-Fidelity Low Bitrate)</option>
                <option value="ogg">OGG (Ogg Vorbis)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Bitrate Preset
              </label>
              <select
                value={audioBitrate}
                onChange={(e) => setAudioBitrate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="320">320 kbps (Maximum Studio Fidelity)</option>
                <option value="256">256 kbps (High Quality)</option>
                <option value="192">192 kbps (Standard Quality)</option>
                <option value="128">128 kbps (Compact)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-[var(--text-secondary)]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={embedThumbnail}
                onChange={(e) => setEmbedThumbnail(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[var(--border-color)] accent-[var(--accent)]"
              />
              <span>Embed Album Artwork & ID3 Tags (Mutagen)</span>
            </label>
          </div>
        </div>
      )}

      {/* Image Settings */}
      {activeTab === 'image' && (
        <div className="space-y-3">
          <div className="w-full sm:w-64 space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Target Format</label>
            <select
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="png">PNG (Lossless High Detail)</option>
              <option value="jpg">JPG (Standard Photo)</option>
              <option value="webp">WEBP (Modern Compressed Web)</option>
              <option value="bmp">BMP (Raw Bitmap)</option>
            </select>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Pinterest pins automatically resolve to uncompressed full-resolution master photos.
          </p>
        </div>
      )}

      {/* Direct File Settings */}
      {activeTab === 'file' && (
        <div className="space-y-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Filename Override (Optional)</label>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Auto-detected from server headers"
              className="w-full h-9 px-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Direct HTTP streaming enabled with Range header resume support.
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="text-[11px] font-mono text-[var(--text-muted)]">
          Destination: <span className="text-[var(--text-secondary)]">downloads/</span>
        </div>

        <button
          onClick={handleStart}
          disabled={isLoading}
          className="h-9 px-5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Enqueuing...</span>
            </>
          ) : (
            <>
              <Download size={13} />
              <span>Download Media</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
