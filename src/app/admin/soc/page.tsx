'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Globe, 
  Search, 
  Filter, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw,
  Clock,
  AlertCircle,
  Sparkles,
  GraduationCap
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
    if (type.includes('ALERT') || type.includes('CLICKED') || type.includes('RISK_UPDATED')) return 'text-zinc-300 border-[#1F1F1F] bg-[#121212]';
    if (type.includes('COMPLETED') || type.includes('REPORTED') || type.includes('TRAINING')) return 'text-[#00D26A] border-[#00D26A]/20 bg-[#050505]';
    return 'text-zinc-400 border-[#1F1F1F] bg-[#121212]';
  };

  const getTimelineEventBadge = (type: string) => {
    switch (type) {
      case 'SUBMITTED':
        return 'bg-white text-black border border-white/10';
      case 'CLICKED':
        return 'bg-[#121212] text-zinc-300 border border-[#1F1F1F]';
      case 'OPENED':
        return 'bg-[#0B0B0B] text-zinc-400 border border-[#1F1F1F]';
      default:
        return 'bg-[#121212] text-zinc-500 border border-[#1F1F1F]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border border-white/20 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Initializing Control Room Console...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-zinc-300 font-sans">
      
      {/* CONTROL ROOM HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
            <h1 className="text-xl font-bold text-white tracking-tight uppercase font-mono">
              SOC Command Console
            </h1>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed font-mono uppercase tracking-widest">
            Control Node :: postured compliance monitoring & alert simulation intelligence
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="px-3 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-400 flex items-center gap-2">
            <Clock size={11} className="text-zinc-500" />
            <span>IST SYSTEM TIME:</span>
            <span className="text-white font-bold">{istTime || 'LOADING...'}</span>
          </div>

          <button 
            onClick={fetchSocData}
            className="p-2 rounded border border-[#1F1F1F] bg-[#121212] hover:bg-[#1C1C1C] text-zinc-400 hover:text-white transition"
            title="Refresh metrics feed"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* SOC POSTURE OVERVIEW METRICS */}
      {posture && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Health Score */}
          <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Posture Health</span>
              <ShieldCheck size={14} className="text-white" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight font-mono">
                {posture.healthScore}%
              </span>
              <span className="text-[9px] text-[#00D26A] font-mono font-bold tracking-widest">STABLE</span>
            </div>
            {/* Visual health bar */}
            <div className="w-full bg-[#050505] h-1 rounded-full overflow-hidden mt-3.5 border border-[#1F1F1F]">
              <div 
                className="bg-white h-full rounded-full"
                style={{ width: `${posture.healthScore}%` }}
              />
            </div>
          </div>

          {/* Maturity Level */}
          <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Posture Maturity</span>
              <Activity size={14} className="text-zinc-400" />
            </div>
            <div className="mt-4">
              <span className="text-base font-bold text-white tracking-wide font-mono block">
                {posture.maturityLevel}
              </span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono mt-1 block">Level Tier Indices</span>
            </div>
          </div>

          {/* Org Risk Index */}
          <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Threat Posture</span>
              <AlertTriangle size={14} className="text-white" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-xl font-bold text-white tracking-tight font-mono uppercase">
                {posture.riskIndex}
              </span>
            </div>
            <p className="text-[8.5px] text-zinc-500 mt-3 font-mono leading-relaxed uppercase tracking-wider">
              Based on active failures & weights
            </p>
          </div>

          {/* Active Campaigns & Training */}
          <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Compliance</span>
              <GraduationCap size={14} className="text-zinc-400" />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="space-y-0.5">
                <span className="text-xl font-bold text-white font-mono block">{posture.trainingCompletion}%</span>
                <span className="text-[7.5px] text-zinc-500 uppercase font-mono tracking-widest">Complete</span>
              </div>
              <div className="h-6 w-px bg-[#1F1F1F]" />
              <div className="space-y-0.5 text-right">
                <span className="text-xl font-bold text-white font-mono block">{posture.activeCampaigns}</span>
                <span className="text-[7.5px] text-zinc-500 uppercase font-mono tracking-widest">Drills</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE MIDDLE SECTION: LIVE CONSOLE TERMINAL & SECURITY TIMELINE */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Live Ticker Feed Terminal Console (2/3 width) */}
        <div className="lg:col-span-2 border border-[#1F1F1F] bg-[#0A0A0A] rounded-xl overflow-hidden shadow-xl flex flex-col h-[400px]">
          {/* Console Header */}
          <div className="px-4 py-3 border-b border-[#1F1F1F] bg-[#121212] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-white shrink-0" />
              <span className="text-[9px] font-mono text-white font-bold uppercase tracking-widest">Live Operations Console Feed</span>
            </div>
            <span className="flex items-center gap-1.5 text-[8px] font-mono text-white bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 uppercase tracking-widest">
              Sync Active
            </span>
          </div>

          {/* Console Terminal Logs Stream */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] leading-relaxed space-y-2 scrollbar-thin">
            <AnimatePresence initial={false}>
              {liveLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-3 border-b border-[#1F1F1F]/20 pb-2 hover:bg-white/[0.01] p-1 rounded transition"
                >
                  <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                  <span className={`text-[8px] font-mono border px-1.5 py-0.5 rounded shrink-0 uppercase tracking-widest ${getPriorityColor(log.type)}`}>
                    {log.type.substring(0, 12)}
                  </span>
                  <div className="space-y-0.5 flex-1 pr-2">
                    <strong className="text-white font-normal">{log.title}</strong>
                    <span className="text-zinc-500 block">{log.message}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Timeline (1/3 width) */}
        <div className="border border-[#1F1F1F] bg-[#121212] rounded-xl p-5 flex flex-col h-[400px] shadow-xl">
          <div className="border-b border-[#1F1F1F] pb-3 mb-4">
            <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">Campaign Threat Loop</h3>
            <span className="text-[8px] text-zinc-500 font-mono block">Delivery and Remediation Tracks</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {timeline.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 text-xs font-mono">
                No active threat trails.
              </div>
            ) : (
              timeline.slice(0, 5).map((evt, idx) => (
                <div key={evt.id} className="relative flex gap-3 pb-2 last:pb-0">
                  {/* Vertical connector line */}
                  {idx < 4 && (
                    <span className="absolute left-3 top-6 bottom-0 w-px bg-[#1F1F1F]" />
                  )}

                  {/* Indicator Dot */}
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-[9px] font-mono font-bold ${getTimelineEventBadge(evt.eventType)}`}>
                    {idx + 1}
                  </div>

                  {/* Event details */}
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase block">
                      {new Date(evt.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <h4 className="text-[10px] font-bold text-white font-mono leading-tight">{evt.title}</h4>
                    <p className="text-[9.5px] text-zinc-400 leading-normal font-sans pr-1">{evt.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* GLOBAL OPERATIONS VIEW: BRANCH STANDINGS */}
      <div className="border border-[#1F1F1F] bg-[#121212] rounded-2xl p-5 shadow-xl space-y-6">
        
        {/* Filtering & Title Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-2.5">
            <Globe size={14} className="text-white" />
            <div>
              <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">Global Operations Matrix</h3>
              <p className="text-[9px] text-zinc-500 leading-relaxed font-mono uppercase">Telemetry of active Indian branches.</p>
            </div>
          </div>

          {/* Inline filters */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A]">
              <Search size={11} className="text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search branches..."
                className="bg-transparent focus:outline-none text-[10px] text-white w-28"
              />
            </div>

            {/* Select Branch */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-400">
              <Filter size={10} className="text-zinc-500" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent focus:outline-none text-[10px] text-white cursor-pointer"
              >
                <option value="ALL" className="bg-[#121212]">All Branches</option>
                {branches.map(b => (
                  <option key={b.name} value={b.name} className="bg-[#121212]">{b.name}</option>
                ))}
              </select>
            </div>

            {/* Select Risk Index */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-400">
              <AlertCircle size={10} className="text-zinc-500" />
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="bg-transparent focus:outline-none text-[10px] text-white cursor-pointer"
              >
                <option value="ALL" className="bg-[#121212]">All Risks</option>
                <option value="HIGH" className="bg-[#121212]">High Risk</option>
                <option value="MEDIUM" className="bg-[#121212]">Medium Risk</option>
                <option value="LOW" className="bg-[#121212]">Low Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Branch standings grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredBranches.map((br) => (
              <motion.div
                key={br.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl border border-[#1F1F1F] bg-[#0A0A0A] relative transition duration-150 hover:border-zinc-700"
              >
                {/* Active alert indicator dot */}
                {br.campaignStatus === 'ACTIVE' && (
                  <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                )}

                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{br.name} Office</h4>
                
                <div className="mt-4 space-y-2 text-[9.5px] font-mono">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Active Employees</span>
                    <span className="text-white font-medium">{br.employees}</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Awareness rating</span>
                    <span className={`font-bold ${br.awarenessScore >= 75 ? 'text-[#00D26A]' : br.awarenessScore >= 60 ? 'text-amber-500' : 'text-zinc-300'}`}>
                      {br.awarenessScore}/100
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Risk Profile Ratio</span>
                    <span className={`font-bold ${br.riskScore >= 20 ? 'text-zinc-300 font-bold' : 'text-zinc-500'}`}>
                      {br.riskScore}% HR
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500">
                    <span>Training compliance</span>
                    <span className="text-white font-medium">{br.trainingPercent}%</span>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 pt-2 border-t border-[#1F1F1F]/40">
                    <span>Status</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      br.campaignStatus === 'ACTIVE' 
                        ? 'bg-zinc-800 border border-[#1F1F1F] text-white' 
                        : 'bg-[#121212] border border-[#1F1F1F] text-zinc-500'
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
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Threat Intelligence indices */}
          <div className="lg:col-span-2 border border-[#1F1F1F] bg-[#121212] rounded-xl p-5 shadow-xl space-y-4">
            <div className="border-b border-[#1F1F1F] pb-3">
              <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">Threat Intelligence</h3>
              <p className="text-[9px] text-zinc-500 font-mono uppercase">Indices generated from platform simulated telemetry</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Worst Phishing Vector</span>
                <span className="text-[10.5px] font-bold text-white font-mono block truncate">{threatIntel.mostClickedSimulation}</span>
                <span className="text-[8px] text-zinc-500 font-mono flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> Highest failure trigger
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Vulnerable Dept</span>
                <span className="text-[10.5px] font-bold text-white font-mono block">{threatIntel.mostVulnerableDept}</span>
                <span className="text-[8px] text-zinc-500 font-mono block">Requires immediate compliance enrollment</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Improving Branch</span>
                <span className="text-[10.5px] font-bold text-white font-mono block">{threatIntel.fastestImprovingBranch}</span>
                <span className="text-[8px] text-[#00D26A] font-mono block">Highest score growth rate</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] space-y-1">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Effective Template</span>
                <span className="text-[10.5px] font-bold text-white font-mono block truncate">{threatIntel.mostEffectiveEmailTemplate}</span>
                <span className="text-[8px] text-zinc-500 font-mono block">Triggers high reporting rate</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Remediation */}
          <div className="border border-[#1F1F1F] bg-[#121212] rounded-xl p-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#1F1F1F] pb-3">
                <Sparkles size={14} className="text-white shrink-0" />
                <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-widest">AI Executive Advisories</h3>
              </div>

              <div className="p-4 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] text-[9.5px] leading-relaxed text-zinc-400 font-mono">
                {threatIntel.topAIRecommendation}
              </div>
            </div>

            <p className="text-[8px] text-zinc-500 mt-4 leading-relaxed font-mono uppercase">
              // Telemetry updated continuously via system node checkpoints.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
