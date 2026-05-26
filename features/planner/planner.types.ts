import { Task, ApiResponse } from '@/types/planner';

// ==================================================
// PAYLOAD TYPES
// ==================================================

/**
 * Payload required to create a new task.
 * Excludes server-generated fields like id, createdAt, updatedAt.
 */
export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: Date | string;
  subjectId?: string;
  completed?: boolean;
}

/**
 * Payload required to update an existing task.
 * All fields except ID are optional.
 */
export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  id: string;
}

// ==================================================
// API TYPES
// ==================================================

/**
 * Response when creating/updating/fetching a single task
 */
export type PlannerTaskResponse = ApiResponse<Task>;

/**
 * Response when fetching multiple tasks
 */
export type PlannerTasksResponse = ApiResponse<Task[]>;

// ==================================================
// FORM / COMPONENT PROP TYPES
// ==================================================

/**
 * Props for a task creation/edit form component
 */
export interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

/**
 * Props for displaying a single task item
 */
export interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => Promise<void> | void;
  onToggleComplete?: (taskId: string, currentStatus: boolean) => Promise<void> | void;
  isLoading?: boolean;
}

/**
 * Props for displaying a list of tasks
 */
export interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => Promise<void> | void;
  onToggleComplete?: (taskId: string, currentStatus: boolean) => Promise<void> | void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}
