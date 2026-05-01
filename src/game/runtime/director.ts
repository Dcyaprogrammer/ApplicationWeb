import { InMemoryGameRepository, type GameRepository } from "./repository";
import type { RuntimeCard, RuntimeState } from "./types";
import { demoGameCatalog } from "./demoData";

export interface DirectorContext {
  state: RuntimeState;
  repository: GameRepository;
}

interface ScoredCardCandidate {
  card: RuntimeCard;
  score: number;
}

const HISTORY_WINDOW = 4;

const hasRequiredFlags = (card: RuntimeCard, state: RuntimeState) => {
  const requirements = card.requirements;
  if (!requirements) {
    return true;
  }

  if (requirements.phases && !requirements.phases.includes(state.currentPhase)) {
    return false;
  }

  if (requirements.requiredFlags?.some((flag) => !state.flags.includes(flag))) {
    return false;
  }

  if (requirements.excludedFlags?.some((flag) => state.flags.includes(flag))) {
    return false;
  }

  for (const [key, minValue] of Object.entries(requirements.statMin ?? {})) {
    const statKey = key as keyof RuntimeState["stats"];
    if (state.stats[statKey] < minValue) {
      return false;
    }
  }

  for (const [key, maxValue] of Object.entries(requirements.statMax ?? {})) {
    const statKey = key as keyof RuntimeState["stats"];
    if (state.stats[statKey] > maxValue) {
      return false;
    }
  }

  return true;
};

const matchesRoute = (card: RuntimeCard, state: RuntimeState) => {
  const routeTags = card.meta?.routeTags;
  if (!routeTags || routeTags.length === 0) {
    return true;
  }

  if (state.currentRoute === "undecided") {
    return false;
  }

  return routeTags.includes(state.currentRoute) || routeTags.includes("mixed");
};

const isSeenAndLocked = (card: RuntimeCard, state: RuntimeState) => {
  if (card.id === state.currentCard?.id) {
    return true;
  }

  if (card.once && state.seenCardIds.includes(card.id)) {
    return true;
  }

  const cardType = card.meta?.cardType;
  if ((cardType === "milestone" || cardType === "ending") && state.seenCardIds.includes(card.id)) {
    return true;
  }

  return false;
};

const isOnCooldown = (card: RuntimeCard, state: RuntimeState) => {
  return (state.cooldowns[card.id] ?? 0) > 0;
};

const passesTriggerGate = (card: RuntimeCard) => {
  if (card.triggerType !== "special_event") {
    return true;
  }

  const probability = card.triggerProbability ?? 0;
  return Math.random() < probability;
};

const isEligibleCandidate = (card: RuntimeCard, state: RuntimeState) => {
  return (
    hasRequiredFlags(card, state) &&
    matchesRoute(card, state) &&
    !isSeenAndLocked(card, state) &&
    !isOnCooldown(card, state) &&
    passesTriggerGate(card)
  );
};

const calculateRouteFit = (card: RuntimeCard, state: RuntimeState) => {
  if (!card.meta?.routeTags?.length) {
    return 1;
  }

  return matchesRoute(card, state) ? 1.25 : 0;
};

const calculatePressureFit = (card: RuntimeCard, state: RuntimeState) => {
  const minPressure = card.meta?.minPressure;
  const maxPressure = card.meta?.maxPressure;
  const impactScore = card.meta?.impactScore ?? 10;
  const recoveryScore = card.meta?.recoveryScore ?? 0;

  if (minPressure !== undefined && state.pressure < minPressure) {
    return 0.25;
  }

  if (maxPressure !== undefined && state.pressure > maxPressure) {
    return 0.25;
  }

  if (state.pressure >= 70) {
    if (card.meta?.cardType === "recovery") {
      return 1.8 + recoveryScore / 50;
    }
    if (card.meta?.cardType === "crisis") {
      return 0.45;
    }
  }

  if (state.pressure <= 35 && card.meta?.cardType === "crisis") {
    return 1.2 + impactScore / 100;
  }

  return 1;
};

const calculateNoveltyFit = (card: RuntimeCard, state: RuntimeState) => {
  if (state.recentCardIds.includes(card.id)) {
    return 0.1;
  }

  let score = 1;

  if (state.recentCategories.includes(card.category)) {
    score *= 0.55;
  }

  if (state.currentCard?.character === card.character) {
    score *= 0.85;
  }

  return score;
};

const calculateKnowledgeFit = (card: RuntimeCard, state: RuntimeState) => {
  const tags = card.meta?.educationalTags ?? [];
  if (tags.length === 0) {
    return 1;
  }

  const unseenTags = tags.filter((tag) => !state.knowledgeCoverage.includes(tag));
  return unseenTags.length > 0 ? 1.2 + unseenTags.length * 0.1 : 0.95;
};

const calculatePacingFit = (card: RuntimeCard, state: RuntimeState) => {
  const recentPressureCards = state.history
    .slice(-HISTORY_WINDOW)
    .map((entry) => entry.pressureAfter - entry.pressureBefore);

  const recentPressureRise = recentPressureCards.reduce((sum, change) => sum + Math.max(0, change), 0);

  if (recentPressureRise >= 20 && card.meta?.cardType === "crisis") {
    return 0.4;
  }

  if (recentPressureRise >= 20 && card.meta?.cardType === "recovery") {
    return 1.5;
  }

  return 1;
};

const calculatePriority = (card: RuntimeCard) => {
  const baseWeight = card.weight ?? 100;
  const priority = card.meta?.priority ?? 0;
  return baseWeight + priority;
};

const scoreCandidate = (card: RuntimeCard, state: RuntimeState): ScoredCardCandidate => {
  const base = calculatePriority(card);
  const routeFit = calculateRouteFit(card, state);
  const pressureFit = calculatePressureFit(card, state);
  const noveltyFit = calculateNoveltyFit(card, state);
  const knowledgeFit = calculateKnowledgeFit(card, state);
  const pacingFit = calculatePacingFit(card, state);

  return {
    card,
    score: base * routeFit * pressureFit * noveltyFit * knowledgeFit * pacingFit,
  };
};

const weightedRandom = (candidates: ScoredCardCandidate[]) => {
  const total = candidates.reduce((sum, candidate) => sum + candidate.score, 0);
  if (total <= 0) {
    return candidates[0]?.card ?? null;
  }

  let roll = Math.random() * total;

  for (const candidate of candidates) {
    roll -= candidate.score;
    if (roll <= 0) {
      return candidate.card;
    }
  }

  return candidates[candidates.length - 1]?.card ?? null;
};

const buildAvailableDeck = ({ state, repository }: DirectorContext) => {
  return repository.listRegularCards().filter((card) => {
    if (card.id === state.currentCard?.id) {
      return false;
    }

    if (card.once && state.seenCardIds.includes(card.id)) {
      return false;
    }

    return true;
  });
};

const drawQueuedCard = ({ state, repository }: DirectorContext) => {
  if (!state.queuedCardId) {
    return null;
  }

  if (state.cardsUntilQueuedCard > 0) {
    return null;
  }

  return repository.findCardById(state.queuedCardId) ?? null;
};

const drawScoredCandidate = ({ state, repository }: DirectorContext) => {
  const candidates = repository
    .listAllCards()
    .filter((card) => {
      if (state.queuedCardId && state.cardsUntilQueuedCard > 0) {
        const type = card.meta?.cardType;
        return type === "dynamic" || type === "recovery" || type === "knowledge" || type === "crisis";
      }
      return true;
    })
    .filter((card) => isEligibleCandidate(card, state))
    .map((card) => scoreCandidate(card, state))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);

  if (candidates.length === 0) {
    return null;
  }

  const candidateWindow = candidates.slice(0, Math.min(candidates.length, 5));
  return weightedRandom(candidateWindow);
};

export const drawNextRuntimeCard = (context: DirectorContext) => {
  const queuedCard = drawQueuedCard(context);
  if (queuedCard) {
    return {
      nextCard: queuedCard,
      nextDeck: buildAvailableDeck(context),
      queuedCardId: null,
    };
  }

  const nextCard = drawScoredCandidate(context);

  return {
    nextCard,
    nextDeck: buildAvailableDeck(context),
    queuedCardId: context.state.queuedCardId,
  };
};

export const createDefaultDirectorContext = (state: RuntimeState) => ({
  state,
  repository: new InMemoryGameRepository(demoGameCatalog),
});
