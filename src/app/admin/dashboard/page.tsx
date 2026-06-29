'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  Send, 
  AlertTriangle, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
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

// Minimal Animated Counter Component
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

// Simple System Ticker
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

  // Interaction timeline state
  const [interactionLogs, setInteractionLogs] = useState([
    { id: '1', user: 'Alex Rivera (Engineering)', action: 'OPENED', time: 'Just Now', message: 'Opened email template "Q3 Secure SSO Handshake prompt".' },
    { id: '2', user: 'Taylor Smith (HR)', action: 'CLICKED', time: '2m ago', message: 'Clicked phishing redirect link in benefits enrollment email.' },
    { id: '3', user: 'Morgan Vance (Finance)', action: 'SUBMITTED', time: '4m ago', message: 'Entered credentials on unauthenticated simulated landing page.' },
    { id: '4', user: 'Jordan Lee (Legal)', action: 'REPORTED', time: '7m ago', message: 'Reported simulated payload email to security operations.' },
    { id: '5', user: 'Casey Kim (Marketing)', action: 'OPENED', time: '12m ago', message: 'Opened email template "Q3 Social Media Sweepstakes promotion".' }
  ]);

  // Campaign feed milestones
  const [activityFeed] = useState([
    { id: '1', message: 'Simulation Dispatcher initiated "Q3 Password Audit Prompt" to 142 targets.', time: '1m ago' },
    { id: '2', message: 'DNS Authorizer validated TXT verification record keys for domain: acme.com.', time: '10m ago' },
    { id: '3', message: 'Audit Logger archived terminated simulation node "Q2 Compliance Refresh".', time: '1h ago' },
    { id: '4', message: 'Ethics checklist verified consent credentials for Finance target group.', time: '2h ago' }
  ]);

  // Risk flags state
  const [riskAlerts] = useState([
    { id: '1', severity: 'HIGH', message: 'HR Department vulnerability threshold index elevated. Click rate registers high threat.', time: 'Just Now' },
    { id: '2', severity: 'MEDIUM', message: 'Multi click vector identified on employee target node Alex Rivera.', time: '3m ago' },
    { id: '3', severity: 'LOW', message: 'Domain validation authority pending verification keys renewal for acme-sandbox.com.', time: '12m ago' }
  ]);

  // Console terminal log stream
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

  // Simulation log ticker
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 98) return 74;
        return prev + 1;
      });

      if (Math.random() > 0.6) {
        setClicksCount(prev => prev + 1);
      }

      const consolePool = [
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] TELEMETRY: Sync packet sent to resolver.`,
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] LOGS: Telemetry pipeline health check OK.`,
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] SECURE: Consent validation handshake resolved.`,
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] SCANNER: Subdomain indexing thread completed.`,
        `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] DISPATCH: Email queue dispatcher idling.`
      ];
      setConsoleLogs(prev => {
        const next = [...prev, consolePool[Math.floor(Math.random() * consolePool.length)]];
        if (next.length > 5) next.shift();
        return next;
      });

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
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/10 rounded-full" />
          <div className="absolute inset-0 border-t border-white rounded-full animate-spin" />
          <Cpu className="text-white animate-pulse" size={16} />
        </div>
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-white uppercase animate-pulse">Initializing Telemetry...</span>
          <p className="text-[9px] font-mono text-zinc-500">Connecting to secure log aggregator...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto border border-[#1F1F1F] bg-[#121212] shadow-xl">
        <AlertTriangle className="text-white mx-auto" size={24} />
        <h2 className="text-sm font-bold text-white tracking-tight font-mono uppercase">System Link Disrupted</h2>
        <p className="text-zinc-500 text-xs leading-relaxed font-mono">Failed to compile metrics stream. Telemetry pipeline offline. Seed databases to restore node registry index.</p>
      </div>
    );
  }

  const riskPieData = [
    { name: 'Low Risk', value: data.riskCounts.LOW, color: '#00D26A' },
    { name: 'Medium Risk', value: data.riskCounts.MEDIUM, color: '#2ECC71' },
    { name: 'High Risk', value: data.riskCounts.HIGH, color: '#00FF88' },
  ];

  const funnelData = [
    { stage: 'Delivered', count: data.rates.delivered, fill: '#333333' },
    { stage: 'Opened', count: data.rates.opened, fill: '#888888' },
    { stage: 'Clicked Link', count: data.rates.clicked, fill: '#00D26A' },
    { stage: 'Submitted Info', count: data.rates.submitted, fill: '#00FF88' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 180 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative"
    >
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-[#1F1F1F] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00D26A]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Pinkman Protects Intelligence</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase font-mono text-white">
            Executive Security Console
          </h1>
          <p className="text-xs text-zinc-500 max-w-xl leading-relaxed">
            Real-time compliance analytics, behavioral threat matrices, and phishing simulations tracking target vulnerability thresholds organization-wide.
          </p>
        </div>
        
        {/* Systems Diagnostics Console */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <Server size={12} className="text-zinc-500" />
              <span className="text-[9px] font-mono text-zinc-500">NODE_STATUS:</span>
              <span className="text-[9px] font-mono text-[#00D26A] font-bold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#00D26A]" /> ONLINE
              </span>
            </div>
            <div className="h-3 w-px bg-[#1F1F1F]" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-500" />
              <LiveTimeTicker />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#1F1F1F] bg-[#121212] text-[9px] font-mono text-white font-bold">
            <ShieldCheck size={11} /> SIMULATION ACTIVE
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Awareness Index */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-xl flex flex-col justify-between hover:border-zinc-700 transition duration-150"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest font-semibold">Security Health</span>
              <h4 className="text-xs font-bold text-white">Awareness Index</h4>
            </div>
            <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
              <Award size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={data.avgScore} suffix="%" />
              </span>
            </div>
            <p className="text-[9px] text-[#00D26A] font-mono mt-3 flex items-center gap-1">
              <ArrowUpRight size={10} /> +4.2% awareness increase
            </p>
          </div>
        </motion.div>

        {/* KPI 2: Simulation Failure */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-xl flex flex-col justify-between hover:border-zinc-700 transition duration-150"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest font-semibold">Vulnerability Index</span>
              <h4 className="text-xs font-bold text-white">Simulation Clickrate</h4>
            </div>
            <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
              <ShieldAlert size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={data.rates.clickRate} suffix="%" />
              </span>
            </div>
            <p className="text-[9px] text-[#00D26A] font-mono mt-3 flex items-center gap-1">
              <ArrowDownRight size={10} /> -6.5% failure drop
            </p>
          </div>
        </motion.div>

        {/* KPI 3: Active Scope */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-xl flex flex-col justify-between hover:border-zinc-700 transition duration-150"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest font-semibold">Domain Authority</span>
              <h4 className="text-xs font-bold text-white">Scope Target</h4>
            </div>
            <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
              <Globe size={12} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white truncate font-mono tracking-tight mb-1">
              acme.com
            </h3>
            <p className="text-[9px] text-zinc-500 font-mono mt-4 flex items-center gap-1">
              <ShieldCheck size={11} className="text-[#00D26A]" /> Verified consent
            </p>
          </div>
        </motion.div>

        {/* KPI 4: Target Users */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-xl flex flex-col justify-between hover:border-zinc-700 transition duration-150"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-widest font-semibold">Active Directory</span>
              <h4 className="text-xs font-bold text-white">Target Registry</h4>
            </div>
            <div className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white">
              <Users size={12} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-white font-mono tracking-tight">
                <AnimatedCounter value={data.totalEmployees} />
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono mt-3">
              Monitored across departments
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Chart Card 1: Conversion Funnel */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl lg:col-span-2 space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Campaign Action Funnel
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono">Interaction vectors tracked across authorized simulation sequences.</p>
          </div>

          <div className="h-72 w-full font-mono text-[10px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" horizontal={false} />
                <XAxis type="number" stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#a1a1aa" fontSize={9} width={90} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded border border-[#1F1F1F] bg-[#0A0A0A] space-y-1 font-mono text-[9px]">
                          <p className="font-bold text-zinc-400 uppercase">{data.stage}</p>
                          <div className="flex items-baseline gap-1 text-white">
                            <span className="text-xs font-bold">{data.count}</span>
                            <span>actions</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="transition duration-150" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart Card 2: Risk Profile distribution */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl flex flex-col justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Risk Profiles
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono">Registry split across threat levels.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center font-mono text-xs relative my-2">
            {/* Centered text index */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Risk Index</span>
              <span className="text-xl font-bold text-white font-mono mt-0.5">
                {Math.round(((data.riskCounts.HIGH * 100 + data.riskCounts.MEDIUM * 50) / (data.totalEmployees || 1)))}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121212" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="p-3 rounded border border-[#1F1F1F] bg-[#0A0A0A] space-y-1 font-mono text-[9px]">
                          <p className="font-bold uppercase" style={{ color: data.payload.color }}>{data.name}</p>
                          <div className="flex items-baseline gap-1 text-white">
                            <span className="text-xs font-bold">{data.value}</span>
                            <span>employees</span>
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

          <div className="grid grid-cols-3 gap-2 border-t border-[#1F1F1F]/40 pt-4 text-center font-mono text-[9px]">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                <p className="text-zinc-500 uppercase">Low</p>
              </div>
              <p className="text-xs font-bold text-zinc-300">{data.riskCounts.LOW}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                <p className="text-zinc-500 uppercase">Medium</p>
              </div>
              <p className="text-xs font-bold text-zinc-300">{data.riskCounts.MEDIUM}</p>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <p className="text-zinc-500 uppercase">High</p>
              </div>
              <p className="text-xs font-bold text-zinc-300">{data.riskCounts.HIGH}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trends & Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl lg:col-span-2 space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Security Readiness Progress</h3>
            <p className="text-[11px] text-zinc-500 font-mono">Interaction ratios tracked across simulation cycles.</p>
          </div>

          <div className="h-64 w-full font-mono text-[10px] pt-4">
            {data.campaignTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.campaignTrends} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} domain={[0, 100]} unit="%" tickLine={false} axisLine={false} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3.5 rounded border border-[#1F1F1F] bg-[#0A0A0A] space-y-1.5 font-mono text-[9px]">
                            <p className="font-bold text-white uppercase border-b border-[#1F1F1F] pb-1">{label}</p>
                            <div className="space-y-1">
                              {payload.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-4">
                                  <span style={{ color: p.stroke }}>{p.name}:</span>
                                  <span className="font-bold text-white">{p.value}%</span>
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
                    formatter={(value) => <span className="text-[9px] text-zinc-500 font-mono">{value}</span>}
                  />
                  <Area type="monotone" dataKey="openRate" name="Open Rate" stroke="#ffffff" strokeWidth={1.5} fill="transparent" />
                  <Area type="monotone" dataKey="clickRate" name="Link Click Rate" stroke="#a8a8a8" strokeWidth={1.5} fill="transparent" />
                  <Area type="monotone" dataKey="submitRate" name="Credential Submission" stroke="#00FF88" strokeWidth={1.5} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#1F1F1F] rounded-xl text-center p-8 space-y-2">
                <Activity size={16} className="text-zinc-600" />
                <span className="text-xs font-mono text-zinc-500">Timeline Analysis Pending</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div 
          variants={itemVariants}
          className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase font-mono">
              Department Standings
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono">Performance ranked by awareness rating.</p>
          </div>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
            {data.departmentStats.map((dept, idx) => {
              return (
                <div 
                  key={dept.name} 
                  className="p-3 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] hover:border-zinc-700 transition flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded bg-[#121212] border border-[#1F1F1F] flex items-center justify-center text-[9px] font-mono text-zinc-500">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-[10px] font-bold text-white tracking-tight">{dept.name}</p>
                        <p className="text-[8px] text-zinc-500 font-mono">{dept.employeesCount} employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold font-mono tracking-tight ${dept.averageScore >= 80 ? 'text-[#00D26A]' : 'text-zinc-400'}`}>
                        {dept.averageScore}%
                      </p>
                      <p className="text-[8px] text-zinc-500 font-mono">{dept.clicksCount} clicks / {dept.submitsCount} subs</p>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-[#121212] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        dept.averageScore >= 80 ? 'bg-[#00D26A]' : 
                        dept.averageScore >= 60 ? 'bg-[#2ECC71]' : 'bg-[#00FF88]'
                      }`}
                      style={{ width: `${dept.averageScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* SOC Ticker */}
      <div className="border-t border-[#1F1F1F] pt-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">SOC Operational Stream</span>
            <h2 className="text-sm font-bold text-white tracking-widest uppercase font-mono">
              SOC Performance Feeds
            </h2>
            <p className="text-xs text-zinc-500 font-mono">Continuous simulated campaign performance metrics.</p>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] border border-[#1F1F1F] rounded-lg text-[9px] font-mono text-[#00D26A] font-bold">
            <Activity size={10} /> STREAM ACTIVE
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1: Live Simulation Monitor */}
          <div className="space-y-6">
            <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Execution Node</span>
                  <h4 className="text-xs font-extrabold text-white tracking-tight">Active Drill Status</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 border border-[#1F1F1F] text-white text-[8px] font-mono font-bold uppercase">ACTIVE</span>
              </div>

              <div className="space-y-4 font-mono text-[10px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8.5px] text-zinc-500">
                    <span>Q3 Password Audit</span>
                    <span>{simProgress}% DISPATCHED</span>
                  </div>
                  <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${simProgress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-2 rounded">
                    <span className="text-zinc-500 text-[8px] uppercase block font-bold">Targets</span>
                    <span className="text-xs font-bold text-white mt-1 block">142</span>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-2 rounded">
                    <span className="text-zinc-500 text-[8px] uppercase block font-bold">Clicks logged</span>
                    <span className="text-xs font-bold text-white mt-1 block">
                      {clicksCount} clicks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Dial */}
            <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-3">
              <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Remediation Telemetry</h4>
              <div className="space-y-2 text-[9px] font-mono">
                <div className="flex justify-between items-center p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
                  <span className="text-zinc-500">Simulation escape ratio</span>
                  <span className="text-white font-bold">92.5%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
                  <span className="text-zinc-500">Employee report ratio</span>
                  <span className="text-white font-bold">44.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Interaction Stream */}
          <div className="space-y-6">
            <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-4">
              <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Employee Telemetry timeline</h4>
              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {interactionLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-2 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex items-start gap-3"
                    >
                      <div className="mt-1 shrink-0">
                        {log.action === 'OPENED' && <Mail size={12} className="text-zinc-400" />}
                        {log.action === 'CLICKED' && <MousePointerClick size={12} className="text-zinc-300" />}
                        {log.action === 'SUBMITTED' && <AlertTriangle size={12} className="text-white" />}
                        {log.action === 'REPORTED' && <ShieldCheck size={12} className="text-[#00D26A]" />}
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
          </div>

          {/* Column 3: Diagnostic outputs */}
          <div className="space-y-6">
            <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2 text-[9px]">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-white" />
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">Console output</span>
                </div>
              </div>

              <div className="h-[140px] overflow-y-auto text-[8.5px] space-y-1.5 scrollbar-thin text-zinc-400 leading-normal flex flex-col justify-end">
                {consoleLogs.map((log, index) => (
                  <div key={index} className="truncate text-zinc-400 font-mono">
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
