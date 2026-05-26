"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, Layers3, Search, X } from 'lucide-react';
import type { Subject } from '@/types/subject';
import type { Note } from '@/types/note';
import { TOPIC_STATUS_VALUES, type TopicStatus } from '@/types/topic';
import { FileViewer } from '@/components/notes/file-viewer';
import TopicStatusBadge from '@/components/topics/topic-status-badge';
import { Input } from '@/components/ui/input';
import { useStudyDesk, type StudyDeskTopicItem } from '@/hooks/use-study-desk';

type TopicStatusFilter = TopicStatus | 'All';

const TOPIC_STATUS_FILTERS: Array<{ value: TopicStatusFilter; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
];

function matchesSearch(topic: StudyDeskTopicItem, subject: Subject, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    topic.title,
    subject.title,
    subject.description ?? '',
    ...topic.notes.map((note) => [note.title, note.content ?? ''].join(' ')),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

function TopicSection({
  subject,
  topic,
  onSelectNote,
  onComplete,
  completingIds,
}: {
  subject: Subject;
  topic: StudyDeskTopicItem;
  onSelectNote: (note: Note, topic: StudyDeskTopicItem, subjectId: string) => void;
  onComplete: (subjectId: string, topicId: string, title: string) => void;
  completingIds?: string[];
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h3>
          {topic.estimatedHours !== undefined && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estimated hours: {topic.estimatedHours}</p>
          )}
        </div>

          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void onComplete(subject.id, topic.id, topic.title)}
            title="Mark topic complete"
            disabled={topic.status === 'Completed' || (completingIds || []).includes(topic.id)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-green-600 hover:bg-green-50 dark:border-slate-700 dark:bg-slate-900 dark:text-green-300 ${topic.status === 'Completed' || (completingIds || []).includes(topic.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ✓
          </button>

          <button
            type="button"
            onClick={() => {
              // Prefer a note that has a fileUrl, otherwise open the first note
              const noteToOpen = topic.notes.find((n) => !!n.fileUrl) ?? topic.notes[0] ?? null;
              if (noteToOpen) onSelectNote(noteToOpen, topic, subject.id);
              else window.location.href = `/subjects/${subject.id}/topics/${topic.id}`;
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200"
            title="Open topic files"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function SubjectSection({
  subject,
  topics,
  onSelectNote,
  onComplete,
  completingIds,
}: {
  subject: Subject;
  topics: StudyDeskTopicItem[];
  onSelectNote: (note: Note, topic: StudyDeskTopicItem, subjectId: string) => void;
  onComplete: (subjectId: string, topicId: string, title: string) => void;
  completingIds?: string[];
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
                  <TopicSection key={topic.id} subject={subject} topic={topic} onSelectNote={onSelectNote} onComplete={onComplete} completingIds={completingIds} />
                ))
          )}
        </div>
      </div>
    </section>
  );
}

export default function StudyDeskPage() {
  const {
    subjects,
    subjectsLoading,
    subjectsError,
    topicsBySubject,
    topicsLoading,
    topicsError,
    updateTopicStatus,
    completeTopic,
  } = useStudyDesk();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<TopicStatusFilter>('All');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDesktopPreviewOpen, setIsDesktopPreviewOpen] = useState(false);
  const [completingIds, setCompletingIds] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollPreviewRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim().toLowerCase());
    }, 180);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const filteredSections = useMemo(() => {
    return subjects
      .map((subject) => {
        const topics = topicsBySubject[subject.id] ?? [];
        const filteredTopics = topics.filter((topic) => {
          const subjectMatches = selectedSubjectId === 'all' || subject.id === selectedSubjectId;
          const searchMatches = matchesSearch(topic, subject, debouncedSearchQuery);
          const statusMatches = selectedStatus === 'All' || topic.status === selectedStatus;

          return subjectMatches && searchMatches && statusMatches;
        });

        return { subject, topics: filteredTopics };
      })
      .filter((section) => section.topics.length > 0);
  }, [debouncedSearchQuery, selectedStatus, selectedSubjectId, subjects, topicsBySubject]);

  const searchScopedTopics = useMemo(() => {
    return subjects.flatMap((subject) => {
      const topics = topicsBySubject[subject.id] ?? [];

      if (selectedSubjectId !== 'all' && subject.id !== selectedSubjectId) {
        return [];
      }

      return topics.filter((topic) => matchesSearch(topic, subject, debouncedSearchQuery));
    });
  }, [debouncedSearchQuery, selectedSubjectId, subjects, topicsBySubject]);

  const subjectOptions = useMemo(() => {
    const totalCount = Object.values(topicsBySubject).reduce((sum, topicList) => sum + topicList.length, 0);

    return [
      { id: 'all', label: 'All', count: totalCount },
      ...subjects.map((subject) => ({
        id: subject.id,
        label: subject.title,
        count: topicsBySubject[subject.id]?.length ?? 0,
      })),
    ];
  }, [subjects, topicsBySubject]);

  const statusCounts = useMemo(() => {
    return TOPIC_STATUS_VALUES.reduce<Record<TopicStatus, number>>(
      (accumulator, status) => {
        accumulator[status] = searchScopedTopics.filter((topic) => topic.status === status).length;
        return accumulator;
      },
      {
        'Not Started': 0,
        'In Progress': 0,
        Completed: 0,
      },
    );
  }, [searchScopedTopics]);

  const totalTopics = useMemo(
    () => Object.values(topicsBySubject).reduce((sum, topicList) => sum + topicList.length, 0),
    [topicsBySubject],
  );

  const visibleTopicCount = filteredSections.reduce((sum, section) => sum + section.topics.length, 0);
  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedSubjectId !== 'all' || selectedStatus !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedSubjectId('all');
    setSelectedStatus('All');
  };

  const handleSelectNote = (note: Note, topic: StudyDeskTopicItem, subjectId: string) => {
    setSelectedNote(note);
    shouldScrollPreviewRef.current = true;
    // On mobile open the modal preview; on desktop show inline preview
    if (!isDesktop) setIsDesktopPreviewOpen(true);

    if (topic.status === 'Not Started') {
      void updateTopicStatus(subjectId, topic.id, topic.title);
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

  const handleComplete = async (subjectId: string, topicId: string, title: string) => {
    if (completingIds.includes(topicId)) return
    setCompletingIds((s) => [...s, topicId])
    try {
      await completeTopic(subjectId, topicId, title)
    } finally {
      setCompletingIds((s) => s.filter((id) => id !== topicId))
    }
  }

  useEffect(() => {
    if (subjects.length === 0) {
      setSelectedNote(null);
    }
  }, [subjects.length]);

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

      <div className="sticky top-4 z-20 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 group">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-slate-700 dark:text-slate-500 dark:group-focus-within:text-slate-300" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search topics, notes, or concepts..."
              className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-sky-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:placeholder:text-slate-500 dark:focus-visible:bg-slate-950"
            />
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              Clear Filters
            </button>
          ) : null}
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <BookOpen className="h-4 w-4" />
              Subjects
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {totalTopics} topics
            </div>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {subjectOptions.map((subject) => {
              const isActive = selectedSubjectId === subject.id;

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className={`inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? 'border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/10 dark:border-white dark:bg-white dark:text-slate-950' : 'border-slate-200 bg-slate-50 text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white'}`}
                >
                  <span>{subject.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? 'bg-white/15 text-white dark:bg-slate-950/10 dark:text-slate-950' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {subject.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Layers3 className="h-4 w-4" />
              Progress
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {TOPIC_STATUS_FILTERS.map((filterOption) => {
              const isActive = selectedStatus === filterOption.value;
              const count = filterOption.value === 'All' ? searchScopedTopics.length : statusCounts[filterOption.value];

              const colorClasses =
                filterOption.value === 'Not Started'
                  ? 'border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800'
                  : filterOption.value === 'In Progress'
                    ? 'border-amber-200 bg-amber-100 text-amber-700 hover:border-amber-300 hover:bg-amber-200 dark:border-amber-950 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60'
                    : filterOption.value === 'Completed'
                      ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-200 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60'
                      : 'border-sky-200 bg-sky-100 text-sky-700 hover:border-sky-300 hover:bg-sky-200 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/60';

              return (
                <button
                  key={filterOption.value}
                  type="button"
                  onClick={() => setSelectedStatus(filterOption.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? 'ring-2 ring-sky-500/15 ring-offset-2 ring-offset-white dark:ring-offset-slate-950' : 'opacity-90 hover:-translate-y-0.5 hover:opacity-100'} ${colorClasses}`}
                >
                  <span>{filterOption.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? 'bg-white/70 text-slate-900 dark:bg-slate-950/20 dark:text-slate-950' : 'bg-white/70 text-current dark:bg-white/10'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {subjectsLoading && <p className="text-sm text-slate-500">Loading subjects…</p>}
      {(subjectsError || topicsError) && <p className="text-sm text-red-500">{subjectsError || topicsError}</p>}
      {topicsLoading && <p className="text-sm text-slate-500">Loading topics and files…</p>}

      {!subjectsLoading && subjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
          No subjects found.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)] xl:items-start">
        <div className="grid gap-5">
          {!subjectsLoading && subjects.length > 0 && filteredSections.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">No topics match your filters</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Try a broader search or clear the subject and progress filters to bring the topic list back.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Clear Filters
              </button>
            </div>
          ) : null}

          {filteredSections.map(({ subject, topics }) => (
            <SubjectSection
              key={subject.id}
              subject={subject}
              topics={topics}
              onSelectNote={handleSelectNote}
              onComplete={handleComplete}
              completingIds={completingIds}
            />
          ))}
        </div>
      </div>

      {isDesktopPreviewOpen && selectedNote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative z-30 flex items-center justify-between border-b border-white/[0.05] bg-[#0d0d0d]/80 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#00ff9d]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00ff9d]">File Preview</p>
                  <h3 className="max-w-[15rem] truncate text-base font-bold tracking-tight text-white sm:max-w-md">
                    {selectedNote.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDesktopPreview}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-neutral-400 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                title="Close Preview"
              >
                <X className="size-5 transition-transform group-hover:scale-110" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-neutral-950/20 p-4 md:p-6">
              <FileViewer note={selectedNote} hideHeader={true} />
            </div>
          </div>
        </div>
      ) : null}

      {isDesktop && selectedNote ? (
        <div ref={previewRef} className="mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <FileViewer note={selectedNote} hideHeader={false} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
