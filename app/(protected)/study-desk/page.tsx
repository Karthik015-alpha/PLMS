"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers3, FileText } from 'lucide-react';
import { useSubjects } from '@/hooks/use-subjects';
import type { Subject } from '@/types/subject';
import type { Note } from '@/types/note';
import { FileViewer } from '@/components/notes/file-viewer';

type TopicItem = {
  id: string;
  title: string;
  status: string;
  estimatedHours?: number;
  notes: Note[];
};

type TopicsBySubject = Record<string, TopicItem[]>;

async function fetchTopicsForSubject(subjectId: string): Promise<TopicItem[]> {
  const [topicsResponse, notesResponse] = await Promise.all([
    fetch(`/api/topics?subjectId=${encodeURIComponent(subjectId)}`),
    fetch(`/api/notes?subjectId=${encodeURIComponent(subjectId)}`),
  ]);

  const topicsPayload = await topicsResponse.json().catch(() => null);
  const notesPayload = await notesResponse.json().catch(() => null);

  if (!topicsPayload?.success || !Array.isArray(topicsPayload.data)) {
    return [];
  }

  const notesByTopic = new Map<string, Note[]>();
  const notes = Array.isArray(notesPayload?.data) ? (notesPayload.data as Note[]) : [];

  for (const note of notes) {
    const existing = notesByTopic.get(note.topicId) ?? [];
    existing.push(note);
    notesByTopic.set(note.topicId, existing);
  }

  return topicsPayload.data.map((item: any) => ({
    id: item.id,
    title: item.name ?? item.title,
    status: item.metadata?.status ?? item.status ?? 'Not Started',
    estimatedHours: item.metadata?.estimated_hours ?? item.estimated_hours ?? item.estimatedHours,
    notes: notesByTopic.get(item.id) ?? [],
  }));
}

function TopicSection({
  subject,
  topic,
  onSelectNote,
}: {
  subject: Subject;
  topic: TopicItem;
  onSelectNote: (note: Note) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status: {topic.status}</p>
          {topic.estimatedHours !== undefined ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Estimated hours: {topic.estimatedHours}</p>
          ) : null}
          <Link
            href={`/subjects/${subject.id}/topics/${topic.id}`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-200"
          >
            Open topic
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Files</div>
          <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{topic.notes.length}</div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {topic.notes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            No files attached to this topic yet.
          </div>
        ) : (
          topic.notes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{note.title}</p>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {note.type.toUpperCase()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectNote(note)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                View
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function SubjectSection({
  subject,
  topics,
  onSelectNote,
}: {
  subject: Subject;
  topics: TopicItem[];
  onSelectNote: (note: Note) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <BookOpen className="h-4 w-4" />
            Subject
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{subject.title}</h2>
          {subject.description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subject.description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right dark:bg-slate-900">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Progress</div>
          <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{subject.progress}%</div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Layers3 className="h-4 w-4" />
            Topics
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{topics.length} total</span>
        </div>

        <div className="mt-4 grid gap-3">
          {topics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No topics created yet.
            </div>
          ) : (
            topics.map((topic) => (
              <TopicSection key={topic.id} subject={subject} topic={topic} onSelectNote={onSelectNote} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function StudyDeskPage() {
  const { subjects, loading, error, fetchSubjects } = useSubjects();
  const [topicsBySubject, setTopicsBySubject] = useState<TopicsBySubject>({});
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDesktopPreviewOpen, setIsDesktopPreviewOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollPreviewRef = useRef(false);

  const handleSelectNote = (note: Note) => {
    shouldScrollPreviewRef.current = !isDesktop;
    setSelectedNote(note);
    if (isDesktop) {
      setIsDesktopPreviewOpen(true);
    }
  };

  const handleCloseDesktopPreview = () => {
    setIsDesktopPreviewOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const updateMode = () => setIsDesktop(mediaQuery.matches);
    updateMode();

    mediaQuery.addEventListener('change', updateMode);

    return () => {
      mediaQuery.removeEventListener('change', updateMode);
    };
  }, []);

  useEffect(() => {
    void fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (subjects.length === 0) {
      setTopicsBySubject({});
      setSelectedNote(null);
      return;
    }

    let active = true;

    async function loadTopics() {
      setTopicsLoading(true);
      setTopicsError(null);

      try {
        const results = await Promise.all(
          subjects.map(async (subject) => [subject.id, await fetchTopicsForSubject(subject.id)] as const),
        );

        if (!active) {
          return;
        }

        const groupedTopics = Object.fromEntries(results);
        setTopicsBySubject(groupedTopics);

        const firstNote = results.flatMap(([, subjectTopics]) => subjectTopics.flatMap((topic) => topic.notes)).find(Boolean) ?? null;
        setSelectedNote((current) => current ?? firstNote);
      } catch (err) {
        if (!active) {
          return;
        }

        setTopicsError((err as Error).message);
      } finally {
        if (active) {
          setTopicsLoading(false);
        }
      }
    }

    void loadTopics();

    return () => {
      active = false;
    };
  }, [subjects]);

  useEffect(() => {
    if (!shouldScrollPreviewRef.current || !selectedNote || !previewRef.current) {
      return;
    }

    shouldScrollPreviewRef.current = false;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      const top = previewRef.current.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      return;
    }

    previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedNote]);

  useEffect(() => {
    if (isDesktop) {
      setIsDesktopPreviewOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Study Desk</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse your subjects, inspect their topics, and open attached PDF, Word, or text files in the preview frame.
        </p>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading subjects…</p>}
      {(error || topicsError) && <p className="text-sm text-red-500">{error || topicsError}</p>}
      {topicsLoading && <p className="text-sm text-slate-500">Loading topics and files…</p>}

      {!loading && subjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No subjects found.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)] xl:items-start">
        <div className="grid gap-5">
          {subjects.map((subject) => (
            <SubjectSection
              key={subject.id}
              subject={subject}
              topics={topicsBySubject[subject.id] ?? []}
              onSelectNote={handleSelectNote}
            />
          ))}
        </div>

      </div>

      <div ref={previewRef} className="md:hidden scroll-mt-24">
        <FileViewer note={selectedNote} />
      </div>

      {isDesktop && isDesktopPreviewOpen && selectedNote ? (
        <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <button
              type="button"
              onClick={handleCloseDesktopPreview}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-md transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Close
            </button>
            <div className="max-h-[calc(100vh-3rem)] overflow-auto p-4 md:p-6">
              <FileViewer note={selectedNote} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
