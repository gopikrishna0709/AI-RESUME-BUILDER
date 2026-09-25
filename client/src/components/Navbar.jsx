import React from 'react';
import {
  FileText,
  Briefcase,
  Target,
  History,
  Sparkles,
  LogIn,
  LogOut,
  User,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, onSelectTab, resumeCount = 1 }) {
  const { user, logout, openAuthModal, demoLogin, isAuthenticated } = useAuth();

  const NAV_ITEMS = [
    { id: 'builder', label: 'Builder', fullLabel: 'Resume Builder', icon: FileText },
    { id: 'matcher', label: 'AI Matcher', fullLabel: 'AI Job Matcher', icon: Target },
    { id: 'jobs', label: 'Jobs', fullLabel: 'Browse Jobs', icon: Briefcase },
    { id: 'history', label: 'History', fullLabel: 'Match History', icon: History },
  ];

  return (
    <>
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => onSelectTab('builder')}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-display font-black text-base sm:text-lg text-white tracking-tight leading-none">
                <span>Resum</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  AI
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wide leading-tight hidden xs:block">
                Builder & ATS Scanner
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1 gap-1 text-xs">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.fullLabel}</span>
                </button>
              );
            })}
          </div>

          {/* User / Auth Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-white leading-tight">{user?.name}</span>
                  <span className="text-[10px] text-blue-400 leading-tight truncate max-w-[140px]">
                    {user?.targetRole || user?.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-white max-w-[80px] sm:max-w-[110px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={demoLogin}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] sm:text-xs font-bold hover:bg-emerald-600/30 transition-all"
                >
                  <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>Demo</span>
                </button>

                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-400 hover:text-slate-200'
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
