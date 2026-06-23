'use client';

import React, { useEffect, useState } from 'react';

export const TopoBackground: React.FC = () => {
  const [grid, setGrid] = useState<string[]>([]);

  useEffect(() => {
    const rows = 40;
    const cols = 120;
    const chars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

    const generateGrid = () => {
      const newGrid: string[] = [];
      const time = Date.now() * 0.0003;

      for (let r = 0; r < rows; r++) {
        let rowStr = '';
        for (let c = 0; c < cols; c++) {
          // Compute wave pattern for topography curves
          const x = (c - cols / 2) * 0.08;
          const y = (r - rows / 2) * 0.15;
          
          // Double sine wave representing peaks and valleys
          const z = 
            Math.sin(x * 0.5 + time) * Math.cos(y * 0.8) + 
            Math.sin(x * 0.3 - time * 0.5) * Math.sin(y * 0.5) +
            Math.cos(Math.sqrt(x*x + y*y) * 0.4 - time);

          // Map z value [-2, 2] to character index [0, 9]
          const charIdx = Math.floor(((z + 2) / 4) * chars.length);
          const boundedIdx = Math.max(0, Math.min(chars.length - 1, charIdx));
          
          rowStr += chars[boundedIdx];
        }
        newGrid.push(rowStr);
      }
      setGrid(newGrid);
    };

    generateGrid();
    
    // Animate grid occasionally
    const interval = setInterval(generateGrid, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden font-mono text-[9px] leading-[10px] text-zinc-800 select-none pointer-events-none opacity-45 -z-20 whitespace-pre">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
      <div className="w-full flex flex-col items-center pt-4">
        {grid.map((row, idx) => (
          <div key={idx} className="tracking-[2px]">{row}</div>
        ))}
      </div>
    </div>
  );
};
export default TopoBackground;
