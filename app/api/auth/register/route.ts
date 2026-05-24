import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabaseServer } from '@/lib/supabase-server'
import type { AuthRegisterPayload } from '@/types/auth'
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as AuthRegisterPayload

  if (!payload?.email || !payload?.password || !payload?.fullName) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'invalid-credentials',
          message: 'Email, password, and full name are required.',
        },
      },
      { status: 400 },
    )
  }

  const { data: existingUser, error: existingError } = await supabaseServer
    .from('users')
    .select('id')
    .eq('email', payload.email)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'database_error',
          message: existingError.message,
        },
      },
      { status: 500 },
    )
  }

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'email_taken',
          message: 'An account with that email already exists.',
        },
      },
      { status: 409 },
    )
  }

  const { hash, salt } = await hashPassword(payload.password)
  const userId = randomUUID()
  const { data: newUser, error: insertError } = await supabaseServer
    .from('users')
    .insert([
      {
        id: userId,
        email: payload.email,
        display_name: payload.fullName,
        metadata: {
          auth: {
            passwordHash: hash,
            passwordSalt: salt,
            createdAt: new Date().toISOString(),
          },
        },
      },
    ])
    .select('id, email, display_name')
    .single()

  if (insertError || !newUser) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'database_error',
          message: insertError?.message ?? 'Failed to create user profile.',
        },
      },
      { status: 500 },
    )
  }

  const sessionToken = await createSessionToken({ userId, email: payload.email })
  const response = NextResponse.json({
    success: true,
    data: {
      user: newUser,
    },
  })

  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
