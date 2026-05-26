"use client"

import React, { useState, useEffect } from 'react'
import { User, Edit2, Check, X, Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/use-profile'

export default function ProfilePopover() {
  const { profile, isLoading, error, updateProfile, refetchProfile } = useProfile()
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [tempRole, setTempRole] = useState<string>('')
  const [isSavingRole, setIsSavingRole] = useState(false)

  useEffect(() => {
    if (profile?.display_name) setTempName(profile.display_name)
    else if (profile?.email) setTempName(profile.email)
    // initialize role from metadata if present
    const roleFromMeta = profile?.metadata?.role
    if (roleFromMeta) setTempRole(String(roleFromMeta))
  }, [profile])

  useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(() => setSaveSuccess(false), 2500)
      return () => clearTimeout(t)
    }
  }, [saveSuccess])

  const handleSave = async () => {
    if (!tempName.trim()) return
    setIsSaving(true)
    try {
      await updateProfile({ displayName: tempName })
      setIsEditing(false)
      setSaveSuccess(true)
      refetchProfile()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveRole = async () => {
    if (!tempRole.trim()) return
    setIsSavingRole(true)
    try {
      await updateProfile({ role: tempRole })
      setIsEditingRole(false)
      setSaveSuccess(true)
      refetchProfile()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingRole(false)
    }
  }

  // derive initial and background color from display name/email
  const displayLabel = (profile?.display_name && profile.display_name.trim()) || (profile?.email && profile.email.trim()) || 'U'
  const initial = displayLabel.charAt(0).toUpperCase()
  const colors = ['#7c3aed', '#06b6d4', '#0ea5e9', '#fb923c', '#ef4444', '#10b981', '#6366f1']
  const bgColor = colors[initial.charCodeAt(0) % colors.length]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Open profile"
        className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: bgColor }}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-4 z-50">
          {isLoading && !profile ? (
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: bgColor }}>
                  {initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{profile?.display_name || 'N/A'}</h3>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-indigo-600 p-1 rounded" title="Edit">
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{profile?.email || 'No email'}</div>
                </div>
              </div>

              {saveSuccess && <div className="mb-2 text-xs text-green-600">Saved!</div>}

              {isEditing ? (
                <div className="flex gap-2">
                  <input value={tempName} onChange={(e) => setTempName(e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 text-sm" />
                  <button onClick={handleSave} disabled={isSaving} className="p-1 bg-indigo-600 text-white rounded">
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                  <button onClick={() => { setIsEditing(false); setTempName(profile?.display_name || '') }} className="p-1 bg-gray-100 dark:bg-slate-800 rounded">
                    <X size={14} />
                  </button>
                </div>
              ) : null}

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                <div className="mb-1">Account</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span>Role</span>
                    {!isEditingRole ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{profile?.metadata?.role ?? 'Student'}</span>
                        <button onClick={() => setIsEditingRole(true)} className="text-gray-400 hover:text-indigo-600 p-1 rounded" title="Edit role">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select value={tempRole} onChange={(e) => setTempRole(e.target.value)} className="px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
                          <option value="Student">Student</option>
                          <option value="Educator">Educator</option>
                          <option value="Admin">Admin</option>
                          <option value="Developer">Developer</option>
                        </select>
                        <button onClick={handleSaveRole} disabled={isSavingRole} className="p-1 bg-indigo-600 text-white rounded">
                          {isSavingRole ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        </button>
                        <button onClick={() => { setIsEditingRole(false); setTempRole(profile?.metadata?.role || '') }} className="p-1 bg-gray-100 dark:bg-slate-800 rounded">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
