import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PlannerService } from '@/features/planner/planner.service';
import { updateTaskSchema, markTaskCompletedSchema } from '@/features/planner/planner.validation';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ taskId: string }>;
}

export async function GET(req: NextRequest, context: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await context.params;
    const task = await PlannerService.getTaskById(taskId, session.userId);

    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await context.params;
    const body = await req.json();
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    let updatedTask;

    if (action === 'complete') {
      const parsed = markTaskCompletedSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: 'Validation Error', details: parsed.error.format() },
          { status: 400 }
        );
      }
      updatedTask = await PlannerService.markTaskCompleted(taskId, session.userId);
    } else {
      const parsed = updateTaskSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: 'Validation Error', details: parsed.error.format() },
          { status: 400 }
        );
      }
      updatedTask = await PlannerService.updateTask(taskId, parsed.data, session.userId);
    }

    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await context.params;
    await PlannerService.deleteTask(taskId, session.userId);

    return NextResponse.json({ success: true, message: 'Task deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
