/**
 * 测试从 Supabase 读取卡牌并进行一局游戏的完整 pipeline
 */

import { createClient } from "@supabase/supabase-js";
import { SupabaseCatalogSource } from "../game/runtime/sources";
import { createGameRuntimeFromCatalog } from "../game/runtime/engine";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Missing Supabase credentials in .env");
  console.error("Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

console.log("🔗 Connecting to Supabase:", SUPABASE_URL);

async function testSupabasePipeline() {
  const startTime = Date.now();

  try {
    // Step 1: Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase client created");

    // Step 2: Load catalog from Supabase
    console.log("\n📦 Loading catalog from Supabase...");
    const catalogSource = new SupabaseCatalogSource(supabase);
    const catalog = await catalogSource.loadCatalog();

    console.log(`✅ Catalog loaded: ${catalog.cards.length} cards`);
    console.log(`   Start card: ${catalog.startCardId}`);

    // Step 3: Create game runtime
    console.log("\n🎮 Creating game runtime...");
    const runtime = createGameRuntimeFromCatalog(catalog);
    console.log("✅ Runtime created");

    // Step 4: Initialize game state
    console.log("\n🎲 Initializing game...");
    const initialState = runtime.initialize();

    console.log("✅ Game initialized!");
    console.log(`   Current card: ${initialState.currentCard?.id}`);
    console.log(`   Stats:`, initialState.stats);
    console.log(`   Phase: ${initialState.currentPhase}`);
    console.log(`   Pressure: ${initialState.pressure}`);

    // Step 5: Simulate a few turns
    console.log("\n🎯 Simulating 3 turns...");
    let state = initialState;

    for (let i = 0; i < 3; i++) {
      if (!state.currentCard) {
        console.log("⚠️  No current card, stopping simulation");
        break;
      }

      console.log(`\n--- Turn ${i + 1} ---`);
      console.log(`Card: ${state.currentCard.id}`);
      console.log(`Text: ${state.currentCard.text.substring(0, 50)}...`);

      // Pick left choice
      const choice = state.currentCard.choices.left;
      console.log(`Choice: ${choice.label}`);

      const result = runtime.applyChoice(state, choice);
      console.log(`Result: ${result.feedbackMessage || "No feedback"}`);
      console.log(`Stats after:`, result.nextState.stats);

      state = result.nextState;

      if (result.isGameOver) {
        console.log(`\n🏁 Game Over: ${result.gameOverReason}`);
        break;
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`\n✨ Pipeline test completed in ${elapsed}ms`);
    console.log("\n📊 Final State:");
    console.log(`   Total turns: ${state.turnIndex}`);
    console.log(`   Cards seen: ${state.seenCardIds.length}`);
    console.log(`   Knowledge coverage: ${state.knowledgeCoverage.length} tags`);
    console.log(`   Game over: ${state.currentCard === null}`);

    return true;

  } catch (error) {
    console.error("\n❌ Pipeline test failed:");
    console.error(error);
    return false;
  }
}

// Run the test
testSupabasePipeline().then(success => {
  process.exit(success ? 0 : 1);
});
