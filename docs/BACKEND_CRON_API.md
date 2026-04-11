# Cron 编辑器后端 API 文档

## 概述

Cron 编辑器后端 API 提供了完整的定时任务管理功能，包括创建、更新、删除、批量操作和统计查询。

## API 端点

### 1. 获取 Cron 任务列表

**GET** `/api/crons`

**查询参数**:
- `q` (可选): 搜索关键词
- `enabled` (可选): 筛选启用状态 (`true`/`false`/`all`)
- `sortBy` (可选): 排序字段 (`title`/`enabled`/`created_at`/`updated_at`)
- `sortOrder` (可选): 排序方向 (`asc`/`desc`)
- `page` (可选): 页码 (默认 1)
- `limit` (可选): 每页数量 (默认 20, 最大 100)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "每日备份",
        "schedule_type": "cron",
        "expression": "0 0 * * *",
        "command": "/usr/bin/backup.sh",
        "description": "每天凌晨 0 点执行备份",
        "enabled": 1,
        "created_at": "2026-04-11 10:00:00",
        "updated_at": "2026-04-11 10:00:00"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

### 2. 获取 Cron 统计信息

**GET** `/api/crons/stats`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 10,
    "enabled": 7,
    "disabled": 3,
    "byScheduleType": {
      "cron": 5,
      "every": 3,
      "at": 2
    }
  }
}
```

### 3. 创建 Cron 任务

**POST** `/api/crons`

**请求体**:
```json
{
  "title": "每日备份",
  "scheduleType": "cron",
  "expression": "0 0 * * *",
  "command": "/usr/bin/backup.sh",
  "description": "每天凌晨 0 点执行备份",
  "enabled": true
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "每日备份",
    "scheduleType": "cron",
    "expression": "0 0 * * *",
    "command": "/usr/bin/backup.sh",
    "description": "每天凌晨 0 点执行备份",
    "enabled": true
  }
}
```

### 4. 更新 Cron 任务

**PUT** `/api/crons/:id`

**请求体**:
```json
{
  "title": "每小时备份",
  "expression": "0 * * * *",
  "enabled": true
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

### 5. 删除 Cron 任务

**DELETE** `/api/crons/:id`

**响应示例**:
```json
{
  "success": true,
  "deleted": true
}
```

### 6. 批量删除 Cron 任务

**POST** `/api/crons/batch-delete`

**请求体**:
```json
{
  "jobIds": [1, 2, 3]
}
```

**响应示例**:
```json
{
  "success": true,
  "deletedCount": 3,
  "failedCount": 0
}
```

### 7. 批量启用 Cron 任务

**POST** `/api/crons/batch-enable`

**请求体**:
```json
{
  "jobIds": [1, 2, 3]
}
```

**响应示例**:
```json
{
  "success": true,
  "enabledCount": 3,
  "failedCount": 0
}
```

### 8. 批量禁用 Cron 任务

**POST** `/api/crons/batch-disable`

**请求体**:
```json
{
  "jobIds": [1, 2, 3]
}
```

**响应示例**:
```json
{
  "success": true,
  "disabledCount": 3,
  "failedCount": 0
}
```

### 9. 手动运行 Cron 任务

**POST** `/api/crons/:id/run`

**响应示例**:
```json
{
  "success": true,
  "message": "任务已添加到执行队列"
}
```

### 10. 获取任务状态

**GET** `/api/crons/:id/status`

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "每日备份",
    "enabled": true,
    "lastRun": {
      "id": 10,
      "cron_id": 1,
      "command": "/usr/bin/backup.sh",
      "status": "success",
      "started_at": "2026-04-11 00:00:00",
      "finished_at": "2026-04-11 00:05:00"
    }
  }
}
```

### 11. 获取任务运行历史

**GET** `/api/crons/:id/runs`

**查询参数**:
- `page` (可选): 页码 (默认 1)
- `limit` (可选): 每页数量 (默认 20)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "runs": [
      {
        "id": 10,
        "cron_id": 1,
        "command": "/usr/bin/backup.sh",
        "status": "success",
        "output": "Backup completed successfully",
        "started_at": "2026-04-11 00:00:00",
        "finished_at": "2026-04-11 00:05:00"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

## 数据模型

### crons 表

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键，自增 |
| title | VARCHAR(255) | 任务标题 |
| schedule_type | VARCHAR(50) | 调度类型 (cron/every/at) |
| expression | VARCHAR(255) | Cron 表达式 |
| command | VARCHAR(500) | 执行命令 |
| description | TEXT | 任务描述 |
| enabled | TINYINT(1) | 是否启用 (1=启用，0=禁用) |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### cron_runs 表

| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键，自增 |
| cron_id | INT | 关联的 cron 任务 ID |
| command | VARCHAR(500) | 执行的命令 |
| status | ENUM | 运行状态 (running/success/failed) |
| output | TEXT | 输出内容 |
| error | TEXT | 错误信息 |
| started_at | DATETIME | 开始时间 |
| finished_at | DATETIME | 结束时间 |

## 错误处理

所有 API 响应都遵循统一的错误格式:

```json
{
  "success": false,
  "error": "错误描述",
  "errors": [
    {
      "msg": "验证错误信息",
      "param": "参数名",
      "location": "参数位置"
    }
  ]
}
```

## 认证与授权

所有 API 端点都需要通过 JWT 认证。在请求头中携带 Token:

```
Authorization: Bearer <token>
```

部分操作需要特定权限:
- `crons:create`: 创建任务
- `crons:update`: 更新任务
- `crons:delete`: 删除任务
- `crons:run`: 手动运行任务

## 前端联调状态

### 已对接的 API

| API 端点 | 方法 | 状态 | 说明 |
|---------|------|------|------|
| `/api/crons` | GET | ✅ 已对接 | 支持搜索、筛选、分页、排序 |
| `/api/crons/batch-delete` | POST | ✅ 已对接 | 批量删除 |
| `/api/crons/batch-enable` | POST | ✅ 已对接 | 批量启用 |
| `/api/crons/batch-disable` | POST | ✅ 已对接 | 批量禁用 |
| `/api/crons/stats` | GET | ✅ 已对接 | 统计信息 |
| `/api/crons` | POST | ✅ 已对接 | 创建任务 |
| `/api/crons/:id` | PUT | ✅ 已对接 | 更新任务 |
| `/api/crons/:id` | DELETE | ✅ 已对接 | 删除任务 |
| `/api/crons/:id/run` | POST | ✅ 已对接 | 手动运行 |
| `/api/crons/:id/status` | GET | ✅ 已对接 | 获取状态 |
| `/api/crons/:id/runs` | GET | ✅ 已对接 | 运行历史 |

### 前端 API 文件

- `src/api/cron-api.ts` - 完整的 TypeScript API 封装
- `src/stores/cron.ts` - Pinia Store 集成

## 性能优化

1. **数据库索引**:
   - `idx_enabled`: 启用状态查询优化
   - `idx_schedule_type`: 调度类型筛选优化
   - `idx_created_at`: 时间排序优化
   - `idx_cron_id`: 运行历史查询优化

2. **分页查询**: 所有列表接口都支持分页，避免一次性加载大量数据

3. **批量操作**: 支持批量删除、启用、禁用，减少 API 调用次数

## 下一步计划

### P1 任务：数据导入导出功能

1. **数据导出**:
   - 导出完整备份 (ZIP 格式)
   - 支持导出用户、任务、场景数据
   - 导出历史记录管理

2. **数据导入**:
   - 支持 JSON 格式导入
   - 支持 merge 模式 (保留现有数据)
   - 支持 replace 模式 (清空现有数据)
   - 数据验证和错误处理

3. **安全增强**:
   - 导入文件大小限制
   - 数据完整性校验
   - 操作日志记录

---

**文档版本**: v1.0  
**最后更新**: 2026-04-11  
**维护者**: 后端开发团队
