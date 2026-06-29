'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
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
  ChevronRight,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Activity
} from 'lucide-react';

interface Notification {
  id: string;
  category: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  timestamp: string;
}

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All' },
  { id: 'SECURITY_ALERT', label: 'Alerts' },
  { id: 'CAMPAIGN', label: 'Campaigns' },
  { id: 'LEARNING', label: 'Learning' },
  { id: 'AI_RECOMMENDATION', label: 'AI Recommendations' },
  { id: 'REPORT', label: 'Reports' }
];

export default function NotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastAlert, setToastAlert] = useState<Notification | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async (cat = activeCategory, search = searchQuery, pageNum = page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?category=${cat}&search=${search}&page=${pageNum}&limit=6`);
      const data = await response.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
    setLoading(false);
  };

  // Run initial fetch and configure live updates
  useEffect(() => {
    fetchNotifications();

    // Live Activity Ticker: simulates a new notification alert arriving dynamically every 45s
    const liveInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'createMock' })
        });
        const data = await response.json();
        
        if (data.success && data.notification) {
          // Trigger a beautiful visual alert on screen
          setToastAlert(data.notification);
          // Refresh lists
          fetchNotifications(activeCategory, searchQuery, page);
          
          // Clear toast after 6 seconds
          setTimeout(() => {
            setToastAlert(null);
          }, 6000);
        }
      } catch (err) {
        console.error("Live notification ticker error:", err);
      }
    }, 45 * 1000);

    return () => clearInterval(liveInterval);
  }, []);

  // Re-fetch when category, search, or page changes
  useEffect(() => {
    fetchNotifications(activeCategory, searchQuery, page);
  }, [activeCategory, page]);

  // Click outside drawer to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        // Only close if it didn't click the bell toggle button
        const isBellBtn = (e.target as HTMLElement).closest('.bell-toggle');
        if (!isBellBtn) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

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
      fetchNotifications(activeCategory, searchQuery, page);
    } catch (e) {
      console.error(e);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CAMPAIGN':
        return <Send size={14} className="text-[#00FF88]" />;
      case 'SECURITY_ALERT':
        return <ShieldAlert size={14} className="text-[#00D26A] shadow-[0_0_8px_rgba(0,255,136,0.2)] animate-pulse" />;
      case 'LEARNING':
        return <GraduationCap size={14} className="text-[#A8A8A8]" />;
      case 'QUIZ':
        return <ClipboardList size={14} className="text-[#A8A8A8]" />;
      case 'AI_RECOMMENDATION':
        return <Sparkles size={14} className="text-[#00FF88]" />;
      case 'REPORT':
        return <FileText size={14} className="text-gray-400" />;
      case 'MILESTONE':
        return <Award size={14} className="text-emerald-500" />;
      case 'ANNOUNCEMENT':
        return <Volume2 size={14} className="text-amber-500" />;
      default:
        return <Settings size={14} className="text-gray-500" />;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-green-950/40 border border-[#00FF88]/50 text-[#00FF88] font-bold shadow-[0_0_10px_rgba(0,255,136,0.2)] animate-pulse';
      case 'HIGH':
        return 'bg-green-950/20 border border-[#00FF88]/30 text-[#00FF88] font-semibold';
      case 'MEDIUM':
        return 'bg-amber-950/20 border border-amber-500/30 text-amber-500';
      default:
        return 'bg-[#181818] border border-[#232323] text-gray-400';
    }
  };

  // Convert timestamp to human-friendly local format
  const formatTime = (timeStr: string) => {
    try {
      const now = new Date();
      const past = new Date(timeStr);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return past.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  };

  return (
    <>
      {/* Bell Toggle Icon */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bell-toggle p-2 rounded-xl border border-[#232323] bg-black/40 hover:bg-[#181818] text-gray-400 hover:text-white transition duration-200 relative"
          title="Notification Alerts"
        >
          <Bell size={15} className={unreadCount > 0 ? "animate-swing" : ""} />
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-[#00FF88] border border-[#050505] text-[9px] font-bold text-black flex items-center justify-center font-mono shadow-[0_0_8px_rgba(0,255,136,0.5)]"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Live Toast Alert pop-up */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-20 right-6 z-50 w-80 bg-[#141414] border border-[#00FF88]/40 rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,136,0.15)] backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-950/20 text-[#00FF88] border border-[#00FF88]/20 shrink-0">
                <Activity size={16} className="animate-pulse" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#00FF88] uppercase tracking-widest font-bold">Real-time alert</span>
                  <span className="text-[8px] font-mono text-gray-500">{formatTime(toastAlert.timestamp)}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight font-mono">{toastAlert.title}</h4>
                <p className="text-[10px] text-gray-400 leading-normal">{toastAlert.message}</p>
              </div>
              <button onClick={() => setToastAlert(null)} className="text-gray-500 hover:text-white shrink-0">
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Sliding Drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-40 hidden md:block"
            />

            {/* Sliding Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#0E0E0E]/95 border-l border-[#232323] shadow-2xl backdrop-blur-xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-[#232323] bg-[#141414] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white font-mono tracking-wider">NOTIFICATION HUB</h3>
                  <span className="px-2 py-0.5 rounded-full bg-green-950/20 border border-[#00FF88]/20 text-[#00FF88] text-[9px] font-mono font-bold">
                    {unreadCount} UNREAD
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-mono text-gray-400 hover:text-[#00FF88] transition underline decoration-dotted decoration-[#00FF88]"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg border border-[#232323] hover:bg-white/5 text-gray-400 hover:text-white transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Tabs */}
              <div className="p-4 border-b border-[#232323] bg-[#0A0A0A] space-y-3">
                {/* Search field */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#232323] bg-[#121212] text-xs font-mono">
                  <Search size={12} className="text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); fetchNotifications(activeCategory, e.target.value, 1); }}
                    placeholder="Search logs..."
                    className="flex-1 bg-transparent focus:outline-none text-white text-[11px]"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setPage(1); fetchNotifications(activeCategory, '', 1); }}>
                      <X size={10} className="text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Filters slider */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  {CATEGORY_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveCategory(tab.id); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono uppercase transition ${
                        activeCategory === tab.id
                          ? 'border-[#00FF88] bg-green-950/10 text-white font-bold'
                          : 'border-[#232323] bg-[#121212] text-gray-500 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications Timeline List */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A0A] space-y-3 scrollbar-thin">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="w-6 h-6 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Synchronizing Alerts...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  /* Empty state */
                  <div className="text-center py-20 space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#232323] bg-[#121212]/50 flex items-center justify-center mx-auto text-gray-600">
                      <Bell size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-white font-mono uppercase">Vigilance Clear</p>
                      <p className="text-[10px] text-gray-500 leading-normal max-w-[240px] mx-auto">No notifications found in this configuration context.</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                        className={`p-3.5 rounded-xl border transition duration-200 cursor-pointer relative group ${
                          notif.isRead 
                            ? 'bg-[#121212]/45 border-[#1F1F1F] hover:border-white/10' 
                            : 'bg-[#141414] border-[#1F1F1F] hover:border-zinc-700 shadow-none'
                        }`}
                      >
                        {/* Compliance dot for unread */}
                        {!notif.isRead && (
                          <span className="absolute top-3.5 right-3.5 w-1 h-1 rounded-full bg-[#00D26A]" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Icon wrapper */}
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 border ${
                            notif.isRead ? 'bg-[#181818] border-[#2d2d2d]' : 'bg-[#121212] border-[#1F1F1F]'
                          }`}>
                            {getCategoryIcon(notif.category)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-1 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${getPriorityBadgeClass(notif.priority)}`}>
                                {notif.priority}
                              </span>
                              <span className="text-[8px] font-mono text-gray-500">{formatTime(notif.timestamp)}</span>
                            </div>
                            
                            <h4 className={`text-xs font-bold font-mono tracking-wide ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                               {notif.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{notif.message}</p>
                          </div>
                        </div>

                        {/* Inline actions (appear on hover) */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                              className="p-1 rounded bg-[#1c1c1c] border border-[#2d2d2d] text-gray-500 hover:text-white transition"
                              title="Mark read"
                            >
                              <Check size={10} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                            className="p-1 rounded bg-[#1c1c1c] border border-[#2d2d2d] text-gray-500 hover:text-[#00FF88] transition"
                            title="Delete alert"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Drawer Footer with Pagination & Link */}
              <div className="px-5 py-4 border-t border-[#232323] bg-[#141414] space-y-3">
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <button 
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="px-2 py-1 rounded bg-[#1c1c1c] border border-[#232323] disabled:opacity-40 hover:text-white transition"
                    >
                      PREV
                    </button>
                    <span>PAGE {page} OF {totalPages}</span>
                    <button 
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="px-2 py-1 rounded bg-[#1c1c1c] border border-[#232323] disabled:opacity-40 hover:text-white transition"
                    >
                      NEXT
                    </button>
                  </div>
                )}

                <button
                  onClick={() => { setIsOpen(false); router.push('/notifications'); }}
                  className="w-full py-2.5 rounded-xl bg-[#00FF88] hover:bg-[#00D26A] text-black font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,255,136,0.25)] transition-all flex items-center justify-center gap-1.5"
                >
                  FULL HISTORY & PREFERENCES <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
