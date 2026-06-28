'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Shield, Mail, Bell, GraduationCap, Volume2, Calendar, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Preferences {
  email: boolean;
  dashboard: boolean;
  learningReminders: boolean;
  campaignAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  criticalAlerts: boolean;
}

export default function PreferencesPanel() {
  const [prefs, setPrefs] = useState<Preferences>({
    email: true,
    dashboard: true,
    learningReminders: true,
    campaignAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
    criticalAlerts: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load preferences
  useEffect(() => {
    setLoading(true);
    fetch('/api/notifications/preferences')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setPrefs(data);
        }
      })
      .catch(e => console.error("Error loading preferences:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof Preferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 border border-[#252525] bg-[#141414] rounded-2xl flex flex-col items-center justify-center space-y-3">
        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Loading Preferences...</span>
      </div>
    );
  }

  return (
    <div className="border border-[#252525] bg-[#141414] rounded-2xl overflow-hidden shadow-xl">
      <div className="px-5 py-4 border-b border-[#252525] bg-[#181818] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-red-500" />
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Alert Configurations</h3>
        </div>
        <span className="text-[8px] font-mono text-gray-500 uppercase">Per User Settings</span>
      </div>

      <form onSubmit={handleSave} className="p-5 space-y-6">
        
        {/* Core Channels */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-[#252525] pb-1.5">Delivery Channels</h4>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Dashboard Alerts */}
            <div 
              onClick={() => handleToggle('dashboard')}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                prefs.dashboard 
                  ? 'bg-red-950/5 border-red-600/30' 
                  : 'bg-[#0B0B0B] border-[#252525] opacity-60'
              }`}
            >
              <Bell size={18} className={prefs.dashboard ? 'text-red-500' : 'text-gray-500'} />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block font-mono">Dashboard Alerts</span>
                <span className="text-[9px] text-gray-400 leading-normal block">Receive in-app alerts in the slide-out Notification drawer.</span>
              </div>
            </div>

            {/* Email Alerts */}
            <div 
              onClick={() => handleToggle('email')}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                prefs.email 
                  ? 'bg-red-950/5 border-red-600/30' 
                  : 'bg-[#0B0B0B] border-[#252525] opacity-60'
              }`}
            >
              <Mail size={18} className={prefs.email ? 'text-red-500' : 'text-gray-500'} />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block font-mono">Email Delivery</span>
                <span className="text-[9px] text-gray-400 leading-normal block">Route warnings and training updates directly to your inbox.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Switches */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-[#252525] pb-1.5">Security Categories</h4>
          
          <div className="space-y-3">
            {/* Campaign Alerts */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F0F0F] border border-[#252525]">
              <div className="flex items-start gap-2.5">
                <Volume2 size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white font-mono block">Simulation Campaigns</span>
                  <span className="text-[9px] text-gray-400 leading-normal block">Triggers alerts when phishing simulation campaigns are launched or completed.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.campaignAlerts}
                onChange={() => handleToggle('campaignAlerts')}
                className="w-4 h-4 rounded border-[#252525] bg-[#181818] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:ring-0 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Learning Reminders */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F0F0F] border border-[#252525]">
              <div className="flex items-start gap-2.5">
                <GraduationCap size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white font-mono block">Learning & Quizzes</span>
                  <span className="text-[9px] text-gray-400 leading-normal block">Reminds you of assigned courses and quiz scoring milestones.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.learningReminders}
                onChange={() => handleToggle('learningReminders')}
                className="w-4 h-4 rounded border-[#252525] bg-[#181818] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:ring-0 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Critical Alerts */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F0F0F] border border-[#252525]">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white font-mono block">Critical Security Incidents</span>
                  <span className="text-[9px] text-gray-400 leading-normal block">Immediate alerts when department awareness drops or malware risks are high.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.criticalAlerts}
                onChange={() => handleToggle('criticalAlerts')}
                className="w-4 h-4 rounded border-[#252525] bg-[#181818] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:ring-0 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Weekly Reports */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F0F0F] border border-[#252525]">
              <div className="flex items-start gap-2.5">
                <Calendar size={16} className="text-[#A8A8A8] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white font-mono block">Weekly Security Summary</span>
                  <span className="text-[9px] text-gray-400 leading-normal block">Receive week-end status metrics digests.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.weeklyReports}
                onChange={() => handleToggle('weeklyReports')}
                className="w-4 h-4 rounded border-[#252525] bg-[#181818] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:ring-0 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Monthly Reports */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F0F0F] border border-[#252525]">
              <div className="flex items-start gap-2.5">
                <Calendar size={16} className="text-[#A8A8A8] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white font-mono block">Monthly Executive Digest</span>
                  <span className="text-[9px] text-gray-400 leading-normal block">Detailed month-end compliance performance summaries.</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={prefs.monthlyReports}
                onChange={() => handleToggle('monthlyReports')}
                className="w-4 h-4 rounded border-[#252525] bg-[#181818] text-red-600 focus:ring-red-500 focus:ring-offset-0 focus:ring-0 accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Feedback & Actions */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-green-500 font-mono"
                >
                  <CheckCircle2 size={14} />
                  <span>Preferences saved successfully.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-[0_0_12px_rgba(229,9,20,0.3)] disabled:opacity-50 transition flex items-center gap-1.5"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
