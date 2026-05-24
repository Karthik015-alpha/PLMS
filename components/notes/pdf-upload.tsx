import { useState, useRef } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PdfUploadProps {
  onFileSelect: (file: File | null) => void;
  existingUrl?: string | null;
}

export function PdfUpload({ onFileSelect, existingUrl }: PdfUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (selectedFile) {
    return (
      <Card className="p-4 flex items-center justify-between border-primary/50 bg-primary/5">
        <div className="flex items-center gap-3 truncate">
          <File className="h-8 w-8 text-primary shrink-0" />
          <div className="truncate">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={removeFile}>
          <X className="h-4 w-4" />
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Drag and drop your PDF here</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
        <Button variant="secondary" className="pointer-events-none">Select File</Button>
      </div>
      
      {existingUrl && (
        <div className="text-sm flex items-center gap-2 mt-4 text-muted-foreground">
          Current PDF uploaded. Uploading a new one will replace it.
          <a href={existingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-auto">
            View Current
          </a>
        </div>
      )}
    </div>
  );
}
