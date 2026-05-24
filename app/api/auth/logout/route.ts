import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth-server'

export async function POST() {
  const response = NextResponse.json({
    success: true,
    data: {
      message: 'Logged out successfully',
    },
  })

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })

  return response
}
