import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your markdown here..."
        className="w-full h-full min-h-[300px] font-mono resize-y border-muted-foreground/20 focus-visible:ring-primary/50"
      />
    </div>
  );
}
