import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ViewTab } from '../types';

interface PrivacyPolicyPageProps {
  onNavigate: (tab: ViewTab) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-3 border-b border-[var(--border-color)] pb-6">
        <button
          onClick={() => onNavigate('downloader')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Downloader</span>
        </button>
        
        <div className="flex items-center gap-2.5">
          <Lock size={24} className="text-[var(--accent)]" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Privacy Policy & Zero-Log Architecture
          </h1>
        </div>
        
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Last Updated: November 2026 • GDPR, CCPA & Privacy by Design Aligned
        </p>
      </div>

      {/* Main Body */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        
        {/* Highlight Card */}
        <div className="p-5 bg-[var(--surface-primary)] border-l-4 border-l-[var(--accent)] border border-[var(--border-color)] space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <EyeOff size={18} className="text-[var(--accent)]" />
            <span>Zero-Knowledge & Client-Side Execution Guarantee</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            VIRELO was engineered from day one to operate without data collection. We do not track your IP address, we do not log downloaded URLs, we do not sell analytical telemetry, and we do not use advertising tracking cookies.
          </p>
        </div>

        {/* Section 1 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            1. Information We Do NOT Collect
          </h2>
          <p>
            Unlike typical online conversion utilities, VIRELO is architected to eliminate unnecessary data collection at the protocol level:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-start gap-2">
              <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block">No Account Registration</strong>
                <span className="text-[11px]">No names, passwords, or emails are ever requested or stored.</span>
              </div>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-start gap-2">
              <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block">No Download Logging</strong>
                <span className="text-[11px]">Requested media URLs are parsed in transient RAM and never written to centralized logs.</span>
              </div>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-start gap-2">
              <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block">No Third-Party Trackers</strong>
                <span className="text-[11px]">Zero Google Analytics, Facebook Pixels, or external ad-tech beacons.</span>
              </div>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-start gap-2">
              <CheckCircle2 size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text-primary)] block">No File Retention</strong>
                <span className="text-[11px]">Streams save straight to your device’s local filesystem; nothing is kept on our servers.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            2. Local Storage & Client Cookies
          </h2>
          <p>
            VIRELO uses only modern browser localStorage to maintain your interface theme preference (Light or Dark) and your local transcode defaults. These settings stay strictly within your browser sandbox and are never transmitted to external endpoints.
          </p>
        </section>

        {/* Section 3 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            3. Direct Upstream Transmission
          </h2>
          <p>
            When you initiate a media download, your request initiates direct HTTP stream multiplexing from the hosting platform's CDN (e.g. YouTube, Instagram, or direct servers). Your IP address is communicated directly to the upstream content provider in accordance with standard internet protocol communications.
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            4. User Rights Under GDPR & CCPA
          </h2>
          <p>
            Because VIRELO maintains zero centralized databases, user accounts, or persistent personal identifier records, we hold no user data to inspect, export, or delete. You retain 100% control over all media files and application configuration directly on your local workstation.
          </p>
        </section>

      </div>
    </div>
  );
};
