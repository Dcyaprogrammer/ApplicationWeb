#!/usr/bin/env bun
/**
 * Test full game flow with local Year 2/Year 3 content
 */

import { demoGameCatalog } from "../game/runtime/demoData";
import { createGameRuntimeFromCatalog } from "../game/runtime/engine";

const runtime = createGameRuntimeFromCatalog(demoGameCatalog);
let state = runtime.initialize();

console.log("🎮 Testing FULL GAME with local data (Year 2/Year 3 content)\n");
console.log(`Initial: Day ${state.currentDay}, Phase ${state.currentPhase}`);
console.log(`Cards in catalog: ${demoGameCatalog.cards.length}`);

let turnCount = 0;
const maxTurns = 15;

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
  console.log(`   🎓 All three years experienced!`);
} else if (state.currentDay >= 720) {
  console.log(`\n⚠️  PARTIAL: Reached Year 3 but didn't complete`);
} else if (state.currentDay >= 360) {
  console.log(`\n⚠️  PARTIAL: Reached Year 2 but not Year 3`);
} else {
  console.log(`\n❌ ISSUE: Did not progress past Year 1`);
}
