# CI/CD 安全扫描 API 文档

**版本**: 1.0.0  
**最后更新**: 2026-04-11  
**基础路径**: `/api/cicd`

---

## 概述

CI/CD 安全扫描模块提供自动化安全扫描功能，支持以下扫描类型：

- **SAST (静态应用安全测试)**: 分析源代码中的安全漏洞
- **DAST (动态应用安全测试)**: 对运行中的应用进行安全测试
- **依赖扫描**: 检测第三方依赖库的安全漏洞
- **密钥检测**: 检测代码中泄露的敏感信息（API Key、密码等）

---

## 认证说明

所有接口都需要在请求头中携带 JWT Token:

```
Authorization: Bearer <token>
```

---

## API 接口列表

### 1. 获取扫描任务列表

**接口**: `GET /api/cicd/scans`

**描述**: 获取 CI/CD 扫描任务列表，支持筛选和分页

**查询参数**:
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 否 | 项目名称过滤 |
| scan_type | string | 否 | 扫描类型 (sast/dast/dependency/secret) |
| status | string | 否 | 任务状态 (pending/running/completed/failed) |
| limit | number | 否 | 返回数量限制 (默认 50) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "scan_abc123",
      "project_name": "OpenClaw-Admin",
      "scan_type": "sast",
      "status": "completed",
      "trigger_by": "admin",
      "trigger_type": "manual",
      "created_at": 1712774400000,
      "started_at": 1712774460000,
      "completed_at": 1712774580000,
      "issues_count": 5,
      "result_summary": "{\"total\": 5, \"by_severity\": {\"critical\": 0, \"high\": 1, \"medium\": 3, \"low\": 1}}"
    }
  ]
}
```

---

### 2. 获取扫描任务详情

**接口**: `GET /api/cicd/scans/:scanId`

**描述**: 获取单个扫描任务的详细信息

**路径参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| scanId | string | 扫描任务 ID |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "scan_abc123",
    "project_name": "OpenClaw-Admin",
    "scan_type": "sast",
    "status": "completed",
    "trigger_by": "admin",
    "trigger_type": "manual",
    "created_at": 1712774400000,
    "started_at": 1712774460000,
    "completed_at": 1712774580000,
    "issues_count": 5,
    "result_summary": "{\"total\": 5, \"by_severity\": {\"critical\": 0, \"high\": 1, \"medium\": 3, \"low\": 1}}"
  }
}
```

---

### 3. 创建扫描任务

**接口**: `POST /api/cicd/scans`

**描述**: 创建新的扫描任务（仅创建，不执行）

**请求体**:
| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 是 | 项目名称 |
| scan_type | string | 是 | 扫描类型 (sast/dast/dependency/secret) |
| trigger_type | string | 否 | 触发类型 (manual/scheduled) |

**请求示例**:
```json
{
  "project_name": "OpenClaw-Admin",
  "scan_type": "sast",
  "trigger_type": "manual"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "扫描任务创建成功",
  "data": {
    "scan_id": "scan_abc123"
  }
}
```

---

### 4. 执行 SAST 扫描

**接口**: `POST /api/cicd/scans/sast`

**描述**: 执行静态应用安全测试扫描

**权限要求**: `admin` 角色

**请求体**:
| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 是 | 项目名称 |
| config_path | string | 否 | SAST 配置文件路径 |
| target_path | string | 否 | 扫描目标路径 (默认 ".") |

**请求示例**:
```json
{
  "project_name": "OpenClaw-Admin",
  "config_path": ".semgrep.yaml",
  "target_path": "./backend"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "SAST 扫描任务已启动",
  "data": {
    "scan_id": "scan_abc123"
  }
}
```

**扫描工具**: 使用 Semgrep 进行 SAST 扫描

---

### 5. 执行 DAST 扫描

**接口**: `POST /api/cicd/scans/dast`

**描述**: 执行动态应用安全测试扫描

**权限要求**: `admin` 角色

**请求体**:
| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 是 | 项目名称 |
| target_url | string | 是 | 目标应用 URL |

**请求示例**:
```json
{
  "project_name": "OpenClaw-Admin",
  "target_url": "http://localhost:10001"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "DAST 扫描任务已启动",
  "data": {
    "scan_id": "scan_abc123"
  }
}
```

**扫描工具**: 使用 OWASP ZAP 进行 DAST 扫描

---

### 6. 执行依赖扫描

**接口**: `POST /api/cicd/scans/dependency`

**描述**: 执行第三方依赖库安全扫描

**权限要求**: `admin` 角色

**请求体**:
| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 是 | 项目名称 |
| package_manager | string | 否 | 包管理器 (npm/yarn/pip，默认 npm) |

**请求示例**:
```json
{
  "project_name": "OpenClaw-Admin",
  "package_manager": "npm"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "依赖扫描任务已启动",
  "data": {
    "scan_id": "scan_abc123"
  }
}
```

**扫描工具**: 使用 `npm audit` 或 `yarn audit`

---

### 7. 执行密钥检测

**接口**: `POST /api/cicd/scans/secret`

**描述**: 检测代码中泄露的敏感信息

**权限要求**: `admin` 角色

**请求体**:
| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| project_name | string | 是 | 项目名称 |
| target_path | string | 否 | 扫描目标路径 (默认 ".") |

**请求示例**:
```json
{
  "project_name": "OpenClaw-Admin",
  "target_path": "."
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "密钥检测任务已启动",
  "data": {
    "scan_id": "scan_abc123"
  }
}
```

**扫描工具**: 使用 Gitleaks 进行密钥检测

---

### 8. 获取扫描结果

**接口**: `GET /api/cicd/scans/:scanId/results`

**描述**: 获取扫描任务的详细结果

**路径参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| scanId | string | 扫描任务 ID |

**查询参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| severity | string | 按严重程度过滤 (critical/high/medium/low) |
| limit | number | 返回数量限制 (默认 100) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "result_xyz789",
      "scan_id": "scan_abc123",
      "severity": "high",
      "category": "sast",
      "title": "SQL 注入风险",
      "description": "用户输入未经过滤直接拼接到 SQL 语句中",
      "location": "backend/src/controllers/user.controller.js:45",
      "remediation": "使用参数化查询或 ORM 框架",
      "created_at": 1712774580000
    }
  ]
}
```

---

### 9. 获取扫描统计信息

**接口**: `GET /api/cicd/stats`

**描述**: 获取扫描任务的统计信息

**权限要求**: `admin` 角色

**查询参数**:
| 参数 | 类型 | 描述 |
|------|------|------|
| start_date | number | 起始时间戳 (毫秒) |
| end_date | number | 结束时间戳 (毫秒) |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "scan_type": "sast",
      "status": "completed",
      "count": 15,
      "total_issues": 42
    },
    {
      "scan_type": "dast",
      "status": "completed",
      "count": 8,
      "total_issues": 12
    },
    {
      "scan_type": "dependency",
      "status": "completed",
      "count": 20,
      "total_issues": 5
    }
  ]
}
```

---

## 扫描结果严重程度等级

| 等级 | 说明 | 示例 |
|------|------|------|
| Critical | 严重漏洞，需立即修复 | 远程代码执行、密钥泄露 |
| High | 高风险漏洞，尽快修复 | SQL 注入、XSS 攻击 |
| Medium | 中等风险，计划修复 | 不安全的反序列化 |
| Low | 低风险，可选修复 | 信息泄露、日志敏感信息 |
| Info | 信息提示，无需修复 | 代码规范建议 |

---

## 错误码说明

| 错误码 | 描述 | 解决方案 |
|--------|------|---------|
| 400 | 请求参数错误 | 检查必填字段 |
| 401 | 未认证 | 检查 Token 是否有效 |
| 403 | 无权限执行扫描 | 需要 admin 角色 |
| 404 | 扫描任务不存在 | 检查 scanId 是否正确 |
| 500 | 服务器内部错误 | 查看服务器日志 |

---

## 使用示例

### 示例 1: 执行完整的 SAST 扫描

```bash
# 1. 执行 SAST 扫描
curl -X POST http://localhost:10001/api/cicd/scans/sast \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "OpenClaw-Admin",
    "target_path": "./backend"
  }'

# 2. 获取扫描结果
curl -X GET "http://localhost:10001/api/cicd/scans/scan_abc123/results?severity=high" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 示例 2: 执行依赖扫描

```bash
curl -X POST http://localhost:10001/api/cicd/scans/dependency \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "OpenClaw-Admin",
    "package_manager": "npm"
  }'
```

### 示例 3: 获取扫描统计

```bash
curl -X GET "http://localhost:10001/api/cicd/stats?start_date=1712688000000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 集成建议

### CI/CD 流水线集成

建议在 CI/CD 流水线中集成安全扫描：

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  sast-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run SAST Scan
        run: |
          curl -X POST ${{ secrets.GATEWAY_URL }}/api/cicd/scans/sast \
            -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
            -d '{"project_name": "OpenClaw-Admin"}'
  
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Dependency Scan
        run: |
          curl -X POST ${{ secrets.GATEWAY_URL }}/api/cicd/scans/dependency \
            -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
            -d '{"project_name": "OpenClaw-Admin"}'
```

---

## 相关文档

- [API 总文档](../API_DOCUMENTATION.md)
- [安全审计报告](../../SECURITY_AUDIT.md)
- [部署文档](../DEPLOYMENT.md)

---

**文档维护**: 技术文档工程师  
**最后更新**: 2026-04-11  
**文档版本**: v1.0.0
