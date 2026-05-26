import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth-server';
import { supabaseServer } from '@/lib/supabase-server';
import { safeErrorMessage } from '@/lib/safe-error';

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  return payload?.userId || null;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Fetch recent progress rows (by user_id)
    const { data: progressRows } = await supabaseServer
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(20);

    // Fetch user metadata.activity
    const { data: userRow } = await supabaseServer.from('users').select('metadata').eq('id', userId).single();
    const metadata = (userRow?.metadata as any) || {};
    const activity = Array.isArray(metadata.activity) ? metadata.activity : [];

    // Normalize both sources into a consistent activity list
    const normalizedProgress = (progressRows || []).map((r: any) => ({
      id: r.id,
      type: 'progress',
      taskId: r.task_id || null,
      value: r.value ?? null,
      isCompleted: !!r.is_completed,
      updatedAt: r.updated_at || r.created_at,
      subjectId: r.subject_id || null,
    }));

    const normalizedMeta = (activity || []).map((a: any) => ({
      id: a.id || a.noteId || JSON.stringify(a),
      type: a.type || 'event',
      noteId: a.noteId || null,
      title: a.title || null,
      createdAt: a.created_at || a.createdAt || null,
    }));

    const combined = [
      ...normalizedProgress.map((p: any) => ({ ...p, sortAt: new Date(p.updatedAt).getTime() })),
      ...normalizedMeta.map((m: any) => ({ ...m, sortAt: new Date(m.createdAt).getTime() })),
    ].sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));

    return NextResponse.json({ success: true, data: combined });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: safeErrorMessage(err, 'Failed to fetch activity.') } }, { status: 500 });
  }
}
