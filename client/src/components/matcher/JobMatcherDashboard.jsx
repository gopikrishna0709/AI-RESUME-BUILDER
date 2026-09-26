import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Target,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  RotateCw,
  Sliders,
  Layers,
  ChevronRight,
  Compass,
  Check,
  Plus,
} from 'lucide-react';
import { aiAPI, resumeAPI, jobAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function JobMatcherDashboard({
  activeResume,
  onResumeUpdated,
  onNavigateToCareer,
  onMatchingStateChange,
}) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(activeResume?._id || '');
  const [curatedJobs, setCuratedJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // Custom JD Mode
  const [inputMode, setInputMode] = useState('curated'); // 'curated' | 'custom'
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customJd, setCustomJd] = useState('');

  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [tailoringApplied, setTailoringApplied] = useState(false);
  const [applyingTailor, setApplyingTailor] = useState(false);

  useEffect(() => {
    fetchResumesAndJobs();
  }, []);

  useEffect(() => {
    if (activeResume?._id) {
      setSelectedResumeId(activeResume._id);
    }
  }, [activeResume]);

  const fetchResumesAndJobs = async () => {
    try {
      // 1. Fetch public curated jobs
      try {
        const jobsRes = await jobAPI.getJobs();
        if (jobsRes.data?.success && jobsRes.data.data?.length > 0) {
          setCuratedJobs(jobsRes.data.data);
          setSelectedJobId(jobsRes.data.data[0]._id);
        }
      } catch (jobErr) {
        console.warn('Jobs fetch notice:', jobErr.message);
      }

      // 2. Fetch user resumes if token exists; otherwise use activeResume
      const token = localStorage.getItem('resumai_jwt_token');
      if (token) {
        try {
          const resumesRes = await resumeAPI.getResumes();
          if (resumesRes.data?.success && resumesRes.data.data?.length > 0) {
            setResumes(resumesRes.data.data);
            if (!selectedResumeId) {
              setSelectedResumeId(resumesRes.data.data[0]._id);
            }
            return;
          }
        } catch (resErr) {
          // Fall back gracefully to active resume
        }
      }

      if (activeResume) {
        setResumes([activeResume]);
        setSelectedResumeId(activeResume._id || 'default_resume');
      }
    } catch (err) {
      console.warn('Initial data load notice for matcher:', err.message);
      if (activeResume) {
        setResumes([activeResume]);
        setSelectedResumeId(activeResume._id || 'default_resume');
      }
    }
  };

  const handleRunMatch = async () => {
    if (!selectedResumeId && !activeResume) {
      alert('Please select a resume to match.');
      return;
    }

    if (inputMode === 'curated' && !selectedJobId) {
      alert('Please select a curated job.');
      return;
    }

    if (inputMode === 'custom' && (!customTitle || !customJd)) {
      alert('Please provide Job Title and Job Description text.');
      return;
    }

    try {
      setLoading(true);
      onMatchingStateChange?.(true);
      setMatchResult(null);
      setTailoringApplied(false);

      const targetResumeObj = resumes.find(r => r._id === selectedResumeId) || activeResume;

      const payload = {
        resumeId: selectedResumeId || activeResume?._id || 'default_resume',
        resumeData: targetResumeObj,
        jobId: inputMode === 'curated' ? selectedJobId : undefined,
        customJobTitle: inputMode === 'custom' ? customTitle : undefined,
        customCompany: inputMode === 'custom' ? customCompany : undefined,
        customJobDescription: inputMode === 'custom' ? customJd : undefined,
      };

      const res = await aiAPI.matchJob(payload);
      if (res.data.success) {
        setMatchResult(res.data.data);
        if (res.data.data.overallMatchScore >= 80) {
          confetti({
            particleCount: 75,
            spread: 65,
            origin: { y: 0.65 },
          });
        }
      }
    } catch (err) {
      console.error('Match error:', err);
      alert('Failed to run AI Match. Please try again.');
    } finally {
      setLoading(false);
      onMatchingStateChange?.(false);
    }
  };

  const handleApplyTailoring = async () => {
    if (!matchResult?._id) return;
    try {
      setApplyingTailor(true);
      const res = await aiAPI.applyTailoring(matchResult._id);
      if (res.data.success) {
        setTailoringApplied(true);
        if (onResumeUpdated) {
          onResumeUpdated(res.data.data);
        }
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } catch (err) {
      console.error('Apply tailoring error:', err);
      alert('Failed to apply tailored recommendations.');
    } finally {
      setApplyingTailor(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 shadow-card transition-colors duration-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-50 dark:bg-plum-950/80 text-plum-900 dark:text-plum-200 text-xs font-bold border border-plum-200 dark:border-plum-800">
            <Target className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>Job Description Compatibility & ATS Scanner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-text tracking-tight font-display">
            Resume & Job Match Intelligence
          </h2>
          <p className="text-surface-muted text-xs sm:text-sm leading-relaxed">
            Scan your active resume against any target job description. Uncover matched keywords, identify skill gaps, and optimize your application with 1-click tailored suggestions.
          </p>
        </div>
      </div>

      {/* Main Configuration & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column: Input Selection */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          {/* Step 1: Select Candidate Resume */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-surface-text uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-plum-800 dark:text-plum-300 shrink-0" />
                <span>1. Select Resume</span>
              </label>
              <span className="text-[11px] text-surface-muted font-medium">{resumes.length} available</span>
            </div>

            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs font-semibold focus:outline-none focus:border-plum-600 min-h-[44px]"
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title} ({r.targetJobTitle || 'General'})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Job Description Setup */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-surface-text uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>2. Target Position</span>
              </label>

              <div className="flex bg-surface-elevated rounded-xl p-0.5 border border-surface-border text-[11px] self-start sm:self-auto">
                <button
                  onClick={() => setInputMode('curated')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all touch-target ${
                    inputMode === 'curated'
                      ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                      : 'text-surface-muted hover:text-surface-text'
                  }`}
                >
                  Curated Jobs
                </button>
                <button
                  onClick={() => setInputMode('custom')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all touch-target ${
                    inputMode === 'custom'
                      ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                      : 'text-surface-muted hover:text-surface-text'
                  }`}
                >
                  Paste Any JD
                </button>
              </div>
            </div>

            {inputMode === 'curated' ? (
              <div className="space-y-3">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs font-semibold focus:outline-none focus:border-plum-600 min-h-[44px]"
                >
                  {curatedJobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.logo} {j.company} — {j.title} ({j.salaryRange})
                    </option>
                  ))}
                </select>

                {/* Selected curated job preview snippet */}
                {curatedJobs.find((j) => j._id === selectedJobId) && (
                  <div className="p-3.5 bg-surface-elevated rounded-xl border border-surface-border text-xs space-y-2">
                    {(() => {
                      const cur = curatedJobs.find((j) => j._id === selectedJobId);
                      return (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-surface-text gap-1">
                            <span className="truncate">{cur.company} • {cur.title}</span>
                            <span className="text-sage-700 dark:text-sage-400 font-semibold text-[11px] shrink-0">{cur.location}</span>
                          </div>
                          <p className="text-surface-muted text-[11px] line-clamp-2 leading-relaxed">{cur.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(cur.requiredSkills || []).slice(0, 5).map((sk, idx) => (
                              <span key={idx} className="bg-surface-card text-surface-text border border-surface-border px-2 py-0.5 rounded text-[10px] font-semibold">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Lead React Dev)"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
                  />
                  <input
                    type="text"
                    placeholder="Company (e.g. Google)"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
                  />
                </div>
                <textarea
                  rows={5}
                  placeholder="Paste complete Job Description text, responsibilities, and required qualifications here..."
                  value={customJd}
                  onChange={(e) => setCustomJd(e.target.value)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl p-3 text-surface-text text-xs leading-relaxed focus:outline-none focus:border-plum-600 font-medium"
                />
              </div>
            )}

            {/* Run Match CTA Button */}
            <button
              onClick={handleRunMatch}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 min-h-[46px]"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-terracotta-300" />
                  <span>Analyzing Match Compatibility with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-terracotta-300" />
                  <span>Analyze Compatibility & Gaps</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Match Report & Skill Gap Analysis */}
        <div className="lg:col-span-7">
          {matchResult ? (
            <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-7 shadow-card space-y-5 sm:space-y-6">
              {/* Header Report Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 sm:pb-5 border-b border-surface-border">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                    Compatibility Verdict
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-surface-text mt-0.5 font-display truncate">
                    {matchResult.jobTitle} {matchResult.company && <span className="text-surface-muted font-normal text-sm sm:text-base">at {matchResult.company}</span>}
                  </h3>
                </div>

                {/* Match Score Radial Display */}
                <div className="flex items-center gap-3.5 bg-surface-elevated px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-surface-border shrink-0">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-black text-plum-900 dark:text-plum-200 font-display">
                      {matchResult.overallMatchScore}%
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] uppercase font-bold text-surface-muted">Match Score</div>
                  </div>

                  <div className="h-7 sm:h-8 w-px bg-surface-border" />

                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-black text-sage-600 dark:text-sage-400 font-display">
                      {matchResult.atsPassedRate}%
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] uppercase font-bold text-surface-muted">ATS Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Breakdown Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="bg-surface-elevated p-2.5 sm:p-3 rounded-xl border border-surface-border">
                  <div className="text-[10.5px] sm:text-[11px] text-surface-muted mb-1 font-medium truncate">Skills Match</div>
                  <div className="text-base sm:text-lg font-bold text-surface-text">{matchResult.skillsMatchScore}%</div>
                  <div className="w-full bg-surface-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-plum-900 dark:bg-plum-500 h-full rounded-full"
                      style={{ width: `${matchResult.skillsMatchScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 sm:p-3 rounded-xl border border-surface-border">
                  <div className="text-[10.5px] sm:text-[11px] text-surface-muted mb-1 font-medium truncate">Experience Fit</div>
                  <div className="text-base sm:text-lg font-bold text-surface-text">{matchResult.experienceMatchScore}%</div>
                  <div className="w-full bg-surface-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${matchResult.experienceMatchScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 sm:p-3 rounded-xl border border-surface-border">
                  <div className="text-[10.5px] sm:text-[11px] text-surface-muted mb-1 font-medium truncate">Education Fit</div>
                  <div className="text-base sm:text-lg font-bold text-surface-text">{matchResult.educationMatchScore}%</div>
                  <div className="w-full bg-surface-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-sage-600 h-full rounded-full"
                      style={{ width: `${matchResult.educationMatchScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-surface-elevated p-2.5 sm:p-3 rounded-xl border border-surface-border">
                  <div className="text-[10.5px] sm:text-[11px] text-surface-muted mb-1 font-medium truncate">Keywords</div>
                  <div className="text-base sm:text-lg font-bold text-surface-text">{Math.round((matchResult.overallMatchScore + matchResult.skillsMatchScore) / 2)}%</div>
                  <div className="w-full bg-surface-border h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-terracotta-500 h-full rounded-full"
                      style={{ width: `${Math.round((matchResult.overallMatchScore + matchResult.skillsMatchScore) / 2)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis (Strong Matches vs Skills to Improve) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Strong Matches */}
                <div className="bg-sage-50/70 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sage-800 dark:text-sage-300 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                    <span>Your Strong Matches ({matchResult.matchingSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResult.matchingSkills || []).map((sk, idx) => (
                      <span key={idx} className="bg-sage-100 dark:bg-sage-900/60 text-sage-900 dark:text-sage-200 border border-sage-300 dark:border-sage-700 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-sage-700 dark:text-sage-300 shrink-0" />
                        <span>{sk}</span>
                      </span>
                    ))}
                    {(!matchResult.matchingSkills || matchResult.matchingSkills.length === 0) && (
                      <span className="text-surface-muted text-xs italic">No exact skill matches identified.</span>
                    )}
                  </div>
                </div>

                {/* Skills to Improve */}
                <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Skills to Improve ({matchResult.missingSkills?.length || 0})</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResult.missingSkills || []).map((sk, idx) => (
                      <span key={idx} className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <Plus className="w-3 h-3 text-amber-700 dark:text-amber-300 shrink-0" />
                        <span>{sk}</span>
                      </span>
                    ))}
                    {(!matchResult.missingSkills || matchResult.missingSkills.length === 0) && (
                      <span className="text-sage-700 dark:text-sage-300 text-xs font-medium">Outstanding! No missing keywords detected.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Generate Learning Roadmap CTA Button */}
              {matchResult.missingSkills && matchResult.missingSkills.length > 0 && (
                <div className="p-3.5 bg-surface-elevated border border-surface-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <span className="text-surface-muted font-medium">
                    Bridge your detected skill gaps with a tailored 90-day milestone plan:
                  </span>
                  <button
                    onClick={() => {
                      if (onNavigateToCareer) onNavigateToCareer();
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-plum-900 hover:bg-plum-800 text-white font-bold shrink-0 transition-all shadow-subtle min-h-[38px]"
                  >
                    <Compass className="w-3.5 h-3.5 text-terracotta-300" />
                    <span>Generate Learning Roadmap</span>
                  </button>
                </div>
              )}

              {/* Strengths & Tailoring Action Plan */}
              <div className="space-y-3 text-xs">
                {matchResult.keyStrengths && matchResult.keyStrengths.length > 0 && (
                  <div className="bg-surface-elevated p-3.5 sm:p-4 rounded-xl border border-surface-border">
                    <span className="font-bold text-plum-900 dark:text-plum-200 block mb-1.5 text-xs">
                      Candidate Strengths Highlighted:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-surface-text">
                      {matchResult.keyStrengths.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchResult.tailoringRecommendations && matchResult.tailoringRecommendations.length > 0 && (
                  <div className="bg-surface-elevated p-3.5 sm:p-4 rounded-xl border border-surface-border">
                    <span className="font-bold text-terracotta-600 dark:text-terracotta-400 block mb-1.5 text-xs">
                      Resume Tailoring Recommendations:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-surface-text">
                      {matchResult.tailoringRecommendations.map((r, idx) => (
                        <li key={idx} className="leading-relaxed">{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 1-Click AI Resume Optimization */}
              <div className="p-4 rounded-2xl bg-plum-50 dark:bg-plum-950/80 border border-plum-200 dark:border-plum-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="font-bold text-plum-900 dark:text-plum-200 text-xs flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-terracotta-500 shrink-0" />
                    <span>1-Click AI Resume Optimization</span>
                  </div>
                  <div className="text-[11px] text-surface-muted mt-0.5">
                    Injects relevant keyword alignment & role-specific summary directly into your active resume.
                  </div>
                </div>

                <button
                  onClick={handleApplyTailoring}
                  disabled={tailoringApplied || applyingTailor}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-subtle shrink-0 flex items-center justify-center gap-1.5 min-h-[40px] ${
                    tailoringApplied
                      ? 'bg-sage-600 text-white cursor-default'
                      : 'bg-plum-900 hover:bg-plum-800 text-white'
                  }`}
                >
                  {applyingTailor ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : tailoringApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-300" />
                      <span>Optimizations Applied!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-terracotta-300" />
                      <span>Auto-Tailor Resume</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : loading ? (
            /* Live Match Connection Animation State */
            <div className="h-full min-h-[380px] sm:min-h-[460px] bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-card">
              {/* Animated Career Network Bridge Visual */}
              <div className="relative w-full max-w-sm h-28 flex items-center justify-between px-4">
                {/* Left: Resume Network Cluster */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-plum-100 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border-2 border-plum-500 flex items-center justify-center shadow-subtle animate-pulse">
                    <FileText className="w-5 h-5 text-plum-900 dark:text-plum-200" />
                  </div>
                  <span className="text-[11px] font-bold text-surface-text">Resume Profile</span>
                </div>

                {/* Center: Animated Connecting Bridge */}
                <div className="flex-1 px-4 relative flex items-center justify-center">
                  {/* Glowing Connection Track */}
                  <div className="w-full h-1 bg-surface-border rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-plum-600 via-amber-500 to-terracotta-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  </div>

                  {/* Pulsing Core Intelligence Node */}
                  <div className="absolute w-8 h-8 rounded-full bg-surface-card border-2 border-amber-500 shadow-lift flex items-center justify-center animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                {/* Right: Target Job Network Cluster */}
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-100 dark:bg-terracotta-950 text-terracotta-700 dark:text-terracotta-300 border-2 border-terracotta-500 flex items-center justify-center shadow-subtle animate-pulse">
                    <Briefcase className="w-5 h-5 text-terracotta-600 dark:text-terracotta-300" />
                  </div>
                  <span className="text-[11px] font-bold text-surface-text">Target Job</span>
                </div>
              </div>

              {/* Progress Stepper Animation */}
              <div className="space-y-2 max-w-sm w-full">
                <h4 className="text-sm font-bold text-surface-text flex items-center justify-center gap-2">
                  <RotateCw className="w-4 h-4 animate-spin text-terracotta-500" />
                  <span>Synthesizing Compatibility...</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-surface-muted">
                  <div className="bg-surface-elevated p-2 rounded-xl border border-surface-border text-center">
                    ✓ Skills Extracted
                  </div>
                  <div className="bg-surface-elevated p-2 rounded-xl border border-surface-border text-center animate-pulse">
                    ⚡ ATS Alignment
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[340px] sm:min-h-[400px] bg-surface-card border-2 border-dashed border-surface-border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border border-plum-200 dark:border-plum-800 flex items-center justify-center shrink-0 shadow-subtle">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-terracotta-500" />
              </div>
              <div>
                <h4 className="text-base font-bold text-surface-text">No Active Match Scan</h4>
                <p className="text-surface-muted text-xs max-w-sm leading-relaxed mt-1">
                  Select your active resume on the left and choose a target position to trigger the AI Match Connection.
                </p>
              </div>

              {/* Visual Abstract Network Preview */}
              <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-surface-muted">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-plum-700 dark:text-plum-300" /> Resume Network</span>
                <span className="text-terracotta-500 font-bold">──●──</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-terracotta-600 dark:text-terracotta-400" /> Job Network</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
