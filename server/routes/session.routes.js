import { Router } from 'express'
import { requireAuth, requirePermission, createAuditLog } from '../auth.js'

const router = Router()

// GET /api/sessions - 获取会话列表（支持搜索和筛选）
router.get('/', requireAuth, async (req, res) => {
  try {
    const {
      q,           // 搜索关键词
      channel,     // 渠道筛选
      agent,       // Agent 筛选
      model,       // 模型筛选
      active24h,   // 24 小时内活跃
      sortBy,      // 排序字段
      sortOrder,   // 排序方向
      page = 1,
      limit = 20
    } = req.query

    // 通过 WebSocket RPC 获取会话列表
    const sessions = await req.wsStore.rpc.listSessions()

    // 搜索和筛选
    let filtered = sessions.filter(session => {
      const parsed = parseSessionKey(session.key)

      // 关键词搜索
      if (q) {
        const query = q.toLowerCase()
        const searchable = [
          session.key,
          parsed.agent,
          parsed.channel,
          parsed.peer,
          session.model || '',
          session.label || ''
        ].join(' ').toLowerCase()
        if (!searchable.includes(query)) return false
      }

      // 渠道筛选
      if (channel && channel !== 'all' && parsed.channel !== channel) return false

      // Agent 筛选
      if (agent && agent !== 'all' && parsed.agent !== agent) return false

      // 模型筛选
      if (model && model !== 'all' && (session.model || '') !== model) return false

      // 24 小时活跃筛选
      if (active24h === 'true') {
        const lastActivity = new Date(session.lastActivity).getTime()
        if (Date.now() - lastActivity > 24 * 60 * 60 * 1000) return false
      }

      return true
    })

    // 排序
    const sortField = sortBy || 'lastActivity'
    const direction = sortOrder === 'asc' ? 1 : -1
    filtered.sort((a, b) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      if (aVal < bVal) return -1 * direction
      if (aVal > bVal) return 1 * direction
      return 0
    })

    // 分页
    const total = filtered.length
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    res.json({
      ok: true,
      items: paginated,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (error) {
    console.error('[SessionAPI] List failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// POST /api/sessions/batch-delete - 批量删除会话
router.post('/batch-delete', requireAuth, requirePermission('sessions', 'delete'), async (req, res) => {
  try {
    const { sessionKeys } = req.body

    if (!Array.isArray(sessionKeys) || sessionKeys.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid sessionKeys' })
    }

    const results = await Promise.allSettled(
      sessionKeys.map(key => req.wsStore.rpc.deleteSession(key))
    )

    const deletedCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.length - deletedCount

    // 记录审计日志
    await createAuditLog({
      user_id: req.user?.id,
      username: req.user?.username,
      action: 'sessions.batch_delete',
      resource: 'sessions',
      details: JSON.stringify({ sessionKeys, deletedCount, failedCount }),
      ip_address: req.ip
    })

    res.json({
      ok: true,
      deletedCount,
      failedCount
    })
  } catch (error) {
    console.error('[SessionAPI] Batch delete failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// POST /api/sessions/batch-reset - 批量重置会话
router.post('/batch-reset', requireAuth, requirePermission('sessions', 'manage'), async (req, res) => {
  try {
    const { sessionKeys } = req.body

    if (!Array.isArray(sessionKeys) || sessionKeys.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid sessionKeys' })
    }

    const results = await Promise.allSettled(
      sessionKeys.map(key => req.wsStore.rpc.resetSession(key))
    )

    const resetCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.length - resetCount

    res.json({
      ok: true,
      resetCount,
      failedCount
    })
  } catch (error) {
    console.error('[SessionAPI] Batch reset failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// GET /api/sessions/stats - 获取会话统计信息
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const sessions = await req.wsStore.rpc.listSessions()

    const stats = {
      total: sessions.length,
      active24h: 0,
      totalMessages: 0,
      uniqueChannels: new Set(),
      uniqueAgents: new Set(),
      byChannel: {},
      byAgent: {},
      byModel: {}
    }

    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    for (const session of sessions) {
      const parsed = parseSessionKey(session.key)

      // 24 小时活跃
      const lastActivity = new Date(session.lastActivity).getTime()
      if (lastActivity > oneDayAgo) {
        stats.active24h++
      }

      // 消息总数
      stats.totalMessages += session.messageCount || 0

      // 渠道统计
      if (parsed.channel) {
        stats.uniqueChannels.add(parsed.channel)
        stats.byChannel[parsed.channel] = (stats.byChannel[parsed.channel] || 0) + 1
      }

      // Agent 统计
      if (parsed.agent) {
        stats.uniqueAgents.add(parsed.agent)
        stats.byAgent[parsed.agent] = (stats.byAgent[parsed.agent] || 0) + 1
      }

      // 模型统计
      if (session.model) {
        stats.byModel[session.model] = (stats.byModel[session.model] || 0) + 1
      }
    }

    res.json({ ok: true, stats })
  } catch (error) {
    console.error('[SessionAPI] Stats failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

function parseSessionKey(key) {
  const parts = key.split(':')
  return {
    agent: parts[1] || '',
    channel: parts[2] || '',
    peer: parts[parts.length - 1] || ''
  }
}

export default router
