import React from 'react';

interface PPLogoProps {
  size?: number;
  className?: string;
}

export const PPLogo: React.FC<PPLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg border border-white/10 bg-[#121212] shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <span 
        className="text-white font-bold font-mono tracking-tighter"
        style={{ fontSize: size * 0.45 }}
      >
        PP
      </span>
    </div>
  );
};

export default PPLogo;
