"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium select-none rounded-[10px] " +
  "transition-colors duration-150 focus-ring disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  // White, high-emphasis — the single loudest action on a screen
  primary:
    "bg-ink text-[#0a0a0a] hover:bg-white shadow-[0_1px_0_0_rgba(255,255,255,0.12)_inset]",
  // Default surface button
  secondary:
    "bg-card text-ink border border-line hover:bg-card-hover hover:border-line-strong",
  // Quiet, text-like
  ghost: "text-ink-soft hover:text-ink hover:bg-white/[0.04]",
  // The restrained green — reserved for confirm/launch moments
  accent:
    "bg-accent text-[#04130c] hover:bg-[#4ad99a] font-semibold",
  danger:
    "bg-card text-danger border border-line hover:border-[#7a3a3a] hover:bg-[#1a1111]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 text-[13px]",
  md: "px-4 text-sm",
  lg: "px-5 text-[15px]",
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.975 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ height: size === "sm" ? 32 : size === "lg" ? 44 : 38 }}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner size={size === "lg" ? 18 : 15} />
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "opacity-0"
          )}
        >
          {icon}
          {children}
          {iconRight}
        </span>
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export function Spinner({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
