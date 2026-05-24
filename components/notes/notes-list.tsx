import { NoteCard } from "./note-card";
import { EmptyNotes } from "./empty-notes";
import { Note } from "@/types/note";

interface NotesListProps {
  notes: Note[];
  onDelete?: (id: string) => void;
}

export function NotesList({ notes, onDelete }: NotesListProps) {
  if (!notes?.length) {
    return <EmptyNotes />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}
