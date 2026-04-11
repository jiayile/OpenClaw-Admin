const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { authenticate, requirePermission } = require('../middleware/auth');
const importController = require('../controllers/import.controller');

// 完整数据导入
router.post('/full',
  authenticate,
  requirePermission('system:import'),
  body('filePath').notEmpty().withMessage('文件路径不能为空'),
  body('mode').optional().isIn(['merge', 'replace']).withMessage('模式必须是 merge 或 replace'),
  importController.importFull
);

// 资源导入
router.post('/resource/:resourceType',
  authenticate,
  requirePermission('system:import'),
  param('resourceType').notEmpty().withMessage('资源类型不能为空'),
  body('filePath').notEmpty().withMessage('文件路径不能为空'),
  body('mode').optional().isIn(['merge', 'replace']).withMessage('模式必须是 merge 或 replace'),
  importController.importResource
);

// 获取导入历史
router.get('/history',
  authenticate,
  requirePermission('system:import'),
  importController.getHistory
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
