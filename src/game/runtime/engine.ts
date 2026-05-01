import type { CardChoice } from "../../types/card";
import { Phase } from "../../types/game";
import { demoGameCatalog } from "./demoData";
import { drawNextRuntimeCard } from "./director";
import {
  INITIAL_STATS,
  cloneDeck,
  derivePressure,
  inferRouteFromFlags,
  mergeUnique,
} from "./helpers";
import { InMemoryGameRepository, type GameRepository } from "./repository";
import { resolveChoiceEffects } from "./reducer";
import type { RunHistoryEntry, RuntimeState } from "./types";

export interface GameRuntime {
  initialize(): RuntimeState;
  applyChoice(state: RuntimeState, choice: CardChoice): {
    nextState: RuntimeState;
    feedbackMessage: string | null;
    isGameOver: boolean;
    gameOverReason: string | null;
    isWin: boolean;
    currencyAward: number;
  };
}

export class DemoGameRuntime implements GameRuntime {
  private readonly repository: GameRepository;

  constructor(repository: GameRepository) {
    this.repository = repository;
  }

  initialize(): RuntimeState {
    const startCard = this.repository.getStartCard();
    const deck = cloneDeck(this.repository.listRegularCards());

    return {
      stats: { ...INITIAL_STATS },
      currentDay: 0,
      currentPhase: Phase.Year1,
      currentRoute: "undecided",
      currentCard: startCard,
      deck,
      queuedCardId: null,
      cardsUntilQueuedCard: 0,
      activeStressLevel: startCard.stressLevel ?? "grind",
      flags: [],
      seenCardIds: [startCard.id],
      recentCardIds: [startCard.id],
      recentCategories: [startCard.category],
      pressure: derivePressure(INITIAL_STATS, startCard.stressLevel ?? "grind"),
      turnIndex: 0,
      history: [],
      cooldowns: {},
      knowledgeCoverage: startCard.meta?.educationalTags ?? [],
    };
  }

  applyChoice(state: RuntimeState, choice: CardChoice) {
    const cardBeforeChoice = state.currentCard;
    const resolution = resolveChoiceEffects(state, choice);
    const historyEntry: RunHistoryEntry | null = cardBeforeChoice
      ? {
          turnIndex: resolution.nextState.turnIndex,
          cardId: cardBeforeChoice.id,
          choiceId: choice.id,
          statsBefore: { ...state.stats },
          statsAfter: { ...resolution.nextState.stats },
          pressureBefore: state.pressure,
          pressureAfter: resolution.nextState.pressure,
          flagsBefore: [...state.flags],
          flagsAfter: [...resolution.nextState.flags],
        }
      : null;
    const nextHistory = historyEntry
      ? [...resolution.nextState.history, historyEntry]
      : resolution.nextState.history;
    const nextKnowledgeCoverage = mergeUnique(
      resolution.nextState.knowledgeCoverage,
      cardBeforeChoice?.meta?.educationalTags ?? [],
    );

    if (resolution.gameOver.isGameOver) {
      return {
        nextState: {
          ...resolution.nextState,
          history: nextHistory,
          knowledgeCoverage: nextKnowledgeCoverage,
        },
        feedbackMessage: resolution.feedbackMessage,
        isGameOver: true,
        gameOverReason: resolution.gameOver.gameOverReason,
        isWin: resolution.gameOver.isWin,
        currencyAward: resolution.gameOver.currencyAward,
      };
    }

    const drawResult = drawNextRuntimeCard({
      state: resolution.nextState,
      repository: this.repository,
    });

    const nextCard = drawResult.nextCard;
    const nextStressLevel = nextCard?.stressLevel ?? resolution.nextState.activeStressLevel;

    return {
      nextState: {
        ...resolution.nextState,
        deck: drawResult.nextDeck,
        currentCard: nextCard,
        queuedCardId: drawResult.queuedCardId,
        cardsUntilQueuedCard:
          resolution.nextState.queuedCardId && nextCard?.id !== resolution.nextState.queuedCardId
            ? Math.max(0, resolution.nextState.cardsUntilQueuedCard - 1)
            : 0,
        currentRoute: inferRouteFromFlags(resolution.nextState.flags),
        activeStressLevel: nextStressLevel,
        pressure: derivePressure(resolution.nextState.stats, nextStressLevel),
        seenCardIds: nextCard
          ? [...resolution.nextState.seenCardIds, nextCard.id]
          : resolution.nextState.seenCardIds,
        recentCardIds: nextCard
          ? [...resolution.nextState.recentCardIds.slice(-4), nextCard.id]
          : resolution.nextState.recentCardIds,
        recentCategories: nextCard
          ? [...resolution.nextState.recentCategories.slice(-2), nextCard.category]
          : resolution.nextState.recentCategories,
        history: nextHistory,
        knowledgeCoverage: mergeUnique(
          nextKnowledgeCoverage,
          nextCard?.meta?.educationalTags ?? [],
        ),
      },
      feedbackMessage: resolution.feedbackMessage,
      isGameOver: false,
      gameOverReason: null,
      isWin: false,
      currencyAward: 0,
    };
  }
}

export const createDemoGameRuntime = () =>
  new DemoGameRuntime(new InMemoryGameRepository(demoGameCatalog));

export const createGameRuntimeFromCatalog = (catalog: typeof demoGameCatalog) =>
  new DemoGameRuntime(new InMemoryGameRepository(catalog));
