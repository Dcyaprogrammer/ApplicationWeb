import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
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

  const [cardsResult, balanceResult] = await Promise.all([
    supabase.from("cards").select("id", { count: "exact" }).limit(1),
    supabase.from("balance_configs").select("key, value", { count: "exact" }).limit(1),
  ]);

  console.log("Supabase check");
  console.log(
    JSON.stringify(
      {
        cards: {
          ok: !cardsResult.error,
          count: cardsResult.count ?? null,
          sample: cardsResult.data?.[0]?.id ?? null,
          error: cardsResult.error?.message ?? null,
        },
        balance_configs: {
          ok: !balanceResult.error,
          count: balanceResult.count ?? null,
          sample: balanceResult.data?.[0]?.key ?? null,
          error: balanceResult.error?.message ?? null,
        },
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error("checkSupabase failed");
  console.error(error);
  process.exitCode = 1;
});
