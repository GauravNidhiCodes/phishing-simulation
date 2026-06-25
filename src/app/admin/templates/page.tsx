'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Smartphone, 
  Monitor, 
  Plus, 
  Eye, 
  X, 
  Check, 
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  Lock,
  Layers,
  Search,
  Code
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  indicators: string; // JSON array of indicators
  createdAt: string;
}

interface Indicator {
  id: number;
  type: 'sender' | 'urgency' | 'link' | 'greeting' | 'financial';
  label: string;
  text: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Preview configuration
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Custom template modal
  const [modalOpen, setModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [indicatorsList, setIndicatorsList] = useState<Indicator[]>([]);
  
  // Temp indicator builder inputs
  const [indLabel, setIndLabel] = useState('');
  const [indText, setIndText] = useState('');
  const [indType, setIndType] = useState<'sender' | 'urgency' | 'link' | 'greeting' | 'financial'>('sender');

  const [submitting, setSubmitting] = useState(false);

  const loadTemplates = () => {
    setLoading(true);
    fetch('/api/admin/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        if (data.length > 0) setSelectedTemplate(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAddIndicator = () => {
    if (!indLabel.trim() || !indText.trim()) return;
    const newIndicator: Indicator = {
      id: Date.now(),
      type: indType,
      label: indLabel,
      text: indText
    };
    setIndicatorsList([...indicatorsList, newIndicator]);
    setIndLabel('');
    setIndText('');
  };

  const handleRemoveIndicator = (id: number) => {
    setIndicatorsList(indicatorsList.filter(ind => ind.id !== id));
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !subject.trim() || !bodyHtml.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          subject,
          bodyHtml,
          indicators: indicatorsList
        })
      });

      if (res.ok) {
        setTemplateName('');
        setSubject('');
        setBodyHtml('');
        setIndicatorsList([]);
        setModalOpen(false);
        loadTemplates();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <Code className="text-brand-cyan animate-pulse" size={20} />
        </div>
        <div className="text-center space-y-1.5">
          <span className="text-xs font-mono tracking-widest text-brand-cyan uppercase animate-pulse">Accessing Catalog...</span>
          <p className="text-[10px] font-mono text-zinc-500">Retrieving markup templates & triggers...</p>
        </div>
      </div>
    );
  }

  // Parse indicators for active template
  const activeIndicators: Indicator[] = selectedTemplate 
    ? JSON.parse(selectedTemplate.indicators) 
    : [];

  return (
    <div className="space-y-10 relative">
      <div className="absolute top-[-10%] right-[5%] w-[400px] h-[400px] bg-brand-cyan/2 rounded-full blur-[130px] pointer-events-none" />

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06b6d4]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-cyan font-bold">Template Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            Template Catalog
          </h1>
          <p className="text-xs text-zinc-400 font-mono">Manage pre-configured ethical simulation email structures and design visual traps.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold px-5 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(6,182,212,0.22)] text-xs font-mono uppercase tracking-wider shrink-0 border border-white/10"
        >
          <Plus size={14} className="stroke-[3]" /> Create Template
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Template Catalog List */}
        <div className="space-y-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 px-2 block font-bold">Available Configurations</span>
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-4.5 rounded-2xl glass-panel relative border transition-all duration-300 ${
                  selectedTemplate?.id === t.id 
                    ? 'border-brand-cyan/40 bg-brand-cyan/[0.03] shadow-[0_0_20px_rgba(6,182,212,0.06)]' 
                    : 'border-white/[0.03] hover:border-white/10 hover:bg-white/[0.01]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-white text-xs tracking-tight group-hover:text-brand-cyan transition">{t.name}</h3>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-zinc-500 font-mono block">SUBJECT:</span>
                      <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[200px]">{t.subject}</p>
                    </div>
                  </div>
                  <FileText className={`shrink-0 transition duration-300 ${selectedTemplate?.id === t.id ? 'text-brand-cyan' : 'text-zinc-600'}`} size={16} />
                </div>
                {selectedTemplate?.id === t.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-brand-cyan rounded-r" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Device Preview & Indicators Panel */}
        {selectedTemplate ? (
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
            
            {/* Template Preview Section */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Simulator Preview Canvas</span>
                
                {/* Desktop/Mobile Device Toggles */}
                <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg transition duration-200 ${previewDevice === 'desktop' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500 hover:text-white border border-transparent'}`}
                  >
                    <Monitor size={12} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg transition duration-200 ${previewDevice === 'mobile' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/20' : 'text-zinc-500 hover:text-white border border-transparent'}`}
                  >
                    <Smartphone size={12} />
                  </button>
                </div>
              </div>

              {/* Rendering Sandbox Frame */}
              <div className="flex justify-center w-full">
                {previewDevice === 'mobile' ? (
                  /* High Fidelity Smartphone Mockup Bezel */
                  <div className="transition-all duration-300 w-full max-w-[320px] border-[10px] border-zinc-800 rounded-[40px] bg-zinc-950 overflow-hidden shadow-2xl h-[560px] flex flex-col relative">
                    {/* Phone speaker notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-28 bg-zinc-800 rounded-b-2xl z-20 flex justify-center items-center">
                      <div className="w-10 h-1 bg-zinc-950 rounded-full" />
                    </div>

                    {/* Email header mock */}
                    <div className="pt-6 pb-3 px-4 bg-zinc-900 text-zinc-300 border-b border-zinc-800 text-[10px] space-y-1 z-10">
                      <div className="flex items-center gap-1 truncate"><strong className="text-zinc-500 font-mono">SUB:</strong> {selectedTemplate.subject}</div>
                      <div className="flex items-center gap-1 truncate"><strong className="text-zinc-500 font-mono">FROM:</strong> client-services@domain.com</div>
                    </div>

                    {/* Body Sandbox */}
                    <div className="flex-1 overflow-y-auto bg-white p-5 relative">
                      <div 
                        className="prose prose-sm max-w-none text-zinc-800 text-[11px] leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedTemplate.bodyHtml
                            .replace('{{name}}', 'Alex Rivera')
                            .replace('{{department}}', 'Engineering')
                            .replace('{{link}}', '#') 
                        }} 
                      />
                    </div>
                    {/* Bottom home handle bar */}
                    <div className="h-5 bg-zinc-950 flex items-center justify-center shrink-0">
                      <div className="h-1 w-24 bg-zinc-700 rounded-full" />
                    </div>
                  </div>
                ) : (
                  /* High Fidelity Desktop Browser Mockup Frame */
                  <div className="w-full rounded-2xl border border-white/[0.06] bg-zinc-950 text-zinc-900 h-[520px] overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
                    
                    {/* Browser top-bar chrome */}
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-white/[0.04]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      
                      {/* Fake address bar with HTTPS lock indicator */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 rounded-lg text-[10px] text-zinc-500 w-1/2 justify-center border border-white/[0.02]">
                        <Lock size={10} className="text-brand-cyan" />
                        <span className="font-mono truncate select-none text-zinc-400">secure-gateway-audit-node.internal</span>
                      </div>

                      <div className="w-12" />
                    </div>

                    {/* Email client header layout */}
                    <div className="p-4 bg-zinc-900 text-zinc-300 border-b border-white/[0.03] text-[10px] space-y-1 font-mono">
                      <div className="flex items-center gap-1 truncate"><strong className="text-zinc-500 w-14 shrink-0">SUBJECT:</strong> {selectedTemplate.subject}</div>
                      <div className="flex items-center gap-1 truncate"><strong className="text-zinc-500 w-14 shrink-0">FROM:</strong> compliance-monitoring@organization-sso.com</div>
                      <div className="flex items-center gap-1 truncate"><strong className="text-zinc-500 w-14 shrink-0">TO:</strong> employee@company.com</div>
                    </div>

                    {/* Body Sandbox */}
                    <div className="flex-1 overflow-y-auto bg-white p-7 relative">
                      <div 
                        className="prose prose-sm max-w-none text-zinc-800"
                        dangerouslySetInnerHTML={{ 
                          __html: selectedTemplate.bodyHtml
                            .replace('{{name}}', 'Alex Rivera')
                            .replace('{{department}}', 'Engineering')
                            .replace('{{link}}', '#') 
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulation Cues & Placeholders panel */}
            <div className="space-y-6">
              {/* Placeholders Info */}
              <div className="glass-panel p-5 rounded-2xl space-y-3.5 border border-white/[0.04]">
                <h3 className="font-bold text-white text-[10px] uppercase tracking-widest font-mono">Dynamic Placeholders</h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">Place these token variables in template HTML body markup to auto-compile per user nodes:</p>
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between p-2.5 bg-white/[0.01] rounded-xl border border-white/[0.03]"><span className="text-brand-cyan">{"{{name}}"}</span> <span className="text-zinc-500 text-[9px]">Employee Name</span></div>
                  <div className="flex justify-between p-2.5 bg-white/[0.01] rounded-xl border border-white/[0.03]"><span className="text-brand-cyan">{"{{department}}"}</span> <span className="text-zinc-500 text-[9px]">Department</span></div>
                  <div className="flex justify-between p-2.5 bg-white/[0.01] rounded-xl border border-white/[0.03]"><span className="text-brand-cyan">{"{{link}}"}</span> <span className="text-zinc-500 text-[9px]">Simulation Link</span></div>
                </div>
              </div>

              {/* Security Indicators Explainer */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 border border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-[10px] uppercase tracking-widest font-mono">Security Cues</h3>
                  <label className="flex items-center gap-1.5 text-[9px] text-zinc-400 cursor-pointer font-mono select-none">
                    <input 
                      type="checkbox" 
                      checked={showIndicators} 
                      onChange={(e) => setShowIndicators(e.target.checked)}
                      className="rounded text-brand-cyan focus:ring-brand-cyan bg-black border-white/10" 
                    /> Details
                  </label>
                </div>

                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 scrollbar-thin">
                  {activeIndicators.map(ind => (
                    <motion.div 
                      key={ind.id} 
                      layout
                      className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] text-xs space-y-1 relative group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ind.type === 'sender' ? 'bg-rose-400' :
                          ind.type === 'urgency' ? 'bg-amber-400' :
                          ind.type === 'link' ? 'bg-cyan-400' : 'bg-purple-400'
                        }`} />
                        <span className="font-extrabold text-white font-mono uppercase text-[9px] tracking-wide">{ind.label}</span>
                      </div>
                      {showIndicators && (
                        <p className="text-zinc-400 text-[10px] leading-relaxed font-mono">{ind.text}</p>
                      )}
                    </motion.div>
                  ))}
                  {activeIndicators.length === 0 && (
                    <p className="text-[10px] text-zinc-500 font-mono text-center py-4">No cues associated with this template configuration.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel rounded-3xl p-12 text-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest border border-white/[0.03]">
            Select a template format to inspect simulation parameters.
          </div>
        )}
      </div>

      {/* Template Creator Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="glass-panel p-8 rounded-3xl max-w-3xl w-full relative z-10 border border-white/[0.06] overflow-hidden bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-purple/4 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Create Custom Template</h2>
                    <p className="text-[10px] text-zinc-500 font-mono">DEFINE VISUAL ATTRIBUTES</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Template Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT Security Portal Audit"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">Email Subject Line</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Immediate Password Update Required"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono"
                    />
                  </div>
                </div>

                {/* HTML content builder */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* HTML Edit input */}
                  <div>
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 mb-2 font-semibold">HTML Content Body</label>
                    <textarea
                      required
                      rows={8}
                      placeholder={`<div style="font-family: sans-serif;">\n  <h2>Mandatory Audit</h2>\n  <p>Hello {{name}}, please check your account details: </p>\n  <a href="{{link}}">Verify Here</a>\n</div>`}
                      value={bodyHtml}
                      onChange={(e) => setBodyHtml(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-[11px] font-mono resize-none h-[220px] scrollbar-thin"
                    />
                  </div>

                  {/* Indicators / Cues builder */}
                  <div className="space-y-4">
                    <label className="block text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">Indicators Tagging</label>
                    
                    <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 space-y-3.5 relative">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[8px] text-zinc-500 font-mono mb-1 font-bold">CUE TYPE</label>
                          <select 
                            value={indType}
                            onChange={(e: any) => setIndType(e.target.value)}
                            className="w-full p-2 rounded-lg glass-input text-[10px] font-mono"
                          >
                            <option value="sender">Sender Identity</option>
                            <option value="urgency">Urgency / Panic</option>
                            <option value="link">Deceptive Hyperlink</option>
                            <option value="greeting">Generic Greeting</option>
                            <option value="financial">Financial demands</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] text-zinc-500 font-mono mb-1 font-bold">CUE TITLE</label>
                          <input
                            type="text"
                            placeholder="Mismatched Domain"
                            value={indLabel}
                            onChange={(e) => setIndLabel(e.target.value)}
                            className="w-full p-2 rounded-lg glass-input text-[10px] font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-500 font-mono mb-1 font-bold">CUE DESCRIPTION EXPLANATION</label>
                        <input
                          type="text"
                          placeholder="Sent from '@fake-domain.com' instead of standard company SSO portal."
                          value={indText}
                          onChange={(e) => setIndText(e.target.value)}
                          className="w-full p-2 rounded-lg glass-input text-[10px] font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddIndicator}
                        className="w-full py-2 rounded-xl bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 text-[10px] font-bold font-mono uppercase tracking-wider border border-brand-purple/20 transition-all duration-200"
                      >
                        + Add indicator
                      </button>
                    </div>

                    {/* Tag list */}
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5 scrollbar-thin">
                      {indicatorsList.map(ind => (
                        <div key={ind.id} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.03] rounded-xl p-2 text-[9px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-brand-purple shadow-[0_0_8px_#8b5cf6]" />
                            <span className="font-extrabold text-white uppercase tracking-wider">{ind.label}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveIndicator(ind.id)}
                            className="text-zinc-500 hover:text-white p-0.5 rounded"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex gap-4 border-t border-white/[0.04] pt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white font-bold transition text-xs font-mono uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] text-white font-bold transition text-xs font-mono uppercase tracking-wider border border-white/10"
                  >
                    {submitting ? 'Registering...' : 'Register Custom Template'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

