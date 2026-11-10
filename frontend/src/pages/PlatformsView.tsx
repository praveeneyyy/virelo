import React, { useState, useEffect } from 'react';
import { Globe, Search, ShieldCheck, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { PlatformItem } from '../types';
import { getPlatforms } from '../services/api';

export const PlatformsView: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [totalCount, setTotalCount] = useState('1,700+');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatforms().then((res) => {
      setPlatforms(res.popular);
      setTotalCount(res.total_supported);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = platforms.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.url_pattern.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
            <Globe size={14} />
            <span>Live Extraction Catalogue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Extraction Integrations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {totalCount} platforms verified with hardware-accelerated stream extraction and chunk resumption
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search platform or domain..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 font-medium"
          />
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div 
            key={idx} 
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{item.name}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                  VERIFIED
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.category}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Pattern:</span>
              <span className="text-purple-700 font-semibold truncate max-w-[190px]">{item.url_pattern}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Capabilities Overview Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-slate-50 border border-purple-100 space-y-4 shadow-sm">
        <h3 className="text-sm font-mono font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
          <Layers size={16} className="text-purple-600" />
          <span>Extraction Capability Matrix</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <CheckCircle2 size={15} className="text-purple-600" />
              <span>Video Decoupling & Multiplexing</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Streams high-bitrate adaptive video and audio tracks independently and combines them through native FFmpeg into MP4, MKV, or WebM without quality drop.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <CheckCircle2 size={15} className="text-purple-600" />
              <span>Pinterest HD Master Images</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Custom regex inspection detects thumbnail feeds and converts URLs directly to full-size uncompressed originals without recompression.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <CheckCircle2 size={15} className="text-purple-600" />
              <span>Universal Direct File Ingest</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Streams remote ZIP, PDF, ISO, and media archives in 64KB chunks with HTTP Range header verification for seamless interruption recovery.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
