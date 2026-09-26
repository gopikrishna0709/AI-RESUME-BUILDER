import React from 'react';
import {
  Sparkles,
  FileText,
  Target,
  Briefcase,
  Bot,
  ArrowUp,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onSelectTab }) {
  const { isDark, toggleTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (tabId) => {
    if (tabId && onSelectTab) {
      onSelectTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-surface-card border-t border-surface-border mt-14 sm:mt-20 pt-10 sm:pt-14 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* 1. Signature Abstract Career Path Line */}
        <div className="bg-surface-elevated border border-surface-border rounded-2xl p-4 sm:p-5 shadow-subtle overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[620px] gap-2 text-xs font-semibold text-surface-muted">
            <div className="flex items-center gap-2 text-plum-900 dark:text-plum-200 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-plum-700 dark:bg-plum-400" />
              <span>1. Resume Drafting</span>
            </div>
            <span className="text-surface-subtle font-normal">───────●───────</span>
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>2. STAR AI Enhancement</span>
            </div>
            <span className="text-surface-subtle font-normal">───────●───────</span>
            <div className="flex items-center gap-2 text-terracotta-700 dark:text-terracotta-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500" />
              <span>3. Job NLP Matching</span>
            </div>
            <span className="text-surface-subtle font-normal">───────●───────</span>
            <div className="flex items-center gap-2 text-sage-700 dark:text-sage-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-sage-500" />
              <span>4. Interview Preparation</span>
            </div>
            <span className="text-surface-subtle font-normal">───────●───────</span>
            <div className="flex items-center gap-2 text-plum-900 dark:text-plum-200 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-plum-600 dark:bg-plum-400" />
              <span>5. Placement</span>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Navigation Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand & Mission Column (Desktop: 4 cols) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 space-y-4">
            <div
              onClick={() => handleLinkClick('home')}
              className="inline-flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-plum-900 dark:bg-plum-800 text-white flex items-center justify-center font-black text-sm shadow-subtle group-hover:scale-105 transition-transform shrink-0">
                <Target className="w-5 h-5 text-terracotta-400" />
              </div>
              <div>
                <span className="font-display font-black text-lg sm:text-xl text-plum-900 dark:text-plum-100 tracking-tight">
                  CareerMatch<span className="text-terracotta-500">.AI</span>
                </span>
                <span className="block text-[10px] text-surface-muted font-bold uppercase tracking-wider -mt-1">
                  Intelligent Resume & Career Platform
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-surface-muted leading-relaxed max-w-sm">
              Build ATS-optimized resumes, analyze job description compatibility with deep AI matching, and practice hiring manager interviews.
            </p>

            {/* AI Engine & System Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-surface-border text-xs font-semibold text-surface-text">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse shrink-0" />
              <span>Gemini AI Engine Online</span>
            </div>

            {/* Social & Repository Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://github.com/gopikrishna0709/AI-RESUME-BUILDER"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="w-8 h-8 rounded-xl bg-surface-elevated hover:bg-plum-900 hover:text-white border border-surface-border text-surface-muted flex items-center justify-center transition-all duration-200 shadow-subtle"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-xl bg-surface-elevated hover:bg-plum-900 hover:text-white border border-surface-border text-surface-muted flex items-center justify-center transition-all duration-200 shadow-subtle"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-xl bg-surface-elevated hover:bg-plum-900 hover:text-white border border-surface-border text-surface-muted flex items-center justify-center transition-all duration-200 shadow-subtle"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <button
                onClick={scrollToTop}
                aria-label="Back to Top"
                className="w-8 h-8 rounded-xl bg-surface-elevated hover:bg-plum-900 hover:text-white border border-surface-border text-surface-muted flex items-center justify-center transition-all duration-200 shadow-subtle"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Links (Desktop: 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-plum-900 dark:text-plum-200 uppercase tracking-widest font-display">
              Product Suite
            </div>
            <ul className="space-y-2 text-xs font-medium text-surface-muted">
              <li>
                <button
                  onClick={() => handleLinkClick('builder')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Resume Builder</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('builder')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Resume Templates</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('tools')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>AI Summary Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('tools')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>STAR Bullet Generator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('tools')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>ATS Readability Audit</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Career & Matcher Links (Desktop: 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-plum-900 dark:text-plum-200 uppercase tracking-widest font-display">
              Job Intelligence
            </div>
            <ul className="space-y-2 text-xs font-medium text-surface-muted">
              <li>
                <button
                  onClick={() => handleLinkClick('matcher')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Job Description Matcher</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('matcher')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Skill Gap Analysis</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('jobs')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Curated Job Matches</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('career')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>Mock Interview Bank</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('career')}
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ChevronRight className="w-3 h-3 text-terracotta-500" />
                  <span>90-Day Learning Roadmap</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & AI (Desktop: 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-plum-900 dark:text-plum-200 uppercase tracking-widest font-display">
              Platform & AI
            </div>
            <ul className="space-y-2 text-xs font-medium text-surface-muted">
              <li className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Google Gemini API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-sage-600 shrink-0" />
                <span>MongoDB Atlas Cloud</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-plum-700 dark:text-plum-300 shrink-0" />
                <a
                  href="https://careermatch-rouge-phi.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1"
                >
                  <span>Live on Vercel</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-terracotta-500 shrink-0" />
                <a
                  href="https://github.com/gopikrishna0709/CareerMatch"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-sage-600 shrink-0" />
                <span>99.9% Uptime Ready</span>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy (Desktop: 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold text-plum-900 dark:text-plum-200 uppercase tracking-widest font-display">
              Trust & Standards
            </div>
            <ul className="space-y-2 text-xs font-medium text-surface-muted">
              <li>
                <span className="hover:text-surface-text transition-colors block">
                  Private & Encrypted Data
                </span>
              </li>
              <li>
                <span className="hover:text-surface-text transition-colors block">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-surface-text transition-colors block">
                  WCAG 2.1 AA Compliant
                </span>
              </li>
              <li>
                <span className="hover:text-surface-text transition-colors block">
                  Cookie Preferences
                </span>
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  className="text-[11px] font-bold text-terracotta-600 dark:text-terracotta-400 hover:underline pt-1 text-left"
                >
                  Switch to {isDark ? 'Light' : 'Dark'} Mode
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Divider & Copyright Row */}
        <div className="pt-6 sm:pt-8 border-t border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-surface-muted">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 text-center sm:text-left">
            <span className="font-bold text-surface-text">
              © {currentYear} CareerMatch AI.
            </span>
            <span>All rights reserved. Built to empower candidates with transparent career intelligence.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-surface-elevated text-surface-text font-bold border border-surface-border">
              v2.4 Production
            </span>
            <button
              onClick={scrollToTop}
              className="hover:text-surface-text transition-colors font-bold text-terracotta-600 dark:text-terracotta-400 flex items-center gap-1"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
