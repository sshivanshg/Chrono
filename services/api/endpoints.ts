// API Endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // User management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
    STATS: '/users/stats',
  },

  // Tasks
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    BY_CATEGORY: (categoryId: string) => `/tasks/category/${categoryId}`,
    SEARCH: '/tasks/search',
    BULK_UPDATE: '/tasks/bulk',
    STATS: '/tasks/stats',
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },

  // Events
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    SUGGESTIONS: '/events/suggestions',
  },

  // Time tracking
  TIME_ENTRIES: {
    BASE: '/time-entries',
    BY_ID: (id: string) => `/time-entries/${id}`,
    BY_DATE_RANGE: '/time-entries/range',
    CURRENT: '/time-entries/current',
    START: '/time-entries/start',
    STOP: '/time-entries/stop',
    STATS: '/time-entries/stats',
  },

  // Projects
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    BY_USER: '/projects/user',
    STATS: '/projects/stats',
  },

  // Pomodoro
  POMODORO: {
    BASE: '/pomodoro',
    SESSIONS: '/pomodoro/sessions',
    CURRENT: '/pomodoro/current',
    START: '/pomodoro/start',
    STOP: '/pomodoro/stop',
    STATS: '/pomodoro/stats',
  },

  // Analytics
  ANALYTICS: {
    PRODUCTIVITY: '/analytics/productivity',
    TIME_TRACKING: '/analytics/time-tracking',
    TASKS: '/analytics/tasks',
    GOALS: '/analytics/goals',
    EXPORT: '/analytics/export',
  },

  // Goals
  GOALS: {
    BASE: '/goals',
    BY_ID: (id: string) => `/goals/${id}`,
    PROGRESS: '/goals/progress',
    ACHIEVEMENTS: '/goals/achievements',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    PREFERENCES: '/notifications/preferences',
  },

  // Reports
  REPORTS: {
    DAILY: '/reports/daily',
    WEEKLY: '/reports/weekly',
    MONTHLY: '/reports/monthly',
    CUSTOM: '/reports/custom',
    EXPORT: '/reports/export',
  },

  // Settings
  SETTINGS: {
    APP: '/settings/app',
    NOTIFICATIONS: '/settings/notifications',
    PRIVACY: '/settings/privacy',
    BACKUP: '/settings/backup',
    EXPORT: '/settings/export',
  },
} as const;

// Query parameter builders
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

// Common query parameters
export const COMMON_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ORDER: 'order',
  SEARCH: 'search',
  DATE_FROM: 'dateFrom',
  DATE_TO: 'dateTo',
  STATUS: 'status',
  CATEGORY: 'category',
  PRIORITY: 'priority',
  TAGS: 'tags',
} as const;
