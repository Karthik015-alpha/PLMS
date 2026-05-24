import { Note, NoteType } from '@/types/note';

// -----------------------------------------------------------------------------
// Payloads
// -----------------------------------------------------------------------------

export interface CreateNotePayload {
  subjectId: string;
  topicId: string;
  title: string;
  type: NoteType;
  content?: string | null;
  fileUrl?: string | null;
}

export interface UpdateNotePayload {
  title?: string;
  type?: NoteType;
  content?: string | null;
  fileUrl?: string | null;
}

// -----------------------------------------------------------------------------
// API Responses
// -----------------------------------------------------------------------------

export interface NoteApiResponse {
  data: Note | null;
  error: { message: string; code?: string } | null;
}

export interface NotesListApiResponse {
  data: Note[] | null;
  error: { message: string; code?: string } | null;
}

// -----------------------------------------------------------------------------
// Component Props
// -----------------------------------------------------------------------------

export interface NoteFormProps {
  initialData?: Note;
  subjectId: string;
  topicId: string;
  onSubmit: (data: CreateNotePayload | UpdateNotePayload) => Promise<void>;
  isLoading?: boolean;
}
