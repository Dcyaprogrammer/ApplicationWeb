import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  SupabaseRuntimePersistence,
  createDemoGameRuntime,
} from "../game/runtime";
import { sanitizeEnvValue } from "../shared/env";

const url = sanitizeEnvValue(process.env.VITE_SUPABASE_URL);
const anonKey = sanitizeEnvValue(process.env.VITE_SUPABASE_ANON_KEY);

const main = async () => {
  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const runtime = createDemoGameRuntime();
  const initialState = runtime.initialize();
  const choice = Object.values(initialState.currentCard?.choices ?? {})[0];

  if (!choice) {
    throw new Error("Demo runtime did not produce an initial choice.");
  }

  const userId = `verification_${Date.now()}`;
  const persistence = new SupabaseRuntimePersistence(supabase, { userId });
  const snapshot = await persistence.createRun(initialState);
  const result = runtime.applyChoice(initialState, choice);
  const historyEntry = result.nextState.history[result.nextState.history.length - 1];

  try {
    if (!historyEntry) {
      throw new Error("Runtime did not produce a history entry.");
    }

    await persistence.appendHistory(snapshot.runId, historyEntry);
    await persistence.saveState(snapshot.runId, result.nextState);

    const [{ data: run, error: runError }, { count, error: historyError }] =
      await Promise.all([
        supabase
          .from("runs")
          .select("id, user_id, current_day, runtime_snapshot")
          .eq("id", snapshot.runId)
          .single(),
        supabase
          .from("run_card_history")
          .select("id", { count: "exact", head: true })
          .eq("run_id", snapshot.runId),
      ]);

    if (runError) throw runError;
    if (historyError) throw historyError;

    console.log("Supabase persistence check");
    console.log(
      JSON.stringify(
        {
          runId: snapshot.runId,
          userId: run.user_id,
          currentDay: run.current_day,
          historyRows: count ?? 0,
          hasRuntimeSnapshot: Boolean(run.runtime_snapshot),
        },
        null,
        2,
      ),
    );
  } finally {
    await supabase.from("run_card_history").delete().eq("run_id", snapshot.runId);
    await supabase.from("runs").delete().eq("id", snapshot.runId);
  }
};

main().catch((error) => {
  console.error("checkSupabasePersistence failed");
  console.error(error);
  process.exitCode = 1;
});
