
import { useState, useCallback, useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;
  const { handleAsyncError } = useErrorHandler();
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    
    const result = await handleAsyncError(asyncFunction, 'async operation');
    
    if (result.success) {
      setState({ data: result.data, loading: false, error: null });
      onSuccess?.(result.data);
    } else {
      setState({ data: null, loading: false, error: result.error });
      onError?.(result.error);
    }
    
    return result;
  }, [asyncFunction, handleAsyncError, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, loading: false, error: null }),
  };
}
