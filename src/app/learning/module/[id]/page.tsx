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
  ShieldCheck
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  contentHtml: string;
  quizzes: QuizQuestion[];
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [module, setModule] = useState<Module | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Tabs: 'lesson' | 'quiz'
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson');
  
  // Quiz states
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
        if (activeModule) setModule(activeModule);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitQuiz = async () => {
    if (!module || !userId) return;

    // Calculate score
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
          completed: finalScore >= 70 // Pass threshold
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-t-2 border-brand-purple border-r-2 border-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono text-gray-400">Loading Lesson Workspace...</span>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
        <AlertTriangle className="text-brand-rose mx-auto" size={40} />
        <h2 className="text-xl font-bold text-white">Course Not Found</h2>
        <p className="text-gray-400 text-sm">The requested training modules does not exist in standard curricula.</p>
        <Link href="/learning" className="inline-block text-brand-purple hover:underline font-semibold font-mono text-xs">
          Return to directory
        </Link>
      </div>
    );
  }

  const allAnswered = module.quizzes.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link 
          href="/learning" 
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-white font-mono transition"
        >
          <ArrowLeft size={12} /> Back to Courses
        </Link>
      </div>

      {/* Header Panel */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{module.title}</h1>
          <p className="text-xs text-gray-400 max-w-2xl">{module.description}</p>
        </div>

        {/* Workspace selector tabs */}
        <div className="flex bg-white/5 border border-cyber-border rounded-xl p-1 text-xs font-mono shrink-0">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${activeTab === 'lesson' ? 'bg-brand-purple/20 text-brand-purple' : 'text-gray-400 hover:text-white'}`}
          >
            <BookOpen size={14} /> Lesson Content
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${activeTab === 'quiz' ? 'bg-brand-purple/20 text-brand-purple' : 'text-gray-400 hover:text-white'}`}
          >
            <HelpCircle size={14} /> Validation Check ({module.quizzes.length})
          </button>
        </div>
      </div>

      {/* Main Workspace content */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 min-h-[50vh]">
        {activeTab === 'lesson' ? (
          /* Lesson body content HTML */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert max-w-none text-gray-300 space-y-6"
          >
            <div 
              className="space-y-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: module.contentHtml }} 
            />

            <div className="mt-8 pt-6 border-t border-cyber-border/40 flex justify-end">
              <button
                onClick={() => setActiveTab('quiz')}
                className="flex items-center gap-1.5 bg-brand-purple/20 border border-brand-purple/40 hover:bg-brand-purple/30 text-brand-purple px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Proceed to Quiz <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Quiz questions list */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="space-y-6 max-w-3xl">
              {module.quizzes.map((q, idx) => (
                <div key={q.id} className="p-6 rounded-2xl bg-white/3 border border-cyber-border space-y-4">
                  <h3 className="text-sm font-semibold text-white flex gap-2">
                    <span className="text-brand-purple font-mono">Q{idx + 1}.</span> {q.question}
                  </h3>
                  
                  {/* Multiple choice radio selection */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition ${
                            isSelected 
                              ? 'border-brand-purple bg-brand-purple/10 text-white' 
                              : 'border-cyber-border hover:border-cyber-border-hover text-gray-400 hover:text-white bg-black/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] ${
                              isSelected 
                                ? 'border-brand-purple text-brand-purple bg-brand-purple/10 font-bold' 
                                : 'border-gray-700 text-gray-500'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-cyber-border/40 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="flex items-center gap-1.5 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 disabled:from-gray-600 disabled:to-gray-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
              >
                Submit Validation Answers
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Congratulatory Modal */}
      <AnimatePresence>
        {resultsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 rounded-3xl max-w-md w-full relative z-10 border border-cyber-border text-center overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple mx-auto mb-6">
                {score >= 70 ? <ShieldCheck size={36} /> : <AlertTriangle size={36} />}
              </div>

              {score >= 70 ? (
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-extrabold text-white">Validation Quiz Passed!</h2>
                  <p className="text-xs text-gray-400">Excellent job. You have completed the validation checks successfully.</p>
                </div>
              ) : (
                <div className="space-y-2 mb-6">
                  <h2 className="text-2xl font-extrabold text-white">Minimum Score Missed</h2>
                  <p className="text-xs text-gray-400">You scored {score}%. A minimum score of 70% is required to clear compliance.</p>
                </div>
              )}

              {/* Progress details */}
              <div className="p-4 rounded-2xl bg-white/5 border border-cyber-border space-y-4 mb-6 text-xs text-left font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Validation Score:</span>
                  <span className="font-bold text-white">{score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Compliance Status:</span>
                  <span className={score >= 70 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {score >= 70 ? 'PASSED' : 'RETRY REQUIRED'}
                  </span>
                </div>
                <div className="h-px bg-cyber-border/40" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">New Awareness Score:</span>
                  <span className="font-bold text-brand-cyan text-sm">{awarenessScoreUpdate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">New Risk Profile:</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-cyber-border text-brand-purple font-bold text-[10px]">
                    {updatedRisk}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResultsModalOpen(false);
                  router.push('/learning');
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold text-sm transition hover:brightness-110"
              >
                Return to Learning Center
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
