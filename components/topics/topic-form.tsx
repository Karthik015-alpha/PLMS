'use client'

import { useState, type FormEvent } from 'react'
import { PlusCircle, Save } from 'lucide-react'
import type { TopicCreatePayload, TopicUpdatePayload, TopicStatus } from '@/types/topic'
import { TOPIC_STATUS_VALUES } from '@/types/topic'

type TopicFormProps = {
  mode: 'create' | 'edit'
  initialValues?: Partial<TopicCreatePayload>
  onSubmit: (payload: TopicCreatePayload | TopicUpdatePayload) => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export default function TopicForm({ mode, initialValues, onSubmit, loading, error }: TopicFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [status, setStatus] = useState<TopicStatus>(initialValues?.status ?? TOPIC_STATUS_VALUES[0])
  const [estimatedHours, setEstimatedHours] = useState(initialValues?.estimatedHours?.toString() ?? '')

  const submitLabel = mode === 'create' ? 'Create topic' : 'Save changes'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      title: title.trim(),
      status,
      estimatedHours: estimatedHours.trim() ? Number(estimatedHours) : undefined,
      subjectId: initialValues?.subjectId,
    } as TopicCreatePayload | TopicUpdatePayload

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-emerald-600 p-3 text-white shadow-md shadow-emerald-500/10">
          <PlusCircle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{mode === 'create' ? 'Add topic' : 'Edit topic'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Capture title, status, and estimated effort for this topic.</p>
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
            placeholder="Enter topic title"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TopicStatus)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            >
              {TOPIC_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Estimated hours
            <input
              value={estimatedHours}
              onChange={(event) => setEstimatedHours(event.target.value)}
              type="number"
              min="0"
              placeholder="Optional"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/20"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
