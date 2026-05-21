import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, User, Calendar, Camera, X, CheckCircle, Play, ShieldCheck, AlertCircle, ImagePlus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Task } from '@/types';

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
}

export function TaskDetail({ task, onBack }: TaskDetailProps) {
  const { currentUser, updateTask, completeTask, verifyTask, getUserById } = useStore();
  const [photos, setPhotos] = useState<string[]>(task.photos || []);
  const [notes, setNotes] = useState(task.completionNotes || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEmployee = currentUser?.role === 'employee';
  const isLeader = currentUser?.role === 'leadership';
  const assignee = task.assignedTo ? getUserById(task.assignedTo) : null;
  const createdBy = getUserById(task.createdBy);
  const verifier = task.verifiedBy ? getUserById(task.verifiedBy) : null;

  const isPending = task.status === 'pending' || task.status === 'assigned';
  const isInProgress = task.status === 'in_progress';
  const isAwaitingV = task.status === 'awaiting_verification';
  const isVerified = task.status === 'verified';
  const canVerify = isAwaitingV && (isLeader || currentUser?.id === task.assignedTo);
  const needsPhoto = photos.length === 0;

  const handleAddPhoto = (source: 'camera' | 'gallery') => {
    const input = fileInputRef.current;
    if (!input) return;
    input.setAttribute('capture', source === 'camera' ? 'environment' : '');
    input.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleStartTask = () => updateTask(task.id, { status: 'in_progress' });

  const handleComplete = () => {
    if (photos.length === 0) return;
    completeTask(task.id, photos, notes);
  };

  const handleVerify = () => {
    verifyTask(task.id, currentUser?.id || '');
  };

  const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const priorityColors: Record<string, string> = {
    urgent: 'bg-amber-100 text-amber-800', high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', low: 'bg-emerald-100 text-emerald-800',
  };

  const statusDisplay: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'PENDING' },
    assigned: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'ASSIGNED' },
    in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'IN PROGRESS' },
    awaiting_verification: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'AWAITING VERIFICATION' },
    verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'VERIFIED' },
    overdue: { bg: 'bg-red-50', text: 'text-red-700', label: 'OVERDUE' },
  };

  const s = statusDisplay[task.status] || statusDisplay.pending;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={22} className="text-slate-700" /></button>
        <h1 className="text-base font-semibold text-slate-800">Task Details</h1>
      </header>

      {/* Priority & Status */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority.toUpperCase()}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
            {isVerified && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700"><ShieldCheck size={12} />VERIFIED</span>}
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">{task.title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed">{task.description}</p>
        </div>
      </div>

      {/* Task Info */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">{task.location}</span></div>
          <div className="flex items-center gap-3 text-sm"><Clock size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Due by {formatTime(task.dueBy)}</span></div>
          {assignee && <div className="flex items-center gap-3 text-sm"><User size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Assigned to: {assignee.name}</span></div>}
          {createdBy && <div className="flex items-center gap-3 text-sm"><User size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Assigned by: {createdBy.name}</span></div>}
          <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-slate-400 flex-shrink-0" /><span className="text-slate-600">Created: {formatDateTime(task.createdAt)}</span></div>
          {task.completedAt && <div className="flex items-center gap-3 text-sm"><CheckCircle size={16} className="text-blue-400 flex-shrink-0" /><span className="text-slate-600">Completed: {formatDateTime(task.completedAt)}</span></div>}
          {verifier && task.verifiedAt && (
            <div className="flex items-center gap-3 text-sm"><ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" /><span className="text-slate-600">Verified by {verifier.name}: {formatDateTime(task.verifiedAt)}</span></div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {task.instructions && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Instructions</h3>
            <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{task.instructions}</div>
          </div>
        </div>
      )}

      {/* Photos Section */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">{isVerified ? 'Completion Photos' : 'Photos'}</h3>
          <p className="text-xs text-slate-500 mb-3">
            {isAwaitingV ? 'Awaiting supervisor verification' : isVerified ? 'Verified completion photos' : isEmployee ? 'Take a photo to complete this task (Required)' : 'Reference photos'}
          </p>

          {/* Photo Required Warning for Employee */}
          {isEmployee && needsPhoto && !isVerified && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">Photo is required before marking task as complete. Use the camera below.</p>
            </div>
          )}

          {/* Photo Grid */}
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                {!isVerified && !isAwaitingV && (
                  <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={10} className="text-white" /></button>
                )}
              </motion.div>
            ))}

            {/* Photo capture buttons - only if not verified */}
            {!isVerified && !isAwaitingV && (
              <>
                <button onClick={() => handleAddPhoto('camera')} className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-1">
                  <Camera size={20} className="text-primary" />
                  <span className="text-[10px] text-primary font-medium">Camera</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </button>
                <button onClick={() => handleAddPhoto('gallery')} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1">
                  <ImagePlus size={20} className="text-slate-500" />
                  <span className="text-[10px] text-slate-500 font-medium">Gallery</span>
                </button>
              </>
            )}
          </div>

          {isAwaitingV && photos.length > 0 && (
            <div className="mt-3 bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-700 font-medium">Submitted for verification ({photos.length} photo{photos.length > 1 ? 's' : ''})</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes Input */}
      {!isVerified && !isAwaitingV && isEmployee && (
        <div className="px-4 mt-3">
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Completion Notes (Optional)</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any notes about what was done..."
              maxLength={500} className="w-full min-h-[80px] border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
            <p className="text-[10px] text-slate-400 text-right mt-1">{notes.length}/500</p>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
        <AnimatePresence mode="wait">
          {/* EMPLOYEE: Not Started */}
          {isEmployee && isPending && (
            <motion.button key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleStartTask} className="w-full h-12 bg-white border-2 border-primary text-primary font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
              <Play size={18} /> Start Task
            </motion.button>
          )}

          {/* EMPLOYEE: In Progress - Needs Photo */}
          {isEmployee && isInProgress && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {needsPhoto ? (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                  <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Please add at least one photo using Camera or Gallery above</p>
                </div>
              ) : null}
              <button onClick={handleComplete} disabled={photos.length === 0}
                className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-button active:scale-[0.97] transition-transform disabled:opacity-50">
                <CheckCircle size={18} /> Submit for Verification
              </button>
            </motion.div>
          )}

          {/* EMPLOYEE: Awaiting Verification */}
          {isEmployee && isAwaitingV && (
            <motion.div key="awaiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <Clock size={18} /> <span className="text-sm font-medium">Awaiting Supervisor Verification</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Your task completion is being reviewed</p>
              {canVerify && (
                <button onClick={handleVerify} className="w-full h-12 bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                  <ShieldCheck size={18} /> Verify Task
                </button>
              )}
            </motion.div>
          )}

          {/* SUPERVISOR: Awaiting Verification - Verify Button */}
          {isLeader && isAwaitingV && (
            <motion.button key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleVerify} className="w-full h-12 bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.97] transition-transform">
              <ShieldCheck size={18} /> Verify & Approve Task
            </motion.button>
          )}

          {/* Verified State */}
          {isVerified && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 h-12 bg-emerald-50 text-emerald-700 font-semibold rounded-xl">
              <ShieldCheck size={18} /> Task Verified & Complete
            </motion.div>
          )}

          {/* SUPERVISOR: Pending/Assigned - Can Edit */}
          {isLeader && isPending && (
            <div className="flex gap-2">
              <button onClick={handleStartTask} className="flex-1 h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                <Play size={18} /> Mark In Progress
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
