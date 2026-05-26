import { supabaseServer } from '@/lib/supabase-server';
import { Task } from '@/types/planner';
import { CreateTaskInput, UpdateTaskInput } from './planner.validation';

const TABLE_NAME = 'tasks';

/**
 * Maps database row back to frontend Task interface.
 * Seamlessly converts postgres task_status enums to the simpler UI statuses.
 */
const mapToTask = (row: any): Task => {
  const isCompleted = row.status === 'done';
  return {
    id: row.id,
    title: row.title,
    description: row.details || row.short || '', // Map db details back to description
    subjectId: row.subject_id || row.subjectId || null,
    completed: isCompleted,
    status: isCompleted ? 'Completed' : 'Pending', // Map to UI Enums
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Helper to convert UI status ('Pending' | 'Completed') to Postgres task_status enum
 */
const toDbStatus = (uiStatus: string | undefined, isCompleted: boolean | undefined) => {
  if (isCompleted === true || uiStatus === 'Completed') return 'done';
  if (isCompleted === false || uiStatus === 'Pending') return 'todo';
  return 'todo'; // default
};

export class PlannerService {
  /**
   * Fetch all tasks.
   */
  static async getAllTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('owner', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return (data || []).map(mapToTask);
  }

  /**
   * Fetch a single task by ID.
   */
  static async getTaskById(taskId: string, userId: string): Promise<Task | null> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('id', taskId)
      .eq('owner', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return mapToTask(data);
  }

  /**
   * Fetch all pending tasks.
   * Maps 'Pending' to the corresponding DB enum ('todo', 'in_progress', 'blocked', 'review')
   */
  static async getPendingTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('owner', userId)
      .neq('status', 'done') // Anything not 'done' or 'cancelled' is conceptually "Pending"
      .neq('status', 'cancelled')
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) {
      throw new Error(`Failed to fetch pending tasks: ${error.message}`);
    }

    return (data || []).map(mapToTask);
  }

  /**
   * Fetch all completed tasks.
   */
  static async getCompletedTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('owner', userId)
      .eq('status', 'done')
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch completed tasks: ${error.message}`);
    }

    return (data || []).map(mapToTask);
  }

  /**
   * Create a new task.
   */
  static async createTask(payload: CreateTaskInput, userId: string): Promise<Task> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .insert([
        {
          owner: userId,
          title: payload.title,
          details: payload.description || null, // Map description to details
          subject_id: payload.subjectId || null,
          due_date: payload.dueDate || null,
          status: toDbStatus(payload.status, payload.isCompleted),
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return mapToTask(data);
  }

  /**
   * Update an existing task.
   */
  static async updateTask(taskId: string, payload: UpdateTaskInput, userId: string): Promise<Task> {
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    
    if (payload.title !== undefined) updates.title = payload.title;
    if (payload.description !== undefined) updates.details = payload.description; // Map description to details
    if (payload.subjectId !== undefined) updates.subject_id = payload.subjectId;
    if (payload.dueDate !== undefined) updates.due_date = payload.dueDate;
    
    if (payload.isCompleted !== undefined || payload.status !== undefined) {
      updates.status = toDbStatus(payload.status, payload.isCompleted);
    }

    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', taskId)
      .eq('owner', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return mapToTask(data);
  }

  /**
   * Mark a task as completed.
   */
  static async markTaskCompleted(taskId: string, userId: string): Promise<Task> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .update({
        status: 'done',
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('owner', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to mark task as completed: ${error.message}`);
    }

    return mapToTask(data);
  }

  /**
   * Delete a task.
   */
  static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const { error: progressError } = await supabaseServer
      .from('progress')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId);

    if (progressError) {
      throw new Error(`Failed to remove task progress: ${progressError.message}`);
    }

    const { error } = await supabaseServer
      .from(TABLE_NAME)
      .delete()
      .eq('id', taskId)
      .eq('owner', userId);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }
}
