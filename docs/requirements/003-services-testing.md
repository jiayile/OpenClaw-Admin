# 需求文档：补充 services 层测试

**文档编号**: REQ-003  
**优先级**: P0 - 紧急  
**状态**: 需求分析完成  
**创建日期**: 2026-04-10  
**负责人**: 测试工程师 + 后端开发

---

## 一、功能描述

### 1.1 背景

当前 OpenClaw-Admin 项目的 `src/services` 层测试覆盖率严重不足。Services 层是业务逻辑的核心承载层，包括：

- 会话管理服务 (sessionService)
- 记忆管理服务 (memoryService)  
- 模型管理服务 (modelService)
- 渠道管理服务 (channelService)
- 技能管理服务 (skillService)
- 定时任务服务 (cronService)
- 文件管理服务 (fileService)

缺乏充分测试导致：
1. 业务逻辑缺陷难以被发现
2. 重构时缺乏安全网
3. 代码文档作用有限
4. 新成员理解业务逻辑困难

### 1.2 目标

- 为所有 services 文件添加完整的单元测试
- 覆盖核心业务场景和异常场景
- 确保 services 层测试覆盖率 ≥ 85%
- 添加关键业务流程的集成测试

---

## 二、验收标准

### 2.1 测试覆盖要求

| Service 文件 | 当前覆盖率 | 目标覆盖率 | 优先级 |
|-------------|-----------|-----------|--------|
| sessionService.ts | <25% | ≥85% | P0 |
| memoryService.ts | <20% | ≥85% | P0 |
| modelService.ts | <30% | ≥85% | P0 |
| channelService.ts | <20% | ≥85% | P0 |
| skillService.ts | <35% | ≥85% | P1 |
| cronService.ts | <15% | ≥85% | P1 |
| fileService.ts | <40% | ≥85% | P1 |
| agentService.ts | <25% | ≥85% | P1 |

### 2.2 测试类型要求

- [ ] 每个 Service 至少有 15 个测试用例
- [ ] 覆盖核心业务功能
- [ ] 覆盖边界条件和异常情况
- [ ] 覆盖数据库操作（使用 Mock）
- [ ] 覆盖外部 API 调用（使用 Mock）

### 2.3 质量要求

- [ ] 所有测试用例通过
- [ ] 测试代码符合 ESLint 规范
- [ ] 使用 Arrange-Act-Assert (AAA) 模式
- [ ] 测试用例命名清晰表达意图
- [ ] 使用 Factory 模式创建测试数据

---

## 三、技术要点

### 3.1 测试框架

使用现有测试框架：
- **测试运行器**: Vitest
- **断言库**: Chai (通过 Vitest 内置)
- **Mock 工具**: Vitest spy/mock
- **数据库 Mock**: Mock Prisma client

### 3.2 测试结构

```
tests/services/
├── sessionService.test.ts
├── memoryService.test.ts
├── modelService.test.ts
├── channelService.test.ts
├── skillService.test.ts
├── cronService.test.ts
├── fileService.test.ts
└── agentService.test.ts
```

### 3.3 关键测试场景

#### sessionService.ts 测试场景
1. 创建新会话
2. 获取会话列表（分页、筛选）
3. 获取会话详情
4. 更新会话状态
5. 删除会话
6. 会话消息操作
7. 会话导出
8. 异常处理（会话不存在、权限不足）

#### memoryService.ts 测试场景
1. 创建记忆
2. 查询记忆（关键词、分类）
3. 更新记忆
4. 删除记忆
5. 记忆搜索相关性
6. 记忆过期处理

#### modelService.ts 测试场景
1. 创建模型配置
2. 获取模型列表
3. 更新模型配置
4. 删除模型配置
5. 模型探测功能
6. API Key 验证
7. 默认模型设置

#### channelService.ts 测试场景
1. 创建渠道配置
2. 渠道连接测试
3. 渠道状态更新
4. 渠道消息收发
5. 渠道启用/禁用
6. 多渠道管理

### 3.4 Mock 策略

```typescript
// Mock Prisma client
const mockPrisma = {
  session: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  // ... 其他模型
};

// Mock external API
vi.mock('../utils/openaiClient', () => ({
  detectModel: vi.fn().mockResolvedValue({ name: 'test-model' })
}));
```

### 3.5 测试数据工厂

```typescript
// tests/factories/session.ts
export function createSession(overrides = {}) {
  return {
    id: 'sess_' + Math.random(),
    title: 'Test Session',
    status: 'active',
    userId: 'user_123',
    createdAt: new Date(),
    ...overrides
  };
}
```

---

## 四、测试计划

### 4.1 第一阶段：核心服务 (P0)

**sessionService.ts**
- 会话 CRUD 操作
- 会话筛选和搜索
- 会话状态管理

**memoryService.ts**  
- 记忆 CRUD 操作
- 记忆搜索和分类
- 记忆关联管理

**modelService.ts**
- 模型配置管理
- 模型探测和验证
- 默认模型设置

**channelService.ts**
- 渠道配置管理
- 渠道连接测试
- 渠道消息处理

### 4.2 第二阶段：辅助服务 (P1)

**skillService.ts**
- 技能安装/卸载
- 技能配置管理
- 技能分类筛选

**cronService.ts**
- 定时任务 CRUD
- 任务调度执行
- 任务历史管理

**fileService.ts**
- 文件上传下载
- 文件浏览编辑
- 目录管理

**agentService.ts**
- Agent 创建管理
- Agent 配置管理
- Agent 权限设置

---

## 五、交付物

- [ ] `tests/services/sessionService.test.ts`
- [ ] `tests/services/memoryService.test.ts`
- [ ] `tests/services/modelService.test.ts`
- [ ] `tests/services/channelService.test.ts`
- [ ] `tests/services/skillService.test.ts`
- [ ] `tests/services/cronService.test.ts`
- [ ] `tests/services/fileService.test.ts`
- [ ] `tests/services/agentService.test.ts`
- [ ] `tests/factories/` - 测试数据工厂
- [ ] 测试覆盖率报告
- [ ] 测试执行报告

---

## 六、时间估算

| 任务 | 预计时间 |
|------|----------|
| sessionService 测试 | 4 小时 |
| memoryService 测试 | 3 小时 |
| modelService 测试 | 3 小时 |
| channelService 测试 | 3 小时 |
| skillService 测试 | 2 小时 |
| cronService 测试 | 3 小时 |
| fileService 测试 | 2 小时 |
| agentService 测试 | 2 小时 |
| 测试数据工厂 | 2 小时 |
| 集成测试 | 3 小时 |
| 文档和报告 | 2 小时 |
| **总计** | **29 小时** |

---

## 七、风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| Service 逻辑耦合严重 | 难以隔离测试 | 适当重构，提取可测试单元 |
| 外部依赖难以 Mock | 测试不稳定 | 使用接口抽象，Mock 接口 |
| 测试数据准备复杂 | 测试编写效率低 | 使用 Factory 模式 |
| 数据库状态污染 | 测试结果不可靠 | 每个测试独立事务或 Mock |

---

## 八、成功标准

1. Services 层测试覆盖率达到 85% 以上
2. 所有测试用例通过，无失败
3. 测试执行时间在 5 分钟以内
4. 测试代码质量通过 ESLint 检查
5. 新增代码必须包含相应测试

---

**文档版本**: 1.0  
**最后更新**: 2026-04-10  
**审批状态**: 待审批
