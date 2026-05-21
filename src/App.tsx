import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { BottomNav } from '@/components/BottomNav';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { SplashScreen } from '@/pages/SplashScreen';
import { LoginScreen } from '@/pages/LoginScreen';
import { EmployeeTasks } from '@/pages/EmployeeTasks';
import { TaskDetail } from '@/pages/TaskDetail';
import { EmployeeDamageReport } from '@/pages/EmployeeDamageReport';
import { EmployeeDamageList } from '@/pages/EmployeeDamageList';
import { LeadershipDashboard } from '@/pages/LeadershipDashboard';
import { AllTasks } from '@/pages/AllTasks';
import { CreateTask } from '@/pages/CreateTask';
import { FindingsList } from '@/pages/FindingsList';
import { DamageReports } from '@/pages/DamageReports';
import { DamageDetail } from '@/pages/DamageDetail';
import { ProfileScreen } from '@/pages/ProfileScreen';
import { NotificationsScreen } from '@/pages/NotificationsScreen';
import { QuickCapture } from '@/pages/QuickCapture';
import type { Task, Report, User } from '@/types';

type Screen = 'splash' | 'login' | 'employee_tasks' | 'task_detail' | 'employee_damage_report'
  | 'employee_damage_list' | 'leader_dashboard' | 'all_tasks' | 'create_task' | 'findings'
  | 'damage_reports' | 'profile' | 'notifications' | 'quick_capture' | 'damage_detail';

const pageTransition = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } };

export default function App() {
  const { currentUser, isAuthenticated, logout } = useStore();
  const [screen, setScreen] = useState<Screen>('splash');
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDamage, setSelectedDamage] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showNav, setShowNav] = useState(true);

  useEffect(() => { if (!isAuthenticated) { setScreen('login'); setShowNav(false); } }, [isAuthenticated]);

  const navigate = (newScreen: Screen, hideNav = false) => { setPrevScreen(screen); setScreen(newScreen); setShowNav(!hideNav); };

  const goBack = () => {
    const target = prevScreen || (currentUser?.role === 'leadership' ? 'leader_dashboard' : 'employee_tasks');
    setScreen(target as Screen); setPrevScreen(null); setShowNav(true);
  };

  const handleLogin = (user: User) => {
    if (user.role === 'leadership') { setScreen('leader_dashboard'); setActiveTab('dashboard'); }
    else { setScreen('employee_tasks'); setActiveTab('tasks'); }
    setShowNav(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (currentUser?.role === 'leadership') {
      switch (tab) {
        case 'dashboard': setScreen('leader_dashboard'); setShowNav(true); break;
        case 'alltasks': setScreen('all_tasks'); setShowNav(true); break;
        case 'capture': setScreen('quick_capture'); setShowNav(false); break;
        case 'create': setScreen('create_task'); setShowNav(false); break;
        case 'findings': setScreen('findings'); setShowNav(true); break;
        case 'damage': setScreen('damage_reports'); setShowNav(true); break;
        case 'profile': setScreen('profile'); setShowNav(true); break;
      }
    } else {
      switch (tab) {
        case 'tasks': setScreen('employee_tasks'); setShowNav(true); break;
        case 'damage_list': setScreen('employee_damage_list'); setShowNav(true); break;
        case 'damage_report': setScreen('employee_damage_report'); setShowNav(false); setPrevScreen('employee_tasks'); break;
        case 'profile': setScreen('profile'); setShowNav(true); break;
      }
    }
  };

  const handleTaskClick = (task: Task) => { setSelectedTask(task); navigate('task_detail', true); };
  const handleDamageClick = (damage: Report) => { setSelectedDamage(damage); navigate('damage_detail', true); };

  const handleLogout = () => { logout(); setScreen('login'); setShowNav(false); setActiveTab('tasks'); };

  const handleNavigate = (page: string) => {
    if (page === 'alltasks') { setScreen('all_tasks'); setActiveTab('alltasks'); setShowNav(true); }
    else if (page === 'createtask') { setScreen('create_task'); setActiveTab('create'); setShowNav(false); }
    else if (page === 'findings') { setScreen('findings'); setActiveTab('findings'); setShowNav(true); }
    else if (page === 'damage') { setScreen('damage_reports'); setActiveTab('damage'); setShowNav(true); }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen onComplete={() => setScreen('login')} />;
      case 'login': return <LoginScreen onLogin={handleLogin} />;
      case 'employee_tasks': return <EmployeeTasks onTaskClick={handleTaskClick} onNotifications={() => navigate('notifications', true)} />;
      case 'task_detail': return selectedTask ? <TaskDetail task={selectedTask} onBack={goBack} /> : null;
      case 'employee_damage_report': return <EmployeeDamageReport onBack={() => { setScreen('employee_tasks'); setShowNav(true); setActiveTab('tasks'); }} onSubmitted={() => { setScreen('employee_damage_list'); setShowNav(true); setActiveTab('damage_list'); }} />;
      case 'employee_damage_list': return <EmployeeDamageList onReportClick={handleDamageClick} />;
      case 'leader_dashboard': return <LeadershipDashboard onNavigate={handleNavigate} onTaskClick={handleTaskClick} onReportClick={handleDamageClick} onNotifications={() => navigate('notifications', true)} />;
      case 'all_tasks': return <AllTasks onTaskClick={handleTaskClick} onCreateTask={() => { setScreen('create_task'); setShowNav(false); setActiveTab('create'); }} />;
      case 'create_task': return <CreateTask onBack={() => { setScreen(currentUser?.role === 'leadership' ? 'all_tasks' : 'employee_tasks'); setShowNav(true); if (currentUser?.role === 'leadership') setActiveTab('alltasks'); }} onCreated={() => { setScreen(currentUser?.role === 'leadership' ? 'all_tasks' : 'employee_tasks'); setShowNav(true); if (currentUser?.role === 'leadership') setActiveTab('alltasks'); }} />;
      case 'findings': return <FindingsList onReportClick={handleDamageClick} />;
      case 'damage_reports': return <DamageReports onReportClick={handleDamageClick} />;
      case 'damage_detail': return selectedDamage ? <DamageDetail report={selectedDamage} onBack={goBack} /> : null;
      case 'profile': return <ProfileScreen onLogout={handleLogout} />;
      case 'notifications': return <NotificationsScreen onBack={goBack} />;
      case 'quick_capture': return <QuickCapture onBack={() => { setScreen('leader_dashboard'); setShowNav(true); setActiveTab('dashboard'); }} onSubmitted={() => { setScreen('leader_dashboard'); setShowNav(true); setActiveTab('dashboard'); }} />;
      default: return null;
    }
  };

  if (screen === 'splash') return <div className="min-h-screen">{renderScreen()}</div>;
  if (screen === 'login') return <div className="min-h-screen">{renderScreen()}</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {isAuthenticated && <div className="hidden lg:block"><DesktopSidebar activeTab={activeTab} onTabChange={handleTabChange} role={currentUser?.role || 'employee'} userName={currentUser?.name || ''} userAvatar={currentUser?.avatar || ''} userRole={currentUser?.role || 'employee'} /></div>}
      <div className="flex-1 min-h-screen lg:ml-64">
        <AnimatePresence mode="wait">
          <motion.div key={screen} {...pageTransition} className="min-h-screen">{renderScreen()}</motion.div>
        </AnimatePresence>
      </div>
      {showNav && isAuthenticated && <div className="lg:hidden"><BottomNav activeTab={activeTab} onTabChange={handleTabChange} role={currentUser?.role || 'employee'} /></div>}
    </div>
  );
}
