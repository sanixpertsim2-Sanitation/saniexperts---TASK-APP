import { AVATARS } from '@/lib/images';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, ClipboardList, Clock, Loader, PlusCircle, AlertTriangle, ShieldCheck, Camera, ChevronRight, TrendingUp, Activity, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { SEVERITY_CONFIG } from '@/store/damageConfig';
import type { Task, Report } from '@/types';

interface LeadershipDashboardProps {
  onNavigate: (page: string) => void;
  onTaskClick: (task: Task) => void;
  onReportClick: (report: Report) => void;
  onNotifications: () => void;
}

// Premium Stat Card
function StatCard({ icon: Icon, label, value, sub, color, delay, onClick, pulse }: {
  icon: React.ElementType; label: string; value: number; sub: string; color: string; delay: number; onClick: () => void; pulse?: boolean;
}) {
  const colorMap: Record<string, { bg: string; text: string; glow: string; gradient: string }> = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', gradient: 'from-amber-500/20 to-amber-500/5' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', gradient: 'from-blue-500/20 to-blue-500/5' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', gradient: 'from-indigo-500/20 to-indigo-500/5' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 text-left w-full ${c.glow} hover:border-white/10 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={c.text} />
        </div>
        {pulse && value > 0 && (
          <motion.span
            className={`w-2.5 h-2.5 rounded-full ${c.bg.replace('/10', '')}`}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <p className={`text-3xl font-extrabold ${c.text}`}>{value}</p>
      <p className="text-[11px] font-bold text-white/60 mt-0.5 uppercase tracking-wider">{label}</p>
      <p className="text-[10px] text-white/30 mt-1">{sub}</p>
    </motion.button>
  );
}

// Task Card Premium
function TaskCardPremium({ task, index, onClick, getUserById, borderColor = 'border-l-primary' }: {
  task: Task; index: number; onClick: () => void; getUserById: (id: string) => any; borderColor?: string;
}) {
  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 border-l-[3px] ${borderColor} group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{task.title}</p>
          <p className="text-xs text-white/40 mt-1 line-clamp-1">{task.description}</p>
          <div className="flex items-center gap-2 mt-3">
            {task.status === 'awaiting_verification' && (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">VERIFY ME</span>
            )}
            {task.priority === 'urgent' && (
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold border border-red-500/20">URGENT</span>
            )}
            {task.priority === 'high' && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">HIGH</span>
            )}
            <span className="text-[10px] text-white/30">{task.location?.split(' — ')[1] || task.location}</span>
          </div>
        </div>
        {task.assignedTo && (
          <img src={getUserById(task.assignedTo)?.avatar || AVATARS.employee1} alt="" className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0 ring-2 ring-white/5" />
        )}
      </div>
    </motion.div>
  );
}

export function LeadershipDashboard({ onNavigate, onTaskClick, onReportClick, onNotifications }: LeadershipDashboardProps) {
  const { tasks, reports, notifications, currentUser, getUserById } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const damageReports = reports.filter((r) => r.type === 'damage');

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending' || t.status === 'assigned').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    awaitingV: tasks.filter((t) => t.status === 'awaiting_verification').length,
    verified: tasks.filter((t) => t.status === 'verified').length,
    criticalDamage: damageReports.filter((r) => r.severity === 'critical' && r.status !== 'closed').length,
    openDamage: damageReports.filter((r) => r.status !== 'closed' && r.status !== 'resolved').length,
  }), [tasks, damageReports]);

  const urgentTasks = tasks.filter((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'verified' && t.status !== 'awaiting_verification').slice(0, 3);
  const awaitingVTasks = tasks.filter((t) => t.status === 'awaiting_verification').slice(0, 3);
  const liveDamage = damageReports.filter((r) => r.status !== 'closed' && r.status !== 'resolved').slice(0, 4);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-transparent pb-20 lg:pb-6 lg:px-6 lg:pt-4">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl px-5 h-16 flex items-center justify-between sticky top-0 z-40 lg:px-6 mb-6"
      >
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">{greeting}, <span className="text-gradient-primary">{currentUser?.name.split(' ')[0]}</span></h1>
          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-medium">Give and Go IM2 — Supervisor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30 hidden sm:inline">{today}</span>
          <motion.button onClick={onNotifications} className="relative p-2.5 rounded-xl glass-light hover:bg-white/5 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Bell size={18} className="text-white/60" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-glow-danger"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* LIVE DAMAGE ALERTS - Premium */}
      {stats.openDamage > 0 && (
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 relative overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-glow-danger relative" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-red-400">Live Damage Alerts</span>
                </div>
                <button onClick={() => onNavigate('damage')} className="text-[11px] text-white/50 font-medium hover:text-white flex items-center gap-0.5 transition-colors">
                  View All <ChevronRight size={12} />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center">
                    <AlertTriangle size={26} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold text-white">{stats.openDamage}</p>
                    <p className="text-[11px] text-white/40">Active Damage Report{stats.openDamage > 1 ? 's' : ''}</p>
                  </div>
                </div>
                {stats.criticalDamage > 0 && (
                  <div className="glass rounded-xl px-4 py-3 border border-red-500/20">
                    <p className="text-[10px] text-red-400/70 uppercase tracking-wider">Critical</p>
                    <p className="text-2xl font-extrabold text-red-400">{stats.criticalDamage}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                {liveDamage.slice(0, 2).map((d) => {
                  const sev = SEVERITY_CONFIG[d.severity || 'medium'];
                  return (
                    <motion.button
                      key={d.id}
                      onClick={() => onReportClick(d)}
                      whileHover={{ x: 4 }}
                      className="w-full text-left glass-light rounded-xl p-3 flex items-center gap-3 hover:bg-white/[0.05] transition-all group"
                    >
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text} border border-current/20`}>{d.severity?.toUpperCase()}</span>
                      <span className="text-xs text-white/70 line-clamp-1 flex-1 group-hover:text-white transition-colors">{d.description}</span>
                      <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* TASK COMMAND CENTER - Premium */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
            <Activity size={16} className="text-primary" />
            Task Command Center
          </h2>
          <button onClick={() => onNavigate('alltasks')} className="text-xs text-primary font-medium flex items-center gap-0.5 hover:text-primary/70 transition-colors">
            All Tasks <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Pending" value={stats.pending} sub="Need assignment" color="amber" delay={0} onClick={() => onNavigate('alltasks')} pulse />
          <StatCard icon={Loader} label="In Progress" value={stats.inProgress} sub="Being worked on" color="blue" delay={0.05} onClick={() => onNavigate('alltasks')} pulse />
          <StatCard icon={ShieldCheck} label="Awaiting Verify" value={stats.awaitingV} sub="Needs your approval" color="indigo" delay={0.1} onClick={() => onNavigate('alltasks')} pulse />
          <StatCard icon={TrendingUp} label="Completed" value={stats.verified} sub="Fully verified" color="emerald" delay={0.15} onClick={() => onNavigate('alltasks')} />
        </div>
      </div>

      {/* Quick Actions - Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] text-white/30 uppercase font-bold mb-4 tracking-[0.15em]">Quick Actions</p>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => onNavigate('createtask')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 bg-gradient-primary text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-button active:shadow-none transition-shadow"
            >
              <PlusCircle size={18} /> Create Task
            </motion.button>
            <motion.button
              onClick={() => onNavigate('capture')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 glass-light text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/[0.07] transition-all border border-white/[0.08]"
            >
              <Camera size={18} /> Snap & Create
            </motion.button>
            <motion.button
              onClick={() => onNavigate('damage')}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 bg-gradient-danger text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-glow-danger active:shadow-none transition-shadow"
            >
              <AlertTriangle size={18} /> Damage
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Awaiting Verification */}
      {awaitingVTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Needs Your Verification</h2>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">{stats.awaitingV}</span>
          </div>
          <div className="space-y-3">
            {awaitingVTasks.map((task, i) => (
              <TaskCardPremium key={task.id} task={task} index={i} onClick={() => onTaskClick(task)} getUserById={getUserById} borderColor="border-l-indigo-500" />
            ))}
          </div>
        </div>
      )}

      {/* URGENT TASKS */}
      {urgentTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Urgent / High Priority</h2>
          </div>
          <div className="space-y-3">
            {urgentTasks.map((task, i) => (
              <TaskCardPremium key={task.id} task={task} index={i} onClick={() => onTaskClick(task)} getUserById={getUserById} borderColor="border-l-amber-500" />
            ))}
          </div>
        </div>
      )}

      {/* Total Summary Bar - Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pb-4"
      >
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <ClipboardList size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/40">Total Tasks Today</p>
              <p className="text-3xl font-extrabold text-white">{stats.total}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-amber-400">{stats.pending}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wider">Pending</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-400">{stats.inProgress}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wider">Active</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">{stats.verified}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-wider">Done</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
