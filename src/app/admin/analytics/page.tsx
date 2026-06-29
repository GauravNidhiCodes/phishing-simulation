"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldOff,
  GraduationCap,
  Users,
  FileSpreadsheet,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard, Counter } from "@/components/ui/Stat";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { Skeleton, ErrorState } from "@/components/ui/States";
import { ChartTooltip, chartColors, axisProps } from "@/components/ui/Chart";
import { stagger, rise } from "@/lib/motion";

interface FilterOptions {
  departments: string[];
  branches: string[];
  campaigns: Array<{ id: string; name: string; status: string }>;
  riskLevels: string[];
}
interface AnalyticsMetrics {
  avgScore: number; activeCampaigns: number; campaignSuccessRate: number;
  emailDeliveryRate: number; emailOpenRate: number; linkClickRate: number;
  formInteractionRate: number; trainingCompletionRate: number; totalEmployees: number;
  highRiskEmployees: number; mediumRiskEmployees: number; lowRiskEmployees: number;
}
interface ChartsData {
  monthlyAwarenessGrowth: Array<{ name: string; score: number }>;
  campaignPerformanceTrend: Array<{ name: string; clickRate: number; successRate: number }>;
  employeeEngagementTrend: Array<{ name: string; opens: number; clicks: number; submissions: number }>;
  departmentComparison: Array<{ name: string; employees: number; awarenessScore: number; clickRate: number }>;
  branchComparison: Array<{ name: string; employees: number; awarenessScore: number; clickRate: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  securityScoreTrend: Array<{ name: string; score: number }>;
  campaignFunnel: Array<{ stage: string; count: number; fill: string }>;
  monthlyComplianceTrend: Array<{ name: string; complianceRate: number }>;
}
interface AIInsights {
  highestRiskDepartment: string; bestPerformingBranch: string;
  awarenessImprovement: number; employeesNeedingTraining: number; recentCampaignSummary: string;
}
interface AnalyticsData {
  filters: FilterOptions; metrics: AnalyticsMetrics; charts: ChartsData; insights: AIInsights;
}

const riskColors = [chartColors.accent, "#8a8a93", "#f06b6b"];
const datePresets = [
  { value: "ALL_TIME", label: "All time" },
  { value: "LAST_90_DAYS", label: "90 days" },
  { value: "LAST_30_DAYS", label: "30 days" },
  { value: "LAST_7_DAYS", label: "7 days" },
];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedCampaign, setSelectedCampaign] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [datePreset, setDatePreset] = useState("ALL_TIME");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/analytics?department=${selectedDept}&branch=${selectedBranch}&campaignId=${selectedCampaign}&riskLevel=${selectedRisk}`;
      const now = new Date();
      let computedStart = "";
      if (datePreset === "LAST_7_DAYS") { const d = new Date(); d.setDate(now.getDate() - 7); computedStart = d.toISOString().split("T")[0]; }
      else if (datePreset === "LAST_30_DAYS") { const d = new Date(); d.setDate(now.getDate() - 30); computedStart = d.toISOString().split("T")[0]; }
      else if (datePreset === "LAST_90_DAYS") { const d = new Date(); d.setDate(now.getDate() - 90); computedStart = d.toISOString().split("T")[0]; }
      if (computedStart) url += `&startDate=${computedStart}&endDate=${now.toISOString().split("T")[0]}`;
      const res = await fetch(url);
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAnalytics();
    
  }, []);

  useEffect(() => {
    if (mounted) fetchAnalytics();
    
  }, [selectedDept, selectedBranch, selectedCampaign, selectedRisk, datePreset]);

  const handleReset = () => {
    setSelectedDept("ALL"); setSelectedBranch("ALL"); setSelectedCampaign("ALL");
    setSelectedRisk("ALL"); setDatePreset("ALL_TIME");
  };

  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["Metric", "Value"];
    const rows = [
      ["Awareness score", `${data.metrics.avgScore}%`],
      ["Avoidance rate", `${data.metrics.campaignSuccessRate}%`],
      ["Active campaigns", `${data.metrics.activeCampaigns}`],
      ["Delivery rate", `${data.metrics.emailDeliveryRate}%`],
      ["Open rate", `${data.metrics.emailOpenRate}%`],
      ["Click rate", `${data.metrics.linkClickRate}%`],
      ["Submission rate", `${data.metrics.formInteractionRate}%`],
      ["Training completion", `${data.metrics.trainingCompletionRate}%`],
      ["Total employees", `${data.metrics.totalEmployees}`],
      ["High risk", `${data.metrics.highRiskEmployees}`],
      ["Medium risk", `${data.metrics.mediumRiskEmployees}`],
      ["Low risk", `${data.metrics.lowRiskEmployees}`],
    ];
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `pinkman_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Analytics"
        description="The full behavioral picture — awareness trends, campaign funnels, and where to focus next."
        actions={
          <Button variant="secondary" icon={<FileSpreadsheet size={15} />} disabled={loading || !data} onClick={handleExportCSV}>
            Export CSV
          </Button>
        }
      />

      {}
      <Card pad="md" className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Segmented value={datePreset} onChange={setDatePreset} options={datePresets} layoutId="datePreset" />
          <div className="flex flex-wrap items-center gap-2.5">
            <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-auto">
              <option value="ALL">All branches</option>
              {data?.filters.branches.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="w-auto">
              <option value="ALL">All departments</option>
              {data?.filters.departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)} className="w-auto">
              <option value="ALL">All campaigns</option>
              {data?.filters.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="w-auto">
              <option value="ALL">All risk</option>
              {data?.filters.riskLevels.map((r) => <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>)}
            </Select>
            <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : !data ? (
        <ErrorState
          icon={<AlertTriangle size={20} />}
          title="Analytics couldn't load"
          description="The aggregation service didn't respond. Adjust filters or check the database, then retry."
          action={<Button variant="secondary" onClick={fetchAnalytics}>Retry</Button>}
        />
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Awareness score" value={<Counter value={data.metrics.avgScore} suffix="%" />} delta={{ value: `+${data.insights.awarenessImprovement}%`, positive: true }} hint="growth" icon={<ShieldCheck size={17} />} />
            <StatCard label="Avoidance rate" value={<Counter value={data.metrics.campaignSuccessRate} suffix="%" />} hint="bypassed the lure" icon={<ShieldOff size={17} />} />
            <StatCard label="Training completion" value={<Counter value={data.metrics.trainingCompletionRate} suffix="%" />} hint="of assigned modules" icon={<GraduationCap size={17} />} />
            <StatCard label="People monitored" value={<Counter value={data.metrics.totalEmployees} />} hint="active accounts" icon={<Users size={17} />} />
          </div>

          {}
          <Card pad="md">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
              {[
                ["Active drills", `${data.metrics.activeCampaigns}`],
                ["Delivery", `${data.metrics.emailDeliveryRate}%`],
                ["Open", `${data.metrics.emailOpenRate}%`],
                ["Click", `${data.metrics.linkClickRate}%`],
                ["Submission", `${data.metrics.formInteractionRate}%`],
                ["High risk", `${data.metrics.highRiskEmployees}`],
                ["Medium risk", `${data.metrics.mediumRiskEmployees}`],
                ["Low risk", `${data.metrics.lowRiskEmployees}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[12px] text-ink-faint">{label}</p>
                  <p className="tnum mt-1 text-[18px] font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {}
          <Card pad="lg">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent" />
              <h3 className="text-[15px] font-semibold text-ink">What the data is telling you</h3>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Insight label="Highest-risk team" value={`${data.insights.highestRiskDepartment}`} tone="danger" note="Lowest awareness, highest click rate." />
              <Insight label="Top-performing branch" value={`${data.insights.bestPerformingBranch}`} tone="accent" note="Leading on engagement and scores." />
              <Insight label="Need a refresher" value={`${data.insights.employeesNeedingTraining} people`} tone="warn" note="Scoring under 70% or flagged high-risk." />
              <Insight label="Latest campaign" value={data.insights.recentCampaignSummary} tone="neutral" />
            </div>
          </Card>

          {}
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div variants={rise} className="lg:col-span-2">
              <Card pad="lg">
                <CardHeader title="Awareness growth" description="Average security awareness over six months." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.monthlyAwarenessGrowth} margin={{ left: -16, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartColors.grid} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis domain={[0, 100]} unit="%" {...axisProps} />
                      <Tooltip content={<ChartTooltip unit="%" />} />
                      <Area type="monotone" dataKey="score" name="Score" stroke={chartColors.accent} strokeWidth={2.25} fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={rise}>
              <Card pad="lg" className="flex h-full flex-col">
                <CardHeader title="Risk distribution" description="Employees by tier." />
                <div className="relative mt-2 flex h-52 items-center justify-center">
                  <div className="pointer-events-none absolute flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">Avg score</span>
                    <span className="tnum text-2xl font-semibold text-ink">{data.metrics.avgScore}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.charts.riskDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={76} paddingAngle={3} dataKey="value" stroke="none">
                        {data.charts.riskDistribution.map((_, i) => <Cell key={i} fill={riskColors[i] || chartColors.neutral} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip unit=" people" />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                  {[["Low", data.metrics.lowRiskEmployees, riskColors[0]], ["Medium", data.metrics.mediumRiskEmployees, riskColors[1]], ["High", data.metrics.highRiskEmployees, riskColors[2]]].map(([l, v, c]) => (
                    <div key={l as string}>
                      <span className="flex items-center justify-center gap-1.5 text-[12px] text-ink-faint">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: c as string }} /> {l}
                      </span>
                      <p className="tnum mt-0.5 text-[15px] font-semibold text-ink">{v as number}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {}
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={rise}>
              <Card pad="lg">
                <CardHeader title="Action funnel" description="Delivered → opened → clicked → submitted." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.campaignFunnel} layout="vertical" margin={{ left: 8, right: 20 }}>
                      <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                      <XAxis type="number" {...axisProps} />
                      <YAxis dataKey="stage" type="category" width={92} {...axisProps} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip />} />
                      <Bar dataKey="count" name="People" radius={[0, 5, 5, 0]} barSize={20}>
                        {data.charts.campaignFunnel.map((_, i) => <Cell key={i} fill={i < 2 ? "#52525b" : i === 2 ? chartColors.accentDim : chartColors.accent} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={rise}>
              <Card pad="lg">
                <CardHeader title="Campaign performance" description="Avoidance vs. clicks per campaign." />
                <div className="mt-6 h-72">
                  {data.charts.campaignPerformanceTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.charts.campaignPerformanceTrend} margin={{ left: -16, right: 8, top: 8 }}>
                        <CartesianGrid stroke={chartColors.grid} />
                        <XAxis dataKey="name" {...axisProps} />
                        <YAxis domain={[0, 100]} unit="%" {...axisProps} />
                        <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit="%" />} />
                        <Legend iconType="circle" formatter={(v) => <span className="text-[12px] text-ink-soft">{v}</span>} />
                        <Bar dataKey="successRate" name="Avoided" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="clickRate" name="Clicked" fill="#f06b6b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[13px] text-ink-faint">No campaign data yet.</div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {}
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div variants={rise} className="lg:col-span-2">
              <Card pad="lg">
                <CardHeader title="Engagement over time" description="Monthly opens, clicks, and submissions." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.charts.employeeEngagementTrend} margin={{ left: -16, right: 8, top: 8 }}>
                      <CartesianGrid stroke={chartColors.grid} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis {...axisProps} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend iconType="circle" formatter={(v) => <span className="text-[12px] text-ink-soft">{v}</span>} />
                      <Line type="monotone" dataKey="opens" name="Opens" stroke="#8a8a93" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="clicks" name="Clicks" stroke="#f0b86b" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="submissions" name="Submissions" stroke={chartColors.accent} strokeWidth={2.25} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={rise}>
              <Card pad="lg">
                <CardHeader title="Compliance trend" description="Share of compliant users." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.monthlyComplianceTrend} margin={{ left: -16, right: 8, top: 8 }}>
                      <defs>
                        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.22} />
                          <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={chartColors.grid} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis domain={[0, 100]} unit="%" {...axisProps} />
                      <Tooltip content={<ChartTooltip unit="%" />} />
                      <Area type="monotone" dataKey="complianceRate" name="Compliance" stroke={chartColors.accent} strokeWidth={2.25} fill="url(#g2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {}
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div variants={rise}>
              <Card pad="lg">
                <CardHeader title="By department" description="Awareness vs. click rate." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.departmentComparison} margin={{ left: -16, right: 8, top: 8 }}>
                      <CartesianGrid stroke={chartColors.grid} />
                      <XAxis dataKey="name" {...axisProps} />
                      <YAxis domain={[0, 100]} unit="%" {...axisProps} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit="%" />} />
                      <Legend iconType="circle" formatter={(v) => <span className="text-[12px] text-ink-soft">{v}</span>} />
                      <Bar dataKey="awarenessScore" name="Awareness" fill="#8a8a93" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clickRate" name="Click rate" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={rise}>
              <Card pad="lg">
                <CardHeader title="By branch" description="Office posture ranked." />
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.branchComparison} layout="vertical" margin={{ left: 8, right: 20 }}>
                      <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                      <XAxis type="number" {...axisProps} />
                      <YAxis dataKey="name" type="category" width={72} {...axisProps} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit="%" />} />
                      <Legend iconType="circle" formatter={(v) => <span className="text-[12px] text-ink-soft">{v}</span>} />
                      <Bar dataKey="awarenessScore" name="Awareness" fill="#8a8a93" radius={[0, 4, 4, 0]} barSize={9} />
                      <Bar dataKey="clickRate" name="Click rate" fill={chartColors.accent} radius={[0, 4, 4, 0]} barSize={9} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {}
          <motion.div variants={rise}>
            <Card pad="lg">
              <CardHeader title="Company security score" description="The overall safety index over time." />
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.charts.securityScoreTrend} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid stroke={chartColors.grid} />
                    <XAxis dataKey="name" {...axisProps} />
                    <YAxis domain={[0, 100]} {...axisProps} />
                    <Tooltip content={<ChartTooltip unit="%" />} />
                    <Line type="monotone" dataKey="score" name="Security score" stroke={chartColors.accent} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0, fill: chartColors.accent }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Insight({ label, value, note, tone }: { label: string; value: string; note?: string; tone: "danger" | "accent" | "warn" | "neutral" }) {
  const dot = tone === "danger" ? "bg-danger" : tone === "accent" ? "bg-accent" : tone === "warn" ? "bg-warn" : "bg-ink-soft";
  return (
    <div className="rounded-[12px] border border-line bg-inset p-4">
      <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">
        <span className={"h-1.5 w-1.5 rounded-full " + dot} /> {label}
      </p>
      <p className="mt-1.5 text-[14px] font-semibold leading-snug text-ink">{value}</p>
      {note && <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{note}</p>}
    </div>
  );
}
