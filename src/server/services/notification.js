/**
 * Notification Service
 * Handles notification creation, retrieval, and management
 */

import { randomUUID } from 'crypto'

/**
 * Notification level
 */
export type NotificationLevel = 'info' | 'warning' | 'error' | 'success'

/**
 * Notification source
 */
export type NotificationSource = 'system' | 'cron' | 'agent' | 'billing' | 'user'

/**
 * Notification interface
 */
export interface Notification {
  id: string
  userId: string
  title: string
  message?: string
  level: NotificationLevel
  source?: NotificationSource
  link?: string
  isRead: boolean
  isPersistent: boolean
  createdAt: number
}

// In-memory storage (replace with database in production)
const notifications: Map<string, Notification[]> = new Map()

/**
 * Create a new notification
 */
export function createNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Notification {
  const notif: Notification = {
    ...notification,
    id: randomUUID(),
    isRead: false,
    createdAt: Date.now()
  }

  // Get or create user's notification list
  const userNotifs = notifications.get(notification.userId) || []
  
  // Apply max stored limit (100 per user)
  if (userNotifs.length >= 100) {
    userNotifs.pop() // Remove oldest
  }
  
  userNotifs.unshift(notif)
  notifications.set(notification.userId, userNotifs)

  return notif
}

/**
 * Get notifications for a user
 */
export function getNotifications(
  userId: string,
  options?: {
    page?: number
    limit?: number
    unreadOnly?: boolean
    level?: NotificationLevel
  }
): { items: Notification[]; total: number; unreadCount: number } {
  const userNotifs = notifications.get(userId) || []
  
  // Apply filters
  let filtered = [...userNotifs]
  if (options?.unreadOnly) {
    filtered = filtered.filter(n => !n.isRead)
  }
  if (options?.level) {
    filtered = filtered.filter(n => n.level === options.level)
  }

  // Calculate unread count
  const unreadCount = userNotifs.filter(n => !n.isRead).length

  // Apply pagination
  const page = options?.page || 1
  const limit = options?.limit || 50
  const start = (page - 1) * limit
  const end = start + limit

  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    unreadCount
  }
}

/**
 * Mark notification as read
 */
export function markNotificationRead(userId: string, notificationId: string): boolean {
  const userNotifs = notifications.get(userId)
  if (!userNotifs) return false

  const notif = userNotifs.find(n => n.id === notificationId)
  if (!notif || notif.userId !== userId) return false

  notif.isRead = true
  return true
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsRead(userId: string): number {
  const userNotifs = notifications.get(userId)
  if (!userNotifs) return 0

  let count = 0
  for (const notif of userNotifs) {
    if (!notif.isRead) {
      notif.isRead = true
      count++
    }
  }
  return count
}

/**
 * Delete a notification
 */
export function deleteNotification(userId: string, notificationId: string): boolean {
  const userNotifs = notifications.get(userId)
  if (!userNotifs) return false

  const index = userNotifs.findIndex(n => n.id === notificationId)
  if (index === -1) return false

  userNotifs.splice(index, 1)
  notifications.set(userId, userNotifs)
  return true
}

/**
 * Clear all notifications for a user
 */
export function clearAllNotifications(userId: string): void {
  notifications.delete(userId)
}

/**
 * Clear read notifications for a user
 */
export function clearReadNotifications(userId: string): number {
  const userNotifs = notifications.get(userId)
  if (!userNotifs) return 0

  const unread = userNotifs.filter(n => !n.isRead)
  notifications.set(userId, unread)
  return userNotifs.length - unread.length
}

/**
 * Helper methods for creating notifications
 */
export function info(userId: string, title: string, message?: string, options?: { source?: NotificationSource; link?: string; persistent?: boolean }) {
  return createNotification({
    userId,
    title,
    message,
    level: 'info',
    source: options?.source,
    link: options?.link,
    isPersistent: options?.persistent || false
  })
}

export function warning(userId: string, title: string, message?: string, options?: { source?: NotificationSource; link?: string; persistent?: boolean }) {
  return createNotification({
    userId,
    title,
    message,
    level: 'warning',
    source: options?.source,
    link: options?.link,
    isPersistent: options?.persistent || false
  })
}

export function error(userId: string, title: string, message?: string, options?: { source?: NotificationSource; link?: string; persistent?: boolean }) {
  return createNotification({
    userId,
    title,
    message,
    level: 'error',
    source: options?.source,
    link: options?.link,
    isPersistent: options?.persistent || false
  })
}

export function success(userId: string, title: string, message?: string, options?: { source?: NotificationSource; link?: string; persistent?: boolean }) {
  return createNotification({
    userId,
    title,
    message,
    level: 'success',
    source: options?.source,
    link: options?.link,
    isPersistent: options?.persistent || false
  })
}
