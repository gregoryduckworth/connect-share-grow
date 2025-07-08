
import { environment, validateEnvironment as validateEnv } from './environment';

export const BUILD_CONFIG = {
  // Version info
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  BUILD_DATE: new Date().toISOString(),
  
  // Environment flags
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  
  // Feature flags - now using environment config
  ENABLE_DEBUG_LOGS: environment.ENABLE_DEBUG_LOGS,
  ENABLE_PERFORMANCE_MONITORING: environment.ENABLE_PERFORMANCE_MONITORING,
  ENABLE_ERROR_REPORTING: environment.ENABLE_ERROR_REPORTING,
  
  // API Configuration - now using environment config
  API_BASE_URL: environment.API_BASE_URL,
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

// Use the new environment validation
export const validateEnvironment = validateEnv;
