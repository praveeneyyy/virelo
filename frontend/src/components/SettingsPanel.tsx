import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  HardDrive, 
  Cpu, 
  Sun, 
  Moon, 
  Monitor,
  Folder
} from 'lucide-react';
import { AppSettings, SystemHealth, ThemeMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

interface SettingsPanelProps {
  settings: AppSettings;
  onSave: (updated: Partial<AppSettings>) => Promise<void>;
  health: SystemHealth | null;
  onRefreshHealth: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings: initialSettings,
  onSave,
  health,
  onRefreshHealth,
}) => {
  const [form, setForm] = useState<AppSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form);
      toast('Engine preferences successfully saved.', 'success');
    } catch (err: any) {
      toast(`Save error: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="w-full max-w-3xl space-y-6">
      
      {/* 1. General Settings */}
      <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] p-5 space-y-4 transition-colors">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          General & Concurrency
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Download Destination Directory</div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Location where downloaded files are saved locally</div>
            </div>
            <input
              type="text"
              readOnly
              value={form.downloads_path}
              className="w-full sm:w-64 h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono select-all focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[var(--border-color)] pt-3">
            <div>
              <div className="text-xs font-medium text-[var(--text-primary)]">Concurrent Workers</div>
              <div className="text-[11px] text-[var(--text-muted)]">Maximum simultaneous media downloading threads</div>
            </div>
            <select
              value={form.max_concurrent_downloads}
              onChange={(e) => setForm({ ...form, max_concurrent_downloads: parseInt(e.target.value) })}
              className="w-32 h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="1">1 Worker</option>
              <option value="2">2 Workers</option>
              <option value="3">3 Workers</option>
              <option value="5">5 Workers</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Format & Codec Defaults */}
      <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] p-5 space-y-4 transition-colors">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Encoding Presets
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">Default Video Resolution</label>
            <select
              value={form.default_video_quality}
              onChange={(e) => setForm({ ...form, default_video_quality: e.target.value })}
              className="w-full h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="best">Best Available</option>
              <option value="2160">2160p (4K)</option>
              <option value="1440">1440p (2K)</option>
              <option value="1080">1080p (Full HD)</option>
              <option value="720">720p (HD)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">Default Video Container</label>
            <select
              value={form.default_video_format}
              onChange={(e) => setForm({ ...form, default_video_format: e.target.value })}
              className="w-full h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="mp4">MP4</option>
              <option value="mkv">MKV</option>
              <option value="webm">WebM</option>
              <option value="mov">MOV</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">Default Audio Format</label>
            <select
              value={form.default_audio_format}
              onChange={(e) => setForm({ ...form, default_audio_format: e.target.value })}
              className="w-full h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="mp3">MP3</option>
              <option value="m4a">M4A</option>
              <option value="flac">FLAC</option>
              <option value="wav">WAV</option>
              <option value="opus">Opus</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">Default Audio Bitrate</label>
            <select
              value={form.default_audio_bitrate}
              onChange={(e) => setForm({ ...form, default_audio_bitrate: e.target.value })}
              className="w-full h-8 px-2.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="320">320 kbps</option>
              <option value="256">256 kbps</option>
              <option value="192">192 kbps</option>
              <option value="128">128 kbps</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>Embed Album Artwork & ID3 Metadata</span>
          <input
            type="checkbox"
            checked={form.auto_embed_thumbnail}
            onChange={(e) => setForm({ ...form, auto_embed_thumbnail: e.target.checked })}
            className="w-4 h-4 border-[var(--border-color)] accent-[var(--accent)] cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Appearance */}
      <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] p-5 space-y-4 transition-colors">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Appearance Theme
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: <Sun size={14} /> },
            { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
            { id: 'system', label: 'System', icon: <Monitor size={14} /> },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setTheme(mode.id as ThemeMode)}
              className={`flex items-center justify-center gap-2 py-2 border text-xs font-mono font-medium transition-all cursor-pointer ${
                theme === mode.id
                  ? 'bg-[var(--surface-primary)] border-[var(--accent)] text-[var(--accent)] font-bold'
                  : 'bg-[var(--surface-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {mode.icon}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. System Diagnostics */}
      <div className="bg-[var(--surface-primary)] border border-[var(--border-color)] p-5 space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            System & Engine Diagnostics
          </div>
          <button
            type="button"
            onClick={onRefreshHealth}
            className="text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={11} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="divide-y divide-[var(--border-color)] text-xs font-mono">
          <div className="py-2 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">FFmpeg Binary</span>
            <span className="text-[var(--text-primary)] truncate max-w-sm">
              {health?.ffmpeg_path || (health?.ffmpeg_available ? 'Available' : 'Missing')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">FFprobe Binary</span>
            <span className="text-[var(--text-primary)] truncate max-w-sm">
              {health?.ffprobe_path || (health?.ffprobe_available ? 'Available' : 'Missing')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Node.js Engine (JS Runtimes)</span>
            <span className="text-[var(--text-primary)] truncate max-w-sm">
              {health?.node_path || (health?.node_available ? 'Available' : 'Missing')}
            </span>
          </div>

          <div className="py-2 flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Volume Free Capacity</span>
            <span className="text-[var(--success)] font-medium">
              {health ? `${health.disk_free_gb} GB` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 px-6 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

    </form>
  );
};
