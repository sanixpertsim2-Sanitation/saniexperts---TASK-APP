import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, ChevronDown, ArrowUp, ArrowDown, Minus, AlertTriangle, Camera, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface CreateTaskProps {
  onBack: () => void;
  onCreated: () => void;
  quickPhoto?: string | null;
}

const locations = [
  'Give and Go IM2 — Line A',
  'Give and Go IM2 — Line B',
  'Give and Go IM2 — Line C',
  'Give and Go IM2 — Warehouse',
  'Give and Go IM2 — Packaging Area',
  'Give and Go IM2 — Freezer',
  'Give and Go IM2 — Loading Dock',
  'Give and Go IM2 — Break Room',
  'Give and Go IM2 — Kitchen',
];

export function CreateTask({ onBack, onCreated, quickPhoto }: CreateTaskProps) {
  const { currentUser, addTask, getAllEmployees } = useStore();
  const employees = getAllEmployees();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState(locations[0]);
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [shift, setShift] = useState('morning');
  const [photos, setPhotos] = useState<string[]>(quickPhoto ? [quickPhoto] : []);
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const priorities = [
    { id: 'urgent', label: 'URGENT', icon: AlertTriangle, activeColor: 'bg-amber-500 text-white' },
    { id: 'high', label: 'HIGH', icon: ArrowUp, activeColor: 'bg-red-500 text-white' },
    { id: 'medium', label: 'MEDIUM', icon: Minus, activeColor: 'bg-yellow-500 text-white' },
    { id: 'low', label: 'LOW', icon: ArrowDown, activeColor: 'bg-emerald-500 text-white' },
  ];

  const handleAddPhoto = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    }
  };
  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!title.trim()) return;
    const dueBy = dueDate && dueTime ? new Date(`${dueDate}T${dueTime}`).toISOString() : new Date(Date.now() + 8 * 3600 * 1000).toISOString();
    addTask({
      title: title.trim(), description: description.trim(), instructions: instructions.trim(),
      priority: priority as any, status: assignee ? 'assigned' : 'pending',
      assignedTo: assignee || undefined, location, shift: shift as any, dueBy,
      createdBy: currentUser?.id || '', photos,
    });
    onCreated();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={22} className="text-slate-700" /></button>
        <h1 className="text-base font-semibold text-slate-800">Create Task</h1>
      </header>

      <div className="px-4 mt-4 space-y-4">
        {/* Photo Upload - Optional for Supervisor */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Reference Photos (Optional)</label>
          <p className="text-[11px] text-slate-400 mb-2">Attach photos to help the employee understand the task</p>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={10} className="text-white" /></button>
              </motion.div>
            ))}
            <button onClick={handleAddPhoto} className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-1">
              <Camera size={20} className="text-primary" />
              <span className="text-[10px] text-primary font-medium">Add Photo</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Task Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Clean Mixing Tank #3"
            className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of what needs to be done..."
            className="w-full min-h-[80px] border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Instructions</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Step-by-step instructions for the employee..."
            className="w-full min-h-[80px] border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {priorities.map((p) => {
              const Icon = p.icon;
              return (
                <button key={p.id} onClick={() => setPriority(p.id)}
                  className={`py-2.5 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 border transition-all ${
                    priority === p.id ? p.activeColor : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}><Icon size={14} />{p.label}</button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 border border-slate-200 rounded-xl pl-9 pr-8 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-white">
              {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Assign To</label>
          <button onClick={() => setShowEmployeePicker(!showEmployeePicker)}
            className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm text-left flex items-center justify-between hover:border-primary transition-colors">
            <span className={assignee ? 'text-slate-800' : 'text-slate-400'}>
              {assignee ? employees.find((e) => e.id === assignee)?.name || 'Select employee' : 'Select employee (optional)'}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {showEmployeePicker && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-2 border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <button onClick={() => { setAssignee(''); setShowEmployeePicker(false); }} className="w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors border-b border-slate-100">Unassigned</button>
              {employees.map((emp) => (
                <button key={emp.id} onClick={() => { setAssignee(emp.id); setShowEmployeePicker(false); }}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 border-b border-slate-50 last:border-0">
                  <img src={emp.avatar || ''} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div><p className="text-sm font-medium">{emp.name}</p><p className="text-[10px] text-slate-400 capitalize">{emp.shift} shift</p></div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Due Date & Time</label>
          <div className="flex gap-2">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="flex-1 h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-28 h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Shift</label>
          <div className="flex gap-2">
            {(['morning', 'afternoon', 'night'] as const).map((s) => (
              <button key={s} onClick={() => setShift(s)} className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${shift === s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="w-full h-12 bg-primary text-white font-semibold rounded-xl shadow-button active:scale-[0.97] transition-transform disabled:opacity-50">
          Create Task
        </button>
      </div>
    </div>
  );
}
