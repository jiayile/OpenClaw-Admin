const { query } = require('../utils/database');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// 获取 Cron 任务列表
async function list(req, res) {
  try {
    const { q, enabled, sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 20 } = req.query;
    
    let sql = 'SELECT * FROM crons';
    const conditions = [];
    const params = [];

    // 搜索条件
    if (q) {
      conditions.push('(title LIKE ? OR command LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    // 启用状态筛选
    if (enabled && enabled !== 'all') {
      conditions.push('enabled = ?');
      params.push(enabled === 'true' ? 1 : 0);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // 排序
    const allowedSortFields = ['title', 'enabled', 'created_at', 'updated_at'];
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'created_at';
    }
    sql += ` ORDER BY ${sortBy} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;

    // 分页
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const items = await query(sql, params);

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM crons';
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }
    const [{ total }] = await query(countSql);

    res.json({
      success: true,
      data: {
        items,
        total: parseInt(total),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('获取 Cron 列表失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取 Cron 列表失败'
    });
  }
}

// 获取 Cron 统计信息
async function getStats(req, res) {
  try {
    const [total, enabled, disabled] = await Promise.all([
      query('SELECT COUNT(*) as total FROM crons'),
      query('SELECT COUNT(*) as total FROM crons WHERE enabled = 1'),
      query('SELECT COUNT(*) as total FROM crons WHERE enabled = 0')
    ]);

    const byScheduleType = await query(`
      SELECT schedule_type, COUNT(*) as count 
      FROM crons 
      GROUP BY schedule_type
    `);

    res.json({
      success: true,
      data: {
        total: parseInt(total[0].total),
        enabled: parseInt(enabled[0].total),
        disabled: parseInt(disabled[0].total),
        byScheduleType: byScheduleType.reduce((acc, row) => {
          acc[row.schedule_type] = parseInt(row.count);
          return acc;
        }, {})
      }
    });
  } catch (error) {
    logger.error('获取 Cron 统计失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取 Cron 统计失败'
    });
  }
}

// 创建 Cron 任务
async function create(req, res) {
  try {
    const { title, scheduleType, expression, command, description, enabled = true } = req.body;

    const sql = `
      INSERT INTO crons (title, schedule_type, expression, command, description, enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await query(sql, [title, scheduleType, expression, command, description, enabled ? 1 : 0]);

    logger.info(`创建 Cron 任务：${title} (ID: ${result.insertId})`);

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        title,
        scheduleType,
        expression,
        command,
        description,
        enabled
      }
    });
  } catch (error) {
    logger.error('创建 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '创建 Cron 任务失败'
    });
  }
}

// 更新 Cron 任务
async function update(req, res) {
  try {
    const { id } = req.params;
    const { title, scheduleType, expression, command, description, enabled } = req.body;

    const fields = [];
    const params = [];

    if (title !== undefined) {
      fields.push('title = ?');
      params.push(title);
    }
    if (scheduleType !== undefined) {
      fields.push('schedule_type = ?');
      params.push(scheduleType);
    }
    if (expression !== undefined) {
      fields.push('expression = ?');
      params.push(expression);
    }
    if (command !== undefined) {
      fields.push('command = ?');
      params.push(command);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      params.push(description);
    }
    if (enabled !== undefined) {
      fields.push('enabled = ?');
      params.push(enabled ? 1 : 0);
    }

    fields.push('updated_at = NOW()');
    params.push(id);

    const sql = `UPDATE crons SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    logger.info(`更新 Cron 任务：${id}`);

    res.json({
      success: true,
      data: { id }
    });
  } catch (error) {
    logger.error('更新 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '更新 Cron 任务失败'
    });
  }
}

// 删除 Cron 任务
async function deleteCron(req, res) {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM crons WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    logger.info(`删除 Cron 任务：${id}`);

    res.json({
      success: true,
      deleted: true
    });
  } catch (error) {
    logger.error('删除 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '删除 Cron 任务失败'
    });
  }
}

// 批量删除 Cron 任务
async function batchDelete(req, res) {
  try {
    const { jobIds } = req.body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: '无效的任务 ID 列表'
      });
    }

    const placeholders = jobIds.map(() => '?').join(',');
    const sql = `DELETE FROM crons WHERE id IN (${placeholders})`;
    const result = await query(sql, jobIds);

    logger.info(`批量删除 Cron 任务：删除了 ${result.affectedRows} 个任务`);

    res.json({
      success: true,
      deletedCount: result.affectedRows,
      failedCount: 0
    });
  } catch (error) {
    logger.error('批量删除 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '批量删除 Cron 任务失败'
    });
  }
}

// 批量启用 Cron 任务
async function batchEnable(req, res) {
  try {
    const { jobIds } = req.body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: '无效的任务 ID 列表'
      });
    }

    const placeholders = jobIds.map(() => '?').join(',');
    const sql = `UPDATE crons SET enabled = 1, updated_at = NOW() WHERE id IN (${placeholders})`;
    const result = await query(sql, jobIds);

    logger.info(`批量启用 Cron 任务：启用了 ${result.affectedRows} 个任务`);

    res.json({
      success: true,
      enabledCount: result.affectedRows,
      failedCount: 0
    });
  } catch (error) {
    logger.error('批量启用 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '批量启用 Cron 任务失败'
    });
  }
}

// 批量禁用 Cron 任务
async function batchDisable(req, res) {
  try {
    const { jobIds } = req.body;

    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: '无效的任务 ID 列表'
      });
    }

    const placeholders = jobIds.map(() => '?').join(',');
    const sql = `UPDATE crons SET enabled = 0, updated_at = NOW() WHERE id IN (${placeholders})`;
    const result = await query(sql, jobIds);

    logger.info(`批量禁用 Cron 任务：禁用了 ${result.affectedRows} 个任务`);

    res.json({
      success: true,
      disabledCount: result.affectedRows,
      failedCount: 0
    });
  } catch (error) {
    logger.error('批量禁用 Cron 任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '批量禁用 Cron 任务失败'
    });
  }
}

// 手动运行 Cron 任务
async function run(req, res) {
  try {
    const { id } = req.params;

    // 获取任务信息
    const [task] = await query('SELECT * FROM crons WHERE id = ?', [id]);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    // 记录运行日志
    await query(
      'INSERT INTO cron_runs (cron_id, command, status, started_at, finished_at) VALUES (?, ?, "running", NOW(), NULL)',
      [id, task.command]
    );

    // TODO: 实际执行命令
    // 这里应该调用系统命令执行器

    res.json({
      success: true,
      message: '任务已添加到执行队列'
    });
  } catch (error) {
    logger.error('手动运行任务失败:', error.message);
    res.status(500).json({
      success: false,
      error: '手动运行任务失败'
    });
  }
}

// 获取任务状态
async function getStatus(req, res) {
  try {
    const { id } = req.params;

    const [task] = await query('SELECT * FROM crons WHERE id = ?', [id]);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    // 获取最近一次运行记录
    const [lastRun] = await query(
      'SELECT * FROM cron_runs WHERE cron_id = ? ORDER BY started_at DESC LIMIT 1',
      [id]
    );

    res.json({
      success: true,
      data: {
        id: task.id,
        title: task.title,
        enabled: task.enabled === 1,
        lastRun: lastRun || null
      }
    });
  } catch (error) {
    logger.error('获取任务状态失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取任务状态失败'
    });
  }
}

// 获取任务运行历史
async function getRuns(req, res) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // 验证任务存在
    const [task] = await query('SELECT * FROM crons WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    const offset = (page - 1) * limit;
    
    const runs = await query(
      `SELECT * FROM cron_runs 
       WHERE cron_id = ? 
       ORDER BY started_at DESC 
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    const [{ total }] = await query(
      'SELECT COUNT(*) as total FROM cron_runs WHERE cron_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        runs,
        total: parseInt(total),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    logger.error('获取运行历史失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取运行历史失败'
    });
  }
}

module.exports = {
  list,
  getStats,
  create,
  update,
  delete: deleteCron,
  batchDelete,
  batchEnable,
  batchDisable,
  run,
  getStatus,
  getRuns
};
