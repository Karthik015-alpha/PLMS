import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { NotesService } from '@/features/notes/notes.service';

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function GET(_req: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId } = await context.params;
    const note = await NotesService.getNote(noteId, userId);

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId } = await context.params;
    const body = await req.json();

    const note = await NotesService.updateNote(noteId, {
      userId,
      title: body.title,
      type: body.type,
      content: body.content ?? null,
      fileUrl: body.fileUrl ?? null,
    });

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId } = await context.params;
    await NotesService.deleteNote(noteId, userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}