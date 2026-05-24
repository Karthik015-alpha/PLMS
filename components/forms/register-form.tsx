'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../features/auth/auth.validation'
import type { RegisterFormData } from '../../features/auth/auth.types'
import { registerUser } from '../../features/auth/auth.actions'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterFormData) {
    setServerError(null)
    setIsLoading(true)
    try {
      await registerUser(values)
      router.push('/dashboard')
    } catch (err: any) {
      setServerError(err?.message ?? 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white/5 p-6 rounded-md shadow-lg dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
      {serverError && <div className="text-sm text-red-400 mb-2">{serverError}</div>}
      <label className="block mb-2">
        <span className="text-sm">Full name</span>
        <input className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('fullName')} />
        {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
      </label>

      <label className="block mb-2">
        <span className="text-sm">Email</span>
        <input type="email" className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('email')} />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </label>

      <label className="block mb-2">
        <span className="text-sm">Password</span>
        <input type="password" className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('password')} />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </label>

      <label className="block mb-4">
        <span className="text-sm">Confirm Password</span>
        <input type="password" className="mt-1 block w-full rounded-md p-2 bg-transparent border border-gray-700" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
      </label>

      <button type="submit" disabled={isLoading} className="w-full py-2 px-4 bg-indigo-600 rounded-md text-white hover:bg-indigo-500 disabled:opacity-60">
        {isLoading ? 'Creating...' : 'Create account'}
      </button>
    </form>
  )
}
