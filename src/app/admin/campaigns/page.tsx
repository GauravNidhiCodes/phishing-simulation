'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Calendar, 
  CheckCircle, 
  Folder, 
  Plus, 
  X, 
  AlertTriangle,
  Play,
  Square,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Layers,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  User,
  Check,
  Eye,
  AlertCircle,
  Sliders,
  UserCheck,
  ShieldAlert,
  Building,
  MapPin,
  CheckSquare
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  template: { name: string; subject: string };
  scheduledStart: string | null;
  startedAt: string | null;
  completedAt: string | null;
  description?: string | null;
  category?: string | null;
  riskLevel?: string | null;
  organizationName?: string | null;
  branches?: string | null;
  departments?: string | null;
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

const INDIAN_BRANCHES = [
  'Pune', 
  'Bengaluru', 
  'Hyderabad', 
  'Mumbai', 
  'Delhi', 
  'Chennai', 
  'Kolkata'
];

const DEPARTMENTS = [
  'Engineering', 
  'HR', 
  'Finance', 
  'Sales', 
  'Marketing', 
  'Operations', 
  'IT Support'
];

const CATEGORIES = [
  'Password Reset', 
  'HR Notice', 
  'IT Support', 
  'Finance', 
  'Compliance', 
  'Festival Awareness'
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  // Wizard Step State
  const [step, setStep] = useState(1);

  // Success Confirmation State
  const [createdCampaignDetails, setCreatedCampaignDetails] = useState<{
    id: string;
    name: string;
    scheduledTime: string;
    targetCount: number;
    category: string;
    riskLevel: string;
    templateName: string;
  } | null>(null);

  // STEP 1 Form states
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [businessUnit, setBusinessUnit] = useState('Engineering');
  const [organizationName, setOrganizationName] = useState('Acme India Corp');
  const [campaignCategory, setCampaignCategory] = useState('Password Reset');
  const [riskLevel, setRiskLevel] = useState('MEDIUM');
  
  // STEP 2 Target Audience states
  const [selectedDeptFilters, setSelectedDeptFilters] = useState<string[]>([]);
  const [selectedBranchFilters, setSelectedBranchFilters] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  // STEP 3 Template states
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // STEP 4 Schedule states
  const [dispatchType, setDispatchType] = useState<'IMMEDIATE' | 'SCHEDULED'>('IMMEDIATE');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Ethical check / Submit errors
  const [ethicsAcknowledge, setEthicsAcknowledge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    fetch('/api/admin/campaigns')
      .then(res => res.json())
      .then(data => {
        setCampaigns(data.campaigns || []);
        setTemplates(data.templates || []);
        setEmployees(data.employees || []);
        
        if (data.templates && data.templates.length > 0) {
          setSelectedTemplate(data.templates[0].id);
          setPreviewTemplate(data.templates[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Preset operations code names for Indian theme
  const generateIndianOpsName = () => {
    const prefixes = ['OP-DESI-SHIELD', 'OP-MONSOON-SEC', 'OP-CHAI-TAP', 'OP-DECCAN-GATE', 'OP-HIMALAYA-VORTEX'];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setCampaignName(`${prefixes[Math.floor(Math.random() * prefixes.length)]}-${randomNum}`);
  };

  const openWizard = () => {
    setStep(1);
    generateIndianOpsName();
    setCampaignDescription('Annual security readiness verification and spear phishing compliance check.');
    setBusinessUnit('Engineering');
    setOrganizationName('Acme India Corp');
    setCampaignCategory('Password Reset');
    setRiskLevel('MEDIUM');
    setSelectedDeptFilters([]);
    setSelectedBranchFilters([]);
    setSelectedUserIds([]);
    setEmployeeSearchTerm('');
    setTemplateSearchTerm('');
    setDispatchType('IMMEDIATE');
    setScheduleDate('');
    setScheduleTime('');
    setEthicsAcknowledge(false);
    setErrorMsg('');
    
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
      setPreviewTemplate(templates[0]);
    }
    setModalOpen(true);
  };

  // Filtered employees for Step 2 targeting preview
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDept = selectedDeptFilters.length === 0 || (emp.department && selectedDeptFilters.includes(emp.department));
      const matchesBranch = selectedBranchFilters.length === 0 || (emp.branch && selectedBranchFilters.includes(emp.branch));
      const matchesSearch = !employeeSearchTerm.trim() || 
        (emp.name && emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())) ||
        emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase());
      return matchesDept && matchesBranch && matchesSearch;
    });
  }, [employees, selectedDeptFilters, selectedBranchFilters, employeeSearchTerm]);

  // Synchronize target selections when filters change
  useEffect(() => {
    if (step === 2) {
      setSelectedUserIds(filteredEmployees.map(e => e.id));
    }
  }, [selectedDeptFilters, selectedBranchFilters, step]);

  const handleToggleDeptFilter = (dept: string) => {
    setSelectedDeptFilters(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleToggleBranchFilter = (branch: string) => {
    setSelectedBranchFilters(prev => 
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
  };

  const handleToggleUserSelect = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredEmployees.map(e => e.id);
    const allSelected = filteredIds.every(id => selectedUserIds.includes(id));
    if (allSelected) {
      setSelectedUserIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Validation routines per step
  const handleNextStep = () => {
    setErrorMsg('');
    
    if (step === 1) {
      if (!campaignName.trim()) {
        setErrorMsg('Campaign Name is required.');
        return;
      }
      // Duplicate campaign name check
      const nameExists = campaigns.some(c => c.name.toLowerCase().trim() === campaignName.toLowerCase().trim());
      if (nameExists) {
        setErrorMsg('A campaign with this name already exists in your registry.');
        return;
      }
      if (!campaignDescription.trim()) {
        setErrorMsg('Campaign Description is required.');
        return;
      }
      if (!organizationName.trim()) {
        setErrorMsg('Organization Name is required.');
        return;
      }
    }

    if (step === 2) {
      // Employee selection validation
      if (selectedUserIds.length === 0) {
        setErrorMsg('Employee selection validation failed: You must target at least 1 employee.');
        return;
      }
    }

    if (step === 3) {
      if (!selectedTemplate) {
        setErrorMsg('Please select an email template.');
        return;
      }
    }

    if (step === 4) {
      // Date/time validation for scheduled type
      if (dispatchType === 'SCHEDULED') {
        if (!scheduleDate || !scheduleTime) {
          setErrorMsg('Please select both date and time for the scheduled release.');
          return;
        }
        const selectedDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        if (isNaN(selectedDateTime.getTime()) || selectedDateTime <= new Date()) {
          setErrorMsg('Scheduled start date/time must be in the future.');
          return;
        }
      }
    }

    setStep(prev => prev + 1);
  };

  const handleCreateCampaign = async () => {
    if (!ethicsAcknowledge) return;
    setSubmitting(true);
    setErrorMsg('');

    const scheduledStartISO = dispatchType === 'SCHEDULED' && scheduleDate && scheduleTime 
      ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      : null;

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          description: campaignDescription,
          category: campaignCategory,
          riskLevel,
          organizationName,
          templateId: selectedTemplate,
          scheduledStart: scheduledStartISO,
          targetDepartments: selectedDeptFilters.length > 0 ? selectedDeptFilters : ['ALL'],
          targetBranches: selectedBranchFilters.length > 0 ? selectedBranchFilters : ['ALL'],
          targetUserIds: selectedUserIds
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to deploy campaign');
      }

      const created = await res.json();

      // Configure details to display in premium success modal
      setCreatedCampaignDetails({
        id: created.id,
        name: created.name,
        scheduledTime: scheduledStartISO 
          ? new Date(scheduledStartISO).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)' 
          : 'Immediate Dispatch',
        targetCount: selectedUserIds.length,
        category: campaignCategory,
        riskLevel,
        templateName: selectedTemplateDetails?.name || 'Custom Email Template'
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

  const selectedTemplateDetails = useMemo(() => {
    return templates.find(t => t.id === selectedTemplate);
  }, [templates, selectedTemplate]);

  const handleToggleStatus = async (id: string, newStatus: 'ACTIVE' | 'COMPLETED') => {
    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const drafts = campaigns.filter(c => c.status === 'DRAFT');
  const scheduled = campaigns.filter(c => c.status === 'SCHEDULED');
  const active = campaigns.filter(c => c.status === 'ACTIVE');
  const completed = campaigns.filter(c => c.status === 'COMPLETED');

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] bg-brand-cyan/2 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Indian Compliance Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Campaign Operations
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Configure, dispatch, and terminate authorized cybersecurity awareness simulation exercises in Indian branches.</p>
        </div>

        <button
          onClick={openWizard}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(6,182,212,0.22)] text-xs font-mono uppercase tracking-wider shrink-0 border border-white/10 cursor-pointer animate-pulse"
        >
          <Plus size={14} className="stroke-[3]" /> Launch India Drill
        </button>
      </div>

      {/* Kanban lanes structure */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Lane 1: Active */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.01] border border-white/[0.03] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4] animate-pulse" />
              <h3 className="text-[10px] font-bold font-mono text-zinc-300 uppercase tracking-widest">Active</h3>
            </div>
            <span className="text-[10px] font-mono text-brand-cyan px-2 py-0.5 bg-brand-cyan/10 rounded-full border border-brand-cyan/20">{active.length}</span>
          </div>
          <div className="space-y-4 min-h-[250px] relative">
            <AnimatePresence mode="popLayout">
              {active.map(c => (
                <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
              ))}
            </AnimatePresence>
            {active.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 2: Scheduled */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.01] border border-white/[0.03] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_#8b5cf6]" />
              <h3 className="text-[10px] font-bold font-mono text-zinc-300 uppercase tracking-widest">Scheduled</h3>
            </div>
            <span className="text-[10px] font-mono text-brand-purple px-2 py-0.5 bg-brand-purple/10 rounded-full border border-brand-purple/20">{scheduled.length}</span>
          </div>
          <div className="space-y-4 min-h-[250px] relative">
            <AnimatePresence mode="popLayout">
              {scheduled.map(c => (
                <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
              ))}
            </AnimatePresence>
            {scheduled.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 3: Drafts */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.01] border border-white/[0.03] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <h3 className="text-[10px] font-bold font-mono text-zinc-300 uppercase tracking-widest">Drafts</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">{drafts.length}</span>
          </div>
          <div className="space-y-4 min-h-[250px] relative">
            <AnimatePresence mode="popLayout">
              {drafts.map(c => (
                <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
              ))}
            </AnimatePresence>
            {drafts.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 4: Completed */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 py-1 bg-white/[0.01] border border-white/[0.03] rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald shadow-[0_0_8px_#10b981]" />
              <h3 className="text-[10px] font-bold font-mono text-zinc-300 uppercase tracking-widest">Completed</h3>
            </div>
            <span className="text-[10px] font-mono text-brand-emerald px-2 py-0.5 bg-brand-emerald/10 rounded-full border border-brand-emerald/20">{completed.length}</span>
          </div>
          <div className="space-y-4 min-h-[250px] relative">
            <AnimatePresence mode="popLayout">
              {completed.map(c => (
                <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
              ))}
            </AnimatePresence>
            {completed.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

      </div>

      {/* Creation Multi-Step Wizard Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="glass-panel p-6 sm:p-8 rounded-[28px] max-w-4xl w-full relative z-10 border border-white/[0.06] overflow-hidden bg-zinc-950/95 shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/3 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/2 rounded-full blur-[100px] pointer-events-none" />
              
              {/* Wizard Header */}
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                    <Sparkles size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Deploy Awareness Drill</h2>
                    <p className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">Targeted Campaign Setup Suite</p>
                  </div>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Steps Progress Tracker */}
              <div className="grid grid-cols-5 gap-2 pb-5 border-b border-white/[0.04] mb-6 shrink-0 font-mono text-[9px]">
                {[
                  { num: 1, label: 'Identity' },
                  { num: 2, label: 'Audience' },
                  { num: 3, label: 'Scenario' },
                  { num: 4, label: 'Schedule' },
                  { num: 5, label: 'Audit' }
                ].map((s) => {
                  const isActive = step === s.num;
                  const isCompleted = step > s.num;
                  return (
                    <div key={s.num} className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
                          isActive ? 'bg-brand-cyan text-black font-extrabold shadow-[0_0_10px_#06b6d4]' :
                          isCompleted ? 'bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30' :
                          'bg-white/5 text-zinc-500 border border-white/5'
                        }`}>
                          {isCompleted ? <Check size={10} className="stroke-[3]" /> : s.num}
                        </span>
                        <span className={`hidden sm:inline font-bold uppercase tracking-wider ${
                          isActive ? 'text-brand-cyan' :
                          isCompleted ? 'text-brand-emerald' :
                          'text-zinc-500'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="h-0.5 rounded-full w-full bg-white/[0.03] overflow-hidden">
                        <motion.div 
                          className={`h-full ${isCompleted ? 'bg-brand-emerald' : isActive ? 'bg-brand-cyan' : 'bg-transparent'}`}
                          initial={{ width: 0 }}
                          animate={{ width: isActive || isCompleted ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-[10px] text-brand-rose flex items-center gap-2 font-mono shrink-0">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Wizard Scrollable Content area */}
              <div className="flex-1 overflow-y-auto pr-1 select-none space-y-6">
                
                {/* STEP 1: CAMPAIGN DETAILS */}
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Folder size={14} className="text-brand-cyan" /> Campaign Details & Scope
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-mono">STEP 1: Define baseline parameters and regulatory contexts for the simulation exercise.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Campaign Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. OP-DESI-SHIELD-349"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Campaign Description</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Describe the goals and compliance scope of this campaign..."
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Business Unit / Dept</label>
                            <select
                              value={businessUnit}
                              onChange={(e) => setBusinessUnit(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                            >
                              {DEPARTMENTS.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Organization Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Acme India Ltd"
                              value={organizationName}
                              onChange={(e) => setOrganizationName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Campaign Category</label>
                            <select
                              value={campaignCategory}
                              onChange={(e) => setCampaignCategory(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                            >
                              {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Risk Level</label>
                            <div className="flex items-center gap-1.5 bg-white/[0.01] border border-white/[0.03] p-1 rounded-xl">
                              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => setRiskLevel(r)}
                                  className={`flex-1 py-1 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                                    riskLevel === r 
                                      ? r === 'HIGH' ? 'bg-brand-rose/10 border border-brand-rose/25 text-brand-rose' :
                                        r === 'MEDIUM' ? 'bg-brand-amber/10 border border-brand-amber/25 text-brand-amber' :
                                        'bg-brand-emerald/10 border border-brand-emerald/25 text-brand-emerald'
                                      : 'bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: TARGET AUDIENCE */}
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <UserCheck size={14} className="text-brand-cyan" /> Define Target Audience
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-mono">STEP 2: Filter targeted employee nodes dynamically by branches and divisions.</p>
                      </div>
                      <div className="text-right shrink-0 p-3 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/15">
                        <span className="text-[9px] uppercase font-mono text-zinc-400 block font-bold">Target Employee Preview</span>
                        <span className="text-xl font-black font-mono text-brand-cyan">
                          {selectedUserIds.length} employees selected
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Left: Department & Branch Filters */}
                      <div className="space-y-5 md:col-span-1">
                        <div className="space-y-3 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[9px] font-bold">
                            <Building size={11} className="text-brand-cyan" /> SELECT DEPARTMENTS
                          </div>
                          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                            {DEPARTMENTS.map(d => {
                              const isChecked = selectedDeptFilters.includes(d);
                              return (
                                <label key={d} className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleDeptFilter(d)}
                                    className="peer shrink-0 appearance-none w-3.5 h-3.5 rounded border border-white/10 bg-black/40 checked:bg-brand-cyan checked:border-brand-cyan focus:outline-none transition-all cursor-pointer"
                                  />
                                  <span>{d}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[9px] font-bold">
                            <MapPin size={11} className="text-brand-purple" /> SELECT BRANCHES
                          </div>
                          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                            {INDIAN_BRANCHES.map(b => {
                              const isChecked = selectedBranchFilters.includes(b);
                              return (
                                <label key={b} className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleBranchFilter(b)}
                                    className="peer shrink-0 appearance-none w-3.5 h-3.5 rounded border border-white/10 bg-black/40 checked:bg-brand-purple checked:border-brand-purple focus:outline-none transition-all cursor-pointer"
                                  />
                                  <span>{b}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Employee Directory Table */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 text-zinc-500" size={12} />
                          <input
                            type="text"
                            placeholder="Filter matching employees by name or email..."
                            value={employeeSearchTerm}
                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-mono placeholder:text-zinc-600"
                          />
                        </div>

                        <div className="border border-white/[0.04] rounded-2xl overflow-hidden bg-white/[0.005]">
                          <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-white/[0.02] border-b border-white/[0.04] font-mono text-[8px] text-zinc-500 font-bold items-center">
                            <div className="col-span-1">
                              <input
                                type="checkbox"
                                checked={filteredEmployees.length > 0 && filteredEmployees.every(e => selectedUserIds.includes(e.id))}
                                onChange={handleSelectAllFiltered}
                                className="peer shrink-0 appearance-none w-3.5 h-3.5 rounded border border-white/10 bg-black/40 checked:bg-brand-cyan checked:border-brand-cyan focus:outline-none transition-all cursor-pointer"
                              />
                            </div>
                            <div className="col-span-4">NAME</div>
                            <div className="col-span-4">EMAIL</div>
                            <div className="col-span-2">BRANCH</div>
                            <div className="col-span-1 text-right">RISK</div>
                          </div>

                          <div className="max-h-[220px] overflow-y-auto divide-y divide-white/[0.03] scrollbar-thin">
                            {filteredEmployees.length > 0 ? (
                              filteredEmployees.map((emp) => {
                                const isSelected = selectedUserIds.includes(emp.id);
                                return (
                                  <div 
                                    key={emp.id}
                                    onClick={() => handleToggleUserSelect(emp.id)}
                                    className={`grid grid-cols-12 gap-2 px-3 py-2 items-center cursor-pointer transition-all hover:bg-white/[0.02] text-[10px] ${
                                      isSelected ? 'bg-brand-blue/5' : ''
                                    }`}
                                  >
                                    <div className="col-span-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleToggleUserSelect(emp.id)}
                                        className="peer shrink-0 appearance-none w-3.5 h-3.5 rounded border border-white/10 bg-black/40 checked:bg-brand-cyan checked:border-brand-cyan focus:outline-none transition-all cursor-pointer"
                                      />
                                    </div>
                                    <div className="col-span-4 font-extrabold text-white truncate">{emp.name || 'Anonymous Target'}</div>
                                    <div className="col-span-4 font-mono text-zinc-400 truncate">{emp.email}</div>
                                    <div className="col-span-2 font-mono text-zinc-500 uppercase">{emp.branch || 'N/A'}</div>
                                    <div className="col-span-1 text-right">
                                      <span className={`px-1 py-0.5 rounded text-[8px] font-mono font-bold ${
                                        emp.riskCategory === 'HIGH' ? 'bg-brand-rose/10 text-brand-rose' :
                                        emp.riskCategory === 'MEDIUM' ? 'bg-brand-amber/10 text-brand-amber' :
                                        'bg-brand-emerald/10 text-brand-emerald'
                                      }`}>
                                        {emp.riskCategory.substring(0, 3)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-8 text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                                No employees match criteria
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: EMAIL TEMPLATES */}
                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {/* Scenario List */}
                    <div className="space-y-4 flex flex-col min-h-0">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <Compass size={14} className="text-brand-cyan" /> Indian Corporate Scenarios
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-mono">STEP 3: Select the phishing simulation template to test validation skills.</p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-zinc-500" size={12} />
                        <input
                          type="text"
                          placeholder="Search Indian scenarios..."
                          value={templateSearchTerm}
                          onChange={(e) => setTemplateSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-mono placeholder:text-zinc-600"
                        />
                      </div>

                      <div className="overflow-y-auto space-y-2 max-h-[240px] pr-1 scrollbar-thin flex-1">
                        {templates
                          .filter(t => !templateSearchTerm.trim() || t.name.toLowerCase().includes(templateSearchTerm.toLowerCase()))
                          .map((t) => {
                            const isSelected = selectedTemplate === t.id;
                            return (
                              <div
                                key={t.id}
                                onClick={() => {
                                  setSelectedTemplate(t.id);
                                  setPreviewTemplate(t);
                                }}
                                className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-center text-left ${
                                  isSelected 
                                    ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                                    : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                                }`}
                              >
                                <div className="space-y-0.5 select-none pr-3 truncate">
                                  <span className="text-xs font-extrabold text-white block truncate">{t.name}</span>
                                  <span className="text-[9px] font-mono text-zinc-500 block truncate">SUBJECT: {t.subject}</span>
                                </div>
                                <div className="shrink-0">
                                  {isSelected && <span className="p-0.5 rounded-full bg-brand-cyan text-black"><Check size={8} className="stroke-[3]" /></span>}
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      <div className="p-3 rounded-xl bg-brand-cyan/5 border border-brand-cyan/20 text-[9px] font-mono text-brand-cyan flex items-start gap-2 leading-relaxed">
                        <Info size={12} className="shrink-0 mt-0.5" />
                        <div>
                          <strong>Domain spoofing telemetry enabled.</strong> This campaign will test employee verification by using simulated corporate domains such as <strong>@company.co.in</strong> and <strong>@company.in</strong>.
                        </div>
                      </div>
                    </div>

                    {/* Preview Box */}
                    <div className="glass-panel p-4.5 rounded-2xl border border-white/[0.04] flex flex-col h-full min-h-[300px] overflow-hidden bg-black/40">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-3 shrink-0">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Mail Sandbox Sandbox</span>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                        </div>
                      </div>

                      {previewTemplate ? (
                        <div className="flex-1 flex flex-col min-h-0 text-[10px]">
                          <div className="space-y-1 font-mono text-[9px] text-zinc-400 border-b border-white/[0.04] pb-2.5 shrink-0">
                            <div><span className="text-zinc-600">FROM:</span> Indian Security Operations Center &lt;dispatcher@acme.co.in&gt;</div>
                            <div><span className="text-zinc-600">SUBJECT:</span> <span className="text-white font-semibold font-sans text-[10px]">{previewTemplate.subject}</span></div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto mt-2.5 p-2.5 bg-white/[0.01] border border-white/[0.03] rounded-xl text-zinc-300 font-sans text-xs scrollbar-thin select-text leading-relaxed">
                            <div 
                              dangerouslySetInnerHTML={{ __html: previewTemplate.bodyHtml }} 
                              className="prose prose-invert max-w-none text-[11px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                          <Eye size={18} className="mb-1 text-zinc-700" />
                          No preview selected
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SCHEDULE CAMPAIGN */}
                {step === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Calendar size={14} className="text-brand-cyan" /> Scheduling & Delivery Options
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-mono">STEP 4: Set the campaign dispatch details. Timing is aligned with Asia/Kolkata (IST).</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setDispatchType('IMMEDIATE')}
                          className={`p-4.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 text-left ${
                            dispatchType === 'IMMEDIATE' 
                              ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                              : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${dispatchType === 'IMMEDIATE' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-zinc-500'} shrink-0 mt-0.5`}>
                            <Play size={14} className="fill-current" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-white block">Send Immediately</span>
                            <span className="text-[9px] leading-relaxed font-mono block text-zinc-500">Initiate operations and send simulated payloads directly after launch confirmation.</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setDispatchType('SCHEDULED')}
                          className={`p-4.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 text-left ${
                            dispatchType === 'SCHEDULED' 
                              ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                              : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${dispatchType === 'SCHEDULED' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-zinc-500'} shrink-0 mt-0.5`}>
                            <Clock size={14} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-white block">Schedule Later</span>
                            <span className="text-[9px] leading-relaxed font-mono block text-zinc-500">Delay campaign startup to a designated date and time window.</span>
                          </div>
                        </div>
                      </div>

                      {dispatchType === 'SCHEDULED' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] grid sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Scheduled Date (IST)</label>
                            <input
                              type="date"
                              required
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Scheduled Time (IST)</label>
                            <input
                              type="time"
                              required
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Standard Time Zone</span>
                        <span className="text-white font-extrabold flex items-center gap-1.5">
                          <GlobeIndia size={12} className="text-brand-cyan" /> Asia/Kolkata (IST)
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: REVIEW & LAUNCH */}
                {step === 5 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <ShieldAlert size={14} className="text-brand-rose" /> Final Audit & Launch Approval
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-mono">STEP 5: Validate campaign configuration details prior to execution.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      
                      {/* Configuration Sheet */}
                      <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3 relative overflow-hidden font-mono text-[9px]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/2 rounded-full blur-xl pointer-events-none" />
                        <h4 className="text-[10px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
                          <Info size={12} className="text-brand-cyan" /> SIMULATION SUMMARY
                        </h4>
                        
                        <div className="space-y-2 divide-y divide-white/[0.03] pt-1">
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">CAMPAIGN NAME:</span>
                            <span className="text-white font-extrabold">{campaignName}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">BUSINESS UNIT:</span>
                            <span className="text-zinc-300 font-extrabold">{businessUnit}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">ORGANIZATION:</span>
                            <span className="text-zinc-300 font-extrabold">{organizationName}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">CATEGORY:</span>
                            <span className="text-brand-cyan font-black">{campaignCategory}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">RISK THRESHOLD:</span>
                            <span className="text-zinc-300 font-extrabold">{riskLevel}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">TARGET SCALE:</span>
                            <span className="text-white font-extrabold">{selectedUserIds.length} employees</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">SCENARIO:</span>
                            <span className="text-zinc-300 font-extrabold uppercase truncate max-w-[130px]" title={selectedTemplateDetails?.name}>
                              {selectedTemplateDetails?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-zinc-500">DISPATCH (IST):</span>
                            <span className="text-brand-cyan font-extrabold">
                              {dispatchType === 'IMMEDIATE' ? 'LAUNCH IMMEDIATELY' : `${scheduleDate} ${scheduleTime}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Consent Checkbox */}
                      <div className="p-4.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/20 space-y-3.5 relative overflow-hidden text-[9px] font-mono text-zinc-300 flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rose/2 rounded-full blur-xl pointer-events-none" />
                        <div className="space-y-3">
                          <div className="flex gap-2 items-center">
                            <ShieldAlert size={14} className="text-brand-rose shrink-0" />
                            <p className="text-[10px] text-brand-rose font-bold uppercase tracking-wider">Ethics & compliance Authorization</p>
                          </div>
                          <p className="leading-relaxed">
                            Under organized security drills, you certify targeted domains and employees have consented to receive mock phishing exercises. <strong>Real password strings and inputs are client-intercepted and not cached.</strong>
                          </p>
                        </div>
                        
                        <label className="flex items-center gap-3 cursor-pointer mt-4 pt-3 border-t border-white/[0.04]">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={ethicsAcknowledge}
                              onChange={(e) => setEthicsAcknowledge(e.target.checked)}
                              className="peer shrink-0 appearance-none w-4.5 h-4.5 rounded border border-white/10 bg-black/40 checked:bg-brand-rose checked:border-brand-rose focus:outline-none transition-all cursor-pointer"
                            />
                            <CheckCircle className="absolute w-3.5 h-3.5 text-black pointer-events-none scale-0 peer-checked:scale-100 transition-transform left-[2px] top-[2px]" />
                          </div>
                          <span className="text-[9px] uppercase font-bold text-zinc-300 select-none">
                            I verify and authorize compliance
                          </span>
                        </label>
                      </div>

                    </div>
                  </motion.div>
                )}

              </div>

              {/* Wizard Footer controls */}
              <div className="flex gap-4 border-t border-white/[0.04] pt-5 mt-6 shrink-0 font-mono">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white font-bold transition text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-500 hover:text-zinc-300 font-bold transition text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex-1" />

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-brand-cyan hover:text-black border border-white/5 text-white font-bold transition-all text-xs flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateCampaign}
                    disabled={!ethicsAcknowledge || submitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-50 hover:brightness-110 active:scale-[0.98] text-white font-bold transition-all text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
                  >
                    {submitting ? 'Deploying...' : 'Launch Simulation'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Confirmation Modal */}
      <AnimatePresence>
        {successModalOpen && createdCampaignDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuccessModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass-panel p-8 rounded-[32px] max-w-lg w-full relative z-10 border border-brand-emerald/20 overflow-hidden bg-zinc-950 shadow-[0_0_50px_rgba(16,185,129,0.1)] text-center space-y-6"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-emerald/2 rounded-full blur-3xl pointer-events-none" />
              
              {/* Success Mark */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={36} className="animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-white tracking-tight">Campaign Launched Successfully</h3>
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">DRILL AGENT REGISTERED IN NETWORK</p>
              </div>

              {/* Specs box styled like a security terminal log */}
              <div className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] text-left font-mono text-[10px] leading-relaxed text-zinc-400 space-y-2">
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">CAMPAIGN ID:</span>
                  <span className="text-white font-extrabold">{createdCampaignDetails.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">CODE NAME:</span>
                  <span className="text-brand-cyan font-bold">{createdCampaignDetails.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">DISPATCH SCHEDULE (IST):</span>
                  <span className="text-white font-bold">{createdCampaignDetails.scheduledTime}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">TARGET ROSTER:</span>
                  <span className="text-brand-emerald font-extrabold">{createdCampaignDetails.targetCount} employees</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">ATTACK CATEGORY:</span>
                  <span className="text-white">{createdCampaignDetails.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                  <span className="text-zinc-500">RISK LEVEL:</span>
                  <span className="text-brand-amber font-bold">{createdCampaignDetails.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">EMAIL TEMPLATE:</span>
                  <span className="text-white truncate max-w-[170px]" title={createdCampaignDetails.templateName}>
                    {createdCampaignDetails.templateName}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSuccessModalOpen(false)}
                className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-brand-emerald to-emerald-600 hover:brightness-110 active:scale-[0.98] text-black font-extrabold transition-all text-xs font-mono uppercase tracking-wider border border-white/10 cursor-pointer"
              >
                Close Console
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Campaign card inside lane
const CampaignCard: React.FC<{
  campaign: Campaign;
  onToggleStatus: (id: string, newStatus: 'ACTIVE' | 'COMPLETED') => void;
}> = ({ campaign, onToggleStatus }) => {
  const itemTransition = { type: 'spring' as const, damping: 22, stiffness: 200 };
  
  let statusGlow = "bg-zinc-500 shadow-[0_0_8px_rgba(255,255,255,0.15)]";
  if (campaign.status === 'ACTIVE') statusGlow = "bg-brand-cyan shadow-[0_0_10px_#06b6d4] animate-pulse";
  else if (campaign.status === 'SCHEDULED') statusGlow = "bg-brand-purple shadow-[0_0_10px_#8b5cf6]";
  else if (campaign.status === 'COMPLETED') statusGlow = "bg-brand-emerald shadow-[0_0_10px_#10b981]";

  return (
    <motion.div 
      layout
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 }
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={itemTransition}
      className="glass-panel p-5 rounded-2xl border border-white/[0.04] space-y-4 hover:border-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative group"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-extrabold text-white text-xs tracking-tight leading-snug group-hover:text-brand-cyan transition duration-300">{campaign.name}</h4>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusGlow}`} />
        </div>
        
        {campaign.description && (
          <p className="text-[9px] text-zinc-500 font-mono leading-normal line-clamp-2">{campaign.description}</p>
        )}

        <div className="space-y-1">
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
            <span>CATEGORY:</span>
            <span className="text-zinc-400">{campaign.category || 'Phishing'}</span>
          </div>
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
            <span>TEMPLATE:</span>
            <span className="text-zinc-400 truncate max-w-[110px]" title={campaign.template?.name}>
              {campaign.template?.name || 'Standard Email'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between text-[10px] text-zinc-400">
        {campaign.status === 'DRAFT' && (
          <>
            <span className="font-mono text-zinc-500 uppercase tracking-wider text-[9px] flex items-center gap-1">
              <Folder size={11} /> Draft Node
            </span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'ACTIVE')}
              className="flex items-center gap-1.5 text-brand-cyan hover:brightness-110 font-bold font-mono uppercase text-[9px] px-2 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 hover:bg-brand-cyan/20 transition-all cursor-pointer"
            >
              <Play size={8} className="fill-current" /> Launch
            </button>
          </>
        )}
        {campaign.status === 'SCHEDULED' && (
          <>
            <span className="font-mono flex items-center gap-1 text-[9px] uppercase text-zinc-500 tracking-wider">
              <Calendar size={11} /> {campaign.scheduledStart ? new Date(campaign.scheduledStart).toLocaleDateString() : ''}
            </span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'ACTIVE')}
              className="flex items-center gap-1.5 text-brand-cyan hover:brightness-110 font-bold font-mono uppercase text-[9px] px-2 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 hover:bg-brand-cyan/20 transition-all animate-pulse cursor-pointer"
            >
              <Play size={8} className="fill-current" /> Launch
            </button>
          </>
        )}
        {campaign.status === 'ACTIVE' && (
          <>
            <span className="text-brand-cyan font-bold flex items-center gap-1.5 font-mono uppercase tracking-wider text-[9px]">
              <span className="w-1 h-1 rounded-full bg-brand-cyan animate-ping" /> Scanning
            </span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'COMPLETED')}
              className="flex items-center gap-1 text-brand-rose hover:brightness-110 font-bold font-mono uppercase text-[9px] px-2 py-1 rounded bg-brand-rose/10 border border-brand-rose/20 hover:bg-brand-rose/20 transition-all cursor-pointer"
            >
              <Square size={8} className="fill-current" /> Terminate
            </button>
          </>
        )}
        {campaign.status === 'COMPLETED' && (
          <div className="flex items-center gap-1.5 text-brand-emerald font-mono uppercase tracking-widest text-[9px] w-full font-bold">
            <CheckCircle2 size={11} /> TERMINATED {campaign.completedAt ? new Date(campaign.completedAt).toLocaleDateString() : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EmptyLaneMessage = () => (
  <div className="border border-dashed border-white/[0.05] rounded-2xl p-8 text-center text-[9px] font-mono text-zinc-600 uppercase tracking-widest bg-white/[0.005]">
    No campaigns in lane
  </div>
);

// Map pin/Globe icon for India timezone reference
const GlobeIndia = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 14} 
    height={size || 14} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
    <path d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6" fill="currentColor" />
  </svg>
);
