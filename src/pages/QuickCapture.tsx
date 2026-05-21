import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, ImagePlus, MapPin, ChevronDown, ArrowUp, ArrowDown, Minus, AlertTriangle, Send } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface QuickCaptureProps {
  onBack: () => void;
  onSubmitted: () => void;
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

export function QuickCapture({ onBack, onSubmitted }: QuickCaptureProps) {
  const { currentUser, addTask, getAllEmployees } = useStore();
  const employees = getAllEmployees();
  const [step, setStep] = useState<'capture' | 'details'>('capture');
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [location, setLocation] = useState(locations[0]);
  const [assignee, setAssignee] = useState('');
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const priorities = [
    { id: 'urgent', label: 'URGENT', icon: AlertTriangle, activeColor: 'bg-amber-500 text-white' },
    { id: 'high', label: 'HIGH', icon: ArrowUp, activeColor: 'bg-red-500 text-white' },
    { id: 'medium', label: 'MEDIUM', icon: Minus, activeColor: 'bg-yellow-500 text-white' },
    { id: 'low', label: 'LOW', icon: ArrowDown, activeColor: 'bg-emerald-500 text-white' },
  ];

  const handleCapture = (source: 'camera' | 'gallery') => {
    const input = source === 'camera' ? cameraRef : galleryRef;
    input.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPhoto(reader.result as string); setStep('details'); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !photo) return;
    addTask({
      title: title.trim(), description: description.trim(), instructions: '',
      priority: priority as any, status: assignee ? 'assigned' : 'pending',
      assignedTo: assignee || undefined, location, shift: 'morning', dueBy: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      createdBy: currentUser?.id || '', photos: [photo],
    });
    onSubmitted();
  };

  if (step === 'capture') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <header className="px-4 h-14 flex items-center justify-between">
          <button onClick={onBack} className="p-1"><ArrowLeft size={22} className="text-white" /></button>
          <h1 className="text-base font-semibold text-white">Quick Capture</h1>
          <div className="w-8" />
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera size={40} className="text-white/80" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Snap & Create Task</h2>
            <p className="text-white/50 text-sm mb-8">Take a photo to instantly create a task.<br/>Just like WhatsApp, but organized.</p>

            <div className="flex gap-4 justify-center">
              <button onClick={() => handleCapture('camera')}
                className="w-32 h-32 bg-primary rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                <Camera size={32} className="text-white" />
                <span className="text-white text-xs font-semibold">Camera</span>
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              </button>

              <button onClick={() => handleCapture('gallery')}
                className="w-32 h-32 bg-white/10 border border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                <ImagePlus size={32} className="text-white/70" />
                <span className="text-white/70 text-xs font-semibold">Gallery</span>
                <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="px-6 pb-8 text-center">
          <p className="text-white/30 text-xs">Take a photo during your walk-through<br/>and instantly create a task with it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={() => setStep('capture')} className="p-1 -ml-1"><ArrowLeft size={22} className="text-slate-700" /></button>
        <h1 className="text-base font-semibold text-slate-800">Create Task from Photo</h1>
      </header>

      {/* Photo Preview */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <img src={photo || ''} alt="Captured" className="w-full h-full object-cover" />
            <button onClick={() => setStep('capture')} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white">
              <Camera size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Task Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full h-11 border border-slate-200 rounded-xl px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you found or what needs attention..."
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
              {assignee ? employees.find((e) => e.id === assignee)?.name || 'Select' : 'Select employee (optional)'}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {showEmployeePicker && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-2 border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <button onClick={() => { setAssignee(''); setShowEmployeePicker(false); }} className="w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 border-b border-slate-100">Unassigned</button>
              {employees.map((emp) => (
                <button key={emp.id} onClick={() => { setAssignee(emp.id); setShowEmployeePicker(false); }}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 last:border-0">
                  <img src={emp.avatar || ''} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <div><p className="text-sm font-medium">{emp.name}</p><p className="text-[10px] text-slate-400 capitalize">{emp.shift} shift</p></div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-button active:scale-[0.97] transition-transform disabled:opacity-50">
          <Send size={18} /> Create Task from Photo
        </button>
      </div>
    </div>
  );
}
