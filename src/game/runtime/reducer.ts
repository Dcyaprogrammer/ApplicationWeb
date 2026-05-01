import type { CardChoice } from "../../types/card";
import type { RuntimeState, ChoiceResolution } from "./types";
import {
  applyStatDelta,
  decayCooldowns,
  derivePressure,
  inferRouteFromFlags,
  mergeUnique,
  resolvePhaseForDay,
  updateFlags,
} from "./helpers";

const resolveStandardGameOver = (stats: RuntimeState["stats"]) => {
  if (stats.gpa <= 0) {
    return "Academic Dismissal. Your GPA hit rock bottom.";
  }
  if (stats.mentality <= 0) {
    return "Burnout. You need to take a leave of absence.";
  }
  if (stats.energy <= 0) {
    return "Exhaustion. You collapsed and slept through finals week.";
  }
  if (stats.experience <= 0) {
    return "Blank Resume. You have absolutely no practical experience to show.";
  }

  return null;
};

export const resolveChoiceEffects = (
  state: RuntimeState,
  choice: CardChoice,
): ChoiceResolution => {
  const feedbackMessage = choice.effect.resultText ?? `You chose: ${choice.label}`;

  if (choice.effect.triggerGameOver) {
    return {
      nextState: state,
      feedbackMessage,
      gameOver: {
        isGameOver: true,
        gameOverReason: choice.effect.triggerGameOver,
        isWin: choice.effect.isWin ?? false,
        currencyAward: choice.effect.currencyAward ?? 0,
      },
    };
  }

  const nextStats = applyStatDelta(state.stats, choice.effect.stats);
  const nextFlags = updateFlags(state.flags, choice);
  const nextDay = state.currentDay + (choice.effect.daysToAdvance ?? Math.floor(Math.random() * 3) + 1);
  const nextPhase = resolvePhaseForDay(nextDay);
  const isSchedulingNewQueuedCard = Boolean(choice.nextCardId);
  const nextQueuedCardId = choice.nextCardId ?? state.queuedCardId;
  const nextCardsUntilQueuedCard = isSchedulingNewQueuedCard
    ? 1
    : state.cardsUntilQueuedCard;
  const nextStressLevel = state.currentCard?.stressLevel ?? state.activeStressLevel;
  const pressure = derivePressure(nextStats, nextStressLevel);
  const currentCardTags = state.currentCard?.meta?.educationalTags ?? [];
  const nextCooldowns = decayCooldowns(state.cooldowns);
  if (state.currentCard?.meta?.cooldownTurns) {
    nextCooldowns[state.currentCard.id] = state.currentCard.meta.cooldownTurns;
  }

  const gameOverReason = resolveStandardGameOver(nextStats);

  return {
    nextState: {
      ...state,
      stats: nextStats,
      flags: nextFlags,
      currentDay: nextDay,
      currentPhase: nextPhase,
      currentRoute: inferRouteFromFlags(nextFlags),
      queuedCardId: nextQueuedCardId,
      cardsUntilQueuedCard: nextCardsUntilQueuedCard,
      pressure,
      turnIndex: state.turnIndex + 1,
      cooldowns: nextCooldowns,
      knowledgeCoverage: mergeUnique(state.knowledgeCoverage, currentCardTags),
    },
    feedbackMessage,
    gameOver: {
      isGameOver: gameOverReason !== null,
      gameOverReason,
      isWin: false,
      currencyAward: 0,
    },
  };
};
