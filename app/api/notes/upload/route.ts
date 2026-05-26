import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { safeErrorMessage } from '@/lib/safe-error';
import { NotesService } from '@/features/notes/notes.service';

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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Missing file upload.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const upload = await NotesService.uploadStandaloneBuffer(
      userId,
      Buffer.from(arrayBuffer),
      file.name,
      file.type || 'application/pdf',
    );

    return NextResponse.json({ success: true, fileUrl: upload.fileUrl, path: upload.path }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: safeErrorMessage(error, 'Failed to upload note.') }, { status: 500 });
  }
}