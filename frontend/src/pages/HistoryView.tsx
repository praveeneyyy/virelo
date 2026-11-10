import React, { useState } from 'react';
import { History, Search, Trash2, CheckCircle2, XCircle, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { clearHistory } from '../services/api';
import { ViewTab } from '../types';

interface HistoryProps {
  history: any[];
  onRefresh: () => void;
  onNavigate: (tab: ViewTab) => void;
}

export const HistoryView: React.FC<HistoryProps> = ({ history, onRefresh, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.file_name && item.file_name.toLowerCase().includes(q)) ||
      (item.platform && item.platform.toLowerCase().includes(q))
    );
  });

  const handleClear = async () => {
    if (confirm('Clear all historical download records?')) {
      try {
        await clearHistory();
        onRefresh();
      } catch (err: any) {
        alert(`Error clearing history: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('downloader')}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <History size={20} className="text-[#ff2b6d]" />
                <span>Download History</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Persistent archive of your completed files
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff2b6d]"
              />
            </div>

            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* List of Historical Items */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
            <History size={36} className="mx-auto text-slate-300" />
            <div className="text-sm font-bold text-slate-800">No history records</div>
            <div className="text-xs text-slate-500">
              Downloads you complete will appear here for easy reference and redownload.
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {filtered.map((item, idx) => (
              <div key={item.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-rose-100 text-rose-600'
                  }`}>
                    {item.status === 'completed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {item.file_name || item.title || 'Media File'}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
                      <span className="font-bold text-slate-600">{item.platform}</span>
                      <span>•</span>
                      <span>{item.format?.toUpperCase()}</span>
                      <span>•</span>
                      <span className="font-mono">{item.file_size_str || '--'}</span>
                    </div>
                  </div>
                </div>

                {item.job_id && item.status === 'completed' && (
                  <a
                    href={`/api/download/${item.job_id}/file`}
                    download
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#ff2b6d] text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Save</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
