import { ArrowLeft, AlertTriangle, MapPin, Clock, User, Wrench, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DAMAGE_STATUS_LABELS, DAMAGE_STATUS_COLORS, SEVERITY_CONFIG, getNextStatus } from '@/store/damageConfig';
import type { Report } from '@/types';

interface DamageDetailProps {
  report: Report;
  onBack: () => void;
}

export function DamageDetail({ report, onBack }: DamageDetailProps) {
  const { currentUser, getUserById, advanceDamageStatus, updateReport } = useStore();
  const isLeader = currentUser?.role === 'leadership';
  const isReporter = currentUser?.id === report.reportedBy;
  const reporter = getUserById(report.reportedBy);
  const nextStatus = getNextStatus(report.status);
  const isClosed = report.status === 'closed' || report.status === 'resolved';

  const statusConfig = DAMAGE_STATUS_COLORS[report.status] || DAMAGE_STATUS_COLORS.reported;
  const severityConfig = SEVERITY_CONFIG[report.severity || 'medium'];

  const handleAdvanceStatus = () => {
    if (nextStatus) advanceDamageStatus(report.id);
  };

  const handleClose = () => {
    updateReport(report.id, { status: 'closed', resolvedAt: new Date().toISOString() });
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  const flow = ['reported', 'maintenance_assigned', 'in_repair', 'fixed', 'closed'];
  const flowLabels = ['Damage Reported', 'Maintenance Assigned', 'In Repair', 'Fixed', 'Closed'];
  const flowIcons = [AlertTriangle, Wrench, Clock, CheckCircle, ShieldCheck];
  const currentIdx = flow.indexOf(report.status);

  const actionLabels: Record<string, string> = {
    reported: 'Assign Maintenance',
    maintenance_assigned: 'Mark In Repair',
    in_repair: 'Mark as Fixed',
    fixed: 'Close & Archive',
  };

  const actionColors: Record<string, string> = {
    reported: 'bg-blue-500 shadow-blue-200',
    maintenance_assigned: 'bg-amber-500 shadow-amber-200',
    in_repair: 'bg-emerald-500 shadow-emerald-200',
    fixed: 'bg-slate-600 shadow-slate-200',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={22} className="text-slate-700" /></button>
        <h1 className="text-base font-semibold text-slate-800">Damage Report</h1>
        <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
          {DAMAGE_STATUS_LABELS[report.status] || report.status.toUpperCase()}
        </span>
      </header>

      {/* Severity Alert */}
      <div className="px-4 mt-4">
        <div className={`rounded-2xl p-4 ${severityConfig.bg} flex items-center gap-3`}>
          <AlertTriangle size={24} className={severityConfig.text} />
          <div>
            <p className={`text-sm font-bold ${severityConfig.text}`}>{report.severity?.toUpperCase()} SEVERITY</p>
            <p className="text-xs text-slate-600 mt-0.5">This damage is being tracked by the supervisor</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{report.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">{report.location}</span></div>
          <div className="flex items-center gap-3 text-sm"><Clock size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Reported: {formatTime(report.createdAt)}</span></div>
          {reporter && <div className="flex items-center gap-3 text-sm"><User size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Reported by: {reporter.name}</span></div>}
          {report.resolvedAt && <div className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-emerald-400 flex-shrink-0" /><span className="text-slate-600">Closed: {formatTime(report.resolvedAt)}</span></div>}
        </div>
      </div>

      {/* Photos */}
      {report.photos.length > 0 && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Damage Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {report.photos.map((photo, i) => (
                <img key={i} src={photo} alt="" className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Status History</h3>
          <div className="space-y-0">
            {flow.map((s, i) => {
              const Icon = flowIcons[i];
              const isReached = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={s} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isReached ? 'bg-primary' : 'bg-slate-100'} ${isCurrent ? 'ring-2 ring-primary/30' : ''}`}>
                      <Icon size={14} className={isReached ? 'text-white' : 'text-slate-400'} />
                    </div>
                    {i < flow.length - 1 && <div className={`w-0.5 h-8 ${i < currentIdx ? 'bg-primary' : 'bg-slate-200'}`} />}
                  </div>
                  <div className="pt-1 pb-4">
                    <p className={`text-sm font-medium ${isReached ? 'text-slate-800' : 'text-slate-400'}`}>{flowLabels[i]}</p>
                    {isCurrent && <p className="text-[10px] text-primary font-medium">Current status</p>}
                    {isReached && !isCurrent && <p className="text-[10px] text-slate-400">Completed</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isClosed && (isLeader || isReporter) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30 space-y-2">
          {nextStatus && (
            <button onClick={handleAdvanceStatus}
              className={`w-full h-12 ${actionColors[report.status] || 'bg-primary'} text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-[0.97] transition-transform`}>
              <ChevronRight size={18} /> {actionLabels[report.status] || 'Update Status'}
            </button>
          )}
          {report.status === 'fixed' && (
            <button onClick={handleClose}
              className="w-full h-12 bg-slate-100 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
              <ShieldCheck size={18} /> Close & Archive
            </button>
          )}
          {report.status === 'in_repair' && (
            <button onClick={() => updateReport(report.id, { status: 'fixed', updatedAt: new Date().toISOString() })}
              className="w-full h-12 bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.97] transition-transform">
              <CheckCircle size={18} /> Mark as Fixed
            </button>
          )}
        </div>
      )}

      {isClosed && (
        <div className="fixed bottom-0 left-0 right-0 bg-emerald-50 border-t border-emerald-200 p-4 z-30">
          <div className="flex items-center justify-center gap-2 text-emerald-700">
            <ShieldCheck size={18} /> <span className="text-sm font-semibold">Damage Resolved & Closed</span>
          </div>
        </div>
      )}
    </div>
  );
}
