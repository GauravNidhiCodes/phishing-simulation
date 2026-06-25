'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertOctagon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cyber-dark select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-rose/10 border border-brand-rose/25 text-brand-rose p-0.5 mb-2">
          <AlertOctagon size={24} className="animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase text-brand-rose">Access Denied (403)</h2>
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold block">
          Pinkman Protects Security Protocols
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-white/5 shadow-2xl text-center space-y-6 font-mono text-xs"
        >
          <div className="space-y-3 leading-relaxed text-left text-gray-400">
            <p>
              Your active account role does not have authorization to view this resource. 
            </p>
            <div className="bg-white/2 p-3.5 rounded-2xl border border-white/5 space-y-2">
              <div className="font-bold text-white uppercase text-[8px] tracking-wider text-brand-rose">Authorized Role Mapping:</div>
              <ul className="list-disc list-inside text-[10px] space-y-1">
                <li>Super Admin: Full platform & org access</li>
                <li>Security Admin: Campaigns, Templates, Modules</li>
                <li>HR Manager: Employees registry & reports</li>
                <li>Dept Manager: Team metrics & reports</li>
                <li>Employee: Personal dashboard & learning center</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <button
              onClick={() => window.history.back()}
              className="w-full py-3 rounded-xl bg-brand-rose text-white font-semibold flex items-center justify-center gap-1.5 hover:brightness-110 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] shadow-lg shadow-brand-rose/10 transition border border-white/5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Return to Previous Page
            </button>
            <Link
              href="/auth/login"
              className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold flex items-center justify-center gap-1.5 transition text-center"
            >
              Sign In with Different Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
