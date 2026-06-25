'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Send, 
  AlertTriangle, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  PieChart as PieIcon,
  ShieldCheck,
  Cpu,
  Clock,
  Terminal,
  Server,
  Mail,
  MousePointerClick
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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

interface Metric {
  totalEmployees: number;
  avgScore: number;
  riskCounts: { LOW: number; MEDIUM: number; HIGH: number };
  rates: {
    delivered: number;
    opened: number;
    clicked: number;
    submitted: number;
    openRate: number;
    clickRate: number;
    submitRate: number;
  };
  departmentStats: Array<{
    name: string;
    employeesCount: number;
    averageScore: number;
    clicksCount: number;
    submitsCount: number;
  }>;
  campaignTrends: Array<{
    name: string;
    openRate: number;
    clickRate: number;
    submitRate: number;
  }>;
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
    
    const duration = 1200; // 1.2s for high-end look
    const steps = 50;
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

// Live Time Ticking Component for Cyber Command aesthetics
const LiveTimeTicker = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span className="font-mono text-[9px] text-zinc-500 tracking-wider">{time}</span>;
};

export default function Dashboard() {
  const [data, setData] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial state for employee interaction timeline
  const [interactionLogs, setInteractionLogs] = useState([
    { id: '1', user: 'Alex Rivera (Engineering)', action: 'OPENED', time: 'Just Now', message: 'Opened email template "Q3 Secure SSO Handshake prompt".' },
    { id: '2', user: 'Taylor Smith (HR)', action: 'CLICKED', time: '2m ago', message: 'Clicked phishing redirect link in benefits enrollment email.' },
    { id: '3', user: 'Morgan Vance (Finance)', action: 'SUBMITTED', time: '4m ago', message: 'Entered SSO credentials on unauthenticated phishing intercept landing page.' },
    { id: '4', user: 'Jordan Lee (Legal)', action: 'REPORTED', time: '7m ago', message: 'Successfully detected and reported simulated payload email to security node.' },
    { id: '5', user: 'Casey Kim (Marketing)', action: 'OPENED', time: '12m ago', message: 'Opened email template "Q3 Social Media Sweepstakes promotion".' }
  ]);

  // Initial state for campaigns activity feed milestones
  const [activityFeed, setActivityFeed] = useState([
    { id: '1', message: 'Simulation Dispatcher initiated "Q3 Password Audit Prompt" to 142 targets.', time: '1m ago' },
    { id: '2', message: 'DNS Authorizer validated TXT verification record keys for domain: acme.com.', time: '10m ago' },
    { id: '3', message: 'Audit Logger archived terminated simulation node "Q2 Compliance Refresh".', time: '1h ago' },
    { id: '4', message: 'Ethics checklist verified consent credentials for Finance target group.', time: '2h ago' }
  ]);

  // Initial state for risk alerts
  const [riskAlerts, setRiskAlerts] = useState([
    { id: '1', severity: 'HIGH', message: 'HR Department vulnerability threshold index elevated by +12%. Click rate exceeds threshold.', time: 'Just Now' },
    { id: '2', severity: 'MEDIUM', message: 'Triple click vector identified on employee target node Alex Rivera.', time: '3m ago' },
    { id: '3', severity: 'LOW', message: 'Domain validation authority pending verification keys renewal for acme-sandbox.com.', time: '12m ago' }
  ]);

  // Initial state for scrolling mock console shell terminal logs
  const [consoleLogs, setConsoleLogs] = useState([
    '[10:48:05] SYSTEM: Pinkman Protects platform initialized successfully.',
    '[10:48:12] NODE_DNS: handshake established for tenant: Acme Corp.',
    '[10:48:24] DISPATCH: Dispatch loop executing email queue payload.',
    '[10:48:36] SSO: Resolved target SPF and DKIM values on acme.com.',
    '[10:48:42] TELEMETRY: Intercept click event logged for target #8729.',
    '[10:49:01] REGISTRY: Risk Category updated for node #1932 to HIGH.'
  ]);

  const [simProgress, setSimProgress] = useState(74);
  const [clicksCount, setClicksCount] = useState(14);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard metrics", err);
        setLoading(false);
      });
  }, []);

  // Background interval loop simulating live threat streams
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      // 1. Live Simulation progress ticking
      setSimProgress(prev => {
        if (prev >= 98) return 74;
        return prev + 1;
      });

      // 2. Incremental Clicks telemetry
      if (Math.random() > 0.6) {
        setClicksCount(prev => prev + 1);
      }

      // 3. Command console shell logging ticker
      const consolePool = [
        `[${new Date().toLocaleTimeString()}] TELEMETRY: Sync packet sent to gateway resolver.`,
        `[${new Date().toLocaleTimeString()}] LOGS: Telemetry pipeline health check OK.`,
        `[${new Date().toLocaleTimeString()}] SECURE: Consent validation handshake resolved.`,
        `[${new Date().toLocaleTimeString()}] SCANNER: Subdomain indexing thread completed.`,
        `[${new Date().toLocaleTimeString()}] DISPATCH: Email queue dispatcher idling.`
      ];
      setConsoleLogs(prev => {
        const next = [...prev, consolePool[Math.floor(Math.random() * consolePool.length)]];
        if (next.length > 6) next.shift();
        return next;
      });

      // 4. Employee interaction dynamic simulation events
      if (Math.random() > 0.75) {
        const usersPool = [
          { user: 'Sam Carter (HR)', action: 'OPENED', message: 'Opened email template "Q3 Secure SSO Handshake prompt".' },
          { user: 'Robin Patel (Finance)', action: 'CLICKED', message: 'Clicked phishing redirect link in benefits enrollment email.' },
          { user: 'Jamie Doe (Engineering)', action: 'REPORTED', message: 'Successfully detected and reported simulated payload email.' },
          { user: 'Avery Morgan (Operations)', action: 'SUBMITTED', message: 'Submitted credentials to mock login gate.' }
        ];
        const randomLog = usersPool[Math.floor(Math.random() * usersPool.length)];
        setInteractionLogs(prev => {
          const next = [
            { id: Date.now().toString(), user: randomLog.user, action: randomLog.action as any, time: 'Just Now', message: randomLog.message },
            ...prev.map(p => ({ ...p, time: p.time === 'Just Now' ? '1m ago' : p.time }))
          ];
          if (next.length > 5) next.pop();
          return next;
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [loading]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <Cpu className="text-brand-cyan animate-pulse" size={20} />
        </div>
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase animate-pulse">Initializing Telemetry...</span>
          <p className="text-[10px] font-mono text-zinc-500">Connecting to secure log aggregator...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto border border-brand-rose/20 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
        <AlertTriangle className="text-brand-rose mx-auto animate-bounce" size={36} />
        <h2 className="text-lg font-bold text-white tracking-tight">System Link Disrupted</h2>
        <p className="text-gray-400 text-xs leading-relaxed font-mono">Failed to compile metrics stream. organization telemetry offline. run development seeding script to restore indices.</p>
      </div>
    );
  }

  const riskPieData = [
    { name: 'Low Risk', value: data.riskCounts.LOW, color: '#10b981' },
    { name: 'Medium Risk', value: data.riskCounts.MEDIUM, color: '#f59e0b' },
    { name: 'High Risk', value: data.riskCounts.HIGH, color: '#f43f5e' },
  ];

  const funnelData = [
    { stage: 'Delivered', count: data.rates.delivered, fill: 'url(#gradientDelivered)' },
    { stage: 'Opened', count: data.rates.opened, fill: 'url(#gradientOpened)' },
    { stage: 'Clicked Link', count: data.rates.clicked, fill: 'url(#gradientClicked)' },
    { stage: 'Submitted Info', count: data.rates.submitted, fill: 'url(#gradientSubmitted)' },
  ];

  // Framer Motion Layout Configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 180 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 relative"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-brand-cyan/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-brand-purple/2 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Telemetry Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Pinkman Protects Intelligence Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Executive Security Console
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl font-mono leading-relaxed">
            Real-time compliance analytics, behavioral threat matrices, and phishing simulations tracking target vulnerability thresholds organization-wide.
          </p>
        </div>
        
        {/* Systems Diagnostics Console */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-2xl">
            <div className="flex items-center gap-2">
              <Server size={12} className="text-zinc-500" />
              <span className="text-[9px] font-mono text-zinc-400">NODE_STATUS:</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </span>
            </div>
            <div className="h-3 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-500" />
              <LiveTimeTicker />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-mono text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.02)]">
            <ShieldCheck size={11} className="animate-pulse" /> SIMULATION DEPLOYED
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Awareness Index */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: 'rgba(37,99,235,0.25)', boxShadow: '0 12px 30px rgba(37,99,235,0.06)' }}
          className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between relative overflow-hidden group border border-white/[0.04] border-t-white/[0.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl opacity-50 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Security Health</span>
              <h4 className="text-xs font-bold text-white/90">Awareness Index</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue group-hover:scale-105 transition duration-300">
              <Award size={14} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight glow-text-blue">
                <AnimatedCounter value={data.avgScore} suffix="%" />
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono mt-3 flex items-center gap-1">
              <ArrowUpRight size={12} /> +4.2% awareness increase
            </p>
          </div>
        </motion.div>

        {/* KPI 2: Simulation Failure */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: 'rgba(244,63,94,0.25)', boxShadow: '0 12px 30px rgba(244,63,94,0.06)' }}
          className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between relative overflow-hidden group border border-white/[0.04] border-t-white/[0.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-rose/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-rose/5 rounded-full blur-2xl opacity-50 pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Vulnerability Vector</span>
              <h4 className="text-xs font-bold text-white/90">Simulation Failure</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-brand-rose group-hover:scale-105 transition duration-300">
              <AlertTriangle size={14} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                <AnimatedCounter value={data.rates.clickRate} suffix="%" />
              </span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono mt-3 flex items-center gap-1">
              <ArrowDownRight size={12} /> -6.5% failure drop
            </p>
          </div>
        </motion.div>

        {/* KPI 3: Active Scope */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: 'rgba(6,182,212,0.25)', boxShadow: '0 12px 30px rgba(6,182,212,0.06)' }}
          className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between relative overflow-hidden group border border-white/[0.04] border-t-white/[0.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/5 rounded-full blur-2xl opacity-50 pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Domain Authority</span>
              <h4 className="text-xs font-bold text-white/90">Scope Target</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan group-hover:scale-105 transition duration-300">
              <Globe size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white truncate font-mono tracking-tight mb-1">
              acme.com
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono mt-4 flex items-center gap-1">
              <ShieldCheck size={12} className="text-brand-cyan animate-pulse" /> 1 domain pending auth
            </p>
          </div>
        </motion.div>

        {/* KPI 4: Target Users */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 12px 30px rgba(255,255,255,0.02)' }}
          className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between relative overflow-hidden group border border-white/[0.04] border-t-white/[0.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl opacity-30 pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider font-semibold">Active Directory</span>
              <h4 className="text-xs font-bold text-white/90">Target Registry</h4>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-105 transition duration-300">
              <Users size={14} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
                <AnimatedCounter value={data.totalEmployees} />
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-3">
              Monitored across 5 departments
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Chart Card 1: Conversion Funnel */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-6 relative overflow-hidden border border-white/[0.04]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/2 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[9px] font-mono text-zinc-500">
            <Activity size={10} className="text-brand-cyan animate-pulse" /> Telemetry Stream
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Campaign Action Funnel
            </h3>
            <p className="text-xs text-zinc-400">Total conversion metrics and interaction vectors across phishing configurations.</p>
          </div>

          <div className="h-80 w-full font-mono text-xs pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30, bottom: 10 }}>
                <defs>
                  <linearGradient id="gradientDelivered" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="gradientOpened" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="gradientClicked" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.15}/>
                  </linearGradient>
                  <linearGradient id="gradientSubmitted" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.85}/>
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.15}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" horizontal={false} />
                <XAxis type="number" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={10} width={95} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md space-y-1 bg-zinc-950/95 min-w-[140px]">
                          <p className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 font-bold">{data.stage}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-extrabold text-white font-mono">{data.count}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">logs</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-90" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart Card 2: Risk Profile distribution */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden border border-white/[0.04]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/2 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <PieIcon size={16} className="text-brand-purple" /> Risk Profiles
            </h3>
            <p className="text-xs text-zinc-400 font-mono">Employee risk category spread.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center font-mono text-xs relative my-2">
            {/* Centered dial index */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Threat Index</span>
              <span className="text-2xl font-black text-white font-mono mt-0.5">
                {Math.round(((data.riskCounts.HIGH * 100 + data.riskCounts.MEDIUM * 50) / (data.totalEmployees || 1)))}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={78}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(5,5,5,0.6)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="glass-panel p-3.5 rounded-2xl border border-white/[0.08] shadow-2xl backdrop-blur-md space-y-1 bg-zinc-950/95 min-w-[130px]">
                          <p className="text-[9px] uppercase tracking-wider font-mono text-zinc-500 font-bold" style={{ color: data.payload.color }}>{data.name}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-extrabold text-white font-mono">{data.value}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">employees</span>
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

          <div className="grid grid-cols-3 gap-2 border-t border-white/[0.04] pt-4 text-center font-mono">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">Low</p>
              </div>
              <p className="text-base font-extrabold text-emerald-400">{data.riskCounts.LOW}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">Medium</p>
              </div>
              <p className="text-base font-extrabold text-amber-400">{data.riskCounts.MEDIUM}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">High</p>
              </div>
              <p className="text-base font-extrabold text-rose-400">{data.riskCounts.HIGH}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Historical trends and Department leaderboards */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Trend Area Chart */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-6 relative overflow-hidden border border-white/[0.04]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/2 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Security Readiness Progress</h3>
            <p className="text-xs text-zinc-400">Interaction vectors tracked across successive campaign milestones.</p>
          </div>

          <div className="h-68 w-full font-mono text-xs pt-4">
            {data.campaignTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.campaignTrends} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSubmit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="glass-panel p-4 rounded-2.5xl border border-white/[0.08] shadow-2xl backdrop-blur-md space-y-2 bg-zinc-950/95 min-w-[200px]">
                            <p className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-bold border-b border-white/[0.05] pb-1.5">{label}</p>
                            <div className="space-y-1 font-mono text-xs">
                              {payload.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-4">
                                  <span className="text-[10px]" style={{ color: p.stroke }}>{p.name}:</span>
                                  <span className="font-extrabold text-white">{p.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] text-zinc-400 font-mono">{value}</span>}
                  />
                  <Area type="monotone" dataKey="openRate" name="Open Rate" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorOpen)" />
                  <Area type="monotone" dataKey="clickRate" name="Link Click Rate" stroke="#06b6d4" strokeWidth={2.5} fill="url(#colorClick)" />
                  <Area type="monotone" dataKey="submitRate" name="Credential Submission" stroke="#f43f5e" strokeWidth={2.5} fill="url(#colorSubmit)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/[0.08] rounded-2.5xl text-center p-8 space-y-2 bg-white/[0.01]">
                <Activity size={24} className="text-zinc-600 animate-pulse" />
                <span className="text-xs font-mono text-zinc-400">Timeline Analysis Pending</span>
                <p className="text-[10px] text-zinc-500 max-w-[260px] font-mono leading-normal">Insufficient completed campaigns. metrics timeline registers once target simulation nodes terminate operations.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden border border-white/[0.04]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Zap size={16} className="text-brand-blue" /> Department Scores
            </h3>
            <p className="text-xs text-zinc-400 font-mono">Performance leaderboard ranked by awareness index.</p>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {data.departmentStats.map((dept, idx) => {
              let rankBadge = "text-zinc-400 bg-white/5 border border-white/5";
              if (idx === 0) rankBadge = "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]";
              else if (idx === 1) rankBadge = "text-slate-300 bg-slate-300/10 border border-slate-300/20";
              else if (idx === 2) rankBadge = "text-amber-600 bg-amber-600/10 border border-amber-600/20";

              return (
                <div 
                  key={dept.name} 
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-brand-blue/30 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${rankBadge}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-white tracking-tight">{dept.name}</p>
                        <p className="text-[9px] text-zinc-500 font-mono">{dept.employeesCount} employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black font-mono tracking-tight ${dept.averageScore >= 80 ? 'text-emerald-400' : dept.averageScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {dept.averageScore}%
                      </p>
                      <p className="text-[8px] text-zinc-500 font-mono">{dept.clicksCount} clicks / {dept.submitsCount} subs</p>
                    </div>
                  </div>

                  {/* Visual progress score bar inside leaderboard */}
                  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.averageScore}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        dept.averageScore >= 80 ? 'bg-emerald-500' : 
                        dept.averageScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* SECTION: Security Operations Center (SOC) Terminal */}
      <div className="border-t border-white/[0.04] pt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-500 font-bold">SOC Operational Stream</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Security Operations Center (SOC)
            </h2>
            <p className="text-xs text-zinc-400 font-mono">Continuous real-time threat intelligence and simulated campaign performance feeds.</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[9px] font-mono text-rose-400">
            <Activity size={10} className="animate-pulse" /> LIVE STREAM ACTIVE
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column 1: Live Simulation Monitor & Performance Widget */}
          <div className="space-y-6">
            
            {/* Live Simulation Monitor */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Execution Node</span>
                  <h4 className="text-xs font-extrabold text-white tracking-tight">Active Simulation Status</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[8px] font-mono font-bold animate-pulse">RUNNING</span>
              </div>

              {/* Progress and status */}
              <div className="space-y-4 font-mono text-[10px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] text-zinc-400">
                    <span>CAMPAIGN: Q3 Password Audit Prompt</span>
                    <span>{simProgress}% DISPATCHED</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-brand-cyan transition-all duration-500" style={{ width: `${simProgress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/[0.01] border border-white/[0.03] p-2 rounded-xl">
                    <span className="text-zinc-500 text-[8px] uppercase block font-bold">Target Nodes</span>
                    <span className="text-sm font-extrabold text-white mt-1 block">142</span>
                  </div>
                  <div className="bg-white/[0.01] border border-white/[0.03] p-2 rounded-xl">
                    <span className="text-zinc-500 text-[8px] uppercase block font-bold">Email Intercepts</span>
                    <span className="text-sm font-extrabold text-brand-cyan mt-1 block">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse inline-block mr-1" /> {clicksCount} clicks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Performance Widget */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Performance Dial</span>
                <h4 className="text-xs font-extrabold text-white tracking-tight">Campaign Success Metrics</h4>
              </div>

              <div className="space-y-3 text-[10px] font-mono">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-brand-purple/20 transition-all duration-300">
                  <span className="text-zinc-400">Simulation Escape Velocity</span>
                  <span className="text-white font-extrabold">92.5%</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-brand-purple/20 transition-all duration-300">
                  <span className="text-zinc-400">Response Latency Avg</span>
                  <span className="text-white font-extrabold">14.8s</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-brand-purple/20 transition-all duration-300">
                  <span className="text-zinc-400">Employee Report Ratio</span>
                  <span className="text-brand-purple font-extrabold">44.2%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Column 2: Interaction Timeline & Risk Alerts */}
          <div className="space-y-6">
            
            {/* Employee Interaction Timeline */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Interaction Stream</span>
                <h4 className="text-xs font-extrabold text-white tracking-tight">Employee Telemetry Timeline</h4>
              </div>

              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {interactionLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ type: 'spring' as const, damping: 20 }}
                      className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition-all flex items-start gap-3 relative"
                    >
                      <div className="mt-1 shrink-0">
                        {log.action === 'OPENED' && <Mail size={12} className="text-brand-purple" />}
                        {log.action === 'CLICKED' && <MousePointerClick size={12} className="text-brand-cyan" />}
                        {log.action === 'SUBMITTED' && <AlertTriangle size={12} className="text-brand-rose animate-pulse" />}
                        {log.action === 'REPORTED' && <ShieldCheck size={12} className="text-brand-emerald" />}
                      </div>
                      <div className="space-y-1 font-mono text-[9px] leading-normal w-full">
                        <div className="flex justify-between items-center text-zinc-400">
                          <span className="font-extrabold text-white">{log.user}</span>
                          <span>{log.time}</span>
                        </div>
                        <p className="text-zinc-500">{log.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Recent Risk Alerts */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Security Alerts</span>
                <h4 className="text-xs font-extrabold text-white tracking-tight">Active Vulnerability Flags</h4>
              </div>

              <div className="space-y-3 font-mono text-[9px]">
                {riskAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-xl border flex items-start gap-3 hover:bg-white/[0.01] transition-all duration-300 ${
                      alert.severity === 'HIGH' ? 'bg-brand-rose/5 border-brand-rose/25 text-brand-rose' :
                      alert.severity === 'MEDIUM' ? 'bg-brand-amber/5 border-brand-amber/25 text-brand-amber' :
                      'bg-white/5 border-white/10 text-zinc-300'
                    }`}
                  >
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-[8px] tracking-wider uppercase">{alert.severity} RISK FLAG</span>
                        <span className="text-[8px] opacity-60">{alert.time}</span>
                      </div>
                      <p className="leading-relaxed opacity-95">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 3: Campaign Activity Feed & Diagnostic Output */}
          <div className="space-y-6">
            
            {/* Recent Campaign Activity Feed */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500/2 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Activity Ledger</span>
                <h4 className="text-xs font-extrabold text-white tracking-tight">Campaign Milestones</h4>
              </div>

              <div className="space-y-3 font-mono text-[9px]">
                {activityFeed.map((act) => (
                  <div key={act.id} className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition flex justify-between items-start gap-4">
                    <span className="text-zinc-300 leading-normal">{act.message}</span>
                    <span className="text-zinc-500 shrink-0 text-[8px] mt-0.5">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Scrolling Console */}
            <div className="glass-panel p-5 rounded-3xl border border-white/[0.04] space-y-3 relative overflow-hidden bg-black/80 font-mono">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-brand-cyan animate-pulse" />
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Console Terminal</span>
                </div>
                <span className="text-[8px] text-zinc-600">SYS_LOGGER::ON</span>
              </div>

              <div className="h-[120px] overflow-y-auto text-[8px] space-y-1.5 scrollbar-thin text-emerald-500/80 leading-normal flex flex-col justify-end">
                {consoleLogs.map((log, index) => (
                  <div key={index} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </motion.div>
  );
}

