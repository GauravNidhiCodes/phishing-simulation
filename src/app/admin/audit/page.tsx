'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  MapPin, 
  User, 
  SlidersHorizontal, 
  RefreshCw, 
  Calendar, 
  Download, 
  Globe, 
  Terminal, 
  Cpu, 
  X
} from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('delete') || act.includes('fail')) return 'text-brand-rose border-brand-rose/20 bg-brand-rose/5';
    if (act.includes('create') || act.includes('add')) return 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5';
    if (act.includes('edit') || act.includes('modify') || act.includes('change')) return 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5';
    if (act.includes('login') || act.includes('session')) return 'text-brand-blue border-brand-blue/20 bg-brand-blue/5';
    return 'text-gray-400 border-white/10 bg-white/5';
  };

  const getRoleColor = (role: string) => {
    const r = role.toUpperCase();
    if (r === 'SUPERADMIN') return 'text-brand-cyan border-brand-cyan/35 bg-brand-cyan/10';
    if (r === 'SECURITY_ADMIN') return 'text-brand-blue border-brand-blue/35 bg-brand-blue/10';
    if (r === 'HR_MANAGER') return 'text-brand-purple border-brand-purple/35 bg-brand-purple/10';
    if (r === 'DEPT_MANAGER') return 'text-brand-amber border-brand-amber/35 bg-brand-amber/10';
    return 'text-gray-500 border-white/5 bg-white/3';
  };

  // Filter logs logic
  const filteredLogs = logs.filter(log => {
    const matchSearch = 
      log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress?.includes(searchTerm);

    const matchBranch = selectedBranch === 'ALL' || log.branch === selectedBranch;
    const matchRole = selectedRole === 'ALL' || log.role === selectedRole;
    
    // Action category grouping filters
    let matchAction = true;
    if (selectedAction !== 'ALL') {
      const act = log.action.toLowerCase();
      const sel = selectedAction.toLowerCase();
      if (sel === 'campaign') matchAction = act.includes('campaign');
      else if (sel === 'employee') matchAction = act.includes('employee');
      else if (sel === 'template') matchAction = act.includes('template');
      else if (sel === 'settings') matchAction = act.includes('settings') || act.includes('password') || act.includes('org_switch');
      else if (sel === 'auth') matchAction = act.includes('login') || act.includes('logout');
      else if (sel === 'reports') matchAction = act.includes('report');
    }

    return matchSearch && matchBranch && matchRole && matchAction;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp (IST)', 'User', 'Email', 'Role', 'Branch', 'Action', 'IP Address', 'Browser/Client', 'Details'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const formattedTime = new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(/,/g, '');
      const values = [
        formattedTime,
        log.name,
        log.email,
        log.role,
        log.branch,
        log.action,
        log.ipAddress,
        log.browser.replace(/,/g, ' '),
        log.details.replace(/,/g, ' ')
      ];
      csvRows.push(values.map(val => `"${val}"`).join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('ALL');
    setSelectedRole('ALL');
    setSelectedAction('ALL');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/40 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-brand-cyan animate-pulse" size={28} />
            Enterprise Audit Management Logs
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-wider">
            Monitor real-time system executions, security event lifecycles, and configuration modifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-xl border border-cyber-border bg-white/3 text-gray-400 hover:text-white hover:bg-white/5 transition"
            title="Refresh Logs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest text-white font-bold bg-white/5 hover:bg-white/10 border border-cyber-border transition flex items-center gap-2"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Controls Panel */}
      <div className="glass-panel p-5 rounded-2.5xl border border-white/[0.04] bg-white/[0.01] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-gray-400 tracking-wider">
          <SlidersHorizontal size={14} className="text-brand-cyan" />
          Filter Engine
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by keyword..."
              className="w-full glass-input pl-9 pr-4 py-2 rounded-xl text-xs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Branch Dropdown */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs appearance-none bg-zinc-950 text-white font-mono"
          >
            <option value="ALL">ALL BRANCHES (INDIA)</option>
            {['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata'].map(branch => (
              <option key={branch} value={branch}>{branch.toUpperCase()}</option>
            ))}
          </select>

          {/* Role Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs appearance-none bg-zinc-950 text-white font-mono"
          >
            <option value="ALL">ALL ROLES</option>
            {['SUPERADMIN', 'SECURITY_ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'EMPLOYEE'].map(role => (
              <option key={role} value={role}>{role.replace('_', ' ')}</option>
            ))}
          </select>

          {/* Action category */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs appearance-none bg-zinc-950 text-white font-mono"
          >
            <option value="ALL">ALL SYSTEM ACTIONS</option>
            <option value="AUTH">AUTHENTICATION (LOGINS/LOGOUTS)</option>
            <option value="CAMPAIGN">CAMPAIGN OPERATIONS</option>
            <option value="TEMPLATE">TEMPLATE CREATION & MODS</option>
            <option value="EMPLOYEE">EMPLOYEE REGISTRY MODS</option>
            <option value="SETTINGS">SETTINGS & POLICY SWITCHES</option>
            <option value="REPORTS">REPORTS DISPATCHES</option>
          </select>
        </div>

        {/* Filters summary / Reset button */}
        {(searchTerm || selectedBranch !== 'ALL' || selectedRole !== 'ALL' || selectedAction !== 'ALL') && (
          <div className="flex items-center justify-between border-t border-cyber-border/40 pt-3 text-[10px] font-mono text-gray-500">
            <div>
              Active filters showing <span className="text-white font-bold">{filteredLogs.length}</span> matching entries.
            </div>
            <button 
              onClick={handleResetFilters}
              className="text-brand-cyan hover:underline flex items-center gap-1"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Logs Table Container */}
      <div className="glass-panel rounded-3xl border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <RefreshCw className="text-brand-cyan animate-spin" size={24} />
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Gathering activity audit tracks...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
              <ShieldAlert className="text-gray-600" size={32} />
              <h3 className="text-xs font-bold text-white uppercase font-mono">No Audit Logs Found</h3>
              <p className="text-[10px] text-gray-500 max-w-sm">No matching records match your filter coordinates. Reset filters and retry.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-cyber-border/60 text-[9px] font-mono uppercase tracking-widest text-gray-500 bg-black/40">
                  <th className="py-4 px-6">TIMESTAMP (IST)</th>
                  <th className="py-4 px-6">OPERATIONAL USER</th>
                  <th className="py-4 px-6">ROLE</th>
                  <th className="py-4 px-6">BRANCH</th>
                  <th className="py-4 px-6">ACTION / SYSTEM EVENT</th>
                  <th className="py-4 px-6">IP & CLIENT CLIENT</th>
                  <th className="py-4 px-6">DETAILS SUMMARY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/30 text-xs text-gray-300">
                <AnimatePresence>
                  {filteredLogs.map((log, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02, duration: 0.2 }}
                      key={log.id} 
                      className="hover:bg-white/2 transition-colors duration-150"
                    >
                      {/* Timestamp */}
                      <td className="py-4 px-6 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={10} className="text-brand-cyan shrink-0" />
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 font-mono">
                            {log.name ? log.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'US'}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-tight">{log.name || 'Anonymous User'}</p>
                            <span className="text-[9px] text-gray-500 font-mono">{log.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono border ${getRoleColor(log.role)}`}>
                          {log.role}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="py-4 px-6 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-brand-cyan shrink-0" />
                          {log.branch || 'Pune'}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono border uppercase tracking-wider font-bold ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* IP & Browser */}
                      <td className="py-4 px-6 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Terminal size={10} className="text-brand-cyan shrink-0" />
                            {log.ipAddress}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-gray-600 truncate max-w-[140px]" title={log.browser}>
                            <Cpu size={10} />
                            {log.browser}
                          </div>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-6 text-[11px] text-gray-400 min-w-[200px] leading-relaxed">
                        {log.details}
                      </td>

                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info counter */}
        {!loading && filteredLogs.length > 0 && (
          <div className="p-4 bg-black/40 border-t border-cyber-border/40 text-[9px] font-mono text-gray-500 uppercase tracking-widest text-right">
            System holds {filteredLogs.length} matching execution logs.
          </div>
        )}
      </div>

    </div>
  );
}
