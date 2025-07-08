
export interface EnvironmentConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  SESSION_TIMEOUT: number;
  ENABLE_DEBUG_LOGS: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
  ENABLE_ERROR_REPORTING: boolean;
  ENCRYPTION_KEY: string;
  CSRF_SECRET: string;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

const getEnvironmentVariable = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
};

const getEnvironmentNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvironmentBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  return value ? value === 'true' : defaultValue;
};

export const environment: EnvironmentConfig = {
  API_BASE_URL: getEnvironmentVariable('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  APP_ENV: (getEnvironmentVariable('VITE_APP_ENV', 'development') as EnvironmentConfig['APP_ENV']),
  LOG_LEVEL: (getEnvironmentVariable('VITE_LOG_LEVEL', 'info') as EnvironmentConfig['LOG_LEVEL']),
  SESSION_TIMEOUT: getEnvironmentNumber('VITE_SESSION_TIMEOUT', 30),
  ENABLE_DEBUG_LOGS: getEnvironmentBoolean('VITE_ENABLE_DEBUG_LOGS', true),
  ENABLE_PERFORMANCE_MONITORING: getEnvironmentBoolean('VITE_ENABLE_PERFORMANCE_MONITORING', true),
  ENABLE_ERROR_REPORTING: getEnvironmentBoolean('VITE_ENABLE_ERROR_REPORTING', true),
  ENCRYPTION_KEY: getEnvironmentVariable('VITE_ENCRYPTION_KEY', 'default-key-for-development-only'),
  CSRF_SECRET: getEnvironmentVariable('VITE_CSRF_SECRET', 'default-csrf-secret-for-development'),
  RATE_LIMIT_WINDOW: getEnvironmentNumber('VITE_RATE_LIMIT_WINDOW', 900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: getEnvironmentNumber('VITE_RATE_LIMIT_MAX_REQUESTS', 100),
};

export const isProduction = () => environment.APP_ENV === 'production';
export const isDevelopment = () => environment.APP_ENV === 'development';
export const isStaging = () => environment.APP_ENV === 'staging';

export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (isProduction()) {
    if (environment.API_BASE_URL.includes('localhost')) {
      errors.push('API_BASE_URL should not use localhost in production');
    }

    if (!environment.API_BASE_URL.startsWith('https://')) {
      errors.push('API_BASE_URL should use HTTPS in production');
    }

    if (environment.ENCRYPTION_KEY === 'default-key-for-development-only') {
      errors.push('ENCRYPTION_KEY must be set to a secure value in production');
    }

    if (environment.CSRF_SECRET === 'default-csrf-secret-for-development') {
      errors.push('CSRF_SECRET must be set to a secure value in production');
    }

    if (environment.ENABLE_DEBUG_LOGS) {
      errors.push('Debug logs should be disabled in production');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getEnvironmentInfo = () => ({
  environment: environment.APP_ENV,
  apiBaseUrl: environment.API_BASE_URL,
  debugEnabled: environment.ENABLE_DEBUG_LOGS,
  performanceMonitoring: environment.ENABLE_PERFORMANCE_MONITORING,
  errorReporting: environment.ENABLE_ERROR_REPORTING,
});
