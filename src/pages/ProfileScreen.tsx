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
    <div className="min-h-screen pb-20">
      {/* Premium Header */}
      <div className="bg-gradient-primary px-6 pt-8 pb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
        <h1 className="text-lg font-bold text-white mb-6 relative z-10">Profile</h1>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center ring-2 ring-white/10 backdrop-blur-sm">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <User size={28} className="text-white/80" />
            )}
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">{currentUser?.name}</h2>
            <span className="inline-block bg-white/10 text-white/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-0.5 border border-white/10">
              {currentUser?.role === 'leadership' ? 'Team Leader' : 'Sanitation Worker'}
            </span>
            {currentUser?.employeeId && (
              <p className="text-white/50 text-xs mt-1 font-mono">ID: {currentUser.employeeId}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 space-y-3">
        {/* Info Cards */}
        <div className="glass rounded-2xl overflow-hidden">
          {[
            { icon: Phone, label: 'Phone', value: currentUser?.phone || '-' },
            { icon: Clock, label: 'Shift', value: shiftLabel },
            { icon: Building2, label: 'Location', value: 'Give and Go IM2' },
            { icon: Calendar, label: 'Joined', value: 'Jan 2024' },
          ].map((item, i, arr) => (
            <div key={item.label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <item.icon size={18} className="text-primary/60 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm text-white/80 font-medium mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">This Week's Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: completedThisWeek, label: 'Tasks Completed', color: 'text-emerald-400' },
              { value: myFindings, label: 'Findings', color: 'text-amber-400' },
              { value: myDamage, label: 'Damage Reports', color: 'text-red-400' },
              { value: 48, label: 'Hours Worked', color: 'text-primary' },
            ].map((stat) => (
              <div key={stat.label} className="glass-light rounded-xl p-3 text-center">
                <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="glass rounded-2xl overflow-hidden">
          {settingsItems.map((item, i, arr) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors ${i < arr.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
            >
              <item.icon size={18} className="text-white/40" />
              <span className="flex-1 text-sm text-white/70">{item.label}</span>
              {item.value && <span className="text-xs text-white/40 mr-1">{item.value}</span>}
              <ChevronRight size={16} className="text-white/20" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-14 glass rounded-2xl text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={18} /> Logout
        </motion.button>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 max-w-sm w-full border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-sm text-white/50 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 h-12 glass-light rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={onLogout} className="flex-1 h-12 bg-gradient-danger rounded-xl text-sm font-bold text-white shadow-glow-danger">Logout</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
