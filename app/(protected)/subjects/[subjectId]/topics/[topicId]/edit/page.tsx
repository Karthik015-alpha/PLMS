'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTopics } from '@/hooks/use-topics'
import { TOPIC_STATUS_VALUES } from '@/types/topic'

export default function EditTopicPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = Array.isArray(params?.subjectId) ? params.subjectId[0] : params?.subjectId
  const topicId = Array.isArray(params?.topicId) ? params.topicId[0] : params?.topicId
  const { topic, fetchTopic, updateTopic, loading, actionLoading, actionError } = useTopics()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<typeof TOPIC_STATUS_VALUES[number]>(TOPIC_STATUS_VALUES[0])
  const [estimatedHours, setEstimatedHours] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [uploadingNote, setUploadingNote] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    if (selected) {
      setNoteTitle(selected.name.replace(/\.[^/.]+$/, ''))
    } else {
      setNoteTitle('')
    }
  }

  useEffect(() => {
    if (!topicId) return
    fetchTopic(topicId)
  }, [fetchTopic, topicId])

  useEffect(() => {
    if (!topic) return
    setTitle(topic.title)
    setStatus(topic.status)
    setEstimatedHours(topic.estimatedHours?.toString() ?? '')
  }, [topic])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!topicId) return

    setUploadError(null)

    const parsedHours = estimatedHours ? Number(estimatedHours) : undefined
    const updated = await updateTopic(topicId, {
      title,
      status,
      estimatedHours: parsedHours,
    })

    if (updated && subjectId) {
      if (file) {
        setUploadingNote(true)
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('title', noteTitle || file.name.replace(/\.[^/.]+$/, ''))
          formData.append('subjectId', subjectId)
          formData.append('topicId', topicId)

          const response = await fetch('/api/notes', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json().catch(() => null)
          if (!response.ok || !result?.success) {
            throw new Error(result?.error || 'Failed to upload the topic file.')
          }
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to upload the topic file.'
          setUploadError(message)
          return
        } finally {
          setUploadingNote(false)
        }
      }
      router.push(`/subjects/${subjectId}/topics/${topicId}`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Edit Topic</h1>
        <p className="text-sm text-gray-500">Update the topic title, status, or estimated effort.</p>
      </div>

      {loading && <p>Loading topic…</p>}
      {actionError && <p className="text-sm text-red-500">{actionError}</p>}
      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

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
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof TOPIC_STATUS_VALUES[number])}
            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
          >
            {TOPIC_STATUS_VALUES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Estimated Hours</span>
          <input
            value={estimatedHours}
            onChange={(event) => setEstimatedHours(event.target.value)}
            type="number"
            min="0"
            step="1"
            className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
          />
        </label>

        <div className="block">
          <label className="block">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Attach Additional Note (Optional)</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 text-gray-900 dark:text-gray-300"
              accept=".pdf,.txt,.md,.doc,.docx"
            />
            <p className="mt-1 text-xs text-gray-500">Automatically uploads and links to this topic.</p>
          </label>

          {file && (
            <label className="block mt-3">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Note Title</span>
              <input
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter a title for this note"
                className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
                required
              />
            </label>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={actionLoading || uploadingNote}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {actionLoading ? 'Saving…' : uploadingNote ? 'Uploading Note…' : 'Save topic'}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
