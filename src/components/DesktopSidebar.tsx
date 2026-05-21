import { AVATARS, LOGO } from '@/lib/images';

import { ClipboardList, AlertTriangle, User, LayoutDashboard, PlusCircle, Search, FileWarning, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: 'employee' | 'leadership';
  userName: string;
  userAvatar: string;
  userRole: string;
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

export function DesktopSidebar({ activeTab, onTabChange, role, userName, userAvatar, userRole }: DesktopSidebarProps) {
  const tabs = role === 'leadership' ? leaderTabs : employeeTabs;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <img src={LOGO} alt="SaniXperts" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">SaniXperts</h1>
            <p className="text-[10px] text-slate-400">Give and Go IM2</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-4 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-primary text-white shadow-button' : 'text-slate-600 hover:bg-slate-50'
              }`}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {tab.label}
              {isActive && <motion.div layoutId="sidebarActive" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4">
        <div className="border-t border-slate-100 pt-4 px-3">
          <div className="flex items-center gap-3">
            <img src={userAvatar || AVATARS.employee1} alt="" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{userRole === 'leadership' ? 'Supervisor' : 'Employee'}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
