"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, Award, Clock, CheckCircle2, ArrowRight, BookOpen,
  ChevronRight, AlertTriangle, Flame, Calendar, Search, Printer, X,
  ShieldCheck, Building2, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingState, EmptyState } from "@/components/ui/States";
import { stagger, rise } from "@/lib/motion";

interface Module {
  id: string; title: string; description: string; category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced"; duration: string;
  takeaways: string[]; quizzes: Array<{ id: string }>; progress: Array<{ completed: boolean; score: number }>;
}
interface User { id: string; name: string; email: string; department: string; branch: string; managerName: string; joiningDate: string; awarenessScore: number; riskCategory: string; }
interface Stats { learningProgress: number; completedCourses: number; inProgressCourses: number; certificatesEarned: number; learningStreak: number; weeklyProgress: Array<{ day: string; value: number }>; upcomingMandatory: Array<{ title: string; deadline: string }>; }
interface RecommendedCourse { id: string; title: string; category: string; duration: string; difficulty: string; }
interface Certificate { id: string; employeeName: string; organizationName: string; courseName: string; completionDate: string; }

const diffTone = (d: string) => (d === "Beginner" ? "accent" : d === "Intermediate" ? "warn" : "danger") as "accent" | "warn" | "danger";

export default function LearningPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recommended, setRecommended] = useState<RecommendedCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch("/api/learning/modules")
      .then((res) => res.json())
      .then((data) => {
        if (data.modules) setModules(data.modules);
        if (data.user) setUser(data.user);
        if (data.stats) setStats(data.stats);
        if (data.recommended) setRecommended(data.recommended);
        if (data.certificates) setCertificates(data.certificates);
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <LoadingState label="Opening the academy" sublabel="Loading your courses and progress." />;

  const categories = ["All", ...Array.from(new Set(modules.map((m) => m.category)))];
  const filteredModules = modules.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ringCirc = 2 * Math.PI * 52;

  return (
    <div>
      <PageHeader
        eyebrow="Learning"
        title={user ? `Welcome back, ${user.name?.split(" ")[0]}` : "Learning center"}
        description="Sharpen your instincts. Finish your assigned courses to raise your awareness score and keep the team safe."
      />

      {/* Hero */}
      {user && stats && (
        <Card pad="lg" className="mb-6 grid items-center gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent"><GraduationCap size={12} className="mr-1" /> Your academy</Badge>
              {stats.learningStreak > 0 && <Badge tone="warn"><Flame size={12} className="mr-1" /> {stats.learningStreak}-day streak</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Meta icon={<Building2 size={13} />} label="Department" value={user.department || "—"} />
              <Meta icon={<MapPin size={13} />} label="Branch" value={user.branch || "—"} />
              <Meta icon={<GraduationCap size={13} />} label="Manager" value={user.managerName || "—"} />
              <Meta icon={<ShieldCheck size={13} />} label="Risk" value={`${user.riskCategory || "—"}`} valueClass={user.riskCategory === "LOW" ? "text-accent" : user.riskCategory === "MEDIUM" ? "text-warn" : "text-danger"} />
            </div>
            <div className="flex flex-wrap items-center gap-5 text-[13px] text-ink-soft">
              <span className="flex items-center gap-1.5"><BookOpen size={15} className="text-ink-faint" /> <span className="font-medium text-ink">{stats.completedCourses}</span> of {modules.length} passed</span>
              <span className="flex items-center gap-1.5"><Clock size={15} className="text-ink-faint" /> ~{modules.length * 10} min of content</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-[16px] border border-line bg-inset p-6">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="var(--color-card)" strokeWidth="9" fill="none" />
                <motion.circle
                  cx="60" cy="60" r="52" stroke="var(--color-accent)" strokeWidth="9" fill="none" strokeLinecap="round"
                  strokeDasharray={ringCirc}
                  initial={{ strokeDashoffset: ringCirc }}
                  animate={{ strokeDashoffset: ringCirc - (ringCirc * stats.learningProgress) / 100 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="text-center">
                <span className="tnum text-[34px] font-semibold tracking-[-0.03em] text-ink">{stats.learningProgress}%</span>
                <p className="text-[11px] uppercase tracking-[0.08em] text-ink-faint">complete</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              <RingStat value={stats.completedCourses} label="Done" tone="text-accent" />
              <RingStat value={stats.inProgressCourses} label="Active" tone="text-warn" />
              <RingStat value={user.awarenessScore} label="Score" tone="text-ink" />
            </div>
          </div>
        </Card>
      )}

      {/* Recommended + weekly */}
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card pad="lg" className="md:col-span-2">
          <CardHeader title="Recommended for you" description="Based on your role and recent simulations." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommended.length > 0 ? recommended.map((rec) => (
              <Link key={rec.id} href={`/learning/module/${rec.id}`} className="group flex flex-col justify-between rounded-[12px] border border-line bg-inset p-4 transition-colors hover:border-line-strong">
                <div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-accent">{rec.category}</span>
                    <span className="text-ink-faint">{rec.duration}</span>
                  </div>
                  <h4 className="mt-1.5 text-[14.5px] font-semibold text-ink">{rec.title}</h4>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 self-end text-[12.5px] font-medium text-ink-soft transition-transform group-hover:translate-x-0.5">Start <ArrowRight size={13} /></span>
              </Link>
            )) : <p className="col-span-2 py-6 text-center text-[13px] text-ink-faint">You&apos;re all caught up. Nicely done.</p>}
          </div>
        </Card>

        <Card pad="lg" className="flex flex-col justify-between">
          <CardHeader title="This week" description="Your daily completions." />
          {stats && (
            <div className="mt-5 flex h-24 items-end justify-between gap-2">
              {stats.weeklyProgress.map((w, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-16 w-full items-end overflow-hidden rounded-[6px] bg-inset">
                    <motion.div initial={{ height: 0 }} animate={{ height: w.value > 0 ? "100%" : "12%" }} transition={{ duration: 0.7, delay: idx * 0.05 }} className={cn("w-full rounded-[6px]", w.value > 0 ? "bg-accent" : "bg-line-strong")} />
                  </div>
                  <span className="text-[11px] text-ink-faint">{w.day}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12.5px] text-ink-soft">
            <span>Weekly goal</span><span className="font-medium text-ink">3 courses</span>
          </div>
        </Card>
      </div>

      {/* Mandatory + certificates */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card pad="lg">
          <CardHeader title="Due soon" description="Mandatory updates." />
          <div className="mt-4 space-y-3">
            {stats && stats.upcomingMandatory.length > 0 ? stats.upcomingMandatory.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 rounded-[12px] border border-warn/30 bg-warn-faint/30 p-3.5">
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12px] text-ink-faint"><Calendar size={11} /> {item.deadline}</p>
                </div>
                <Badge tone="warn">required</Badge>
              </div>
            )) : <p className="py-6 text-center text-[13px] text-ink-faint">Nothing due. You&apos;re on track.</p>}
          </div>
        </Card>

        <Card pad="lg" className="md:col-span-2">
          <CardHeader title="Your certificates" description="Earned by scoring 70%+ on validation quizzes." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {certificates.length > 0 ? certificates.map((cert) => (
              <button key={cert.id} onClick={() => setActiveCertificate(cert)} className="group flex items-center gap-4 rounded-[12px] border border-line bg-inset p-4 text-left transition-colors hover:border-line-strong">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-accent/30 bg-accent-faint text-accent"><Award size={20} /></span>
                <div className="min-w-0">
                  <h4 className="truncate text-[13.5px] font-semibold text-ink">{cert.courseName}</h4>
                  <p className="truncate text-[12px] text-ink-faint">{cert.completionDate}</p>
                </div>
              </button>
            )) : <p className="col-span-2 rounded-[12px] border border-dashed border-line py-8 text-center text-[13px] text-ink-faint">Finish a course to earn your first certificate.</p>}
          </div>
        </Card>
      </div>

      {/* Library */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Course library</h2>
          <p className="text-[13px] text-ink-soft">Every awareness course, in one place.</p>
        </div>
        <Input icon={<Search size={15} />} placeholder="Search courses" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="sm:w-64" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "focus-ring shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
              selectedCategory === cat ? "border-line-strong bg-inset text-ink" : "border-line text-ink-soft hover:text-ink"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredModules.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((mod) => {
            const hasProgress = mod.progress && mod.progress.length > 0;
            const isCompleted = hasProgress && mod.progress[0].completed;
            const score = hasProgress ? mod.progress[0].score : null;
            return (
              <motion.div key={mod.id} variants={rise}>
                <Link href={`/learning/module/${mod.id}`} className="group flex h-full flex-col justify-between rounded-[16px] border border-line bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-accent">{mod.category}</span>
                      {isCompleted ? <Badge tone="accent" dot>{score}%</Badge> : hasProgress ? <Badge tone="warn">in progress</Badge> : <Badge tone="muted">not started</Badge>}
                    </div>
                    <h3 className="mt-2.5 text-[16px] font-semibold tracking-[-0.01em] text-ink">{mod.title}</h3>
                    <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-ink-soft">{mod.description}</p>
                    <div className="mt-3 flex items-center gap-4 border-t border-line pt-3 text-[12px] text-ink-faint">
                      <span className="flex items-center gap-1"><Clock size={12} /> {mod.duration}</span>
                      <span className="flex items-center gap-1.5"><span className={cn("h-1.5 w-1.5 rounded-full", mod.difficulty === "Beginner" ? "bg-accent" : mod.difficulty === "Intermediate" ? "bg-warn" : "bg-danger")} /> {mod.difficulty}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-[12px] text-ink-faint">{mod.quizzes.length} checks</span>
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft transition-transform group-hover:translate-x-0.5">{isCompleted ? "Review" : "Start"} <ChevronRight size={14} /></span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <EmptyState icon={<Search size={20} />} title="No courses found" description="Try a different search or category." />
      )}

      {/* Certificate modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setActiveCertificate(null)} className="absolute inset-0 bg-black/70 backdrop-blur-md print:hidden" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 w-full max-w-2xl rounded-[16px] border border-line bg-card p-6 text-center shadow-2xl md:p-10 print:max-w-none print:border-0 print:bg-white print:p-12">
            <button onClick={() => setActiveCertificate(null)} className="focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-faint hover:bg-white/[0.05] hover:text-ink print:hidden"><X size={18} /></button>
            <div className="rounded-[12px] border border-accent/25 p-8 md:p-12 print:border-2 print:border-black">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent-faint text-accent print:text-black"><ShieldCheck size={26} /></span>
              <p className="mt-3 text-[12px] uppercase tracking-[0.12em] text-ink-faint print:text-gray-500">Certificate of completion</p>
              <p className="mt-6 text-[12px] uppercase tracking-[0.08em] text-ink-faint">Awarded to</p>
              <h1 className="mx-auto mt-1 max-w-md border-b border-line pb-2 text-[26px] font-semibold tracking-[-0.01em] text-ink md:text-[34px] print:text-black">{activeCertificate.employeeName}</h1>
              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-ink-soft print:text-gray-700">for completing the security training course</p>
              <h3 className="mt-2 text-[19px] font-semibold text-accent print:text-black">{activeCertificate.courseName}</h3>
              <p className="mt-2 text-[12px] text-ink-faint">at {activeCertificate.organizationName}</p>
              <div className="mt-8 grid grid-cols-2 gap-8 border-t border-line pt-6 text-left text-[12px]">
                <div><p className="text-ink-faint">Date</p><p className="mt-0.5 font-medium text-ink print:text-black">{activeCertificate.completionDate}</p></div>
                <div className="text-right"><p className="text-ink-faint">Credential ID</p><p className="mt-0.5 truncate font-mono font-medium text-accent print:text-black">{activeCertificate.id}</p></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <Button variant="ghost" onClick={() => setActiveCertificate(null)}>Close</Button>
              <Button variant="primary" icon={<Printer size={15} />} onClick={() => window.print()}>Print</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-3.5">
      <p className="flex items-center gap-1.5 text-[12px] text-ink-faint">{icon} {label}</p>
      <p className={cn("mt-1 truncate text-[13.5px] font-medium text-ink", valueClass)}>{value}</p>
    </div>
  );
}

function RingStat({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div>
      <p className={cn("tnum text-[16px] font-semibold", tone)}>{value}</p>
      <p className="text-[11px] text-ink-faint">{label}</p>
    </div>
  );
}
