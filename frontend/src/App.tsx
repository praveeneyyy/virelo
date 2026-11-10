import React, { useState, useEffect, useCallback } from 'react';
import { ViewTab, DownloadJob, SystemHealth, MediaInfo, DownloadPayload, AppSettings, HistoryItem } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { TopNavigation } from './components/TopNavigation';
import { VireloHero } from './components/VireloHero';
import { LandingSections } from './components/LandingSections';
import { QueueTable } from './components/QueueTable';
import { HistoryList } from './components/HistoryList';
import { SettingsPanel } from './components/SettingsPanel';
import { PlatformsView } from './pages/PlatformsView';
import { TermsPage } from './components/TermsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { FairUsePage } from './components/FairUsePage';
import { ErrorPage } from './components/ErrorPage';
import { Footer } from './components/Footer';
import { ConverterView } from './pages/ConverterView';
import { DedicatedPlatformView, DedicatedPlatformKey } from './components/DedicatedPlatformView';
import { AboutView } from './pages/AboutView';
import { FaqPageView } from './pages/FaqPageView';
import { ContactPageView } from './pages/ContactPageView';
import { 
  getQueue, 
  getHistory, 
  getHealth, 
  extractMedia, 
  startDownload, 
  cancelJob, 
  retryJob, 
  deleteJob, 
  clearHistory, 
  getSettings, 
  updateSettings 
} from './services/api';
import { useDownloadWebSocket } from './services/websocket';

// Route <-> ViewTab bidirectional mapping
const PATH_TO_TAB: Record<string, ViewTab> = {
  '/': 'downloader',
  '/platforms': 'platforms',
  '/youtube-downloader': 'youtube',
  '/instagram-downloader': 'instagram',
  '/tiktok-downloader': 'tiktok',
  '/facebook-downloader': 'facebook',
  '/pinterest-downloader': 'pinterest',
  '/reddit-downloader': 'reddit',
  '/convert': 'convert',
  '/about': 'about',
  '/faq': 'faq',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/contact': 'contact',
  '/error': 'error',
};

const TAB_TO_PATH: Record<ViewTab, string> = {
  downloader: '/',
  platforms: '/platforms',
  youtube: '/youtube-downloader',
  instagram: '/instagram-downloader',
  tiktok: '/tiktok-downloader',
  facebook: '/facebook-downloader',
  pinterest: '/pinterest-downloader',
  reddit: '/reddit-downloader',
  convert: '/convert',
  about: '/about',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  contact: '/contact',
  error: '/error',
  queue: '/queue',
  history: '/history',
  settings: '/settings',
  dashboard: '/dashboard',
  fairuse: '/terms',
};

const TAB_TITLES: Partial<Record<ViewTab, string>> = {
  downloader: 'VIRELO – Online Video & Audio Downloader',
  platforms: 'Supported Platforms Directory – VIRELO Media Downloader',
  youtube: 'YouTube Video & Audio Downloader (4K, 1080p, MP3) – VIRELO',
  instagram: 'Instagram Reels & Video Downloader – VIRELO',
  tiktok: 'TikTok Video Downloader Without Watermark – VIRELO',
  facebook: 'Facebook Video Downloader (Watch & Reels) – VIRELO',
  pinterest: 'Pinterest Video & HD Image Downloader – VIRELO',
  reddit: 'Reddit Video Downloader with Audio – VIRELO',
  convert: 'Free Online Media Converter (FFmpeg 9.0) – VIRELO',
  about: 'About VIRELO – Architectural Specifications & Technology',
  faq: 'Frequently Asked Questions & Troubleshooting – VIRELO',
  privacy: 'Privacy Policy – VIRELO Universal Downloader',
  terms: 'Terms of Service & Statutory Compliance – VIRELO',
  contact: 'Contact Support & Technical Inquiries – VIRELO',
};

const getInitialTab = (): ViewTab => {
  if (typeof window === 'undefined') return 'downloader';
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return PATH_TO_TAB[path] || 'downloader';
};

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ViewTab>(getInitialTab);
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);

  // Download state
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [activeJob, setActiveJob] = useState<DownloadJob | null>(null);
  const [isStartingDownload, setIsStartingDownload] = useState(false);

  const { toast } = useToast();

  // Synchronize Tab changes with HTML5 browser history and Document Title
  const handleNavigate = useCallback((newTab: ViewTab) => {
    setCurrentTab(newTab);
    const targetPath = TAB_TO_PATH[newTab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: newTab }, '', targetPath);
    }
    const newTitle = TAB_TITLES[newTab] || 'VIRELO – Universal Media Downloader';
    document.title = newTitle;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const matchedTab = PATH_TO_TAB[path] || 'downloader';
      setCurrentTab(matchedTab);
      document.title = TAB_TITLES[matchedTab] || 'VIRELO – Universal Media Downloader';
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update initial title
  useEffect(() => {
    const initialTitle = TAB_TITLES[currentTab] || 'VIRELO – Online Video & Audio Downloader';
    document.title = initialTitle;
  }, [currentTab]);

  // Refresh server state
  const refreshData = useCallback(async () => {
    try {
      const [queueData, historyData, healthData, settingsData] = await Promise.all([
        getQueue(),
        getHistory(),
        getHealth(),
        getSettings(),
      ]);
      setJobs(queueData);
      setHistory(historyData);
      setHealth(healthData);
      setSettings(settingsData);

      if (activeJob) {
        const found = queueData.find((j) => j.id === activeJob.id);
        if (found) setActiveJob(found);
      }
    } catch {
      // Server starting up or temporary network blip
    }
  }, [activeJob]);

  useEffect(() => {
    refreshData();
  }, []);

  // Polling fallback every 3s
  useEffect(() => {
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // WebSocket Live Updates
  const handleJobUpdate = useCallback((updatedJob: DownloadJob) => {
    setJobs((prevJobs) => {
      const idx = prevJobs.findIndex((j) => j.id === updatedJob.id);
      if (idx >= 0) {
        const next = [...prevJobs];
        next[idx] = updatedJob;
        return next;
      }
      return [updatedJob, ...prevJobs];
    });

    if (activeJob && activeJob.id === updatedJob.id) {
      setActiveJob(updatedJob);
    }

    if (updatedJob.status === 'completed') {
      toast(`Completed: ${updatedJob.file_name || updatedJob.title}`, 'success');
      refreshData();
    } else if (updatedJob.status === 'failed') {
      toast(`Download failed: ${updatedJob.error || 'Unknown error'}`, 'error');
    }
  }, [activeJob, toast, refreshData]);

  useDownloadWebSocket(handleJobUpdate);

  // URL Ingest / Extract Handler
  const handleExtract = async () => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    setIsExtracting(true);
    setExtractError(null);
    setMediaInfo(null);

    try {
      const data = await extractMedia(cleanUrl);
      setMediaInfo(data);
      toast(`Source verified: ${data.platform}`, 'info');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Unable to inspect media from provided URL.';
      setExtractError(msg);
      toast(msg, 'error');
    } finally {
      setIsExtracting(false);
    }
  };

  // Start Download Job
  const handleStartDownload = async (payload: DownloadPayload) => {
    setIsStartingDownload(true);
    try {
      const job = await startDownload(payload);
      setActiveJob(job);
      setJobs((prev) => [job, ...prev]);
      toast('Transfer enqueued to processing pipeline.', 'info');
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to initialize download.';
      toast(msg, 'error');
    } finally {
      setIsStartingDownload(false);
    }
  };

  // Job Actions
  const handleCancelJob = async (id: string) => {
    try {
      await cancelJob(id);
      toast('Download cancellation dispatched.', 'info');
      refreshData();
    } catch (e: any) {
      toast(`Cancel failed: ${e.message}`, 'error');
    }
  };

  const handleRetryJob = async (id: string) => {
    try {
      await retryJob(id);
      toast('Job re-enqueued.', 'info');
      refreshData();
    } catch (e: any) {
      toast(`Retry failed: ${e.message}`, 'error');
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id, false);
      refreshData();
    } catch (e: any) {
      toast(`Delete failed: ${e.message}`, 'error');
    }
  };

  const handleClearHistory = async () => {
    if (confirm('Clear all historical download entries? (Files on disk will be preserved)')) {
      try {
        await clearHistory();
        toast('History cleared.', 'info');
        refreshData();
      } catch (e: any) {
        toast(`Error: ${e.message}`, 'error');
      }
    }
  };

  const handleSaveSettings = async (updated: Partial<AppSettings>) => {
    const newSettings = await updateSettings(updated);
    setSettings(newSettings);
  };

  const activeJobsCount = jobs.filter(
    (j) => j.status === 'downloading' || j.status === 'converting' || j.status === 'queued'
  ).length;

  const isDedicatedPlatform = (tab: ViewTab): tab is DedicatedPlatformKey => {
    return ['youtube', 'instagram', 'tiktok', 'facebook', 'pinterest', 'reddit'].includes(tab);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex flex-col font-sans transition-colors">
      
      {/* Compact Top Navigation */}
      <TopNavigation
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        activeJobsCount={activeJobsCount}
        health={health}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* VIEW 1: VIRELO Complete 11-Section Homepage */}
        {currentTab === 'downloader' && (
          <div className="space-y-12">
            <VireloHero
              url={url}
              setUrl={setUrl}
              isExtracting={isExtracting}
              extractError={extractError}
              mediaInfo={mediaInfo}
              onExtract={handleExtract}
              onStartDownload={handleStartDownload}
              isStartingDownload={isStartingDownload}
              activeJob={activeJob}
              onCancelJob={handleCancelJob}
              onRetryJob={handleRetryJob}
              onSelectTab={handleNavigate}
            />

            {/* Sections 3 through 10 in exact order specified */}
            <LandingSections onNavigate={handleNavigate} />
          </div>
        )}

        {/* VIEW 2: DEDICATED PLATFORM DOWNLOADERS (/youtube-downloader, /instagram-downloader, etc.) */}
        {isDedicatedPlatform(currentTab) && (
          <DedicatedPlatformView
            platform={currentTab}
            onNavigate={handleNavigate}
            url={url}
            setUrl={setUrl}
            isExtracting={isExtracting}
            extractError={extractError}
            mediaInfo={mediaInfo}
            onExtract={handleExtract}
            onStartDownload={handleStartDownload}
            isStartingDownload={isStartingDownload}
            activeJob={activeJob}
            onCancelJob={handleCancelJob}
            onRetryJob={handleRetryJob}
          />
        )}

        {/* VIEW 3: Media Converter (Route /convert) */}
        {currentTab === 'convert' && (
          <ConverterView onNavigate={handleNavigate} />
        )}

        {/* VIEW 4: Platforms Directory (/platforms) */}
        {currentTab === 'platforms' && (
          <div className="space-y-6">
            <PlatformsView />
          </div>
        )}

        {/* VIEW 5: About VIRELO (/about) */}
        {currentTab === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {/* VIEW 6: FAQ Help Center (/faq) */}
        {currentTab === 'faq' && (
          <FaqPageView onNavigate={handleNavigate} />
        )}

        {/* VIEW 7: Contact Support & Praveen Kumar (/contact) */}
        {currentTab === 'contact' && (
          <ContactPageView onNavigate={handleNavigate} />
        )}

        {/* VIEW 8: Terms & Conditions (/terms) */}
        {currentTab === 'terms' && (
          <TermsPage onNavigate={handleNavigate} />
        )}

        {/* VIEW 9: Privacy Policy (/privacy) */}
        {currentTab === 'privacy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}

        {/* VIEW 10: Fair Use Doctrine */}
        {currentTab === 'fairuse' && (
          <FairUsePage onNavigate={handleNavigate} />
        )}

        {/* VIEW 11: Error Page & Troubleshooting */}
        {currentTab === 'error' && (
          <ErrorPage 
            errorMessage={extractError || "Pipeline Diagnostic Boundary"}
            errorCode={extractError ? "STREAM_ERR" : 200}
            errorDetails={extractError || "No active fatal error detected. All stream extractors and FFmpeg binaries are operational."}
            onRetry={url.trim() ? handleExtract : undefined}
            onNavigate={handleNavigate} 
          />
        )}

      </main>

      {/* Production-Grade Footer with Details and Italic Maker Attribution */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
