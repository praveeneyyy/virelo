import axios from 'axios';
import { MediaInfo, DownloadJob, DownloadPayload, SystemHealth, PlatformItem, AppSettings } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const extractMedia = async (url: string): Promise<MediaInfo> => {
  const res = await api.post<MediaInfo>('/extract', { url });
  return res.data;
};

export const startDownload = async (payload: DownloadPayload): Promise<DownloadJob> => {
  const res = await api.post<DownloadJob>('/download', payload);
  return res.data;
};

export const getJob = async (jobId: string): Promise<DownloadJob> => {
  const res = await api.get<DownloadJob>(`/download/${jobId}`);
  return res.data;
};

export const cancelJob = async (jobId: string): Promise<void> => {
  await api.post(`/download/${jobId}/cancel`);
};

export const retryJob = async (jobId: string): Promise<DownloadJob> => {
  const res = await api.post<DownloadJob>(`/download/${jobId}/retry`);
  return res.data;
};

export const deleteJob = async (jobId: string, deleteFile: boolean = false): Promise<void> => {
  await api.delete(`/download/${jobId}?delete_file=${deleteFile}`);
};

export const getQueue = async (): Promise<DownloadJob[]> => {
  const res = await api.get<DownloadJob[]>('/queue');
  return res.data;
};

export const getHistory = async (): Promise<any[]> => {
  const res = await api.get<any[]>('/history');
  return res.data;
};

export const clearHistory = async (): Promise<void> => {
  await api.delete('/history');
};

export const getPlatforms = async (): Promise<{ total_supported: string; popular: PlatformItem[] }> => {
  const res = await api.get<{ total_supported: string; popular: PlatformItem[] }>('/platforms');
  return res.data;
};

export const getSettings = async (): Promise<AppSettings> => {
  const res = await api.get<AppSettings>('/settings');
  return res.data;
};

export const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const res = await api.post<{ success: boolean; settings: AppSettings }>('/settings', settings);
  return res.data.settings;
};

export const getHealth = async (): Promise<SystemHealth> => {
  const res = await api.get<SystemHealth>('/health');
  return res.data;
};

export const getFileDownloadUrl = (jobId: string): string => {
  return `/api/download/${jobId}/file`;
};

export const openDownloadsFolder = async (): Promise<{ success: boolean; path?: string; error?: string }> => {
  const res = await api.post('/open-downloads-folder');
  return res.data;
};
