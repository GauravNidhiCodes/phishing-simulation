"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Send, X, Maximize2, Minimize2, Plus, FileText, Settings, Users,
  BarChart3, GraduationCap, Sparkles, ChevronRight, ArrowRight,
  AlertTriangle, Search, ShieldCheck, Lock, Mail, Trash2, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message { id: string; sender: "user" | "assistant"; text: string; }

const KNOWLEDGE_BASE_TOPICS = [
  { topic: "phishing", title: "Phishing", summary: "Deceptive emails engineered to steal credentials or inject malware.", content: "Phishing is a social engineering attack where bad actors impersonate legitimate institutions to steal credentials or sensitive data. Always verify sender domains (e.g., check for minor typos) and inspect full URLs before clicking any link." },
  { topic: "malware", title: "Malware", summary: "Malicious code designed to damage systems or compromise data security.", content: "Malware includes spyware, keyloggers, and viruses. It is commonly delivered via unexpected email attachments or unauthorized software downloads. Maintain active endpoint security scanners and avoid execution of files from unknown sources." },
  { topic: "social engineering", title: "Social Engineering", summary: "Human trust exploitation to bypass structural security protocols.", content: "Social engineering targets human vulnerabilities rather than network software. Tactics include impersonation (e.g., impersonating IT staff on phone calls), intimidation, and pretexting. Verify any sensitive instructions via a secondary trusted channel." },
  { topic: "ransomware", title: "Ransomware", summary: "Cryptographic locking of corporate directories for payment extraction.", content: "Ransomware locks critical files and systems, demanding digital currency ransom for recovery. Best defenses include automated off-network database backups, web filters, and avoiding access to external public drives." },
  { topic: "password security", title: "Password Security", summary: "Enforcements to safeguard passwords and prevent credential hacks.", content: 'Weak, shared, or reused passwords are prime targets. Use passphrases comprising multiple random words (e.g., "Mumb@i-Rain-Te@-2026") which are extremely difficult to crack via brute force but easy for humans to memorize.' },
  { topic: "mfa", title: "MFA", summary: "Multi-Factor Authentication adds essential secondary validation.", content: "MFA ensures that even if credentials are leaked, access remains secured. Use authenticator app TOTPs or FIDO2 keys. Never approve authorization requests or push alerts that you did not explicitly trigger." },
  { topic: "safe browsing", title: "Safe Browsing", summary: "Secure browsing practices to limit web page download hazards.", content: "Only log into secure HTTPS web domains. Be cautious of unsolicited popups warning of system viruses, and do not authorize non-store browser extension installations." },
  { topic: "upi fraud", title: "UPI Fraud", summary: "Fraudulent UPI PIN requests masquerading as incoming money.", content: "UPI transactions (GPay, PhonePe, Paytm) require PIN entry ONLY to send or debit money, NEVER to receive funds. Immediately decline any payment collect requests received from unknown contacts." },
  { topic: "qr scam", title: "QR Scam", summary: "Tampered QR codes directing users to fraudulent payment screens.", content: "Attackers print replacement QR stickers or share malicious codes via chat. Scanning them initiates account authorization or money transfer. Always confirm the merchant legal name matches on screen before approving." },
  { topic: "email fraud", title: "Email Fraud", summary: "Header spoofing simulating internal executive instruction alerts.", content: "Email spoofing masks the header domain to appear as an internal CEO, HR, or finance sender. If asked to perform urgent fund transfers or change bank account info, verify verbally with the sender over a phone call first." },
];

const kbIcon = (topic: string) => {
  switch (topic) {
    case "password security": return <Lock size={15} />;
    case "mfa": return <ShieldCheck size={15} />;
    case "email fraud": case "phishing": return <Mail size={15} />;
    default: return <AlertTriangle size={15} />;
  }
};

export default function AIAssistant() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge_base">("chat");
  const [sessionUser, setSessionUser] = useState<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const [kbSearch, setKbSearch] = useState("");
  const [selectedKbTopic, setSelectedKbTopic] = useState<typeof KNOWLEDGE_BASE_TOPICS[0] | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
          initializeAssistant(data.user);
        }
      })
      .catch((err) => console.error("AI Assistant session fetch error:", err));
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  useEffect(() => {
    if (sessionUser) {
      const historyKey = `pinkman_ai_chat_${sessionUser.email}`;
      const saved = localStorage.getItem(historyKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const welcomeText = sessionUser.role === "EMPLOYEE"
          ? `Hi **${sessionUser.name}** — I'm your security assistant. Ask me about your training, or how to spot a phishing attempt. What's on your mind?`
          : `Welcome back. I'm your SecOps assistant. I read your live campaigns and risk scores to surface what matters. What would you like to look into?`;
        setMessages([{ id: "welcome", sender: "assistant", text: welcomeText }]);
      }
    }
  }, [sessionUser]);

  const saveHistory = (newMessages: Message[]) => {
    if (sessionUser) localStorage.setItem(`pinkman_ai_chat_${sessionUser.email}`, JSON.stringify(newMessages));
  };

  const initializeAssistant = (user: any) => {
    if (user.role === "EMPLOYEE") {
      setSuggestedQuestions(["Why did I fail?", "How can I improve?", "Recommend courses.", "Explain phishing indicators.", "Explain suspicious links."]);
    } else {
      setSuggestedQuestions(["Which department is most vulnerable?", "Who needs immediate training?", "Summarize this month's campaigns.", "Which branch improved the most?", "Generate executive summary."]);
    }
  };

  const parseMessageText = (text: string) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      let content = line;
      content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-ink'>$1</strong>");
      content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");
      content = content.replace(/`(.*?)`/g, "<code class='rounded bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-ink border border-line'>$1</code>");
      if (line.startsWith("# ")) return <h1 key={idx} className="mb-2 mt-3 text-[15px] font-semibold text-ink" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
      if (line.startsWith("## ")) return <h2 key={idx} className="mb-1.5 mt-3 text-[14px] font-semibold text-ink" dangerouslySetInnerHTML={{ __html: content.substring(3) }} />;
      if (line.startsWith("### ")) return <h3 key={idx} className="mb-1 mt-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-soft" dangerouslySetInnerHTML={{ __html: content.substring(4) }} />;
      if (line.startsWith("- ") || line.startsWith("* ")) return <li key={idx} className="my-1 ml-4 list-disc text-[13px] leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
      return <p key={idx} className="my-1.5 text-[13px] leading-relaxed text-ink-soft" dangerouslySetInnerHTML={{ __html: content }} />;
    });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveHistory(updatedMessages);
    setInput("");
    setIsTyping(true);
    try {
      const response = await fetch("/api/ai-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: textToSend }) });
      const data = await response.json();
      if (data.response) {
        streamResponse(data.response);
      } else {
        setIsTyping(false);
        const errMessage: Message = { id: Date.now().toString(), sender: "assistant", text: "I hit a snag reaching the analytics engine. Mind asking again?" };
        setMessages((prev) => { const m = [...prev, errMessage]; saveHistory(m); return m; });
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      const errMessage: Message = { id: Date.now().toString(), sender: "assistant", text: "I couldn't reach the assistant just now. Please try again." };
      setMessages((prev) => { const m = [...prev, errMessage]; saveHistory(m); return m; });
    }
  };

  const streamResponse = (fullText: string) => {
    setIsTyping(false);
    const newMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: newMessageId, sender: "assistant", text: "" }]);
    let currentLength = 0;
    const increment = Math.ceil(fullText.length / 50) || 1;
    const interval = setInterval(() => {
      currentLength += increment;
      if (currentLength >= fullText.length) {
        setMessages((prev) => { const completed = prev.map((m) => (m.id === newMessageId ? { ...m, text: fullText } : m)); saveHistory(completed); return completed; });
        clearInterval(interval);
      } else {
        setMessages((prev) => prev.map((m) => (m.id === newMessageId ? { ...m, text: fullText.slice(0, currentLength) } : m)));
      }
    }, 15);
  };

  const clearHistory = () => {
    if (confirm("Start a fresh conversation?")) {
      const welcomeText = sessionUser?.role === "EMPLOYEE"
        ? `Hi **${sessionUser.name}** — I'm your security assistant. Ask me anything about your training or spotting threats.`
        : `Welcome back. I'm your SecOps assistant. What would you like to look into?`;
      const resetMsg: Message[] = [{ id: "welcome", sender: "assistant", text: welcomeText }];
      setMessages(resetMsg);
      saveHistory(resetMsg);
    }
  };

  const executeQuickAction = (route: string) => { setIsOpen(false); router.push(route); };

  const filteredTopics = KNOWLEDGE_BASE_TOPICS.filter((t) =>
    t.title.toLowerCase().includes(kbSearch.toLowerCase()) || t.summary.toLowerCase().includes(kbSearch.toLowerCase()) || t.content.toLowerCase().includes(kbSearch.toLowerCase())
  );

  if (!sessionUser) return null;
  const isAdmin = sessionUser.role !== "EMPLOYEE";

  const quickActions = isAdmin
    ? [
        { icon: <Plus size={13} />, label: "New campaign", action: () => executeQuickAction("/admin/campaigns") },
        { icon: <FileText size={13} />, label: "Reports", action: () => executeQuickAction("/admin/reports") },
        { icon: <Settings size={13} />, label: "Assign training", action: () => executeQuickAction("/admin/settings") },
        { icon: <Users size={13} />, label: "High risk", action: () => executeQuickAction("/admin/employees") },
        { icon: <BarChart3 size={13} />, label: "Analytics", action: () => executeQuickAction("/admin/analytics") },
      ]
    : [
        { icon: <GraduationCap size={13} />, label: "Learning center", action: () => executeQuickAction("/learning") },
        { icon: <Mail size={13} />, label: "Email safety", action: () => handleSend("Email safety tips") },
        { icon: <Lock size={13} />, label: "Passwords", action: () => handleSend("Password best practices") },
      ];

  return (
    <>
      {}
      <div className="fixed bottom-6 right-6 z-[55]">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] transition-colors hover:border-line-strong"
          aria-label="AI assistant"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
            ) : (
              <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} className="text-accent"><Sparkles size={20} /></motion.span>
            )}
          </AnimatePresence>
          {!isOpen && <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" /></span>}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className={cn(
              "fixed bottom-20 right-6 z-[54] flex flex-col overflow-hidden rounded-[18px] border border-line bg-card shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]",
              isMaximized ? "h-[80vh] w-[85vw] md:w-[60vw]" : "h-[70vh] w-[92vw] sm:h-[600px] sm:w-[420px]"
            )}
          >
            {}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-accent/25 bg-accent-faint text-accent"><Sparkles size={16} /></span>
                <div>
                  <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">Security assistant</h3>
                  <span className="flex items-center gap-1.5 text-[11.5px] text-ink-faint"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Online</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setIsMaximized(!isMaximized)} title={isMaximized ? "Minimize" : "Maximize"} className="focus-ring flex h-7 w-7 items-center justify-center rounded-[8px] text-ink-faint hover:bg-white/[0.05] hover:text-ink">{isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={() => setIsOpen(false)} className="focus-ring flex h-7 w-7 items-center justify-center rounded-[8px] text-ink-faint hover:bg-white/[0.05] hover:text-ink"><X size={15} /></button>
              </div>
            </div>

            {}
            <div className="flex border-b border-line px-2">
              {([["chat", "Chat"], ["knowledge_base", "Threat library"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => { setActiveTab(id); if (id === "chat") setSelectedKbTopic(null); }} className={cn("relative px-4 py-3 text-[13px] font-medium transition-colors", activeTab === id ? "text-ink" : "text-ink-faint hover:text-ink-soft")}>
                  {label}
                  {activeTab === id && <motion.span layoutId="aiTab" className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent" />}
                </button>
              ))}
            </div>

            {activeTab === "chat" && (
              <>
                {}
                <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-line px-4 py-2.5">
                  {quickActions.map((qa, idx) => (
                    <button key={idx} onClick={qa.action} className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-inset px-3 py-1.5 text-[12px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink">
                      {qa.icon} {qa.label}
                    </button>
                  ))}
                </div>

                {}
                <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[85%] rounded-[14px] px-4 py-2.5 text-[13px]", msg.sender === "user" ? "rounded-br-[4px] bg-accent font-medium text-black" : "rounded-bl-[4px] border border-line bg-inset")}>
                        {msg.sender === "assistant" ? parseMessageText(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-[14px] rounded-bl-[4px] border border-line bg-inset px-4 py-3.5">
                        {[0, 150, 300].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: `${d}ms` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {}
                <div className="space-y-2 border-t border-line px-4 py-2.5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.06em] text-ink-faint">
                    <span>Try asking</span>
                    <button onClick={clearHistory} className="flex items-center gap-1 text-ink-faint transition-colors hover:text-ink"><Trash2 size={11} /> Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedQuestions.map((q, idx) => (
                      <button key={idx} onClick={() => handleSend(q)} className="rounded-full border border-line bg-inset px-2.5 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-line-strong hover:text-ink">{q}</button>
                    ))}
                  </div>
                </div>

                {}
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2 border-t border-line p-3">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the assistant…" className="focus-ring h-10 flex-1 rounded-[10px] border border-line bg-inset px-3.5 text-[13px] text-ink placeholder:text-ink-faint" />
                  <button type="submit" disabled={!input.trim()} className="focus-ring flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-black transition-opacity hover:opacity-90 disabled:opacity-40"><Send size={15} /></button>
                </form>
              </>
            )}

            {activeTab === "knowledge_base" && (
              <div className="flex flex-1 flex-col overflow-hidden">
                {selectedKbTopic ? (
                  <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5">
                    <button onClick={() => setSelectedKbTopic(null)} className="flex items-center gap-1.5 text-[12.5px] text-ink-soft transition-colors hover:text-ink"><ArrowLeft size={13} /> All threats</button>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-accent/25 bg-accent-faint text-accent">{kbIcon(selectedKbTopic.topic)}</span>
                      <div><h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{selectedKbTopic.title}</h2><p className="text-[12px] text-ink-faint">Threat profile</p></div>
                    </div>
                    <div className="rounded-[12px] border border-line bg-inset p-4 text-[13px] leading-relaxed text-ink-soft">
                      {selectedKbTopic.content.split("\n").map((para, i) => {
                        let content = para;
                        content = content.replace(/\*\*(.*?)\*\*/g, "<strong class='text-ink'>$1</strong>");
                        return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: content }} />;
                      })}
                    </div>
                    <button onClick={() => { handleSend(`Tell me more about ${selectedKbTopic.title}`); setActiveTab("chat"); }} className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-line bg-inset py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink">
                      Ask about {selectedKbTopic.title} <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="border-b border-line p-3">
                      <div className="flex h-10 items-center gap-2 rounded-[10px] border border-line bg-inset px-3 text-[13px]">
                        <Search size={15} className="text-ink-faint" />
                        <input type="text" value={kbSearch} onChange={(e) => setKbSearch(e.target.value)} placeholder="Search threats — UPI, phishing, MFA…" className="flex-1 bg-transparent text-ink placeholder:text-ink-faint focus:outline-none" />
                        {kbSearch && <button onClick={() => setKbSearch("")} className="text-ink-faint hover:text-ink"><X size={13} /></button>}
                      </div>
                    </div>
                    <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-3">
                      {filteredTopics.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12 text-center text-[13px] text-ink-faint"><AlertTriangle size={22} /> Nothing matched that search.</div>
                      ) : (
                        filteredTopics.map((topic, idx) => (
                          <button key={idx} onClick={() => setSelectedKbTopic(topic)} className="group flex w-full items-center gap-3 rounded-[12px] border border-line bg-inset p-3.5 text-left transition-colors hover:border-line-strong">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-ink-soft">{kbIcon(topic.topic)}</span>
                            <div className="min-w-0 flex-1"><h4 className="text-[13.5px] font-semibold text-ink">{topic.title}</h4><p className="truncate text-[12px] text-ink-faint">{topic.summary}</p></div>
                            <ChevronRight size={15} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
                          </button>
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
