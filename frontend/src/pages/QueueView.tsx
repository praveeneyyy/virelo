import React, { useState } from 'react';
import { 
  ListOrdered, 
  Trash2, 
  DownloadCloud, 
  CheckCircle2, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { DownloadJob, ViewTab } from '../types';
import { cancelJob, retryJob, deleteJob, getFileDownloadUrl } from '../services/api';

interface QueueProps {
  jobs: DownloadJob[];
  onNavigate: (tab: ViewTab) => void;
  onRefresh: () => void;
}

export const QueueView: React.FC<QueueProps> = ({ jobs, onNavigate, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'failed'>('all');

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'active') return j.status === 'downloading' || j.status === 'converting' || j.status === 'queued';
    if (filter === 'completed') return j.status === 'completed';
    if (filter === 'failed') return j.status === 'failed' || j.status === 'cancelled';
    return true;
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelJob(id);
      onRefresh();
    } catch (e: any) {
      alert(`Cancel error: ${e.message}`);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await retryJob(id);
      onRefresh();
    } catch (e: any) {
      alert(`Retry error: ${e.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id, false);
      onRefresh();
    } catch (e: any) {
      alert(`Delete error: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header & Back Button */}
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
                <ListOrdered size={20} className="text-[#ff2b6d]" />
                <span>Download Queue</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Active transfers, transcode progress, and completed files
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            {(['all', 'active', 'completed', 'failed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[#ff2b6d] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Items List */}
        {filteredJobs.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
            <DownloadCloud size={36} className="mx-auto text-slate-300" />
            <div className="text-sm font-bold text-slate-800">No jobs in queue</div>
            <div className="text-xs text-slate-500 max-w-sm mx-auto">
              Your transfer queue is currently empty. Start downloading to view live progress here.
            </div>
            <button
              onClick={() => onNavigate('downloader')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#ff2b6d] hover:bg-[#e11d59] text-white font-bold text-xs shadow-md shadow-[#ff2b6d]/30 transition-all"
            >
              Start New Download
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-[10px] text-slate-600">
                        {job.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-100 font-extrabold text-[10px] text-[#ff2b6d] uppercase">
                        {job.target_format}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        job.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : job.status === 'failed' || job.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {job.file_name || job.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#ff2b6d] font-mono">
                      {job.progress}%
                    </div>
                    {job.file_size_str && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {job.file_size_str}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'failed' ? 'bg-rose-500' : 'bg-[#ff2b6d]'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                {/* Actions & Metrics Row */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Speed: <strong className="text-slate-800">{job.speed_str}</strong></span>
                    <span>ETA: <strong className="text-slate-800">{job.eta_str}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'completed' && (
                      <a
                        href={getFileDownloadUrl(job.id)}
                        download={job.file_name || 'download'}
                        className="px-3.5 py-1.5 rounded-xl bg-[#ff2b6d] hover:bg-[#e11d59] text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Save to Downloads
                      </a>
                    )}

                    {(job.status === 'downloading' || job.status === 'queued') && (
                      <button
                        onClick={() => handleCancel(job.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {(job.status === 'failed' || job.status === 'cancelled') && (
                      <button
                        onClick={() => handleRetry(job.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        <RotateCcw size={12} />
                        <span>Retry</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {job.error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {job.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
