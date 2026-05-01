import type { GameCardCatalog, RuntimeCard, RuntimeCardMeta } from "./types";

export interface StoredCardRecord {
  id: string;
  slug: string;
  title: string | null;
  body: string;
  phase: string;
  category: string;
  cardType: string;
  characterId: string;
  stressLevel: string | null;
  triggerType: string | null;
  triggerProbability: number | null;
  routeTags: string[] | null;
  requirements: RuntimeCard["requirements"] | null;
  choices: RuntimeCard["choices"];
  weight: number;
  oncePerRun: boolean;
  meta: RuntimeCardMeta | null;
  published: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const serializeRuntimeCard = (card: RuntimeCard): StoredCardRecord => ({
  id: card.id,
  slug: slugify(card.id),
  title: card.title ?? null,
  body: card.text,
  phase: card.phase,
  category: card.category,
  cardType: card.meta?.cardType ?? "dynamic",
  characterId: card.character,
  stressLevel: card.stressLevel ?? null,
  triggerType: card.triggerType ?? "normal",
  triggerProbability: card.triggerProbability ?? null,
  routeTags: card.meta?.routeTags ?? null,
  requirements: card.requirements ?? null,
  choices: card.choices,
  weight: card.weight ?? 100,
  oncePerRun: card.once ?? false,
  meta: card.meta ?? null,
  published: true,
});

export const deserializeStoredCard = (record: StoredCardRecord): RuntimeCard => ({
  id: record.id,
  category: record.category as RuntimeCard["category"],
  phase: record.phase as RuntimeCard["phase"],
  character: record.characterId as RuntimeCard["character"],
  title: record.title ?? undefined,
  text: record.body,
  stressLevel: (record.stressLevel ?? undefined) as RuntimeCard["stressLevel"],
  triggerType: (record.triggerType ?? undefined) as RuntimeCard["triggerType"],
  triggerProbability: record.triggerProbability ?? undefined,
  choices: record.choices,
  requirements: record.requirements ?? undefined,
  weight: record.weight,
  once: record.oncePerRun,
  meta: record.meta ?? undefined,
});

export const serializeCatalogForStorage = (catalog: GameCardCatalog) => ({
  startCardId: catalog.startCardId,
  cards: catalog.cards.map(serializeRuntimeCard),
});

export const deserializeCatalogFromStorage = (payload: {
  startCardId: string;
  cards: StoredCardRecord[];
}): GameCardCatalog => ({
  startCardId: payload.startCardId,
  cards: payload.cards.map(deserializeStoredCard),
});
