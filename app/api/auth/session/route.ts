import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  const verified = await verifySessionToken(token)

  if (!verified) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'unauthenticated',
          message: 'Invalid or expired session.',
        },
      },
      { status: 401 },
    )
  }

  const { data: user, error } = await supabaseServer
    .from('users')
    .select('id, email, display_name')
    .eq('id', verified.userId)
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

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'user_not_found',
          message: 'User record not found.',
        },
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      user,
    },
  })
}
