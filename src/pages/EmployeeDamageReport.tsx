import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, ImagePlus, MapPin, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface EmployeeDamageReportProps {
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
  'Give and Go IM2 — Office',
];

export function EmployeeDamageReport({ onBack, onSubmitted }: EmployeeDamageReportProps) {
  const { currentUser, addReport } = useStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [location, setLocation] = useState(locations[0]);
  const [submitted, setSubmitted] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleCapture = (source: 'camera' | 'gallery') => {
    const input = source === 'camera' ? cameraRef : galleryRef;
    input.current?.click();
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

  const handleSubmit = () => {
    if (!description.trim()) return;
    addReport({
      type: 'damage',
      description: description.trim(),
      location,
      severity,
      status: 'reported',
      reportedBy: currentUser?.id || '',
      photos,
    });
    setSubmitted(true);
    setTimeout(onSubmitted, 2000);
  };

  const severities = [
    { id: 'critical', label: 'CRITICAL', color: 'bg-red-500 text-white', inactive: 'bg-red-50 text-red-600 border-red-200' },
    { id: 'high', label: 'HIGH', color: 'bg-orange-500 text-white', inactive: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'medium', label: 'MEDIUM', color: 'bg-amber-400 text-white', inactive: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'low', label: 'LOW', color: 'bg-emerald-500 text-white', inactive: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Damage Reported!</h2>
          <p className="text-sm text-slate-500 mb-1">Your supervisor has been notified.</p>
          <p className="text-xs text-slate-400">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1"><ArrowLeft size={22} className="text-slate-700" /></button>
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h1 className="text-base font-semibold text-slate-800">Report Damage</h1>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-4">
        {/* Photo Upload */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Take a Photo (Required)</label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">×</span></button>
              </motion.div>
            ))}
            {photos.length < 3 && (
              <>
                <button onClick={() => handleCapture('camera')} className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-1">
                  <Camera size={20} className="text-primary" /><span className="text-[10px] text-primary font-medium">Camera</span>
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                </button>
                <button onClick={() => handleCapture('gallery')} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1">
                  <ImagePlus size={20} className="text-slate-500" /><span className="text-[10px] text-slate-500 font-medium">Gallery</span>
                  <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Severity */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block flex items-center gap-1">
            <AlertTriangle size={12} /> Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {severities.map((s) => (
              <button key={s.id} onClick={() => setSeverity(s.id as any)}
                className={`py-2.5 rounded-xl text-[10px] font-bold border transition-all ${severity === s.id ? s.color : s.inactive}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 border border-slate-200 rounded-xl pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-white">
              {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the damage in detail — what happened, what equipment, any safety concerns..."
            className="w-full min-h-[100px] border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
        <button onClick={handleSubmit} disabled={!description.trim() || photos.length === 0}
          className="w-full h-12 bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-40">
          <Send size={18} /> Report Damage
        </button>
      </div>
    </div>
  );
}
