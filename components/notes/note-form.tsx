import { useState } from "react";
import { NoteType } from "@/types/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MarkdownEditor } from "./markdown-editor";
import { MarkdownPreview } from "./markdown-preview";
import { PdfUpload } from "./pdf-upload";
import { Textarea } from "@/components/ui/textarea";

interface NoteFormProps {
  initialTitle?: string;
  initialType?: NoteType;
  initialContent?: string;
  initialFileUrl?: string | null;
  onSubmit: (data: { title: string; type: NoteType; content: string; file: File | null }) => void;
  isLoading?: boolean;
}

export function NoteForm({
  initialTitle = "",
  initialType = "txt",
  initialContent = "",
  initialFileUrl = null,
  onSubmit,
  isLoading = false
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [type, setType] = useState<NoteType>(initialType);
  const [content, setContent] = useState(initialContent);
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, type, content, file });
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>{initialTitle ? "Edit Note" : "Create New Note"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter note title..." 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as NoteType)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="txt">Plain Text</option>
                <option value="md">Markdown</option>
                <option value="pdf">PDF Document</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            {type === "txt" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Type your notes here..."
                  className="min-h-[300px]"
                  required={type === "txt"}
                />
              </div>
            )}

            {type === "md" && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  Markdown Content
                  <span className="text-xs text-muted-foreground font-normal">Supports GitHub Flavored Markdown</span>
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <MarkdownEditor value={content} onChange={setContent} />
                  <div className="hidden lg:block border rounded-md">
                    <MarkdownPreview content={content} />
                  </div>
                </div>
              </div>
            )}

            {type === "pdf" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF Document</label>
                <PdfUpload onFileSelect={setFile} existingUrl={initialFileUrl} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || (type === 'pdf' && !file && !initialFileUrl)}>
            {isLoading ? "Saving..." : "Save Note"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
