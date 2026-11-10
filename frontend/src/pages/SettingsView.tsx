import React, { useState, useEffect } from 'react';
import { Sliders, Save, HardDrive, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { AppSettings, SystemHealth, ViewTab } from '../types';
import { getSettings, updateSettings } from '../services/api';

interface SettingsProps {
  health: SystemHealth | null;
  onRefreshHealth: () => void;
  onNavigate: (tab: ViewTab) => void;
}

export const SettingsView: React.FC<SettingsProps> = ({ health, onRefreshHealth, onNavigate }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Save settings failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('downloader')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sliders size={20} className="text-[#ff2b6d]" />
              <span>Downloader Settings</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage transcode options, storage folder, and worker concurrency
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Storage & Concurrency */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Storage & Queue
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Downloads Directory</label>
              <input
                type="text"
                readOnly
                value={settings.downloads_path}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono select-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Max Concurrent Downloads</label>
              <select
                value={settings.max_concurrent_downloads}
                onChange={(e) => setSettings({ ...settings, max_concurrent_downloads: parseInt(e.target.value) })}
                className="w-48 h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff2b6d]"
              >
                <option value="1">1 Worker</option>
                <option value="2">2 Workers</option>
                <option value="3">3 Workers (Recommended)</option>
                <option value="5">5 Workers</option>
              </select>
            </div>
          </div>

          {/* Formats Defaults */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Defaults Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Quality</label>
                <select
                  value={settings.default_video_quality}
                  onChange={(e) => setSettings({ ...settings, default_video_quality: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff2b6d]"
                >
                  <option value="best">Best Available (4K / 1080p)</option>
                  <option value="2160">4K (2160p)</option>
                  <option value="1080">Full HD (1080p)</option>
                  <option value="720">HD (720p)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Video Format</label>
                <select
                  value={settings.default_video_format}
                  onChange={(e) => setSettings({ ...settings, default_video_format: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff2b6d]"
                >
                  <option value="mp4">MP4 (Universal)</option>
                  <option value="mkv">MKV</option>
                  <option value="webm">WebM</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Audio Format</label>
                <select
                  value={settings.default_audio_format}
                  onChange={(e) => setSettings({ ...settings, default_audio_format: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff2b6d]"
                >
                  <option value="mp3">MP3</option>
                  <option value="m4a">M4A</option>
                  <option value="flac">FLAC</option>
                  <option value="wav">WAV</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Audio Bitrate</label>
                <select
                  value={settings.default_audio_bitrate}
                  onChange={(e) => setSettings({ ...settings, default_audio_bitrate: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold focus:outline-none focus:border-[#ff2b6d]"
                >
                  <option value="320">320 kbps (High Fidelity)</option>
                  <option value="256">256 kbps</option>
                  <option value="192">192 kbps</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_embed_thumbnail}
                  onChange={(e) => setSettings({ ...settings, auto_embed_thumbnail: e.target.checked })}
                  className="w-4 h-4 rounded text-[#ff2b6d] focus:ring-0"
                />
                <span>Automatically embed high-res cover art in MP3/audio files</span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>Preferences saved.</span>
              </span>
            ) : <div />}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#ff2b6d] hover:bg-[#e11d59] text-white font-bold text-xs shadow-md shadow-[#ff2b6d]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

        {/* Health Diagnostics Panel */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Engine Diagnostics
            </h3>
            <button
              onClick={onRefreshHealth}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">FFmpeg</span>
              <span className="text-slate-800 font-bold">{health?.ffmpeg_available ? 'ONLINE' : 'MISSING'}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">FFprobe</span>
              <span className="text-slate-800 font-bold">{health?.ffprobe_available ? 'ONLINE' : 'MISSING'}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">Node.js JS Engine</span>
              <span className="text-slate-800 font-bold">{health?.node_available ? 'ACTIVE' : 'MISSING'}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500">Free Disk Space</span>
              <span className="text-emerald-600 font-bold">{health ? `${health.disk_free_gb} GB` : '--'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
