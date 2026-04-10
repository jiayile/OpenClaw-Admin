import { Router } from 'express'
import { requireAuth, requirePermission, createAuditLog } from '../auth.js'

const router = Router()

// GET /api/crons - 获取 Cron 任务列表
router.get('/', requireAuth, async (req, res) => {
  try {
    const {
      q,           // 搜索关键词
      enabled,     // 状态筛选：true/false/all
      sortBy,
      sortOrder,
      page = 1,
      limit = 20
    } = req.query

    // 通过 WebSocket RPC 获取 Cron 列表
    const jobs = await req.wsStore.rpc.listCrons()

    // 搜索和筛选
    let filtered = jobs.filter(job => {
      // 状态筛选
      if (enabled === 'true' && !job.enabled) return false
      if (enabled === 'false' && job.enabled) return false

      // 关键词搜索
      if (q) {
        const query = q.toLowerCase()
        const searchable = [
          job.name || '',
          job.description || '',
          job.schedule || '',
          job.agentId || '',
          job.payload?.kind || '',
          job.payload?.message || '',
          job.delivery?.channel || ''
        ].join(' ').toLowerCase()
        if (!searchable.includes(query)) return false
      }

      return true
    })

    // 排序
    const sortField = sortBy || 'createdAt'
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
    console.error('[CronAPI] List failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// POST /api/crons/batch-delete - 批量删除 Cron 任务
router.post('/batch-delete', requireAuth, requirePermission('crons', 'delete'), async (req, res) => {
  try {
    const { jobIds } = req.body

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid jobIds' })
    }

    const results = await Promise.allSettled(
      jobIds.map(id => req.wsStore.rpc.deleteCron(id))
    )

    const deletedCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.length - deletedCount

    await createAuditLog({
      user_id: req.user?.id,
      username: req.user?.username,
      action: 'crons.batch_delete',
      resource: 'crons',
      details: JSON.stringify({ jobIds, deletedCount, failedCount }),
      ip_address: req.ip
    })

    res.json({
      ok: true,
      deletedCount,
      failedCount
    })
  } catch (error) {
    console.error('[CronAPI] Batch delete failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// POST /api/crons/batch-enable - 批量启用 Cron 任务
router.post('/batch-enable', requireAuth, requirePermission('crons', 'manage'), async (req, res) => {
  try {
    const { jobIds } = req.body

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid jobIds' })
    }

    const results = await Promise.allSettled(
      jobIds.map(id => req.wsStore.rpc.updateCron(id, { enabled: true }))
    )

    const enabledCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.length - enabledCount

    res.json({
      ok: true,
      enabledCount,
      failedCount
    })
  } catch (error) {
    console.error('[CronAPI] Batch enable failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// POST /api/crons/batch-disable - 批量禁用 Cron 任务
router.post('/batch-disable', requireAuth, requirePermission('crons', 'manage'), async (req, res) => {
  try {
    const { jobIds } = req.body

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid jobIds' })
    }

    const results = await Promise.allSettled(
      jobIds.map(id => req.wsStore.rpc.updateCron(id, { enabled: false }))
    )

    const disabledCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.length - disabledCount

    res.json({
      ok: true,
      disabledCount,
      failedCount
    })
  } catch (error) {
    console.error('[CronAPI] Batch disable failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

// GET /api/crons/stats - 获取 Cron 统计信息
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const jobs = await req.wsStore.rpc.listCrons()
    const status = await req.wsStore.rpc.getCronStatus()

    const stats = {
      total: jobs.length,
      enabled: jobs.filter(j => j.enabled).length,
      disabled: jobs.filter(j => !j.enabled).length,
      schedulerEnabled: status?.enabled ?? true,
      nextWakeAt: status?.nextWakeAtMs,
      byScheduleType: {
        cron: 0,
        every: 0,
        at: 0
      }
    }

    for (const job of jobs) {
      if (job.scheduleObj?.kind === 'cron') stats.byScheduleType.cron++
      else if (job.scheduleObj?.kind === 'every') stats.byScheduleType.every++
      else if (job.scheduleObj?.kind === 'at') stats.byScheduleType.at++
    }

    res.json({ ok: true, stats })
  } catch (error) {
    console.error('[CronAPI] Stats failed:', error)
    res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
