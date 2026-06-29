"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MousePointerClick,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Send,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard, Counter } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { ChartTooltip, chartColors, axisProps } from "@/components/ui/Chart";
import { stagger, rise } from "@/lib/motion";

interface Metric {
  totalEmployees: number;
  avgScore: number;
  riskCounts: { LOW: number; MEDIUM: number; HIGH: number };
  rates: {
    delivered: number;
    opened: number;
    clicked: number;
    submitted: number;
    openRate: number;
    clickRate: number;
    submitRate: number;
  };
  departmentStats: Array<{
    name: string;
    employeesCount: number;
    averageScore: number;
    clicksCount: number;
    submitsCount: number;
  }>;
  campaignTrends: Array<{
    name: string;
    openRate: number;
    clickRate: number;
    submitRate: number;
  }>;
  campaignsSummary?: Array<{
    id: string;
    name: string;
    status: string;
    templateName: string;
    logsCount: number;
    clicks: number;
    submits: number;
  }>;
}

const statusTone: Record<string, "accent" | "warn" | "neutral" | "muted"> = {
  ACTIVE: "accent",
  RUNNING: "accent",
  SCHEDULED: "warn",
  COMPLETED: "neutral",
  DRAFT: "muted",
};

export default function Dashboard() {
  const [data, setData] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => {
        if (d.error) setErrored(true);
        else setData(d);
        setLoading(false);
      })
      .catch(() => {
        setErrored(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingState label="Pulling the latest numbers" sublabel="One moment while we gather your metrics." />;
  }

  if (errored || !data) {
    return (
      <ErrorState
        icon={<AlertTriangle size={20} />}
        title="We couldn't load your dashboard"
        description="The metrics service didn't respond. Make sure the database is seeded, then try again."
        action={
          <Button variant="secondary" onClick={() => location.reload()}>
            Retry
          </Button>
        }
      />
    );
  }

  const riskData = [
    { name: "Low risk", value: data.riskCounts.LOW, color: chartColors.accent },
    { name: "Medium risk", value: data.riskCounts.MEDIUM, color: "#8a8a93" },
    { name: "High risk", value: data.riskCounts.HIGH, color: "#f06b6b" },
  ];

  const funnel = [
    { stage: "Delivered", count: data.rates.delivered, fill: "#3f3f46" },
    { stage: "Opened", count: data.rates.opened, fill: "#71717a" },
    { stage: "Clicked", count: data.rates.clicked, fill: chartColors.accentDim },
    { stage: "Submitted", count: data.rates.submitted, fill: chartColors.accent },
  ];

  const campaigns = data.campaignsSummary || [];

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Security at a glance"
        description="A live picture of human risk across your organization — awareness, exposure, and the campaigns shaping both."
        actions={
          <Link href="/admin/campaigns">
            <Button variant="primary" icon={<Send size={15} />}>
              New campaign
            </Button>
          </Link>
        }
      />

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Awareness index"
            value={<Counter value={data.avgScore} suffix="%" />}
            delta={{ value: "+4.2%", positive: true }}
            hint="vs. last quarter"
            icon={<ShieldCheck size={17} />}
          />
          <StatCard
            label="Click rate"
            value={<Counter value={data.rates.clickRate} suffix="%" />}
            delta={{ value: "−6.5%", positive: true }}
            hint="lower is better"
            icon={<MousePointerClick size={17} />}
          />
          <StatCard
            label="People monitored"
            value={<Counter value={data.totalEmployees} />}
            hint={`${data.departmentStats.length} departments`}
            icon={<Users size={17} />}
          />
          <StatCard
            label="High-risk people"
            value={<Counter value={data.riskCounts.HIGH} />}
            delta={
              data.riskCounts.HIGH > 0
                ? { value: "Needs attention", positive: false }
                : undefined
            }
            hint={data.riskCounts.HIGH > 0 ? undefined : "all clear"}
            icon={<AlertTriangle size={17} />}
          />
        </div>

        {/* Funnel + risk */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={rise} className="lg:col-span-2">
            <Card pad="lg">
              <CardHeader
                title="Campaign funnel"
                description="Where people land across every authorized simulation."
              />
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                    <XAxis type="number" {...axisProps} />
                    <YAxis dataKey="stage" type="category" width={84} {...axisProps} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit=" people" />} />
                    <Bar dataKey="count" name="People" radius={[0, 5, 5, 0]} barSize={22}>
                      {funnel.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={rise}>
            <Card pad="lg" className="flex h-full flex-col">
              <CardHeader title="Risk distribution" description="People by current risk tier." />
              <div className="relative mt-2 flex h-48 items-center justify-center">
                <div className="pointer-events-none absolute flex flex-col items-center">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">Total</span>
                  <span className="tnum text-2xl font-semibold text-ink">
                    {data.totalEmployees}
                  </span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {riskData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip unit=" people" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 border-t border-line pt-4">
                {riskData.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-[13px]">
                    <span className="flex items-center gap-2 text-ink-soft">
                      <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                      {r.name}
                    </span>
                    <span className="tnum font-medium text-ink">{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Trend + departments */}
        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={rise} className="lg:col-span-2">
            <Card pad="lg">
              <CardHeader
                title="Readiness over time"
                description="How interaction rates move campaign to campaign."
              />
              <div className="mt-6 h-64">
                {data.campaignTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.campaignTrends} margin={{ left: -16, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="gAccent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartColors.grid} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis domain={[0, 100]} unit="%" {...axisProps} />
                      <Tooltip content={<ChartTooltip unit="%" />} />
                      <Area type="monotone" dataKey="openRate" name="Open" stroke="#8a8a93" strokeWidth={1.75} fill="transparent" />
                      <Area type="monotone" dataKey="clickRate" name="Click" stroke="#f0b86b" strokeWidth={1.75} fill="transparent" />
                      <Area type="monotone" dataKey="submitRate" name="Submit" stroke={chartColors.accent} strokeWidth={2} fill="url(#gAccent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState
                    title="No trend data yet"
                    description="Run and complete a campaign to start charting readiness over time."
                  />
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={rise}>
            <Card pad="lg" className="h-full">
              <CardHeader title="Department standings" description="Ranked by awareness." />
              <div className="scrollbar-thin mt-5 max-h-[260px] space-y-3 overflow-y-auto pr-1">
                {data.departmentStats.map((dept, i) => (
                  <div key={dept.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-line bg-inset text-[11px] tnum text-ink-faint">
                          {i + 1}
                        </span>
                        <span className="text-[13px] font-medium text-ink">{dept.name}</span>
                      </span>
                      <span
                        className={
                          "tnum text-[13px] font-semibold " +
                          (dept.averageScore >= 80 ? "text-accent" : "text-ink")
                        }
                      >
                        {dept.averageScore}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-inset">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dept.averageScore}%` }}
                        transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className={dept.averageScore >= 80 ? "h-full bg-accent" : "h-full bg-ink-soft/60"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Campaigns */}
        <motion.div variants={rise}>
          <Card pad="lg">
            <CardHeader
              title="Recent campaigns"
              description="The latest simulations and how they performed."
              action={
                <Link href="/admin/campaigns">
                  <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />}>
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="mt-5">
              {campaigns.length === 0 ? (
                <EmptyState
                  icon={<Send size={18} />}
                  title="No campaigns yet"
                  description="Launch your first simulation to start measuring how your team responds."
                  action={
                    <Link href="/admin/campaigns">
                      <Button variant="primary" size="sm">Create a campaign</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y divide-line">
                  {campaigns.slice(0, 6).map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-ink">{c.name}</p>
                        <p className="truncate text-[12.5px] text-ink-faint">{c.templateName}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden text-right sm:block">
                          <p className="tnum text-[13px] font-medium text-ink">{c.clicks}</p>
                          <p className="text-[11.5px] text-ink-faint">clicks</p>
                        </div>
                        <div className="hidden text-right sm:block">
                          <p className="tnum text-[13px] font-medium text-ink">{c.logsCount}</p>
                          <p className="text-[11.5px] text-ink-faint">targets</p>
                        </div>
                        <Badge tone={statusTone[c.status] || "neutral"} dot>
                          {c.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
