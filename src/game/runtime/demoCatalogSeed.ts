import { demoGameCatalog } from "./demoData";
import { serializeCatalogForStorage } from "./storage";

export const serializedDemoCatalog = serializeCatalogForStorage(demoGameCatalog);

export const demoCardSeedRows = serializedDemoCatalog.cards;

export const demoBalanceConfigSeedRows = [
  {
    key: "start_card_id",
    value: {
      startCardId: demoGameCatalog.startCardId,
    },
    description: "Controls the first milestone card used when a run starts.",
  },
];
