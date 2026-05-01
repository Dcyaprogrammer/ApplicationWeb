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

const resolveStandardGameOver = (
  stats: RuntimeState["stats"],
  state: RuntimeState,
) => {
  // 失败条件
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

  // 时间胜利条件：完成完整的三年申请之旅（Day 1000+）
  if (state.currentDay >= 1000) {
    return {
      gameOverReason: "🎓 Application Journey Complete! You've survived all three years - from preparation to applications to results. You made it through the entire grad school application process!",
      isWin: true,
    };
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

  const gameOverResult = resolveStandardGameOver(nextStats, {
    ...state,
    currentDay: nextDay,
    currentPhase: nextPhase,
  });

  // 检查是字符串失败信息还是对象（包含胜利条件）
  const isWin = typeof gameOverResult === "object" && gameOverResult?.isWin === true;
  const gameOverReason = typeof gameOverResult === "string"
    ? gameOverResult
    : gameOverResult?.gameOverReason ?? null;
  const isGameOver = gameOverReason !== null;

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
      isGameOver,
      gameOverReason,
      isWin,
      currencyAward: isWin ? 100 : 0,
    },
  };
};
