import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Target,
  Briefcase,
  Bot,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Zap,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, onSelectTab }) {
  const { user, logout, openAuthModal, demoLogin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard', fullLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Builder', fullLabel: 'Resume Builder', icon: FileText },
    { id: 'matcher', label: 'Matcher', fullLabel: 'Job Matcher', icon: Target },
    { id: 'tools', label: 'AI Tools', fullLabel: 'AI Resume Studio', icon: Sparkles },
    { id: 'jobs', label: 'Job Matches', fullLabel: 'Job Matches', icon: Briefcase },
    { id: 'career', label: 'Career AI', fullLabel: 'Career AI', icon: Bot },
  ];

  return (
    <>
      {/* Top Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 bg-surface-card border-b border-surface-border px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-plum-900 text-plum-50 flex items-center justify-center font-display font-black text-lg shadow-subtle group-hover:bg-plum-800 transition-colors border border-plum-700">
              <span className="text-terracotta-400">C</span>M
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-base sm:text-lg text-surface-text tracking-tight leading-none">
                <span>CareerMatch</span>
                <span className="text-terracotta-500 font-bold text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-terracotta-50 dark:bg-terracotta-950/60 border border-terracotta-200 dark:border-terracotta-800">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-surface-muted font-medium tracking-wide leading-tight hidden xs:block mt-0.5">
                Resume Builder & Intelligent Job Matcher
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center bg-surface-elevated border border-surface-border rounded-xl p-1 gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800 dark:text-plum-50'
                      : 'text-surface-muted hover:text-surface-text hover:bg-surface-hover'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-terracotta-400' : 'text-surface-muted'}`} />
                  <span>{item.fullLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Light / Dark Mode Toggle Switch */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Warm Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-surface-border text-surface-text transition-all flex items-center justify-center"
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-plum-900 rotate-0 transition-transform duration-300" />
              )}
            </button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Status Badge */}
                <div className="flex items-center gap-2.5 bg-surface-elevated border border-surface-border rounded-xl px-3 py-1.5">
                  <div className="w-7 h-7 rounded-lg bg-plum-900 text-terracotta-300 flex items-center justify-center font-display font-bold text-xs">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-surface-text leading-tight truncate max-w-[130px]">
                      {user?.name || 'Career Candidate'}
                    </span>
                    <span className="text-[10px] text-terracotta-600 dark:text-terracotta-400 leading-tight truncate max-w-[130px] font-medium">
                      {user?.title || user?.targetRole || 'Professional'}
                    </span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-surface-elevated border border-surface-border text-surface-muted hover:text-terracotta-600 hover:border-terracotta-300 dark:hover:border-terracotta-800 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-sage-950/60 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800 text-xs font-bold hover:bg-sage-100 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo</span>
                </button>

                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle active:scale-[0.98] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-surface-border px-2 py-1.5 flex items-center justify-around shadow-modal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'text-plum-900 dark:text-terracotta-400 font-bold bg-plum-50 dark:bg-plum-950/80'
                  : 'text-surface-muted hover:text-surface-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
