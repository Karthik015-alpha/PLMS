import { useState, useCallback } from 'react';
import { Task, ApiResponse } from '@/types/planner';
import { CreateTaskPayload, UpdateTaskPayload } from '@/features/planner/planner.types';

export function usePlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Universal fetch helper to abstract logic for making requests
   * and handling standard API responses.
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
      
      const data: ApiResponse<T> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'An error occurred while communicating with the server.');
      }
      
      return data.data as T;
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches tasks. Pass 'pending' or 'completed' to filter.
   */
  const fetchTasks = useCallback(async (filter?: 'pending' | 'completed') => {
    try {
      const url = filter ? `/api/planner?filter=${filter}` : '/api/planner';
      const fetchedTasks = await fetchApi<Task[]>(url);
      setTasks(fetchedTasks || []);
      return fetchedTasks;
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  }, []);

  /**
   * Explicit method to fetch pending tasks.
   */
  const fetchPendingTasks = useCallback(async () => {
    return fetchTasks('pending');
  }, [fetchTasks]);

  /**
   * Create a new task.
   */
  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    try {
      const newTask = await fetchApi<Task>('/api/planner', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
      }
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing task's fields.
   */
  const updateTask = useCallback(async (payload: UpdateTaskPayload) => {
    try {
      const { id, ...updates } = payload;
      const updatedTask = await fetchApi<Task>(`/api/planner/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (updatedTask) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      }
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  /**
   * Explicitly mark a task as completed.
   */
  const markTaskCompleted = useCallback(async (taskId: string) => {
    try {
      const updatedTask = await fetchApi<Task>(`/api/planner/${taskId}?action=complete`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: true, status: 'Completed' }),
      });
      if (updatedTask) {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      }
      return updatedTask;
    } catch (err) {
      console.error('Error marking task as completed:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a task.
   */
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await fetchApi<void>(`/api/planner/${taskId}`, {
        method: 'DELETE',
      });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    fetchPendingTasks,
    createTask,
    updateTask,
    markTaskCompleted,
    deleteTask,
  };
}
