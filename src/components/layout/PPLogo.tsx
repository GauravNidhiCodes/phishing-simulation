import React from 'react';

interface PPLogoProps {
  size?: number;
  className?: string;
}

export const PPLogo: React.FC<PPLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg border border-[#00FF88] bg-[#050505] shadow-[0_0_10px_rgba(0,255,136,0.3)] shrink-0 select-none ${className}`}
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
