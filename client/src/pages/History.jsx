import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Clock, Inbox } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/resume/history');
        setResumes(res.data);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 mb-6 transition">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock size={22} className="text-indigo-400" />
            Your Resume History
          </h1>
          <p className="text-slate-400 text-sm mt-1">All your past resume analyses in one place</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Inbox className="text-slate-500" size={26} />
            </div>
            <p className="text-slate-400">No resumes analyzed yet.</p>
            <Link to="/dashboard" className="inline-block mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
              Analyze your first resume →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div
                key={r._id}
                className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-5 flex justify-between items-center hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center shrink-0">
                    <FileText className="text-indigo-400" size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white">{r.fileName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-lg ${getScoreColor(r.analysis?.atsScore)}`}>
                  {r.analysis?.atsScore}
                  <span className="text-slate-500 text-sm font-normal">/100</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;