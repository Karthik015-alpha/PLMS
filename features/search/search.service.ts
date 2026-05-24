import { supabaseServer } from '@/lib/supabase-server';
import { SearchResult } from '@/types/search';

export interface GroupedSearchResults {
  subjects: SearchResult[];
  topics: SearchResult[];
  tasks: SearchResult[];
  notes: SearchResult[];
  totalCount: number;
}

export class SearchService {
  /**
   * Executes a robust global search spanning across subjects, topics, tasks, and notes.
   * Utilizes PostgreSQL full-text search vectors with ILIKE fallbacks where appropriate.
   */
  static async globalSearch(
    userId: string,
    query: string,
    filters?: any,
    pagination?: any
  ): Promise<GroupedSearchResults> {
    const limit = pagination?.limit || 20;
    const queryLike = `%${query}%`;
    const ftsQuery = `'${query}'`; // Basic phrasing for full text search

    // 1. Resolve ownership context. 
    // Since we use Service Role Key, we MUST explicitly scope queries to the user.
    const { data: userSubjects } = await supabaseServer
      .from('subjects')
      .select('id')
      .eq('owner', userId);
      
    let allowedSubjectIds = (userSubjects || []).map((s: any) => s.id);

    // Apply explicit subject filters if provided
    if (filters?.subjects && filters.subjects.length > 0) {
      allowedSubjectIds = allowedSubjectIds.filter(id => filters.subjects!.includes(id));
    }

    if (allowedSubjectIds.length === 0) {
      // Early exit if the user has no subjects and/or filters restricted everything out
      // Notes can still belong to the user without a linked_subject strictly, but standardizing.
    }

    // Prepare async query promises to execute in parallel
    const promises = [];

    // --- 1. SUBJECTS SEARCH ---
    let subjectsQuery = supabaseServer
      .from('subjects')
      .select('id, name, description, created_at')
      .eq('owner', userId)
      .ilike('name', queryLike)
      .limit(limit);

    if (filters?.subjects && filters.subjects.length > 0) {
      subjectsQuery = subjectsQuery.in('id', filters.subjects);
    }
    promises.push(subjectsQuery);

    // --- 2. TOPICS SEARCH ---
    let topicsQuery = supabaseServer
      .from('topics')
      .select('id, name, description, subject_id, created_at')
      .in('subject_id', allowedSubjectIds)
      .ilike('name', queryLike)
      .limit(limit);
      
    if (filters?.topics && filters.topics.length > 0) {
      topicsQuery = topicsQuery.in('id', filters.topics);
    }
    promises.push(topicsQuery);

    // --- 3. TASKS SEARCH ---
    let tasksQuery = supabaseServer
      .from('tasks')
      .select('id, title, details, subject_id, topic_id, created_at')
      .in('subject_id', allowedSubjectIds)
      .limit(limit);

    if (filters?.topics && filters.topics.length > 0) {
      tasksQuery = tasksQuery.in('topic_id', filters.topics);
    }
    if (filters?.taskStatuses && filters.taskStatuses.length > 0) {
      tasksQuery = tasksQuery.in('status', filters.taskStatuses);
    }
    
    // Attempt Full-Text Search via search_vector first
    tasksQuery = tasksQuery.textSearch('search_vector', ftsQuery, { config: 'english', type: 'websearch' });
    promises.push(tasksQuery);

    // --- 4. NOTES SEARCH ---
    let notesQuery = supabaseServer
      .from('notes_metadata')
      .select('id, title, filename, linked_subject, linked_topic, linked_task, created_at')
      .eq('owner', userId)
      .or(`title.ilike.${queryLike},filename.ilike.${queryLike}`)
      .limit(limit);

    if (filters?.subjects && filters.subjects.length > 0) {
      notesQuery = notesQuery.in('linked_subject', filters.subjects);
    }
    if (filters?.topics && filters.topics.length > 0) {
      notesQuery = notesQuery.in('linked_topic', filters.topics);
    }
    promises.push(notesQuery);

    // Execute concurrently
    let [subjRes, topRes, taskRes, noteRes] = await Promise.all(promises);

    // ILIKE Fallback for Tasks if Full-Text Search yielded no results
    if (!taskRes.error && (!taskRes.data || taskRes.data.length === 0)) {
      let fallbackTasksQuery = supabaseServer
        .from('tasks')
        .select('id, title, details, subject_id, topic_id, created_at')
        .in('subject_id', allowedSubjectIds)
        .or(`title.ilike.${queryLike},details.ilike.${queryLike}`)
        .limit(limit);

      if (filters?.topics && filters.topics.length > 0) fallbackTasksQuery = fallbackTasksQuery.in('topic_id', filters.topics);
      if (filters?.taskStatuses && filters.taskStatuses.length > 0) fallbackTasksQuery = fallbackTasksQuery.in('status', filters.taskStatuses);

      taskRes = await fallbackTasksQuery;
    }

    // Map rows cleanly to the standardized SearchResult TypeScript interface
    const mapToSearchType = (rows: any[], type: 'subject'|'topic'|'task'|'note', titleKey: string, descKey?: string) => {
      return (rows || []).map(row => ({
        id: row.id,
        type,
        title: row[titleKey] || 'Untitled',
        description: descKey ? row[descKey] : undefined,
        subjectId: row.subject_id || row.linked_subject,
        topicId: row.topic_id || row.linked_topic,
        createdAt: row.created_at,
      } as SearchResult));
    };

    const subjects = mapToSearchType(subjRes.data || [], 'subject', 'name', 'description');
    const topics = mapToSearchType(topRes.data || [], 'topic', 'name', 'description');
    const tasks = mapToSearchType(taskRes.data || [], 'task', 'title', 'details');
    // For notes, we prefer the 'title' but fallback to 'filename'
    const notes = (noteRes.data || []).map((row: any) => ({
      id: row.id,
      type: 'note',
      title: row.title || row.filename || 'Untitled Note',
      subjectId: row.linked_subject,
      topicId: row.linked_topic,
      createdAt: row.created_at,
    } as SearchResult));

    const totalCount = subjects.length + topics.length + tasks.length + notes.length;

    return {
      subjects,
      topics,
      tasks,
      notes,
      totalCount
    };
  }
}
