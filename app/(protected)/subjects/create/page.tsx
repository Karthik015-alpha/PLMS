'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSubjects } from '@/hooks/use-subjects'

export default function CreateSubjectPage() {
  const router = useRouter()
  const { createSubject, actionLoading, actionError } = useSubjects()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = await createSubject({ title, description: description || undefined })
    if (subject) {
      router.push(`/subjects/${subject.id}`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Create Subject</h1>
        <p className="text-sm text-gray-500">Add a new subject and start tracking its topics.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        {actionError && <p className="text-sm text-red-500">{actionError}</p>}

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 min-h-[120px]"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={actionLoading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {actionLoading ? 'Creating…' : 'Create Subject'}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
