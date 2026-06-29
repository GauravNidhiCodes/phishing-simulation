"use client";

import React from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type IconProps = { className?: string };

const svgBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} width="19" height="19" className={className} aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} width="19" height="19" className={className} aria-hidden>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5a10.4 10.4 0 0 0-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4" />
      <path d="M9 18c-4.5 2-5-2-7-2" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...svgBase} width="19" height="19" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gaurav-nidhi-b0420a391/", Icon: LinkedInIcon },
  { label: "GitHub", href: "https://github.com/GauravNidhiCodes", Icon: GitHubIcon },
  { label: "Instagram", href: "https://instagram.com/_jesse_pinkman09", Icon: InstagramIcon },
];


export default function SocialLinks({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const sizing = compact
    ? "h-9 w-9"
    : "h-12 w-12 sm:h-11 sm:w-11";

  return (
    <ul
      className={`flex items-center justify-center ${compact ? "gap-0.5" : "gap-2 sm:gap-3"} ${className}`}
    >
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`group relative flex ${sizing} cursor-pointer items-center justify-center rounded-full text-ink-faint transition-colors duration-[250ms] ease-out hover:text-ink focus-visible:text-ink focus-visible:outline-none`}
          >
            {}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 opacity-0 blur-md transition-opacity duration-[250ms] group-hover:opacity-100 group-focus-visible:opacity-100" />
            <Icon className="relative" />
          </motion.a>
        </li>
      ))}
    </ul>
  );
}
