import type { RuntimeCard, GameCardCatalog } from "./types";

export interface GameRepository {
  getCatalog(): GameCardCatalog;
  getStartCard(): RuntimeCard;
  findCardById(cardId: string): RuntimeCard | undefined;
  listAllCards(): RuntimeCard[];
  listRegularCards(): RuntimeCard[];
  listSpecialEventCards(): RuntimeCard[];
}

export class InMemoryGameRepository implements GameRepository {
  private readonly cardIndex: Map<string, RuntimeCard>;
  private readonly catalog: GameCardCatalog;

  constructor(catalog: GameCardCatalog) {
    this.catalog = catalog;
    this.cardIndex = new Map(
      catalog.cards.map((card) => [card.id, card]),
    );
  }

  getCatalog(): GameCardCatalog {
    return this.catalog;
  }

  getStartCard(): RuntimeCard {
    const card = this.findCardById(this.catalog.startCardId);
    if (!card) {
      throw new Error(`Missing start card: ${this.catalog.startCardId}`);
    }
    return card;
  }

  findCardById(cardId: string): RuntimeCard | undefined {
    return this.cardIndex.get(cardId);
  }

  listAllCards(): RuntimeCard[] {
    return [...this.catalog.cards];
  }

  listRegularCards(): RuntimeCard[] {
    return this.catalog.cards.filter((card) => card.triggerType !== "special_event");
  }

  listSpecialEventCards(): RuntimeCard[] {
    return this.catalog.cards.filter((card) => card.triggerType === "special_event");
  }
}
