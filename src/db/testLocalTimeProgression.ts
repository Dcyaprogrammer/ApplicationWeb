#!/usr/bin/env bun
/**
 * 测试本地数据的时间推进
 */

import { createDemoGameRuntime } from "../game/runtime/engine";

async function testLocalTimeProgression() {
  const runtime = createDemoGameRuntime();
  let state = runtime.initialize();
  
  console.log("🎮 Testing LOCAL data time progression...\n");
  console.log(`Initial: Day ${state.currentDay}, Phase ${state.currentPhase}`);
  
  let turnCount = 0;
  const maxTurns = 50;
  
  while (!state.currentCard?.choices?.left?.effect?.triggerGameOver && turnCount < maxTurns) {
    const choice = state.currentCard?.choices?.left || state.currentCard?.choices?.right;
    if (!choice) break;
    
    // 获取 daysToAdvance
    const days = state.currentCard.choices.left.effect.daysToAdvance || 
                  state.currentCard.choices.right.effect.daysToAdvance || 0;
    
    const result = runtime.applyChoice(state, choice);
    state = result.nextState;
    
    turnCount++;
    
    if (turnCount % 5 === 0) {
      console.log(`Turn ${turnCount}: Day ${state.currentDay} (+${days}), Phase ${state.currentPhase}`);
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
  if (turnCount > 0) {
    console.log(`   Time per turn: ${(state.currentDay / turnCount).toFixed(1)} days`);
    console.log(`   Estimated game time: ${turnCount * 3} seconds (${(turnCount * 3 / 60).toFixed(1)} minutes)`);
  }
  
  if (state.currentDay >= 1000) {
    console.log(`\n✅ SUCCESS: Completed Year 1-2-3 in ${turnCount} turns!`);
  } else if (state.currentDay >= 720) {
    console.log(`\n✅ Reached Year 3 at Day ${state.currentDay}`);
  } else if (state.currentDay >= 360) {
    console.log(`\n⚠️  Reached Year 2 at Day ${state.currentDay}, but not Year 3`);
  } else {
    console.log(`\n❌ Still in Year 1 at Day ${state.currentDay}`);
  }
}

testLocalTimeProgression().catch(console.error);
