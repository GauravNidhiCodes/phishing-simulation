'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  quizzes: Array<{ id: string }>;
  progress: Array<{ completed: boolean; score: number }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  awarenessScore: number;
  riskCategory: string;
}

export default function LearningPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/learning/modules')
      .then(res => res.json())
      .then(data => {
        if (data.modules) setModules(data.modules);
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-purple border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Learning Center...</span>
      </div>
    );
  }

  const completedCount = modules.filter(m => m.progress && m.progress[0]?.completed).length;

  return (
    <div className="space-y-8">
      {/* Employee Greeting & Score Overview Card */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl grid md:grid-cols-3 gap-8 items-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-mono">
              <GraduationCap size={12} /> Personal Learning Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.name}</h1>
            <p className="text-sm text-gray-400 max-w-xl">
              Complete your monthly cybersecurity training modules to increase your awareness score and lower your department's risk rating.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5"><BookOpen size={14} className="text-brand-purple" /> {completedCount} / {modules.length} Modules Completed</div>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-1.5"><Clock size={14} className="text-brand-purple" /> Estimated training: {modules.length * 10} minutes</div>
            </div>
          </div>

          {/* Large visual Score Ring */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-36 h-36 flex items-center justify-center bg-black/30 rounded-full border border-cyber-border/80 shadow-inner">
              {/* Custom HSL Gradient ring */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  stroke="url(#purpleGlow)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (377 * user.awarenessScore) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="text-center">
                <span className="text-3xl font-black text-white font-mono">{user.awarenessScore}%</span>
                <p className="text-[9px] uppercase tracking-wider text-gray-500 font-mono mt-0.5">Awareness score</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modules listing */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white px-2">Assigned Modules</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((mod, idx) => {
            const hasProgress = mod.progress && mod.progress.length > 0;
            const isCompleted = hasProgress && mod.progress[0].completed;
            const score = hasProgress ? mod.progress[0].score : null;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-start border border-cyber-border hover:border-brand-purple/40 relative overflow-hidden"
              >
                {/* Module visual corner indicator */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/3 rounded-bl-full pointer-events-none" />
                
                <div className="space-y-4 w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-mono text-brand-purple uppercase tracking-widest font-bold">Module {idx + 1}</span>
                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> Passed ({score}%)
                      </span>
                    ) : hasProgress ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono font-bold flex items-center gap-1">
                        Not Started
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-purple transition-colors">{mod.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed min-h-[50px]">{mod.description}</p>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between w-full border-t border-cyber-border/40 pt-4 text-xs">
                  <span className="text-gray-500 font-mono">{mod.quizzes.length} validation check questions</span>
                  <Link 
                    href={`/learning/module/${mod.id}`}
                    className="flex items-center gap-1.5 text-brand-purple hover:underline font-semibold"
                  >
                    {isCompleted ? 'Review Content' : 'Start Course'} <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
