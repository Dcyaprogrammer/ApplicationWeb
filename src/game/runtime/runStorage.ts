import type { RunHistoryEntry, RuntimeState } from "./types";

export interface StoredRunRecord {
  id?: string;
  user_id?: string | null;
  seed?: string | null;
  status: "active" | "won" | "lost" | "abandoned";
  current_phase: string;
  current_day: number;
  route: string;
  stats_snapshot: RuntimeState["stats"];
  flags: string[];
  pressure: number;
  runtime_snapshot: RuntimeState;
}

export interface StoredRunHistoryRecord {
  id?: string;
  run_id: string;
  card_id: string;
  turn_index: number;
  choice_id: string;
  stats_before: RunHistoryEntry["statsBefore"];
  stats_after: RunHistoryEntry["statsAfter"];
  pressure_before: number;
  pressure_after: number;
  flags_before: string[];
  flags_after: string[];
}

export const serializeRunState = (
  runId: string,
  state: RuntimeState,
  status: StoredRunRecord["status"] = "active",
): StoredRunRecord => ({
  id: runId,
  status,
  current_phase: state.currentPhase,
  current_day: state.currentDay,
  route: state.currentRoute,
  stats_snapshot: state.stats,
  flags: state.flags,
  pressure: state.pressure,
  runtime_snapshot: state,
});

export const deserializeRunState = (record: StoredRunRecord): RuntimeState => {
  if (record.runtime_snapshot) {
    return record.runtime_snapshot;
  }

  throw new Error("Stored run record is missing runtime_snapshot");
};

export const serializeRunHistoryEntry = (
  runId: string,
  entry: RunHistoryEntry,
): StoredRunHistoryRecord => ({
  run_id: runId,
  card_id: entry.cardId,
  turn_index: entry.turnIndex,
  choice_id: entry.choiceId,
  stats_before: entry.statsBefore,
  stats_after: entry.statsAfter,
  pressure_before: entry.pressureBefore,
  pressure_after: entry.pressureAfter,
  flags_before: entry.flagsBefore,
  flags_after: entry.flagsAfter,
});
