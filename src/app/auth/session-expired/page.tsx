'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-rose/10 border border-brand-rose/25 text-brand-rose p-0.5 mb-2">
          <Clock size={24} className="animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Session Expired</h2>
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
            Your connection session to the Pinkman simulation environment has timed out due to 15 minutes of user inactivity. Please authenticate again to resume operations.
          </p>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-lg shadow-brand-purple/10 transition"
          >
            Authenticate Session <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
