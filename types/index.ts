// Core data types for Chrono time management app

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  workHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
  breakDuration: number; // minutes
  pomodoroEnabled: boolean;
  pomodoroDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // every X days/weeks/months/years
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  taskId?: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  category: string;
  tags: string[];
  isBreak: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalTimeSpent: number; // minutes
}

// Event interfaces for the Days app
export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: Date; // The primary date for the event
  startTime?: string; // "HH:MM" format, if not all-day
  endTime?: string;   // "HH:MM" format, if not all-day
  isAllDay: boolean;
  location?: string;
  categoryId?: string;
  imageUrl?: string;
  recurrence?: RecurrenceRule; // Optional, if the event repeats
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number; // e.g., 2 for every 2 days/weeks/months/years
  byDay?: number[]; // For WEEKLY: [0, 1, 2] for Sun, Mon, Tue
  byMonthDay?: number[]; // For MONTHLY: [1, 15] for 1st and 15th
  byMonth?: number[]; // For YEARLY: [1, 7] for Jan, Jul
  until?: Date; // End date for recurrence
  count?: number; // Number of occurrences
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface PomodoroSession {
  id: string;
  userId: string;
  taskId?: string;
  type: 'work' | 'short_break' | 'long_break';
  duration: number; // minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  interrupted: boolean;
  createdAt: Date;
}

export interface ProductivityStats {
  userId: string;
  date: Date;
  totalWorkTime: number; // minutes
  totalBreakTime: number; // minutes
  tasksCompleted: number;
  tasksCreated: number;
  pomodoroSessions: number;
  averageTaskDuration: number; // minutes
  mostProductiveHour: number; // 0-23
  categories: {
    [categoryId: string]: {
      timeSpent: number;
      tasksCompleted: number;
    };
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  scheduledFor: Date;
  sent: boolean;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'task_reminder'
  | 'break_reminder'
  | 'pomodoro_complete'
  | 'daily_summary'
  | 'goal_achieved'
  | 'streak_milestone';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: GoalType;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 'daily_work_hours' | 'tasks_completed' | 'pomodoro_sessions' | 'streak_days';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  error?: {
    code: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Filter and sort types
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface TimeEntryFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  category?: string[];
  tags?: string[];
  isBreak?: boolean;
}

export interface EventFilters {
  status?: 'upcoming' | 'previous' | 'all';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export type SortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';
