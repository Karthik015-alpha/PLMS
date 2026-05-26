import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import UsersService from '@/features/users/users.service'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await UsersService.getProfile(userId)
    return NextResponse.json({ success: true, data: profile }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'profile_fetch_failed',
          message: (error as Error).message || 'Failed to fetch user profile.',
        },
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let payload: { displayName?: any; role?: any }
    try {
      payload = await req.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_json',
            message: 'Invalid JSON request payload.',
          },
        },
        { status: 400 },
      )
    }

    const displayName = payload?.displayName
    const role = payload?.role

    if (displayName === undefined && role === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'Must provide displayName or role to update.',
          },
        },
        { status: 400 },
      )
    }

    const updatePayload: { displayName?: string; role?: string } = {}
    if (displayName !== undefined) {
      if (typeof displayName !== 'string' || displayName.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'invalid_payload',
              message: 'display name must be a non-empty string.',
            },
          },
          { status: 400 },
        )
      }
      updatePayload.displayName = displayName.trim()
    }

    if (role !== undefined) {
      if (typeof role !== 'string' || role.trim() === '') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'invalid_payload',
              message: 'role must be a non-empty string.',
            },
          },
          { status: 400 },
        )
      }
      updatePayload.role = role.trim()
    }

    const updatedProfile = await UsersService.updateProfile(userId, updatePayload)

    return NextResponse.json({ success: true, data: updatedProfile }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'profile_update_failed',
          message: (error as Error).message || 'Failed to update user profile.',
        },
      },
      { status: 500 },
    )
  }
}
