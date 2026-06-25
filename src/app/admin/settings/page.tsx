'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldAlert, 
  MapPin, 
  Users, 
  Briefcase, 
  Shield, 
  Bell, 
  Activity, 
  Database, 
  HardDrive, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  AlertTriangle,
  Upload,
  Globe,
  Mail,
  Phone,
  Clock,
  Lock,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Main Settings State
  const [settings, setSettings] = useState<any>({
    profile: {
      name: '',
      logoUrl: '',
      domain: '',
      gstNumber: '',
      cinNumber: '',
      address: '',
      supportEmail: '',
      contactNumber: '',
      website: '',
      timezone: 'Asia/Kolkata',
      language: 'English'
    },
    branches: [],
    departments: [],
    securityPolicies: {
      minPasswordLength: 12,
      passwordExpiry: 90,
      sessionTimeout: 15,
      mfaPolicy: 'ENFORCED',
      loginAttemptLimit: 5,
      deviceTrustPolicy: 'REQUIRED',
      accountLockDuration: 30
    },
    notifications: {
      emailNotifications: true,
      campaignAlerts: true,
      weeklyReports: true,
      monthlyReports: true,
      securityAlerts: true,
      trainingReminders: true
    },
    backups: {
      schedule: 'DAILY',
      history: []
    }
  });

  // Modal / Form States
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchForm, setBranchForm] = useState({
    id: '',
    name: '',
    branchAdmin: '',
    employeeCount: 0,
    activeCampaigns: 0,
    isEnabled: true
  });
  const [isEditingBranch, setIsEditingBranch] = useState(false);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({
    id: '',
    name: '',
    managerName: '',
    employeeCount: 0,
    activeCampaigns: 0,
    isArchived: false
  });
  const [isEditingDept, setIsEditingDept] = useState(false);

  // Backup Loading Simulation State
  const [creatingBackup, setCreatingBackup] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setSettings(data);
        }
      } else {
        setErrorMsg('Failed to load settings data.');
      }
    } catch (err) {
      setErrorMsg('Error loading settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (updatedSettings = settings) => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });
      if (res.ok) {
        setSuccessMsg('Settings saved successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Failed to save settings.');
      }
    } catch (err) {
      setErrorMsg('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to update deeply nested setting keys
  const updateProfile = (key: string, value: any) => {
    const updated = {
      ...settings,
      profile: {
        ...settings.profile,
        [key]: value
      }
    };
    setSettings(updated);
  };

  const updateSecurity = (key: string, value: any) => {
    const updated = {
      ...settings,
      securityPolicies: {
        ...settings.securityPolicies,
        [key]: value
      }
    };
    setSettings(updated);
  };

  const updateNotification = (key: string, value: boolean) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    setSettings(updated);
    handleSaveSettings(updated); // Autosave notifications
  };

  // --- Branch Actions ---
  const handleOpenAddBranch = () => {
    setBranchForm({
      id: '',
      name: '',
      branchAdmin: '',
      employeeCount: 0,
      activeCampaigns: 0,
      isEnabled: true
    });
    setIsEditingBranch(false);
    setShowBranchModal(true);
  };

  const handleOpenEditBranch = (branch: any) => {
    setBranchForm({ ...branch });
    setIsEditingBranch(true);
    setShowBranchModal(true);
  };

  const handleSaveBranch = () => {
    if (!branchForm.name || !branchForm.branchAdmin) {
      alert('Please fill out the Branch Name and Administrator.');
      return;
    }

    let updatedBranches = [...settings.branches];
    if (isEditingBranch) {
      updatedBranches = updatedBranches.map(b => b.id === branchForm.id ? branchForm : b);
    } else {
      const newId = 'br-' + branchForm.name.toLowerCase().replace(/\s+/g, '-');
      updatedBranches.push({
        ...branchForm,
        id: newId
      });
    }

    const updatedSettings = {
      ...settings,
      branches: updatedBranches
    };

    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
    setShowBranchModal(false);
  };

  const handleToggleBranch = (branchId: string) => {
    const updatedBranches = settings.branches.map((b: any) => {
      if (b.id === branchId) {
        return { ...b, isEnabled: !b.isEnabled };
      }
      return b;
    });

    const updatedSettings = {
      ...settings,
      branches: updatedBranches
    };

    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
  };

  // --- Department Actions ---
  const handleOpenAddDept = () => {
    setDeptForm({
      id: '',
      name: '',
      managerName: '',
      employeeCount: 0,
      activeCampaigns: 0,
      isArchived: false
    });
    setIsEditingDept(false);
    setShowDeptModal(true);
  };

  const handleOpenEditDept = (dept: any) => {
    setDeptForm({ ...dept });
    setIsEditingDept(true);
    setShowDeptModal(true);
  };

  const handleSaveDept = () => {
    if (!deptForm.name || !deptForm.managerName) {
      alert('Please fill out the Department Name and Manager.');
      return;
    }

    let updatedDepts = [...settings.departments];
    if (isEditingDept) {
      updatedDepts = updatedDepts.map(d => d.id === deptForm.id ? deptForm : d);
    } else {
      const newId = 'dept-' + deptForm.name.toLowerCase().replace(/\s+/g, '-');
      updatedDepts.push({
        ...deptForm,
        id: newId
      });
    }

    const updatedSettings = {
      ...settings,
      departments: updatedDepts
    };

    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
    setShowDeptModal(false);
  };

  const handleToggleDeptArchive = (deptId: string) => {
    const updatedDepts = settings.departments.map((d: any) => {
      if (d.id === deptId) {
        return { ...d, isArchived: !d.isArchived };
      }
      return d;
    });

    const updatedSettings = {
      ...settings,
      departments: updatedDepts
    };

    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
  };

  // --- Backup Handlers ---
  const handleTriggerManualBackup = () => {
    setCreatingBackup(true);
    setTimeout(() => {
      const newBackup = {
        id: `BK-${Math.floor(Math.random() * 9000) + 1000}`,
        name: `pinkman_backup_manual_${new Date().toISOString().slice(0,10).replace(/-/g, '_')}.sql`,
        size: '45.4 MB',
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        type: 'MANUAL'
      };

      const updatedBackups = {
        ...settings.backups,
        history: [newBackup, ...settings.backups.history]
      };

      const updatedSettings = {
        ...settings,
        backups: updatedBackups
      };

      setSettings(updatedSettings);
      handleSaveSettings(updatedSettings);
      setCreatingBackup(false);
      alert('Manual backup completed successfully!');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="text-brand-cyan animate-spin" size={32} />
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">LOADING SETTINGS ENGINE...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="text-brand-cyan" size={28} />
            Organization Management Center
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">
            Configure enterprise branding, policies, nodes, and departments for Pinkman Protects.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={() => handleSaveSettings()}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest text-white font-bold bg-gradient-to-r from-brand-blue to-brand-cyan shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 border border-white/10"
        >
          {saving ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Check size={14} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Alert Banners */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs flex items-center gap-2"
          >
            <Check size={16} />
            {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl border border-brand-rose/20 bg-brand-rose/5 text-brand-rose text-xs flex items-center gap-2"
          >
            <AlertTriangle size={16} />
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-cyber-border/20 pb-px">
        {[
          { id: 'profile', label: 'Company Profile', icon: <Building2 size={14} /> },
          { id: 'branches', label: 'Branch Registry', icon: <MapPin size={14} /> },
          { id: 'departments', label: 'Departments', icon: <Briefcase size={14} /> },
          { id: 'security', label: 'Security Policies', icon: <Shield size={14} /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
          { id: 'system', label: 'System Health & Backups', icon: <Activity size={14} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 border-t border-x -mb-px flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-cyber-card border-cyber-border text-white border-b border-b-cyber-dark font-semibold'
                : 'border-transparent text-gray-500 hover:text-white hover:bg-white/3'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Canvas */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/[0.04]">
        
        {/* TAB 1: Company Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider border-b border-cyber-border pb-3 flex items-center gap-2">
              <Building2 className="text-brand-cyan" size={16} />
              Enterprise Profile Configurations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload Section */}
              <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2.5xl border border-white/[0.04] bg-white/[0.01]">
                <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-cyber-border flex flex-col items-center justify-center text-gray-600 shrink-0 relative overflow-hidden group">
                  {settings.profile.logoUrl ? (
                    <img src={settings.profile.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <>
                      <Building2 size={32} className="text-gray-500 animate-pulse" />
                      <span className="text-[9px] uppercase font-mono mt-1 text-gray-600">NO LOGO</span>
                    </>
                  )}
                </div>
                
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h3 className="text-sm font-semibold text-white">Organization Logo</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-sm">
                    Upload a high-resolution logo for Pinkman Protects dashboard headers and reports. Supports PNG or SVG format (Max size: 2MB).
                  </p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                    <button 
                      onClick={() => {
                        const newLogo = prompt("Enter mock image URL or leave empty to reset:");
                        updateProfile('logoUrl', newLogo || '');
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-cyber-border bg-white/3 hover:bg-white/5 hover:border-brand-blue/30 text-white text-[10px] uppercase font-mono tracking-wider transition flex items-center gap-1.5"
                    >
                      <Upload size={12} />
                      Upload Logo
                    </button>
                    {settings.profile.logoUrl && (
                      <button 
                        onClick={() => updateProfile('logoUrl', '')}
                        className="px-3.5 py-1.5 rounded-lg border border-transparent text-brand-rose hover:bg-brand-rose/10 text-[10px] uppercase font-mono tracking-wider transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Attributes */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Organization Name</label>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  placeholder="Pinkman Protects"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Organization Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="text"
                    value={settings.profile.domain}
                    onChange={(e) => updateProfile('domain', e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono"
                    placeholder="pinkmanprotects.co.in"
                  />
                </div>
              </div>

              {/* GST & CIN */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block flex items-center gap-1">
                  GSTIN (GST Number)
                  <span className="text-[8px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-bold">MOCK</span>
                </label>
                <input
                  type="text"
                  value={settings.profile.gstNumber}
                  onChange={(e) => updateProfile('gstNumber', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono uppercase"
                  placeholder="27AAPCP1234M1Z5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block flex items-center gap-1">
                  CIN Number (Company Identification)
                  <span className="text-[8px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.5 rounded font-bold">MOCK</span>
                </label>
                <input
                  type="text"
                  value={settings.profile.cinNumber}
                  onChange={(e) => updateProfile('cinNumber', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono uppercase"
                  placeholder="U74999MH2026PTC398247"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Company Address</label>
                <textarea
                  rows={2}
                  value={settings.profile.address}
                  onChange={(e) => updateProfile('address', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                  placeholder="Company Address details..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Support Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="email"
                    value={settings.profile.supportEmail}
                    onChange={(e) => updateProfile('supportEmail', e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    placeholder="support@pinkmanprotects.co.in"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="text"
                    value={settings.profile.contactNumber}
                    onChange={(e) => updateProfile('contactNumber', e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    placeholder="+91 20 4012 3456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Company Website</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                  <input
                    type="text"
                    value={settings.profile.website}
                    onChange={(e) => updateProfile('website', e.target.value)}
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono"
                    placeholder="https://www.pinkmanprotects.co.in"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Time Zone</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <select
                      value={settings.profile.timezone}
                      onChange={(e) => updateProfile('timezone', e.target.value)}
                      className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none bg-zinc-950 text-white"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC / Greenwich</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Default Language</label>
                  <select
                    value={settings.profile.language}
                    onChange={(e) => updateProfile('language', e.target.value)}
                    className="w-full glass-input px-4 py-2.5 rounded-xl text-xs appearance-none bg-zinc-950 text-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Branch Registry */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <MapPin className="text-brand-cyan" size={16} />
                Indian Branch Registry
              </h2>
              <button
                onClick={handleOpenAddBranch}
                className="px-3.5 py-1.5 rounded-lg border border-brand-blue/30 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-cyan text-[10px] font-mono uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Plus size={12} />
                Add Branch
              </button>
            </div>

            {/* Branches Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.branches.map((branch: any) => (
                <div 
                  key={branch.id} 
                  className={`p-5 rounded-2.5xl border transition relative flex flex-col justify-between h-44 ${
                    branch.isEnabled 
                      ? 'border-white/[0.04] bg-white/[0.01] hover:border-brand-blue/30' 
                      : 'border-white/[0.02] bg-black/40 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${branch.isEnabled ? 'bg-brand-cyan shadow-[0_0_8px_#06b6d4]' : 'bg-gray-500'}`} />
                        {branch.name}
                      </h3>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditBranch(branch)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-brand-cyan hover:bg-white/5 transition"
                          title="Edit Branch"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleToggleBranch(branch.id)}
                          className={`p-1.5 rounded-lg transition ${branch.isEnabled ? 'text-brand-rose hover:bg-brand-rose/10' : 'text-brand-emerald hover:bg-brand-emerald/10'}`}
                          title={branch.isEnabled ? 'Disable Branch' : 'Enable Branch'}
                        >
                          {branch.isEnabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-2.5">
                      Admin: <span className="text-gray-300 font-semibold">{branch.branchAdmin}</span>
                    </p>
                  </div>

                  <div className="border-t border-cyber-border/40 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-brand-cyan" />
                      {branch.employeeCount} Employees
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} className="text-brand-purple" />
                      {branch.activeCampaigns} Campaigns
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Department Management */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Briefcase className="text-brand-cyan" size={16} />
                Corporate Departments
              </h2>
              <button
                onClick={handleOpenAddDept}
                className="px-3.5 py-1.5 rounded-lg border border-brand-blue/30 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-cyan text-[10px] font-mono uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Plus size={12} />
                Create Department
              </button>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.departments.map((dept: any) => (
                <div 
                  key={dept.id} 
                  className={`p-5 rounded-2.5xl border transition relative flex flex-col justify-between h-44 ${
                    !dept.isArchived 
                      ? 'border-white/[0.04] bg-white/[0.01] hover:border-brand-purple/30' 
                      : 'border-white/[0.02] bg-black/40 opacity-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${!dept.isArchived ? 'bg-brand-purple shadow-[0_0_8px_#8b5cf6]' : 'bg-gray-700'}`} />
                        {dept.name}
                        {dept.isArchived && (
                          <span className="text-[8px] font-mono bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded uppercase font-bold">ARCHIVED</span>
                        )}
                      </h3>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditDept(dept)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-brand-cyan hover:bg-white/5 transition"
                          title="Edit Department"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleToggleDeptArchive(dept.id)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-mono uppercase transition ${!dept.isArchived ? 'text-brand-rose hover:bg-brand-rose/10' : 'text-brand-emerald hover:bg-brand-emerald/10'}`}
                          title={!dept.isArchived ? 'Archive Department' : 'Unarchive Department'}
                        >
                          {!dept.isArchived ? 'Archive' : 'Restore'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-2.5">
                      Manager: <span className="text-gray-300 font-semibold">{dept.managerName}</span>
                    </p>
                  </div>

                  <div className="border-t border-cyber-border/40 pt-3 flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-brand-cyan" />
                      {dept.employeeCount} Staff
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity size={12} className="text-brand-emerald" />
                      {dept.activeCampaigns} Active Drills
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Security Policies */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider border-b border-cyber-border pb-3 flex items-center gap-2">
              <Shield className="text-brand-cyan" size={16} />
              Corporate Security Policies
            </h2>

            <div className="p-4 rounded-xl border border-brand-rose/20 bg-brand-rose/5 text-xs text-gray-400 flex items-start gap-3">
              <AlertTriangle className="text-brand-rose shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-brand-rose uppercase font-mono text-[10px]">Mock Implementation Mode</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  These settings control policies enforced across Pinkman Protects awareness portals, employee registration forms, and phishing simulators. Modifications do not alter database engine attributes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Minimum Password Length</label>
                <input
                  type="number"
                  min={8}
                  max={32}
                  value={settings.securityPolicies.minPasswordLength}
                  onChange={(e) => updateSecurity('minPasswordLength', parseInt(e.target.value) || 12)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Password Expiry (Days)</label>
                <select
                  value={settings.securityPolicies.passwordExpiry}
                  onChange={(e) => updateSecurity('passwordExpiry', parseInt(e.target.value) || 90)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs appearance-none bg-zinc-950 text-white"
                >
                  <option value={30}>30 Days (Frequent)</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days (Standard)</option>
                  <option value={180}>180 Days</option>
                  <option value={0}>Never Expire</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={settings.securityPolicies.sessionTimeout}
                  onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value) || 15)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Multi-Factor Authentication (MFA)</label>
                <select
                  value={settings.securityPolicies.mfaPolicy}
                  onChange={(e) => updateSecurity('mfaPolicy', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs appearance-none bg-zinc-950 text-white"
                >
                  <option value="DISABLED">Disabled (Not Recommended)</option>
                  <option value="OPTIONAL">Optional (User Selected)</option>
                  <option value="ENFORCED">Enforced (All Admins & Employees)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Failed Login Attempt Lockout Limit</label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={settings.securityPolicies.loginAttemptLimit}
                  onChange={(e) => updateSecurity('loginAttemptLimit', parseInt(e.target.value) || 5)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Device Trust Verification</label>
                <select
                  value={settings.securityPolicies.deviceTrustPolicy}
                  onChange={(e) => updateSecurity('deviceTrustPolicy', e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs appearance-none bg-zinc-950 text-white"
                >
                  <option value="DISABLED">Disabled</option>
                  <option value="OPTIONAL">Optional Check</option>
                  <option value="REQUIRED">Required (Verify MAC/Device ID)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Account Lock Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={1440}
                  value={settings.securityPolicies.accountLockDuration}
                  onChange={(e) => updateSecurity('accountLockDuration', parseInt(e.target.value) || 30)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider border-b border-cyber-border pb-3 flex items-center gap-2">
              <Bell className="text-brand-cyan" size={16} />
              Notification Dispatch Matrix
            </h2>
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-2xl">
              Select notification categories that will trigger automatic email alerts or system logs to administrators, managers, and targeted users.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                { id: 'emailNotifications', label: 'Email Notifications', desc: 'Enable all system-generated email dispatches.' },
                { id: 'campaignAlerts', label: 'Campaign Alerts', desc: 'Notify admins on campaign updates and link clicks.' },
                { id: 'weeklyReports', label: 'Weekly Summary Digests', desc: 'Dispatch security health indexes every Monday.' },
                { id: 'monthlyReports', label: 'Monthly Compliance Review', desc: 'Auto-compile compliance reports on first of month.' },
                { id: 'securityAlerts', label: 'Critical Security Actions', desc: 'Notify immediately on policy updates and logs.' },
                { id: 'trainingReminders', label: 'Learning Center Reminders', desc: 'Remind employees to complete assigned security training.' }
              ].map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => updateNotification(notif.id, !settings.notifications[notif.id])}
                  className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white leading-snug">{notif.label}</h3>
                    <p className="text-[10px] text-gray-500 leading-normal">{notif.desc}</p>
                  </div>
                  <button className="shrink-0 text-brand-cyan mt-0.5">
                    {settings.notifications[notif.id] ? <ToggleRight size={22} /> : <ToggleLeft size={22} className="text-gray-600" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: System Health & Backups */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* System Health Column */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider border-b border-cyber-border pb-3 flex items-center gap-2">
                <Activity className="text-brand-cyan" size={16} />
                System Health Monitor
              </h2>

              <div className="space-y-4">
                
                {/* Health Indicators */}
                <div className="grid grid-cols-2 gap-4">
                  
                  <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Database Status</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    </div>
                    <p className="text-sm font-extrabold text-white font-mono">SQLite / OK</p>
                    <span className="text-[9px] font-mono text-gray-600">Size: ~2.4 MB</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">API Gateways</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    </div>
                    <p className="text-sm font-extrabold text-white font-mono">HEALTHY</p>
                    <span className="text-[9px] font-mono text-gray-600">Latency: 24 ms</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Background Jobs</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    </div>
                    <p className="text-sm font-extrabold text-white font-mono">IDLE / WATCHING</p>
                    <span className="text-[9px] font-mono text-gray-600">Cron: Every 30m</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Active Nodes</span>
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_8px_#06b6d4]" />
                    </div>
                    <p className="text-sm font-extrabold text-white font-mono">12 Admins/Managers</p>
                    <span className="text-[9px] font-mono text-gray-600">Uptime: 99.98%</span>
                  </div>

                </div>

                {/* Storage Bar */}
                <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <span>Target Storage Space</span>
                    <span className="text-white font-bold">24.2 GB / 100 GB</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 border border-cyber-border overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full" style={{ width: '24.2%' }} />
                  </div>
                </div>

                {/* Version and Env */}
                <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] font-mono text-[10px] text-gray-500 space-y-1 bg-black/40">
                  <div className="flex justify-between">
                    <span>SYSTEM VERSION:</span>
                    <span className="text-white font-bold">v2.4.0-enterprise</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ENV SPECIFICATION:</span>
                    <span className="text-brand-cyan">PRODUCTION_MODE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TIME CONTEXT:</span>
                    <span className="text-white">Asia/Kolkata (IST)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Backup & Restore Column */}
            <div className="space-y-6">
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider border-b border-cyber-border pb-3 flex items-center gap-2">
                <Database className="text-brand-cyan" size={16} />
                Backup & Disaster Recovery
              </h2>

              <div className="space-y-4">
                
                {/* Backup Actions card */}
                <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xs font-bold text-white">Manual Database Snapshot</h3>
                    <p className="text-[10px] text-gray-500">Create an immediate SQL snapshot of simulation history and keys.</p>
                  </div>
                  <button
                    onClick={handleTriggerManualBackup}
                    disabled={creatingBackup}
                    className="px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-widest text-white font-bold bg-brand-blue hover:bg-brand-blue/80 transition flex items-center gap-2"
                  >
                    {creatingBackup ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Backing up...
                      </>
                    ) : (
                      <>
                        <HardDrive size={12} />
                        Run Backup
                      </>
                    )}
                  </button>
                </div>

                {/* Backup Schedule settings */}
                <div className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white">Automated Backups Schedule</h3>
                    <p className="text-[10px] text-gray-500">Auto-snapshot database state on a recurring cron interval.</p>
                  </div>
                  <select
                    value={settings.backups.schedule}
                    onChange={(e) => {
                      const updated = {
                        ...settings,
                        backups: {
                          ...settings.backups,
                          schedule: e.target.value
                        }
                      };
                      setSettings(updated);
                      handleSaveSettings(updated);
                    }}
                    className="glass-input px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase bg-zinc-950 text-white"
                  >
                    <option value="HOURLY">Hourly</option>
                    <option value="DAILY">Daily (Standard)</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="OFF">Turned Off</option>
                  </select>
                </div>

                {/* Backup History Table */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Available Database Snapshots</h3>
                  
                  <div className="overflow-x-auto border border-cyber-border rounded-xl">
                    <table className="w-full text-[10px] font-mono text-left bg-black/20">
                      <thead>
                        <tr className="border-b border-cyber-border text-gray-500">
                          <th className="p-2.5">FILE NAME</th>
                          <th className="p-2.5">SIZE</th>
                          <th className="p-2.5">DATE (IST)</th>
                          <th className="p-2.5 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyber-border/40">
                        {settings.backups.history.map((backup: any) => (
                          <tr key={backup.id} className="hover:bg-white/2">
                            <td className="p-2.5 text-white truncate max-w-[120px]" title={backup.name}>
                              {backup.name}
                            </td>
                            <td className="p-2.5 text-gray-400">{backup.size}</td>
                            <td className="p-2.5 text-gray-500">
                              {new Date(backup.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </td>
                            <td className="p-2.5 text-right">
                              <button 
                                onClick={() => {
                                  const conf = confirm(`Are you sure you want to RESTORE organization database states to this backup? (${backup.name})\nThis is a mock operation.`);
                                  if (conf) alert('Database restore simulation complete. Active nodes synced.');
                                }}
                                className="text-brand-cyan hover:underline text-[9px]"
                              >
                                Restore
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* BRANCH ADD/EDIT MODAL */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/[0.08] bg-zinc-950 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <MapPin className="text-brand-cyan" size={16} />
                {isEditingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h3>
              <button 
                onClick={() => setShowBranchModal(false)}
                className="text-gray-500 hover:text-white text-xs font-mono uppercase"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Branch Name</label>
                <select
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  disabled={isEditingBranch}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-zinc-900 text-white"
                >
                  <option value="">Select Indian Location...</option>
                  {['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'].map((loc) => (
                    <option 
                      key={loc} 
                      value={loc}
                      disabled={settings.branches.some((b: any) => b.name === loc && b.id !== branchForm.id)}
                    >
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Branch Administrator Name</label>
                <input
                  type="text"
                  value={branchForm.branchAdmin}
                  onChange={(e) => setBranchForm({ ...branchForm, branchAdmin: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  placeholder="Sarah Jenkins"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Employee Count</label>
                  <input
                    type="number"
                    value={branchForm.employeeCount}
                    onChange={(e) => setBranchForm({ ...branchForm, employeeCount: parseInt(e.target.value) || 0 })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Active Campaigns</label>
                  <input
                    type="number"
                    value={branchForm.activeCampaigns}
                    onChange={(e) => setBranchForm({ ...branchForm, activeCampaigns: parseInt(e.target.value) || 0 })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-cyber-border/40 pt-4">
              <button 
                onClick={handleSaveBranch}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-[10px] uppercase font-mono font-bold tracking-wider"
              >
                Save Branch Config
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DEPARTMENT ADD/EDIT MODAL */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/[0.08] bg-zinc-950 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-cyber-border pb-3">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                <Briefcase className="text-brand-cyan" size={16} />
                {isEditingDept ? 'Edit Department' : 'Create Department'}
              </h3>
              <button 
                onClick={() => setShowDeptModal(false)}
                className="text-gray-500 hover:text-white text-xs font-mono uppercase"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Department Name</label>
                <select
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  disabled={isEditingDept}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-zinc-900 text-white"
                >
                  <option value="">Select Corporate Department...</option>
                  {['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'IT Support', 'Operations'].map((d) => (
                    <option 
                      key={d} 
                      value={d}
                      disabled={settings.departments.some((dep: any) => dep.name === d && dep.id !== deptForm.id)}
                    >
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Assigned Department Manager</label>
                <input
                  type="text"
                  value={deptForm.managerName}
                  onChange={(e) => setDeptForm({ ...deptForm, managerName: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  placeholder="Arjun Mehta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Employee Count</label>
                  <input
                    type="number"
                    value={deptForm.employeeCount}
                    onChange={(e) => setDeptForm({ ...deptForm, employeeCount: parseInt(e.target.value) || 0 })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Active Campaign Drills</label>
                  <input
                    type="number"
                    value={deptForm.activeCampaigns}
                    onChange={(e) => setDeptForm({ ...deptForm, activeCampaigns: parseInt(e.target.value) || 0 })}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-cyber-border/40 pt-4">
              <button 
                onClick={handleSaveDept}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-[10px] uppercase font-mono font-bold tracking-wider"
              >
                Save Department Config
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
