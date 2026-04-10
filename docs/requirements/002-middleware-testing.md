# 需求文档：补充 middleware 层测试

**文档编号**: REQ-002  
**优先级**: P0 - 紧急  
**状态**: 需求分析完成  
**创建日期**: 2026-04-10  
**负责人**: 测试工程师 + 后端开发

---

## 一、功能描述

### 1.1 背景

当前 OpenClaw-Admin 项目的测试覆盖率分析显示，`server/middleware` 层的测试覆盖率严重不足。关键中间件如认证中间件、权限中间件、速率限制中间件等缺乏充分的单元测试和集成测试，存在以下风险：

1. 认证逻辑缺陷可能未被发现
2. 权限绕过漏洞难以检测
3. 速率限制失效可能导致 DoS 攻击
4. 错误处理不完整影响系统稳定性

### 1.2 目标

- 为所有 middleware 文件添加完整的单元测试
- 覆盖正常流程和异常流程
- 确保 middleware 层测试覆盖率 ≥ 90%
- 添加关键场景的集成测试

---

## 二、验收标准

### 2.1 测试覆盖要求

| 中间件文件 | 当前覆盖率 | 目标覆盖率 | 优先级 |
|------------|-----------|-----------|--------|
| auth.js | <30% | ≥90% | P0 |
| permission.js | <20% | ≥90% | P0 |
| rate-limit.js | <40% | ≥90% | P0 |
| validation.js | <50% | ≥90% | P1 |
| error-handler.js | <30% | ≥90% | P1 |
| logging.js | <40% | ≥90% | P1 |

### 2.2 测试类型要求

- [ ] 每个中间件至少有 10 个测试用例
- [ ] 覆盖正常请求流程
- [ ] 覆盖异常请求流程（无效 token、权限不足等）
- [ ] 覆盖边界条件（速率限制阈值、超时等）
- [ ] 覆盖错误处理逻辑

### 2.3 质量要求

- [ ] 所有测试用例通过
- [ ] 测试代码符合 ESLint 规范
- [ ] 测试用例有清晰的描述和断言
- [ ] 使用 Mock 隔离外部依赖

---

## 三、技术要点

### 3.1 测试框架

使用现有测试框架：
- **测试运行器**: Vitest
- **断言库**: Chai (通过 Vitest 内置)
- **Mock 工具**: Vitest spy/mock
- **HTTP 模拟**: supertest

### 3.2 测试结构

```
tests/middleware/
├── auth.test.ts
├── permission.test.ts
├── rate-limit.test.ts
├── validation.test.ts
├── error-handler.test.ts
└── logging.test.ts
```

### 3.3 关键测试场景

#### auth.js 测试场景
1. 有效 token 通过认证
2. 无效 token 拒绝访问
3. 过期 token 拒绝访问
4. 缺少 token 返回 401
5. Bearer token 格式验证
6. Cookie token 验证
7. 单用户模式认证

#### permission.js 测试场景
1. 管理员访问所有资源
2. 操作员访问允许的资源
3. 只读用户无法修改资源
4. 未授权访问返回 403
5. 动态权限检查

#### rate-limit.js 测试场景
1. 正常请求通过
2. 超过速率限制返回 429
3. 不同 IP 独立计数
4. 时间窗口重置
5. 白名单 IP 不受限制

### 3.4 Mock 策略

```typescript
// 示例：Mock Express request/response
const mockReq = {
  headers: { authorization: 'Bearer xxx' },
  query: {},
  body: {},
  ip: '127.0.0.1',
  user: null
};

const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  end: vi.fn()
};

const mockNext = vi.fn();
```

---

## 四、测试计划

### 4.1 第一阶段：认证中间件 (auth.js)

- 测试 token 验证逻辑
- 测试会话管理
- 测试单用户模式
- 测试错误响应

### 4.2 第二阶段：权限中间件 (permission.js)

- 测试角色权限检查
- 测试资源权限检查
- 测试动态权限
- 测试权限错误处理

### 4.3 第三阶段：速率限制 (rate-limit.js)

- 测试基本速率限制
- 测试不同用户独立限制
- 测试白名单
- 测试错误响应格式

### 4.4 第四阶段：其他中间件

- validation.js - 请求参数验证
- error-handler.js - 全局错误处理
- logging.js - 请求日志记录

---

## 五、交付物

- [ ] `tests/middleware/auth.test.ts`
- [ ] `tests/middleware/permission.test.ts`
- [ ] `tests/middleware/rate-limit.test.ts`
- [ ] `tests/middleware/validation.test.ts`
- [ ] `tests/middleware/error-handler.test.ts`
- [ ] `tests/middleware/logging.test.ts`
- [ ] 测试覆盖率报告
- [ ] 测试执行报告

---

## 六、时间估算

| 任务 | 预计时间 |
|------|----------|
| auth.js 测试 | 3 小时 |
| permission.js 测试 | 3 小时 |
| rate-limit.js 测试 | 2 小时 |
| 其他中间件测试 | 4 小时 |
| 集成测试 | 2 小时 |
| 文档和报告 | 1 小时 |
| **总计** | **15 小时** |

---

## 七、风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 中间件逻辑复杂难以 Mock | 测试难以编写 | 使用依赖注入模式重构 |
| 测试执行速度慢 | 影响开发效率 | 并行执行测试用例 |
| 现有代码无测试友好设计 | 覆盖率难提升 | 适当重构提高可测试性 |

---

**文档版本**: 1.0  
**最后更新**: 2026-04-10  
**审批状态**: 待审批
