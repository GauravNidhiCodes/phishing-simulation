'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Zap, 
  Check, 
  Users, 
  Activity, 
  Target, 
  Server,
  Database,
  Terminal,
  MousePointerClick
} from 'lucide-react';
import { TopoBackground } from '@/components/ui/TopoBackground';

export default function Home() {
  const features = [
    {
      title: 'Consent-Verified Delivery',
      desc: 'Automatic DNS verification ensures campaigns target only corporate-owned, authorized domains. Zero bypass configurations required.',
      icon: <Target className="text-blue-500" size={18} />
    },
    {
      title: 'Ethical Intercept Mechanism',
      desc: 'Form templates log user click funnel actions but immediately intercept inputs on the client side. No password is ever stored or transmitted.',
      icon: <Lock className="text-cyan-500" size={18} />
    },
    {
      title: 'Adaptive Learning Tracks',
      desc: 'Cybersecurity training modules match individual performance. Poor simulation actions trigger immediate indicators and short micro-quizzes.',
      icon: <Zap className="text-purple-500" size={18} />
    }
  ];

  const stats = [
    { metric: '3.2%', label: 'Average Target Click Rate', sub: 'Reduced from 12.8% within 90 days of continuous evaluation cycles' },
    { metric: '94%', label: 'Training Course Completion', sub: 'Voluntary attendance driven by bite-sized modular curricula' },
    { metric: '0', label: 'Stored Credentials', sub: 'Zero passwords saved across millions of authorized simulation exercises' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* ASCII Topography heightmap background */}
      <TopoBackground />

      {/* Capsule Navbar */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center bg-black/80 border border-cyber-border rounded-full px-5 py-2.5 backdrop-blur-xl shadow-2xl gap-8"
        >
          <Link href="/" className="flex items-center gap-2 pr-6 border-r border-cyber-border/40 shrink-0">
            <div className="w-5.5 h-5.5 rounded-full bg-white flex items-center justify-center text-black font-black text-[10px] font-mono">
              Φ
            </div>
            <span className="font-extrabold text-white text-xs tracking-tight">PhishDeck</span>
          </Link>
          
          <nav className="hidden sm:flex items-center gap-6 text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
            <a href="#features" className="hover:text-white transition">Approach</a>
            <a href="#statistics" className="hover:text-white transition">Performance</a>
            <a href="#pricing" className="hover:text-white transition">Subscriptions</a>
          </nav>

          <Link 
            href="/admin/dashboard" 
            className="px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-[9px] uppercase tracking-wider hover:bg-gray-200 transition shrink-0 font-mono"
          >
            Launch console
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center space-y-6 z-10 relative">
        {/* Subtitle badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-cyber-border text-[9px] font-mono uppercase tracking-widest text-gray-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Consent Security Suite
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mx-auto font-sans"
        >
          Assess. Train. Secure.
        </motion.h1>
        
        {/* Paragraph */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
        >
          Build authorized phishing simulation campaigns and adaptive cybersecurity learning tracks. Measure company vulnerability scores transparently with zero credential storage.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Link 
            href="/admin/dashboard" 
            className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-wider hover:bg-gray-200 transition flex items-center gap-1.5 shadow-2xl font-mono"
          >
            Launch Sandbox console <ArrowRight size={12} />
          </Link>
          <a 
            href="#features" 
            className="px-6 py-3 rounded-full bg-white/5 border border-cyber-border hover:bg-white/10 text-gray-300 hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition font-mono"
          >
            Explore features
          </a>
        </motion.div>
      </section>

      {/* Visual Dashboard Mockup (Linear Style) */}
      <section className="px-6 pb-24 max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full glass-panel rounded-3xl border border-cyber-border overflow-hidden p-1.5 bg-black/40 shadow-2xl relative"
        >
          {/* Animated corner border light */}
          <div className="absolute top-0 right-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
          
          <div className="border border-white/5 rounded-2.5xl overflow-hidden bg-zinc-950/80 flex flex-col">
            {/* Header control buttons */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border/60 bg-black/20 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-white font-semibold">CONSOLE_AUDIT_FUNNEL</span>
              </div>
              <div className="flex items-center gap-4">
                <span>VERIFIED_TENANT: OK</span>
                <span>DB: SQLITE</span>
              </div>
            </div>

            {/* Simulated Grid layout */}
            <div className="grid md:grid-cols-3 gap-6 p-6">
              
              {/* Stat Card 1 */}
              <div className="p-5 rounded-2xl bg-white/2 border border-cyber-border/40 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Global Scorecard</span>
                <h4 className="text-3xl font-extrabold font-mono text-white">85%</h4>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-400 font-mono">
                  <span>+4.2% awareness increase</span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="p-5 rounded-2xl bg-white/2 border border-cyber-border/40 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Active range</span>
                <h4 className="text-lg font-bold truncate text-white">acme.com</h4>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-500 font-mono">
                  <span>DNS records authenticated</span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="p-5 rounded-2xl bg-white/2 border border-cyber-border/40 space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Current status</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] font-bold inline-block w-fit">
                  MONITORING_ON
                </span>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Campaign log queries OK</p>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section (Stripe Style) */}
      <section id="features" className="px-6 pb-24 max-w-5xl mx-auto relative z-10 border-t border-cyber-border/20 pt-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyber-border flex flex-col justify-between items-start"
            >
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-cyber-border flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-white text-sm tracking-tight">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics Section (Future of Finance Style) */}
      <section id="statistics" className="px-6 pb-24 max-w-5xl mx-auto relative z-10 border-t border-cyber-border/20 pt-16">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
          {stats.map((st, idx) => (
            <motion.div 
              key={st.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-2"
            >
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight block">
                {st.metric}
              </span>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                {st.label}
              </h4>
              <p className="text-[11px] text-gray-500 leading-normal">
                {st.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing / Subscriptions Section */}
      <section id="pricing" className="px-6 pb-24 max-w-5xl mx-auto relative z-10 border-t border-cyber-border/20 pt-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Flexible Plans</h2>
          <p className="text-xs text-gray-400">Select the plan matching your organization scale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-cyber-border">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider text-gray-500">Starter Guard</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">$49/mo</span>
              </div>
              <p className="text-[11px] text-gray-400 min-h-[40px]">Up to 50 employees, 2 domains, and standard simulation templates.</p>
              <div className="h-px bg-cyber-border/40" />
              <ul className="space-y-2 text-[10px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Monthly campaigns</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Standard quiz widgets</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-full bg-white/5 border border-cyber-border hover:border-brand-blue text-xs font-mono font-semibold transition">
              Get Started
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-brand-blue/60 bg-brand-blue/2">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider text-brand-blue">Growth Shield</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">$189/mo</span>
              </div>
              <p className="text-[11px] text-gray-400 min-h-[40px]">Up to 500 employees, unlimited domain authing, custom email cues.</p>
              <div className="h-px bg-cyber-border/40" />
              <ul className="space-y-2 text-[10px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Custom cue editors</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Real-time funnel audits</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> CSV data exporters</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 text-xs font-mono font-semibold transition">
              Get Started
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-6 rounded-2.5xl flex flex-col justify-between border border-cyber-border">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider text-gray-500">Enterprise Ops</h3>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">Custom</span>
              </div>
              <p className="text-[11px] text-gray-400 min-h-[40px]">Unlimited seats, custom SMTP gateways, and dedicated support.</p>
              <div className="h-px bg-cyber-border/40" />
              <ul className="space-y-2 text-[10px] text-gray-500 font-mono">
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> REST API webhooks</li>
                <li className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Custom mail SMTPs</li>
              </ul>
            </div>
            <Link href="/admin/dashboard" className="w-full text-center mt-6 py-2 rounded-full bg-white/5 border border-cyber-border hover:border-brand-blue text-xs font-mono font-semibold transition">
              Contact Sales
            </Link>
          </div>

        </div>
      </section>

      {/* CTA Box (Linear style) */}
      <section className="px-6 pb-24 max-w-4xl mx-auto relative z-10">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-transparent text-center relative overflow-hidden flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Train your employees before hackers do.</h2>
          <p className="text-xs text-gray-400 max-w-md">Verify your domain authority in seconds and begin authorized training cycles today.</p>
          <Link href="/admin/dashboard" className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-wider hover:bg-gray-200 transition font-mono shadow-2xl">
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
