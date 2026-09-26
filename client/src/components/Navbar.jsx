import React, { useState, useEffect } from 'react';
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
  Menu,
  X,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, onSelectTab }) {
  const { user, logout, openAuthModal, demoLogin, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard', fullLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Resume Builder', fullLabel: 'Resume Builder', icon: FileText },
    { id: 'matcher', label: 'Job Matcher', fullLabel: 'Job Matcher', icon: Target },
    { id: 'tools', label: 'AI Tools', fullLabel: 'AI Resume Studio', icon: Sparkles },
    { id: 'jobs', label: 'Job Matches', fullLabel: 'Job Matches', icon: Briefcase },
    { id: 'career', label: 'Career AI', fullLabel: 'Career AI', icon: Bot },
  ];

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface-card border-b border-surface-border px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-plum-900 text-plum-50 flex items-center justify-center font-display font-black text-base sm:text-lg shadow-subtle group-hover:bg-plum-800 transition-colors border border-plum-700 shrink-0">
              <span className="text-terracotta-400">C</span>M
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-sm sm:text-base lg:text-lg text-surface-text tracking-tight leading-none">
                <span>CareerMatch</span>
                <span className="text-terracotta-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest px-1 sm:px-1.5 py-0.5 rounded bg-terracotta-50 dark:bg-terracotta-950/60 border border-terracotta-200 dark:border-terracotta-800">
                  AI
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-surface-muted font-medium tracking-wide leading-tight hidden xs:block mt-0.5">
                Resume Builder & Job Matcher
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop 1024px+) */}
          <nav aria-label="Desktop Navigation" className="hidden lg:flex items-center bg-surface-elevated border border-surface-border rounded-xl p-1 gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800 dark:text-plum-50'
                      : 'text-surface-muted hover:text-surface-text hover:bg-surface-hover'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-terracotta-400' : 'text-surface-muted'}`} />
                  <span className="whitespace-nowrap">{item.fullLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Light / Dark Mode Toggle Switch (Desktop & Tablet) */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 sm:p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-surface-border text-surface-text transition-all flex items-center justify-center touch-target"
              aria-label="Toggle color theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-plum-900 transition-transform duration-300" />
              )}
            </button>

            {/* Desktop Auth Section */}
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-2.5 sm:px-3 py-1.5">
                    <div className="w-6 h-6 rounded-lg bg-plum-900 text-terracotta-300 flex items-center justify-center font-display font-bold text-xs">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-surface-text leading-tight truncate max-w-[110px]">
                        {user?.name || 'Candidate'}
                      </span>
                      <span className="text-[10px] text-terracotta-600 dark:text-terracotta-400 leading-tight truncate max-w-[110px] font-medium">
                        {user?.title || user?.targetRole || 'Professional'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-xl bg-surface-elevated border border-surface-border text-surface-muted hover:text-terracotta-600 transition-all touch-target flex items-center justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={demoLogin}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 border border-sage-200 dark:border-sage-800 text-xs font-bold hover:bg-sage-100 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Demo</span>
                  </button>

                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white text-xs font-bold shadow-subtle active:scale-[0.98] transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-terracotta-300" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Hamburger Menu Trigger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-surface-border text-surface-text transition-all touch-target flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-terracotta-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-Up Drawer Menu Panel */}
          <div className="relative w-full max-h-[85vh] bg-surface-card border-t border-surface-border rounded-t-3xl p-5 sm:p-6 shadow-modal overflow-y-auto z-10 space-y-5 animate-slide-up">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-plum-900 text-terracotta-300 flex items-center justify-center font-display font-black text-sm border border-plum-700">
                  CM
                </div>
                <div>
                  <div className="font-extrabold text-sm text-surface-text">CareerMatch AI</div>
                  <div className="text-[10px] text-surface-muted">Navigation Menu</div>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-surface-elevated text-surface-muted hover:text-surface-text"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card inside Drawer */}
            {isAuthenticated ? (
              <div className="p-3.5 bg-surface-elevated rounded-2xl border border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-plum-900 text-terracotta-300 flex items-center justify-center font-display font-bold text-xs">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-surface-text">{user?.name || 'Candidate'}</div>
                    <div className="text-[10px] text-terracotta-600 dark:text-terracotta-400 font-medium">
                      {user?.title || user?.targetRole || 'Professional'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs font-bold text-terracotta-600 hover:bg-terracotta-50 transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    demoLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-sage-50 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 border border-sage-200 dark:border-sage-800 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Instant Demo</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-plum-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-subtle"
                >
                  <LogIn className="w-3.5 h-3.5 text-terracotta-300" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Navigation Link Items */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-surface-muted uppercase tracking-wider px-2 mb-1">
                Platform Pages
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all min-h-[48px] ${
                      isActive
                        ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                        : 'bg-surface-elevated text-surface-text hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta-300' : 'text-surface-muted'}`} />
                      <span>{item.fullLabel}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-terracotta-300' : 'text-surface-muted'}`} />
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle row in mobile menu */}
            <div className="pt-2 border-t border-surface-border flex items-center justify-between px-1">
              <span className="text-xs font-bold text-surface-text">Theme Preference</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-elevated border border-surface-border text-xs font-bold text-surface-text"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-plum-900" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
