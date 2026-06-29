"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  GraduationCap,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  MousePointerClick,
  MailOpen,
  KeyRound,
  Megaphone,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/States";

interface Posture {
  healthScore: number;
  activeCampaigns: number;
  activeEmployees: number;
  highRiskEmployees: number;
  trainingCompletion: number;
  maturityLevel: string;
  riskIndex: string;
}
interface BranchStat {
  name: string;
  employees: number;
  awarenessScore: number;
  riskScore: number;
  trainingPercent: number;
  campaignStatus: string;
}
interface ThreatIntel {
  mostClickedSimulation: string;
  mostVulnerableDept: string;
  fastestImprovingBranch: string;
  topAIRecommendation: string;
  mostEffectiveEmailTemplate: string;
}
interface TimelineEvent {
  id: string;
  eventType: string;
  title: string;
  description: string;
  timestamp: string;
}
interface MockFeed {
  type: string;
  title: string;
  message: string;
}

function feedIcon(type: string) {
  if (type.includes("CLICK")) return <MousePointerClick size={14} className="text-warn" />;
  if (type.includes("SUBMIT")) return <KeyRound size={14} className="text-danger" />;
  if (type.includes("OPEN")) return <MailOpen size={14} className="text-ink-soft" />;
  if (type.includes("REPORT") || type.includes("TRAIN") || type.includes("COMPLETED")) return <ShieldCheck size={14} className="text-accent" />;
  if (type.includes("AI")) return <Sparkles size={14} className="text-accent" />;
  return <Megaphone size={14} className="text-ink-soft" />;
}

export default function SocDashboard() {
  const [loading, setLoading] = useState(true);
  const [posture, setPosture] = useState<Posture | null>(null);
  const [branches, setBranches] = useState<BranchStat[]>([]);
  const [threatIntel, setThreatIntel] = useState<ThreatIntel | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [mockFeeds, setMockFeeds] = useState<MockFeed[]>([]);
  const [liveLogs, setLiveLogs] = useState<{ id: string; time: string; title: string; message: string; type: string }[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [istTime, setIstTime] = useState("");

  const fetchSocData = async () => {
    try {
      const res = await fetch("/api/admin/soc");
      const data = await res.json();
      if (data && !data.error) {
        setPosture(data.posture);
        setBranches(data.branchStats);
        setThreatIntel(data.threatIntel);
        setTimeline(data.timelineEvents);
        setMockFeeds(data.mockLiveFeeds);
        if (data.mockLiveFeeds.length > 0 && liveLogs.length === 0) {
          const initial = data.mockLiveFeeds.slice(0, 4).map((feed: MockFeed, idx: number) => ({
            id: `LOG-INIT-${idx}`,
            time: new Date(Date.now() - idx * 2 * 60000).toLocaleTimeString("en-IN", { hour12: false }),
            title: feed.title,
            message: feed.message,
            type: feed.type,
          }));
          setLiveLogs(initial);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSocData();
    const clock = setInterval(() => {
      setIstTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    }, 1000);
    return () => clearInterval(clock);
    
  }, []);

  useEffect(() => {
    if (mockFeeds.length === 0) return;
    const ticker = setInterval(() => {
      const feed = mockFeeds[Math.floor(Math.random() * mockFeeds.length)];
      setLiveLogs((prev) => [
        { id: `LOG-${Date.now()}`, time: new Date().toLocaleTimeString("en-IN", { hour12: false }), title: feed.title, message: feed.message, type: feed.type },
        ...prev.slice(0, 11),
      ]);
    }, 9000);
    return () => clearInterval(ticker);
  }, [mockFeeds]);

  const filteredBranches = branches.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === "ALL" || b.name === selectedBranch;
    let matchesRisk = true;
    if (selectedRisk === "HIGH") matchesRisk = b.riskScore >= 20;
    else if (selectedRisk === "MEDIUM") matchesRisk = b.riskScore >= 10 && b.riskScore < 20;
    else if (selectedRisk === "LOW") matchesRisk = b.riskScore < 10;
    return matchesSearch && matchesBranch && matchesRisk;
  });

  if (loading) return <LoadingState label="Connecting to live operations" sublabel="Streaming the latest activity." />;

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title="Live operations"
        description="A real-time view of campaigns in flight, branch posture, and what your people are doing right now."
        actions={
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-[10px] border border-line bg-card px-3 py-2 font-mono text-[12.5px] text-ink-soft sm:inline-flex tnum">
              {istTime || "—"}
            </span>
            <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={fetchSocData}>
              Refresh
            </Button>
          </div>
        }
      />

      {}
      {posture && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card pad="md" className="flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ink-soft">Posture health</span>
              <ShieldCheck size={16} className="text-ink-faint" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="tnum text-[30px] font-semibold tracking-[-0.03em] text-ink">{posture.healthScore}%</span>
                <Badge tone="accent" dot>Stable</Badge>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-inset">
                <motion.div initial={{ width: 0 }} animate={{ width: `${posture.healthScore}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-accent" />
              </div>
            </div>
          </Card>
          <Card pad="md" className="flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ink-soft">Maturity</span>
              <Activity size={16} className="text-ink-faint" />
            </div>
            <div>
              <p className="text-[18px] font-semibold text-ink">{posture.maturityLevel}</p>
              <p className="mt-1 text-[12px] text-ink-faint">Program maturity tier</p>
            </div>
          </Card>
          <Card pad="md" className="flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ink-soft">Risk index</span>
              <AlertTriangle size={16} className="text-ink-faint" />
            </div>
            <div>
              <p className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{posture.riskIndex}</p>
              <p className="mt-1 text-[12px] text-ink-faint">Weighted by active failures</p>
            </div>
          </Card>
          <Card pad="md" className="flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-ink-soft">Training & drills</span>
              <GraduationCap size={16} className="text-ink-faint" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="tnum text-[22px] font-semibold text-ink">{posture.trainingCompletion}%</p>
                <p className="text-[12px] text-ink-faint">complete</p>
              </div>
              <div className="text-right">
                <p className="tnum text-[22px] font-semibold text-ink">{posture.activeCampaigns}</p>
                <p className="text-[12px] text-ink-faint">active</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card pad="none" className="flex h-[420px] flex-col lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <h3 className="text-[15px] font-semibold text-ink">Live activity</h3>
            </div>
            <span className="text-[12px] text-ink-faint">Streaming</span>
          </div>
          <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto p-3">
            <AnimatePresence initial={false}>
              {liveLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="mt-0.5 shrink-0">{feedIcon(log.type)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-ink">{log.title}</p>
                      <span className="shrink-0 font-mono text-[11px] text-ink-faint tnum">{log.time}</span>
                    </div>
                    <p className="truncate text-[12.5px] text-ink-soft">{log.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        <Card pad="none" className="flex h-[420px] flex-col">
          <div className="border-b border-line px-5 py-4">
            <h3 className="text-[15px] font-semibold text-ink">Campaign timeline</h3>
            <p className="text-[12px] text-ink-faint">Delivery to remediation</p>
          </div>
          <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
            {timeline.length === 0 ? (
              <p className="py-16 text-center text-[13px] text-ink-faint">No recent events.</p>
            ) : (
              <div className="space-y-5">
                {timeline.slice(0, 6).map((evt, idx, arr) => (
                  <div key={evt.id} className="relative flex gap-3">
                    {idx < arr.length - 1 && <span className="absolute left-[11px] top-7 bottom-[-20px] w-px bg-line" />}
                    <span className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-inset">
                      {feedIcon(evt.eventType)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-ink-faint">
                        {new Date(evt.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </p>
                      <p className="text-[13px] font-medium text-ink">{evt.title}</p>
                      <p className="text-[12.5px] leading-relaxed text-ink-soft">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {}
      <Card pad="lg" className="mb-6">
        <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <Globe size={17} className="text-ink-faint" />
            <div>
              <h3 className="text-[15px] font-semibold text-ink">Branch posture</h3>
              <p className="text-[13px] text-ink-soft">How each office is tracking.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Input icon={<Search size={15} />} placeholder="Search branches" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-44" />
            <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="w-auto">
              <option value="ALL">All branches</option>
              {branches.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
            </Select>
            <Select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} className="w-auto">
              <option value="ALL">All risk</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </Select>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredBranches.map((br) => (
              <motion.div
                key={br.name}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative rounded-[12px] border border-line bg-inset p-4 transition-colors hover:border-line-strong"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-semibold text-ink">{br.name}</h4>
                  {br.campaignStatus === "ACTIVE" && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                </div>
                <div className="mt-3.5 space-y-2 text-[12.5px]">
                  <Row label="People" value={String(br.employees)} />
                  <Row label="Awareness" value={`${br.awarenessScore}/100`} valueClass={br.awarenessScore >= 75 ? "text-accent" : br.awarenessScore >= 60 ? "text-warn" : "text-ink"} />
                  <Row label="High risk" value={`${br.riskScore}%`} />
                  <Row label="Training" value={`${br.trainingPercent}%`} />
                  <div className="flex items-center justify-between border-t border-line pt-2.5">
                    <span className="text-ink-faint">Status</span>
                    <Badge tone={br.campaignStatus === "ACTIVE" ? "accent" : "muted"}>{br.campaignStatus.toLowerCase()}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {}
      {threatIntel && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card pad="lg" className="lg:col-span-2">
            <CardHeader title="Threat intelligence" description="Patterns drawn from your simulation data." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <IntelTile label="Most clicked scenario" value={threatIntel.mostClickedSimulation} note={<span className="flex items-center gap-1 text-warn"><ArrowUpRight size={12} /> highest failure trigger</span>} />
              <IntelTile label="Most vulnerable team" value={threatIntel.mostVulnerableDept} note="Prioritize for training" />
              <IntelTile label="Fastest improving branch" value={threatIntel.fastestImprovingBranch} note={<span className="text-accent">strongest growth</span>} />
              <IntelTile label="Most effective template" value={threatIntel.mostEffectiveEmailTemplate} note="Highest reporting rate" />
            </div>
          </Card>
          <Card pad="lg" className="flex flex-col justify-between">
            <div>
              <CardHeader title="Recommended next step" />
              <div className="mt-4 rounded-[12px] border border-accent/30 bg-accent-faint/40 p-4">
                <Sparkles size={16} className="mb-2 text-accent" />
                <p className="text-[13.5px] leading-relaxed text-ink">{threatIntel.topAIRecommendation}</p>
              </div>
            </div>
            <p className="mt-4 text-[12px] text-ink-faint">Updated continuously from live telemetry.</p>
          </Card>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-faint">{label}</span>
      <span className={cn("font-medium text-ink", valueClass)}>{value}</span>
    </div>
  );
}

function IntelTile({ label, value, note }: { label: string; value: string; note: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-line bg-inset p-4">
      <p className="text-[12px] text-ink-faint">{label}</p>
      <p className="mt-1 truncate text-[14px] font-semibold text-ink" title={value}>{value}</p>
      <p className="mt-1.5 text-[12px] text-ink-soft">{note}</p>
    </div>
  );
}
