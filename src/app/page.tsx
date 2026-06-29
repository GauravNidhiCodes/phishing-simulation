'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Lock, 
  Zap, 
  Check, 
  Target 
} from 'lucide-react';
import { TopoBackground } from '@/components/ui/TopoBackground';
import PPLogo from '@/components/layout/PPLogo';

export default function Home() {
  const features = [
    {
      title: 'CONSENT-VERIFIED ROUTING',
      desc: 'DNS validation guarantees simulations target only verified corporate domain nodes.',
      icon: <Target className="text-white" size={14} />
    },
    {
      title: 'ETHICAL INTERCEPT FILTER',
      desc: 'Form inputs process interactions but discard sensitive credentials directly in-browser.',
      icon: <Lock className="text-white" size={14} />
    },
    {
      title: 'ADAPTIVE COMPLIANCE TRAILS',
      desc: 'Poor campaign behaviors trigger instant indicators and custom quiz tracks.',
      icon: <Zap className="text-white" size={14} />
    }
  ];

  const stats = [
    { metric: '3.2%', label: 'FAILURE POSTURE', sub: 'Average click rate decreased from 12.8% globally.' },
    { metric: '94%', label: 'COMPLIANCE RATIO', sub: 'Employees completing assigned training tracks.' },
    { metric: '0', label: 'DATABASE SECURED', sub: 'Zero passwords stored during authorized test cycles.' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* Background ASCII waves (subtle opacity) */}
      <div className="opacity-15">
        <TopoBackground />
      </div>

      {/* Premium Navbar */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center bg-[#0B0B0B]/90 border border-[#1F1F1F] rounded-full px-5 py-2 backdrop-blur-xl shadow-2xl gap-8"
        >
          <Link href="/" className="flex items-center gap-2 pr-6 border-r border-[#1F1F1F] shrink-0">
            <PPLogo size={18} />
            <span className="font-bold text-white text-[9px] tracking-widest uppercase font-mono">PINKMAN PROTECTS</span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
            <a href="#features" className="hover:text-white transition">Approach</a>
            <a href="#statistics" className="hover:text-white transition">Telemetry</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>

          <Link 
            href="/admin/dashboard" 
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-[9px] uppercase tracking-wider transition shrink-0 font-mono"
          >
            Launch console
          </Link>
        </motion.div>
      </div>

      {/* Editorial Hero Layout */}
      <section className="pt-40 pb-16 px-6 max-w-4xl mx-auto grid md:grid-cols-5 gap-12 items-center z-10 relative">
        <div className="md:col-span-3 space-y-6 text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-[#1F1F1F] text-[9px] font-mono uppercase tracking-widest text-zinc-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" /> Consent Security Suite
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.05] uppercase font-mono"
          >
            HUMAN RISK.<br />
            <span className="text-zinc-500">MEASURED.</span><br />
            REDUCED.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-zinc-400 text-xs leading-relaxed max-w-sm"
          >
            Authorized phishing simulations and adaptive security education. Gauge organizational vulnerability ratios with zero credential exposure.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link 
              href="/admin/dashboard" 
              className="px-5 py-2.5 rounded-lg bg-white text-black font-bold text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition flex items-center gap-1.5 font-mono"
            >
              LAUNCH CONSOLE <ArrowRight size={10} />
            </Link>
            <a 
              href="#features" 
              className="px-5 py-2.5 rounded-lg bg-transparent border border-[#1F1F1F] hover:bg-white/[0.02] text-zinc-400 hover:text-white font-bold text-[9px] uppercase tracking-widest transition font-mono"
            >
              EXPLORE TECH
            </a>
          </motion.div>
        </div>

        {/* Flat info panel */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2 border border-[#1F1F1F] bg-[#0B0B0B] p-5 rounded-2xl space-y-4 font-mono shadow-2xl relative"
        >
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[8px] text-zinc-500 uppercase tracking-widest">
            <span className="w-1 h-1 rounded-full bg-[#00D26A]" /> Active Node
          </div>

          <div className="space-y-1.5 border-b border-[#1F1F1F] pb-4">
            <span className="text-[9px] uppercase text-zinc-500 tracking-widest block font-bold">SYSTEM OVERVIEW</span>
            <ul className="text-[10px] text-zinc-400 space-y-1">
              <li>/ Phishing Simulation Engine</li>
              <li>/ Learning Management System</li>
              <li>/ Real-Time Threat Alerts</li>
              <li>/ AI Security Advisories</li>
              <li>/ Posture SOC Dashboard</li>
              <li>/ Organization Audit Logs</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-[#121212] border border-[#1F1F1F] text-[10px] leading-relaxed text-zinc-400">
            "A complete end-to-end platform to improve security awareness and reduce organizational risk index."
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-6 pb-20 max-w-4xl mx-auto relative z-10 border-t border-[#1F1F1F] pt-12">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl flex flex-col justify-between items-start transition hover:border-zinc-700"
            >
              <div className="space-y-3">
                <div className="w-7 h-7 rounded bg-[#050505] border border-[#1F1F1F] flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-white text-[10px] font-mono tracking-widest uppercase">{feat.title}</h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Telemetry Stats Section */}
      <section id="statistics" className="px-6 pb-20 max-w-4xl mx-auto relative z-10 border-t border-[#1F1F1F] pt-12">
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {stats.map((st, idx) => (
            <motion.div 
              key={st.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="space-y-1"
            >
              <span className="text-3xl font-extrabold text-white font-mono tracking-tighter block">
                {st.metric}
              </span>
              <h4 className="text-[9px] font-bold text-[#00D26A] uppercase font-mono tracking-widest">
                {st.label}
              </h4>
              <p className="text-[10px] text-zinc-400 leading-normal font-sans mt-1">
                {st.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing / Subscriptions Section */}
      <section id="pricing" className="px-6 pb-20 max-w-4xl mx-auto relative z-10 border-t border-[#1F1F1F] pt-12">
        <div className="text-center space-y-1 mb-10">
          <h2 className="text-xs font-bold text-white font-mono uppercase tracking-widest">MEMBERSHIP PLAN TIERING</h2>
          <p className="text-[10px] text-zinc-500 font-mono">Select the scope suited for your corporate infrastructure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl flex flex-col justify-between transition hover:border-zinc-700">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-500 text-[9px] uppercase font-mono tracking-widest">Starter Posture</h3>
                <span className="text-xl font-bold text-white font-mono mt-1 block">$49/mo</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">Up to 50 employees, 2 domains, and standard templates.</p>
              <div className="h-px bg-[#1F1F1F]" />
              <ul className="space-y-2 text-[9px] text-zinc-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> Monthly campaigns</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> Standard quiz widgets</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded bg-[#050505] border border-[#1F1F1F] hover:border-zinc-700 text-[9px] font-mono font-bold uppercase tracking-widest transition text-white">
              Get Started
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="p-5 border border-[#00D26A]/30 bg-[#121212] rounded-2xl flex flex-col justify-between transition hover:border-[#00D26A]/50">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[#00D26A] text-[9px] uppercase font-mono tracking-widest">Growth Shield</h3>
                <span className="text-xl font-bold text-white font-mono mt-1 block">$189/mo</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">Up to 500 employees, unlimited domain authing, custom templates.</p>
              <div className="h-px bg-[#1F1F1F]" />
              <ul className="space-y-2 text-[9px] text-zinc-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> Custom cue editors</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> Real-time funnel audits</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> CSV data exporters</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded bg-[#00D26A] text-black font-mono font-bold text-[9px] uppercase tracking-widest transition hover:bg-[#00FF88]">
              Get Started
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-2xl flex flex-col justify-between transition hover:border-zinc-700">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-500 text-[9px] uppercase font-mono tracking-widest">Enterprise Command</h3>
                <span className="text-xl font-bold text-white font-mono mt-1 block">Custom</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">Unlimited seats, custom SMTP gateways, and dedicated support.</p>
              <div className="h-px bg-[#1F1F1F]" />
              <ul className="space-y-2 text-[9px] text-zinc-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> REST API webhooks</li>
                <li className="flex items-center gap-1.5"><Check size={10} className="text-[#00D26A]" /> Custom mail SMTPs</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded bg-[#050505] border border-[#1F1F1F] hover:border-zinc-700 text-[9px] font-mono font-bold uppercase tracking-widest transition text-white">
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* TECH STACK LOGO FOOTER */}
      <section className="px-6 pb-12 max-w-4xl mx-auto border-t border-[#1F1F1F] pt-8 font-mono text-[9px] text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <span className="uppercase tracking-widest text-[#00D26A] font-bold">TECH SYSTEM SPEC:</span>
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
      <footer className="border-t border-[#1F1F1F] bg-[#0A0A0A] py-6 px-6 text-center text-[9px] font-mono text-zinc-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
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
