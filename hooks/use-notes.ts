import { useState, useCallback } from 'react';
import { NoteApiResponse, NotesListApiResponse, CreateNotePayload, UpdateNotePayload } from '@/features/notes/notes.types';
import { Note } from '@/types/note';

export function useNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async (subjectId?: string, topicId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/notes', window.location.origin);
      if (subjectId) url.searchParams.append('subjectId', subjectId);
      if (topicId) url.searchParams.append('topicId', topicId);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data: NotesListApiResponse = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Failed to fetch notes');
      return data.data || [];
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNote = useCallback(async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${noteId}`);
      if (!res.ok) throw new Error('Failed to fetch note');
      const data: NoteApiResponse = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Failed to fetch note');
      return data.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (payload: CreateNotePayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create note');
      const data: NoteApiResponse = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Failed to create note');
      return data.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, payload: UpdateNotePayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update note');
      const data: NoteApiResponse = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Failed to update note');
      return data.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload PDF');
      const data = await res.json();
      if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || 'Failed to upload file');
      return data.fileUrl as string;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
    uploadPdf,
  };
}
