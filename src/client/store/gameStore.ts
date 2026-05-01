import { create } from "zustand";
import type { CardChoice, StressLevel } from "../../types/card";
import type { Phase, StatKey, Stats } from "../../types/game";
import {
  createDemoGameRuntime,
  createGameRuntimeFromCatalog,
  DemoCatalogSource,
  getFormattedDate,
  INITIAL_STATS,
  LocalStorageRuntimePersistence,
  LocalStorageCatalogSource,
  SupabaseCatalogSource,
  type RuntimeCard,
  type RuntimeState,
} from "../../game/runtime";
import { sanitizeEnvValue } from "../../shared/env";
import { supabase } from "../utils/supabase";

interface GameState {
  stats: Stats;
  currentDay: number;
  currentPhase: Phase;
  runId: string | null;
  catalogSource: "demo" | "local" | "supabase";
  catalogCardCount: number;
  catalogLoadError: string | null;
  currency: number;
  hasSeenTutorial: boolean;
  deck: RuntimeCard[];
  currentCard: RuntimeCard | null;
  queuedCardId: string | null;
  cardsUntilQueuedCard: number;
  activeStressLevel: StressLevel;
  feedbackMessage: string | null;
  flags: string[];
  pressure: number;
  seenCardIds: string[];
  recentCardIds: string[];
  recentCategories: RuntimeCard["category"][];
  currentRoute: RuntimeState["currentRoute"];
  turnIndex: number;
  history: RuntimeState["history"];
  cooldowns: RuntimeState["cooldowns"];
  knowledgeCoverage: string[];
  isGameOver: boolean;
  gameOverReason: string | null;
  isWin: boolean;
  initializeGame: () => Promise<void>;
  makeChoice: (choice: CardChoice) => void;
  drawNextCard: () => void;
  applyStatChanges: (delta: Partial<Record<StatKey, number>>) => void;
  clearFeedback: () => void;
  spendCurrency: (amount: number) => boolean;
  completeTutorial: () => void;
  restoreLatestRun: () => Promise<boolean>;
}

const persistence = new LocalStorageRuntimePersistence();

const resolveCatalogSource = () => {
  const source = sanitizeEnvValue(import.meta.env.VITE_GAME_CATALOG_SOURCE) || "auto";
  const hasSupabaseConfig =
    Boolean(sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL)) &&
    Boolean(sanitizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY));

  if (source === "supabase") {
    return {
      sourceName: "supabase" as const,
      source: new SupabaseCatalogSource(supabase),
    };
  }

  if (source === "local") {
    return {
      sourceName: "local" as const,
      source: new LocalStorageCatalogSource(),
    };
  }

  if (source === "auto" && hasSupabaseConfig) {
    return {
      sourceName: "supabase" as const,
      source: new SupabaseCatalogSource(supabase),
    };
  }

  return {
    sourceName: "demo" as const,
    source: new DemoCatalogSource(),
  };
};

let runtime = createDemoGameRuntime();

const toStoreState = (state: RuntimeState) => ({
  stats: state.stats,
  currentDay: state.currentDay,
  currentPhase: state.currentPhase,
  runId: null,
  catalogSource: "demo" as const,
  catalogCardCount: state.deck.length + (state.currentCard ? 1 : 0),
  catalogLoadError: null,
  deck: state.deck,
  currentCard: state.currentCard,
  queuedCardId: state.queuedCardId,
  cardsUntilQueuedCard: state.cardsUntilQueuedCard,
  activeStressLevel: state.activeStressLevel,
  flags: state.flags,
  pressure: state.pressure,
  seenCardIds: state.seenCardIds,
  recentCardIds: state.recentCardIds,
  recentCategories: state.recentCategories,
  currentRoute: state.currentRoute,
  turnIndex: state.turnIndex,
  history: state.history,
  cooldowns: state.cooldowns,
  knowledgeCoverage: state.knowledgeCoverage,
});

export { getFormattedDate };

export const useGameStore = create<GameState>((set, get) => ({
  stats: { ...INITIAL_STATS },
  currentDay: 0,
  currentPhase: "year1",
  runId: null,
  catalogSource: "demo",
  catalogCardCount: 0,
  catalogLoadError: null,
  currency: 100,
  hasSeenTutorial: false,
  deck: [],
  currentCard: null,
  queuedCardId: null,
  cardsUntilQueuedCard: 0,
  activeStressLevel: "grind",
  feedbackMessage: null,
  flags: [],
  pressure: 0,
  seenCardIds: [],
  recentCardIds: [],
  recentCategories: [],
  currentRoute: "undecided",
  turnIndex: 0,
  history: [],
  cooldowns: {},
  knowledgeCoverage: [],
  isGameOver: false,
  gameOverReason: null,
  isWin: false,

  initializeGame: async () => {
    let sourceName: "demo" | "local" | "supabase" = "demo";
    let catalogLoadError: string | null = null;

    try {
      const resolved = resolveCatalogSource();
      sourceName = resolved.sourceName;

      console.log(`📦 Loading game catalog from source: ${sourceName}...`);
      const catalog = await resolved.source.loadCatalog();
      console.log(`✅ Catalog loaded successfully: ${catalog.cards.length} cards`);
      console.log(`   Start card: ${catalog.startCardId}`);

      runtime = createGameRuntimeFromCatalog(catalog);
    } catch (error) {
      console.error("❌ Failed to load configured catalog source, falling back to demo catalog.", error);
      runtime = createDemoGameRuntime();
      sourceName = "demo";
      catalogLoadError = error instanceof Error ? error.message : String(error);
    }

    const initialState = runtime.initialize();

    console.log(`🎮 Game initialized with ${sourceName} source`);
    console.log(`   Initial card: ${initialState.currentCard?.id}`);
    console.log(`   Stats:`, initialState.stats);

    set({
      ...toStoreState(initialState),
      catalogSource: sourceName,
      catalogCardCount: initialState.deck.length + (initialState.currentCard ? 1 : 0),
      catalogLoadError,
      stats: { ...INITIAL_STATS },
      currentDay: 0,
      currentPhase: initialState.currentPhase,
      feedbackMessage: null,
      isGameOver: false,
      gameOverReason: null,
      isWin: false,
      hasSeenTutorial: false,
    });

    void persistence.createRun(initialState).then((snapshot) => {
      set({ runId: snapshot.runId });
    });
  },

  makeChoice: (choice: CardChoice) => {
    const state: RuntimeState = {
      stats: get().stats,
      currentDay: get().currentDay,
      currentPhase: get().currentPhase,
      currentCard: get().currentCard,
      deck: get().deck,
      queuedCardId: get().queuedCardId,
      cardsUntilQueuedCard: get().cardsUntilQueuedCard,
      currentRoute: get().currentRoute,
      activeStressLevel: get().activeStressLevel,
      flags: get().flags,
      pressure: get().pressure,
      seenCardIds: get().seenCardIds,
      recentCardIds: get().recentCardIds,
      recentCategories: get().recentCategories,
      turnIndex: get().turnIndex,
      history: get().history,
      cooldowns: get().cooldowns,
      knowledgeCoverage: get().knowledgeCoverage,
    };

    const result = runtime.applyChoice(state, choice);

    set((current) => ({
      ...toStoreState(result.nextState),
      runId: current.runId,
      catalogSource: current.catalogSource,
      catalogCardCount: current.catalogCardCount,
      catalogLoadError: current.catalogLoadError,
      feedbackMessage: result.feedbackMessage,
      isGameOver: result.isGameOver,
      gameOverReason: result.gameOverReason,
      isWin: result.isWin,
      currency: current.currency + result.currencyAward,
    }));

    const runId = get().runId;
    if (runId) {
      const latestEntry = result.nextState.history[result.nextState.history.length - 1];
      if (latestEntry) {
        void persistence.appendHistory(runId, latestEntry);
      }
      void persistence.saveState(runId, result.nextState);
    }
  },

  drawNextCard: () => {
    // Runtime progression is now driven through makeChoice.
  },

  applyStatChanges: (delta) => {
    set((state) => {
      const nextStats = { ...state.stats };

      for (const [key, amount] of Object.entries(delta)) {
        if (amount === undefined) {
          continue;
        }

        const statKey = key as StatKey;
        nextStats[statKey] = Math.max(0, Math.min(100, nextStats[statKey] + amount));
      }

      return { stats: nextStats };
    });
  },

  clearFeedback: () => {
    set({ feedbackMessage: null });
  },

  spendCurrency: (amount: number) => {
    const current = get().currency;
    if (current < amount) {
      return false;
    }

    set({ currency: current - amount });
    return true;
  },

  completeTutorial: () => set({ hasSeenTutorial: true }),

  restoreLatestRun: async () => {
    const snapshot = await persistence.loadLatestRun();
    if (!snapshot) {
      return false;
    }

    set({
      ...toStoreState(snapshot.state),
      runId: snapshot.runId,
      catalogSource: get().catalogSource,
      catalogCardCount: get().catalogCardCount,
      catalogLoadError: get().catalogLoadError,
      feedbackMessage: null,
      isGameOver: false,
      gameOverReason: null,
      isWin: false,
    });

    return true;
  },
}));
