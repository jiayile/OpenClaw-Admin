const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const exportController = require('../controllers/export.controller');

// 完整数据导出
router.get('/full',
  authenticate,
  exportController.exportFull
);

// 资源导出
router.get('/resource/:resourceType',
  authenticate,
  exportController.exportResource
);

// 获取导出历史
router.get('/history',
  authenticate,
  exportController.getHistory
);

// 获取导出文件
router.get('/file/:fileName',
  authenticate,
  exportController.getExportFile
);

module.exports = router;
