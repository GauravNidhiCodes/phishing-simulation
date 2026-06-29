import React from "react";
import { cn } from "@/lib/utils";

interface PPLogoProps {
  size?: number;
  className?: string;
}

/**
 * Pinkman Protects mark — a quiet shield with an inset notch.
 * Monochrome by default; the notch carries the single accent.
 */
export const PPLogo: React.FC<PPLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <span
      className={cn("inline-flex shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      aria-label="Pinkman Protects"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2.5 27 6.4v8.1c0 7.1-4.6 12.4-11 15-6.4-2.6-11-7.9-11-15V6.4L16 2.5Z"
          fill="#161618"
          stroke="#2b2b30"
          strokeWidth="1.25"
        />
        <path
          d="M10.8 16.4l3.5 3.5 7-7.4"
          stroke="#3ecf8e"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

export default PPLogo;
