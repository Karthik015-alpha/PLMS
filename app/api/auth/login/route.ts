import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import type { AuthLoginCredentials } from '@/types/auth'
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'
import { calculateNewStreak } from '@/utils/streak'

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as AuthLoginCredentials

  if (!payload?.email || !payload?.password) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'invalid-credentials',
          message: 'Email and password are required.',
        },
      },
      { status: 400 },
    )
  }

  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, display_name, metadata')
    .eq('email', payload.email)
    .maybeSingle()

  if (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'database_error',
          message: error.message,
        },
      },
      { status: 500 },
    )
  }

  if (!user || !user.email) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'invalid-credentials',
          message: 'Invalid email or password.',
        },
      },
      { status: 401 },
    )
  }

  const authData = (user.metadata as any)?.auth
  if (!authData || !authData.passwordHash || !authData.passwordSalt) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'invalid-credentials',
          message: 'Invalid email or password.',
        },
      },
      { status: 401 },
    )
  }

  const isPasswordValid = await verifyPassword(payload.password, authData.passwordHash, authData.passwordSalt)
  if (!isPasswordValid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'invalid-credentials',
          message: 'Invalid email or password.',
        },
      },
      { status: 401 },
    )
  }

  const sessionToken = await createSessionToken({ userId: user.id, email: user.email })
  const response = NextResponse.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
      },
    },
  })

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  // Update streak metadata on login (counts login as activity)
  try {
    const currentMeta = (user.metadata && typeof user.metadata === 'object') ? { ...user.metadata } : {}
    const storedStreak = Number(currentMeta.streak || 0)
    const lastStudyDate = currentMeta.lastStudyDate || currentMeta.last_study_date || null

    const calculated = calculateNewStreak(storedStreak, lastStudyDate)
    const newMeta = { ...currentMeta, streak: calculated.currentStreak, lastStudyDate: calculated.lastStudyDate }

    await supabaseServer.from('users').update({ metadata: newMeta }).eq('id', user.id)
  } catch (err) {
    // non-fatal — login should succeed even if metadata update fails
    console.error('Failed to update streak on login:', (err as Error).message)
  }

  return response
}
