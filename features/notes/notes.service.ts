import { supabaseServer } from '@/lib/supabase-server';
import type { Note } from '@/types/note';

const NOTES_BUCKET = 'notes';

type NotesMetadataRow = {
  id: string;
  owner: string;
  title: string | null;
  bucket: string;
  path: string;
  filename: string | null;
  filesize: number | null;
  content_type: string | null;
  linked_subject: string | null;
  linked_topic: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type StoredNoteMetadata = {
  type?: Note['type'];
  content?: string | null;
  fileUrl?: string | null;
};

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

function buildStoragePath(userId: string, subjectId: string, fileName: string): string {
  return `${userId}/${subjectId}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

function parseStoragePathFromUrl(fileUrl: string): string | null {
  const publicMarker = `/storage/v1/object/public/${NOTES_BUCKET}/`;
  const signedMarker = `/storage/v1/object/sign/${NOTES_BUCKET}/`;
  const marker = fileUrl.includes(publicMarker) ? publicMarker : fileUrl.includes(signedMarker) ? signedMarker : null;

  if (marker) {
    const markerIndex = fileUrl.indexOf(marker);
    if (markerIndex >= 0) {
      return decodeURIComponent(fileUrl.slice(markerIndex + marker.length));
    }
  }

  if (fileUrl.startsWith(`${NOTES_BUCKET}/`)) {
    return fileUrl.slice(NOTES_BUCKET.length + 1);
  }

  return null;
}

async function getFileUrl(path: string): Promise<string> {
  const { data, error } = await supabaseServer.storage.from(NOTES_BUCKET).createSignedUrl(path, 60 * 60);

  if (!error && data?.signedUrl) {
    return data.signedUrl;
  }

  const { data: publicData } = supabaseServer.storage.from(NOTES_BUCKET).getPublicUrl(path);
  return publicData.publicUrl;
}

function getMetadata(metadata: Record<string, unknown> | null): StoredNoteMetadata {
  return (metadata ?? {}) as StoredNoteMetadata;
}

function inferNoteType(contentType: string | null, path: string): Note['type'] {
  if (contentType === 'application/pdf' || path.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }

  if (
    contentType === 'application/msword' ||
    contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    path.toLowerCase().endsWith('.doc') ||
    path.toLowerCase().endsWith('.docx')
  ) {
    return 'doc';
  }

  if (path.toLowerCase().endsWith('.md')) {
    return 'md';
  }

  return 'txt';
}

async function mapRowToNote(row: NotesMetadataRow): Promise<Note> {
  const metadata = getMetadata(row.metadata);
  const fileUrl = row.path ? await getFileUrl(row.path) : metadata.fileUrl || null;

  return {
    id: row.id,
    subjectId: row.linked_subject || '',
    topicId: row.linked_topic || '',
    title: row.title || '',
    type: metadata.type || inferNoteType(row.content_type, row.path),
    content: metadata.content ?? null,
    fileUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class NotesService {
  private static async uploadBuffer(
    path: string,
    body: Buffer | Uint8Array,
    contentType: string,
  ): Promise<string> {
    const { error } = await supabaseServer.storage.from(NOTES_BUCKET).upload(path, body, {
      cacheControl: '3600',
      contentType,
      upsert: true,
    });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    return path;
  }

  /**
   * Uploads a file directly to the Supabase "notes" storage bucket.
   * Enforces the hierarchical path: {userId}/{subjectId}/{filename}
   */
  static async uploadNoteFile(userId: string, subjectId: string, file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    return await this.uploadNoteBuffer(
      userId,
      subjectId,
      Buffer.from(arrayBuffer),
      file.name,
      file.type || 'application/octet-stream',
    );
  }

  static async uploadNoteBuffer(
    userId: string,
    subjectId: string,
    body: Buffer | Uint8Array,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    return await this.uploadBuffer(buildStoragePath(userId, subjectId, fileName), body, contentType);
  }

  static async uploadStandaloneBuffer(
    userId: string,
    body: Buffer | Uint8Array,
    fileName: string,
    contentType: string,
  ): Promise<{ path: string; fileUrl: string }> {
    const path = buildStoragePath(userId, 'uploads', fileName);
    await this.uploadBuffer(path, body, contentType);
    return {
      path,
      fileUrl: await getFileUrl(path),
    };
  }

  /**
   * Inserts a note record into the public.notes_metadata table.
   */
  static async createNoteMetadata(payload: {
    userId: string;
    title: string;
    path: string;
    filename: string;
    filesize: number;
    contentType: string;
    subjectId: string;
    topicId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { data, error } = await supabaseServer
      .from('notes_metadata')
      .insert({
        owner: payload.userId,
        title: payload.title,
        bucket: NOTES_BUCKET,
        path: payload.path,
        filename: payload.filename,
        filesize: payload.filesize,
        content_type: payload.contentType,
        linked_subject: payload.subjectId,
        linked_topic: payload.topicId || null,
        metadata: payload.metadata || {},
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save note metadata: ${error.message}`);
    }

    return await mapRowToNote(data as NotesMetadataRow);
  }

  static async createNoteFromContent(payload: {
    userId: string;
    subjectId: string;
    topicId?: string;
    title: string;
    type: Note['type'];
    content?: string | null;
    fileUrl?: string | null;
  }) {
    if (payload.type === 'pdf' || payload.type === 'doc') {
      if (!payload.fileUrl) {
        throw new Error('File notes require a file URL.');
      }

      const path = parseStoragePathFromUrl(payload.fileUrl) || payload.fileUrl;
      return await this.createNoteMetadata({
        userId: payload.userId,
        title: payload.title,
        path,
        filename: path.split('/').pop() || payload.title,
        filesize: 0,
        contentType: payload.type === 'pdf' ? 'application/pdf' : 'application/msword',
        subjectId: payload.subjectId,
        topicId: payload.topicId,
        metadata: {
          type: payload.type,
        },
      });
    }

    const extension = payload.type === 'md' ? 'md' : 'txt';
    const safeTitle = sanitizeFileName(payload.title || 'note');
    const content = payload.content || '';
    const body = Buffer.from(content, 'utf8');
    const path = await this.uploadBuffer(
      buildStoragePath(payload.userId, payload.subjectId, `${safeTitle}.${extension}`),
      body,
      payload.type === 'md' ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8',
    );

    return await this.createNoteMetadata({
      userId: payload.userId,
      title: payload.title,
      path,
      filename: `${safeTitle}.${extension}`,
      filesize: body.byteLength,
      contentType: payload.type === 'md' ? 'text/markdown' : 'text/plain',
      subjectId: payload.subjectId,
      topicId: payload.topicId,
      metadata: {
        type: payload.type,
        content,
      },
    });
  }

  /**
   * Retrieves a list of notes optionally filtered by subject, topic, and owner.
   */
  static async listNotes(filters?: { subjectId?: string; topicId?: string; userId?: string }) {
    let query = supabaseServer
      .from('notes_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.userId) query = query.eq('owner', filters.userId);
    if (filters?.subjectId) query = query.eq('linked_subject', filters.subjectId);
    if (filters?.topicId) query = query.eq('linked_topic', filters.topicId);

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to list notes: ${error.message}`);
    }

    return await Promise.all((data || []).map((row) => mapRowToNote(row as NotesMetadataRow)));
  }

  static async getNote(noteId: string, userId?: string) {
    let query = supabaseServer.from('notes_metadata').select('*').eq('id', noteId);
    if (userId) {
      query = query.eq('owner', userId);
    }

    const { data, error } = await query.single();
    if (error) {
      throw new Error(`Failed to fetch note: ${error.message}`);
    }

    return await mapRowToNote(data as NotesMetadataRow);
  }

  static async updateNote(
    noteId: string,
    payload: {
      userId: string;
      title?: string;
      type?: Note['type'];
      content?: string | null;
      fileUrl?: string | null;
    },
  ) {
    const { data: existing, error: fetchError } = await supabaseServer
      .from('notes_metadata')
      .select('*')
      .eq('id', noteId)
      .eq('owner', payload.userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch note for update: ${fetchError.message}`);
    }

    const currentRow = existing as NotesMetadataRow;
    const currentMetadata = getMetadata(currentRow.metadata);
    const nextType = payload.type || currentMetadata.type || inferNoteType(currentRow.content_type, currentRow.path);
    let nextPath = currentRow.path;
    let nextFilename = currentRow.filename;
    let nextContentType = currentRow.content_type;
    let nextMetadata: StoredNoteMetadata = {
      ...currentMetadata,
      type: nextType,
    };

    if (nextType === 'pdf' || nextType === 'doc') {
      if (payload.fileUrl) {
        const parsedPath = parseStoragePathFromUrl(payload.fileUrl) || payload.fileUrl;
        if (parsedPath && parsedPath !== currentRow.path) {
          nextPath = parsedPath;
          nextFilename = parsedPath.split('/').pop() || nextFilename;
          nextContentType = nextType === 'pdf' ? 'application/pdf' : 'application/msword';
          nextMetadata = {
            ...nextMetadata,
            content: null,
          };
        }
      }
    } else {
      const updatedContent = payload.content ?? '';
      nextContentType = nextType === 'md' ? 'text/markdown' : 'text/plain';
      nextMetadata = {
        ...nextMetadata,
        content: updatedContent,
        fileUrl: null,
      };

      if (currentRow.path) {
        await this.uploadBuffer(
          currentRow.path,
          Buffer.from(updatedContent, 'utf8'),
          nextType === 'md' ? 'text/markdown; charset=utf-8' : 'text/plain; charset=utf-8',
        );
      }
    }

    const { data, error } = await supabaseServer
      .from('notes_metadata')
      .update({
        title: payload.title ?? currentRow.title,
        path: nextPath,
        filename: nextFilename,
        content_type: nextContentType,
        metadata: nextMetadata,
      })
      .eq('id', noteId)
      .eq('owner', payload.userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update note: ${error.message}`);
    }

    return await mapRowToNote(data as NotesMetadataRow);
  }

  static async deleteNote(noteId: string, userId: string) {
    const { data: existing, error: fetchError } = await supabaseServer
      .from('notes_metadata')
      .select('*')
      .eq('id', noteId)
      .eq('owner', userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch note for deletion: ${fetchError.message}`);
    }

    const row = existing as NotesMetadataRow;
    if (row.path) {
      await supabaseServer.storage.from(NOTES_BUCKET).remove([row.path]);
    }

    const { error } = await supabaseServer.from('notes_metadata').delete().eq('id', noteId).eq('owner', userId);
    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }

    return true;
  }
}
