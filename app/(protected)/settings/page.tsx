'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Shield, User, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/use-profile';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { profile, isLoading, error: profileError, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') setTheme('dark');
      else if (stored === 'light') setTheme('light');
      else setTheme('system');
    }
  }, []);

  // Initialize display name input value when profile is fetched
  useEffect(() => {
    if (profile?.display_name) {
      setTempName(profile.display_name);
    }
  }, [profile]);

  // Clear success banner after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleEdit = () => {
    setTempName(profile?.display_name || '');
    setValidationError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempName(profile?.display_name || '');
    setValidationError(null);
  };

  const handleSave = async () => {
    if (!tempName.trim()) {
      setValidationError('Display name cannot be empty');
      return;
    }
    
    setIsSaving(true);
    setValidationError(null);
    setSaveSuccess(false);

    try {
      await updateProfile(tempName);
      setIsEditing(false);
      setSaveSuccess(true);
    } catch (err) {
      setValidationError((err as Error).message || 'Failed to save display name.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Manage your profile settings, app preferences, and visual theme.
      </p>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm relative overflow-hidden">
          
          {/* Skeleton or Loading Overlay */}
          {isLoading && !profile && (
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6" />
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              </div>
            </div>
          )}

          {(!isLoading || profile) && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Personal Profile</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Developer Account</p>
                </div>
              </div>

              {/* Status notifications */}
              {profileError && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs border border-rose-100 dark:border-rose-950/50">
                  Error loading profile: {profileError}
                </div>
              )}

              {saveSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs border border-emerald-100 dark:border-emerald-950/50 flex items-center gap-2">
                  <Check size={14} /> Profile updated successfully!
                </div>
              )}

              {validationError && (
                <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs border border-rose-100 dark:border-rose-950/50">
                  {validationError}
                </div>
              )}

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 grid gap-4">
                {/* Display Name Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800/40 text-sm gap-2">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Display Name</span>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        disabled={isSaving}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 text-sm"
                        placeholder="Enter display name"
                        autoFocus
                      />
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        title="Save"
                      >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="p-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 dark:text-gray-200 font-semibold">
                        {profile?.display_name || 'N/A'}
                      </span>
                      <button
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded hover:bg-gray-50 dark:hover:bg-slate-800/50"
                        title="Edit Display Name"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Address Row */}
                <div className="flex justify-between py-2 text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Email Address</span>
                  <span className="text-gray-900 dark:text-gray-200 font-semibold">{profile?.email || 'N/A'}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Settings Card */}
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Choose how you want the interface to look. Adjust settings for light, dark, or system preference.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => changeTheme('light')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Sun size={20} className="mb-2" />
              <span className="text-sm">Light</span>
            </button>

            <button
              onClick={() => changeTheme('dark')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Moon size={20} className="mb-2" />
              <span className="text-sm">Dark</span>
            </button>

            <button
              onClick={() => changeTheme('system')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                theme === 'system'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <Laptop size={20} className="mb-2" />
              <span className="text-sm">System</span>
            </button>
          </div>
        </div>

        {/* Security / System Info Card */}
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-2xl bg-white dark:bg-slate-900/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">System Preferences</h2>
          </div>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 dark:text-gray-400">Database Sync Status</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Connected</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 dark:text-gray-400">Application Version</span>
              <span className="text-gray-600 dark:text-gray-300">0.1.0-alpha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
