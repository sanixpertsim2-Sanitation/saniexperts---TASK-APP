import { create } from 'zustand';
import type { User, Task, Report, Notification, TaskStatus, ReportStatus } from '@/types';
import { AVATARS, PHOTOS } from '@/lib/images';

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (phone: string) => User | null;
  logout: () => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  assignTask: (taskId: string, userId: string) => void;
  completeTask: (taskId: string, photos: string[], notes: string) => void;
  verifyTask: (taskId: string, verifierId: string) => void;
  getTasksByAssignee: (userId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getAwaitingVerification: () => Task[];
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  getReportsByType: (type: 'finding' | 'damage') => Report[];
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  getUnreadNotifications: () => Notification[];
  getAllEmployees: () => User[];
  getUserById: (id: string) => User | undefined;
  getDamageReports: () => Report[];
  getOpenDamageReports: () => Report[];
  getClosedDamageReports: () => Report[];
  getMyDamageReports: (userId: string) => Report[];
  advanceDamageStatus: (id: string) => void;
}

const EMPLOYEES: User[] = [
  { id: 'E001', name: 'Raj Patel', phone: '+1-416-555-0101', role: 'employee', shift: 'morning', avatar: AVATARS.employee1, employeeId: 'SX-1001', location: 'Give and Go IM2' },
  { id: 'E002', name: 'Maria Garcia', phone: '+1-416-555-0102', role: 'employee', shift: 'morning', avatar: AVATARS.employee2, employeeId: 'SX-1002', location: 'Give and Go IM2' },
  { id: 'E003', name: 'James Wilson', phone: '+1-416-555-0103', role: 'employee', shift: 'afternoon', avatar: AVATARS.employee3, employeeId: 'SX-1003', location: 'Give and Go IM2' },
  { id: 'E004', name: 'Priya Sharma', phone: '+1-416-555-0104', role: 'employee', shift: 'afternoon', avatar: AVATARS.employee2, employeeId: 'SX-1004', location: 'Give and Go IM2' },
  { id: 'E005', name: 'Chen Wei', phone: '+1-416-555-0105', role: 'employee', shift: 'night', avatar: AVATARS.employee1, employeeId: 'SX-1005', location: 'Give and Go IM2' },
  { id: 'E006', name: 'Aisha Mohamed', phone: '+1-416-555-0106', role: 'employee', shift: 'night', avatar: AVATARS.employee2, employeeId: 'SX-1006', location: 'Give and Go IM2' },
  { id: 'E007', name: 'Lucas Tremblay', phone: '+1-416-555-0107', role: 'employee', shift: 'morning', avatar: AVATARS.employee3, employeeId: 'SX-1007', location: 'Give and Go IM2' },
  { id: 'E008', name: 'Sofia Nguyen', phone: '+1-416-555-0108', role: 'employee', shift: 'afternoon', avatar: AVATARS.employee2, employeeId: 'SX-1008', location: 'Give and Go IM2' },
];

const LEADERS: User[] = [
  { id: 'L001', name: 'Robert Hayes', phone: '+1-416-555-0201', role: 'leadership', avatar: AVATARS.leader1, employeeId: 'SX-2001', location: 'Give and Go IM2' },
  { id: 'L002', name: 'Maria Santos', phone: '+1-416-555-0202', role: 'leadership', avatar: AVATARS.leader1, employeeId: 'SX-2002', location: 'Give and Go IM2' },
  { id: 'L003', name: "Kevin O'Brien", phone: '+1-416-555-0203', role: 'leadership', avatar: AVATARS.leader1, employeeId: 'SX-2003', location: 'Give and Go IM2' },
];

const ALL_USERS = [...EMPLOYEES, ...LEADERS];

const INITIAL_TASKS: Task[] = [
  { id: 'T001', title: 'Clean Mixing Tank #3', description: 'Deep clean mixing tank #3 after chocolate batch. Disconnect hoses, apply cleaning solution, rinse with hot water 60C, reconnect.',
    instructions: '1. Disconnect all hoses from mixing tank #3.\n2. Apply cleaning solution per SOP-2024-001.\n3. Rinse thoroughly with hot water (60C).\n4. Take photos of cleaned surfaces.\n5. Reconnect hoses and verify no leaks.',
    priority: 'high', status: 'assigned', assignedTo: 'E001', location: 'Give and Go IM2 — Line A', shift: 'morning', dueBy: '2024-01-15T15:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T002', title: 'Sanitize Conveyor Belt B', description: 'Apply sanitizer to conveyor belt B in packaging area. Ensure full coverage. Photo required.',
    instructions: '1. Stop conveyor belt and lock out.\n2. Apply foaming sanitizer across entire belt surface.\n3. Allow 10-minute contact time.\n4. Rinse with clean water.\n5. Take photos of sanitized belt.',
    priority: 'medium', status: 'in_progress', assignedTo: 'E002', location: 'Give and Go IM2 — Line B', shift: 'morning', dueBy: '2024-01-15T14:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T003', title: 'Freezer Floor Scrub', description: 'Scrub and sanitize freezer floor section C. Remove ice buildup. Use scraper then mop with sanitizer.',
    instructions: '1. Wear cold-weather PPE.\n2. Remove loose ice with scraper.\n3. Apply floor cleaner and scrub with deck brush.\n4. Mop with sanitizer solution.\n5. Ensure floor is dry before leaving.',
    priority: 'high', status: 'pending', location: 'Give and Go IM2 — Freezer', shift: 'afternoon', dueBy: '2024-01-15T23:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T004', title: 'Clean Nozzles — Line C', description: 'All 12 filling nozzles on Line C need cleaning. Remove, soak in solution, brush, reinstall.',
    instructions: '1. Stop Line C production.\n2. Remove all 12 filling nozzles carefully.\n3. Soak in cleaning solution for 15 minutes.\n4. Brush each nozzle inside and out.\n5. Rinse with hot water.\n6. Reinstall and test for proper flow.',
    priority: 'urgent', status: 'assigned', assignedTo: 'E003', location: 'Give and Go IM2 — Line C', shift: 'afternoon', dueBy: '2024-01-15T19:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T005', title: 'Loading Dock Sweep', description: 'Sweep and mop loading dock area. Remove all debris. Apply floor sanitizer.',
    instructions: '1. Clear loading dock of pallets and debris.\n2. Sweep entire area thoroughly.\n3. Mop with cleaning solution.\n4. Apply floor sanitizer.\n5. Ensure floor is dry.',
    priority: 'low', status: 'awaiting_verification', assignedTo: 'E001', location: 'Give and Go IM2 — Loading Dock', shift: 'morning', dueBy: '2024-01-15T12:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', completedAt: '2024-01-15T11:30:00', photos: [PHOTOS.cleaning1] },
  { id: 'T006', title: 'Warehouse Rack Dusting', description: 'Dust and wipe all warehouse storage racks. Check for pest evidence. Report any findings.',
    instructions: '1. Start from top shelves and work down.\n2. Use microfiber cloths to dust all surfaces.\n3. Wipe spills or stains with sanitizer.\n4. Check for any pest activity signs.\n5. Report findings immediately if any.',
    priority: 'medium', status: 'assigned', assignedTo: 'E007', location: 'Give and Go IM2 — Warehouse', shift: 'morning', dueBy: '2024-01-15T11:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T007', title: 'Deep Clean — Sunday Special', description: 'Complete teardown and deep clean of Line A. All panels removed. Full sanitation per SOP-SUN-001.',
    instructions: '1. Full production stop confirmed.\n2. Remove all access panels.\n3. Apply heavy-duty foaming cleaner.\n4. Pressure wash all surfaces.\n5. Sanitize all contact surfaces.\n6. Reassemble and verify.\n7. Full photo documentation required.',
    priority: 'urgent', status: 'pending', location: 'Give and Go IM2 — Line A', shift: 'sunday', dueBy: '2024-01-15T19:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T008', title: 'Pressure Wash Floor Drains', description: 'All floor drains in production area need pressure washing. Check flow after cleaning.',
    instructions: '1. Remove drain covers.\n2. Pressure wash each drain thoroughly.\n3. Check for blockages.\n4. Ensure proper water flow.\n5. Replace covers securely.\n6. Test drain function.',
    priority: 'high', status: 'pending', location: 'Give and Go IM2 — Line A', shift: 'night', dueBy: '2024-01-16T03:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T009', title: 'Replace HVAC Filters', description: 'Replace all HVAC filters in production area. Dispose of old filters properly.',
    instructions: '1. Locate all HVAC units.\n2. Remove old filters carefully.\n3. Install new filters with correct orientation.\n4. Dispose of old filters in designated bin.\n5. Record filter change in log.',
    priority: 'medium', status: 'in_progress', assignedTo: 'E005', location: 'Give and Go IM2 — Line B', shift: 'night', dueBy: '2024-01-16T05:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T010', title: 'Sanitize Break Room', description: 'Full sanitization of employee break room. Tables, chairs, microwave, refrigerator.',
    instructions: '1. Clear all surfaces.\n2. Wipe tables and chairs with sanitizer.\n3. Clean microwave inside and out.\n4. Wipe refrigerator exterior and handle.\n5. Sweep and mop floor.',
    priority: 'low', status: 'verified', assignedTo: 'E006', location: 'Give and Go IM2 — Break Room', shift: 'night', dueBy: '2024-01-16T06:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', completedAt: '2024-01-16T05:30:00', verifiedAt: '2024-01-16T06:00:00', verifiedBy: 'L001', photos: [PHOTOS.cleaning2] },
  { id: 'T011', title: 'Clean Labeling Machine', description: 'Clean and sanitize labeling machine on Line B. Remove adhesive residue. Check label alignment after.',
    instructions: '1. Stop labeling machine.\n2. Remove label rolls.\n3. Clean adhesive residue with solvent.\n4. Sanitize all surfaces.\n5. Reinstall label rolls.\n6. Test run and verify alignment.',
    priority: 'medium', status: 'assigned', assignedTo: 'E004', location: 'Give and Go IM2 — Line B', shift: 'afternoon', dueBy: '2024-01-15T18:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
  { id: 'T012', title: 'Grease Trap Check', description: 'Check and clean grease trap in kitchen area. Pump out if more than 25% full. Log levels.',
    instructions: '1. Open grease trap access.\n2. Measure grease level.\n3. If >25% full, pump out contents.\n4. Clean trap interior.\n5. Record levels in logbook.\n6. Secure access cover.',
    priority: 'high', status: 'pending', location: 'Give and Go IM2 — Kitchen', shift: 'afternoon', dueBy: '2024-01-15T21:00:00', createdBy: 'L001', createdAt: '2024-01-15T08:30:00', photos: [] },
];

const INITIAL_REPORTS: Report[] = [
  { id: 'F001', type: 'finding', description: 'Residue buildup on mixing tank #2 walls. Not fully cleaned during last cycle. Needs reclean.', location: 'Give and Go IM2 — Line A', status: 'new', reportedBy: 'E001', photos: [], createdAt: '2024-01-15T09:30:00' },
  { id: 'F002', type: 'finding', description: 'Floor drain near Line C emitting foul odor. Possible blockage.', location: 'Give and Go IM2 — Line C', status: 'in_review', reportedBy: 'E003', photos: [], createdAt: '2024-01-15T16:15:00' },
  { id: 'F003', type: 'finding', description: 'Missing sanitation log sheet for yesterday\'s night shift. Cannot verify completion.', location: 'Give and Go IM2 — Office', status: 'task_created', reportedBy: 'E007', photos: [], createdAt: '2024-01-15T08:00:00' },
  { id: 'F004', type: 'finding', description: 'Light fixture above freezer door flickering. May need bulb replacement.', location: 'Give and Go IM2 — Freezer', status: 'resolved', reportedBy: 'E005', photos: [], createdAt: '2024-01-14T23:30:00', resolvedAt: '2024-01-15T06:00:00' },
  { id: 'D001', type: 'damage', description: 'Conveyor belt motor making loud grinding noise. Belt stopped at 2:30 PM.', location: 'Give and Go IM2 — Line B', severity: 'critical', status: 'reported', reportedBy: 'E002', photos: [PHOTOS.damage1], createdAt: '2024-01-15T14:35:00' },
  { id: 'D002', type: 'damage', description: 'Hose connector on Line A leaking water. Spray reaching electrical panel.', location: 'Give and Go IM2 — Line A', severity: 'high', status: 'maintenance_assigned', reportedBy: 'E004', photos: [], createdAt: '2024-01-15T17:20:00' },
  { id: 'D003', type: 'damage', description: 'Floor scrubber brush worn down to metal. Leaving scratches on epoxy floor.', location: 'Give and Go IM2 — Warehouse', severity: 'medium', status: 'in_repair', reportedBy: 'E006', photos: [], createdAt: '2024-01-15T00:10:00' },
  { id: 'D004', type: 'damage', description: 'Microwave in break room not heating. Display shows error code E-5.', location: 'Give and Go IM2 — Break Room', severity: 'low', status: 'resolved', reportedBy: 'E001', photos: [], createdAt: '2024-01-15T10:00:00', resolvedAt: '2024-01-15T12:00:00' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'N001', title: 'New Task Assigned', message: 'Clean Mixing Tank #3 has been assigned to you.', type: 'task_assigned', read: false, createdAt: '2024-01-15T08:30:00', relatedId: 'T001' },
  { id: 'N002', title: 'Urgent Task', message: 'Clean Nozzles — Line C is marked as urgent.', type: 'task_assigned', read: false, createdAt: '2024-01-15T08:30:00', relatedId: 'T004' },
  { id: 'N003', title: 'Task Completed', message: 'Loading Dock Sweep completed. Awaiting verification.', type: 'task_completed', read: false, createdAt: '2024-01-15T11:30:00', relatedId: 'T005' },
  { id: 'N004', title: 'Task Verified', message: 'Break Room Sanitization has been verified.', type: 'task_verified', read: true, createdAt: '2024-01-16T06:00:00', relatedId: 'T010' },
];

let taskIdCounter = 100;
let reportIdCounter = 100;
let notificationIdCounter = 100;

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  tasks: INITIAL_TASKS,
  reports: INITIAL_REPORTS,
  notifications: INITIAL_NOTIFICATIONS,

  login: (phone: string) => {
    const user = ALL_USERS.find(u => u.phone === phone);
    if (user) set({ currentUser: user, isAuthenticated: true });
    return user || null;
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),

  addTask: (task) => {
    const newTask: Task = { ...task, id: `T${String(taskIdCounter++).padStart(3, '0')}`, createdAt: new Date().toISOString() };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates } : t) })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  assignTask: (taskId, userId) => set((state) => ({ tasks: state.tasks.map((t) => t.id === taskId ? { ...t, assignedTo: userId, status: 'assigned' as TaskStatus } : t) })),

  completeTask: (taskId, photos, notes) => {
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: 'awaiting_verification' as TaskStatus, photos, completionNotes: notes, completedAt: new Date().toISOString() } : t),
      notifications: [{ id: `N${String(notificationIdCounter++).padStart(3, '0')}`, title: 'Task Awaiting Verification', message: `Task ${state.tasks.find(t => t.id === taskId)?.title || ''} is completed and awaiting verification.`, type: 'task_completed', read: false, createdAt: new Date().toISOString(), relatedId: taskId }, ...state.notifications],
    }));
  },

  verifyTask: (taskId, verifierId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: 'verified' as TaskStatus, verifiedAt: new Date().toISOString(), verifiedBy: verifierId } : t),
      notifications: [{ id: `N${String(notificationIdCounter++).padStart(3, '0')}`, title: 'Task Verified', message: `Task has been verified and approved.`, type: 'task_verified', read: false, createdAt: new Date().toISOString(), relatedId: taskId }, ...state.notifications],
    }));
  },

  getTasksByAssignee: (userId) => get().tasks.filter((t) => t.assignedTo === userId),
  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
  getAwaitingVerification: () => get().tasks.filter((t) => t.status === 'awaiting_verification'),

  addReport: (report) => {
    const newReport: Report = { ...report, id: report.type === 'finding' ? `F${String(reportIdCounter++).padStart(3, '0')}` : `D${String(reportIdCounter++).padStart(3, '0')}`, createdAt: new Date().toISOString() };
    set((state) => ({ reports: [newReport, ...state.reports] }));
  },

  updateReport: (id, updates) => set((state) => ({ reports: state.reports.map((r) => r.id === id ? { ...r, ...updates } : r) })),
  getReportsByType: (type) => get().reports.filter((r) => r.type === type),

  addNotification: (notification) => {
    const newNotification: Notification = { ...notification, id: `N${String(notificationIdCounter++).padStart(3, '0')}`, createdAt: new Date().toISOString() };
    set((state) => ({ notifications: [newNotification, ...state.notifications] }));
  },

  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  getUnreadNotifications: () => get().notifications.filter((n) => !n.read),

  getAllEmployees: () => EMPLOYEES,
  getUserById: (id) => ALL_USERS.find((u) => u.id === id),

  getDamageReports: () => get().reports.filter((r) => r.type === 'damage'),
  getOpenDamageReports: () => get().reports.filter((r) => r.type === 'damage' && r.status !== 'closed' && r.status !== 'resolved'),
  getClosedDamageReports: () => get().reports.filter((r) => r.type === 'damage' && (r.status === 'closed' || r.status === 'resolved')),
  getMyDamageReports: (userId) => get().reports.filter((r) => r.type === 'damage' && r.reportedBy === userId),

  advanceDamageStatus: (id) => {
    const report = get().reports.find((r) => r.id === id);
    if (!report) return;
    const flow: string[] = ['reported', 'maintenance_assigned', 'in_repair', 'fixed', 'closed'];
    const idx = flow.indexOf(report.status);
    if (idx === -1 || idx >= flow.length - 1) return;
    const nextStatus = flow[idx + 1] as ReportStatus;
    set((state) => ({
      reports: state.reports.map((r) => {
        if (r.id !== id) return r;
        return { ...r, status: nextStatus, resolvedAt: nextStatus === 'closed' ? new Date().toISOString() : r.resolvedAt };
      }),
    }));
  },
}));
