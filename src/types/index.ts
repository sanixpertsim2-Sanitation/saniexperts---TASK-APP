export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'employee' | 'leadership';
  shift?: 'morning' | 'afternoon' | 'night';
  avatar?: string;
  employeeId?: string;
  location?: string;
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'awaiting_verification' | 'verified';
export type ShiftType = 'morning' | 'afternoon' | 'night' | 'sunday';

export interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  location: string;
  shift: ShiftType;
  dueBy: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  photos: string[];
  completionNotes?: string;
  isFinding?: boolean;
  isDamage?: boolean;
}

export type ReportType = 'finding' | 'damage';
export type ReportStatus = 'new' | 'in_review' | 'task_created' | 'resolved' | 'reported' | 'maintenance_assigned' | 'in_repair' | 'fixed' | 'closed';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  type: ReportType;
  description: string;
  location: string;
  severity?: Severity;
  status: ReportStatus;
  reportedBy: string;
  photos: string[];
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'task_completed' | 'task_verified' | 'finding' | 'damage' | 'system';
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface ShiftInfo {
  name: string;
  timeRange: string;
  startHour: number;
  endHour: number;
}
