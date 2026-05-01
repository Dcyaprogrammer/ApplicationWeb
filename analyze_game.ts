#!/usr/bin/env bun
/**
 * 分析游戏的重玩价值和知识密度
 */

import { DEMO_DYNAMIC_CARDS, DEMO_MAIN_DECK, DEMO_SPECIAL_EVENTS } from "./src/game/runtime/demoData";

const allCards = [...DEMO_MAIN_DECK, ...DEMO_DYNAMIC_CARDS, ...DEMO_SPECIAL_EVENTS];

console.log("📊 游戏分析报告\n");
console.log("=".repeat(60));

// 1. 基础统计
console.log("\n📈 基础统计:");
console.log(`   总卡牌数: ${allCards.length}`);
console.log(`   每局卡数: ~9 张`);
console.log(`   理论最多局数: ${Math.ceil(allCards.length / 9)} 局（假设不重复）`);

// 2. 路线分析
console.log("\n🛤️ 路线分析:");
const agencyCards = allCards.filter(c => c.meta?.routeTags?.includes('agency'));
const diyCards = allCards.filter(c => c.meta?.routeTags?.includes('diy'));
const commonCards = allCards.filter(c => !c.meta?.routeTags || c.meta?.routeTags?.length === 0);

console.log(`   Agency 路线专属卡: ${agencyCards.length} 张`);
console.log(`   DIY 路线专属卡: ${diyCards.length} 张`);
console.log(`   通用卡: ${commonCards.length} 张`);
console.log(`   路线重叠度: ${(commonCards.length / allCards.length * 100).toFixed(1)}%`);

// 3. Educational tags 分析
console.log("\n📚 知识点分析:");
const allTags = new Set<string>();
const tagCounts = new Map<string, number>();

allCards.forEach(card => {
  const tags = card.meta?.educationalTags || [];
  tags.forEach(tag => {
    allTags.add(tag);
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  });
});

console.log(`   总知识点数: ${allTags.size}`);
console.log(`   平均每张卡: ${(allTags.size / allCards.length).toFixed(2)} 个知识点`);
console.log(`   每局覆盖: ${(allTags.size / 9).toFixed(2)} 个知识点（9张卡）`);

// 显示主要知识点
const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log("\n   最常见的知识点:");
sortedTags.forEach(([tag, count]) => {
  console.log(`     - ${tag}: ${count} 张卡`);
});

// 4. 卡牌类型分布
console.log("\n🎴 卡牌类型分布:");
const typeCounts = new Map<string, number>();
allCards.forEach(card => {
  const type = card.meta?.cardType || "unknown";
  typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
});

typeCounts.forEach((count, type) => {
  console.log(`   ${type}: ${count} 张 (${(count / allCards.length * 100).toFixed(1)}%)`);
});

// 5. 阶段分布
console.log("\n📅 阶段分布:");
const phaseCounts = new Map<string, number>();
allCards.forEach(card => {
  phaseCounts.set(card.phase, (phaseCounts.get(card.phase) || 0) + 1);
});

phaseCounts.forEach((count, phase) => {
  console.log(`   ${phase}: ${count} 张`);
});

// 6. 决策深度
console.log("\n🎯 决策深度分析:");
let hasConsequences = 0;
let hasFlags = 0;
let hasNextCard = 0;

allCards.forEach(card => {
  Object.values(card.choices).forEach(choice => {
    if (choice.effect.addFlags?.length || choice.effect.removeFlags?.length) {
      hasFlags++;
    }
    if (choice.nextCardId) {
      hasNextCard++;
    }
  });
});

console.log(`   有后果的决策（flags）: ${hasFlags} 个`);
console.log(`   有后续卡: ${hasNextCard} 个`);
console.log(`   决策复杂度: ${hasFlags > 0 || hasNextCard > 0 ? "中等" : "简单"}`);

