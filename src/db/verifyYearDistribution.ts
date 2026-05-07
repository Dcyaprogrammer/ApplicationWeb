/**
 * 验证 Supabase 年份分布
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

async function verifyYearDistribution() {
  console.log("🔍 Verifying Year Distribution...\n");

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. 总卡牌数
  const { count } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });
  console.log(`📊 Total cards: ${count}`);

  // 2. 年份分布
  const { data: yearData } = await supabase
    .from("cards")
    .select("phase")
    .order("phase");

  const yearCounts = yearData?.reduce((acc, card) => {
    acc[card.phase] = (acc[card.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📅 Year Distribution:");
  console.log(`   Year 1: ${yearCounts?.year1 || 0} cards`);
  console.log(`   Year 2: ${yearCounts?.year2 || 0} cards`);
  console.log(`   Year 3: ${yearCounts?.year3 || 0} cards`);

  // 3. 路线专属卡牌
  const { data: routeData } = await supabase
    .from("cards")
    .select("id, meta")
    .not("meta", "is", null);

  let agencyCount = 0;
  let diyCount = 0;
  let commonCount = 0;

  routeData?.forEach((card) => {
    const routeTags = card.meta?.routeTags;
    if (routeTags?.includes("agency")) {
      agencyCount++;
    } else if (routeTags?.includes("diy")) {
      diyCount++;
    } else {
      commonCount++;
    }
  });

  console.log("\n🛤️ Route Distribution:");
  console.log(`   Agency: ${agencyCount} cards`);
  console.log(`   DIY: ${diyCount} cards`);
  console.log(`   Common: ${commonCount} cards`);
  console.log(`   Overlap: ${(commonCount / (count || 1) * 100).toFixed(1)}%`);

  // 4. Sample Year 2 cards
  console.log("\n📚 Sample Year 2 Cards:");
  const { data: y2Cards } = await supabase
    .from("cards")
    .select("id, title")
    .eq("phase", "year2")
    .limit(5);

  y2Cards?.forEach(card => {
    console.log(`   - ${card.id}: ${card.title}`);
  });

  // 5. Sample Year 3 cards
  console.log("\n📚 Sample Year 3 Cards:");
  const { data: y3Cards } = await supabase
    .from("cards")
    .select("id, title")
    .eq("phase", "year3")
    .limit(5);

  y3Cards?.forEach(card => {
    console.log(`   - ${card.id}: ${card.title}`);
  });

  // 验证结果
  console.log("\n" + "=".repeat(50));
  const hasYear2 = (yearCounts?.year2 || 0) > 10;
  const hasYear3 = (yearCounts?.year3 || 0) > 10;

  if (count === 80 && hasYear2 && hasYear3) {
    console.log("✅ Supabase update SUCCESSFUL!");
    console.log("✅ All 80 cards uploaded");
    console.log("✅ Year 2 content present");
    console.log("✅ Year 3 content present");
    console.log("\n🚀 Ready to commit and push!");
  } else {
    console.log("❌ Supabase update may have issues");
  }
  console.log("=".repeat(50));
}

verifyYearDistribution().catch(console.error);
