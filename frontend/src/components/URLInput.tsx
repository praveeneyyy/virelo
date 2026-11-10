import React, { useRef, useEffect } from 'react';
import { Link2, X, Clipboard, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface URLInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export const URLInput: React.FC<URLInputProps> = ({
  url,
  onChangeUrl,
  onSubmit,
  isLoading,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeUrl(text.trim());
        if (inputRef.current) inputRef.current.focus();
      }
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    onChangeUrl('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center bg-[var(--surface-primary)] border border-[var(--border-color)] hover:border-[var(--border-hover)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-subtle)] rounded-xl transition-all shadow-xs overflow-hidden h-12">
        {/* Leading Link Icon */}
        <div className="pl-3.5 pr-2 text-[var(--text-muted)] shrink-0">
          <Link2 size={16} />
        </div>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a video, audio or file URL..."
          className="flex-1 h-full bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none tracking-tight font-normal"
        />

        {/* Trailing Controls: Clear + Paste + Submit */}
        <div className="flex items-center gap-1.5 pr-2 shrink-0">
          {url.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
              title="Clear text"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-color)] rounded-md transition-colors"
          >
            <Clipboard size={12} />
            <span>Paste</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !url.trim()}
            className="h-8 px-4 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Inspecting</span>
              </>
            ) : (
              <>
                <span>Inspect</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--error-subtle)] border border-[var(--error)]/30 text-[11px] text-[var(--error)] font-medium animate-in fade-in duration-150">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
