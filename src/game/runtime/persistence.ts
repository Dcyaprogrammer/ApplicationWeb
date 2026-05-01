import type { SupabaseClient } from "@supabase/supabase-js";
import type { GameCardCatalog, RunHistoryEntry, RuntimeState } from "./types";
import {
  deserializeRunState,
  serializeRunHistoryEntry,
  serializeRunState,
  type StoredRunRecord,
} from "./runStorage";

export interface RunSnapshot {
  runId: string;
  state: RuntimeState;
}

export interface RuntimePersistence {
  createRun(initialState: RuntimeState): Promise<RunSnapshot>;
  loadLatestRun(): Promise<RunSnapshot | null>;
  saveState(runId: string, state: RuntimeState): Promise<void>;
  appendHistory(runId: string, entry: RunHistoryEntry): Promise<void>;
}

export interface CatalogSource {
  loadCatalog(): Promise<GameCardCatalog>;
}

export class NoopRuntimePersistence implements RuntimePersistence {
  async createRun(initialState: RuntimeState): Promise<RunSnapshot> {
    return {
      runId: "local-demo-run",
      state: initialState,
    };
  }

  async loadLatestRun(): Promise<RunSnapshot | null> {
    return null;
  }

  async saveState(): Promise<void> {}

  async appendHistory(): Promise<void> {}
}

const RUN_STATE_KEY = "gradventure:latest-run";
const RUN_HISTORY_KEY_PREFIX = "gradventure:run-history:";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const createRunId = () => `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export class LocalStorageRuntimePersistence implements RuntimePersistence {
  async createRun(initialState: RuntimeState): Promise<RunSnapshot> {
    const snapshot = {
      runId: createRunId(),
      state: initialState,
    };

    await this.saveSnapshot(snapshot);
    return snapshot;
  }

  async loadLatestRun(): Promise<RunSnapshot | null> {
    if (!canUseStorage()) {
      return null;
    }

    const raw = window.localStorage.getItem(RUN_STATE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as RunSnapshot;
    } catch {
      return null;
    }
  }

  async saveState(runId: string, state: RuntimeState): Promise<void> {
    await this.saveSnapshot({ runId, state });
  }

  async appendHistory(runId: string, entry: RunHistoryEntry): Promise<void> {
    if (!canUseStorage()) {
      return;
    }

    const key = `${RUN_HISTORY_KEY_PREFIX}${runId}`;
    const raw = window.localStorage.getItem(key);
    const history = raw ? ((JSON.parse(raw) as RunHistoryEntry[]) ?? []) : [];
    history.push(entry);
    window.localStorage.setItem(key, JSON.stringify(history));
  }

  private async saveSnapshot(snapshot: RunSnapshot): Promise<void> {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(RUN_STATE_KEY, JSON.stringify(snapshot));
    window.localStorage.setItem(
      `${RUN_HISTORY_KEY_PREFIX}${snapshot.runId}`,
      JSON.stringify(snapshot.state.history),
    );
  }
}

interface SupabaseRuntimePersistenceOptions {
  runsTable?: string;
  runHistoryTable?: string;
}

export class SupabaseRuntimePersistence implements RuntimePersistence {
  private readonly client: SupabaseClient;
  private readonly runsTable: string;
  private readonly runHistoryTable: string;

  constructor(
    client: SupabaseClient,
    options: SupabaseRuntimePersistenceOptions = {},
  ) {
    this.client = client;
    this.runsTable = options.runsTable ?? "runs";
    this.runHistoryTable = options.runHistoryTable ?? "run_card_history";
  }

  async createRun(initialState: RuntimeState): Promise<RunSnapshot> {
    const record = serializeRunState("", initialState, "active");
    delete record.id;

    const { data, error } = await this.client
      .from(this.runsTable)
      .insert(record)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return {
      runId: (data as StoredRunRecord).id ?? "unknown-run",
      state: deserializeRunState(data as StoredRunRecord),
    };
  }

  async loadLatestRun(): Promise<RunSnapshot | null> {
    const { data, error } = await this.client
      .from(this.runsTable)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const record = data as StoredRunRecord;
    return {
      runId: record.id ?? "unknown-run",
      state: deserializeRunState(record),
    };
  }

  async saveState(runId: string, state: RuntimeState): Promise<void> {
    const record = serializeRunState(runId, state, "active");

    const { error } = await this.client
      .from(this.runsTable)
      .update(record)
      .eq("id", runId);

    if (error) {
      throw error;
    }
  }

  async appendHistory(runId: string, entry: RunHistoryEntry): Promise<void> {
    const record = serializeRunHistoryEntry(runId, entry);
    const { error } = await this.client.from(this.runHistoryTable).insert(record);

    if (error) {
      throw error;
    }
  }
}
