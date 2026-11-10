import React from 'react';

interface PlatformItem {
  name: string;
  domainHint: string;
}

const POPULAR_PLATFORMS: PlatformItem[] = [
  { name: 'YouTube', domainHint: 'youtube.com' },
  { name: 'Instagram', domainHint: 'instagram.com' },
  { name: 'TikTok', domainHint: 'tiktok.com' },
  { name: 'Pinterest', domainHint: 'pinterest.com' },
  { name: 'Facebook', domainHint: 'facebook.com' },
  { name: 'Reddit', domainHint: 'reddit.com' },
  { name: 'Vimeo', domainHint: 'vimeo.com' },
  { name: 'SoundCloud', domainHint: 'soundcloud.com' },
  { name: 'Twitch', domainHint: 'twitch.tv' },
  { name: 'X / Twitter', domainHint: 'x.com' },
];

export const PlatformBar: React.FC = () => {
  return (
    <div className="w-full space-y-2 pt-2">
      <div className="flex items-center justify-between text-[11px] font-medium text-[var(--text-muted)]">
        <span>Verified platform integrations</span>
        <span className="font-mono text-[10px]">1,700+ extractors</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {POPULAR_PLATFORMS.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] whitespace-nowrap shadow-2xs font-medium select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-60" />
            <span>{item.name}</span>
          </div>
        ))}
        <div className="flex items-center px-2 py-1 rounded-md bg-[var(--surface-secondary)] text-[var(--text-muted)] text-[10px] font-mono border border-[var(--border-color)] whitespace-nowrap">
          + direct file URLs
        </div>
      </div>
    </div>
  );
};
