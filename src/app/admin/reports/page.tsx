"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FileText, Download, Sparkles, AlertTriangle, CheckCircle2, ShieldAlert,
  Clock, Plus, ArrowRight, FileSpreadsheet, Printer, Mail, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select, Field } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { ChartTooltip, chartColors, axisProps } from "@/components/ui/Chart";

interface Stats {
  avgAwarenessScore: number; totalEmployees: number; activeCampaigns: number;
  completedCampaigns: number; highRiskEmployees: number; trainingCompletionRate: number;
  phishingRates: { delivered: number; opened: number; clicked: number; submitted: number; openRate: number; clickRate: number; submitRate: number };
}
interface BranchStat { name: string; employeesCount: number; averageScore: number; clickRate: number; trainingCompletionRate: number; }
interface DepartmentStat { name: string; employeesCount: number; averageScore: number; clickRate: number; trainingCompletionRate: number; }
interface PendingEmployee { id: string; name: string; email: string; department: string; branch: string; score: number; completedCount: number; pendingCount: number; }
interface HighRiskEmployee { id: string; name: string; email: string; department: string; branch: string; score: number; }
interface AIInsights { highestRiskBranch: string; mostImprovedDept: string; requiresImmediateTraining: Array<{ name: string; email: string; score: number }>; campaignEffectivenessSummary: string; monthlyRecommendations: string[]; }
interface Schedule { id: string; title: string; category: string; frequency: string; targetEmails: string; active: boolean; createdAt: string; }
interface HistoryItem { id: string; title: string; category: string; format: string; creator: string; timestamp: string; status: string; }
interface DropdownItem { id: string; name: string; }

const categories = [
  "Executive Summary", "Campaign Performance", "Employee Awareness", "Department Performance",
  "Branch Performance", "Learning Progress", "Risk Assessment", "Compliance Status",
];
const BRANCHES = ["Pune", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata"];
const DEPTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations"];

const scoreTone = (s: number) => (s >= 80 ? "accent" : s >= 60 ? "warn" : "danger") as "accent" | "warn" | "danger";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState("Pinkman Protects");
  const [stats, setStats] = useState<Stats | null>(null);
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [highRiskEmployees, setHighRiskEmployees] = useState<HighRiskEmployee[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [campaignList, setCampaignList] = useState<DropdownItem[]>([]);
  const [employeeList, setEmployeeList] = useState<DropdownItem[]>([]);

  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [activeCategory, setActiveCategory] = useState<string>("Executive Summary");

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleCategory, setScheduleCategory] = useState("Compliance Status");
  const [scheduleFrequency, setScheduleFrequency] = useState("Monthly");
  const [scheduleEmail, setScheduleEmail] = useState("");

  const loadReportData = () => {
    setLoading(true);
    const query = new URLSearchParams({ branch: selectedBranch, department: selectedDept, campaign: selectedCampaign, employee: selectedEmployee, riskLevel: selectedRisk }).toString();
    fetch(`/api/admin/reports?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.orgName) setOrgName(data.orgName);
        if (data.branchStats) setBranchStats(data.branchStats);
        if (data.departmentStats) setDepartmentStats(data.departmentStats);
        if (data.pendingEmployees) setPendingEmployees(data.pendingEmployees);
        if (data.highRiskEmployees) setHighRiskEmployees(data.highRiskEmployees);
        if (data.aiInsights) setAIInsights(data.aiInsights);
        if (data.schedules) setSchedules(data.schedules);
        if (data.history) setHistory(data.history);
        if (data.allCampaignsSummary) setCampaignList(data.allCampaignsSummary);
        if (data.allEmployeesSummary) setEmployeeList(data.allEmployeesSummary);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => {
    loadReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch, selectedDept, selectedCampaign, selectedEmployee, selectedRisk]);

  const handleExport = async (format: "csv" | "excel") => {
    const query = new URLSearchParams({ branch: selectedBranch, department: selectedDept, campaign: selectedCampaign, employee: selectedEmployee, riskLevel: selectedRisk, format }).toString();
    await fetch("/api/admin/reports", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType: "history", title: `${activeCategory} Export (${format.toUpperCase()})`, category: activeCategory, format: format === "csv" ? "CSV" : "Excel", creator: "Amit Sharma (SecOps)" }),
    });
    window.open(`/api/admin/reports/export?${query}`);
    loadReportData();
  };

  const handlePrint = async () => {
    await fetch("/api/admin/reports", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType: "history", title: `${activeCategory} Print PDF`, category: activeCategory, format: "PDF", creator: "Amit Sharma (SecOps)" }),
    });
    window.print();
    loadReportData();
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle || !scheduleEmail) return;
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType: "schedule", title: scheduleTitle, category: scheduleCategory, frequency: scheduleFrequency, targetEmails: scheduleEmail }),
      });
      if (res.ok) { setScheduleModalOpen(false); setScheduleTitle(""); setScheduleEmail(""); loadReportData(); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="print:bg-white print:text-black">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Operations"
          title="Reports & compliance"
          description="Generate audit-ready reports, export them, and schedule recurring deliveries to the right people."
          actions={
            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setScheduleModalOpen(true)}>Schedule</Button>
              <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => handleExport("csv")}>CSV</Button>
              <Button variant="secondary" size="sm" icon={<FileSpreadsheet size={14} />} onClick={() => handleExport("excel")}>Excel</Button>
              <Button variant="primary" size="sm" icon={<Printer size={14} />} onClick={handlePrint}>Print</Button>
            </div>
          }
        />
      </div>

      {/* Print header */}
      <div className="hidden print:block border-b border-black/10 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-black">Pinkman Protects — {activeCategory}</h1>
        <p className="text-xs text-gray-600 mt-1">{orgName} · Generated {new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}</p>
      </div>

      {/* Filters */}
      <Card pad="md" className="mb-6 print:hidden">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Field label="Branch"><Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}><option value="All">All</option>{BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}</Select></Field>
          <Field label="Department"><Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}><option value="All">All</option>{DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
          <Field label="Campaign"><Select value={selectedCampaign} onChange={(e) => setSelectedCampaign(e.target.value)}><option value="All">All</option>{campaignList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
          <Field label="Person"><Select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}><option value="All">All</option>{employeeList.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</Select></Field>
          <Field label="Risk"><Select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)}><option value="All">All</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></Select></Field>
        </div>
      </Card>

      {/* KPIs */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 print:grid-cols-3">
          <KpiTile label="Awareness" value={`${stats.avgAwarenessScore}%`} bar={stats.avgAwarenessScore} />
          <KpiTile label="People" value={`${stats.totalEmployees}`} />
          <KpiTile label="Active" value={`${stats.activeCampaigns}`} />
          <KpiTile label="Completed" value={`${stats.completedCampaigns}`} />
          <KpiTile label="High risk" value={`${stats.highRiskEmployees}`} tone={stats.highRiskEmployees > 0 ? "danger" : "accent"} />
          <KpiTile label="Training" value={`${stats.trainingCompletionRate}%`} bar={stats.trainingCompletionRate} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Category nav */}
        <div className="lg:col-span-3 print:hidden">
          <p className="eyebrow mb-3">Report types</p>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "focus-ring flex w-full items-center justify-between rounded-[10px] border px-3.5 py-2.5 text-left text-[13.5px] transition-colors",
                  activeCategory === cat
                    ? "border-line-strong bg-inset font-medium text-ink"
                    : "border-transparent text-ink-soft hover:bg-white/[0.02] hover:text-ink"
                )}
              >
                <span className="flex items-center gap-2.5"><FileText size={15} className={activeCategory === cat ? "text-accent" : "text-ink-faint"} /> {cat}</span>
                <ChevronRight size={15} className={activeCategory === cat ? "text-accent" : "text-ink-faint"} />
              </button>
            ))}
          </div>
        </div>

        {/* Content pane */}
        <div className="lg:col-span-9 print:col-span-12">
          <Card pad="lg" className="print:border-0 print:bg-white print:p-0">
            <div className="mb-5 flex items-center justify-between border-b border-line pb-4 print:border-black/10">
              <div>
                <Badge tone="muted">Audit report</Badge>
                <h2 className="mt-1.5 text-[19px] font-semibold tracking-[-0.01em] text-ink print:text-black">{activeCategory}</h2>
              </div>
              <span className="font-mono text-[12px] text-ink-faint">PR-{activeCategory.slice(0, 4).toUpperCase()}</span>
            </div>

            {/* Executive Summary */}
            {activeCategory === "Executive Summary" && (
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <Card pad="md">
                    <p className="eyebrow mb-3">Branch compliance index</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={branchStats.slice(0, 5)} margin={{ left: -20, top: 6 }}>
                          <CartesianGrid stroke={chartColors.grid} />
                          <XAxis dataKey="name" {...axisProps} fontSize={10} />
                          <YAxis {...axisProps} fontSize={10} />
                          <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit="%" />} />
                          <Bar dataKey="averageScore" name="Score" fill="#8a8a93" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  <Card pad="md">
                    <p className="eyebrow mb-3">Department awareness</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentStats.slice(0, 5)} margin={{ left: -20, top: 6 }}>
                          <CartesianGrid stroke={chartColors.grid} />
                          <XAxis dataKey="name" {...axisProps} fontSize={10} />
                          <YAxis {...axisProps} fontSize={10} />
                          <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltip unit="%" />} />
                          <Bar dataKey="averageScore" name="Score" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>

                {aiInsights && (
                  <Card pad="lg">
                    <div className="flex items-center gap-2"><Sparkles size={16} className="text-accent" /><h3 className="text-[15px] font-semibold text-ink">Intelligence summary</h3></div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-[12px] border border-line bg-inset p-3.5">
                        <p className="text-[12px] text-ink-faint">Highest-risk branch</p>
                        <p className="mt-1 text-[14px] font-semibold text-ink">{aiInsights.highestRiskBranch}</p>
                      </div>
                      <div className="rounded-[12px] border border-line bg-inset p-3.5">
                        <p className="text-[12px] text-ink-faint">Leading on training</p>
                        <p className="mt-1 flex items-center gap-1.5 text-[14px] font-semibold text-ink"><CheckCircle2 size={14} className="text-accent" /> {aiInsights.mostImprovedDept}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{aiInsights.campaignEffectivenessSummary}</p>
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="eyebrow mb-3">Recommended actions</p>
                      <ul className="space-y-2.5">
                        {aiInsights.monthlyRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13.5px] text-ink-soft"><ArrowRight size={14} className="mt-0.5 shrink-0 text-accent" /><span>{rec}</span></li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Campaign Performance */}
            {activeCategory === "Campaign Performance" && stats && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <MiniStat label="Delivered" value={`${stats.phishingRates.delivered}`} />
                  <MiniStat label="Open rate" value={`${stats.phishingRates.openRate}%`} />
                  <MiniStat label="Click rate" value={`${stats.phishingRates.clickRate}%`} tone="warn" />
                  <MiniStat label="Submit rate" value={`${stats.phishingRates.submitRate}%`} tone="danger" />
                </div>
                <Table>
                  <THead><TH>Metric</TH><TH>Logs</TH><TH>Indicator</TH><TH>SLA</TH></THead>
                  <TBody>
                    <TR><TD className="font-medium text-ink">Delivered</TD><TD>{stats.phishingRates.delivered}</TD><TD className="text-accent">100% delivery</TD><TD className="text-ink-faint">&gt; 99%</TD></TR>
                    <TR><TD className="font-medium text-ink">Opened</TD><TD>{stats.phishingRates.opened}</TD><TD>{stats.phishingRates.openRate}% open</TD><TD className="text-ink-faint">No limit</TD></TR>
                    <TR><TD className="font-medium text-ink">Clicked</TD><TD>{stats.phishingRates.clicked}</TD><TD className={stats.phishingRates.clickRate < 10 ? "text-accent" : "text-warn"}>{stats.phishingRates.clickRate}% click</TD><TD className="text-ink-faint">&lt; 5%</TD></TR>
                    <TR><TD className="font-medium text-ink">Submitted</TD><TD>{stats.phishingRates.submitted}</TD><TD>{stats.phishingRates.submitRate}% compromise</TD><TD className="text-ink-faint">0%</TD></TR>
                  </TBody>
                </Table>
              </div>
            )}

            {/* Employee Awareness */}
            {activeCategory === "Employee Awareness" && (
              <Table>
                <THead><TH>Name</TH><TH>Email</TH><TH>Department</TH><TH>Branch</TH><TH align="center">Score</TH><TH align="center">Risk</TH></THead>
                <TBody>
                  {pendingEmployees.map((e) => (
                    <TR key={e.id}>
                      <TD className="font-medium text-ink">{e.name}</TD><TD>{e.email}</TD><TD>{e.department}</TD><TD>{e.branch}</TD>
                      <TD align="center" className="tnum">{e.score}%</TD>
                      <TD align="center"><Badge tone={scoreTone(e.score)}>{e.score >= 80 ? "low" : e.score >= 60 ? "medium" : "high"}</Badge></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {/* Department Performance */}
            {activeCategory === "Department Performance" && (
              <Table>
                <THead><TH>Department</TH><TH align="center">People</TH><TH align="center">Score</TH><TH align="center">Click rate</TH><TH align="center">Training</TH></THead>
                <TBody>
                  {departmentStats.map((d, i) => (
                    <TR key={i}>
                      <TD className="font-medium text-ink">{d.name}</TD><TD align="center">{d.employeesCount}</TD>
                      <TD align="center" className="tnum text-ink">{d.averageScore}%</TD><TD align="center" className="text-warn">{d.clickRate}%</TD><TD align="center" className="text-accent">{d.trainingCompletionRate}%</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {/* Branch Performance */}
            {activeCategory === "Branch Performance" && (
              <Table>
                <THead><TH>Branch</TH><TH align="center">People</TH><TH align="center">Score</TH><TH align="center">Click rate</TH><TH align="center">Training</TH></THead>
                <TBody>
                  {branchStats.map((b, i) => (
                    <TR key={i}>
                      <TD className="font-medium text-ink">{b.name}</TD><TD align="center">{b.employeesCount}</TD>
                      <TD align="center" className="tnum text-ink">{b.averageScore}%</TD><TD align="center" className="text-warn">{b.clickRate}%</TD><TD align="center" className="text-accent">{b.trainingCompletionRate}%</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {/* Learning Progress */}
            {activeCategory === "Learning Progress" && (
              <Table>
                <THead><TH>Name</TH><TH>Email</TH><TH>Department</TH><TH align="center">Done</TH><TH align="center">Pending</TH><TH align="center">Status</TH></THead>
                <TBody>
                  {pendingEmployees.map((e) => (
                    <TR key={e.id}>
                      <TD className="font-medium text-ink">{e.name}</TD><TD>{e.email}</TD><TD>{e.department}</TD>
                      <TD align="center" className="text-accent">{e.completedCount}</TD><TD align="center" className="text-warn">{e.pendingCount}</TD>
                      <TD align="center"><Badge tone="warn">pending</Badge></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {/* Risk Assessment */}
            {activeCategory === "Risk Assessment" && (
              <div className="space-y-5">
                <div className="rounded-[12px] border border-danger/30 bg-danger-faint/30 p-4">
                  <p className="flex items-center gap-2 text-[14px] font-semibold text-ink"><AlertTriangle size={15} className="text-danger" /> Critical vulnerability check</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    <span className="font-semibold text-danger">{highRiskEmployees.length} people</span> are high-risk (awareness under 60%). Clicks correlate with skipped verification on mock financial alerts.
                  </p>
                </div>
                <Table>
                  <THead><TH>Name</TH><TH>Email</TH><TH>Department</TH><TH>Branch</TH><TH align="center">Score</TH></THead>
                  <TBody>
                    {highRiskEmployees.map((e) => (
                      <TR key={e.id}><TD className="font-medium text-ink">{e.name}</TD><TD>{e.email}</TD><TD>{e.department}</TD><TD>{e.branch}</TD><TD align="center" className="text-danger">{e.score}%</TD></TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            )}

            {/* Compliance Status */}
            {activeCategory === "Compliance Status" && stats && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Training complete" value={`${stats.trainingCompletionRate}%`} tone="accent" />
                  <MiniStat label="Avg click rate" value={`${stats.phishingRates.clickRate}%`} tone="warn" />
                  <MiniStat label="Audit status" value={stats.phishingRates.clickRate <= 5 ? "Excellent" : "Warning"} tone={stats.phishingRates.clickRate <= 5 ? "accent" : "warn"} />
                </div>
                <Card pad="none">
                  <CheckRow ok={stats.trainingCompletionRate >= 90} label="Training completion ≥ 90%" value={`${stats.trainingCompletionRate}%`} />
                  <CheckRow ok={stats.phishingRates.clickRate < 5} label="Click-through rate < 5%" value={`${stats.phishingRates.clickRate}%`} />
                  <CheckRow ok={stats.phishingRates.submitted === 0} label="Zero credential submissions" value={`${stats.phishingRates.submitted} logs`} />
                </Card>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Schedules + history */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 print:hidden">
        <Card pad="lg">
          <CardHeader title="Scheduled reports" description="Recurring deliveries." />
          <div className="mt-4 max-h-64 space-y-2.5 overflow-y-auto">
            {schedules.length === 0 ? <p className="py-8 text-center text-[13px] text-ink-faint">No schedules yet.</p> :
              schedules.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-inset p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-ink">{s.title}</p>
                    <p className="mt-0.5 flex items-center gap-3 text-[12px] text-ink-faint"><span className="flex items-center gap-1"><Clock size={11} /> {s.frequency}</span><span className="flex items-center gap-1 truncate"><Mail size={11} /> {s.targetEmails}</span></p>
                  </div>
                  <Badge tone="accent" dot>active</Badge>
                </div>
              ))}
          </div>
        </Card>
        <Card pad="lg">
          <CardHeader title="Recent exports" description="Generated reports." />
          <div className="mt-4 max-h-64 space-y-2.5 overflow-y-auto">
            {history.length === 0 ? <p className="py-8 text-center text-[13px] text-ink-faint">Nothing exported yet.</p> :
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-inset p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[12px] text-ink-faint">{item.creator} · {new Date(item.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0]}</p>
                  </div>
                  <Badge tone="muted">{item.format}</Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Schedule modal */}
      <Modal open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} size="md">
        <ModalHeader title="Schedule a report" description="We'll deliver it on a recurring basis." icon={<Clock size={17} />} onClose={() => setScheduleModalOpen(false)} />
        <form onSubmit={handleScheduleSubmit}>
          <ModalBody className="space-y-4">
            <Field label="Title"><Input required placeholder="Finance compliance audit" value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} /></Field>
            <Field label="Category"><Select value={scheduleCategory} onChange={(e) => setScheduleCategory(e.target.value)}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Frequency"><Select value={scheduleFrequency} onChange={(e) => setScheduleFrequency(e.target.value)}><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option></Select></Field>
              <Field label="Send to"><Input type="email" required placeholder="manager@company.com" value={scheduleEmail} onChange={(e) => setScheduleEmail(e.target.value)} /></Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => setScheduleModalOpen(false)} className="ml-auto">Cancel</Button>
            <Button type="submit" variant="primary">Create schedule</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

function KpiTile({ label, value, bar, tone }: { label: string; value: string; bar?: number; tone?: "accent" | "danger" }) {
  return (
    <Card pad="md" className="print:border-black/10">
      <p className="text-[12px] text-ink-faint print:text-gray-500">{label}</p>
      <p className={cn("tnum mt-1.5 text-[24px] font-semibold tracking-[-0.02em] print:text-black", tone === "danger" ? "text-danger" : tone === "accent" ? "text-accent" : "text-ink")}>{value}</p>
      {typeof bar === "number" && (
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-inset">
          <div className="h-full bg-accent" style={{ width: `${bar}%` }} />
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "accent" | "warn" | "danger" }) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-4 text-center">
      <p className="text-[12px] text-ink-faint">{label}</p>
      <p className={cn("mt-1 text-[18px] font-semibold", tone === "warn" ? "text-warn" : tone === "danger" ? "text-danger" : tone === "accent" ? "text-accent" : "text-ink")}>{value}</p>
    </div>
  );
}

function CheckRow({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-3.5 last:border-0">
      <span className="text-[13.5px] text-ink-soft">{label}</span>
      <Badge tone={ok ? "accent" : "danger"}>{ok ? "Passed" : "Action needed"} · {value}</Badge>
    </div>
  );
}
