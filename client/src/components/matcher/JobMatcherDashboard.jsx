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
} from 'lucide-react';
import { aiAPI, resumeAPI, jobAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function JobMatcherDashboard({ activeResume, onResumeUpdated }) {
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
      const [resumesRes, jobsRes] = await Promise.all([
        resumeAPI.getResumes(),
        jobAPI.getJobs(),
      ]);
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.data);
        if (!selectedResumeId && resumesRes.data.data.length > 0) {
          setSelectedResumeId(resumesRes.data.data[0]._id);
        }
      }
      if (jobsRes.data.success && jobsRes.data.data.length > 0) {
        setCuratedJobs(jobsRes.data.data);
        setSelectedJobId(jobsRes.data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load initial data for matcher:', err);
    }
  };

  const handleRunMatch = async () => {
    if (!selectedResumeId) {
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
      setMatchResult(null);
      setTailoringApplied(false);

      const payload = {
        resumeId: selectedResumeId,
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
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
      }
    } catch (err) {
      console.error('Match error:', err);
      alert('Failed to run AI Match. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini ATS Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Resume & Job Compatibility Scanner
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Scan your resume against any job description. Get instant ATS pass probability, matched and missing keywords, strengths, critical gaps, and 1-click tailored optimizations.
          </p>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Setup & Selection */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Select Resume */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                1. Select Resume
              </label>
              <span className="text-[11px] text-slate-500">{resumes.length} saved</span>
            </div>

            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title} ({r.targetJobTitle || 'General'})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Target Job Description */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                2. Target Job
              </label>

              <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
                <button
                  onClick={() => setInputMode('curated')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    inputMode === 'curated' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Curated Jobs
                </button>
                <button
                  onClick={() => setInputMode('custom')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    inputMode === 'custom' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Paste Any JD
                </button>
              </div>
            </div>

            {inputMode === 'curated' ? (
              <div className="space-y-2">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                >
                  {curatedJobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.logo} {j.company} — {j.title} ({j.salaryRange})
                    </option>
                  ))}
                </select>

                {/* Display selected job summary card */}
                {curatedJobs.find((j) => j._id === selectedJobId) && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5 mt-2">
                    {(() => {
                      const currentJob = curatedJobs.find((j) => j._id === selectedJobId);
                      return (
                        <>
                          <div className="flex items-center justify-between font-semibold text-white">
                            <span>{currentJob.company} • {currentJob.title}</span>
                            <span className="text-emerald-400 text-[11px]">{currentJob.location}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] line-clamp-2">{currentJob.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(currentJob.requiredSkills || []).slice(0, 5).map((sk, idx) => (
                              <span key={idx} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
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
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Job Title (e.g. Lead React Dev)"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Company (e.g. Google)"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <textarea
                  rows={5}
                  placeholder="Paste complete Job Description text and required qualifications here..."
                  value={customJd}
                  onChange={(e) => setCustomJd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            )}

            {/* Match Trigger Button */}
            <button
              onClick={handleRunMatch}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing ATS Compatibility with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run AI ATS & Job Matcher</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Match Analysis Results */}
        <div className="lg:col-span-7">
          {matchResult ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Header with Scores */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Analysis Report</div>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {matchResult.jobTitle} {matchResult.company && <span className="text-slate-400 font-normal">at {matchResult.company}</span>}
                  </h3>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
                  <div className="text-center">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                      {matchResult.overallMatchScore}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Match Score</div>
                  </div>

                  <div className="h-8 w-px bg-slate-800" />

                  <div className="text-center">
                    <div className="text-xl font-extrabold text-emerald-400">
                      {matchResult.atsPassedRate}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">ATS Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Metric Bars */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-1">Skills Alignment</div>
                  <div className="text-lg font-bold text-white">{matchResult.skillsMatchScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${matchResult.skillsMatchScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-1">Experience Depth</div>
                  <div className="text-lg font-bold text-white">{matchResult.experienceMatchScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${matchResult.experienceMatchScore}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-1">Education Fit</div>
                  <div className="text-lg font-bold text-white">{matchResult.educationMatchScore}%</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${matchResult.educationMatchScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Matching Keywords ({matchResult.matchingSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResult.matchingSkills || []).map((sk, idx) => (
                      <span key={idx} className="bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-xs font-medium">
                        ✓ {sk}
                      </span>
                    ))}
                    {(!matchResult.matchingSkills || matchResult.matchingSkills.length === 0) && (
                      <span className="text-slate-500 text-xs italic">No direct matches identified.</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Missing Critical Keywords ({matchResult.missingSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(matchResult.missingSkills || []).map((sk, idx) => (
                      <span key={idx} className="bg-amber-900/40 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-medium">
                        + {sk}
                      </span>
                    ))}
                    {(!matchResult.missingSkills || matchResult.missingSkills.length === 0) && (
                      <span className="text-emerald-400 text-xs font-medium">Great! No high-priority skills missing.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strengths & Critical Gaps */}
              <div className="space-y-3 text-xs">
                {matchResult.keyStrengths && matchResult.keyStrengths.length > 0 && (
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-blue-400 block mb-1">Key Strengths Highlighted:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {matchResult.keyStrengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchResult.tailoringRecommendations && matchResult.tailoringRecommendations.length > 0 && (
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="font-bold text-purple-400 block mb-1">Tailoring Action Plan:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {matchResult.tailoringRecommendations.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 1-Click Auto Tailor CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-blue-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Apply AI Tailored Resume Updates</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Automatically inject missing skills & role-specific summary directly into your resume.
                  </div>
                </div>

                <button
                  onClick={handleApplyTailoring}
                  disabled={tailoringApplied || applyingTailor}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-1.5 ${
                    tailoringApplied
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25'
                  }`}
                >
                  {applyingTailor ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : tailoringApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied to Resume!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1-Click Auto-Tailor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">No Active Scan Run</h4>
              <p className="text-slate-400 text-xs max-w-sm mt-1">
                Select your resume and a target job from the left, then click &quot;Run AI ATS & Job Matcher&quot; to generate an in-depth score breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
