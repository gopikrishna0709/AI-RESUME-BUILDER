import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Zap, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    openAuthModal,
    login,
    register,
    demoLogin,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (authModalMode === 'register' && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, title: title || 'Software Engineer' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
    } catch (err) {
      setError('Failed to start demo session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 shadow-modal overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-surface-muted hover:text-surface-text rounded-full bg-surface-elevated hover:bg-surface-hover transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Monogram Badge */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-plum-900 text-plum-50 mb-3 shadow-subtle border border-plum-700 font-display font-black text-lg">
            <span className="text-terracotta-400">C</span>M
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-surface-text tracking-tight font-display">
            {authModalMode === 'login' ? 'Welcome to CareerMatch' : 'Create Candidate Account'}
          </h3>
          <p className="text-surface-muted text-xs sm:text-sm mt-1">
            {authModalMode === 'login'
              ? 'Sign in to access your resumes & AI ATS optimizer'
              : 'Join to build ATS-tailored resumes & scan job matches'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-surface-elevated rounded-2xl border border-surface-border mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setError('');
              openAuthModal('login');
            }}
            className={`py-2 rounded-xl transition-all ${
              authModalMode === 'login'
                ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                : 'text-surface-muted hover:text-surface-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setError('');
              openAuthModal('register');
            }}
            className={`py-2 rounded-xl transition-all ${
              authModalMode === 'register'
                ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                : 'text-surface-muted hover:text-surface-text'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-terracotta-50 dark:bg-terracotta-950/60 border border-terracotta-200 dark:border-terracotta-800 text-terracotta-800 dark:text-terracotta-200 text-xs flex items-start gap-2">
            <span className="text-terracotta-600 font-bold">•</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Login */}
        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="w-full mb-4 py-2.5 sm:py-3 px-4 rounded-xl bg-sage-50 dark:bg-sage-950/60 hover:bg-sage-100 text-sage-800 dark:text-sage-300 border border-sage-200 dark:border-sage-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>⚡ Instant 1-Click Demo Session</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-surface-border" />
          <span className="text-[10px] uppercase tracking-wider text-surface-muted font-bold">
            Or with credentials
          </span>
          <div className="h-px flex-1 bg-surface-border" />
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-surface-muted text-xs font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-surface-muted text-xs font-semibold mb-1">Target Professional Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-surface-text focus:outline-none focus:border-plum-600 font-medium"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-surface-muted text-xs font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-surface-text focus:outline-none focus:border-plum-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-surface-muted text-xs font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                autoComplete={authModalMode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-surface-text focus:outline-none focus:border-plum-600 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted hover:text-surface-text p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-plum-900 hover:bg-plum-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-subtle transition-all mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating securely...</span>
            ) : authModalMode === 'login' ? (
              <span>Sign In to CareerMatch</span>
            ) : (
              <span>Create Candidate Account</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-surface-border text-center text-xs text-surface-muted">
          {authModalMode === 'login' ? (
            <p>
              New to CareerMatch?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  openAuthModal('register');
                }}
                className="text-plum-900 dark:text-plum-300 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  openAuthModal('login');
                }}
                className="text-plum-900 dark:text-plum-300 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
