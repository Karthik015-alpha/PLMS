'use client'

import type { TopicStatus } from '@/types/topic'

type TopicProgressProps = {
  status: TopicStatus
}

const statusProgress: Record<TopicStatus, number> = {
  'Not Started': 0,
  'In Progress': 50,
  Completed: 100,
}

export default function TopicProgress({ status }: TopicProgressProps) {
  const progress = statusProgress[status]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
        <span>Completion estimate</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${
            status === 'Completed'
              ? 'bg-emerald-500'
              : status === 'In Progress'
              ? 'bg-amber-400'
              : 'bg-slate-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
