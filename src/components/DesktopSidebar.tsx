import { AVATARS, LOGO } from '@/lib/images';
import { ClipboardList, AlertTriangle, User, LayoutDashboard, PlusCircle, Search, FileWarning, Camera, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'employee' | 'leadership';
  userName: string;
  userAvatar: string;
  userRole: string;
  onLogout?: () => void;
}

const employeeTabs = [
  { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
  { id: 'reports', label: 'Report Issue', icon: AlertTriangle },
  { id: 'profile', label: 'Profile', icon: User },
];

const leaderTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alltasks', label: 'All Tasks', icon: ClipboardList },
  { id: 'capture', label: 'Quick Capture', icon: Camera },
  { id: 'create', label: 'Create Task', icon: PlusCircle },
  { id: 'findings', label: 'Findings', icon: Search },
  { id: 'damage', label: 'Damage', icon: FileWarning },
  { id: 'profile', label: 'Profile', icon: User },
];

export function DesktopSidebar({ activeTab, onTabChange, role, userName, userAvatar, userRole, onLogout }: DesktopSidebarProps) {
  const tabs = role === 'leadership' ? leaderTabs : employeeTabs;

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[260px] z-50 flex flex-col"
      style={{
        background: 'rgba(6, 9, 18, 0.85)',
        backdropFilter: 'blur(30px) saturate(140%)',
        WebkitBackdropFilter: 'blur(30px) saturate(140%)',
        borderRight: '1px solid rgba(212, 175, 55, 0.06)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gold-gradient rounded-xl blur-xl opacity-20" />
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{ border: '1px solid rgba(212,175,55,0.15)' }}>
              <img src={LOGO} alt="OmniTask" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-gold-gradient tracking-tight">OmniTask</h1>
            <p className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Give and Go IM2</p>
          </div>
        </motion.div>
      </div>

      {/* Gold divider line */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                isActive ? 'text-gold-light' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(90deg, rgba(212,175,55,0.1), rgba(212,175,55,0.02))',
                    border: '1px solid rgba(212,175,55,0.1)',
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <Icon size={17} strokeWidth={isActive ? 2.5 : 1.5} />
              </span>
              <span className="relative z-10 font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebarDot"
                  className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-gold-gradient"
                  style={{ boxShadow: '0 0 8px rgba(212,175,55,0.5)' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent mb-3" />
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="relative">
            <img src={userAvatar || AVATARS.employee1} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-500/20" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-navy-900"
              style={{ background: '#10b981' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white/90 truncate">{userName}</p>
            <p className="text-[10px] text-white/30 capitalize">{userRole === 'leadership' ? 'Supervisor' : 'Employee'}</p>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-white/5 text-white/20 hover:text-white/50 transition-all">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
