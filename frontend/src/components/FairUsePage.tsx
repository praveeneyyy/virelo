import React from 'react';
import { BookOpen, Scale, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ViewTab } from '../types';

interface FairUsePageProps {
  onNavigate: (tab: ViewTab) => void;
}

export const FairUsePage: React.FC<FairUsePageProps> = ({ onNavigate }) => {
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
          <BookOpen size={24} className="text-[var(--accent)]" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Fair Use Doctrine & Archival Policy
          </h1>
        </div>
        
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Legal Guidance on 17 U.S.C. § 107, Media Time-Shifting & Personal Archiving
        </p>
      </div>

      {/* Main Body */}
      <div className="space-y-6 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        
        {/* Statutory Overview */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-3">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            1. The Fair Use Doctrine (17 U.S.C. § 107)
          </h2>
          <p>
            Fair use is a legal doctrine under United States copyright law that permits the limited use of copyrighted material without acquiring permission from the rights holder. Established in section 107 of the Copyright Act of 1976, fair use promotes freedom of expression by allowing the unlicensed citation, study, teaching, criticism, news reporting, scholarship, and archival preservation of multimedia works.
          </p>
          <p className="italic bg-[var(--surface-secondary)] p-3 border-l-2 border-[var(--accent)] text-[var(--text-primary)]">
            "Notwithstanding the provisions of sections 106 and 106A, the fair use of a copyrighted work... for purposes such as criticism, comment, news reporting, teaching, scholarship, or research, is not an infringement of copyright." — 17 U.S.C. § 107
          </p>
        </section>

        {/* The Four-Factor Balancing Test */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            2. The Four-Factor Statutory Balancing Test
          </h2>
          <p>
            In evaluating whether a particular instance of media extraction and archiving constitutes fair use, courts examine four fundamental factors:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--accent)] font-bold uppercase">Factor 1</span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Purpose & Character of Use</h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Nonprofit educational, scholarly, analytical, and personal non-commercial uses weigh heavily in favor of fair use. Transformative adaptations (such as extracting audio for linguistic analysis) receive broad judicial protection.
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--accent)] font-bold uppercase">Factor 2</span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Nature of the Copyrighted Work</h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Factual, informational, news broadcasts, political speeches, and scientific recordings receive less restrictive copyright protection than purely creative fictional motion pictures.
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--accent)] font-bold uppercase">Factor 3</span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Amount & Substantiality Used</h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Using only the portion necessary for commentary or research favors fair use. However, full archival copies can qualify when the primary purpose is historical preservation, accessibility, or non-substitutive time-shifting.
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-color)] space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--accent)] font-bold uppercase">Factor 4</span>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">Effect Upon the Market Value</h3>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                A use that does not usurp or substitute for the commercial market of the original creator strongly favors fair use. Storing a local personal backup does not impact market demand.
              </p>
            </div>

          </div>
        </section>

        {/* Time-Shifting & Format-Shifting Precedents */}
        <section className="p-5 bg-[var(--surface-primary)] border border-[var(--border-color)] space-y-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            3. Time-Shifting Precedent (Sony Corp. v. Universal City Studios)
          </h2>
          <p>
            The landmark United States Supreme Court decision in <em>Sony Corp. of America v. Universal City Studios, Inc.</em>, 464 U.S. 417 (1984) established that private, non-commercial recording of television broadcasts for subsequent viewing ("time-shifting") constitutes a legitimate, non-infringing fair use.
          </p>
          <p>
            VIRELO provides modern technological tools analogous to a VCR or digital audio recorder, enabling users to format-shift and time-shift publicly accessible web broadcasts for personal review on offline devices.
          </p>
        </section>

        {/* User Compliance Affirmation */}
        <section className="p-4 bg-[var(--surface-primary)] border border-[var(--border-color)] flex items-start gap-3">
          <AlertTriangle size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)]">
            <strong>Important Legal Notice:</strong> VIRELO does not provide legal counsel. Individual users are solely responsible for evaluating whether their specific intended use conforms to statutory fair use principles within their jurisdiction. Commercial exploitation of downloaded copyrighted materials is strictly prohibited.
          </p>
        </section>

      </div>
    </div>
  );
};
