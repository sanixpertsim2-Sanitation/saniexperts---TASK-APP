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
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-6">
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-40 shadow-sm lg:rounded-b-2xl lg:mx-4 lg:mt-2 lg:w-auto">
        <div>
          <h1 className="text-lg font-bold text-slate-800">My Tasks</h1>
          <p className="text-[10px] text-slate-400 -mt-0.5">Give and Go IM2</p>
        </div>
        <button onClick={onNotifications} className="relative p-2">
          <Bell size={22} className="text-slate-600" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">{unreadCount}</span>}
        </button>
      </header>

      <div className="bg-primary-light px-4 py-2.5 flex items-center gap-2">
        <Calendar size={14} className="text-primary flex-shrink-0" />
        <span className="text-xs font-medium text-primary">{today}</span>
        <span className="text-primary/40 mx-1">|</span>
        <Clock size={14} className="text-primary flex-shrink-0" />
        <span className="text-xs font-medium text-primary">Morning Shift (7AM - 3PM)</span>
      </div>

      {isSunday && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-4 mt-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4">
          <div className="flex items-start gap-2">
            <Sun size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Sunday Deep Clean — 12-Hour Shift</p>
              <p className="text-xs text-amber-700 mt-0.5">Major cleaning schedule today. All production lines will be thoroughly sanitized.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-4 mt-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {[{ label: 'Assigned', value: stats.assigned, color: 'text-primary', bg: 'bg-primary-light' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50' }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`${stat.bg} rounded-xl p-3 min-w-[100px] flex-1 text-center snap-start`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex border-b border-slate-200">
          {filterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`flex-1 pb-2.5 text-xs font-medium transition-colors relative ${activeFilter === tab.id ? 'text-primary' : 'text-slate-400'}`}>
              {tab.label}
              {activeFilter === tab.id && <motion.div layoutId="taskFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredTasks.length > 0 ? filteredTasks.map((task, i) => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} index={i} />) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 lg:col-span-2">
            <ClipboardX size={48} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No tasks assigned yet</p>
            <p className="text-xs text-slate-400 mt-1">Your assigned tasks will appear here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
