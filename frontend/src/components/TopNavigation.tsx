import React, { useState } from 'react';
import { Download, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { ViewTab } from '../types';
import { VireloLogo } from './VireloLogo';

interface TopNavigationProps {
  currentTab?: ViewTab;
  onSelectTab?: (tab: ViewTab) => void;
  onScrollToSection?: (sectionId: string) => void;
  activeJobsCount?: number;
  health?: any;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentTab = 'downloader',
  onSelectTab,
  onScrollToSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, tabFallback: ViewTab = 'downloader') => {
    setMobileMenuOpen(false);
    if (currentTab !== 'downloader' && onSelectTab) {
      onSelectTab(tabFallback);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      if (onScrollToSection) {
        onScrollToSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { label: 'Home', action: () => { setMobileMenuOpen(false); onSelectTab?.('downloader'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { label: 'Features', action: () => handleNavClick('features-section') },
    { label: 'Platforms', action: () => handleNavClick('platforms-section') },
    { label: 'How It Works', action: () => handleNavClick('how-it-works-section') },
    { label: 'Converter', action: () => { setMobileMenuOpen(false); onSelectTab?.('convert' as ViewTab); } },
    { label: 'FAQ', action: () => handleNavClick('faq-section') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: VIRELO Brand Identity */}
        <button
          onClick={() => {
            onSelectTab?.('downloader');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          title="VIRELO Universal Media Downloader"
        >
          <VireloLogo size="md" showWordmark={true} />
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50/70 transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Download CTA & Mobile Hamburger (Strictly No Dark Toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentTab !== 'downloader') onSelectTab?.('downloader');
              const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (inputEl) {
                inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                inputEl.focus();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-medium text-sm transition-all shadow-sm shadow-purple-600/20 hover:shadow-md hover:shadow-purple-600/30 cursor-pointer"
          >
            <Download size={15} />
            <span>Download Now</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-2xl px-5 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentTab !== 'downloader') onSelectTab?.('downloader');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Download size={15} />
              <span>Analyze Media URL</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
