'use client'

import type { TopicStatus } from '@/types/topic'

const statusStyles: Record<TopicStatus, string> = {
  'Not Started': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
}

type TopicStatusBadgeProps = {
  status: TopicStatus
}

export default function TopicStatusBadge({ status }: TopicStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
