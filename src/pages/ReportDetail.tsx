
import { ArrowLeft, AlertTriangle, Search, MapPin, Clock, User, Wrench, CheckCircle, ClipboardList } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Report } from '@/types';

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  const { getUserById, updateReport } = useStore();
  const reporter = getUserById(report.reportedBy);

  const severityConfig: Record<string, { bg: string; text: string }> = {
    critical: { bg: 'bg-red-100', text: 'text-red-700' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700' },
    low: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  };

  const handleAssignMaintenance = () => {
    updateReport(report.id, { status: 'maintenance_assigned' });
  };

  const handleResolve = () => {
    updateReport(report.id, { status: 'resolved', resolvedAt: new Date().toISOString() });
  };

  const handleCreateTask = () => {
    updateReport(report.id, { status: 'task_created' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-800">
          {report.type === 'damage' ? 'Damage Report' : 'Finding Detail'}
        </h1>
      </header>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            {report.type === 'damage' ? (
              <AlertTriangle size={18} className="text-red-500" />
            ) : (
              <Search size={18} className="text-blue-500" />
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              report.type === 'damage'
                ? (severityConfig[report.severity || 'medium']?.bg + ' ' + severityConfig[report.severity || 'medium']?.text)
                : 'bg-blue-100 text-blue-700'
            }`}>
              {report.type === 'damage' ? report.severity?.toUpperCase() : report.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-base text-slate-800 leading-relaxed">{report.description}</p>
        </div>
      </div>

      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-slate-400 flex-shrink-0" />
            <span className="text-slate-600">{report.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-slate-400 flex-shrink-0" />
            <span className="text-slate-600">
              Reported: {new Date(report.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          {reporter && (
            <div className="flex items-center gap-3 text-sm">
              <User size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-600">Reported by: {reporter.name}</span>
            </div>
          )}
          {report.resolvedAt && (
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-slate-600">
                Resolved: {new Date(report.resolvedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {report.photos.length > 0 && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {report.photos.map((photo, i) => (
                <img key={i} src={photo} alt="" className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </div>
      )}

      {report.status !== 'resolved' && (
        <div className="px-4 mt-4 space-y-2">
          {report.type === 'damage' && report.status === 'reported' && (
            <button
              onClick={handleAssignMaintenance}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-button active:scale-[0.97] transition-transform"
            >
              <Wrench size={18} />
              Assign to Maintenance
            </button>
          )}
          {report.type === 'finding' && report.status === 'new' && (
            <button
              onClick={handleCreateTask}
              className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-button active:scale-[0.97] transition-transform"
            >
              <ClipboardList size={18} />
              Create Task from Finding
            </button>
          )}
          <button
            onClick={handleResolve}
            className="w-full h-12 border border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <CheckCircle size={18} />
            Mark as Resolved
          </button>
        </div>
      )}
    </div>
  );
}
