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

  const tests = [
    {
      name: "cards id count limit",
      query: supabase.from("cards").select("id", { count: "exact" }).limit(1),
    },
    {
      name: "cards id limit",
      query: supabase.from("cards").select("id").limit(1),
    },
    {
      name: "cards id published limit",
      query: supabase.from("cards").select("id").eq("published", true).limit(1),
    },
    {
      name: "cards id order limit",
      query: supabase
        .from("cards")
        .select("id")
        .order("priority", { ascending: false })
        .limit(1),
    },
    {
      name: "cards columns order limit",
      query: supabase
        .from("cards")
        .select("id, slug, body, card_type, character_id")
        .order("priority", { ascending: false })
        .limit(1),
    },
    {
      name: "cards columns order all",
      query: supabase
        .from("cards")
        .select(
          "id, slug, title, body, phase, category, card_type, character_id, stress_level, trigger_type, trigger_probability, route_tags, requirements, choices, weight, once_per_run, meta, published",
        )
        .order("priority", { ascending: false }),
    },
    {
      name: "balance key value count limit",
      query: supabase
        .from("balance_configs")
        .select("key, value", { count: "exact" })
        .limit(1),
    },
    {
      name: "balance value eq limit",
      query: supabase
        .from("balance_configs")
        .select("value")
        .eq("key", "start_card_id")
        .limit(1),
    },
    {
      name: "balance value eq maybeSingle",
      query: supabase
        .from("balance_configs")
        .select("value")
        .eq("key", "start_card_id")
        .maybeSingle(),
    },
  ];

  for (const test of tests) {
    const result = await test.query;
    console.log(
      JSON.stringify(
        {
          name: test.name,
          ok: !result.error,
          message: result.error?.message ?? null,
          count: "count" in result ? result.count ?? null : null,
          rows: Array.isArray(result.data) ? result.data.length : result.data ? 1 : 0,
        },
        null,
        2,
        ),
    );
  }

  const catalog = await new SupabaseCatalogSource(supabase).loadCatalog();
  console.log(
    JSON.stringify(
      {
        name: "catalog source",
        ok: true,
        startCardId: catalog.startCardId,
        cards: catalog.cards.length,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error("debugSupabaseQueries failed");
  console.error(error);
  process.exitCode = 1;
});
