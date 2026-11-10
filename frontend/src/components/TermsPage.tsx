import React from 'react';
import { ShieldCheck, Scale, AlertOctagon, FileText, ArrowLeft, ExternalLink } from 'lucide-react';
import { ViewTab } from '../types';

interface TermsPageProps {
  onNavigate: (tab: ViewTab) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
          <Scale size={24} className="text-[var(--accent)]" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Terms & Conditions of Service
          </h1>
        </div>
        
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Last Updated: November 2026 • Effective Immediately Across All Jurisdictions
        </p>
      </div>

      {/* Main Body */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>1. Acceptance of Terms & Intermediary Status</span>
          </h2>
          <p>
            By accessing or operating the VIRELO universal media ingestion and transcoding engine ("the Application", "VIRELO", "we", "our"), you ("the User") agree to be bound unconditionally by these Terms and Conditions. VIRELO operates purely as a neutral, technical tool and software utility designed to facilitate the lawful downloading, formatting, and transcoding of publicly accessible media streams.
          </p>
          <p>
            VIRELO does not host, index, broadcast, store, or license any third-party multimedia content on any remote servers. All media streams are delivered directly from the host content delivery network to the user’s local workstation without intermediary caching or reproduction by VIRELO.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>2. Permitted Archival & Personal Backups</span>
          </h2>
          <p>
            VIRELO is licensed strictly for personal, non-commercial media preservation, time-shifting, space-shifting, accessibility enhancement, educational study, and fair use research in full compliance with applicable statutory copyright laws (including 17 U.S.C. § 107 in the United States and equivalent exceptions under international legal frameworks).
          </p>
          <p>
            You agree to use VIRELO exclusively with content that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You own or created personally;</li>
            <li>Has been released into the Public Domain or published under open Creative Commons licensing;</li>
            <li>You have express written permission from the copyright proprietor to download and transcode; or</li>
            <li>Falls squarely within statutory fair use or fair dealing exceptions.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <AlertOctagon size={18} className="text-[var(--error)]" />
            <span>3. Prohibited Conduct & DRM Circumvention Restrictions</span>
          </h2>
          <p>
            You may not, under any circumstance, utilize VIRELO to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bypass, evade, remove, deactivate, or impair effective technological protection measures (TPMs), encryption algorithms, or digital rights management (DRM) technologies, including Widevine, FairPlay, PlayReady, or encrypted paywalls;</li>
            <li>Download or distribute copyright-protected commercial motion pictures, premium subscription media, or musical recordings for commercial distribution, resale, or public exhibition without authorization;</li>
            <li>Perform automated distributed denial-of-service (DDoS) requests or malicious scraping against upstream host platforms;</li>
            <li>Violate the Computer Fraud and Abuse Act (CFAA), the Digital Millennium Copyright Act (DMCA), or comparable computer misuse statutes worldwide.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>4. DMCA Safe Harbor & Copyright Compliance (17 U.S.C. § 512)</span>
          </h2>
          <p>
            VIRELO respects the intellectual property rights of creators and content distributors. Although VIRELO does not host content or maintain user accounts, we maintain a strict compliance policy pursuant to Title II of the Digital Millennium Copyright Act (17 U.S.C. § 512). If you are a copyright holder who believes an extractor or link parser infringes upon your exclusive rights, you may submit a formal notification to our legal team.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <span>5. Disclaimer of Warranties & Limitation of Liability</span>
          </h2>
          <p>
            THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NONINFRINGEMENT. UNDER NO CIRCUMSTANCES SHALL VIRELO, ITS DEVELOPERS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM THE USE OR MISUSE OF THIS SOFTWARE.
          </p>
        </section>

      </div>
    </div>
  );
};
