'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Zap, 
  Check, 
  AlertTriangle,
  Mail,
  Eye,
  TrendingUp,
  Award,
  Info,
  Terminal,
  Server
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';
import { TopoBackground } from '@/components/ui/TopoBackground';

interface EmailTemplate {
  id: string;
  sender: string;
  subject: string;
  body: string;
  clues: Array<{ target: string; explanation: string }>;
}

export default function Home() {
  const [activeEmailIdx, setActiveEmailIdx] = useState(0);
  const [revealedClues, setRevealedClues] = useState<Record<number, boolean>>({});
  const [reported, setReported] = useState(false);

  const [staffSize, setStaffSize] = useState(150);
  const [clickEstimate, setClickEstimate] = useState(12);

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'benefits',
      sender: 'hr-updates@acme-benefits-hub.com',
      subject: 'Urgent: Review Your Q3 Benefits Deductions update',
      body: 'Hi there, due to adjustments in our company healthcare policy, your monthly payroll deduction is changing starting next week. Please log in to the benefits worksheet spreadsheet below to review your new billing deductions. Failure to submit verification by Friday will lock in the defaults.',
      clues: [
        { target: 'acme-benefits-hub.com', explanation: 'Look-alike domain. Acme HR emails always come from "@acme.com", never "@acme-benefits-hub.com".' },
        { target: 'Hi there', explanation: 'Generic greeting. Valid internal communications should address you directly by your name.' },
        { target: 'spreadsheet below', explanation: 'Unexpected file attachment links. HR links usually point to the secure Workday portal.' },
        { target: 'lock in the defaults', explanation: 'Artificial urgency. Threat actors use fear and tight deadlines to prevent you from checking facts.' }
      ]
    },
    {
      id: 'slack',
      sender: 'notification@slack-chat-verification.net',
      subject: 'Security Alert: New device login detected',
      body: 'We detected a login to your Slack workspace from a mobile browser in Moscow, RU. If this was not you, please verify your account configuration instantly by clicking the login audit dashboard below.',
      clues: [
        { target: 'slack-chat-verification.net', explanation: 'Spoofed service domain. Slack notifications always originate from "@slack.com".' },
        { target: 'Moscow, RU', explanation: 'Sensational location. Panic triggers are designed to induce immediate click actions without inspection.' },
        { target: 'login audit dashboard', explanation: 'External login page. SSO accounts are handled via the corporate login gates.' }
      ]
    }
  ];

  const currentEmail = emailTemplates[activeEmailIdx];

  const handleRevealClue = (idx: number) => {
    setRevealedClues({
      ...revealedClues,
      [idx]: !revealedClues[idx]
    });
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => setReported(false), 3000);
  };

  const estimatedClicks = Math.round(staffSize * (clickEstimate / 100));
  const estimatedCost = estimatedClicks * 4500;

  const pricingPlans = [
    {
      name: 'Starter Guard',
      price: '$49',
      desc: 'Designed for small operations starting security awareness.',
      features: ['Up to 50 employees', '2 domain verification keys', 'Standard prebuilt template catalog', 'Monthly email analytics', 'Basic learning modules'],
      accent: 'border-cyber-border hover:border-brand-blue/30'
    },
    {
      name: 'Shield Pro',
      price: '$189',
      desc: 'Recommended for mid-sized corporate entities checking compliance.',
      features: ['Up to 500 employees', 'Unlimited domain auth keys', 'Full template editor with custom cues', 'Real-time funnel analytics & CSV export', 'Adaptive quiz scoring controls'],
      accent: 'border-brand-cyan/40 bg-brand-cyan/2 shadow-[0_0_20px_rgba(6,182,212,0.05)] hover:border-brand-cyan/60'
    },
    {
      name: 'Aegis Enterprise',
      price: 'Custom',
      desc: 'High-end cyber solutions for absolute compliance and custom integrations.',
      features: ['Unlimited seats', 'Designated secure mail gateway SMTP', 'Interactive API and webhooks', 'Monthly threat intelligence reports', 'Custom security certifications'],
      accent: 'border-cyber-border hover:border-brand-purple/30'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* ASCII Topography Background */}
      <TopoBackground />

      {/* Floating Centered Pill Navbar */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="inline-flex items-center bg-black/70 border border-cyber-border rounded-full px-5 py-2.5 backdrop-blur-xl shadow-2xl gap-8"
        >
          {/* Logo capsule link */}
          <Link href="/" className="flex items-center gap-2 pr-6 border-r border-cyber-border/40 shrink-0">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-black text-xs font-mono">
              Φ
            </div>
            <span className="font-extrabold text-white text-xs tracking-wider">PhishDeck</span>
          </Link>
          
          {/* Middle links */}
          <nav className="hidden sm:flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            <a href="#approach" className="hover:text-white transition">Approach</a>
            <a href="#simulator" className="hover:text-white transition">Simulator</a>
            <a href="#calculator" className="hover:text-white transition">Calculator</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          {/* Action trigger button */}
          <Link 
            href="/admin/dashboard" 
            className="px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase hover:bg-gray-200 transition shrink-0"
          >
            Sign In
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6 z-10 relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mx-auto font-sans"
        >
          Assess. Train. Secure.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
        >
          PhishDeck deploys authorized, consent-based simulation campaigns that measure vulnerability and build long-term defense habits without capturing real credentials.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          {/* White capsule action */}
          <Link 
            href="/admin/dashboard" 
            className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-wider hover:bg-gray-200 transition flex items-center gap-1.5 shadow-xl"
          >
            Enter Sandbox Portal <ArrowRight size={12} />
          </Link>
          <a 
            href="#simulator" 
            className="px-6 py-3 rounded-full bg-white/5 border border-cyber-border hover:bg-white/10 text-gray-300 hover:text-white font-extrabold text-[11px] uppercase tracking-wider transition"
          >
            Explore features
          </a>
        </motion.div>
      </section>

      {/* Simulator Sandbox */}
      <section id="simulator" className="px-6 pb-24 max-w-5xl mx-auto relative z-10">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Can your team spot the phishing cues?</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">Interactive sandbox. Click on highlighted text below to reveal security indicators.</p>
        </div>

        <div className="glass-panel rounded-3xl border border-cyber-border overflow-hidden grid md:grid-cols-3 min-h-[480px]">
          {/* Inbox side folders */}
          <div className="border-r border-cyber-border/40 p-4 space-y-4 bg-black/20">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block px-2">Inbox Preview List</span>
            <div className="space-y-2">
              {emailTemplates.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveEmailIdx(idx);
                    setRevealedClues({});
                  }}
                  className={`w-full text-left p-3.5 rounded-xl transition flex gap-3 ${
                    activeEmailIdx === idx 
                      ? 'bg-white/10 border border-cyber-border text-white' 
                      : 'hover:bg-white/3 text-gray-400 border border-transparent'
                  }`}
                >
                  <Mail size={16} className="shrink-0 mt-0.5" />
                  <div className="truncate text-xs">
                    <p className="font-semibold text-white truncate">{t.sender.split('@')[0]}</p>
                    <p className="truncate text-gray-400 mt-0.5">{t.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Email View Frame */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white text-gray-900 relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50 text-xs space-y-1.5">
              <div><strong className="text-gray-400">From:</strong> <span className="font-mono text-gray-700 bg-gray-200/50 px-1.5 py-0.5 rounded">{currentEmail.sender}</span></div>
              <div><strong className="text-gray-400">Subject:</strong> <span className="font-semibold text-gray-800">{currentEmail.subject}</span></div>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-[250px]">
              <div className="text-xs text-gray-700 leading-relaxed font-sans space-y-4">
                <p>
                  {currentEmail.body.split(' ').map((word, wordIdx) => {
                    const matchingClueIdx = currentEmail.clues.findIndex(c => c.target.includes(word.replace(/[^a-zA-Z0-9.-]/g, '')));
                    
                    if (matchingClueIdx !== -1) {
                      const isRevealed = revealedClues[matchingClueIdx];
                      return (
                        <span key={wordIdx} className="relative inline-block mx-0.5">
                          <button
                            type="button"
                            onClick={() => handleRevealClue(matchingClueIdx)}
                            className={`px-1.5 py-0.5 rounded font-semibold transition cursor-pointer select-none ${
                              isRevealed 
                                ? 'bg-amber-100 border border-amber-300 text-amber-900' 
                                : 'bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue underline decoration-dotted'
                            }`}
                          >
                            {word}
                          </button>
                          {isRevealed && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg bg-slate-900 text-white text-[10px] leading-normal border border-cyber-border shadow-xl z-50">
                              <span className="font-bold font-mono text-amber-400 block mb-1">CUE REVEALED:</span>
                              {currentEmail.clues[matchingClueIdx].explanation}
                            </div>
                          )}
                        </span>
                      );
                    }
                    return <span key={wordIdx} className="mx-0.5">{word}</span>;
                  })}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Click highlighted blue cues to audit.</span>
              <button
                type="button"
                onClick={handleReport}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition ${
                  reported 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-800 hover:bg-slate-950 text-white'
                }`}
              >
                {reported ? '✓ Reported Successfully!' : 'Report Phishing attempt'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Calculator */}
      <section id="calculator" className="px-6 pb-24 max-w-5xl mx-auto relative z-10 border-t border-cyber-border/20 pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Evaluate your <br/>Risk Surface Cost
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cybersecurity breaches targeting human networks average $4,500 per successful phish response. Estimate your company's risk exposure rate.
            </p>

            <div className="space-y-6 font-mono">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Roster Staff Count</span>
                  <span className="text-white font-bold">{staffSize} seats</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  value={staffSize}
                  onChange={(e) => setStaffSize(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Estimated Click Rate</span>
                  <span className="text-white font-bold">{clickEstimate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={clickEstimate}
                  onChange={(e) => setClickEstimate(Number(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-6 relative overflow-hidden border border-cyber-border bg-gradient-to-br from-brand-blue/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Estimated Successful Phish Responses</span>
              <p className="text-4xl font-extrabold text-white font-mono">{estimatedClicks} <span className="text-xs text-gray-400 font-normal">clicks / campaign</span></p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Estimated Annual Breach Exposure Cost</span>
              <p className="text-4xl font-extrabold text-rose-400 font-mono">${estimatedCost.toLocaleString()} <span className="text-xs text-gray-500 font-normal">USD</span></p>
            </div>

            <div className="border-t border-cyber-border/40 pt-4 text-[10px] text-gray-500 leading-normal flex gap-2">
              <Info size={14} className="text-brand-blue shrink-0 mt-0.5" />
              <span>Implementing PhishDeck's interactive training averages reduction of click rate below 3% inside 90 days.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 pb-24 max-w-5xl mx-auto relative z-10 border-t border-cyber-border/20 pt-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Transparent Pricing</h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">Select the plan that fits your employee size.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map(plan => (
            <div key={plan.name} className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-cyber-border">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                  <span className="text-2xl font-extrabold text-white font-mono mt-1 block">{plan.price}</span>
                </div>
                <p className="text-[11px] text-gray-400 min-h-[40px]">{plan.desc}</p>
                <div className="h-px bg-cyber-border/40" />
                <ul className="space-y-2 text-[10px] text-gray-500 font-mono">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check size={12} className="text-brand-blue" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-xl bg-white/5 border border-cyber-border hover:border-brand-blue text-xs font-mono font-semibold transition">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24 max-w-4xl mx-auto relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-transparent text-center relative overflow-hidden flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Start training your employees before hackers do.</h2>
          <p className="text-xs text-gray-400 max-w-md">Verify your domain authority in seconds and begin authorized training cycles today.</p>
          <Link href="/admin/dashboard" className="bg-brand-blue hover:bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl transition text-xs font-mono">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border/40 bg-black/40 py-10 px-6 text-center text-[10px] font-mono text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 PhishDeck Platforms Inc.</span>
          <div className="flex gap-4">
            <span>Ethical Boundary</span>
            <span>/</span>
            <span>Compliance Checkpoints</span>
            <span>/</span>
            <span>SSO Integrations</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
