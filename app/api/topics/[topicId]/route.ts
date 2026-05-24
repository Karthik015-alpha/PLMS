import { NextRequest, NextResponse } from 'next/server'
import TopicsService, { TopicStatus } from '@/features/topics/topics.service'

const VALID_STATUSES: TopicStatus[] = ['Not Started', 'In Progress', 'Completed']

const isValidStatus = (value: unknown): value is TopicStatus =>
  typeof value === 'string' && VALID_STATUSES.includes(value as TopicStatus)

export async function GET(_: NextRequest, context: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await context.params
    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_topic_id',
            message: 'Topic ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const topic = await TopicsService.getById(topicId)
    return NextResponse.json({ success: true, data: topic }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topic_fetch_failed',
          message: (error as Error).message || 'Failed to fetch topic.',
        },
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await context.params
    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_topic_id',
            message: 'Topic ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const payload = (await req.json()) as {
      title?: string
      status?: string
      estimatedHours?: number | null
    }

    if (!payload || (payload.title === undefined && payload.status === undefined && payload.estimatedHours === undefined)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'Provide at least one field to update.',
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

    if (payload.estimatedHours !== undefined && payload.estimatedHours !== null && (typeof payload.estimatedHours !== 'number' || !Number.isFinite(payload.estimatedHours) || payload.estimatedHours < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'estimatedHours must be a positive number or null.',
          },
        },
        { status: 400 },
      )
    }

    const updatedTopic = await TopicsService.update(topicId, {
      title: payload.title,
      status: payload.status as TopicStatus | undefined,
      estimatedHours: payload.estimatedHours,
    })

    return NextResponse.json({ success: true, data: updatedTopic }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topic_update_failed',
          message: (error as Error).message || 'Failed to update topic.',
        },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ topicId: string }> }) {
  try {
    const { topicId } = await context.params
    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_topic_id',
            message: 'Topic ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const deletedTopic = await TopicsService.delete(topicId)
    return NextResponse.json({ success: true, data: deletedTopic }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'topic_delete_failed',
          message: (error as Error).message || 'Failed to delete topic.',
        },
      },
      { status: 500 },
    )
  }
}
