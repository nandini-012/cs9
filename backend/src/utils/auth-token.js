import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60
const ALLOWED_ALGORITHM = 'HS256'
const CLOCK_SKEW_SECONDS = 30

function getSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return process.env.JWT_SECRET
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function signature(unsignedToken) {
  return createHmac('sha256', getSecret())
    .update(unsignedToken)
    .digest('base64url')
}

export function signAuthToken(payload, ttlSeconds = TOKEN_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000)
  const header = encode({ alg: ALLOWED_ALGORITHM, typ: 'JWT' })
  const body = encode({ ...payload, iat: now, exp: now + ttlSeconds })
  const unsignedToken = `${header}.${body}`

  return `${unsignedToken}.${signature(unsignedToken)}`
}

export function verifyAuthToken(token) {
  const parts = typeof token === 'string' ? token.split('.') : []

  if (parts.length !== 3) {
    throw new Error('Invalid token')
  }

  let header
  try {
    header = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
  } catch (_error) {
    throw new Error('Invalid token')
  }

  // Reject algorithm confusion: only accept the one we sign with.
  if (!header.alg || header.alg !== ALLOWED_ALGORITHM) {
    const error = new Error('Unsupported token algorithm')
    error.code = 'TOKEN_INVALID'
    throw error
  }

  const unsignedToken = `${parts[0]}.${parts[1]}`
  const expected = Buffer.from(signature(unsignedToken))
  const supplied = Buffer.from(parts[2])

  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    throw new Error('Invalid token')
  }

  let payload

  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
  } catch (_error) {
    throw new Error('Invalid token')
  }

  const now = Math.floor(Date.now() / 1000)

  // Reject tokens with a future iat (clock skew tolerance applied).
  if (!payload.iat || payload.iat > now + CLOCK_SKEW_SECONDS) {
    const error = new Error('Token issued in the future')
    error.code = 'TOKEN_INVALID'
    throw error
  }

  if (!payload.exp || payload.exp <= now) {
    const error = new Error('Expired token')
    error.code = 'TOKEN_EXPIRED'
    throw error
  }

  return payload
}
