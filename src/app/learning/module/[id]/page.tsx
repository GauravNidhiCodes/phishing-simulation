'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  ChevronRight,
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

interface InteractiveScenario {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  contentHtml: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  takeaways: string[];
  videoUrl: string;
  interactiveScenario: InteractiveScenario;
  quizzes: QuizQuestion[];
  progress: Array<{ completed: boolean; score: number }>;
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [module, setModule] = useState<Module | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Workspace tabs: 'lesson' | 'scenario' | 'quiz'
  const [activeTab, setActiveTab] = useState<'lesson' | 'scenario' | 'quiz'>('lesson');
  
  // Video mock state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [videoSpeed, setVideoSpeed] = useState('1.0x');

  // Interactive Scenario Checkpoint States
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);
  const [scenarioSubmitted, setScenarioSubmitted] = useState(false);
  const [scenarioIsCorrect, setScenarioIsCorrect] = useState(false);

  // Main Quiz States
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [awarenessScoreUpdate, setAwarenessScoreUpdate] = useState(0);
  const [updatedRisk, setUpdatedRisk] = useState('');
  
  // Modal for results
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/learning/modules')
      .then(res => res.json())
      .then(data => {
        setUserId(data.user.id);
        const activeModule = data.modules.find((m: any) => m.id === id);
        if (activeModule) {
          setModule(activeModule);
          // If already completed in db, user might want to review
          const isCompleted = activeModule.progress && activeModule.progress[0]?.completed;
          if (isCompleted) {
            setScore(activeModule.progress[0].score);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return; // Locked on submission
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleVerifyScenario = () => {
    if (!module || selectedScenarioOption === null) return;
    const isCorrect = selectedScenarioOption === module.interactiveScenario.correct;
    setScenarioIsCorrect(isCorrect);
    setScenarioSubmitted(true);
  };

  const handleRetryScenario = () => {
    setSelectedScenarioOption(null);
    setScenarioSubmitted(false);
    setScenarioIsCorrect(false);
  };

  const handleSubmitQuiz = async () => {
    if (!module || !userId) return;

    let correctCount = 0;
    module.quizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / module.quizzes.length) * 100);
    setScore(finalScore);

    try {
      const res = await fetch('/api/learning/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: module.id,
          userId,
          score: finalScore,
          completed: finalScore >= 70
        })
      });

      if (res.ok) {
        const result = await res.json();
        setAwarenessScoreUpdate(result.newScore);
        setUpdatedRisk(result.riskCategory);
        setQuizSubmitted(true);
        setResultsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setResultsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-t-2 border-brand-cyan border-r-2 border-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 border-b-2 border-brand-purple border-l-2 border-transparent rounded-full animate-spin [animation-direction:reverse]" />
        </div>
        <span className="text-sm font-mono text-gray-400 tracking-widest uppercase animate-pulse">Initializing Workspace...</span>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto mt-12">
        <AlertTriangle className="text-brand-rose mx-auto" size={40} />
        <h2 className="text-xl font-bold text-white">Course Not Found</h2>
        <p className="text-gray-400 text-sm leading-relaxed">The requested training modules does not exist in standard curricula.</p>
        <Link href="/learning" className="inline-block text-brand-purple hover:underline font-semibold font-mono text-xs">
          Return to Learning directory
        </Link>
      </div>
    );
  }

  const allAnswered = module.quizzes.every(q => selectedAnswers[q.id] !== undefined);
  const completionPercentage = module.progress && module.progress[0]?.completed ? 100 : (activeTab === 'lesson' ? 30 : activeTab === 'scenario' ? 65 : 85);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/learning" 
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-mono transition"
        >
          <ArrowLeft size={13} /> Back to Academy Directory
        </Link>

        {/* Global Progress Bar for this Course */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl text-xs font-mono">
          <span className="text-gray-500">Course Completion:</span>
          <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-cyan transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
          </div>
          <span className="text-brand-cyan font-bold">{completionPercentage}%</span>
        </div>
      </div>

      {/* Header Info Panel */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-white/5 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[9px] font-mono font-bold uppercase tracking-wider">
              {module.category}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">• {module.duration} reading time</span>
            <span className="text-[10px] text-gray-500 font-mono">• {module.difficulty} level</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{module.title}</h1>
          <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">{module.description}</p>
        </div>

        {/* Interactive Workspace Tab Selector */}
        <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1 text-xs font-mono w-full lg:w-auto shrink-0">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition ${activeTab === 'lesson' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/25' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            <BookOpen size={13} /> 1. Lesson Content
          </button>
          <button
            onClick={() => setActiveTab('scenario')}
            className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition ${activeTab === 'scenario' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/25' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            <Sparkles size={13} /> 2. Checkpoint Challenge
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 lg:flex-initial px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition ${activeTab === 'quiz' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/25' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            <HelpCircle size={13} /> 3. Validation Check ({module.quizzes.length})
          </button>
        </div>
      </div>

      {/* Main split-screen interactive layouts */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Video + Takeaways / Background info */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Simulated Video Player Container */}
          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden bg-black relative aspect-video flex flex-col justify-between group shadow-2xl">
            {/* Visual backdrop of player */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none z-10" />
            
            {/* Mock video content display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 z-0">
              {/* Play symbol placeholder */}
              <div className="w-16 h-16 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform shadow-inner">
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </div>
              <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                {isPlaying ? 'Streaming course content...' : 'Click to stream course audio/video'}
              </span>
            </div>

            {/* Video metadata top bar */}
            <div className="p-4 flex justify-between items-center z-20 text-[10px] font-mono text-white/80">
              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">Video 1: Security Practices</span>
              <span className="bg-black/50 px-2 py-1 rounded border border-white/5">MP4 • 720p HD</span>
            </div>

            {/* Player Controls bottom bar */}
            <div className="p-4 z-20 space-y-3">
              {/* Progress Bar */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-white">
                <span>01:15</span>
                <div 
                  className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setVideoProgress(Math.round((clickX / rect.width) * 100));
                  }}
                >
                  <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${videoProgress}%` }} />
                </div>
                <span>03:45</span>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-between items-center text-white text-xs font-mono">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:text-brand-cyan transition"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition">
                    <Volume2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <button 
                    onClick={() => {
                      const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                      const next = speeds[(speeds.indexOf(videoSpeed) + 1) % speeds.length];
                      setVideoSpeed(next);
                    }}
                    className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:text-brand-cyan transition text-[10px]"
                  >
                    {videoSpeed}
                  </button>
                  <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white transition">
                    <Maximize size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways summary */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
              <Award size={14} className="text-brand-cyan" /> Core Lesson Takeaways
            </h3>

            <div className="space-y-3 font-mono text-xs text-gray-300">
              {module.takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/5">
                  <span className="w-5 h-5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0 font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Interactive tabbed workspaces */}
        <div className="lg:col-span-5 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeTab === 'lesson' && (
              <motion.div
                key="lesson-desk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 min-h-[500px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
                      <BookOpen size={14} /> Lesson Reading Desk
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500">Curricula Manual</span>
                  </div>

                  <div 
                    className="prose prose-invert text-xs leading-relaxed text-gray-300 space-y-4"
                    dangerouslySetInnerHTML={{ __html: module.contentHtml }} 
                  />
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => setActiveTab('scenario')}
                    className="flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/40 hover:bg-brand-purple/30 text-brand-purple px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition"
                  >
                    Proceed to Checkpoint Challenge <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'scenario' && (
              <motion.div
                key="scenario-desk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 min-h-[500px] flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                      <Sparkles size={14} className="text-brand-cyan" /> 1. Scenario Checkpoint
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan font-mono font-bold uppercase tracking-wider">
                      Interactive Challenge
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-medium bg-white/2 p-4 rounded-2xl border border-white/5">
                    {module.interactiveScenario.question}
                  </p>

                  <div className="space-y-2">
                    {module.interactiveScenario.options.map((opt, optIdx) => {
                      const isSelected = selectedScenarioOption === optIdx;
                      const isCorrectAnswer = optIdx === module.interactiveScenario.correct;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (scenarioSubmitted) return;
                            setSelectedScenarioOption(optIdx);
                          }}
                          disabled={scenarioSubmitted}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs transition flex items-start gap-3 ${
                            scenarioSubmitted 
                              ? isCorrectAnswer 
                                ? 'border-brand-emerald bg-brand-emerald/10 text-white' 
                                : isSelected 
                                  ? 'border-brand-rose bg-brand-rose/10 text-white' 
                                  : 'border-white/5 text-gray-500 bg-black/10'
                              : isSelected 
                                ? 'border-brand-cyan bg-brand-cyan/10 text-white' 
                                : 'border-white/5 hover:border-white/10 text-gray-400 hover:text-white bg-black/25'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[9px] shrink-0 ${
                            scenarioSubmitted 
                              ? isCorrectAnswer 
                                ? 'border-brand-emerald text-brand-emerald bg-brand-emerald/10' 
                                : isSelected 
                                  ? 'border-brand-rose text-brand-rose bg-brand-rose/10' 
                                  : 'border-gray-800 text-gray-600'
                              : isSelected 
                                ? 'border-brand-cyan text-brand-cyan bg-brand-cyan/10' 
                                : 'border-white/10 text-gray-500'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback overlay */}
                  <AnimatePresence>
                    {scenarioSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-2xl border text-xs ${
                          scenarioIsCorrect 
                            ? 'bg-brand-emerald/5 border-brand-emerald/15 text-gray-300' 
                            : 'bg-brand-rose/5 border-brand-rose/15 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-1.5">
                          {scenarioIsCorrect ? (
                            <span className="text-brand-emerald flex items-center gap-1"><Check size={14} /> Correct Verification</span>
                          ) : (
                            <span className="text-brand-rose flex items-center gap-1"><X size={14} /> Critical Security Vulnerability Detected</span>
                          )}
                        </div>
                        <p className="leading-relaxed font-mono text-[11px]">
                          {module.interactiveScenario.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  {scenarioSubmitted ? (
                    <button
                      onClick={handleRetryScenario}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-mono transition"
                    >
                      <RotateCcw size={12} /> Retry Checkpoint
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={() => {
                      if (scenarioSubmitted && scenarioIsCorrect) {
                        setActiveTab('quiz');
                      } else {
                        handleVerifyScenario();
                      }
                    }}
                    disabled={selectedScenarioOption === null}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition ${
                      selectedScenarioOption === null
                        ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                        : scenarioSubmitted && scenarioIsCorrect
                          ? 'bg-brand-purple/20 border border-brand-purple/40 text-brand-purple hover:bg-brand-purple/30'
                          : 'bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan/30'
                    }`}
                  >
                    {scenarioSubmitted && scenarioIsCorrect ? (
                      <>Unlock Validation Quiz <ChevronRight size={13} /></>
                    ) : (
                      <>Verify My Choice</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz-desk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 min-h-[500px] flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
                      <HelpCircle size={14} /> 2. Validation Check
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500">
                      Answer all to submit
                    </span>
                  </div>

                  <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                    {module.quizzes.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-3">
                        <h4 className="text-xs font-semibold text-white leading-relaxed flex gap-2">
                          <span className="text-brand-purple font-mono">Q{idx + 1}.</span> {q.question}
                        </h4>
                        
                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[q.id] === optIdx;
                            const isCorrectAnswer = optIdx === q.correct;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectOption(q.id, optIdx)}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-xl border text-[11px] font-medium transition flex items-center gap-3 ${
                                  quizSubmitted
                                    ? isCorrectAnswer
                                      ? 'border-brand-emerald bg-brand-emerald/10 text-white'
                                      : isSelected
                                        ? 'border-brand-rose bg-brand-rose/10 text-white'
                                        : 'border-white/5 text-gray-500 bg-black/10'
                                    : isSelected
                                      ? 'border-brand-purple bg-brand-purple/10 text-white'
                                      : 'border-white/5 hover:border-white/10 text-gray-400 hover:text-white bg-black/20'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center font-mono text-[8px] shrink-0 ${
                                  quizSubmitted
                                    ? isCorrectAnswer
                                      ? 'border-brand-emerald text-brand-emerald bg-brand-emerald/10 font-bold'
                                      : isSelected
                                        ? 'border-brand-rose text-brand-rose bg-brand-rose/10 font-bold'
                                        : 'border-gray-800 text-gray-600'
                                    : isSelected
                                      ? 'border-brand-purple text-brand-purple bg-brand-purple/10 font-bold'
                                      : 'border-white/10 text-gray-500'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="leading-snug">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation on submission */}
                        {quizSubmitted && (
                          <div className="p-3 rounded-xl bg-white/3 border border-white/5 text-[10px] font-mono text-gray-400 leading-normal flex gap-1.5">
                            <Info size={12} className="text-brand-purple shrink-0 mt-0.5" />
                            <span>
                              {selectedAnswers[q.id] === q.correct 
                                ? 'Correct! Your choice demonstrates compliant cybersecurity behavior.' 
                                : `Incorrect. The safe protocol is Option ${String.fromCharCode(65 + q.correct)}.`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  {quizSubmitted ? (
                    <button
                      onClick={handleResetQuiz}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white font-mono transition"
                    >
                      <RotateCcw size={12} /> Reset Answers
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (quizSubmitted) {
                        setResultsModalOpen(true);
                      } else {
                        handleSubmitQuiz();
                      }
                    }}
                    disabled={!allAnswered}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold transition ${
                      !allAnswered 
                        ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                        : quizSubmitted
                          ? 'bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan hover:bg-brand-cyan/30'
                          : 'bg-gradient-to-r from-brand-cyan to-brand-purple text-white hover:brightness-110 shadow-lg shadow-brand-purple/10'
                    }`}
                  >
                    {quizSubmitted ? (
                      <>View Results Details</>
                    ) : (
                      <>Submit Validation answers</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Quiz Results Overlay Congratulatory Modal */}
      <AnimatePresence>
        {resultsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setResultsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-white/10 text-center overflow-hidden"
            >
              {/* Radial glow background */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${
                score >= 70 
                  ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald glow-border-emerald' 
                  : 'bg-brand-rose/10 border-brand-rose/20 text-brand-rose'
              }`}>
                {score >= 70 ? <ShieldCheck size={36} /> : <AlertTriangle size={36} />}
              </div>

              {score >= 70 ? (
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Validation Check Passed!</h2>
                  <p className="text-xs text-gray-400">Excellent work. You have demonstrated compliant awareness and cleared this training module.</p>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Minimum Target Missed</h2>
                  <p className="text-xs text-gray-400">You scored {score}%. A minimum score of 70% is required to clear organizational compliance.</p>
                </div>
              )}

              {/* Scorecard metrics */}
              <div className="p-5 rounded-2xl bg-white/3 border border-white/5 space-y-4 mb-6 text-xs text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Validation Score:</span>
                  <span className={`font-bold ${score >= 70 ? 'text-brand-emerald' : 'text-brand-rose'}`}>{score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Compliance Status:</span>
                  <span className={score >= 70 ? 'text-brand-emerald font-bold' : 'text-brand-rose font-bold'}>
                    {score >= 70 ? 'PASSED' : 'RETRY REQUIRED'}
                  </span>
                </div>
                
                {score >= 70 && (
                  <>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between items-center text-[10px] text-brand-emerald/80 bg-brand-emerald/5 p-2 rounded-lg border border-brand-emerald/10">
                      <div className="flex items-center gap-1"><Award size={12} /> Certificate Generated</div>
                      <span className="font-bold">Check dashboard</span>
                    </div>
                  </>
                )}

                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">New Personal Score:</span>
                  <span className="font-bold text-brand-cyan text-sm">{awarenessScoreUpdate || 'Updating...'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Compliance Risk Profile:</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-brand-purple font-bold text-[10px]">
                    {updatedRisk || 'ACTIVE'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {score < 70 && (
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-white/10 font-semibold text-xs font-mono transition"
                  >
                    Retry Validation Quiz
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setResultsModalOpen(false);
                    router.push('/learning');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold text-xs font-mono transition hover:brightness-110 shadow-md shadow-brand-purple/10"
                >
                  Return to Academy Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
