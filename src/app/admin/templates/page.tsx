"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Search,
  Grid2x2,
  List,
  Edit2,
  Copy,
  Archive,
  Star,
  Trash2,
  Monitor,
  Smartphone,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Select, Field, Textarea } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

interface Indicator {
  id: number;
  type: "sender" | "urgency" | "link" | "greeting" | "financial";
  label: string;
  text: string;
}

interface TemplateMetadata {
  category: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  department: string;
  isFavorite: boolean;
  isArchived: boolean;
  isDraft: boolean;
  sender: string;
  logoUrl: string;
  bannerImage: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: "cyan" | "blue" | "purple" | "emerald" | "rose" | "amber";
  indicatorsList: Indicator[];
}

interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  indicators: string;
  organizationId: string | null;
  createdAt: string;
}

const INDIAN_PRESETS = [
  { name: "Microsoft 365 Password Reset", subject: "Action Required: Mandated Microsoft 365 Password Sync for {{employeeName}}", sender: "it@company.co.in", category: "Password Reset", riskLevel: "HIGH" as const, department: "IT Support", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_simple.svg", bannerImage: "security", bodyText: "<p>Dear {{employeeName}},</p><p>Our global IT infrastructure scanner has identified multiple failed credential checks on your node from an unverified IP address in Maharashtra.</p><p>To safeguard database entities in the <strong>{{department}}</strong> team at <strong>{{branch}}</strong>, please re-authenticate your Microsoft 365 token within 2 hours.</p><p>Failure to complete this sync will trigger automatic network access lockout.</p>", ctaText: "Sync Password Now", ctaLink: "{{link}}", ctaColor: "blue" as const, indicatorsList: [{ id: 1, type: "sender" as const, label: "Spoofed Email Domain", text: "Sent from 'it@company.co.in' simulating Microsoft external administrative routers." }, { id: 2, type: "urgency" as const, label: "Artificial Deadline Coercion", text: "Demands action 'within 2 hours' to trigger panic and bypass standard security verification." }] },
  { name: "HR Leave Policy Update", subject: "URGENT: FY26 Revised Employee Holiday & Leave Policy Handbook", sender: "hr@company.in", category: "HR Notice", riskLevel: "MEDIUM" as const, department: "HR", logoUrl: "", bannerImage: "hr", bodyText: "<p>Hello {{employeeName}},</p><p>The Human Resources division has finalized revisions to our annual leave policies. Notable updates affect carry-over leaves, sick leave compliance, and travel allowance policies for the <strong>{{branch}}</strong> office.</p><p>Please click below to download and read the updated employee leave allocations handbook.</p>", ctaText: "Download Handbook Allocation", ctaLink: "{{link}}", ctaColor: "purple" as const, indicatorsList: [{ id: 1, type: "link" as const, label: "Non-Internal HRMS link", text: "CTA routes to external simulation tracker instead of company HRMS intranet portal." }] },
  { name: "Salary Credit Notification", subject: "Payroll Disbursement Confirmation for the Current Month", sender: "finance@company.co.in", category: "Finance", riskLevel: "HIGH" as const, department: "Finance", logoUrl: "", bannerImage: "finance", bodyText: "<p>Dear {{employeeName}},</p><p>Your salary disbursement is completed. The fund transfer of your monthly payroll allocation has been credited to your bank account.</p><p>Please review and download your password-protected PDF payslip, detailing tax deductions, Aadhaar benefits, and salary allowances.</p>", ctaText: "Download Payslip (PDF)", ctaLink: "{{link}}", ctaColor: "emerald" as const, indicatorsList: [{ id: 1, type: "financial" as const, label: "Financial Incentive Lure", text: "Exploits high-curiosity payroll details to bait users into inputting credentials." }] },
  { name: "PF / EPFO Aadhaar Linking", subject: "EPFO e-Sewa Notification: Mandatory Aadhaar-UAN Linkage Deadline", sender: "hr@company.in", category: "Compliance", riskLevel: "HIGH" as const, department: "ALL", logoUrl: "", bannerImage: "compliance", bodyText: "<p>Dear subscriber,</p><p>Under EPFO regulatory compliance circular 89/FY26, all subscribers must link their Aadhaar number to their Universal Account Number (UAN).</p><p>Failure to authenticate your Aadhaar links will result in automated block of monthly employer PF contributions.</p>", ctaText: "Verify Aadhaar-UAN Link", ctaLink: "{{link}}", ctaColor: "blue" as const, indicatorsList: [{ id: 1, type: "sender" as const, label: "Government Domain Impersonation", text: "EPFO alerts only arrive from verified government domains (gov.in) and never corporate internal routers." }] },
  { name: "Income Tax Declaration Reminder", subject: "Tax Compliance: Investment Declaration Submission Deadline for FY26", sender: "finance@company.co.in", category: "Finance", riskLevel: "MEDIUM" as const, department: "Finance", logoUrl: "", bannerImage: "finance", bodyText: "<p>Hi {{employeeName}},</p><p>This is your final notice to submit tax savings declarations. If documents are not submitted within 48 hours, maximum TDS tax deductions will be automatically applied to your upcoming salary credit.</p>", ctaText: "Access Tax Declarations Portal", ctaLink: "{{link}}", ctaColor: "rose" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "TDS Deduction Threat", text: "Forces action by threat of immediate salary deductions" }] },
  { name: "Vendor Invoice Approval", subject: "Finance Portal: Review Pending Invoice Approval for Vendor Services", sender: "finance@company.co.in", category: "Finance", riskLevel: "HIGH" as const, department: "Finance", logoUrl: "", bannerImage: "", bodyText: "<p>Hello,</p><p>Please audit the pending vendor invoice for IT services. A delay penalty of 2.5% per week will be charged by the provider if verification is not signed off by end of day.</p>", ctaText: "Review Invoice Sheet", ctaLink: "{{link}}", ctaColor: "rose" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "Overdue Penalties Scare", text: "Triggers pressure using financial delay penalties." }] },
  { name: "IT Helpdesk Security Alert", subject: "IT Security Notice: Blocked IP Alert on Your Office Workstation", sender: "it@company.co.in", category: "IT Support", riskLevel: "HIGH" as const, department: "IT Support", logoUrl: "", bannerImage: "security", bodyText: "<p>Attention {{employeeName}},</p><p>Our firewall has intercepted a Trojan scan originating from your office IP location in <strong>{{branch}}</strong>. Your workstation is pending hardware quarantine.</p><p>Execute diagnostics immediately to run local security validation.</p>", ctaText: "Run Firewall Diagnostics", ctaLink: "{{link}}", ctaColor: "rose" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "Device Quarantine Scare", text: "Attempts to bypass security checks by threatening machine quarantine." }] },
  { name: "VPN Access Renewal", subject: "Security Notice: Remote VPN Access Token Expiring", sender: "it@company.co.in", category: "IT Support", riskLevel: "HIGH" as const, department: "IT Support", logoUrl: "", bannerImage: "", bodyText: "<p>Dear {{employeeName}},</p><p>Your remote VPN credentials will expire in 24 hours. To continue remote working access to staging databases and corporate systems, please renew your credentials link.</p>", ctaText: "Renew VPN Token", ctaLink: "{{link}}", ctaColor: "blue" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "Work Disruption Scare", text: "Threatens loss of remote connection access to force fast clicks." }] },
  { name: "Company Town Hall Invitation", subject: "All Hands Meet: FY26 Annual Appraisal Matrix & Strategy Updates", sender: "hr@company.in", category: "General", riskLevel: "LOW" as const, department: "ALL", logoUrl: "", bannerImage: "townhall", bodyText: "<p>Hi Team,</p><p>Please join the executive team for our annual all-hands meet. We will cover key organizational appraisal policies and business targets.</p>", ctaText: "Confirm Meet Attendance", ctaLink: "{{link}}", ctaColor: "purple" as const, indicatorsList: [{ id: 1, type: "link" as const, label: "External Domain Invite", text: "Requires inputting credentials outside standard Townhall portal." }] },
  { name: "Festival Bonus Announcement", subject: "HR Announcement: Diwali Corporate Gift Voucher Allocation", sender: "hr@company.in", category: "Festival Awareness", riskLevel: "MEDIUM" as const, department: "ALL", logoUrl: "", bannerImage: "diwali", bodyText: "<p>Hello Employees,</p><p>In celebration of the festive season, the corporate committee has approved ex-gratia bonuses and digital retail vouchers for all branches.</p><p>Please claim your Diwali corporate voucher allocation below.</p>", ctaText: "Claim Diwali Voucher", ctaLink: "{{link}}", ctaColor: "amber" as const, indicatorsList: [{ id: 1, type: "financial" as const, label: "Festive Reward Lure", text: "Uses greed/incentives related to local holidays to trigger action." }] },
  { name: "Internal Compliance Training Reminder", subject: "Compliance Deadline: Mandatory Prevention of Sexual Harassment (POSH) Course Refresh", sender: "hr@company.in", category: "Compliance", riskLevel: "LOW" as const, department: "ALL", logoUrl: "", bannerImage: "", bodyText: "<p>Hi {{employeeName}},</p><p>Our audits indicate you have not completed the annual POSH training module. This is a mandatory compliance requirement.</p>", ctaText: "Begin POSH Module", ctaLink: "{{link}}", ctaColor: "purple" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "Compliance Notice", text: "Uses mandatory corporate compliance to trigger unthinking trust clicks." }] },
  { name: "Procurement Approval Request", subject: "Procurement Portal: Immediate Authorization Required for Purchase Order #PO-77821", sender: "finance@company.co.in", category: "Finance", riskLevel: "HIGH" as const, department: "Finance", logoUrl: "", bannerImage: "", bodyText: "<p>Dear Procurement Audit Node,</p><p>Purchase Order #PO-77821 has been flagged for authorization by the finance portal. Please confirm signoff to complete supplier dispatch.</p>", ctaText: "Authorize Purchase Order", ctaLink: "{{link}}", ctaColor: "cyan" as const, indicatorsList: [{ id: 1, type: "urgency" as const, label: "Operational Deadline", text: "Urges fast sign-off of financial transactions." }] },
];

const PRESET_BANNERS = {
  security: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60",
  hr: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60",
  finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=60",
  compliance: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60",
  townhall: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
  diwali: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&auto=format&fit=crop&q=60",
};

const CATEGORIES = ["Password Reset", "HR Notice", "Finance", "Compliance", "IT Support", "Festival Awareness", "General", "Procurement"];
const DEPARTMENTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations", "ALL"];

const riskTone: Record<string, "accent" | "warn" | "danger"> = { LOW: "accent", MEDIUM: "warn", HIGH: "danger" };

export default function TemplatesWorkspace() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [showArchived, setShowArchived] = useState(false);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formRiskLevel, setFormRiskLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [formDepartment, setFormDepartment] = useState("ALL");
  const [formSender, setFormSender] = useState("it@company.co.in");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formBannerImage, setFormBannerImage] = useState("");
  const [formBodyText, setFormBodyText] = useState("");
  const [formCtaText, setFormCtaText] = useState("");
  const [formCtaLink, setFormCtaLink] = useState("{{link}}");
  const [formCtaColor, setFormCtaColor] = useState<"cyan" | "blue" | "purple" | "emerald" | "rose" | "amber">("blue");
  const [formIndicators, setFormIndicators] = useState<Indicator[]>([]);
  const [editorTab, setEditorTab] = useState<"blocks" | "raw_html">("blocks");
  const [formRawHtml, setFormRawHtml] = useState("");

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewClient, setPreviewClient] = useState<"default" | "outlook" | "gmail">("default");

  const [newIndLabel, setNewIndLabel] = useState("");
  const [newIndText, setNewIndText] = useState("");
  const [newIndType, setNewIndType] = useState<Indicator["type"]>("sender");

  const [submitting, setSubmitting] = useState(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const rawHtmlTextareaRef = useRef<HTMLTextAreaElement>(null);

  const getMetadata = (t: Template): TemplateMetadata => {
    try {
      const parsed = JSON.parse(t.indicators);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return {
          category: parsed.category || "General",
          riskLevel: parsed.riskLevel || "MEDIUM",
          department: parsed.department || "ALL",
          isFavorite: !!parsed.isFavorite,
          isArchived: !!parsed.isArchived,
          isDraft: !!parsed.isDraft,
          sender: parsed.sender || "it@company.co.in",
          logoUrl: parsed.logoUrl || "",
          bannerImage: parsed.bannerImage || "",
          ctaText: parsed.ctaText || "",
          ctaLink: parsed.ctaLink || "{{link}}",
          ctaColor: parsed.ctaColor || "blue",
          indicatorsList: parsed.indicatorsList || [],
        };
      }
      const list = Array.isArray(parsed) ? parsed : [];
      let category = "General";
      let department = "ALL";
      let sender = "it@company.co.in";
      const n = t.name.toLowerCase();
      if (n.includes("password") || n.includes("vpn")) { category = "Password Reset"; department = "IT Support"; sender = "it@company.co.in"; }
      else if (n.includes("leave") || n.includes("policy")) { category = "HR Notice"; department = "HR"; sender = "hr@company.in"; }
      else if (n.includes("salary") || n.includes("tax") || n.includes("invoice")) { category = "Finance"; department = "Finance"; sender = "finance@company.co.in"; }
      return { category, riskLevel: "MEDIUM", department, isFavorite: false, isArchived: false, isDraft: false, sender, logoUrl: "", bannerImage: "", ctaText: "Verify Details", ctaLink: "{{link}}", ctaColor: "blue", indicatorsList: list };
    } catch {
      return { category: "General", riskLevel: "MEDIUM", department: "ALL", isFavorite: false, isArchived: false, isDraft: false, sender: "it@company.co.in", logoUrl: "", bannerImage: "", ctaText: "", ctaLink: "{{link}}", ctaColor: "blue", indicatorsList: [] };
    }
  };

  const loadTemplates = () => {
    setLoading(true);
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) setSelectedTemplate(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate && !isCreateMode) {
      const meta = getMetadata(selectedTemplate);
      setFormName(selectedTemplate.name);
      setFormSubject(selectedTemplate.subject);
      setFormCategory(meta.category);
      setFormRiskLevel(meta.riskLevel);
      setFormDepartment(meta.department);
      setFormSender(meta.sender);
      setFormLogoUrl(meta.logoUrl);
      setFormBannerImage(meta.bannerImage);
      setFormCtaText(meta.ctaText);
      setFormCtaLink(meta.ctaLink);
      setFormCtaColor(meta.ctaColor);
      setFormIndicators(meta.indicatorsList);
      setFormRawHtml(selectedTemplate.bodyHtml);
      const bodyMatch = selectedTemplate.bodyHtml.match(/<div style="line-height: 1\.6; font-size: 14px; color: #374151;">([\s\S]*?)<\/div>/);
      if (bodyMatch) {
        setFormBodyText(bodyMatch[1].trim());
        setEditorTab("blocks");
      } else {
        setFormBodyText(selectedTemplate.bodyHtml);
        setEditorTab("raw_html");
      }
    }
    
  }, [selectedTemplate]);

  const getCompiledHtml = () => {
    if (editorTab === "raw_html") return formRawHtml;
    const bannerUrl = PRESET_BANNERS[formBannerImage as keyof typeof PRESET_BANNERS] || formBannerImage;
    const ctaColor =
      formCtaColor === "cyan" ? "#06b6d4" :
      formCtaColor === "blue" ? "#2563eb" :
      formCtaColor === "purple" ? "#8b5cf6" :
      formCtaColor === "emerald" ? "#10b981" :
      formCtaColor === "rose" ? "#f43f5e" : "#f59e0b";
    return `
<div style="font-family: sans-serif; padding: 24px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
  ${formLogoUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${formLogoUrl}" alt="Logo" style="max-height: 40px; object-fit: contain;" /></div>` : ""}
  ${bannerUrl ? `<div style="margin-bottom: 20px;"><img src="${bannerUrl}" alt="Banner" style="width: 100%; border-radius: 8px; max-height: 150px; object-fit: cover;" /></div>` : ""}
  <div style="line-height: 1.6; font-size: 14px; color: #374151;">
    ${formBodyText || "<p>Configure body content text...</p>"}
  </div>
  ${formCtaText ? `
    <div style="margin: 28px 0; text-align: center;">
      <a href="${formCtaLink || "{{link}}"}" style="background-color: ${ctaColor}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px; font-family: sans-serif;">${formCtaText}</a>
    </div>
  ` : ""}
</div>
    `;
  };

  const compileFinalBody = () => getCompiledHtml().trim();

  const resolvePlaceholders = (html: string) =>
    html
      .replace(/\{\{employeeName\}\}/g, "Arjun Mehta")
      .replace(/\{\{name\}\}/g, "Arjun Mehta")
      .replace(/\{\{department\}\}/g, "Engineering")
      .replace(/\{\{branch\}\}/g, "Bengaluru")
      .replace(/\{\{managerName\}\}/g, "Rahul Sharma")
      .replace(/\{\{organizationName\}\}/g, "your organisation")
      .replace(/\{\{link\}\}/g, "#")
      .replace(/href="\#"/g, 'href="javascript:void(0)"');

  const handleSaveTemplate = async (isPublish: boolean) => {
    if (!formName.trim() || !formSubject.trim()) {
      alert("Name and subject are required.");
      return;
    }
    setSubmitting(true);
    const newMetadata: TemplateMetadata = {
      category: formCategory,
      riskLevel: formRiskLevel,
      department: formDepartment,
      isFavorite: selectedTemplate ? getMetadata(selectedTemplate).isFavorite : false,
      isArchived: selectedTemplate ? getMetadata(selectedTemplate).isArchived : false,
      isDraft: !isPublish,
      sender: formSender,
      logoUrl: formLogoUrl,
      bannerImage: formBannerImage,
      ctaText: formCtaText,
      ctaLink: formCtaLink,
      ctaColor: formCtaColor,
      indicatorsList: formIndicators,
    };
    const payload = { name: formName, subject: formSubject, bodyHtml: compileFinalBody(), indicators: newMetadata };
    try {
      let res;
      if (isCreateMode) {
        res = await fetch("/api/admin/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/admin/templates/${selectedTemplate?.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (res.ok) {
        setIsEditorOpen(false);
        setIsCreateMode(false);
        loadTemplates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = async (t: Template) => {
    setLoading(true);
    const meta = getMetadata(t);
    try {
      const res = await fetch("/api/admin/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${t.name} (Copy)`, subject: t.subject, bodyHtml: t.bodyHtml, indicators: { ...meta, isDraft: true } }) });
      if (res.ok) loadTemplates();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleToggleArchive = async (t: Template) => {
    setLoading(true);
    const meta = getMetadata(t);
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: t.name, subject: t.subject, bodyHtml: t.bodyHtml, indicators: { ...meta, isArchived: !meta.isArchived } }) });
      if (res.ok) loadTemplates();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (t: Template) => {
    const meta = getMetadata(t);
    const updatedMeta = { ...meta, isFavorite: !meta.isFavorite };
    setTemplates((prev) => prev.map((tmpl) => (tmpl.id === t.id ? { ...tmpl, indicators: JSON.stringify(updatedMeta) } : tmpl)));
    if (selectedTemplate?.id === t.id) setSelectedTemplate((prev) => (prev ? { ...prev, indicators: JSON.stringify(updatedMeta) } : null));
    try {
      await fetch(`/api/admin/templates/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: t.name, subject: t.subject, bodyHtml: t.bodyHtml, indicators: updatedMeta }) });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (t: Template) => {
    if (!confirm(`Delete "${t.name}"? This can't be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, { method: "DELETE" });
      if (res.ok) loadTemplates();
      else {
        const err = await res.json();
        alert(err.error || "Couldn't delete this template.");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleLoadPreset = (preset: typeof INDIAN_PRESETS[0]) => {
    setFormName(preset.name);
    setFormSubject(preset.subject);
    setFormCategory(preset.category);
    setFormRiskLevel(preset.riskLevel);
    setFormDepartment(preset.department);
    setFormSender(preset.sender);
    setFormLogoUrl(preset.logoUrl);
    setFormBannerImage(preset.bannerImage);
    setFormBodyText(preset.bodyText);
    setFormCtaText(preset.ctaText);
    setFormCtaLink(preset.ctaLink);
    setFormCtaColor(preset.ctaColor);
    setFormIndicators(preset.indicatorsList as Indicator[]);
    setEditorTab("blocks");
  };

  const handleInsertPlaceholder = (token: string) => {
    const textarea = editorTab === "blocks" ? bodyTextareaRef.current : rawHtmlTextareaRef.current;
    if (!textarea) return;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    const replacement = `{{${token}}}`;
    const newText = text.substring(0, startPos) + replacement + text.substring(endPos);
    if (editorTab === "blocks") setFormBodyText(newText);
    else setFormRawHtml(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + replacement.length;
    }, 50);
  };

  const getValidationWarnings = () => {
    const warnings: string[] = [];
    const textToCheck = editorTab === "blocks" ? formBodyText : formRawHtml;
    if (!formSubject.trim()) warnings.push("The subject line is empty — simulations need one.");
    if (!textToCheck.trim()) warnings.push("The email body is empty.");
    if (!textToCheck.includes("{{link}}") && !textToCheck.includes("{{ctaLink}}")) warnings.push("No {{link}} placeholder — clicks won't be tracked.");
    if (!textToCheck.includes("{{employeeName}}") && !textToCheck.includes("{{name}}")) warnings.push("No {{employeeName}} — the email won't be personalized.");
    if (editorTab === "blocks" && formCtaText && !formCtaLink.trim()) warnings.push("The button has no link target.");
    return warnings;
  };

  const handleAddFormIndicator = () => {
    if (!newIndLabel.trim() || !newIndText.trim()) return;
    setFormIndicators([...formIndicators, { id: Date.now(), type: newIndType, label: newIndLabel, text: newIndText }]);
    setNewIndLabel("");
    setNewIndText("");
  };
  const handleRemoveFormIndicator = (id: number) => setFormIndicators(formIndicators.filter((i) => i.id !== id));

  const openCreate = () => {
    setIsCreateMode(true);
    setFormName(""); setFormSubject(""); setFormCategory("General"); setFormRiskLevel("MEDIUM");
    setFormDepartment("ALL"); setFormSender("it@company.co.in"); setFormLogoUrl(""); setFormBannerImage("");
    setFormBodyText(""); setFormCtaText(""); setFormCtaLink("{{link}}"); setFormCtaColor("blue");
    setFormIndicators([]); setFormRawHtml(""); setEditorTab("blocks"); setIsEditorOpen(true);
  };

  const filteredTemplates = templates.filter((t) => {
    const meta = getMetadata(t);
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bodyHtml.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || meta.category === selectedCategory;
    const matchesRisk = selectedRiskFilter === "ALL" || meta.riskLevel === selectedRiskFilter;
    const matchesArchived = meta.isArchived === showArchived;
    return matchesSearch && matchesCategory && matchesRisk && matchesArchived;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  if (loading) return <LoadingState label="Loading templates" sublabel="Preparing your scenario library." />;

  const warnings = getValidationWarnings();
  const placeholderTokens = [
    { token: "employeeName" }, { token: "department" }, { token: "branch" },
    { token: "managerName" }, { token: "organizationName" }, { token: "link" },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Templates"
        description="Craft, preview, and manage the phishing scenarios your campaigns draw from."
        actions={
          <Button variant="primary" icon={<Plus size={15} />} onClick={openCreate}>
            New template
          </Button>
        }
      />

      {}
      <div className="mb-6 flex flex-col gap-3 rounded-[14px] border border-line bg-card p-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Input icon={<Search size={15} />} placeholder="Search templates" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-auto">
            <option value="ALL">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={selectedRiskFilter} onChange={(e) => setSelectedRiskFilter(e.target.value)} className="w-auto">
            <option value="ALL">All risk</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-auto">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </Select>
          <button
            onClick={() => setShowArchived(!showArchived)}
            title={showArchived ? "Show active" : "Show archived"}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors",
              showArchived ? "border-line-strong bg-card-hover text-ink" : "border-line bg-inset text-ink-faint hover:text-ink"
            )}
          >
            <Archive size={16} />
          </button>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "grid", label: <span className="flex items-center gap-1.5"><Grid2x2 size={13} /> Grid</span> },
              { value: "list", label: <span className="flex items-center gap-1.5"><List size={13} /> List</span> },
            ]}
          />
        </div>
      </div>

      {}
      {sortedTemplates.length === 0 ? (
        <EmptyState
          icon={<Mail size={18} />}
          title="No templates match your filters"
          description="Try clearing filters, or create a new scenario from scratch."
          action={<Button variant="primary" size="sm" onClick={openCreate}>New template</Button>}
        />
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedTemplates.map((t) => {
            const meta = getMetadata(t);
            return (
              <motion.div
                key={t.id}
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col justify-between rounded-[14px] border border-line bg-card p-5 transition-colors hover:border-line-strong"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <Badge tone={riskTone[meta.riskLevel] || "neutral"}>{meta.riskLevel.toLowerCase()} risk</Badge>
                    <button
                      onClick={() => handleToggleFavorite(t)}
                      className={cn("transition-colors", meta.isFavorite ? "text-warn" : "text-ink-faint hover:text-ink-soft")}
                    >
                      <Star size={15} className={meta.isFavorite ? "fill-current" : ""} />
                    </button>
                  </div>
                  <h3 className="truncate text-[14px] font-semibold text-ink" title={t.name}>{t.name}</h3>
                  <p className="mt-0.5 text-[12px] text-ink-faint">{meta.category}</p>
                  <div className="mt-4 space-y-1 rounded-[10px] border border-line bg-inset p-3 text-[12px]">
                    <p className="truncate text-ink-soft"><span className="text-ink-faint">Subject </span>{t.subject}</p>
                    <p className="truncate text-ink-faint">{meta.sender}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <div className="flex gap-1">
                    <IconBtn title="Edit" onClick={() => { setSelectedTemplate(t); setIsCreateMode(false); setIsEditorOpen(true); }}><Edit2 size={13} /></IconBtn>
                    <IconBtn title="Duplicate" onClick={() => handleDuplicate(t)}><Copy size={13} /></IconBtn>
                    <IconBtn title={meta.isArchived ? "Restore" : "Archive"} onClick={() => handleToggleArchive(t)}><Archive size={13} /></IconBtn>
                  </div>
                  <IconBtn title="Delete" danger onClick={() => handleDelete(t)}><Trash2 size={13} /></IconBtn>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-line bg-card">
          <Table>
            <THead>
              <TH className="w-10" />
              <TH>Name</TH>
              <TH>Subject</TH>
              <TH>Sender</TH>
              <TH align="center">Category</TH>
              <TH align="center">Risk</TH>
              <TH align="right">Actions</TH>
            </THead>
            <TBody>
              {sortedTemplates.map((t) => {
                const meta = getMetadata(t);
                return (
                  <TR key={t.id}>
                    <TD>
                      <button onClick={() => handleToggleFavorite(t)} className={cn(meta.isFavorite ? "text-warn" : "text-ink-faint hover:text-ink-soft")}>
                        <Star size={14} className={meta.isFavorite ? "fill-current" : ""} />
                      </button>
                    </TD>
                    <TD className="font-medium text-ink">{t.name}</TD>
                    <TD className="max-w-xs truncate" >{t.subject}</TD>
                    <TD className="text-ink-faint">{meta.sender}</TD>
                    <TD align="center"><Badge tone="neutral">{meta.category}</Badge></TD>
                    <TD align="center"><Badge tone={riskTone[meta.riskLevel] || "neutral"}>{meta.riskLevel.toLowerCase()}</Badge></TD>
                    <TD align="right">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="Edit" onClick={() => { setSelectedTemplate(t); setIsCreateMode(false); setIsEditorOpen(true); }}><Edit2 size={13} /></IconBtn>
                        <IconBtn title="Duplicate" onClick={() => handleDuplicate(t)}><Copy size={13} /></IconBtn>
                        <IconBtn title="Delete" danger onClick={() => handleDelete(t)}><Trash2 size={13} /></IconBtn>
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
      )}

      {}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-canvas"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-inset text-accent">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-ink">
                    {isCreateMode ? "New template" : `Editing ${formName}`}
                  </h2>
                  <p className="text-[12px] text-ink-faint">Build and preview your scenario</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon={<Save size={14} />} loading={submitting} onClick={() => handleSaveTemplate(false)}>
                  Save draft
                </Button>
                <Button variant="accent" size="sm" icon={<CheckCircle2 size={14} />} loading={submitting} onClick={() => handleSaveTemplate(true)}>
                  Publish
                </Button>
                <button onClick={() => { setIsEditorOpen(false); setIsCreateMode(false); }} className="ml-1 flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint hover:bg-white/[0.05] hover:text-ink">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
              {}
              <div className="scrollbar-thin w-full space-y-6 overflow-y-auto border-r border-line p-6 lg:w-1/2">
                {isCreateMode && (
                  <div className="rounded-[12px] border border-line bg-card p-4">
                    <p className="mb-2.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <Sparkles size={14} className="text-accent" /> Start from a preset
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {INDIAN_PRESETS.map((preset, idx) => (
                        <button key={idx} type="button" onClick={() => handleLoadPreset(preset)} title={preset.name} className="truncate rounded-[8px] border border-line bg-inset px-2.5 py-2 text-left text-[12px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink">
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Template name"><Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="IT security audit prompt" /></Field>
                  <Field label="Subject line"><Input value={formSubject} onChange={(e) => setFormSubject(e.target.value)} placeholder="Mandated SSO password check" /></Field>
                  <Field label="Category"><Select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
                  <Field label="Risk level"><Select value={formRiskLevel} onChange={(e: any) => setFormRiskLevel(e.target.value)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></Select></Field>
                  <Field label="Target department"><Select value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</Select></Field>
                  <Field label="Sender domain">
                    <Select value={formSender} onChange={(e) => setFormSender(e.target.value)}>
                      <option value="it@company.co.in">it@company.co.in</option>
                      <option value="hr@company.in">hr@company.in</option>
                      <option value="finance@company.co.in">finance@company.co.in</option>
                      <option value="epfo@company.co.in">epfo@company.co.in</option>
                      <option value="procurement@company.co.in">procurement@company.co.in</option>
                    </Select>
                  </Field>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink">Email body</span>
                    <Segmented
                      value={editorTab}
                      onChange={(v) => setEditorTab(v)}
                      size="sm"
                      layoutId="editorTab"
                      options={[{ value: "blocks", label: "Blocks" }, { value: "raw_html", label: "Raw HTML" }]}
                    />
                  </div>

                  <div className="rounded-[10px] border border-line bg-inset p-3">
                    <p className="mb-2 text-[12px] text-ink-faint">Insert a variable</p>
                    <div className="flex flex-wrap gap-1.5">
                      {placeholderTokens.map((t) => (
                        <button key={t.token} type="button" onClick={() => handleInsertPlaceholder(t.token)} className="rounded-[7px] border border-line bg-card px-2 py-1 font-mono text-[11.5px] text-accent transition-colors hover:border-line-strong">
                          {`{{${t.token}}}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editorTab === "blocks" ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Logo">
                          <Select value={formLogoUrl} onChange={(e) => setFormLogoUrl(e.target.value)}>
                            <option value="">None</option>
                            <option value="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_simple.svg">Microsoft</option>
                            <option value="https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&auto=format&fit=crop&q=60">SSO shield</option>
                          </Select>
                        </Field>
                        <Field label="Header banner">
                          <Select value={formBannerImage} onChange={(e) => setFormBannerImage(e.target.value)}>
                            <option value="">None</option>
                            <option value="security">Security</option>
                            <option value="hr">HR</option>
                            <option value="finance">Finance</option>
                            <option value="compliance">Compliance</option>
                            <option value="townhall">Town hall</option>
                            <option value="diwali">Festive</option>
                          </Select>
                        </Field>
                      </div>
                      <Field label="Body (HTML allowed)">
                        <Textarea ref={bodyTextareaRef} value={formBodyText} onChange={(e) => setFormBodyText(e.target.value)} placeholder="<p>Write the email body…</p>" className="min-h-[160px]" />
                      </Field>
                      <div className="rounded-[10px] border border-line bg-inset p-4">
                        <p className="mb-3 text-[12px] font-semibold text-ink-soft">Call-to-action button</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Button label"><Input value={formCtaText} onChange={(e) => setFormCtaText(e.target.value)} placeholder="Authenticate now" /></Field>
                          <Field label="Button color">
                            <Select value={formCtaColor} onChange={(e: any) => setFormCtaColor(e.target.value)}>
                              <option value="blue">Blue</option>
                              <option value="cyan">Cyan</option>
                              <option value="purple">Purple</option>
                              <option value="emerald">Emerald</option>
                              <option value="rose">Rose</option>
                              <option value="amber">Amber</option>
                            </Select>
                          </Field>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Field label="Raw HTML source">
                      <Textarea ref={rawHtmlTextareaRef} value={formRawHtml} onChange={(e) => setFormRawHtml(e.target.value)} placeholder="<div>…</div>" className="min-h-[320px] font-mono text-[12px]" />
                    </Field>
                  )}
                </div>

                {warnings.length > 0 && (
                  <div className="rounded-[10px] border border-[#473c1d] bg-[#1e1a10] p-4">
                    <p className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-warn">
                      <AlertTriangle size={14} /> {warnings.length} thing{warnings.length > 1 ? "s" : ""} to check
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-[12.5px] text-ink-soft">
                      {warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="text-[13px] font-semibold text-ink">Teachable cues</span>
                  <div className="space-y-3 rounded-[10px] border border-line bg-inset p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Type">
                        <Select value={newIndType} onChange={(e: any) => setNewIndType(e.target.value)}>
                          <option value="sender">Spoofed sender</option>
                          <option value="urgency">Urgency / pressure</option>
                          <option value="link">Deceptive link</option>
                          <option value="greeting">Generic greeting</option>
                          <option value="financial">Financial lure</option>
                        </Select>
                      </Field>
                      <Field label="Title"><Input value={newIndLabel} onChange={(e) => setNewIndLabel(e.target.value)} placeholder="Mismatched domain" /></Field>
                    </div>
                    <Field label="Explanation"><Input value={newIndText} onChange={(e) => setNewIndText(e.target.value)} placeholder="Sent from a lookalike domain instead of the real portal." /></Field>
                    <Button variant="secondary" size="sm" className="w-full" icon={<Plus size={14} />} onClick={handleAddFormIndicator}>Add cue</Button>
                  </div>
                  <div className="space-y-2">
                    {formIndicators.map((ind) => (
                      <div key={ind.id} className="flex items-center justify-between gap-3 rounded-[10px] border border-line bg-inset p-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-ink">{ind.label}</p>
                          <p className="truncate text-[12px] text-ink-faint">{ind.text}</p>
                        </div>
                        <button onClick={() => handleRemoveFormIndicator(ind.id)} className="text-ink-faint hover:text-ink"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div className="flex w-full flex-col overflow-hidden bg-surface lg:w-1/2">
                <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-3.5">
                  <Segmented
                    value={previewClient}
                    onChange={(v) => setPreviewClient(v)}
                    size="sm"
                    layoutId="previewClient"
                    options={[{ value: "default", label: "Web" }, { value: "outlook", label: "Outlook" }, { value: "gmail", label: "Gmail" }]}
                  />
                  <Segmented
                    value={previewDevice}
                    onChange={(v) => setPreviewDevice(v)}
                    size="sm"
                    layoutId="previewDevice"
                    options={[
                      { value: "desktop", label: <Monitor size={13} /> },
                      { value: "mobile", label: <Smartphone size={13} /> },
                    ]}
                  />
                </div>
                <div className="scrollbar-thin flex flex-1 items-start justify-center overflow-y-auto p-8">
                  {previewDevice === "mobile" ? (
                    <div className="flex h-[560px] w-full max-w-[320px] shrink-0 flex-col overflow-hidden rounded-[40px] border-[10px] border-elevated bg-canvas shadow-2xl">
                      <div className="space-y-0.5 border-b border-line bg-surface px-4 pb-2.5 pt-5 text-[11px] text-ink-soft">
                        <div className="truncate"><span className="text-ink-faint">Subject </span>{formSubject || "(empty)"}</div>
                        <div className="truncate"><span className="text-ink-faint">From </span>{formSender}</div>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white p-4">
                        <div className="text-[11px] leading-relaxed text-zinc-800" dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }} />
                      </div>
                    </div>
                  ) : previewClient === "outlook" ? (
                    <div className="flex h-[500px] w-full max-w-2xl shrink-0 flex-col overflow-hidden rounded-[12px] border border-zinc-200 bg-[#f3f2f1] shadow-2xl">
                      <div className="flex items-center justify-between bg-[#0078d4] px-4 py-2 text-[12px] font-semibold text-white">Inbox — Outlook</div>
                      <div className="space-y-3 border-b border-zinc-200 bg-white p-4">
                        <h2 className="text-[18px] font-semibold text-zinc-900">{formSubject || "(no subject)"}</h2>
                        <div className="flex items-center gap-3 text-[12px]">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 font-bold text-zinc-600">{formSender[0]?.toUpperCase()}</div>
                          <div>
                            <div className="font-semibold text-zinc-900">{formSender.split("@")[0]} <span className="font-normal text-zinc-500">&lt;{formSender}&gt;</span></div>
                            <div className="text-[11px] text-zinc-500">To: you</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white p-6">
                        <div className="text-zinc-800" dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }} />
                      </div>
                    </div>
                  ) : previewClient === "gmail" ? (
                    <div className="flex h-[500px] w-full max-w-2xl shrink-0 flex-col overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-2xl">
                      <div className="flex items-center gap-3 border-b border-zinc-200 bg-[#f6f8fc] px-4 py-2.5 text-[12px] text-zinc-500">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-200 text-zinc-600">M</span>
                        <span className="truncate font-mono text-[11px]">mail.google.com/mail/u/0/#inbox</span>
                      </div>
                      <div className="space-y-3 px-6 py-4">
                        <h2 className="text-[20px] font-normal text-zinc-900">{formSubject || "(no subject)"}</h2>
                        <div className="flex items-center gap-3 text-[12px]">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0fe] font-bold text-[#1a73e8]">{formSender[0]?.toUpperCase()}</div>
                          <div>
                            <div className="font-semibold text-zinc-900">{formSender.split("@")[0]} <span className="font-normal text-zinc-500">&lt;{formSender}&gt;</span></div>
                            <div className="text-[11px] text-zinc-400">to me</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto border-t border-zinc-100 bg-white px-6 pb-6 pt-4">
                        <div className="text-zinc-800" dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[500px] w-full flex-col overflow-hidden rounded-[14px] border border-line bg-canvas shadow-2xl">
                      <div className="flex shrink-0 items-center justify-between border-b border-line bg-surface px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#2a2a2e]" />
                          <span className="h-2 w-2 rounded-full bg-[#2a2a2e]" />
                          <span className="h-2 w-2 rounded-full bg-[#2a2a2e]" />
                        </div>
                        <div className="flex w-1/2 items-center justify-center gap-1.5 rounded-[8px] border border-line bg-inset px-3 py-1 text-[11px] text-ink-faint">
                          <Lock size={10} className="text-accent" />
                          <span className="truncate">secure-gateway.internal</span>
                        </div>
                        <div className="w-8" />
                      </div>
                      <div className="space-y-0.5 border-b border-line bg-surface px-4 py-3 text-[11px] text-ink-soft">
                        <div className="truncate"><span className="text-ink-faint">Subject </span>{formSubject || "(empty)"}</div>
                        <div className="truncate"><span className="text-ink-faint">From </span>{formSender}</div>
                      </div>
                      <div className="flex-1 overflow-y-auto bg-white p-6">
                        <div className="text-zinc-800" dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[8px] border border-line bg-inset transition-colors hover:border-line-strong",
        danger ? "text-ink-faint hover:text-danger" : "text-ink-soft hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
