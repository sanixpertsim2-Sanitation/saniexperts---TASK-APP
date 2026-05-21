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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 h-16">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-16 h-full relative tap-highlight-transparent">
              {isActive && (
                <motion.div layoutId="activeTab" className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              )}
              <Icon size={22} className={isActive ? 'text-primary' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-primary' : 'text-slate-400'}`}>{tab.label}</span>
              {tab.id === 'damage_report' && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
