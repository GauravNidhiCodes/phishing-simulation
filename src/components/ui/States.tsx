"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "./Button";

/** Full-area loading state with a quiet, branded feel. */
export function LoadingState({
  label = "Loading",
  sublabel,
  className,
}: {
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center",
        className
      )}
    >
      <span className="relative flex h-11 w-11 items-center justify-center text-accent">
        <span className="absolute inset-0 rounded-full bg-accent/10 blur-md" />
        <Spinner size={22} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        {sublabel && <p className="text-[13px] text-ink-faint">{sublabel}</p>}
      </div>
    </motion.div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-dashed border-line bg-card/40 px-8 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-inset text-ink-soft shadow-card">
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-[14px] border border-line bg-card px-8 py-14 text-center shadow-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#492626] bg-[#1a1111] text-danger shadow-card">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}
