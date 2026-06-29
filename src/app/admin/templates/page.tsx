'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Smartphone, 
  Monitor, 
  Plus, 
  Eye, 
  X, 
  Check, 
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  Lock,
  Layers,
  Search,
  Code,
  Building,
  Heart,
  Grid,
  List,
  Edit2,
  Trash2,
  Copy,
  Archive,
  Star,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Mail,
  MoreVertical,
  ExternalLink,
  Save,
  CheckCircle,
  FileCode
} from 'lucide-react';

interface Indicator {
  id: number;
  type: 'sender' | 'urgency' | 'link' | 'greeting' | 'financial';
  label: string;
  text: string;
}

interface TemplateMetadata {
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  department: string;
  isFavorite: boolean;
  isArchived: boolean;
  isDraft: boolean;
  sender: string;
  logoUrl: string;
  bannerImage: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: 'cyan' | 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
  indicatorsList: Indicator[];
}

interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  indicators: string; // JSON string containing TemplateMetadata + indicators
  organizationId: string | null;
  createdAt: string;
}

// 12 Presets based on Indian corporate scenarios
const INDIAN_PRESETS = [
  {
    name: "Microsoft 365 Password Reset",
    subject: "Action Required: Mandated Microsoft 365 Password Sync for {{employeeName}}",
    sender: "it@company.co.in",
    category: "Password Reset",
    riskLevel: "HIGH" as const,
    department: "IT Support",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_simple.svg",
    bannerImage: "security",
    bodyText: "<p>Dear {{employeeName}},</p><p>Our global IT infrastructure scanner has identified multiple failed credential checks on your node from an unverified IP address in Maharashtra.</p><p>To safeguard database entities in the <strong>{{department}}</strong> team at <strong>{{branch}}</strong>, please re-authenticate your Microsoft 365 token within 2 hours.</p><p>Failure to complete this sync will trigger automatic network access lockout.</p>",
    ctaText: "Sync Password Now",
    ctaLink: "{{link}}",
    ctaColor: "blue" as const,
    indicatorsList: [
      { id: 1, type: "sender", label: "Spoofed Email Domain", text: "Sent from 'it@company.co.in' simulating Microsoft external administrative routers." },
      { id: 2, type: "urgency", label: "Artificial Deadline Coercion", text: "Demands action 'within 2 hours' to trigger panic and bypass standard security verification." }
    ]
  },
  {
    name: "HR Leave Policy Update",
    subject: "URGENT: FY26 Revised Employee Holiday & Leave Policy Handbook",
    sender: "hr@company.in",
    category: "HR Notice",
    riskLevel: "MEDIUM" as const,
    department: "HR",
    logoUrl: "",
    bannerImage: "hr",
    bodyText: "<p>Hello {{employeeName}},</p><p>The Human Resources division has finalized revisions to our annual leave policies. Notable updates affect carry-over leaves, sick leave compliance, and travel allowance policies for the <strong>{{branch}}</strong> office.</p><p>Please click below to download and read the updated employee leave allocations handbook.</p>",
    ctaText: "Download Handbook Allocation",
    ctaLink: "{{link}}",
    ctaColor: "purple" as const,
    indicatorsList: [
      { id: 1, type: "link", label: "Non-Internal HRMS link", text: "CTA routes to external simulation tracker instead of company HRMS intranet portal." }
    ]
  },
  {
    name: "Salary Credit Notification",
    subject: "Payroll Disbursement Confirmation for the Current Month",
    sender: "finance@company.co.in",
    category: "Finance",
    riskLevel: "HIGH" as const,
    department: "Finance",
    logoUrl: "",
    bannerImage: "finance",
    bodyText: "<p>Dear {{employeeName}},</p><p>Your salary disbursement is completed. The fund transfer of your monthly payroll allocation has been credited to your bank account.</p><p>Please review and download your password-protected PDF payslip, detailing tax deductions, Aadhaar benefits, and salary allowances.</p>",
    ctaText: "Download Payslip (PDF)",
    ctaLink: "{{link}}",
    ctaColor: "emerald" as const,
    indicatorsList: [
      { id: 1, type: "financial", label: "Financial Incentive Lure", text: "Exploits high-curiosity payroll details to bait users into inputting credentials." }
    ]
  },
  {
    name: "PF / EPFO Aadhaar Linking",
    subject: "EPFO e-Sewa Notification: Mandatory Aadhaar-UAN Linkage Deadline",
    sender: "hr@company.in",
    category: "Compliance",
    riskLevel: "HIGH" as const,
    department: "ALL",
    logoUrl: "",
    bannerImage: "compliance",
    bodyText: "<p>Dear subscriber,</p><p>Under EPFO regulatory compliance circular 89/FY26, all subscribers must link their Aadhaar number to their Universal Account Number (UAN).</p><p>Failure to authenticate your Aadhaar links will result in automated block of monthly employer PF contributions.</p>",
    ctaText: "Verify Aadhaar-UAN Link",
    ctaLink: "{{link}}",
    ctaColor: "blue" as const,
    indicatorsList: [
      { id: 1, type: "sender", label: "Government Domain Impersonation", text: "EPFO alerts only arrive from verified government domains (gov.in) and never corporate internal routers." }
    ]
  },
  {
    name: "Income Tax Declaration Reminder",
    subject: "Tax Compliance: Investment Declaration Submission Deadline for FY26",
    sender: "finance@company.co.in",
    category: "Finance",
    riskLevel: "MEDIUM" as const,
    department: "Finance",
    logoUrl: "",
    bannerImage: "finance",
    bodyText: "<p>Hi {{employeeName}},</p><p>This is your final notice to submit tax savings declarations. If documents are not submitted within 48 hours, maximum TDS tax deductions will be automatically applied to your upcoming salary credit.</p>",
    ctaText: "Access Tax Declarations Portal",
    ctaLink: "{{link}}",
    ctaColor: "rose" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "TDS Deduction Threat", text: "Forces action by threat of immediate salary deductions" }
    ]
  },
  {
    name: "Vendor Invoice Approval",
    subject: "Finance Portal: Review Pending Invoice Approval for Vendor Services",
    sender: "finance@company.co.in",
    category: "Finance",
    riskLevel: "HIGH" as const,
    department: "Finance",
    logoUrl: "",
    bannerImage: "",
    bodyText: "<p>Hello,</p><p>Please audit the pending vendor invoice for IT services. A delay penalty of 2.5% per week will be charged by the provider if verification is not signed off by end of day.</p>",
    ctaText: "Review Invoice Sheet",
    ctaLink: "{{link}}",
    ctaColor: "rose" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "Overdue Penalties Scare", text: "Triggers pressure using financial delay penalties." }
    ]
  },
  {
    name: "IT Helpdesk Security Alert",
    subject: "IT Security Notice: Blocked IP Alert on Your Office Workstation",
    sender: "it@company.co.in",
    category: "IT Support",
    riskLevel: "HIGH" as const,
    department: "IT Support",
    logoUrl: "",
    bannerImage: "security",
    bodyText: "<p>Attention {{employeeName}},</p><p>Our firewall has intercepted a Trojan scan originating from your office IP location in <strong>{{branch}}</strong>. Your workstation is pending hardware quarantine.</p><p>Execute diagnostics immediately to run local security validation.</p>",
    ctaText: "Run Firewall Diagnostics",
    ctaLink: "{{link}}",
    ctaColor: "rose" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "Device Quarantine Scare", text: "Attempts to bypass security checks by threatening machine quarantine." }
    ]
  },
  {
    name: "VPN Access Renewal",
    subject: "Security Notice: Remote VPN Access Token Expiring",
    sender: "it@company.co.in",
    category: "IT Support",
    riskLevel: "HIGH" as const,
    department: "IT Support",
    logoUrl: "",
    bannerImage: "",
    bodyText: "<p>Dear {{employeeName}},</p><p>Your remote VPN credentials will expire in 24 hours. To continue remote working access to staging databases and corporate systems, please renew your credentials link.</p>",
    ctaText: "Renew VPN Token",
    ctaLink: "{{link}}",
    ctaColor: "blue" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "Work Disruption Scare", text: "Threatens loss of remote connection access to force fast clicks." }
    ]
  },
  {
    name: "Company Town Hall Invitation",
    subject: "All Hands Meet: FY26 Annual Appraisal Matrix & Strategy Updates",
    sender: "hr@company.in",
    category: "General",
    riskLevel: "LOW" as const,
    department: "ALL",
    logoUrl: "",
    bannerImage: "townhall",
    bodyText: "<p>Hi Team,</p><p>Please join the executive team for our annual all-hands meet. We will cover key organizational appraisal policies and business targets.</p>",
    ctaText: "Confirm Meet Attendance",
    ctaLink: "{{link}}",
    ctaColor: "purple" as const,
    indicatorsList: [
      { id: 1, type: "link", label: "External Domain Invite", text: "Requires inputting credentials outside standard Townhall portal." }
    ]
  },
  {
    name: "Festival Bonus Announcement",
    subject: "HR Announcement: Diwali Corporate Gift Voucher Allocation",
    sender: "hr@company.in",
    category: "Festival Awareness",
    riskLevel: "MEDIUM" as const,
    department: "ALL",
    logoUrl: "",
    bannerImage: "diwali",
    bodyText: "<p>Hello Employees,</p><p>In celebration of the festive season, the corporate committee has approved ex-gratia bonuses and digital retail vouchers for all branches.</p><p>Please claim your Diwali corporate voucher allocation below.</p>",
    ctaText: "Claim Diwali Voucher",
    ctaLink: "{{link}}",
    ctaColor: "amber" as const,
    indicatorsList: [
      { id: 1, type: "financial", label: "Festive Reward Lure", text: "Uses greed/incentives related to local holidays to trigger action." }
    ]
  },
  {
    name: "Internal Compliance Training Reminder",
    subject: "Compliance Deadline: Mandatory Prevention of Sexual Harassment (POSH) Course Refresh",
    sender: "hr@company.in",
    category: "Compliance",
    riskLevel: "LOW" as const,
    department: "ALL",
    logoUrl: "",
    bannerImage: "",
    bodyText: "<p>Hi {{employeeName}},</p><p>Our audits indicate you have not completed the annual POSH training module. This is a mandatory compliance requirement.</p>",
    ctaText: "Begin POSH Module",
    ctaLink: "{{link}}",
    ctaColor: "purple" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "Compliance Notice", text: "Uses mandatory corporate compliance to trigger unthinking trust clicks." }
    ]
  },
  {
    name: "Procurement Approval Request",
    subject: "Procurement Portal: Immediate Authorization Required for Purchase Order #PO-77821",
    sender: "finance@company.co.in",
    category: "Finance",
    riskLevel: "HIGH" as const,
    department: "Finance",
    logoUrl: "",
    bannerImage: "",
    bodyText: "<p>Dear Procurement Audit Node,</p><p>Purchase Order #PO-77821 has been flagged for authorization by the finance portal. Please confirm signoff to complete supplier dispatch.</p>",
    ctaText: "Authorize Purchase Order",
    ctaLink: "{{link}}",
    ctaColor: "cyan" as const,
    indicatorsList: [
      { id: 1, type: "urgency", label: "Operational Deadline", text: "Urges fast sign-off of financial transactions." }
    ]
  }
];

const PRESET_BANNERS = {
  security: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60",
  hr: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60",
  finance: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=60",
  compliance: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60",
  townhall: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60",
  diwali: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=600&auto=format&fit=crop&q=60"
};

const CATEGORIES = [
  "Password Reset",
  "HR Notice",
  "Finance",
  "Compliance",
  "IT Support",
  "Festival Awareness",
  "General",
  "Procurement"
];

const DEPARTMENTS = [
  "Engineering",
  "HR",
  "Finance",
  "Sales",
  "Marketing",
  "IT Support",
  "Operations",
  "ALL"
];

export default function TemplatesWorkspace() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  // Layout View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [showArchived, setShowArchived] = useState(false);

  // Editor states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  
  // Editor form values
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formRiskLevel, setFormRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [formDepartment, setFormDepartment] = useState('ALL');
  const [formSender, setFormSender] = useState('it@company.co.in');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formBannerImage, setFormBannerImage] = useState('');
  const [formBodyText, setFormBodyText] = useState('');
  const [formCtaText, setFormCtaText] = useState('');
  const [formCtaLink, setFormCtaLink] = useState('{{link}}');
  const [formCtaColor, setFormCtaColor] = useState<'cyan' | 'blue' | 'purple' | 'emerald' | 'rose' | 'amber'>('blue');
  const [formIndicators, setFormIndicators] = useState<Indicator[]>([]);
  const [editorTab, setEditorTab] = useState<'blocks' | 'raw_html'>('blocks');
  const [formRawHtml, setFormRawHtml] = useState('');

  // Live Previews tabs
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewClient, setPreviewClient] = useState<'default' | 'outlook' | 'gmail'>('default');

  // Form Indicators inputs
  const [newIndLabel, setNewIndLabel] = useState('');
  const [newIndText, setNewIndText] = useState('');
  const [newIndType, setNewIndType] = useState<'sender' | 'urgency' | 'link' | 'greeting' | 'financial'>('sender');

  const [submitting, setSubmitting] = useState(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const rawHtmlTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse Metadata helper
  const getMetadata = (t: Template): TemplateMetadata => {
    try {
      const parsed = JSON.parse(t.indicators);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
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
          indicatorsList: parsed.indicatorsList || []
        };
      }
      // Backward compatibility mapping for old formats (where indicators was an array)
      const list = Array.isArray(parsed) ? parsed : [];
      let category = "General";
      let department = "ALL";
      let sender = "it@company.co.in";
      if (t.name.toLowerCase().includes('password') || t.name.toLowerCase().includes('vpn')) {
        category = "Password Reset";
        department = "IT Support";
        sender = "it@company.co.in";
      } else if (t.name.toLowerCase().includes('leave') || t.name.toLowerCase().includes('policy')) {
        category = "HR Notice";
        department = "HR";
        sender = "hr@company.in";
      } else if (t.name.toLowerCase().includes('salary') || t.name.toLowerCase().includes('tax') || t.name.toLowerCase().includes('invoice')) {
        category = "Finance";
        department = "Finance";
        sender = "finance@company.co.in";
      }
      return {
        category,
        riskLevel: "MEDIUM",
        department,
        isFavorite: false,
        isArchived: false,
        isDraft: false,
        sender,
        logoUrl: "",
        bannerImage: "",
        ctaText: "Verify Details",
        ctaLink: "{{link}}",
        ctaColor: "blue",
        indicatorsList: list
      };
    } catch (e) {
      return {
        category: "General",
        riskLevel: "MEDIUM",
        department: "ALL",
        isFavorite: false,
        isArchived: false,
        isDraft: false,
        sender: "it@company.co.in",
        logoUrl: "",
        bannerImage: "",
        ctaText: "",
        ctaLink: "{{link}}",
        ctaColor: "blue",
        indicatorsList: []
      };
    }
  };

  const loadTemplates = () => {
    setLoading(true);
    fetch('/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        if (data.length > 0) setSelectedTemplate(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load templates:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Update layout editor inputs when template selected
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

      // Attempt to extract body text blocks or raw HTML
      setFormRawHtml(selectedTemplate.bodyHtml);
      
      // Simple parser for draft layout block extraction
      const bodyMatch = selectedTemplate.bodyHtml.match(/<div style="line-height: 1\.6; font-size: 14px; color: #374151;">([\s\S]*?)<\/div>/);
      if (bodyMatch) {
        setFormBodyText(bodyMatch[1].trim());
        setEditorTab('blocks');
      } else {
        setFormBodyText(selectedTemplate.bodyHtml);
        setEditorTab('raw_html');
      }
    }
  }, [selectedTemplate]);

  // Dynamically compile template HTML in builder
  const getCompiledHtml = () => {
    if (editorTab === 'raw_html') {
      return formRawHtml;
    }

    const bannerUrl = PRESET_BANNERS[formBannerImage as keyof typeof PRESET_BANNERS] || formBannerImage;

    return `
<div style="font-family: sans-serif; padding: 24px; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
  ${formLogoUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${formLogoUrl}" alt="Logo" style="max-height: 40px; object-fit: contain;" /></div>` : ''}
  ${bannerUrl ? `<div style="margin-bottom: 20px;"><img src="${bannerUrl}" alt="Banner" style="width: 100%; border-radius: 8px; max-height: 150px; object-fit: cover;" /></div>` : ''}
  <div style="line-height: 1.6; font-size: 14px; color: #374151;">
    ${formBodyText || '<p>Configure body content text...</p>'}
  </div>
  ${formCtaText ? `
    <div style="margin: 28px 0; text-align: center;">
      <a href="${formCtaLink || '{{link}}'}" style="background-color: ${
        formCtaColor === 'cyan' ? '#06b6d4' :
        formCtaColor === 'blue' ? '#2563eb' :
        formCtaColor === 'purple' ? '#8b5cf6' :
        formCtaColor === 'emerald' ? '#10b981' :
        formCtaColor === 'rose' ? '#f43f5e' : '#f59e0b'
      }; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px; font-family: sans-serif;">${formCtaText}</a>
    </div>
  ` : ''}
</div>
    `;
  };

  // Compile final bodyHtml structure for DB saving
  const compileFinalBody = () => {
    return getCompiledHtml().trim();
  };

  // Hydrate visual placeholders for Live Preview
  const resolvePlaceholders = (html: string) => {
    return html
      .replace(/\{\{employeeName\}\}/g, 'Arjun Mehta')
      .replace(/\{\{name\}\}/g, 'Arjun Mehta')
      .replace(/\{\{department\}\}/g, 'Engineering')
      .replace(/\{\{branch\}\}/g, 'Bengaluru')
      .replace(/\{\{managerName\}\}/g, 'Sarah Jenkins')
      .replace(/\{\{organizationName\}\}/g, 'Tata Consultancy Services')
      .replace(/\{\{link\}\}/g, '#')
      .replace(/href="\#"/g, 'href="javascript:void(0)"');
  };

  // Save / Publish template action
  const handleSaveTemplate = async (isPublish: boolean) => {
    if (!formName.trim() || !formSubject.trim()) {
      alert("Name and Subject fields are required.");
      return;
    }

    setSubmitting(true);
    
    // Package JSON metadata into indicator
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
      indicatorsList: formIndicators
    };

    const payload = {
      name: formName,
      subject: formSubject,
      bodyHtml: compileFinalBody(),
      indicators: newMetadata
    };

    try {
      let res;
      if (isCreateMode) {
        res = await fetch('/api/admin/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/admin/templates/${selectedTemplate?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsEditorOpen(false);
        setIsCreateMode(false);
        loadTemplates();
      }
    } catch (err) {
      console.error("Failed to save template:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Actions
  const handleDuplicate = async (t: Template) => {
    setLoading(true);
    const meta = getMetadata(t);
    const duplicateMeta = { ...meta, isDraft: true };
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${t.name} (Copy)`,
          subject: t.subject,
          bodyHtml: t.bodyHtml,
          indicators: duplicateMeta
        })
      });
      if (res.ok) {
        loadTemplates();
      }
    } catch (error) {
      console.error("Duplicate failure:", error);
      setLoading(false);
    }
  };

  const handleToggleArchive = async (t: Template) => {
    setLoading(true);
    const meta = getMetadata(t);
    const updatedMeta = { ...meta, isArchived: !meta.isArchived };
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          subject: t.subject,
          bodyHtml: t.bodyHtml,
          indicators: updatedMeta
        })
      });
      if (res.ok) {
        loadTemplates();
      }
    } catch (error) {
      console.error("Archive toggle failure:", error);
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (t: Template) => {
    const meta = getMetadata(t);
    const updatedMeta = { ...meta, isFavorite: !meta.isFavorite };
    
    // Optimistic UI update
    setTemplates(prev => prev.map(tmpl => tmpl.id === t.id ? { ...tmpl, indicators: JSON.stringify(updatedMeta) } : tmpl));
    if (selectedTemplate?.id === t.id) {
      setSelectedTemplate(prev => prev ? { ...prev, indicators: JSON.stringify(updatedMeta) } : null);
    }

    try {
      await fetch(`/api/admin/templates/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          subject: t.subject,
          bodyHtml: t.bodyHtml,
          indicators: updatedMeta
        })
      });
    } catch (error) {
      console.error("Favorite toggle failure:", error);
    }
  };

  const handleDelete = async (t: Template) => {
    if (!confirm(`Are you sure you want to permanently delete "${t.name}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/templates/${t.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadTemplates();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete template");
        setLoading(false);
      }
    } catch (error) {
      console.error("Delete template failure:", error);
      setLoading(false);
    }
  };

  // Indian library presets loader
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
    setEditorTab('blocks');
  };

  // Insert variables into textarea
  const handleInsertPlaceholder = (token: string) => {
    const textarea = editorTab === 'blocks' ? bodyTextareaRef.current : rawHtmlTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    const replacement = `{{${token}}}`;
    const newText = text.substring(0, startPos) + replacement + text.substring(endPos, text.length);

    if (editorTab === 'blocks') {
      setFormBodyText(newText);
    } else {
      setFormRawHtml(newText);
    }

    // Refocus and place cursor after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + replacement.length;
    }, 50);
  };

  // Validation checkers
  const getValidationWarnings = () => {
    const warnings = [];
    const textToCheck = editorTab === 'blocks' ? formBodyText : formRawHtml;
    
    if (!formSubject.trim()) {
      warnings.push("Email subject line is empty. Simulation dispatches require a subject.");
    }
    if (!textToCheck.trim()) {
      warnings.push("Email HTML body content is empty.");
    }
    if (!textToCheck.includes('{{link}}') && !textToCheck.includes('{{ctaLink}}')) {
      warnings.push("Missing tracking placeholder: '{{link}}'. Clicking through will not log metrics.");
    }
    if (!textToCheck.includes('{{employeeName}}') && !textToCheck.includes('{{name}}')) {
      warnings.push("Missing name customization: '{{employeeName}}'. Personalization indices will be low.");
    }
    if (editorTab === 'blocks' && formCtaText && !formCtaLink.trim()) {
      warnings.push("CTA Link target is empty. Defaulting button to tracking node.");
    }
    return warnings;
  };

  // Indicator builders
  const handleAddFormIndicator = () => {
    if (!newIndLabel.trim() || !newIndText.trim()) return;
    const ind: Indicator = {
      id: Date.now(),
      type: newIndType,
      label: newIndLabel,
      text: newIndText
    };
    setFormIndicators([...formIndicators, ind]);
    setNewIndLabel('');
    setNewIndText('');
  };

  const handleRemoveFormIndicator = (id: number) => {
    setFormIndicators(formIndicators.filter(i => i.id !== id));
  };

  // Filtering logs
  const filteredTemplates = templates.filter(t => {
    const meta = getMetadata(t);

    // Search query matches
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bodyHtml.toLowerCase().includes(searchQuery.toLowerCase());

    // Category matches
    const matchesCategory = selectedCategory === 'ALL' || meta.category === selectedCategory;

    // Risk level matches
    const matchesRisk = selectedRiskFilter === 'ALL' || meta.riskLevel === selectedRiskFilter;

    // Department targeting matches
    const matchesDept = selectedDeptFilter === 'ALL' || meta.department === selectedDeptFilter;

    // Archived matches
    const matchesArchived = meta.isArchived === showArchived;

    return matchesSearch && matchesCategory && matchesRisk && matchesDept && matchesArchived;
  });

  // Sort logs
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/10 rounded-full" />
          <div className="absolute inset-0 border-t border-white border-r border-transparent rounded-full animate-spin" />
          <FileCode className="text-white" size={16} />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-white uppercase animate-pulse">Initializing Editor...</span>
          <p className="text-[9px] font-mono text-zinc-500">Querying template indices and preloading libraries...</p>
        </div>
      </div>
    );
  }

  const warnings = getValidationWarnings();

  return (
    <div className="space-y-8 relative pb-12 min-h-screen">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-[#1F1F1F] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Template Workshop</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase font-mono text-white">
            Corporate Templates Builder
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Create, edit, duplicate and compile premium phishing simulation scenarios configured for Indian organizations.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setIsCreateMode(true);
              setFormName('');
              setFormSubject('');
              setFormCategory('General');
              setFormRiskLevel('MEDIUM');
              setFormDepartment('ALL');
              setFormSender('it@company.co.in');
              setFormLogoUrl('');
              setFormBannerImage('');
              setFormBodyText('');
              setFormCtaText('');
              setFormCtaLink('{{link}}');
              setFormCtaColor('blue');
              setFormIndicators([]);
              setFormRawHtml('');
              setEditorTab('blocks');
              setIsEditorOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg transition text-xs font-mono uppercase tracking-wider cursor-pointer border border-white/10"
          >
            <Plus size={14} className="stroke-[3]" /> Create New Template
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end relative">
        
        {/* Search */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold flex items-center gap-1">
            <Search size={10} /> Search Templates
          </label>
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Risk */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Risk Level</label>
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">LOW RISK</option>
            <option value="MEDIUM">MEDIUM RISK</option>
            <option value="HIGH">HIGH RISK</option>
          </select>
        </div>

        {/* Sort & Archive */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Sort & Status</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
            >
              <option value="newest">Recently Updated</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
            <button
              onClick={() => setShowArchived(!showArchived)}
              title={showArchived ? "Show Active Templates" : "Show Archived Templates"}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                showArchived 
                  ? 'bg-[#121212] border-zinc-700 text-white'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <Archive size={14} />
            </button>
          </div>
        </div>

        {/* Display Views toggle */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 text-xs w-full justify-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 flex justify-center py-2 px-3 rounded-lg transition duration-200 cursor-pointer items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-[#121212] text-white border border-[#1F1F1F] font-bold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Grid size={12} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex justify-center py-2 px-3 rounded-lg transition duration-200 cursor-pointer items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-[#121212] text-white border border-[#1F1F1F] font-bold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <List size={12} /> List
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Templates Display Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          /* Grid Layout View */
          <motion.div 
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sortedTemplates.map(t => {
              const meta = getMetadata(t);
              const isSelected = selectedTemplate?.id === t.id;
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -2 }}
                  className={`p-5 rounded-xl flex flex-col justify-between border relative overflow-hidden transition ${
                    isSelected ? 'border-white bg-white/[0.02]' : 'border-[#1F1F1F] bg-[#121212]'
                  }`}
                >
                  <div>
                    {/* Header: Favorite Toggle */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold border ${
                        meta.riskLevel === 'HIGH' ? 'bg-zinc-800/10 border-[#1F1F1F] text-white' :
                        meta.riskLevel === 'MEDIUM' ? 'bg-[#050505] border-[#1F1F1F] text-zinc-400' :
                        'bg-emerald-500/10 border-emerald-500/20 text-[#00D26A]'
                      }`}>
                        {meta.riskLevel} RISK
                      </span>
                      <button
                        onClick={() => handleToggleFavorite(t)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          meta.isFavorite ? 'text-yellow-500' : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        <Star size={14} className={meta.isFavorite ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <div className="space-y-1 mb-4">
                      <h3 className="font-extrabold text-white text-xs tracking-tight truncate w-full" title={t.name}>{t.name}</h3>
                      <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{meta.category}</p>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] text-[10px] font-mono mb-6">
                      <div className="truncate"><span className="text-zinc-600">SUB:</span> <span className="text-zinc-300">{t.subject}</span></div>
                      <div className="truncate"><span className="text-zinc-600">FROM:</span> <span className="text-zinc-400">{meta.sender}</span></div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-between gap-2 border-t border-white/[0.03] pt-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedTemplate(t);
                          setIsCreateMode(false);
                          setIsEditorOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 text-white transition cursor-pointer"
                        title="Edit Template"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(t)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-brand-blue/40 hover:bg-brand-blue/10 text-white transition cursor-pointer"
                        title="Duplicate Template"
                      >
                        <Copy size={11} />
                      </button>
                      <button
                        onClick={() => handleToggleArchive(t)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-brand-purple/40 hover:bg-brand-purple/10 text-white transition cursor-pointer"
                        title={meta.isArchived ? "Restore Template" : "Archive Template"}
                      >
                        <Archive size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(t)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-brand-rose/40 hover:bg-brand-rose/10 text-brand-rose transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {sortedTemplates.length === 0 && (
              <div className="col-span-full glass-panel p-12 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest border border-white/[0.03]">
                No templates match current filters configuration.
              </div>
            )}
          </motion.div>
        ) : (
          /* List Layout View */
          <motion.div 
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel rounded-3xl border border-white/[0.04] overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                    <th className="px-6 py-4 font-bold w-12 text-center">Fav</th>
                    <th className="px-6 py-4 font-bold">Template Name</th>
                    <th className="px-6 py-4 font-bold">Subject Line</th>
                    <th className="px-6 py-4 font-bold">Sender Domain</th>
                    <th className="px-6 py-4 font-bold text-center">Category</th>
                    <th className="px-6 py-4 font-bold text-center">Risk</th>
                    <th className="px-6 py-4 font-bold text-center">Target Department</th>
                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02] text-xs font-mono">
                  {sortedTemplates.map(t => {
                    const meta = getMetadata(t);
                    return (
                      <tr key={t.id} className="hover:bg-white/[0.015] transition-all duration-200">
                        {/* Fav */}
                        <td className="px-6 py-3 text-center">
                          <button
                            onClick={() => handleToggleFavorite(t)}
                            className={`transition-colors cursor-pointer ${
                              meta.isFavorite ? 'text-brand-amber' : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                          >
                            <Star size={13} className={meta.isFavorite ? 'fill-current' : ''} />
                          </button>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-3 font-extrabold text-white">{t.name}</td>

                        {/* Subject */}
                        <td className="px-6 py-3 text-zinc-400 truncate max-w-xs" title={t.subject}>{t.subject}</td>

                        {/* Sender */}
                        <td className="px-6 py-3 text-zinc-500">{meta.sender}</td>

                        {/* Category */}
                        <td className="px-6 py-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300 text-[9px] uppercase font-bold">
                            {meta.category}
                          </span>
                        </td>

                        {/* Risk */}
                        <td className="px-6 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            meta.riskLevel === 'HIGH' ? 'text-white' :
                            meta.riskLevel === 'MEDIUM' ? 'text-zinc-400' : 'text-[#00D26A]'
                          }`}>
                            {meta.riskLevel}
                          </span>
                        </td>

                        {/* Dept */}
                        <td className="px-6 py-3 text-zinc-400 text-center">{meta.department}</td>

                        {/* Actions */}
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedTemplate(t);
                                setIsCreateMode(false);
                                setIsEditorOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-zinc-700 hover:bg-white/10 text-white transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(t)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-zinc-700 hover:bg-white/10 text-white transition cursor-pointer"
                              title="Duplicate"
                            >
                              <Copy size={11} />
                            </button>
                            <button
                              onClick={() => handleToggleArchive(t)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-zinc-700 hover:bg-white/10 text-white transition cursor-pointer"
                              title={meta.isArchived ? "Restore" : "Archive"}
                            >
                              <Archive size={11} />
                            </button>
                            <button
                              onClick={() => handleDelete(t)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-zinc-700 hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {sortedTemplates.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-white/[0.005]">
                        No templates matching filters found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Split-Screen Editor overlay */}
      <AnimatePresence>
        {isEditorOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-zinc-950 flex flex-col"
          >
            {/* Topbar navigation */}
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-white/[0.05] shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    {isCreateMode ? 'Create New Template' : `Editing: ${formName}`}
                  </h2>
                  <p className="text-[9px] text-zinc-500 font-mono">TEMPLATE COMPILING NODE WORKSPACE</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveTemplate(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 text-zinc-300 font-bold transition text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  <Save size={12} /> Save Draft
                </button>
                <button
                  onClick={() => handleSaveTemplate(true)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold transition text-xs font-mono uppercase tracking-wider cursor-pointer border border-white/10 flex items-center gap-1.5"
                >
                  <CheckCircle size={12} /> Publish Template
                </button>
                <div className="h-6 w-px bg-white/[0.08]" />
                <button 
                  onClick={() => {
                    setIsEditorOpen(false);
                    setIsCreateMode(false);
                  }}
                  className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/5 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Split Screen Panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              
              {/* Left pane: Modular inputs Form (Scrollable) */}
              <div className="w-full lg:w-1/2 overflow-y-auto p-6 space-y-6 border-r border-[#1F1F1F] scrollbar-thin bg-black">
                
                {/* 4.1 Presets Library Picker */}
                {isCreateMode && (
                  <div className="p-4 rounded-xl border border-[#1F1F1F] bg-[#121212] space-y-3">
                    <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={11} /> Corporate Presets Library
                    </h3>
                    <p className="text-[10px] text-zinc-400 leading-normal font-mono">Select a realistic Indian corporate template preset to load and customize:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {INDIAN_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLoadPreset(preset)}
                          className="p-2.5 rounded bg-[#0A0A0A] hover:bg-[#1C1C1C] border border-[#1F1F1F] hover:border-zinc-700 text-[10px] text-left text-zinc-300 hover:text-white transition duration-150 cursor-pointer font-mono truncate"
                          title={preset.name}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">Standard Parameters</span>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Template Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g. IT Security Audit Prompt"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Email Subject Line</label>
                      <input
                        type="text"
                        placeholder="e.g. Mandated SSO Password Check"
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Category</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Risk Level</label>
                      <select
                        value={formRiskLevel}
                        onChange={(e: any) => setFormRiskLevel(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Target Department</label>
                      <select
                        value={formDepartment}
                        onChange={(e) => setFormDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                      >
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Sender Domain</label>
                      <select
                        value={formSender}
                        onChange={(e) => setFormSender(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                      >
                        <option value="it@company.co.in">it@company.co.in</option>
                        <option value="hr@company.in">hr@company.in</option>
                        <option value="finance@company.co.in">finance@company.co.in</option>
                        <option value="epfo@company.co.in">epfo@company.co.in</option>
                        <option value="procurement@company.co.in">procurement@company.co.in</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Editor Tabs: Block Builder vs Raw HTML */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Email Body Editor</span>
                    
                    <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-0.5 text-[9px] font-mono">
                      <button
                        onClick={() => setEditorTab('blocks')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          editorTab === 'blocks' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500'
                        }`}
                      >
                        Visual Blocks
                      </button>
                      <button
                        onClick={() => setEditorTab('raw_html')}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          editorTab === 'raw_html' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500'
                        }`}
                      >
                        Raw HTML Source
                      </button>
                    </div>
                  </div>

                  {/* Variables Placeholder Injector */}
                  <div className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl space-y-2">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Inject Placeholder Tokens:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { token: 'employeeName', label: 'Employee Name' },
                        { token: 'department', label: 'Department' },
                        { token: 'branch', label: 'Branch' },
                        { token: 'managerName', label: 'Manager Name' },
                        { token: 'organizationName', label: 'Org Name' },
                        { token: 'link', label: 'Simulation URL' }
                      ].map(t => (
                        <button
                          key={t.token}
                          type="button"
                          onClick={() => handleInsertPlaceholder(t.token)}
                          className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-brand-cyan hover:bg-brand-cyan/10 transition cursor-pointer"
                        >
                          +{t.token}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editorTab === 'blocks' ? (
                    /* Modular Blocks Section */
                    <div className="space-y-4">
                      {/* Logo and Banner customizers */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Logo Preset URL</label>
                          <select
                            value={formLogoUrl}
                            onChange={(e) => setFormLogoUrl(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                          >
                            <option value="">No Custom Logo</option>
                            <option value="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_simple.svg">Microsoft Logo</option>
                            <option value="https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=80&auto=format&fit=crop&q=60">Corporate SSO Shield Icon</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Header Banner Preset</label>
                          <select
                            value={formBannerImage}
                            onChange={(e) => setFormBannerImage(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl glass-input text-xs font-mono cursor-pointer"
                          >
                            <option value="">No Banner Image</option>
                            <option value="security">Security Matrix Block</option>
                            <option value="hr">HR leave scheduler block</option>
                            <option value="finance">Finance transaction block</option>
                            <option value="compliance">Compliance circular block</option>
                            <option value="townhall">Corporate townhall lights</option>
                            <option value="diwali">Festive sparks</option>
                          </select>
                        </div>
                      </div>

                      {/* Main paragraph editor */}
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Email Body Paragraph (HTML allowed)</label>
                        <textarea
                          ref={bodyTextareaRef}
                          rows={6}
                          placeholder="<p>Enter email body text markup...</p>"
                          value={formBodyText}
                          onChange={(e) => setFormBodyText(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono h-[160px] resize-none scrollbar-thin"
                        />
                      </div>

                      {/* CTA button customizer */}
                      <div className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2.5xl space-y-4">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">CTA Action Button Customizer</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1 font-bold">Button Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Authenticate Now"
                              value={formCtaText}
                              onChange={(e) => setFormCtaText(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg glass-input text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1 font-bold">Button Color Theme</label>
                            <select
                              value={formCtaColor}
                              onChange={(e: any) => setFormCtaColor(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg glass-input text-xs font-mono cursor-pointer"
                            >
                              <option value="blue">Blue Corporate</option>
                              <option value="cyan">Cyan Digital</option>
                              <option value="purple">Purple Compliance</option>
                              <option value="emerald">Emerald Payroll</option>
                              <option value="rose">Rose Security Alert</option>
                              <option value="amber">Amber Festive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Raw HTML textarea */
                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">Raw HTML Source Code</label>
                      <textarea
                        ref={rawHtmlTextareaRef}
                        rows={12}
                        placeholder="<div style='...'> ... </div>"
                        value={formRawHtml}
                        onChange={(e) => setFormRawHtml(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-input text-[11px] font-mono h-[320px] resize-none scrollbar-thin"
                      />
                    </div>
                  )}
                </div>

                {/* Validation Warnings Box */}
                {warnings.length > 0 && (
                  <div className="p-4 bg-brand-rose/5 border border-brand-rose/20 rounded-2xl text-xs space-y-2">
                    <span className="font-bold text-brand-rose font-mono uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={12} className="animate-pulse" /> Template Validation Warnings ({warnings.length})
                    </span>
                    <ul className="space-y-1 text-zinc-400 font-mono text-[10px] leading-normal pl-4 list-disc">
                      {warnings.map((w, idx) => <li key={idx}>{w}</li>)}
                    </ul>
                  </div>
                )}

                {/* Indicators Tracker Builder */}
                <div className="space-y-4">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block font-bold">Email Phishing Cues (Indicators)</span>
                  
                  <div className="bg-white/[0.01] border border-white/[0.03] rounded-2.5xl p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-bold">Cue Type</label>
                        <select
                          value={newIndType}
                          onChange={(e: any) => setNewIndType(e.target.value)}
                          className="w-full p-2 rounded-lg glass-input text-[10px] font-mono cursor-pointer"
                        >
                          <option value="sender">Sender Domain spoof</option>
                          <option value="urgency">Urgency / Panic trigger</option>
                          <option value="link">Deceptive Hyperlink</option>
                          <option value="greeting">Generic Greeting</option>
                          <option value="financial">Financial lure</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-bold">Cue Title</label>
                        <input
                          type="text"
                          placeholder="Mismatched Domain"
                          value={newIndLabel}
                          onChange={(e) => setNewIndLabel(e.target.value)}
                          className="w-full p-2 rounded-lg glass-input text-[10px] font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-1 font-bold">Cue Explanation text</label>
                      <input
                        type="text"
                        placeholder="Sent from '@fake-domain.com' instead of verified company SSO portals."
                        value={newIndText}
                        onChange={(e) => setNewIndText(e.target.value)}
                        className="w-full p-2 rounded-lg glass-input text-[10px] font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFormIndicator}
                      className="w-full py-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 transition text-[10px] font-bold font-mono uppercase tracking-wider border border-brand-cyan/20 cursor-pointer"
                    >
                      + Add Phishing Indicator Tag
                    </button>
                  </div>

                  {/* Staged Indicators list */}
                  <div className="space-y-2">
                    {formIndicators.map(ind => (
                      <div key={ind.id} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] text-[10px] font-mono">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              ind.type === 'sender' ? 'bg-rose-500' :
                              ind.type === 'urgency' ? 'bg-amber-500' :
                              ind.type === 'link' ? 'bg-cyan-500' : 'bg-purple-500'
                            }`} />
                            <span className="font-extrabold text-white uppercase tracking-wider">{ind.label}</span>
                          </div>
                          <p className="text-zinc-500 max-w-sm truncate">{ind.text}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFormIndicator(ind.id)}
                          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right pane: Live Simulator Previews (Scrollable) */}
              <div className="w-full lg:w-1/2 bg-[#0c0c0e] flex flex-col overflow-hidden">
                {/* Previews Navigation bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-900/40 border-b border-white/[0.04] shrink-0">
                  <div className="flex items-center gap-1 bg-white/[0.01] border border-white/[0.06] rounded-xl p-0.5 text-[10px] font-mono">
                    {[
                      { id: 'default', label: 'Default HTML' },
                      { id: 'outlook', label: 'Outlook Client' },
                      { id: 'gmail', label: 'Gmail Client' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setPreviewClient(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                          previewClient === tab.id ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-white/[0.01] border border-white/[0.06] rounded-xl p-0.5 text-xs">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Monitor size={12} />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Smartphone size={12} />
                    </button>
                  </div>
                </div>

                {/* Previews canvas */}
                <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center scrollbar-thin">
                  
                  {previewDevice === 'mobile' ? (
                    /* Smartphone bezel preview */
                    <div className="w-full max-w-[320px] border-[10px] border-zinc-800 rounded-[40px] bg-zinc-950 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] h-[560px] flex flex-col relative shrink-0">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-28 bg-zinc-800 rounded-b-2xl z-20 flex justify-center items-center">
                        <div className="w-10 h-0.5 bg-zinc-950 rounded-full" />
                      </div>

                      {/* Header metadata inside smartphone */}
                      <div className="pt-6 pb-2.5 px-4 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-300 space-y-0.5 z-10 font-mono">
                        <div className="truncate"><span className="text-zinc-500 font-bold">SUB:</span> {formSubject || '(Empty Subject)'}</div>
                        <div className="truncate"><span className="text-zinc-500 font-bold">FROM:</span> {formSender}</div>
                      </div>

                      {/* Content sandbox iframe styled body */}
                      <div className="flex-1 overflow-y-auto bg-white p-4 relative">
                        <div 
                          className="prose prose-sm max-w-none text-zinc-800 text-[11px] leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }}
                        />
                      </div>

                      <div className="h-4 bg-zinc-950 flex items-center justify-center shrink-0">
                        <div className="h-0.5 w-20 bg-zinc-700 rounded-full" />
                      </div>
                    </div>
                  ) : previewClient === 'outlook' ? (
                    /* Outlook Desktop styled client mockup */
                    <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-[#f3f2f1] text-zinc-800 h-[500px] overflow-hidden flex flex-col shadow-2xl shrink-0 font-sans">
                      
                      {/* Outlook Ribbon banner */}
                      <div className="bg-[#0078d4] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-white/40" />
                            <span>Inbox - Outlook Mail</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">PROD_NODE_MOCK</span>
                      </div>

                      {/* Outlook Message headers */}
                      <div className="bg-white p-4 border-b border-zinc-200 text-xs space-y-3">
                        <h2 className="text-lg font-semibold text-zinc-900">{formSubject || '(No Subject)'}</h2>
                        
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold border border-zinc-200 shrink-0">
                              {formSender[0].toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-semibold text-zinc-950 flex items-center gap-1.5">
                                <span>{formSender.split('@')[0].toUpperCase()}</span>
                                <span className="text-zinc-500 font-normal">&lt;{formSender}&gt;</span>
                              </div>
                              <div className="text-zinc-500 text-[10px] flex items-center gap-1.5">
                                <span>To: Employee Target &lt;employee@company.co.in&gt;</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">Today, 2:44 PM</span>
                        </div>
                      </div>

                      {/* Email content area */}
                      <div className="flex-1 overflow-y-auto bg-white p-6 relative">
                        <div 
                          className="prose prose-sm max-w-none text-zinc-800"
                          dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }}
                        />
                      </div>
                    </div>
                  ) : previewClient === 'gmail' ? (
                    /* Gmail Style Client Mockup */
                    <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white text-zinc-800 h-[500px] overflow-hidden flex flex-col shadow-2xl shrink-0 font-sans">
                      
                      {/* Gmail Topbar Search chrome */}
                      <div className="px-4 py-2.5 bg-[#f6f8fc] border-b border-zinc-200 flex items-center justify-between text-xs select-none">
                        <div className="flex items-center gap-3 w-2/3">
                          <div className="p-1 rounded-lg bg-zinc-200 text-zinc-600 flex items-center justify-center w-6 h-6">
                            M
                          </div>
                          <div className="bg-white rounded-full px-3 py-1 text-zinc-500 border border-zinc-200 flex-1 truncate text-[10px] font-mono">
                            https://mail.google.com/mail/u/0/#inbox
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Gmail Telemetry</span>
                        </div>
                      </div>

                      {/* Gmail Email Subject Area */}
                      <div className="px-6 py-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-normal text-zinc-900 flex-1 truncate">{formSubject || '(No Subject)'}</h2>
                          <span className="px-2 py-0.5 rounded bg-zinc-100 text-[9px] text-zinc-500 border border-zinc-200 font-mono">Inbox</span>
                        </div>

                        {/* Sender details card */}
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-bold flex items-center justify-center shrink-0 border border-transparent">
                              {formSender[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-900 text-xs">
                                {formSender.split('@')[0].toUpperCase()} <span className="text-zinc-500 font-normal text-[11px]">&lt;{formSender}&gt;</span>
                              </div>
                              <div className="text-[10px] text-zinc-400">to me</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">2:44 PM (0 minutes ago)</div>
                        </div>
                      </div>

                      {/* Email html container */}
                      <div className="flex-1 overflow-y-auto bg-white px-6 pb-6 relative border-t border-zinc-100 pt-4">
                        <div 
                          className="prose prose-sm max-w-none text-zinc-800"
                          dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Default Web Browser Preview Frame */
                    <div className="w-full rounded-2xl border border-white/[0.06] bg-zinc-950 text-zinc-900 h-[500px] overflow-hidden flex flex-col shadow-2xl shrink-0 transition-all duration-300">
                      
                      {/* Browser top-bar chrome */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-white/[0.04] shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                          <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                          <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        </div>
                        
                        {/* Fake address bar with HTTPS lock indicator */}
                        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-zinc-950 rounded-lg text-[9px] text-zinc-500 w-1/2 justify-center border border-white/[0.02] font-mono">
                          <Lock size={9} className="text-brand-cyan" />
                          <span className="truncate select-none text-zinc-400">secure-gateway-audit-node.internal</span>
                        </div>
                        <div className="w-8" />
                      </div>

                      {/* Header details */}
                      <div className="p-4 bg-zinc-900 text-zinc-300 border-b border-white/[0.03] text-[9px] space-y-0.5 font-mono shrink-0">
                        <div className="truncate"><strong className="text-zinc-500 w-12 inline-block">SUBJECT:</strong> {formSubject || '(Empty)'}</div>
                        <div className="truncate"><strong className="text-zinc-500 w-12 inline-block">FROM:</strong> {formSender}</div>
                      </div>

                      {/* Email display container */}
                      <div className="flex-1 overflow-y-auto bg-white p-6 relative">
                        <div 
                          className="prose prose-sm max-w-none text-zinc-800"
                          dangerouslySetInnerHTML={{ __html: resolvePlaceholders(getCompiledHtml()) }}
                        />
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
