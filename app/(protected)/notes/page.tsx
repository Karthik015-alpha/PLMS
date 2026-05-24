'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/use-notes';
import { Note } from '@/types/note';
import Link from 'next/link';

export default function NotesPage() {
  const { fetchNotes, loading, error } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadNotes = async () => {
      const data = await fetchNotes();
      setNotes(data || []);
    };
    loadNotes();
  }, [fetchNotes]);

  return (
    <div>
      <h1>All Notes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <Link href={`/subjects/${note.subjectId}/topics/${note.topicId}/notes/${note.id}`}>
                {note.title} ({note.type})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
