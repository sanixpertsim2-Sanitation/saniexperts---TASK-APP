import { AVATARS } from '@/lib/images';

import { motion } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, ArrowUp, ArrowDown, Minus, ShieldCheck } from 'lucide-react';
import type { Task, User } from '@/types';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onClick: () => void;
  index?: number;
  compact?: boolean;
}

const priorityConfig = {
  urgent: { bg: 'bg-amber-50', text: 'text-amber-800', icon: AlertTriangle, label: 'URGENT' },
  high: { bg: 'bg-red-50', text: 'text-red-800', icon: ArrowUp, label: 'HIGH' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: Minus, label: 'MEDIUM' },
  low: { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: ArrowDown, label: 'LOW' },
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'PENDING' },
  assigned: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'ASSIGNED' },
  in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'IN PROGRESS' },
  completed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'AWAITING V' },
  awaiting_verification: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'AWAITING V' },
  verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'VERIFIED' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', label: 'OVERDUE' },
};

export function TaskCard({ task, assignee, onClick, index = 0, compact = false }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status] || statusConfig.pending;
  const PriorityIcon = priority.icon;
  const isVerified = task.status === 'verified';
  const isAwaitingV = task.status === 'awaiting_verification';
  const isCompleted = task.status === 'completed' || isVerified;
  const isOverdue = task.status === 'overdue';
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-card cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden ${
        isOverdue ? 'border-l-[3px] border-l-red-500' : ''
      } ${isAwaitingV ? 'border-l-[3px] border-l-blue-400' : ''} ${isVerified ? 'border-l-[3px] border-l-emerald-500' : ''} ${
        isCompleted ? 'opacity-85' : ''
      }`}
    >
      {/* Verification badge overlay */}
      {isVerified && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <ShieldCheck size={14} className="text-white" />
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${priority.bg} ${priority.text}`}>
          <PriorityIcon size={10} />{priority.label}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>
      <h3 className={`font-semibold text-[15px] text-slate-800 mb-1 line-clamp-2 ${isVerified ? 'line-through text-slate-500' : ''}`}>
        {task.title}
      </h3>
      {!compact && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
            <MapPin size={10} />{task.location.split(' — ')[1] || task.location}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
            <Clock size={10} />{formatTime(task.dueBy)}
          </span>
        </div>
        {assignee && (
          <div className="flex items-center gap-1.5">
            <img src={assignee.avatar || AVATARS.employee1} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-[11px] text-slate-500">{assignee.name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
