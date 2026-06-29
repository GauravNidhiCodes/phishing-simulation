"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LineAnchor } from "./FishingLine";


export default function HookedFish() {
  const reduce = useReducedMotion();

  const sway = reduce
    ? {}
    : { animate: { rotate: [-2.1, 2.1] }, transition: { duration: 7, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const } };

  const tail = reduce
    ? {}
    : { animate: { rotate: [-6.5, 6.5] }, transition: { duration: 3.1, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const } };

  const breathe = reduce
    ? {}
    : { animate: { scaleX: [1, 1.02, 1], scaleY: [1, 0.99, 1] }, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" as const } };

  const float = reduce
    ? {}
    : { animate: { y: [0, 5, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <motion.div
      className="relative mx-auto w-[220px] select-none"
      {...float}
    >
      {}
      <LineAnchor x={500} sway={0.25} />

      <svg
        viewBox="0 0 160 330"
        width="100%"
        height="auto"
        fill="none"
        aria-hidden
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="fish-body" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#33383b" />
            <stop offset="0.5" stopColor="#535a5e" />
            <stop offset="0.82" stopColor="#7f878b" />
            <stop offset="1" stopColor="#969ea1" />
          </linearGradient>
          <linearGradient id="fish-fin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a4144" stopOpacity="0.9" />
            <stop offset="1" stopColor="#646c70" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="hook-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c7ccd1" />
            <stop offset="0.5" stopColor="#8b9197" />
            <stop offset="1" stopColor="#b4babf" />
          </linearGradient>
          <radialGradient id="fish-shadow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {}
        <path d="M80 0 L80 27" stroke="url(#hook-metal)" strokeWidth={1.4} />
        <circle cx="80" cy="31" r="3.4" stroke="url(#hook-metal)" strokeWidth={1.8} fill="none" />
        <path
          d="M80 35 L80 52 C80 61 75 66 69 63 C64 60.5 64.5 55 69 54.5"
          stroke="url(#hook-metal)"
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
        />

        {}
        <ellipse cx="80" cy="320" rx="40" ry="7" fill="url(#fish-shadow)" />

        {}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          {...sway}
        >
          {}
          <motion.path
            d="M80 256 C95 272 107 290 103 306 C96 298 88 293 80 289 C72 293 64 298 57 306 C53 290 65 272 80 256 Z"
            fill="url(#fish-fin)"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
            {...tail}
          />

          {}
          <path d="M114 116 C129 124 132 150 123 172 C119 157 116 133 114 122 Z" fill="url(#fish-fin)" />
          <path d="M110 95 C125 99 129 117 120 130 C114 117 111 103 110 98 Z" fill="url(#fish-fin)" />
          <path d="M47 156 C35 162 33 180 41 196 C44 183 46 167 47 161 Z" fill="url(#fish-fin)" />

          {}
          <motion.path
            d="M80 64 C102 67 118 97 115 142 C113 181 106 215 96 244 C91 257 85 263 80 265 C75 263 69 257 64 244 C54 215 47 181 45 142 C42 97 58 67 80 64 Z"
            fill="url(#fish-body)"
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            {...breathe}
          />

          {}
          <path
            d="M58 98 C66 152 70 210 77 252"
            stroke="#2c3133"
            strokeOpacity="0.35"
            strokeWidth={1}
            fill="none"
          />
          {}
          <path d="M64 96 C70 108 88 108 94 95" stroke="#2c3133" strokeOpacity="0.4" strokeWidth={1.2} fill="none" />

          {}
          <circle cx="75" cy="86" r="4.6" fill="#15181a" />
          <circle cx="73.2" cy="84.2" r="1.4" fill="#dfe3e6" fillOpacity="0.9" />
        </motion.g>
      </svg>
    </motion.div>
  );
}
