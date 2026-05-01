# 🎓 三年时间系统设计

生成时间: 2025-05-01

## 🎯 目标

- **完整流程**: Year1 → Year2 → Year3
- **游戏时长**: 1-1.5 分钟（60-90秒）
- **总天数**: Day 0 → Day 1000+
- **回合数**: 20-30 回合

## 📊 时间分配

### 阶段划分

```
Year1 (Day 0-359):    准备阶段（选校、考试、材料）
Year2 (Day 360-719):  提升阶段（科研、实习、推荐信）
Year3 (Day 720-1000): 申请阶段（文书、面试、等待结果）
```

### 时间推进速度

**目标**: 20-30 回合覆盖 1000 天
**平均**: 每回合推进 33-50 天

**分配**：
- **Milestone 卡**: 40-60 天/回合（主线快速推进）
- **Dynamic 卡**: 15-30 天/回合（正常节奏）
- **Recovery 卡**: 20-40 天/回合（休息花费时间）
- **Crisis 卡**: 10-20 天/回合（危机处理快）
- **Knowledge 卡**: 10-20 天/回合（学习快）

### 回合分配

```
Year1: 6-8 回合 (约 240 天)
Year2: 7-10 回合 (约 280 天)
Year3: 7-12 回合 (约 480 天)
总计: 20-30 回合
```

## 🔧 需要修改的地方

### 1. 修改胜利条件

```typescript
// reducer.ts
const resolveStandardGameOver = (
  stats: RuntimeState["stats"],
  state: RuntimeState,
) => {
  // ... 失败条件 ...

  // ✅ 修改：Year3 结束时胜利（Day 1000+）
  if (state.currentDay >= 1000) {
    return {
      gameOverReason: "🎓 Application Journey Complete! You've survived all three years and made it through the entire grad school application process.",
      isWin: true,
    };
  }

  return null;
};
```

### 2. 调整所有卡的 daysToAdvance

**Milestone 卡**（约 15 张）：
```typescript
daysToAdvance: 40-60  // 原来 15-30，翻倍
```

**Dynamic 卡**（约 20 张）：
```typescript
daysToAdvance: 15-30  // 原来 5-10，翻倍
```

**Recovery 卡**（约 2-3 张）：
```typescript
daysToAdvance: 20-40  // 原来 5-10，翻倍
```

**Crisis 卡**（约 2 张）：
```typescript
daysToAdvance: 10-20  // 原来 3-7，翻倍
```

### 3. 添加阶段过渡提示（可选）

在 UI 上显示当前年份，让玩家清楚进度：

```
┌─────────────────────┐
│   YEAR 1 - SEP 15   │  ← 显示当前年份和日期
├─────────────────────┤
│   [游戏内容]        │
└─────────────────────┘
```

## 📐 数学验证

### 场景 1: 全是 Milestone（最快）
```
15 张 Milestone × 40 天 = 600 天
太少，需要穿插 Dynamic 卡
```

### 场景 2: Milestone + Dynamic 混合（正常）
```
8 Milestone × 50 天 = 400 天
15 Dynamic × 25 天 = 375 天
2 Recovery × 30 天 = 60 天
1 Crisis × 15 天 = 15 天
总计: 26 回合，850 天 ✅
```

### 场景 3: 更多 Dynamic 卡（慢速）
```
10 Milestone × 60 天 = 600 天
20 Dynamic × 20 天 = 400 天
总计: 30 回合，1000 天 ✅
```

**结论**: 20-30 回合可以达到 Day 1000 ✅

## ⏱️ 游戏时长验证

```
20 回合 × 3 秒/回合 = 60 秒 (1 分钟)
30 回合 × 3 秒/回合 = 90 秒 (1.5 分钟)
```

**符合目标**: 1-1.5 分钟 ✅

## 🎮 用户体验

### 游戏节奏

**Year1** (快速):
- 主要是 Milestone
- 建立基础（选校、考试）
- 6-8 回合

**Year2** (平稳):
- Milestone + Dynamic 混合
- 积累经验（科研、实习）
- 7-10 回合

**Year3** (紧张):
- Dynamic 更多
- 高压力（文书、面试）
- 7-12 回合

### 视觉反馈

UI 显示：
- 当前年份（YEAR 1/2/3）
- 当前日期（SEP 15）
- 进度条（可选）

## 🚀 实施步骤

1. **修改胜利条件** (1 分钟)
   - Day 300 → Day 1000

2. **调整所有 daysToAdvance** (10 分钟)
   - Milestone: 40-60
   - Dynamic: 15-30
   - Recovery: 20-40
   - Crisis: 10-20

3. **测试验证** (5 分钟)
   - 运行模拟器
   - 确认 20-30 回合到达 Day 1000

4. **可选优化** (15 分钟)
   - 添加年份显示
   - 添加阶段过渡卡
   - 调整数值平衡

## 📝 预期结果

修改后，一局游戏的完整流程：

```
开始: Day 0, Year 1, SEP 1
  ↓ [6-8 回合]
Year1 结束: Day ~240, Year 1, MAY
  ↓ [7-10 回合]
Year2 结束: Day ~520, Year 2, APR
  ↓ [7-12 回合]
Year3 结束: Day ~1000, Year 3, APR
  ↓
胜利! 🎉

总回合数: 20-30
总游戏时间: 60-90 秒
完整体验: Year 1 → Year 2 → Year 3 ✅
```

---

**这样就能实现完整的三年级流程，并且控制在 1-1.5 分钟内！**
