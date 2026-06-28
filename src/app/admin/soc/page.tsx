'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Send, 
  GraduationCap, 
  Terminal, 
  Globe, 
  Search, 
  Filter, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw,
  Clock,
  Briefcase,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface Posture {
  healthScore: number;
  activeCampaigns: number;
  activeEmployees: number;
  highRiskEmployees: number;
  trainingCompletion: number;
  maturityLevel: string;
  riskIndex: string;
}

interface BranchStat {
  name: string;
  employees: number;
  awarenessScore: number;
  riskScore: number;
  trainingPercent: number;
  campaignStatus: string;
}

interface ThreatIntel {
  mostClickedSimulation: string;
  mostVulnerableDept: string;
  fastestImprovingBranch: string;
  topAIRecommendation: string;
  mostEffectiveEmailTemplate: string;
}

interface TimelineEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  timestamp: string;
}

interface MockFeed {
  type: string;
  title: string;
  message: string;
}

export default function SocDashboard() {
  const [loading, setLoading] = useState(true);
  const [posture, setPosture] = useState<Posture | null>(null);
  const [branches, setBranches] = useState<BranchStat[]>([]);
  const [threatIntel, setThreatIntel] = useState<ThreatIntel | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [mockFeeds, setMockFeeds] = useState<MockFeed[]>([]);
  const [liveLogs, setLiveLogs] = useState<{ id: string; time: string; title: string; message: string; type: string }[]>([]);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [istTime, setIstTime] = useState('');

  // Fetch SOC data
  const fetchSocData = async () => {
    try {
      const res = await fetch('/api/admin/soc');
      const data = await res.json();
      if (data && !data.error) {
        setPosture(data.posture);
        setBranches(data.branchStats);
        setThreatIntel(data.threatIntel);
        setTimeline(data.timelineEvents);
        setMockFeeds(data.mockLiveFeeds);
        
        // Populate initial live logs
        if (data.mockLiveFeeds.length > 0 && liveLogs.length === 0) {
          const initial = data.mockLiveFeeds.slice(0, 4).map((feed: MockFeed, idx: number) => ({
            id: `LOG-INIT-${idx}`,
            time: new Date(Date.now() - idx * 2 * 60000).toLocaleTimeString('en-IN', { hour12: false }),
            title: feed.title,
            message: feed.message,
            type: feed.type
          }));
          setLiveLogs(initial);
        }
      }
    } catch (e) {
      console.error("Error loading SOC metrics:", e);
    }
    setLoading(false);
  };

  // Clock tick & Initial fetch
  useEffect(() => {
    fetchSocData();

    const clockInterval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setIstTime(time + ' IST');
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Live Console updates ticker simulation
  useEffect(() => {
    if (mockFeeds.length === 0) return;

    const tickerInterval = setInterval(() => {
      // Pick random feed item
      const feed = mockFeeds[Math.floor(Math.random() * mockFeeds.length)];
      const newLog = {
        id: `LOG-${Date.now()}`,
        time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        title: feed.title,
        message: feed.message,
        type: feed.type
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 11)]); // keep max 12 logs in viewport
    }, 9000);

    return () => clearInterval(tickerInterval);
  }, [mockFeeds]);

  // Filtering Logic
  const filteredBranches = branches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === 'ALL' || b.name === selectedBranch;
    
    let matchesRisk = true;
    if (selectedRisk !== 'ALL') {
      if (selectedRisk === 'HIGH') matchesRisk = b.riskScore >= 20;
      else if (selectedRisk === 'MEDIUM') matchesRisk = b.riskScore >= 10 && b.riskScore < 20;
      else matchesRisk = b.riskScore < 10;
    }

    return matchesSearch && matchesBranch && matchesRisk;
  });

  const getPriorityColor = (type: string) => {
    if (type.includes('ALERT') || type.includes('CLICKED') || type.includes('RISK_UPDATED')) return 'text-red-500 border-red-500/30 bg-red-950/20';
    if (type.includes('COMPLETED') || type.includes('REPORTED') || type.includes('TRAINING')) return 'text-green-400 border-green-500/30 bg-green-950/20';
    return 'text-amber-500 border-amber-500/30 bg-amber-950/20';
  };

  const getTimelineEventBadge = (type: string) => {
    switch (type) {
      case 'SUBMITTED':
        return 'bg-red-600 shadow-[0_0_8px_#E50914] text-white';
      case 'CLICKED':
        return 'bg-red-500 text-white';
      case 'OPENED':
        return 'bg-amber-500 text-black';
      default:
        return 'bg-zinc-800 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">Initializing Control Room Console...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-300 font-sans">
      
      {/* CONTROL ROOM HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252525] pb-6 bg-black/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase font-mono text-glow-red">
              Security Operations Center (SOC)
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-mono uppercase tracking-wider">
            Control Node :: postured compliance monitoring & alert simulation intelligence
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-xl border border-[#252525] bg-[#141414] text-[#A8A8A8] flex items-center gap-2">
            <Clock size={13} className="text-red-500" />
            <span>IST SYSTEM TIME:</span>
            <span className="text-white font-bold font-mono">{istTime || 'LOADING IST...'}</span>
          </div>

          <button 
            onClick={fetchSocData}
            className="p-2.5 rounded-xl border border-[#252525] bg-[#141414] hover:bg-[#181818] hover:border-red-600/40 text-gray-400 hover:text-white transition duration-200"
            title="Refresh metrics feed"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* SOC POSTURE OVERVIEW METRICS */}
      {posture && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Health Score */}
          <div className="p-5 border border-[#252525] bg-[#141414] rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Posture Health Rating</span>
              <ShieldCheck size={18} className="text-red-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono text-glow-red">
                {posture.healthScore}%
              </span>
              <span className="text-xs text-green-500 font-mono">STABLE</span>
            </div>
            {/* Visual health bar */}
            <div className="w-full bg-[#0B0B0B] h-1.5 rounded-full overflow-hidden mt-3.5 border border-[#252525]">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full shadow-[0_0_8px_#E50914]"
                style={{ width: `${posture.healthScore}%` }}
              />
            </div>
          </div>

          {/* Maturity Level */}
          <div className="p-5 border border-[#252525] bg-[#141414] rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">POSTURE MATURITY</span>
              <Activity size={18} className="text-red-500" />
            </div>
            <div className="mt-4">
              <span className="text-lg font-bold text-white tracking-wide font-mono block">
                {posture.maturityLevel}
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono mt-1 block">Level Tier Indices</span>
            </div>
          </div>

          {/* Org Risk Index */}
          <div className="p-5 border border-[#252525] bg-[#141414] rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Threat Posture</span>
              <AlertTriangle size={18} className="text-red-600 animate-pulse" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-red-500 tracking-tight font-mono text-glow-red uppercase">
                {posture.riskIndex}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 mt-3 font-sans leading-relaxed">
              Calculated based on active employee failure ratios and high-risk department weights.
            </p>
          </div>

          {/* Active Campaigns & Training */}
          <div className="p-5 border border-[#252525] bg-[#141414] rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Compliance Status</span>
              <GraduationCap size={18} className="text-red-500" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="space-y-0.5">
                <span className="text-2xl font-bold text-white font-mono block">{posture.trainingCompletion}%</span>
                <span className="text-[8px] text-gray-500 uppercase font-mono tracking-widest">Training Complete</span>
              </div>
              <div className="h-8 w-px bg-[#252525]" />
              <div className="space-y-0.5 text-right">
                <span className="text-2xl font-bold text-white font-mono block">{posture.activeCampaigns}</span>
                <span className="text-[8px] text-gray-500 uppercase font-mono tracking-widest">Active Drills</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE MIDDLE SECTION: LIVE CONSOLE TERMINAL & SECURITY TIMELINE */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Live Ticker Feed Terminal Console (2/3 width) */}
        <div className="lg:col-span-2 border border-[#252525] bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-xl flex flex-col h-[460px]">
          {/* Console Header */}
          <div className="px-4 py-3 border-b border-[#252525] bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-red-500 shrink-0" />
              <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">Live Operations Console Feed</span>
            </div>
            <span className="flex items-center gap-1 text-[8px] font-mono text-red-500 bg-red-950/20 px-2 py-0.5 rounded border border-red-600/20 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shrink-0" /> Realtime Node Sync
            </span>
          </div>

          {/* Console Terminal Logs Stream */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-2.5 scrollbar-thin">
            <AnimatePresence initial={false}>
              {liveLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 border-b border-[#141414]/30 pb-2 hover:bg-white/2 p-1.5 rounded-lg transition"
                >
                  <span className="text-red-600 font-bold shrink-0">[{log.time}]</span>
                  <span className={`text-[8.5px] font-mono border px-1.5 py-0.5 rounded shrink-0 uppercase tracking-widest ${getPriorityColor(log.type)}`}>
                    {log.type.substring(0, 12)}
                  </span>
                  <div className="space-y-0.5 flex-1 pr-2">
                    <strong className="text-white">{log.title}</strong>
                    <span className="text-gray-400 block">{log.message}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Timeline (1/3 width) */}
        <div className="border border-[#252525] bg-[#141414] rounded-2xl p-5 flex flex-col h-[460px] shadow-xl">
          <div className="border-b border-[#252525] pb-3 mb-4">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Campaign Threat Loop</h3>
            <span className="text-[9px] text-gray-500 font-mono block">Delivery and Remediation Steps</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {timeline.length === 0 ? (
              <div className="text-center py-20 text-gray-600 text-xs font-mono">
                No active threats recorded.
              </div>
            ) : (
              timeline.slice(0, 5).map((evt, idx) => (
                <div key={evt.id} className="relative flex gap-3 pb-2 last:pb-0">
                  {/* Vertical connector line */}
                  {idx < 4 && (
                    <span className="absolute left-3 top-6 bottom-0 w-px bg-zinc-800" />
                  )}

                  {/* Indicator Dot */}
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-bold font-mono ${getTimelineEventBadge(evt.eventType)}`}>
                    {idx + 1}
                  </div>

                  {/* Event details */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-gray-500 uppercase block">
                      {new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <h4 className="text-[11px] font-bold text-white font-mono leading-tight">{evt.title}</h4>
                    <p className="text-[10px] text-gray-400 leading-normal font-sans pr-1">{evt.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* GLOBAL OPERATIONS VIEW: BRANCH POST STANDINGS */}
      <div className="border border-[#252525] bg-[#141414] rounded-3xl p-6 shadow-xl space-y-6">
        
        {/* Filtering & Title Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#252525] pb-5">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-red-500 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Global Operations Matrix</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed">Status parameters of administrative branches across India.</p>
            </div>
          </div>

          {/* Inline filters */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#252525] bg-[#0A0A0A]">
              <Search size={12} className="text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find branch name..."
                className="bg-transparent focus:outline-none text-[11px] text-white w-32"
              />
            </div>

            {/* Select Branch */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#252525] bg-[#0A0A0A] text-gray-400">
              <Filter size={11} className="text-gray-500" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px] text-white cursor-pointer"
              >
                <option value="ALL" className="bg-[#141414]">All Branches</option>
                {branches.map(b => (
                  <option key={b.name} value={b.name} className="bg-[#141414]">{b.name}</option>
                ))}
              </select>
            </div>

            {/* Select Risk Index */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#252525] bg-[#0A0A0A] text-gray-400">
              <AlertCircle size={11} className="text-gray-500" />
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px] text-white cursor-pointer"
              >
                <option value="ALL" className="bg-[#141414]">All Risk Indices</option>
                <option value="HIGH" className="bg-[#141414]">High Risk Profile</option>
                <option value="MEDIUM" className="bg-[#141414]">Medium Risk Profile</option>
                <option value="LOW" className="bg-[#141414]">Low Risk Profile</option>
              </select>
            </div>
          </div>
        </div>

        {/* Branch standings grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBranches.map((br) => (
              <motion.div
                key={br.name}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-4 rounded-2xl border border-[#252525] bg-[#0B0B0B] relative hover:border-red-600/30 transition duration-200"
              >
                {/* Active alert indicator dot */}
                {br.campaignStatus === 'ACTIVE' && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_#E50914] animate-ping" />
                )}

                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">{br.name} Branch</h4>
                
                <div className="mt-4 space-y-2 text-[10px] font-mono">
                  {/* Total Employees */}
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Active Employees</span>
                    <span className="text-white font-semibold">{br.employees}</span>
                  </div>

                  {/* Awareness Score */}
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Awareness rating</span>
                    <span className={`font-bold ${br.awarenessScore >= 75 ? 'text-green-400' : br.awarenessScore >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {br.awarenessScore}/100
                    </span>
                  </div>

                  {/* Risk score index */}
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Risk Profile Ratio</span>
                    <span className={`font-bold ${br.riskScore >= 20 ? 'text-red-500' : br.riskScore >= 10 ? 'text-amber-500' : 'text-green-400'}`}>
                      {br.riskScore}% HR
                    </span>
                  </div>

                  {/* Training completion percentage */}
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Training compliance</span>
                    <span className="text-white font-semibold">{br.trainingPercent}%</span>
                  </div>

                  {/* Drill Status */}
                  <div className="flex justify-between items-center text-gray-500 pt-2 border-t border-[#252525]/40">
                    <span>Simulation Status</span>
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                      br.campaignStatus === 'ACTIVE' 
                        ? 'bg-red-950/20 border border-red-600/30 text-red-500 animate-pulse' 
                        : 'bg-[#181818] border border-[#252525] text-gray-500'
                    }`}>
                      {br.campaignStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* LOWER SECTION: THREAT INTELLIGENCE & RECOMMENDATIONS */}
      {threatIntel && (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Threat Intelligence indices (2/3 width) */}
          <div className="lg:col-span-2 border border-[#252525] bg-[#141414] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="border-b border-[#252525] pb-3">
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Threat Intelligence Panel</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase">Telemetry indices generated from mock analytics</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Most Clicked Simulation */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-[#252525] space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Worst Phishing Vector</span>
                <span className="text-xs font-bold text-white font-mono block truncate">{threatIntel.mostClickedSimulation}</span>
                <span className="text-[8px] text-red-500 font-mono flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> Highest failure trigger
                </span>
              </div>

              {/* Vulnerable Dept */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-[#252525] space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Most Vulnerable Dept</span>
                <span className="text-xs font-bold text-red-500 font-mono block">{threatIntel.mostVulnerableDept}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Requires immediate compliance enrollment</span>
              </div>

              {/* Improving branch */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-[#252525] space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Fastest Improving Branch</span>
                <span className="text-xs font-bold text-green-400 font-mono block">{threatIntel.fastestImprovingBranch}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Highest score growth rate</span>
              </div>

              {/* Effective template */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-[#252525] space-y-1">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Most Effective Template</span>
                <span className="text-xs font-bold text-white font-mono block truncate">{threatIntel.mostEffectiveEmailTemplate}</span>
                <span className="text-[8px] text-gray-500 font-mono block">Triggers high reporting rate</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Remediation (1/3 width) */}
          <div className="border border-[#252525] bg-[#141414] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#252525] pb-3">
                <Sparkles size={16} className="text-red-500 shrink-0" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">AI Executive Advisories</h3>
              </div>

              <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/5 text-xs leading-relaxed text-gray-300 font-mono">
                {threatIntel.topAIRecommendation}
              </div>
            </div>

            <p className="text-[9px] text-gray-500 mt-4 leading-relaxed font-mono uppercase">
              // Threat models updated automatically using live platform analytics.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
