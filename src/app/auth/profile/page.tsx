'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Building, 
  MapPin, 
  Shield, 
  Clock, 
  ChevronRight, 
  Key, 
  LogOut, 
  ArrowLeft,
  CheckCircle2,
  Info,
  Check,
  X,
  Database
} from 'lucide-react';
import Link from 'next/link';

interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
  orgName: string;
  branch: string;
  department: string;
  managerName: string;
  joiningDate: string;
  lastLogin: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  eventType: string;
  email: string;
  ipAddress: string;
  details: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Switch Org States
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const orgs = [
    'Pinkman Technologies Pvt. Ltd.',
    'ABC Manufacturing India',
    'XYZ Financial Services',
    'TechNova Solutions'
  ];

  const fetchSession = () => {
    fetch('/api/auth/session')
      .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then(data => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/auth/login');
      });
  };

  const fetchAuditLogs = () => {
    fetch('/api/auth/audit-logs')
      .then(res => res.json())
      .then(data => {
        setAuditLogs(data.slice(0, 10)); // Top 10 logs
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSession();
    fetchAuditLogs();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchOrg = async (orgName: string) => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'switchOrg',
          targetOrgName: orgName
        })
      });

      if (res.ok) {
        setOrgDropdownOpen(false);
        fetchSession();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    setPwdLoading(true);

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      setPwdLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'changePassword',
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.error || 'Password update failed');
      } else {
        setPwdSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchAuditLogs();
      }
    } catch (err: any) {
      setPwdError(err.message || 'Server error');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-cyber-dark">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">Decrypting Profile...</span>
      </div>
    );
  }

  // Strong password check
  const isMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword && newPassword === confirmPassword;
  const isValidPassword = isMinLength && hasUpperCase && hasDigit && hasSpecial && isMatch;

  return (
    <div className="min-h-screen bg-cyber-dark py-8 px-4 sm:px-6 lg:px-8 font-mono text-xs text-gray-400">
      
      {/* Header toolbar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-8">
        <button
          onClick={() => {
            if (user.role === 'EMPLOYEE') {
              router.push('/learning');
            } else {
              router.push('/admin/dashboard');
            }
          }}
          className="inline-flex items-center gap-1 text-gray-500 hover:text-white transition"
        >
          <ArrowLeft size={13} /> Return to Workspace
        </button>

        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
          Pinkman Protects Identity
        </span>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - User Profile info & Org switcher */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Profile Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/3 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-cyan to-brand-purple p-0.5 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-[14px] bg-black/60 flex items-center justify-center text-white text-xl font-bold font-mono">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white leading-tight">{user.name}</h2>
                <p className="text-gray-500 text-[10px]">{user.email}</p>
                <span className="inline-block px-2.5 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-bold text-[9px] uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Profile fields grid */}
            <div className="grid sm:grid-cols-2 gap-4 border-t border-white/5 pt-6 text-[10px]">
              <div className="space-y-1">
                <div className="text-gray-500 uppercase font-bold flex items-center gap-1"><Building size={10} /> Division</div>
                <div className="text-white font-semibold">{user.department}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500 uppercase font-bold flex items-center gap-1"><MapPin size={10} /> Location</div>
                <div className="text-white font-semibold">{user.branch} Office</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500 uppercase font-bold flex items-center gap-1"><User size={10} /> Report Manager</div>
                <div className="text-white font-semibold">{user.managerName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500 uppercase font-bold flex items-center gap-1"><Clock size={10} /> Last Authentication</div>
                <div className="text-white font-semibold">{new Date(user.lastLogin).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}</div>
              </div>
            </div>
          </div>

          {/* Organization Switcher */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Building size={13} /> Active Organization Switcher
            </h3>
            
            <p className="text-[10px] leading-relaxed text-gray-500">
              Switching organization shifts your simulated tenant scope. Useful for super admins testing compliance metrics.
            </p>

            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="w-full text-left p-3 rounded-xl bg-white/2 border border-white/5 text-white flex justify-between items-center transition hover:bg-white/5"
              >
                <span>{user.orgName}</span>
                <ChevronRight size={14} className={`transform transition-transform ${orgDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {orgDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute z-20 top-full mt-2 w-full glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                  >
                    {orgs.map(orgOption => (
                      <button
                        key={orgOption}
                        onClick={() => handleSwitchOrg(orgOption)}
                        className={`w-full text-left p-3 text-xs transition border-b border-white/3 last:border-none ${
                          user.orgName === orgOption 
                            ? 'bg-brand-purple/10 text-white font-bold' 
                            : 'text-gray-400 hover:text-white hover:bg-white/3'
                        }`}
                      >
                        {orgOption}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Audit Logs list */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Database size={13} /> Identity Security Audit logs
            </h3>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col justify-between gap-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded font-bold text-[8px] uppercase tracking-wider ${
                      log.eventType.includes('SUCCESS') ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20' : 
                      log.eventType.includes('FAILURE') ? 'bg-brand-rose/10 text-brand-rose border border-brand-rose/20' : 
                      'bg-white/5 text-gray-400 border border-white/10'
                    }`}>
                      {log.eventType}
                    </span>
                    <span className="text-gray-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}
                    </span>
                  </div>
                  <p className="text-white/80">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Change Password */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Key size={13} /> Change Account Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              
              {/* Alert status */}
              {pwdError && (
                <div className="p-3 rounded-xl bg-brand-rose/5 border border-brand-rose/10 text-brand-rose">
                  {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="p-3 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 text-brand-emerald flex items-center gap-1">
                  <CheckCircle2 size={13} /> {pwdSuccess}
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-gray-500 uppercase font-bold flex items-center gap-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
                />
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-gray-500 uppercase font-bold flex items-center gap-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8, Upper, Digit, Symbol"
                  className="w-full p-2.5 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-gray-500 uppercase font-bold flex items-center gap-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-2.5 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
                />
              </div>

              {/* Password strength checklist */}
              <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-1 text-[9px] text-gray-500">
                <div className="flex items-center gap-1">
                  {isMinLength ? <Check size={10} className="text-brand-emerald" /> : <X size={10} className="text-brand-rose" />}
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasUpperCase ? <Check size={10} className="text-brand-emerald" /> : <X size={10} className="text-brand-rose" />}
                  <span>At least one UPPERCASE letter</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasDigit ? <Check size={10} className="text-brand-emerald" /> : <X size={10} className="text-brand-rose" />}
                  <span>At least one number (0-9)</span>
                </div>
                <div className="flex items-center gap-1">
                  {hasSpecial ? <Check size={10} className="text-brand-emerald" /> : <X size={10} className="text-brand-rose" />}
                  <span>At least one special character (!@#$)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={pwdLoading || !isValidPassword}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold hover:brightness-110 disabled:brightness-50 transition"
              >
                {pwdLoading ? 'Updating credentials...' : 'Update Account Password'}
              </button>

            </form>
          </div>

          {/* Logout Action */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center space-y-3">
            <p className="text-[10px] text-gray-500">
              Exit this workstation session. This clears all active cookie authentication payloads.
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-brand-rose/20 border border-brand-rose/40 hover:bg-brand-rose/30 text-brand-rose font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut size={13} /> Exit Connection Session
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
