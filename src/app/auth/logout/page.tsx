'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft, Info } from 'lucide-react';
import PPLogo from '@/components/layout/PPLogo';

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('EMPLOYEE');

  useEffect(() => {
    // Determine where to return on cancel
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setRole(data.user.role);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (role === 'EMPLOYEE') {
      router.push('/learning');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="flex justify-center mb-1">
          <PPLogo size={40} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Logout Confirmation</h2>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
          Pinkman Protects Secure Audit Node
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl text-center space-y-6 font-mono text-xs"
        >
          <p className="text-gray-400 leading-relaxed text-center">
            Are you sure you want to end your active session and log out of the Pinkman Protects cybersecurity platform? This will clear all active workstation credentials.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] shadow-lg shadow-brand-blue/10 disabled:brightness-50 transition border border-white/5 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <>Confirm Log Out <LogOut size={14} /></>
              )}
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-1.5 transition text-center"
            >
              <ArrowLeft size={14} /> Cancel & Return
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 text-[9px] text-gray-500 flex items-start gap-1 justify-center leading-normal">
            <Info size={11} className="shrink-0 text-brand-cyan" />
            <span>Exiting closes connection tunnels, preventing unauthorized interface modifications.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
