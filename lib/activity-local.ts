type ActivityEvent = {
  id: string;
  type: string;
  noteId?: string | null;
  title?: string | null;
  createdAt: string; // ISO
};

const KEY = 'plms:recent_activity_v1';
const TTL_MS = 1000 * 60 * 60; // 1 hour

function nowIso() { return new Date().toISOString(); }

function readRaw(): { ts: number; events: ActivityEvent[] } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('activity-local: failed to read', e);
    return null;
  }
}

function writeRaw(payload: { ts: number; events: ActivityEvent[] }) {
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('activity-local: failed to write', e);
  }
}

export function pushActivity(event: Omit<ActivityEvent, 'createdAt' | 'id'> & { id?: string }) {
  if (typeof window === 'undefined') return;
  try {
    const raw = readRaw();
    const ts = Date.now();
    const events = Array.isArray(raw?.events) ? raw!.events.slice() : [];
    const ev: ActivityEvent = {
      id: event.id || `${event.type}:${event.noteId || ''}:${ts}`,
      type: event.type,
      noteId: event.noteId ?? null,
      title: event.title ?? null,
      createdAt: nowIso(),
    };
    events.unshift(ev);
    // trim to 50
    const kept = events.slice(0, 50);
    writeRaw({ ts, events: kept });
  } catch (e) {
    console.warn('activity-local: push failed', e);
  }
}

export function readActivities(): ActivityEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = readRaw();
    if (!raw) return [];
    if (Date.now() - raw.ts > TTL_MS) {
      // expired
      localStorage.removeItem(KEY);
      return [];
    }
    return raw.events || [];
  } catch (e) {
    console.warn('activity-local: read failed', e);
    return [];
  }
}

export function clearActivities() {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
}

export type { ActivityEvent };
