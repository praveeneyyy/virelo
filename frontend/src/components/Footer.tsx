import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  Clock, 
  Mail, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Heart,
  HardDrive
} from 'lucide-react';
import { ViewTab } from '../types';
import { VireloLogo } from './VireloLogo';

interface FooterProps {
  onNavigate?: (tab: ViewTab) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToSection }) => {
  const [copied, setCopied] = useState(false);
  const contactEmail = 'praveensky2006@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNav = (tab: ViewTab, sectionId?: string) => {
    if (sectionId) {
      if (onScrollToSection) {
        onScrollToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/90 pt-16 pb-12 mt-20 text-slate-600 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Feature Highlight Strip: Billion-Dollar Touch */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white shadow-xl shadow-purple-950/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-purple-200 backdrop-blur-md">
              <Cpu size={13} className="text-purple-300" />
              <span>Native FFmpeg 9.0 Core • yt-dlp Extraction</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ready to save your favorite media in high fidelity?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
              No ads, no watermarks, no account registration. Universal stream extraction with 30-minute auto-purge storage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <a
              href={`mailto:${contactEmail}`}
              className="px-5 py-3 rounded-xl bg-white hover:bg-purple-50 text-purple-900 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Mail size={16} />
              <span>Email Support</span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : contactEmail}</span>
            </button>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="col-span-2 space-y-4">
            <VireloLogo size="md" showWordmark={true} />
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              VIRELO is a universal media extraction and local transcoding suite. Delivering uncompressed audio, ultra HD video, and animated GIFs directly to your local workstation.
            </p>
            
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Direct Inquiries & Contact
              </span>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 hover:underline transition-colors"
              >
                <Mail size={15} />
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'features-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'platforms-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Supported Platforms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('convert' as ViewTab)}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Media Converter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'how-it-works-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'formats-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Formats & Quality
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'about-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  About VIRELO
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('downloader', 'faq-section')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  FAQ & Guide
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-slate-600 hover:text-purple-700 transition-colors block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('error')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  System Diagnostics
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/praveeneyyy/virelo/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <span>Contribute (Open Source)</span>
                  <ArrowUpRight size={13} className="text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/praveeneyyy/virelo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight size={13} className="text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Legal & Policy
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('privacy')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('terms')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('fairuse')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Fair Use (17 U.S.C. § 107)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('terms')}
                  className="text-slate-600 hover:text-purple-700 transition-colors cursor-pointer text-left"
                >
                  Copyright & DMCA
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Technical Capabilities & Ephemeral Guarantee Bar */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 shadow-xs">
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span className="font-semibold text-slate-800">VIRELO Engine:</span>
            <span>FFmpeg 9.0 Core</span>
            <span>•</span>
            <span>yt-dlp Live Extractors</span>
            <span>•</span>
            <span>Mutagen ID3 Tagging</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Zero Server Storage (Direct Device Delivery)</span>
          </div>
          <div className="text-slate-400">
            100% Client-Side Device Downloads Privacy
          </div>
        </div>

        {/* Bottom Bar: Copyright and Italic Maker Attribution */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} VIRELO. All rights reserved. Your Media. Your Way.
          </p>

          {/* Requested Praveen Kumar Italic Mention */}
          <div className="flex items-center gap-1.5 text-center sm:text-right">
            <span>Website and application</span>
            <span className="font-serif italic font-normal text-base text-purple-700 px-1">
              made by Praveen kumar
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
