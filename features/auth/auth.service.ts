import type { RegisterFormData, LoginFormData } from './auth.types'

export async function registerWithEmail(data: RegisterFormData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const payload = await response.json()

  if (!response.ok || payload?.success === false) {
    return { error: payload?.error?.message ?? 'Registration failed' }
  }

  return { userId: payload.data?.user?.id }
}

export async function loginWithEmail(data: LoginFormData) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const payload = await response.json()

  if (!response.ok || payload?.success === false) {
    return { error: payload?.error?.message ?? 'Login failed' }
  }

  return { userId: payload.data?.user?.id }
}

export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    return { error: payload?.error?.message ?? 'Logout failed' }
  }

  return { success: true }
}
