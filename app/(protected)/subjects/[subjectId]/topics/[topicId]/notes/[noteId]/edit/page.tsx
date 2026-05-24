'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { NoteType } from '@/types/note';

interface EditNotePageProps {
  params: Promise<{
    subjectId: string;
    topicId: string;
    noteId: string;
  }>;
}

export default function EditNotePage({ params }: EditNotePageProps) {
  const { subjectId, topicId, noteId } = use(params);
  const router = useRouter();
  const { fetchNote, updateNote, uploadPdf, loading, error } = useNotes();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('txt');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      const data = await fetchNote(noteId);
      if (data) {
        setTitle(data.title);
        setType(data.type);
        setContent(data.content || '');
        setExistingFileUrl(data.fileUrl || null);
      }
    };
    loadNote();
  }, [noteId, fetchNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileUrl = existingFileUrl;
    
    if (type === 'pdf' && file) {
      const newFileUrl = await uploadPdf(file);
      if (!newFileUrl) return; // Error handled in hook
      fileUrl = newFileUrl;
    }

    const updatedNote = await updateNote(noteId, {
      title,
      type,
      content: type !== 'pdf' ? content : null,
      fileUrl
    });

    if (updatedNote) {
      router.push(`/subjects/${subjectId}/topics/${topicId}/notes/${noteId}`);
    }
  };

  return (
    <div>
      <h1>Edit Note</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <div>
          <label>Title</label><br />
          <input style={{ width: '100%' }} value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Type</label><br />
          <select style={{ width: '100%' }} value={type} onChange={e => setType(e.target.value as NoteType)}>
            <option value="txt">Text</option>
            <option value="md">Markdown</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        
        {type !== 'pdf' ? (
          <div>
            <label>Content</label><br />
            <textarea style={{ width: '100%', minHeight: '150px' }} value={content} onChange={e => setContent(e.target.value)} required />
          </div>
        ) : (
          <div>
            <label>Upload New PDF (optional)</label><br />
            <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
            {existingFileUrl && (
              <p style={{ marginTop: '0.5rem' }}>
                Current PDF: <a href={existingFileUrl} target="_blank" rel="noopener noreferrer">View</a>
              </p>
            )}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update Note'}
        </button>
      </form>
    </div>
  );
}
