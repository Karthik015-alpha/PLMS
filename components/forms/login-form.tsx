'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../features/auth/auth.validation'
import type { LoginFormData } from '../../features/auth/auth.types'
import { loginUser } from '../../features/auth/auth.actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginFormData) {
    setServerError(null)
    setIsLoading(true)
    try {
      const res = await loginUser(values)
      const userId = (res as any)?.userId
      if (userId) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setServerError(err?.message ?? 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Sign in</h2>
      {serverError && <div className="text-sm text-red-400 mb-2">{serverError}</div>}

      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2 block">
        Email
        <input type="email" className="mt-1 block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" {...register('email')} />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </label>

      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold mb-4 block">
        Password
        <input type="password" className="mt-1 block w-full rounded-xl p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" {...register('password')} />
        {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
      </label>

      <button type="submit" disabled={isLoading} className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl py-3 font-semibold shadow-lg transition duration-200 w-full disabled:opacity-60">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
