'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Activity
} from 'lucide-react';

interface Log {
  id: string;
  campaign: { name: string; status: string };
  user: { name: string; email: string; department: string; awarenessScore: number; riskCategory: string };
  deliveredAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  submittedAt: string | null;
  createdAt: string;
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Compute unique lists for filter dropdowns
  const campaigns = Array.from(new Set(logs.map(l => l.campaign.name)));
  const departments = Array.from(new Set(logs.map(l => l.user.department).filter(Boolean)));

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCampaign = selectedCampaign === 'ALL' || log.campaign.name === selectedCampaign;
    const matchesDept = selectedDept === 'ALL' || log.user.department === selectedDept;
    
    let matchesAction = true;
    if (selectedAction === 'OPENED') matchesAction = !!log.openedAt;
    else if (selectedAction === 'CLICKED') matchesAction = !!log.clickedAt;
    else if (selectedAction === 'SUBMITTED') matchesAction = !!log.submittedAt;
    else if (selectedAction === 'NO_ACTION') matchesAction = !log.openedAt && !log.clickedAt && !log.submittedAt;

    return matchesSearch && matchesCampaign && matchesDept && matchesAction;
  });

  // Client side CSV export
  const exportToCSV = () => {
    if (filteredLogs.length === 0) return;
    
    const headers = ['Timestamp', 'Employee Name', 'Employee Email', 'Department', 'Campaign', 'Delivered', 'Opened', 'Clicked', 'Submitted Info'];
    const rows = filteredLogs.map(log => [
      log.createdAt ? new Date(log.createdAt).toLocaleString() : '',
      log.user.name,
      log.user.email,
      log.user.department || 'N/A',
      log.campaign.name,
      log.deliveredAt ? 'YES' : 'NO',
      log.openedAt ? 'YES' : 'NO',
      log.clickedAt ? 'YES' : 'NO',
      log.submittedAt ? 'YES' : 'NO'
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simulation_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <Activity className="text-brand-cyan animate-pulse" size={20} />
        </div>
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase animate-pulse">Retrieving Logs...</span>
          <p className="text-[10px] font-mono text-zinc-500">Querying transaction audit ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-[-10%] left-[5%] w-[400px] h-[400px] bg-brand-cyan/2 rounded-full blur-[130px] pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Telemetry Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Audit Logs & Analytics
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Review granular employee interaction vectors and filter transaction logs.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.01] border border-white/[0.04] text-[9px] font-mono text-zinc-500">
            <Database size={11} className="text-zinc-600" />
            <span>TOTAL_LOGS:</span>
            <span className="text-zinc-300 font-bold">{logs.length}</span>
          </div>
          <button
            onClick={exportToCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 active:scale-[0.98] disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl transition duration-200 text-xs font-mono uppercase tracking-wider"
          >
            <FileSpreadsheet size={13} className="text-brand-cyan shrink-0" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-6 rounded-3xl grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end border border-white/[0.04] relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Search */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Search Employee</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-zinc-500" size={14} />
            <input
              type="text"
              placeholder="Name or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs font-mono"
            />
          </div>
        </div>

        {/* Campaign Filter */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Campaign filter</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
          >
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Department Filter</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div>
          <label className="block text-[8px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">Interaction State</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
          >
            <option value="ALL">All Actions</option>
            <option value="OPENED">Opened Email</option>
            <option value="CLICKED">Clicked Phishing Link</option>
            <option value="SUBMITTED">Entered Details (Flipped Alert)</option>
            <option value="NO_ACTION">No action recorded (Ignored)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.04] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                <th className="px-6 py-4.5 font-bold">Employee Target</th>
                <th className="px-6 py-4.5 font-bold">Department</th>
                <th className="px-6 py-4.5 font-bold">Campaign Node</th>
                <th className="px-6 py-4.5 text-center font-bold">Delivered</th>
                <th className="px-6 py-4.5 text-center font-bold">Opened</th>
                <th className="px-6 py-4.5 text-center font-bold">Clicked Link</th>
                <th className="px-6 py-4.5 text-center font-bold">Submitted Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02] text-xs font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.015] border-l-2 border-l-transparent hover:border-l-brand-cyan/40 transition-all duration-200">
                  {/* Employee info */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-white text-xs tracking-tight">{log.user.name}</p>
                      <p className="text-[10px] text-zinc-500">{log.user.email}</p>
                    </div>
                  </td>
                  {/* Department */}
                  <td className="px-6 py-4 text-zinc-400">{log.user.department || 'General'}</td>
                  {/* Campaign */}
                  <td className="px-6 py-4 font-bold text-white/90">{log.campaign.name}</td>
                  {/* Delivered */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.deliveredAt ? (
                        <div className="p-1 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.06)]" title={new Date(log.deliveredAt).toLocaleString()}>
                          <CheckCircle2 size={13} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <Clock size={13} className="text-zinc-700" />
                      )}
                    </div>
                  </td>
                  {/* Opened */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.openedAt ? (
                        <div className="p-1 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.06)]" title={new Date(log.openedAt).toLocaleString()}>
                          <MailOpen size={13} />
                        </div>
                      ) : (
                        <Mail size={13} className="text-zinc-700" />
                      )}
                    </div>
                  </td>
                  {/* Clicked */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.clickedAt ? (
                        <div className="p-1 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.06)]" title={new Date(log.clickedAt).toLocaleString()}>
                          <MousePointerClick size={13} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <XCircle size={13} className="text-zinc-700" />
                      )}
                    </div>
                  </td>
                  {/* Submitted */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.submittedAt ? (
                        <div className="p-1 rounded bg-brand-rose/10 border border-brand-rose/20 text-brand-rose shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse" title={new Date(log.submittedAt).toLocaleString()}>
                          <AlertTriangle size={13} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <XCircle size={13} className="text-zinc-700" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-white/[0.005]">
                    No simulation activities matching selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

