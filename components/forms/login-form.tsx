'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../features/auth/auth.validation'
import type { LoginFormData } from '../../features/auth/auth.types'
import { loginUser } from '../../features/auth/auth.actions'
import { useRouter } from 'next/navigation'

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white/5 p-6 rounded-md shadow-lg dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      {serverError && <div className="text-sm text-red-400 mb-2">{serverError}</div>}

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input type="email" className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('email')} />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </label>

      <label className="block mb-4">
        <span className="text-sm">Password</span>
        <input type="password" className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('password')} />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </label>

      <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-indigo-600 rounded-md text-white hover:bg-indigo-500 disabled:opacity-60">
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
