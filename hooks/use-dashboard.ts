import { useEffect, useState, useCallback } from 'react';
import { useAnalytics } from './use-analytics';
import { useProgress } from './use-progress';

/**
 * High-level orchestration hook for the Dashboard.
 * Integrates Analytics and Progress streams into a unified data interface.
 */
export function useDashboard() {
  const { 
    analytics, 
    fetchSummary, 
    isLoading: isAnalyticsLoading, 
    error: analyticsError 
  } = useAnalytics();
  
  const { 
    progressList, 
    fetchUserProgress, 
    isLoading: isProgressLoading, 
    error: progressError 
  } = useProgress();

  const [isInitializing, setIsInitializing] = useState(true);

  const initData = useCallback(async () => {
    setIsInitializing(true);
    await Promise.all([
      fetchSummary(),
      fetchUserProgress()
    ]);
    setIsInitializing(false);
  }, [fetchSummary, fetchUserProgress]);

  useEffect(() => {
    initData();
  }, [initData]);

  return {
    analytics,
    progressList,
    isLoading: isInitializing || isAnalyticsLoading || isProgressLoading,
    error: analyticsError || progressError,
    refresh: initData
  };
}
