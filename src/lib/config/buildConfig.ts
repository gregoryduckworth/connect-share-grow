
export const BUILD_CONFIG = {
  // Version info
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  BUILD_DATE: new Date().toISOString(),
  
  // Environment flags
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Feature flags
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true' || !import.meta.env.PROD,
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== 'false',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING !== 'false',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Cache configuration
  CACHE_VERSION: import.meta.env.VITE_CACHE_VERSION || 'v1',
  ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  
  // Security
  ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP !== 'false',
  ALLOWED_HOSTS: import.meta.env.VITE_ALLOWED_HOSTS?.split(',') || [],
} as const;

export const getEnvironmentInfo = () => ({
  version: BUILD_CONFIG.VERSION,
  environment: BUILD_CONFIG.IS_PRODUCTION ? 'production' : 'development',
  buildDate: BUILD_CONFIG.BUILD_DATE,
  features: {
    debugLogs: BUILD_CONFIG.ENABLE_DEBUG_LOGS,
    performanceMonitoring: BUILD_CONFIG.ENABLE_PERFORMANCE_MONITORING,
    errorReporting: BUILD_CONFIG.ENABLE_ERROR_REPORTING,
  },
});

// Runtime environment validation
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  if (BUILD_CONFIG.IS_PRODUCTION) {
    if (BUILD_CONFIG.ENABLE_DEBUG_LOGS) {
      issues.push('Debug logs should be disabled in production');
    }
    
    if (!BUILD_CONFIG.API_BASE_URL.startsWith('https://')) {
      issues.push('API should use HTTPS in production');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};
