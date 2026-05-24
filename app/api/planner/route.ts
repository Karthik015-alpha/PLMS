import { NextRequest, NextResponse } from 'next/server';
import { PlannerService } from '@/features/planner/planner.service';
import { createTaskSchema } from '@/features/planner/planner.validation';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter');

    let tasks;
    if (filter === 'pending') {
      tasks = await PlannerService.getPendingTasks();
    } else if (filter === 'completed') {
      tasks = await PlannerService.getCompletedTasks();
    } else {
      tasks = await PlannerService.getAllTasks();
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
    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newTask = await PlannerService.createTask(parsed.data);

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
