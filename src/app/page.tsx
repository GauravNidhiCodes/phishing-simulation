"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Radar,
  GraduationCap,
  Check,
  Lock,
} from "lucide-react";
import PPLogo from "@/components/layout/PPLogo";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Radar,
    title: "Simulations that mirror reality",
    body: "Launch consent-verified phishing campaigns from a library of templates modeled on the lures your team actually receives — no guesswork, no real credentials at risk.",
  },
  {
    icon: GraduationCap,
    title: "Training that meets the moment",
    body: "When someone slips, they're guided into a short, focused lesson within seconds. Awareness compounds instead of gathering dust in an annual seminar.",
  },
  {
    icon: ShieldCheck,
    title: "Risk you can actually see",
    body: "Every click, report, and recovery rolls up into a living risk picture — by person, by team, by quarter. Know exactly where to spend the next hour.",
  },
];

const stats = [
  { value: "73%", label: "fewer repeat clickers", sub: "within two campaign cycles" },
  { value: "4.2×", label: "faster threat reporting", sub: "once recognition becomes habit" },
  { value: "0", label: "credentials ever stored", sub: "inputs are discarded in-browser" },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    cadence: "/mo",
    blurb: "For small teams getting their first program off the ground.",
    features: ["Up to 50 people", "2 verified domains", "Standard template library", "Monthly campaigns"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$189",
    cadence: "/mo",
    blurb: "For security teams running a continuous, measurable program.",
    features: ["Up to 500 people", "Unlimited domains", "Custom templates", "Real-time analytics", "CSV & PDF exports"],
    cta: "Start free",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "For organizations with bespoke compliance and scale needs.",
    features: ["Unlimited seats", "Dedicated SMTP gateways", "SSO & SCIM", "Priority support"],
    cta: "Talk to us",
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      {/* Ambient backdrop — one restrained glow, a quiet grid */}
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[760px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      {/* Nav */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-line/70 bg-canvas/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <PPLogo size={24} />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">
              Pinkman Protects
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] text-ink-soft md:flex">
            <a href="#product" className="transition-colors hover:text-ink">Product</a>
            <a href="#proof" className="transition-colors hover:text-ink">Results</a>
            <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/login"
              className="hidden rounded-[10px] px-3.5 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-1.5 rounded-[10px] bg-ink px-4 py-2 text-[14px] font-semibold text-canvas transition-colors hover:bg-white"
            >
              Open console
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pt-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-[12.5px] text-ink-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Consent-based. Credential-safe. Audit-ready.
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-7 max-w-3xl text-[44px] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-[64px]"
        >
          Your people are the
          <br />
          perimeter.{" "}
          <span className="text-ink-faint">Train it like one.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft"
        >
          Pinkman Protects runs ethical phishing simulations, turns every
          mistake into a teaching moment, and gives security teams a clear,
          honest view of human risk — without ever touching a real password.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 rounded-[11px] bg-accent px-5 py-3 text-[15px] font-semibold text-[#04130c] transition-colors hover:bg-[#4ad99a]"
          >
            Open the console
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#product"
            className="inline-flex items-center gap-2 rounded-[11px] border border-line bg-card px-5 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            See how it works
          </a>
        </motion.div>

        {/* Console preview */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2e]" />
            <span className="ml-3 text-[12.5px] text-ink-faint">
              app.pinkmanprotects.com / overview
            </span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            {[
              { k: "Awareness index", v: "86%", d: "+4.2% this quarter" },
              { k: "Click rate", v: "3.1%", d: "down from 12.8%" },
              { k: "People monitored", v: "1,284", d: "across 9 teams" },
            ].map((c) => (
              <div key={c.k} className="rounded-[12px] border border-line bg-card p-4">
                <p className="text-[13px] text-ink-soft">{c.k}</p>
                <p className="mt-3 text-[28px] font-semibold tracking-[-0.03em]">{c.v}</p>
                <p className="mt-1 text-[12.5px] text-accent">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-6">
            <div className="rounded-[12px] border border-line bg-card p-4">
              <div className="flex items-end justify-between gap-2">
                {[34, 52, 41, 63, 58, 76, 69, 88, 81, 92].map((h, i) => (
                  <div key={i} className="flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ duration: 0.7, delay: 0.6 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[4px] bg-gradient-to-t from-accent/30 to-accent"
                      style={{ height: h }}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] text-ink-faint">
                Reporting rate, last ten campaigns
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="product" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">The platform</p>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.025em] sm:text-[40px]">
            Everything a modern awareness program needs, in one place.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[16px] border border-line bg-card p-7 transition-colors hover:border-line-strong"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-inset text-accent">
                  <Icon size={18} />
                </span>
                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em]">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Proof */}
      <section id="proof" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[52px] font-semibold leading-none tracking-[-0.04em]">
                {s.value}
              </p>
              <p className="mt-4 text-[15px] font-medium text-ink">{s.label}</p>
              <p className="mt-1 text-[13.5px] text-ink-faint">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl border-t border-line px-6 py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.025em] sm:text-[40px]">
            Simple plans that scale with your team.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={
                "relative flex flex-col rounded-[16px] border p-7 " +
                (p.featured
                  ? "border-accent/40 bg-card"
                  : "border-line bg-card")
              }
            >
              {p.featured && (
                <span className="absolute right-6 top-6 rounded-full border border-accent/40 bg-accent-faint px-2.5 py-0.5 text-[11.5px] font-medium text-accent">
                  Most popular
                </span>
              )}
              <h3 className="text-[15px] font-semibold text-ink-soft">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[36px] font-semibold tracking-[-0.03em]">
                  {p.price}
                </span>
                <span className="text-[15px] text-ink-faint">{p.cadence}</span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                {p.blurb}
              </p>
              <div className="my-6 h-px bg-line" />
              <ul className="flex-1 space-y-3">
                {p.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-[13.5px] text-ink-soft">
                    <Check size={15} className="shrink-0 text-accent" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/login"
                className={
                  "mt-7 inline-flex items-center justify-center gap-1.5 rounded-[11px] py-2.5 text-[14px] font-semibold transition-colors " +
                  (p.featured
                    ? "bg-accent text-[#04130c] hover:bg-[#4ad99a]"
                    : "border border-line bg-inset text-ink hover:border-line-strong")
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-[32px] font-semibold leading-tight tracking-[-0.025em] sm:text-[40px]">
              Start measuring human risk this week.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
              Sign in to the console, launch your first simulation, and watch
              awareness climb.
            </p>
            <Link
              href="/auth/login"
              className="group mt-8 inline-flex items-center gap-2 rounded-[11px] bg-accent px-6 py-3 text-[15px] font-semibold text-[#04130c] transition-colors hover:bg-[#4ad99a]"
            >
              Open the console
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-[13px] text-ink-faint sm:flex-row">
          <div className="flex items-center gap-2.5">
            <PPLogo size={20} />
            <span className="text-ink-soft">Pinkman Protects</span>
            <span className="hidden sm:inline">— security awareness, handled.</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={13} /> SOC 2 aligned
            </span>
            <span>© 2026 Pinkman Protects, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
