import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyNotes() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-xl border border-dashed min-h-[300px]">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileQuestion className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No notes found</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        You haven't created any notes for this topic yet. Start by creating a text, markdown, or PDF note.
      </p>
    </div>
  );
}
