import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, ClipboardX, Sun, Calendar, Clock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TaskCard } from '@/components/TaskCard';
import type { Task } from '@/types';

interface EmployeeTasksProps {
  onTaskClick: (task: Task) => void;
  onNotifications: () => void;
}

const filterTabs = [{ id: 'all', label: 'All' }, { id: 'assigned', label: 'Assigned' }, { id: 'in_progress', label: 'In Progress' }, { id: 'completed', label: 'Completed' }];

export function EmployeeTasks({ onTaskClick, onNotifications }: EmployeeTasksProps) {
  const { currentUser, getTasksByAssignee, notifications } = useStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const tasks = getTasksByAssignee(currentUser?.id || '');
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isSunday = new Date().getDay() === 0;

  const filteredTasks = useMemo(() => activeFilter === 'all' ? tasks : tasks.filter((t) => t.status === activeFilter), [tasks, activeFilter]);
  const stats = useMemo(() => ({
    assigned: tasks.filter((t) => t.status === 'assigned').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pb-20 lg:pb-6">
      {/* Premium Header */}
      <header className="glass px-5 h-16 flex items-center justify-between sticky top-0 z-40 lg:rounded-2xl lg:mx-4 lg:mt-4 mb-4 border border-white/[0.06]">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">My Tasks</h1>
          <p className="text-[10px] text-white/30 -mt-0.5">Give and Go IM2</p>
        </div>
        <motion.button onClick={onNotifications} className="relative p-2.5 rounded-xl glass-light hover:bg-white/5 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Bell size={20} className="text-white/60" />
          {unreadCount > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-danger rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-glow-danger">{unreadCount}</motion.span>
          )}
        </motion.button>
      </header>

      {/* Date/Shift Bar */}
      <div className="px-5 py-3 flex items-center gap-3 mb-4">
        <div className="glass-light rounded-xl px-3 py-2 flex items-center gap-2">
          <Calendar size={13} className="text-primary" />
          <span className="text-xs font-medium text-white/60">{today}</span>
        </div>
        <div className="glass-light rounded-xl px-3 py-2 flex items-center gap-2">
          <Clock size={13} className="text-primary" />
          <span className="text-xs font-medium text-white/60">Morning Shift (7AM - 3PM)</span>
        </div>
      </div>

      {isSunday && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mb-4 glass rounded-xl p-4 border-l-4 border-l-amber-400 border border-white/[0.06]">
          <div className="flex items-start gap-3">
            <Sun size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Sunday Deep Clean — 12-Hour Shift</p>
              <p className="text-xs text-white/40 mt-1">Major cleaning schedule today. All production lines will be thoroughly sanitized.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="px-4 mb-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {[
            { label: 'Assigned', value: stats.assigned, color: 'text-primary', border: 'border-primary/20' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-amber-400', border: 'border-amber-400/20' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-400', border: 'border-emerald-400/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-xl p-4 min-w-[100px] flex-1 text-center snap-start border ${stat.border}`}
            >
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-semibold text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex glass rounded-xl p-1">
          {filterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 ${activeFilter === tab.id ? 'bg-primary text-white shadow-button' : 'text-white/40 hover:text-white/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="px-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredTasks.length > 0 ? filteredTasks.map((task, i) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} index={i} />
        )) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 lg:col-span-2">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-4">
              <ClipboardX size={28} className="text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/40">No tasks assigned yet</p>
            <p className="text-xs text-white/20 mt-1">Your assigned tasks will appear here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
