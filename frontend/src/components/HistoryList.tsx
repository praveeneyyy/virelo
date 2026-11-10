import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight 
} from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onNavigateDownloader: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClear,
  onNavigateDownloader,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.file_name && item.file_name.toLowerCase().includes(q)) ||
      (item.platform && item.platform.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search completed history..."
            className="w-full h-8 pl-8 pr-3 bg-[var(--surface-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] font-mono"
          />
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="h-8 px-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--error)] border border-[var(--border-color)] text-xs font-mono font-medium transition-colors flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Items */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <History size={32} className="mx-auto text-[var(--text-muted)]" />
          <div className="text-xs font-semibold text-[var(--text-primary)]">No history records</div>
          <p className="text-[11px] text-[var(--text-secondary)] max-w-sm mx-auto">
            Completed downloads are automatically logged here for quick reference and redownload.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] divide-y divide-[var(--border-color)] overflow-hidden">
          {filtered.map((item, idx) => (
            <div key={item.id || idx} className="p-3.5 flex items-center justify-between hover:bg-[var(--surface-hover)]/30 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                  {item.status === 'completed' ? (
                    <CheckCircle2 size={14} className="text-[var(--success)]" />
                  ) : (
                    <XCircle size={14} className="text-[var(--error)]" />
                  )}
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {item.file_name || item.title || 'Media Ingest'}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)] flex items-center gap-2">
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span className="uppercase">{item.format}</span>
                    <span>•</span>
                    <span>{item.file_size_str || '--'}</span>
                    <span>•</span>
                    <span className="text-[var(--text-muted)]">
                      {item.timestamp ? new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              </div>

              {item.job_id && item.status === 'completed' && (
                <a
                  href={`/api/download/${item.job_id}/file`}
                  download
                  className="h-7 px-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-mono font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Save</span>
                  <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
