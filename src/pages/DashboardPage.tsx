import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GradingResult, GradeType } from '../types';
import { generateGradingPDF } from '../services/pdfReportGenerator';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface DashboardPageProps {
  onNewGradingClick: () => void;
  onSelectResult: (result: GradingResult) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNewGradingClick,
  onSelectResult
}) => {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<GradingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');

  const fetchHistory = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const url = new URL('/api/grading/history', window.location.origin);
      if (searchQuery) url.searchParams.set('search', searchQuery);
      if (gradeFilter !== 'All') url.searchParams.set('grade', gradeFilter);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token, gradeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const getGradeStyle = (grade: GradeType) => {
    switch (grade) {
      case 'Grade A':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800';
      case 'Grade B':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800';
      case 'Grade C':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800';
      default:
        return 'text-red-700 bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800';
    }
  };

  // Metrics summary
  const totalScans = history.length;
  const gradeACount = history.filter(h => h.finalGrade === 'Grade A').length;
  const gradeBCount = history.filter(h => h.finalGrade === 'Grade B').length;
  const rejectedCount = history.filter(h => h.finalGrade === 'Rejected').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Produce Quality Grading Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{user?.username}</strong> ({user?.accountType}) · {user?.email}
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Total Scans</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{totalScans}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] uppercase font-sans">Grade A Export</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">{gradeACount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <span className="text-blue-600 dark:text-blue-400 block text-[10px] uppercase font-sans">Grade B Std</span>
            <span className="font-bold text-blue-700 dark:text-blue-300 tabular-nums">{gradeBCount}</span>
          </div>
        </div>
      </div>

      {/* Prominent Center: New Grading Button / Action Card (Section 7) */}
      <div className="mb-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white shadow-lg shadow-emerald-950/10">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Stage AI Optical Inspection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Ready to Grade a Fresh Harvest Batch?
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed mb-6">
              Upload fruit or vegetable photography or conveyor video feeds.
            </p>

            <button
              onClick={onNewGradingClick}
              className="py-3 px-6 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all flex items-center gap-2 group cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>New Grading</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Decorative agricultural background pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
            <img
              src="/src/assets/images/hero_agri_inspection_1792161960913.jpg"
              alt="Inspection background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Section: Previous Grading History (Section 11) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Previous Grading History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Securely persisted inspection records and downloadable audit certificates.
            </p>
          </div>

          {/* Search & Grade Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search produce or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
              />
            </form>

            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {['All', 'Grade A', 'Grade B', 'Grade C', 'Rejected'].map(grade => (
                <button
                  key={grade}
                  onClick={() => setGradeFilter(grade)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    gradeFilter === grade
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Table / Card List */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span>Loading verified grading archives...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              No Previous Grading Records Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {searchQuery || gradeFilter !== 'All'
                ? 'No records matched your search query or grade filter.'
                : 'You have not performed any produce scans yet. Upload your first sample to generate an AI quality report.'}
            </p>
            <button
              onClick={onNewGradingClick}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start First Grading</span>
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Produce Sample</th>
                    <th className="py-3 px-4">Identification</th>
                    <th className="py-3 px-4">Assigned Grade</th>
                    <th className="py-3 px-4">Defect Summary</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {history.map(item => {
                    const defectSummary =
                      item.defects.length === 0
                        ? 'Zero visible blemishes'
                        : `${item.defects.length} defect(s) · ${item.defects.map(d => d.type).join(', ')}`;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Actual Uploaded Image Thumbnail */}
                        <td className="py-3 px-4">
                          <div
                            onClick={() => onSelectResult(item)}
                            className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                          >
                            <img
                              src={item.mediaUrl}
                              alt={item.produceName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        </td>

                        {/* Produce Name */}
                        <td className="py-3 px-4 font-medium">
                          <button
                            onClick={() => onSelectResult(item)}
                            className="text-left font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                          >
                            {item.produceName}
                          </button>
                          <span className="text-[11px] text-slate-400 font-mono">
                            #{item.id} · {item.detectedItemCount} item(s)
                          </span>
                        </td>

                        {/* Final Grade */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getGradeStyle(
                              item.finalGrade
                            )}`}
                          >
                            {item.finalGrade}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {item.qualityClass}
                          </span>
                        </td>

                        {/* Defect Summary */}
                        <td className="py-3 px-4 max-w-xs">
                          <span className="truncate block font-medium">
                            {defectSummary}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            Area: {item.overallDefectAreaPercent.toFixed(1)}% · Conf: {(item.confidences.overall * 100).toFixed(0)}%
                          </span>
                        </td>

                        {/* Date and Time (Tabular Nums) */}
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(item.processingDate).toLocaleDateString()}
                          <span className="text-[11px] block opacity-75">
                            {new Date(item.processingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        {/* Processing Status */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Actions: View Report & Download PDF */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectResult(item)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 transition-colors"
                              title="View Full Quality Assessment"
                            >
                              <FileText className="w-3 h-3 text-slate-500" />
                              <span>View Report</span>
                            </button>

                            <button
                              onClick={() => generateGradingPDF(item)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                              title="Download PDF Certificate"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
