import ReactMarkdown from 'react-markdown';
import { Card } from "@/components/ui/card";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <Card className="p-6 prose prose-slate dark:prose-invert max-w-none w-full min-h-[300px] overflow-y-auto bg-background">
      <ReactMarkdown>
        {content || '*No content to preview*'}
      </ReactMarkdown>
    </Card>
  );
}
