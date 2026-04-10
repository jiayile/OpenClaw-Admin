/**
 * Auth Service
 * Handles authentication, session management, and password hashing
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { randomUUID } from 'crypto'

const SALT_LENGTH = 32
const HASH_ITERATIONS = 100000

// Rate limiting stores
const loginAttempts = new Map<string, { attempts: number; lockedUntil?: number; windowStart: number }>()
const apiRateLimits = new Map<string, { count: number; windowStart: number }>()
const bruteForceTracker = new Map<string, { count: number; windowStart: number; releaseAt?: number }>()

const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_LOCKOUT_DURATION = 15 * 60 * 1000
const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000
const API_RATE_WINDOW = 60 * 1000
const API_RATE_MAX = 100
const BRUTE_FORCE_THRESHOLD = 200
const BRUTE_FORCE_WINDOW = 5 * 60 * 1000

/**
 * Session interface
 */
export interface Session {
  id: string
  userId: string
  token: string
  createdAt: number
  expiresAt: number
  ipAddress: string
  userAgent: string
}

// In-memory session storage
const sessions = new Map<string, Session>()

/**
 * Hash password with salt
 */
export function hashPassword(password: string, salt: string = randomBytes(SALT_LENGTH).toString('hex')): string {
  const hash = createHash('sha512')
  hash.update(salt)
  hash.update(password)
  
  for (let i = 1; i < HASH_ITERATIONS; i++) {
    const newHash = createHash('sha512')
    newHash.update(hash.digest('hex'))
    hash.update(newHash.digest('hex'))
  }
  
  return `${salt}:${hash.digest('hex')}`
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, expectedHash] = hash.split(':')
  const computedHash = hashPassword(password, salt)
  const expectedBuffer = Buffer.from(expectedHash)
  const computedBuffer = Buffer.from(computedHash.split(':')[1])
  
  return timingSafeEqual(expectedBuffer, computedBuffer)
}

/**
 * Generate session token
 */
export function generateToken(length: number = 64): string {
  return randomBytes(length).toString('hex')
}

/**
 * Hash token for storage
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Create session
 */
export function createSession(userId: string, ipAddress: string, userAgent: string): Session {
  const token = generateToken()
  const now = Date.now()
  
  const session: Session = {
    id: randomUUID(),
    userId,
    token: hashToken(token),
    createdAt: now,
    expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
    ipAddress,
    userAgent
  }
  
  sessions.set(session.id, session)
  
  return { ...session, token } // Return original token, not hashed
}

/**
 * Validate session
 */
export function validateSession(token: string): Session | null {
  const hashedToken = hashToken(token)
  
  for (const session of sessions.values()) {
    if (session.token === hashedToken) {
      if (Date.now() > session.expiresAt) {
        sessions.delete(session.id)
        return null
      }
      return session
    }
  }
  
  return null
}

/**
 * Invalidate session
 */
export function invalidateSession(sessionId: string): boolean {
  return sessions.delete(sessionId)
}

/**
 * Invalidate all user sessions
 */
export function invalidateAllUserSessions(userId: string): number {
  let count = 0
  for (const [id, session] of sessions.entries()) {
    if (session.userId === userId) {
      sessions.delete(id)
      count++
    }
  }
  return count
}

/**
 * Check login attempts
 */
export function checkLoginAttempts(username: string): { locked: boolean; attempts: number; lockedUntil?: number; remainingMs?: number } {
  const record = loginAttempts.get(username)
  if (!record) return { locked: false, attempts: 0 }
  
  const now = Date.now()
  if (record.lockedUntil && now > record.lockedUntil) {
    loginAttempts.delete(username)
    return { locked: false, attempts: 0 }
  }
  
  if (record.lockedUntil) {
    return { locked: true, attempts: record.attempts, lockedUntil: record.lockedUntil, remainingMs: record.lockedUntil - now }
  }
  
  if (record.windowStart && now > record.windowStart + LOGIN_ATTEMPT_WINDOW) {
    loginAttempts.delete(username)
    return { locked: false, attempts: 0 }
  }
  
  return { locked: false, attempts: record.attempts }
}

/**
 * Record failed login attempt
 */
export function recordFailedLogin(username: string, ipAddress: string): void {
  const now = Date.now()
  const record = loginAttempts.get(username)
  
  if (!record || now > record.windowStart + LOGIN_ATTEMPT_WINDOW) {
    loginAttempts.set(username, { attempts: 1, windowStart: now })
  } else {
    record.attempts++
    if (record.attempts >= LOGIN_MAX_ATTEMPTS) {
      record.lockedUntil = now + LOGIN_LOCKOUT_DURATION
    }
    loginAttempts.set(username, record)
  }
}

/**
 * Record successful login
 */
export function recordSuccessfulLogin(username: string): void {
  loginAttempts.delete(username)
}

/**
 * Check API rate limit
 */
export function checkApiRateLimit(ipAddress: string, endpoint: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  const key = `${ipAddress}:${endpoint}`
  const now = Date.now()
  const record = apiRateLimits.get(key)
  
  if (!record || now > record.windowStart + API_RATE_WINDOW) {
    apiRateLimits.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: API_RATE_MAX - 1 }
  }
  
  if (record.count >= API_RATE_MAX) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.windowStart + API_RATE_WINDOW - now) / 1000) }
  }
  
  record.count++
  return { allowed: true, remaining: API_RATE_MAX - record.count }
}

/**
 * Check brute force protection
 */
export function checkBruteForce(ipAddress: string): boolean {
  const record = bruteForceTracker.get(ipAddress)
  if (!record) return true
  
  const now = Date.now()
  if (now > record.windowStart + BRUTE_FORCE_WINDOW) {
    bruteForceTracker.set(ipAddress, { count: 1, windowStart: now })
    return true
  }
  
  record.count++
  if (record.count >= BRUTE_FORCE_THRESHOLD) {
    record.releaseAt = now + BRUTE_FORCE_WINDOW * 2
    return false
  }
  
  return true
}

/**
 * Get session by ID
 */
export function getSession(sessionId: string): Session | null {
  return sessions.get(sessionId) || null
}

/**
 * Get all sessions for user
 */
export function getUserSessions(userId: string): Session[] {
  return Array.from(sessions.values()).filter(s => s.userId === userId)
}

/**
 * Cleanup expired sessions
 */
export function cleanupExpiredSessions(): number {
  const now = Date.now()
  let count = 0
  
  for (const [id, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(id)
      count++
    }
  }
  
  return count
}
