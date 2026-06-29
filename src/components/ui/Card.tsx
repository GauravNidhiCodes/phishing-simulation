"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  /** Adds a gentle lift + border brighten on hover. */
  interactive?: boolean;
  /** Inset padding preset. */
  pad?: "none" | "sm" | "md" | "lg";
}

const padMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, pad = "md", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-[14px] border border-line bg-card shadow-card",
          padMap[pad],
          interactive &&
            "transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out-soft will-change-transform hover:-translate-y-0.5 hover:border-line-strong hover:bg-card-hover hover:shadow-float",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
