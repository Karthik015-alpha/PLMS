import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import SubjectsService from '@/features/subjects/subjects.service'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'
import { safeErrorMessage } from '@/lib/safe-error'

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function GET(req: NextRequest) {
  try {
    const ownerId = await getUserId()
    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    const subjects = await SubjectsService.list(ownerId)
    return NextResponse.json({ success: true, data: subjects }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'subjects_list_failed',
          message: safeErrorMessage(error, 'Failed to fetch subjects.'),
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const ownerId = await getUserId()
    if (!ownerId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await req.json()) as { title?: string; description?: string }

    if (!payload?.title || typeof payload.title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'Subject title is required.',
          },
        },
        { status: 400 },
      )
    }

    const subject = await SubjectsService.create({
      title: payload.title,
      description: payload.description,
      ownerId: ownerId,
    })

    return NextResponse.json({ success: true, data: subject }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'subject_create_failed',
          message: safeErrorMessage(error, 'Failed to create subject.'),
        },
      },
      { status: 500 },
    )
  }
}
