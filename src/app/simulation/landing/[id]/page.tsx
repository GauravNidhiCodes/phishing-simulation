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
    <div className="min-h-screen bg-[#050505] text-[#A8A8A8] flex items-center justify-center p-4 relative font-mono">
      
      <AnimatePresence mode="wait">
        
        {/* Phase 1: Mock Portal Interface (Simulated Phishing Landing Screen) */}
        {phase === 'MOCK_PORTAL' ? (
          <motion.div
            key="mock-portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-[#121212] text-white rounded-xl overflow-hidden border border-[#1F1F1F]"
          >
            {/* Header branding */}
            <div className="p-8 pb-4 flex flex-col items-center border-b border-[#1F1F1F] bg-[#0A0A0A]">
              <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl mb-3 border border-white">
                PP
              </div>
              <h2 className="text-sm font-bold text-white tracking-tight uppercase">Pinkman Protects Access Portal</h2>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase">Authenticate to review your session credentials.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleMockSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#1F1F1F] focus:outline-none focus:border-zinc-700 text-xs bg-black text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                  <span className="text-[9px] text-zinc-500 cursor-pointer hover:underline uppercase">Forgot?</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#1F1F1F] focus:outline-none focus:border-zinc-700 text-xs bg-black text-white font-mono"
                />
              </div>

              {/* Security info flag */}
              <div className="flex items-start gap-2 bg-[#0A0A0A] p-3 rounded-lg border border-[#1F1F1F] text-[10px] text-zinc-500 leading-normal font-mono">
                <Lock size={12} className="shrink-0 mt-0.5 text-white" />
                <span>Standard single-sign-on protocol. Session will remain valid for 24 hours.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition font-mono uppercase tracking-wider cursor-pointer"
              >
                Sign In
              </button>
            </form>
            
            {/* Direct jump to education feedback */}
            <div className="p-4 border-t border-[#1F1F1F] bg-[#0A0A0A] text-center">
              <button 
                type="button" 
                onClick={() => setPhase('EDUCATION_PANEL')}
                className="text-white hover:text-zinc-300 font-bold font-mono uppercase tracking-wider text-[10px] cursor-pointer"
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
            className="w-full max-w-4xl bg-[#121212] border border-[#1F1F1F] rounded-xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden grid md:grid-cols-5 gap-8"
          >
            {/* Left Side: Notice & Warning */}
            <div className="md:col-span-2 space-y-6">
              <div className="w-12 h-12 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-white flex items-center justify-center mx-auto md:mx-0">
                <ShieldAlert size={24} />
              </div>

              <div className="text-center md:text-left space-y-3">
                <span className="px-3 py-1 rounded bg-[#0A0A0A] border border-[#1F1F1F] text-zinc-400 text-[9px] font-mono uppercase tracking-widest font-bold">
                  Simulation Intercepted
                </span>
                <h1 className="text-xl font-bold text-white leading-tight uppercase font-mono tracking-tight">
                  Security Training Exercise
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  The email you recently interacted with was part of Pinkman Protects' authorized security awareness program. 
                </p>
                <div className="bg-[#0A0A0A] border border-[#1F1F1F] text-zinc-400 p-3 rounded-lg text-[10px] leading-relaxed text-left flex items-start gap-2">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#00D26A]" />
                  <span><strong>Zero Credentials Stored:</strong> In compliance with security standards, your password was immediately intercepted and discarded before hitting any network databases.</span>
                </div>
              </div>
            </div>

            {/* Right Side: Threat Indicator Analysis */}
            <div className="md:col-span-3 space-y-6 md:border-l md:border-[#1F1F1F] md:pl-8">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <Eye size={16} /> Phishing Cues Decoded
                </h2>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">Review the warning indicators that were present in this email format:</p>
              </div>

              {/* Indicators Timeline */}
              <div className="space-y-4">
                {indicators.map((ind, index) => (
                  <div key={ind.id} className="flex gap-4 items-start bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-4 font-mono">
                    <div className="w-5 h-5 rounded bg-[#121212] border border-[#1F1F1F] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">{ind.label}</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal font-sans">{ind.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps / Actions */}
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-5 space-y-3 text-[10px] text-zinc-400 font-mono">
                <span className="font-bold uppercase tracking-wider text-white text-[9px]">Actionable Protocols</span>
                <ul className="space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-white shrink-0 mt-0.5" /> Always verify domain extensions before executing link click actions.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-white shrink-0 mt-0.5" /> Acknowledge coercive deadlines or panic warnings as high threat vectors.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-white shrink-0 mt-0.5" /> Use Pinkman Protects' 'Report Phish' dashboard client rather than replying.</li>
                </ul>
              </div>
            </div>

          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
