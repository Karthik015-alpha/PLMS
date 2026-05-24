import { supabaseServer } from '@/lib/supabase-server';
import { Progress } from '@/types/progress';
import { UpdateProgressInput, UpdateSubjectProgressInput } from './progress.validation';

const TABLE_NAME = 'progress';

const mapToProgress = (row: any): Progress => ({
  id: row.id,
  userId: row.user_id,
  taskId: row.task_id,
  subjectId: row.subject_id,
  value: row.value,
  isCompleted: row.is_completed ?? false,
  noteId: row.note_id,
  startedAt: row.started_at,
  updatedAt: row.updated_at,
});

export class ProgressService {
  /**
   * Fetch all progress records for a specific user.
   */
  static async getUserProgress(userId: string): Promise<Progress[]> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user progress: ${error.message}`);
    return (data || []).map(mapToProgress);
  }

  /**
   * Fetch progress specific to a subject.
   */
  static async getSubjectProgress(userId: string, subjectId: string): Promise<Progress | null> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .eq('subject_id', subjectId)
      .is('task_id', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch subject progress: ${error.message}`);
    }
    return mapToProgress(data);
  }

  /**
   * Fetch progress specific to a task.
   */
  static async getTaskProgress(userId: string, taskId: string): Promise<Progress | null> {
    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch task progress: ${error.message}`);
    }
    return mapToProgress(data);
  }

  /**
   * Create or update a task's progress record.
   */
  static async upsertTaskProgress(userId: string, payload: UpdateProgressInput): Promise<Progress> {
    const updates = {
      user_id: userId,
      task_id: payload.taskId,
      subject_id: payload.subjectId || null,
      note_id: payload.noteId || null,
      value: payload.value,
      is_completed: payload.isCompleted,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .upsert(updates, { onConflict: 'user_id, task_id' })
      .select()
      .single();

    if (error) throw new Error(`Failed to update task progress: ${error.message}`);
    return mapToProgress(data);
  }

  /**
   * Mark a task as explicitly completed.
   */
  static async markTaskCompleted(userId: string, taskId: string): Promise<Progress> {
    const updates = {
      user_id: userId,
      task_id: taskId,
      value: 100,
      is_completed: true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from(TABLE_NAME)
      .upsert(updates, { onConflict: 'user_id, task_id' })
      .select()
      .single();

    if (error) throw new Error(`Failed to mark task complete: ${error.message}`);
    return mapToProgress(data);
  }

  /**
   * Create or update subject-level progress.
   */
  static async updateSubjectProgress(userId: string, payload: UpdateSubjectProgressInput): Promise<Progress> {
    const updates = {
      user_id: userId,
      subject_id: payload.subjectId,
      value: payload.value,
      is_completed: payload.isCompleted,
      updated_at: new Date().toISOString(),
    };

    const existing = await this.getSubjectProgress(userId, payload.subjectId);
    
    let result;
    if (existing) {
      result = await supabaseServer
        .from(TABLE_NAME)
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabaseServer
        .from(TABLE_NAME)
        .insert([updates])
        .select()
        .single();
    }

    if (result.error) throw new Error(`Failed to update subject progress: ${result.error.message}`);
    return mapToProgress(result.data);
  }
}
