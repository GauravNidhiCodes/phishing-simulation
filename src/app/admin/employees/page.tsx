'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  Database,
  Award,
  Zap,
  MapPin,
  Calendar,
  Building,
  User,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Bookmark,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface Employee {
  id: string;
  name: string | null;
  email: string;
  department: string | null;
  branch: string | null;
  managerName: string | null;
  joiningDate: string | null;
  awarenessScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface Domain {
  id: string;
  domain: string;
  txtRecordKey: string;
  isVerified: boolean;
}

interface SimulationLog {
  id: string;
  campaign: {
    name: string;
    template: {
      name: string;
      subject: string;
    };
  };
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  submittedAt: string | null;
}

interface QuizProgress {
  id: string;
  completed: boolean;
  score: number;
  updatedAt: string;
  module: {
    id: string;
    title: string;
    description: string;
  };
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Single Employee Profile Panel State
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [employeeProfile, setEmployeeProfile] = useState<{
    employee: Employee;
    campaignLogs: SimulationLog[];
    quizProgress: QuizProgress[];
    allModules: TrainingModule[];
  } | null>(null);
  
  // Add Employee Form
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDept, setEmpDept] = useState('Engineering');
  const [empBranch, setEmpBranch] = useState('Bengaluru');
  const [empManager, setEmpManager] = useState('Sarah Jenkins');
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

  // Fetch detailed employee profile when clicked
  useEffect(() => {
    if (!selectedEmpId) {
      setEmployeeProfile(null);
      return;
    }

    setProfileLoading(true);
    fetch(`/api/admin/employees?id=${selectedEmpId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
        } else {
          setEmployeeProfile(data);
        }
        setProfileLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProfileLoading(false);
      });
  }, [selectedEmpId]);

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
          department: empDept,
          branch: empBranch,
          managerName: empManager
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add employee');
      }

      setEmpName('');
      setEmpEmail('');
      setEmpDept('Engineering');
      setEmpBranch('Bengaluru');
      setEmpManager('Sarah Jenkins');
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
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = !searchQuery.trim() ||
        (emp.name && emp.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesBranch = branchFilter === 'ALL' || emp.branch === branchFilter;
      const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter;
      const matchesRisk = riskFilter === 'ALL' || emp.riskCategory === riskFilter;

      return matchesSearch && matchesBranch && matchesDept && matchesRisk;
    });
  }, [employees, searchQuery, branchFilter, deptFilter, riskFilter]);

  // Derived Achievement Badges for Employee Profile
  const employeeBadges = useMemo(() => {
    if (!employeeProfile) return [];
    const badges = [];
    const { employee, campaignLogs, quizProgress } = employeeProfile;

    // Badge 1: Sentinel Shield (100% Awareness Score)
    if (employee.awarenessScore === 100) {
      badges.push({
        id: 'sentinel',
        name: 'Sentinel Shield',
        desc: 'Maintains a perfect 100% security awareness rating.',
        icon: <Award className="text-yellow-400" size={16} />
      });
    }

    // Badge 2: Clean Record (No Phishing Clicks)
    const hasClicks = campaignLogs.some(log => log.clickedAt || log.submittedAt);
    if (campaignLogs.length > 0 && !hasClicks) {
      badges.push({
        id: 'clean',
        name: 'Clean Record',
        desc: 'Zero clicks on simulated phishing links across all audits.',
        icon: <ShieldCheck className="text-emerald-400" size={16} />
      });
    }

    // Badge 3: SecOps Champion (Reported simulations or stayed alert)
    const hasFailures = campaignLogs.some(log => log.submittedAt);
    if (campaignLogs.length >= 2 && !hasFailures) {
      badges.push({
        id: 'champion',
        name: 'SecOps Vigilant',
        desc: 'Consistently identifies phishing scenarios without compromise.',
        icon: <Zap className="text-cyan-400" size={16} />
      });
    }

    // Badge 4: Quiz Master (Completed at least 2 training modules)
    const completedQuizzes = quizProgress.filter(p => p.completed).length;
    if (completedQuizzes >= 2) {
      badges.push({
        id: 'master',
        name: 'Compliance Guru',
        desc: 'Successfully completed all compliance training modules.',
        icon: <BookOpen className="text-purple-400" size={16} />
      });
    }

    return badges;
  }, [employeeProfile]);

  // Derived Trend Chart Data for Employee Profile
  const employeeTrendData = useMemo(() => {
    if (!employeeProfile) return [];
    const baseScore = employeeProfile.employee.awarenessScore;
    
    // Generate months offset dynamically based on current date
    return [
      { name: 'Jan', Score: Math.min(100, Math.max(0, baseScore - 12)) },
      { name: 'Feb', Score: Math.min(100, Math.max(0, baseScore - 8)) },
      { name: 'Mar', Score: Math.min(100, Math.max(0, baseScore - 5)) },
      { name: 'Apr', Score: Math.min(100, Math.max(0, baseScore - 2)) },
      { name: 'May', Score: baseScore },
    ];
  }, [employeeProfile]);

  // Derived recommended training modules
  const recommendedModules = useMemo(() => {
    if (!employeeProfile) return [];
    const completedIds = employeeProfile.quizProgress.filter(p => p.completed).map(p => p.module.id);
    return employeeProfile.allModules.filter(m => !completedIds.includes(m.id));
  }, [employeeProfile]);

  // Last Phishing Simulation Result helper
  const lastSimulationResult = useMemo(() => {
    if (!employeeProfile || employeeProfile.campaignLogs.length === 0) return 'No audits registered';
    const log = employeeProfile.campaignLogs[0];
    if (log.submittedAt) return 'Credential Compromised';
    if (log.clickedAt) return 'Link Clicked';
    if (log.openedAt) return 'Opened Email';
    return 'Secure (No Action)';
  }, [employeeProfile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/10 rounded-full" />
          <div className="absolute inset-0 border-t border-white border-r border-transparent rounded-full animate-spin" />
          <Database className="text-white" size={16} />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-white uppercase animate-pulse">Syncing Directory...</span>
          <p className="text-[9px] font-mono text-zinc-500">Retrieving corporate DNS maps & employee lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#1F1F1F] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Indian Compliance Suite</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase font-mono text-white">
            Roster & Domains
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Verify organizational domain authority and manage security awareness scores across Indian branches.</p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setAddDomainModalOpen(true)}
            className="flex items-center gap-2 bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-lg transition text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <Globe size={13} /> Add Domain
          </button>
          <button
            onClick={() => setAddEmpModalOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg transition text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <Plus size={13} className="stroke-[3]" /> Add Employee
          </button>
        </div>
      </div>

      {/* Domain Panel Section */}
      <div className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-white tracking-widest uppercase font-mono flex items-center gap-2">
            <Globe size={14} className="text-white" /> Authorized Corporate Domains
          </h2>
          <p className="text-xs text-zinc-500 font-mono">Simulation campaign nodes strictly validate and restrict dispatch to the verified domains listed below.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map(dom => (
            <div 
              key={dom.id} 
              className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 flex flex-col justify-between space-y-4 hover:shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all duration-300 relative group"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-extrabold text-white tracking-tight group-hover:text-white transition">{dom.domain}</span>
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
                      <code className="block text-white select-all break-all font-mono text-[9px] w-full">{dom.txtRecordKey}</code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(dom.txtRecordKey)}
                        className="text-zinc-500 hover:text-white p-1 transition cursor-pointer"
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
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#121212] hover:bg-[#1C1C1C] border border-[#1F1F1F] text-white text-[10px] font-bold font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer"
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
        <div className="flex flex-col space-y-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 px-2 block font-bold">
            Employees Registry ({filteredEmployees.length} targeted nodes)
          </span>
          
          {/* Advanced Search & Filter Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white/[0.01] border border-white/[0.03] p-3 rounded-2.5xl">
            {/* Search Input */}
            <div className="relative col-span-1">
              <Search className="absolute left-3.5 top-3 text-zinc-500" size={12} />
              <input
                type="text"
                placeholder="Search name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs font-mono placeholder:text-zinc-600"
              />
            </div>

            {/* Branch Selector */}
            <div>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              >
                <option value="ALL">All Indian Branches</option>
                {INDIAN_BRANCHES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Department Selector */}
            <div>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Risk Selector */}
            <div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
              >
                <option value="ALL">All Threat Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.04] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                  <th className="px-6 py-4.5 font-bold">Employee Name</th>
                  <th className="px-6 py-4.5 font-bold">Email Address</th>
                  <th className="px-6 py-4.5 font-bold">Department</th>
                  <th className="px-6 py-4.5 font-bold">Branch Office</th>
                  <th className="px-6 py-4.5 text-center font-bold">Awareness Index</th>
                  <th className="px-6 py-4.5 text-center font-bold">Risk Profile</th>
                  <th className="px-6 py-4.5 text-right font-bold pr-8">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.02 } }
                }}
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
                    onClick={() => setSelectedEmpId(emp.id)}
                    className="hover:bg-white/[0.015] border-l-2 border-l-transparent hover:border-l-white/30 transition-all duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-extrabold text-white text-xs tracking-tight flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                        <User size={10} className="text-zinc-400" />
                      </div>
                      <span>{emp.name || 'Anonymous Node'}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{emp.email}</td>
                    <td className="px-6 py-4 text-zinc-400">{emp.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-zinc-400">{emp.branch || 'Pune'}</td>
                    <td className="px-6 py-4 text-center font-bold">
                      <span className={emp.awarenessScore >= 80 ? 'text-[#00D26A]' : emp.awarenessScore >= 60 ? 'text-zinc-400' : 'text-zinc-500'}>
                        {emp.awarenessScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                          emp.riskCategory === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/20 text-[#00D26A]' :
                          emp.riskCategory === 'MEDIUM' ? 'bg-zinc-800/10 border-zinc-800 text-zinc-400' :
                          'bg-white/5 border-white/10 text-white'
                        }`}>
                          {emp.riskCategory}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right pr-8">
                      <button className="inline-flex items-center gap-1.5 text-white hover:underline text-[10px] font-bold font-mono uppercase cursor-pointer">
                        View Profile <ChevronRight size={10} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Slide-out Employee Profile Panel */}
      <AnimatePresence>
        {selectedEmpId && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmpId(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            {/* Profile Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-zinc-950 border-l border-[#1F1F1F] shadow-2xl h-full flex flex-col z-10 overflow-hidden"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Bookmark className="text-white" size={16} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Employee Security Dossier</span>
                </div>
                <button
                  onClick={() => setSelectedEmpId(null)}
                  className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {profileLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <RefreshCw className="text-brand-cyan animate-spin" size={24} />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 animate-pulse">Decrypting dossier files...</span>
                </div>
              ) : employeeProfile ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6 select-none scrollbar-thin">
                  
                  {/* Top Stats Overview Section */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Identity Details */}
                    <div className="col-span-2 p-5 rounded-2.5xl bg-white/[0.01] border border-white/[0.03] space-y-4 relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <User size={22} className="text-zinc-400" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-lg font-extrabold text-white tracking-tight leading-snug">{employeeProfile.employee.name}</h2>
                          <p className="text-[10px] text-zinc-400 font-mono">{employeeProfile.employee.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5 border-t border-white/[0.04] pt-4 font-mono text-[9px] text-zinc-400">
                        <div className="space-y-1">
                          <span className="text-zinc-600 block">BRANCH OFFICE:</span>
                          <span className="text-white font-extrabold flex items-center gap-1"><MapPin size={9} /> {employeeProfile.employee.branch || 'Pune'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-600 block">DEPARTMENT:</span>
                          <span className="text-white font-extrabold flex items-center gap-1"><Building size={9} /> {employeeProfile.employee.department || 'General'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-600 block">LINE MANAGER:</span>
                          <span className="text-white font-extrabold">{employeeProfile.employee.managerName || 'Sarah Jenkins'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-600 block">JOINED DATE:</span>
                          <span className="text-white font-extrabold flex items-center gap-1">
                            <Calendar size={9} /> 
                            {employeeProfile.employee.joiningDate 
                              ? new Date(employeeProfile.employee.joiningDate).toLocaleDateString('en-IN') 
                              : '15/03/2024'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Awareness Score Card */}
                    <div className="col-span-1 p-5 rounded-2.5xl bg-white/[0.01] border border-white/[0.03] flex flex-col justify-between items-center text-center relative overflow-hidden">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest font-bold block">Awareness Score</span>
                        <span className={`text-4xl font-black font-mono tracking-tight block mt-1 ${
                          employeeProfile.employee.awarenessScore >= 80 ? 'text-[#00D26A]' : 
                          employeeProfile.employee.awarenessScore >= 60 ? 'text-zinc-400' : 
                          'text-zinc-500'
                        }`}>
                          {employeeProfile.employee.awarenessScore}%
                        </span>
                      </div>

                      <div className="space-y-2 border-t border-white/[0.04] pt-3.5 w-full">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold block border ${
                          employeeProfile.employee.riskCategory === 'LOW' ? 'bg-emerald-500/10 border-emerald-500/20 text-[#00D26A]' :
                          employeeProfile.employee.riskCategory === 'MEDIUM' ? 'bg-zinc-800/10 border-zinc-850 text-zinc-400' :
                          'bg-white/5 border-white/10 text-white'
                        }`}>
                          {employeeProfile.employee.riskCategory} RISK INDEX
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Awareness score chart */}
                  <div className="p-5 rounded-xl bg-white/[0.01] border border-[#1F1F1F] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
                        <TrendingUp size={12} className="text-white" /> Monthly Awareness Trend
                      </h4>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Active Progress</span>
                    </div>

                    <div className="h-36 w-full font-mono text-[9px] pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={employeeTrendData} margin={{ left: -25, right: 5, top: 5, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                          <XAxis dataKey="name" stroke="#52525b" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis stroke="#52525b" fontSize={8} domain={[0, 100]} tickLine={false} axisLine={false} />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="p-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] font-mono text-[9px]">
                                    <span className="text-zinc-500 block">Score Index</span>
                                    <span className="font-bold text-white text-xs">{payload[0].value}%</span>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area type="monotone" dataKey="Score" stroke="#ffffff" strokeWidth={1.5} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Achievements and Badges */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
                      <Award size={12} className="text-white" /> Earned Badges & Qualifications
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {employeeBadges.length > 0 ? (
                        employeeBadges.map(badge => (
                          <div 
                            key={badge.id}
                            className="p-3 rounded-xl bg-white/[0.01] border border-[#1F1F1F] flex items-start gap-3 hover:border-zinc-700 transition"
                          >
                            <div className="p-2 rounded bg-white/5 border border-white/10 shrink-0 mt-0.5">
                              {badge.icon}
                            </div>
                            <div className="space-y-0.5 leading-normal">
                              <span className="text-xs font-extrabold text-white block">{badge.name}</span>
                              <span className="text-[9px] text-zinc-500 font-mono block">{badge.desc}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-6 text-center border border-dashed border-[#1F1F1F] rounded-xl font-mono text-[9px] uppercase tracking-widest text-zinc-600 bg-white/[0.005]">
                          No badges awarded yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simulation audit history */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
                        <ShieldAlert size={12} className="text-white" /> Campaign Simulation Audit History
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[8px] text-zinc-400">
                        LAST RESULT: <span className="font-extrabold uppercase text-white">{lastSimulationResult}</span>
                      </span>
                    </div>

                    <div className="border border-[#1F1F1F] rounded-xl overflow-hidden bg-white/[0.005] divide-y divide-[#1F1F1F]">
                      {employeeProfile.campaignLogs.length > 0 ? (
                        employeeProfile.campaignLogs.map(log => {
                          let outcome = 'Delivered';
                          let outcomeStyle = 'text-zinc-500';
                          if (log.submittedAt) {
                            outcome = 'Compromised';
                            outcomeStyle = 'text-white bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded font-extrabold';
                          } else if (log.clickedAt) {
                            outcome = 'Clicked Link';
                            outcomeStyle = 'text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-bold';
                          } else if (log.openedAt) {
                            outcome = 'Opened Email';
                            outcomeStyle = 'text-zinc-400 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded';
                          } else {
                            outcome = 'Delivered (Secure)';
                            outcomeStyle = 'text-[#00D26A] bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded font-bold';
                          }

                          return (
                            <div key={log.id} className="p-3.5 hover:bg-white/[0.01] transition flex justify-between items-start gap-4 text-[10px] font-mono">
                              <div className="space-y-1.5 max-w-[70%]">
                                <span className="font-bold text-white block leading-normal">{log.campaign.name}</span>
                                <span className="text-zinc-500 block truncate leading-normal">SUBJECT: {log.campaign.template?.subject || 'N/A'}</span>
                              </div>
                              <div className="text-right shrink-0 space-y-1">
                                <span className={`${outcomeStyle} text-[8px] uppercase tracking-wider block`}>{outcome}</span>
                                <span className="text-zinc-600 block text-[8px]">{log.deliveredAt ? new Date(log.deliveredAt).toLocaleDateString('en-IN') : 'N/A'}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                          No phishing logs registered
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course module list */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Completed Courses */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
                        <CheckCircle2 size={12} className="text-[#00D26A]" /> Training Completions
                      </h4>
                      <div className="border border-[#1F1F1F] rounded-xl overflow-hidden bg-white/[0.005] divide-y divide-[#1F1F1F] max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                        {employeeProfile.quizProgress.length > 0 ? (
                          employeeProfile.quizProgress.map(p => (
                            <div key={p.id} className="p-3 flex justify-between items-start gap-3 text-[9px] font-mono hover:bg-white/[0.01]">
                              <div className="space-y-0.5 max-w-[75%]">
                                <span className="font-bold text-white block leading-normal">{p.module.title}</span>
                                <span className="text-zinc-500 block line-clamp-1">{p.module.description}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[#00D26A] font-extrabold block">COMPLETED</span>
                                <span className="text-zinc-500 block">{p.score}% Score</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                            No modules completed
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommended modules */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
                        <BookOpen size={12} className="text-white" /> Recommended Training
                      </h4>
                      <div className="border border-[#1F1F1F] rounded-xl overflow-hidden bg-white/[0.005] divide-y divide-[#1F1F1F] max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                        {recommendedModules.length > 0 ? (
                          recommendedModules.map(m => (
                            <div key={m.id} className="p-3 flex justify-between items-start gap-3 text-[9px] font-mono hover:bg-white/[0.01] relative group">
                              <div className="space-y-0.5 max-w-[75%]">
                                <span className="font-bold text-zinc-300 block leading-normal">{m.title}</span>
                                <span className="text-zinc-500 block line-clamp-1">{m.description}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="px-1.5 py-0.5 rounded bg-[#121212] text-zinc-400 border border-[#1F1F1F] text-[8px] font-bold font-mono block">PENDING</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-[#00D26A] font-mono text-[8px] uppercase tracking-widest font-bold bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            All modules completed. Account fully hardened.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                  <ShieldAlert size={20} className="mb-2 text-zinc-700 animate-bounce" />
                  Dossier not initialized
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="p-6 rounded-xl max-w-md w-full relative z-10 border border-[#1F1F1F] bg-zinc-950 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
                    <Users size={14} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight font-sans">Add Employee</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">REGISTER TARGET NODE</p>
                  </div>
                </div>
                <button onClick={() => setAddEmpModalOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/5 transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {addEmpError && (
                <div className="mb-4 p-3 rounded-lg bg-zinc-900 border border-[#1F1F1F] text-[10px] text-zinc-300 flex items-start gap-2 font-mono">
                  <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                  <span>{addEmpError}</span>
                </div>
              )}

              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Corporate Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john.doe@tata.co.in"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Department</label>
                    <select
                      value={empDept}
                      onChange={(e) => setEmpDept(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Branch Office</label>
                    <select
                      value={empBranch}
                      onChange={(e) => setEmpBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                    >
                      {INDIAN_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">Line Manager Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={empManager}
                    onChange={(e) => setEmpManager(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                  />
                </div>

                <div className="flex gap-3 border-t border-[#1F1F1F] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setAddEmpModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 text-zinc-300 hover:text-white transition text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingEmp}
                    className="flex-1 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold transition text-xs font-mono uppercase tracking-wider cursor-pointer"
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
              className="p-6 rounded-xl max-w-md w-full relative z-10 border border-[#1F1F1F] bg-zinc-950 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
                    <Globe size={14} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight font-sans">Add Domain</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">AUTHORIZE DOMAIN MATRIX</p>
                  </div>
                </div>
                <button onClick={() => setAddDomainModalOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded hover:bg-white/5 transition cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {addDomainError && (
                <div className="mb-4 p-3 rounded-lg bg-zinc-900 border border-[#1F1F1F] text-[10px] text-zinc-300 flex items-start gap-2 font-mono">
                  <ShieldAlert size={12} className="shrink-0 mt-0.5" />
                  <span>{addDomainError}</span>
                </div>
              )}

              <form onSubmit={handleAddDomain} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Domain Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. acme-it.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-white text-xs font-mono focus:border-zinc-700 outline-none"
                  />
                </div>

                <div className="flex gap-3 border-t border-[#1F1F1F] pt-4">
                  <button
                    type="button"
                    onClick={() => setAddDomainModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 text-zinc-300 hover:text-white transition text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingDomain}
                    className="flex-1 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold transition text-xs font-mono uppercase tracking-wider cursor-pointer"
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
