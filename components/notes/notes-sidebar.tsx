"use client";

import { useEffect, useState, useCallback } from 'react';
import { useNotes } from '@/hooks/use-notes';
import { FileText, Download, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotesSidebarProps {
  subjectId: string;
  topicId?: string;
  className?: string;
}

export function NotesSidebar({ subjectId, topicId, className = '' }: NotesSidebarProps) {
  const { fetchNotes, loading, error } = useNotes();
  const [notes, setNotes] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadNotes = useCallback(async () => {
    const data = await fetchNotes(subjectId, topicId);
    setNotes(data || []);
  }, [subjectId, topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadNotes();
  }, [loadNotes, refreshKey]);

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Attached Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="Refresh notes"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-indigo-500" />
          <p className="text-sm">Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No notes attached yet.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="group relative p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate mb-1" title={note.title}>
                    {note.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="uppercase font-medium px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                      {note.filename?.split('.').pop() || 'FILE'}
                    </span>
                    <span>•</span>
                    <span>{note.filesize ? (note.filesize / 1024 / 1024).toFixed(2) : '0.00'} MB</span>
                  </div>
                  {note.created_at && (
                    <p className="text-[11px] text-gray-400 mt-2.5 font-medium">
                      Added {formatDistanceToNow(new Date(note.created_at))} ago
                    </p>
                  )}
                </div>
                
                <a 
                  href={`/api/notes/${note.id}`} // Assumes GET /api/notes/[id] returns the file or redirects to signed URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Download Note"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
