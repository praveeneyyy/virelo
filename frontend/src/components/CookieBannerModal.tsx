import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cookie, 
  Upload, 
  FileText, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  HelpCircle,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { CookieStatus } from '../types';
import { getCookieStatus, uploadCookieFile, saveCookieText, deleteCookies } from '../services/api';
import { useToast } from '../context/ToastContext';

interface CookieBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCookiesUpdated?: () => void;
  initialError?: string | null;
}

export const CookieBannerModal: React.FC<CookieBannerModalProps> = ({
  isOpen,
  onClose,
  onCookiesUpdated,
  initialError,
}) => {
  const [cookieStatus, setCookieStatus] = useState<CookieStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'guide'>('upload');
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      const status = await getCookieStatus();
      setCookieStatus(status);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const res = await uploadCookieFile(file);
      setCookieStatus(res);
      toast('cookies.txt successfully loaded into VIRELO engine!', 'success');
      onCookiesUpdated?.();
    } catch (err: any) {
      toast(err.response?.data?.detail || 'Failed to upload cookie file.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;

    setLoading(true);
    try {
      const res = await saveCookieText(pasteText.trim());
      setCookieStatus(res);
      toast('Cookies saved successfully!', 'success');
      setPasteText('');
      onCookiesUpdated?.();
    } catch (err: any) {
      toast(err.response?.data?.detail || 'Failed to parse cookie text.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove the stored cookies.txt?')) return;
    setLoading(true);
    try {
      const res = await deleteCookies();
      setCookieStatus(res);
      toast('Stored cookies removed.', 'info');
      onCookiesUpdated?.();
    } catch (err: any) {
      toast('Failed to delete cookies.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <Cookie size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>YouTube Bot Bypass & Cookie Assistant</span>
                {cookieStatus?.has_cookies ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>Cookies Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    <span>No Cookies Loaded</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Bypass YouTube "Sign in to confirm you're not a bot" challenge effortlessly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Bot Challenge Alert if initial error provided */}
        {initialError && (
          <div className="mx-5 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <strong className="font-semibold block">YouTube Bot Challenge Triggered</strong>
              <p className="text-[11px] text-red-700 leading-relaxed">
                YouTube is enforcing an anti-bot verification for this link. Uploading or pasting your standard browser cookies solves this instantly with 100% success.
              </p>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="px-5 pt-4 flex gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload size={13} />
            <span>Upload cookies.txt</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={13} />
            <span>Paste Cookie Text</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <HelpCircle size={13} />
            <span>How to Export in 10s</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-6 text-center transition-all bg-slate-50/50 hover:bg-violet-50/20 group cursor-pointer relative">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {loading ? <RefreshCw size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <h3 className="text-xs font-bold text-slate-800">
                  {loading ? 'Processing Cookie File...' : 'Click or Drag & Drop your cookies.txt'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Standard Netscape format exported from Chrome, Brave, Edge, or Firefox.
                </p>
              </div>

              {cookieStatus?.has_cookies && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600" />
                    <span>{cookieStatus.message}</span>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 p-1.5 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    title="Remove cookies"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Paste Netscape Format Cookies
                </label>
                <textarea
                  rows={7}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`# Netscape HTTP Cookie File\n# https://curl.haxx.se/rfc/cookie_spec.html\n.youtube.com\tTRUE\t/\tTRUE\t174567890\tPREF\tf4=4000000\n...`}
                  className="w-full text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Saved locally to backend/data/cookies.txt
                </span>
                <button
                  type="submit"
                  disabled={loading || !pasteText.trim()}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
                >
                  {loading && <RefreshCw size={13} className="animate-spin" />}
                  <span>Save Cookie File</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: STEP-BY-STEP EXPORT GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="p-3 bg-violet-50/70 border border-violet-100 rounded-xl text-violet-900 font-medium">
                Exporting your cookies takes only 15 seconds and bypasses all YouTube bot barriers permanently.
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Install Cookie Exporter Extension</strong>
                    <span className="text-slate-500 text-[11px]">
                      Install the free open-source Chrome/Brave/Edge extension: 
                    </span>
                    <a 
                      href="https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-violet-600 font-bold inline-flex items-center gap-1 hover:underline ml-1"
                    >
                      <span>Get cookies.txt locally</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Navigate to YouTube</strong>
                    <span className="text-slate-500 text-[11px]">
                      Open <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="text-violet-600 underline">youtube.com</a> in your browser.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Click Export & Drop Here</strong>
                    <span className="text-slate-500 text-[11px]">
                      Click the extension in your browser toolbar, click <strong>"Export"</strong>, and upload the downloaded <code>cookies.txt</code> file to Tab 1 above!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>100% Private: Cookies stay locally on your device only.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
