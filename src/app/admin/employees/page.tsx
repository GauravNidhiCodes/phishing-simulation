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
  RefreshCw
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Directory Infrastructure...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Roster & Domains</h1>
          <p className="text-sm text-gray-400">Verify organizational domain authority and manage simulated targets.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAddDomainModalOpen(true)}
            className="flex items-center gap-2 bg-white/5 border border-cyber-border hover:bg-white/10 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
          >
            <Globe size={16} /> Add Domain
          </button>
          <button
            onClick={() => setAddEmpModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 shadow-[0_4px_20px_rgba(6,182,212,0.2)] text-sm"
          >
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Domain Panel Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe size={18} className="text-brand-cyan" /> Authorized Corporate Domains
          </h2>
          <p className="text-xs text-gray-400">Campaign target emails are restricted strictly to domains listed and verified below.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map(dom => (
            <div key={dom.id} className="p-5 rounded-2xl bg-white/3 border border-cyber-border/60 flex flex-col justify-between space-y-4 hover:border-cyber-border-hover transition">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">{dom.domain}</span>
                  {dom.isVerified ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                      <AlertCircle size={10} /> Pending DNS
                    </span>
                  )}
                </div>

                {!dom.isVerified && (
                  <div className="bg-black/40 border border-cyber-border p-2.5 rounded-lg text-[10px] space-y-1">
                    <span className="text-gray-500 font-mono">DNS TXT VALUE:</span>
                    <code className="block text-brand-cyan select-all break-all bg-white/5 p-1 rounded font-mono text-[9px]">{dom.txtRecordKey}</code>
                  </div>
                )}
              </div>

              {!dom.isVerified && (
                <button
                  onClick={() => handleVerifyDomain(dom.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold font-mono transition"
                >
                  <RefreshCw size={12} /> Verify TXT Record
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Roster Directory list */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500 px-2">Employees Directory ({filteredEmployees.length})</span>
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-2.5 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search roster by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-cyber-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyber-border bg-white/3 text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-center">Awareness Score</th>
                  <th className="px-6 py-4 text-center">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 text-xs">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-white/2 transition">
                    <td className="px-6 py-4 font-semibold text-white">{emp.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono">{emp.department}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono">
                      <span className={emp.awarenessScore >= 80 ? 'text-emerald-400' : emp.awarenessScore >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                        {emp.awarenessScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          emp.riskCategory === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          emp.riskCategory === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {emp.riskCategory}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
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
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddEmpModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-cyber-border overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add New Employee</h2>
                <button onClick={() => setAddEmpModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {addEmpError && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-xs text-brand-rose flex items-start gap-2">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{addEmpError}</span>
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john.doe@acme.com"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">Department Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAddEmpModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingEmp}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold transition text-sm"
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
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddDomainModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-cyber-border overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add Corporate Domain</h2>
                <button onClick={() => setAddDomainModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              {addDomainError && (
                <div className="mb-4 p-3 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-xs text-brand-rose flex items-start gap-2">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{addDomainError}</span>
                </div>
              )}

              <form onSubmit={handleAddDomain} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 font-semibold">Domain Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acme-it.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAddDomainModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingDomain}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold transition text-sm"
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
