'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSubjects } from '@/hooks/use-subjects'

export default function SubjectsPage() {
  const {
    subjects,
    loading,
    error,
    actionLoading,
    actionError,
    fetchSubjects,
    deleteSubject,
  } = useSubjects()

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this subject? This cannot be undone.')
    if (!confirmed) {
      return
    }

    await deleteSubject(id)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Subjects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subject list and track progress.</p>
        </div>
        <Link href="/subjects/create" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500">
          Create Subject
        </Link>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Loading subjects…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {actionError && <p className="text-sm text-red-500">{actionError}</p>}

      {!loading && subjects.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
          No subjects yet. Create one to get started.
        </div>
      )}

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{subject.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Progress: {subject.progress}%</p>
                {subject.description && <p className="mt-2 text-gray-600 dark:text-gray-300">{subject.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/subjects/${subject.id}`} className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700">
                  View
                </Link>
                <Link href={`/subjects/${subject.id}/edit`} className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(subject.id)}
                  disabled={actionLoading}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
