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
  Clock
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Audit Logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Logs & Analytics</h1>
          <p className="text-sm text-gray-400">Review granular employee interactions and filter audit logs.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredLogs.length === 0}
          className="flex items-center gap-2 bg-white/5 border border-cyber-border hover:border-brand-cyan/40 hover:bg-brand-cyan/10 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 text-sm font-mono"
        >
          <FileSpreadsheet size={16} className="text-brand-cyan" /> Export CSV
        </button>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-6 rounded-3xl grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Search Employee</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Name or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Campaign Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Campaign filter</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          >
            <option value="ALL">All Campaigns</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Department Filter</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Action Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Interaction State</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
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
      <div className="glass-panel rounded-3xl overflow-hidden border border-cyber-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-border bg-white/3 text-[10px] font-mono uppercase text-gray-400 tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Campaign</th>
                <th className="px-6 py-4 text-center">Delivered</th>
                <th className="px-6 py-4 text-center">Opened</th>
                <th className="px-6 py-4 text-center">Clicked</th>
                <th className="px-6 py-4 text-center">Submitted Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/2 transition">
                  {/* Employee info */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{log.user.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{log.user.email}</p>
                    </div>
                  </td>
                  {/* Department */}
                  <td className="px-6 py-4 text-gray-400 font-mono">{log.user.department || 'General'}</td>
                  {/* Campaign */}
                  <td className="px-6 py-4 font-semibold text-white">{log.campaign.name}</td>
                  {/* Delivered */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.deliveredAt ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Clock size={16} className="text-gray-600" />
                      )}
                    </div>
                  </td>
                  {/* Opened */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.openedAt ? (
                        <MailOpen size={16} className="text-purple-400" />
                      ) : (
                        <Mail size={16} className="text-gray-600" />
                      )}
                    </div>
                  </td>
                  {/* Clicked */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.clickedAt ? (
                        <MousePointerClick size={16} className="text-cyan-400" />
                      ) : (
                        <XCircle size={16} className="text-gray-600" />
                      )}
                    </div>
                  </td>
                  {/* Submitted */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {log.submittedAt ? (
                        <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
                      ) : (
                        <XCircle size={16} className="text-gray-600" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-mono">
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
