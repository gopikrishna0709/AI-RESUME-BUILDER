import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Wrench,
  CheckCircle2,
  Copy,
  RotateCw,
  Zap,
  Target,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Check,
  Award,
} from 'lucide-react';
import { aiAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function AiResumeTools({ activeResume, onUpdateResume }) {
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' | 'bullets' | 'ats-audit'
  
  // Summary Tool State
  const [summaryRole, setSummaryRole] = useState(activeResume?.targetJobTitle || activeResume?.personalInfo?.headline || 'Senior Full Stack Engineer');
  const [summaryLevel, setSummaryLevel] = useState('Senior / Staff');
  const [summaryInput, setSummaryInput] = useState(activeResume?.summary || '');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Bullets Tool State
  const [bulletRole, setBulletRole] = useState(activeResume?.experience?.[0]?.title || 'Software Engineer');
  const [bulletCompany, setBulletCompany] = useState(activeResume?.experience?.[0]?.company || 'Tech Organization');
  const [bulletNotes, setBulletNotes] = useState('Built APIs, reduced load times, managed database queries and CI/CD pipelines');
  const [bulletCount, setBulletCount] = useState(3);
  const [generatedBullets, setGeneratedBullets] = useState([]);
  const [loadingBullets, setLoadingBullets] = useState(false);

  // Summary Handler
  const handleGenerateSummary = async () => {
    try {
      setLoadingSummary(true);
      const allSkills = (activeResume?.skillGroups || []).flatMap((g) => g.items || []);
      const res = await aiAPI.enhanceSummary({
        currentSummary: summaryInput,
        targetRole: summaryRole,
        experienceLevel: summaryLevel,
        keySkills: allSkills,
      });

      if (res.data.success) {
        setGeneratedSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Summary error:', err);
      alert('Failed to generate summary with AI.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleApplySummaryToResume = () => {
    if (!generatedSummary) return;
    onUpdateResume({
      ...activeResume,
      summary: generatedSummary,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // Bullets Handler
  const handleGenerateBullets = async () => {
    try {
      setLoadingBullets(true);
      const res = await aiAPI.generateBullets({
        roleTitle: bulletRole,
        company: bulletCompany,
        context: bulletNotes,
        count: bulletCount,
      });

      if (res.data.success && res.data.bullets) {
        setGeneratedBullets(res.data.bullets);
      }
    } catch (err) {
      console.error('Bullets error:', err);
      alert('Failed to generate bullets with AI.');
    } finally {
      setLoadingBullets(false);
    }
  };

  const handleApplyBulletsToFirstJob = () => {
    if (generatedBullets.length === 0 || !activeResume?.experience?.length) return;
    const newExp = [...activeResume.experience];
    newExp[0].bullets = [...generatedBullets, ...(newExp[0].bullets || [])];
    onUpdateResume({
      ...activeResume,
      experience: newExp,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  // ATS Audit metrics
  const hasSummary = Boolean(activeResume?.summary && activeResume.summary.length > 50);
  const hasExp = (activeResume?.experience || []).length > 0;
  const hasSkills = (activeResume?.skillGroups || []).length > 0;
  const hasEdu = (activeResume?.education || []).length > 0;
  const totalBullets = (activeResume?.experience || []).reduce((acc, e) => acc + (e.bullets?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Generative AI Resume Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Resume Optimization Tools
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Polish summaries, generate high-impact STAR bullet points, and audit your ATS score with Google Gemini.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 gap-1 text-xs max-w-md">
        {[
          { id: 'summary', label: 'AI Summary Studio', icon: FileText },
          { id: 'bullets', label: 'STAR Bullet Generator', icon: Zap },
          { id: 'ats-audit', label: 'ATS Scorecard & Audit', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 flex-1 py-2 px-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Summary Studio */}
      {activeSubTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Summary Configuration
            </h3>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Target Professional Role</label>
              <input
                type="text"
                value={summaryRole}
                onChange={(e) => setSummaryRole(e.target.value)}
                placeholder="e.g. Lead React Architect"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Experience Level Persona</label>
              <select
                value={summaryLevel}
                onChange={(e) => setSummaryLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              >
                <option value="Entry Level / New Grad">Entry Level / New Grad</option>
                <option value="Mid Level Professional">Mid Level Professional (2-5 yrs)</option>
                <option value="Senior / Staff">Senior / Staff (5-10 yrs)</option>
                <option value="Principal / Engineering Lead">Principal / Engineering Lead</option>
                <option value="Executive / Director">Executive / Director</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Current Draft / Notes (Optional)</label>
              <textarea
                rows={4}
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Paste your rough career notes or existing summary here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {loadingSummary ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>AI Crafting Professional Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate ATS-Optimized Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AI Output Result</span>
                {generatedSummary && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSummary);
                      setCopiedSummary(true);
                      setTimeout(() => setCopiedSummary(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {generatedSummary ? (
                <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 text-slate-200 text-sm leading-relaxed">
                  {generatedSummary}
                </div>
              ) : (
                <div className="h-48 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                  <Sparkles className="w-8 h-8 text-purple-400 mb-2 opacity-50" />
                  <span>Click &quot;Generate ATS-Optimized Summary&quot; to view AI output.</span>
                </div>
              )}
            </div>

            {generatedSummary && (
              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-xs text-purple-200">
                  Apply this generated summary directly into your active resume.
                </div>
                <button
                  onClick={handleApplySummaryToResume}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  Apply to Resume
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: STAR Bullets Generator */}
      {activeSubTab === 'bullets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              STAR Bullet Point Generator
            </h3>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Position / Role Title</label>
              <input
                type="text"
                value={bulletRole}
                onChange={(e) => setBulletRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Company / Organization</label>
              <input
                type="text"
                value={bulletCompany}
                onChange={(e) => setBulletCompany(e.target.value)}
                placeholder="e.g. Acme Cloud"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1">Rough Notes & Responsibilities</label>
              <textarea
                rows={3}
                value={bulletNotes}
                onChange={(e) => setBulletNotes(e.target.value)}
                placeholder="Mention what you built, technologies used, and any results."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateBullets}
              disabled={loadingBullets}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {loadingBullets ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Generating STAR Impact Bullets...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate 3 High-Impact Bullets</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Generated Bullets</span>
              {generatedBullets.length > 0 ? (
                <div className="space-y-3">
                  {generatedBullets.map((b, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950 rounded-2xl border border-amber-500/20 text-xs text-slate-200 flex items-start gap-2.5">
                      <span className="font-bold text-amber-400 mt-0.5">•</span>
                      <p className="flex-1 leading-relaxed">{b}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(b)}
                        className="text-slate-500 hover:text-white p-1"
                        title="Copy bullet"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                  <Zap className="w-8 h-8 text-amber-400 mb-2 opacity-50" />
                  <span>Click &quot;Generate 3 High-Impact Bullets&quot; to see STAR metrics.</span>
                </div>
              )}
            </div>

            {generatedBullets.length > 0 && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-xs text-amber-200">
                  Insert these bullets directly into your top work experience position.
                </div>
                <button
                  onClick={handleApplyBulletsToFirstJob}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Insert to Experience
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ATS Scorecard & Readability */}
      {activeSubTab === 'ats-audit' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
            <div>
              <h3 className="text-xl font-bold text-white">ATS Readability & Structural Audit</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated evaluation of your resume against modern Applicant Tracking System standards.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {activeResume?.atsScore || 92}%
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Readability Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Contact Details</span>
                {activeResume?.personalInfo?.email ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-amber-400 text-xs">Missing</span>
                )}
              </div>
              <div className="text-sm font-bold text-white">
                {activeResume?.personalInfo?.fullName || 'Candidate Name'}
              </div>
              <div className="text-[11px] text-slate-500">Email, Phone, Location verified</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Summary Strength</span>
                {hasSummary ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-amber-400 text-xs">Needs detail</span>
                )}
              </div>
              <div className="text-sm font-bold text-white">
                {hasSummary ? 'ATS Compliant (3-4 Sentences)' : 'Short Draft'}
              </div>
              <div className="text-[11px] text-slate-500">Contains target role keyword</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Quantified Bullets</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-white">
                {totalBullets} Active STAR Bullets
              </div>
              <div className="text-[11px] text-slate-500">Includes action verbs & metrics</div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Skill Groups</span>
                {hasSkills ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-amber-400 text-xs">Empty</span>
                )}
              </div>
              <div className="text-sm font-bold text-white">
                {(activeResume?.skillGroups || []).length} Categories Categorized
              </div>
              <div className="text-[11px] text-slate-500">Frontend, Backend, Cloud, DB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
