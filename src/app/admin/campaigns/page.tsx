'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle2
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
}

interface Employee {
  id: string;
  department: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [targetDept, setTargetDept] = useState('ALL');
  const [scheduleTime, setScheduleTime] = useState('');
  const [ethicsAcknowledge, setEthicsAcknowledge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    fetch('/api/admin/campaigns')
      .then(res => res.json())
      .then(data => {
        setCampaigns(data.campaigns);
        setTemplates(data.templates);
        if (data.templates && data.templates.length > 0) {
          setSelectedTemplate(data.templates[0].id);
        }
        
        // Extract unique departments
        const depts: string[] = Array.from(new Set(data.employees.map((e: Employee) => e.department).filter(Boolean)));
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

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
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
          scheduledStart: scheduleTime ? new Date(scheduleTime).toISOString() : null,
          targetDepartment: targetDept
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create campaign');
      }

      setCampaignName('');
      setScheduleTime('');
      setEthicsAcknowledge(false);
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Campaigns Console...</span>
      </div>
    );
  }

  // Group campaigns by status
  const drafts = campaigns.filter(c => c.status === 'DRAFT');
  const scheduled = campaigns.filter(c => c.status === 'SCHEDULED');
  const active = campaigns.filter(c => c.status === 'ACTIVE');
  const completed = campaigns.filter(c => c.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Campaign Operations</h1>
          <p className="text-sm text-gray-400">Schedule authorized security awareness simulation exercises.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 shadow-[0_4px_20px_rgba(6,182,212,0.2)] text-sm"
        >
          <Plus size={16} /> Create Simulation
        </button>
      </div>

      {/* Tabs / Lanes by status */}
      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Lane 1: Active */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active ({active.length})</h3>
            </div>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {active.map(c => (
              <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
            ))}
            {active.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 2: Scheduled */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled ({scheduled.length})</h3>
            </div>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {scheduled.map(c => (
              <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
            ))}
            {scheduled.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 3: Drafts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Drafts ({drafts.length})</h3>
            </div>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {drafts.map(c => (
              <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
            ))}
            {drafts.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

        {/* Lane 4: Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Completed ({completed.length})</h3>
            </div>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {completed.map(c => (
              <CampaignCard key={c.id} campaign={c} onToggleStatus={handleToggleStatus} />
            ))}
            {completed.length === 0 && <EmptyLaneMessage />}
          </div>
        </div>

      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-xl w-full relative z-10 border border-cyber-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-cyan" size={20} />
                  <h2 className="text-xl font-bold text-white">Create Security Campaign</h2>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-xs text-brand-rose flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateCampaign} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q3 IT Security Refresh"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Target Group</label>
                    <select
                      value={targetDept}
                      onChange={(e) => setTargetDept(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    >
                      <option value="ALL">All Employees</option>
                      {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Email Template</label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    >
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                    Schedule Dispatch <span className="text-[10px] text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">Leave empty to initialize as a DRAFT.</span>
                </div>

                {/* Consent & Ethical Checklist */}
                <div className="p-4 rounded-2xl bg-white/5 border border-cyber-border space-y-3">
                  <div className="flex gap-2">
                    <Info size={16} className="text-brand-cyan shrink-0" />
                    <p className="text-xs text-gray-300 font-semibold">Authorized Training Validation</p>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    By launching this campaign, you certify that the target recipients are active corporate employees who have consented to security simulations under organization compliance policy. <strong>No real credentials will be intercepted or recorded.</strong>
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer mt-2 pt-2 border-t border-cyber-border/40">
                    <input
                      type="checkbox"
                      checked={ethicsAcknowledge}
                      onChange={(e) => setEthicsAcknowledge(e.target.checked)}
                      className="rounded border-gray-700 bg-black/50 text-brand-cyan focus:ring-brand-cyan"
                    />
                    <span className="text-[10px] uppercase font-mono font-bold text-gray-300">
                      I acknowledge and authorize simulation
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!ethicsAcknowledge || submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple disabled:from-gray-600 disabled:to-gray-700 hover:brightness-110 text-white font-semibold transition text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Creating...' : 'Initialize Campaign'}
                  </button>
                </div>
              </form>
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
  return (
    <motion.div 
      layout
      className="glass-panel p-5 rounded-2xl border border-cyber-border/80 space-y-4 hover:border-cyber-border-hover relative"
    >
      <div>
        <h4 className="font-bold text-white text-sm">{campaign.name}</h4>
        <span className="text-[10px] text-gray-500 font-mono block mt-1 truncate">
          Template: {campaign.template.name}
        </span>
      </div>

      <div className="border-t border-cyber-border/40 pt-3 flex items-center justify-between text-[11px] text-gray-400">
        {campaign.status === 'DRAFT' && (
          <>
            <span className="font-mono text-gray-500">Draft mode</span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'ACTIVE')}
              className="flex items-center gap-1 text-brand-cyan hover:underline font-semibold"
            >
              <Play size={10} /> Launch Now
            </button>
          </>
        )}
        {campaign.status === 'SCHEDULED' && (
          <>
            <span className="font-mono flex items-center gap-1">
              <Calendar size={12} /> {campaign.scheduledStart ? new Date(campaign.scheduledStart).toLocaleDateString() : ''}
            </span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'ACTIVE')}
              className="flex items-center gap-1 text-brand-cyan hover:underline font-semibold"
            >
              <Play size={10} /> Launch Now
            </button>
          </>
        )}
        {campaign.status === 'ACTIVE' && (
          <>
            <span className="text-brand-cyan font-semibold flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Active monitoring
            </span>
            <button
              onClick={() => onToggleStatus(campaign.id, 'COMPLETED')}
              className="flex items-center gap-1 text-brand-rose hover:underline font-semibold"
            >
              <Square size={10} /> Terminate
            </button>
          </>
        )}
        {campaign.status === 'COMPLETED' && (
          <div className="flex items-center gap-1 text-emerald-400 font-mono w-full">
            <CheckCircle2 size={12} /> Complete {campaign.completedAt ? new Date(campaign.completedAt).toLocaleDateString() : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EmptyLaneMessage = () => (
  <div className="border border-dashed border-cyber-border/60 rounded-2xl p-6 text-center text-xs font-mono text-gray-500">
    No campaigns
  </div>
);
