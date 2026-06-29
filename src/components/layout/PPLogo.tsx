import React from "react";
import { cn } from "@/lib/utils";

interface PPLogoProps {
  size?: number;
  className?: string;
  /** Render only the white monogram with no tile (for bare contexts). */
  bare?: boolean;
}

/**
 * Pinkman Protects — the PP monogram.
 * Two upright P's fused through a ligature (the first bowl meets the second
 * stem) into one balanced, geometric mark with a single consistent weight.
 */
export const PPLogo: React.FC<PPLogoProps> = ({
  size = 24,
  className = "",
  bare = false,
}) => {
  return (
    <span
      className={cn("inline-flex shrink-0 select-none", className)}
      style={{ width: size, height: size }}
      aria-label="Pinkman Protects"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {!bare && (
          <>
            <rect width="256" height="256" rx="56" fill="#070708" />
            <rect
              x="0.75"
              y="0.75"
              width="254.5"
              height="254.5"
              rx="55.25"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.07"
              strokeWidth="1.5"
            />
          </>
        )}
        <path
          d="M72 52 L72 200 M72 52 A44 44 0 0 1 72 140 M138 52 L138 200 M138 52 A44 44 0 0 1 138 140"
          stroke="#ffffff"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
};

export default PPLogo;
