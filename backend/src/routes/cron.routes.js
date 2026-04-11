const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const cronController = require('../controllers/cron.controller');
const { authenticate, requirePermission } = require('../middleware/auth');

// 获取 Cron 任务列表
router.get('/',
  authenticate,
  query('q').optional().isString(),
  query('enabled').optional().isIn(['true', 'false', 'all']),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  cronController.list
);

// 获取 Cron 统计信息
router.get('/stats',
  authenticate,
  cronController.getStats
);

// 创建 Cron 任务
router.post('/',
  authenticate,
  requirePermission('crons:create'),
  body('title').notEmpty().withMessage('标题不能为空'),
  body('scheduleType').isIn(['cron', 'every', 'at']).withMessage('无效的调度类型'),
  body('expression').notEmpty().withMessage('表达式不能为空'),
  body('command').notEmpty().withMessage('命令不能为空'),
  cronController.create
);

// 更新 Cron 任务
router.put('/:id',
  authenticate,
  requirePermission('crons:update'),
  param('id').notEmpty().withMessage('任务 ID 不能为空'),
  cronController.update
);

// 删除 Cron 任务
router.delete('/:id',
  authenticate,
  requirePermission('crons:delete'),
  param('id').notEmpty().withMessage('任务 ID 不能为空'),
  cronController.delete
);

// 批量删除 Cron 任务
router.post('/batch-delete',
  authenticate,
  requirePermission('crons:delete'),
  body('jobIds').isArray({ min: 1 }).withMessage('至少需要一个任务 ID'),
  cronController.batchDelete
);

// 批量启用 Cron 任务
router.post('/batch-enable',
  authenticate,
  requirePermission('crons:update'),
  body('jobIds').isArray({ min: 1 }).withMessage('至少需要一个任务 ID'),
  cronController.batchEnable
);

// 批量禁用 Cron 任务
router.post('/batch-disable',
  authenticate,
  requirePermission('crons:update'),
  body('jobIds').isArray({ min: 1 }).withMessage('至少需要一个任务 ID'),
  cronController.batchDisable
);

// 手动运行 Cron 任务
router.post('/:id/run',
  authenticate,
  requirePermission('crons:run'),
  param('id').notEmpty().withMessage('任务 ID 不能为空'),
  cronController.run
);

// 获取任务状态
router.get('/:id/status',
  authenticate,
  param('id').notEmpty().withMessage('任务 ID 不能为空'),
  cronController.getStatus
);

// 获取任务运行历史
router.get('/:id/runs',
  authenticate,
  param('id').notEmpty().withMessage('任务 ID 不能为空'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  cronController.getRuns
);

// 验证请求参数
router.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
});

module.exports = router;
