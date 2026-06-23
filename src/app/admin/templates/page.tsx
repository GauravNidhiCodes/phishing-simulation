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
  Sparkles
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Template Library...</span>
      </div>
    );
  }

  // Parse indicators for active template
  const activeIndicators: Indicator[] = selectedTemplate 
    ? JSON.parse(selectedTemplate.indicators) 
    : [];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Template Catalog</h1>
          <p className="text-sm text-gray-400">Manage pre-configured ethical simulation formats and design visual cues.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold px-4 py-2.5 rounded-xl transition duration-200 shadow-[0_4px_20px_rgba(6,182,212,0.2)] text-sm"
        >
          <Plus size={16} /> Create Template
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Template Catalog List */}
        <div className="space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500 px-2 block">Available Templates</span>
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full text-left p-4 rounded-2xl glass-panel relative border transition ${
                  selectedTemplate?.id === t.id 
                    ? 'border-brand-cyan/60 bg-brand-cyan/5 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                    : 'border-cyber-border hover:border-cyber-border-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm">{t.name}</h3>
                    <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">Sub: {t.subject}</p>
                  </div>
                  <FileText className={`shrink-0 ${selectedTemplate?.id === t.id ? 'text-brand-cyan' : 'text-gray-500'}`} size={16} />
                </div>
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
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Live Simulation View</span>
                
                {/* Desktop/Mobile Device Toggles */}
                <div className="flex items-center gap-1 bg-white/5 border border-cyber-border rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-lg transition ${previewDevice === 'desktop' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-lg transition ${previewDevice === 'mobile' ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              </div>

              {/* Rendering Sandbox Frame */}
              <div className="flex justify-center w-full">
                <div className={`transition-all duration-300 w-full ${previewDevice === 'mobile' ? 'max-w-[340px] border-[8px] border-slate-800 rounded-[36px] bg-slate-900 overflow-hidden shadow-2xl h-[550px]' : 'w-full rounded-2xl border border-cyber-border bg-white text-gray-900 h-[500px] overflow-hidden flex flex-col'}`}>
                  
                  {/* Email header mock */}
                  <div className={`p-4 border-b ${previewDevice === 'mobile' ? 'bg-slate-900 text-gray-300 border-slate-800' : 'bg-slate-50 text-gray-600 border-gray-100'} text-xs space-y-1`}>
                    <div className="flex items-center gap-1 truncate"><strong className="text-gray-400">Subject:</strong> {selectedTemplate.subject}</div>
                    <div className="flex items-center gap-1 truncate"><strong className="text-gray-400">From:</strong> compliance-audit-operations@security-portal-verification.com</div>
                    <div className="flex items-center gap-1 truncate"><strong className="text-gray-400">To:</strong> employee@company.com</div>
                  </div>

                  {/* Body Sandbox */}
                  <div className="flex-1 overflow-y-auto bg-white p-6 relative">
                    {/* Render raw template HTML */}
                    <div 
                      className="prose prose-sm max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedTemplate.bodyHtml
                          .replace('{{name}}', 'Alex Rivera')
                          .replace('{{department}}', 'Engineering')
                          .replace('{{link}}', '#') 
                      }} 
                    />
                  </div>
                  
                  {previewDevice === 'mobile' && (
                    <div className="h-4 w-32 bg-slate-800 rounded-full mx-auto my-2" />
                  )}
                </div>
              </div>
            </div>

            {/* Simulation Cues & Placeholders panel */}
            <div className="space-y-6">
              {/* Placeholders Info */}
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Dynamic Placeholders</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">Place these variables in template HTML body markup to auto-compile tags per recipient:</p>
                <div className="space-y-2 text-[10px] font-mono">
                  <div className="flex justify-between p-1 bg-white/5 rounded border border-cyber-border"><span className="text-brand-cyan">{"{{name}}"}</span> <span className="text-gray-500">Employee Name</span></div>
                  <div className="flex justify-between p-1 bg-white/5 rounded border border-cyber-border"><span className="text-brand-cyan">{"{{department}}"}</span> <span className="text-gray-500">Department</span></div>
                  <div className="flex justify-between p-1 bg-white/5 rounded border border-cyber-border"><span className="text-brand-cyan">{"{{link}}"}</span> <span className="text-gray-500">Simulation Target URL</span></div>
                </div>
              </div>

              {/* Security Indicators Explainer */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Simulated Security Cues</h3>
                  <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showIndicators} 
                      onChange={(e) => setShowIndicators(e.target.checked)}
                      className="rounded text-brand-cyan focus:ring-brand-cyan bg-black border-gray-700" 
                    /> Show Details
                  </label>
                </div>

                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                  {activeIndicators.map(ind => (
                    <motion.div 
                      key={ind.id} 
                      layout
                      className="p-3 rounded-xl bg-white/5 border border-cyber-border text-xs space-y-1 relative"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          ind.type === 'sender' ? 'bg-rose-400' :
                          ind.type === 'urgency' ? 'bg-amber-400' :
                          ind.type === 'link' ? 'bg-cyan-400' : 'bg-purple-400'
                        }`} />
                        <span className="font-bold text-white font-mono uppercase text-[9px]">{ind.label}</span>
                      </div>
                      {showIndicators && (
                        <p className="text-gray-400 text-[11px] leading-normal">{ind.text}</p>
                      )}
                    </motion.div>
                  ))}
                  {activeIndicators.length === 0 && (
                    <p className="text-xs text-gray-500 font-mono text-center">No tagged cues associated with this template.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel rounded-3xl p-12 text-center text-gray-500 font-mono text-xs">
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
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-3xl w-full relative z-10 border border-cyber-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-purple" size={20} />
                  <h2 className="text-xl font-bold text-white">Create Custom Template</h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTemplate} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Template Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. IT Security Portal Audit"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Email Subject Line</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Immediate Password Update Required"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                {/* HTML content builder */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* HTML Edit input */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">HTML Content Body</label>
                    <textarea
                      required
                      rows={8}
                      placeholder={`<div style="font-family: sans-serif;">\n  <h2>Mandatory Audit</h2>\n  <p>Hello {{name}}, please check your account details: </p>\n  <a href="{{link}}">Verify Here</a>\n</div>`}
                      value={bodyHtml}
                      onChange={(e) => setBodyHtml(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono resize-none h-[220px]"
                    />
                  </div>

                  {/* Indicators / Cues builder */}
                  <div className="space-y-4">
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-400">Indicators Tagging</label>
                    
                    <div className="bg-white/5 border border-cyber-border rounded-2xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-gray-500 font-mono mb-1">CUE TYPE</label>
                          <select 
                            value={indType}
                            onChange={(e: any) => setIndType(e.target.value)}
                            className="w-full p-2 rounded-lg glass-input text-xs"
                          >
                            <option value="sender">Sender Identity</option>
                            <option value="urgency">Urgency / Panic</option>
                            <option value="link">Deceptive Hyperlink</option>
                            <option value="greeting">Generic Greeting</option>
                            <option value="financial">Financial demands</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 font-mono mb-1">CUE TITLE</label>
                          <input
                            type="text"
                            placeholder="Mismatched Domain"
                            value={indLabel}
                            onChange={(e) => setIndLabel(e.target.value)}
                            className="w-full p-2 rounded-lg glass-input text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-mono mb-1">CUE DESCRIPTION EXPLANATION</label>
                        <input
                          type="text"
                          placeholder="Sent from '@fake-domain.com' instead of standard company SSO portal."
                          value={indText}
                          onChange={(e) => setIndText(e.target.value)}
                          className="w-full p-2 rounded-lg glass-input text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddIndicator}
                        className="w-full py-1.5 rounded-xl bg-brand-purple/20 text-brand-purple hover:bg-brand-purple/30 text-xs font-semibold font-mono"
                      >
                        + Add indicator
                      </button>
                    </div>

                    {/* Tag list */}
                    <div className="max-h-[100px] overflow-y-auto space-y-1.5">
                      {indicatorsList.map(ind => (
                        <div key={ind.id} className="flex justify-between items-center bg-white/5 border border-cyber-border rounded-lg p-2 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                            <span className="font-bold text-white font-mono uppercase">{ind.label}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveIndicator(ind.id)}
                            className="text-gray-500 hover:text-white"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex gap-4 border-t border-cyber-border/40 pt-6">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-white font-semibold transition text-sm flex items-center justify-center"
                  >
                    {submitting ? 'Creating...' : 'Register Custom Template'}
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
