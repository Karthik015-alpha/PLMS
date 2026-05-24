import { Note } from "@/types/note";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const date = new Date(note.createdAt).toLocaleDateString();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold truncate pr-4">
          {note.title}
        </CardTitle>
        <Badge variant={note.type === "pdf" ? "destructive" : "secondary"}>
          {note.type.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{date}</p>
        <div className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
          {note.type === "pdf" ? (
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> PDF Document
            </span>
          ) : (
            note.content || "No content"
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Link href={`/subjects/${note.subjectId}/topics/${note.topicId}/notes/${note.id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
        <Link href={`/subjects/${note.subjectId}/topics/${note.topicId}/notes/${note.id}/edit`}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </Link>
        {onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(note.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
