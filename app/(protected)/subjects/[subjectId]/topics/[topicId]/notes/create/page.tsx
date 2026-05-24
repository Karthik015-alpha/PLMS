'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/hooks/use-notes';
import { NoteType } from '@/types/note';

interface CreateNotePageProps {
  params: Promise<{
    subjectId: string;
    topicId: string;
  }>;
}

export default function CreateNotePage({ params }: CreateNotePageProps) {
  const { subjectId, topicId } = use(params);
  const router = useRouter();
  const { createNote, uploadPdf, loading, error } = useNotes();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('txt');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileUrl = null;
    
    if (type === 'pdf' && file) {
      fileUrl = await uploadPdf(file);
      if (!fileUrl) return; // Error handled in hook
    }

    const note = await createNote({
      subjectId,
      topicId,
      title,
      type,
      content: type !== 'pdf' ? content : null,
      fileUrl
    });

    if (note) {
      router.push(`/subjects/${subjectId}/topics/${topicId}/notes/${note.id}`);
    }
  };

  return (
    <div>
      <h1>Create Note</h1>
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
            <label>Upload PDF</label><br />
            <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </form>
    </div>
  );
}
