
import { Suspense, ReactNode } from 'react';
import { logger } from '@/lib/logging/logger';

interface SuspenseWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-social-primary mx-auto mb-4"></div>
      <p className="text-social-muted">Loading...</p>
    </div>
  </div>
);

const SuspenseWrapper = ({ 
  children, 
  fallback = <LoadingSpinner />, 
  componentName 
}: SuspenseWrapperProps) => {
  return (
    <Suspense 
      fallback={
        <>
          {componentName && logger.info(`Loading ${componentName}`)}
          {fallback}
        </>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
