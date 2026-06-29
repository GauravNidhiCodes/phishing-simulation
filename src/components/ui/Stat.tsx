"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";


export function Counter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1100,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tnum">
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: { value: string; positive?: boolean };
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={cn(
        "group relative flex flex-col justify-between gap-6 rounded-[14px] border border-line bg-card p-5 shadow-card transition-[border-color,box-shadow,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-float",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-soft">{label}</span>
        {icon && (
          <span className="text-ink-faint transition-colors group-hover:text-ink-soft">
            {icon}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink">
          {value}
        </div>
        {(delta || hint) && (
          <div className="flex items-center gap-2 text-[12.5px]">
            {delta && (
              <span
                className={cn(
                  "font-medium",
                  delta.positive ? "text-accent" : "text-danger"
                )}
              >
                {delta.value}
              </span>
            )}
            {hint && <span className="text-ink-faint">{hint}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
