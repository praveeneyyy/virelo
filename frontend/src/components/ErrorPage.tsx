import React from 'react';
import { AlertCircle, RotateCcw, Home, HelpCircle, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { ViewTab } from '../types';

interface ErrorPageProps {
  errorMessage?: string;
  errorCode?: string | number;
  errorDetails?: string;
  onRetry?: () => void;
  onNavigate: (tab: ViewTab) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  errorMessage = "Extraction Pipeline Failure",
  errorCode = 502,
  errorDetails = "The upstream media stream could not be resolved or the source server rejected the connection.",
  onRetry,
  onNavigate
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 pb-16">
      
      {/* Top Warning Banner */}
      <div className="p-6 bg-[var(--surface-primary)] border border-[var(--border-color)] border-l-4 border-l-[var(--error)] space-y-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--error-subtle)] text-[var(--error)] flex items-center justify-center border border-[var(--error)]/30 shrink-0">
            <AlertCircle size={22} />
          </div>
          <div>
            <span className="text-[11px] font-mono text-[var(--error)] font-bold uppercase tracking-wider block">
              Error Code: {errorCode}
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
              {errorMessage}
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {errorDetails}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          {onRetry && (
            <button
              onClick={onRetry}
              className="h-10 px-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw size={14} />
              <span>Retry Operation</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('downloader')}
            className="h-10 px-5 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Home size={14} />
            <span>Return to Downloader</span>
          </button>

          <button
            onClick={() => onNavigate('platforms')}
            className="h-10 px-5 bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <HelpCircle size={14} />
            <span>Supported Platforms Directory</span>
          </button>
        </div>

      </div>

      {/* Troubleshooting Matrix */}
      <div className="p-6 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-4">
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Terminal size={16} className="text-[var(--accent)]" />
          <span>Diagnostic Checklist & Troubleshooting</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
          
          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Private or Login-Gated Media</strong>
            <p className="text-[11px] leading-relaxed">
              If the media requires an account login, age-verification, or private authorization, public extraction will be refused by the host.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Geo-Blocked Content</strong>
            <p className="text-[11px] leading-relaxed">
              Certain broadcasters enforce geographical distribution fences on streams. Try checking if the video plays in your local web browser.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Invalid URL Format</strong>
            <p className="text-[11px] leading-relaxed">
              Verify that the full address begins with <code>http://</code> or <code>https://</code> and contains no extraneous clipboard characters.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1">
            <strong className="text-[var(--text-primary)] block">Upstream Rate Limiting</strong>
            <p className="text-[11px] leading-relaxed">
              If multiple consecutive requests were dispatched, the host may temporarily throttle extraction. Waiting 60 seconds usually resolves this.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
