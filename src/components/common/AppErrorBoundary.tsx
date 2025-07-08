
import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logging/logger';
import { ErrorHandler, ErrorType } from '@/lib/errors/ErrorHandler';

interface Props {
  children: ReactNode;
  level?: 'app' | 'page' | 'component';
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class AppErrorBoundary extends Component<Props, State> {
  private readonly maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const level = this.props.level || 'component';
    
    // Create structured error
    const appError = ErrorHandler.createError(
      ErrorType.CLIENT,
      error.message,
      'BOUNDARY_001',
      {
        level,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      }
    );

    logger.error(`Error boundary caught error at ${level} level`, {
      error: appError,
      originalError: error,
      errorInfo,
    });

    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(appError, error, errorInfo);
    }
  }

  private reportErrorToService = (appError: any, originalError: Error, errorInfo: ErrorInfo) => {
    // This would integrate with external error reporting service
    const errorReport = {
      ...appError,
      originalStack: originalError.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // In production, send to error reporting service
    console.error('Error boundary report:', errorReport);
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Show custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const level = this.props.level || 'component';
      const canRetry = this.state.retryCount < this.maxRetries;

      // App-level error boundary
      if (level === 'app') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-social-background p-4">
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-red-600 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Application Error
                </CardTitle>
                <CardDescription>
                  The application encountered an unexpected error. Please try refreshing the page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-mono text-red-800 break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={this.handleReload} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reload App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Page-level error boundary
      if (level === 'page') {
        return (
          <div className="min-h-[400px] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-red-600 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Page Error
                </CardTitle>
                <CardDescription>
                  This page encountered an error and couldn't be displayed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm font-mono text-red-800 break-all">
                      {this.state.error.message}
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  {canRetry && (
                    <Button onClick={this.handleRetry} variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again ({this.maxRetries - this.state.retryCount} left)
                    </Button>
                  )}
                  <Button onClick={this.handleGoHome} className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Component-level error boundary (inline)
      return (
        <Alert variant="destructive" className="m-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">Component Error</p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <p className="text-xs mt-1 font-mono opacity-75">
                  {this.state.error.message}
                </p>
              )}
            </div>
            {canRetry && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={this.handleRetry}
                className="ml-4"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry ({this.maxRetries - this.state.retryCount})
              </Button>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
