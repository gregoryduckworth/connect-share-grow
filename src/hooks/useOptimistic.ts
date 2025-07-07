
import { useState, useCallback } from 'react';
import { logger } from '@/lib/logging/logger';

export function useOptimistic<T>(
  initialState: T,
  updateFn: (state: T, action: any) => T
) {
  const [state, setState] = useState(initialState);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const optimisticUpdate = useCallback(
    async (action: any, asyncFn: () => Promise<any>) => {
      // Apply optimistic update
      const optimisticState = updateFn(state, action);
      setState(optimisticState);
      setIsOptimistic(true);

      try {
        // Execute async operation
        const result = await asyncFn();
        
        // If successful, the optimistic update was correct
        setIsOptimistic(false);
        logger.info('Optimistic update succeeded');
        
        return result;
      } catch (error) {
        // Revert optimistic update on error
        setState(state);
        setIsOptimistic(false);
        logger.error('Optimistic update failed, reverting', { error });
        throw error;
      }
    },
    [state, updateFn]
  );

  return [state, optimisticUpdate, isOptimistic] as const;
}
