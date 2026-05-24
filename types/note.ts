export type NoteType = 'txt' | 'md' | 'pdf' | 'doc';

export interface Note {
  id: string;
  subjectId: string;
  topicId: string;
  title: string;
  type: NoteType;
  content: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
