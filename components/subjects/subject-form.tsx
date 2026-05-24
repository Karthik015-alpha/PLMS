'use client'

import { useState, type FormEvent } from 'react'
import { PlusCircle, Save } from 'lucide-react'
import type { SubjectCreatePayload } from '@/types/subject'

type SubjectFormProps = {
  mode: 'create' | 'edit'
  initialValues?: Partial<SubjectCreatePayload>
  onSubmit: (payload: SubjectCreatePayload) => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export default function SubjectForm({ mode, initialValues, onSubmit, loading, error }: SubjectFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')

  const submitLabel = mode === 'create' ? 'Create subject' : 'Save changes'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({ title: title.trim(), description: description.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-md shadow-indigo-500/10">
          <PlusCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{mode === 'create' ? 'New subject' : 'Edit subject'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Provide a clear name and optional description for the subject.</p>
        </div>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</div> : null}

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            placeholder="Enter subject title"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short summary for this subject"
            rows={5}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
