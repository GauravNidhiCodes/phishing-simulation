'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  Plus, 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  GraduationCap, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Search
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

const KNOWLEDGE_BASE_TOPICS = [
  {
    topic: 'phishing',
    title: 'Phishing',
    summary: 'Deceptive emails engineered to steal credentials or inject malware.',
    content: 'Phishing is a social engineering attack where bad actors impersonate legitimate institutions to steal credentials or sensitive data. Always verify sender domains (e.g., check for minor typos) and inspect full URLs before clicking any link.'
  },
  {
    topic: 'malware',
    title: 'Malware',
    summary: 'Malicious code designed to damage systems or compromise data security.',
    content: 'Malware includes spyware, keyloggers, and viruses. It is commonly delivered via unexpected email attachments or unauthorized software downloads. Maintain active endpoint security scanners and avoid execution of files from unknown sources.'
  },
  {
    topic: 'social engineering',
    title: 'Social Engineering',
    summary: 'Human trust exploitation to bypass structural security protocols.',
    content: 'Social engineering targets human vulnerabilities rather than network software. Tactics include impersonation (e.g., impersonating IT staff on phone calls), intimidation, and pretexting. Verify any sensitive instructions via a secondary trusted channel.'
  },
  {
    topic: 'ransomware',
    title: 'Ransomware',
    summary: 'Cryptographic locking of corporate directories for payment extraction.',
    content: 'Ransomware locks critical files and systems, demanding digital currency ransom for recovery. Best defenses include automated off-network database backups, web filters, and avoiding access to external public drives.'
  },
  {
    topic: 'password security',
    title: 'Password Security',
    summary: 'Enforcements to safeguard passwords and prevent credential hacks.',
    content: 'Weak, shared, or reused passwords are prime targets. Use passphrases comprising multiple random words (e.g., "Mumb@i-Rain-Te@-2026") which are extremely difficult to crack via brute force but easy for humans to memorize.'
  },
  {
    topic: 'mfa',
    title: 'MFA',
    summary: 'Multi-Factor Authentication adds essential secondary validation.',
    content: 'MFA ensures that even if credentials are leaked, access remains secured. Use authenticator app TOTPs or FIDO2 keys. Never approve authorization requests or push alerts that you did not explicitly trigger.'
  },
  {
    topic: 'safe browsing',
    title: 'Safe Browsing',
    summary: 'Secure browsing practices to limit web page download hazards.',
    content: 'Only log into secure HTTPS web domains. Be cautious of unsolicited popups warning of system viruses, and do not authorize non-store browser extension installations.'
  },
  {
    topic: 'upi fraud',
    title: 'UPI Fraud',
    summary: 'Fraudulent UPI PIN requests masquerading as incoming money.',
    content: 'UPI transactions (GPay, PhonePe, Paytm) require PIN entry ONLY to send or debit money, NEVER to receive funds. Immediately decline any payment collect requests received from unknown contacts.'
  },
  {
    topic: 'qr scam',
    title: 'QR Scam',
    summary: 'Tampered QR codes directing users to fraudulent payment screens.',
    content: 'Attackers print replacement QR stickers or share malicious codes via chat. Scanning them initiates account authorization or money transfer. Always confirm the merchant legal name matches on screen before approving.'
  },
  {
    topic: 'email fraud',
    title: 'Email Fraud',
    summary: 'Header spoofing simulating internal executive instruction alerts.',
    content: 'Email spoofing masks the header domain to appear as an internal CEO, HR, or finance sender. If asked to perform urgent fund transfers or change bank account info, verify verbally with the sender over a phone call first.'
  }
];

export default function AIAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'knowledge_base'>('chat');
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  // KB States
  const [kbSearch, setKbSearch] = useState('');
  const [selectedKbTopic, setSelectedKbTopic] = useState<typeof KNOWLEDGE_BASE_TOPICS[0] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
          initializeAssistant(data.user);
        }
      })
      .catch(err => console.error("AI Assistant session fetch error:", err));
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load conversation history from localStorage
  useEffect(() => {
    if (sessionUser) {
      const historyKey = `pinkman_ai_chat_${sessionUser.email}`;
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Welcome message
        const welcomeText = sessionUser.role === 'EMPLOYEE'
          ? `Hi **${sessionUser.name}**! I am your **Pinkman Protects Security Assistant**. I can help you review your training progress and learn how to recognize phishing threats. How can I help you today?`
          : `Hello Administrator! I am your **Pinkman Protects SecOps AI Assistant**. I analyze live simulated campaigns and employee risk scores to provide actionable insights. What security diagnostics can I run for you?`;
        setMessages([{ id: 'welcome', sender: 'assistant', text: welcomeText }]);
      }
    }
  }, [sessionUser]);

  // Save history to localStorage
  const saveHistory = (newMessages: Message[]) => {
    if (sessionUser) {
      const historyKey = `pinkman_ai_chat_${sessionUser.email}`;
      localStorage.setItem(historyKey, JSON.stringify(newMessages));
    }
  };

  const initializeAssistant = (user: any) => {
    if (user.role === 'EMPLOYEE') {
      setSuggestedQuestions([
        'Why did I fail?',
        'How can I improve?',
        'Recommend courses.',
        'Explain phishing indicators.',
        'Explain suspicious links.'
      ]);
    } else {
      setSuggestedQuestions([
        'Which department is most vulnerable?',
        'Who needs immediate training?',
        'Summarize this month\'s campaigns.',
        'Which branch improved the most?',
        'Generate executive summary.'
      ]);
    }
  };

  // Safe markdown text parser (handles bold text and bullet points simply)
  const parseMessageText = (text: string) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Bold syntax
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Code tags
      content = content.replace(/`(.*?)`/g, '<code class="bg-[#0A0A0A] text-white px-1.5 py-0.5 rounded font-mono text-[11px] border border-[#1F1F1F]">$1</code>');
      
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-base font-bold text-white mt-3 mb-2 uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-white mt-3 mb-1.5 tracking-wide" dangerouslySetInnerHTML={{ __html: content.substring(3) }} />;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xs font-bold text-white mt-2.5 mb-1 tracking-wide font-mono uppercase" dangerouslySetInnerHTML={{ __html: content.substring(4) }} />;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-xs leading-relaxed text-gray-300 my-1" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
      }
      return <p key={idx} className="text-xs leading-relaxed text-gray-300 my-1.5" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();
      
      if (data.response) {
        streamResponse(data.response);
      } else {
        const fallbackText = "I encountered an error querying the analytics engine. Please try asking again.";
        setIsTyping(false);
        const errMessage: Message = { id: Date.now().toString(), sender: 'assistant', text: fallbackText };
        setMessages(prev => {
          const m = [...prev, errMessage];
          saveHistory(m);
          return m;
        });
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      const errMessage: Message = { id: Date.now().toString(), sender: 'assistant', text: "Network sync error. Unable to reach security assistant." };
      setMessages(prev => {
        const m = [...prev, errMessage];
        saveHistory(m);
        return m;
      });
    }
  };

  const streamResponse = (fullText: string) => {
    setIsTyping(false);
    const newMessageId = (Date.now() + 1).toString();
    
    // Add empty message
    setMessages(prev => [...prev, { id: newMessageId, sender: 'assistant', text: '' }]);

    let currentLength = 0;
    const increment = Math.ceil(fullText.length / 50) || 1; // Stream in roughly 50 steps
    
    const interval = setInterval(() => {
      currentLength += increment;
      if (currentLength >= fullText.length) {
        setMessages(prev => {
          const completed = prev.map(m => m.id === newMessageId ? { ...m, text: fullText } : m);
          saveHistory(completed);
          return completed;
        });
        clearInterval(interval);
      } else {
        setMessages(prev => prev.map(m => 
          m.id === newMessageId ? { ...m, text: fullText.slice(0, currentLength) } : m
        ));
      }
    }, 15);
  };

  const clearHistory = () => {
    if (confirm("Reset conversation history?")) {
      const welcomeText = sessionUser?.role === 'EMPLOYEE'
        ? `Hi **${sessionUser.name}**! I am your **Pinkman Protects Security Assistant**. I can help you review your training progress and learn how to recognize phishing threats.`
        : `Hello Administrator! I am your **Pinkman Protects SecOps AI Assistant**. I analyze live simulated campaigns and employee risk scores to provide actionable insights.`;
      const resetMsg: Message[] = [{ id: 'welcome', sender: 'assistant', text: welcomeText }];
      setMessages(resetMsg);
      saveHistory(resetMsg);
    }
  };

  const executeQuickAction = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  const filteredTopics = KNOWLEDGE_BASE_TOPICS.filter(t => 
    t.title.toLowerCase().includes(kbSearch.toLowerCase()) || 
    t.summary.toLowerCase().includes(kbSearch.toLowerCase()) ||
    t.content.toLowerCase().includes(kbSearch.toLowerCase())
  );

  if (!sessionUser) return null;

  const isAdmin = sessionUser.role !== 'EMPLOYEE';

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#050505] hover:bg-[#121212] text-white border border-[#1F1F1F] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {isOpen ? (
            <X size={20} className="rotate-90 transition-transform duration-200" />
          ) : (
            <>
              <Bot size={20} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00D26A] text-[7px] font-bold text-black flex items-center justify-center">AI</span>
            </>
          )}
        </button>
      </div>

      {/* Main AI Chat Widget Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-20 right-6 z-40 bg-[#050505] border border-[#1F1F1F] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
              isMaximized ? 'w-[85vw] h-[80vh] md:w-[60vw]' : 'w-[92vw] h-[70vh] sm:w-[420px] sm:h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#1F1F1F] bg-[#121212] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0A0A0A] border border-[#1F1F1F] flex items-center justify-center text-white">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wider font-mono">PINKMAN SECURE AI</h3>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block">SecOps Node Active</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  title={isMaximized ? "Minimize View" : "Maximize View"}
                  className="p-1.5 rounded border border-[#1F1F1F] hover:bg-white/5 text-zinc-400 hover:text-white transition"
                >
                  {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded border border-[#1F1F1F] hover:bg-white/5 text-zinc-400 hover:text-white transition"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-[#1F1F1F] bg-[#0A0A0A] text-xs font-mono">
              <button
                onClick={() => { setActiveTab('chat'); setSelectedKbTopic(null); }}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'chat' 
                    ? 'border-b-2 border-white text-white font-semibold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                AI CHAT PANEL
              </button>
              <button
                onClick={() => setActiveTab('knowledge_base')}
                className={`flex-1 py-2.5 text-center transition ${
                  activeTab === 'knowledge_base' 
                    ? 'border-b-2 border-white text-white font-semibold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                SECURITY KB
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-[#121212] border-b border-[#1F1F1F] p-3 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 whitespace-nowrap text-[10px] font-mono">
                {isAdmin ? (
                  <>
                    <button 
                      onClick={() => executeQuickAction('/admin/campaigns')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={10} /> Create Campaign
                    </button>
                    <button 
                      onClick={() => executeQuickAction('/admin/reports')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileText size={10} /> Generate Report
                    </button>
                    <button 
                      onClick={() => executeQuickAction('/admin/settings')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Settings size={10} /> Assign Training
                    </button>
                    <button 
                      onClick={() => executeQuickAction('/admin/employees')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <Users size={10} /> High Risk Emps
                    </button>
                    <button 
                      onClick={() => executeQuickAction('/admin/analytics')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <BarChart3 size={10} /> Open Analytics
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => executeQuickAction('/learning')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C1C] transition flex items-center gap-1 cursor-pointer"
                    >
                      <GraduationCap size={10} /> Open Learning Center
                    </button>
                    <button 
                      onClick={() => handleSend('Email safety tips')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-350 hover:border-zinc-700 hover:bg-[#1C1C1C] transition cursor-pointer"
                    >
                      ✉️ Email Safety Tips
                    </button>
                    <button 
                      onClick={() => handleSend('Password best practices')} 
                      className="px-2.5 py-1 rounded border border-[#1F1F1F] bg-[#0A0A0A] text-zinc-350 hover:border-zinc-700 hover:bg-[#1C1C1C] transition cursor-pointer"
                    >
                      🔒 Password Security
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Chat Tab Content */}
            {activeTab === 'chat' && (
              <>
                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A] scrollbar-thin">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs ${
                        msg.sender === 'user'
                          ? 'bg-white text-black rounded-br-none font-medium'
                          : 'bg-[#121212] border border-[#1F1F1F] text-zinc-200 rounded-bl-none'
                      }`}>
                        {msg.sender === 'assistant' ? (
                          parseMessageText(msg.text)
                        ) : (
                          <p className="leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-[#121212] border border-[#1F1F1F] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-550 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-550 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-550 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions & Clear History */}
                <div className="px-4 py-2 border-t border-[#1F1F1F] bg-[#0A0A0A] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                    <span>Suggested Prompts</span>
                    <button 
                      onClick={clearHistory} 
                      className="hover:text-white transition text-[9px] underline decoration-dotted cursor-pointer"
                    >
                      Clear Log
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-[10px] text-zinc-400 hover:text-white px-2.5 py-1.5 rounded border border-[#1F1F1F] bg-[#0A0A0A] hover:border-zinc-700 transition font-mono cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                  className="p-3 border-t border-[#1F1F1F] bg-[#121212] flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask security assistant..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] text-white focus:outline-none focus:border-zinc-700 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </>
            )}

            {/* Knowledge Base Tab Content */}
            {activeTab === 'knowledge_base' && (
              <div className="flex-1 flex flex-col bg-[#0A0A0A] overflow-hidden">
                {selectedKbTopic ? (
                  /* Topic Detail View */
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                    <button
                      onClick={() => setSelectedKbTopic(null)}
                      className="text-[10px] font-mono text-white hover:underline flex items-center gap-1.5 uppercase cursor-pointer"
                    >
                      ← Back to Catalog
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">{selectedKbTopic.title}</h2>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase">Vulnerability Profile</p>
                    </div>
                    
                    <div className="p-4 rounded-lg border border-[#1F1F1F] bg-[#121212] text-xs leading-relaxed text-zinc-300 space-y-3 font-mono">
                      {selectedKbTopic.content.split('\n').map((para, i) => {
                        let content = para;
                        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        content = content.replace(/-\s\*\*(.*?)\*\*/g, '• <strong>$1</strong>');
                        return <p key={i} dangerouslySetInnerHTML={{ __html: content }} />;
                      })}
                    </div>

                    <button
                      onClick={() => {
                        handleSend(`Tell me more about ${selectedKbTopic.title}`);
                        setActiveTab('chat');
                      }}
                      className="w-full py-2.5 rounded-lg border border-[#1F1F1F] hover:border-zinc-700 bg-[#121212] text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Ask AI about {selectedKbTopic.title} <ArrowRight size={12} />
                    </button>
                  </div>
                ) : (
                  /* Topic Catalog List */
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search Field */}
                    <div className="p-3 border-b border-[#1F1F1F] bg-[#121212] flex items-center gap-2">
                      <Search size={14} className="text-zinc-500 shrink-0" />
                      <input
                        type="text"
                        value={kbSearch}
                        onChange={(e) => setKbSearch(e.target.value)}
                        placeholder="Search threat profiles (e.g. UPI, Social Engineering)..."
                        className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                      />
                      {kbSearch && (
                        <button onClick={() => setKbSearch('')} className="text-zinc-500 hover:text-white cursor-pointer">
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Catalog List Scroll */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
                      {filteredTopics.length === 0 ? (
                        <div className="text-center py-10 text-zinc-500 text-xs font-mono">
                          <AlertTriangle size={24} className="mx-auto text-zinc-650 mb-2" />
                          No threat profiles matched search query.
                        </div>
                      ) : (
                        filteredTopics.map((topic, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedKbTopic(topic)}
                            className="p-3 rounded-lg border border-[#1F1F1F] bg-[#121212]/50 hover:border-zinc-700 hover:bg-[#121212] transition cursor-pointer flex items-center justify-between group"
                          >
                            <div className="space-y-1 pr-4">
                              <h4 className="text-xs font-bold text-white group-hover:text-white transition font-mono uppercase">{topic.title}</h4>
                              <p className="text-[10px] text-zinc-500 line-clamp-1 font-mono leading-relaxed">{topic.summary}</p>
                            </div>
                            <ChevronRight size={14} className="text-zinc-500 group-hover:text-white transition shrink-0" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
