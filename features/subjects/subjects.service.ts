import { supabaseServer } from '../../lib/supabase-server'
import { calculateProgressForSubject } from '../../utils/progress'

export type SubjectRow = {
  id: string
  name: string
  slug: string
  description?: string | null
  owner?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export type SubjectWithProgress = SubjectRow & {
  progress: number
}

// helper to generate a slug from the title
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export class SubjectsService {
  static async create(payload: { title: string; description?: string; ownerId?: string }) {
    try {
      const slug = slugify(payload.title);
      const { data, error } = await supabaseServer
        .from('subjects')
        .insert({
          name: payload.title,
          slug,
          description: payload.description ?? null,
          owner: payload.ownerId ?? null,
        })
        .select('*')
        .single()

      if (error) throw error
      return data as SubjectRow
    } catch (err) {
      throw new Error(`SubjectsService.create error: ${(err as Error).message}`)
    }
  }

  static async list(ownerId?: string) {
    try {
      let query = supabaseServer.from('subjects').select('*')
      if (ownerId) query = query.eq('owner', ownerId)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error

      const rows = (data ?? []) as SubjectRow[]
      const subjectsWithProgress = await Promise.all(
        rows.map(async (subject) => ({
          ...subject,
          progress: await calculateProgressForSubject(subject.id),
        })),
      )

      return subjectsWithProgress as SubjectWithProgress[]
    } catch (err) {
      throw new Error(`SubjectsService.list error: ${(err as Error).message}`)
    }
  }

  static async getById(id: string) {
    try {
      const { data, error } = await supabaseServer.from('subjects').select('*').eq('id', id).single()
      if (error) throw error
      const subject = data as SubjectRow
      const progress = await calculateProgressForSubject(subject.id)
      return { ...subject, progress } as SubjectWithProgress
    } catch (err) {
      throw new Error(`SubjectsService.getById error: ${(err as Error).message}`)
    }
  }

  static async update(id: string, payload: { title?: string; description?: string | null }) {
    try {
      const updatePayload: Record<string, string | null> = {}
      if (payload.title !== undefined) {
        updatePayload.name = payload.title
        updatePayload.slug = slugify(payload.title)
      }
      if (payload.description !== undefined) {
        updatePayload.description = payload.description
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new Error('No update fields provided.')
      }

      const { data, error } = await supabaseServer
        .from('subjects')
        .update(updatePayload)
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      return data as SubjectRow
    } catch (err) {
      throw new Error(`SubjectsService.update error: ${(err as Error).message}`)
    }
  }

  static async delete(id: string) {
    try {
      // Delete child topics first to respect foreign keys if cascade isn't on
      const { error: delTopicsError } = await supabaseServer.from('topics').delete().eq('subject_id', id)
      if (delTopicsError) throw delTopicsError

      const { data, error } = await supabaseServer.from('subjects').delete().eq('id', id).select('*').single()
      if (error) throw error
      return data as SubjectRow
    } catch (err) {
      throw new Error(`SubjectsService.delete error: ${(err as Error).message}`)
    }
  }
}

export default SubjectsService
