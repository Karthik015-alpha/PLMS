import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PlannerService } from '@/features/planner/planner.service';
import { createTaskSchema } from '@/features/planner/planner.validation';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get('filter');

    let tasks;
    if (filter === 'pending') {
      tasks = await PlannerService.getPendingTasks(session.userId);
    } else if (filter === 'completed') {
      tasks = await PlannerService.getCompletedTasks(session.userId);
    } else {
      tasks = await PlannerService.getAllTasks(session.userId);
    }

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newTask = await PlannerService.createTask(parsed.data, session.userId);

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
