"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File as FileIcon, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadNoteProps {
  subjectId: string;
  topicId: string;
  /** Callback fired when a file has successfully uploaded, useful for triggering list refetches */
  onUploadSuccess?: () => void;
}

export function UploadNote({ subjectId, topicId, onUploadSuccess }: UploadNoteProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    setFile(selectedFile);
    
    // Auto-populate title from filename if empty
    if (!title) {
      // Strip extension for a cleaner default title
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setTitle('');
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Upload Execution ---
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!title.trim()) {
      setError("Please provide a title for this note.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('subjectId', subjectId);
      formData.append('topicId', topicId);

      const response = await fetch('/api/notes', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload note.');
      }

      setSuccess(true);
      setTimeout(() => {
        clearSelection();
        if (onUploadSuccess) onUploadSuccess();
      }, 1500);

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Attach Note</h3>

      {/* Error & Success States */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Note uploaded successfully!</p>
        </div>
      )}

      {!file ? (
        // Dropzone Area
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.txt,.md,.doc,.docx" 
          />
          <div className="bg-blue-100 dark:bg-blue-900/40 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF, TXT, Markdown, or Word docs (max. 10MB)</p>
        </div>
      ) : (
        // File Details & Upload Form Area
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <FileIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isUploading && !success && (
              <button 
                onClick={clearSelection}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Note Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 Summary"
              disabled={isUploading || success}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60"
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={isUploading || success || !title.trim()}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading Note...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Uploaded!
              </>
            ) : (
              <>
                <UploadCloud className="h-5 w-5" />
                Upload Note
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
