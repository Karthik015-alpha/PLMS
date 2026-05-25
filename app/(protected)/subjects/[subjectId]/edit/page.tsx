'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSubjects } from '@/hooks/use-subjects'

export default function EditSubjectPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = Array.isArray(params?.subjectId) ? params.subjectId[0] : params?.subjectId
  const { subject, fetchSubject, updateSubject, actionLoading, actionError, loading } = useSubjects()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!subjectId) return
    fetchSubject(subjectId)
  }, [fetchSubject, subjectId])

  useEffect(() => {
    if (!subject) return
    setTitle(subject.title)
    setDescription(subject.description ?? '')
  }, [subject])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!subjectId) return

    const updated = await updateSubject(subjectId, {
      title,
      description: description.trim() ? description : undefined,
    })

    if (updated) {
      router.push(`/subjects/${subjectId}`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Edit Subject</h1>
        <p className="text-sm text-gray-500">Update subject details and save changes.</p>
      </div>

      {loading && <p>Loading subject data…</p>}
      {actionError && <p className="text-sm text-red-500">{actionError}</p>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
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
            {actionLoading ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
