/**
 * Core entity interface for Progress.
 * Used globally to represent a user's learning progress.
 */
export interface Progress {
  id: string;
  userId: string;
  taskId?: string;
  subjectId?: string;
  value: number; // Expected between 0 and 100
  isCompleted: boolean;
  noteId?: string;
  startedAt?: Date | string;
  updatedAt: Date | string;
}

/**
 * Reusable wrapper for progress API responses.
 */
export interface ProgressApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type ProgressResponse = ProgressApiResponse<Progress>;
export type ProgressListResponse = ProgressApiResponse<Progress[]>;
