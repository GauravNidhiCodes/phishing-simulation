'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Send, 
  AlertTriangle, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Activity
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

export default function Dashboard() {
  const [data, setData] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Operations Dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
        <AlertTriangle className="text-brand-rose mx-auto" size={40} />
        <h2 className="text-xl font-bold text-white">System Error</h2>
        <p className="text-gray-400 text-sm">Failed to connect to core analytics pipeline. Ensure seed script has run successfully.</p>
      </div>
    );
  }

  // Formatting data for Recharts Pie
  const riskPieData = [
    { name: 'Low Risk', value: data.riskCounts.LOW, color: '#10b981' },
    { name: 'Medium Risk', value: data.riskCounts.MEDIUM, color: '#f59e0b' },
    { name: 'High Risk', value: data.riskCounts.HIGH, color: '#f43f5e' },
  ];

  // Conversion Funnel Data
  const funnelData = [
    { stage: 'Delivered', count: data.rates.delivered, fill: '#8b5cf6' },
    { stage: 'Opened', count: data.rates.opened, fill: '#6366f1' },
    { stage: 'Clicked Link', count: data.rates.clicked, fill: '#06b6d4' },
    { stage: 'Submitted Info', count: data.rates.submitted, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Executive Control</h1>
          <p className="text-sm text-gray-400">Real-time organizational readiness indices and risk levels.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Avg Score */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-mono text-gray-400 tracking-wider">Awareness Score</span>
            <div className="p-2 rounded-xl bg-brand-cyan/15 border border-brand-cyan/20 text-brand-cyan">
              <Award size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white font-mono">{data.avgScore}%</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <ArrowUpRight size={14} />
              <span>+4.2% from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Click Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-mono text-gray-400 tracking-wider">Failure Rate</span>
            <div className="p-2 rounded-xl bg-brand-rose/15 border border-brand-rose/20 text-brand-rose">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white font-mono">{data.rates.clickRate}%</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
              <ArrowDownRight size={14} />
              <span>-6.5% campaign clickrate</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 3: Active Campaigns */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-mono text-gray-400 tracking-wider">Target Domain</span>
            <div className="p-2 rounded-xl bg-brand-purple/15 border border-brand-purple/20 text-brand-purple">
              <Send size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white truncate font-mono">acme.com</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <Activity size={14} className="text-brand-purple animate-pulse" />
              <span>1 Domain Pending Authorization</span>
            </div>
          </div>
        </motion.div>

        {/* Metric 4: Inspected Employees */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase font-mono text-gray-400 tracking-wider">Registered Staff</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
              <Users size={16} />
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-white font-mono">{data.totalEmployees}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <span>Distributed across 5 departments</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart 1: Funnel Analytics (Recharts Bar) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white">Simulation Action Funnel</h3>
            <p className="text-xs text-gray-400">Cumulative interaction metrics for all training campaigns.</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis type="number" stroke="#666" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#666" fontSize={11} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Risk Profile distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-panel p-6 rounded-3xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-bold text-white">Risk Distribution</h3>
            <p className="text-xs text-gray-400">Employee threat exposure categories.</p>
          </div>
          
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Legend iconType="circle" fontSize={12} formatter={(value) => <span className="text-xs text-gray-400">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-cyber-border/40 pt-4 text-center">
            <div>
              <p className="text-[10px] uppercase font-mono text-gray-500">Low Risk</p>
              <p className="text-sm font-bold text-emerald-400">{data.riskCounts.LOW}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-gray-500">Medium</p>
              <p className="text-sm font-bold text-amber-400">{data.riskCounts.MEDIUM}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono text-gray-500">High Risk</p>
              <p className="text-sm font-bold text-rose-400">{data.riskCounts.HIGH}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Historical trends and Department leaderboards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trend Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-3xl lg:col-span-2 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white">Security Readiness Progress</h3>
            <p className="text-xs text-gray-400">Open and failure rate trends across historical campaigns.</p>
          </div>

          <div className="h-64 w-full">
            {data.campaignTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.campaignTrends} margin={{ left: -10, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSubmit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} domain={[0, 100]} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="openRate" name="Open Rate" stroke="#8b5cf6" strokeWidth={2} fill="transparent" />
                  <Area type="monotone" dataKey="clickRate" name="Link Click Rate" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorClick)" />
                  <Area type="monotone" dataKey="submitRate" name="Credential Submission" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmit)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-cyber-border rounded-2xl text-xs font-mono text-gray-500">
                Insufficient completed campaigns to compute timeline trends.
              </div>
            )}
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel p-6 rounded-3xl space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white">Department Scores</h3>
            <p className="text-xs text-gray-400">Performance leaderboard sorted by awareness index.</p>
          </div>

          <div className="space-y-4">
            {data.departmentStats.map((dept, idx) => {
              // Custom rank color badges
              let rankBadge = "text-gray-400 bg-white/5";
              if (idx === 0) rankBadge = "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20";
              else if (idx === 1) rankBadge = "text-slate-300 bg-slate-300/10 border border-slate-300/20";
              else if (idx === 2) rankBadge = "text-amber-600 bg-amber-600/10 border border-amber-600/20";

              return (
                <div key={dept.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-cyan/20 transition">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${rankBadge}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{dept.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{dept.employeesCount} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold font-mono ${dept.averageScore >= 80 ? 'text-emerald-400' : dept.averageScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {dept.averageScore}%
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono">{dept.clicksCount} clicks / {dept.submitsCount} subs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
