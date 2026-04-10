/**
 * RBAC Middleware
 * Provides role-based access control for API routes
 */

import { Request, Response, NextFunction } from './auth.js'

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY: Record<string, number> = {
  readonly: 10,
  viewer: 10,
  operator: 20,
  admin: 30
}

/**
 * Permission definitions by resource
 */
const PERMISSIONS: Record<string, string[]> = {
  'users': ['read', 'write', 'delete'],
  'agents': ['read', 'write', 'delete', 'manage'],
  'sessions': ['read', 'write', 'delete'],
  'channels': ['read', 'write', 'delete'],
  'config': ['read', 'write'],
  'backup': ['read', 'write', 'restore'],
  'audit': ['read'],
  'notifications': ['read', 'write', 'delete'],
  'office': ['read', 'write', 'execute'],
  'myworld': ['read', 'write', 'manage'],
  'roles': ['read', 'write', 'delete'],
  'permissions': ['read']
}

/**
 * Role to permissions mapping
 */
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*:*'], // All permissions
  operator: [
    'users:read',
    'agents:read', 'agents:write',
    'sessions:read', 'sessions:write',
    'channels:read', 'channels:write',
    'config:read', 'config:write',
    'backup:read',
    'audit:read',
    'notifications:read', 'notifications:write', 'notifications:delete',
    'office:read', 'office:write', 'office:execute',
    'myworld:read', 'myworld:write'
  ],
  viewer: [
    'users:read',
    'agents:read',
    'sessions:read',
    'channels:read',
    'config:read',
    'backup:read',
    'audit:read',
    'notifications:read',
    'office:read',
    'myworld:read'
  ],
  readonly: [
    'users:read',
    'agents:read',
    'sessions:read',
    'channels:read',
    'config:read',
    'backup:read',
    'audit:read',
    'notifications:read',
    'office:read',
    'myworld:read'
  ]
}

/**
 * Check if user has permission
 */
export function hasPermission(user: { role: string; permissions?: string[] }, resource: string, action: string): boolean {
  if (!user || !user.role) return false

  const userPermissions = user.permissions || ROLE_PERMISSIONS[user.role] || []

  // Check for wildcard permission
  if (userPermissions.includes('*:*')) return true

  // Check specific permission
  const permission = `${resource}:${action}`
  return userPermissions.includes(permission)
}

/**
 * Check if user can perform action on resource
 */
export function canDo(user: { role: string; permissions?: string[] }, resource: string, action: string): boolean {
  return hasPermission(user, resource, action)
}

/**
 * Check if user has role or higher
 */
export function hasRoleOrHigher(user: { role: string }, requiredRole: string): boolean {
  if (!user || !user.role) return false
  const userLevel = ROLE_HIERARCHY[user.role] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}

/**
 * Middleware to require specific permission
 */
export function requirePermissionMiddleware(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest
    if (!authReq.user || !authReq.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      })
    }

    const [resource, action] = permission.split(':')
    if (!hasPermission(authReq.user, resource, action)) {
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
 * Middleware to require admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest
  if (!authReq.user || authReq.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Admin role required'
    })
  }
  next()
}

/**
 * Middleware to require operator role or higher
 */
export function requireOperator(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest
  if (!authReq.user || !hasRoleOrHigher(authReq.user, 'operator')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Operator role or higher required'
    })
  }
  next()
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: string): string[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Get all available permissions
 */
export function getAllPermissions(): string[] {
  const permissions: string[] = []
  for (const [resource, actions] of Object.entries(PERMISSIONS)) {
    for (const action of actions) {
      permissions.push(`${resource}:${action}`)
    }
  }
  return permissions
}
