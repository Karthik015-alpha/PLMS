import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { safeErrorMessage } from '@/lib/safe-error';
import { ProgressService } from '@/features/progress/progress.service';
import { updateSubjectProgressSchema } from '@/features/progress/progress.validation';

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateSubjectProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation Error', details: parsed.error.format() }, { status: 400 });
    }

    const data = await ProgressService.updateSubjectProgress(userId, parsed.data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: safeErrorMessage(error, 'Failed to fetch subject progress.') }, { status: 500 });
  }
}
