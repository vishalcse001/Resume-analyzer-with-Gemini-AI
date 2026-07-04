import { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, FileText, LogOut, Sparkles, TrendingUp, AlertCircle, Target, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { user, logout } = useAuth();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file first');

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    setAnalysis(null);
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(res.data.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-500';
    if (score >= 60) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative border-b border-white/10 backdrop-blur-xl bg-white/5 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl  from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Resume Analyzer</h1>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/history" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition">
            <HistoryIcon size={16} /> History
          </Link>
          <span className="text-sm text-slate-400">Hi, <span className="text-white font-medium">{user?.name}</span></span>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-rose-400 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Upload Card */}
        <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-10 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Upload className="text-indigo-400" size={28} />
          </div>
          <h2 className="text-xl font-semibold mb-1">Upload your Resume</h2>
          <p className="text-slate-400 text-sm mb-6">PDF format only — get instant AI-powered feedback</p>

          <label className="inline-block cursor-pointer">
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
            <span className="inline-block px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm font-medium">
              Choose File
            </span>
          </label>

          {file && (
            <p className="text-sm text-slate-400 mt-4 flex items-center justify-center gap-1.5">
              <FileText size={14} /> {file.name}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition font-semibold shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <div className="mt-8 space-y-5 animate-in fade-in duration-500">
            {/* ATS Score */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-8 text-center">
              <p className="text-slate-400 text-sm mb-2 flex items-center justify-center gap-1.5">
                <Target size={14} /> ATS Score
              </p>
              <p className={`text-6xl font-extrabold bg-linear-to-r ${getScoreColor(analysis.atsScore)} bg-clip-text text-transparent`}>
                {analysis.atsScore}
                <span className="text-2xl text-slate-500">/100</span>
              </p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
                <div
                  className={`h-full bg-linear-to-r ${getScoreColor(analysis.atsScore)} rounded-full transition-all duration-1000`}
                  style={{ width: `${analysis.atsScore}%` }}
                />
              </div>
            </div>

            {/* Strengths */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
              <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <TrendingUp size={16} /> Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths?.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
              <h3 className="font-semibold text-rose-400 mb-3 flex items-center gap-2">
                <AlertCircle size={16} /> Weaknesses
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses?.map((w, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-rose-400 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
              <h3 className="font-semibold text-amber-400 mb-3">Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords?.map((k, i) => (
                  <span key={i} className="bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-3 py-1.5 rounded-full">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-xl p-6">
              <h3 className="font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                <Sparkles size={16} /> Suggestions
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;