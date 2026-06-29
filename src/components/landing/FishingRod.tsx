"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A restrained, premium carbon-fibre rod anchored in the hero. Its tip rests at
 * this element's origin (0,0) — exactly where the single fishing wire begins —
 * so the wire reads as cast from the rod and carried all the way down the page.
 * The blank sweeps up and off the top edge; the whole thing is low-contrast on
 * purpose, present but never shouting over the headline.
 */
export default function FishingRod() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-[64%] top-[46px] h-[170px] w-[320px]"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      {/* the wire originates exactly at the rod tip (svg 0,0 → ~7.8,150 here) */}
      <span
        aria-hidden
        data-fish-anchor
        data-x="auto"
        data-sway="0"
        data-ring="0"
        className="pointer-events-none absolute"
        style={{ left: 7.8, top: 150, width: 0, height: 0 }}
      />

      <svg
        viewBox="-8 -150 330 170"
        width="100%"
        height="100%"
        fill="none"
        preserveAspectRatio="none"
        className="hidden overflow-visible sm:block"
      >
        <defs>
          <linearGradient id="rod-blank" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#202327" />
            <stop offset="0.5" stopColor="#34383d" />
            <stop offset="1" stopColor="#16181b" />
          </linearGradient>
          <linearGradient id="rod-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6b727a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#7c838b" stopOpacity="0.7" />
            <stop offset="1" stopColor="#6b727a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rod-guide" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#d9dde2" />
            <stop offset="0.6" stopColor="#9aa0a7" />
            <stop offset="1" stopColor="#62676c" />
          </radialGradient>
          <radialGradient id="rod-reel" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#3a3f45" />
            <stop offset="1" stopColor="#15171a" />
          </radialGradient>
        </defs>

        {/* soft shadow under the blank */}
        <path
          d="M0 0 L243 -120 L252 -110 L4 4 Z"
          fill="#000000"
          fillOpacity="0.35"
          transform="translate(3 5)"
          style={{ filter: "blur(3px)" }}
        />

        {/* tapered carbon blank: thin at the tip (0,0), thick at the butt */}
        <path
          d="M0.6 0.9 L246 -122 L256 -112 L-0.6 -0.9 Z"
          fill="url(#rod-blank)"
        />
        {/* thin specular line along the blank */}
        <path
          d="M1 -0.4 L249 -118"
          stroke="url(#rod-sheen)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* faint carbon weave near the butt */}
        {[0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d={`M${214 - k * 10} ${-96 - k * 5} l8 -3.6`}
            stroke="#4c525a"
            strokeOpacity="0.5"
            strokeWidth="0.7"
          />
        ))}

        {/* tip ferrule */}
        <path d="M0 0 L18 -8.6" stroke="#b9bfc5" strokeWidth="1.6" strokeLinecap="round" />

        {/* line guides hanging under the blank */}
        {[
          { x: 70, y: -33, r: 4.4 },
          { x: 138, y: -66, r: 4 },
          { x: 200, y: -98, r: 3.6 },
        ].map((g, k) => (
          <g key={k}>
            <line
              x1={g.x}
              y1={g.y}
              x2={g.x + 2}
              y2={g.y - 7}
              stroke="#5b6168"
              strokeWidth="1.1"
            />
            <ellipse
              cx={g.x}
              cy={g.y}
              rx={g.r}
              ry={g.r * 1.15}
              fill="none"
              stroke="url(#rod-guide)"
              strokeWidth="1.3"
            />
          </g>
        ))}

        {/* reel seat + low-profile reel near the butt */}
        <rect x="224" y="-118" width="34" height="9" rx="3" transform="rotate(-26 224 -118)" fill="#1b1d20" />
        <g transform="translate(232 -98)">
          <circle r="14" fill="url(#rod-reel)" stroke="#43494f" strokeWidth="1.2" />
          <circle r="5.5" fill="none" stroke="#565c63" strokeWidth="1.1" />
          <circle cx="-0.5" cy="-0.5" r="1.6" fill="#6c7278" />
        </g>
      </svg>
    </motion.div>
  );
}
