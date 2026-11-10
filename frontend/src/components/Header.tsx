import React from 'react';
import { ViewTab } from '../types';
import { Terminal, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onQuickIngest: () => void;
}

const TAB_TITLES: Record<ViewTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Operational Dashboard', subtitle: 'Global telemetry, queue health, and rapid media ingestion' },
  downloader: { title: 'Universal Media Downloader', subtitle: 'Multi-stream extraction across 1,700+ sites & direct file URLs' },
  queue: { title: 'Download & Transcode Queue', subtitle: 'Active background transfers, speeds, ETA, and job state controls' },
  history: { title: 'Ingest History', subtitle: 'Persistent log of completed media transfers and saved files' },
  platforms: { title: 'Supported Platform Directory', subtitle: 'Dynamic catalogue of 1,700+ streaming sites and file protocol extractors' },
  settings: { title: 'System Settings', subtitle: 'Engine preferences, format presets, concurrency limits & runtime diagnostics' },
  about: { title: 'About VIRELO', subtitle: 'Architectural specifications, codec pipeline, and compliance notes' },
  terms: { title: 'Terms of Service', subtitle: 'Statutory compliance, permitted uses, and copyright safe harbors' },
  privacy: { title: 'Privacy Policy', subtitle: 'Zero-log guarantees, client-side execution, and GDPR / CCPA standards' },
  fairuse: { title: 'Fair Use Doctrine', subtitle: 'Legal framework for personal archival, commentary, and research under 17 U.S.C. § 107' },
  error: { title: 'Diagnostic Error Guide', subtitle: 'Extraction troubleshooting, server status, and remediation procedures' },
  convert: { title: 'Media Converter', subtitle: 'Hardware-accelerated audio, video & image transcode workstation' },
  contact: { title: 'Contact VIRELO', subtitle: 'Direct inquiries, developer contact & technical support' },
  faq: { title: 'Frequently Asked Questions', subtitle: 'Detailed answers, platform guides & troubleshooting instructions' },
  youtube: { title: 'YouTube Downloader', subtitle: 'Ultra HD 4K, 1080p, and 320 kbps MP3 YouTube extraction' },
  instagram: { title: 'Instagram Downloader', subtitle: 'Download Reels, carousel photos, and videos in high fidelity' },
  tiktok: { title: 'TikTok Downloader', subtitle: 'Clean TikTok video extraction without watermark overlays' },
  facebook: { title: 'Facebook Downloader', subtitle: 'Watch videos and Reels in Full HD 1080p or 720p MP4' },
  pinterest: { title: 'Pinterest Downloader', subtitle: 'Direct uncompressed pins and original master image extraction' },
  reddit: { title: 'Reddit Downloader', subtitle: 'Muxed v.redd.it videos with synchronized high-bitrate audio' },
};

export const Header: React.FC<HeaderProps> = ({ currentTab, onQuickIngest }) => {
  const current = TAB_TITLES[currentTab] || { title: 'VIRELO', subtitle: '' };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0e0e11]/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
          <span>{current.title}</span>
        </h1>
        <p className="text-[11px] text-neutral-500">
          {current.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>SSRF Protected</span>
        </div>

        <button
          onClick={onQuickIngest}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[12px] font-medium transition-all shadow-sm"
        >
          <Terminal size={14} />
          <span>New Ingest</span>
        </button>
      </div>
    </header>
  );
};
