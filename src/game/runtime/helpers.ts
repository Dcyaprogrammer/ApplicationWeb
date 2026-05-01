import type { CardChoice, StressLevel } from "../../types/card";
import { Phase } from "../../types/game";
import type {
  RuntimeCard,
  RuntimeState,
  StatDelta,
  GameRoute,
} from "./types";

const DAYS_IN_YEAR = 360;
const DAYS_IN_MONTH = 30;
const MONTH_NAMES = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];

export const INITIAL_STATS = {
  gpa: 50,
  mentality: 50,
  energy: 50,
  experience: 50,
};

export const getFormattedDate = (totalDays: number) => {
  const year = Math.floor(totalDays / DAYS_IN_YEAR) + 1;
  const dayOfYear = totalDays % DAYS_IN_YEAR;
  const monthIndex = Math.floor(dayOfYear / DAYS_IN_MONTH);
  const dayOfMonth = (dayOfYear % DAYS_IN_MONTH) + 1;

  return {
    year,
    month: MONTH_NAMES[monthIndex],
    day: dayOfMonth,
  };
};

export const clampStat = (value: number) => Math.max(0, Math.min(100, value));

export const applyStatDelta = (stats: RuntimeState["stats"], delta?: StatDelta) => {
  if (!delta) {
    return stats;
  }

  const nextStats = { ...stats };

  for (const [key, amount] of Object.entries(delta)) {
    if (amount === undefined) {
      continue;
    }

    const statKey = key as keyof RuntimeState["stats"];
    nextStats[statKey] = clampStat(nextStats[statKey] + amount);
  }

  return nextStats;
};

export const updateFlags = (flags: string[], choice: CardChoice) => {
  const nextFlags = new Set(flags);
  choice.effect.addFlags?.forEach((flag) => nextFlags.add(flag));
  choice.effect.removeFlags?.forEach((flag) => nextFlags.delete(flag));
  return [...nextFlags];
};

export const mergeUnique = (current: string[], additions: string[]) => {
  return [...new Set([...current, ...additions])];
};

export const inferRouteFromFlags = (flags: string[]): GameRoute => {
  const hasAgency = flags.includes("route_agency");
  const hasDiy = flags.includes("route_diy");

  if (hasAgency && hasDiy) return "mixed";
  if (hasAgency) return "agency";
  if (hasDiy) return "diy";
  return "undecided";
};

export const derivePressure = (
  stats: RuntimeState["stats"],
  stressLevel: StressLevel,
) => {
  const deficit = [stats.gpa, stats.mentality, stats.energy, stats.experience]
    .map((stat) => 100 - stat)
    .reduce((sum, value) => sum + value, 0);

  const stressBias = stressLevel === "panic" ? 20 : stressLevel === "grind" ? 10 : 0;

  return Math.max(0, Math.min(100, Math.round(deficit / 4 + stressBias)));
};

export const resolvePhaseForDay = (totalDays: number) => {
  if (totalDays < DAYS_IN_YEAR) {
    return Phase.Year1;
  }
  if (totalDays < DAYS_IN_YEAR * 2) {
    return Phase.Year2;
  }
  return Phase.Year3;
};

export const cloneDeck = (cards: RuntimeCard[]) => [...cards];

export const decayCooldowns = (cooldowns: Record<string, number>) => {
  return Object.fromEntries(
    Object.entries(cooldowns)
      .map(([key, turns]) => [key, Math.max(0, Number(turns) - 1)] as const)
      .filter(([, turns]) => turns > 0),
  );
};

export const shuffleCards = <T>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [next[i], next[swapIndex]] = [next[swapIndex], next[i]];
  }
  return next;
};
