import React, { useState } from 'react';
import { Mail, Copy, Check, MessageSquare, Shield, Clock, Send, ArrowRight } from 'lucide-react';
import { ViewTab } from '../types';
import { VireloLogo } from '../components/VireloLogo';

interface ContactPageViewProps {
  onNavigate: (tab: ViewTab) => void;
}

export const ContactPageView: React.FC<ContactPageViewProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('General Support & Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contactEmail = 'praveensky2006@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate mailto link
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(`[VIRELO] ${subject}`)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      
      {/* HEADER SECTION */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-700">
          <Mail size={13} />
          <span>DIRECT DEVELOPER INQUIRIES</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch with the VIRELO Team
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Have questions about supported platforms, encountered an extraction error, or need custom pipeline integrations? We respond promptly to all developer inquiries.
        </p>

        <p className="text-xs text-slate-500 italic font-serif">
          crafted with care • <em>made by Praveen kumar</em>
        </p>
      </div>

      {/* CORE CONTACT HIGHLIGHT CARD */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-violet-200 tracking-wider uppercase">Direct Email Contact</span>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white break-all">
              {contactEmail}
            </div>
            <p className="text-xs text-violet-200">
              Direct inbox for technical inquiries, bug reports, and DMCA notices.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Email'}</span>
            </button>

            <a
              href={`mailto:${contactEmail}?subject=VIRELO%20Inquiry`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-violet-900 hover:bg-violet-50 font-bold text-xs shadow-md transition-all"
            >
              <Send size={14} />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2.5 text-violet-100">
            <Clock size={16} className="text-violet-300 shrink-0" />
            <span>Response SLA: Under 24 Hours</span>
          </div>
          <div className="flex items-center gap-2.5 text-violet-100">
            <Shield size={16} className="text-violet-300 shrink-0" />
            <span>PGP / Secure Communications</span>
          </div>
          <div className="flex items-center gap-2.5 text-violet-100">
            <MessageSquare size={16} className="text-violet-300 shrink-0" />
            <span>Community Feedback Welcome</span>
          </div>
        </div>
      </div>

      {/* QUICK INQUIRY FORM */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Send a Quick Inquiry
          </h2>
          <p className="text-xs text-slate-500">
            Compose your message here. Clicking submit will open your default email client addressed to <strong className="font-semibold text-slate-700">{contactEmail}</strong>.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inquiry Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="General Support & Feedback">General Support & Feedback</option>
                <option value="Broken Extractor / Video Failure">Report Broken Extractor or Site Error</option>
                <option value="Feature / Format Request">Feature or Codec Request</option>
                <option value="API & Architecture Inquiries">API & Architecture Inquiries</option>
                <option value="DMCA & Copyright Notice">Statutory DMCA & Legal Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Details / Problematic URL
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include URL of the media you tried to download, operating system, and any error message displayed..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Send size={14} />
              <span>Launch Email Client</span>
            </button>

            {submitted && (
              <p className="text-xs text-emerald-600 text-center font-medium">
                Email composer opened. If nothing happened, write directly to {contactEmail}.
              </p>
            )}
          </form>
        </div>

        {/* SIDEBAR CARDS */}
        <div className="md:col-span-2 space-y-4">
          
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              DMCA Notice Process
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              VIRELO acts strictly as an automated media format conversion utility and does not store or host copyrighted media. To file a statutory DMCA takedown request under 17 U.S.C. § 512, email with identification of the copyrighted work and authorization.
            </p>
            <button
              onClick={() => onNavigate('terms')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 pt-1"
            >
              <span>View Terms of Service</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Zero-Log Commitment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              VIRELO does not log user IP addresses or keep download histories beyond the strictly necessary 30-minute queue lifecycle. Files are wiped automatically from disk.
            </p>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 pt-1"
            >
              <span>Read Privacy Policy</span>
              <ArrowRight size={12} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
