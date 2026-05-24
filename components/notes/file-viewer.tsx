"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText } from 'lucide-react';
import type { Note } from '@/types/note';
import { pushActivity } from '@/lib/activity-local';

type FileViewerProps = {
  note: Note | null;
};

function getViewerKind(note: Note | null): 'pdf' | 'doc' | 'text' {
  if (!note) {
    return 'text';
  }

  if (note.type === 'pdf' || note.fileUrl?.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }

  if (
    note.type === 'doc' ||
    note.fileUrl?.toLowerCase().endsWith('.doc') ||
    note.fileUrl?.toLowerCase().endsWith('.docx')
  ) {
    return 'doc';
  }

  return 'text';
}

function looksLikeText(value: string): boolean {
  if (!value) {
    return false;
  }

  const sample = value.slice(0, 2048);
  let controlCount = 0;

  for (const character of sample) {
    const code = character.charCodeAt(0);
    const isAllowedControl = code === 9 || code === 10 || code === 13;
    const isPrintable = code >= 32 && code !== 127;

    if (!isAllowedControl && !isPrintable) {
      controlCount += 1;
    }
  }

  return controlCount / sample.length < 0.08 && !sample.startsWith('PK');
}

export function FileViewer({ note }: FileViewerProps) {
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [isTextPreviewLoading, setIsTextPreviewLoading] = useState(false);
  const [textPreviewError, setTextPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadTextPreview() {
      if (!note || getViewerKind(note) !== 'text') {
        setTextPreview(null);
        setTextPreviewError(null);
        setIsTextPreviewLoading(false);
        return;
      }

      setIsTextPreviewLoading(true);
      setTextPreviewError(null);

      if (note.content) {
        if (looksLikeText(note.content)) {
          setTextPreview(note.content);
        } else {
          setTextPreview(null);
          setTextPreviewError('This file does not look like plain text.');
        }
        setIsTextPreviewLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/notes/${note.id}/file`);
        if (!response.ok) {
          throw new Error('Unable to load text preview.');
        }

        const contentType = response.headers.get('content-type') || '';
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        const detectedText = contentType.startsWith('text/')
          ? new TextDecoder('utf-8', { fatal: false }).decode(buffer)
          : new TextDecoder('utf-8', { fatal: false }).decode(buffer);

        if (active) {
          if (looksLikeText(detectedText)) {
            setTextPreview(detectedText);
          } else {
            setTextPreview(null);
            setTextPreviewError(
              bytes.slice(0, 4).every((byte, index) => [0x50, 0x4b, 0x03, 0x04][index] === byte)
                ? 'This file looks like a Word or ZIP document, not plain text.'
                : 'This file is not readable as plain text.',
            );
          }
        }
        // record local activity (TTL 1 hour)
        try {
          pushActivity({ type: 'view', noteId: note.id, title: note.title });
        } catch (e) {
          /* ignore */
        }
      } catch {
        if (active) {
          setTextPreview(null);
          setTextPreviewError('Unable to load text preview.');
        }
      } finally {
        if (active) {
          setIsTextPreviewLoading(false);
        }
      }
    }

    void loadTextPreview();

    return () => {
      active = false;
    };
  }, [note]);

  if (!note) {
    return (
      <div className="flex min-h-[32rem] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="max-w-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Select a file</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Choose View on a topic file to open it here in a separate frame.
          </p>
        </div>
      </div>
    );
  }

  const kind = getViewerKind(note);
  const fileUrl = note.fileUrl || '';
  const previewHref = `/api/notes/${note.id}/file`;
  const officeViewerUrl = fileUrl ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}` : '';

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">File Preview</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{note.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Type: {note.type.toUpperCase()}</p>
        </div>

        <Link
          href={previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Open
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <div className="bg-slate-50 p-4 dark:bg-slate-900/30">
        {kind === 'pdf' ? (
          <iframe
            title={`${note.title} PDF preview`}
            src={previewHref}
            className="h-[32rem] w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800"
          />
        ) : kind === 'doc' && officeViewerUrl ? (
          <iframe
            title={`${note.title} document preview`}
            src={officeViewerUrl}
            className="h-[32rem] w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800"
          />
        ) : kind === 'doc' ? (
          <iframe
            title={`${note.title} document preview`}
            src={previewHref}
            className="h-[32rem] w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800"
          />
        ) : (
          <div className="h-[32rem] overflow-auto rounded-2xl border border-slate-200 bg-white p-5 text-[14px] leading-7 text-slate-700 [text-size-adjust:100%] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 sm:text-[15px]">
            {isTextPreviewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                Loading text preview...
              </div>
            ) : textPreviewError ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
                  <p className="font-semibold">Text preview unavailable</p>
                  <p className="mt-1">{textPreviewError}</p>
                  <p className="mt-2 text-xs text-amber-800/80 dark:text-amber-200/80">
                    Use Open to download the file or upload it as a real `.txt` note.
                  </p>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono tabular-nums tracking-[0.01em]">
                {textPreview || 'No text content available for this file.'}
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
