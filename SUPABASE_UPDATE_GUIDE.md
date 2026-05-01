# 🔄 Supabase 数据更新指南

生成时间: 2025-05-01

## ✅ SQL 文件已生成

**文件位置**: `dist/supabase/gradventure_seed.sql`
**卡牌数量**: 37 张
**数据版本**: 三倍 daysToAdvance（适配 7 秒/卡体验）

## 📋 更新步骤

### 方法 1: Supabase SQL Editor（推荐，最简单）

1. **打开 Supabase Dashboard**
   - 访问: https://supabase.com/dashboard
   - 选择项目: `Gradventure`

2. **打开 SQL Editor**
   - 左侧菜单 → `SQL Editor`
   - 点击 `New Query`

3. **复制并运行 SQL**

   **选项 A**: 通过文件
   - 点击 `Upload File` 按钮
   - 选择文件: `dist/supabase/gradventure_seed.sql`
   - 点击 `Run` ▶️

   **选项 B**: 粘贴内容（如果文件不大）
   - 打开 `dist/supabase/gradventure_seed.sql`
   - 全选复制内容（Cmd+A, Cmd+C）
   - 粘贴到 SQL Editor
   - 点击 `Run` ▶️

4. **验证更新**

   运行以下查询检查：
   ```sql
   -- 检查卡牌数量
   SELECT COUNT(*) FROM cards;

   -- 应该返回: 37

   -- 检查时间推进值
   SELECT
     id,
     title,
     choices->'left'->'effect'->>'daysToAdvance' as left_days,
     choices->'right'->'effect'->>'daysToAdvance' as right_days
   FROM cards
   WHERE choices->'left'->'effect' ? 'daysToAdvance'
   ORDER BY id
   LIMIT 10;

   -- 应该看到 45-180 天的值
   ```

5. **测试线上版本**

   - 访问你的 Vercel 部署地址
   - 打开浏览器控制台（F12）
   - 点击 `START GAME`
   - 查看控制台日志：
     ```
     📦 Loading game catalog from source: supabase...
     ✅ Catalog loaded successfully: 37 cards
     ```
   - 玩一局，看看是否能到达 Year 3

### 方法 2: 使用 psql 命令行（高级）

如果你已经安装了 Supabase CLI：

```bash
# 1. 设置环境变量（从 Supabase Dashboard 获取）
export SUPABASE_URL="https://yowwscjmthbmcmidwsqr.supabase.co"
export SUPABASE_PASSWORD="your_database_password"

# 2. 运行 SQL 文件
psql "$SUPABASE_URL/postgres" -f dist/supabase/gradventure_seed.sql

# 3. 验证
psql "$SUPABASE_URL/postgres" -c "SELECT COUNT(*) FROM cards;"
```

### 方法 3: 使用 Supabase CLI（如果有）

```bash
# 1. 链接项目
supabase link --project-ref yowwscjmthbmcmidwsqr

# 2. 推送数据库
supabase db push dist/supabase/gradventure_seed.sql
```

## 🔍 验证更新是否成功

### 检查点 1: 卡牌数量

```sql
SELECT COUNT(*) as card_count FROM cards;
```

**期望结果**: `37`

### 检查点 2: 时间推进值

```sql
SELECT
  id,
  title,
  choices->'left'->'effect'->>'daysToAdvance' as left_days
FROM cards
WHERE id = 'timeline_start';
```

**期望结果**:
- `left_days`: `180` (三倍后的值)
- 如果还是 `60`，说明更新失败

### 检查点 3: 前端验证

1. 访问线上网站
2. 打开控制台
3. 开始游戏
4. 查看每回合推进的天数（应该在 90 天左右）

## ⚠️ 常见问题

### Q1: SQL Editor 报错 "relation does not exist"

**原因**: 表还没有创建

**解决**: 先运行 `schema.ts` 中的建表语句

```sql
-- 在 SQL Editor 中先运行这个
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  -- ... 其他字段
);
```

或者确保运行了完整的 SQL 文件（包含建表语句）。

### Q2: 运行后还是旧数据

**可能原因**: 浏览器缓存

**解决**:
1. 硬刷新网页（Cmd+Shift+R）
2. 或清除缓存后重新加载

### Q3: 速度太快/太慢

**原因**: 需要调整 daysToAdvance 倍数

**解决**:
1. 修改 `src/game/runtime/demoData.ts`
2. 重新导出 SQL
3. 再次运行更新

## 📊 更新内容摘要

### 修改的数据

**所有 37 张卡**的 `daysToAdvance` 都已更新：

| 卡类型 | 原始范围 | 新范围 | 倍数 |
|--------|---------|--------|------|
| Milestone | 15-30 天 | 45-180 天 | 3x |
| Dynamic | 5-10 天 | 15-30 天 | 3x |
| Recovery | 5-10 天 | 15-30 天 | 3x |
| Crisis | 3-7 天 | 9-21 天 | 3x |

### 体验目标

- **每张卡**: 7 秒阅读+决策时间
- **总卡数**: 9 张
- **游戏时长**: ~63 秒（1.05 分钟）
- **完成流程**: Year 1 → Year 2 → Year 3

## 🎯 更新后的游戏体验

**之前**（旧数据）:
- 平均 30 天/回合
- 需要 30+ 张卡
- 游戏时长 1.5-2 分钟

**现在**（新数据）:
- 平均 90 天/回合
- 需要 9 张卡
- 游戏时长 ~1 分钟 ✅

---

**准备好更新了吗？按照上面的步骤操作即可！** 🚀
