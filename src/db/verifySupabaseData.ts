#!/usr/bin/env bun
/**
 * 验证 Supabase 数据是否已更新到最新版本
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

async function verifySupabaseData() {
  console.log("🔍 Verifying Supabase data...\n");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 检查 1: 卡牌数量
  console.log("📊 Check 1: Card count");
  const { count, error: countError } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });

  if (countError) {
    console.error("❌ Failed to fetch cards:", countError);
    return;
  }

  console.log(`   Cards: ${count}`);
  if (count === 37) {
    console.log("   ✅ Correct!");
  } else {
    console.log(`   ⚠️  Expected 37, got ${count}`);
  }

  // 检查 2: 时间推进值（抽样检查）
  console.log("\n⏱️  Check 2: Time progression values");

  const { data: sampleCards, error: cardsError } = await supabase
    .from("cards")
    .select("id, title, choices")
    .in("id", ["timeline_start", "dynamic_deadline_tracker", "decision_day"]);

  if (cardsError) {
    console.error("❌ Failed to fetch sample cards:", cardsError);
    return;
  }

  let allCorrect = true;

  for (const card of sampleCards || []) {
    const leftDays = card.choices?.left?.effect?.daysToAdvance;
    const rightDays = card.choices?.right?.effect?.daysToAdvance;

    if (leftDays !== undefined) {
      console.log(`   ${card.id}:`);
      console.log(`     Left: ${leftDays} days`);
      console.log(`     Right: ${rightDays} days`);

      // 检查是否是三倍后的值
      if (card.id === "timeline_start" && leftDays === 180) {
        console.log(`     ✅ Correct (tripled from 60)`);
      } else if (card.id === "dynamic_deadline_tracker" && leftDays >= 15) {
        console.log(`     ✅ Correct (tripled from 5)`);
      } else if (leftDays < 40) {
        console.log(`     ⚠️  Seems too low (might be old data)`);
        allCorrect = false;
      }
    }
  }

  // 检查 3: 计算平均值
  console.log("\n📈 Check 3: Average days per turn");

  const { data: allCards, error: allError } = await supabase
    .from("cards")
    .select("choices");

  if (allError) {
    console.error("❌ Failed to fetch all cards:", allError);
    return;
  }

  let totalDays = 0;
  let choiceCount = 0;

  for (const card of allCards || []) {
    const leftDays = card.choices?.left?.effect?.daysToAdvance;
    const rightDays = card.choices?.right?.effect?.daysToAdvance;

    if (leftDays) totalDays += leftDays;
    if (rightDays) totalDays += rightDays;
    choiceCount += 2;
  }

  const avgDays = totalDays / choiceCount;

  console.log(`   Average: ${avgDays.toFixed(1)} days/turn`);
  console.log(`   Expected: ~90 days/turn (tripled from ~30)`);

  if (avgDays >= 80 && avgDays <= 100) {
    console.log(`   ✅ Perfect!`);
  } else if (avgDays >= 30 && avgDays <= 40) {
    console.log(`   ❌ Too low! This is OLD data (not yet updated)`);
    allCorrect = false;
  } else {
    console.log(`   ⚠️  Unexpected value`);
  }

  // 总结
  console.log("\n" + "=".repeat(50));
  if (allCorrect) {
    console.log("✅ Supabase data is UP TO DATE!");
    console.log("✅ Ready to deploy to production");
  } else {
    console.log("❌ Supabase data is OUTDATED");
    console.log("❌ Please run the SQL update:");
    console.log("   1. Open dist/supabase/gradventure_seed.sql");
    console.log("   2. Copy the content");
    console.log("   3. Go to Supabase Dashboard → SQL Editor");
    console.log("   4. Paste and Run");
  }
  console.log("=".repeat(50));
}

verifySupabaseData().catch(console.error);
