import { useState, useCallback } from 'react';
import { Analytics, AnalyticsApiResponse } from '@/types/analytics';
import { AnalyticsFilterPayload } from '@/features/analytics/analytics.types';

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Universal fetch helper to abstract logic for making requests
   */
  const fetchApi = async <T,>(url: string, options?: RequestInit): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      const data: AnalyticsApiResponse<T> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'An error occurred while fetching analytics.');
      }
      
      return data.data as T;
    } catch (err: any) {
      const message = err?.message || 'An unknown error occurred.';
      setError(message);
      throw new Error(`${message} (fetch ${url})`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches the analytics summary. If filters are provided, sends them as a POST request.
   */
  const fetchSummary = useCallback(async (filters?: AnalyticsFilterPayload) => {
    try {
      let data;
      if (filters) {
        data = await fetchApi<Analytics>('/api/analytics', {
          method: 'POST',
          body: JSON.stringify(filters)
        });
      } else {
        data = await fetchApi<Analytics>('/api/analytics');
      }
      
      if (data) {
        setAnalytics(data);
      }
      return data;
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  }, []);

  return {
    analytics,
    isLoading,
    error,
    fetchSummary,
  };
}
