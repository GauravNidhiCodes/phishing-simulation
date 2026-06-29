"use client";

import React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[10px] border border-line bg-inset text-ink placeholder:text-ink-faint/70 " +
  "transition-colors duration-150 focus:outline-none focus:border-[#3ecf8e]/60 " +
  "focus:bg-[#101012] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.10)]";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, trailing, invalid, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            fieldBase,
            "h-10 text-sm",
            icon ? "pl-10" : "px-3.5",
            trailing ? "pr-10" : !icon && "px-3.5",
            icon && !trailing && "pr-3.5",
            invalid &&
              "border-[#7a3a3a] focus:border-[#a04848] focus:shadow-[0_0_0_3px_rgba(240,107,107,0.10)]",
            className
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint">
            {trailing}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBase, "min-h-24 px-3.5 py-2.5 text-sm leading-relaxed resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        fieldBase,
        "h-10 cursor-pointer appearance-none px-3.5 pr-9 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));
Select.displayName = "Select";

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
  action,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {(label || action) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={htmlFor}
              className="text-[13px] font-medium text-ink-soft"
            >
              {label}
            </label>
          )}
          {action}
        </div>
      )}
      {children}
      {hint && <p className="text-[12px] text-ink-faint">{hint}</p>}
    </div>
  );
}
