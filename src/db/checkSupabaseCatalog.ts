import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { SupabaseCatalogSource } from "../game/runtime";
import { sanitizeEnvValue } from "../shared/env";

const url = sanitizeEnvValue(process.env.VITE_SUPABASE_URL);
const anonKey = sanitizeEnvValue(process.env.VITE_SUPABASE_ANON_KEY);

const main = async () => {
  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const catalog = await new SupabaseCatalogSource(supabase).loadCatalog();
  const firstCard = catalog.cards.find((card) => card.id === catalog.startCardId) ?? catalog.cards[0];

  console.log("Supabase catalog runtime check");
  console.log(
    JSON.stringify(
      {
        startCardId: catalog.startCardId,
        cards: catalog.cards.length,
        firstCard: firstCard
          ? {
              id: firstCard.id,
              title: firstCard.title ?? null,
              cardType: firstCard.meta?.cardType ?? null,
            }
          : null,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error("checkSupabaseCatalog failed");
  console.error(error);
  process.exitCode = 1;
});
