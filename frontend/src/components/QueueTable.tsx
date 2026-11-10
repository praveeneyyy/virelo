import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  RotateCcw, 
  X, 
  ArrowUpRight, 
  DownloadCloud,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { DownloadJob } from '../types';
import { getFileDownloadUrl } from '../services/api';

interface QueueTableProps {
  jobs: DownloadJob[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigateDownloader: () => void;
}

export const QueueTable: React.FC<QueueTableProps> = ({
  jobs,
  onCancel,
  onRetry,
  onDelete,
  onNavigateDownloader,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');
  const [search, setSearch] = useState('');

  const filtered = jobs.filter((j) => {
    if (filter === 'active') {
      if (j.status !== 'downloading' && j.status !== 'converting' && j.status !== 'queued') return false;
    } else if (filter === 'completed') {
      if (j.status !== 'completed') return false;
    } else if (filter === 'failed') {
      if (j.status !== 'failed' && j.status !== 'cancelled') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const title = (j.file_name || j.title || '').toLowerCase();
      const platform = (j.platform || '').toLowerCase();
      return title.includes(q) || platform.includes(q);
    }
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-[var(--surface-secondary)] p-1 border border-[var(--border-color)]">
          {(['all', 'active', 'completed', 'failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-mono font-medium capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[var(--surface-primary)] text-[var(--accent)] font-bold border border-[var(--border-color)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter queue by title..."
            className="w-full h-8 pl-8 pr-3 bg-[var(--surface-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
          />
        </div>
      </div>

      {/* High-density Queue Table / List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-3">
          <DownloadCloud size={32} className="mx-auto text-[var(--text-muted)]" />
          <div className="text-xs font-semibold text-[var(--text-primary)]">No jobs in queue</div>
          <p className="text-[11px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Your transfer queue is clear. Enter a link in Downloader to queue new tasks.
          </p>
          <button
            onClick={onNavigateDownloader}
            className="mt-1 px-4 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Open Downloader
          </button>
        </div>
      ) : (
        <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] divide-y divide-[var(--border-color)] overflow-hidden">
          {filtered.map((job) => (
            <div key={job.id} className="p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 hover:bg-[var(--surface-hover)]/30 transition-colors">
              
              {/* File Info */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[10px] font-mono font-medium text-[var(--text-secondary)]">
                    {job.platform}
                  </span>
                  <span className="px-1.5 py-0.2 bg-[var(--accent-subtle)] border border-[var(--accent)]/30 text-[var(--accent)] text-[10px] font-mono font-semibold uppercase">
                    {job.target_format}
                  </span>
                  <span className={`text-[10px] font-mono font-medium uppercase ${
                    job.status === 'completed'
                      ? 'text-[var(--success)]'
                      : job.status === 'failed' || job.status === 'cancelled'
                      ? 'text-[var(--error)]'
                      : 'text-[var(--text-secondary)] animate-pulse'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {job.file_name || job.title}
                </div>

                {/* Progress bar and metrics */}
                <div className="flex items-center gap-3 pt-0.5">
                  <div className="w-32 h-1.5 bg-[var(--surface-secondary)] overflow-hidden border border-[var(--border-color)]">
                    <div
                      className={`h-full ${
                        job.status === 'failed' ? 'bg-[var(--error)]' : (job.status === 'completed' ? 'bg-[var(--success)]' : 'bg-[var(--accent)]')
                      }`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {job.progress}%
                  </span>
                  {job.speed_str && job.status === 'downloading' && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {job.speed_str}
                    </span>
                  )}
                  {job.file_size_str && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {job.file_size_str}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                {job.status === 'completed' && (
                  <a
                    href={getFileDownloadUrl(job.id)}
                    download
                    className="h-7 px-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Save</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}

                {(job.status === 'downloading' || job.status === 'queued') && (
                  <button
                    onClick={() => onCancel(job.id)}
                    className="h-7 px-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--surface-secondary)] text-xs font-mono transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                {(job.status === 'failed' || job.status === 'cancelled') && (
                  <button
                    onClick={() => onRetry(job.id)}
                    className="h-7 px-2.5 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] text-xs flex items-center gap-1 border border-[var(--border-color)] transition-colors cursor-pointer font-mono"
                  >
                    <RotateCcw size={12} />
                    <span>Retry</span>
                  </button>
                )}

                <button
                  onClick={() => onDelete(job.id)}
                  className="p-1.5 border border-[var(--border-color)] hover:border-[var(--error)]/40 text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                  title="Remove from queue"
                >
                  <Trash2 size={13} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
