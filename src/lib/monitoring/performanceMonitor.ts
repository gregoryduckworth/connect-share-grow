
import { logger } from '@/lib/logging/logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  startTimer(name: string, metadata?: Record<string, any>) {
    const startTime = performance.now();
    this.timers.set(name, startTime);
    
    logger.debug(`Performance timer started: ${name}`, metadata);
    return startTime;
  }

  endTimer(name: string, metadata?: Record<string, any>): number {
    const endTime = performance.now();
    const startTime = this.timers.get(name);
    
    if (!startTime) {
      logger.warn(`No start time found for timer: ${name}`);
      return 0;
    }

    const duration = endTime - startTime;
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.push(metric);
    this.timers.delete(name);

    logger.debug(`Performance timer ended: ${name}`, { 
      duration: `${duration.toFixed(2)}ms`,
      ...metadata 
    });

    // Log slow operations
    if (duration > 1000) {
      logger.warn(`Slow operation detected: ${name}`, {
        duration: `${duration.toFixed(2)}ms`,
        ...metadata,
      });
    }

    return duration;
  }

  measureAsync<T>(name: string, asyncFn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(name, metadata);
      
      try {
        const result = await asyncFn();
        this.endTimer(name, { ...metadata, success: true });
        resolve(result);
      } catch (error) {
        this.endTimer(name, { ...metadata, success: false, error: error });
        reject(error);
      }
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageTime(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / relevantMetrics.length;
  }

  clearMetrics() {
    this.metrics = [];
    logger.debug('Performance metrics cleared');
  }

  // Web Vitals monitoring
  measureWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        logger.info('LCP measured', { 
          value: lastEntry.startTime,
          threshold: lastEntry.startTime > 2500 ? 'poor' : lastEntry.startTime > 1200 ? 'needs improvement' : 'good'
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        logger.debug('LCP observation not supported');
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          logger.info('FID measured', {
            value: fid,
            threshold: fid > 300 ? 'poor' : fid > 100 ? 'needs improvement' : 'good'
          });
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        logger.debug('FID observation not supported');
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook for React components
export const usePerformanceTimer = (name: string, metadata?: Record<string, any>) => {
  const startTimer = () => performanceMonitor.startTimer(name, metadata);
  const endTimer = () => performanceMonitor.endTimer(name, metadata);
  
  return { startTimer, endTimer };
};
