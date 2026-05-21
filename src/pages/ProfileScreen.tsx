import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, Building2, Calendar, ChevronRight, Bell, Globe, Moon, HelpCircle, Info, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ProfileScreenProps {
  onLogout: () => void;
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { currentUser, getTasksByAssignee, reports } = useStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const myTasks = currentUser ? getTasksByAssignee(currentUser.id) : [];
  const completedThisWeek = myTasks.filter((t) => t.status === 'completed').length;
  const myFindings = reports.filter((r) => r.reportedBy === currentUser?.id && r.type === 'finding').length;
  const myDamage = reports.filter((r) => r.reportedBy === currentUser?.id && r.type === 'damage').length;

  const shiftLabel = currentUser?.shift
    ? `${currentUser.shift.charAt(0).toUpperCase() + currentUser.shift.slice(1)} Shift (Mon-Sat)`
    : 'Flexible';

  const settingsItems = [
    { icon: Bell, label: 'Notifications', value: 'On' },
    { icon: Globe, label: 'Language', value: 'English' },
    { icon: Moon, label: 'Dark Mode', value: null, toggle: true },
    { icon: HelpCircle, label: 'Help & Support', value: null },
    { icon: Info, label: 'About', value: 'v1.0.0' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-primary px-4 pt-8 pb-12">
        <h1 className="text-lg font-bold text-white mb-6">Profile</h1>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <User size={28} className="text-white" />
            )}
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">{currentUser?.name}</h2>
            <span className="inline-block bg-white/20 text-white/90 text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5">
              {currentUser?.role === 'leadership' ? 'Team Leader' : 'Sanitation Worker'}
            </span>
            {currentUser?.employeeId && (
              <p className="text-white/60 text-xs mt-1">ID: {currentUser.employeeId}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {[
            { icon: Phone, label: 'Phone', value: currentUser?.phone || '-' },
            { icon: Clock, label: 'Shift', value: shiftLabel },
            { icon: Building2, label: 'Location', value: currentUser?.location || 'Give and Go' },
            { icon: Calendar, label: 'Joined', value: 'Jan 2024' },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <item.icon size={18} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-slate-400">{item.label}</p>
                <p className="text-sm text-slate-700 font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {currentUser?.role === 'employee' && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-card p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">This Week&apos;s Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Tasks Completed', value: completedThisWeek, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'CheckCircle' },
                { label: 'Findings', value: myFindings, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'Search' },
                { label: 'Damage Reports', value: myDamage, color: 'text-red-600', bg: 'bg-red-50', icon: 'AlertTriangle' },
                { label: 'Hours Worked', value: '48', color: 'text-primary', bg: 'bg-primary-light', icon: 'Clock' },
              ].map((stat) => (
                <div key={stat.label} className={`${stat.bg} rounded-xl p-3`}>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {settingsItems.map((item, i, arr) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <item.icon size={18} className="text-slate-400 flex-shrink-0" />
              <span className="flex-1 text-sm text-slate-700">{item.label}</span>
              {item.value && <span className="text-xs text-slate-400 mr-1">{item.value}</span>}
              {item.toggle ? (
                <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              ) : (
                <ChevronRight size={16} className="text-slate-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 mb-8">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-12 border border-red-200 text-red-500 font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">Logout</h3>
            <p className="text-sm text-slate-500 text-center mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 border border-slate-200 text-slate-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => { onLogout(); setShowLogoutConfirm(false); }}
                className="flex-1 h-12 bg-red-500 text-white font-semibold rounded-xl"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
