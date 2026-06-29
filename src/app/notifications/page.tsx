"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Trash2, Check, Search, Send, ShieldAlert, GraduationCap,
  ClipboardList, Sparkles, FileText, Award, Volume2, Settings,
  CheckCheck, Info,
} from "lucide-react";
import PreferencesPanel from "@/components/notifications/PreferencesPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string; category: string; title: string; message: string;
  priority: string; isRead: boolean; timestamp: string;
}

const CATEGORIES = [
  { id: "ALL", label: "All" },
  { id: "SECURITY_ALERT", label: "Alerts" },
  { id: "CAMPAIGN", label: "Campaigns" },
  { id: "LEARNING", label: "Learning" },
  { id: "AI_RECOMMENDATION", label: "AI insights" },
  { id: "REPORT", label: "Reports" },
  { id: "SYSTEM", label: "System" },
];

const PRIORITIES = [
  { id: "ALL", label: "Any priority" },
  { id: "CRITICAL", label: "Critical" },
  { id: "HIGH", label: "High" },
  { id: "MEDIUM", label: "Medium" },
  { id: "LOW", label: "Low" },
];

const categoryIcon = (category: string) => {
  switch (category) {
    case "CAMPAIGN": return <Send size={15} />;
    case "SECURITY_ALERT": return <ShieldAlert size={15} />;
    case "LEARNING": return <GraduationCap size={15} />;
    case "QUIZ": return <ClipboardList size={15} />;
    case "AI_RECOMMENDATION": return <Sparkles size={15} />;
    case "REPORT": return <FileText size={15} />;
    case "MILESTONE": return <Award size={15} />;
    case "ANNOUNCEMENT": return <Volume2 size={15} />;
    default: return <Settings size={15} />;
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activePriority, setActivePriority] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
    } catch (e) { console.error("Failed to load notifications:", e); }
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [activeCategory, activePriority, page]);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markRead", id }) });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) { console.error(e); }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markAllRead" }) });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      fetchNotifications(activeCategory, activePriority, searchQuery, page);
    } catch (e) { console.error(e); }
  };

  const formatFullDate = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }) + " IST";
    } catch { return ""; }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Simulation outcomes, AI insights, and training reminders — all in one timeline."
        actions={
          <Button variant="secondary" size="sm" icon={<CheckCheck size={15} />} disabled={unreadCount === 0} onClick={handleMarkAllRead}>
            Mark all read{unreadCount > 0 ? ` (${unreadCount})` : ""}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: list */}
        <div className="space-y-5 lg:col-span-2">
          <Card pad="md" className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  icon={<Search size={15} />}
                  placeholder="Search notifications"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); fetchNotifications(activeCategory, activePriority, e.target.value, 1); }}
                />
              </div>
              <Select value={activePriority} onChange={(e) => { setActivePriority(e.target.value); setPage(1); }}>
                {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </Select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setPage(1); }}
                  className={cn(
                    "focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
                    activeCategory === cat.id ? "border-line-strong bg-inset text-ink" : "border-line text-ink-soft hover:text-ink"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>

          {loading ? (
            <Card pad="lg" className="flex flex-col items-center justify-center gap-3 py-16">
              <span className="text-accent"><Spinner size={20} /></span>
              <span className="text-[13px] text-ink-faint">Loading notifications…</span>
            </Card>
          ) : notifications.length === 0 ? (
            <EmptyState icon={<Bell size={20} />} title="You're all caught up" description="Nothing matches these filters right now." />
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group relative flex items-start gap-4 rounded-[14px] border p-4 transition-colors",
                      notif.isRead ? "border-line bg-card/50 hover:border-line-strong" : "border-line-strong bg-card hover:border-line-strong"
                    )}
                  >
                    {!notif.isRead && <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent" />}
                    <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border", notif.category === "SECURITY_ALERT" || notif.category === "AI_RECOMMENDATION" || notif.category === "CAMPAIGN" ? "border-accent/25 bg-accent-faint text-accent" : "border-line bg-inset text-ink-soft")}>
                      {categoryIcon(notif.category)}
                    </span>
                    <div className="min-w-0 flex-1 pr-16">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={priorityTone(notif.priority)}>{notif.priority.toLowerCase()}</Badge>
                        <span className="text-[11.5px] text-ink-faint">{formatFullDate(notif.timestamp)}</span>
                      </div>
                      <h3 className={cn("mt-1.5 text-[14px] font-semibold", notif.isRead ? "text-ink-soft" : "text-ink")}>{notif.title}</h3>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{notif.message}</p>
                    </div>
                    <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notif.isRead && (
                        <button onClick={() => handleMarkRead(notif.id)} title="Mark as read" className="focus-ring flex h-7 w-7 items-center justify-center rounded-[8px] border border-line bg-inset text-ink-faint hover:text-ink">
                          <Check size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(notif.id)} title="Delete" className="focus-ring flex h-7 w-7 items-center justify-center rounded-[8px] border border-line bg-inset text-ink-faint hover:text-danger">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-line pt-4 text-[12.5px] text-ink-faint">
                  <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                  <span>Page {page} of {totalPages} · {totalCount} total</span>
                  <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: preferences */}
        <div className="space-y-5">
          <PreferencesPanel />
          <Card pad="lg" className="space-y-2.5">
            <div className="flex items-center gap-2 text-ink">
              <Info size={15} className="text-accent" />
              <h4 className="text-[13.5px] font-semibold">A note on critical alerts</h4>
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              Severe incidents — failed simulations, sharp score drops — always reach you, regardless of these settings. We&apos;d rather over-communicate when it matters.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
