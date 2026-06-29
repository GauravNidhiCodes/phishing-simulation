"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Globe, Plus, X, Search, Copy, Check, MapPin, Building2,
  Calendar, ShieldCheck, ShieldAlert, Award, BookOpen, TrendingUp,
  ChevronRight, RefreshCw, CheckCircle2,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn, initials, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select, Field } from "@/components/ui/Input";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { ChartTooltip, chartColors, axisProps } from "@/components/ui/Chart";

interface Employee {
  id: string; name: string | null; email: string;
  department: string | null; branch: string | null; managerName: string | null;
  joiningDate: string | null; awarenessScore: number; riskCategory: "LOW" | "MEDIUM" | "HIGH";
}
interface Domain { id: string; domain: string; txtRecordKey: string; isVerified: boolean; }
interface SimulationLog {
  id: string; campaign: { name: string; template: { name: string; subject: string } };
  deliveredAt: string | null; openedAt: string | null; clickedAt: string | null; submittedAt: string | null;
}
interface QuizProgress { id: string; completed: boolean; score: number; updatedAt: string; module: { id: string; title: string; description: string }; }
interface TrainingModule { id: string; title: string; description: string; }

const INDIAN_BRANCHES = ["Pune", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata"];
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations", "IT Support"];

const riskTone = (r: string) => (r === "LOW" ? "accent" : r === "MEDIUM" ? "warn" : "danger") as "accent" | "warn" | "danger";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<{
    employee: Employee; campaignLogs: SimulationLog[]; quizProgress: QuizProgress[]; allModules: TrainingModule[];
  } | null>(null);

  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empDept, setEmpDept] = useState("Engineering");
  const [empBranch, setEmpBranch] = useState("Bengaluru");
  const [empManager, setEmpManager] = useState("Rahul Sharma");
  const [addEmpError, setAddEmpError] = useState("");
  const [addingEmp, setAddingEmp] = useState(false);
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);

  const [newDomain, setNewDomain] = useState("");
  const [addDomainError, setAddDomainError] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [addDomainModalOpen, setAddDomainModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = () => {
    fetch("/api/admin/employees")
      .then((res) => res.json())
      .then((data) => {
        if (data.employees) setEmployees(data.employees);
        if (data.domains) setDomains(data.domains);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedEmpId) { setEmployeeProfile(null); return; }
    setProfileLoading(true);
    fetch(`/api/admin/employees?id=${selectedEmpId}`)
      .then((res) => res.json())
      .then((data) => { if (!data.error) setEmployeeProfile(data); setProfileLoading(false); })
      .catch((err) => { console.error(err); setProfileLoading(false); });
  }, [selectedEmpId]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim()) return;
    setAddingEmp(true); setAddEmpError("");
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_EMPLOYEE", name: empName, email: empEmail, department: empDept, branch: empBranch, managerName: empManager }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to add employee"); }
      setEmpName(""); setEmpEmail(""); setEmpDept("Engineering"); setEmpBranch("Bengaluru"); setEmpManager("Rahul Sharma");
      setAddEmpModalOpen(false); loadData();
    } catch (err: any) { setAddEmpError(err.message); } finally { setAddingEmp(false); }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setAddingDomain(true); setAddDomainError("");
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_DOMAIN", domain: newDomain }),
      });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to add domain"); }
      setNewDomain(""); setAddDomainModalOpen(false); loadData();
    } catch (err: any) { setAddDomainError(err.message); } finally { setAddingDomain(false); }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const res = await fetch("/api/admin/employees", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId }),
      });
      if (res.ok) loadData();
    } catch (err) { console.error(err); }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = !searchQuery.trim() ||
        (emp.name && emp.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBranch = branchFilter === "ALL" || emp.branch === branchFilter;
      const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
      const matchesRisk = riskFilter === "ALL" || emp.riskCategory === riskFilter;
      return matchesSearch && matchesBranch && matchesDept && matchesRisk;
    });
  }, [employees, searchQuery, branchFilter, deptFilter, riskFilter]);

  const employeeBadges = useMemo(() => {
    if (!employeeProfile) return [];
    const badges = [];
    const { employee, campaignLogs, quizProgress } = employeeProfile;
    if (employee.awarenessScore === 100) badges.push({ id: "sentinel", name: "Sentinel Shield", desc: "A perfect 100% awareness rating.", icon: <Award size={15} className="text-accent" /> });
    const hasClicks = campaignLogs.some((l) => l.clickedAt || l.submittedAt);
    if (campaignLogs.length > 0 && !hasClicks) badges.push({ id: "clean", name: "Clean Record", desc: "Never clicked a simulated lure.", icon: <ShieldCheck size={15} className="text-accent" /> });
    const hasFailures = campaignLogs.some((l) => l.submittedAt);
    if (campaignLogs.length >= 2 && !hasFailures) badges.push({ id: "champion", name: "Always Vigilant", desc: "Spots phishing every time.", icon: <ShieldCheck size={15} className="text-accent" /> });
    const completed = quizProgress.filter((p) => p.completed).length;
    if (completed >= 2) badges.push({ id: "master", name: "Training Complete", desc: "Finished the assigned curriculum.", icon: <BookOpen size={15} className="text-accent" /> });
    return badges;
  }, [employeeProfile]);

  const employeeTrendData = useMemo(() => {
    if (!employeeProfile) return [];
    const b = employeeProfile.employee.awarenessScore;
    return [
      { name: "Jan", Score: Math.min(100, Math.max(0, b - 12)) },
      { name: "Feb", Score: Math.min(100, Math.max(0, b - 8)) },
      { name: "Mar", Score: Math.min(100, Math.max(0, b - 5)) },
      { name: "Apr", Score: Math.min(100, Math.max(0, b - 2)) },
      { name: "May", Score: b },
    ];
  }, [employeeProfile]);

  const recommendedModules = useMemo(() => {
    if (!employeeProfile) return [];
    const done = employeeProfile.quizProgress.filter((p) => p.completed).map((p) => p.module.id);
    return employeeProfile.allModules.filter((m) => !done.includes(m.id));
  }, [employeeProfile]);

  const lastSimulationResult = useMemo(() => {
    if (!employeeProfile || employeeProfile.campaignLogs.length === 0) return "No simulations yet";
    const log = employeeProfile.campaignLogs[0];
    if (log.submittedAt) return "Submitted credentials";
    if (log.clickedAt) return "Clicked link";
    if (log.openedAt) return "Opened email";
    return "Stayed safe";
  }, [employeeProfile]);

  if (loading) return <LoadingState label="Loading your directory" sublabel="Fetching people and verified domains." />;

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="People & domains"
        description="Manage your roster, track awareness across branches, and authorize the domains we're allowed to send from."
        actions={
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" icon={<Globe size={15} />} onClick={() => setAddDomainModalOpen(true)}>Add domain</Button>
            <Button variant="primary" icon={<Plus size={15} />} onClick={() => setAddEmpModalOpen(true)}>Add person</Button>
          </div>
        }
      />

      {}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Globe size={16} className="text-ink-faint" />
          <h2 className="text-[15px] font-semibold text-ink">Authorized domains</h2>
        </div>
        <p className="mb-4 max-w-2xl text-[13px] text-ink-soft">
          Simulations only send to verified domains. Add a domain, drop the TXT record into your DNS, then verify.
        </p>
        {domains.length === 0 ? (
          <EmptyState icon={<Globe size={20} />} title="No domains yet" description="Add your first corporate domain to start running simulations." action={<Button variant="secondary" onClick={() => setAddDomainModalOpen(true)}>Add domain</Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domains.map((dom) => (
              <Card key={dom.id} pad="md" className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-ink">{dom.domain}</span>
                  {dom.isVerified ? <Badge tone="accent" dot>Verified</Badge> : <Badge tone="warn" dot>Pending</Badge>}
                </div>
                {!dom.isVerified && (
                  <>
                    <div className="rounded-[10px] border border-line bg-inset p-3">
                      <p className="mb-1.5 text-[11px] uppercase tracking-[0.06em] text-ink-faint">TXT record value</p>
                      <div className="flex items-center justify-between gap-2 rounded-[8px] border border-line bg-canvas px-2.5 py-2">
                        <code className="select-all break-all font-mono text-[11px] text-ink">{dom.txtRecordKey}</code>
                        <button onClick={() => copyKey(dom.txtRecordKey)} className="focus-ring shrink-0 rounded p-1 text-ink-faint transition-colors hover:text-ink" title="Copy">
                          {copiedKey === dom.txtRecordKey ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => handleVerifyDomain(dom.id)} className="w-full">Verify record</Button>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-ink-faint" />
            <h2 className="text-[15px] font-semibold text-ink">Roster</h2>
            <span className="text-[13px] text-ink-faint">{filteredEmployees.length} people</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Input icon={<Search size={15} />} placeholder="Search people" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-52" />
            <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="w-auto">
              <option value="ALL">All branches</option>
              {INDIAN_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
            <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="w-auto">
              <option value="ALL">All departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="w-auto">
              <option value="ALL">All risk</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
          </div>
        </div>

        <Card pad="none">
          {filteredEmployees.length === 0 ? (
            <EmptyState icon={<Search size={20} />} title="No matches" description="Try a different search or clear your filters." />
          ) : (
            <Table>
              <THead>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Department</TH>
                <TH>Branch</TH>
                <TH align="center">Awareness</TH>
                <TH align="center">Risk</TH>
                <TH align="right"> </TH>
              </THead>
              <TBody>
                {filteredEmployees.map((emp) => (
                  <TR key={emp.id} onClick={() => setSelectedEmpId(emp.id)}>
                    <TD>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-inset text-[11px] font-semibold text-ink-soft">{initials(emp.name)}</span>
                        <span className="font-medium text-ink">{emp.name || "Unnamed"}</span>
                      </div>
                    </TD>
                    <TD>{emp.email}</TD>
                    <TD>{emp.department || "—"}</TD>
                    <TD>{emp.branch || "—"}</TD>
                    <TD align="center">
                      <span className={cn("tnum font-medium", emp.awarenessScore >= 80 ? "text-accent" : emp.awarenessScore >= 60 ? "text-ink" : "text-warn")}>{emp.awarenessScore}%</span>
                    </TD>
                    <TD align="center"><Badge tone={riskTone(emp.riskCategory)}>{emp.riskCategory.toLowerCase()}</Badge></TD>
                    <TD align="right"><ChevronRight size={16} className="ml-auto text-ink-faint" /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Card>
      </section>

      {}
      <AnimatePresence>
        {selectedEmpId && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEmpId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-line bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <h3 className="text-[15px] font-semibold text-ink">Profile</h3>
                <button onClick={() => setSelectedEmpId(null)} className="focus-ring flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint transition-colors hover:bg-white/[0.05] hover:text-ink"><X size={18} /></button>
              </div>

              {profileLoading ? (
                <div className="flex flex-1 items-center justify-center"><LoadingState label="Loading profile" /></div>
              ) : employeeProfile ? (
                <div className="scrollbar-thin flex-1 space-y-6 overflow-y-auto p-6">
                  {}
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-line bg-inset text-[18px] font-semibold text-ink">{initials(employeeProfile.employee.name)}</span>
                    <div className="flex-1">
                      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">{employeeProfile.employee.name}</h2>
                      <p className="text-[13px] text-ink-soft">{employeeProfile.employee.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge tone={riskTone(employeeProfile.employee.riskCategory)}>{employeeProfile.employee.riskCategory.toLowerCase()} risk</Badge>
                        <span className={cn("tnum text-[13px] font-semibold", employeeProfile.employee.awarenessScore >= 80 ? "text-accent" : "text-ink")}>{employeeProfile.employee.awarenessScore}% aware</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-2 gap-3">
                    <MetaTile icon={<MapPin size={13} />} label="Branch" value={employeeProfile.employee.branch || "—"} />
                    <MetaTile icon={<Building2 size={13} />} label="Department" value={employeeProfile.employee.department || "—"} />
                    <MetaTile icon={<Users size={13} />} label="Manager" value={employeeProfile.employee.managerName || "—"} />
                    <MetaTile icon={<Calendar size={13} />} label="Joined" value={employeeProfile.employee.joiningDate ? formatDate(employeeProfile.employee.joiningDate) : "—"} />
                  </div>

                  {}
                  <Card pad="md">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp size={15} className="text-ink-faint" />
                      <h4 className="text-[14px] font-semibold text-ink">Awareness trend</h4>
                    </div>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={employeeTrendData} margin={{ left: -22, right: 5, top: 5 }}>
                          <defs>
                            <linearGradient id="empg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={chartColors.accent} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={chartColors.accent} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke={chartColors.grid} />
                          <XAxis dataKey="name" {...axisProps} fontSize={10} />
                          <YAxis domain={[0, 100]} {...axisProps} fontSize={10} />
                          <Tooltip content={<ChartTooltip unit="%" />} />
                          <Area type="monotone" dataKey="Score" stroke={chartColors.accent} strokeWidth={2} fill="url(#empg)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-ink"><Award size={15} className="text-ink-faint" /> Earned badges</h4>
                    {employeeBadges.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {employeeBadges.map((b) => (
                          <div key={b.id} className="flex items-start gap-3 rounded-[12px] border border-line bg-inset p-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-line bg-card">{b.icon}</span>
                            <div>
                              <p className="text-[13.5px] font-medium text-ink">{b.name}</p>
                              <p className="text-[12px] text-ink-soft">{b.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-[12px] border border-dashed border-line p-5 text-center text-[13px] text-ink-faint">No badges earned yet.</p>
                    )}
                  </div>

                  {}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="flex items-center gap-2 text-[14px] font-semibold text-ink"><ShieldAlert size={15} className="text-ink-faint" /> Simulation history</h4>
                      <span className="text-[12px] text-ink-faint">Last: <span className="text-ink-soft">{lastSimulationResult}</span></span>
                    </div>
                    <Card pad="none">
                      {employeeProfile.campaignLogs.length > 0 ? (
                        <div className="divide-y divide-line">
                          {employeeProfile.campaignLogs.map((log) => {
                            let outcome = "Delivered", tone: "accent" | "warn" | "danger" | "muted" = "muted";
                            if (log.submittedAt) { outcome = "Submitted"; tone = "danger"; }
                            else if (log.clickedAt) { outcome = "Clicked"; tone = "warn"; }
                            else if (log.openedAt) { outcome = "Opened"; tone = "muted"; }
                            else { outcome = "Safe"; tone = "accent"; }
                            return (
                              <div key={log.id} className="flex items-start justify-between gap-4 px-4 py-3">
                                <div className="min-w-0">
                                  <p className="truncate text-[13px] font-medium text-ink">{log.campaign.name}</p>
                                  <p className="truncate text-[12px] text-ink-soft">{log.campaign.template?.subject || "—"}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <Badge tone={tone}>{outcome}</Badge>
                                  <p className="mt-1 text-[11px] text-ink-faint">{log.deliveredAt ? formatDate(log.deliveredAt) : "—"}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="p-6 text-center text-[13px] text-ink-faint">No simulations recorded.</p>
                      )}
                    </Card>
                  </div>

                  {}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-ink"><CheckCircle2 size={15} className="text-accent" /> Completed</h4>
                      <Card pad="none" className="max-h-48 overflow-y-auto">
                        {employeeProfile.quizProgress.length > 0 ? (
                          <div className="divide-y divide-line">
                            {employeeProfile.quizProgress.map((p) => (
                              <div key={p.id} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
                                <p className="text-[12.5px] font-medium text-ink">{p.module.title}</p>
                                <span className="shrink-0 text-[12px] font-medium text-accent tnum">{p.score}%</span>
                              </div>
                            ))}
                          </div>
                        ) : <p className="p-5 text-center text-[12.5px] text-ink-faint">Nothing completed yet.</p>}
                      </Card>
                    </div>
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-ink"><BookOpen size={15} className="text-ink-faint" /> Recommended</h4>
                      <Card pad="none" className="max-h-48 overflow-y-auto">
                        {recommendedModules.length > 0 ? (
                          <div className="divide-y divide-line">
                            {recommendedModules.map((m) => (
                              <div key={m.id} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
                                <p className="text-[12.5px] text-ink-soft">{m.title}</p>
                                <Badge tone="muted">to do</Badge>
                              </div>
                            ))}
                          </div>
                        ) : <p className="p-5 text-center text-[12.5px] text-accent">All caught up.</p>}
                      </Card>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center text-[13px] text-ink-faint">Couldn&apos;t load this profile.</div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <Modal open={addEmpModalOpen} onClose={() => setAddEmpModalOpen(false)} size="md">
        <ModalHeader title="Add a person" description="They'll start at 100% awareness and low risk." icon={<Users size={17} />} onClose={() => setAddEmpModalOpen(false)} />
        <form onSubmit={handleAddEmployee}>
          <ModalBody className="space-y-4">
            {addEmpError && <div className="rounded-[10px] border border-danger/30 bg-danger-faint/40 px-3.5 py-2.5 text-[13px] text-ink">{addEmpError}</div>}
            <Field label="Full name"><Input required placeholder="Ananya Singh" value={empName} onChange={(e) => setEmpName(e.target.value)} /></Field>
            <Field label="Work email" hint="Must belong to a verified domain."><Input type="email" required placeholder="ananya@yourcompany.in" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department"><Select value={empDept} onChange={(e) => setEmpDept(e.target.value)}>{DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}</Select></Field>
              <Field label="Branch"><Select value={empBranch} onChange={(e) => setEmpBranch(e.target.value)}>{INDIAN_BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}</Select></Field>
            </div>
            <Field label="Manager"><Input required placeholder="Rahul Sharma" value={empManager} onChange={(e) => setEmpManager(e.target.value)} /></Field>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => setAddEmpModalOpen(false)} className="ml-auto">Cancel</Button>
            <Button type="submit" variant="primary" loading={addingEmp}>Add person</Button>
          </ModalFooter>
        </form>
      </Modal>

      {}
      <Modal open={addDomainModalOpen} onClose={() => setAddDomainModalOpen(false)} size="sm">
        <ModalHeader title="Add a domain" description="We'll generate a TXT record for you to verify." icon={<Globe size={17} />} onClose={() => setAddDomainModalOpen(false)} />
        <form onSubmit={handleAddDomain}>
          <ModalBody className="space-y-4">
            {addDomainError && <div className="rounded-[10px] border border-danger/30 bg-danger-faint/40 px-3.5 py-2.5 text-[13px] text-ink">{addDomainError}</div>}
            <Field label="Domain"><Input required placeholder="yourcompany.in" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} /></Field>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="ghost" onClick={() => setAddDomainModalOpen(false)} className="ml-auto">Cancel</Button>
            <Button type="submit" variant="primary" loading={addingDomain}>Add domain</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

function MetaTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-3.5">
      <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">{icon} {label}</p>
      <p className="mt-1 text-[13.5px] font-medium text-ink">{value}</p>
    </div>
  );
}
