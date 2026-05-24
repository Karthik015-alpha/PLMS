import { Progress } from '@/types/progress';

// ==================================================
// PAYLOAD TYPES
// ==================================================

/**
 * Payload to update generic progress.
 */
export interface UpdateProgressPayload {
  taskId: string;
  value: number; // 0-100
  subjectId?: string;
  noteId?: string;
  isCompleted?: boolean;
}

/**
 * Payload for explicitly marking a task as completed.
 */
export interface MarkTaskCompletedPayload {
  taskId: string;
  isCompleted: true;
}

/**
 * Payload to update overall subject-level progress.
 */
export interface UpdateSubjectProgressPayload {
  subjectId: string;
  value: number; // 0-100
  isCompleted?: boolean;
}

// ==================================================
// COMPONENT PROP TYPES
// ==================================================

/**
 * Component properties for a progress bar or tracker UI element.
 */
export interface ProgressTrackerProps {
  progress: Progress;
  onUpdate?: (payload: UpdateProgressPayload) => Promise<void> | void;
  isLoading?: boolean;
}

/**
 * Local state interface for progress management hooks.
 */
export interface ProgressState {
  progressList: Progress[];
  isLoading: boolean;
  error: string | null;
}
