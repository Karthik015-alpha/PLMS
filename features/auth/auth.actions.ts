import { registerWithEmail, loginWithEmail, logout as logoutService } from './auth.service'
import type { RegisterFormData, LoginFormData } from './auth.types'

export async function registerUser(data: RegisterFormData) {
  const res = await registerWithEmail(data)
  if (res.error) throw new Error(res.error)
  return res
}

export async function loginUser(data: LoginFormData) {
  const res = await loginWithEmail(data)
  if (res.error) throw new Error(res.error)
  return res
}

export async function logoutUser() {
  const res = await logoutService()
  if ((res as any).error) throw new Error((res as any).error)
  return res
}
