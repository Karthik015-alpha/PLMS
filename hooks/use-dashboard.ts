import { useEffect, useState, useCallback } from 'react';
import type { Topic } from '@/types/topic';
import { useAnalytics } from './use-analytics';
import { useProgress } from './use-progress';
import { useSubjects } from './use-subjects';

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

  const {
    subjects,
    fetchSubjects,
    loading: isSubjectsLoading,
    error: subjectsError,
  } = useSubjects();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isTopicsLoading, setIsTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchAllTopics = useCallback(async () => {
    try {
      setIsTopicsLoading(true);
      setTopicsError(null);
      const response = await fetch('/api/topics');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        // Normalize TopicRow to Topic format
        const normalizedTopics: Topic[] = result.data.map((item: any) => ({
          id: item.id,
          subjectId: item.subject_id ?? item.subjectId,
          title: item.name ?? item.title,
          status: item.metadata?.status ?? item.status ?? 'Not Started',
          estimatedHours: item.metadata?.estimated_hours ?? item.estimated_hours ?? item.estimatedHours,
          createdAt: item.created_at ?? item.createdAt ?? new Date().toISOString(),
          updatedAt: item.updated_at ?? item.updatedAt ?? new Date().toISOString(),
        }));
        setTopics(normalizedTopics);
      }
    } catch (error) {
      setTopicsError(error instanceof Error ? error.message : 'Failed to fetch topics');
    } finally {
      setIsTopicsLoading(false);
    }
  }, []);

  const initData = useCallback(async () => {
    setIsInitializing(true);
    const results = await Promise.allSettled([
      fetchSummary(),
      fetchUserProgress(),
      fetchSubjects(),
      fetchAllTopics(),
    ]);

    results.forEach((res, idx) => {
      if (res.status === 'rejected') {
        console.error('Dashboard init task failed (index=' + idx + ')', res.reason);
      }
    });

    setIsInitializing(false);
  }, [fetchSummary, fetchUserProgress, fetchSubjects, fetchAllTopics]);

  useEffect(() => {
    initData();
  }, [initData]);

  return {
    analytics,
    subjects,
    topics,
    progressList,
    isLoading: isInitializing || isAnalyticsLoading || isProgressLoading || isSubjectsLoading || isTopicsLoading,
    error: analyticsError || progressError || subjectsError || topicsError,
    // `refresh` removed: avoid exposing imperative refresh from the hook
  };
}
