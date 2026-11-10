import React from 'react';
import { DownloadCloud, ListOrdered, History, Sliders, ShieldCheck } from 'lucide-react';
import { ViewTab } from '../types';
import { VireloIcon } from './VireloLogo';

interface NavbarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  activeJobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeJobsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => onSelectTab('downloader')}
          className="flex items-center gap-2.5 text-left group"
        >
          <VireloIcon size={28} />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            VIRELO
          </span>
        </button>

        {/* Navigation Items */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('downloader')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'downloader' || currentTab === 'dashboard'
                ? 'bg-[#ff2b6d] text-white shadow-sm shadow-[#ff2b6d]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Downloader
          </button>

          <button
            onClick={() => onSelectTab('queue')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'queue'
                ? 'bg-[#ff2b6d] text-white shadow-sm shadow-[#ff2b6d]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ListOrdered size={14} />
            <span>Queue</span>
            {activeJobsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono">
                {activeJobsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentTab === 'history'
                ? 'bg-[#ff2b6d] text-white shadow-sm shadow-[#ff2b6d]/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History size={14} />
            <span>History</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors ${
              currentTab === 'settings' ? 'text-[#ff2b6d]' : ''
            }`}
            title="Settings & Diagnostics"
          >
            <Sliders size={16} />
          </button>
        </div>

      </div>
    </header>
  );
};
