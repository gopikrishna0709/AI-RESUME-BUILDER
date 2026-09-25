import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Building,
  Bookmark,
  BookmarkCheck,
  History,
  Calendar,
  Layers,
  ArrowRight,
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
      return JSON.parse(localStorage.getItem('resumai_saved_jobs') || '[]');
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
    localStorage.setItem('resumai_saved_jobs', JSON.stringify(next));
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          <span>Job Recommendations & Applications Tracker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Opportunities & Applications
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Explore roles scored against your active resume, manage your saved shortlist, and review past ATS scans.
        </p>
      </div>

      {/* Sub Tabs & Search Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Tabs */}
        <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('recommended')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === 'recommended'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recommended ({jobs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === 'saved'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Jobs ({savedJobIds.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeSubTab === 'history'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Match History</span>
          </button>
        </div>

        {/* Search & Filters */}
        {activeSubTab !== 'history' && (
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter title, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                remoteOnly
                  ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🌐 Remote Only
            </button>
          </div>
        )}
      </div>

      {/* Jobs View */}
      {activeSubTab !== 'history' ? (
        loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading opportunities...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-semibold text-sm">
              {activeSubTab === 'saved' ? 'No saved jobs yet' : 'No jobs matched your filter'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {activeSubTab === 'saved'
                ? 'Click the bookmark icon on any job card to add it to your shortlist.'
                : 'Try adjusting your search keywords.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const matchScore = calculateQuickMatchScore(job);
              const isSaved = savedJobIds.includes(job._id);

              return (
                <div
                  key={job._id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                          {job.logo || <Building className="w-5 h-5 text-amber-400" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-sm sm:text-base hover:text-amber-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="text-slate-400 text-xs font-medium">{job.company}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Match Score Badge */}
                        <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                          {matchScore}% Match
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleSaveJob(job._id)}
                          className={`p-2 rounded-xl border transition-all ${
                            isSaved
                              ? 'bg-amber-600/30 text-amber-400 border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title={isSaved ? 'Remove from Saved' : 'Save Job'}
                        >
                          <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.requiredSkills || []).slice(0, 5).map((sk, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800/90 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-lg text-[11px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        {job.salaryRange}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectJobForMatch(job._id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Match with AI</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Match History View */
        <div className="space-y-3">
          {loadingMatches ? (
            <div className="py-20 text-center text-slate-400 text-xs">Loading match records...</div>
          ) : matches.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">No match scans recorded yet</p>
              <p className="text-slate-500 text-xs mt-1">
                Run an evaluation in the AI Job Matcher tab to see application logs here.
              </p>
            </div>
          ) : (
            matches.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{item.jobTitle}</span>
                    {item.company && <span className="text-slate-400 text-xs">at {item.company}</span>}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Applied'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>Resume: {item.resumeId?.title || 'General'}</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                      {item.overallMatchScore}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Match Score</div>
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
