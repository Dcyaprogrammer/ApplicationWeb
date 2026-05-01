#!/usr/bin/env bun
/**
 * 估算完成 Year1-Year3 需要的卡牌数量
 */

const TARGET_DAYS = 1000;
const AVG_DAYS_PER_TURN = 34.2; // 从测试结果得出

// 估算不同场景
const scenarios = [
  {
    name: "全部 Milestone（最快）",
    avgDaysPerTurn: 50,
    milestoneRatio: 1.0,
    dynamicRatio: 0.0,
  },
  {
    name: "Milestone + Dynamic 混合（正常）",
    avgDaysPerTurn: 34.2,
    milestoneRatio: 0.4,
    dynamicRatio: 0.6,
  },
  {
    name: "更多 Dynamic 卡（慢速）",
    avgDaysPerTurn: 25,
    milestoneRatio: 0.2,
    dynamicRatio: 0.8,
  },
];

console.log("📊 完成 Year1-Year3 所需卡牌数量估算\n");
console.log(`目标天数: Day ${TARGET_DAYS}`);
console.log(`阶段划分:`);
console.log(`  Year1: Day 0-359`);
console.log(`  Year2: Day 360-719`);
console.log(`  Year3: Day 720-1000`);
console.log("");

scenarios.forEach(scenario => {
  const turns = Math.ceil(TARGET_DAYS / scenario.avgDaysPerTurn);
  const milestones = Math.ceil(turns * scenario.milestoneRatio);
  const dynamics = Math.ceil(turns * scenario.dynamicRatio);
  
  console.log(`\n${scenario.name}:`);
  console.log(`  总回合数: ${turns}`);
  console.log(`  Milestone 卡: ~${milestones} 张`);
  console.log(`  Dynamic 卡: ~${dynamics} 张`);
  console.log(`  游戏时长: ${turns * 3} 秒 (${(turns * 3 / 60).toFixed(1)} 分钟)`);
});

console.log("\n📝 详细分析:");
console.log("");
console.log("当前测试结果:");
console.log("  - 到达 Year2: 需要 10-14 回合");
console.log("  - 平均: 34.2 天/回合");
console.log("");
console.log("推算到 Year3 (Day 1000):");
const estimatedTurns = Math.ceil(TARGET_DAYS / AVG_DAYS_PER_TURN);
console.log(`  - 需要回合数: ${estimatedTurns}`);
console.log(`  - 游戏时长: ${estimatedTurns * 3} 秒 (${(estimatedTurns * 3 / 60).toFixed(1)} 分钟)`);
console.log("");
console.log("卡牌分配建议:");
console.log("  Year1 (Day 0-360):   ~8-10 张卡");
console.log("  Year2 (Day 360-720): ~10-12 张卡");
console.log("  Year3 (Day 720-1000): ~10-15 张卡");
console.log("  总计: ~28-37 张卡");

