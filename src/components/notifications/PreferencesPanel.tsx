"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Bell, GraduationCap, Volume2, Calendar, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Spinner } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Preferences {
  email: boolean;
  dashboard: boolean;
  learningReminders: boolean;
  campaignAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  criticalAlerts: boolean;
}

const CATEGORY_ROWS: Array<{ key: keyof Preferences; icon: React.ReactNode; title: string; desc: string }> = [
  { key: "campaignAlerts", icon: <Volume2 size={16} />, title: "Simulation campaigns", desc: "When a phishing drill launches or wraps up." },
  { key: "learningReminders", icon: <GraduationCap size={16} />, title: "Learning & quizzes", desc: "Assigned courses and quiz milestones." },
  { key: "criticalAlerts", icon: <ShieldAlert size={16} />, title: "Critical incidents", desc: "Sharp drops in awareness or active risk." },
  { key: "weeklyReports", icon: <Calendar size={16} />, title: "Weekly summary", desc: "A short Friday digest of the week." },
  { key: "monthlyReports", icon: <Calendar size={16} />, title: "Monthly digest", desc: "Full compliance performance recap." },
];

export default function PreferencesPanel() {
  const [prefs, setPrefs] = useState<Preferences>({
    email: true, dashboard: true, learningReminders: true, campaignAlerts: true,
    weeklyReports: false, monthlyReports: true, criticalAlerts: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/notifications/preferences")
      .then((res) => res.json())
      .then((data) => { if (data && !data.error) setPrefs(data); })
      .catch((e) => console.error("Error loading preferences:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof Preferences) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSuccess(false);
    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(prefs),
      });
      const data = await res.json();
      if (data.success) { setSuccess(true); setTimeout(() => setSuccess(false), 4000); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card pad="lg" className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="text-accent"><Spinner size={20} /></span>
        <span className="text-[13px] text-ink-faint">Loading your preferences…</span>
      </Card>
    );
  }

  return (
    <Card pad="lg">
      <form onSubmit={handleSave} className="space-y-6">
        <CardHeader title="Notification preferences" description="Decide what reaches you and where." />

        {/* Channels */}
        <div className="space-y-3">
          <p className="eyebrow">How you hear from us</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChannelCard active={prefs.dashboard} onClick={() => handleToggle("dashboard")} icon={<Bell size={16} />} title="In-app" desc="Alerts in the slide-out drawer." />
            <ChannelCard active={prefs.email} onClick={() => handleToggle("email")} icon={<Mail size={16} />} title="Email" desc="Straight to your inbox." />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <p className="eyebrow">What you want to know about</p>
          <div className="divide-y divide-line overflow-hidden rounded-[12px] border border-line">
            {CATEGORY_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-3 bg-inset px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-ink-faint">{row.icon}</span>
                  <div>
                    <p className="text-[13px] font-medium text-ink">{row.title}</p>
                    <p className="text-[12px] text-ink-faint">{row.desc}</p>
                  </div>
                </div>
                <Switch checked={prefs[row.key]} onChange={() => handleToggle(row.key)} aria-label={row.title} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-[13px] text-accent">
                <CheckCircle2 size={15} /> <span>Saved</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button type="submit" variant="primary" size="sm" loading={saving} className="ml-auto">Save preferences</Button>
        </div>
      </form>
    </Card>
  );
}

function ChannelCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors",
        active ? "border-accent/40 bg-accent-faint/40" : "border-line bg-inset opacity-70 hover:opacity-100"
      )}
    >
      <span className={cn("mt-0.5", active ? "text-accent" : "text-ink-faint")}>{icon}</span>
      <div className="flex-1">
        <p className="text-[13px] font-medium text-ink">{title}</p>
        <p className="text-[12px] text-ink-faint">{desc}</p>
      </div>
      <Switch checked={active} aria-label={title} />
    </button>
  );
}
