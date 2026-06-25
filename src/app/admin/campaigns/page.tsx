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
  ShieldAlert
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  template: { name: string; subject: string };
  scheduledStart: string | null;
  startedAt: string | null;
  completedAt: string | null;
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
  riskCategory: string;
  awarenessScore: number;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Wizard Step State
  const [step, setStep] = useState(1);

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('Standard Phishing Assessment');
  const [targetDept, setTargetDept] = useState('ALL');
  
  // Target Selection states
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  // Template states
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Schedule states
  const [dispatchType, setDispatchType] = useState<'IMMEDIATE' | 'SCHEDULED'>('IMMEDIATE');
  const [scheduleTime, setScheduleTime] = useState('');
  const [deliveryThrottle, setDeliveryThrottle] = useState<'INSTANT' | '2H' | '24H'>('INSTANT');

  // Review states
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
        }
        
        // Extract unique departments
        const depts: string[] = Array.from(
          new Set(
            (data.employees || [])
              .map((e: Employee) => e.department)
              .filter(Boolean)
          )
        );
        setDepartments(depts);
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

  // Preset operations names for premium cyber UX feel
  const generateOpsName = () => {
    const prefixes = ['OP-SILENT-SPEAR', 'OP-CYBER-PULSE', 'OP-ECLIPSE-VORTEX', 'OP-AEGIS-PROMPT', 'OP-AURORA-SHIELD'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setCampaignName(`${prefixes[Math.floor(Math.random() * prefixes.length)]}-${randomNum}`);
  };

  // Reset wizard state
  const openWizard = () => {
    setStep(1);
    generateOpsName();
    setTargetDept('ALL');
    setSelectedUserIds([]);
    setEmployeeSearchTerm('');
    setRiskFilter('ALL');
    setTemplateSearchTerm('');
    setDispatchType('IMMEDIATE');
    setScheduleTime('');
    setDeliveryThrottle('INSTANT');
    setEthicsAcknowledge(false);
    setErrorMsg('');
    
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
      setPreviewTemplate(templates[0]);
    }
    setModalOpen(true);
  };

  // Filtered employees for Step 2
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDept = targetDept === 'ALL' || emp.department === targetDept;
      const matchesSearch = !employeeSearchTerm.trim() || 
        (emp.name && emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())) ||
        emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || emp.riskCategory === riskFilter;
      return matchesDept && matchesSearch && matchesRisk;
    });
  }, [employees, targetDept, employeeSearchTerm, riskFilter]);

  // Handle auto-populating select-all for filtered targets
  useEffect(() => {
    if (step === 2 && selectedUserIds.length === 0) {
      // By default, auto-select all filtered targets matching the department filter
      setSelectedUserIds(filteredEmployees.map(e => e.id));
    }
  }, [step, targetDept]);

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredEmployees.map(e => e.id);
    const allSelected = filteredIds.every(id => selectedUserIds.includes(id));

    if (allSelected) {
      // Remove currently filtered IDs from selection
      setSelectedUserIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Add missing filtered IDs to selection
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleToggleUserSelect = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim() || !selectedTemplate || !ethicsAcknowledge) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          templateId: selectedTemplate,
          scheduledStart: dispatchType === 'SCHEDULED' && scheduleTime ? new Date(scheduleTime).toISOString() : null,
          targetDepartment: targetDept,
          targetUserIds: selectedUserIds
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create campaign');
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
      setStep(5); // Bring back to review step if error occurs
    } finally {
      setSubmitting(false);
    }
  };

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

  // Group campaigns by status
  const drafts = campaigns.filter(c => c.status === 'DRAFT');
  const scheduled = campaigns.filter(c => c.status === 'SCHEDULED');
  const active = campaigns.filter(c => c.status === 'ACTIVE');
  const completed = campaigns.filter(c => c.status === 'COMPLETED');

  // Selected template details helper
  const selectedTemplateDetails = useMemo(() => {
    return templates.find(t => t.id === selectedTemplate);
  }, [templates, selectedTemplate]);

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] bg-brand-cyan/2 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Training Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Campaign Operations
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Configure, dispatch, and terminate authorized cybersecurity awareness simulation exercises.</p>
        </div>

        <button
          onClick={openWizard}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(6,182,212,0.22)] text-xs font-mono uppercase tracking-wider shrink-0 border border-white/10 cursor-pointer"
        >
          <Plus size={14} className="stroke-[3]" /> Create Simulation
        </button>
      </div>

      {/* Kanban lanes structure */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
        }}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        
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

      </motion.div>

      {/* Creation Multi-Step Wizard Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            {/* Modal Box */}
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
                    <h2 className="text-xl font-extrabold text-white tracking-tight">Campaign Deployer Wizard</h2>
                    <p className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">Targeted Simulation Infrastructure Setup</p>
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
                  { num: 2, label: 'Targets' },
                  { num: 3, label: 'Template' },
                  { num: 4, label: 'Schedule' },
                  { num: 5, label: 'Review' }
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
                
                {/* STEP 1: IDENTITY */}
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Folder size={14} className="text-brand-cyan" /> Define Campaign Scope & Identity
                      </h3>
                      <p className="text-[10px] text-zinc-400">Establish the operational identifiers and department-level baseline boundary for this training simulation.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Campaign Operation Name</label>
                          <button 
                            type="button"
                            onClick={generateOpsName}
                            className="text-[9px] font-mono text-brand-cyan hover:underline hover:brightness-110 cursor-pointer"
                          >
                            Regenerate Code Name
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. OP-SILENT-SPEAR-9402"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Operational Security Objective</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: 'Standard Phishing Assessment', desc: 'Baseline awareness check across regular threat indicators.' },
                            { value: 'Spear Phishing Simulation', desc: 'Highly personalized template targeting specific divisions.' },
                            { value: 'Credential Harvest Audit', desc: 'Evaluates employee submission of fake portal credentials.' }
                          ].map((obj) => (
                            <div 
                              key={obj.value}
                              onClick={() => setCampaignObjective(obj.value)}
                              className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left ${
                                campaignObjective === obj.value 
                                  ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                              }`}
                            >
                              <span className="text-xs font-extrabold block text-white">{obj.value}</span>
                              <span className="text-[9px] leading-relaxed font-mono block mt-2 text-zinc-500">{obj.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Primary Target Department</label>
                        <select
                          value={targetDept}
                          onChange={(e) => {
                            setTargetDept(e.target.value);
                            setSelectedUserIds([]); // reset selection to trigger auto-select inside useEffect
                          }}
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                        >
                          <option value="ALL">All Departments (Organization-Wide)</option>
                          {departments.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: TARGET EMPLOYEE SELECTION */}
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <UserCheck size={14} className="text-brand-cyan" /> Select Target Nodes
                        </h3>
                        <p className="text-[10px] text-zinc-400">Search and selectively filter specific employee target records to deploy simulations to.</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-brand-cyan">
                          {selectedUserIds.length} / {filteredEmployees.length} Targets Selected
                        </span>
                      </div>
                    </div>

                    {/* Filter Controls Bar */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 text-zinc-500" size={14} />
                        <input
                          type="text"
                          placeholder="Search target employee name or email..."
                          value={employeeSearchTerm}
                          onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono placeholder:text-zinc-600"
                        />
                      </div>

                      {/* Risk filter selector */}
                      <div className="flex items-center gap-1 bg-white/[0.01] border border-white/[0.03] p-1 rounded-xl shrink-0">
                        {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRiskFilter(r)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                              riskFilter === r 
                                ? 'bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan' 
                                : 'bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected List Panel */}
                    <div className="border border-white/[0.04] rounded-2xl overflow-hidden bg-white/[0.005]">
                      <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.04] font-mono text-[9px] text-zinc-500 font-bold items-center">
                        <div className="col-span-1 flex items-center">
                          <input
                            type="checkbox"
                            checked={filteredEmployees.length > 0 && filteredEmployees.every(e => selectedUserIds.includes(e.id))}
                            onChange={handleSelectAllFiltered}
                            className="peer shrink-0 appearance-none w-3.5 h-3.5 rounded border border-white/10 bg-black/40 checked:bg-brand-cyan checked:border-brand-cyan focus:outline-none transition-all cursor-pointer"
                          />
                        </div>
                        <div className="col-span-4">EMPLOYEE NAME</div>
                        <div className="col-span-4">EMAIL ADDRESS</div>
                        <div className="col-span-2">DEPARTMENT</div>
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
                                className={`grid grid-cols-12 gap-3 px-4 py-2.5 items-center cursor-pointer transition-all hover:bg-white/[0.02] text-[10px] ${
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
                                <div className="col-span-4 font-extrabold text-white flex items-center gap-2 truncate">
                                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <User size={10} className="text-zinc-500" />
                                  </div>
                                  <span className="truncate">{emp.name || 'Anonymous Target'}</span>
                                </div>
                                <div className="col-span-4 font-mono text-zinc-400 truncate">{emp.email}</div>
                                <div className="col-span-2 font-mono text-zinc-500 uppercase truncate">{emp.department || 'N/A'}</div>
                                <div className="col-span-1 text-right">
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                                    emp.riskCategory === 'HIGH' ? 'bg-brand-rose/10 border border-brand-rose/20 text-brand-rose' :
                                    emp.riskCategory === 'MEDIUM' ? 'bg-brand-amber/10 border border-brand-amber/20 text-brand-amber' :
                                    'bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald'
                                  }`}>
                                    {emp.riskCategory}
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
                  </motion.div>
                )}

                {/* STEP 3: EMAIL TEMPLATE SELECTION */}
                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {/* Left Column: Selector */}
                    <div className="space-y-4 flex flex-col min-h-0">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                          <Compass size={14} className="text-brand-cyan" /> Phishing Attack Vector
                        </h3>
                        <p className="text-[10px] text-zinc-400">Select an email payload template template from the authorized tenant catalog.</p>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 text-zinc-500" size={14} />
                        <input
                          type="text"
                          placeholder="Search payload templates..."
                          value={templateSearchTerm}
                          onChange={(e) => setTemplateSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono placeholder:text-zinc-600"
                        />
                      </div>

                      <div className="overflow-y-auto space-y-3 max-h-[250px] pr-1 scrollbar-thin flex-1">
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
                                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative group flex justify-between items-start text-left ${
                                  isSelected 
                                    ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                                    : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                                }`}
                              >
                                <div className="space-y-1 select-none pr-6">
                                  <span className="text-xs font-extrabold text-white block">{t.name}</span>
                                  <span className="text-[9px] font-mono text-zinc-500 block truncate max-w-[240px]">SUBJECT: {t.subject}</span>
                                </div>
                                <div className="shrink-0 flex items-center gap-1.5">
                                  {isSelected && <span className="p-1 rounded-full bg-brand-cyan text-black"><Check size={8} className="stroke-[3]" /></span>}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Right Column: Dynamic Preview Container */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/[0.04] flex flex-col h-full min-h-[300px] overflow-hidden bg-black/40">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5 mb-3.5 shrink-0">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Mock Mail Gateway Sandbox</span>
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                        </div>
                      </div>

                      {previewTemplate ? (
                        <div className="flex-1 flex flex-col min-h-0 text-[10px]">
                          <div className="space-y-1 font-mono text-[9px] text-zinc-400 border-b border-white/[0.04] pb-3 shrink-0">
                            <div><span className="text-zinc-600">FROM:</span> Aegis Simulation Dispatcher &lt;sandbox-inbound@security-node.acme.com&gt;</div>
                            <div><span className="text-zinc-600">SUBJECT:</span> <span className="text-white font-semibold font-sans text-[10px]">{previewTemplate.subject}</span></div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto mt-3 p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl text-zinc-300 font-sans text-xs scrollbar-thin select-text leading-relaxed">
                            {/* Visual wrapper for html bodies */}
                            <div 
                              dangerouslySetInnerHTML={{ __html: previewTemplate.bodyHtml }} 
                              className="prose prose-invert max-w-none text-[11px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                          <Eye size={20} className="mb-2 text-zinc-700" />
                          No preview selected
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: DISPATCH & SCHEDULE */}
                {step === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <Calendar size={14} className="text-brand-cyan" /> Define Dispatch Timing & Flow
                      </h3>
                      <p className="text-[10px] text-zinc-400">Control campaign deployment timestamps and throttle limits to mimic real cyber-phishing behavior.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => setDispatchType('IMMEDIATE')}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 text-left ${
                            dispatchType === 'IMMEDIATE' 
                              ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                              : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${dispatchType === 'IMMEDIATE' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-zinc-500'} shrink-0 mt-0.5`}>
                            <Play size={14} className="fill-current" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-white block">Instant Dispatch</span>
                            <span className="text-[9px] leading-relaxed font-mono block text-zinc-500">Initialize campaign node and send simulated emails directly after approval.</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setDispatchType('SCHEDULED')}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-start gap-3.5 text-left ${
                            dispatchType === 'SCHEDULED' 
                              ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                              : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${dispatchType === 'SCHEDULED' ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/5 text-zinc-500'} shrink-0 mt-0.5`}>
                            <Clock size={14} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-extrabold text-white block">Time Scheduled</span>
                            <span className="text-[9px] leading-relaxed font-mono block text-zinc-500">Delay execution flow. Campaign state moves to SCHEDULED automatically.</span>
                          </div>
                        </div>
                      </div>

                      {dispatchType === 'SCHEDULED' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-3"
                        >
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Execution Trigger Date & Time</label>
                          <input
                            type="datetime-local"
                            required
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                          />
                        </motion.div>
                      )}

                      {/* Delivery rate controls */}
                      <div>
                        <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 font-semibold">Delivery Throttle & Drip Rate</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { value: 'INSTANT', label: 'Blast Delivery', desc: 'Deliver instantly at once' },
                            { value: '2H', label: 'Linear Drip (2h)', desc: 'Throttled over 2 hours' },
                            { value: '24H', label: 'Persistent Drip (24h)', desc: 'Staggered over 24 hours' }
                          ].map((t) => (
                            <div 
                              key={t.value}
                              onClick={() => setDeliveryThrottle(t.value as any)}
                              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left ${
                                deliveryThrottle === t.value 
                                  ? 'bg-brand-cyan/5 border-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-400 hover:border-white/10 hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-[11px] font-extrabold text-white">{t.label}</span>
                                <Sliders size={10} className={deliveryThrottle === t.value ? 'text-brand-cyan' : 'text-zinc-600'} />
                              </div>
                              <span className="text-[9px] leading-relaxed font-mono block mt-2 text-zinc-500">{t.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: REVIEW AND LAUNCH SCREEN */}
                {step === 5 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <ShieldAlert size={14} className="text-brand-rose" /> Launch Verification Checklist
                      </h3>
                      <p className="text-[10px] text-zinc-400">Conduct final code audit and tenant checks prior to active campaign deployment.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      
                      {/* Left side summary detail cards */}
                      <div className="space-y-4">
                        <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3.5 relative overflow-hidden font-mono text-[9px]">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/2 rounded-full blur-xl pointer-events-none" />
                          <h4 className="text-[10px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
                            <Info size={12} className="text-brand-cyan" /> Simulation Specs
                          </h4>
                          
                          <div className="space-y-2 divide-y divide-white/[0.03] pt-1">
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">CAMPAIGN NAME:</span>
                              <span className="text-white font-extrabold">{campaignName}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">OBJECTIVE:</span>
                              <span className="text-zinc-300 font-extrabold">{campaignObjective}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">DEPARTMENT BORDER:</span>
                              <span className="text-zinc-300 font-extrabold uppercase">{targetDept}</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">TARGET SIZE:</span>
                              <span className="text-brand-cyan font-black">{selectedUserIds.length} employees</span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">EMAIL TEMPLATE:</span>
                              <span className="text-zinc-300 font-extrabold uppercase truncate max-w-[140px]" title={selectedTemplateDetails?.name}>
                                {selectedTemplateDetails?.name || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">DISPATCH TIME:</span>
                              <span className="text-white font-extrabold flex items-center gap-1">
                                {dispatchType === 'IMMEDIATE' ? (
                                  <>LAUNCH IMMEDIATELY</>
                                ) : (
                                  <><Clock size={9} /> {scheduleTime ? new Date(scheduleTime).toLocaleString() : 'N/A'}</>
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-zinc-500">DRIP THROTTLE:</span>
                              <span className="text-zinc-300 font-extrabold uppercase">{deliveryThrottle}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side ethics, checkmark alerts */}
                      <div className="space-y-4">
                        {/* Consent & Ethics Checklist Panel */}
                        <div className="p-4.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/20 space-y-3.5 relative overflow-hidden text-[9px] font-mono text-zinc-300">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rose/2 rounded-full blur-xl pointer-events-none" />
                          <div className="flex gap-2 items-center">
                            <ShieldAlert size={14} className="text-brand-rose shrink-0" />
                            <p className="text-[10px] text-brand-rose font-bold uppercase tracking-wider">Safety & Privacy Assurances</p>
                          </div>
                          
                          <div className="space-y-2 leading-relaxed">
                            <p>
                              1. <strong>Strict Data Privacy</strong>: Aegis does NOT cache, index, or store credentials submitted during the simulation intercept step.
                            </p>
                            <p>
                              2. <strong>Tenant Authorization</strong>: Simulations must only target verified organization domains. All logs remain local.
                            </p>
                          </div>
                          
                          <label className="flex items-center gap-3.5 cursor-pointer mt-2 pt-3 border-t border-white/[0.04]">
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
                              I certify full consent and compliance
                            </span>
                          </label>
                        </div>
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
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white font-bold transition text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-500 hover:text-zinc-300 font-bold transition text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex-1" />

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev + 1)}
                    disabled={step === 2 && selectedUserIds.length === 0}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-brand-cyan hover:text-black border border-white/5 text-white disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white font-bold transition-all text-xs flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateCampaign}
                    disabled={!ethicsAcknowledge || submitting || selectedUserIds.length === 0}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-50 hover:brightness-110 active:scale-[0.98] text-white font-bold transition-all text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
                  >
                    {submitting ? 'Deploying Node...' : 'Launch Simulation'}
                  </button>
                )}
              </div>
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
        <div className="space-y-1">
          <span className="text-[9px] text-zinc-500 font-mono block">
            ID: <span className="text-zinc-400">{campaign.id.substring(0, 8)}...</span>
          </span>
          <span className="text-[9px] text-zinc-500 font-mono block truncate">
            TEMPLATE: <span className="text-zinc-400">{campaign.template?.name || 'Standard Email'}</span>
          </span>
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
    No Active campaigns
  </div>
);
