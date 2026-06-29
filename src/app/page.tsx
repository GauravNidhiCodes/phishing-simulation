"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Paperclip, Star, ArrowLeft, FileText, Archive, Trash2 } from "lucide-react";
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
        whileHover={{ y: -4 }}
        className="group relative overflow-hidden rounded-[16px] border border-line bg-surface/85 shadow-pop backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_34px_90px_-32px_rgba(0,0,0,0.85)]"
      >
        {/* action bar */}
        <div className="flex items-center gap-3.5 border-b border-line/60 px-4 py-2.5 text-ink-faint">
          <ArrowLeft size={15} className="transition-colors group-hover:text-ink-soft" />
          <span className="h-4 w-px bg-line/70" />
          <Archive size={15} className="transition-colors hover:text-ink-soft" />
          <Trash2 size={15} className="transition-colors hover:text-ink-soft" />
          <span className="ml-auto rounded-full border border-warn/25 bg-warn-faint px-2 py-0.5 text-[10.5px] font-medium text-warn">
            Simulation
          </span>
        </div>

        {/* subject + labels */}
        <div className="px-5 pt-5">
          <h4 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
            Pending invoice approval — confirm by 6:00 PM today
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-[5px] bg-inset px-1.5 py-0.5 text-[10.5px] font-medium text-ink-faint">Inbox</span>
            <span className="rounded-[5px] bg-inset px-1.5 py-0.5 text-[10.5px] font-medium text-ink-faint">Finance</span>
          </div>
        </div>

        {/* sender row */}
        <div className="mt-4 flex items-center gap-3 px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3a2a16] to-[#241808] text-[14px] font-semibold text-warn ring-1 ring-warn/20">
            A
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="flex flex-wrap items-baseline gap-x-1.5 text-[13px] font-medium text-ink">
              Accounts Payable
              <span className="truncate font-normal text-ink-faint">
                &lt;accounts@payments-verify.in&gt;
              </span>
            </p>
            <p className="mt-0.5 text-[11.5px] text-ink-faint">to me</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-ink-faint">
            <span className="text-[11.5px]">9:14&nbsp;AM</span>
            <Star size={15} className="transition-colors group-hover:text-warn" />
          </div>
        </div>

        {/* body */}
        <div className="mt-5 space-y-4 px-5 pb-5">
          <p className="text-[13.5px] leading-relaxed text-ink-soft">
            Hi, a vendor payment of <span className="text-ink">₹2,48,500</span> is
            awaiting your approval. To release it before end of day, review and
            confirm the details using the secure link below.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#2b2b30] px-4 py-2.5 text-[13px] font-medium text-ink ring-1 ring-line/60 transition-colors group-hover:bg-[#34343b]">
            Review &amp; approve
            <ArrowRight size={13} />
          </span>

          {/* attachment */}
          <div className="flex items-center gap-3 rounded-[10px] border border-line/70 bg-inset/60 px-3 py-2.5 transition-colors hover:border-line-strong hover:bg-inset">
            <div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-danger-faint text-danger">
              <FileText size={16} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12.5px] font-medium text-ink-soft">Invoice_7842.pdf</p>
              <p className="text-[11px] text-ink-faint">PDF · 214 KB</p>
            </div>
            <Paperclip size={14} className="ml-auto shrink-0 text-ink-faint" />
          </div>

          <p className="text-[11.5px] leading-relaxed text-ink-faint">
            Automated message from the accounts portal. Please do not share approval links.
          </p>
        </div>

        {/* annotations — placed off-grid, overlapping content */}
        <motion.div
          initial={{ opacity: 0, x: 14, y: -4 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          className="absolute right-3 top-[58px] rotate-1 rounded-[7px] border border-warn/40 bg-[#1e1a10] px-2.5 py-1 text-[11px] font-medium text-warn shadow-card"
        >
          Manufactured urgency
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -12, y: 6 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="absolute -left-3 top-[164px] -rotate-1 rounded-[7px] border border-danger/40 bg-[#1f1414] px-2.5 py-1 text-[11px] font-medium text-danger shadow-pop"
        >
          Look-alike domain
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
              “Pending invoice approval — confirm by 6:00 PM today”
            </p>
          </div>

          <h4 className="mt-5 text-[16.5px] font-semibold tracking-[-0.01em]">
            Three things that gave it away
          </h4>
          <div className="mt-4 space-y-2.5">
            {[
              "The domain wasn’t ours — read it right to left.",
              "A same-day deadline is pressure, not a real one.",
              "Approvals never happen over an emailed link.",
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
  {
    value: 73,
    suffix: "%",
    decimals: 0,
    label: "Stopped clicking",
    desc: "Employees who avoided the link after a few rounds of simulations.",
  },
  {
    value: 4.2,
    suffix: "×",
    decimals: 1,
    label: "Faster reporting",
    desc: "How much sooner teams flag a suspicious email once it becomes habit.",
  },
  {
    value: 0,
    suffix: "",
    decimals: 0,
    label: "Passwords stored",
    desc: "Anything typed during a simulation is discarded in the browser.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "₹9,999",
    cadence: "/mo",
    note: "Per organization · billed monthly",
    blurb: "For growing teams running their first awareness program.",
    features: ["Up to 100 people", "2 verified domains", "Standard template library", "Monthly campaigns", "GST invoice"],
    cta: "Start a simulation",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹24,999",
    cadence: "/mo",
    note: "Per organization · billed monthly",
    blurb: "For organizations running continuous phishing simulations.",
    features: ["Up to 1,000 people", "Unlimited domains", "Custom templates", "Live analytics", "CSV & PDF exports"],
    cta: "Start a simulation",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    cadence: "",
    note: "Custom plan · billed annually",
    blurb: "Custom deployments, compliance, dedicated onboarding and enterprise support.",
    features: ["Unlimited seats", "SSO, SAML & SCIM", "Dedicated infrastructure", "Compliance support", "Priority onboarding"],
    cta: "Contact sales",
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
              className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[14px] font-semibold text-canvas shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[background-color,transform] duration-200 ease-out-soft hover:bg-white active:scale-[0.97]"
            >
              Start a simulation
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
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
            <p className="mx-auto mt-8 max-w-[560px] text-[17px] font-normal leading-loose text-ink-soft sm:text-[18px]">
              The attack starts with curiosity.
              <br />
              The lesson starts with one click.
            </p>
          </Reveal>

          <Reveal delay={0.62}>
            <div className="mt-10 flex items-center justify-center">
              <Link
                href="/auth/login"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-[#04130c] shadow-[0_10px_34px_-12px_rgba(62,207,142,0.55)] transition-[transform,box-shadow,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:bg-[#4ad99a] hover:shadow-[0_16px_44px_-12px_rgba(62,207,142,0.6)] active:translate-y-0 active:scale-[0.98]"
              >
                Start a simulation
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        <LineAnchor x={720} sway={1.4} ring />

        <div className="relative z-10 mt-20 sm:mt-28">
          <LivePreview />
        </div>
      </section>

      {/* Built for — honest segments and cities, no fabricated logos */}
      <section className="px-6 py-24 sm:py-32">
        <LineAnchor x={470} sway={1} />
        <Reveal>
          <p className="text-center text-[13px] uppercase tracking-[0.16em] text-ink-faint">
            Built for security teams across India
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[clamp(1.25rem,2.6vw,1.85rem)] font-medium leading-snug tracking-[-0.02em] text-ink-soft">
            Made for startups, colleges, SMEs and enterprise teams — from Pune and
            Mumbai to Bengaluru, Hyderabad and Delhi.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mx-auto mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12.5px] font-medium uppercase tracking-[0.12em] text-ink-faint/70">
            {["Startups", "Colleges", "SMEs", "Enterprise", "Public sector"].map((s, i) => (
              <span key={s} className="flex items-center gap-7">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-line-strong" />}
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Statement — break rhythm, big centered editorial */}
      <section className="relative px-6 py-12 sm:py-24">
        <LineAnchor x={250} sway={1.3} />
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="mx-auto max-w-[600px] text-[clamp(1.15rem,2.4vw,1.6rem)] font-normal leading-[1.6] text-ink-soft">
              The door wasn&apos;t forced open.
              <br />
              It was held open.
              <br />
              <br />
              Because hackers don&apos;t always break in.
              <br />
              <span className="text-ink">Sometimes they&apos;re invited.</span>
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

      {/* Metrics — three numbers that mean something, divided cleanly */}
      <section className="px-6 py-24 sm:py-32">
        <LineAnchor x={630} sway={1.2} ring />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-y-0">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div
                className={
                  "group sm:px-9 " +
                  (i > 0 ? "sm:border-l sm:border-line" : "")
                }
              >
                <p className="text-[clamp(3.2rem,6.4vw,4.75rem)] font-semibold leading-none tracking-[-0.05em] transition-transform duration-300 ease-out-soft group-hover:-translate-y-1">
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="mt-6 text-[15px] font-medium text-ink">{s.label}</p>
                <p className="mt-2 max-w-[17rem] text-[13.5px] leading-relaxed text-ink-faint">
                  {s.desc}
                </p>
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
                Plans in ₹, billed monthly. Move up or down whenever it suits you.
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
                    <span
                      className={
                        "font-semibold tracking-[-0.04em] " +
                        (p.cadence ? "text-[40px]" : "text-[27px]")
                      }
                    >
                      {p.price}
                    </span>
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
              See how your team
              <br />
              <span className="text-ink-faint">actually responds.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-md text-[16.5px] leading-relaxed text-ink-soft">
              Send one simulation to a small group and watch what happens. It
              takes a few minutes to set up.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <Link
              href="/auth/login"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-semibold text-[#04130c] shadow-[0_10px_34px_-12px_rgba(62,207,142,0.55)] transition-[transform,box-shadow,background-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:bg-[#4ad99a] hover:shadow-[0_16px_44px_-12px_rgba(62,207,142,0.6)] active:translate-y-0 active:scale-[0.98]"
            >
              Start a simulation
              <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
