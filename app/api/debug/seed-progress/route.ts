import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'
import { ProgressService } from '@/features/progress/progress.service'

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const payload = await verifySessionToken(token)
  return payload?.userId || null
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const subjectId = body?.subjectId
    const value = typeof body?.value === 'number' ? body.value : 10
    const isCompleted = !!body?.isCompleted

    if (!subjectId) {
      return NextResponse.json({ success: false, error: 'subjectId is required' }, { status: 400 })
    }

    const result = await ProgressService.updateSubjectProgress(userId, { subjectId, value, isCompleted })
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
