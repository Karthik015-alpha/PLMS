'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useTopics } from '@/hooks/use-topics'

import { NotesSidebar } from '@/components/notes/notes-sidebar'

export default function TopicDetailPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = Array.isArray(params?.subjectId) ? params.subjectId[0] : params?.subjectId
  const topicId = Array.isArray(params?.topicId) ? params.topicId[0] : params?.topicId
  const { topic, loading, error, fetchTopic, deleteTopic } = useTopics()
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0)

  useEffect(() => {
    if (!topicId) return
    fetchTopic(topicId)
  }, [fetchTopic, topicId])

  // Re-fetch sidebar notes whenever the user returns to this page
  // (e.g., after uploading a note via the edit page)
  useEffect(() => {
    const handleFocus = () => setSidebarRefreshKey(k => k + 1)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') setSidebarRefreshKey(k => k + 1)
    }
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  const handleDelete = async () => {
    if (!topicId || !subjectId) return
    const confirmed = window.confirm('Delete this topic?')
    if (!confirmed) return

    const deleted = await deleteTopic(topicId)
    if (deleted) {
      router.push(`/subjects/${subjectId}`)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Topic details</h1>
            <p className="text-sm text-gray-500">Review topic progress and update details.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/subjects/${subjectId}`} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              Back to subject
            </Link>
            <Link href={`/subjects/${subjectId}/topics/${topicId}/edit`} className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-900 hover:bg-slate-200">
              Edit topic
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
            >
              Delete topic
            </button>
          </div>
        </div>

        {loading && <p>Loading topic…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {topic && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">{topic.title}</h2>
            <p className="text-sm text-gray-500 mt-2">Status: {topic.status}</p>
            {topic.estimatedHours !== undefined && (
              <p className="text-sm text-gray-500 mt-2">Estimated hours: {topic.estimatedHours}</p>
            )}
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>Created: {new Date(topic.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(topic.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>

      {subjectId && topicId && (
        <div className="w-full lg:w-96 shrink-0 h-full">
          <NotesSidebar
            key={sidebarRefreshKey}
            subjectId={subjectId}
            topicId={topicId}
            className="rounded-xl shadow-sm border-l-0"
          />
        </div>
      )}
    </div>
  )
}
