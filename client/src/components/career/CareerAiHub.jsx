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
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Roadmap error:', err);
      alert('Failed to generate roadmap with AI.');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-500/30 mb-2">
          <Bot className="w-3.5 h-3.5 text-rose-400" />
          <span>Google Gemini Career Copilot</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Career AI & Interview Intelligence
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Simulate realistic hiring manager interviews, receive AI scoring, and plan your career upskilling roadmap.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 gap-1 text-xs max-w-md">
        {[
          { id: 'questions', label: 'Interview Questions', icon: HelpCircle },
          { id: 'mock', label: 'Mock Simulator', icon: MessageSquare },
          { id: 'roadmap', label: 'Skill Roadmap', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Interview Questions */}
      {subTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role (e.g. Senior Frontend Engineer)"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs"
              />
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs"
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
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50"
            >
              {loadingQuestions ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
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
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xl transition-all space-y-3"
                >
                  <div
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="flex justify-between items-start gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          q.type === 'Technical'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : q.type === 'System Design'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {q.type}
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-snug">{q.question}</h4>
                    </div>

                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs animate-fadeIn">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-amber-400 flex items-center gap-1 mb-1">
                          <Lightbulb className="w-3.5 h-3.5" /> What Interviewers Look For:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{q.tips}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-blue-400 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Key Talking Points & Model Response:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{q.sampleAnswer}</p>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            setSelectedMockQ(q);
                            setSubTab('mock');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5"
                        >
                          <span>Practice in Mock Simulator</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              Interview Simulator Prompt
            </h3>

            {/* Select Question */}
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Select Question to Practice</label>
              <select
                value={selectedMockQ?.id || ''}
                onChange={(e) => {
                  const found = questions.find((q) => q.id === Number(e.target.value));
                  if (found) setSelectedMockQ(found);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    [{q.type}] {q.question.slice(0, 60)}...
                  </option>
                ))}
              </select>
            </div>

            {selectedMockQ && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200">
                <span className="font-bold text-rose-400 block mb-1">Interviewer Prompt:</span>
                <p className="leading-relaxed">{selectedMockQ.question}</p>
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Your Answer</label>
              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your structured response (Situation, Task, Action, Result) here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleEvaluateMock}
              disabled={evaluating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>AI Evaluating Your Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Evaluate My Answer with AI</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              AI Evaluation & Feedback Score
            </h3>

            {evaluation ? (
              <div className="space-y-4 animate-fadeIn text-xs">
                {/* Score Header */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Verdict</div>
                    <div className="text-lg font-bold text-white">{evaluation.verdict}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
                      {evaluation.score}/100
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Signal Score</div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths?.length > 0 && (
                  <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {evaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements?.length > 0 && (
                  <div className="p-3.5 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-1.5">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Areas for Improvement:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improved Answer */}
                {evaluation.improvedAnswer && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-1.5">
                    <span className="font-bold text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Exemplary Model Response:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{evaluation.improvedAnswer}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 text-rose-400 mb-2 opacity-50" />
                <span>Select a question, enter your response, and click Evaluate to see feedback.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Skill Roadmap */}
      {subTab === 'roadmap' && (
        <div className="space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Target Role Goal (e.g. Staff Software Architect)"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
              <select
                value={roadmapTimeframe}
                onChange={(e) => setRoadmapTimeframe(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              >
                <option value="30-Days Sprint">30-Days Sprint</option>
                <option value="60-Days Plan">60-Days Comprehensive</option>
                <option value="90-Days Mastery">90-Days Full Mastery</option>
              </select>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={loadingRoadmap}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 shrink-0 transition-all disabled:opacity-50"
            >
              {loadingRoadmap ? <RotateCw className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
              <span>Generate Skill Roadmap</span>
            </button>
          </div>

          {roadmap && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(roadmap.phases || []).map((phase, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                        Phase #{pIdx + 1}
                      </span>
                      <h4 className="font-bold text-white text-sm">{phase.phase}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{phase.focus}</p>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[11px] font-bold text-blue-400">Milestones:</span>
                        {(phase.milestones || []).map((m, mIdx) => (
                          <div key={mIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {phase.recommendedProjects?.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 text-xs">
                        <span className="font-bold text-amber-400">Portfolio Project:</span>
                        <p className="text-slate-300 text-[11px] mt-0.5">{phase.recommendedProjects[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {roadmap.topCertifications?.length > 0 && (
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Recommended Certifications:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.topCertifications.map((cert, cIdx) => (
                      <span key={cIdx} className="bg-slate-950 text-slate-200 border border-slate-800 px-2.5 py-1 rounded-lg">
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
