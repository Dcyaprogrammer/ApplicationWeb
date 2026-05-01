import type { Card, CardCategory, StressLevel } from "../../types/card";
import type { Phase, StatKey, Stats } from "../../types/game";

export type GameRoute = "agency" | "diy" | "mixed" | "undecided";

export type RuntimeCardType =
  | "milestone"
  | "dynamic"
  | "crisis"
  | "recovery"
  | "knowledge"
  | "ending";

export interface RuntimeCardMeta {
  cardType?: RuntimeCardType;
  routeTags?: GameRoute[];
  educationalTags?: string[];
  impactScore?: number;
  recoveryScore?: number;
  frustrationRisk?: number;
  priority?: number;
  cooldownTurns?: number;
  minPressure?: number;
  maxPressure?: number;
}

export interface RuntimeCard extends Card {
  meta?: RuntimeCardMeta;
}

export interface GameCardCatalog {
  startCardId: string;
  cards: RuntimeCard[];
}

export interface RunHistoryEntry {
  turnIndex: number;
  cardId: string;
  choiceId: string;
  statsBefore: Stats;
  statsAfter: Stats;
  pressureBefore: number;
  pressureAfter: number;
  flagsBefore: string[];
  flagsAfter: string[];
}

export interface RuntimeState {
  stats: Stats;
  currentDay: number;
  currentPhase: Phase;
  currentRoute: GameRoute;
  currentCard: RuntimeCard | null;
  deck: RuntimeCard[];
  queuedCardId: string | null;
  cardsUntilQueuedCard: number;
  activeStressLevel: StressLevel;
  flags: string[];
  seenCardIds: string[];
  recentCardIds: string[];
  recentCategories: CardCategory[];
  pressure: number;
  turnIndex: number;
  history: RunHistoryEntry[];
  cooldowns: Record<string, number>;
  knowledgeCoverage: string[];
}

export interface GameOverState {
  isGameOver: boolean;
  gameOverReason: string | null;
  isWin: boolean;
  currencyAward: number;
}

export interface ChoiceResolution {
  nextState: RuntimeState;
  feedbackMessage: string | null;
  gameOver: GameOverState;
}

export type StatDelta = Partial<Record<StatKey, number>>;
