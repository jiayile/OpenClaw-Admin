# 需求文档：批量操作功能

**文档编号**: REQ-005  
**优先级**: P1 - 高  
**状态**: 需求分析完成  
**创建日期**: 2026-04-10  
**负责人**: 前端开发 + 后端开发

---

## 一、功能描述

### 1.1 背景

当前 OpenClaw-Admin 系统缺乏批量操作能力，用户在以下场景需要逐个操作，效率低下：

1. **会话管理**：需要逐个删除过期会话、逐个导出会话数据
2. **技能管理**：需要逐个启用/禁用技能、逐个更新技能配置
3. **渠道管理**：需要逐个启停渠道、逐个修改渠道配置
4. **模型管理**：需要逐个配置模型参数、逐个测试模型连接
5. **定时任务**：需要逐个启停任务、逐个查看任务历史

用户反馈显示，在管理 50+ 个会话或技能时，批量操作缺失导致运维时间增加 5-10 倍。

### 1.2 目标

- 为所有列表页面添加批量操作能力
- 支持多选、全选、反选等操作
- 提供批量删除、批量启用/禁用、批量导出等功能
- 批量操作支持进度显示和错误处理
- 提升运维效率，减少重复操作

---

## 二、功能需求

### 2.1 批量选择功能

#### 2.1.1 选择方式

```
┌─────────────────────────────────────────────────────┐
│  ☐ 全选   已选择 3/50 项   [反选] [清空]             │
├─────────────────────────────────────────────────────┤
│  ☐  [会话名称]    [状态]    [创建时间]    [操作]    │
│  ☐  会话 A         活跃      2026-04-10    [...]     │
│  ☑  会话 B         活跃      2026-04-09    [...]     │
│  ☑  会话 C         已结束    2026-04-08    [...]     │
│  ☐  会话 D         活跃      2026-04-07    [...]     │
│  ☑  会话 E         已结束    2026-04-06    [...]     │
└─────────────────────────────────────────────────────┘
```

**选择操作**：
- **全选**：选择当前页所有项（或全部数据）
- **单选**：点击复选框选择单项
- **反选**：切换所有项的选择状态
- **清空**：取消所有选择
- **范围选择**：Shift+ 点击选择连续范围

#### 2.1.2 跨页选择

```
已选择 3 项（当前页）
┌─────────────────────────────────┐
│ 是否选择所有 50 项？              │
│ [仅当前页 3 项] [全部 50 项]       │
└─────────────────────────────────┘
```

### 2.2 批量操作类型

#### 2.2.1 会话管理批量操作

| 操作 | 说明 | 确认要求 |
|------|------|----------|
| 批量删除 | 删除选中的会话及关联数据 | 二次确认 |
| 批量导出 | 导出选中会话为 JSON/CSV | 选择格式 |
| 批量归档 | 将选中会话标记为归档 | - |
| 批量重置 | 重置选中会话的上下文 | 二次确认 |
| 批量标记 | 批量添加标签/分类 | 选择标签 |

#### 2.2.2 技能管理批量操作

| 操作 | 说明 | 确认要求 |
|------|------|----------|
| 批量启用 | 启用选中的技能 | - |
| 批量禁用 | 禁用选中的技能 | - |
| 批量更新 | 更新选中技能到最新版本 | 显示变更日志 |
| 批量卸载 | 卸载选中的技能 | 二次确认 |
| 批量配置 | 批量修改技能配置参数 | 配置模板 |

#### 2.2.3 渠道管理批量操作

| 操作 | 说明 | 确认要求 |
|------|------|----------|
| 批量启用 | 启用选中的渠道 | - |
| 批量禁用 | 禁用选中的渠道 | - |
| 批量测试 | 测试选中渠道的连接状态 | 显示测试结果 |
| 批量导出 | 导出渠道配置 | 选择格式 |
| 批量导入 | 批量导入渠道配置 | 文件上传 |

#### 2.2.4 模型管理批量操作

| 操作 | 说明 | 确认要求 |
|------|------|----------|
| 批量测试 | 测试选中模型的 API 连接 | 显示测试结果 |
| 批量启用 | 启用选中的模型 | - |
| 批量禁用 | 禁用选中的模型 | - |
| 批量删除 | 删除选中的模型配置 | 二次确认 |
| 批量导出 | 导出模型配置 | 选择格式 |

#### 2.2.5 定时任务批量操作

| 操作 | 说明 | 确认要求 |
|------|------|----------|
| 批量启用 | 启用选中的任务 | - |
| 批量禁用 | 禁用选中的任务 | - |
| 批量执行 | 立即执行选中的任务 | 显示执行进度 |
| 批量删除 | 删除选中的任务 | 二次确认 |
| 批量导出 | 导出任务配置 | 选择格式 |

### 2.3 批量操作 UI 组件

#### 2.3.1 批量操作工具栏

```
┌─────────────────────────────────────────────────────┐
│ 已选择 3 项                                           │
│                                                      │
│  [批量删除] [批量导出] [批量启用] [批量禁用] [+更多] │
│                                                      │
│  最近操作：                                         │
│  • 批量删除 5 项会话 - 2 分钟前 ✓                     │
│  • 批量启用 10 项技能 - 1 小时前 ✓                    │
└─────────────────────────────────────────────────────┘
```

#### 2.3.2 批量操作进度

```
┌─────────────────────────────────────────────────────┐
│ 批量删除会话...                                     │
│                                                      │
│  ████████████░░░░░░░░░░ 60% (3/5)                   │
│                                                      │
│  ✓ 会话 B - 删除成功                                 │
│  ✓ 会话 C - 删除成功                                 │
│  ✓ 会话 E - 删除成功                                 │
│  ○ 会话 F - 处理中...                                │
│  ○ 会话 G - 等待中                                   │
│                                                      │
│  [取消]                                              │
└─────────────────────────────────────────────────────┘
```

#### 2.3.3 批量操作结果

```
┌─────────────────────────────────────────────────────┐
│ 批量删除完成                                        │
│                                                      │
│  成功：5 项                                          │
│  失败：0 项                                          │
│                                                      │
│  ✓ 会话 B                                            │
│  ✓ 会话 C                                            │
│  ✓ 会话 E                                            │
│  ✓ 会话 F                                            │
│  ✓ 会话 G                                            │
│                                                      │
│  [关闭] [查看日志]                                   │
└─────────────────────────────────────────────────────┘
```

---

## 三、验收标准

### 3.1 功能验收

- [ ] 所有列表页面支持复选框选择
- [ ] 支持全选、反选、清空操作
- [ ] 支持跨页选择（全部数据）
- [ ] 批量删除功能正常工作
- [ ] 批量启用/禁用功能正常工作
- [ ] 批量导出功能支持 JSON/CSV 格式
- [ ] 批量操作显示实时进度
- [ ] 批量操作错误时能部分成功
- [ ] 批量操作结果有明确反馈

### 3.2 性能验收

- [ ] 批量操作 100 项数据在 10 秒内完成
- [ ] 批量操作不阻塞 UI 界面
- [ ] 支持后台执行，用户可继续其他操作
- [ ] 大批量操作（500+ 项）使用分页处理

### 3.3 安全验收

- [ ] 批量删除需要二次确认
- [ ] 批量操作记录审计日志
- [ ] 权限检查：用户只能操作有权限的数据
- [ ] 批量操作失败时回滚已执行的操作（可选）

---

## 四、技术要点

### 4.1 前端实现

#### 4.1.1 选择状态管理

```typescript
// 使用 Zustand 管理选择状态
import { create } from 'zustand';

interface BatchSelectionStore {
  selectedIds: Set<string>;
  totalCount: number;
  currentPageOnly: boolean;
  
  selectAll: (all: boolean) => void;
  selectOne: (id: string) => void;
  deselectOne: (id: string) => void;
  invertSelection: () => void;
  clearSelection: () => void;
  selectAllData: () => void;
}

export const useBatchSelection = create<BatchSelectionStore>((set, get) => ({
  selectedIds: new Set(),
  totalCount: 0,
  currentPageOnly: true,
  
  selectAll: (all) => set({ 
    selectedIds: all ? new Set(currentPageIds) : new Set() 
  }),
  
  selectOne: (id) => set((state) => {
    const newSet = new Set(state.selectedIds);
    newSet.add(id);
    return { selectedIds: newSet };
  }),
  
  // ... 其他方法
}));
```

#### 4.1.2 批量操作组件

```typescript
// BatchActionBar 组件
interface BatchActionBarProps {
  selectedCount: number;
  totalCount: number;
  onAction: (action: string, ids: string[]) => Promise<BatchResult>;
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  totalCount,
  onAction
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleBatchAction = async (action: string) => {
    setIsProcessing(true);
    try {
      const result = await onAction(action, Array.from(selectedIds));
      // 显示结果
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="batch-action-bar">
      <span>已选择 {selectedCount} 项</span>
      <Button onClick={() => handleBatchAction('delete')}>批量删除</Button>
      <Button onClick={() => handleBatchAction('export')}>批量导出</Button>
      {/* 更多操作 */}
    </div>
  );
};
```

### 4.2 后端实现

#### 4.2.1 批量操作 API

```typescript
// POST /api/sessions/batch-delete
app.post('/api/sessions/batch-delete', authMiddleware, async (req, res) => {
  const { ids, confirm } = req.body;
  
  if (!confirm) {
    return res.status(400).json({ error: '需要二次确认' });
  }
  
  // 权限检查
  const accessibleIds = await filterAccessibleIds(ids, req.user);
  
  // 批量删除
  const result = await sessionService.batchDelete(accessibleIds);
  
  // 记录审计日志
  await auditLogService.log({
    action: 'BATCH_DELETE_SESSIONS',
    userId: req.user.id,
    count: result.successCount,
    details: result
  });
  
  res.json(result);
});

// POST /api/sessions/batch-export
app.post('/api/sessions/batch-export', authMiddleware, async (req, res) => {
  const { ids, format = 'json' } = req.body;
  
  const sessions = await sessionService.batchGet(ids);
  const content = format === 'csv' 
    ? convertToCSV(sessions)
    : JSON.stringify(sessions, null, 2);
  
  res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
  res.send(content);
});
```

#### 4.2.2 批量操作服务

```typescript
// services/batchService.ts
class BatchService {
  async batchProcess<T>(
    items: T[],
    processor: (item: T) => Promise<ProcessResult>,
    options: { concurrency?: number; onProgress?: (progress: Progress) => void } = {}
  ): Promise<BatchResult> {
    const { concurrency = 5, onProgress } = options;
    const results: ProcessResult[] = [];
    const success: ProcessResult[] = [];
    const failed: ProcessResult[] = [];
    
    // 分批处理
    const batches = chunk(items, concurrency);
    
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await Promise.all(
        batches[i].map(item => processor(item).catch(err => ({ error: err })))
      );
      
      results.push(...batchResults);
      success.push(...batchResults.filter(r => r.success));
      failed.push(...batchResults.filter(r => !r.success));
      
      onProgress?.({
        processed: results.length,
        total: items.length,
        success: success.length,
        failed: failed.length
      });
    }
    
    return { success, failed, total: items.length };
  }
}
```

---

## 五、测试计划

### 5.1 单元测试

- 选择状态管理逻辑
- 批量操作服务
- 分页处理逻辑

### 5.2 集成测试

- 完整批量操作流程
- 大批量数据处理
- 错误处理场景

### 5.3 性能测试

- 批量操作 100/500/1000 项数据
- 并发处理性能

---

## 六、交付物

- [ ] 批量选择组件（复选框、全选、反选）
- [ ] 批量操作工具栏组件
- [ ] 批量操作进度组件
- [ ] 批量操作结果组件
- [ ] 后端批量操作 API
- [ ] 批量处理服务
- [ ] 单元测试
- [ ] 集成测试

---

## 七、时间估算

| 任务 | 预计时间 |
|------|----------|
| 技术方案设计 | 2 小时 |
| 选择状态管理 | 3 小时 |
| 批量操作组件开发 | 8 小时 |
| 后端批量 API 开发 | 6 小时 |
| 批量处理服务 | 4 小时 |
| 会话管理批量操作 | 3 小时 |
| 技能管理批量操作 | 3 小时 |
| 渠道管理批量操作 | 3 小时 |
| 模型管理批量操作 | 3 小时 |
| 定时任务批量操作 | 3 小时 |
| 单元测试 | 6 小时 |
| 集成测试 | 4 小时 |
| **总计** | **48 小时** |

---

## 八、风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 大批量操作超时 | 请求失败 | 使用分批处理 + 后台任务 |
| 数据库锁竞争 | 性能下降 | 使用事务隔离 + 延迟提交 |
| 部分失败处理复杂 | 数据不一致 | 记录详细日志，支持重试 |

---

**文档版本**: 1.0  
**最后更新**: 2026-04-10  
**审批状态**: 待审批
