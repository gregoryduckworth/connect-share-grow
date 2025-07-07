
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor';

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const timerName = `query-${queryKey.join('-')}`;
      performanceMonitor.startTimer(timerName);
      try {
        const result = await queryFn();
        performanceMonitor.endTimer(timerName);
        return result;
      } catch (error) {
        performanceMonitor.endTimer(timerName);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}
