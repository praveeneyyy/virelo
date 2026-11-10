import React from 'react';
import { 
  LayoutDashboard, 
  DownloadCloud, 
  ListOrdered, 
  History, 
  Globe, 
  Sliders, 
  Info,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ViewTab, SystemHealth } from '../types';
import { VireloIcon } from '../components/VireloLogo';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  activeJobsCount: number;
  health: SystemHealth | null;
  wsConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeJobsCount,
  health,
  wsConnected,
}) => {
  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'downloader', label: 'Downloader', icon: <DownloadCloud size={18} /> },
    { 
      id: 'queue', 
      label: 'Download Queue', 
      icon: <ListOrdered size={18} />, 
      badge: activeJobsCount > 0 ? activeJobsCount : undefined 
    },
    { id: 'history', label: 'Download History', icon: <History size={18} /> },
    { id: 'platforms', label: 'Supported Platforms', icon: <Globe size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Sliders size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#111114] border-r border-white/5 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <VireloIcon size={26} />
          <div>
            <div className="text-[13px] font-bold tracking-wider text-neutral-200">
              VIRELO
            </div>
            <div className="text-[10px] text-neutral-500 tracking-wide font-mono">
              ENGINE v2.4
            </div>
          </div>
        </div>
        
        {/* WebSocket Beacon */}
        <div 
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5"
          title={wsConnected ? "Real-time WebSocket active" : "WebSocket offline (polling fallback)"}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-mono text-neutral-400">
            {wsConnected ? 'LIVE' : 'POLL'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-white/[0.06] text-white border border-white/10 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-emerald-400' : 'text-neutral-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Engine Diagnostics Footer */}
      <div className="p-3.5 mx-3 mb-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="flex items-center gap-1.5">
            <HardDrive size={13} className="text-neutral-500" />
            <span>Disk Free</span>
          </span>
          <span className="font-mono text-neutral-300">
            {health ? `${health.disk_free_gb} GB` : '--'}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-400">
          <span className="flex items-center gap-1.5">
            {health?.ffmpeg_available ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <AlertCircle size={13} className="text-amber-400" />
            )}
            <span>FFmpeg 9.0</span>
          </span>
          <span className="font-mono text-[10px] text-neutral-300">
            {health?.ffmpeg_available ? 'ONLINE' : 'MISSING'}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-400">
          <span className="flex items-center gap-1.5">
            {health?.node_available ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <AlertCircle size={13} className="text-neutral-500" />
            )}
            <span>Node.js JS-Engine</span>
          </span>
          <span className="font-mono text-[10px] text-neutral-300">
            {health?.node_available ? 'READY' : 'N/A'}
          </span>
        </div>
      </div>
    </aside>
  );
};
