export type ViewTab = 
  | 'downloader' 
  | 'queue' 
  | 'history' 
  | 'platforms' 
  | 'settings' 
  | 'dashboard' 
  | 'about' 
  | 'faq'
  | 'terms' 
  | 'privacy' 
  | 'fairuse' 
  | 'error' 
  | 'convert' 
  | 'contact'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'pinterest'
  | 'reddit';

export type ThemeMode = 'light' | 'dark' | 'system';

export type MediaType = 'video' | 'audio' | 'gif' | 'image' | 'file';

export type JobStatusType = 'queued' | 'downloading' | 'converting' | 'completed' | 'failed' | 'cancelled' | 'paused';

export interface MediaFormat {
  format_id: string;
  ext: string;
  resolution?: string;
  filesize?: number;
  filesize_str?: string;
  vcodec?: string;
  acodec?: string;
  fps?: number;
  tbr?: number;
}

export interface MediaInfo {
  success: boolean;
  url: string;
  platform: string;
  title: string;
  uploader?: string;
  thumbnail?: string;
  duration?: string;
  duration_seconds?: number;
  file_size_str?: string;
  is_direct_file: boolean;
  media_type: MediaType;
  available_qualities: number[];
  available_formats: string[];
  formats: MediaFormat[];
  subtitles: string[];
  is_playlist: boolean;
  playlist_count: number;
}

export interface DownloadJob {
  id: string;
  url: string;
  title: string;
  platform: string;
  media_type: MediaType;
  target_format: string;
  target_quality?: string;
  target_bitrate?: string;
  thumbnail?: string;
  status: JobStatusType;
  progress: number;
  speed_str: string;
  eta_str: string;
  downloaded_bytes: number;
  total_bytes: number;
  file_path?: string;
  file_name?: string;
  file_size_str?: string;
  download_url?: string;
  error?: string;
  created_at: number;
  completed_at?: number;
}

export interface DownloadPayload {
  url: string;
  media_type: MediaType;
  format: string;
  quality: string;
  bitrate: string;
  embed_thumbnail: boolean;
  embed_subtitles: boolean;
  subtitle_langs?: string[];
  title?: string;
  custom_filename?: string;
  // GIF / Clipper and Image frame extraction parameters
  start_time?: number;
  duration?: number;
  fps?: number;
  scale_width?: number;
  speed?: number;
}

export interface SystemHealth {
  status: string;
  app_version: string;
  ffmpeg_available: boolean;
  ffmpeg_path?: string;
  ffprobe_available: boolean;
  ffprobe_path?: string;
  node_available: boolean;
  node_path?: string;
  disk_free_gb: number;
  active_jobs: number;
  queue_length: number;
  downloads_dir: string;
}

export interface PlatformItem {
  name: string;
  category: string;
  url_pattern: string;
}

export interface AppSettings {
  downloads_path: string;
  max_concurrent_downloads: number;
  default_video_quality: string;
  default_video_format: string;
  default_audio_format: string;
  default_audio_bitrate: string;
  auto_embed_thumbnail: boolean;
  auto_embed_subtitles: boolean;
  auto_cleanup_failed_hours: number;
}

export interface HistoryItem {
  id: string;
  job_id?: string;
  url: string;
  title: string;
  platform: string;
  media_type: string;
  format: string;
  quality?: string;
  file_name?: string;
  file_size_str?: string;
  file_path?: string;
  status: string;
  error?: string;
  timestamp: number;
}
