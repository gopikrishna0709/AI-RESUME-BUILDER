import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Filter,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Building,
  Plus,
} from 'lucide-react';
import { jobAPI } from '../../services/api';

export default function JobBoard({ onSelectJobForMatch }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, selectedType, remoteOnly]);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Live Tech Jobs & Opportunities
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse active high-growth tech positions. Click &quot;Match with AI&quot; to test your resume alignment in seconds.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
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
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌐 Remote Only
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading available opportunities...</div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
          <p className="text-slate-400 text-xs">No jobs matched your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                      {job.logo || <Building className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="text-slate-400 text-xs font-medium">{job.company}</div>
                    </div>
                  </div>

                  {job.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-xs mt-3 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(job.requiredSkills || []).slice(0, 5).map((sk, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md text-[11px]"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Match with AI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
