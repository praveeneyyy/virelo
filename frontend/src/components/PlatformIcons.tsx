import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const YouTubeIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.04.88.12V9.32a6.34 6.34 0 0 0-6.62 6.34 6.34 6.34 0 0 0 6.34 6.34c3.5 0 6.34-2.84 6.34-6.34V8.58a8.28 8.28 0 0 0 4.99 1.63V6.78a4.85 4.85 0 0 1-1.82-.09z"/>
  </svg>
);

export const PinterestIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.27 1.7-2.27.8 0 1.19.6 1.19 1.32 0 .8-.51 2.01-.78 3.12-.22.94.47 1.7 1.39 1.7 1.67 0 2.95-1.76 2.95-4.3 0-2.25-1.62-3.82-3.92-3.82-2.67 0-4.24 2-4.24 4.07 0 .81.31 1.67.7 2.14.08.09.09.18.06.31-.07.28-.22.91-.25 1.04-.04.17-.14.21-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.37 5.92 5.55 0 3.31-2.09 5.98-4.99 5.98-.97 0-1.89-.51-2.2-1.11l-.6 2.29c-.22.84-.81 1.89-1.21 2.53A12 12 0 1 0 12 0z"/>
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const XTwitterIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const RedditIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

export const VimeoIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32C15.323 19.161 12.935 21 10.985 21c-1.214 0-2.24-1.119-3.079-3.359l-1.68-6.16c-.622-2.24-1.29-3.36-2.004-3.36-.156 0-.7.328-1.634.981L1.5 7.647C3.12 6.216 4.724 4.8 6.31 3.4c1.62-1.431 2.85-2.184 3.69-2.26 1.99-.187 3.22.996 3.69 3.55.5 2.74.84 4.45 1.03 5.13.56 2.37 1.15 3.55 1.77 3.55.47 0 1.18-.75 2.15-2.24.96-1.5 1.48-2.65 1.56-3.46.16-1.37-.4-2.06-1.7-2.06-.62 0-1.26.14-1.9.42 1.28-4.2 3.73-6.23 7.35-6.09 2.68.09 3.96 1.78 3.84 5.064z"/>
  </svg>
);

export const TwitchIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M2.149 0l-1.612 4.119v16.8h5.908V24l3.224-3.081h3.763L23.463 10.87V0H2.149zm19.172 10.045l-3.224 3.224H13.83l-2.686 2.686v-2.686H7.119V2.149h14.202v7.896zM17.97 4.836h-2.149v5.91h2.149V4.836zm-5.91 0H9.91v5.91h2.149V4.836z"/>
  </svg>
);

export const SoundCloudIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="currentColor"
  >
    <path d="M1.176 13.064a.88.88 0 0 0-.882.882c0 .487.395.882.882.882.487 0 .882-.395.882-.882a.88.88 0 0 0-.882-.882zm2.118-1.588a.88.88 0 0 0-.882.882v3.176a.88.88 0 0 0 1.764 0v-3.176a.88.88 0 0 0-.882-.882zm2.118-1.059a.88.88 0 0 0-.882.883v5.294a.88.88 0 1 0 1.764 0v-5.294a.88.88 0 0 0-.882-.883zm2.118-.53a.88.88 0 0 0-.882.883v6.353a.88.88 0 0 0 1.764 0v-6.353a.88.88 0 0 0-.882-.883zm2.118-.353a.88.88 0 0 0-.882.883v7.059a.88.88 0 0 0 1.764 0v-7.059a.88.88 0 0 0-.882-.883zm2.117.177a.88.88 0 0 0-.882.882v6.706a.88.88 0 0 0 1.764 0v-6.706a.88.88 0 0 0-.882-.882zm9.177 1.411c0-.441-.115-.853-.314-1.213a3.528 3.528 0 0 0-3.392-2.316c-.235 0-.462.029-.682.083a4.764 4.764 0 0 0-4.664-3.791c-.244 0-.482.02-.716.056a.88.88 0 0 0-.749.866v8.47c0 .487.395.883.882.883h9.635a3.53 3.53 0 0 0 .882-6.948z"/>
  </svg>
);

export const BrowserIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const ChromeIcon: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export const PlatformIcon: React.FC<{ platform: string; className?: string; size?: number }> = ({ platform, className, size = 16 }) => {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <YouTubeIcon className={className || "text-red-600"} size={size} />;
  if (p.includes('instagram')) return <InstagramIcon className={className || "text-pink-600"} size={size} />;
  if (p.includes('tiktok')) return <TikTokIcon className={className || "text-slate-900"} size={size} />;
  if (p.includes('pinterest')) return <PinterestIcon className={className || "text-red-600"} size={size} />;
  if (p.includes('facebook')) return <FacebookIcon className={className || "text-blue-600"} size={size} />;
  if (p.includes('reddit')) return <RedditIcon className={className || "text-orange-600"} size={size} />;
  if (p.includes('vimeo')) return <VimeoIcon className={className || "text-cyan-500"} size={size} />;
  if (p.includes('twitch')) return <TwitchIcon className={className || "text-purple-600"} size={size} />;
  if (p.includes('soundcloud')) return <SoundCloudIcon className={className || "text-orange-500"} size={size} />;
  return <BrowserIcon className={className || "text-slate-500"} size={size} />;
};
