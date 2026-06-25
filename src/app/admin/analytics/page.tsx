'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  MailOpen, 
  MousePointerClick, 
  FileSpreadsheet, 
  AlertTriangle, 
  Clock,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Sparkles,
  Calendar,
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Terminal,
  ChevronDown,
  RotateCcw,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  Building
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface FilterOptions {
  departments: string[];
  branches: string[];
  campaigns: Array<{ id: string; name: string; status: string }>;
  riskLevels: string[];
}

interface AnalyticsMetrics {
  avgScore: number;
  activeCampaigns: number;
  campaignSuccessRate: number;
  emailDeliveryRate: number;
  emailOpenRate: number;
  linkClickRate: number;
  formInteractionRate: number;
  trainingCompletionRate: number;
  totalEmployees: number;
  highRiskEmployees: number;
  mediumRiskEmployees: number;
  lowRiskEmployees: number;
}

interface ChartsData {
  monthlyAwarenessGrowth: Array<{ name: string; score: number }>;
  campaignPerformanceTrend: Array<{ name: string; openRate: number; clickRate: number; submitRate: number; successRate: number }>;
  employeeEngagementTrend: Array<{ name: string; opens: number; clicks: number; submissions: number }>;
  departmentComparison: Array<{ name: string; employees: number; awarenessScore: number; clickRate: number; openRate: number; submitRate: number }>;
  branchComparison: Array<{ name: string; employees: number; awarenessScore: number; clickRate: number; openRate: number; submitRate: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  securityScoreTrend: Array<{ name: string; score: number }>;
  campaignFunnel: Array<{ stage: string; count: number; fill: string }>;
  monthlyComplianceTrend: Array<{ name: string; complianceRate: number }>;
}

interface AIInsights {
  highestRiskDepartment: string;
  bestPerformingBranch: string;
  awarenessImprovement: number;
  employeesNeedingTraining: number;
  recentCampaignSummary: string;
}

interface AnalyticsData {
  filters: FilterOptions;
  metrics: AnalyticsMetrics;
  charts: ChartsData;
  insights: AIInsights;
}

// Awwwards-style Animated Counter Component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    
    const duration = 1000; 
    const steps = 40;
    const stepTime = duration / steps;
    const increment = Math.ceil(end / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
};

// Systems local time clock
const LiveClock = () => {
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span className="font-mono text-[9px] text-zinc-500 tracking-wider">{timeStr}</span>;
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Filter parameters
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedCampaign, setSelectedCampaign] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [datePreset, setDatePreset] = useState('ALL_TIME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch function
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/analytics?department=${selectedDept}&branch=${selectedBranch}&campaignId=${selectedCampaign}&riskLevel=${selectedRisk}`;
      
      // Calculate date preset values
      let computedStart = startDate;
      let computedEnd = endDate;
      if (datePreset !== 'CUSTOM') {
        const now = new Date();
        if (datePreset === 'LAST_7_DAYS') {
          const d = new Date();
          d.setDate(now.getDate() - 7);
          computedStart = d.toISOString().split('T')[0];
          computedEnd = now.toISOString().split('T')[0];
        } else if (datePreset === 'LAST_30_DAYS') {
          const d = new Date();
          d.setDate(now.getDate() - 30);
          computedStart = d.toISOString().split('T')[0];
          computedEnd = now.toISOString().split('T')[0];
        } else if (datePreset === 'LAST_90_DAYS') {
          const d = new Date();
          d.setDate(now.getDate() - 90);
          computedStart = d.toISOString().split('T')[0];
          computedEnd = now.toISOString().split('T')[0];
        } else {
          computedStart = '';
          computedEnd = '';
        }
      }

      if (computedStart) url += `&startDate=${computedStart}`;
      if (computedEnd) url += `&endDate=${computedEnd}`;

      const res = await fetch(url);
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (error) {
      console.error('Failed to retrieve security analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAnalytics();
  }, []);

  // Re-fetch on filter update
  useEffect(() => {
    if (mounted) {
      fetchAnalytics();
    }
  }, [selectedDept, selectedBranch, selectedCampaign, selectedRisk, datePreset, startDate, endDate]);

  const handleResetFilters = () => {
    setSelectedDept('ALL');
    setSelectedBranch('ALL');
    setSelectedCampaign('ALL');
    setSelectedRisk('ALL');
    setDatePreset('ALL_TIME');
    setStartDate('');
    setEndDate('');
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    if (!data) return;
    const headers = ['Metric/Item', 'Value', 'Status/Ref'];
    const rows = [
      ['Overall Awareness Score', `${data.metrics.avgScore}%`, 'Aggregate Score'],
      ['Campaign Success Rate', `${data.metrics.campaignSuccessRate}%`, 'Phishing Avoidance'],
      ['Active Campaigns', data.metrics.activeCampaigns.toString(), 'Current Scope'],
      ['Delivery Rate', `${data.metrics.emailDeliveryRate}%`, 'Successful Dispatches'],
      ['Open Rate', `${data.metrics.emailOpenRate}%`, 'Interaction Score'],
      ['Link Click Rate', `${data.metrics.linkClickRate}%`, 'Trap Conversion'],
      ['Form Submission Rate', `${data.metrics.formInteractionRate}%`, 'Vulnerability Index'],
      ['Training Completion Rate', `${data.metrics.trainingCompletionRate}%`, 'Learning Progress'],
      ['Total Monitored Employees', data.metrics.totalEmployees.toString(), 'Target Nodes'],
      ['High Risk Category count', data.metrics.highRiskEmployees.toString(), 'Priority Training List'],
      ['Medium Risk Category count', data.metrics.mediumRiskEmployees.toString(), 'Secondary Target list'],
      ['Low Risk Category count', data.metrics.lowRiskEmployees.toString(), 'Secure Node Group']
    ];

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pinkman_security_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Animation Layout Configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 180 } }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 relative min-h-screen pb-16">
      {/* Background radial atmosphere glow */}
      <div className="absolute top-[-10%] left-[5%] w-[450px] h-[450px] bg-brand-cyan/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-brand-purple/2 rounded-full blur-[130px] pointer-events-none" />

      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Audit Analytics Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Security Analytics & Telemetry
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Granular employee behavioral threat indicators, campaign funnels, and compliance growth telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.01] border border-white/[0.04] shadow-2xl">
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-zinc-500" />
              <span className="text-[9px] font-mono text-zinc-400">ENGINE:</span>
              <span className="text-[9px] font-mono text-brand-cyan font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse" /> SOC_SECURE
              </span>
            </div>
            <div className="h-3 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-500" />
              <LiveClock />
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={loading || !data}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 active:scale-[0.98] disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl transition duration-200 text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            <FileSpreadsheet size={13} className="text-brand-cyan shrink-0" /> Export CSV Report
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter Panel */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.04] relative space-y-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/2 rounded-full blur-2xl pointer-events-none" />
        
        {/* Date presets + custom selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.03] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mr-2 flex items-center gap-1">
              <Calendar size={12} className="text-zinc-600" /> Date Preset:
            </span>
            {[
              { id: 'ALL_TIME', label: 'All Time' },
              { id: 'LAST_90_DAYS', label: 'Last 90 Days' },
              { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
              { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
              { id: 'CUSTOM', label: 'Custom Range' }
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => setDatePreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                  datePreset === preset.id
                    ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-white/[0.01] border-white/[0.05] text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {datePreset === 'CUSTOM' && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg glass-input text-[10px] font-mono text-zinc-300"
              />
              <span className="text-zinc-500 font-mono text-xs">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg glass-input text-[10px] font-mono text-zinc-300"
              />
            </motion.div>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold flex items-center gap-1">
              <Building size={10} /> Office Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono text-zinc-300 cursor-pointer"
            >
              <option value="ALL">All India Branches</option>
              {data?.filters.branches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold flex items-center gap-1">
              <Layers size={10} /> Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono text-zinc-300 cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {data?.filters.departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold flex items-center gap-1">
              <BarChart3 size={10} /> Campaign Scope
            </label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono text-zinc-300 cursor-pointer"
            >
              <option value="ALL">All Campaigns</option>
              {data?.filters.campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold flex items-center gap-1">
              <AlertTriangle size={10} /> Risk Classification
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono text-zinc-300 cursor-pointer"
            >
              <option value="ALL">All Risks</option>
              {data?.filters.riskLevels.map(r => (
                <option key={r} value={r}>{r} RISK</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex justify-end gap-2 border-t border-white/[0.03] pt-4">
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-transparent transition cursor-pointer"
          >
            <RotateCcw size={12} /> Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        // 3. Shimmering Loading skeletons
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="glass-panel p-6 h-36 rounded-2.5xl animate-pulse bg-white/[0.01] border border-white/[0.04]">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-20 bg-zinc-800 rounded" />
                  <div className="h-8 w-8 bg-zinc-800 rounded-lg" />
                </div>
                <div className="h-8 w-24 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-32 bg-zinc-850 rounded" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-panel p-6 h-96 rounded-3xl lg:col-span-2 animate-pulse bg-white/[0.01] border border-white/[0.04]" />
            <div className="glass-panel p-6 h-96 rounded-3xl animate-pulse bg-white/[0.01] border border-white/[0.04]" />
          </div>
        </div>
      ) : !data ? (
        // Error state
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-brand-rose/20 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
          <AlertTriangle className="text-brand-rose mx-auto animate-bounce" size={40} />
          <h2 className="text-lg font-bold text-white tracking-tight">Telemetry Pipeline Offline</h2>
          <p className="text-zinc-400 text-xs font-mono leading-relaxed">
            Analytics metrics aggregation failed to complete. Refresh filters or check SQLite db seeding status.
          </p>
        </div>
      ) : (
        // 4. Redesigned Dashboard Content
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Executive KPI Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers size={13} className="text-brand-cyan" />
              <h2 className="text-sm font-bold text-zinc-300 font-mono uppercase tracking-widest">Executive KPIs</h2>
            </div>
            
            {/* Primary KPI Grid (4 Premium Cards) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Awareness Index */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(6,182,212,0.25)', boxShadow: '0 12px 30px rgba(6,182,212,0.06)' }}
                className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-white/[0.04] border-t-white/[0.1] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Security Health</span>
                    <h4 className="text-xs font-bold text-white/90">Awareness Index</h4>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                    <Award size={14} />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white font-mono tracking-tight glow-text-cyan">
                    <AnimatedCounter value={data.metrics.avgScore} suffix="%" />
                  </div>
                  <p className="text-[9px] text-emerald-400 font-mono mt-3 flex items-center gap-1">
                    <ArrowUpRight size={11} /> +{data.insights.awarenessImprovement}% index growth
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Failure Avoidance Success Rate */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(16,185,129,0.25)', boxShadow: '0 12px 30px rgba(16,185,129,0.06)' }}
                className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-white/[0.04] border-t-white/[0.1] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-emerald/5 rounded-full blur-2xl opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Risk Prevention</span>
                    <h4 className="text-xs font-bold text-white/90">Avoidance Rate</h4>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
                    <ShieldCheck size={14} />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white font-mono tracking-tight glow-text-emerald">
                    <AnimatedCounter value={data.metrics.campaignSuccessRate} suffix="%" />
                  </div>
                  <p className="text-[9px] text-zinc-400 font-mono mt-3">
                    Phishing simulation bypass compliance
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Training Completion */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(139,92,246,0.25)', boxShadow: '0 12px 30px rgba(139,92,246,0.06)' }}
                className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-white/[0.04] border-t-white/[0.1] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl opacity-50 pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Education progress</span>
                    <h4 className="text-xs font-bold text-white/90">Training Completion</h4>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                    <Zap size={14} />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white font-mono tracking-tight glow-text-purple">
                    <AnimatedCounter value={data.metrics.trainingCompletionRate} suffix="%" />
                  </div>
                  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mt-3.5">
                    <div className="h-full bg-brand-purple" style={{ width: `${data.metrics.trainingCompletionRate}%` }} />
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Total Roster monitored */}
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 12px 30px rgba(255,255,255,0.02)' }}
                className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-white/[0.04] border-t-white/[0.1] relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-30 pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Roster Monitor</span>
                    <h4 className="text-xs font-bold text-white/90">Target Registry</h4>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                    <Users size={14} />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-white font-mono tracking-tight">
                    <AnimatedCounter value={data.metrics.totalEmployees} />
                  </div>
                  <p className="text-[9px] text-zinc-500 font-mono mt-3">
                    Active directory monitored accounts
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sub-KPIs Grid (Remaining 8 KPIs: Campaigns, Interaction rates, and Risk counts) */}
            <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Active Campaigns</span>
                <div className="text-xl font-bold font-mono text-white tracking-tight">{data.metrics.activeCampaigns}</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Delivery Rate</span>
                <div className="text-xl font-bold font-mono text-white tracking-tight">{data.metrics.emailDeliveryRate}%</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Open Rate</span>
                <div className="text-xl font-bold font-mono text-white tracking-tight">{data.metrics.emailOpenRate}%</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Link Click Rate</span>
                <div className="text-xl font-bold font-mono text-zinc-700 tracking-tight glow-text-rose-muted">
                  <span className="text-brand-rose">{data.metrics.linkClickRate}%</span>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Form Submission</span>
                <div className="text-xl font-bold font-mono text-brand-rose tracking-tight">{data.metrics.formInteractionRate}%</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] border-l-brand-rose/30 space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">High Risk Count</span>
                <div className="text-xl font-bold font-mono text-brand-rose tracking-tight">{data.metrics.highRiskEmployees}</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] border-l-brand-amber/30 space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Medium Risk Count</span>
                <div className="text-xl font-bold font-mono text-brand-amber tracking-tight">{data.metrics.mediumRiskEmployees}</div>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-white/[0.03] border-l-brand-emerald/30 space-y-1.5">
                <span className="text-[8px] uppercase font-mono text-zinc-500 block font-bold">Low Risk Count</span>
                <div className="text-xl font-bold font-mono text-brand-emerald tracking-tight">{data.metrics.lowRiskEmployees}</div>
              </div>
            </div>
          </div>

          {/* AI secops cognitive insights terminal */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-6 rounded-3xl border border-white/[0.04] bg-white/[0.005] font-mono text-xs text-zinc-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-cyan/2 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-brand-cyan" />
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">SecOps Cognitive AI Analyst</span>
              </div>
              <span className="text-[8px] text-zinc-500 animate-pulse">SYSTEM_ONLINE // ANALYSING...</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-brand-cyan font-bold">&gt;</span>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] font-bold block">Highest Risk Division</span>
                    <span className="text-brand-rose font-bold">{data.insights.highestRiskDepartment} Department</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Calculated based on average security awareness score threshold and fail click ratios.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-brand-cyan font-bold">&gt;</span>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] font-bold block">Optimal Branch Performance</span>
                    <span className="text-brand-emerald font-bold">{data.insights.bestPerformingBranch} Office</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Leading other offices with the highest average security training engagement scores.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-brand-cyan font-bold">&gt;</span>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] font-bold block">Critical Intervention Target</span>
                    <span className="text-brand-amber font-bold">{data.insights.employeesNeedingTraining} employees require immediate retraining</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Employees showing awareness score &lt; 70% or flagged in High Risk profiling category.</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-brand-cyan font-bold">&gt;</span>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] font-bold block">Recent Campaign Summary</span>
                    <span className="text-zinc-300 font-bold block truncate max-w-md" title={data.insights.recentCampaignSummary}>
                      {data.insights.recentCampaignSummary}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Charts Row 1: Awareness Growth (Area) & Risk Distribution (Pie) */}
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-cyan" /> Monthly Awareness Growth
                </h3>
                <p className="text-xs text-zinc-400">Progression of average security awareness indices over the last 6 months.</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.charts.monthlyAwarenessGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md space-y-1 bg-zinc-950/95 min-w-[130px] font-mono text-xs">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{payload[0].payload.name}</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-white">{payload[0].value}%</span>
                                <span className="text-[9px] text-zinc-500">score</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#growthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <PieIcon size={16} className="text-brand-purple" /> Risk Profile Spread
                </h3>
                <p className="text-xs text-zinc-400">Employee threat classification profile share.</p>
              </div>
              <div className="h-52 w-full flex items-center justify-center relative">
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Index Average</span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5">{data.metrics.avgScore}</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={76}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.charts.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(9,9,11,0.6)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0];
                          return (
                            <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[130px] font-mono text-xs">
                              <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: item.payload.color }}>{item.name}</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-white">{item.value}</span>
                                <span className="text-[9px] text-zinc-500">employees</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-white/[0.04] pt-4 text-center font-mono text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[8px] uppercase tracking-wider text-zinc-500">Low</p>
                  </div>
                  <p className="text-sm font-extrabold text-emerald-400">{data.metrics.lowRiskEmployees}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-[8px] uppercase tracking-wider text-zinc-500">Medium</p>
                  </div>
                  <p className="text-sm font-extrabold text-amber-400">{data.metrics.mediumRiskEmployees}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <p className="text-[8px] uppercase tracking-wider text-zinc-500">High</p>
                  </div>
                  <p className="text-sm font-extrabold text-rose-400">{data.metrics.highRiskEmployees}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 2: Campaign Funnel & Campaign Performance Trend */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Layers size={16} className="text-brand-purple" /> Campaign Action Funnel
                </h3>
                <p className="text-xs text-zinc-400 font-mono">Conversion metrics tracker (Delivered → Opened → Clicked → Form Interaction).</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.campaignFunnel} layout="vertical" margin={{ left: 10, right: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" horizontal={false} />
                    <XAxis type="number" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={9} width={90} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.015)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const val = payload[0].payload;
                          return (
                            <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[130px] font-mono text-xs">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{val.stage}</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-white">{val.count}</span>
                                <span className="text-[9px] text-zinc-500">interactions</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                      {data.charts.campaignFunnel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-cyan" /> Campaign Performance Trend
                </h3>
                <p className="text-xs text-zinc-400">Avoidance success rate vs click failures across simulation instances.</p>
              </div>
              <div className="h-72 w-full pt-4">
                {data.charts.campaignPerformanceTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.campaignPerformanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                      <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="glass-panel p-3.5 rounded-2.5xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[180px] font-mono text-xs space-y-1">
                                <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.05] pb-1">{label}</p>
                                {payload.map((p, idx) => (
                                  <div key={idx} className="flex justify-between gap-4">
                                    <span style={{ color: p.color }}>{p.name}:</span>
                                    <span className="font-extrabold text-white">{p.value}%</span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-[9px] text-zinc-400 font-mono">{v}</span>} />
                      <Bar dataKey="successRate" name="Avoidance Success" fill="#22C55E" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="clickRate" name="Click Failures" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.005] p-8 text-center space-y-2">
                    <AlertTriangle size={20} className="text-zinc-600" />
                    <span className="text-xs font-mono text-zinc-400">Data Pending</span>
                    <span className="text-[10px] font-mono text-zinc-500 max-w-[200px]">Launch and complete campaigns to show analytics timeline.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Charts Row 3: Employee Engagement (Line) & Monthly Compliance (Area) */}
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity size={16} className="text-brand-cyan" /> Employee Engagement Trend
                </h3>
                <p className="text-xs text-zinc-400 font-mono">Monthly aggregates of telemetry opens, clicks, and credential uploads.</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.charts.employeeEngagementTrend} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-panel p-3.5 rounded-2.5xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[180px] font-mono text-xs space-y-1">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.05] pb-1">{label}</p>
                              {payload.map((p, idx) => (
                                <div key={idx} className="flex justify-between gap-4">
                                  <span style={{ color: p.color }}>{p.name}:</span>
                                  <span className="font-extrabold text-white">{p.value} logs</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-[9px] text-zinc-400 font-mono">{v}</span>} />
                    <Line type="monotone" dataKey="opens" name="Opened Email" stroke="#ffffff" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="clicks" name="Clicked Link" stroke="#a8a8a8" strokeWidth={2} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="submissions" name="Entered Credentials" stroke="#E50914" strokeWidth={2} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-emerald" /> Monthly Compliance Trend
                </h3>
                <p className="text-xs text-zinc-400">Ratio of compliant users scoring &gt;= 75% security index.</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.charts.monthlyComplianceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[130px] font-mono text-xs">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{payload[0].payload.name}</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-white">{payload[0].value}%</span>
                                <span className="text-[9px] text-zinc-500">compliance</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="complianceRate" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#compGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 4: Department Comparison & Branch Comparison (Bar Graphs) */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Layers size={16} className="text-brand-cyan" /> Department Comparison
                </h3>
                <p className="text-xs text-zinc-400">Team division averages (Score vs click ratios).</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.departmentComparison} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="glass-panel p-3.5 rounded-2.5xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[180px] font-mono text-xs space-y-1">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.05] pb-1">{label}</p>
                              <div className="flex justify-between">
                                <span>Employees:</span>
                                <span className="font-extrabold text-white">{item.employees}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-brand-cyan">Awareness Score:</span>
                                <span className="font-extrabold text-brand-cyan">{item.awarenessScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-brand-rose">Click Rate:</span>
                                <span className="font-extrabold text-brand-rose">{item.clickRate}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-[9px] text-zinc-400 font-mono">{v}</span>} />
                    <Bar dataKey="awarenessScore" name="Awareness score" fill="#a8a8a8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clickRate" name="Trap Clicks" fill="#E50914" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Building size={16} className="text-brand-purple" /> Indian Branch Comparison
                </h3>
                <p className="text-xs text-zinc-400">Office location threat profiles ranked by awareness index.</p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.branchComparison} layout="vertical" margin={{ left: 10, right: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" horizontal={false} />
                    <XAxis type="number" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.015)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="glass-panel p-3.5 rounded-2.5xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[180px] font-mono text-xs space-y-1">
                              <p className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold border-b border-white/[0.05] pb-1">{label} Office</p>
                              <div className="flex justify-between">
                                <span>Monitored Employees:</span>
                                <span className="font-extrabold text-white">{item.employees}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-brand-purple">Awareness Index:</span>
                                <span className="font-extrabold text-brand-purple">{item.awarenessScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-brand-rose">Click Failures:</span>
                                <span className="font-extrabold text-brand-rose">{item.clickRate}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-[9px] text-zinc-400 font-mono">{v}</span>} />
                    <Bar dataKey="awarenessScore" name="Awareness Index" fill="#a8a8a8" radius={[0, 4, 4, 0]} barSize={10} />
                    <Bar dataKey="clickRate" name="Click Rate" fill="#E50914" radius={[0, 4, 4, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 5: Security Score Trend (Full width line tracking timeline) */}
          <motion.div 
            variants={itemVariants}
            className="glass-panel p-6 rounded-3xl space-y-4 border border-white/[0.04]"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-cyan" /> Security Score Trend
              </h3>
              <p className="text-xs text-zinc-400">Continuous timeline mapping of the overall company safety index score.</p>
            </div>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.securityScoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md bg-zinc-950/95 min-w-[130px] font-mono text-xs">
                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{payload[0].payload.name}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-extrabold text-brand-cyan">{payload[0].value}%</span>
                              <span className="text-[9px] text-zinc-500">index score</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="score" name="Company Security Score" stroke="#E50914" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
