import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { supabaseServer } from '@/lib/supabase-server';
import { randomUUID } from 'crypto';

const NOTES_BUCKET = 'notes';

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

type NotesMetadataRow = {
  path: string;
  content_type: string | null;
  filename: string | null;
};

export async function GET(_req: NextRequest, context: { params: Promise<{ noteId: string }> }) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId } = await context.params;
    const { data: note, error } = await supabaseServer
      .from('notes_metadata')
      .select('path, content_type, filename')
      .eq('id', noteId)
      .eq('owner', userId)
      .single();

    if (error || !note) {
      return NextResponse.json({ success: false, error: { message: error?.message ?? 'Note not found.' } }, { status: 404 });
    }

    const row = note as NotesMetadataRow;
    const { data: fileData, error: fileError } = await supabaseServer.storage.from(NOTES_BUCKET).download(row.path);

    if (fileError || !fileData) {
      return NextResponse.json({ success: false, error: { message: fileError?.message ?? 'Unable to load file.' } }, { status: 404 });
    }

    const buffer = await fileData.arrayBuffer();

    // Record a lightweight "view" event in the user's metadata.activity array
    try {
      const { data: userRow } = await supabaseServer.from('users').select('metadata').eq('id', userId).single();
      const metadata = (userRow?.metadata as any) || {};
      const activity = Array.isArray(metadata.activity) ? metadata.activity : [];
      activity.unshift({
        id: randomUUID(),
        type: 'view',
        noteId,
        title: row.filename || row.path,
        created_at: new Date().toISOString(),
      });

      // Keep only recent 50 items
      metadata.activity = activity.slice(0, 50);

      await supabaseServer.from('users').update({ metadata }).eq('id', userId);
    } catch (e) {
      // non-fatal - ignore metadata write errors
      console.warn('Failed to record activity:', e);
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': row.content_type || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${row.filename || 'note'}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}