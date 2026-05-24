'use client'

import { BookOpen, Sparkles } from 'lucide-react'

export default function EmptySubjects() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
        <BookOpen className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold">No subjects yet</h2>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-6 text-slate-600 dark:text-slate-400">
        Create a subject to organize your learning topics. Subjects help you track progress and keep your study plan focused.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <Sparkles className="h-4 w-4" />
        Start by creating your first subject.
      </div>
    </div>
  )
}
