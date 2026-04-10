/**
 * Audit Logging Middleware
 * Provides audit trail for all API operations
 */

import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'crypto'
import { AuthRequest } from './auth.js'

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string
  userId?: string
  username?: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failure'
  errorMessage?: string
  createdAt: number
}

/**
 * Get client IP address
 */
function getClientIp(req: Request): string {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
}

/**
 * Middleware to log API operations
 */
export function auditLog(action: string, resource: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest
    const startTime = Date.now()
    
    // Capture request details
    const logEntry: AuditLog = {
      id: randomUUID(),
      userId: authReq.user?.id,
      username: authReq.user?.username,
      action,
      resource,
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
      status: 'success',
      createdAt: startTime
    }

    // Override status on error
    const originalSend = res.send.bind(res)
    res.send = function (data: unknown) {
      if (res.statusCode >= 400) {
        logEntry.status = 'failure'
        logEntry.errorMessage = res.statusCode === 401 ? 'Unauthorized' :
          res.statusCode === 403 ? 'Forbidden' :
            res.statusCode === 404 ? 'Not Found' :
              `HTTP ${res.statusCode}`
      }
      return originalSend(data)
    }

    // Capture resource ID from URL if present
    if (req.params.id) {
      logEntry.resourceId = req.params.id
    }

    next()
  }
}

/**
 * Simple in-memory audit log store (replace with database in production)
 */
const auditLogs: AuditLog[] = []
const MAX_AUDIT_LOGS = 10000

/**
 * Add audit log entry
 */
export function addAuditLog(log: AuditLog) {
  auditLogs.unshift(log)
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.pop()
  }
}

/**
 * Get audit logs with pagination
 */
export function getAuditLogs(options?: {
  userId?: string
  resource?: string
  action?: string
  status?: string
  page?: number
  limit?: number
  startTime?: number
  endTime?: number
}): AuditLog[] {
  let logs = [...auditLogs]

  // Apply filters
  if (options?.userId) {
    logs = logs.filter(l => l.userId === options.userId)
  }
  if (options?.resource) {
    logs = logs.filter(l => l.resource === options.resource)
  }
  if (options?.action) {
    logs = logs.filter(l => l.action === options.action)
  }
  if (options?.status) {
    logs = logs.filter(l => l.status === options.status)
  }
  if (options?.startTime) {
    logs = logs.filter(l => l.createdAt >= options.startTime!)
  }
  if (options?.endTime) {
    logs = logs.filter(l => l.createdAt <= options.endTime!)
  }

  // Apply pagination
  const page = options?.page || 1
  const limit = options?.limit || 50
  const start = (page - 1) * limit
  const end = start + limit

  return logs.slice(start, end)
}

/**
 * Get audit log count
 */
export function getAuditLogsCount(options?: {
  userId?: string
  resource?: string
  action?: string
  status?: string
}): number {
  let logs = [...auditLogs]

  if (options?.userId) {
    logs = logs.filter(l => l.userId === options.userId)
  }
  if (options?.resource) {
    logs = logs.filter(l => l.resource === options.resource)
  }
  if (options?.action) {
    logs = logs.filter(l => l.action === options.action)
  }
  if (options?.status) {
    logs = logs.filter(l => l.status === options.status)
  }

  return logs.length
}

/**
 * Export audit logs as CSV
 */
export function exportAuditLogsAsCSV(logs: AuditLog[]): string {
  const headers = ['ID', 'User ID', 'Username', 'Action', 'Resource', 'Resource ID', 'Status', 'IP Address', 'Timestamp']
  const rows = logs.map(log => [
    log.id,
    log.userId || '',
    log.username || '',
    log.action,
    log.resource,
    log.resourceId || '',
    log.status,
    log.ipAddress || '',
    new Date(log.createdAt).toISOString()
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return csvContent
}
