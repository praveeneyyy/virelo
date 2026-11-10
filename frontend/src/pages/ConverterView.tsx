import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileVideo, 
  Music, 
  Image as ImageIcon, 
  Sliders, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Folder, 
  ArrowLeft,
  RefreshCw,
  Cpu,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { ViewTab } from '../types';
import { openDownloadsFolder } from '../services/api';

interface ConverterViewProps {
  onNavigate?: (tab: ViewTab) => void;
}

export const ConverterView: React.FC<ConverterViewProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedType, setDetectedType] = useState<'video' | 'audio' | 'image' | 'unknown'>('unknown');
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [targetQuality, setTargetQuality] = useState('1080');
  const [targetBitrate, setTargetBitrate] = useState('320');
  
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [convertResult, setConvertResult] = useState<{ download_url: string; filename: string; file_size_str: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setConvertResult(null);
    setErrorMsg(null);
    setConvertProgress(0);

    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (mime.startsWith('video/') || name.endsWith('.mp4') || name.endsWith('.mkv') || name.endsWith('.mov') || name.endsWith('.webm') || name.endsWith('.avi')) {
      setDetectedType('video');
      setTargetFormat('mp4');
    } else if (mime.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.m4a') || name.endsWith('.flac') || name.endsWith('.ogg')) {
      setDetectedType('audio');
      setTargetFormat('mp3');
    } else if (mime.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp')) {
      setDetectedType('image');
      setTargetFormat('png');
    } else {
      setDetectedType('unknown');
      setTargetFormat('mp4');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleStartConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setConvertProgress(15);
    setErrorMsg(null);
    setConvertResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('target_format', targetFormat);
    if (targetQuality) formData.append('target_quality', targetQuality);
    if (targetBitrate) formData.append('target_bitrate', targetBitrate);

    try {
      setConvertProgress(45);
      const res = await axios.post('/api/convert/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 70) / progressEvent.total);
            setConvertProgress(percent);
          }
        }
      });

      setConvertProgress(100);
      setConvertResult(res.data);

      // Auto-download converted file to local folder
      if (res.data.download_url) {
        const link = document.createElement('a');
        link.href = res.data.download_url;
        link.setAttribute('download', res.data.filename || 'converted_media');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Conversion failed.';
      setErrorMsg(msg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleOpenFolder = async () => {
    try {
      await openDownloadsFolder();
    } catch {
      // Ignore
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate?.('downloader')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-xs font-semibold text-purple-700">
          <Cpu size={13} />
          <span>Native FFmpeg 9.0 Transcoder</span>
        </div>
      </div>

      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Universal <span className="font-serif italic font-normal text-purple-700">Media Converter</span>
        </h1>
        <p className="text-sm text-slate-600">
          Upload any video, audio, or image file and transcode it to modern web and studio formats without quality loss.
        </p>
      </div>

      {/* Main Converter Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-purple-500/5 p-6 sm:p-8 space-y-6">
        
        {/* Drag and Drop Zone */}
        {!selectedFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-10 text-center cursor-pointer bg-purple-50/20 hover:bg-purple-50/50 transition-all space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-xs">
              <UploadCloud size={28} />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-base text-slate-800">
                Click to browse or drag and drop your media file here
              </p>
              <p className="text-xs text-slate-500">
                Supports MP4, MKV, MOV, WebM, MP3, WAV, FLAC, JPG, PNG & more
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Selected File Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                  {detectedType === 'video' && <FileVideo size={24} />}
                  {detectedType === 'audio' && <Music size={24} />}
                  {detectedType === 'image' && <ImageIcon size={24} />}
                  {detectedType === 'unknown' && <Sliders size={24} />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{formatFileSize(selectedFile.size)}</span>
                    <span>•</span>
                    <span className="capitalize font-semibold text-purple-700">{detectedType} stream</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setConvertResult(null);
                  setErrorMsg(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
              >
                Change File
              </button>
            </div>

            {/* Target Output Settings */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              
              {/* Output Format Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Select Output Container
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {(detectedType === 'video' 
                    ? ['mp4', 'mkv', 'webm', 'mov', 'gif', 'mp3'] 
                    : detectedType === 'audio'
                    ? ['mp3', 'wav', 'm4a', 'flac', 'opus', 'aac']
                    : ['png', 'jpg', 'webp', 'bmp']
                  ).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setTargetFormat(fmt)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        targetFormat === fmt
                          ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-sm font-bold uppercase font-mono">{fmt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Bitrate Fine Tuning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Resolution if Video */}
                {['mp4', 'mkv', 'webm', 'mov'].includes(targetFormat) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Output Resolution</label>
                    <select
                      value={targetQuality}
                      onChange={(e) => setTargetQuality(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                    >
                      <option value="original">Original Resolution</option>
                      <option value="2160">2160p (4K Ultra HD)</option>
                      <option value="1440">1440p (2K Quad HD)</option>
                      <option value="1080">1080p (Full HD Default)</option>
                      <option value="720">720p (HD Fast)</option>
                      <option value="480">480p (Compact Standard)</option>
                    </select>
                  </div>
                )}

                {/* Bitrate if Audio */}
                {['mp3', 'm4a', 'opus', 'aac'].includes(targetFormat) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Acoustic Bitrate</label>
                    <select
                      value={targetBitrate}
                      onChange={(e) => setTargetBitrate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                    >
                      <option value="320">320 kbps (Maximum Studio Fidelity)</option>
                      <option value="256">256 kbps (High Quality)</option>
                      <option value="192">192 kbps (Standard)</option>
                      <option value="128">128 kbps (Compact)</option>
                    </select>
                  </div>
                )}

              </div>

            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button & Live Progress */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isConverting}
                onClick={handleStartConvert}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 cursor-pointer"
              >
                {isConverting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Transcoding via FFmpeg 9.0 ({convertProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Start Conversion to {targetFormat.toUpperCase()}</span>
                  </>
                )}
              </button>

              {isConverting && (
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${convertProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Completion Result Card */}
            {convertResult && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Conversion Completed & Saved to Local Folder!</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-700">
                    {convertResult.file_size_str}
                  </span>
                </div>

                <p className="text-xs text-emerald-700 font-mono truncate">
                  {convertResult.filename}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenFolder}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-xs font-semibold text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Folder size={14} className="text-purple-600" />
                    <span>Open Downloads Folder</span>
                  </button>

                  <a
                    href={convertResult.download_url}
                    download={convertResult.filename}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download size={14} />
                    <span>Download Converted File</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
