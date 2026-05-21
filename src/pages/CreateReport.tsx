import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Search, Camera, X, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface CreateReportProps {
  onBack: () => void;
  onSubmitted: () => void;
}

const locations = [
  'Give and Go — Line A',
  'Give and Go — Line B',
  'Give and Go — Line C',
  'Warehouse',
  'Packaging Area',
  'Freezer',
  'Loading Dock',
  'Break Room',
  'Kitchen',
  'Office',
];

export function CreateReport({ onBack, onSubmitted }: CreateReportProps) {
  const { currentUser, addReport } = useStore();
  const [reportType, setReportType] = useState<'damage' | 'finding'>('damage');
  const [location, setLocation] = useState(locations[0]);
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!description.trim()) return;
    addReport({
      type: reportType,
      description: description.trim(),
      location,
      severity: reportType === 'damage' ? severity : undefined,
      status: reportType === 'damage' ? 'reported' : 'new',
      reportedBy: currentUser?.id || '',
      photos,
    });
    onSubmitted();
  };

  const isValid = description.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white px-4 h-14 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
        <button onClick={onBack} className="p-1 -ml-1">
          <ArrowLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-800">Create Report</h1>
      </header>

      <div className="px-4 mt-4">
        <div className="flex gap-3">
          <button
            onClick={() => setReportType('damage')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
              reportType === 'damage'
                ? 'border-red-400 bg-red-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <AlertTriangle size={28} className={`mx-auto mb-2 ${reportType === 'damage' ? 'text-red-500' : 'text-slate-400'}`} />
            <p className={`text-sm font-semibold ${reportType === 'damage' ? 'text-red-800' : 'text-slate-600'}`}>Damage Report</p>
            <p className={`text-[10px] mt-0.5 ${reportType === 'damage' ? 'text-red-600' : 'text-slate-400'}`}>Equipment damage or hazards</p>
          </button>
          <button
            onClick={() => setReportType('finding')}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-center ${
              reportType === 'finding'
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <Search size={28} className={`mx-auto mb-2 ${reportType === 'finding' ? 'text-blue-500' : 'text-slate-400'}`} />
            <p className={`text-sm font-semibold ${reportType === 'finding' ? 'text-blue-800' : 'text-slate-600'}`}>Finding</p>
            <p className={`text-[10px] mt-0.5 ${reportType === 'finding' ? 'text-blue-600' : 'text-slate-400'}`}>Sanitation issues or observations</p>
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 border border-slate-200 rounded-xl pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none bg-white"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {reportType === 'damage' && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <label className="text-xs font-medium text-slate-500 mb-2 block">Severity</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'critical'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    severity === s
                      ? s === 'critical' ? 'bg-red-500 text-white' : s === 'high' ? 'bg-orange-500 text-white' : s === 'medium' ? 'bg-amber-400 text-white' : 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={reportType === 'damage' ? 'Describe the damage or hazard in detail...' : 'Describe the finding or observation...'}
            className="w-full min-h-[100px] border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-xs font-medium text-slate-500 mb-2 block">Attach Photos (Recommended)</label>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X size={10} className="text-white" />
                </button>
              </motion.div>
            ))}
            <button
              onClick={handleAddPhoto}
              className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-1"
            >
              <Camera size={20} className="text-primary" />
              <span className="text-[10px] text-primary font-medium">Add Photo</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} capture="environment" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full h-12 bg-primary text-white font-semibold rounded-xl shadow-button active:scale-[0.97] transition-transform disabled:opacity-50"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
