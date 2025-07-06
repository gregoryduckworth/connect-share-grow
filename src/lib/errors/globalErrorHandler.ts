
import { logger } from '@/lib/logging/logger';
import { ErrorHandler, ErrorType } from './ErrorHandler';

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      const error = ErrorHandler.createError(
        ErrorType.CLIENT,
        event.message || 'Uncaught JavaScript error',
        'GLOBAL_001',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        }
      );

      logger.error('Uncaught JavaScript error', error);
      this.reportError(error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = ErrorHandler.createError(
        ErrorType.CLIENT,
        event.reason?.message || 'Unhandled promise rejection',
        'GLOBAL_002',
        {
          reason: event.reason,
          stack: event.reason?.stack,
        }
      );

      logger.error('Unhandled promise rejection', error);
      this.reportError(error);
      
      // Prevent the default browser error handling
      event.preventDefault();
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const error = ErrorHandler.createError(
          ErrorType.NETWORK,
          'Failed to load resource',
          'GLOBAL_003',
          {
            resource: (event.target as any)?.src || (event.target as any)?.href,
            tagName: (event.target as any)?.tagName,
          }
        );

        logger.error('Resource loading error', error);
        this.reportError(error);
      }
    }, true);
  }

  private reportError(error: any) {
    // In production, this would send errors to monitoring service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Store error for potential external service integration
        const errorReport = {
          ...error,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        };

        // Could integrate with Sentry, LogRocket, etc.
        console.error('Global error reported:', errorReport);
      } catch (reportingError) {
        logger.error('Failed to report error', reportingError);
      }
    }
  }

  // Method to manually report errors
  static reportError(error: any, context?: string) {
    const instance = GlobalErrorHandler.getInstance();
    const appError = ErrorHandler.handleGenericError(error);
    
    if (context) {
      logger.error(`Manual error report from ${context}`, appError);
    }
    
    instance.reportError(appError);
  }
}

// Initialize global error handler
export const initializeGlobalErrorHandler = () => {
  GlobalErrorHandler.getInstance();
};

export { GlobalErrorHandler };
