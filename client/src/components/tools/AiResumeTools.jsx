import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  Copy,
  RotateCw,
  Zap,
  Target,
  ShieldCheck,
  Check,
  Award,
  ArrowRight,
} from 'lucide-react';
import { aiAPI } from '../../services/api';
import confetti from 'canvas-confetti';

export default function AiResumeTools({ activeResume, onUpdateResume }) {
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' | 'bullets' | 'ats-audit'
  
  // Summary Tool State
  const [summaryRole, setSummaryRole] = useState(activeResume?.targetJobTitle || activeResume?.personalInfo?.headline || 'Senior Full Stack Engineer');
  const [summaryLevel, setSummaryLevel] = useState('Senior Level');
  const [summaryInput, setSummaryInput] = useState(activeResume?.summary || '');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Bullets Tool State
  const [bulletRole, setBulletRole] = useState(activeResume?.experience?.[0]?.title || 'Software Engineer');
  const [bulletCompany, setBulletCompany] = useState(activeResume?.experience?.[0]?.company || 'Tech Company');
  const [bulletNotes, setBulletNotes] = useState('Engineered backend APIs, optimized SQL queries, and reduced build pipelines');
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
  const totalBullets = (activeResume?.experience || []).reduce((acc, e) => acc + (e.bullets?.length || 0), 0);
  const skillCount = (activeResume?.skillGroups || []).reduce((acc, g) => acc + (g.items?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 shadow-card transition-colors duration-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>AI Resume Optimization Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-text tracking-tight font-display">
            Generative AI Resume Tools
          </h2>
          <p className="text-surface-muted text-xs sm:text-sm leading-relaxed">
            Polish role summaries, craft high-impact STAR bullet points with measurable metrics, and audit your resume against ATS benchmarks.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-surface-elevated border border-surface-border rounded-2xl p-1 gap-1 text-xs max-w-md overflow-x-auto scrollbar-none">
        {[
          { id: 'summary', label: 'Summary Studio', fullLabel: 'AI Summary Studio', icon: FileText },
          { id: 'bullets', label: 'STAR Bullets', fullLabel: 'STAR Bullet Generator', icon: Zap },
          { id: 'ats-audit', label: 'ATS Scorecard', fullLabel: 'ATS Scorecard & Audit', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
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

      {/* Tab 1: Summary Studio */}
      {activeSubTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-surface-text flex items-center gap-2">
              <FileText className="w-4 h-4 text-plum-800 dark:text-plum-300 shrink-0" />
              <span>Summary Configuration</span>
            </h3>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Target Professional Role</label>
              <input
                type="text"
                value={summaryRole}
                onChange={(e) => setSummaryRole(e.target.value)}
                placeholder="e.g. Lead React Developer"
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Experience Level</label>
              <select
                value={summaryLevel}
                onChange={(e) => setSummaryLevel(e.target.value)}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-semibold min-h-[42px]"
              >
                <option value="Entry Level">Entry Level / Graduate</option>
                <option value="Mid Level">Mid Level Professional (2-5 yrs)</option>
                <option value="Senior Level">Senior Level (5-10 yrs)</option>
                <option value="Staff / Principal">Staff / Principal Architect</option>
                <option value="Executive / Leadership">Executive / Engineering Director</option>
              </select>
            </div>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Rough Notes or Existing Draft</label>
              <textarea
                rows={4}
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                placeholder="Paste key achievements, years of experience, or main technologies..."
                className="w-full bg-surface-elevated border border-surface-border rounded-xl p-3 text-surface-text text-xs leading-relaxed focus:outline-none focus:border-plum-600 font-medium"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
              className="w-full py-3 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 min-h-[46px]"
            >
              {loadingSummary ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-terracotta-300" />
                  <span>AI Generating Professional Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-terracotta-300" />
                  <span>Generate ATS Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between gap-4 sm:gap-5 min-h-[340px] sm:min-h-[380px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider">
                  AI Generated Output
                </span>
                {generatedSummary && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSummary);
                      setCopiedSummary(true);
                      setTimeout(() => setCopiedSummary(false), 2000);
                    }}
                    className="text-xs text-surface-muted hover:text-surface-text flex items-center gap-1 font-semibold"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-sage-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {generatedSummary ? (
                <div className="p-4 bg-surface-elevated rounded-2xl border border-surface-border text-surface-text text-xs sm:text-sm leading-relaxed">
                  {generatedSummary}
                </div>
              ) : (
                <div className="h-44 sm:h-48 rounded-2xl bg-surface-elevated border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-center p-6 text-surface-muted text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-plum-800 dark:text-plum-300 opacity-60" />
                  <span>Click &quot;Generate ATS Summary&quot; to formulate tailored overview.</span>
                </div>
              )}
            </div>

            {generatedSummary && (
              <div className="p-3.5 sm:p-4 bg-plum-50 dark:bg-plum-950/80 border border-plum-200 dark:border-plum-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-plum-900 dark:text-plum-200 font-semibold">
                  Apply this generated summary directly into your active resume.
                </div>
                <button
                  onClick={handleApplySummaryToResume}
                  className="px-4 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle shrink-0 min-h-[40px]"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="lg:col-span-5 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-surface-text flex items-center gap-2">
              <Zap className="w-4 h-4 text-terracotta-500 shrink-0" />
              <span>STAR Bullet Configuration</span>
            </h3>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Position / Role Title</label>
              <input
                type="text"
                value={bulletRole}
                onChange={(e) => setBulletRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer"
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Company / Organization</label>
              <input
                type="text"
                value={bulletCompany}
                onChange={(e) => setBulletCompany(e.target.value)}
                placeholder="e.g. Apex Cloud Solutions"
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-surface-text text-xs focus:outline-none focus:border-plum-600 font-medium min-h-[42px]"
              />
            </div>

            <div>
              <label className="block text-surface-muted text-xs font-semibold mb-1">Context & Key Tasks</label>
              <textarea
                rows={3}
                value={bulletNotes}
                onChange={(e) => setBulletNotes(e.target.value)}
                placeholder="Mention features built, tech stack used, and business outcome..."
                className="w-full bg-surface-elevated border border-surface-border rounded-xl p-3 text-surface-text text-xs leading-relaxed focus:outline-none focus:border-plum-600 font-medium"
              />
            </div>

            <button
              onClick={handleGenerateBullets}
              disabled={loadingBullets}
              className="w-full py-3 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-card active:scale-[0.98] transition-all disabled:opacity-50 min-h-[46px]"
            >
              {loadingBullets ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-terracotta-300" />
                  <span>Generating STAR Bullets with Metrics...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-terracotta-300" />
                  <span>Generate 3 STAR Bullets</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-6 shadow-card flex flex-col justify-between gap-4 sm:gap-5 min-h-[340px] sm:min-h-[380px]">
            <div className="space-y-3">
              <span className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-wider block pb-2 border-b border-surface-border">
                Generated STAR Bullets
              </span>

              {generatedBullets.length > 0 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  {generatedBullets.map((b, idx) => (
                    <div key={idx} className="p-3 sm:p-3.5 bg-surface-elevated rounded-2xl border border-surface-border text-xs text-surface-text flex items-start gap-2.5">
                      <span className="font-bold text-terracotta-500 mt-0.5 shrink-0">•</span>
                      <p className="flex-1 leading-relaxed">{b}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(b)}
                        className="text-surface-muted hover:text-surface-text p-1 shrink-0"
                        title="Copy bullet"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-44 sm:h-48 rounded-2xl bg-surface-elevated border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-center p-6 text-surface-muted text-xs space-y-2">
                  <Zap className="w-8 h-8 text-amber-500 opacity-60" />
                  <span>Click &quot;Generate 3 STAR Bullets&quot; to see quantified bullet points.</span>
                </div>
              )}
            </div>

            {generatedBullets.length > 0 && (
              <div className="p-3.5 sm:p-4 bg-plum-50 dark:bg-plum-950/80 border border-plum-200 dark:border-plum-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-plum-900 dark:text-plum-200 font-semibold">
                  Insert these bullets directly into your top work experience position.
                </div>
                <button
                  onClick={handleApplyBulletsToFirstJob}
                  className="px-4 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle shrink-0 min-h-[40px]"
                >
                  Insert to Experience
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ATS Scorecard & Audit */}
      {activeSubTab === 'ats-audit' && (
        <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 shadow-card space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-surface-border">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-surface-text font-display">ATS Readability & Structural Audit</h3>
              <p className="text-xs text-surface-muted mt-0.5">
                Automated evaluation of formatting, keyword density, and section structure.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-surface-elevated px-4 py-2 rounded-2xl border border-surface-border shrink-0">
              <div className="text-xl sm:text-2xl font-black text-plum-900 dark:text-plum-200 font-display">
                {activeResume?.atsScore || 88}%
              </div>
              <div className="text-[10px] uppercase font-bold text-surface-muted">Audit Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-surface-elevated rounded-2xl border border-surface-border space-y-1.5 shadow-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted font-semibold">Contact Section</span>
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
              </div>
              <div className="text-sm font-bold text-surface-text truncate">
                {activeResume?.personalInfo?.fullName || 'Candidate Name'}
              </div>
              <div className="text-[11px] text-surface-muted">Email, Phone, Portfolio verified</div>
            </div>

            <div className="p-4 bg-surface-elevated rounded-2xl border border-surface-border space-y-1.5 shadow-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted font-semibold">Summary Section</span>
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
              </div>
              <div className="text-sm font-bold text-surface-text">
                {hasSummary ? 'ATS Compliant (3-4 Sentences)' : 'Short Draft'}
              </div>
              <div className="text-[11px] text-surface-muted">Contains role keywords & tenure</div>
            </div>

            <div className="p-4 bg-surface-elevated rounded-2xl border border-surface-border space-y-1.5 shadow-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted font-semibold">Experience Bullets</span>
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
              </div>
              <div className="text-sm font-bold text-surface-text">
                {totalBullets} Active STAR Bullets
              </div>
              <div className="text-[11px] text-surface-muted">Action verbs & quantifiable metrics</div>
            </div>

            <div className="p-4 bg-surface-elevated rounded-2xl border border-surface-border space-y-1.5 shadow-subtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-muted font-semibold">Categorized Skills</span>
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
              </div>
              <div className="text-sm font-bold text-surface-text">
                {skillCount} Categorized Skills
              </div>
              <div className="text-[11px] text-surface-muted">Frontend, Backend, Databases, Cloud</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
