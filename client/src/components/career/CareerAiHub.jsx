import React, { useState, useEffect } from 'react';
import {
  Bot,
  MessageSquare,
  Compass,
  Award,
  Sparkles,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';
import { aiAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function CareerAiHub({ activeResume }) {
  const [subTab, setSubTab] = useState('questions'); // 'questions' | 'mock' | 'roadmap'

  // Questions State
  const [targetRole, setTargetRole] = useState(
    activeResume?.targetJobTitle || activeResume?.personalInfo?.headline || 'Senior Full Stack Engineer'
  );
  const [experienceLevel, setExperienceLevel] = useState('Senior Level');
  const [category, setCategory] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [expandedQId, setExpandedQId] = useState(null);

  // Mock Interview State
  const [selectedMockQ, setSelectedMockQ] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  // Skill Roadmap State
  const [roadmapTimeframe, setRoadmapTimeframe] = useState('90-Days');
  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  useEffect(() => {
    handleFetchQuestions();
  }, []);

  const handleFetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const allSkills = (activeResume?.skillGroups || []).flatMap((g) => g.items || []);
      const res = await aiAPI.getInterviewQuestions({
        targetRole,
        skills: allSkills,
        experienceLevel,
        category,
      });
      if (res.data.success && res.data.data) {
        setQuestions(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedMockQ(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Questions error:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateMock = async () => {
    if (!selectedMockQ || !userAnswer.trim()) {
      alert('Please select a question and type your answer.');
      return;
    }

    try {
      setEvaluating(true);
      setEvaluation(null);
      const res = await aiAPI.evaluateMock({
        question: selectedMockQ.question,
        answer: userAnswer,
        targetRole,
      });

      if (res.data.success && res.data.data) {
        setEvaluation(res.data.data);
        if (res.data.data.score >= 80) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
      }
    } catch (err) {
      console.error('Mock evaluate error:', err);
      alert('Failed to evaluate answer with AI.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    try {
      setLoadingRoadmap(true);
      const allSkills = (activeResume?.skillGroups || []).flatMap((g) => g.items || []);
      const res = await aiAPI.getSkillRoadmap({
        currentSkills: allSkills,
        targetRole,
        timeframe: roadmapTimeframe,
      });

      if (res.data.success && res.data.data) {
        setRoadmap(res.data.data);
        confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Roadmap error:', err);
      alert('Failed to generate roadmap with AI.');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 shadow-card transition-colors duration-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-50 dark:bg-plum-950/80 text-plum-900 dark:text-plum-200 text-xs font-bold border border-plum-200 dark:border-plum-800">
            <Bot className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>Google Gemini Career Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-text tracking-tight font-display">
            Career AI & Interview Simulator
          </h2>
          <p className="text-surface-muted text-xs sm:text-sm leading-relaxed">
            Practice realistic hiring manager interview scenarios, receive AI scoring with model answers, and plan your 90-day learning roadmap.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-surface-elevated border border-surface-border rounded-2xl p-1 gap-1 text-xs max-w-md overflow-x-auto scrollbar-none">
        {[
          { id: 'questions', label: 'Questions', fullLabel: 'Interview Questions', icon: HelpCircle },
          { id: 'mock', label: 'Mock Simulator', fullLabel: 'Mock Simulator', icon: MessageSquare },
          { id: 'roadmap', label: 'Skill Roadmap', fullLabel: 'Skill Roadmap', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all whitespace-nowrap min-h-[40px] ${
                isActive
                  ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                  : 'text-surface-muted hover:text-surface-text'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-terracotta-300' : 'text-surface-muted'}`} />
              <span className="hidden sm:inline">{tab.fullLabel}</span>
              <span className="sm:hidden">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Interview Questions */}
      {subTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-4 sm:p-6 shadow-card flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role (e.g. Senior Frontend Engineer)"
                className="bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
              />
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-semibold min-h-[42px]"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Staff">Lead / Staff</option>
              </select>
            </div>

            <button
              onClick={handleFetchQuestions}
              disabled={loadingQuestions}
              className="px-5 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50 min-h-[42px]"
            >
              {loadingQuestions ? <RotateCw className="w-3.5 h-3.5 animate-spin text-terracotta-300" /> : <Sparkles className="w-3.5 h-3.5 text-terracotta-300" />}
              <span>Generate Questions</span>
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {questions.map((q) => {
              const isExpanded = expandedQId === q.id;
              return (
                <div
                  key={q.id}
                  className="bg-surface-card border border-surface-border hover:border-plum-500/40 rounded-2xl p-4 sm:p-5 shadow-subtle transition-all space-y-3"
                >
                  <div
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="flex justify-between items-start gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1 min-w-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          q.type === 'Technical'
                            ? 'bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border border-plum-200'
                            : q.type === 'System Design'
                            ? 'bg-terracotta-50 dark:bg-terracotta-950 text-terracotta-800 dark:text-terracotta-200 border border-terracotta-200'
                            : 'bg-sage-50 dark:bg-sage-950 text-sage-800 dark:text-sage-200 border border-sage-200'
                        }`}
                      >
                        {q.type}
                      </span>
                      <h4 className="font-bold text-surface-text text-sm sm:text-base leading-snug">{q.question}</h4>
                    </div>

                    <button className="text-surface-muted hover:text-surface-text p-1.5 shrink-0" aria-label={isExpanded ? 'Collapse question' : 'Expand question'}>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-surface-border space-y-2.5 text-xs animate-fade-in">
                      <div className="p-3 sm:p-3.5 bg-surface-elevated rounded-xl border border-surface-border">
                        <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0" /> What Interviewers Look For:
                        </span>
                        <p className="text-surface-text leading-relaxed">{q.tips}</p>
                      </div>

                      <div className="p-3 sm:p-3.5 bg-surface-elevated rounded-xl border border-surface-border">
                        <span className="font-bold text-plum-900 dark:text-plum-200 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0" /> Model Talking Points & Response:
                        </span>
                        <p className="text-surface-text leading-relaxed">{q.sampleAnswer}</p>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            setSelectedMockQ(q);
                            setSubTab('mock');
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-plum-50 dark:bg-plum-950 hover:bg-plum-100 text-plum-900 dark:text-plum-200 border border-plum-200 dark:border-plum-800 font-bold text-xs flex items-center justify-center gap-1.5 min-h-[38px]"
                        >
                          <span>Practice in Mock Simulator</span>
                          <ArrowRight className="w-3.5 h-3.5 text-terracotta-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Mock Interview Simulator */}
      {subTab === 'mock' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-surface-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-plum-800 dark:text-plum-300 shrink-0" />
              <span>Interview Prompt & Answer</span>
            </h3>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Select Question</label>
              <select
                value={selectedMockQ?.id || ''}
                onChange={(e) => {
                  const found = questions.find((q) => q.id === Number(e.target.value));
                  if (found) setSelectedMockQ(found);
                }}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs font-semibold focus:outline-none focus:border-plum-600 min-h-[44px]"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{q.type}] {q.question.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            {selectedMockQ && (
              <div className="p-3.5 sm:p-4 bg-surface-elevated rounded-2xl border border-surface-border text-xs text-surface-text space-y-1">
                <span className="font-bold text-terracotta-600 dark:text-terracotta-400 block text-[11px] uppercase tracking-wider">
                  Interviewer Question:
                </span>
                <p className="leading-relaxed font-semibold">{selectedMockQ.question}</p>
              </div>
            )}

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Your Structured Response</label>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response using STAR framework (Situation, Task, Action, Result)..."
                className="w-full bg-surface-elevated border border-surface-border rounded-xl p-3 text-surface-text text-xs leading-relaxed focus:outline-none focus:border-plum-600 font-medium"
              />
            </div>

            <button
              onClick={handleEvaluateMock}
              disabled={evaluating}
              className="w-full py-3 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 min-h-[46px]"
            >
              {evaluating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-terracotta-300" />
                  <span>Evaluating Response with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-terracotta-300" />
                  <span>Evaluate My Answer</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card space-y-4 min-h-[340px] sm:min-h-[380px]">
            <h3 className="text-sm font-bold text-surface-text flex items-center gap-2">
              <Award className="w-4 h-4 text-terracotta-500 shrink-0" />
              <span>AI Evaluation & Feedback Score</span>
            </h3>

            {evaluation ? (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Score Header */}
                <div className="p-3.5 sm:p-4 bg-surface-elevated rounded-2xl border border-surface-border flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-surface-muted font-semibold">Evaluation Verdict</div>
                    <div className="text-base sm:text-lg font-bold text-surface-text font-display">{evaluation.verdict}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-plum-900 dark:text-plum-200 font-display">
                      {evaluation.score}/100
                    </div>
                    <div className="text-[10px] text-surface-muted font-bold uppercase">Performance Score</div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths?.length > 0 && (
                  <div className="p-3.5 bg-sage-50/70 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 rounded-2xl space-y-1.5">
                    <span className="font-bold text-sage-800 dark:text-sage-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0" /> Key Strengths:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-surface-text">
                      {evaluation.strengths.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements?.length > 0 && (
                  <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-1.5">
                    <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Areas for Improvement:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-surface-text">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx} className="leading-relaxed">{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improved Answer */}
                {evaluation.improvedAnswer && (
                  <div className="p-3.5 sm:p-4 bg-surface-elevated rounded-2xl border border-plum-200 dark:border-plum-800 space-y-1.5">
                    <span className="font-bold text-plum-900 dark:text-plum-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-terracotta-500 shrink-0" /> Exemplary Model Response:
                    </span>
                    <p className="text-surface-text leading-relaxed">{evaluation.improvedAnswer}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-56 sm:h-64 rounded-2xl bg-surface-elevated border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-center p-6 text-surface-muted text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-plum-800 dark:text-plum-300 opacity-60" />
                <span>Select a question, type your response, and evaluate to receive AI coaching.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Skill Roadmap */}
      {subTab === 'roadmap' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-surface-card border border-surface-border rounded-3xl p-4 sm:p-6 shadow-card flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role Goal (e.g. Staff Software Architect)"
                className="bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
              />
              <select
                value={roadmapTimeframe}
                onChange={(e) => setRoadmapTimeframe(e.target.value)}
                className="bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-semibold min-h-[42px]"
              >
                <option value="30-Days Sprint">30-Days Sprint</option>
                <option value="60-Days Plan">60-Days Comprehensive</option>
                <option value="90-Days Mastery">90-Days Full Mastery</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={loadingRoadmap}
              className="px-6 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50 min-h-[42px]"
            >
              {loadingRoadmap ? <RotateCw className="w-3.5 h-3.5 animate-spin text-terracotta-300" /> : <Compass className="w-3.5 h-3.5 text-terracotta-300" />}
              <span>Generate 90-Day Roadmap</span>
            </button>
          </div>

          {roadmap && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(roadmap.phases || []).map((phase, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-surface-card border border-surface-border rounded-3xl p-4 sm:p-5 shadow-subtle space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 text-[10px] font-bold border border-plum-200">
                        Phase #{pIdx + 1}
                      </span>
                      <h4 className="font-bold text-surface-text text-sm">{phase.phase}</h4>
                      <p className="text-surface-muted text-xs leading-relaxed">{phase.focus}</p>

                      <div className="pt-2 border-t border-surface-border space-y-1.5">
                        <span className="text-[11px] font-bold text-plum-900 dark:text-plum-200">Milestones:</span>
                        {(phase.milestones || []).map((m, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-1.5 text-xs text-surface-text">
                            <span className="text-terracotta-500 font-bold">•</span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {phase.recommendedProjects?.length > 0 && (
                      <div className="pt-2 border-t border-surface-border text-xs">
                        <span className="font-bold text-amber-700 dark:text-amber-300">Portfolio Project:</span>
                        <p className="text-surface-text text-[11px] mt-0.5 font-medium">{phase.recommendedProjects[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {roadmap.topCertifications?.length > 0 && (
                <div className="p-4 bg-surface-card border border-surface-border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-subtle">
                  <span className="font-bold text-surface-text flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" /> Recommended Certifications:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.topCertifications.map((cert, cIdx) => (
                      <span key={cIdx} className="bg-surface-elevated text-surface-text border border-surface-border px-3 py-1 rounded-lg font-semibold">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
