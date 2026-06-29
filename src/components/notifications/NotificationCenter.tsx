"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bell, X, Check, Trash2, Search, Send, ShieldAlert, GraduationCap,
  ClipboardList, Sparkles, FileText, Award, Volume2, Settings,
  ArrowRight, Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string; category: string; title: string; message: string;
  priority: string; isRead: boolean; timestamp: string;
}

const CATEGORY_TABS = [
  { id: "ALL", label: "All" },
  { id: "SECURITY_ALERT", label: "Alerts" },
  { id: "CAMPAIGN", label: "Campaigns" },
  { id: "LEARNING", label: "Learning" },
  { id: "AI_RECOMMENDATION", label: "AI" },
  { id: "REPORT", label: "Reports" },
];

const categoryIcon = (category: string) => {
  switch (category) {
    case "CAMPAIGN": return <Send size={14} />;
    case "SECURITY_ALERT": return <ShieldAlert size={14} />;
    case "LEARNING": return <GraduationCap size={14} />;
    case "QUIZ": return <ClipboardList size={14} />;
    case "AI_RECOMMENDATION": return <Sparkles size={14} />;
    case "REPORT": return <FileText size={14} />;
    case "MILESTONE": return <Award size={14} />;
    case "ANNOUNCEMENT": return <Volume2 size={14} />;
    default: return <Settings size={14} />;
  }
};

const priorityTone = (p: string): "danger" | "warn" | "accent" | "muted" => {
  switch (p) {
    case "CRITICAL": return "danger";
    case "HIGH": return "warn";
    case "MEDIUM": return "accent";
    default: return "muted";
  }
};

export default function NotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastAlert, setToastAlert] = useState<Notification | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

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
    } catch (e) { console.error("Failed to load notifications:", e); }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const liveInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createMock" }) });
        const data = await response.json();
        if (data.success && data.notification) {
          setToastAlert(data.notification);
          fetchNotifications(activeCategory, searchQuery, page);
          setTimeout(() => setToastAlert(null), 6000);
        }
      } catch (err) { console.error("Live notification ticker error:", err); }
    }, 45 * 1000);
    return () => clearInterval(liveInterval);
  }, []);

  useEffect(() => { fetchNotifications(activeCategory, searchQuery, page); }, [activeCategory, page]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        const isBellBtn = (e.target as HTMLElement).closest(".bell-toggle");
        if (!isBellBtn) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markRead", id }) });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markAllRead" }) });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      fetchNotifications(activeCategory, searchQuery, page);
    } catch (e) { console.error(e); }
  };

  const formatTime = (timeStr: string) => {
    try {
      const diffMins = Math.floor((Date.now() - new Date(timeStr).getTime()) / 60000);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(timeStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch { return ""; }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bell-toggle focus-ring relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-line bg-card text-ink-soft transition-colors hover:text-ink"
        title="Notifications"
      >
        <Bell size={16} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="tnum absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-black"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -16, x: 16 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: -16, x: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed right-6 top-20 z-[70] w-80 rounded-[14px] border border-line bg-card p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-accent/25 bg-accent-faint text-accent"><Activity size={16} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-accent">New alert</span>
                  <span className="text-[11px] text-ink-faint">{formatTime(toastAlert.timestamp)}</span>
                </div>
                <h4 className="mt-1 text-[13px] font-semibold text-ink">{toastAlert.title}</h4>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-soft">{toastAlert.message}</p>
              </div>
              <button onClick={() => setToastAlert(null)} className="shrink-0 text-ink-faint hover:text-ink"><X size={13} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-[60] hidden bg-black/50 backdrop-blur-sm md:block" />
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[65] flex w-full flex-col border-l border-line bg-card shadow-2xl sm:w-[420px]"
            >
              {}
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Notifications</h3>
                  {unreadCount > 0 && <Badge tone="accent" dot>{unreadCount} new</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-[12.5px] text-ink-soft transition-colors hover:text-accent">Mark all read</button>}
                  <button onClick={() => setIsOpen(false)} className="focus-ring flex h-7 w-7 items-center justify-center rounded-[8px] text-ink-faint hover:bg-white/[0.05] hover:text-ink"><X size={16} /></button>
                </div>
              </div>

              {}
              <div className="space-y-3 border-b border-line px-4 py-3.5">
                <div className="flex h-9 items-center gap-2 rounded-[10px] border border-line bg-inset px-3 text-[13px]">
                  <Search size={14} className="text-ink-faint" />
                  <input
                    type="text" value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); fetchNotifications(activeCategory, e.target.value, 1); }}
                    placeholder="Search"
                    className="flex-1 bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                  {searchQuery && <button onClick={() => { setSearchQuery(""); setPage(1); fetchNotifications(activeCategory, "", 1); }}><X size={13} className="text-ink-faint" /></button>}
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id} onClick={() => { setActiveCategory(tab.id); setPage(1); }}
                      className={cn("shrink-0 rounded-full border px-3 py-1 text-[12px] font-medium transition-colors", activeCategory === tab.id ? "border-line-strong bg-card text-ink" : "border-line text-ink-faint hover:text-ink-soft")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {}
              <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16"><span className="text-accent"><Spinner size={18} /></span><span className="text-[12.5px] text-ink-faint">Loading…</span></div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-inset text-ink-soft"><Bell size={18} /></span>
                    <div><p className="text-[13.5px] font-medium text-ink">All clear</p><p className="mt-0.5 text-[12.5px] text-ink-faint">Nothing here right now.</p></div>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id} layout
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}
                        onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                        className={cn("group relative cursor-pointer rounded-[12px] border p-3.5 transition-colors", notif.isRead ? "border-line bg-card/50 hover:border-line-strong" : "border-line-strong bg-inset")}
                      >
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border", notif.category === "SECURITY_ALERT" || notif.category === "AI_RECOMMENDATION" || notif.category === "CAMPAIGN" ? "border-accent/25 bg-accent-faint text-accent" : "border-line bg-card text-ink-soft")}>
                            {categoryIcon(notif.category)}
                          </span>
                          <div className="min-w-0 flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <Badge tone={priorityTone(notif.priority)}>{notif.priority.toLowerCase()}</Badge>
                              <span className="text-[11px] text-ink-faint">{formatTime(notif.timestamp)}</span>
                            </div>
                            <h4 className={cn("mt-1.5 text-[13px] font-semibold", notif.isRead ? "text-ink-soft" : "text-ink")}>{notif.title}</h4>
                            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-soft">{notif.message}</p>
                          </div>
                          {!notif.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {!notif.isRead && <button onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }} title="Mark read" className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-line bg-card text-ink-faint hover:text-ink"><Check size={11} /></button>}
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }} title="Delete" className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-line bg-card text-ink-faint hover:text-danger"><Trash2 size={11} /></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {}
              <div className="space-y-3 border-t border-line px-5 py-4">
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-[12px] text-ink-faint">
                    <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-[8px] border border-line px-2.5 py-1 disabled:opacity-40 hover:text-ink">Prev</button>
                    <span>{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-[8px] border border-line px-2.5 py-1 disabled:opacity-40 hover:text-ink">Next</button>
                  </div>
                )}
                <button
                  onClick={() => { setIsOpen(false); router.push("/notifications"); }}
                  className="focus-ring flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-line bg-inset py-2.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  View all & preferences <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
