"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LayoutGrid,
  Send,
  Users,
  FileText,
  BarChart3,
  Settings,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Flag,
  ShieldAlert,
  GraduationCap,
  AlertCircle,
  Check,
} from "lucide-react";
import { ChartTooltip, chartColors } from "@/components/ui/Chart";

/* -------------------------------------------------------------------------- */
/*  Believable data — names, teams, campaigns, subjects (never placeholders)   */
/* -------------------------------------------------------------------------- */

const NAMES = [
  "Aarav Mehta", "Priya Nair", "Daniel Cole", "Sofia Rossi", "Wei Chen",
  "Maya Iyer", "Tom Becker", "Ananya Rao", "Lucas Brandt", "Hana Kim",
  "Ravi Shah", "Elena Petrova", "Noah Schmidt", "Diya Kapoor",
];
const DEPTS = ["Finance", "Sales", "Engineering", "People", "Support", "Legal", "Marketing", "IT"];
const CAMPAIGNS = [
  "Q2 Invoice Sweep", "Password Expiry Notice", "Payroll Update",
  "DocuSign Request", "Shared Drive Access", "Calendar Invite",
];

const rand = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");
const r1 = (n: number) => Math.round(n * 10) / 10;

type Tone = "good" | "bad" | "warn" | "info" | "mute";
const tonePill: Record<Tone, string> = {
  good: "bg-accent-faint text-accent",
  bad: "bg-danger-faint text-danger",
  warn: "bg-warn-faint text-warn",
  info: "bg-[#101a26] text-info",
  mute: "bg-inset text-ink-faint",
};

/* -------------------------------------------------------------------------- */
/*  Small primitives                                                           */
/* -------------------------------------------------------------------------- */

/** A number that eases to its value — counts up on reveal, drifts on update. */
function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  active,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => prefix + v.toFixed(decimals) + suffix);
  useEffect(() => {
    if (reduce || !active) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value, active, reduce, mv]);
  return <motion.span>{text}</motion.span>;
}

/** A soft pulsing status dot. */
function Pulse({ className = "bg-accent" }: { className?: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <motion.span
        className={`absolute inline-flex h-full w-full rounded-full ${className}`}
        animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.4, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${className}`} />
    </span>
  );
}

/** A physical card: lifts and catches light on hover. */
function PCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.008 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={
        "rounded-[11px] border border-line bg-card/70 transition-colors duration-200 hover:border-line-strong hover:bg-card hover:shadow-float " +
        className
      }
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The live product preview                                                   */
/* -------------------------------------------------------------------------- */

const NAV = [
  { icon: LayoutGrid, label: "Overview" },
  { icon: Send, label: "Campaigns", active: true },
  { icon: Users, label: "People" },
  { icon: FileText, label: "Templates" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const INITIAL_AREA = [
  { t: "W1", v: 9 }, { t: "W2", v: 11 }, { t: "W3", v: 10 }, { t: "W4", v: 13 },
  { t: "W5", v: 12 }, { t: "W6", v: 15 }, { t: "W7", v: 16 }, { t: "W8", v: 14 },
  { t: "W9", v: 18 }, { t: "W10", v: 19 }, { t: "W11", v: 21 }, { t: "W12", v: 23 },
];

const INITIAL_TEAMS = [
  { team: "Finance", v: 2.1 }, { team: "Sales", v: 6.4 }, { team: "Eng", v: 9.2 },
  { team: "People", v: 3.0 }, { team: "Support", v: 4.1 }, { team: "Legal", v: 1.8 },
];

const INITIAL_RISK = [
  { name: "Low", value: 71, color: chartColors.accent },
  { name: "Watch", value: 22, color: "#e0b341" },
  { name: "High", value: 7, color: "#f06b6b" },
];

const SPARK = [12, 14, 13, 16, 15, 18, 17, 20, 22, 23].map((v, i) => ({ i, v }));

type FeedItem = { id: number; name: string; dept: string; action: string; tone: Tone; m: number };
const INITIAL_FEED: FeedItem[] = [
  { id: 1, name: "Aarav Mehta", dept: "Finance", action: "Reported", tone: "good", m: 0 },
  { id: 2, name: "Priya Nair", dept: "Finance", action: "Clicked link", tone: "bad", m: 4 },
  { id: 3, name: "Daniel Cole", dept: "Sales", action: "Opened", tone: "warn", m: 9 },
  { id: 4, name: "Sofia Rossi", dept: "People", action: "Reported", tone: "good", m: 16 },
  { id: 5, name: "Wei Chen", dept: "Engineering", action: "Enrolled", tone: "info", m: 22 },
];

const EMPLOYEES = [
  { name: "Priya Nair", dept: "Finance", score: 64, risk: "High" as const, tone: "bad" as Tone },
  { name: "Daniel Cole", dept: "Sales", score: 41, risk: "Watch" as const, tone: "warn" as Tone },
  { name: "Lucas Brandt", dept: "Support", score: 37, risk: "Watch" as const, tone: "warn" as Tone },
  { name: "Aarav Mehta", dept: "Finance", score: 18, risk: "Low" as const, tone: "good" as Tone },
  { name: "Ananya Rao", dept: "Engineering", score: 14, risk: "Low" as const, tone: "good" as Tone },
];

const CAMPAIGN_ROWS = [
  { name: "Q2 Invoice Sweep", status: "Running", tone: "good" as Tone, sent: "1,284", rate: "23%" },
  { name: "Payroll Update", status: "Completed", tone: "mute" as Tone, sent: "980", rate: "31%" },
  { name: "Password Expiry Notice", status: "Scheduled", tone: "info" as Tone, sent: "—", rate: "—" },
];

type Notif = { id: number; text: string; tone: Tone; Icon: typeof Flag };

let notifSeq = 1000;
function makeNotif(lastText: string): Notif {
  const name = rand(NAMES);
  const dept = rand(DEPTS);
  const camp = rand(CAMPAIGNS);
  const pool: Omit<Notif, "id">[] = [
    { text: `${name} reported a phishing email`, tone: "good", Icon: Flag },
    { text: `${dept} completed security training`, tone: "good", Icon: GraduationCap },
    { text: `Quarterly awareness score updated`, tone: "info", Icon: BarChart3 },
    { text: `New campaign launched · ${camp}`, tone: "info", Icon: Send },
    { text: `Suspicious login detected · ${dept}`, tone: "warn", Icon: ShieldAlert },
    { text: `${name} clicked a simulated link`, tone: "bad", Icon: AlertCircle },
  ];
  let pick = rand(pool);
  let guard = 0;
  while (pick.text === lastText && guard++ < 6) pick = rand(pool);
  return { id: ++notifSeq, ...pick };
}

export default function LivePreview() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-12% 0px -12% 0px" });
  const active = inView && !reduce;

  // cursor depth + lighting
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 110, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 110, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-3, 3]);
  const rotateX = useTransform(sy, [0, 1], [3, -3]);
  const lightX = useTransform(sx, [0, 1], ["8%", "92%"]);
  const lightY = useTransform(sy, [0, 1], ["-5%", "105%"]);
  const light = useMotionTemplate`radial-gradient(680px circle at ${lightX} ${lightY}, rgba(255,255,255,0.05), transparent 55%)`;

  // live state
  const [area, setArea] = useState(INITIAL_AREA);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [risk, setRisk] = useState(INITIAL_RISK);
  const [feed, setFeed] = useState(INITIAL_FEED);
  const [kpi, setKpi] = useState({ awareness: 86.4, click: 3.1, reported: 297 });
  const [toast, setToast] = useState<Notif | null>(null);
  const [unread, setUnread] = useState(3);
  const feedSeq = useRef(100);
  const lastToast = useRef("");

  useEffect(() => {
    if (!active) return;

    const drift = (v: number, min: number, max: number, step: number) => {
      let n = v + (Math.random() * 2 - 1) * step;
      if (n < min) n = min + Math.random() * step;
      if (n > max) n = max - Math.random() * step;
      return r1(n);
    };

    const tChart = setInterval(() => {
      setArea((prev) =>
        prev.map((d, i) =>
          i < prev.length - 1
            ? { ...d, v: prev[i + 1].v }
            : { ...d, v: drift(prev[i].v, 14, 28, 3) }
        )
      );
      setTeams((prev) => prev.map((d) => ({ ...d, v: drift(d.v, 1, 11, 1.1) })));
      setRisk((prev) => {
        const delta = Math.round((Math.random() * 2 - 1) * 2);
        const low = Math.min(80, Math.max(60, prev[0].value + delta));
        const high = Math.min(12, Math.max(4, prev[2].value - Math.round(delta / 2)));
        return [
          { ...prev[0], value: low },
          { ...prev[1], value: 100 - low - high },
          { ...prev[2], value: high },
        ];
      });
    }, 4200);

    const tKpi = setInterval(() => {
      setKpi((k) => ({
        awareness: drift(k.awareness, 84, 91, 0.5),
        click: drift(k.click, 2.4, 4.2, 0.3),
        reported: k.reported + (Math.random() > 0.4 ? 1 : 0),
      }));
    }, 5000);

    const tFeed = setInterval(() => {
      const actions: { a: string; t: Tone }[] = [
        { a: "Reported", t: "good" },
        { a: "Clicked link", t: "bad" },
        { a: "Opened", t: "warn" },
        { a: "Enrolled", t: "info" },
      ];
      const pick = rand(actions);
      const item: FeedItem = {
        id: ++feedSeq.current,
        name: rand(NAMES),
        dept: rand(DEPTS),
        action: pick.a,
        tone: pick.t,
        m: 0,
      };
      setFeed((prev) => [item, ...prev.map((p) => ({ ...p, m: p.m + 1 }))].slice(0, 5));
    }, 3600);

    return () => {
      clearInterval(tChart);
      clearInterval(tKpi);
      clearInterval(tFeed);
    };
  }, [active]);

  // toast cycle
  useEffect(() => {
    if (!active) return;
    let hide: ReturnType<typeof setTimeout>;
    const show = () => {
      const n = makeNotif(lastToast.current);
      lastToast.current = n.text;
      setToast(n);
      setUnread((u) => Math.min(99, u + 1));
      hide = setTimeout(() => setToast(null), 4000);
    };
    const iv = setInterval(show, 6500);
    return () => {
      clearInterval(iv);
      clearTimeout(hide);
    };
  }, [active]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[62rem] [perspective:1900px]">
      {/* off-axis ambient light */}
      <div className="pointer-events-none absolute -top-28 left-[16%] h-[360px] w-[660px] rounded-full bg-accent/[0.06] blur-[150px]" />

      <motion.div
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        initial={reduce ? false : { opacity: 0, y: 44, rotateX: 7 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformPerspective: 1900 }}
        className="relative z-10 overflow-hidden rounded-[16px] border border-line bg-surface shadow-pop"
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-line/80 bg-[#0b0b0c] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#26262a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#26262a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#26262a]" />
          <div className="ml-3 hidden items-center gap-1.5 text-[11.5px] text-ink-faint sm:flex">
            <span>app.pinkmanprotects.com</span>
            <span className="text-line-strong">/</span>
            <span className="text-ink-soft">campaigns</span>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-ink-faint">
            <Pulse /> Live
          </span>
        </div>

        <div className="flex">
          {/* sidebar */}
          <aside className="hidden w-[176px] shrink-0 flex-col border-r border-line/70 bg-[#0b0b0c] p-3 md:flex">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint/70">
              Pinkman
            </p>
            <div className="flex flex-col gap-0.5">
              {NAV.map(({ icon: Icon, label, active: on }) => (
                <span
                  key={label}
                  className={
                    "flex items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-[12.5px] " +
                    (on ? "bg-card text-ink" : "text-ink-faint")
                  }
                >
                  <Icon size={14} className={on ? "text-accent" : ""} />
                  {label}
                  {on && <span className="ml-auto"><Pulse /></span>}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-[8px] border border-line/60 bg-card/50 px-2.5 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#23231f] text-[10px] font-semibold text-warn">
                RG
              </span>
              <div className="leading-tight">
                <p className="text-[11px] text-ink-soft">Riya Gupta</p>
                <p className="text-[10px] text-ink-faint">Security lead</p>
              </div>
            </div>
          </aside>

          {/* main */}
          <div className="min-w-0 flex-1">
            {/* top nav: search, filter, date, bell, avatar */}
            <div className="flex items-center gap-2 border-b border-line/70 px-4 py-2.5">
              <div className="flex h-7 flex-1 items-center gap-2 rounded-[8px] border border-line bg-inset px-2.5 text-ink-faint">
                <Search size={13} />
                <span className="text-[12px]">Search people, campaigns…</span>
                <span className="ml-auto hidden rounded border border-line-strong px-1 text-[10px] sm:block">⌘K</span>
              </div>
              <span className="hidden items-center gap-1 rounded-[8px] border border-line bg-card px-2.5 py-1.5 text-[11.5px] text-ink-soft sm:flex">
                All teams <ChevronDown size={12} className="text-ink-faint" />
              </span>
              <span className="hidden items-center gap-1.5 rounded-[8px] border border-line bg-card px-2.5 py-1.5 text-[11.5px] text-ink-soft lg:flex">
                <Calendar size={12} className="text-ink-faint" /> Last 30 days
              </span>
              <span className="relative flex h-7 w-7 items-center justify-center rounded-[8px] border border-line bg-card text-ink-soft">
                <Bell size={13} />
                <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent px-1 text-[8.5px] font-semibold text-[#04130c]">
                  {unread}
                </span>
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d2230] text-[10px] font-semibold text-info">
                RG
              </span>
            </div>

            <div className="space-y-3 p-4">
              {/* campaign header */}
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h4 className="text-[15px] font-semibold tracking-[-0.01em]">Q2 Invoice Sweep</h4>
                  <p className="mt-0.5 text-[11.5px] text-ink-faint">
                    Started Jun 24 · Finance, Sales, People · 3 templates
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-accent-faint px-2.5 py-1 text-[11px] font-medium text-accent">
                  <Pulse /> Running
                </span>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-3 gap-3">
                <PCard className="p-3.5">
                  <p className="text-[11.5px] text-ink-faint">Awareness score</p>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="tnum text-[24px] font-semibold leading-none">
                      <AnimatedNumber value={kpi.awareness} decimals={1} active={active} />
                    </p>
                    <span className="text-[11px] text-accent">+4.2</span>
                  </div>
                  <div className="mt-2 h-7">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={SPARK}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={chartColors.accent}
                          strokeWidth={1.75}
                          dot={false}
                          isAnimationActive={active}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </PCard>

                <PCard className="p-3.5">
                  <p className="text-[11.5px] text-ink-faint">Click rate</p>
                  <p className="tnum mt-1 text-[24px] font-semibold leading-none">
                    <AnimatedNumber value={kpi.click} decimals={1} suffix="%" active={active} />
                  </p>
                  <p className="mt-1 text-[11px] text-accent">↓ 9.7% vs last</p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-inset">
                    <motion.div
                      className="h-full rounded-full bg-danger/70"
                      initial={{ width: 0 }}
                      animate={{ width: active ? `${Math.min(100, kpi.click * 12)}%` : 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </PCard>

                <PCard className="p-3.5">
                  <p className="text-[11.5px] text-ink-faint">Reported phishing</p>
                  <p className="tnum mt-1 text-[24px] font-semibold leading-none">
                    <AnimatedNumber value={kpi.reported} active={active} />
                  </p>
                  <p className="mt-1 text-[11px] text-ink-faint">this quarter</p>
                  <div className="mt-3 flex items-center gap-1">
                    {[...Array(7)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="h-3 flex-1 rounded-[2px] bg-accent/70"
                        initial={{ scaleY: 0.2, opacity: 0.4 }}
                        animate={
                          active
                            ? { scaleY: [0.4, 1, 0.6], opacity: 1 }
                            : { scaleY: 0.4, opacity: 0.5 }
                        }
                        transition={{ duration: 2.4, repeat: active ? Infinity : 0, delay: i * 0.12, ease: "easeInOut" }}
                        style={{ originY: 1 }}
                      />
                    ))}
                  </div>
                </PCard>
              </div>

              {/* charts: area (wide) + donut */}
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <PCard className="p-3.5 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium">Reporting rate</p>
                    <p className="text-[11px] text-ink-faint">last 12 weeks</p>
                  </div>
                  <div className="mt-2 h-[116px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={area} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                        <defs>
                          <linearGradient id="lp-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" hide />
                        <Tooltip content={<ChartTooltip unit="%" />} cursor={{ stroke: chartColors.grid }} />
                        <Area
                          type="monotone"
                          dataKey="v"
                          name="Reported"
                          stroke={chartColors.accent}
                          strokeWidth={2}
                          fill="url(#lp-area)"
                          isAnimationActive={active}
                          animationDuration={800}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </PCard>

                <PCard className="relative p-3.5">
                  <p className="text-[12px] font-medium">Risk mix</p>
                  <div className="relative mt-1 h-[116px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip content={<ChartTooltip unit="%" />} />
                        <Pie
                          data={risk}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={52}
                          paddingAngle={3}
                          stroke="none"
                          isAnimationActive={active}
                        >
                          {risk.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="tnum text-[18px] font-semibold leading-none">
                        <AnimatedNumber value={risk[0].value} suffix="%" active={active} />
                      </span>
                      <span className="text-[9.5px] text-ink-faint">low risk</span>
                    </div>
                  </div>
                </PCard>
              </div>

              {/* bar (clicks by team) + activity feed */}
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <PCard className="p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium">Click rate by team</p>
                    <p className="text-[11px] text-ink-faint">%</p>
                  </div>
                  <div className="mt-2 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teams} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                        <XAxis dataKey="team" stroke={chartColors.axis} fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltip unit="%" />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                        <Bar dataKey="v" name="Click rate" radius={[4, 4, 0, 0]} isAnimationActive={active} animationDuration={700}>
                          {teams.map((d, i) => (
                            <Cell key={i} fill={d.v > 6 ? "#f06b6b" : d.v > 4 ? "#e0b341" : chartColors.accent} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </PCard>

                <PCard className="p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium">Recent activity</p>
                    <span className="flex items-center gap-1 text-[11px] text-ink-faint">
                      <Pulse /> live
                    </span>
                  </div>
                  <div className="mt-2 space-y-0.5">
                    <AnimatePresence initial={false}>
                      {feed.map((f) => (
                        <motion.div
                          key={f.id}
                          layout
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-2.5 py-1"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-inset text-[9.5px] font-medium text-ink-soft">
                            {initials(f.name)}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[12px] text-ink-soft">
                            {f.name}
                          </span>
                          <span className={"rounded-full px-1.5 py-0.5 text-[10px] font-medium " + tonePill[f.tone]}>
                            {f.action}
                          </span>
                          <span className="tnum w-8 text-right text-[10.5px] text-ink-faint">
                            {f.m === 0 ? "now" : `${f.m}m`}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </PCard>
              </div>

              {/* employee risk table */}
              <PCard className="p-3.5">
                <p className="text-[12px] font-medium">Employees by risk</p>
                <div className="mt-2">
                  <div className="flex items-center gap-3 border-b border-line/60 pb-1.5 text-[10px] uppercase tracking-[0.08em] text-ink-faint">
                    <span className="flex-1">Person</span>
                    <span className="hidden w-24 sm:block">Team</span>
                    <span className="w-28">Risk score</span>
                    <span className="w-14 text-right">Level</span>
                  </div>
                  {EMPLOYEES.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-3 border-b border-line/30 py-2 text-[12px] last:border-0">
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-inset text-[9.5px] font-medium text-ink-soft">
                          {initials(e.name)}
                        </span>
                        <span className="truncate text-ink-soft">{e.name}</span>
                      </span>
                      <span className="hidden w-24 text-ink-faint sm:block">{e.dept}</span>
                      <span className="flex w-28 items-center gap-2">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-inset">
                          <motion.span
                            className={
                              "block h-full rounded-full " +
                              (e.tone === "bad" ? "bg-danger" : e.tone === "warn" ? "bg-warn" : "bg-accent")
                            }
                            initial={{ width: 0 }}
                            animate={{ width: active ? `${e.score}%` : 0 }}
                            transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </span>
                        <span className="tnum w-6 text-right text-[11px] text-ink-faint">{e.score}</span>
                      </span>
                      <span className="flex w-14 justify-end">
                        <span className={"rounded-full px-1.5 py-0.5 text-[10px] font-medium " + tonePill[e.tone]}>
                          {e.risk}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </PCard>

              {/* campaign list */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CAMPAIGN_ROWS.map((c) => (
                  <PCard key={c.name} className="p-3.5">
                    <div className="flex items-center justify-between">
                      <span className={"rounded-full px-2 py-0.5 text-[10px] font-medium " + tonePill[c.tone]}>
                        {c.status}
                      </span>
                      <Check size={13} className="text-ink-faint" />
                    </div>
                    <p className="mt-2.5 truncate text-[13px] font-medium">{c.name}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-ink-faint">
                      <span>Sent {c.sent}</span>
                      <span>Report {c.rate}</span>
                    </div>
                  </PCard>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* cursor-driven lighting */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: light }}
        />

        {/* live toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-4 top-[60px] z-30 flex w-[244px] items-center gap-2.5 rounded-[11px] border border-line bg-elevated/95 p-3 shadow-pop backdrop-blur-md"
            >
              <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full " + tonePill[toast.tone]}>
                <toast.Icon size={13} />
              </span>
              <p className="text-[12px] leading-snug text-ink-soft">{toast.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
