
import { logger } from '@/lib/logging/logger';

export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
  userId?: string;
}

export class ErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    code?: string | number,
    details?: any
  ): AppError {
    return {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  static handleAuthError(error: any): AppError {
    logger.error('Authentication error occurred', error);
    
    if (error?.code === 'INVALID_CREDENTIALS') {
      return this.createError(
        ErrorType.AUTHENTICATION,
        'Invalid email or password',
        'AUTH_001'
      );
    }
    
    if (error?.code === 'ACCOUNT_LOCKED') {
      return this.createError(
        ErrorType.AUTHENTICATION,
        'Account temporarily locked due to too many failed attempts',
        'AUTH_002'
      );
    }
    
    if (error?.code === 'SESSION_EXPIRED') {
      return this.createError(
        ErrorType.AUTHENTICATION,
        'Your session has expired. Please log in again',
        'AUTH_003'
      );
    }
    
    return this.createError(
      ErrorType.AUTHENTICATION,
      'Authentication failed. Please try again',
      'AUTH_000'
    );
  }

  static handleValidationError(error: any): AppError {
    logger.warn('Validation error occurred', error);
    
    const message = Array.isArray(error?.issues) 
      ? error.issues.map((issue: any) => issue.message).join(', ')
      : error?.message || 'Invalid input provided';
    
    return this.createError(
      ErrorType.VALIDATION,
      message,
      'VAL_001',
      error
    );
  }

  static handleNetworkError(error: any): AppError {
    logger.error('Network error occurred', error);
    
    if (!navigator.onLine) {
      return this.createError(
        ErrorType.NETWORK,
        'No internet connection. Please check your network and try again',
        'NET_001'
      );
    }
    
    if (error?.code === 'TIMEOUT') {
      return this.createError(
        ErrorType.NETWORK,
        'Request timed out. Please try again',
        'NET_002'
      );
    }
    
    return this.createError(
      ErrorType.NETWORK,
      'Network error occurred. Please try again',
      'NET_000'
    );
  }

  static handleGenericError(error: any): AppError {
    logger.error('Generic error occurred', error);
    
    return this.createError(
      ErrorType.UNKNOWN,
      error?.message || 'An unexpected error occurred',
      'GEN_000',
      error
    );
  }

  static getErrorMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.AUTHENTICATION:
        return error.message;
      case ErrorType.VALIDATION:
        return `Validation Error: ${error.message}`;
      case ErrorType.NETWORK:
        return `Connection Error: ${error.message}`;
      case ErrorType.PERMISSION:
        return `Permission Error: ${error.message}`;
      case ErrorType.NOT_FOUND:
        return `Not Found: ${error.message}`;
      default:
        return error.message;
    }
  }

  static shouldRetry(error: AppError): boolean {
    return error.type === ErrorType.NETWORK && error.code !== 'NET_001';
  }
}
