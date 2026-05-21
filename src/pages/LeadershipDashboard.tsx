import { AVATARS } from '@/lib/images';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, ClipboardList, Clock, Loader, PlusCircle, AlertTriangle, ShieldCheck, Camera, ChevronRight, TrendingUp, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { SEVERITY_CONFIG } from '@/store/damageConfig';
import type { Task, Report } from '@/types';

interface LeadershipDashboardProps {
  onNavigate: (page: string) => void;
  onTaskClick: (task: Task) => void;
  onReportClick: (report: Report) => void;
  onNotifications: () => void;
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
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-6 lg:px-4 lg:pt-2">
      <header className="bg-white px-4 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm lg:rounded-2xl lg:px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-800">{greeting}, {currentUser?.name.split(' ')[0]}</h1>
          <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">Give and Go IM2 — Supervisor</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">{today}</span>
          <button onClick={onNotifications} className="relative p-2">
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
          </button>
        </div>
      </header>

      {/* LIVE DAMAGE ALERTS */}
      {stats.openDamage > 0 && (
        <div className="px-4 mt-4 lg:px-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-lg shadow-red-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-white/90">Live Damage Alerts</span>
              </div>
              <button onClick={() => onNavigate('damage')} className="text-[11px] text-white/80 font-medium hover:text-white flex items-center gap-0.5">
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.openDamage}</p>
                  <p className="text-[11px] text-white/70">Active Damage Report{stats.openDamage > 1 ? 's' : ''}</p>
                </div>
              </div>
              {stats.criticalDamage > 0 && (
                <div className="ml-auto bg-white/20 rounded-xl px-3 py-2">
                  <p className="text-[10px] text-white/70 uppercase">Critical</p>
                  <p className="text-xl font-bold">{stats.criticalDamage}</p>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-2">
              {liveDamage.slice(0, 2).map((d) => {
                const sev = SEVERITY_CONFIG[d.severity || 'medium'];
                return (
                  <button key={d.id} onClick={() => onReportClick(d)} className="w-full text-left bg-white/10 rounded-xl p-2.5 flex items-center gap-2 hover:bg-white/20 transition-colors">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${sev.bg} ${sev.text}`}>{d.severity?.toUpperCase()}</span>
                    <span className="text-xs text-white/90 line-clamp-1 flex-1">{d.description}</span>
                    <ChevronRight size={12} className="text-white/60" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* TASK COMMAND CENTER */}
      <div className="px-4 mt-4 lg:px-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            Task Command Center
          </h2>
          <button onClick={() => onNavigate('alltasks')} className="text-xs text-primary font-medium flex items-center gap-0.5">
            All Tasks <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => onNavigate('alltasks')} className="bg-white rounded-2xl p-4 shadow-card border-2 border-amber-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              {stats.pending > 0 && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5 uppercase tracking-wide">Pending</p>
            <p className="text-[10px] text-slate-400 mt-1">Need assignment</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            onClick={() => onNavigate('alltasks')} className="bg-white rounded-2xl p-4 shadow-card border-2 border-blue-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Loader size={20} className="text-blue-600" />
              </div>
              {stats.inProgress > 0 && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-3xl font-bold text-blue-700">{stats.inProgress}</p>
            <p className="text-[11px] font-semibold text-blue-600 mt-0.5 uppercase tracking-wide">In Progress</p>
            <p className="text-[10px] text-slate-400 mt-1">Being worked on</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onClick={() => onNavigate('alltasks')} className="bg-white rounded-2xl p-4 shadow-card border-2 border-indigo-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-indigo-600" />
              </div>
              {stats.awaitingV > 0 && <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />}
            </div>
            <p className="text-3xl font-bold text-indigo-700">{stats.awaitingV}</p>
            <p className="text-[11px] font-semibold text-indigo-600 mt-0.5 uppercase tracking-wide">Awaiting Verify</p>
            <p className="text-[10px] text-slate-400 mt-1">Needs your approval</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            onClick={() => onNavigate('alltasks')} className="bg-white rounded-2xl p-4 shadow-card border-2 border-emerald-200 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{stats.verified}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 uppercase tracking-wide">Completed</p>
            <p className="text-[10px] text-slate-400 mt-1">Fully verified</p>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 lg:px-0">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <p className="text-[10px] text-slate-400 uppercase font-semibold mb-3 tracking-wider">Quick Actions</p>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('createtask')} className="flex-1 h-12 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-button active:scale-[0.97] transition-transform">
              <PlusCircle size={16} /> Create Task
            </button>
            <button onClick={() => onNavigate('capture')} className="flex-1 h-12 bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
              <Camera size={16} /> Snap & Create
            </button>
            <button onClick={() => onNavigate('damage')} className="flex-1 h-12 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
              <AlertTriangle size={16} /> Damage
            </button>
          </div>
        </div>
      </div>

      {/* Awaiting Verification */}
      {awaitingVTasks.length > 0 && (
        <div className="px-4 mt-4 lg:px-0">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">Needs Your Verification</h2>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{stats.awaitingV}</span>
          </div>
          <div className="space-y-2.5">
            {awaitingVTasks.map((task, i) => (
              <motion.div key={task.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => onTaskClick(task)}
                className="bg-white rounded-xl p-3.5 shadow-card cursor-pointer active:scale-[0.98] transition-transform border-l-[3px] border-l-indigo-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full font-bold">VERIFY ME</span>
                      <span className="text-[10px] text-slate-400">{task.completionNotes}</span>
                    </div>
                  </div>
                  {task.assignedTo && <img src={getUserById(task.assignedTo)?.avatar || AVATARS.employee1} alt="" className="w-7 h-7 rounded-full object-cover ml-2 flex-shrink-0" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* URGENT TASKS */}
      {urgentTasks.length > 0 && (
        <div className="px-4 mt-4 lg:px-0">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm font-bold text-slate-800">Urgent / High Priority</h2>
          </div>
          <div className="space-y-2.5">
            {urgentTasks.map((task, i) => (
              <motion.div key={task.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => onTaskClick(task)}
                className="bg-white rounded-xl p-3.5 shadow-card cursor-pointer active:scale-[0.98] transition-transform border-l-[3px] border-l-red-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded-full font-bold">{task.priority.toUpperCase()}</span>
                      <span className="text-[10px] text-slate-400">{task.location.split(' — ')[1] || task.location}</span>
                    </div>
                  </div>
                  {task.assignedTo && <img src={getUserById(task.assignedTo)?.avatar || AVATARS.employee1} alt="" className="w-7 h-7 rounded-full object-cover ml-2 flex-shrink-0" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Total Summary Bar */}
      <div className="px-4 mt-4 lg:px-0 pb-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ClipboardList size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/60">Total Tasks Today</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-amber-400">{stats.pending}</p>
                <p className="text-[9px] text-white/50 uppercase">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-400">{stats.inProgress}</p>
                <p className="text-[9px] text-white/50 uppercase">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-400">{stats.verified}</p>
                <p className="text-[9px] text-white/50 uppercase">Done</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
