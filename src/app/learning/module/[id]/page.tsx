"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, HelpCircle, ArrowLeft, AlertTriangle, Award, ChevronRight,
  ShieldCheck, Play, Pause, Volume2, Maximize, RotateCcw, Sparkles,
  Info, Check, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal, ModalBody } from "@/components/ui/Modal";
import { LoadingState, ErrorState } from "@/components/ui/States";

interface QuizQuestion { id: string; question: string; options: string[]; correct: number; }
interface InteractiveScenario { question: string; options: string[]; correct: number; explanation: string; }
interface Module {
  id: string; title: string; description: string; contentHtml: string; category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced"; duration: string; takeaways: string[];
  videoUrl: string; interactiveScenario: InteractiveScenario; quizzes: QuizQuestion[];
  progress: Array<{ completed: boolean; score: number }>;
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [module, setModule] = useState<Module | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lesson" | "scenario" | "quiz">("lesson");

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [videoSpeed, setVideoSpeed] = useState("1.0x");

  const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);
  const [scenarioSubmitted, setScenarioSubmitted] = useState(false);
  const [scenarioIsCorrect, setScenarioIsCorrect] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [awarenessScoreUpdate, setAwarenessScoreUpdate] = useState(0);
  const [updatedRisk, setUpdatedRisk] = useState("");
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/learning/modules")
      .then((res) => res.json())
      .then((data) => {
        setUserId(data.user.id);
        const activeModule = data.modules.find((m: any) => m.id === id);
        if (activeModule) {
          setModule(activeModule);
          if (activeModule.progress && activeModule.progress[0]?.completed) setScore(activeModule.progress[0].score);
        }
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };
  const handleVerifyScenario = () => {
    if (!module || selectedScenarioOption === null) return;
    setScenarioIsCorrect(selectedScenarioOption === module.interactiveScenario.correct);
    setScenarioSubmitted(true);
  };
  const handleRetryScenario = () => { setSelectedScenarioOption(null); setScenarioSubmitted(false); setScenarioIsCorrect(false); };

  const handleSubmitQuiz = async () => {
    if (!module || !userId) return;
    let correctCount = 0;
    module.quizzes.forEach((q) => { if (selectedAnswers[q.id] === q.correct) correctCount++; });
    const finalScore = Math.round((correctCount / module.quizzes.length) * 100);
    setScore(finalScore);
    try {
      const res = await fetch("/api/learning/modules", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: module.id, userId, score: finalScore, completed: finalScore >= 70 }),
      });
      if (res.ok) {
        const result = await res.json();
        setAwarenessScoreUpdate(result.newScore); setUpdatedRisk(result.riskCategory);
        setQuizSubmitted(true); setResultsModalOpen(true);
      }
    } catch (err) { console.error(err); }
  };
  const handleResetQuiz = () => { setSelectedAnswers({}); setQuizSubmitted(false); setScore(0); setResultsModalOpen(false); };

  if (loading) return <LoadingState label="Opening the lesson" sublabel="Preparing your workspace." />;
  if (!module) return (
    <ErrorState icon={<AlertTriangle size={20} />} title="Course not found" description="This module isn't part of the current curriculum." action={<Link href="/learning"><Button variant="secondary">Back to learning</Button></Link>} />
  );

  const allAnswered = module.quizzes.every((q) => selectedAnswers[q.id] !== undefined);
  const completionPercentage = module.progress && module.progress[0]?.completed ? 100 : activeTab === "lesson" ? 30 : activeTab === "scenario" ? 65 : 85;

  const tabs = [
    { id: "lesson" as const, label: "Lesson", icon: <BookOpen size={14} /> },
    { id: "scenario" as const, label: "Checkpoint", icon: <Sparkles size={14} /> },
    { id: "quiz" as const, label: `Quiz (${module.quizzes.length})`, icon: <HelpCircle size={14} /> },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/learning" className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-ink"><ArrowLeft size={14} /> Back to learning</Link>
        <div className="flex items-center gap-3 rounded-[10px] border border-line bg-card px-3.5 py-2 text-[12.5px]">
          <span className="text-ink-faint">Progress</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-inset"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${completionPercentage}%` }} /></div>
          <span className="font-medium text-ink tnum">{completionPercentage}%</span>
        </div>
      </div>

      {/* Header */}
      <Card pad="lg" className="mb-6 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-ink-faint">
            <Badge tone="muted">{module.category}</Badge>
            <span>{module.duration}</span>
            <span>·</span>
            <span>{module.difficulty}</span>
          </div>
          <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-ink">{module.title}</h1>
          <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">{module.description}</p>
        </div>
        <div className="flex w-full shrink-0 gap-1 rounded-[12px] border border-line bg-inset p-1 lg:w-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-[9px] px-3.5 py-2.5 text-[13px] font-medium transition-colors lg:flex-initial", activeTab === t.id ? "bg-card text-ink shadow-sm" : "text-ink-faint hover:text-ink-soft")}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left: video + takeaways */}
        <div className="space-y-6 lg:col-span-7">
          <Card pad="none" className="relative flex aspect-video flex-col justify-between overflow-hidden bg-canvas">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <button onClick={() => setIsPlaying(!isPlaying)} className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent-faint text-accent transition-transform hover:scale-105">
                {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
              </button>
              <span className="text-[12px] text-ink-faint">{isPlaying ? "Playing course video" : "Play the course video"}</span>
            </div>
            <div className="relative z-10 flex items-center justify-between p-4 text-[11px] text-ink-soft">
              <span className="rounded border border-line bg-card/80 px-2 py-1">Security practices</span>
              <span className="rounded border border-line bg-card/80 px-2 py-1">720p</span>
            </div>
            <div className="relative z-10 space-y-3 p-4">
              <div className="flex items-center gap-3 text-[11px] text-ink-soft">
                <span className="tnum">01:15</span>
                <div className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-inset" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setVideoProgress(Math.round(((e.clientX - r.left) / r.width) * 100)); }}>
                  <div className="h-full rounded-full bg-accent" style={{ width: `${videoProgress}%` }} />
                </div>
                <span className="tnum">03:45</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="rounded-[8px] border border-line bg-card/80 p-1.5 text-ink-soft hover:text-ink">{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button>
                  <button className="rounded-[8px] border border-line bg-card/80 p-1.5 text-ink-soft hover:text-ink"><Volume2 size={14} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const s = ["1.0x", "1.25x", "1.5x", "2.0x"]; setVideoSpeed(s[(s.indexOf(videoSpeed) + 1) % s.length]); }} className="rounded-[8px] border border-line bg-card/80 px-2 py-1 text-[11px] text-ink-soft hover:text-ink">{videoSpeed}</button>
                  <button className="rounded-[8px] border border-line bg-card/80 p-1.5 text-ink-soft hover:text-ink"><Maximize size={14} /></button>
                </div>
              </div>
            </div>
          </Card>

          <Card pad="lg">
            <CardHeader title="Key takeaways" />
            <div className="mt-4 space-y-2.5">
              {module.takeaways.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-[12px] border border-line bg-inset p-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-faint text-[12px] font-semibold text-accent">{idx + 1}</span>
                  <p className="text-[13.5px] leading-relaxed text-ink-soft">{t}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: tabbed workspace */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {activeTab === "lesson" && (
              <motion.div key="lesson" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Card pad="lg" className="flex min-h-[500px] flex-col justify-between">
                  <div>
                    <CardHeader title="Lesson" description="Read through, then take the checkpoint." />
                    <div className="prose-pp mt-4 text-[13.5px] leading-relaxed text-ink-soft [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:text-ink [&_h4]:mb-1.5 [&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-ink [&_li]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: module.contentHtml }} />
                  </div>
                  <div className="mt-6 flex justify-end border-t border-line pt-5">
                    <Button variant="secondary" icon={<ChevronRight size={15} />} onClick={() => setActiveTab("scenario")}>Checkpoint</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "scenario" && (
              <motion.div key="scenario" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Card pad="lg" className="flex min-h-[500px] flex-col justify-between">
                  <div className="space-y-5">
                    <CardHeader title="Checkpoint" description="A quick gut-check before the quiz." />
                    <p className="rounded-[12px] border border-line bg-inset p-4 text-[13.5px] leading-relaxed text-ink">{module.interactiveScenario.question}</p>
                    <div className="space-y-2">
                      {module.interactiveScenario.options.map((opt, optIdx) => {
                        const isSelected = selectedScenarioOption === optIdx;
                        const isCorrect = optIdx === module.interactiveScenario.correct;
                        return (
                          <button key={optIdx} disabled={scenarioSubmitted} onClick={() => !scenarioSubmitted && setSelectedScenarioOption(optIdx)}
                            className={cn("flex w-full items-start gap-3 rounded-[12px] border p-3.5 text-left text-[13px] transition-colors",
                              scenarioSubmitted ? (isCorrect ? "border-accent/50 bg-accent-faint text-ink" : isSelected ? "border-danger/50 bg-danger-faint text-ink" : "border-line text-ink-faint")
                                : isSelected ? "border-accent/50 bg-accent-faint text-ink" : "border-line text-ink-soft hover:border-line-strong hover:text-ink")}>
                            <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold",
                              scenarioSubmitted ? (isCorrect ? "border-accent text-accent" : isSelected ? "border-danger text-danger" : "border-line text-ink-faint")
                                : isSelected ? "border-accent text-accent" : "border-line text-ink-faint")}>{String.fromCharCode(65 + optIdx)}</span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {scenarioSubmitted && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className={cn("overflow-hidden rounded-[12px] border p-4 text-[13px]", scenarioIsCorrect ? "border-accent/30 bg-accent-faint/50" : "border-danger/30 bg-danger-faint/50")}>
                          <p className="mb-1.5 flex items-center gap-1.5 font-medium">
                            {scenarioIsCorrect ? <span className="flex items-center gap-1 text-accent"><Check size={14} /> Correct</span> : <span className="flex items-center gap-1 text-danger"><X size={14} /> Not quite</span>}
                          </p>
                          <p className="leading-relaxed text-ink-soft">{module.interactiveScenario.explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    {scenarioSubmitted ? <button onClick={handleRetryScenario} className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-ink"><RotateCcw size={13} /> Retry</button> : <span />}
                    <Button variant={scenarioSubmitted && scenarioIsCorrect ? "secondary" : "primary"} disabled={selectedScenarioOption === null}
                      icon={scenarioSubmitted && scenarioIsCorrect ? <ChevronRight size={15} /> : undefined}
                      onClick={() => { if (scenarioSubmitted && scenarioIsCorrect) setActiveTab("quiz"); else handleVerifyScenario(); }}>
                      {scenarioSubmitted && scenarioIsCorrect ? "Continue to quiz" : "Check answer"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "quiz" && (
              <motion.div key="quiz" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Card pad="lg" className="flex min-h-[500px] flex-col justify-between">
                  <div>
                    <CardHeader title="Validation quiz" description="Answer everything to submit." />
                    <div className="scrollbar-thin mt-4 max-h-[380px] space-y-5 overflow-y-auto pr-1.5">
                      {module.quizzes.map((q, idx) => (
                        <div key={q.id} className="space-y-3 rounded-[12px] border border-line bg-inset p-4">
                          <h4 className="flex gap-2 text-[13.5px] font-medium leading-relaxed text-ink"><span className="text-accent">Q{idx + 1}.</span> {q.question}</h4>
                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[q.id] === optIdx;
                              const isCorrect = optIdx === q.correct;
                              return (
                                <button key={optIdx} type="button" disabled={quizSubmitted} onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={cn("flex w-full items-center gap-3 rounded-[10px] border p-3 text-left text-[12.5px] transition-colors",
                                    quizSubmitted ? (isCorrect ? "border-accent/50 bg-accent-faint text-ink" : isSelected ? "border-danger/50 bg-danger-faint text-ink" : "border-line text-ink-faint")
                                      : isSelected ? "border-accent/50 bg-accent-faint text-ink" : "border-line text-ink-soft hover:border-line-strong hover:text-ink")}>
                                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold",
                                    quizSubmitted ? (isCorrect ? "border-accent text-accent" : isSelected ? "border-danger text-danger" : "border-line text-ink-faint")
                                      : isSelected ? "border-accent text-accent" : "border-line text-ink-faint")}>{String.fromCharCode(65 + optIdx)}</span>
                                  <span className="leading-snug">{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div className="flex gap-1.5 rounded-[10px] border border-line bg-card p-3 text-[12px] leading-normal text-ink-soft">
                              <Info size={13} className="mt-0.5 shrink-0 text-accent" />
                              <span>{selectedAnswers[q.id] === q.correct ? "Correct — that's the safe choice." : `The safe answer is ${String.fromCharCode(65 + q.correct)}.`}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    {quizSubmitted ? <button onClick={handleResetQuiz} className="inline-flex items-center gap-1.5 text-[13px] text-ink-soft hover:text-ink"><RotateCcw size={13} /> Reset</button> : <span />}
                    <Button variant="primary" disabled={!allAnswered} onClick={() => { if (quizSubmitted) setResultsModalOpen(true); else handleSubmitQuiz(); }}>
                      {quizSubmitted ? "View results" : "Submit answers"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results modal */}
      <Modal open={resultsModalOpen} onClose={() => setResultsModalOpen(false)} size="sm">
        <ModalBody className="text-center">
          <span className={cn("mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[16px] border", score >= 70 ? "border-accent/30 bg-accent-faint text-accent" : "border-danger/30 bg-danger-faint text-danger")}>
            {score >= 70 ? <ShieldCheck size={32} /> : <AlertTriangle size={32} />}
          </span>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ink">{score >= 70 ? "You passed" : "Almost there"}</h2>
          <p className="mt-1.5 text-[13.5px] text-ink-soft">{score >= 70 ? "Nicely done — this module is complete." : `You scored ${score}%. You need 70% to clear it.`}</p>

          <div className="mt-5 space-y-3 rounded-[12px] border border-line bg-inset p-4 text-left text-[13px]">
            <Row label="Score" value={`${score}%`} valueClass={score >= 70 ? "text-accent" : "text-danger"} />
            <Row label="Status" value={score >= 70 ? "Passed" : "Retry needed"} valueClass={score >= 70 ? "text-accent" : "text-danger"} />
            {score >= 70 && (
              <div className="flex items-center justify-between rounded-[10px] border border-accent/20 bg-accent-faint/50 px-3 py-2 text-[12.5px]">
                <span className="flex items-center gap-1.5 text-accent"><Award size={13} /> Certificate ready</span>
                <span className="text-ink-soft">on your dashboard</span>
              </div>
            )}
            <div className="h-px bg-line" />
            <Row label="New awareness score" value={`${awarenessScoreUpdate || "…"}%`} valueClass="text-ink" />
            <div className="flex items-center justify-between"><span className="text-ink-faint">Risk profile</span><Badge tone="muted">{updatedRisk || "active"}</Badge></div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {score < 70 && <Button variant="secondary" onClick={handleResetQuiz}>Retry quiz</Button>}
            <Button variant="primary" onClick={() => { setResultsModalOpen(false); router.push("/learning"); }}>Back to learning</Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-faint">{label}</span>
      <span className={cn("font-medium", valueClass)}>{value}</span>
    </div>
  );
}
