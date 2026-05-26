import { useEffect, useState, useCallback } from 'react';
import { Progress, ProgressApiResponse } from '@/types/progress';
import { UpdateProgressPayload } from '@/features/progress/progress.types';
import { readActivities } from '@/lib/activity-local';

export function useProgress() {
  const [progressList, setProgressList] = useState<Progress[]>([]);
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
      const data: ProgressApiResponse<T> = await response.json();
      
      if (!response.ok || !data.success) {
        const serverMsg = typeof (data as any).error === 'string' ? (data as any).error : (data as any).message;
        throw new Error(serverMsg || 'An error occurred while communicating with the server.');
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
   * Fetches the overarching progress list for the authenticated user.
   */
  const fetchUserProgress = useCallback(async () => {
    try {
      const data = await fetchApi<Progress[]>('/api/progress');
      let combined: any[] = [];
      if (data) combined = data.map((d) => ({
        id: d.id,
        type: 'progress',
        taskId: d.taskId || (d as any).task_id || null,
        value: d.value,
        isCompleted: !!d.isCompleted,
        updatedAt: (d as any).updatedAt || (d as any).updated_at || (d as any).createdAt || null,
      }));

      // also fetch activity events (views, other events) and merge
      try {
        const res = await fetch('/api/activity');
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json.data)) {
            const meta = json.data.filter((i: any) => i.type !== 'progress');
            const mapped = meta.map((m: any) => ({
              id: m.id,
              type: m.type,
              noteId: m.noteId || null,
              noteTitle: m.title || null,
              createdAt: m.createdAt || m.created_at || m.updatedAt || null,
            }));
            combined = [...mapped, ...combined];
          }
        }
      } catch (e) {
        // ignore activity fetch errors
        console.warn('Failed to fetch activity', e);
      }

      const localEvents = readActivities().map((event) => ({
        id: event.id,
        type: event.type,
        noteId: event.noteId || null,
        noteTitle: event.title || null,
        createdAt: event.createdAt,
      }));

      if (localEvents.length > 0) {
        combined = [...localEvents, ...combined];
      }

      if (combined) setProgressList(combined as any);
      return data;
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  }, []);

  useEffect(() => {
    const handleActivityChanged = () => {
      void fetchUserProgress();
    };

    window.addEventListener('plms:activity-changed', handleActivityChanged);
    window.addEventListener('storage', handleActivityChanged);

    return () => {
      window.removeEventListener('plms:activity-changed', handleActivityChanged);
      window.removeEventListener('storage', handleActivityChanged);
    };
  }, [fetchUserProgress]);

  /**
   * Upserts general progress for a task or subject.
   */
  const updateProgress = useCallback(async (payload: UpdateProgressPayload) => {
    try {
      const updated = await fetchApi<Progress>('/api/progress', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (updated) {
        setProgressList((prev) => {
          const idx = prev.findIndex((p) => p.id === updated.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
          }
          return [updated, ...prev];
        });
      }
      return updated;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  }, []);

  return {
    progressList,
    isLoading,
    error,
    fetchUserProgress,
    updateProgress,
  };
}

// Merge local activity into exported types for consumers that expect mixed items
