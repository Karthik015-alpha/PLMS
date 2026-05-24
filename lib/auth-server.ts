const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

function getAuthSecret() {
  if (!AUTH_SECRET) {
    throw new Error('Missing AUTH_SECRET or NEXTAUTH_SECRET environment variable')
  }
  return AUTH_SECRET
}

export const SESSION_COOKIE_NAME = 'plms_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function encodeBase64Url(arrayBuffer: ArrayBuffer | ArrayBufferView) {
  const bytes = new Uint8Array(arrayBuffer instanceof ArrayBuffer ? arrayBuffer : arrayBuffer.buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  const base64 = typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(bytes).toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = typeof atob !== 'undefined' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function encodeValue(value: string) {
  return encodeBase64Url(textEncoder.encode(value))
}

function decodeValue(value: string) {
  return textDecoder.decode(decodeBase64Url(value))
}

export async function hashPassword(password: string) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const salt = encodeBase64Url(saltBytes)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 310000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  const hash = encodeBase64Url(derivedBits)
  return { salt, hash }
}

export async function verifyPassword(password: string, hash: string, salt: string) {
  const saltBytes = decodeBase64Url(salt)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 310000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  const derivedHash = encodeBase64Url(derivedBits)
  return timingSafeEqual(hash, derivedHash)
}

async function createSignature(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload))
  return encodeBase64Url(signature)
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function createSessionToken(payload: { userId: string; email: string }) {
  const secret = getAuthSecret()
  const sessionPayload = {
    userId: payload.userId,
    email: payload.email,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  }
  const serialized = JSON.stringify(sessionPayload)
  const encoded = encodeValue(serialized)
  const signature = await createSignature(secret, encoded)
  return `${encoded}.${signature}`
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null
  const secret = getAuthSecret()
  const expected = await createSignature(secret, encoded)
  if (!timingSafeEqual(signature, expected)) {
    return null
  }

  try {
    const payload = JSON.parse(decodeValue(encoded)) as {
      userId: string
      email: string
      exp: number
    }
    if (Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
