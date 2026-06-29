'use client';

import React, { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  Lock,
  CornerDownRight
} from 'lucide-react';

interface Indicator {
  id: number;
  type: string;
  label: string;
  text: string;
}

export default function SimulationLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Phase state: 'MOCK_PORTAL' | 'EDUCATION_PANEL'
  const [phase, setPhase] = useState<'MOCK_PORTAL' | 'EDUCATION_PANEL'>('MOCK_PORTAL');
  
  // Simulated form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Template indicators
  const [indicators] = useState<Indicator[]>([
    { id: 1, type: "sender", label: "Mismatched Domain", text: "Sent from 'pinkman-secure-portal.com' instead of 'pinkman.com'" },
    { id: 2, type: "urgency", label: "Artificial Urgency", text: "Contains coercive statements ('within 24 hours', 'automatic lockout') to induce panic" },
    { id: 3, type: "link", label: "Deceptive Link Destination", text: "Link redirects to an external simulation server rather than internal SSO portal" }
  ]);

  // Log the initial click on mount
  useEffect(() => {
    if (id) {
      fetch('/api/simulation/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId: id })
      }).catch(err => console.error("Failed to log simulation click:", err));
    }
  }, [id]);

  // Trigger submission alert without saving any passwords
  const handleMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track submit event
    if (id) {
      await fetch('/api/simulation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId: id })
      }).catch(err => console.error("Failed to log simulation submission:", err));
    }

    setPhase('EDUCATION_PANEL');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#A8A8A8] flex items-center justify-center p-4 relative font-sans">
      
      {/* Background visual nodes */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* Phase 1: Mock Portal Interface (Simulated Phishing Landing Screen) */}
        {phase === 'MOCK_PORTAL' ? (
          <motion.div
            key="mock-portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#141414] text-white rounded-2xl shadow-2xl overflow-hidden border border-[#232323]"
          >
            {/* Header branding */}
            <div className="p-8 pb-4 flex flex-col items-center border-b border-[#232323] bg-[#181818]">
              <div className="w-12 h-12 bg-green-950/20 text-[#00FF88] rounded-xl flex items-center justify-center font-bold text-xl mb-3 shadow border border-[#00FF88]/30">
                PP
              </div>
              <h2 className="text-xl font-bold text-white">Pinkman Protects Access Portal</h2>
              <p className="text-xs text-[#A8A8A8] mt-1">Authenticate to review your session credentials.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleMockSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#A8A8A8] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#232323] focus:outline-none focus:ring-2 focus:ring-[#00FF88] focus:border-transparent text-sm bg-[#181818] text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-[#A8A8A8] uppercase tracking-wider">Password</label>
                  <span className="text-[11px] text-[#A8A8A8] cursor-pointer hover:underline">Forgot?</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#232323] focus:outline-none focus:ring-2 focus:ring-[#00FF88] focus:border-transparent text-sm bg-[#181818] text-white font-mono"
                />
              </div>

              {/* Security info flag */}
              <div className="flex items-start gap-2 bg-[#181818] p-3 rounded-lg border border-[#232323] text-[11px] text-[#A8A8A8] leading-normal font-mono">
                <Lock size={14} className="shrink-0 mt-0.5 text-[#00FF88]" />
                <span>Standard single-sign-on protocol. Session will remain valid for 24 hours.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#00FF88] hover:bg-[#00D26A] text-black font-bold text-sm transition shadow-lg font-mono uppercase tracking-wider"
              >
                Sign In
              </button>
            </form>
            
            {/* Direct jump to education feedback */}
            <div className="p-4 border-t border-[#232323] bg-[#181818] text-center text-xs">
              <button 
                type="button" 
                onClick={() => setPhase('EDUCATION_PANEL')}
                className="text-[#00FF88] hover:underline font-semibold"
              >
                Skip simulation & view training analysis
              </button>
            </div>
          </motion.div>
        ) : (
          /* Phase 2: Educational Warning & Training Screen (The moment they interact) */
          <motion.div
            key="education-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-[#141414]/95 border border-[#232323] backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden grid md:grid-cols-5 gap-8"
          >
            {/* Red alert overlay glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Left Side: Notice & Warning */}
            <div className="md:col-span-2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                <ShieldAlert size={32} className="animate-pulse" />
              </div>

              <div className="text-center md:text-left space-y-3">
                <span className="px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 text-[#00FF88] text-[10px] font-mono uppercase tracking-widest font-bold">
                  Simulation Intercepted
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight uppercase font-mono">
                  Security Training Exercise
                </h1>
                <p className="text-xs text-[#A8A8A8] leading-relaxed">
                  The email you recently interacted with was part of Pinkman Protects' authorized security awareness program. 
                </p>
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-[11px] leading-relaxed text-left flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span><strong>Zero Credentials Stored:</strong> In compliance with security standards, your password was immediately intercepted and discarded before hitting any network databases.</span>
                </div>
              </div>
            </div>

            {/* Right Side: Threat Indicator Analysis */}
            <div className="md:col-span-3 space-y-6 md:border-l md:border-[#232323]/40 md:pl-8">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye size={18} className="text-[#00FF88]" /> Phishing Cues Decoded
                </h2>
                <p className="text-xs text-[#A8A8A8] mt-1">Review the warning indicators that were present in this email format:</p>
              </div>

              {/* Indicators Timeline */}
              <div className="space-y-4">
                {indicators.map((ind, index) => (
                  <div key={ind.id} className="flex gap-4 items-start bg-white/5 border border-[#232323] rounded-2xl p-4">
                    <div className="w-6 h-6 rounded-lg bg-green-950/20 border border-[#232323] text-[#00FF88] text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">{ind.label}</h4>
                      <p className="text-[11px] text-[#A8A8A8] leading-normal">{ind.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps / Actions */}
              <div className="bg-[#0B0B0B] border border-[#232323] rounded-2xl p-5 space-y-3 text-xs text-gray-300">
                <span className="font-bold font-mono uppercase tracking-wider text-[#00FF88] text-[10px]">Actionable Protocols</span>
                <ul className="space-y-2 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-[#00FF88] shrink-0 mt-0.5" /> Always verify domain extensions before executing link click actions.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-[#00FF88] shrink-0 mt-0.5" /> Acknowledge coercive deadlines or panic warnings as high threat vectors.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-[#00FF88] shrink-0 mt-0.5" /> Use Pinkman Protects' 'Report Phish' dashboard client rather than replying.</li>
                </ul>
              </div>
            </div>

          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
