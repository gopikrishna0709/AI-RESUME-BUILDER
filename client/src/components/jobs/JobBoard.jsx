import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Building2,
  Bookmark,
  History,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { jobAPI, aiAPI } from '../../services/api';

export default function JobBoard({ onSelectJobForMatch, activeResume }) {
  const [activeSubTab, setActiveSubTab] = useState('recommended'); // 'recommended' | 'saved' | 'history'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Saved Jobs tracking in localStorage
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('careermatch_saved_jobs') || '[]');
    } catch {
      return [];
    }
  });

  // Match History State
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, selectedType, remoteOnly]);

  useEffect(() => {
    if (activeSubTab === 'history') {
      fetchMatches();
    }
  }, [activeSubTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobAPI.getJobs({
        search: search || undefined,
        type: selectedType !== 'All' ? selectedType : undefined,
        remote: remoteOnly ? 'true' : undefined,
      });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      const res = await aiAPI.getMatches();
      if (res.data.success) {
        setMatches(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const toggleSaveJob = (jobId) => {
    const next = savedJobIds.includes(jobId)
      ? savedJobIds.filter((id) => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(next);
    localStorage.setItem('careermatch_saved_jobs', JSON.stringify(next));
  };

  const calculateQuickMatchScore = (job) => {
    if (!activeResume) return 85;
    const resumeSkills = (activeResume.skillGroups || []).flatMap((g) => g.items || []).map((s) => s.toLowerCase());
    const jobSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
    if (!jobSkills.length) return 88;
    const matchesCount = jobSkills.filter((s) => resumeSkills.some((rs) => rs.includes(s) || s.includes(rs))).length;
    return Math.min(98, Math.max(55, Math.round((matchesCount / jobSkills.length) * 100 * 0.8 + 20)));
  };

  const filteredJobs = activeSubTab === 'saved' ? jobs.filter((j) => savedJobIds.includes(j._id)) : jobs;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-surface-card border border-surface-border rounded-3xl p-5 sm:p-8 shadow-card transition-colors duration-200">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Briefcase className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Opportunities & Application Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-text tracking-tight font-display">
            Job Recommendations & Matches
          </h2>
          <p className="text-surface-muted text-xs sm:text-sm leading-relaxed">
            Discover roles scored against your candidate profile, save opportunities to your shortlist, and review your historical match scans.
          </p>
        </div>
      </div>

      {/* Sub Tabs & Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 sm:gap-4">
        {/* Navigation Tabs */}
        <div className="flex bg-surface-elevated border border-surface-border rounded-2xl p-1 gap-1 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('recommended')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeSubTab === 'recommended'
                ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                : 'text-surface-muted hover:text-surface-text'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-terracotta-300 shrink-0" />
            <span>Recommended ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeSubTab === 'saved'
                ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                : 'text-surface-muted hover:text-surface-text'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Saved ({savedJobIds.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap min-h-[40px] ${
              activeSubTab === 'history'
                ? 'bg-plum-900 text-white shadow-subtle dark:bg-plum-800'
                : 'text-surface-muted hover:text-surface-text'
            }`}
          >
            <History className="w-3.5 h-3.5 text-sage-400 shrink-0" />
            <span>History</span>
          </button>
        </div>

        {/* Search & Filter Inputs */}
        {activeSubTab !== 'history' && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 min-w-[160px] sm:w-56">
              <Search className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter title, skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs text-surface-text focus:outline-none focus:border-plum-600 font-medium min-h-[40px]"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-surface-text focus:outline-none focus:border-plum-600 font-semibold min-h-[40px]"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all min-h-[40px] ${
                remoteOnly
                  ? 'bg-plum-50 dark:bg-plum-950/80 text-plum-900 dark:text-plum-200 border-plum-300 dark:border-plum-700'
                  : 'bg-surface-card text-surface-muted border-surface-border hover:text-surface-text'
              }`}
            >
              🌐 Remote
            </button>
          </div>
        )}
      </div>

      {/* 11. Distinctive Job Recommendations Grid */}
      {activeSubTab !== 'history' ? (
        loading ? (
          <div className="py-20 text-center text-surface-muted text-xs font-semibold">
            Loading opportunities tailored to your profile...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center bg-surface-card border border-surface-border rounded-3xl p-8 space-y-2">
            <Bookmark className="w-8 h-8 text-surface-muted mx-auto" />
            <p className="text-surface-text font-bold text-sm">
              {activeSubTab === 'saved' ? 'No saved positions yet' : 'No jobs matched your filter query'}
            </p>
            <p className="text-surface-muted text-xs">
              {activeSubTab === 'saved'
                ? 'Click the bookmark icon on any job card to save it for quick reference.'
                : 'Try adjusting your search terms or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredJobs.map((job, idx) => {
              const matchScore = calculateQuickMatchScore(job);
              const isSaved = savedJobIds.includes(job._id);
              const staggerClass = `stagger-${(idx % 8) + 1}`;

              return (
                <div
                  key={job._id}
                  className={`interactive-card hover:border-plum-500/50 rounded-3xl p-4 sm:p-6 shadow-subtle flex flex-col justify-between gap-4 animate-card-entrance ${staggerClass}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-2xl shrink-0 font-bold text-plum-900 dark:text-plum-200">
                          {job.logo || <Building2 className="w-5 h-5 text-terracotta-500" />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-surface-text text-sm sm:text-base leading-snug hover:text-plum-900 dark:hover:text-plum-300 transition-colors truncate">
                            {job.title}
                          </h3>
                          <div className="text-surface-muted text-xs font-semibold truncate">{job.company}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Match Score Badge */}
                        <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-plum-50 dark:bg-plum-950/80 border border-plum-200 dark:border-plum-800 text-plum-900 dark:text-plum-200 text-[11px] sm:text-xs font-extrabold">
                          {matchScore}%
                        </div>

                        {/* Save Bookmark */}
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className={`p-2 rounded-xl border transition-all touch-target flex items-center justify-center ${
                            isSaved
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                              : 'bg-surface-elevated text-surface-muted border-surface-border hover:text-surface-text'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Job'}
                          aria-label={isSaved ? 'Remove job bookmark' : 'Bookmark job'}
                        >
                          <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <p className="text-surface-text text-xs line-clamp-2 leading-relaxed opacity-90">
                      {job.description}
                    </p>

                    {/* Skill Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.requiredSkills || []).slice(0, 5).map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-surface-elevated text-surface-text border border-surface-border px-2 py-0.5 rounded-lg text-[10.5px] sm:text-[11px] font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta & Match CTA */}
                  <div className="pt-3 border-t border-surface-border flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-surface-muted text-[11px]">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-sage-700 dark:text-sage-400 shrink-0">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salaryRange}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectJobForMatch(job._id)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-plum-900 hover:bg-plum-800 text-white font-bold text-xs shadow-subtle active:scale-[0.98] transition-all min-h-[38px]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-terracotta-300" />
                      <span>Analyze Match</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Match History Tab */
        <div className="space-y-3">
          {loadingMatches ? (
            <div className="py-20 text-center text-surface-muted text-xs font-semibold">Loading scan history...</div>
          ) : matches.length === 0 ? (
            <div className="py-16 text-center bg-surface-card border border-surface-border rounded-3xl p-8 space-y-2">
              <History className="w-8 h-8 text-surface-muted mx-auto" />
              <p className="text-surface-text font-bold text-sm">No match records logged yet</p>
              <p className="text-surface-muted text-xs">
                Run an ATS evaluation in the Job Matcher tab to see application records here.
              </p>
            </div>
          ) : (
            matches.map((item) => (
              <div
                key={item._id}
                className="bg-surface-card border border-surface-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shadow-subtle"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-surface-text text-sm sm:text-base truncate">{item.jobTitle}</span>
                    {item.company && <span className="text-surface-muted text-xs">at {item.company}</span>}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.status === 'Applied'
                          ? 'bg-sage-100 dark:bg-sage-950 text-sage-800 dark:text-sage-300 border border-sage-200'
                          : 'bg-plum-50 dark:bg-plum-950 text-plum-900 dark:text-plum-200 border border-plum-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-muted">
                    <span>Resume: {item.resumeId?.title || 'General'}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-black text-plum-900 dark:text-plum-200 font-display">
                      {item.overallMatchScore}%
                    </div>
                    <div className="text-[9px] text-surface-muted font-bold uppercase">Compatibility</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
