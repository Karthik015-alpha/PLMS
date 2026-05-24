'use client'

import { Clock3, ChevronRight, Edit3, Trash2 } from 'lucide-react'
import type { Topic } from '@/types/topic'
import TopicStatusBadge from './topic-status-badge'
import TopicProgress from './topic-progress'

type TopicCardProps = {
  topic: Topic
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function TopicCard({ topic, onView, onEdit, onDelete }: TopicCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Clock3 className="h-4 w-4" />
              Topic details
            </div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <TopicStatusBadge status={topic.status} />
              {topic.estimatedHours !== undefined ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {topic.estimatedHours} hrs
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        <TopicProgress status={topic.status} />

        <div className="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>Created: {new Date(topic.createdAt).toLocaleDateString()}</div>
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-2 text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            View topic
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
