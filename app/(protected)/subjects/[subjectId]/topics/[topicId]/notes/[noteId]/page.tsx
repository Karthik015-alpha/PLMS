'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { Note } from '@/types/note';
import Link from 'next/link';

interface NoteDetailPageProps {
  params: Promise<{
    subjectId: string;
    topicId: string;
    noteId: string;
  }>;
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { subjectId, topicId, noteId } = use(params);
  const router = useRouter();
  const { fetchNote, deleteNote, loading, error } = useNotes();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      const data = await fetchNote(noteId);
      setNote(data);
    };
    loadNote();
  }, [noteId, fetchNote]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      const success = await deleteNote(noteId);
      if (success) {
        router.push(`/notes`); 
      }
    }
  };

  if (loading) return <p>Loading note...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <div>
      <h1>{note.title}</h1>
      <p><strong>Type:</strong> {note.type}</p>
      
      {note.type === 'pdf' && note.fileUrl ? (
        <p><a href={note.fileUrl} target="_blank" rel="noopener noreferrer">View PDF Document</a></p>
      ) : (
        <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '1rem' }}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{note.content}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Link href={`/subjects/${subjectId}/topics/${topicId}/notes/${note.id}/edit`}>
          <button>Edit</button>
        </Link>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
