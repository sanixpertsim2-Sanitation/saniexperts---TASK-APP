import { AVATARS } from '@/lib/images';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, ClipboardList, Clock, Loader, PlusCircle, AlertTriangle, ShieldCheck, Camera, ChevronRight, TrendingUp, Activity, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Task, Report } from '@/types';

interface LeadershipDashboardProps {
  onNavigate: (page: string) => void;
  onTaskClick: (task: Task) => void;
  onReportClick: (report: Report) => void;
  onNotifications: () => void;
}

/* ===== CINEMATIC STAT CARD ===== */
function StatCard({ icon: Icon, label, value, sub, color, delay, onClick }: {
  icon: React.ElementType; label: string; value: number; sub: string; color: 'gold' | 'blue' | 'indigo' | 'emerald'; delay: number; onClick: () => void;
}) {
  const colorMap = {
    gold: { text: 'text-gold-light', glow: 'shadow-gold', border: 'border-gold-500/15', bg: 'rgba(212,175,55,0.08)' },
    blue: { text: 'text-blue-400', glow: 'shadow-blue', border: 'border-blue-500/15', bg: 'rgba(59,130,246,0.08)' },
    indigo: { text: 'text-indigo-400', glow: 'shadow-blue', border: 'border-indigo-500/15', bg: 'rgba(99,102,241,0.08)' },
    emerald: { text: 'text-emerald-400', glow: 'shadow-green', border: 'border-emerald-500/15', bg: 'rgba(16,185,129,0.08)' },
  };
  const c = colorMap[color];
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-2xl p-4 transition-all duration-300 group"
      style={{
        background: `linear-gradient(145deg, ${c.bg}, rgba(17,24,39,0.4))`,
        border: `1px solid ${c.border.replace('border-', '').replace('/15', '')}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
          <Icon size={20} className={c.text} />
        </div>
        {value > 0 && (
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'currentColor' }} />
        )}
      </div>
      <p className={`text-3xl font-extrabold ${c.text}`}>{value}</p>
      <p className="text-[11px] font-bold text-white/50 mt-0.5 uppercase tracking-wider">{label}</p>
      <p className="text-[10px] text-white/25 mt-1">{sub}</p>
    </motion.button>
  );
}

/* ===== CINEMATIC TASK CARD ===== */
function TaskCardCinematic({ task, index, onClick, getUserById, accent = 'gold' }: {
  task: Task; index: number; onClick: () => void; getUserById: (id: string) => any; accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-300 group"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(17,24,39,0.3))',
        border: '1px solid rgba(255,255,255,0.04)',
        borderLeftWidth: 3,
        borderLeftColor: accent === 'gold' ? 'rgba(212,175,55,0.5)' : accent === 'indigo' ? 'rgba(99,102,241,0.5)' : accent === 'amber' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white/90 group-hover:text-gold-light transition-colors truncate">{task.title}</p>
          <p className="text-xs text-white/30 mt-1 line-clamp-1">{task.description}</p>
          <div className="flex items-center gap-2 mt-3">
            {task.status === 'awaiting_verification' && (
              <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">VERIFY ME</span>
            )}
            {task.priority === 'urgent' && (
              <span className="text-[10px] bg-red-500/15 text-red-300 px-2 py-0.5 rounded-full font-bold border border-red-500/20">URGENT</span>
            )}
            {task.priority === 'high' && (
              <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">HIGH</span>
            )}
            <span className="text-[10px] text-white/20">{task.location?.split(' — ')[1] || task.location}</span>
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
    <div className="min-h-screen pb-20 lg:pb-6 lg:px-6 lg:pt-4">
      {/* Cinematic Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl px-5 h-16 flex items-center justify-between sticky top-0 z-40 lg:px-6 mb-6"
        style={{
          background: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(212, 175, 55, 0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">{greeting}, <span className="text-gold-gradient">{currentUser?.name.split(' ')[0]}</span></h1>
          <span className="text-[10px] bg-gold-100 text-gold-light px-2.5 py-0.5 rounded-full font-medium border border-gold-500/10">Give and Go IM2 — Supervisor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/20 hidden sm:inline">{today}</span>
          <motion.button onClick={onNotifications} className="relative p-2.5 rounded-xl transition-all hover:bg-white/5"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Bell size={18} className="text-white/40" />
            {unreadCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[9px] text-navy-900 flex items-center justify-center font-bold"
                style={{ background: 'linear-gradient(135deg, #F4D03F, #D4AF37)' }}>
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* DAMAGE ALERTS */}
      {stats.openDamage > 0 && (
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(17,24,39,0.6))',
              border: '1px solid rgba(220,38,38,0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-10" />
                    <div className="w-3 h-3 rounded-full relative" style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)' }} />
                  </div>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-red-400">Live Alerts</span>
                </div>
                <button onClick={() => onNavigate('damage')} className="text-[11px] text-white/40 hover:text-white transition-colors flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.15)' }}>
                    <AlertTriangle size={26} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-4xl font-extrabold text-white">{stats.openDamage}</p>
                    <p className="text-[11px] text-white/30">Active Damage Report{stats.openDamage > 1 ? 's' : ''}</p>
                  </div>
                </div>
                {stats.criticalDamage > 0 && (
                  <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                    <p className="text-[10px] text-red-400/70 uppercase tracking-wider">Critical</p>
                    <p className="text-2xl font-extrabold text-red-400">{stats.criticalDamage}</p>
                  </div>
                )}
              </div>
              {/* Live damage items */}
              {liveDamage.length > 0 && (
                <div className="mt-4 space-y-2">
                  {liveDamage.slice(0, 2).map((d) => (
                    <motion.button key={d.id} onClick={() => onReportClick(d)} whileHover={{ x: 4 }}
                      className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all hover:bg-white/[0.03] group"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.15)' }}>
                        {d.severity}
                      </span>
                      <span className="text-xs text-white/50 line-clamp-1 flex-1 group-hover:text-white/70 transition-colors">{d.description}</span>
                      <ChevronRight size={12} className="text-white/10 group-hover:text-white/30 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* STATS */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
            <Activity size={16} className="text-gold-500" />
            Task Command Center
          </h2>
          <button onClick={() => onNavigate('alltasks')} className="text-xs text-gold-500 font-medium flex items-center gap-0.5 hover:text-gold-light transition-colors">
            All Tasks <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Clock} label="Pending" value={stats.pending} sub="Need assignment" color="gold" delay={0} onClick={() => onNavigate('alltasks')} />
          <StatCard icon={Loader} label="In Progress" value={stats.inProgress} sub="Being worked on" color="blue" delay={0.05} onClick={() => onNavigate('alltasks')} />
          <StatCard icon={ShieldCheck} label="Awaiting Verify" value={stats.awaitingV} sub="Needs approval" color="indigo" delay={0.1} onClick={() => onNavigate('alltasks')} />
          <StatCard icon={TrendingUp} label="Completed" value={stats.verified} sub="Fully verified" color="emerald" delay={0.15} onClick={() => onNavigate('alltasks')} />
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="rounded-2xl p-5" style={{ background: 'rgba(17,24,39,0.5)', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
          <p className="text-[10px] text-white/20 uppercase font-bold mb-4 tracking-[0.15em]">Quick Actions</p>
          <div className="flex items-center gap-3">
            <motion.button onClick={() => onNavigate('createtask')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 bg-gold-gradient text-navy-900 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-button">
              <PlusCircle size={18} /> Create Task
            </motion.button>
            <motion.button onClick={() => onNavigate('capture')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Camera size={18} /> Snap & Create
            </motion.button>
            <motion.button onClick={() => onNavigate('damage')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="flex-1 h-14 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-white shadow-red"
              style={{ background: 'linear-gradient(135deg, #f87171, #dc2626)' }}>
              <AlertTriangle size={18} /> Damage
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* AWAITING VERIFICATION */}
      {awaitingVTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Needs Your Verification</h2>
            <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/15">{stats.awaitingV}</span>
          </div>
          <div className="space-y-3">
            {awaitingVTasks.map((task, i) => <TaskCardCinematic key={task.id} task={task} index={i} onClick={() => onTaskClick(task)} getUserById={getUserById} accent="indigo" />)}
          </div>
        </div>
      )}

      {/* URGENT */}
      {urgentTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">Urgent / High Priority</h2>
          </div>
          <div className="space-y-3">
            {urgentTasks.map((task, i) => <TaskCardCinematic key={task.id} task={task} index={i} onClick={() => onTaskClick(task)} getUserById={getUserById} accent="amber" />)}
          </div>
        </div>
      )}

      {/* SUMMARY BAR */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pb-4">
        <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(212,175,55,0.06)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-50 to-transparent opacity-30" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <ClipboardList size={22} className="text-gold-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/30">Total Tasks Today</p>
              <p className="text-3xl font-extrabold text-white">{stats.total}</p>
            </div>
            <div className="flex gap-6 text-center">
              <div><p className="text-xl font-bold text-gold-light">{stats.pending}</p><p className="text-[9px] text-white/20 uppercase tracking-wider">Pending</p></div>
              <div><p className="text-xl font-bold text-blue-400">{stats.inProgress}</p><p className="text-[9px] text-white/20 uppercase tracking-wider">Active</p></div>
              <div><p className="text-xl font-bold text-emerald-400">{stats.verified}</p><p className="text-[9px] text-white/20 uppercase tracking-wider">Done</p></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
