
import { BUILD_CONFIG } from '@/lib/config/buildConfig';
import { logger } from '@/lib/logging/logger';

// Image lazy loading utility
export const setupImageLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    logger.debug('Image lazy loading initialized');
  }
};

// Resource preloading
export const preloadCriticalResources = () => {
  const criticalResources = [
    { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' },
    // Add other critical resources
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  logger.debug('Critical resources preloaded');
};

// Bundle analysis helper
export const analyzeBundleSize = () => {
  if (!BUILD_CONFIG.IS_DEVELOPMENT) return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc) => {
    // Estimate - in real implementation you'd get actual sizes
    return acc + 100; // Placeholder
  }, 0);

  logger.info('Bundle analysis', {
    scriptCount: scripts.length,
    estimatedSize: `${totalSize}KB`,
  });
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (!('memory' in performance)) return;

  const memInfo = (performance as any).memory;
  const usage = {
    used: Math.round(memInfo.usedJSHeapSize / 1048576), // MB
    total: Math.round(memInfo.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memInfo.jsHeapSizeLimit / 1048576), // MB
  };

  logger.info('Memory usage', usage);

  // Warn if memory usage is high
  if (usage.used > usage.limit * 0.8) {
    logger.warn('High memory usage detected', usage);
  }

  return usage;
};

// Performance budget checker
export const checkPerformanceBudget = () => {
  const budget = {
    maxLoadTime: 3000, // 3 seconds
    maxMemoryUsage: 50, // 50MB
    maxBundleSize: 1000, // 1MB
  };

  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  const memoryUsage = monitorMemoryUsage();

  const violations = [];

  if (loadTime > budget.maxLoadTime) {
    violations.push(`Load time exceeded: ${loadTime}ms > ${budget.maxLoadTime}ms`);
  }

  if (memoryUsage && memoryUsage.used > budget.maxMemoryUsage) {
    violations.push(`Memory usage exceeded: ${memoryUsage.used}MB > ${budget.maxMemoryUsage}MB`);
  }

  if (violations.length > 0) {
    logger.warn('Performance budget violations', violations);
  } else {
    logger.info('Performance budget checks passed');
  }

  return {
    passed: violations.length === 0,
    violations,
    metrics: {
      loadTime,
      memoryUsage,
    },
  };
};
