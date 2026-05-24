import { supabaseServer } from '../../lib/supabase-server'

export type TopicStatus = 'Not Started' | 'In Progress' | 'Completed'

export type TopicRow = {
  id: string
  subject_id: string
  name: string
  slug: string
  description?: string | null
  position?: number
  metadata?: Record<string, any>
  created_at?: string | null
  updated_at?: string | null
}

// Helper to generate a slug from the topic title/name
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export class TopicsService {
  static async create(payload: {
    subjectId: string
    title: string
    status?: TopicStatus
    estimatedHours?: number
  }) {
    try {
      const slug = slugify(payload.title);
      // Map arbitrary frontend fields seamlessly into JSONB metadata
      const metadata = {
        status: payload.status ?? 'Not Started',
        estimated_hours: payload.estimatedHours ?? null,
      }

      const { data, error } = await supabaseServer
        .from('topics')
        .insert({
          subject_id: payload.subjectId,
          name: payload.title, // Maps title payload to strict schema name
          slug,
          metadata
        })
        .select('*')
        .single()

      if (error) throw error
      return data as TopicRow
    } catch (err) {
      throw new Error(`TopicsService.create error: ${(err as Error).message}`)
    }
  }

  static async listBySubject(subjectId: string) {
    try {
      const { data, error } = await supabaseServer
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)
        .order('position', { ascending: true }) // Order by position organically

      if (error) throw error
      return (data ?? []) as TopicRow[]
    } catch (err) {
      throw new Error(`TopicsService.listBySubject error: ${(err as Error).message}`)
    }
  }

  static async listAll() {
    try {
      const { data, error } = await supabaseServer
        .from('topics')
        .select('*')
        .order('position', { ascending: true })

      if (error) throw error
      return (data ?? []) as TopicRow[]
    } catch (err) {
      throw new Error(`TopicsService.listAll error: ${(err as Error).message}`)
    }
  }

  static async listAllByUser(userId: string) {
    try {
      // Get all subjects owned by the user
      const { data: subjects, error: subError } = await supabaseServer
        .from('subjects')
        .select('id')
        .eq('owner_id', userId)

      if (subError) throw subError

      const subjectIds = (subjects ?? []).map((s) => s.id)
      if (subjectIds.length === 0) return []

      // Get all topics for those subjects
      const { data: topics, error: topError } = await supabaseServer
        .from('topics')
        .select('*')
        .in('subject_id', subjectIds)
        .order('position', { ascending: true })

      if (topError) throw topError
      return (topics ?? []) as TopicRow[]
    } catch (err) {
      throw new Error(`TopicsService.listAllByUser error: ${(err as Error).message}`)
    }
  }

  static async getById(id: string) {
    try {
      const { data, error } = await supabaseServer.from('topics').select('*').eq('id', id).single()
      if (error) throw error
      return data as TopicRow
    } catch (err) {
      throw new Error(`TopicsService.getById error: ${(err as Error).message}`)
    }
  }

  static async update(id: string, payload: { title?: string; description?: string; status?: TopicStatus; estimatedHours?: number | null }) {
    try {
      // Fetch the existing topic first to merge JSONB metadata safely without losing keys
      const { data: existing, error: fetchError } = await supabaseServer.from('topics').select('metadata').eq('id', id).single()
      if (fetchError) throw fetchError

      const updatePayload: Record<string, unknown> = {}
      
      if (payload.title !== undefined) {
        updatePayload.name = payload.title
        updatePayload.slug = slugify(payload.title)
      }
      if (payload.description !== undefined) {
        updatePayload.description = payload.description
      }

      const existingMeta = existing?.metadata || {}
      let metaChanged = false
      
      if (payload.status !== undefined) {
        existingMeta.status = payload.status
        metaChanged = true
      }
      if (payload.estimatedHours !== undefined) {
        existingMeta.estimated_hours = payload.estimatedHours
        metaChanged = true
      }

      if (metaChanged) {
        updatePayload.metadata = existingMeta
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new Error('No update fields provided.')
      }

      const { data, error } = await supabaseServer
        .from('topics')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) throw error
      return data as TopicRow
    } catch (err) {
      throw new Error(`TopicsService.update error: ${(err as Error).message}`)
    }
  }

  static async delete(id: string) {
    try {
      const { data, error } = await supabaseServer.from('topics').delete().eq('id', id).select('*').single()
      if (error) throw error
      return data as TopicRow
    } catch (err) {
      throw new Error(`TopicsService.delete error: ${(err as Error).message}`)
    }
  }
}

export default TopicsService
