/**
 * RBAC Service
 * Handles role-based access control
 */

import { hasPermission, canDo, hasRoleOrHigher, getRolePermissions, getAllPermissions } from '../middleware/rbac.js'

/**
 * User interface
 */
export interface User {
  id: string
  username: string
  passwordHash: string
  displayName?: string
  role: string
  status: string
  email?: string
  avatar?: string
  createdAt: number
  updatedAt: number
  lastLoginAt?: number
}

/**
 * Role interface
 */
export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  createdAt: number
}

// In-memory storage (replace with database in production)
const users = new Map<string, User>()
const roles = new Map<string, Role>()

// Initialize default roles
function initializeDefaultRoles() {
  roles.set('admin', {
    id: 'admin',
    name: 'admin',
    description: 'Administrator with full access',
    permissions: ['*:*'],
    createdAt: Date.now()
  })

  roles.set('operator', {
    id: 'operator',
    name: 'operator',
    description: 'Operator with limited write access',
    permissions: [
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
    createdAt: Date.now()
  })

  roles.set('viewer', {
    id: 'viewer',
    name: 'viewer',
    description: 'Viewer with read-only access',
    permissions: [
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
    createdAt: Date.now()
  })

  roles.set('readonly', {
    id: 'readonly',
    name: 'readonly',
    description: 'Read-only access',
    permissions: [
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
    createdAt: Date.now()
  })
}

initializeDefaultRoles()

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | null {
  return users.get(userId) || null
}

/**
 * Get user by username
 */
export function getUserByUsername(username: string): User | null {
  return Array.from(users.values()).find(u => u.username === username) || null
}

/**
 * Create user
 */
export function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const now = Date.now()

  const newUser: User = {
    ...user,
    id: userId,
    createdAt: now,
    updatedAt: now
  }

  users.set(userId, newUser)
  return newUser
}

/**
 * Update user
 */
export function updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User | null {
  const user = users.get(userId)
  if (!user) return null

  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: Date.now()
  }

  users.set(userId, updatedUser)
  return updatedUser
}

/**
 * Delete user
 */
export function deleteUser(userId: string): boolean {
  return users.delete(userId)
}

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  return Array.from(users.values())
}

/**
 * Get user permissions
 */
export function getUserPermissions(userId: string): string[] {
  const user = users.get(userId)
  if (!user) return []

  return getRolePermissions(user.role)
}

/**
 * Check if user has permission
 */
export function userHasPermission(userId: string, resource: string, action: string): boolean {
  const user = users.get(userId)
  if (!user) return false

  return hasPermission(user, resource, action)
}

/**
 * Check if user has any of the permissions
 */
export function userHasAnyPermission(userId: string, permissions: string[]): boolean {
  const user = users.get(userId)
  if (!user) return false

  return permissions.some(perm => {
    const [resource, action] = perm.split(':')
    return hasPermission(user, resource, action)
  })
}

/**
 * Get user roles
 */
export function getUserRoles(userId: string): string[] {
  const user = users.get(userId)
  if (!user) return []
  return [user.role]
}

/**
 * Get role by ID
 */
export function getRoleById(roleId: string): Role | null {
  return roles.get(roleId) || null
}

/**
 * Get all roles
 */
export function getAllRoles(): Role[] {
  return Array.from(roles.values())
}

/**
 * Create role
 */
export function createRole(role: Omit<Role, 'id' | 'createdAt'>): Role {
  const roleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const now = Date.now()

  const newRole: Role = {
    ...role,
    id: roleId,
    createdAt: now
  }

  roles.set(roleId, newRole)
  return newRole
}

/**
 * Update role permissions
 */
export function updateRolePermissions(roleId: string, permissions: string[]): Role | null {
  const role = roles.get(roleId)
  if (!role) return null

  role.permissions = permissions
  return role
}

/**
 * Delete role
 */
export function deleteRole(roleId: string): boolean {
  return roles.delete(roleId)
}

/**
 * Get all permissions
 */
export function getAvailablePermissions(): string[] {
  return getAllPermissions()
}
