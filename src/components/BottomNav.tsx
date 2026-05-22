import { ClipboardList, User, LayoutDashboard, PlusCircle, Camera, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'employee' | 'leadership';
}

const employeeTabs = [
  { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
  { id: 'damage_list', label: 'Damages', icon: AlertTriangle },
  { id: 'damage_report', label: 'Report', icon: AlertTriangle },
  { id: 'profile', label: 'Profile', icon: User },
];

const leaderTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'alltasks', label: 'Tasks', icon: ClipboardList },
  { id: 'capture', label: 'Snap', icon: Camera },
  { id: 'create', label: 'Create', icon: PlusCircle },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onTabChange, role }: BottomNavProps) {
  const tabs = role === 'leadership' ? leaderTabs : employeeTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass z-50 h-16 border-t border-white/[0.06]">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center w-16 h-full relative tap-highlight-transparent"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full shadow-glow"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={22} className={isActive ? 'text-primary' : 'text-white/30'} strokeWidth={isActive ? 2.5 : 1.5} />
              </motion.div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-primary' : 'text-white/30'}`}>{tab.label}</span>
              {tab.id === 'damage_report' && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-glow-danger"></span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
