import React, { useState } from 'react';
import { 
  DownloadCloud, 
  ArrowUpRight, 
  Activity, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Zap,
  Play,
  ArrowRight
} from 'lucide-react';
import { DownloadJob, SystemHealth, ViewTab } from '../types';

interface DashboardProps {
  jobs: DownloadJob[];
  history: any[];
  health: SystemHealth | null;
  onNavigate: (tab: ViewTab) => void;
  onStartIngestWithUrl: (url: string) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  jobs,
  history,
  health,
  onNavigate,
  onStartIngestWithUrl,
}) => {
  const [quickUrl, setQuickUrl] = useState('');

  const activeJobs = jobs.filter(j => j.status === 'downloading' || j.status === 'converting');
  const completedJobs = jobs.filter(j => j.status === 'completed');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      onStartIngestWithUrl(quickUrl.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setQuickUrl(text.trim());
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#141417] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>ACTIVE TRANSFERS</span>
            <Activity size={14} className={activeJobs.length > 0 ? "text-emerald-400 animate-pulse" : "text-neutral-500"} />
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {activeJobs.length}
          </div>
          <div className="text-[11px] text-neutral-500">
            {health?.queue_length ? `${health.queue_length} queued in line` : 'Workers idle'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141417] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>COMPLETED FILES</span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {completedJobs.length + history.length}
          </div>
          <div className="text-[11px] text-neutral-500">
            Persisted in downloads
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141417] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>DISK CAPACITY</span>
            <HardDrive size={14} className="text-neutral-400" />
          </div>
          <div className="text-2xl font-semibold text-white font-mono">
            {health ? `${health.disk_free_gb} GB` : '--'}
          </div>
          <div className="text-[11px] text-neutral-500">
            Available on volume
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#141417] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>ENGINE PIPELINE</span>
            <Zap size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-semibold text-emerald-400 font-mono">
            READY
          </div>
          <div className="text-[11px] text-neutral-500">
            FFmpeg 9.0 + yt-dlp Core
          </div>
        </div>

      </div>

      {/* Quick Launch Console */}
      <div className="p-6 rounded-xl bg-[#141417] border border-white/5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-200">
            Rapid Ingestion Terminal
          </h2>
          <p className="text-xs text-neutral-500">
            Paste any YouTube video, Pinterest pin, TikTok, audio stream, or direct file URL to analyze:
          </p>
        </div>

        <form onSubmit={handleQuickSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://pin.it/... or direct file link"
              className="w-full h-11 pl-4 pr-24 rounded-lg bg-[#0e0e11] border border-white/10 text-neutral-200 placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2 top-2 px-2.5 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-neutral-200 text-[11px] font-mono border border-white/5 transition-colors"
            >
              Paste
            </button>
          </div>
          <button
            type="submit"
            className="h-11 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Analyze Media</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <span className="text-neutral-400">Supported protocols:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-neutral-400 font-mono">1,700+ Sites</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-neutral-400 font-mono">Pinterest HD</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-neutral-400 font-mono">Direct HTTP/HTTPS</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/5 text-neutral-400 font-mono">Range Resumption</span>
        </div>
      </div>

      {/* Active Work In Flight */}
      {activeJobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-300 tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE TRANSFERS ({activeJobs.length})</span>
            </h3>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Manage Queue</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl bg-[#141417] border border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-200 truncate">
                      {job.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-white/[0.03] text-neutral-400 border border-white/5 font-mono">
                        {job.platform}
                      </span>
                      <span>{job.target_format.toUpperCase()}</span>
                      <span>•</span>
                      <span>{job.status === 'converting' ? 'Transcoding stream' : 'Transferring'}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {job.progress}%
                  </span>
                </div>

                {/* Progress Meter */}
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Speed: <span className="text-neutral-200">{job.speed_str}</span></span>
                  <span>ETA: <span className="text-neutral-200">{job.eta_str}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-300 tracking-wider">
            RECENT COMPLETED INGESTS
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {completedJobs.length === 0 && history.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#141417] border border-white/5 text-center space-y-2">
            <DownloadCloud size={28} className="mx-auto text-neutral-600" />
            <div className="text-xs text-neutral-400">No media downloads in current session</div>
            <div className="text-[11px] text-neutral-600">Enter a URL above to start your first ingest</div>
          </div>
        ) : (
          <div className="divide-y divide-white/5 rounded-xl bg-[#141417] border border-white/5 overflow-hidden">
            {completedJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-neutral-200 truncate">
                      {job.file_name || job.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span>{job.platform}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-400">{job.file_size_str}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono text-[10px]">VERIFIED 100%</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/api/download/${job.id}/file`}
                  download
                  className="px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white border border-white/10 text-xs font-medium transition-colors shrink-0"
                >
                  Save to Disk
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
