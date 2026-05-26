/**
 * Core entity interface for a Task.
 * Used globally across the application to represent a Planner Task.
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId?: string | null;
  completed: boolean;
  status?: 'Pending' | 'Completed';
  dueDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Generic API Response wrapper.
 * Reusable interface for standardized API responses.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Standard API responses for Planner module.
 */
export type TaskResponse = ApiResponse<Task>;
export type TasksListResponse = ApiResponse<Task[]>;
