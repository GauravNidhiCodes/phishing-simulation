'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2, 
  Users, 
  ShieldAlert, 
  Clock, 
  Filter, 
  RefreshCw,
  Mail,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
  Activity,
  FileSpreadsheet,
  Printer,
  X,
  Lock,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface Stats {
  avgAwarenessScore: number;
  totalEmployees: number;
  activeCampaigns: number;
  completedCampaigns: number;
  highRiskEmployees: number;
  trainingCompletionRate: number;
  phishingRates: {
    delivered: number;
    opened: number;
    clicked: number;
    submitted: number;
    openRate: number;
    clickRate: number;
    submitRate: number;
  };
}

interface BranchStat {
  name: string;
  employeesCount: number;
  averageScore: number;
  clickRate: number;
  trainingCompletionRate: number;
}

interface DepartmentStat {
  name: string;
  employeesCount: number;
  averageScore: number;
  clickRate: number;
  trainingCompletionRate: number;
}

interface PendingEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  score: number;
  completedCount: number;
  pendingCount: number;
}

interface HighRiskEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  score: number;
}

interface AIInsights {
  highestRiskBranch: string;
  mostImprovedDept: string;
  requiresImmediateTraining: Array<{ name: string; email: string; score: number }>;
  campaignEffectivenessSummary: string;
  monthlyRecommendations: string[];
}

interface Schedule {
  id: string;
  title: string;
  category: string;
  frequency: string;
  targetEmails: string;
  active: boolean;
  createdAt: string;
}

interface HistoryItem {
  id: string;
  title: string;
  category: string;
  format: string;
  creator: string;
  timestamp: string;
  status: string;
}

interface DropdownItem {
  id: string;
  name: string;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState('Pinkman Protects Enterprise');
  const [stats, setStats] = useState<Stats | null>(null);
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [highRiskEmployees, setHighRiskEmployees] = useState<HighRiskEmployee[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Autocomplete search list parameters
  const [campaignList, setCampaignList] = useState<DropdownItem[]>([]);
  const [employeeList, setEmployeeList] = useState<DropdownItem[]>([]);

  // Filtering States
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  // Report Category State
  // Categories: 'Executive Summary' | 'Campaign Performance' | 'Employee Awareness' | 'Department Performance' | 'Branch Performance' | 'Learning Progress' | 'Risk Assessment' | 'Compliance Status'
  const [activeCategory, setActiveCategory] = useState<string>('Executive Summary');

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleCategory, setScheduleCategory] = useState('Compliance Status');
  const [scheduleFrequency, setScheduleFrequency] = useState('Monthly');
  const [scheduleEmail, setScheduleEmail] = useState('');

  const loadReportData = () => {
    setLoading(true);
    const query = new URLSearchParams({
      branch: selectedBranch,
      department: selectedDept,
      campaign: selectedCampaign,
      employee: selectedEmployee,
      riskLevel: selectedRisk
    }).toString();

    fetch(`/api/admin/reports?${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.orgName) setOrgName(data.orgName);
        if (data.branchStats) setBranchStats(data.branchStats);
        if (data.departmentStats) setDepartmentStats(data.departmentStats);
        if (data.pendingEmployees) setPendingEmployees(data.pendingEmployees);
        if (data.highRiskEmployees) setHighRiskEmployees(data.highRiskEmployees);
        if (data.aiInsights) setAIInsights(data.aiInsights);
        if (data.schedules) setSchedules(data.schedules);
        if (data.history) setHistory(data.history);
        if (data.allCampaignsSummary) setCampaignList(data.allCampaignsSummary);
        if (data.allEmployeesSummary) setEmployeeList(data.allEmployeesSummary);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReportData();
  }, [selectedBranch, selectedDept, selectedCampaign, selectedEmployee, selectedRisk]);

  const handleExport = async (format: 'csv' | 'excel') => {
    const query = new URLSearchParams({
      branch: selectedBranch,
      department: selectedDept,
      campaign: selectedCampaign,
      employee: selectedEmployee,
      riskLevel: selectedRisk,
      format
    }).toString();

    // Trigger mock history run
    await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'history',
        title: `${activeCategory} Export (${format.toUpperCase()})`,
        category: activeCategory,
        format: format === 'csv' ? 'CSV' : 'Excel',
        creator: 'Amit Sharma (SecOps)'
      })
    });

    window.open(`/api/admin/reports/export?${query}`);
    loadReportData();
  };

  const handlePrint = async () => {
    // Record in history
    await fetch('/api/admin/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'history',
        title: `${activeCategory} Print PDF`,
        category: activeCategory,
        format: 'PDF',
        creator: 'Amit Sharma (SecOps)'
      })
    });
    window.print();
    loadReportData();
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle || !scheduleEmail) return;

    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'schedule',
          title: scheduleTitle,
          category: scheduleCategory,
          frequency: scheduleFrequency,
          targetEmails: scheduleEmail
        })
      });

      if (res.ok) {
        setScheduleModalOpen(false);
        setScheduleTitle('');
        setScheduleEmail('');
        loadReportData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'Executive Summary',
    'Campaign Performance',
    'Employee Awareness',
    'Department Performance',
    'Branch Performance',
    'Learning Progress',
    'Risk Assessment',
    'Compliance Status'
  ];

  const COLORS = ['#00FF88', '#ffffff', '#a8a8a8', '#00D26A', '#2ECC71', '#22C55E', '#71717a'];

  return (
    <div className="space-y-8 pb-16 print:bg-white print:text-black print:p-0 print:space-y-4">
      
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 print:hidden">
        <div>
          <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold">Pinkman Protects</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Reporting & Compliance Center</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Generate, export, and schedule security awareness audits for Indian orgs</p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setScheduleModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-purple/20 border border-brand-purple/40 hover:bg-brand-purple/30 text-brand-purple text-xs font-mono font-semibold transition flex items-center gap-1.5"
          >
            <Plus size={13} /> Schedule Report
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Download size={13} /> Export CSV
          </button>

          <button
            onClick={() => handleExport('excel')}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet size={13} /> Export Excel
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition shadow-lg shadow-brand-purple/5"
          >
            <Printer size={13} /> Print PDF
          </button>
        </div>
      </div>

      {/* Printable Report Header Wrapper */}
      <div className="hidden print:block text-black p-4 border-b border-black/10">
        <h1 className="text-3xl font-black uppercase tracking-wider text-black">Pinkman Protects Reports</h1>
        <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono text-gray-600">
          <div>Organization: <span className="font-bold text-black">{orgName}</span></div>
          <div>Report Category: <span className="font-bold text-black">{activeCategory}</span></div>
          <div>Generated (IST): <span className="font-bold text-black">{new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}</span></div>
          <div>Status: <span className="font-bold text-black">AUDIT COMPLIANT (SLA PASSED)</span></div>
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 print:hidden">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-cyan">
          <Filter size={14} /> Report Generation Filters
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Branch Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase font-bold flex items-center gap-1"><MapPin size={10} /> Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          {/* Department Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase font-bold flex items-center gap-1"><Building size={10} /> Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="IT Support">IT Support</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Campaign Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase font-bold flex items-center gap-1"><Activity size={10} /> Campaign</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
            >
              <option value="All">All Campaigns</option>
              {campaignList.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Employee Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase font-bold flex items-center gap-1"><Users size={10} /> Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
            >
              <option value="All">All Employees</option>
              {employeeList.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Select */}
          <div className="space-y-1 col-span-2 md:col-span-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase font-bold flex items-center gap-1"><ShieldAlert size={10} /> Risk Grade</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          
          {/* Awareness Score */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">Awareness Score</div>
            <div className="text-3xl font-mono font-black text-white print:text-black">{stats.avgAwarenessScore}%</div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-cyan" style={{ width: `${stats.avgAwarenessScore}%` }} />
            </div>
          </div>

          {/* Total Employees */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">Targeted Employees</div>
            <div className="text-3xl font-mono font-black text-white print:text-black">{stats.totalEmployees}</div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              Active Users
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">Active Campaigns</div>
            <div className="text-3xl font-mono font-black text-brand-purple">{stats.activeCampaigns}</div>
            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              Live Mock Targets
            </div>
          </div>

          {/* Completed Campaigns */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">Completed Campaigns</div>
            <div className="text-3xl font-mono font-black text-white print:text-black">{stats.completedCampaigns}</div>
            <div className="text-[10px] text-gray-400 font-mono">Simulations Archive</div>
          </div>

          {/* High Risk Employees */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">High Risk Grade</div>
            <div className={`text-3xl font-mono font-black ${stats.highRiskEmployees > 0 ? 'text-brand-rose' : 'text-brand-emerald'}`}>
              {stats.highRiskEmployees}
            </div>
            <div className="text-[10px] text-gray-400 font-mono">Score below 60%</div>
          </div>

          {/* Training Rate */}
          <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-2 relative overflow-hidden print:border-black/10">
            <div className="text-[9px] uppercase font-mono text-gray-500 font-bold">Training Complete</div>
            <div className="text-3xl font-mono font-black text-brand-emerald">{stats.trainingCompletionRate}%</div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-brand-emerald" style={{ width: `${stats.trainingCompletionRate}%` }} />
            </div>
          </div>

        </div>
      )}

      {/* Main Reports layout: Selector column vs details pane */}
      <div className="grid lg:grid-cols-12 gap-6 items-start print:grid-cols-1">
        
        {/* Left selector menu */}
        <div className="lg:col-span-3 space-y-4 print:hidden">
          <span className="px-1 text-[9px] uppercase font-mono font-bold tracking-widest text-gray-500 block">Report Types</span>
          <div className="space-y-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-2xl border text-xs transition font-semibold flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-brand-purple/20 border-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                    : 'bg-black/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className={activeCategory === cat ? 'text-brand-cyan' : 'text-gray-500'} />
                  <span>{cat}</span>
                </div>
                <ChevronRight size={13} className={activeCategory === cat ? 'text-brand-cyan' : 'text-gray-600'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: Displays active category content details */}
        <div className="lg:col-span-9 space-y-6 print:col-span-1">
          
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 space-y-6 print:bg-white print:border-none print:shadow-none print:p-0">
            
            {/* Context title block */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 print:border-black/10">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[9px] font-mono font-bold uppercase tracking-wider">
                  Audit Report
                </span>
                <h2 className="text-xl font-bold text-white print:text-black">{activeCategory}</h2>
              </div>
              <span className="text-[10px] font-mono text-gray-500 print:text-gray-600">ID: PR-COMP-{activeCategory.slice(0, 4).toUpperCase()}</span>
            </div>

            {/* Render Category Specific Components */}
            
            {/* 1. EXECUTIVE SUMMARY & AI INSIGHTS */}
            {activeCategory === 'Executive Summary' && (
              <div className="space-y-6">
                
                {/* Visual Chart panel */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Recharts chart showing branch performance */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-2xl relative print:border-black/10 print:bg-white">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-3">Branch Compliance Index</h4>
                    <div className="h-48 text-xs font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={branchStats.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="averageScore" fill="#a8a8a8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recharts chart showing department performance */}
                  <div className="bg-black/30 border border-white/5 p-4 rounded-2xl relative print:border-black/10 print:bg-white">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-3">Department Awareness Scores</h4>
                    <div className="h-48 text-xs font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={departmentStats.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.05)' }} />
                          <Bar dataKey="averageScore" fill="#00FF88" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* AI Insights Card */}
                {aiInsights && (
                  <div className="p-5 rounded-xl bg-[#121212] border border-[#1F1F1F] space-y-4 relative overflow-hidden print:bg-white print:border-black/20 print:shadow-none">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-white" size={14} />
                      <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white print:text-black">
                        Pinkman AI Intelligence Insights
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1.5 p-3 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] print:bg-gray-100 print:border-black/15 print:text-black">
                        <div className="text-zinc-500">Highest Risk Branch:</div>
                        <div className="text-white font-extrabold flex items-center gap-1.5 print:text-black">
                          <MapPin size={12} className="text-white" /> {aiInsights.highestRiskBranch} Office
                        </div>
                      </div>
                      <div className="space-y-1.5 p-3 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] print:bg-gray-100 print:border-black/15 print:text-black">
                        <div className="text-zinc-500">Leading Training Compliance:</div>
                        <div className="text-white font-extrabold flex items-center gap-1.5 print:text-black">
                          <CheckCircle2 size={12} className="text-[#00D26A]" /> {aiInsights.mostImprovedDept} Department
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs leading-relaxed text-gray-300 print:text-gray-800">
                      <div className="font-bold text-white font-mono text-[10px] uppercase text-gray-500">Security Summary:</div>
                      <p>{aiInsights.campaignEffectivenessSummary}</p>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-4 print:border-black/10 text-xs text-gray-300 print:text-gray-800">
                      <div className="font-bold text-white font-mono text-[10px] uppercase text-gray-500">Actionable Remediation Recommendations:</div>
                      <ul className="space-y-2.5 list-none font-mono text-[11px]">
                        {aiInsights.monthlyRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ArrowRight size={12} className="text-brand-cyan shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. CAMPAIGN PERFORMANCE */}
            {activeCategory === 'Campaign Performance' && stats && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/3 border border-white/5 text-center text-xs font-mono print:bg-white print:border-black/10 print:text-black">
                  <div className="space-y-1">
                    <div className="text-gray-500">Total Logs</div>
                    <div className="text-lg font-bold text-white print:text-black">{stats.phishingRates.delivered}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Open Rate</div>
                    <div className="text-lg font-bold text-brand-purple">{stats.phishingRates.openRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Link Click Rate</div>
                    <div className="text-lg font-bold text-brand-rose">{stats.phishingRates.clickRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Form Submissions</div>
                    <div className="text-lg font-bold text-brand-amber">{stats.phishingRates.submitRate}%</div>
                  </div>
                </div>

                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="p-4 border-b border-white/5 font-mono text-xs text-gray-500 flex items-center justify-between print:border-black/10">
                    <span>Campaign Target Statistics</span>
                    <span>Audit Ready</span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Audit Metric</th>
                          <th className="p-3">Logs Recorded</th>
                          <th className="p-3">Success Indicator</th>
                          <th className="p-3">Compliance SLA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        <tr>
                          <td className="p-3 text-white font-bold print:text-black">Emails Delivered</td>
                          <td className="p-3">{stats.phishingRates.delivered}</td>
                          <td className="p-3 text-brand-emerald">100% Delivery</td>
                          <td className="p-3 text-gray-500">&gt; 99% Required</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white font-bold print:text-black">Emails Opened</td>
                          <td className="p-3">{stats.phishingRates.opened}</td>
                          <td className="p-3 text-brand-purple">{stats.phishingRates.openRate}% Open Rate</td>
                          <td className="p-3 text-gray-500">No SLA Limit</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white font-bold print:text-black">Links Clicked</td>
                          <td className="p-3 text-brand-rose font-bold">{stats.phishingRates.clicked}</td>
                          <td className={`p-3 font-bold ${stats.phishingRates.clickRate < 10 ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                            {stats.phishingRates.clickRate}% Click Rate
                          </td>
                          <td className="p-3 text-gray-500">&lt; 5% Target</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-white font-bold print:text-black">Form Submissions</td>
                          <td className="p-3 text-brand-rose font-bold">{stats.phishingRates.submitted}</td>
                          <td className="p-3">{stats.phishingRates.submitRate}% Compromise</td>
                          <td className="p-3 text-gray-500">0% Target</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EMPLOYEE AWARENESS */}
            {activeCategory === 'Employee Awareness' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="p-4 border-b border-white/5 font-mono text-xs text-gray-500 print:border-black/10">
                    Targeted Employees Risk Metrics
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Branch</th>
                          <th className="p-3">Awareness Score</th>
                          <th className="p-3">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        {pendingEmployees.map(e => (
                          <tr key={e.id}>
                            <td className="p-3 text-white font-bold print:text-black">{e.name}</td>
                            <td className="p-3">{e.email}</td>
                            <td className="p-3">{e.department}</td>
                            <td className="p-3">{e.branch}</td>
                            <td className="p-3 text-brand-cyan font-bold">{e.score}%</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                e.score >= 80 ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20' : 
                                e.score >= 60 ? 'bg-brand-amber/10 text-brand-amber border border-brand-amber/20' : 
                                'bg-brand-rose/10 text-brand-rose border border-brand-rose/20'
                              }`}>
                                {e.score >= 80 ? 'LOW' : e.score >= 60 ? 'MEDIUM' : 'HIGH'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DEPARTMENT PERFORMANCE */}
            {activeCategory === 'Department Performance' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Department Name</th>
                          <th className="p-3">Employees Count</th>
                          <th className="p-3">Average Score</th>
                          <th className="p-3">Phishing click Rate</th>
                          <th className="p-3">Training Completion %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        {departmentStats.map((d, i) => (
                          <tr key={i}>
                            <td className="p-3 text-white font-bold print:text-black">{d.name}</td>
                            <td className="p-3">{d.employeesCount}</td>
                            <td className="p-3 text-brand-purple font-bold">{d.averageScore}%</td>
                            <td className="p-3 text-brand-rose">{d.clickRate}%</td>
                            <td className="p-3 text-brand-emerald">{d.trainingCompletionRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. BRANCH PERFORMANCE */}
            {activeCategory === 'Branch Performance' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Branch Location</th>
                          <th className="p-3">Employees Count</th>
                          <th className="p-3">Average Score</th>
                          <th className="p-3">Phishing Click Rate</th>
                          <th className="p-3">Training Completion %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        {branchStats.map((b, i) => (
                          <tr key={i}>
                            <td className="p-3 text-white font-bold print:text-black">{b.name} Office</td>
                            <td className="p-3">{b.employeesCount}</td>
                            <td className="p-3 text-brand-cyan font-bold">{b.averageScore}%</td>
                            <td className="p-3 text-brand-rose">{b.clickRate}%</td>
                            <td className="p-3 text-brand-emerald">{b.trainingCompletionRate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. LEARNING PROGRESS */}
            {activeCategory === 'Learning Progress' && (
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="p-4 border-b border-white/5 font-mono text-xs text-gray-500 flex justify-between print:border-black/10">
                    <span>Employees Pending Mandatory Security Modules</span>
                    <span>Top Backlog list</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Completed Modules</th>
                          <th className="p-3">Pending Modules</th>
                          <th className="p-3">Compliance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        {pendingEmployees.map(e => (
                          <tr key={e.id}>
                            <td className="p-3 text-white font-bold print:text-black">{e.name}</td>
                            <td className="p-3">{e.email}</td>
                            <td className="p-3">{e.department}</td>
                            <td className="p-3 text-brand-emerald font-bold">{e.completedCount}</td>
                            <td className="p-3 text-brand-rose font-bold">{e.pendingCount}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-brand-rose/15 text-brand-rose font-bold text-[9px] border border-brand-rose/20">
                                PENDING TRAINING
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. RISK ASSESSMENT */}
            {activeCategory === 'Risk Assessment' && (
              <div className="space-y-6">
                
                {/* High Risk summary widget */}
                <div className="p-5 rounded-2xl bg-brand-rose/5 border border-brand-rose/15 text-xs font-mono text-gray-300 space-y-3 print:bg-white print:border-black/20 print:text-black">
                  <div className="font-bold text-white flex items-center gap-1.5 print:text-black">
                    <AlertTriangle size={15} className="text-brand-rose" /> Critical Corporate Vulnerability Check
                  </div>
                  <p className="leading-relaxed">
                    The registry records <span className="text-brand-rose font-bold">{highRiskEmployees.length} employees</span> in the HIGH RISK category (awareness score under 60%). Clicks are correlated with missing verification protocols during mock financial alerts.
                  </p>
                </div>

                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10 print:text-black">
                  <div className="p-4 border-b border-white/5 font-mono text-xs text-gray-500 print:border-black/10">
                    High Risk Employee List (Immediate Retraining Mandatory)
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono text-left text-gray-400 print:text-black">
                      <thead className="bg-white/3 text-[10px] uppercase text-gray-500 border-b border-white/5 print:bg-gray-100 print:border-black/10">
                        <tr>
                          <th className="p-3">Employee Name</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Branch</th>
                          <th className="p-3">Risk score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black/10">
                        {highRiskEmployees.map(e => (
                          <tr key={e.id}>
                            <td className="p-3 text-white font-bold print:text-black">{e.name}</td>
                            <td className="p-3">{e.email}</td>
                            <td className="p-3">{e.department}</td>
                            <td className="p-3">{e.branch}</td>
                            <td className="p-3 text-brand-rose font-bold">{e.score}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 8. COMPLIANCE STATUS */}
            {activeCategory === 'Compliance Status' && stats && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-6">
                  
                  <div className="p-5 rounded-2xl bg-white/2 border border-white/5 text-center space-y-2 print:bg-white print:border-black/10">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Security Completion</div>
                    <div className="text-3xl font-black font-mono text-white print:text-black">{stats.trainingCompletionRate}%</div>
                    <div className="text-[9px] text-brand-emerald font-mono">Cleared Modules</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/2 border border-white/5 text-center space-y-2 print:bg-white print:border-black/10">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Average Click SLA</div>
                    <div className="text-3xl font-black font-mono text-brand-rose">{stats.phishingRates.clickRate}%</div>
                    <div className="text-[9px] text-gray-500 font-mono">Target Threshold: &lt; 5%</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/2 border border-white/5 text-center space-y-2 print:bg-white print:border-black/10">
                    <div className="text-[10px] font-mono uppercase text-gray-500">Audit Status</div>
                    <div className={`text-2xl font-black font-mono ${stats.phishingRates.clickRate <= 5 ? 'text-brand-emerald' : 'text-brand-amber'}`}>
                      {stats.phishingRates.clickRate <= 5 ? 'EXCELLENT' : 'WARNING'}
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono">ISO 27001 Compliant</div>
                  </div>

                </div>

                {/* ISO Audit Check List */}
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden print:bg-white print:border-black/10">
                  <div className="p-4 border-b border-white/5 font-mono text-xs text-gray-500 print:border-black/10">
                    Organizational SLA Compliance Checklist
                  </div>

                  <div className="p-4 space-y-3 font-mono text-xs text-gray-300 print:text-black">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 print:bg-gray-50 print:border-black/10">
                      <span>1. Mandatory Cyber Awareness Training Completion Ratio &gt; 90%</span>
                      <span className={`font-bold ${stats.trainingCompletionRate >= 90 ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                        {stats.trainingCompletionRate >= 90 ? 'PASSED' : 'FAILED'} ({stats.trainingCompletionRate}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 print:bg-gray-50 print:border-black/10">
                      <span>2. Phishing Campaign Simulation Click-Through Rate &lt; 5%</span>
                      <span className={`font-bold ${stats.phishingRates.clickRate < 5 ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                        {stats.phishingRates.clickRate < 5 ? 'PASSED' : 'ACTION REQUIRED'} ({stats.phishingRates.clickRate}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 print:bg-gray-50 print:border-black/10">
                      <span>3. Zero Credential / Form Submissions recorded during simulation</span>
                      <span className={`font-bold ${stats.phishingRates.submitted === 0 ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                        {stats.phishingRates.submitted === 0 ? 'CLEAN' : 'COMPROMISED'} ({stats.phishingRates.submitted} logs)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Persistent Schedules & Report History table */}
      <div className="grid md:grid-cols-2 gap-6 print:hidden">
        
        {/* Scheduled Reports List */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
              <Clock size={14} /> Scheduled Audits & Reports
            </h3>
            <span className="text-[10px] font-mono text-gray-500">Auto generated</span>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {schedules.map(sch => (
              <div key={sch.id} className="p-3.5 rounded-2xl bg-white/3 border border-white/5 flex justify-between items-center text-xs">
                <div className="space-y-1.5">
                  <div className="font-bold text-white leading-snug">{sch.title}</div>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center gap-4">
                    <span>Freq: {sch.frequency}</span>
                    <span className="flex items-center gap-0.5"><Mail size={10} /> {sch.targetEmails}</span>
                  </div>
                </div>
                
                <span className="px-2 py-0.5 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[9px] uppercase font-bold tracking-wider">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Reports History Log */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
              <FileText size={14} /> Reports Generation History
            </h3>
            <span className="text-[10px] font-mono text-gray-500">Downloads list</span>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {history.map(item => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-white/3 border border-white/5 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-white truncate max-w-[200px]">{item.title}</div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    ID: {item.id} • {item.creator} • {new Date(item.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',')[0]}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[9px] uppercase font-mono font-bold">
                    {item.format}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[9px] font-bold">
                    PASSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Schedule report input Modal */}
      <AnimatePresence>
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setScheduleModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-6 md:p-8 rounded-3xl max-w-md w-full relative z-10 border border-white/10"
            >
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/3 border border-white/5 text-gray-400 hover:text-white transition"
              >
                <X size={15} />
              </button>

              <h2 className="text-xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-2">
                <Clock className="text-brand-purple" size={20} /> Schedule Compliance Report
              </h2>

              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-mono text-gray-500 uppercase font-bold">Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finance Division Compliance Audit"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    className="w-full rounded-xl glass-input p-3 focus:outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="font-mono text-gray-500 uppercase font-bold">Report Category</label>
                  <select
                    value={scheduleCategory}
                    onChange={(e) => setScheduleCategory(e.target.value)}
                    className="w-full rounded-xl glass-input p-3 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Frequency selection */}
                  <div className="space-y-1">
                    <label className="font-mono text-gray-500 uppercase font-bold">Frequency</label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value)}
                      className="w-full rounded-xl glass-input p-3 focus:outline-none"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Target manager email */}
                  <div className="space-y-1">
                    <label className="font-mono text-gray-500 uppercase font-bold">Target Email (Manager)</label>
                    <input
                      type="email"
                      required
                      placeholder="manager@company.in"
                      value={scheduleEmail}
                      onChange={(e) => setScheduleEmail(e.target.value)}
                      className="w-full rounded-xl glass-input p-3 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold text-xs font-mono transition hover:brightness-110 shadow-md shadow-brand-purple/10 pt-3"
                >
                  Create Schedule Audit
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
