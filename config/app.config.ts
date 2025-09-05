// Centralized application configuration
export interface AppConfig {
  // Application metadata
  app: {
    name: string;
    version: string;
    description: string;
    url: string;
    supportEmail: string;
  };

  // API configuration
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };

  // Feature flags
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics: boolean;
    auditLogs: boolean;
    realTimeUpdates: boolean;
    fileUpload: boolean;
    exportData: boolean;
  };

  // UI configuration
  ui: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      defaultMode: 'light' | 'dark' | 'system';
    };
    sidebar: {
      defaultCollapsed: boolean;
      showLogo: boolean;
      showUserInfo: boolean;
    };
    header: {
      showNotifications: boolean;
      showUserMenu: boolean;
      showSearch: boolean;
    };
  };

  // Performance settings
  performance: {
    enableLazyLoading: boolean;
    enableCodeSplitting: boolean;
    enableImageOptimization: boolean;
    enableCaching: boolean;
    cacheTimeout: number;
  };

  // Security settings
  security: {
    enableCSRF: boolean;
    enableXSSProtection: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };

  // Analytics configuration
  analytics: {
    enabled: boolean;
    trackingId?: string;
    events: {
      pageViews: boolean;
      userInteractions: boolean;
      errors: boolean;
      performance: boolean;
    };
  };

  // External services
  services: {
    googleMaps?: {
      apiKey: string;
      enabled: boolean;
    };
    email?: {
      provider: 'smtp' | 'sendgrid' | 'mailgun';
      apiKey?: string;
      fromEmail: string;
    };
    storage?: {
      provider: 'local' | 'aws' | 'gcp' | 'azure';
      bucket?: string;
      region?: string;
    };
  };
}

// Default configuration
export const defaultConfig: AppConfig = {
  app: {
    name: 'NextJS Enterprise Dashboard',
    version: '1.1.0',
    description: 'A modern, responsive dashboard built with Next.js and React 18',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    supportEmail: 'support@example.com',
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    retryAttempts: 3,
  },

  features: {
    darkMode: true,
    notifications: true,
    analytics: true,
    auditLogs: true,
    realTimeUpdates: true,
    fileUpload: true,
    exportData: true,
  },

  ui: {
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      defaultMode: 'system',
    },
    sidebar: {
      defaultCollapsed: false,
      showLogo: true,
      showUserInfo: true,
    },
    header: {
      showNotifications: true,
      showUserMenu: true,
      showSearch: true,
    },
  },

  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableImageOptimization: true,
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
  },

  security: {
    enableCSRF: true,
    enableXSSProtection: true,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
  },

  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    trackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    events: {
      pageViews: true,
      userInteractions: true,
      errors: true,
      performance: true,
    },
  },

  services: {
    googleMaps: {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      enabled: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
    email: {
      provider: 'smtp',
      fromEmail: 'noreply@example.com',
    },
    storage: {
      provider: 'local',
    },
  },
};

// Environment-specific configurations
const developmentConfig: Partial<AppConfig> = {
  features: {
    ...defaultConfig.features,
    auditLogs: false,
  },
  analytics: {
    ...defaultConfig.analytics,
    enabled: false,
  },
  performance: {
    ...defaultConfig.performance,
    enableCaching: false,
  },
};

const productionConfig: Partial<AppConfig> = {
  security: {
    ...defaultConfig.security,
    enableCSRF: true,
    enableXSSProtection: true,
  },
  performance: {
    ...defaultConfig.performance,
    enableCaching: true,
    cacheTimeout: 15 * 60 * 1000, // 15 minutes
  },
};

// Get configuration based on environment
export const getConfig = (): AppConfig => {
  const baseConfig = { ...defaultConfig };
  
  if (process.env.NODE_ENV === 'development') {
    return { ...baseConfig, ...developmentConfig };
  }
  
  if (process.env.NODE_ENV === 'production') {
    return { ...baseConfig, ...productionConfig };
  }
  
  return baseConfig;
};

// Export the current configuration
export const config = getConfig();

// Configuration validation
export const validateConfig = (config: AppConfig): string[] => {
  const errors: string[] = [];

  if (!config.app.name) {
    errors.push('App name is required');
  }

  if (!config.app.version) {
    errors.push('App version is required');
  }

  if (!config.api.baseUrl) {
    errors.push('API base URL is required');
  }

  if (config.features.analytics && !config.analytics.trackingId) {
    errors.push('Analytics tracking ID is required when analytics is enabled');
  }

  if (config.services.googleMaps?.enabled && !config.services.googleMaps?.apiKey) {
    errors.push('Google Maps API key is required when Google Maps is enabled');
  }

  return errors;
};

// Configuration utilities
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
  return config.features[feature];
};

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.api.baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.replace(/^\//, '');
  return `${baseUrl}/${cleanEndpoint}`;
};

export const getServiceConfig = <T extends keyof AppConfig['services']>(
  service: T
): AppConfig['services'][T] => {
  return config.services[service];
};

export default config;