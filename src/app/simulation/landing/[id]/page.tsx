"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CheckCircle2, Eye, Lock,
  GraduationCap, Flag, Link2, Clock,
} from "lucide-react";

interface Indicator { id: number; icon: React.ReactNode; label: string; text: string; }

export default function SimulationLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [phase, setPhase] = useState<"MOCK_PORTAL" | "EDUCATION_PANEL">("MOCK_PORTAL");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const indicators: Indicator[] = [
    { id: 1, icon: <Link2 size={15} />, label: "Mismatched sender domain", text: "Sent from pinkman-secure-portal.com — not your real pinkman.com workspace. Always read the domain after the @, right to left." },
    { id: 2, icon: <Clock size={15} />, label: "Manufactured urgency", text: "Phrases like “within 24 hours” and “automatic lockout” are designed to make you act before you think. Slow down." },
    { id: 3, icon: <Eye size={15} />, label: "Deceptive link destination", text: "The button pointed to an external server, not your internal SSO. Hover any link to preview where it truly goes." },
  ];

  useEffect(() => {
    if (id) {
      fetch("/api/simulation/click", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: id }),
      }).catch((err) => console.error("Failed to log simulation click:", err));
    }
  }, [id]);

  const handleMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (id) {
      await fetch("/api/simulation/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId: id }),
      }).catch((err) => console.error("Failed to log simulation submission:", err));
    }
    setPhase("EDUCATION_PANEL");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-4 text-ink">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[120px]" />

      <AnimatePresence mode="wait">
        {phase === "MOCK_PORTAL" ? (
          <motion.div
            key="mock-portal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[400px]"
          >
            <div className="overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex flex-col items-center border-b border-line px-8 py-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] bg-white text-[15px] font-bold tracking-tight text-black">PP</div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Sign in to continue</h2>
                <p className="mt-1 text-[12.5px] text-ink-soft">Verify your identity to review your session.</p>
              </div>

              <form onSubmit={handleMockSubmit} className="space-y-4 px-8 py-7">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-ink-soft">Work email</label>
                  <input
                    type="email" required placeholder="name@company.com" value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="focus-ring h-11 w-full rounded-[10px] border border-line bg-inset px-3.5 text-[13.5px] text-ink placeholder:text-ink-faint"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12.5px] font-medium text-ink-soft">Password</label>
                    <span className="cursor-pointer text-[12px] text-ink-faint hover:text-ink-soft">Forgot?</span>
                  </div>
                  <input
                    type="password" required placeholder="••••••••" value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="focus-ring h-11 w-full rounded-[10px] border border-line bg-inset px-3.5 text-[13.5px] text-ink placeholder:text-ink-faint"
                  />
                </div>

                <div className="flex items-start gap-2 rounded-[10px] border border-line bg-inset p-3 text-[12px] leading-relaxed text-ink-faint">
                  <Lock size={13} className="mt-0.5 shrink-0 text-ink-soft" />
                  <span>Single sign-on. Your session stays valid for 24 hours.</span>
                </div>

                <button
                  type="submit" disabled={submitting}
                  className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-white text-[13.5px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <div className="border-t border-line bg-inset/50 px-8 py-4 text-center">
                <button type="button" onClick={() => setPhase("EDUCATION_PANEL")} className="text-[12px] font-medium text-ink-faint transition-colors hover:text-ink-soft">
                  Skip and view training analysis
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="education-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid w-full max-w-4xl gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-5"
          >
            {/* Left: the reveal */}
            <div className="space-y-6 bg-card p-7 md:col-span-2 md:p-9">
              <span className="flex h-12 w-12 items-center justify-center rounded-[13px] border border-accent/30 bg-accent-faint text-accent">
                <ShieldCheck size={24} />
              </span>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-inset px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-soft">
                  <CheckCircle2 size={12} className="text-accent" /> Safe — this was a drill
                </span>
                <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">This was a phishing simulation</h1>
                <p className="text-[13.5px] leading-relaxed text-ink-soft">
                  The email you just acted on came from Pinkman Protects&apos; security awareness program. No harm done — but a real attacker could have caused damage here.
                </p>
              </div>
              <div className="flex items-start gap-2.5 rounded-[12px] border border-accent/20 bg-accent-faint/40 p-3.5 text-[12.5px] leading-relaxed text-ink-soft">
                <Lock size={14} className="mt-0.5 shrink-0 text-accent" />
                <span><span className="font-medium text-ink">Nothing was stored.</span> Whatever you typed was discarded instantly. We never saw your password.</span>
              </div>
            </div>

            {/* Right: cues */}
            <div className="space-y-5 bg-card p-7 md:col-span-3 md:p-9">
              <div>
                <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-ink"><Eye size={16} className="text-accent" /> What gave it away</h2>
                <p className="mt-1 text-[12.5px] text-ink-soft">Three signals you can train yourself to catch every time.</p>
              </div>

              <div className="space-y-2.5">
                {indicators.map((ind, index) => (
                  <motion.div
                    key={ind.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    className="flex gap-3.5 rounded-[12px] border border-line bg-inset p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-line bg-card text-ink-soft">{ind.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-[13px] font-semibold text-ink">{ind.label}</h4>
                      <p className="text-[12.5px] leading-relaxed text-ink-soft">{ind.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 border-t border-line pt-5 sm:flex-row">
                <Link href="/learning" className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-accent px-4 py-3 text-[13.5px] font-semibold text-black transition-opacity hover:opacity-90">
                  <GraduationCap size={16} /> Take a 2-min refresher
                </Link>
                <Link href="/notifications" className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-line bg-inset px-4 py-3 text-[13.5px] font-medium text-ink-soft transition-colors hover:text-ink">
                  <Flag size={15} /> How to report phishing
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
