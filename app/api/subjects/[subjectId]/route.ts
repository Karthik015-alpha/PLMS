import { NextRequest, NextResponse } from 'next/server'
import SubjectsService from '@/features/subjects/subjects.service'

export async function GET(_: NextRequest, context: { params: Promise<{ subjectId: string }> }) {
  try {
    const { subjectId } = await context.params
    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_subject_id',
            message: 'Subject ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const subject = await SubjectsService.getById(subjectId)
    return NextResponse.json({ success: true, data: subject }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'subject_fetch_failed',
          message: (error as Error).message || 'Failed to fetch subject.',
        },
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ subjectId: string }> }) {
  try {
    const { subjectId } = await context.params
    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_subject_id',
            message: 'Subject ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const payload = (await req.json()) as { title?: string; description?: string | null }
    if (!payload || (payload.title === undefined && payload.description === undefined)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'invalid_payload',
            message: 'At least one of title or description must be provided.',
          },
        },
        { status: 400 },
      )
    }

    const updatedSubject = await SubjectsService.update(subjectId, {
      title: payload.title,
      description: payload.description,
    })

    return NextResponse.json({ success: true, data: updatedSubject }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'subject_update_failed',
          message: (error as Error).message || 'Failed to update subject.',
        },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ subjectId: string }> }) {
  try {
    const { subjectId } = await context.params
    if (!subjectId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'missing_subject_id',
            message: 'Subject ID is required.',
          },
        },
        { status: 400 },
      )
    }

    const deletedSubject = await SubjectsService.delete(subjectId)
    return NextResponse.json({ success: true, data: deletedSubject }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'subject_delete_failed',
          message: (error as Error).message || 'Failed to delete subject.',
        },
      },
      { status: 500 },
    )
  }
}
