
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ErrorHandler, ErrorType, AppError } from '@/lib/errors/ErrorHandler';
import { logger } from '@/lib/logging/logger';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: any, context?: string) => {
    let appError: AppError;

    // Determine error type and create appropriate AppError
    if (error?.name === 'ZodError') {
      appError = ErrorHandler.handleValidationError(error);
    } else if (error?.type === ErrorType.AUTHENTICATION) {
      appError = ErrorHandler.handleAuthError(error);
    } else if (error?.type === ErrorType.NETWORK) {
      appError = ErrorHandler.handleNetworkError(error);
    } else {
      appError = ErrorHandler.handleGenericError(error);
    }

    // Log error with context
    if (context) {
      logger.error(`Error in ${context}`, { error: appError, originalError: error });
    }

    // Show user-friendly toast
    toast({
      variant: 'destructive',
      title: getToastTitle(appError.type),
      description: ErrorHandler.getErrorMessage(appError),
    });

    return appError;
  }, [toast]);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context?: string,
    options?: {
      showSuccessToast?: boolean;
      successMessage?: string;
      retryCount?: number;
    }
  ) => {
    const { showSuccessToast, successMessage, retryCount = 0 } = options || {};
    
    try {
      const result = await asyncFn();
      
      if (showSuccessToast) {
        toast({
          title: 'Success',
          description: successMessage || 'Operation completed successfully',
        });
      }
      
      return { success: true, data: result, error: null };
    } catch (error) {
      const appError = handleError(error, context);
      
      // Retry logic for network errors
      if (ErrorHandler.shouldRetry(appError) && retryCount > 0) {
        logger.info(`Retrying operation, attempts remaining: ${retryCount}`);
        return handleAsyncError(asyncFn, context, { ...options, retryCount: retryCount - 1 });
      }
      
      return { success: false, data: null, error: appError };
    }
  }, [handleError, toast]);

  return {
    handleError,
    handleAsyncError,
  };
};

const getToastTitle = (errorType: ErrorType): string => {
  switch (errorType) {
    case ErrorType.AUTHENTICATION:
      return 'Authentication Error';
    case ErrorType.VALIDATION:
      return 'Invalid Input';
    case ErrorType.NETWORK:
      return 'Connection Error';
    case ErrorType.PERMISSION:
      return 'Access Denied';
    case ErrorType.NOT_FOUND:
      return 'Not Found';
    default:
      return 'Error';
  }
};
