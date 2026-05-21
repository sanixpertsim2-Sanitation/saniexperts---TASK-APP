import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, ClipboardList } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Report } from '@/types';

interface FindingsListProps {
  onReportClick: (report: Report) => void;
}

const statusFilters = ['all', 'new', 'in_review', 'task_created', 'resolved'];

const statusConfig: Record<string, { bg: string; text: string; label: string; border: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'NEW', border: 'border-l-blue-400' },
  in_review: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'IN REVIEW', border: 'border-l-amber-400' },
  task_created: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'TASK CREATED', border: 'border-l-emerald-400' },
  resolved: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'RESOLVED', border: 'border-l-slate-400' },
};

export function FindingsList({ onReportClick }: FindingsListProps) {
  const { reports, getUserById, updateReport } = useStore();
  const [filter, setFilter] = useState('all');
  const findings = reports.filter((r) => r.type === 'finding');

  const filtered = filter === 'all' ? findings : findings.filter((f) => f.status === filter);

  const handleResolve = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    updateReport(report.id, { status: 'resolved', resolvedAt: new Date().toISOString() });
  };

  const handleCreateTask = (e: React.MouseEvent, report: Report) => {
    e.stopPropagation();
    updateReport(report.id, { status: 'task_created' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800">Findings</h1>
        <span className="text-xs text-slate-500">{findings.length} total</span>
      </header>

      <div className="px-4 mt-3">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                filter === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {filtered.map((report, i) => {
          const status = statusConfig[report.status] || statusConfig.new;
          const reporter = getUserById(report.reportedBy);
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onReportClick(report)}
              className={`bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform border-l-[3px] ${status.border}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {reporter && (
                      <img src={reporter.avatar || ''} alt="" className="w-6 h-6 rounded-full object-cover" />
                    )}
                    <span className="text-xs font-medium text-slate-600">{reporter?.name || 'Unknown'}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(report.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed mb-2">{report.description}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin size={10} />
                  {report.location}
                </div>
              </div>
              {report.status !== 'resolved' && (
                <div className="px-4 pb-3 flex gap-2">
                  {report.status === 'new' && (
                    <button
                      onClick={(e) => handleCreateTask(e, report)}
                      className="flex-1 h-8 bg-primary text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                    >
                      <ClipboardList size={12} />
                      Create Task
                    </button>
                  )}
                  <button
                    onClick={(e) => handleResolve(e, report)}
                    className="flex-1 h-8 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={12} />
                    Resolve
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
