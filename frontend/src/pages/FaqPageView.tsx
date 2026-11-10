import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { ViewTab } from '../types';

interface FaqPageViewProps {
  onNavigate: (tab: ViewTab) => void;
}

interface FAQItem {
  id: number;
  category: 'General' | 'Quality & Formats' | 'Platforms' | 'Troubleshooting' | 'Privacy & Legal';
  q: string;
  a: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    id: 1,
    category: 'General',
    q: 'What is VIRELO and how does it work?',
    a: 'VIRELO is a universal, private media downloader and format transcode workstation. When you provide a public URL from any of 1,700+ supported websites, VIRELO queries the original content delivery network (CDN) directly using yt-dlp and FFmpeg 9.0 to identify available video and audio streams. It then merges, extracts, and delivers the highest-fidelity media container directly to your device.'
  },
  {
    id: 2,
    category: 'General',
    q: 'Is VIRELO completely free to use?',
    a: 'Yes, VIRELO is 100% free with no registration, no subscription fees, no bandwidth throttling, and no invasive third-party ad networks.'
  },
  {
    id: 3,
    category: 'General',
    q: 'Do I need to install browser extensions or software?',
    a: 'No. VIRELO runs directly within any standard desktop or mobile web browser. Everything is processed through our native FFmpeg 9.0 pipeline and saved straight to your browser downloads folder.'
  },
  {
    id: 4,
    category: 'Quality & Formats',
    q: 'Can I download videos in 4K UHD or 1080p Full HD?',
    a: 'Yes. If the creator uploaded the video in 1080p, 1440p (2K), or 2160p (4K), VIRELO will detect the high-bitrate video stream and multiplex it with the highest quality audio track to deliver a complete, seamless MP4 or WebM video file.'
  },
  {
    id: 5,
    category: 'Quality & Formats',
    q: 'How does VIRELO extract 320 kbps MP3 audio?',
    a: 'When you select the Audio tab, VIRELO extracts the raw audio stream and encodes it at up to 320 kbps CBR (Constant Bitrate) using LAME MP3 codec or preserves pristine M4A/FLAC/WAV. Furthermore, Mutagen metadata tagging embeds the title, artist name, and original album/thumbnail artwork permanently into the audio file.'
  },
  {
    id: 6,
    category: 'Quality & Formats',
    q: 'Can I convert uploaded videos to animated GIFs?',
    a: 'Yes! Navigate to our Media Converter (/convert) or choose GIF format during export. FFmpeg analyzes the color palette and creates a lightweight, smooth animated GIF with customizable FPS and dimensions.'
  },
  {
    id: 7,
    category: 'Platforms',
    q: 'Which platforms are supported by VIRELO?',
    a: 'VIRELO supports over 1,700 sites including YouTube, TikTok (without watermark), Instagram (Reels & Carousels), Facebook (Watch & Reels), Pinterest (HD original masters), Reddit (with synchronized audio), Vimeo, Twitch, SoundCloud, Twitter/X, Dailymotion, Tumblr, and direct MP4/MP3 web links.'
  },
  {
    id: 8,
    category: 'Platforms',
    q: 'Does VIRELO remove watermarks from TikTok videos?',
    a: 'Yes. VIRELO queries the original TikTok CDN master stream before the moving watermark overlay is rendered onto the client player, yielding clean, unbranded HD video files.'
  },
  {
    id: 9,
    category: 'Platforms',
    q: 'How does VIRELO fix silent Reddit videos?',
    a: 'Reddit delivers video and sound on separate v.redd.it DASH streams (DASH_1080.mp4 and DASH_audio.mp4). Standard downloaders only fetch the video stream, resulting in muted playback. VIRELO automatically multiplexes both streams in real time using FFmpeg into a unified MP4 with full stereo sound.'
  },
  {
    id: 10,
    category: 'Troubleshooting',
    q: 'What should I do if a URL returns an error or timeout?',
    a: 'First, check that the link is publicly accessible in a private/incognito browser tab. If the content requires an account login, age verification, or is private, VIRELO cannot extract it. If it is public and fails, verify the URL structure or check our Diagnostic Error Guide (/error).'
  },
  {
    id: 11,
    category: 'Troubleshooting',
    q: 'Why did my download pause or fail halfway through?',
    a: 'Temporary network disconnects can interrupt media streams. Click the Retry button on the active job card to resume transfer from the last verified byte without starting over.'
  },
  {
    id: 12,
    category: 'Troubleshooting',
    q: 'Where are my downloaded files saved?',
    a: 'Files are saved automatically to your operating system default Downloads folder (e.g., C:\\Users\\...\\Downloads on Windows, or ~/Downloads on macOS and Linux).'
  },
  {
    id: 13,
    category: 'Privacy & Legal',
    q: 'Does VIRELO keep logs or store my downloaded media?',
    a: 'VIRELO operates under a strict Zero-Log Privacy Policy. Server processing queues hold ephemeral data for a maximum of 30 minutes before an automated background retention loop permanently purges all temporary files and database records.'
  },
  {
    id: 14,
    category: 'Privacy & Legal',
    q: 'Is it legal to download videos with VIRELO?',
    a: 'Yes, downloading public media for personal archival, academic analysis, offline viewing, or fair use commentary (under 17 U.S.C. § 107) is recognized in many jurisdictions. However, redistributing, monetizing, or selling copyrighted media without license is prohibited. Users are solely responsible for ensuring lawful usage.'
  },
  {
    id: 15,
    category: 'Privacy & Legal',
    q: 'How do I submit a DMCA takedown notice?',
    a: 'Copyright owners may send statutory notices under 17 U.S.C. § 512 directly to our designated agent at praveensky2006@gmail.com with identification of the copyrighted work and authorization details.'
  }
];

export const FaqPageView: React.FC<FaqPageViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<number[]>([1, 4, 7]);

  const categories = ['All', 'General', 'Quality & Formats', 'Platforms', 'Troubleshooting', 'Privacy & Legal'];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFaq = (id: number) => {
    setOpenIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-700">
          <HelpCircle size={13} />
          <span>HELP CENTER & FAQ</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          VIRELO Help Center & Frequently Asked Questions
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Everything you need to know about video and audio extraction, supported platform formats, troubleshooting errors, and privacy standards.
        </p>
      </div>

      {/* SEARCH AND CATEGORY FILTER */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions (e.g. 4K, MP3, TikTok, Reddit, watermark)..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ ACCORDION LIST */}
      <div className="space-y-3 pt-2">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <p className="text-sm font-semibold text-slate-700">No matching questions found.</p>
            <p className="text-xs text-slate-500">Try adjusting your keywords or clearing the category filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 underline pt-2"
            >
              Reset search
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-violet-300 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.q}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-violet-600 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CONTACT BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900">Still have questions or need assistance?</h4>
          <p className="text-xs text-slate-600">Our engineering team is always ready to assist with extractor issues or requests.</p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all shrink-0"
        >
          <Mail size={14} />
          <span>Contact Support</span>
        </button>
      </div>

    </div>
  );
};
