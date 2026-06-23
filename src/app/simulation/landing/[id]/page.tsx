'use client';

import React, { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Info,
  Lock,
  ChevronRight,
  Globe,
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
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: 1, type: "sender", label: "Mismatched Domain", text: "Sent from 'acme-secure-portal.com' instead of 'acme.com'" },
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
    <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center p-4 relative font-sans">
      
      {/* Background visual nodes */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-brand-cyan/5 to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* Phase 1: Mock Portal Interface (Simulated Phishing Landing Screen) */}
        {phase === 'MOCK_PORTAL' ? (
          <motion.div
            key="mock-portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white text-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {/* Header branding */}
            <div className="p-8 pb-4 flex flex-col items-center border-b border-gray-100 bg-slate-50">
              <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-3 shadow">
                AC
              </div>
              <h2 className="text-xl font-bold text-gray-800">Acme Access Portal</h2>
              <p className="text-xs text-gray-500 mt-1">Authenticate to review your session credentials.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleMockSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                  <span className="text-[11px] text-slate-600 cursor-pointer hover:underline">Forgot?</span>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm bg-white"
                />
              </div>

              {/* Security info flag */}
              <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-gray-100 text-[11px] text-gray-500 leading-normal">
                <Lock size={14} className="shrink-0 mt-0.5 text-slate-400" />
                <span>Standard single-sign-on protocol. Session will remain valid for 24 hours.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition shadow-lg"
              >
                Sign In
              </button>
            </form>
            
            {/* Direct jump to education feedback */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs">
              <button 
                type="button" 
                onClick={() => setPhase('EDUCATION_PANEL')}
                className="text-brand-cyan hover:underline font-semibold"
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
            className="w-full max-w-4xl bg-slate-950/80 border border-cyber-border backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden grid md:grid-cols-5 gap-8"
          >
            {/* Red alert overlay glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-rose/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Left Side: Notice & Warning */}
            <div className="md:col-span-2 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-rose/10 border border-brand-rose/20 text-brand-rose flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                <ShieldAlert size={32} className="animate-pulse" />
              </div>

              <div className="text-center md:text-left space-y-3">
                <span className="px-3 py-1 rounded-full bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-[10px] font-mono uppercase tracking-widest font-bold">
                  Simulation Intercepted
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  This was a Security Training Exercise
                </h1>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The email you recently interacted with was part of Acme Corporation's authorized security awareness program. 
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-[11px] leading-relaxed text-left flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span><strong>Zero Credentials Stored:</strong> In compliance with security standards, your password was immediately intercepted and discarded before hitting any network databases.</span>
                </div>
              </div>
            </div>

            {/* Right Side: Threat Indicator Analysis */}
            <div className="md:col-span-3 space-y-6 md:border-l md:border-cyber-border/40 md:pl-8">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Eye size={18} className="text-brand-cyan" /> Phishing Cues Decoded
                </h2>
                <p className="text-xs text-gray-400 mt-1">Review the warning indicators that were present in this email format:</p>
              </div>

              {/* Indicators Timeline */}
              <div className="space-y-4">
                {indicators.map((ind, index) => (
                  <div key={ind.id} className="flex gap-4 items-start bg-white/2 border border-cyber-border rounded-2xl p-4">
                    <div className="w-6 h-6 rounded-lg bg-slate-800 border border-cyber-border text-brand-cyan text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider text-glow-cyan">{ind.label}</h4>
                      <p className="text-[11px] text-gray-400 leading-normal">{ind.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps / Actions */}
              <div className="bg-slate-900 border border-cyber-border/80 rounded-2xl p-5 space-y-3 text-xs text-gray-300">
                <span className="font-bold font-mono uppercase tracking-wider text-brand-purple text-[10px]">Actionable Protocols</span>
                <ul className="space-y-2 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-brand-purple shrink-0 mt-0.5" /> Always verify domain extensions before executing link click actions.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-brand-purple shrink-0 mt-0.5" /> Acknowledge coercive deadlines or panic warnings as high threat vectors.</li>
                  <li className="flex items-start gap-1.5"><CornerDownRight size={12} className="text-brand-purple shrink-0 mt-0.5" /> Use Aegis Guard's 'Report Phish' dashboard client rather than replying.</li>
                </ul>
              </div>
            </div>

          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
