const importService = require('../services/importService');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// 完整数据导入
async function importFull(req, res) {
  try {
    const { filePath, mode = 'merge' } = req.body;

    const result = await importService.importFullBackup(filePath, mode);

    logger.info(`完整数据导入完成：导入 ID ${result.import_id}, 导入 ${result.total_imported} 条记录`);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('完整数据导入失败:', error.message);
    res.status(500).json({
      success: false,
      error: '数据导入失败',
      details: error.message
    });
  }
}

// 资源导入
async function importResource(req, res) {
  try {
    const { resourceType } = req.params;
    const { filePath, mode = 'merge' } = req.body;

    const result = await importService.importResource(resourceType, filePath, mode);

    logger.info(`资源导入完成：${resourceType}, 导入 ID ${result.import_id}, 导入 ${result.total_imported} 条记录`);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('资源导入失败:', error.message);
    res.status(500).json({
      success: false,
      error: '数据导入失败',
      details: error.message
    });
  }
}

// 获取导入历史
async function getHistory(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;

    const history = await importService.getImportHistory({
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: {
        items: history,
        total: history.length,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('获取导入历史失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取导入历史失败'
    });
  }
}

module.exports = {
  importFull,
  importResource,
  getHistory
};
