import React, { useState } from 'react';
import { Play, CheckCircle2, Globe, Clock, HardDrive, ExternalLink } from 'lucide-react';
import { MediaInfo } from '../types';

interface MediaPreviewProps {
  mediaInfo: MediaInfo;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ mediaInfo }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-xl p-4 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        {/* Left: Thumbnail & Duration Badge */}
        {mediaInfo.thumbnail && (
          <div className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-black/40 border border-[var(--border-color)] shrink-0 group">
            <img
              src={mediaInfo.thumbnail}
              alt={mediaInfo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Play size={13} className="fill-slate-900 ml-0.5" />
              </div>
            </div>
            {mediaInfo.duration && (
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-medium text-white">
                {mediaInfo.duration}
              </span>
            )}
          </div>
        )}

        {/* Right: Metadata Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Platform and Verification Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[10px] font-mono uppercase font-semibold text-[var(--text-secondary)]">
              {mediaInfo.platform}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--success)]">
              <CheckCircle2 size={12} />
              <span>Extracted & Verified</span>
            </span>

            {mediaInfo.is_direct_file && (
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Direct Stream
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight line-clamp-2 leading-snug">
            {mediaInfo.title}
          </h2>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] font-mono">
            {mediaInfo.uploader && (
              <span>Source: <strong className="font-medium text-[var(--text-primary)]">{mediaInfo.uploader}</strong></span>
            )}
            {mediaInfo.file_size_str && (
              <span>Size: <strong className="font-medium text-[var(--text-primary)]">{mediaInfo.file_size_str}</strong></span>
            )}
            {mediaInfo.available_qualities && mediaInfo.available_qualities.length > 0 && (
              <span>Max: <strong className="font-medium text-[var(--text-primary)]">{mediaInfo.available_qualities[0]}p</strong></span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
