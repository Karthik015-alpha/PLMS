import { supabaseServer } from '@/lib/supabase-server';
import { Analytics } from '@/types/analytics';
import { calculateNewStreak } from '@/utils/streak';

export class AnalyticsService {
  /**
   * Get total subjects belonging to the user.
   */
  static async getTotalSubjects(userId: string): Promise<number> {
    const { count, error } = await supabaseServer
      .from('subjects')
      .select('*', { count: 'exact', head: true })
      .eq('owner', userId);
      
    if (error) throw new Error(`Failed to count subjects: ${error.message}`);
    return count || 0;
  }

  /**
   * Get total topics and completed topics linked to subjects owned by the user.
   */
  static async getTopicsMetrics(userId: string): Promise<{ total: number, completed: number, inProgress: number }> {
    const { data: subjects, error: subjErr } = await supabaseServer
      .from('subjects')
      .select('id')
      .eq('owner', userId);
      
    if (subjErr) throw new Error(`Failed to fetch user subjects: ${subjErr.message}`);
    
    const subjectIds = (subjects || []).map(s => s.id);
    if (subjectIds.length === 0) return { total: 0, completed: 0, inProgress: 0 };
    
    const { data: topics, error } = await supabaseServer
      .from('topics')
      .select('metadata')
      .in('subject_id', subjectIds);
      
    if (error) throw new Error(`Failed to fetch topics: ${error.message}`);
    
    let total = 0;
    let completed = 0;
    let inProgress = 0;

    for (const topic of topics || []) {
      total += 1;
      const status = topic?.metadata?.status;
      if (!status) continue;
      const normalized = String(status).trim().toLowerCase();
      if (normalized === 'completed') {
        completed += 1;
      } else if (normalized === 'in progress' || normalized === 'inprogress' || normalized === 'in-progress') {
        inProgress += 1;
      }
    }

    return { total, completed, inProgress };
  }

  /**
   * Get aggregated task metrics using the public.subject_progress view.
   */
  static async getTasksMetrics(userId: string): Promise<{ total: number, completed: number, pending: number }> {
    const { data: subjects, error: subjErr } = await supabaseServer
      .from('subjects')
      .select('id')
      .eq('owner', userId);
      
    if (subjErr) throw new Error(`Failed to fetch subjects: ${subjErr.message}`);
    
    const subjectIds = (subjects || []).map(s => s.id);
    
    let viewData: any[] = [];
    if (subjectIds.length > 0) {
      const { data, error: viewErr } = await supabaseServer
        .from('subject_progress')
        .select('total_tasks, completed_by_user')
        .in('subject_id', subjectIds);
        
      if (viewErr) throw new Error(`Failed to fetch subject_progress view: ${viewErr.message}`);
      viewData = data || [];
    }
    
    // Fetch global/orphaned tasks (from the Planner)
    const { data: orphanedTasks } = await supabaseServer
      .from('tasks')
      .select('status')
      .is('subject_id', null)
      .eq('owner', userId);

    let total = 0;
    let completed = 0;
    
    for (const row of viewData || []) {
      total += row.total_tasks || 0;
      completed += row.completed_by_user || 0;
    }

    for (const task of orphanedTasks || []) {
      total += 1;
      if (task.status === 'done') {
        completed += 1;
      }
    }
    
    return {
      total,
      completed,
      pending: total - completed
    };
  }

  /**
   * Get total notes belonging to the user from notes_metadata.
   */
  static async getTotalNotes(userId: string): Promise<number> {
    const { count, error } = await supabaseServer
      .from('notes_metadata')
      .select('*', { count: 'exact', head: true })
      .eq('owner', userId);

    if (error) throw new Error(`Failed to count notes: ${error.message}`);
    return count || 0;
  }

  /**
   * Fetch complete analytics summary for a user.
   */
  static async getAnalyticsSummary(userId: string): Promise<Analytics> {
    const [
      totalSubjects,
      topicsMetrics,
      tasksMetrics,
      totalNotes,
    ] = await Promise.all([
      this.getTotalSubjects(userId),
      this.getTopicsMetrics(userId),
      this.getTasksMetrics(userId),
      this.getTotalNotes(userId),
    ]);

    // Retrieve the user's latest study activity to calculate streak
    const { data: lastProgress, error: progErr } = await supabaseServer
      .from('progress')
      .select('updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    let streakCount = 0;

    // Fetch the user's existing metadata which might store the current streak count
    const { data: user, error: userErr } = await supabaseServer
      .from('users')
      .select('metadata')
      .eq('id', userId)
      .single();

    const storedStreak = user && !userErr && user.metadata ? (user.metadata as any).streak || 0 : 0;

    if (!progErr && lastProgress) {
      // Calculate dynamic streak based on today's date against last activity
      const calculated = calculateNewStreak(storedStreak, lastProgress.updated_at);
      streakCount = calculated.currentStreak;
    }

    // Combined (tasks + topics) completion rate — keep as `completionRate`
    const totalCombined = tasksMetrics.total + topicsMetrics.total;
    const completedCombined = tasksMetrics.completed + topicsMetrics.completed;
    const completionRate = totalCombined > 0
      ? Math.round((completedCombined / totalCombined) * 100)
      : 0;

    // Topics-only weighted formula (Completed=1.0, InProgress=0.5)
    const topicsWeightedScore = (topicsMetrics.completed || 0) + 0.5 * (topicsMetrics.inProgress || 0);
    const topicsCompletionRate = topicsMetrics.total > 0
      ? Math.round((topicsWeightedScore / topicsMetrics.total) * 100)
      : 0;

    // Tasks-only completion rate
    const tasksCompletionRate = tasksMetrics.total > 0
      ? Math.round((tasksMetrics.completed / tasksMetrics.total) * 100)
      : 0;

    // Set overallProgress to tasks-only per request
    const overallProgress = tasksCompletionRate;

    return {
      totalSubjects,
      totalTopics: topicsMetrics.total,
      totalTasks: tasksMetrics.total,
      completedTasks: tasksMetrics.completed,
      pendingTasks: tasksMetrics.pending,
      completionRate,
      overallProgress,
      topicsCompletionRate,
      streakCount,
      totalNotes,
    };
  }
}
