import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

interface UseApiOptions<T, R> {
  immediate?: boolean;
  select?: (raw: R) => T; // transform function
  onSuccess?: (data: T) => void;
  onError?: (message: string, raw?: unknown) => void;
  deps?: unknown[]; // dependency list to trigger refetch
}

export function useApi<T = unknown, R = T>(
  fn: (config?: AxiosRequestConfig) => Promise<R>,
  { immediate = true, select, onSuccess, onError, deps = [] }: UseApiOptions<T, R> = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const mounted = useRef(true);

  const exec = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fn();
      const result: T = select ? select(response) : (response as unknown as T);
      if (mounted.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (e: unknown) {
      let message = 'Request failed';
      if (e && typeof e === 'object' && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
        message = (e as { message: string }).message;
      }
      if (mounted.current) {
        setError(message);
        onError?.(message, e);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [fn, select, onSuccess, onError]);

  useEffect(() => {
    mounted.current = true;
    if (immediate) exec();
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: exec };
}
