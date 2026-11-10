import React from 'react';
import { Cpu, Shield, Film, Music, CheckCircle2, Lock, ArrowRight, Server, Zap, Database, Terminal } from 'lucide-react';
import { ViewTab } from '../types';
import { VireloLogo } from '../components/VireloLogo';

interface AboutViewProps {
  onNavigate?: (tab: ViewTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      
      {/* Title & Eyebrow */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-700">
          <Terminal size={13} />
          <span>ARCHITECTURAL SPECIFICATION</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          About VIRELO: Media Extraction Built for Performance & Privacy
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Industrial-grade universal media ingest workstation leveraging native FFmpeg 9.0, yt-dlp, Python 3.12, and zero-log ephemeral storage.
        </p>

        <p className="text-xs text-slate-500 italic font-serif">
          architected & maintained • <em>made by Praveen kumar</em>
        </p>
      </div>

      {/* Mission & Philosophy Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-violet-600 tracking-wider uppercase">
          SYSTEM PHILOSOPHY & CORE OBJECTIVES
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          VIRELO is engineered as a clean, self-hosted universal media ingest and format conversion platform. Rather than relying on fragile cloud scraping APIs or ad-injecting download websites, VIRELO runs directly on your machine or private node, leveraging native <strong>FFmpeg 9.0</strong>, <strong>yt-dlp</strong>, and <strong>Python 3.12</strong> to extract, multiplex, and preserve digital media at maximum native bitrate.
        </p>
      </div>

      {/* Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Film size={16} className="text-violet-600" />
            <span>Video Decoupling & Remuxing</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Modern video services deliver video and audio on separate adaptive DASH/HLS tracks. VIRELO fetches maximum-resolution video (up to 4K 60fps) and highest-bitrate audio streams simultaneously, multiplexing them directly into standard MP4, MKV, or WebM containers with zero re-encoding loss.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Music size={16} className="text-emerald-600" />
            <span>Audio & ID3 Mutagen Tagging</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Extracts pristine audio streams and transcodes into MP3 (up to 320 kbps), M4A, FLAC, WAV, and Opus. Uses <strong>Mutagen</strong> to inject ID3v2 tags (Title, Artist, Album) and permanently embed high-resolution cover artwork into the audio container.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cpu size={16} className="text-blue-600" />
            <span>Pinterest HD Master Ingestion</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Proprietary heuristic parsing detects Pinterest image pins and extracts full-scale raw photos by converting thumbnail feeds to uncompressed original source assets without 564px compression bounds.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Shield size={16} className="text-red-500" />
            <span>SSRF Guard & Threat Boundary</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built-in security blocks loopback requests, RFC1918 private subnets, and AWS/Cloud metadata endpoints (169.254.169.254). Filenames are sanitized against Windows/Linux path injection and directory traversal.
          </p>
        </div>

      </div>

      {/* TECH STACK TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Runtime Specifications & Tech Stack
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-500 text-[10px] font-bold">MEDIA ENGINE</span>
            <span className="font-bold text-slate-800">FFmpeg 9.0</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-500 text-[10px] font-bold">EXTRACTOR CORE</span>
            <span className="font-bold text-slate-800">yt-dlp (Nightly)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-500 text-[10px] font-bold">SERVER BACKEND</span>
            <span className="font-bold text-slate-800">FastAPI & Python 3.12</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="block text-slate-500 text-[10px] font-bold">FRONTEND CLIENT</span>
            <span className="font-bold text-slate-800">React 18 + Vite + Tailwind</span>
          </div>
        </div>
      </div>

      {/* Retention & Compliance Notice */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Lock size={14} className="text-violet-600" />
          <span>Statutory Compliance & Ephemeral Storage</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          VIRELO retains active jobs and downloaded media files for a maximum of 30 minutes before permanently purging them from disk and memory. VIRELO does not circumvent DRM, paywalls, or private access barriers.
        </p>
        {onNavigate && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 underline"
            >
              Contact Engineering
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => onNavigate('terms')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 underline"
            >
              Terms of Service
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
