# 🎮 游戏时间推进机制问题分析

生成时间: 2025-05-01

## 📊 当前问题总结

**核心问题**: 游戏无法自然终止，会无限进行直到某个属性归零失败

---

## 🔍 详细分析

### 1. 写死 Demo 的流程（原来的工作方式）

#### 时间推进机制
```typescript
// 主线卡（Milestone）的 daysToAdvance
{
  id: "timeline_start",
  choices: {
    left: { daysToAdvance: 30, nextCardId: "agency_1_handover" },
    right: { daysToAdvance: 30, nextCardId: "diy_1_ielts" }
  }
}

// 统计结果：
- 35 个 daysToAdvance 设置
- 主线卡每次推进 15-30 天
- 通过 nextCardId 强制剧情线
```

#### 阶段推进规则
```typescript
const DAYS_IN_YEAR = 360;

// 阶段划分
Year1: 0 - 359 天
Year2: 360 - 719 天
Year3: 720 - 1079 天
```

#### Demo 的完整时间线
```
timeline_start (Day 0)
  → [30 days]
agency_1_handover / diy_1_ielts (Day 30)
  → [30 days]
agency_2_ghosting_a/b / diy_2_gre (Day 60)
  → [15-30 days]
... 中间里程碑 ...
  → [30 days]
final_push (Day ~270)
  → [30 days]
decision_day (Day ~300)
  → GAME OVER (VICTORY)
```

**Demo 体验**: 约 10-15 张卡，1-2 分钟完成，Year1 结束

---

### 2. 当前数据库算法的问题

#### 问题 1: 动态卡没有 `daysToAdvance`
```typescript
// 数据库中的动态卡示例
{
  id: "dynamic_deadline_tracker",
  choices: {
    left: {
      effect: {
        stats: { experience: 10, mentality: 8, energy: -5 },
        resultText: "...",
        // ❌ 没有 daysToAdvance
      }
    }
  }
}

// Reducer 中的 fallback 逻辑
const nextDay = state.currentDay + (
  choice.effect.daysToAdvance ??  // undefined
  Math.floor(Math.random() * 3) + 1  // 默认 1-3 天
);
```

**影响**:
- 动态卡只推进 1-3 天
- 主线卡推进 15-30 天
- 时间推进速度严重不匹配

#### 问题 2: 没有阶段推进触发器
```typescript
// Director 只筛选 phase 匹配的卡
const hasRequiredFlags = (card: RuntimeCard, state: RuntimeState) => {
  if (requirements.phases && !requirements.phases.includes(state.currentPhase)) {
    return false;  // ❌ Year1 的卡不会在 Year2 出现
  }
  // ...
};

// 但是！没有机制把玩家推进到 Year2/Year3
```

**影响**:
- 玩家永远困在 Year1
- Year2/Year3 的卡永远不会被抽取
- 时间累积非常慢（每张动态卡只推进 1-3 天）

#### 问题 3: 唯一的结束卡在 Year1
```typescript
{
  id: "decision_day",
  phase: Phase.Year1,  // ❌ 固定在 Year1
  meta: {
    cardType: "ending",
  },
  choices: {
    left: {
      effect: {
        triggerGameOver: "DEMO COMPLETED!...",
        isWin: true,
      }
    }
  }
}
```

**当前情况**:
- `decision_day` 是 Year1 的卡
- 通过 `nextCardId` 链接到 `final_push`
- `final_push` 通过 `nextCardId` 链接到 `decision_day`
- 但这只在**写死的剧情线**中工作

**问题**:
- Director 算法不会自动推进到 `decision_day`
- 除非通过精确的 `nextCardId` 链条，否则永远不会触发
- 动态插入的卡会打断这个链条

#### 问题 4: 胜利条件只在一两张特殊卡上
```typescript
// Reducer 中的游戏结束检查
const resolveStandardGameOver = (stats) => {
  if (stats.gpa <= 0) return "Academic Dismissal...";     // 失败
  if (stats.mentality <= 0) return "Burnout...";        // 失败
  if (stats.energy <= 0) return "Exhaustion...";        // 失败
  if (stats.experience <= 0) return "Blank Resume...";  // 失败
  return null;  // ❌ 没有胜利条件
};

// 胜利只在特殊卡上
if (choice.effect.triggerGameOver) {
  return {
    gameOver: {
      isGameOver: true,
      gameOverReason: choice.effect.triggerGameOver,
      isWin: choice.effect.isWin ?? false,  // 只有这里能胜利
    }
  };
}
```

---

## 📈 数据对比

### 时间推进速度对比

| 卡类型 | daysToAdvance | 达到 Day 360 (Year2) 需要的卡数 |
|--------|---------------|-------------------------------|
| 主线卡（Milestone） | 15-30 天 | ~12-24 张 |
| 动态卡（当前） | 1-3 天（默认） | ~120-360 张 ❌ |
| 理想动态卡 | 5-10 天（建议） | ~36-72 张 ✅ |

### 当前 Demo 的实际流程

```
主线卡数量：~15 张
总时间推进：~300 天
结束条件：decision_day (手动触发)
结果：Year1 完成后立即结束 ✅
```

### 数据库算法的实际情况

```
Year1 主线卡：~5 张（如果被打断）
动态卡：无限抽取
每次推进：1-3 天
达到 Year2：需要 ~180 张卡，几乎不可能 ❌
结束条件：只有属性归零失败
结果：永远不会胜利，只会无限进行 ❌
```

---

## 🎯 解决方案

### 方案 1: 最小修改（快速修复）

**目标**: 让游戏能够自然完成，保持现有架构

#### 1.1 给动态卡添加合理的 `daysToAdvance`

```typescript
// 数据库中所有动态卡都应该有
{
  id: "dynamic_deadline_tracker",
  choices: {
    left: {
      effect: {
        stats: { experience: 10, mentality: 8, energy: -5 },
        daysToAdvance: 7,  // ✅ 添加：推进约一周
      }
    },
    right: {
      effect: {
        stats: { mentality: -8, experience: -5 },
        daysToAdvance: 5,  // ✅ 添加：推进约一周
      }
    }
  }
}

// 建议值：
- dynamic: 5-10 天
- recovery: 7-14 天（休息应该花费时间）
- knowledge: 3-7 天（学习很快）
- crisis: 3-7 天（危机处理迅速）
```

#### 1.2 添加阶段性 Milestone 触发器

```typescript
// 检查是否应该进入下一阶段
const shouldAdvancePhase = (state: RuntimeState) => {
  const DAYS_IN_YEAR = 360;
  const currentPhase = state.currentPhase;

  // Year1 → Year2: 达到 Day 270 且完成特定任务
  if (currentPhase === "year1" &&
      state.currentDay >= 270 &&
      !state.flags.includes("year1_complete")) {
    return true;
  }

  // Year2 → Year3: 达到 Day 630 且完成任务
  if (currentPhase === "year2" &&
      state.currentDay >= 630 &&
      !state.flags.includes("year2_complete")) {
    return true;
  }

  return false;
};

// 在 Director 中检查
export const drawNextRuntimeCard = (context: DirectorContext) => {
  // 1. 优先检查是否需要推进阶段
  if (shouldAdvancePhase(context.state)) {
    const phaseTransitionCard = repository.findPhaseTransitionCard(
      context.state.currentPhase
    );
    if (phaseTransitionCard) {
      return { nextCard: phaseTransitionCard, ... };
    }
  }

  // 2. 然后是 queued card
  // 3. 最后是 dynamic cards
  ...
};
```

#### 1.3 创建阶段性 Milestone 卡

```typescript
// Year1 → Year2 的过渡卡
{
  id: "year1_to_year2_transition",
  phase: "year1",
  category: "MILESTONE",
  meta: {
    cardType: "milestone",
    priority: 999,  // 超高优先级
    timeTrigger: { day: 270 },  // 在 Day 270 触发
  },
  requirements: {
    statMin: { gpa: 20, mentality: 20, energy: 20, experience: 20 }
  },
  choices: {
    left: {
      label: "Continue to Year 2",
      effect: {
        daysToAdvance: 90,  // 跳过暑假
        addFlags: ["year1_complete"],
        nextCardId: "year2_start_milestone",
      }
    }
  }
}

// Year2 → Year3 类似
// Year3 → Ending 类似
```

#### 1.4 添加时间胜利条件

```typescript
// 在 Reducer 中添加
const resolveStandardGameOver = (stats, state) => {
  // 现有的失败条件
  if (stats.gpa <= 0) return "Academic Dismissal...";
  if (stats.mentality <= 0) return "Burnout...";
  if (stats.energy <= 0) return "Exhaustion...";
  if (stats.experience <= 0) return "Blank Resume...";

  // ✅ 新增：时间胜利条件
  if (state.currentPhase === "year3" && state.currentDay >= 1000) {
    return {
      gameOverReason: "Application Season Complete! You survived all three years and made it through.",
      isWin: true,
    };
  }

  return null;
};
```

---

### 方案 2: 完整的时间管理系统（推荐）

**目标**: 建立一个清晰、可控、可扩展的时间系统

#### 2.1 设计时间里程碑

```typescript
// 时间里程碑配置
interface TimeMilestone {
  day: number;
  phase: Phase;
  title: string;
  requiredFlags?: string[];
  blockedFlags?: string[];
  minStats?: Partial<Record<StatKey, number>>;
  transitionCard?: string;  // 可选的过渡卡
}

const TIME_MILESTONES: TimeMilestone[] = [
  {
    day: 0,
    phase: "year1",
    title: "September: Senior Year Begins",
    transitionCard: "timeline_start",
  },
  {
    day: 270,
    phase: "year1",
    title: "May: Year 1 Complete",
    requiredFlags: ["applications_submitted"],  // 需要完成某些任务
  },
  {
    day: 270,
    phase: "year2",
    title: "June: Summer Break",
    transitionCard: "summer_break_year1",
  },
  {
    day: 630,
    phase: "year2",
    title: "May: Year 2 Complete",
    requiredFlags: ["summer_intern_complete"],
  },
  {
    day: 630,
    phase: "year3",
    title: "September: Final Year Begins",
    transitionCard: "year3_start",
  },
  {
    day: 900,
    phase: "year3",
    title: "December: Application Season",
    transitionCard: "application_season_final",
  },
  {
    day: 1000,
    phase: "year3",
    title: "April: Decision Month",
    transitionCard: "decision_month",
  },
];
```

#### 2.2 修改 Director 的时间检查

```typescript
export const drawNextRuntimeCard = (context: DirectorContext) => {
  const { state, repository } = context;

  // 1. 检查是否达到了时间里程碑
  const upcomingMilestone = findUpcomingMilestone(state.currentDay, state.currentPhase);

  if (upcomingMilestone && shouldTriggerMilestone(state, upcomingMilestone)) {
    const milestoneCard = upcomingMilestone.transitionCard
      ? repository.findCardById(upcomingMilestone.transitionCard)
      : generateGenericMilestoneCard(upcomingMilestone);

    if (milestoneCard) {
      return {
        nextCard: milestoneCard,
        nextDeck: buildAvailableDeck(context),
        queuedCardId: null,  // 清空队列，优先处理时间里程碑
      };
    }
  }

  // 2. 检查 queued card
  const queuedCard = drawQueuedCard(context);
  if (queuedCard) {
    return { nextCard: queuedCard, ... };
  }

  // 3. 正常抽卡
  const nextCard = drawScoredCandidate(context);
  return { nextCard, ... };
};

const shouldTriggerMilestone = (state: RuntimeState, milestone: TimeMilestone) => {
  // 检查是否已经过了这个时间点
  if (state.currentDay < milestone.day) {
    return false;
  }

  // 检查是否有阻塞标记
  if (milestone.blockedFlags?.some(f => state.flags.includes(f))) {
    return false;
  }

  // 检查是否已经完成必需任务
  if (milestone.requiredFlags?.some(f => !state.flags.includes(f))) {
    // 如果没完成任务，给一个缓冲期（30天）
    return state.currentDay >= milestone.day + 30;
  }

  // 检查最低属性
  if (milestone.minStats) {
    for (const [key, min] of Object.entries(milestone.minStats)) {
      if (state.stats[key as StatKey] < min) {
        return false;
      }
    }
  }

  return true;
};
```

#### 2.3 动态生成通用里程碑卡

```typescript
// 如果数据库中没有特定的过渡卡，动态生成
const generateGenericMilestoneCard = (milestone: TimeMilestone): RuntimeCard => {
  return {
    id: `time_milestone_${milestone.day}`,
    category: "MILESTONE",
    phase: milestone.phase,
    character: "calendar",
    title: milestone.title,
    text: generateMilestoneText(milestone),
    stressLevel: "chill",
    meta: {
      cardType: "milestone",
      priority: 999,
    },
    choices: {
      left: {
        id: "continue",
        label: "Continue",
        effect: {
          daysToAdvance: calculateTimeToNextMilestone(milestone.day),
          addFlags: [`reached_${milestone.title.toLowerCase().replace(/\s/g, "_")}`],
        },
      },
      right: {
        id: "continue_alt",
        label: "Continue (Alt)",
        effect: {
          daysToAdvance: calculateTimeToNextMilestone(milestone.day),
          addFlags: [`reached_${milestone.title.toLowerCase().replace(/\s/g, "_")}`],
          // 可能有一些小的 stat 差异
        },
      },
    },
  };
};
```

#### 2.4 数据库 Schema 更新

```sql
-- 添加时间里程碑字段到 balance_configs
INSERT INTO balance_configs (key, value) VALUES (
  'time_milestones',
  '{
    "milestones": [
      { "day": 270, "phase": "year1_to_year2", "title": "Year 1 Complete" },
      { "day": 630, "phase": "year2_to_year3", "title": "Year 2 Complete" },
      { "day": 1000, "phase": "ending", "title": "Application Complete" }
    ]
  }'::jsonb
);

-- 或者给 cards 表添加新字段
ALTER TABLE cards ADD COLUMN time_trigger INTEGER;
ALTER TABLE cards ADD COLUMN is_transition_card BOOLEAN DEFAULT FALSE;
```

---

## 🛠️ 实施优先级

### 阶段 1: 紧急修复（1-2小时）

✅ 可以立即实施：
1. 给所有 37 张卡添加 `daysToAdvance`
2. 给 Year1 的 ending 卡添加胜利条件检查
3. 调整动态卡的默认时间推进

**效果**: 游戏能正常结束，虽然还比较粗糙

### 阶段 2: 结构改进（半天）

✅ 建立完整的时间系统：
1. 实现 `TIME_MILESTONES` 配置
2. 修改 Director 检查时间里程碑
3. 创建 Year1→Year2→Year3 的过渡卡
4. 添加时间胜利条件

**效果**: 清晰的三阶段流程，自然的游戏结束

### 阶段 3: 内容扩展（持续）

✅ 丰富内容：
1. 为 Year2/Year3 创建更多卡
2. 添加阶段特定的危机和恢复卡
3. 平衡每个阶段的时间和难度

**效果**: 完整的 1-2 分钟游戏体验

---

## 📝 建议的数据库迁移脚本

```sql
-- 1. 给现有卡添加 daysToAdvance
UPDATE cards
SET choices = jsonb_set(
  choices,
  '{left,effect,daysToAdvance}',
  '7'::jsonb
)
WHERE card_type = 'dynamic'
  AND choices->'left'->>'effect' IS NOT NULL;

-- 2. 添加时间里程碑配置
INSERT INTO balance_configs (key, value, description) VALUES
(
  'time_milestones',
  '{
    "year1_end": { "day": 270, "phase": "year1", "title": "Year 1 Complete" },
    "year2_end": { "day": 630, "phase": "year2", "title": "Year 2 Complete" },
    "game_end": { "day": 1000, "phase": "year3", "title": "Application Complete" }
  }'::jsonb,
  'Time milestones for game progression'
);

-- 3. 标记过渡卡
UPDATE cards
SET is_transition_card = true
WHERE id IN ('timeline_start', 'year1_end', 'year2_start', 'decision_day');
```

---

## 🎯 测试计划

### 测试场景 1: 正常流程
```
开始 (Day 0)
→ 选择路线 (Day 30)
→ 动态卡 (Day 37)
→ 动态卡 (Day 44)
→ 主线卡 (Day 74)
→ ...
→ Year 1 完成 (Day 270)
→ 进入 Year 2
→ ...
→ Year 3 完成 (Day 1000)
→ 胜利！
```

### 测试场景 2: 极限快速流程
```
→ 连续选择大时间推进的选项
→ ~10-15 张卡完成整个游戏
→ 符合 1-2 分钟目标
```

### 测试场景 3: 失败流程
```
→ 故意保持某个属性低位
→ 在某个阶段触发失败
→ 游戏正常结束
```

---

## 📊 预期结果

修复后，游戏应该：

✅ **明确的时间线**
- Year1: 0-270 天（约 9 个月）
- Year2: 270-630 天（包含暑假）
- Year3: 630-1000 天（申请季）

✅ **合理的卡牌数量**
- 总卡数: 20-40 张
- 游戏时长: 1-2 分钟
- 每个阶段: 6-15 张卡

✅ **自然的结束**
- 失败: 属性归零
- 胜利: 完成 Year3（Day 1000+）
- 特殊结局: 某些关键选择

---

## ⚠️ 注意事项

1. **向后兼容**: 确保现有的 37 张卡都能正常工作
2. **数据库迁移**: 添加 `daysToAdvance` 字段需要更新所有现有卡
3. **测试覆盖**: 需要测试所有三条路线（agency/diy/mixed）
4. **平衡调优**: 时间推进速度可能需要多次迭代调整

---

## 🚀 下一步行动

1. **立即修复**: 给所有卡添加 `daysToAdvance`
2. **验证**: 运行 `testSupabasePipeline` 确认时间推进正常
3. **实施**: 创建 Year1/Year2/Year3 的过渡卡
4. **测试**: 手动玩几局，确认游戏能正常结束
5. **部署**: 推送到 Supabase 和 Vercel

准备好开始实施了吗？我可以帮你一步步实现这些修改。😊
