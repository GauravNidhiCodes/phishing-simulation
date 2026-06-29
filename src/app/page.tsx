'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Lock, 
  Zap, 
  Check, 
  Target, 
  Terminal,
  Activity,
  Award
} from 'lucide-react';
import { TopoBackground } from '@/components/ui/TopoBackground';
import PPLogo from '@/components/layout/PPLogo';

export default function Home() {
  const features = [
    {
      title: 'CONSENT-VERIFIED ROUTING',
      desc: 'Automatic DNS loop check ensures simulations only launch against verified corporate domains.',
      icon: <Target className="text-[#00FF88]" size={16} />
    },
    {
      title: 'ETHICAL INTERCEPT FILTER',
      desc: 'Form fields process clicks and interactions but discard credentials locally in the browser.',
      icon: <Lock className="text-[#00FF88]" size={16} />
    },
    {
      title: 'ADAPTIVE COMPLIANCE TRAILS',
      desc: 'Poor campaign behaviors trigger instant indicators and custom quiz tracks.',
      icon: <Zap className="text-[#00FF88]" size={16} />
    }
  ];

  const stats = [
    { metric: '3.2%', label: 'FAILURE POSTURE', sub: 'Average click rate decreased from 12.8% globally.' },
    { metric: '94%', label: 'COMPLIANCE RATIO', sub: 'Employees completing assigned training tracks.' },
    { metric: '0', label: 'DATABASE CREDENTIALS', sub: 'Zero passwords stored during authorized test cycles.' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* Background topography grid lines */}
      <TopoBackground />

      {/* Glassmorphic Navbar */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center bg-black/85 border border-[#232323] rounded-full px-5 py-2 backdrop-blur-xl shadow-2xl gap-8"
        >
          <Link href="/" className="flex items-center gap-2 pr-6 border-r border-[#232323] shrink-0">
            <PPLogo size={20} />
            <span className="font-bold text-white text-[10px] tracking-[0.1em] uppercase font-mono">PINKMAN PROTECTS</span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6 text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500">
            <a href="#features" className="hover:text-white transition">Approach</a>
            <a href="#statistics" className="hover:text-white transition">Telemetry</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          <Link 
            href="/admin/dashboard" 
            className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-[9px] uppercase tracking-wider hover:bg-gray-200 transition shrink-0 font-mono"
          >
            Launch console
          </Link>
        </motion.div>
      </div>

      {/* Editorial Hero Layout */}
      <section className="pt-36 pb-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10 relative">
        <div className="space-y-6 text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/15 border border-[#00FF88]/20 text-[9px] font-mono uppercase tracking-widest text-[#00FF88]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" /> Consent Security Suite
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[0.95] uppercase font-mono"
          >
            HUMAN RISK.<br />
            <span className="text-[#00FF88] text-glow-cyan">MEASURED.</span><br />
            REDUCED.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xs leading-relaxed max-w-sm"
          >
            Build authorized phishing simulation campaigns and adaptive cybersecurity learning tracks. Measure company vulnerability scores transparently with zero credential storage.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-[9px] uppercase tracking-[0.1em] hover:bg-gray-200 transition flex items-center gap-1.5 font-mono"
            >
              LAUNCH CONSOLE <ArrowRight size={10} />
            </Link>
            <a 
              href="#features" 
              className="px-5 py-2.5 rounded-xl bg-transparent border border-[#232323] hover:bg-white/5 text-gray-400 hover:text-white font-bold text-[9px] uppercase tracking-[0.1em] transition font-mono"
            >
              EXPLORE TECH
            </a>
          </motion.div>
        </div>

        {/* Mockup Layout inspired by the Sahil Mane reference */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-[#232323] bg-[#0E0E0E]/95 p-6 rounded-2xl space-y-4 font-mono shadow-2xl relative"
        >
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[8px] text-gray-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" /> Live POSTURE: STABLE
          </div>

          <div className="space-y-1.5 border-b border-[#232323] pb-4">
            <span className="text-[9px] uppercase text-gray-500 tracking-[0.2em] block">WHAT WE BUILT</span>
            <ul className="text-[10px] text-gray-300 space-y-1">
              <li>/ Phishing Simulation Engine</li>
              <li>/ Learning Management System</li>
              <li>/ Real-Time Threat Alerts</li>
              <li>/ AI Security Advisories</li>
              <li>/ Posture SOC Dashboard</li>
              <li>/ Organization Audit Logs</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-[#232323] bg-[#141414] text-[10px] leading-relaxed text-[#B5B5B5]">
            "A complete end-to-end platform to improve security awareness and reduce <strong className="text-[#00FF88]">human risk</strong>."
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section (Minimal Spacing) */}
      <section id="features" className="px-6 pb-20 max-w-5xl mx-auto relative z-10 border-t border-[#232323] pt-12">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-5 border border-[#232323] bg-[#141414] rounded-2xl flex flex-col justify-between items-start hover:border-[#00FF88]/30 transition"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-[#232323] flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-white text-[11px] font-mono tracking-wider uppercase">{feat.title}</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Telemetry Stats Section */}
      <section id="statistics" className="px-6 pb-20 max-w-5xl mx-auto relative z-10 border-t border-[#232323] pt-12">
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {stats.map((st, idx) => (
            <motion.div 
              key={st.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="space-y-1"
            >
              <span className="text-4xl font-extrabold text-[#00FF88] font-mono tracking-tighter block text-glow-cyan">
                {st.metric}
              </span>
              <h4 className="text-[9px] font-bold text-white uppercase font-mono tracking-[0.15em]">
                {st.label}
              </h4>
              <p className="text-[10px] text-gray-400 leading-normal font-sans">
                {st.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing / Subscriptions Section */}
      <section id="pricing" className="px-6 pb-20 max-w-5xl mx-auto relative z-10 border-t border-[#232323] pt-12">
        <div className="text-center space-y-1 mb-10">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-[0.2em]">MEMBERSHIP PLAN TIERING</h2>
          <p className="text-[10px] text-gray-500 font-mono">Select the scope suited for your corporate infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="p-5 border border-[#232323] bg-[#141414] rounded-2xl flex flex-col justify-between hover:border-[#00FF88]/30 transition">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-500 text-[10px] uppercase font-mono tracking-wider">Starter Posture</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">$49/mo</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">Up to 50 employees, 2 domains, and standard simulation templates.</p>
              <div className="h-px bg-[#232323]" />
              <ul className="space-y-2 text-[9px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> Monthly campaigns</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> Standard quiz widgets</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-lg border border-[#232323] bg-black/40 hover:border-[#00FF88]/30 text-[10px] font-mono font-bold uppercase tracking-wider transition">
              Get Started
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="p-5 border border-[#00FF88]/40 bg-[#141414]/90 rounded-2xl flex flex-col justify-between hover:border-[#00FF88]/60 transition shadow-[0_0_15px_rgba(0,255,136,0.02)]">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[#00FF88] text-[10px] uppercase font-mono tracking-wider">Growth Shield</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">$189/mo</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">Up to 500 employees, unlimited domain authing, custom templates.</p>
              <div className="h-px bg-[#232323]" />
              <ul className="space-y-2 text-[9px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> Custom cue editors</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> Real-time funnel audits</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> CSV data exporters</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-lg bg-[#00FF88] text-black font-mono font-bold text-[10px] uppercase tracking-wider transition hover:bg-[#00D26A]">
              Get Started
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="p-5 border border-[#232323] bg-[#141414] rounded-2xl flex flex-col justify-between hover:border-[#00FF88]/30 transition">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-500 text-[10px] uppercase font-mono tracking-wider">Enterprise Command</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">Custom</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">Unlimited seats, custom SMTP gateways, and dedicated support.</p>
              <div className="h-px bg-[#232323]" />
              <ul className="space-y-2 text-[9px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> REST API webhooks</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00FF88]" /> Custom mail SMTPs</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-lg border border-[#232323] bg-black/40 hover:border-[#00FF88]/30 text-[10px] font-mono font-bold uppercase tracking-wider transition">
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* TECH STACK LOGO FOOTER */}
      <section className="px-6 pb-12 max-w-5xl mx-auto border-t border-[#232323] pt-8 font-mono text-[9px] text-gray-500 flex flex-wrap items-center justify-between gap-4">
        <span className="uppercase tracking-widest text-[#00D26A] font-bold">TECH STACK:</span>
        <div className="flex flex-wrap gap-5 uppercase">
          <span>/ Next.js</span>
          <span>/ TypeScript</span>
          <span>/ Tailwind CSS</span>
          <span>/ Prisma</span>
          <span>/ SQLite</span>
          <span>/ Vercel</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232323] bg-[#0E0E0E] py-6 px-6 text-center text-[9px] font-mono text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 Pinkman Protects Platforms Inc.</span>
          <div className="flex gap-4">
            <span>Ethical Posture</span>
            <span>/</span>
            <span>Compliance Checkpoints</span>
            <span>/</span>
            <span>SSO Modules</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
