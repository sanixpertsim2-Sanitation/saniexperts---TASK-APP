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
  urgent: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-400/20', icon: AlertTriangle, label: 'URGENT' },
  high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-400/20', icon: ArrowUp, label: 'HIGH' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-400/20', icon: Minus, label: 'MEDIUM' },
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-400/20', icon: ArrowDown, label: 'LOW' },
};

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending: { bg: 'bg-white/5', text: 'text-white/50', border: 'border-white/5', label: 'PENDING' },
  assigned: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', label: 'ASSIGNED' },
  in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-400/20', label: 'IN PROGRESS' },
  completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-400/20', label: 'AWAITING V' },
  awaiting_verification: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-400/20', label: 'AWAITING V' },
  verified: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-400/20', label: 'VERIFIED' },
  overdue: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-400/20', label: 'OVERDUE' },
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

  const borderLeft = isOverdue ? 'border-l-[3px] border-l-red-400' : isAwaitingV ? 'border-l-[3px] border-l-indigo-400' : isVerified ? 'border-l-[3px] border-l-emerald-400' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:border-white/10 ${borderLeft} ${isCompleted ? 'opacity-80' : ''}`}
    >
      {isVerified && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-success rounded-full flex items-center justify-center shadow-glow-success">
          <ShieldCheck size={14} className="text-white" />
        </div>
      )}
      <div className="flex items-start justify-between mb-2.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${priority.bg} ${priority.text} border ${priority.border}`}>
          <PriorityIcon size={10} />{priority.label}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${status.bg} ${status.text} border ${status.border}`}>
          {status.label}
        </span>
      </div>
      <h3 className={`font-bold text-[15px] text-white/90 mb-1.5 line-clamp-2 leading-snug ${isVerified ? 'line-through text-white/40' : ''}`}>
        {task.title}
      </h3>
      {!compact && <p className="text-xs text-white/40 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] text-white/40 glass-light px-2 py-0.5 rounded-full">
            <MapPin size={10} />{task.location?.split(' — ')[1] || task.location}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-white/30">
            <Clock size={10} />{formatTime(task.dueBy)}
          </span>
        </div>
        {assignee && (
          <div className="flex items-center gap-1.5">
            <img src={assignee.avatar || AVATARS.employee1} alt={assignee.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" />
            <span className="text-[11px] text-white/40">{assignee.name.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
