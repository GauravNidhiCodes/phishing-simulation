"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Square,
  Search,
  Check,
  Calendar,
  Clock,
  Eye,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FolderOpen,
  Users2,
  Mail,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Field, Select, Textarea } from "@/components/ui/Input";
import { Modal, ModalHeader, ModalFooter } from "@/components/ui/Modal";
import { LoadingState } from "@/components/ui/States";

interface Campaign {
  id: string;
  name: string;
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "COMPLETED";
  template: { name: string; subject: string };
  scheduledStart: string | null;
  startedAt: string | null;
  completedAt: string | null;
  description?: string | null;
  category?: string | null;
  riskLevel?: string | null;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  indicators: string;
}

interface Employee {
  id: string;
  name: string | null;
  email: string;
  department: string | null;
  branch: string | null;
  riskCategory: string;
  awarenessScore: number;
}

const INDIAN_BRANCHES = ["Pune", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Chennai", "Kolkata"];
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "Operations", "IT Support"];
const CATEGORIES = ["Password Reset", "HR Notice", "IT Support", "Finance", "Compliance", "Festival Awareness"];

const LANES: { key: Campaign["status"]; label: string; tone: "accent" | "warn" | "neutral" | "muted" }[] = [
  { key: "ACTIVE", label: "Active", tone: "accent" },
  { key: "SCHEDULED", label: "Scheduled", tone: "warn" },
  { key: "DRAFT", label: "Drafts", tone: "muted" },
  { key: "COMPLETED", label: "Completed", tone: "neutral" },
];

const STEPS = [
  { num: 1, label: "Details", icon: FolderOpen },
  { num: 2, label: "Audience", icon: Users2 },
  { num: 3, label: "Scenario", icon: Mail },
  { num: 4, label: "Schedule", icon: Calendar },
  { num: 5, label: "Review", icon: ClipboardCheck },
];

const riskTone: Record<string, "accent" | "warn" | "danger"> = {
  LOW: "accent",
  MEDIUM: "warn",
  HIGH: "danger",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [createdCampaignDetails, setCreatedCampaignDetails] = useState<{
    id: string;
    name: string;
    scheduledTime: string;
    targetCount: number;
    category: string;
    riskLevel: string;
    templateName: string;
  } | null>(null);

  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [businessUnit, setBusinessUnit] = useState("IT");
  const [organizationName, setOrganizationName] = useState("");
  const [campaignCategory, setCampaignCategory] = useState("Password Reset");
  const [riskLevel, setRiskLevel] = useState("MEDIUM");

  const [selectedDeptFilters, setSelectedDeptFilters] = useState<string[]>([]);
  const [selectedBranchFilters, setSelectedBranchFilters] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const [dispatchType, setDispatchType] = useState<"IMMEDIATE" | "SCHEDULED">("IMMEDIATE");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [ethicsAcknowledge, setEthicsAcknowledge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/admin/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data.campaigns || []);
        setTemplates(data.templates || []);
        setEmployees(data.employees || []);
        if (data.templates?.length > 0) {
          setSelectedTemplate(data.templates[0].id);
          setPreviewTemplate(data.templates[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateName = () => {
    const themes = ["Password Reset Drill", "Payroll Notice Check", "IT Support Test", "Invoice Review Drill", "Benefits Enrollment Test"];
    const quarter = `Q${Math.floor(Math.random() * 4) + 1}`;
    setCampaignName(`${quarter} ${themes[Math.floor(Math.random() * themes.length)]}`);
  };

  const openWizard = () => {
    setStep(1);
    generateName();
    setCampaignDescription("A routine awareness check to measure how the team responds to a realistic phishing attempt.");
    setBusinessUnit("IT");
    setOrganizationName("");
    setCampaignCategory("Password Reset");
    setRiskLevel("MEDIUM");
    setSelectedDeptFilters([]);
    setSelectedBranchFilters([]);
    setSelectedUserIds([]);
    setEmployeeSearchTerm("");
    setTemplateSearchTerm("");
    setDispatchType("IMMEDIATE");
    setScheduleDate("");
    setScheduleTime("");
    setEthicsAcknowledge(false);
    setErrorMsg("");
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
      setPreviewTemplate(templates[0]);
    }
    setModalOpen(true);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept = selectedDeptFilters.length === 0 || (emp.department && selectedDeptFilters.includes(emp.department));
      const matchesBranch = selectedBranchFilters.length === 0 || (emp.branch && selectedBranchFilters.includes(emp.branch));
      const matchesSearch =
        !employeeSearchTerm.trim() ||
        (emp.name && emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())) ||
        emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase());
      return matchesDept && matchesBranch && matchesSearch;
    });
  }, [employees, selectedDeptFilters, selectedBranchFilters, employeeSearchTerm]);

  useEffect(() => {
    if (step === 2) setSelectedUserIds(filteredEmployees.map((e) => e.id));
    
  }, [selectedDeptFilters, selectedBranchFilters, step]);

  const toggleDept = (d: string) =>
    setSelectedDeptFilters((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  const toggleBranch = (b: string) =>
    setSelectedBranchFilters((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));
  const toggleUser = (id: string) =>
    setSelectedUserIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const selectAllFiltered = () => {
    const ids = filteredEmployees.map((e) => e.id);
    const all = ids.every((id) => selectedUserIds.includes(id));
    if (all) setSelectedUserIds((p) => p.filter((id) => !ids.includes(id)));
    else setSelectedUserIds((p) => Array.from(new Set([...p, ...ids])));
  };

  const selectedTemplateDetails = useMemo(
    () => templates.find((t) => t.id === selectedTemplate),
    [templates, selectedTemplate]
  );

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!campaignName.trim()) return setErrorMsg("Give your campaign a name.");
      if (campaigns.some((c) => c.name.toLowerCase().trim() === campaignName.toLowerCase().trim()))
        return setErrorMsg("You already have a campaign with this name.");
      if (!campaignDescription.trim()) return setErrorMsg("Add a short description.");
      if (!organizationName.trim()) return setErrorMsg("Organization name is required.");
    }
    if (step === 2 && selectedUserIds.length === 0)
      return setErrorMsg("Select at least one person to include.");
    if (step === 3 && !selectedTemplate) return setErrorMsg("Pick an email scenario.");
    if (step === 4 && dispatchType === "SCHEDULED") {
      if (!scheduleDate || !scheduleTime) return setErrorMsg("Choose a date and time.");
      const dt = new Date(`${scheduleDate}T${scheduleTime}`);
      if (isNaN(dt.getTime()) || dt <= new Date()) return setErrorMsg("Pick a time in the future.");
    }
    setStep((p) => p + 1);
  };

  const handleCreateCampaign = async () => {
    if (!ethicsAcknowledge) return;
    setSubmitting(true);
    setErrorMsg("");
    const scheduledStartISO =
      dispatchType === "SCHEDULED" && scheduleDate && scheduleTime
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        : null;
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: campaignName,
          description: campaignDescription,
          category: campaignCategory,
          riskLevel,
          organizationName,
          templateId: selectedTemplate,
          scheduledStart: scheduledStartISO,
          targetDepartments: selectedDeptFilters.length > 0 ? selectedDeptFilters : ["ALL"],
          targetBranches: selectedBranchFilters.length > 0 ? selectedBranchFilters : ["ALL"],
          targetUserIds: selectedUserIds,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "We couldn't create the campaign.");
      }
      const created = await res.json();
      setCreatedCampaignDetails({
        id: created.id,
        name: created.name,
        scheduledTime: scheduledStartISO
          ? new Date(scheduledStartISO).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"
          : "Sends immediately",
        targetCount: selectedUserIds.length,
        category: campaignCategory,
        riskLevel,
        templateName: selectedTemplateDetails?.name || "Custom template",
      });
      setModalOpen(false);
      setSuccessModalOpen(true);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, newStatus: "ACTIVE" | "COMPLETED") => {
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState label="Loading campaigns" sublabel="Gathering your active drills and targets." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Campaigns"
        description="Plan, launch, and wind down authorized phishing simulations — and watch how your teams respond."
        actions={
          <Button variant="primary" icon={<Plus size={15} />} onClick={openWizard}>
            New campaign
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {LANES.map((lane) => {
          const items = campaigns.filter((c) => c.status === lane.key);
          return (
            <div key={lane.key} className="space-y-3">
              <div className="flex items-center justify-between rounded-[10px] border border-line bg-card px-3 py-2">
                <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      lane.tone === "accent" && "bg-accent",
                      lane.tone === "warn" && "bg-warn",
                      lane.tone === "neutral" && "bg-ink-soft",
                      lane.tone === "muted" && "bg-ink-faint"
                    )}
                  />
                  {lane.label}
                </span>
                <span className="tnum rounded-md bg-inset px-1.5 py-0.5 text-[12px] text-ink-soft">
                  {items.length}
                </span>
              </div>
              <div className="min-h-[220px] space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((c) => (
                    <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="rounded-[12px] border border-dashed border-line px-4 py-8 text-center text-[12.5px] text-ink-faint">
                    Nothing here yet
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        <ModalHeader
          title="Create a campaign"
          description="Five quick steps from idea to launch."
          onClose={() => setModalOpen(false)}
          icon={<Plus size={17} />}
        />

        {}
        <div className="border-b border-line px-6 py-4">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const active = step === s.num;
              const done = step > s.num;
              const Icon = s.icon;
              return (
                <React.Fragment key={s.num}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-medium transition-colors",
                        active && "border-accent bg-accent text-[#04130c]",
                        done && "border-accent/40 bg-accent-faint text-accent",
                        !active && !done && "border-line bg-inset text-ink-faint"
                      )}
                    >
                      {done ? <Check size={13} /> : <Icon size={13} />}
                    </span>
                    <span
                      className={cn(
                        "hidden text-[13px] font-medium sm:inline",
                        active ? "text-ink" : "text-ink-faint"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-2 h-px flex-1 bg-line" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-5">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[#492626] bg-[#1a1111] px-3.5 py-2.5 text-[13px] text-danger">
              <ShieldAlert size={15} className="shrink-0" />
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Campaign name">
                    <Input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Q3 Password Reset Drill" />
                  </Field>
                  <Field label="Organization">
                    <Input value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} placeholder="Your organization name" />
                  </Field>
                  <Field label="Description" className="sm:col-span-2">
                    <Textarea value={campaignDescription} onChange={(e) => setCampaignDescription(e.target.value)} placeholder="What are you testing, and why?" />
                  </Field>
                  <Field label="Business unit">
                    <Select value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)}>
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </Select>
                  </Field>
                  <Field label="Category">
                    <Select value={campaignCategory} onChange={(e) => setCampaignCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Risk level" className="sm:col-span-2">
                    <div className="inline-flex gap-1.5 rounded-[10px] border border-line bg-inset p-1">
                      {(["LOW", "MEDIUM", "HIGH"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRiskLevel(r)}
                          className={cn(
                            "rounded-[8px] px-4 py-1.5 text-[13px] font-medium transition-colors",
                            riskLevel === r
                              ? "bg-card-hover text-ink"
                              : "text-ink-faint hover:text-ink-soft"
                          )}
                        >
                          {r.charAt(0) + r.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-ink-soft">Filter, then fine-tune who's included.</p>
                    <Badge tone="accent">{selectedUserIds.length} selected</Badge>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-4 md:col-span-1">
                      <FilterGroup title="Departments" items={DEPARTMENTS} selected={selectedDeptFilters} onToggle={toggleDept} />
                      <FilterGroup title="Branches" items={INDIAN_BRANCHES} selected={selectedBranchFilters} onToggle={toggleBranch} />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Input
                        icon={<Search size={15} />}
                        placeholder="Search people by name or email"
                        value={employeeSearchTerm}
                        onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                      />
                      <div className="overflow-hidden rounded-[12px] border border-line">
                        <div className="flex items-center gap-3 border-b border-line bg-inset px-3.5 py-2.5">
                          <CheckboxBox
                            checked={filteredEmployees.length > 0 && filteredEmployees.every((e) => selectedUserIds.includes(e.id))}
                            onChange={selectAllFiltered}
                          />
                          <span className="text-[12px] font-medium text-ink-soft">Select all matching ({filteredEmployees.length})</span>
                        </div>
                        <div className="scrollbar-thin max-h-[260px] divide-y divide-line overflow-y-auto">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => {
                              const selected = selectedUserIds.includes(emp.id);
                              return (
                                <button
                                  key={emp.id}
                                  type="button"
                                  onClick={() => toggleUser(emp.id)}
                                  className={cn(
                                    "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.02]",
                                    selected && "bg-white/[0.025]"
                                  )}
                                >
                                  <CheckboxBox checked={selected} onChange={() => toggleUser(emp.id)} />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-medium text-ink">{emp.name || "Unnamed"}</p>
                                    <p className="truncate text-[12px] text-ink-faint">{emp.email}</p>
                                  </div>
                                  <span className="hidden text-[12px] text-ink-faint sm:block">{emp.branch || "—"}</span>
                                  <Badge tone={riskTone[emp.riskCategory] || "neutral"}>{emp.riskCategory.toLowerCase()}</Badge>
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-4 py-10 text-center text-[13px] text-ink-faint">No one matches these filters.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <Input
                      icon={<Search size={15} />}
                      placeholder="Search scenarios"
                      value={templateSearchTerm}
                      onChange={(e) => setTemplateSearchTerm(e.target.value)}
                    />
                    <div className="scrollbar-thin max-h-[300px] space-y-2 overflow-y-auto pr-1">
                      {templates
                        .filter((t) => !templateSearchTerm.trim() || t.name.toLowerCase().includes(templateSearchTerm.toLowerCase()))
                        .map((t) => {
                          const selected = selectedTemplate === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setSelectedTemplate(t.id);
                                setPreviewTemplate(t);
                              }}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-[10px] border px-3.5 py-3 text-left transition-colors",
                                selected
                                  ? "border-accent/40 bg-accent-faint/40"
                                  : "border-line bg-inset hover:border-line-strong"
                              )}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-[13.5px] font-medium text-ink">{t.name}</p>
                                <p className="truncate text-[12px] text-ink-faint">{t.subject}</p>
                              </div>
                              {selected && <Check size={16} className="shrink-0 text-accent" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
                    <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#2a2a2e]" />
                      <span className="h-2 w-2 rounded-full bg-[#2a2a2e]" />
                      <span className="ml-2 text-[12px] text-ink-faint">Email preview</span>
                    </div>
                    {previewTemplate ? (
                      <div className="flex min-h-[280px] flex-1 flex-col">
                        <div className="space-y-1 border-b border-line px-4 py-3 text-[12px] text-ink-faint">
                          <p>From — Security Operations</p>
                          <p>
                            Subject — <span className="font-medium text-ink">{previewTemplate.subject}</span>
                          </p>
                        </div>
                        <div
                          className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-relaxed text-ink-soft [&_a]:text-accent"
                          dangerouslySetInnerHTML={{ __html: previewTemplate.bodyHtml }}
                        />
                      </div>
                    ) : (
                      <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center text-ink-faint">
                        <Eye size={20} />
                        <span className="mt-2 text-[13px]">Select a scenario to preview</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([
                      { type: "IMMEDIATE", icon: Play, title: "Send now", body: "Deliver the simulation as soon as you launch." },
                      { type: "SCHEDULED", icon: Clock, title: "Schedule for later", body: "Pick a future date and time to send." },
                    ] as const).map((opt) => {
                      const active = dispatchType === opt.type;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setDispatchType(opt.type)}
                          className={cn(
                            "flex items-start gap-3 rounded-[12px] border p-4 text-left transition-colors",
                            active ? "border-accent/40 bg-accent-faint/40" : "border-line bg-inset hover:border-line-strong"
                          )}
                        >
                          <span className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-[9px]", active ? "bg-accent/15 text-accent" : "bg-card text-ink-faint")}>
                            <Icon size={16} />
                          </span>
                          <div>
                            <p className="text-[14px] font-medium text-ink">{opt.title}</p>
                            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">{opt.body}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {dispatchType === "SCHEDULED" && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 rounded-[12px] border border-line bg-inset p-4 sm:grid-cols-2">
                      <Field label="Date (IST)">
                        <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                      </Field>
                      <Field label="Time (IST)">
                        <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                      </Field>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-2 rounded-[10px] border border-line bg-inset px-3.5 py-2.5 text-[12.5px] text-ink-soft">
                    <Info size={14} className="text-ink-faint" />
                    All times are in Asia/Kolkata (IST).
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[12px] border border-line bg-inset p-5">
                    <h4 className="mb-3 text-[14px] font-semibold text-ink">Summary</h4>
                    <dl className="divide-y divide-line text-[13px]">
                      {[
                        ["Name", campaignName],
                        ["Business unit", businessUnit],
                        ["Organization", organizationName],
                        ["Category", campaignCategory],
                        ["Risk level", riskLevel.charAt(0) + riskLevel.slice(1).toLowerCase()],
                        ["Recipients", `${selectedUserIds.length} people`],
                        ["Scenario", selectedTemplateDetails?.name || "—"],
                        ["Dispatch", dispatchType === "IMMEDIATE" ? "Send now" : `${scheduleDate} ${scheduleTime} IST`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-4 py-2">
                          <dt className="text-ink-faint">{k}</dt>
                          <dd className="truncate text-right font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="flex flex-col justify-between rounded-[12px] border border-line bg-inset p-5">
                    <div>
                      <div className="flex items-center gap-2 text-ink">
                        <ShieldAlert size={16} className="text-accent" />
                        <p className="text-[14px] font-semibold">Ethics confirmation</p>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
                        You confirm these recipients have consented to receive simulated
                        phishing as part of an authorized program. Any data entered on the
                        landing page is discarded in the browser and never stored.
                      </p>
                    </div>
                    <label className="mt-4 flex cursor-pointer items-center gap-3 border-t border-line pt-4">
                      <CheckboxBox checked={ethicsAcknowledge} onChange={() => setEthicsAcknowledge(!ethicsAcknowledge)} />
                      <span className="text-[13px] text-ink">I confirm this campaign is authorized.</span>
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <ModalFooter>
          {step > 1 && (
            <Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => setStep((p) => p - 1)}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          {step < 5 ? (
            <Button variant="primary" iconRight={<ArrowRight size={15} />} onClick={handleNextStep}>
              Continue
            </Button>
          ) : (
            <Button variant="accent" loading={submitting} disabled={!ethicsAcknowledge} onClick={handleCreateCampaign}>
              Launch campaign
            </Button>
          )}
        </ModalFooter>
      </Modal>

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)} size="md">
        {createdCampaignDetails && (
          <div className="p-7 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent-faint text-accent">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.01em] text-ink">
              Your campaign is live
            </h3>
            <p className="mt-1.5 text-[13.5px] text-ink-soft">
              {createdCampaignDetails.name} is registered and ready.
            </p>
            <div className="mt-6 rounded-[12px] border border-line bg-inset p-4 text-left">
              <dl className="divide-y divide-line text-[13px]">
                {[
                  ["Dispatch", createdCampaignDetails.scheduledTime],
                  ["Recipients", `${createdCampaignDetails.targetCount} people`],
                  ["Category", createdCampaignDetails.category],
                  ["Scenario", createdCampaignDetails.templateName],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-ink-faint">{k}</dt>
                    <dd className="truncate text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Button variant="primary" className="mt-6 w-full" onClick={() => setSuccessModalOpen(false)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CampaignCard({
  campaign,
  onToggleStatus,
}: {
  campaign: Campaign;
  onToggleStatus: (id: string, s: "ACTIVE" | "COMPLETED") => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="group space-y-3 rounded-[12px] border border-line bg-card p-4 transition-colors hover:border-line-strong"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[13.5px] font-medium leading-snug text-ink">{campaign.name}</h4>
      </div>
      {campaign.description && (
        <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-faint">{campaign.description}</p>
      )}
      <div className="space-y-1.5 text-[12px]">
        <div className="flex justify-between">
          <span className="text-ink-faint">Category</span>
          <span className="text-ink-soft">{campaign.category || "Phishing"}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-ink-faint">Template</span>
          <span className="truncate text-ink-soft" title={campaign.template?.name}>
            {campaign.template?.name || "Standard"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-3">
        {campaign.status === "DRAFT" && (
          <>
            <Badge tone="muted">Draft</Badge>
            <Button size="sm" variant="secondary" icon={<Play size={13} />} onClick={() => onToggleStatus(campaign.id, "ACTIVE")}>
              Launch
            </Button>
          </>
        )}
        {campaign.status === "SCHEDULED" && (
          <>
            <span className="flex items-center gap-1.5 text-[12px] text-ink-faint">
              <Calendar size={12} />
              {campaign.scheduledStart ? new Date(campaign.scheduledStart).toLocaleDateString() : ""}
            </span>
            <Button size="sm" variant="secondary" icon={<Play size={13} />} onClick={() => onToggleStatus(campaign.id, "ACTIVE")}>
              Launch
            </Button>
          </>
        )}
        {campaign.status === "ACTIVE" && (
          <>
            <Badge tone="accent" dot>Running</Badge>
            <Button size="sm" variant="danger" icon={<Square size={12} />} onClick={() => onToggleStatus(campaign.id, "COMPLETED")}>
              Stop
            </Button>
          </>
        )}
        {campaign.status === "COMPLETED" && (
          <span className="flex items-center gap-1.5 text-[12px] text-ink-soft">
            <CheckCircle2 size={13} className="text-accent" />
            Completed {campaign.completedAt ? new Date(campaign.completedAt).toLocaleDateString() : ""}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function FilterGroup({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-3.5">
      <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-faint">{title}</p>
      <div className="scrollbar-thin max-h-[150px] space-y-1.5 overflow-y-auto pr-1">
        {items.map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-soft">
            <CheckboxBox checked={selected.includes(item)} onChange={() => onToggle(item)} />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxBox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
        checked ? "border-accent bg-accent text-[#04130c]" : "border-line-strong bg-inset"
      )}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  );
}
