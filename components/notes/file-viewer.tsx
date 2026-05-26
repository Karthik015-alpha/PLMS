"use client";

import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import type { Note } from '@/types/note';
import { pushActivity } from '@/lib/activity-local';

type FileViewerProps = {
  note: Note | null;
  hideHeader?: boolean;
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

export function FileViewer({ note, hideHeader = false }: FileViewerProps) {
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
      <div className="flex min-h-[32rem] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0a0a0a] px-6 py-10 text-center shadow-lg relative overflow-hidden">
        {/* Subtle grid background specifically for the viewer container */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-neutral-400 border border-white/10">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white tracking-tight">Select a file</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-400 font-normal">
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
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] shadow-lg relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {!hideHeader && (
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/[0.05] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ff9d]">File Preview</p>
            <h3 className="mt-1 text-lg font-bold text-white tracking-tight">{note.title}</h3>
            <p className="text-xs font-mono text-neutral-500 mt-0.5 uppercase">Type: {note.type}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-neutral-950/80 p-4">
        {kind === 'pdf' ? (
          <iframe
            title={`${note.title} PDF preview`}
            src={previewHref}
            className="h-[32rem] w-full rounded-2xl border border-white/[0.05] bg-[#030303]"
          />
        ) : kind === 'doc' && officeViewerUrl ? (
          <iframe
            title={`${note.title} document preview`}
            src={officeViewerUrl}
            className="h-[32rem] w-full rounded-2xl border border-white/[0.05] bg-[#030303]"
          />
        ) : kind === 'doc' ? (
          <iframe
            title={`${note.title} document preview`}
            src={previewHref}
            className="h-[32rem] w-full rounded-2xl border border-white/[0.05] bg-[#030303]"
          />
        ) : (
          <div className="h-[32rem] overflow-auto rounded-2xl border border-white/[0.08] bg-[#030303] p-5 text-[14px] leading-7 text-neutral-300 [text-size-adjust:100%] sm:text-[15px]">
            {isTextPreviewLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 font-mono">
                Loading text preview...
              </div>
            ) : textPreviewError ? (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-4 text-sm leading-6 text-amber-200">
                  <p className="font-semibold text-amber-100 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500" />
                    Text preview unavailable
                  </p>
                  <p className="mt-1.5 text-neutral-400">{textPreviewError}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    Use Open to download the file or upload it as a real `.txt` note.
                  </p>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-words font-mono text-[13px] text-neutral-200 tracking-tight">
                {textPreview || 'No text content available for this file.'}
              </pre>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
