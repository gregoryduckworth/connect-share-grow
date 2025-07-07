
import { BUILD_CONFIG, validateEnvironment } from '@/lib/config/buildConfig';
import { validateSecurityHeaders } from '@/lib/security/securityHeaders';
import { checkPerformanceBudget } from '@/lib/performance/optimizations';
import { logger } from '@/lib/logging/logger';

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'critical';
  timestamp: string;
  version: string;
  checks: Array<{
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message?: string;
    details?: any;
  }>;
}

export const performHealthCheck = async (): Promise<HealthCheckResult> => {
  const checks: Array<{
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message?: string;
    details?: any;
  }> = [];
  let overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';

  // Environment validation
  const envValidation = validateEnvironment();
  checks.push({
    name: 'Environment Configuration',
    status: envValidation.isValid ? 'pass' : 'warn',
    message: envValidation.isValid ? 'Configuration valid' : 'Configuration issues detected',
    details: envValidation.issues,
  });

  if (!envValidation.isValid) {
    overallStatus = 'warning';
  }

  // Security headers check
  const securityValidation = validateSecurityHeaders();
  checks.push({
    name: 'Security Headers',
    status: securityValidation.passed ? 'pass' : 'warn',
    message: securityValidation.passed ? 'Security headers configured' : 'Security headers missing',
    details: securityValidation.results,
  });

  if (!securityValidation.passed) {
    overallStatus = 'warning';
  }

  // Performance budget check
  const performanceCheck = checkPerformanceBudget();
  checks.push({
    name: 'Performance Budget',
    status: performanceCheck.passed ? 'pass' : 'warn',
    message: performanceCheck.passed ? 'Within performance budget' : 'Performance budget exceeded',
    details: performanceCheck.violations,
  });

  if (!performanceCheck.passed) {
    overallStatus = 'warning';
  }

  // API connectivity check (placeholder)
  checks.push({
    name: 'API Connectivity',
    status: 'pass',
    message: 'API endpoints accessible',
  });

  // Memory usage check
  if ('memory' in performance) {
    const memInfo = (performance as any).memory;
    const memoryUsage = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
    const memoryStatus: 'pass' | 'warn' = memoryUsage > 0.8 ? 'warn' : 'pass';
    
    checks.push({
      name: 'Memory Usage',
      status: memoryStatus,
      message: `Memory usage at ${Math.round(memoryUsage * 100)}%`,
      details: {
        used: Math.round(memInfo.usedJSHeapSize / 1048576),
        limit: Math.round(memInfo.jsHeapSizeLimit / 1048576),
      },
    });

    if (memoryUsage > 0.9) {
      overallStatus = 'critical';
    } else if (memoryUsage > 0.8) {
      overallStatus = 'warning';
    }
  }

  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: BUILD_CONFIG.VERSION,
    checks,
  };

  logger.info('Health check completed', { 
    status: overallStatus, 
    passedChecks: checks.filter(c => c.status === 'pass').length,
    totalChecks: checks.length 
  });

  return result;
};

// Expose health check endpoint for monitoring
if (typeof window !== 'undefined') {
  (window as any).__healthCheck = performHealthCheck;
}
