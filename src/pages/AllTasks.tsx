import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ClipboardX, Filter, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TaskCard } from '@/components/TaskCard';
import type { Task } from '@/types';

interface AllTasksProps {
  onTaskClick: (task: Task) => void;
  onCreateTask: () => void;
}

const statusFilters = ['all', 'pending', 'assigned', 'in_progress', 'awaiting_verification', 'verified', 'overdue'];
const shiftFilters = ['all', 'morning', 'afternoon', 'night'];

export function AllTasks({ onTaskClick, onCreateTask }: AllTasksProps) {
  const { tasks, getUserById } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (search) { const q = search.toLowerCase(); result = result.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)); }
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter);
    if (shiftFilter !== 'all') result = result.filter((t) => t.shift === shiftFilter);
    return result;
  }, [tasks, search, statusFilter, shiftFilter]);

  const awaitingCount = tasks.filter((t) => t.status === 'awaiting_verification').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white px-4 h-16 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full h-10 bg-slate-100 rounded-xl pl-9 pr-4 text-sm outline-none focus:bg-slate-50 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}><Filter size={18} /></button>
      </header>

      {/* Awaiting Verification Banner */}
      {awaitingCount > 0 && (
        <div className="px-4 mt-3">
          <button onClick={() => setStatusFilter('awaiting_verification')} className="w-full bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
            <ShieldCheck size={18} className="text-indigo-600" />
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-indigo-800">{awaitingCount} task{awaitingCount > 1 ? 's' : ''} awaiting verification</p>
              <p className="text-[11px] text-indigo-600">Tap to review and verify</p>
            </div>
          </button>
        </div>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border-b border-slate-200 overflow-hidden">
            <div className="px-4 py-3 space-y-3">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1.5">Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {statusFilters.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${statusFilter === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {s === 'all' ? 'All' : s === 'awaiting_verification' ? 'Awaiting V' : s === 'in_progress' ? 'In Progress' : s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1.5">Shift</p>
                <div className="flex flex-wrap gap-1.5">
                  {shiftFilters.map((s) => (
                    <button key={s} onClick={() => setShiftFilter(s)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${shiftFilter === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 mt-3">
        <p className="text-xs text-slate-500">Showing {filteredTasks.length} tasks</p>
      </div>

      <div className="px-4 mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {filteredTasks.length > 0 ? filteredTasks.map((task, i) => (
          <TaskCard key={task.id} task={task} assignee={task.assignedTo ? getUserById(task.assignedTo) : undefined} onClick={() => onTaskClick(task)} index={i} />
        )) : (
          <div className="flex flex-col items-center justify-center py-16 lg:col-span-2">
            <ClipboardX size={48} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No tasks found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
        onClick={onCreateTask} className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center z-40 active:scale-90 transition-transform">
        <Plus size={24} />
      </motion.button>
    </div>
  );
}
