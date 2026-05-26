import { supabaseServer } from '@/lib/supabase-server'

export type UserProfile = {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  metadata: Record<string, any> | null
}

export class UsersService {
  static async getProfile(userId: string): Promise<UserProfile> {
    try {
      const { data, error } = await supabaseServer
        .from('users')
        .select('id, email, display_name, avatar_url, metadata')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (err) {
      throw new Error(`UsersService.getProfile error: ${(err as Error).message}`)
    }
  }

  static async updateProfile(
    userId: string,
    payload: { displayName?: string; role?: string },
  ): Promise<UserProfile> {
    try {
      // fetch current metadata to merge role without overwriting other keys
      const { data: current, error: fetchErr } = await supabaseServer
        .from('users')
        .select('metadata')
        .eq('id', userId)
        .single()

      if (fetchErr) throw fetchErr

      const currentMetadata = (current && current.metadata) || {}
      const newMetadata = { ...currentMetadata }
      if (payload.role !== undefined) {
        newMetadata.role = payload.role
      }

      const updateObj: Record<string, any> = {}
      if (payload.displayName !== undefined) updateObj.display_name = payload.displayName
      if (payload.role !== undefined) updateObj.metadata = newMetadata

      const { data, error } = await supabaseServer
        .from('users')
        .update(updateObj)
        .eq('id', userId)
        .select('id, email, display_name, avatar_url, metadata')
        .single()

      if (error) throw error
      return data as UserProfile
    } catch (err) {
      throw new Error(`UsersService.updateProfile error: ${(err as Error).message}`)
    }
  }
}

export default UsersService
