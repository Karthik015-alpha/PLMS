import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { safeErrorMessage } from '@/lib/safe-error';
import { ProgressService } from '@/features/progress/progress.service';
import { markTaskCompletedSchema, updateSubjectProgressSchema } from '@/features/progress/progress.validation';

interface RouteParams {
  params: Promise<{ progressId: string }>;
}

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { progressId } = await params;
    const body = await req.json();
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    let result;

    if (action === 'complete-task') {
      const parsed = markTaskCompletedSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ success: false, error: 'Validation Error', details: parsed.error.format() }, { status: 400 });
      }
      // Assuming progressId is used as the taskId contextually here.
      result = await ProgressService.markTaskCompleted(userId, parsed.data.taskId);
    } else if (action === 'update-subject') {
      const parsed = updateSubjectProgressSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ success: false, error: 'Validation Error', details: parsed.error.format() }, { status: 400 });
      }
      result = await ProgressService.updateSubjectProgress(userId, parsed.data);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action parameter' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: safeErrorMessage(error, 'Failed to fetch progress item.') }, { status: 500 });
  }
}
