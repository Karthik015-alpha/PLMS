'use client'

import { ArrowRight, Edit3, Trash2 } from 'lucide-react'
import type { Subject } from '@/types/subject'
import Card from '@/ui/card'
import SubjectProgress from './subject-progress'

type SubjectCardProps = {
  subject: Subject
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function SubjectCard({ subject, onView, onEdit, onDelete }: SubjectCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:items-start sm:justify-between sm:flex-row">
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-500">Subject</div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{subject.title}</h3>
            {subject.description ? (
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{subject.description}</p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">No description provided.</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
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

        <div className="space-y-3">
          <SubjectProgress value={subject.progress} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Progress: {subject.progress}%</span>
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
