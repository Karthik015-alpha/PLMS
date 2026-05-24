'use client'

import type { Subject } from '@/types/subject'
import SubjectCard from './subject-card'

type SubjectsGridProps = {
  subjects: Subject[]
  onView?: (subject: Subject) => void
  onEdit?: (subject: Subject) => void
  onDelete?: (subject: Subject) => void
}

export default function SubjectsGrid({ subjects, onView, onEdit, onDelete }: SubjectsGridProps) {
  if (subjects.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onView={() => onView?.(subject)}
          onEdit={() => onEdit?.(subject)}
          onDelete={() => onDelete?.(subject)}
        />
      ))}
    </div>
  )
}
