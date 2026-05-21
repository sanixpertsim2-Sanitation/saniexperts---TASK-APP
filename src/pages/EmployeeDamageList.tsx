import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DAMAGE_STATUS_LABELS, DAMAGE_STATUS_COLORS, SEVERITY_CONFIG } from '@/store/damageConfig';
import type { Report } from '@/types';

interface EmployeeDamageListProps {
  onReportClick: (report: Report) => void;
}

const tabs = ['open', 'my_reports', 'closed'];

export function EmployeeDamageList({ onReportClick }: EmployeeDamageListProps) {
  const { reports, getUserById, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('open');
  const myId = currentUser?.id || '';

  const allDamage = reports.filter((r) => r.type === 'damage');
  const openDamage = allDamage.filter((r) => r.status !== 'closed' && r.status !== 'resolved');
  const myDamage = allDamage.filter((r) => r.reportedBy === myId);
  const closedDamage = allDamage.filter((r) => r.status === 'closed' || r.status === 'resolved');

  const displayList = activeTab === 'open' ? openDamage : activeTab === 'my_reports' ? myDamage : closedDamage;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h1 className="text-lg font-bold text-slate-800">Damage Reports</h1>
          {openDamage.length > 0 && (
            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{openDamage.length} open</span>
          )}
        </div>
      </header>

      {/* Live Banner for Open Damages */}
      {openDamage.length > 0 && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">{openDamage.length} Active Damage Report{openDamage.length > 1 ? 's' : ''}</p>
            <p className="text-[11px] text-red-600">Supervisor is tracking these issues</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex border-b border-slate-200">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 pb-2.5 text-xs font-medium transition-colors relative ${activeTab === t ? 'text-primary' : 'text-slate-400'}`}>
              {t === 'open' ? 'Open' : t === 'my_reports' ? 'My Reports' : 'Closed'}
              {activeTab === t && <motion.div layoutId="damageTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-3 space-y-2.5">
        {displayList.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              {activeTab === 'open' ? 'No open damage reports' : activeTab === 'my_reports' ? 'No damage reports from you' : 'No closed damage reports'}
            </p>
          </div>
        )}

        {displayList.map((report, i) => {
          const statusConfig = DAMAGE_STATUS_COLORS[report.status] || DAMAGE_STATUS_COLORS.reported;
          const severityConfig = SEVERITY_CONFIG[report.severity || 'medium'];
          const reporter = getUserById(report.reportedBy);
          const isOpen = report.status !== 'closed' && report.status !== 'resolved';

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onReportClick(report)}
              className={`bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform ${statusConfig.border} border-l-[3px] ${isOpen ? '' : 'opacity-70'}`}
            >
              <div className="p-4">
                {/* Top row: severity + status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityConfig.bg} ${severityConfig.text}`}>
                      {report.severity?.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                      {DAMAGE_STATUS_LABELS[report.status] || report.status.toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>

                <p className="text-sm text-slate-800 leading-relaxed mb-2">{report.description}</p>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin size={10} />{report.location.replace('Give and Go IM2 — ', '')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock size={10} />{formatTime(report.createdAt)}
                  </span>
                  {reporter && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <span>by {reporter.name.split(' ')[0]}</span>
                    </span>
                  )}
                </div>

                {/* Status progress bar */}
                {isOpen && (
                  <div className="mt-3">
                    <StatusProgressBar currentStatus={report.status} />
                  </div>
                )}

                {report.photos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {report.photos.map((photo, pi) => (
                      <img key={pi} src={photo} alt="" className="w-14 h-14 rounded-lg object-cover" />
                    ))}
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

function StatusProgressBar({ currentStatus }: { currentStatus: string }) {
  const flow = ['reported', 'maintenance_assigned', 'in_repair', 'fixed', 'closed'];
  const labels = ['Reported', 'Assigned', 'Repair', 'Fixed', 'Closed'];
  const currentIdx = flow.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {flow.map((s, i) => (
        <div key={s} className="flex-1 flex flex-col items-center gap-1">
          <div className={`w-full h-1.5 rounded-full ${i <= currentIdx ? 'bg-primary' : 'bg-slate-200'}`} />
          <span className={`text-[8px] font-medium ${i <= currentIdx ? 'text-primary' : 'text-slate-400'}`}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
