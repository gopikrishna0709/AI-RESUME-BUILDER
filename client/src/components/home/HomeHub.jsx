import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Briefcase,
  Bot,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Plus,
  Zap,
  ShieldCheck,
  Check,
  Building2,
  Code2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HomeHub({ activeResume, onSelectTab, onOpenCreateResume }) {
  const { user } = useAuth();
  const [activeDemoStage, setActiveDemoStage] = useState(3);

  const atsScore = activeResume?.atsScore || 88;
  const targetRole = activeResume?.targetJobTitle || activeResume?.personalInfo?.headline || 'Senior Full Stack Engineer';
  const userName = user?.name ? user.name.split(' ')[0] : 'Candidate';
  const skillCount = (activeResume?.skillGroups || []).reduce((acc, g) => acc + (g.items?.length || 0), 0) || 16;
  const experienceCount = (activeResume?.experience || []).length || 2;

  const MODULES = [
    {
      id: 'builder',
      title: 'Resume Builder',
      badge: 'Core Workspace',
      badgeColor: 'bg-plum-50 dark:bg-plum-950/60 text-plum-900 dark:text-plum-200 border-plum-200 dark:border-plum-800',
      icon: FileText,
      accentBorder: 'hover:border-plum-500',
      description: 'Craft ATS-tailored, multi-template resumes with real-time live preview and print-perfect PDF export.',
      features: [
        'Personal Details & Social Links',
        'Academic History & Degrees',
        'Grouped Technical Skills',
        'STAR Bullet Experience Points',
        'Portfolio Projects & Tech Stacks',
        'Professional Certifications',
      ],
      cta: 'Launch Resume Builder',
    },
    {
      id: 'matcher',
      title: 'Job Matcher',
      badge: 'NLP Compatibility',
      badgeColor: 'bg-terracotta-50 dark:bg-terracotta-950/60 text-terracotta-700 dark:text-terracotta-300 border-terracotta-200 dark:border-terracotta-800',
      icon: Target,
      accentBorder: 'hover:border-terracotta-500',
      description: 'Analyze any job description against your resume. Identify matched skills, critical gaps, and auto-tailor in 1-click.',
      features: [
        'Job Description Deep NLP Analyzer',
        'Resume–Job Compatibility Score',
        'Visual Multi-Metric Radar Breakdown',
        'Matched vs Missing Skills Chips',
        '1-Click AI Resume Auto-Tailor',
      ],
      cta: 'Match Target Job',
    },
    {
      id: 'tools',
      title: 'AI Resume Tools',
      badge: 'Gemini AI Studio',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
      icon: Sparkles,
      accentBorder: 'hover:border-amber-500',
      description: 'Generate high-impact STAR bullet points, polished executive summaries, and full ATS readability audits.',
      features: [
        'Role-Tailored AI Summary Studio',
        'STAR Impact Bullet Point Creator',
        'Full Resume Text Enhancement',
        'ATS Structural Readability Scorecard',
      ],
      cta: 'Open AI Resume Studio',
    },
    {
      id: 'jobs',
      title: 'Job Matches & Tracker',
      badge: 'Curated Roles',
      badgeColor: 'bg-sage-50 dark:bg-sage-950/60 text-sage-800 dark:text-sage-200 border-sage-200 dark:border-sage-800',
      icon: Briefcase,
      accentBorder: 'hover:border-sage-500',
      description: 'Browse verified high-growth tech positions automatically scored for compatibility with your resume.',
      features: [
        'Curated Software & Tech Roles',
        'Instant Compatibility Match Badges',
        'Saved Applications Shortlist',
        'Application & Match Scan History',
      ],
      cta: 'View Matched Jobs',
    },
    {
      id: 'career',
      title: 'Career AI Assistant',
      badge: 'Interview & Prep',
      badgeColor: 'bg-plum-50 dark:bg-plum-950/60 text-plum-900 dark:text-plum-200 border-plum-200 dark:border-plum-800',
      icon: Bot,
      accentBorder: 'hover:border-plum-500',
      description: 'Master hiring manager interviews with role-specific questions, AI mock answer scoring, and 90-day learning roadmaps.',
      features: [
        'Technical & Behavioral Question Bank',
        'Interactive Mock Simulator with AI Score',
        'Personalized 90-Day Skill Roadmaps',
        'System Design & Architecture Prep',
      ],
      cta: 'Explore Career AI',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-6">
      {/* 1. ASYMMETRIC LANDING HERO */}
      <section className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 lg:p-12 shadow-card transition-colors duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Fluid Responsive Typography & Value Prop */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum-50 dark:bg-plum-950/80 text-plum-900 dark:text-plum-200 text-xs font-bold border border-plum-200 dark:border-plum-800">
              <span className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
              <span>Intelligent Career Matching Engine</span>
            </div>

            <h1 className="text-fluid-hero font-black text-surface-text tracking-tight font-display">
              Build a Resume That <br className="hidden sm:inline" />
              <span className="text-plum-900 dark:text-plum-300 underline decoration-terracotta-400 underline-offset-4 sm:underline-offset-8">
                Gets Matched.
              </span>
            </h1>

            <p className="text-surface-muted text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
              Create ATS-tailored resumes, analyze real job descriptions with Google Gemini AI, identify missing skill gaps, and optimize your qualifications to win interviews.
            </p>

            {/* Main Action CTAs (Stack on small mobile, row on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => onSelectTab('builder')}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs sm:text-sm shadow-card active:scale-[0.98] transition-all min-h-[46px]"
              >
                <FileText className="w-4 h-4 text-terracotta-300 shrink-0" />
                <span>Build My Resume</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={() => onSelectTab('matcher')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-hover text-surface-text border border-surface-border font-bold text-xs sm:text-sm transition-all min-h-[46px]"
              >
                <Target className="w-4 h-4 text-terracotta-500 shrink-0" />
                <span>Match a Job</span>
              </button>
            </div>

            {/* Highlights pill tags */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-surface-muted font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                <span>ATS Scoring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                <span>1-Click Skill Gap Fix</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                <span>PDF Export</span>
              </div>
            </div>
          </div>

          {/* Right Column: Unique Interactive Match Pipeline Visualization */}
          <div className="lg:col-span-5 bg-surface-elevated border border-surface-border rounded-2xl p-4 sm:p-6 space-y-3.5 shadow-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <span className="text-[11px] font-bold text-surface-muted uppercase tracking-wider">
                Live Matching Pipeline
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 text-[10px] font-bold border border-sage-200 dark:border-sage-800">
                AI Active
              </span>
            </div>

            {/* Stepped Visual Workflow */}
            <div className="space-y-2.5">
              {/* Step 1: Resume */}
              <div
                onClick={() => setActiveDemoStage(1)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeDemoStage >= 1
                    ? 'bg-surface-card border-plum-300 dark:border-plum-800 shadow-subtle'
                    : 'bg-surface-card/60 border-surface-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-plum-100 dark:bg-plum-950 text-plum-900 dark:text-plum-200 flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-surface-text truncate">Resume Profile</div>
                      <div className="text-[10px] text-surface-muted truncate">Alex Rivera • {experienceCount} Positions • {skillCount} Skills</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
                </div>
              </div>

              {/* Connecting Step Arrow */}
              <div className="text-center text-terracotta-500 font-bold text-xs leading-none">↓</div>

              {/* Step 2: Job Requirements */}
              <div
                onClick={() => setActiveDemoStage(2)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeDemoStage >= 2
                    ? 'bg-surface-card border-terracotta-300 dark:border-terracotta-800 shadow-subtle'
                    : 'bg-surface-card/60 border-surface-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-terracotta-100 dark:bg-terracotta-950 text-terracotta-700 dark:text-terracotta-300 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-surface-text truncate">Job Requirements</div>
                      <div className="text-[10px] text-surface-muted truncate">Lead Full Stack Engineer • Apex Cloud</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
                </div>
              </div>

              {/* Connecting Step Arrow */}
              <div className="text-center text-terracotta-500 font-bold text-xs leading-none">↓</div>

              {/* Step 3: AI Analysis & 92% Match Gauge */}
              <div
                onClick={() => setActiveDemoStage(3)}
                className="p-4 rounded-xl bg-surface-card border-2 border-plum-900 dark:border-terracotta-500 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-surface-muted tracking-wider">
                      Overall Compatibility
                    </span>
                    <div className="font-display font-black text-xl sm:text-2xl text-plum-900 dark:text-plum-200">
                      92% Match
                    </div>
                  </div>

                  {/* Circular Radial Gauge */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-plum-50 dark:bg-plum-950/80 border-4 border-terracotta-500 flex items-center justify-center font-bold text-xs text-plum-900 dark:text-plum-200 shrink-0">
                    92%
                  </div>
                </div>

                {/* Sub-breakdown bars */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border text-[11px]">
                  <div>
                    <span className="text-surface-muted">Skills Match</span>
                    <div className="font-bold text-surface-text">94% (12/13)</div>
                  </div>
                  <div>
                    <span className="text-surface-muted">Experience Fit</span>
                    <div className="font-bold text-surface-text">90% (Senior)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRUCTURED CAREER DASHBOARD */}
      <section className="space-y-5 sm:space-y-6">
        {/* Dashboard Top Greeting Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-1">
          <div>
            <h2 className="text-fluid-title font-black text-surface-text tracking-tight font-display">
              Good morning, {userName}
            </h2>
            <p className="text-surface-muted text-xs sm:text-sm mt-0.5">
              Let's improve your career profile and optimize your job applications.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenCreateResume}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-surface-border text-surface-text text-xs font-bold transition-all min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
              <span>New Resume</span>
            </button>
            <button
              onClick={() => onSelectTab('builder')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold transition-all min-h-[40px]"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Subtle Abstract Career Progression Network Flow */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-3 sm:p-4 shadow-subtle overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[560px] gap-2 px-1">
            {[
              { id: 'builder', label: '1. Resume', sub: 'ATS Foundation', icon: FileText, color: 'text-plum-900 dark:text-plum-300' },
              { id: 'tools', label: '2. Skills', sub: 'STAR Enhancer', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400' },
              { id: 'matcher', label: '3. Job Match', sub: 'NLP Alignment', icon: Target, color: 'text-terracotta-600 dark:text-terracotta-400' },
              { id: 'career', label: '4. Interview', sub: 'Mock Scoring', icon: Bot, color: 'text-plum-800 dark:text-plum-300' },
              { id: 'jobs', label: '5. Career Growth', sub: 'Target Placement', icon: TrendingUp, color: 'text-sage-700 dark:text-sage-400' },
            ].map((step, idx, arr) => {
              const IconComp = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => onSelectTab(step.id)}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-elevated transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated group-hover:bg-plum-50 dark:group-hover:bg-plum-950/80 border border-surface-border flex items-center justify-center shrink-0 shadow-subtle">
                      <IconComp className={`w-4 h-4 ${step.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-surface-text group-hover:text-plum-900 dark:group-hover:text-plum-300 transition-colors truncate">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-surface-muted truncate">
                        {step.sub}
                      </div>
                    </div>
                  </button>

                  {idx < arr.length - 1 && (
                    <div className="flex-1 flex items-center justify-center px-1">
                      <div className="w-full h-px bg-surface-border relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta-400/80 animate-ping" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Dashboard Key Metrics Grid (1 Col on mobile, 2 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Resume Strength Gauge */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-muted font-bold uppercase tracking-wider">Resume Strength</span>
              <span className="w-2 h-2 rounded-full bg-sage-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-surface-text font-display">{atsScore}%</span>
              <span className="text-xs text-sage-600 dark:text-sage-400 font-semibold">ATS Ready</span>
            </div>
            <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
              <div
                className="bg-plum-900 dark:bg-plum-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${atsScore}%` }}
              />
            </div>
            <p className="text-[11px] text-surface-muted">Based on keywords, metrics & formatting.</p>
          </div>

          {/* Card 2: Job Match Potential */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-muted font-bold uppercase tracking-wider">Job Compatibility</span>
              <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-surface-text font-display">89%</span>
              <span className="text-xs text-terracotta-600 dark:text-terracotta-400 font-semibold">High Fit</span>
            </div>
            <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
              <div
                className="bg-terracotta-500 h-full rounded-full transition-all duration-500"
                style={{ width: `89%` }}
              />
            </div>
            <p className="text-[11px] text-surface-muted truncate">Targeting {targetRole}...</p>
          </div>

          {/* Card 3: Skills Detected */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-muted font-bold uppercase tracking-wider">Detected Skills</span>
              <Code2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-surface-text font-display">{skillCount}</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Categorized</span>
            </div>
            <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `85%` }}
              />
            </div>
            <p className="text-[11px] text-surface-muted">Across Frontend, Backend, & Cloud stacks.</p>
          </div>

          {/* Card 4: Active Template */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-muted font-bold uppercase tracking-wider">Active Design</span>
              <Layers className="w-4 h-4 text-plum-700 dark:text-plum-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-surface-text font-display truncate">
                {activeResume?.template?.replace('-', ' ').toUpperCase() || 'MODERN TECH'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-surface-elevated text-surface-text font-semibold">
                Single Page
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-elevated text-surface-text font-semibold">
                PDF Ready
              </span>
            </div>
            <p className="text-[11px] text-surface-muted truncate">{activeResume?.title || 'Active Resume'}</p>
          </div>
        </div>
      </section>

      {/* 3. SOLID FEATURE MODULE MATRIX (1 Col mobile, 2 Col tablet, 3 Col desktop) */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <div className="text-xs font-bold text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest">
              Core Capabilities
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-surface-text tracking-tight mt-0.5 font-display">
              Career Intelligence Feature Suite
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-surface-muted max-w-md">
            Everything you need to optimize your career profile from initial drafting to mock interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onSelectTab(mod.id)}
                className={`group bg-surface-card border border-surface-border ${mod.accentBorder} rounded-3xl p-5 sm:p-6 shadow-subtle hover:shadow-card transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between gap-4 sm:gap-5`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-plum-900 text-terracotta-300 flex items-center justify-center font-bold shadow-subtle group-hover:bg-plum-800 transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-surface-text group-hover:text-plum-900 dark:group-hover:text-plum-300 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-surface-muted text-xs mt-1 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Sub-features checklist */}
                  <div className="pt-2.5 border-t border-surface-border space-y-1.5">
                    {mod.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-surface-text">
                        <Check className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-2.5 border-t border-surface-border flex items-center justify-between text-xs font-bold text-plum-900 dark:text-plum-300 group-hover:text-terracotta-600 transition-colors">
                  <span>{mod.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </div>
            );
          })}

          {/* Create New Resume Tile */}
          <div
            onClick={onOpenCreateResume}
            className="group bg-surface-elevated border-2 border-dashed border-surface-border hover:border-terracotta-400 rounded-3xl p-5 sm:p-6 shadow-subtle hover:shadow-card transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center gap-3 min-h-[250px] sm:min-h-[290px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border border-plum-200 dark:border-plum-800 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Plus className="w-6 h-6 text-terracotta-500" />
            </div>
            <div>
              <h4 className="text-base font-bold text-surface-text group-hover:text-plum-900 dark:group-hover:text-plum-300">
                Create New Resume
              </h4>
              <p className="text-surface-muted text-xs mt-1 max-w-xs">
                Start from scratch or tailor a duplicate for another target position.
              </p>
            </div>
            <span className="px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs shadow-subtle mt-1">
              + Add Resume
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
