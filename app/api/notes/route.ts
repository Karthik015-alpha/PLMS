import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { NotesService } from '@/features/notes/notes.service';

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

    const subjectId = req.nextUrl.searchParams.get('subjectId') ?? undefined;
    const topicId = req.nextUrl.searchParams.get('topicId') ?? undefined;

    const notes = await NotesService.listNotes({ userId, subjectId, topicId });
    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const subjectId = formData.get('subjectId') as string | null;
      const topicId = formData.get('topicId') as string | null;
      const title = formData.get('title') as string | null;
      const fileName = file?.name.toLowerCase() || '';
      const fileType = file?.type || 'application/octet-stream';
      const noteType = fileType === 'application/pdf' || fileName.endsWith('.pdf')
        ? 'pdf'
        : fileType === 'application/msword' ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.doc') ||
            fileName.endsWith('.docx')
          ? 'doc'
          : fileName.endsWith('.md')
            ? 'md'
            : 'txt';

      if (!file || !subjectId || !title) {
        return NextResponse.json(
          { success: false, error: `Missing required upload fields. file=${!!file} subjectId=${!!subjectId} title=${!!title}` },
          { status: 400 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const storagePath = await NotesService.uploadNoteBuffer(
        userId,
        subjectId,
        fileBuffer,
        file.name,
        fileType,
      );

      const metadata = await NotesService.createNoteMetadata({
        userId,
        title,
        path: storagePath,
        filename: file.name,
        filesize: file.size,
        contentType: fileType,
        subjectId,
        topicId: topicId || undefined,
        metadata: {
          type: noteType,
          fileUrl: null,
        },
      });

      return NextResponse.json({ success: true, data: metadata }, { status: 201 });
    }

    const body = await req.json();
    const note = await NotesService.createNoteFromContent({
      userId,
      subjectId: body.subjectId,
      topicId: body.topicId || undefined,
      title: body.title,
      type: body.type,
      content: body.content ?? null,
      fileUrl: body.fileUrl ?? null,
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/notes] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

