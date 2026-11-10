import React from 'react';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  X, 
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { DownloadJob } from '../types';
import { getFileDownloadUrl } from '../services/api';

interface DownloadProgressProps {
  job: DownloadJob;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}

export const DownloadProgress: React.FC<DownloadProgressProps> = ({
  job,
  onCancel,
  onRetry,
}) => {
  const getStageLabel = () => {
    switch (job.status) {
      case 'queued': return 'Queued in worker pipeline';
      case 'downloading': return 'Transferring media stream';
      case 'converting': return 'Multiplexing / transcoding container';
      case 'completed': return 'Transfer and verification complete';
      case 'failed': return 'Transfer encountered an error';
      case 'cancelled': return 'Job cancelled';
      default: return job.status;
    }
  };

  return (
    <div className="w-full bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-xl p-4 space-y-3 shadow-xs transition-colors">
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              job.status === 'completed'
                ? 'bg-[var(--success)]'
                : job.status === 'failed' || job.status === 'cancelled'
                ? 'bg-[var(--error)]'
                : 'bg-[var(--accent)] animate-pulse'
            }`} />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              {getStageLabel()}
            </span>
          </div>

          <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {job.file_name || job.title}
          </div>
        </div>

        {/* Percentage Counter */}
        <div className="text-right shrink-0">
          <span className="text-sm font-mono font-semibold text-[var(--text-primary)]">
            {job.progress}%
          </span>
        </div>
      </div>

      {/* Sleek Progress Bar */}
      <div className="w-full h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
        <div
          className={`h-full transition-all duration-200 ease-out ${
            job.status === 'failed' || job.status === 'cancelled'
              ? 'bg-[var(--error)]'
              : job.status === 'completed'
              ? 'bg-[var(--success)]'
              : 'bg-[var(--accent)]'
          }`}
          style={{ width: `${job.progress}%` }}
        />
      </div>

      {/* Telemetry Metrics & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[var(--text-secondary)]">
        <div className="flex items-center gap-4">
          <span>Speed: <strong className="text-[var(--text-primary)] font-medium">{job.speed_str}</strong></span>
          <span>ETA: <strong className="text-[var(--text-primary)] font-medium">{job.eta_str}</strong></span>
          {job.file_size_str && (
            <span>Size: <strong className="text-[var(--text-primary)] font-medium">{job.file_size_str}</strong></span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {job.status === 'completed' && (
            <a
              href={getFileDownloadUrl(job.id)}
              download
              className="h-7 px-3 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium font-sans flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Save File</span>
              <ArrowUpRight size={13} />
            </a>
          )}

          {(job.status === 'downloading' || job.status === 'queued') && (
            <button
              onClick={() => onCancel(job.id)}
              className="h-7 px-2.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--error)] hover:bg-[var(--surface-secondary)] text-xs font-sans transition-colors"
            >
              Cancel
            </button>
          )}

          {(job.status === 'failed' || job.status === 'cancelled') && (
            <button
              onClick={() => onRetry(job.id)}
              className="h-7 px-2.5 rounded-md bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] text-xs font-sans flex items-center gap-1 border border-[var(--border-color)] transition-colors"
            >
              <RotateCcw size={12} />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>

      {job.error && (
        <div className="p-2 rounded-md bg-[var(--error-subtle)] text-[11px] text-[var(--error)] font-mono">
          {job.error}
        </div>
      )}

    </div>
  );
};
