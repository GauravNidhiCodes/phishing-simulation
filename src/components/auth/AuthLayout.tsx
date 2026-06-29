"use client";

import React from "react";
import { motion } from "framer-motion";
import PPLogo from "@/components/layout/PPLogo";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-canvas px-5 py-12">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-[412px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <PPLogo size={36} />
          <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-ink-soft">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[16px] border border-line bg-card/90 p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm"
        >
          {children}
        </motion.div>

        {footer && (
          <p className="mt-6 text-center text-[13px] text-ink-faint">{footer}</p>
        )}
      </div>
    </div>
  );
}

export function AuthAlert({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "flex items-start gap-2.5 rounded-[10px] border px-3.5 py-3 text-[13px] leading-relaxed " +
        (tone === "danger"
          ? "border-[#492626] bg-[#1a1111] text-danger"
          : "border-[#1f4534] bg-accent-faint text-accent")
      }
    >
      {children}
    </div>
  );
}

/** Live, friendly password strength checklist. */
export function PasswordChecklist({ password, confirm }: { password: string; confirm?: string }) {
  const rules = [
    { ok: password.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
    { ok: /[0-9]/.test(password), label: "One number" },
    { ok: /[^A-Za-z0-9]/.test(password), label: "One symbol" },
    ...(confirm !== undefined
      ? [{ ok: !!password && password === confirm, label: "Passwords match" }]
      : []),
  ];
  return (
    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {rules.map((r) => (
        <li
          key={r.label}
          className={
            "flex items-center gap-2 text-[12.5px] transition-colors " +
            (r.ok ? "text-ink-soft" : "text-ink-faint")
          }
        >
          <span
            className={
              "flex h-4 w-4 items-center justify-center rounded-full border text-[10px] " +
              (r.ok
                ? "border-accent/40 bg-accent-faint text-accent"
                : "border-line text-ink-faint")
            }
          >
            {r.ok ? "✓" : ""}
          </span>
          {r.label}
        </li>
      ))}
    </ul>
  );
}
