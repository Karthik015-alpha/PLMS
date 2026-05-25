'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useSubjects } from '@/hooks/use-subjects'
import { useTopics } from '@/hooks/use-topics'

export default function SubjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = Array.isArray(params?.subjectId) ? params.subjectId[0] : params?.subjectId
  const {
    subject,
    loading: subjectLoading,
    error: subjectError,
    fetchSubject,
    deleteSubject,
  } = useSubjects()
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
    fetchTopics,
    deleteTopic,
  } = useTopics()

  useEffect(() => {
    if (!subjectId) return
    fetchSubject(subjectId)
    fetchTopics(subjectId)
  }, [fetchSubject, fetchTopics, subjectId])

  const handleDeleteSubject = async () => {
    if (!subjectId) return
    const confirmed = window.confirm('Delete this subject and all topics?')
    if (!confirmed) return

    const deleted = await deleteSubject(subjectId)
    if (deleted) {
      router.push('/subjects')
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    const confirmed = window.confirm('Delete this topic?')
    if (!confirmed) return

    await deleteTopic(topicId)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Subject details</h1>
          <p className="text-sm text-gray-500">Review the subject and manage its topics.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/subjects" className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            Back to subjects
          </Link>
          <Link href={`/subjects/${subjectId}/edit`} className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-900 hover:bg-slate-200">
            Edit subject
          </Link>
          <button
            type="button"
            onClick={handleDeleteSubject}
            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
          >
            Delete subject
          </button>
        </div>
      </div>

      {subjectLoading && <p>Loading subject…</p>}
      {(subjectError || topicsError) && <p className="text-sm text-red-500">{subjectError || topicsError}</p>}

      {subject && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{subject.title}</h2>
          <p className="text-sm text-gray-500 mt-1">Progress: {subject.progress}%</p>
          {subject.description && <p className="mt-4 text-gray-700 dark:text-gray-300">{subject.description}</p>}
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Created: {new Date(subject.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(subject.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Topics</h2>
        <Link href={`/subjects/${subjectId}/topics/create`} className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
          Add topic
        </Link>
      </div>

      {topicsLoading && <p>Loading topics…</p>}
      {!topicsLoading && topics.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-600 dark:text-gray-400">
          No topics created for this subject yet.
        </div>
      )}

      <div className="grid gap-4">
        {topics.map((topic) => (
          <div key={topic.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{topic.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Status: {topic.status}</p>
                {topic.estimatedHours !== undefined && (
                  <p className="text-sm text-gray-500">Estimated hours: {topic.estimatedHours}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/subjects/${subjectId}/topics/${topic.id}`} className="rounded-md bg-slate-100 dark:bg-gray-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700">
                  View
                </Link>
                <Link href={`/subjects/${subjectId}/topics/${topic.id}/edit`} className="rounded-md bg-slate-100 dark:bg-gray-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
