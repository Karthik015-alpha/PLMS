import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { safeErrorMessage } from '@/lib/safe-error';
import { ProgressService } from '@/features/progress/progress.service';
import { updateProgressSchema } from '@/features/progress/progress.validation';

/**
 * Utility to reliably extract the authenticated user ID from HttpOnly cookies.
 */
async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const subjectId = url.searchParams.get('subjectId');
    const taskId = url.searchParams.get('taskId');

    let result;
    if (taskId) {
      result = await ProgressService.getTaskProgress(userId, taskId);
    } else if (subjectId) {
      result = await ProgressService.getSubjectProgress(userId, subjectId);
    } else {
      result = await ProgressService.getUserProgress(userId);
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: safeErrorMessage(error, 'Failed to fetch progress.') }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: parsed.error.format() }, 
        { status: 400 }
      );
    }

    const data = await ProgressService.upsertTaskProgress(userId, parsed.data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: safeErrorMessage(error, 'Failed to update progress.') }, { status: 500 });
  }
}
