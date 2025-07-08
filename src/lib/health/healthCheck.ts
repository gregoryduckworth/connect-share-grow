
import { BUILD_CONFIG, validateEnvironment } from '@/lib/config/buildConfig';
import { environment } from '@/lib/config/environment';
import { logger } from '@/lib/logging/logger';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message?: string;
      duration?: number;
    };
  };
}

export class HealthCheckService {
  private checks: Map<string, () => Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }>> = new Map();

  constructor() {
    this.registerDefaultChecks();
  }

  private registerDefaultChecks() {
    // Environment validation check
    this.addCheck('environment', async () => {
      const validation = validateEnvironment();
      return {
        status: validation.isValid ? 'pass' : 'fail',
        message: validation.isValid ? 'Environment configuration is valid' : validation.errors.join(', '),
      };
    });

    // Local storage check
    this.addCheck('localStorage', async () => {
      try {
        const testKey = 'health_check_test';
        const testValue = 'test';
        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        return {
          status: retrieved === testValue ? 'pass' : 'fail',
          message: retrieved === testValue ? 'Local storage is working' : 'Local storage failed',
        };
      } catch (error) {
        return {
          status: 'fail',
          message: `Local storage error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    });

    // Memory usage check (if available)
    this.addCheck('memory', async () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
        const limitMB = Math.round(memInfo.jsHeapSizeLimit / 1048576);
        const usagePercent = (usedMB / limitMB) * 100;

        const status = usagePercent > 80 ? 'warn' : usagePercent > 95 ? 'fail' : 'pass';
        
        return {
          status,
          message: `Memory usage: ${usedMB}MB / ${limitMB}MB (${usagePercent.toFixed(1)}%)`,
        };
      }
      
      return {
        status: 'warn',
        message: 'Memory information not available',
      };
    });

    // Performance check
    this.addCheck('performance', async () => {
      const start = performance.now();
      
      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const duration = performance.now() - start;
      const status = duration > 100 ? 'warn' : duration > 500 ? 'fail' : 'pass';
      
      return {
        status,
        message: `Performance check completed in ${duration.toFixed(2)}ms`,
      };
    });
  }

  addCheck(name: string, checkFn: () => Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string }>) {
    this.checks.set(name, checkFn);
  }

  removeCheck(name: string) {
    this.checks.delete(name);
  }

  async runHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const checks: HealthCheckResult['checks'] = {};
    let overallStatus: HealthCheckResult['status'] = 'healthy';

    // Run all checks
    for (const [name, checkFn] of this.checks) {
      const checkStart = performance.now();
      
      try {
        const result = await checkFn();
        const duration = performance.now() - checkStart;
        
        checks[name] = {
          ...result,
          duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
        };

        // Update overall status
        if (result.status === 'fail') {
          overallStatus = 'unhealthy';
        } else if (result.status === 'warn' && overallStatus === 'healthy') {
          overallStatus = 'degraded';
        }
      } catch (error) {
        checks[name] = {
          status: 'fail',
          message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          duration: performance.now() - checkStart,
        };
        overallStatus = 'unhealthy';
      }
    }

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: BUILD_CONFIG.VERSION,
      environment: environment.APP_ENV,
      checks,
    };

    // Log health check results
    const duration = Date.now() - startTime;
    logger.info('Health check completed', {
      status: overallStatus,
      duration,
      failedChecks: Object.entries(checks)
        .filter(([, check]) => check.status === 'fail')
        .map(([name]) => name),
    });

    return result;
  }

  async getHealthStatus(): Promise<'healthy' | 'unhealthy' | 'degraded'> {
    const result = await this.runHealthCheck();
    return result.status;
  }
}

export const healthCheckService = new HealthCheckService();

// Export a simple health check function for easy use
export const performHealthCheck = () => healthCheckService.runHealthCheck();
