// Application constants
export const APP_CONSTANTS = {
  // API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
      AVATAR: '/user/avatar',
    },
    DASHBOARD: {
      STATS: '/dashboard/stats',
      CHARTS: '/dashboard/charts',
      RECENT_ACTIVITIES: '/dashboard/activities',
    },
    ADMIN: {
      USERS: '/admin/users',
      ROLES: '/admin/roles',
      PERMISSIONS: '/admin/permissions',
      SETTINGS: '/admin/settings',
      LOGS: '/admin/logs',
    },
  },

  // Local storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME_PREFERENCE: 'theme_preference',
    SIDEBAR_STATE: 'sidebar_state',
    LANGUAGE: 'language',
    RECENT_SEARCHES: 'recent_searches',
  },

  // Route paths
  ROUTES: {
    HOME: '/',
    DASHBOARD: '/admin/dashboard',
    PROFILE: '/admin/profile',
    TABLES: '/admin/tables',
    MAPS: '/admin/maps',
    ICONS: '/admin/icons',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
  },

  // Query keys for React Query
  QUERY_KEYS: {
    USER: ['user'],
    USER_PROFILE: ['user', 'profile'],
    DASHBOARD_STATS: ['dashboard', 'stats'],
    DASHBOARD_CHARTS: ['dashboard', 'charts'],
    RECENT_ACTIVITIES: ['dashboard', 'activities'],
    USERS: ['admin', 'users'],
    ROLES: ['admin', 'roles'],
    PERMISSIONS: ['admin', 'permissions'],
    SETTINGS: ['admin', 'settings'],
    LOGS: ['admin', 'logs'],
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
  },

  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: {
      IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    },
  },

  // Validation rules
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_SPECIAL_CHARS: true,
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9_-]+$/,
    },
  },

  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
    API: 'YYYY-MM-DD',
    API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  },

  // Breakpoints for responsive design
  BREAKPOINTS: {
    XS: 0,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400,
  },

  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  // Z-index values
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    SAVED: 'Changes saved successfully.',
    DELETED: 'Item deleted successfully.',
    CREATED: 'Item created successfully.',
    UPDATED: 'Item updated successfully.',
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'You have been logged out successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
  },

  // Notification types
  NOTIFICATION_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },

  // Theme colors
  THEME_COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#06b6d4',
    LIGHT: '#f8fafc',
    DARK: '#1e293b',
  },

  // Chart colors
  CHART_COLORS: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  ],

  // Default table columns
  DEFAULT_TABLE_COLUMNS: {
    ID: { key: 'id', title: 'ID', width: 80 },
    NAME: { key: 'name', title: 'Name', width: 200 },
    EMAIL: { key: 'email', title: 'Email', width: 250 },
    STATUS: { key: 'status', title: 'Status', width: 120 },
    CREATED_AT: { key: 'createdAt', title: 'Created', width: 150 },
    ACTIONS: { key: 'actions', title: 'Actions', width: 120 },
  },

  // User roles
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    MODERATOR: 'moderator',
    GUEST: 'guest',
  },

  // User permissions
  USER_PERMISSIONS: {
    // Dashboard permissions
    VIEW_DASHBOARD: 'dashboard:view',
    EXPORT_DASHBOARD: 'dashboard:export',
    
    // User management permissions
    VIEW_USERS: 'users:view',
    CREATE_USERS: 'users:create',
    UPDATE_USERS: 'users:update',
    DELETE_USERS: 'users:delete',
    
    // Role management permissions
    VIEW_ROLES: 'roles:view',
    CREATE_ROLES: 'roles:create',
    UPDATE_ROLES: 'roles:update',
    DELETE_ROLES: 'roles:delete',
    
    // Settings permissions
    VIEW_SETTINGS: 'settings:view',
    UPDATE_SETTINGS: 'settings:update',
    
    // Logs permissions
    VIEW_LOGS: 'logs:view',
    EXPORT_LOGS: 'logs:export',
  },
} as const;

// Type definitions for better TypeScript support
export type ApiEndpoint = typeof APP_CONSTANTS.API_ENDPOINTS;
export type StorageKey = typeof APP_CONSTANTS.STORAGE_KEYS;
export type Route = typeof APP_CONSTANTS.ROUTES;
export type QueryKey = typeof APP_CONSTANTS.QUERY_KEYS;
export type NotificationType = typeof APP_CONSTANTS.NOTIFICATION_TYPES;
export type UserRole = typeof APP_CONSTANTS.USER_ROLES;
export type UserPermission = typeof APP_CONSTANTS.USER_PERMISSIONS;

export default APP_CONSTANTS;