import { useEffect, useState } from 'react';

export function useQueryParam(key: string): string | null {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setValue(params.get(key));
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(key));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [key]);

  return value;
}
