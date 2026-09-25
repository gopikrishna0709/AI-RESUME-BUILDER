import React, { useState, useEffect } from 'react';
import { History, Award, CheckCircle2, AlertTriangle, ArrowRight, Trash2, Calendar, FileText, Sparkles } from 'lucide-react';
import { aiAPI } from '../../services/api';

export default function MatchHistory({ onOpenMatcherWithRecord }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await aiAPI.getMatches();
      if (res.data.success) {
        setMatches(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="w-6 h-6 text-purple-400" />
          Application & Match History
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review your past AI job scans, compatibility scores, and tailored recommendations.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading previous matches...</div>
      ) : matches.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold text-sm">No matches recorded yet</p>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
            Scan your resume in the AI Matcher tab to track applications and ATS scores here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
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
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Resume: {item.resumeId?.title || 'General Resume'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                      {item.overallMatchScore}%
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Match Score</div>
                  </div>

                  <div className="h-6 w-px bg-slate-800" />

                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-400">{item.atsPassedRate}%</div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">ATS Pass</div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenMatcherWithRecord(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
