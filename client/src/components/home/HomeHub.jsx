import React from 'react';
import {
  Sparkles,
  FileText,
  Wrench,
  Target,
  Briefcase,
  Bot,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Award,
  Layers,
  Search,
  BookOpen,
  Code2,
  Compass,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Eye,
  Plus,
} from 'lucide-react';

export default function HomeHub({ activeResume, onSelectTab, onOpenCreateResume }) {
  const atsScore = activeResume?.atsScore || 92;
  const targetRole = activeResume?.targetJobTitle || activeResume?.personalInfo?.headline || 'Full Stack Software Engineer';

  const MODULES = [
    {
      id: 'builder',
      title: 'Resume Builder',
      badge: 'Core Builder',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: FileText,
      iconColor: 'from-blue-600 to-indigo-600',
      description: 'Design ATS-compliant, multi-template resumes with real-time visual canvas and instant PDF export.',
      features: [
        'Personal Details & Contact',
        'Education & Academics',
        'Technical & Soft Skills',
        'Work Experience & STAR Bullets',
        'Featured Projects & Portfolios',
        'Certifications & Credentials',
      ],
      cta: 'Open Resume Builder',
    },
    {
      id: 'tools',
      title: 'AI Resume Tools',
      badge: 'Gemini AI Studio',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Sparkles,
      iconColor: 'from-purple-600 to-pink-600',
      description: 'Supercharge your resume text with generative AI tools tailored for maximum hiring manager impact.',
      features: [
        'AI Summary Generator & Polish',
        'AI STAR Bullet Point Creator',
        'Full Resume Text Enhancement',
        'Deep ATS Audit & Readability Score',
      ],
      cta: 'Explore AI Tools',
    },
    {
      id: 'matcher',
      title: 'AI Job Matcher',
      badge: 'ATS Scanner',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Target,
      iconColor: 'from-emerald-600 to-teal-600',
      description: 'Compare your resume against any target job description. Identify missing keywords and tailor instantly.',
      features: [
        'Job Description NLP Analyzer',
        'Resume–Job Compatibility Match',
        'Radial Match Score (0 - 100%)',
        'Skill Gap Analysis (Matched vs Missing)',
        '1-Click AI Resume Optimization',
      ],
      cta: 'Scan & Match Job',
    },
    {
      id: 'jobs',
      title: 'Job Recommendations',
      badge: 'Live Board',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Briefcase,
      iconColor: 'from-amber-600 to-orange-600',
      description: 'Discover curated high-growth tech positions with automated compatibility badges against your resume.',
      features: [
        'Curated Tech Roles & Salaries',
        'Instant Match Compatibility Badges',
        'Saved Applications Tracker',
        'Application & Match Scan History',
      ],
      cta: 'Browse Recommended Jobs',
    },
    {
      id: 'career',
      title: 'Career AI Assistant',
      badge: 'Interview & Prep',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: Bot,
      iconColor: 'from-rose-600 to-indigo-600',
      description: 'Level up your hiring journey with tailored interview questions, mock simulators, and skill roadmaps.',
      features: [
        'Role-Specific Interview Questions',
        'Interactive Mock Interview & AI Scoring',
        'Personalized 90-Day Skill Roadmap',
        'System Design & Behavioral Star Prep',
      ],
      cta: 'Launch Career AI',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold border border-blue-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Next-Gen Career Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight font-display">
              Build Winning Resumes.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Match Dream Jobs.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              ResumAI integrates generative Google Gemini AI, ATS job compatibility scanning, real-time multi-template resume design, and interactive interview simulations into one unified command center.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('builder')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Open Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('matcher')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Run ATS Matcher</span>
              </button>

              <button
                onClick={() => onSelectTab('career')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-bold text-xs sm:text-sm transition-all"
              >
                <Bot className="w-4 h-4 text-rose-400" />
                <span>Career AI</span>
              </button>
            </div>
          </div>

          {/* Active Resume Status Card */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Resume</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Ready to Export
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base truncate">
                {activeResume?.title || 'Professional Resume'}
              </h3>
              <p className="text-xs text-blue-400 mt-0.5 truncate">{targetRole}</p>
            </div>

            {/* Score & Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  {atsScore}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">ATS Score</div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-2xl font-black text-purple-400">
                  {activeResume?.template?.replace('-', ' ').toUpperCase() || 'TECH PRO'}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Active Template</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => onSelectTab('builder')}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>Edit Content</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectTab('tools')}
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>✨ AI Enhance</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Architecture Matrix Hub */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Platform Modules</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 font-display">
              Explore ResumAI Superpowers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Everything you need from drafting resume sections and ATS scanning to personalized mock interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onSelectTab(mod.id)}
                className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between gap-5 overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.iconColor} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Sub-features checklist */}
                  <div className="pt-3 border-t border-slate-800/60 space-y-1.5">
                    {mod.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                  <span>{mod.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Quick Start New Resume Box */}
          <div
            onClick={onOpenCreateResume}
            className="group relative bg-gradient-to-br from-blue-950/30 to-purple-950/30 border border-dashed border-blue-500/40 hover:border-blue-400 rounded-3xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center text-center gap-3 min-h-[300px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300">
                Create New Resume
              </h3>
              <p className="text-slate-400 text-xs mt-1 max-w-xs">
                Start with a fresh template tailored for Engineering, Product, Data Science, or Executive leadership.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 mt-2">
              + New Resume
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
