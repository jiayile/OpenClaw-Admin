const exportService = require('../services/exportService');
const winston = require('winston');
const fs = require('fs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// 完整数据导出
async function exportFull(req, res) {
  try {
    const result = await exportService.exportFullBackup();

    logger.info(`完整数据导出完成：文件 ${result.file_name}, 大小 ${result.file_size} 字节`);

    res.json({
      success: true,
      data: {
        export_id: result.export_id,
        file_name: result.file_name,
        file_size: result.file_size,
        download_url: `/api/export/file/${result.file_name}`,
        metadata: result.metadata
      }
    });
  } catch (error) {
    logger.error('完整数据导出失败:', error.message);
    res.status(500).json({
      success: false,
      error: '数据导出失败',
      details: error.message
    });
  }
}

// 资源导出
async function exportResource(req, res) {
  try {
    const { resourceType } = req.params;
    const { ids = [], fields = [], format = 'json' } = req.query;

    const result = await exportService.exportResource(resourceType, {
      ids: ids.split(','),
      fields: fields ? fields.split(',') : [],
      format
    });

    logger.info(`资源导出完成：${resourceType}, 文件 ${result.file_name}`);

    res.json({
      success: true,
      data: {
        export_id: result.export_id,
        file_name: result.file_name,
        file_size: result.file_size,
        download_url: `/api/export/file/${result.file_name}`,
        record_count: result.record_count
      }
    });
  } catch (error) {
    logger.error('资源导出失败:', error.message);
    res.status(500).json({
      success: false,
      error: '数据导出失败',
      details: error.message
    });
  }
}

// 获取导出历史
async function getHistory(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;

    const history = exportService.getExportHistory({
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
    logger.error('获取导出历史失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取导出历史失败'
    });
  }
}

// 获取导出文件
async function getExportFile(req, res) {
  try {
    const { fileName } = req.params;
    const filePath = exportService.getExportFilePath(fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: '文件不存在'
      });
    }

    res.download(filePath);
  } catch (error) {
    logger.error('获取导出文件失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取文件失败'
    });
  }
}

module.exports = {
  exportFull,
  exportResource,
  getHistory,
  getExportFile
};
