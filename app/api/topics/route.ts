import { NextRequest, NextResponse } from 'next/server'
import TopicsService, { TopicStatus } from '@/features/topics/topics.service'

const VALID_STATUSES: TopicStatus[] = ['Not Started', 'In Progress', 'Completed']

const isValidStatus = (value: unknown): value is TopicStatus =>
  typeof value === 'string' && VALID_STATUSES.includes(value as TopicStatus)

export async function GET(req: NextRequest) {
  try {
    const subjectId = req.nextUrl.searchParams.get('subjectId')
    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_subject_id',
            message: 'subjectId query parameter is required.',
          },
        },
        { status: 400 },
      )
    }

    const topics = await TopicsService.listBySubject(subjectId)
    return NextResponse.json({ success: true, data: topics }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topics_list_failed',
          message: (error as Error).message || 'Failed to fetch topics.',
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
          message: (error as Error).message || 'Failed to create topic.',
        },
      },
      { status: 500 },
    )
  }
}
