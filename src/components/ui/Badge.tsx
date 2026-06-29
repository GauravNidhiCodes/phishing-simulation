import React from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "accent"
  | "danger"
  | "warn"
  | "info"
  | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-white/[0.05] text-ink-soft border-line",
  accent: "bg-accent-faint text-accent border-[#1f4534]",
  danger: "bg-[#1f1414] text-danger border-[#492626]",
  warn: "bg-[#1e1a10] text-warn border-[#473c1d]",
  info: "bg-white/[0.05] text-ink border-line-strong",
  muted: "bg-transparent text-ink-faint border-line",
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium leading-5",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "accent" && "bg-accent",
            tone === "danger" && "bg-danger",
            tone === "warn" && "bg-warn",
            (tone === "neutral" || tone === "info" || tone === "muted") &&
              "bg-ink-soft"
          )}
        />
      )}
      {children}
    </span>
  );
}
