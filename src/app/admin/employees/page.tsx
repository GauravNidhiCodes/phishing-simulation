'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  Search,
  Sparkles,
  Info,
  ExternalLink,
  RefreshCw,
  Copy,
  Layers,
  Database
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  awarenessScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface Domain {
  id: string;
  domain: string;
  txtRecordKey: string;
  isVerified: boolean;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add Employee Form
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDept, setEmpDept] = useState('');
  const [addEmpError, setAddEmpError] = useState('');
  const [addingEmp, setAddingEmp] = useState(false);
  const [addEmpModalOpen, setAddEmpModalOpen] = useState(false);

  // Add Domain Form
  const [newDomain, setNewDomain] = useState('');
  const [addDomainError, setAddDomainError] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);
  const [addDomainModalOpen, setAddDomainModalOpen] = useState(false);

  const loadData = () => {
    fetch('/api/admin/employees')
      .then(res => res.json())
      .then(data => {
        if (data.employees) setEmployees(data.employees);
        if (data.domains) setDomains(data.domains);
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

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim()) return;

    setAddingEmp(true);
    setAddEmpError('');

    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_EMPLOYEE',
          name: empName,
          email: empEmail,
          department: empDept
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add employee');
      }

      setEmpName('');
      setEmpEmail('');
      setEmpDept('');
      setAddEmpModalOpen(false);
      loadData();
    } catch (err: any) {
      setAddEmpError(err.message);
    } finally {
      setAddingEmp(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setAddingDomain(true);
    setAddDomainError('');

    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_DOMAIN',
          domain: newDomain
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add domain');
      }

      setNewDomain('');
      setAddDomainModalOpen(false);
      loadData();
    } catch (err: any) {
      setAddDomainError(err.message);
    } finally {
      setAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainId })
      });
      if (res.ok) loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter employee roster
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <Database className="text-brand-cyan animate-pulse" size={20} />
        </div>
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase animate-pulse">Syncing Directory...</span>
          <p className="text-[10px] font-mono text-zinc-500">Retrieving corporate DNS maps & employee lists...</p>
        </div>
      </div>
    );
  }

  // Framer motion configs
  const tableContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] bg-brand-blue/2 rounded-full blur-[130px] pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-cyan font-bold">organization Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Roster & Domains
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Verify organizational domain authority and manage simulated targets.</p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => setAddDomainModalOpen(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 active:scale-[0.98] text-zinc-200 hover:text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-200 text-xs font-mono uppercase tracking-wider"
          >
            <Globe size={13} /> Add Domain
          </button>
          <button
            onClick={() => setAddEmpModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(6,182,212,0.18)] text-xs font-mono uppercase tracking-wider border border-white/10"
          >
            <Plus size={13} className="stroke-[3]" /> Add Employee
          </button>
        </div>
      </div>

      {/* Domain Panel Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-white/[0.04] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/2 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Globe size={16} className="text-brand-cyan" /> Authorized Corporate Domains
          </h2>
          <p className="text-xs text-zinc-400 font-mono">Simulation campaign nodes strictly validate and restrict dispatch to the verified domains listed below.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map(dom => (
            <div 
              key={dom.id} 
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 flex flex-col justify-between space-y-4 hover:shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300 relative group"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-white tracking-tight group-hover:text-brand-cyan transition">{dom.domain}</span>
                  {dom.isVerified ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-mono font-bold flex items-center gap-1 animate-pulse">
                      <AlertCircle size={10} /> Verification Pending
                    </span>
                  )}
                </div>

                {!dom.isVerified && (
                  <div className="bg-black/60 border border-white/[0.05] p-3 rounded-xl text-[10px] space-y-2 relative">
                    <span className="text-zinc-500 font-mono block text-[8px] uppercase tracking-wider font-bold">DNS TXT Record Target Value:</span>
                    <div className="flex items-center justify-between gap-2 bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
                      <code className="block text-brand-cyan select-all break-all font-mono text-[9px] w-full">{dom.txtRecordKey}</code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(dom.txtRecordKey)}
                        className="text-zinc-500 hover:text-white p-1 transition"
                        title="Copy record"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!dom.isVerified && (
                <button
                  onClick={() => handleVerifyDomain(dom.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 text-brand-cyan text-[10px] font-bold font-mono uppercase tracking-wider transition-all duration-200"
                >
                  <RefreshCw size={12} className="animate-spin-slow" /> Verify TXT Record
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Roster Directory list */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 px-2 block font-bold">Employees Registry ({filteredEmployees.length})</span>
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-3 text-zinc-500" size={14} />
            <input
              type="text"
              placeholder="Filter roster by parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.04] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                  <th className="px-6 py-4.5 font-bold">Name</th>
                  <th className="px-6 py-4.5 font-bold">Email Address</th>
                  <th className="px-6 py-4.5 font-bold">Department</th>
                  <th className="px-6 py-4.5 text-center font-bold">Awareness Score</th>
                  <th className="px-6 py-4.5 text-center font-bold">Risk Profile</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={tableContainer}
                initial="hidden"
                animate="show"
                className="divide-y divide-white/[0.02] text-xs font-mono"
              >
                {filteredEmployees.map(emp => (
                  <motion.tr 
                    key={emp.id} 
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1 }
                    }}
                    className="hover:bg-white/[0.015] border-l-2 border-l-transparent hover:border-l-brand-cyan/40 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-extrabold text-white text-xs tracking-tight">{emp.name}</td>
                    <td className="px-6 py-4 text-zinc-400">{emp.email}</td>
                    <td className="px-6 py-4 text-zinc-400">{emp.department}</td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span className={emp.awarenessScore >= 80 ? 'text-emerald-400' : emp.awarenessScore >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                        {emp.awarenessScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                          emp.riskCategory === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          emp.riskCategory === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {emp.riskCategory}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {addEmpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddEmpModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-white/[0.06] overflow-hidden bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                    <Users size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight font-sans">Add Employee</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">REGISTER TARGET NODE</p>
                  </div>
                </div>
                <button onClick={() => setAddEmpModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                  <X size={18} />
                </button>
              </div>

              {addEmpError && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-[11px] text-brand-rose flex items-start gap-2 font-mono">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{addEmpError}</span>
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john.doe@acme.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Department Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div className="flex gap-4 border-t border-white/[0.04] pt-5">
                  <button
                    type="button"
                    onClick={() => setAddEmpModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white font-bold transition text-xs font-mono uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingEmp}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold transition text-xs font-mono uppercase tracking-wider border border-white/10"
                  >
                    {addingEmp ? 'Registering...' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Domain Modal */}
      <AnimatePresence>
        {addDomainModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddDomainModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-white/[0.06] overflow-hidden bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                    <Globe size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight font-sans">Add Domain</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">AUTHORIZE DOMAIN MATRIX</p>
                  </div>
                </div>
                <button onClick={() => setAddDomainModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                  <X size={18} />
                </button>
              </div>

              {addDomainError && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-[11px] text-brand-rose flex items-start gap-2 font-mono">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{addDomainError}</span>
                </div>
              )}

              <form onSubmit={handleAddDomain} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Domain Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acme-it.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div className="flex gap-4 border-t border-white/[0.04] pt-5">
                  <button
                    type="button"
                    onClick={() => setAddDomainModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white font-bold transition text-xs font-mono uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingDomain}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold transition text-xs font-mono uppercase tracking-wider border border-white/10"
                  >
                    {addingDomain ? 'Adding...' : 'Add Domain'}
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

