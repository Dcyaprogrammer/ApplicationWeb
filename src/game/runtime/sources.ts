import type { SupabaseClient } from "@supabase/supabase-js";
import { demoGameCatalog } from "./demoData";
import type { CatalogSource } from "./persistence";
import {
  deserializeCatalogFromStorage,
  type StoredCardRecord,
} from "./storage";
import type { GameCardCatalog } from "./types";

const LOCAL_CATALOG_KEY = "gradventure:catalog";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export class DemoCatalogSource implements CatalogSource {
  async loadCatalog(): Promise<GameCardCatalog> {
    return demoGameCatalog;
  }
}

export class LocalStorageCatalogSource implements CatalogSource {
  async loadCatalog(): Promise<GameCardCatalog> {
    if (!canUseStorage()) {
      throw new Error("Local storage is not available");
    }

    const raw = window.localStorage.getItem(LOCAL_CATALOG_KEY);
    if (!raw) {
      throw new Error("No local catalog found");
    }

    return deserializeCatalogFromStorage(JSON.parse(raw) as {
      startCardId: string;
      cards: StoredCardRecord[];
    });
  }
}

interface SupabaseCatalogSourceOptions {
  cardsTable?: string;
  balanceConfigTable?: string;
  startCardConfigKey?: string;
  publishedOnly?: boolean;
}

interface SupabaseCardRow {
  id: string;
  slug: string;
  title: string | null;
  body: string;
  phase: string;
  category: string;
  card_type: string;
  character_id: string;
  stress_level: string | null;
  trigger_type: string | null;
  trigger_probability: number | null;
  route_tags: string[] | null;
  requirements: StoredCardRecord["requirements"] | null;
  choices: StoredCardRecord["choices"];
  weight: number;
  once_per_run: boolean;
  meta: StoredCardRecord["meta"] | null;
  published: boolean;
}

interface SupabaseBalanceConfigRow {
  key: string;
  value: {
    startCardId?: string;
  } | null;
}

const SUPABASE_CARD_COLUMNS = [
  "id",
  "slug",
  "title",
  "body",
  "phase",
  "category",
  "card_type",
  "character_id",
  "stress_level",
  "trigger_type",
  "trigger_probability",
  "route_tags",
  "requirements",
  "choices",
  "weight",
  "once_per_run",
  "meta",
  "published",
].join(", ");

const normalizeSupabaseCardRow = (
  row: SupabaseCardRow | StoredCardRecord,
): StoredCardRecord => {
  if ("cardType" in row) {
    return row;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    phase: row.phase,
    category: row.category,
    cardType: row.card_type,
    characterId: row.character_id,
    stressLevel: row.stress_level,
    triggerType: row.trigger_type,
    triggerProbability: row.trigger_probability,
    routeTags: row.route_tags,
    requirements: row.requirements,
    choices: row.choices,
    weight: row.weight,
    oncePerRun: row.once_per_run,
    meta: row.meta,
    published: row.published,
  };
};

const inferStartCardId = (cards: StoredCardRecord[]) => {
  const explicit = cards.find((card) => card.id === "timeline_start");
  if (explicit) {
    return explicit.id;
  }

  const milestone = cards.find((card) => card.cardType === "milestone");
  if (milestone) {
    return milestone.id;
  }

  return cards[0]?.id ?? "";
};

export class SupabaseCatalogSource implements CatalogSource {
  private readonly client: SupabaseClient;
  private readonly cardsTable: string;
  private readonly balanceConfigTable: string;
  private readonly startCardConfigKey: string;
  private readonly publishedOnly: boolean;

  constructor(
    client: SupabaseClient,
    options: SupabaseCatalogSourceOptions = {},
  ) {
    this.client = client;
    this.cardsTable = options.cardsTable ?? "cards";
    this.balanceConfigTable = options.balanceConfigTable ?? "balance_configs";
    this.startCardConfigKey = options.startCardConfigKey ?? "start_card_id";
    this.publishedOnly = options.publishedOnly ?? true;
  }

  async loadCatalog(): Promise<GameCardCatalog> {
    let query = this.client
      .from(this.cardsTable)
      .select(SUPABASE_CARD_COLUMNS, { count: "exact" })
      .order("priority", { ascending: false });

    if (this.publishedOnly) {
      query = query.eq("published", true);
    }

    const [{ data: cards, error: cardsError }, { data: configRows, error: configError }] =
      await Promise.all([
        query,
        this.client
          .from(this.balanceConfigTable)
          .select("key, value", { count: "exact" })
          .eq("key", this.startCardConfigKey)
          .limit(1),
      ]);

    if (cardsError) {
      throw cardsError;
    }

    if (configError) {
      throw configError;
    }

    const storedCards = ((cards ?? []) as Array<SupabaseCardRow | StoredCardRecord>).map(
      normalizeSupabaseCardRow,
    );
    const config = ((configRows ?? []) as SupabaseBalanceConfigRow[])[0] ?? null;
    const configuredStartCardId = config?.value?.startCardId;

    return deserializeCatalogFromStorage({
      startCardId: configuredStartCardId ?? inferStartCardId(storedCards),
      cards: storedCards,
    });
  }
}
