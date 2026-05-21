import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DAMAGE_STATUS_LABELS, DAMAGE_STATUS_COLORS, SEVERITY_CONFIG, getNextStatus } from '@/store/damageConfig';
import type { Report } from '@/types';

interface DamageReportsProps {
  onReportClick: (report: Report) => void;
}

const severityFilters = ['all', 'critical', 'high', 'medium', 'low'];

export function DamageReports({ onReportClick }: DamageReportsProps) {
  const { reports, getUserById } = useStore();
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const damageReports = reports.filter((r) => r.type === 'damage');
  const openCount = damageReports.filter((r) => r.status !== 'closed' && r.status !== 'resolved').length;

  const filtered = damageReports.filter((d) => {
    if (filter !== 'all' && d.severity !== filter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  const statusFilters = [
    { id: 'all', label: 'All' },
    { id: 'reported', label: 'Reported' },
    { id: 'maintenance_assigned', label: 'Assigned' },
    { id: 'in_repair', label: 'In Repair' },
    { id: 'fixed', label: 'Fixed' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h1 className="text-lg font-bold text-slate-800">Damage Reports</h1>
          {openCount > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </div>
        <span className="text-xs text-slate-500">{damageReports.length} total</span>
      </header>

      {/* Live Banner */}
      {openCount > 0 && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">{openCount} Active Damage{openCount > 1 ? 's' : ''} Need Attention</p>
            <p className="text-[11px] text-red-600">Tap any report to update status</p>
          </div>
        </div>
      )}

      {/* Severity Filters */}
      <div className="px-4 mt-3">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {severityFilters.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${filter === s ? s === 'critical' ? 'bg-red-500 text-white' : s === 'high' ? 'bg-orange-500 text-white' : s === 'medium' ? 'bg-amber-400 text-white' : s === 'low' ? 'bg-emerald-500 text-white' : 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="px-4">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {statusFilters.map((s) => (
            <button key={s.id} onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${statusFilter === s.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-3">
        {filtered.map((report, i) => {
          const sev = SEVERITY_CONFIG[report.severity || 'medium'];
          const stat = DAMAGE_STATUS_COLORS[report.status] || DAMAGE_STATUS_COLORS.reported;
          const reporter = getUserById(report.reportedBy);
          const isOpen = report.status !== 'closed' && report.status !== 'resolved';
          const nextSt = getNextStatus(report.status);

          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => onReportClick(report)}
              className={`bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform ${stat.border} border-l-[3px] ${!isOpen ? 'opacity-60' : ''}`}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <AlertTriangle size={14} className={report.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{report.severity?.toUpperCase()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.bg} ${stat.text}`}>{DAMAGE_STATUS_LABELS[report.status]}</span>
                    {isOpen && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed mb-2">{report.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"><MapPin size={10} />{report.location.replace('Give and Go IM2 — ', '')}</span>
                  {reporter && <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><Clock size={10} />{reporter.name.split(' ')[0]}</span>}
                  {nextSt && isOpen && <span className="text-[10px] text-primary font-medium ml-auto bg-primary-light px-2 py-0.5 rounded-full">Tap to update →</span>}
                </div>
                {report.photos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {report.photos.map((photo, pi) => <img key={pi} src={photo} alt="" className="w-14 h-14 rounded-lg object-cover" />)}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
