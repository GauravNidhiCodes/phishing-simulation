'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Info,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import PPLogo from '@/components/layout/PPLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      const data = await res.json();
      const user = data.user;

      // Role Based Redirect: Employees go to /learning, Admins go to /admin/dashboard
      if (user.role === 'EMPLOYEE') {
        router.push('/learning');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      {/* Decorative Radial mesh backings */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-purple/3 rounded-full blur-3xl pointer-events-none" />
 
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="flex justify-center">
          <PPLogo size={44} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          Pinkman Protects
        </h2>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
          Enterprise Security Awareness & Simulation
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl relative"
        >
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 text-xs font-mono">
            {/* Error alerts */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/10 flex items-start gap-2.5 text-brand-rose">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@company.in"
                className="w-full p-3 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-gray-500 uppercase font-bold flex items-center gap-1">
                  <Lock size={12} /> Password
                </label>
                <Link href="/auth/forgot-password" className="text-[10px] text-brand-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 pr-10 rounded-xl glass-input placeholder-gray-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-brand-cyan focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] shadow-lg shadow-brand-blue/10 disabled:brightness-50 transition border border-white/5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Workspace <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Guidelines notes */}
          <div className="mt-6 pt-5 border-t border-white/5 text-[10px] font-mono text-gray-500 leading-relaxed space-y-2">
            <div className="flex items-start gap-1">
              <Info size={12} className="shrink-0 mt-0.5 text-brand-cyan" />
              <p>This is a protected security compliance node. Actions are logged and subject to audit.</p>
            </div>
            
            {/* Quick credentials helper for testers */}
            <div className="bg-white/2 p-2.5 rounded-xl border border-white/5 space-y-1">
              <div className="font-bold text-white uppercase text-[8px] tracking-wider">Test Credentials (Indian Domains):</div>
              <ul className="list-disc list-inside text-[8px] space-y-0.5 text-gray-400">
                <li>Superadmin: <span className="text-brand-blue font-bold">superadmin@company.in</span> / <span className="text-brand-purple">Superadmin123!</span></li>
                <li>IT Sec Admin: <span className="text-brand-blue font-bold">admin@company.in</span> / <span className="text-brand-purple">Admin123!</span></li>
                <li>HR Manager: <span className="text-brand-blue font-bold">hr@company.in</span> / <span className="text-brand-purple">HrManager123!</span></li>
                <li>Employee: <span className="text-brand-blue font-bold">rahul@company.in</span> / <span className="text-brand-purple">password123</span></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
