/**
 * 使用 Supabase 数据测试完整游戏流程
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { SupabaseCatalogSource } from "../game/runtime/sources";
import { createGameRuntimeFromCatalog } from "../game/runtime/engine";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

async function testFullGame() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const catalogSource = new SupabaseCatalogSource(supabase);
  const catalog = await catalogSource.loadCatalog();
  const runtime = createGameRuntimeFromCatalog(catalog);
  
  let state = runtime.initialize();
  
  console.log("🎮 Testing FULL GAME with Supabase data\n");
  console.log(`Initial: Day ${state.currentDay}, Phase ${state.currentPhase}`);
  console.log(`Cards in catalog: ${catalog.cards.length}`);
  
  let turnCount = 0;
  const maxTurns = 20;
  
  while (!state.currentCard?.choices?.left?.effect?.triggerGameOver && turnCount < maxTurns) {
    const choice = state.currentCard?.choices?.left || state.currentCard?.choices?.right;
    if (!choice) break;
    
    const days = state.currentCard.choices.left.effect.daysToAdvance || 
                  state.currentCard.choices.right.effect.daysToAdvance || 0;
    
    const result = runtime.applyChoice(state, choice);
    state = result.nextState;
    
    turnCount++;
    
    console.log(`Turn ${turnCount}: Day ${state.currentDay} (+${days} days), Phase ${state.currentPhase}`);
    console.log(`  Card: ${state.currentCard.id}`);
    console.log(`  Stats: GPA=${state.stats.gpa}, MEN=${state.stats.mentality}, ENG=${state.stats.energy}, EXP=${state.stats.experience}`);
    
    if (result.isGameOver) {
      console.log(`\n🏁 Game Over at Turn ${turnCount}, Day ${state.currentDay}`);
      console.log(`   Reason: ${result.gameOverReason}`);
      console.log(`   Victory: ${result.isWin ? "✅ YES" : "❌ NO"}`);
      break;
    }
  }
  
  console.log(`\n📊 Final Summary:`);
  console.log(`   Total turns: ${turnCount}`);
  console.log(`   Final day: ${state.currentDay}`);
  console.log(`   Final phase: ${state.currentPhase}`);
  console.log(`   Avg days/turn: ${(state.currentDay / turnCount).toFixed(1)}`);
  console.log(`   Game time: ${turnCount * 7} seconds (${(turnCount * 7 / 60).toFixed(1)} minutes)`);
  
  if (state.currentDay >= 1000) {
    console.log(`\n✅ SUCCESS: Completed full Year 1-2-3 journey!`);
    console.log(`   Perfect for 7s per card experience!`);
  }
}

testFullGame().catch(console.error);
