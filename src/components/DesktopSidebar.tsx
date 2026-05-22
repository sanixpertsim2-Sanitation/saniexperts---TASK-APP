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
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] glass z-50 flex flex-col border-r border-white/[0.06]">
      {/* Logo Section */}
      <div className="px-5 pt-5 pb-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-lg" />
            <div className="relative w-10 h-10 glass-card rounded-xl flex items-center justify-center">
              <img src={LOGO} alt="SaniXperts" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">SaniXperts</h1>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.15em]">Give and Go IM2</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 space-y-1 overflow-y-auto scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl border border-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-primary' : ''} />
              </span>
              <span className="relative z-10">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="px-3 pb-4">
        <div className="border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl glass-card">
            <div className="relative">
              <img src={userAvatar || AVATARS.employee1} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-navy-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-white/40 capitalize">{userRole === 'leadership' ? 'Supervisor' : 'Employee'}</p>
            </div>
            {onLogout && (
              <button onClick={onLogout} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
