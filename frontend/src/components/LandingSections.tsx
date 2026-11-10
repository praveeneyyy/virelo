import React, { useState } from 'react';
import { 
  Film, 
  Music, 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  ChevronDown, 
  Lock,
  ArrowRight, 
  Sparkles, 
  Zap, 
  HardDrive, 
  Sliders, 
  CheckCircle2, 
  FileVideo, 
  DownloadCloud, 
  Scale, 
  BookOpen, 
  AlertTriangle,
  Layers,
  Subtitles,
  FileCheck,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import { ViewTab } from '../types';
import { 
  YouTubeIcon, 
  InstagramIcon, 
  TikTokIcon, 
  PinterestIcon, 
  FacebookIcon, 
  XTwitterIcon, 
  RedditIcon, 
  VimeoIcon, 
  TwitchIcon, 
  SoundCloudIcon,
  BrowserIcon
} from './PlatformIcons';

interface LandingSectionsProps {
  onNavigate?: (tab: ViewTab) => void;
  onSelectPlatformUrl?: (sampleUrl: string) => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ onNavigate, onSelectPlatformUrl }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [platformSearch, setPlatformSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Section 5: 6 Steps Timeline
  const steps = [
    {
      num: '01',
      title: 'Find your media.',
      desc: 'Browse YouTube, TikTok, Instagram, Pinterest, or any of our 1,700+ supported services and open the media you wish to save.',
      icon: <Globe2 className="w-5 h-5 text-purple-600" />
    },
    {
      num: '02',
      title: 'Copy the link.',
      desc: 'Copy the web link from your browser URL address bar or through the mobile app share button.',
      icon: <FileVideo className="w-5 h-5 text-purple-600" />
    },
    {
      num: '03',
      title: 'Paste into VIRELO.',
      desc: 'Paste the link into the universal analyzer above. VIRELO will inspect available streams, resolutions, and codecs.',
      icon: <Sliders className="w-5 h-5 text-purple-600" />
    },
    {
      num: '04',
      title: 'Choose your format.',
      desc: 'Select MP4/MKV video up to 4K, extract 320 kbps MP3 audio with cover artwork, create an animated GIF, or grab a frame.',
      icon: <Film className="w-5 h-5 text-purple-600" />
    },
    {
      num: '05',
      title: 'Process your media.',
      desc: 'Our native FFmpeg 9.0 core extracts and multiplexes the audio and video streams locally without quality degradation.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />
    },
    {
      num: '06',
      title: 'Download your file.',
      desc: 'The finished media file is automatically saved straight into your computer or mobile local downloads folder.',
      icon: <DownloadCloud className="w-5 h-5 text-purple-600" />
    }
  ];

  // Section 6: Features
  const features = [
    {
      title: 'Video Downloader',
      desc: 'Extract full HD, 2K, 4K and 8K video streams with native multi-stream multiplexing and high-bitrate containers.',
      icon: <Film className="w-6 h-6 text-purple-600" />,
      tag: 'Up to 4K 60fps'
    },
    {
      title: 'Audio Extractor',
      desc: 'Convert video tracks into 320 kbps MP3, FLAC, M4A, or WAV with automatic Mutagen ID3 album artwork embedding.',
      icon: <Music className="w-6 h-6 text-indigo-600" />,
      tag: '320k Studio Audio'
    },
    {
      title: 'Image Downloader',
      desc: 'Fetch full-resolution master artwork, uncompressed frame captures, and original uncompressed Pinterest master images.',
      icon: <FileCheck className="w-6 h-6 text-pink-600" />,
      tag: 'Lossless Master Files'
    },
    {
      title: 'Media Converter',
      desc: 'Transcode downloaded or local files between MP4, WebM, MKV, MP3, WAV, FLAC, and high-framerate animated GIFs.',
      icon: <Sliders className="w-6 h-6 text-purple-600" />,
      tag: 'FFmpeg 9.0 Powered'
    },
    {
      title: 'Download Queue',
      desc: 'Background job scheduler supporting chunk streaming, network resume, and real-time speed & ETA telemetry.',
      icon: <Layers className="w-6 h-6 text-indigo-600" />,
      tag: 'Live WebSocket Sync'
    },
    {
      title: 'Subtitle Support',
      desc: 'Extract embedded and closed-caption SRT and VTT subtitles in multiple languages directly into your video files.',
      icon: <Subtitles className="w-6 h-6 text-emerald-600" />,
      tag: 'Multi-Language SRT'
    }
  ];

  // Section 4: Benefits
  const benefits = [
    {
      title: 'Simple by design',
      desc: 'No confusing dashboards, intrusive popups, or fake download buttons. Clean, single-link extraction that just works.',
      badge: 'Zero Friction'
    },
    {
      title: 'Quality options',
      desc: 'Choose exactly what you need: lightweight 720p for mobile, pristine 4K for home theaters, or 320 kbps lossless audio.',
      badge: 'Pixel Perfect'
    },
    {
      title: 'Multiple media types',
      desc: 'Full support for video, audio tracks, animated GIFs with customizable framerates, and timestamped frame snapshots.',
      badge: 'All-In-One'
    },
    {
      title: 'Privacy-conscious',
      desc: 'All processed links and temporary cache files are automatically purged after 30 minutes. Zero IP tracking or log selling.',
      badge: '30-Min Auto-Purge'
    }
  ];

  // Section 10: 15 Exact FAQs requested by user
  const faqs = [
    {
      q: 'What is VIRELO?',
      a: 'VIRELO is a universal media extraction and local transcode suite built for creators, archivists, and everyday users. It allows you to download video, audio, animated GIFs, and image snapshots from 1,700+ websites directly to your local computer or phone with maximum fidelity.'
    },
    {
      q: 'Is VIRELO free?',
      a: 'Yes, VIRELO is 100% free forever for personal use. There are no subscriptions, no credit card requirements, and no hidden bandwidth limits.'
    },
    {
      q: 'Which platforms are supported?',
      a: 'VIRELO natively supports over 1,700 platforms including YouTube, TikTok (without watermarks), Instagram (Reels, Stories, Posts), Facebook, Pinterest (original master images & video), Reddit, X (Twitter), Vimeo, Twitch clips, SoundCloud, Dailymotion, Tumblr, and direct HTTP/HTTPS media URLs.'
    },
    {
      q: 'How do I download a video?',
      a: 'Simply copy the video link from your browser or app, paste it into the search box at the top of the page, click "Analyze URL", pick your preferred format and resolution (such as 1080p MP4), and your browser will immediately save the file into your local downloads folder.'
    },
    {
      q: 'Can I extract audio?',
      a: 'Yes. Switch the selector to "Audio" to extract crystal-clear sound in MP3 (up to 320 kbps), FLAC studio lossless, M4A, WAV, or Opus. VIRELO also automatically embeds the song title, artist, and high-resolution album cover art directly into the file via Mutagen.'
    },
    {
      q: 'What formats are supported?',
      a: 'For video: MP4, WebM, and MKV. For audio: MP3, M4A, FLAC, WAV, and Opus. For animations: GIF and animated WebP. For images: JPG, PNG, and WebP.'
    },
    {
      q: 'Can I select video resolution?',
      a: 'Yes. Depending on what the host platform uploaded, you can choose 360p, 480p, 720p HD, 1080p Full HD, 1440p 2K, and 2160p 4K at up to 60 frames per second.'
    },
    {
      q: 'Does VIRELO work on mobile?',
      a: 'Yes. VIRELO is fully responsive and optimized for iOS Safari, Android Chrome, tablets, laptops, and desktop displays with smooth touch controls.'
    },
    {
      q: 'Do I need to install software?',
      a: 'No client-side installation or browser extensions are required. VIRELO runs seamlessly in your web browser, using the backend engine to execute extraction and formatting tasks.'
    },
    {
      q: 'Why is my URL not working?',
      a: 'Make sure the media is publicly accessible and not behind a private account, login paywall, or geo-restricted boundary. Also verify that the URL is complete (e.g. starts with https://). If an issue persists, consult our Diagnostic Error Guide.'
    },
    {
      q: 'Can I download private content?',
      a: 'No. In adherence to privacy standards and statutory security policies, VIRELO only processes publicly accessible media streams. We never bypass private account permissions, authentication cookies, or digital rights management (DRM).'
    },
    {
      q: 'How are temporary files handled?',
      a: 'VIRELO operates an automated 30-minute ephemeral lifecycle policy. Any temporary transcode files, cached streams, and database job records are permanently erased after 30 minutes to protect your privacy and maintain disk cleanliness.'
    },
    {
      q: 'Are subtitles supported?',
      a: 'Yes. When closed captions or subtitles are provided by the upstream host, VIRELO can detect and multiplex multi-language SRT or VTT subtitle tracks into the downloaded container.'
    },
    {
      q: 'How long does processing take?',
      a: 'Most downloads take between 2 to 10 seconds. For large 4K videos or multi-minute GIF encodes, native FFmpeg hardware acceleration processes the stream at several hundred frames per second.'
    },
    {
      q: 'Is downloading copyrighted content permitted?',
      a: 'VIRELO is licensed strictly for lawful personal preservation, educational research, space-shifting, time-shifting, and statutory fair use under 17 U.S.C. § 107. Commercial exploitation or redistribution of third-party copyrighted work without proper authorization is strictly prohibited.'
    }
  ];

  // Section 8: Platform Directory preview data
  const platformDirectory = [
    { name: 'YouTube Downloader', cat: 'Video', icon: <YouTubeIcon className="w-5 h-5 text-red-600" />, desc: 'Extract 4K/8K 60fps video, Shorts, and 320k MP3 audio.', types: ['MP4', 'WebM', 'MP3', 'GIF'] },
    { name: 'Instagram Downloader', cat: 'Social', icon: <InstagramIcon className="w-5 h-5 text-pink-600" />, desc: 'Save high-definition Reels, Stories, carousels, and video posts.', types: ['MP4', 'JPG', 'MP3'] },
    { name: 'TikTok No Watermark', cat: 'Social', icon: <TikTokIcon className="w-5 h-5 text-slate-900" />, desc: 'Pristine HD video extraction without watermark overlays.', types: ['MP4', 'MP3', 'GIF'] },
    { name: 'Pinterest HD Downloader', cat: 'Boards', icon: <PinterestIcon className="w-5 h-5 text-red-600" />, desc: 'Pulls full-size original master images and video pins.', types: ['JPG', 'PNG', 'MP4'] },
    { name: 'Facebook Video Downloader', cat: 'Social', icon: <FacebookIcon className="w-5 h-5 text-blue-600" />, desc: 'Download public Watch videos, Reels, and group clips.', types: ['MP4', '720p', '1080p'] },
    { name: 'X / Twitter Downloader', cat: 'Social', icon: <XTwitterIcon className="w-5 h-5 text-slate-900" />, desc: 'Save videos and GIFs directly from public tweets.', types: ['MP4', 'GIF', 'MP3'] },
    { name: 'Reddit Media Downloader', cat: 'Community', icon: <RedditIcon className="w-5 h-5 text-orange-600" />, desc: 'Multiplexes separated v.redd.it video and audio tracks.', types: ['MP4', 'Audio Mux'] },
    { name: 'Vimeo Downloader', cat: 'Video', icon: <VimeoIcon className="w-5 h-5 text-sky-500" />, desc: 'High-bitrate cinematic video extraction up to 4K UHD.', types: ['MP4', 'MKV', '1080p'] },
    { name: 'Twitch Clip Downloader', cat: 'Streaming', icon: <TwitchIcon className="w-5 h-5 text-purple-600" />, desc: 'Download broadcast highlights and clips in original quality.', types: ['MP4', '60fps'] },
    { name: 'SoundCloud Audio Downloader', cat: 'Audio', icon: <SoundCloudIcon className="w-5 h-5 text-orange-500" />, desc: 'Direct stream ripping to 320 kbps MP3 with album art.', types: ['MP3', 'WAV', 'FLAC'] },
    { name: 'Direct Browser Web Link', cat: 'Raw Stream', icon: <BrowserIcon className="w-5 h-5 text-purple-600" />, desc: 'Download from any arbitrary HTTP/HTTPS direct media URL.', types: ['All Formats'] },
  ];

  const filteredDirectory = platformDirectory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(platformSearch.toLowerCase()) || 
                          p.desc.toLowerCase().includes(platformSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.cat.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full space-y-24 pt-12 pb-6">

      {/* SECTION 3: Supported Platforms Preview */}
      <section id="platforms-section" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Verified Stream Connectors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            One platform. <span className="font-serif italic font-normal text-purple-700">Countless possibilities.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Bring your media links together in one place. Paste a supported URL and let VIRELO handle the rest.
          </p>
        </div>

        {/* Clean Icon Grid with Verified Platforms */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {[
            { name: 'YouTube', icon: <YouTubeIcon className="w-6 h-6 text-red-600" />, type: '4K Video & MP3' },
            { name: 'Instagram', icon: <InstagramIcon className="w-6 h-6 text-pink-600" />, type: 'Reels & Stories' },
            { name: 'TikTok', icon: <TikTokIcon className="w-6 h-6 text-slate-900" />, type: 'No Watermark' },
            { name: 'Facebook', icon: <FacebookIcon className="w-6 h-6 text-blue-600" />, type: 'Watch & Clips' },
            { name: 'Pinterest', icon: <PinterestIcon className="w-6 h-6 text-red-600" />, type: 'HD Originals' },
            { name: 'Reddit', icon: <RedditIcon className="w-6 h-6 text-orange-600" />, type: 'Audio & Video' },
            { name: 'X (Twitter)', icon: <XTwitterIcon className="w-6 h-6 text-slate-900" />, type: 'Clips & GIFs' },
            { name: 'Vimeo', icon: <VimeoIcon className="w-6 h-6 text-sky-500" />, type: 'Cinematic 4K' },
            { name: 'Twitch', icon: <TwitchIcon className="w-6 h-6 text-purple-600" />, type: 'VODs & Clips' },
            { name: 'SoundCloud', icon: <SoundCloudIcon className="w-6 h-6 text-orange-500" />, type: '320k Lossless' },
            { name: 'Dailymotion', icon: <Film className="w-6 h-6 text-indigo-600" />, type: 'HD Streams' },
            { name: 'Direct Links', icon: <BrowserIcon className="w-6 h-6 text-purple-600" />, type: 'Raw HTTP/HTTPS' },
          ].map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md hover:bg-purple-50/20 transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all shadow-xs">
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <div className="font-semibold text-xs text-slate-900">{item.name}</div>
                <div className="text-[11px] text-slate-500">{item.type}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <a
            href="#directory-preview"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-800 hover:underline"
          >
            <span>View All 1,700+ Supported Platforms</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* SECTION 4: Trust and Benefits */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Built For Demanding Creators</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Everything you need. <span className="font-serif italic font-normal text-purple-700">Nothing you don't.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminating bloat, deceptive advertising, and fake download buttons with a clean, hardware-accelerated workstation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-200 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[11px] font-semibold text-purple-700">
                  {b.badge}
                </span>
                <h3 className="font-bold text-base text-slate-900">{b.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: How It Works */}
      <section id="how-it-works-section" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            From link to file in <span className="font-serif italic font-normal text-purple-700">seconds.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Follow six straightforward steps to inspect, transcode, and save any public web media.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-mono text-purple-600/30 group-hover:text-purple-600 transition-colors">
                  {step.num}
                </span>
                <div className="p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  {step.icon}
                </div>
              </div>
              <h3 className="font-bold text-base text-slate-900 pt-1">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Features */}
      <section id="features-section" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Engine Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            More than just <span className="font-serif italic font-normal text-purple-700">downloading.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A comprehensive media extraction suite equipped with hardware-accelerated transcoding, audio tagging, and clipping tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-purple-50">
                  {f.icon}
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 pt-1">{f.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Formats and Quality */}
      <section id="formats-section" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Universal Compatibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Your media. <span className="font-serif italic font-normal text-purple-700">Your preferred format.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Export directly to open standards, lossless containers, or ultra-fluid animated clips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Video Column */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <Film className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900">Video Containers</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['MP4', 'WEBM', 'MKV', 'MOV', 'AVI'].map(fmt => (
                <span key={fmt} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resolutions</span>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                360p • 480p • 720p HD • 1080p FHD • 1440p 2K • 2160p 4K UHD
              </p>
            </div>
          </div>

          {/* Audio Column */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Audio Codecs</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['MP3', 'WAV', 'M4A', 'FLAC', 'OPUS'].map(fmt => (
                <span key={fmt} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Acoustic Bitrate</span>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                128 kbps • 192 kbps • 256 kbps • 320 kbps (Lossless ID3 Tagged)
              </p>
            </div>
          </div>

          {/* Image & Animation Column */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h3 className="font-bold text-slate-900">Images & Animations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['JPG', 'PNG', 'WEBP', 'GIF'].map(fmt => (
                <span key={fmt} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  {fmt}
                </span>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Video-to-GIF Suite</span>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                Custom time trimming • 10-30 FPS • 320p-720p • 0.5x-2x speed
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: Platform Directory Preview */}
      <section id="directory-preview" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Dynamic Catalogue</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Explore supported <span className="font-serif italic font-normal text-purple-700">downloaders.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Search our platform index of verified streaming sites, social networks, and file repositories.
          </p>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={platformSearch}
                onChange={(e) => setPlatformSearch(e.target.value)}
                placeholder="Search downloaders (e.g. YouTube, TikTok, Pinterest, Vimeo)..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'social', 'video', 'boards', 'audio'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Platforms' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map((p) => (
              <div
                key={p.name}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-50">
                        {p.icon}
                      </div>
                      <span className="font-bold text-sm text-slate-900">{p.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {p.types.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (input) input.focus();
                    }}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Use Downloader</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: About VIRELO */}
      <section id="about-section" className="space-y-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-xs font-semibold uppercase tracking-wider text-purple-800">
            <Sparkles size={13} />
            <span>Architectural Philosophy</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Media tools, <span className="font-serif italic font-normal text-purple-700">made simple.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
            <p>
              Traditional online converters are plagued with deceptive pop-ups, slow cloud queues, and heavy compression that destroys original visual and acoustic fidelity. VIRELO was engineered from the ground up to be different.
            </p>
            <p>
              By coupling native <strong>FFmpeg 9.0</strong> hardware multiplexing with <strong>yt-dlp core stream discovery</strong>, VIRELO streams raw video frames and lossless audio chunks directly to your machine. No account creation, no analytics tracking, and zero cloud retention past our 30-minute auto-purge window.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-purple-200/60 text-center">
            <div>
              <div className="text-2xl font-black text-purple-700 font-mono">1,700+</div>
              <div className="text-xs text-slate-500 font-medium">Extractors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-700 font-mono">0 Ads</div>
              <div className="text-xs text-slate-500 font-medium">Pure Interface</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-700 font-mono">30 Min</div>
              <div className="text-xs text-slate-500 font-medium">Auto-Purge TTL</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-700 font-mono">100%</div>
              <div className="text-xs text-slate-500 font-medium">Local Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: FAQ */}
      <section id="faq-section" className="space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold uppercase tracking-wider text-purple-700">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Got questions? <span className="font-serif italic font-normal text-purple-700">We have answers.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Everything you need to know about formats, supported platforms, retention policies, and compliance.
          </p>
        </div>

        {/* 15 Accordion Items */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-purple-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in-50 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
