'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  ChevronRight,
  AlertTriangle,
  Flame,
  Calendar,
  Sparkles,
  Search,
  Printer,
  X,
  ShieldCheck,
  Building,
  MapPin,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  takeaways: string[];
  quizzes: Array<{ id: string }>;
  progress: Array<{ completed: boolean; score: number }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  branch: string;
  managerName: string;
  joiningDate: string;
  awarenessScore: number;
  riskCategory: string;
}

interface Stats {
  learningProgress: number;
  completedCourses: number;
  inProgressCourses: number;
  certificatesEarned: number;
  learningStreak: number;
  weeklyProgress: Array<{ day: string; value: number }>;
  upcomingMandatory: Array<{ title: string; deadline: string }>;
}

interface RecommendedCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
}

interface Certificate {
  id: string;
  employeeName: string;
  organizationName: string;
  courseName: string;
  completionDate: string;
}

export default function LearningPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recommended, setRecommended] = useState<RecommendedCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Selected Certificate for modal view
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch('/api/learning/modules')
      .then(res => res.json())
      .then(data => {
        if (data.modules) setModules(data.modules);
        if (data.user) setUser(data.user);
        if (data.stats) setStats(data.stats);
        if (data.recommended) setRecommended(data.recommended);
        if (data.certificates) setCertificates(data.certificates);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePrintCertificate = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 border-b-2 border-brand-purple border-l-2 border-transparent rounded-full animate-spin [animation-direction:reverse]" />
        </div>
        <span className="text-sm font-mono text-gray-400 tracking-widest uppercase animate-pulse">Loading Academy...</span>
      </div>
    );
  }

  // Get distinct categories
  const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];

  // Filter modules
  const filteredModules = modules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Employee Greeting & Progress Header */}
      {user && stats && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-3xl grid md:grid-cols-3 gap-8 items-center relative overflow-hidden border border-white/5"
        >
          {/* Neon mesh backing */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left / Mid Info Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/20 text-brand-purple text-[10px] font-mono uppercase tracking-widest font-semibold">
                <GraduationCap size={11} /> Personal Security Academy
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-amber/15 border border-brand-amber/20 text-brand-amber text-[10px] font-mono uppercase tracking-widest font-semibold">
                <Flame size={11} className="animate-bounce" /> {stats.learningStreak} Day Streak
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Namaste, <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent">{user.name}</span>
              </h1>
              <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                Stay bulletproof against digital threats. Complete your assigned cybersecurity awareness courses to lift your personal compliance score and protect our network infrastructure.
              </p>
            </div>

            {/* User metadata tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/3 border border-white/5 text-xs font-mono text-gray-400">
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-gray-500 flex items-center gap-1"><Building size={10} /> Dept</div>
                <div className="text-white font-medium truncate">{user.department || 'Operations'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-gray-500 flex items-center gap-1"><MapPin size={10} /> Branch</div>
                <div className="text-white font-medium truncate">{user.branch || 'Pune Office'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-gray-500 flex items-center gap-1"><Briefcase size={10} /> Reporting Manager</div>
                <div className="text-white font-medium truncate">{user.managerName || 'Suresh Iyer'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-gray-500 flex items-center gap-1"><UserCheck size={10} /> Risk Grade</div>
                <div className={`font-bold uppercase ${
                  user.riskCategory === 'LOW' ? 'text-brand-emerald' : 
                  user.riskCategory === 'MEDIUM' ? 'text-brand-amber' : 'text-brand-rose'
                }`}>
                  {user.riskCategory || 'MEDIUM'} RISK
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-brand-cyan" /> 
                <span className="text-white font-semibold">{stats.completedCourses}</span> / {modules.length} Courses Passed
              </div>
              <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-purple" /> 
                Estimated {modules.length * 10} minutes content
              </div>
            </div>
          </div>

          {/* Circular Score meter */}
          <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-3xl p-6 glow-border-cyan">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Dial Background circle */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="427"
                  strokeDashoffset={427 - (427 * stats.learningProgress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="text-center space-y-1">
                <span className="text-4xl font-black text-white font-mono leading-none tracking-tighter">
                  {stats.learningProgress}%
                </span>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-mono font-bold">Overall Progress</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-[10px] font-mono text-gray-400 text-center w-full">
              <div className="flex-1">
                <div className="text-white font-bold text-sm text-brand-emerald">{stats.completedCourses}</div>
                <div>Completed</div>
              </div>
              <div className="w-px bg-white/5" />
              <div className="flex-1">
                <div className="text-white font-bold text-sm text-brand-amber">{stats.inProgressCourses}</div>
                <div>In Progress</div>
              </div>
              <div className="w-px bg-white/5" />
              <div className="flex-1">
                <div className="text-white font-bold text-sm text-brand-cyan">{user.awarenessScore}</div>
                <div>Awareness Score</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid: Recommendations + Weekly + Upcoming Deadlines */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Recommended Modules (Tailored context based on profile) */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-cyan animate-pulse" /> Custom Recommendations
              </h3>
              <span className="text-[10px] font-mono text-gray-500">Based on simulation and department risk</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {recommended.length > 0 ? (
                recommended.map((rec) => (
                  <Link 
                    href={`/learning/module/${rec.id}`}
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-brand-purple/40 hover:bg-white/5 transition flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-brand-purple uppercase font-bold">{rec.category}</span>
                        <span className="text-gray-500">{rec.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-purple transition">{rec.title}</h4>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-[11px] text-brand-cyan font-mono font-bold self-end group-hover:translate-x-1 transition-transform">
                      Begin Course <ArrowRight size={12} />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-6 text-xs text-gray-500 font-mono">
                  All tailored training modules cleared! You are fully compliant.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-[11px] text-gray-500 leading-relaxed italic border-t border-white/5 pt-3">
            Tip: Employees in Finance are auto-assigned extra modules for UPI and digital retail scams to mitigate transactional risk profiles.
          </div>
        </div>

        {/* Learning Streak & Weekly Activity tracker */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
              <Calendar size={14} /> Weekly Progress
            </h3>
            <p className="text-[11px] text-gray-400 leading-normal">Your daily learning completions over this week.</p>
          </div>

          {/* Simple HTML bar chart */}
          {stats && (
            <div className="flex items-end justify-between gap-2 h-20 pt-2 font-mono text-[9px] text-gray-500">
              {stats.weeklyProgress.map((w, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 space-y-1">
                  <div className="w-full relative bg-white/5 rounded-t-sm h-14 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: w.value > 0 ? '100%' : '15%' }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`w-full rounded-t-sm ${
                        w.value > 0 
                          ? 'bg-gradient-to-t from-brand-purple to-brand-cyan shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                          : 'bg-white/10'
                      }`}
                    />
                  </div>
                  <span>{w.day}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>Completions Goal</span>
            <span className="text-brand-cyan font-bold">3 / week</span>
          </div>
        </div>
      </div>

      {/* Grid: Earned Certificates & Upcoming Trainings */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Upcoming Mandatory alert banners */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-rose flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-brand-rose shrink-0" /> Mandatory Compliance Updates
          </h3>

          {stats && stats.upcomingMandatory.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingMandatory.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-brand-rose/5 border border-brand-rose/10 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white leading-snug">{item.title}</div>
                    <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Calendar size={10} /> Deadline: {item.deadline}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-brand-rose/15 border border-brand-rose/25 text-brand-rose text-[9px] uppercase font-bold tracking-wider shrink-0 mt-0.5">
                    Required
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-500 font-mono">
              No mandatory training updates pending!
            </div>
          )}
        </div>

        {/* Certificates Earned */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-emerald flex items-center gap-1.5">
            <Award size={14} className="text-brand-emerald shrink-0" /> Digital Certificates Earned
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <div 
                  key={cert.id}
                  onClick={() => setActiveCertificate(cert)}
                  className="p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-brand-emerald/40 hover:bg-white/5 transition flex items-center gap-4 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald shrink-0 group-hover:scale-105 transition-transform">
                    <Award size={22} className="glow-text-emerald" />
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">{cert.courseName}</h4>
                    <p className="text-[10px] text-gray-400 font-mono truncate">ID: {cert.id}</p>
                    <p className="text-[10px] text-brand-emerald font-mono">Completed: {cert.completionDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-xs text-gray-500 font-mono border border-dashed border-white/5 rounded-2xl">
                Finish courses with at least 70% in validation quizzes to generate digital credentials.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Directory Divider / Filters */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Course Curricula Library</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Explore standard awareness courses & interactive scenarios</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Search size={14} />
              </span>
              <input 
                type="text" 
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition shrink-0 border ${
                selectedCategory === cat 
                  ? 'bg-brand-purple/20 border-brand-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                  : 'bg-white/3 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.length > 0 ? (
            filteredModules.map((mod, idx) => {
              const hasProgress = mod.progress && mod.progress.length > 0;
              const isCompleted = hasProgress && mod.progress[0].completed;
              const score = hasProgress ? mod.progress[0].score : null;

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/5 hover:border-brand-purple/30 group relative overflow-hidden"
                >
                  {/* Module header indicator */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/3 rounded-bl-full pointer-events-none group-hover:bg-brand-purple/5 transition-colors" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-semibold">{mod.category}</span>
                      
                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[9px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Passed ({score}%)
                        </span>
                      ) : hasProgress ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/10 border border-brand-amber/20 text-brand-amber text-[9px] font-mono font-bold flex items-center gap-1">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[9px] font-mono font-bold flex items-center gap-1">
                          Not Started
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors">{mod.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed min-h-[50px]">{mod.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 pt-2 border-t border-white/3">
                      <div className="flex items-center gap-1"><Clock size={11} /> {mod.duration}</div>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          mod.difficulty === 'Beginner' ? 'bg-brand-emerald' : 
                          mod.difficulty === 'Intermediate' ? 'bg-brand-amber' : 'bg-brand-rose'
                        }`} />
                        {mod.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between w-full">
                    <span className="text-[10px] text-gray-500 font-mono">{mod.quizzes.length} validation checks</span>
                    <Link 
                      href={`/learning/module/${mod.id}`}
                      className="inline-flex items-center gap-1 text-xs text-brand-purple font-semibold hover:underline group-hover:text-brand-cyan transition-colors"
                    >
                      {isCompleted ? 'Review Content' : 'Start Course'} <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-sm text-gray-500 font-mono border border-dashed border-white/5 rounded-3xl bg-white/1">
              No courses matching the filter criteria were found.
            </div>
          )}
        </div>
      </div>

      {/* Certificate Print Preview Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCertificate(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden"
            />
            
            {/* Modal Card content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative z-10 w-full max-w-3xl glass-panel p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-center overflow-hidden print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:w-full print:max-w-none"
            >
              {/* Gold gradient radial glow behind certificate */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none print:hidden" />

              {/* Close Button */}
              <button 
                onClick={() => setActiveCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/3 border border-white/5 text-gray-400 hover:text-white transition print:hidden"
              >
                <X size={16} />
              </button>

              {/* Printable Area - The Certificate Frame */}
              <div className="border-[12px] border-double border-amber-500/30 p-6 md:p-12 bg-black/40 rounded-2xl relative overflow-hidden print:border-[16px] print:border-amber-600 print:bg-white print:p-16">
                
                {/* Visual Corner crest decorations */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 print:border-amber-600" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 print:border-amber-600" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 print:border-amber-600" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 print:border-amber-600" />

                {/* Crest Header */}
                <div className="space-y-2 mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-lg print:shadow-none">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center print:bg-white">
                      <ShieldCheck size={26} className="text-amber-500 print:text-amber-600" />
                    </div>
                  </div>
                  <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-amber-500/80 print:text-amber-600">
                    Certificate of Competency
                  </h2>
                </div>

                {/* Body Text */}
                <div className="space-y-4 md:space-y-6">
                  <span className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest block">This credential is proudly awarded to</span>
                  
                  <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight border-b border-white/10 pb-2 max-w-md mx-auto print:text-black print:border-black/20">
                    {activeCertificate.employeeName}
                  </h1>

                  <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed print:text-gray-700">
                    for successfully demonstrating mastery and clearing the compliance validation checks for the security training module
                  </p>

                  <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent print:bg-none print:text-black">
                    {activeCertificate.courseName}
                  </h3>

                  <p className="text-[10px] md:text-xs text-gray-500 font-mono">
                    Conducted within the security environment of <span className="text-white font-bold print:text-black">{activeCertificate.organizationName}</span>
                  </p>
                </div>

                {/* Footer Signatures & Date */}
                <div className="mt-8 md:mt-12 pt-6 border-t border-white/5 grid grid-cols-2 gap-8 text-xs font-mono print:border-black/10">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] uppercase text-gray-500 block">Verification Date</span>
                    <span className="font-bold text-white print:text-black">{activeCertificate.completionDate}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] uppercase text-gray-500 block">Credential Identifier</span>
                    <span className="font-bold text-brand-cyan print:text-amber-600 truncate block text-[10px] md:text-xs">{activeCertificate.id}</span>
                  </div>
                </div>

                {/* Pinkman Protects Brand Mark footer */}
                <div className="mt-6 text-[8px] font-mono uppercase tracking-widest text-gray-500">
                  Secured by Pinkman Protects Platform
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => setActiveCertificate(null)}
                  className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 text-gray-400 hover:text-white transition text-xs font-semibold font-mono"
                >
                  Close Window
                </button>
                <button
                  onClick={handlePrintCertificate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-semibold text-xs font-mono flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
                >
                  <Printer size={13} /> Print Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
