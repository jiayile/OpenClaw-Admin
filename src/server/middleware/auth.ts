/**
 * Authentication Middleware
 * Provides authentication and authorization for API routes
 */

import { Request, Response, NextFunction } from 'express'

// Extend Express Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string
    username: string
    role: string
    permissions: string[]
  }
}

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required'
    })
  }
  next()
}

/**
 * Middleware to check if user has specific permission
 */
export function requirePermission(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      })
    }

    if (!req.user.permissions.includes(permission) && !req.user.permissions.includes('*:*')) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Insufficient permissions: ${permission} required`
      })
    }

    next()
  }
}

/**
 * Middleware to check if user has any of the specified permissions
 */
export function requireAnyPermission(permissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      })
    }

    const hasPermission = permissions.some(
      perm => req.user!.permissions.includes(perm) || req.user!.permissions.includes('*:*')
    )

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Insufficient permissions: one of [${permissions.join(', ')}] required`
      })
    }

    next()
  }
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      })
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Insufficient role: ${role} required`
      })
    }

    next()
  }
}

/**
 * Optional authentication - attaches user if present, but doesn't require it
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // User may or may not be authenticated - proceed either way
  next()
}
