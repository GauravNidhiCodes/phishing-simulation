'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Trash2, 
  Check, 
  Search, 
  Send, 
  ShieldAlert, 
  GraduationCap, 
  ClipboardList, 
  Sparkles, 
  FileText, 
  Award, 
  Volume2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import PreferencesPanel from '@/components/notifications/PreferencesPanel';

interface Notification {
  id: string;
  category: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  timestamp: string;
}

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'SECURITY_ALERT', label: 'Security Alerts' },
  { id: 'CAMPAIGN', label: 'Phishing Campaigns' },
  { id: 'LEARNING', label: 'Learning Center' },
  { id: 'AI_RECOMMENDATION', label: 'AI Insights' },
  { id: 'REPORT', label: 'Compliance Reports' },
  { id: 'SYSTEM', label: 'System Alerts' }
];

const PRIORITIES = [
  { id: 'ALL', label: 'All Priorities' },
  { id: 'CRITICAL', label: 'Critical' },
  { id: 'HIGH', label: 'High' },
  { id: 'MEDIUM', label: 'Medium' },
  { id: 'LOW', label: 'Low' }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activePriority, setActivePriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications list
  const fetchNotifications = async (cat = activeCategory, pri = activePriority, search = searchQuery, pageNum = page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?category=${cat}&priority=${pri}&search=${search}&page=${pageNum}&limit=8`);
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeCategory, activePriority, page]);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', id })
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      fetchNotifications(activeCategory, activePriority, searchQuery, page);
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CAMPAIGN':
        return <Send size={15} className="text-[#00FF88]" />;
      case 'SECURITY_ALERT':
        return <ShieldAlert size={15} className="text-[#00D26A] shadow-[0_0_8px_rgba(0,255,136,0.2)] animate-pulse" />;
      case 'LEARNING':
        return <GraduationCap size={15} className="text-[#A8A8A8]" />;
      case 'QUIZ':
        return <ClipboardList size={15} className="text-[#A8A8A8]" />;
      case 'AI_RECOMMENDATION':
        return <Sparkles size={15} className="text-[#00FF88]" />;
      case 'REPORT':
        return <FileText size={15} className="text-gray-400" />;
      case 'MILESTONE':
        return <Award size={15} className="text-emerald-500" />;
      case 'ANNOUNCEMENT':
        return <Volume2 size={15} className="text-amber-500" />;
      default:
        return <Settings size={15} className="text-gray-500" />;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-zinc-800 border border-[#1F1F1F] text-white font-bold';
      case 'HIGH':
        return 'bg-zinc-900 border border-[#1F1F1F] text-zinc-300 font-semibold';
      case 'MEDIUM':
        return 'bg-zinc-950 border border-[#1F1F1F] text-zinc-400';
      default:
        return 'bg-[#181818] border border-[#2d2d2d] text-zinc-500';
    }
  };

  const formatFullDate = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }) + ' IST';
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F1F1F] pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight uppercase font-mono text-white">
            Notification Center
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Monitor simulation outcomes, AI security insights, and training compliance reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 rounded-lg border border-[#1F1F1F] bg-[#121212] hover:border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent transition text-xs font-mono flex items-center gap-2"
          >
            <CheckSquare size={12} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Main Grid: Left (List logs), Right (Preferences) */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: History Log list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Filtering Controls Card */}
          <div className="p-4 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-4">
            
            {/* Search and priority selects */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] text-xs font-mono">
                <Search size={14} className="text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); fetchNotifications(activeCategory, activePriority, e.target.value, 1); }}
                  placeholder="Search alert messages or keywords..."
                  className="flex-1 bg-transparent focus:outline-none text-white text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] text-xs font-mono text-gray-400">
                <Filter size={12} className="text-zinc-500" />
                <select
                  value={activePriority}
                  onChange={(e) => { setActivePriority(e.target.value); setPage(1); }}
                  className="flex-1 bg-transparent focus:outline-none text-white text-[11px] cursor-pointer"
                >
                  {PRIORITIES.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#141414]">{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category selection bar */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition shrink-0 ${
                    activeCategory === cat.id
                      ? 'border-white bg-white/[0.05] text-white font-bold'
                      : 'border-[#1F1F1F] bg-[#0A0A0A] text-zinc-500 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* List display */}
          <div className="space-y-4">
            
            {loading ? (
              <div className="p-20 border border-[#1F1F1F] bg-[#121212] rounded-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-6 h-6 border border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Querying Notifications database...</span>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty state */
              <div className="p-20 border border-[#1F1F1F] bg-[#121212] rounded-xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#1F1F1F] bg-[#0A0A0A] flex items-center justify-center mx-auto text-zinc-650">
                  <Bell size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white font-mono uppercase tracking-wider">No Security Incidents</p>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px] mx-auto">No notifications matched the selected filter metrics or search criteria.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 border rounded-xl transition duration-200 relative group flex items-start gap-4 ${
                        notif.isRead 
                          ? 'bg-[#121212]/50 border-[#1F1F1F] hover:border-white/5' 
                          : 'bg-[#121212] border-white/20 hover:border-zinc-700'
                      }`}
                    >
                      {/* Left icon */}
                      <div className={`p-2.5 rounded-lg border shrink-0 mt-0.5 ${
                        notif.isRead ? 'bg-[#1c1c1c] border-[#2d2d2d]' : 'bg-[#0A0A0A] border-[#1F1F1F]'
                      }`}>
                        {getCategoryIcon(notif.category)}
                      </div>

                      {/* Content details */}
                      <div className="flex-1 space-y-1 pr-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold ${getPriorityBadgeClass(notif.priority)}`}>
                            {notif.priority}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">ID: {notif.id}</span>
                          <span className="text-[9px] font-mono text-zinc-500">•</span>
                          <span className="text-[9px] font-mono text-zinc-500">{formatFullDate(notif.timestamp)}</span>
                        </div>

                        <h3 className={`text-xs font-bold font-mono tracking-wide mt-1.5 ${notif.isRead ? 'text-zinc-400' : 'text-white'}`}>
                          {notif.title}
                        </h3>
                        <p className="text-xs text-zinc-500 leading-relaxed font-sans">{notif.message}</p>
                      </div>

                      {/* Right hover actions */}
                      <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="p-1.5 rounded-lg bg-[#1c1c1c] border border-[#2d2d2d] text-gray-500 hover:text-white hover:border-white transition"
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-1.5 rounded-lg bg-[#1c1c1c] border border-[#2d2d2d] text-gray-500 hover:text-white transition"
                          title="Delete alert"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pagination bar */}
                {totalPages > 1 && (
                  <div className="pt-4 flex items-center justify-between border-t border-[#1F1F1F] text-xs font-mono text-zinc-500">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-lg bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-[#1F1F1F] text-white transition"
                    >
                      ← Previous Page
                    </button>
                    <span>PAGE {page} OF {totalPages} ({totalCount} TOTAL ITEMS)</span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-lg bg-[#121212] border border-[#1F1F1F] hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-[#1F1F1F] text-white transition"
                    >
                      Next Page →
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Right Col: Preferences Setup panel */}
        <div className="space-y-6">
          <PreferencesPanel />
          
          {/* Extra system alerts tip card */}
          <div className="p-5 border border-[#1F1F1F] bg-[#121212] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-white">
              <AlertTriangle size={14} />
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider">SecOps Notice</h4>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              System alerts are aggregated in real-time. Critical incidents (e.g. simulation failures and severe department score regressions) bypass preferences and are routed via top-bar dashboard notices.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
