"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Paperclip } from "lucide-react";
import PPLogo from "@/components/layout/PPLogo";
import { Counter } from "@/components/ui/Stat";
import FishingLine, { LineAnchor } from "@/components/landing/FishingLine";
import FishingRod from "@/components/landing/FishingRod";
import HookedFish from "@/components/landing/HookedFish";
import MorphHeadline from "@/components/landing/MorphHeadline";
import SocialLinks from "@/components/landing/SocialLinks";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Tilt from "@/components/landing/Tilt";
import Magnetic from "@/components/landing/Magnetic";
import LivePreview from "@/components/landing/LivePreview";

/* -------------------------------------------------------------------------- */
/*  Motion primitives                                                          */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a visual and drifts it against the scroll for gentle parallax. */
function Parallax({
  children,
  className,
  range = 70,
}: {
  children: React.ReactNode;
  className?: string;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Original product illustrations                                            */
/* -------------------------------------------------------------------------- */

/** A real-looking message in a reading pane, with the tells called out. */
function PhishingScene() {
  return (
    <div className="relative [perspective:1600px]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-danger/[0.06] blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
        className="relative overflow-hidden rounded-[14px] border border-line bg-surface shadow-pop"
      >
        {/* mail toolbar */}
        <div className="flex items-center gap-3 border-b border-line/70 bg-[#0b0b0c] px-4 py-2.5 text-ink-faint">
          <ArrowRight size={13} className="-scale-x-100" />
          <span className="text-[11.5px]">Inbox</span>
          <span className="ml-auto flex items-center gap-1 rounded-full border border-warn/30 bg-warn-faint px-2 py-0.5 text-[10.5px] font-medium text-warn">
            Quarantined sample
          </span>
        </div>

        {/* header block */}
        <div className="space-y-2.5 px-5 pt-4">
          <h4 className="pr-20 text-[16.5px] font-semibold leading-snug tracking-[-0.01em]">
            Action required: re-verify your account within 24 hours
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#21211f] text-[12px] font-semibold text-warn">
              IT
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12.5px]">
                IT Service Desk{" "}
                <span className="text-ink-faint">
                  &lt;support@pinkman-secure-portal.com&gt;
                </span>
              </p>
              <p className="truncate text-[11.5px] text-ink-faint">
                to me, finance-all · 9:14 AM
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 h-px bg-line/70" />

        {/* body */}
        <div className="space-y-4 px-5 py-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            We detected unusual sign-in activity on your account. To avoid an
            automatic lockout, confirm your credentials within 24 hours using the
            secure link below.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#2b2b30] px-4 py-2.5 text-[13px] font-medium text-ink">
            Verify my account
          </span>
          <div className="flex items-center gap-2 rounded-[8px] border border-line/70 bg-inset px-3 py-2 text-[12px] text-ink-soft">
            <Paperclip size={13} className="text-ink-faint" />
            account-verification.html
            <span className="ml-auto text-[11px] text-ink-faint">38 KB</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-ink-faint">
            Pinkman IT · Automated message, please do not reply.
          </p>
        </div>

        {/* annotations — placed off-grid, overlapping content */}
        <motion.div
          initial={{ opacity: 0, x: 14, y: -4 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="absolute right-3 top-[92px] rotate-1 rounded-[7px] border border-danger/40 bg-[#1f1414] px-2.5 py-1 text-[11px] font-medium text-danger shadow-card"
        >
          Look-alike domain
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -12, y: 6 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="absolute -left-3 bottom-[112px] -rotate-1 rounded-[7px] border border-warn/40 bg-[#1e1a10] px-2.5 py-1 text-[11px] font-medium text-warn shadow-pop"
        >
          Manufactured urgency
        </motion.div>
      </motion.div>
    </div>
  );
}

/** The lesson someone sees the moment after they click. */
function LessonScene() {
  return (
    <div className="relative [perspective:1600px]">
      <div className="pointer-events-none absolute -left-12 -bottom-10 h-64 w-64 rounded-full bg-accent/[0.07] blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
        className="relative overflow-hidden rounded-[14px] border border-line bg-surface shadow-pop"
      >
        {/* lesson chrome with progress */}
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-3">
          <span className="text-[11.5px] font-medium text-ink-soft">Quick lesson</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="h-1 w-6 rounded-full bg-accent" />
              <span className="h-1 w-6 rounded-full bg-accent" />
              <span className="h-1 w-6 rounded-full bg-inset" />
            </div>
            <span className="text-[11px] text-ink-faint">2 / 3</span>
          </div>
        </div>

        <div className="px-5 py-5">
          {/* the lure they just clicked, quoted back */}
          <div className="rounded-[9px] border-l-2 border-danger/60 bg-[#161011] px-3.5 py-2.5">
            <p className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">
              The email you opened
            </p>
            <p className="mt-1 truncate text-[12.5px] text-ink-soft">
              “Re-verify your account within 24 hours”
            </p>
          </div>

          <h4 className="mt-5 text-[16.5px] font-semibold tracking-[-0.01em]">
            Three things that gave it away
          </h4>
          <div className="mt-4 space-y-2.5">
            {[
              "The domain wasn’t ours — read it right to left.",
              "A countdown is pressure, not a real deadline.",
              "Real IT never asks you to confirm a password.",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: EASE }}
                className="flex items-start gap-3 text-[13px] text-ink-soft"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={12} />
                </span>
                {t}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line/70 px-5 py-3.5">
          <span className="text-[11.5px] text-ink-faint">Takes about 40 seconds</span>
          <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-ink px-3 py-1.5 text-[12px] font-semibold text-canvas">
            Mark as done
            <ArrowRight size={13} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/** A risk report — by team, with the trend and a short table. */
function AnalyticsScene() {
  const bars = [38, 54, 47, 66, 59, 74, 71, 88, 84, 93];
  const teams = [
    { t: "Finance", risk: "Low", clk: "2.1%", tone: "good" },
    { t: "Sales", risk: "Watch", clk: "6.4%", tone: "warn" },
    { t: "Support", risk: "Low", clk: "3.0%", tone: "good" },
    { t: "Engineering", risk: "High", clk: "9.2%", tone: "bad" },
  ];
  const tone: Record<string, string> = {
    good: "bg-accent-faint text-accent",
    warn: "bg-warn-faint text-warn",
    bad: "bg-danger-faint text-danger",
  };
  return (
    <div className="relative [perspective:1600px]">
      <div className="pointer-events-none absolute -right-14 top-2 h-72 w-72 rounded-full bg-accent/[0.06] blur-[120px]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
        className="relative overflow-hidden rounded-[14px] border border-line bg-surface shadow-pop"
      >
        <div className="flex items-end justify-between px-5 pt-5">
          <div>
            <p className="text-[13px] font-medium">Human risk · Q2</p>
            <p className="mt-0.5 text-[11.5px] text-ink-faint">resilience trending up</p>
          </div>
          <div className="text-right">
            <p className="tnum text-[26px] font-semibold leading-none">7.1</p>
            <p className="text-[11px] text-accent">↓ 2.3 vs Q1</p>
          </div>
        </div>

        <div className="mt-5 flex h-24 items-end gap-1.5 px-5">
          {bars.map((h, i) => (
            <div key={i} className="flex-1">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }}
                className={
                  "w-full rounded-t-[4px] " +
                  (i === bars.length - 1
                    ? "bg-accent"
                    : "bg-gradient-to-t from-accent/15 to-accent/60")
                }
              />
            </div>
          ))}
        </div>

        {/* the table — by team, real columns */}
        <div className="mt-4 border-t border-line/70">
          <div className="flex items-center gap-3 px-5 py-2 text-[10.5px] uppercase tracking-[0.08em] text-ink-faint">
            <span className="flex-1">Team</span>
            <span className="w-16">Click</span>
            <span className="w-16 text-right">Risk</span>
          </div>
          {teams.map((row, i) => (
            <motion.div
              key={row.t}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: EASE }}
              className="flex items-center gap-3 border-t border-line/40 px-5 py-2.5 text-[12.5px]"
            >
              <span className="flex-1 text-ink-soft">{row.t}</span>
              <span className="tnum w-16 text-ink-faint">{row.clk}</span>
              <span className="flex w-16 justify-end">
                <span className={"rounded-full px-2 py-0.5 text-[10.5px] font-medium " + tone[row.tone]}>
                  {row.risk}
                </span>
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section scaffolds                                                          */
/* -------------------------------------------------------------------------- */

const acts = [
  {
    index: "01",
    kicker: "Simulate",
    title: "Send the kind of email attackers send.",
    body: "Run tests built from the emails your people actually get — fake invoices, lockout warnings, approval requests. Nothing real is at risk. Anything someone types is discarded in the browser.",
    visual: (
      <Tilt max={3} className="rounded-[18px]">
        <PhishingScene />
      </Tilt>
    ),
    flip: false,
    x: 770,
    ring: false,
  },
  {
    index: "02",
    kicker: "Teach",
    title: "Turn the mistake into the lesson.",
    body: "People don't learn much from a yearly seminar. They learn in the ten seconds after a click. So that's when we step in, with a short lesson about what just happened.",
    visual: (
      <Tilt max={3} className="rounded-[18px]">
        <LessonScene />
      </Tilt>
    ),
    flip: true,
    x: 230,
    ring: true,
  },
  {
    index: "03",
    kicker: "Measure",
    title: "See where the risk actually is.",
    body: "Every click and report adds up to one clear view — by person, by team, by quarter. So you know where your time is worth spending.",
    visual: (
      <Tilt max={3} className="rounded-[18px]">
        <AnalyticsScene />
      </Tilt>
    ),
    flip: false,
    x: 770,
    ring: false,
  },
];

const capabilities = [
  ["Consent comes first", "Every campaign is approved and logged. No tricks, no surprises for your people."],
  ["Passwords never leave the browser", "Whatever someone types is discarded right there. We never see it."],
  ["Emails people might believe", "A library based on the scams going around now. Localized, and kept current."],
  ["Reports people will read", "Clear exports in one click. The numbers, without the spin."],
  ["SSO, SCIM, audit logs", "Fits into your stack and keeps a clean record of what happened."],
  ["Works across time zones", "Schedule, localize, and report across regions from one place."],
];

const stats = [
  { value: 73, suffix: "%", decimals: 0, label: "fewer repeat clicks", sub: "after a couple of cycles" },
  { value: 4.2, suffix: "×", decimals: 1, label: "faster reporting", sub: "once it becomes a habit" },
  { value: 0, suffix: "", decimals: 0, label: "passwords stored", sub: "everything is discarded in the browser" },
];

const plans = [
  {
    name: "Starter",
    price: "₹4,999",
    cadence: "/mo",
    note: "Per organization · billed annually",
    blurb: "For small teams running their first program.",
    features: ["Up to 50 people", "2 verified domains", "Standard template library", "Monthly campaigns", "GST invoice"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹14,999",
    cadence: "/mo",
    note: "Per organization · billed annually",
    blurb: "For teams that have outgrown the basics.",
    features: ["Up to 500 people", "Unlimited domains", "Custom templates", "Live analytics", "CSV & PDF exports"],
    cta: "Start free",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    note: "Built around your setup",
    blurb: "For larger orgs that need custom deployment, SSO, and hands-on onboarding.",
    features: ["Unlimited seats", "SSO, SAML & SCIM", "Dedicated infrastructure", "Compliance support", "Priority onboarding"],
    cta: "Talk to us",
    featured: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-canvas text-ink antialiased"
    >
      <SmoothScroll />

      {/* One continuous wire, threaded through the whole page */}
      <FishingLine containerRef={rootRef} />

      <div className="relative z-10">
      {/* Nav */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-4 mt-4 flex h-14 items-center justify-between rounded-full border border-line/70 bg-canvas/60 px-3 pl-5 backdrop-blur-xl sm:mx-auto sm:w-[min(100%-2rem,72rem)]">
          <Link href="/" className="flex items-center gap-2.5">
            <PPLogo size={24} />
            <span className="text-[15px] font-semibold tracking-[-0.01em]">Pinkman Protects</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[14px] text-ink-soft md:flex">
            <Magnetic><a href="#how" className="px-1 transition-colors hover:text-ink">How it works</a></Magnetic>
            <Magnetic><a href="#platform" className="px-1 transition-colors hover:text-ink">Platform</a></Magnetic>
            <Magnetic><a href="#pricing" className="px-1 transition-colors hover:text-ink">Pricing</a></Magnetic>
          </nav>
          <div className="flex items-center gap-2">
            <SocialLinks compact className="mr-1 hidden md:flex" />
            <span className="mr-1 hidden h-5 w-px bg-line md:block" />
            <Link href="/auth/login" className="hidden px-3 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink sm:block">
              Sign in
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-canvas shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.97]"
            >
              Open console
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section ref={heroRef} className="relative px-6 pt-44 sm:pt-52">
        {/* the rod the wire is cast from — its tip is the wire's origin */}
        <FishingRod />
        <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[820px] opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <LineAnchor x={330} sway={1.1} />

          <MorphHeadline triggerRef={heroRef} />

          <Reveal delay={0.5}>
            <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-ink-soft sm:text-[18px]">
              We send safe phishing tests, teach the moment someone slips, and
              show you where the risk is. Passwords never leave the browser.
            </p>
          </Reveal>

          <Reveal delay={0.62}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-[#04130c] shadow-[0_8px_30px_-8px_rgba(62,207,142,0.5)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
              >
                Open the console
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#how" className="inline-flex items-center gap-2 px-5 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink">
                See how it works
                <ArrowRight size={15} />
              </a>
            </div>
          </Reveal>
        </div>

        <LineAnchor x={720} sway={1.4} ring />

        <div className="relative z-10 mt-20 sm:mt-28">
          <LivePreview />
        </div>
      </section>

      {/* Trust line */}
      <section className="px-6 py-24 sm:py-32">
        <LineAnchor x={470} sway={1} />
        <Reveal>
          <p className="text-center text-[13px] uppercase tracking-[0.16em] text-ink-faint">
            Some of the teams using Pinkman Protects
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[19px] font-semibold tracking-[-0.02em] text-ink-faint/70">
            {["Northwind", "Aperture", "Meridian", "Cobalt Bank", "Vantage", "Lumen Health"].map((n) => (
              <span key={n} className="transition-colors hover:text-ink-soft">{n}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Statement — break rhythm, big centered editorial */}
      <section className="relative px-6 py-12 sm:py-24">
        <LineAnchor x={250} sway={1.3} />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[clamp(1.9rem,4.4vw,3.4rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
              <span className="text-ink-faint">Most breaches don&apos;t break in.</span>{" "}
              Someone lets them in — usually by accident, usually in a hurry.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-7 max-w-xl text-[16px] leading-relaxed text-ink-soft">
              You can&apos;t patch a person. But you can build the habit that
              makes that mistake rare, and measure it as you go.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it works — broken grid, uneven spans, offset visuals */}
      <section id="how" className="px-6 py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-28 sm:gap-y-44">
          {acts.map((act, idx) => {
            const layout = [
              { text: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-center", viz: "lg:col-span-7 lg:col-start-6 lg:row-start-1", range: 56 },
              { text: "lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-center", viz: "lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-24", range: 32 },
              { text: "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center", viz: "lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:-mt-8", range: 48 },
            ][idx];
            return (
              <div
                key={act.index}
                className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-8"
              >
                <Reveal className={layout.text}>
                  <LineAnchor x={act.x} sway={1.5} ring={act.ring} />
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold tabular-nums text-accent">{act.index}</span>
                    <span className="h-px w-8 bg-line-strong" />
                    <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-faint">{act.kicker}</span>
                  </div>
                  <h3 className="mt-5 max-w-md text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
                    {act.title}
                  </h3>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">{act.body}</p>
                </Reveal>
                <Parallax range={layout.range} className={layout.viz}>
                  {act.visual}
                </Parallax>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform capabilities — heading anchored left, uneven column of details */}
      <section id="platform" className="px-6 py-24 sm:py-32">
        <LineAnchor x={360} sway={1.2} />
        <div className="mx-auto grid max-w-6xl gap-x-10 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
                The whole program,
                <br className="hidden sm:block" /> quietly handled.
              </h2>
              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ink-soft">
                Everything you need to run it, and not much you don&apos;t. Set it
                up once and let it tick along.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:row-start-1">
            {capabilities.map(([title, body], i) => (
              <Reveal
                key={title}
                delay={(i % 2) * 0.08}
                className={i === 0 ? "sm:col-span-2" : ""}
              >
                <div className="border-t border-line pt-5">
                  <h3
                    className={
                      "font-semibold tracking-[-0.01em] " +
                      (i === 0 ? "text-[18px]" : "text-[16px]")
                    }
                  >
                    {title}
                  </h3>
                  <p
                    className={
                      "mt-2.5 leading-relaxed text-ink-soft " +
                      (i === 0 ? "max-w-md text-[15px]" : "text-[14.5px]")
                    }
                  >
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics — large numbers, set on an uneven baseline */}
      <section className="px-6 py-24 sm:py-32">
        <LineAnchor x={630} sway={1.2} ring />
        <div className="mx-auto grid max-w-6xl gap-14 sm:grid-cols-3 sm:gap-8">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.1}
              className={i === 1 ? "sm:mt-16" : i === 2 ? "sm:mt-7" : ""}
            >
              <div className="text-center sm:text-left">
                <p className="text-[clamp(3.4rem,7vw,5rem)] font-semibold leading-none tracking-[-0.05em]">
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="mt-5 text-[15.5px] font-medium">{s.label}</p>
                <p className="mt-1 text-[13.5px] text-ink-faint">{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 sm:py-28">
        <LineAnchor x={430} sway={1} />
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center">
              <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
                Priced to grow with the program.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15.5px] text-ink-soft">
                Prices in ₹. Start free, and upgrade when you&apos;re ready.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid items-start gap-5 lg:grid-cols-3">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08} className={p.featured ? "lg:-mt-6" : ""}>
                <Tilt
                  max={2.5}
                  lift={p.featured ? 9 : 6}
                  className={"h-full " + (p.featured ? "rounded-[20px]" : "rounded-[14px]")}
                >
                <div
                  className={
                    "relative flex h-full flex-col " +
                    (p.featured
                      ? "rounded-[20px] p-8 pt-9 bg-surface shadow-pop ring-1 ring-accent/30"
                      : "rounded-[14px] p-7 bg-card shadow-card ring-1 ring-line")
                  }
                >
                  {p.featured && (
                    <span className="absolute right-6 top-7 rounded-full bg-accent-faint px-2.5 py-0.5 text-[11.5px] font-medium text-accent">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-[14px] font-medium uppercase tracking-[0.1em] text-ink-faint">{p.name}</h3>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-[40px] font-semibold tracking-[-0.04em]">{p.price}</span>
                    <span className="text-[15px] text-ink-faint">{p.cadence}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-ink-faint">{p.note}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{p.blurb}</p>
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
                      "mt-8 inline-flex items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-semibold transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.98] " +
                      (p.featured
                        ? "bg-accent text-[#04130c] hover:bg-[#4ad99a]"
                        : "bg-inset text-ink ring-1 ring-line hover:ring-line-strong")
                    }
                  >
                    {p.cta}
                  </Link>
                </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-6 py-32 sm:py-44">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-[160px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              Make the bad second
              <br />
              <span className="text-ink-faint">rare.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-md text-[16.5px] leading-relaxed text-ink-soft">
              Open the console and send your first test. Most teams see a
              difference within a couple of cycles.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <Link
              href="/auth/login"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-[#04130c] shadow-[0_8px_30px_-8px_rgba(62,207,142,0.5)] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
            >
              Open the console
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* The end of the line */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-start px-6 pb-44 pt-16">
        <HookedFish />
      </section>

      {/* Footer */}
      <footer className="border-t border-line px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <PPLogo size={26} />
              <span className="text-[15px] font-semibold tracking-[-0.01em]">Pinkman Protects</span>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-faint">
              Safe phishing tests, short lessons, and reporting you&apos;ll
              actually read.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 text-[13.5px] sm:grid-cols-3">
            {[
              ["Product", ["How it works", "Platform", "Pricing"]],
              ["Company", ["About", "Careers", "Contact"]],
              ["Legal", ["Privacy", "Security", "Terms"]],
            ].map(([head, items]) => (
              <div key={head as string}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{head}</p>
                <ul className="mt-4 space-y-2.5">
                  {(items as string[]).map((it) => (
                    <li key={it}>
                      <Link href="/auth/login" className="text-ink-soft transition-colors hover:text-ink">{it}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl items-center justify-center border-t border-line pt-8">
          <p className="text-center text-[12.5px] text-ink-faint">
            © 2026 Pinkman Protects. Built by Gaurav Nidhi.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}
