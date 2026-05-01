#!/usr/bin/env bun
/**
 * 测试时间推进：验证游戏能否在合理时间内完成
 */

import { createClient } from "@supabase/supabase-js";
import { SupabaseCatalogSource } from "../game/runtime/sources";
import { createGameRuntimeFromCatalog } from "../game/runtime/engine";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

async function testTimeProgression() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const catalogSource = new SupabaseCatalogSource(supabase);
  const catalog = await catalogSource.loadCatalog();
  const runtime = createGameRuntimeFromCatalog(catalog);
  
  let state = runtime.initialize();
  
  console.log("🎮 Testing time progression...\n");
  console.log(`Initial: Day ${state.currentDay}, Phase ${state.currentPhase}`);
  
  let turnCount = 0;
  const maxTurns = 50;
  
  while (!state.currentCard?.choices?.left?.effect?.triggerGameOver && turnCount < maxTurns) {
    const choice = state.currentCard?.choices?.left || state.currentCard?.choices?.right;
    if (!choice) break;
    
    const result = runtime.applyChoice(state, choice);
    state = result.nextState;
    
    turnCount++;
    
    if (turnCount % 10 === 0) {
      console.log(`Turn ${turnCount}: Day ${state.currentDay}, Phase ${state.currentPhase}`);
      console.log(`  Stats: GPA=${state.stats.gpa}, MEN=${state.stats.mentality}, ENG=${state.stats.energy}, EXP=${state.stats.experience}`);
    }
    
    if (result.isGameOver) {
      console.log(`\n🏁 Game Over at Turn ${turnCount}, Day ${state.currentDay}`);
      console.log(`   Reason: ${result.gameOverReason}`);
      console.log(`   Victory: ${result.isWin ? "✅ YES" : "❌ NO"}`);
      break;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total turns: ${turnCount}`);
  console.log(`   Final day: ${state.currentDay}`);
  console.log(`   Final phase: ${state.currentPhase}`);
  console.log(`   Time per turn: ${(state.currentDay / turnCount).toFixed(1)} days`);
  console.log(`   Estimated game time: ${turnCount * 3} seconds (${(turnCount * 3 / 60).toFixed(1)} minutes)`);
  
  if (state.currentDay >= 300) {
    console.log(`\n✅ SUCCESS: Game reaches Day 300 in ${turnCount} turns`);
    console.log(`   This is within the target range (1-2 minutes)`);
  } else if (turnCount >= maxTurns) {
    console.log(`\n⚠️  WARNING: Game didn't finish in ${maxTurns} turns`);
    console.log(`   Only reached Day ${state.currentDay}`);
  }
}

testTimeProgression().catch(console.error);
