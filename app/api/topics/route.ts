import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import TopicsService, { TopicStatus } from '@/features/topics/topics.service'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server'
import { safeErrorMessage } from '@/lib/safe-error'

const VALID_STATUSES: TopicStatus[] = ['Not Started', 'In Progress', 'Completed']

const isValidStatus = (value: unknown): value is TopicStatus =>
  typeof value === 'string' && VALID_STATUSES.includes(value as TopicStatus)

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

    const subjectId = req.nextUrl.searchParams.get('subjectId')
    
    if (subjectId) {
      const topics = await TopicsService.listBySubject(subjectId)
      return NextResponse.json({ success: true, data: topics }, { status: 200 })
    } else {
      const topics = await TopicsService.listAllByUser(userId)
      return NextResponse.json({ success: true, data: topics }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topics_list_failed',
          message: safeErrorMessage(error, 'Failed to fetch topics.'),
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as {
      subjectId?: string
      title?: string
      status?: string
      estimatedHours?: number
    }

    if (!payload?.subjectId || typeof payload.subjectId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'subjectId is required.',
          },
        },
        { status: 400 },
      )
    }

    if (!payload?.title || typeof payload.title !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'Topic title is required.',
          },
        },
        { status: 400 },
      )
    }

    if (payload.status !== undefined && !isValidStatus(payload.status)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_status',
            message: 'Topic status must be Not Started, In Progress, or Completed.',
          },
        },
        { status: 400 },
      )
    }

    const estimatedHours = payload.estimatedHours
    if (estimatedHours !== undefined && (typeof estimatedHours !== 'number' || !Number.isFinite(estimatedHours) || estimatedHours < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'estimatedHours must be a positive number.',
          },
        },
        { status: 400 },
      )
    }

    const topic = await TopicsService.create({
      subjectId: payload.subjectId,
      title: payload.title,
      status: payload.status as TopicStatus | undefined,
      estimatedHours: estimatedHours ?? undefined,
    })

    return NextResponse.json({ success: true, data: topic }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topic_create_failed',
          message: safeErrorMessage(error, 'Failed to create topic.'),
        },
      },
      { status: 500 },
    )
  }
}
