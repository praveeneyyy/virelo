import React from 'react';

interface VireloLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export const VireloIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 32, 
  className = "" 
}) => {
  return (
    <img 
      src="/brand/virelo-icon.png" 
      alt="VIRELO" 
      width={size} 
      height={size}
      className={`shrink-0 object-contain select-none pointer-events-none drop-shadow-[0_2px_10px_rgba(124,58,237,0.35)] ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
    />
  );
};

export const VireloLogo: React.FC<VireloLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = ""
}) => {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const currentIconSize = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <VireloIcon size={currentIconSize} />
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-black tracking-tight text-[var(--text-primary)] ${textSizes[size]}`}>
            VIRELO
          </span>
          {size !== 'sm' && (
            <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-[var(--text-secondary)] mt-0.5">
              Universal Media Downloader
            </span>
          )}
        </div>
      )}
    </div>
  );
};
