import React from 'react';

interface PPLogoProps {
  size?: number;
  className?: string;
}

export const PPLogo: React.FC<PPLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg border border-[#E50914] bg-[#050505] shadow-[0_0_10px_rgba(229,9,20,0.4)] shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <span 
        className="text-white font-black font-mono tracking-tighter"
        style={{ fontSize: size * 0.45 }}
      >
        PP
      </span>
    </div>
  );
};

export default PPLogo;
