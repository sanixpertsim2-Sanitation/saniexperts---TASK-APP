import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, CheckCircle, Search, AlertTriangle, Bell } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface NotificationsScreenProps {
  onBack: () => void;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  task_assigned: { icon: ClipboardList, color: 'text-primary', bg: 'bg-primary-light' },
  task_completed: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  finding: { icon: Search, color: 'text-blue-600', bg: 'bg-blue-50' },
  damage: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  system: { icon: Bell, color: 'text-slate-600', bg: 'bg-slate-100' },
};

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { notifications, markNotificationRead } = useStore();

  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-800">Notifications</h1>
        <span className="ml-auto text-xs text-slate-400">{notifications.filter((n) => !n.read).length} unread</span>
      </header>

      <div className="px-4 mt-3 space-y-2">
        {sorted.map((notif, i) => {
          const config = typeConfig[notif.type] || typeConfig.system;
          const Icon = config.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => markNotificationRead(notif.id)}
              className={`bg-white rounded-xl p-3.5 shadow-card flex items-start gap-3 cursor-pointer ${
                !notif.read ? 'border-l-[3px] border-l-primary' : ''
              }`}
            >
              <div className={`w-9 h-9 ${config.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(notif.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
