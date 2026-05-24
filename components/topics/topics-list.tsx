'use client'

import type { Topic } from '@/types/topic'
import TopicCard from './topic-card'

type TopicsListProps = {
  topics: Topic[]
  onView?: (topic: Topic) => void
  onEdit?: (topic: Topic) => void
  onDelete?: (topic: Topic) => void
}

export default function TopicsList({ topics, onView, onEdit, onDelete }: TopicsListProps) {
  if (topics.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <p className="text-lg font-semibold">No topics found</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add a topic to begin tracking your progress for this subject.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onView={() => onView?.(topic)}
          onEdit={() => onEdit?.(topic)}
          onDelete={() => onDelete?.(topic)}
        />
      ))}
    </div>
  )
}
