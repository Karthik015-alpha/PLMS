import { supabaseServer } from '../lib/supabase-server'

export type TopicStatus = 'Not Started' | 'In Progress' | 'Completed'

export async function calculateProgressForSubject(subjectId: string): Promise<number> {
  try {
    const { data, error } = await supabaseServer
      .from('topics')
      .select('metadata')
      .eq('subject_id', subjectId)

    if (error) throw error

    // Assert correctly parsing the JSONB metadata payload mapping the implicit status
    const rows = Array.isArray(data) ? data as Array<{ metadata?: { status?: string } | null }> : []
    const total = rows.length
    if (total === 0) return 0

    let totalPoints = 0
    for (const r of rows) {
      const status = r.metadata?.status
      if (status === 'Completed') {
        totalPoints += 100
      } else if (status === 'In Progress') {
        totalPoints += 50
      }
    }

    return Math.round(totalPoints / total)
  } catch (err) {
    throw new Error(`calculateProgressForSubject failed: ${(err as Error).message}`)
  }
}

export function computeProgress(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}
