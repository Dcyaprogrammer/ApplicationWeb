import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { buildSupabaseSeedSql } from "./sqlExport";

const outputArg = process.argv[2] ?? "dist/supabase/gradventure_seed.sql";
const outputPath = resolve(process.cwd(), outputArg);

const main = async () => {
  const sql = buildSupabaseSeedSql();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, sql, "utf8");

  console.log("Supabase SQL export generated.");
  console.log(`- output: ${outputPath}`);
  console.log(`- cards: 37`);
};

main().catch((error) => {
  console.error("exportSupabaseSql failed");
  console.error(error);
  process.exitCode = 1;
});
