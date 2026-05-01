import "dotenv/config";
import postgres from "postgres";
import {
  demoBalanceConfigSeedRows,
  demoCardSeedRows,
} from "../game/runtime";
import { resolveDatabaseUrl } from "./connection";
import {
  createEnumStatements,
  createIndexStatements,
  createTableStatements,
} from "./schema";

type CliMode = "all" | "schema" | "seed";

const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run");
const printSql = args.has("--print-sql");
const mode: CliMode = args.has("--schema-only")
  ? "schema"
  : args.has("--seed-only")
    ? "seed"
    : "all";

const logSeedSummary = () => {
  console.log("Seed summary");
  console.log(`- cards: ${demoCardSeedRows.length}`);
  console.log(`- balance configs: ${demoBalanceConfigSeedRows.length}`);
  console.log(`- mode: ${mode}`);
  console.log(`- dry run: ${isDryRun ? "yes" : "no"}`);
};

const printStatements = () => {
  console.log("Schema statements:");
  [...createEnumStatements, ...createTableStatements, ...createIndexStatements].forEach((statement, index) => {
    console.log(`\n-- statement ${index + 1}\n${statement.trim()}\n`);
  });
};

const runSchema = async (sql: postgres.Sql) => {
  for (const statement of createEnumStatements) {
    await sql.unsafe(statement);
  }

  for (const statement of createTableStatements) {
    await sql.unsafe(statement);
  }

  for (const statement of createIndexStatements) {
    await sql.unsafe(statement);
  }
};

const seedCards = async (sql: postgres.Sql) => {
  for (const row of demoCardSeedRows) {
    await sql`
      INSERT INTO cards (
        id,
        slug,
        title,
        body,
        phase,
        category,
        card_type,
        character_id,
        stress_level,
        trigger_type,
        trigger_probability,
        route_tags,
        requirements,
        choices,
        weight,
        priority,
        cooldown_turns,
        once_per_run,
        repeatable,
        min_pressure,
        max_pressure,
        educational_tags,
        learning_goal,
        misconception_tag,
        guide_entry_id,
        set_flags,
        remove_flags,
        followup_arc,
        meta,
        published
      )
      VALUES (
        ${row.id},
        ${row.slug},
        ${row.title},
        ${row.body},
        ${row.phase},
        ${row.category},
        ${row.cardType},
        ${row.characterId},
        ${row.stressLevel},
        ${row.triggerType},
        ${row.triggerProbability},
        ${row.routeTags ?? null},
        ${row.requirements ?? null},
        ${row.choices},
        ${row.weight},
        ${row.meta?.priority ?? 0},
        ${row.meta?.cooldownTurns ?? 0},
        ${row.oncePerRun},
        true,
        ${row.meta?.minPressure ?? null},
        ${row.meta?.maxPressure ?? null},
        ${row.meta?.educationalTags ?? null},
        null,
        null,
        null,
        null,
        null,
        null,
        ${row.meta ?? null},
        ${row.published}
      )
      ON CONFLICT (id) DO UPDATE
      SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        phase = EXCLUDED.phase,
        category = EXCLUDED.category,
        card_type = EXCLUDED.card_type,
        character_id = EXCLUDED.character_id,
        stress_level = EXCLUDED.stress_level,
        trigger_type = EXCLUDED.trigger_type,
        trigger_probability = EXCLUDED.trigger_probability,
        route_tags = EXCLUDED.route_tags,
        requirements = EXCLUDED.requirements,
        choices = EXCLUDED.choices,
        weight = EXCLUDED.weight,
        priority = EXCLUDED.priority,
        cooldown_turns = EXCLUDED.cooldown_turns,
        once_per_run = EXCLUDED.once_per_run,
        repeatable = EXCLUDED.repeatable,
        min_pressure = EXCLUDED.min_pressure,
        max_pressure = EXCLUDED.max_pressure,
        educational_tags = EXCLUDED.educational_tags,
        meta = EXCLUDED.meta,
        published = EXCLUDED.published,
        updated_at = NOW()
    `;
  }
};

const seedBalanceConfigs = async (sql: postgres.Sql) => {
  for (const row of demoBalanceConfigSeedRows) {
    await sql`
      INSERT INTO balance_configs (
        key,
        value,
        description
      )
      VALUES (
        ${row.key},
        ${row.value},
        ${row.description}
      )
      ON CONFLICT (key) DO UPDATE
      SET
        value = EXCLUDED.value,
        description = EXCLUDED.description,
        updated_at = NOW()
    `;
  }
};

const main = async () => {
  logSeedSummary();

  if (printSql) {
    printStatements();
  }

  if (isDryRun) {
    console.log("Dry run complete. No database changes applied.");
    return;
  }

  const connectionString = resolveDatabaseUrl(process.env);

  const sql = postgres(connectionString, {
    max: 1,
    prepare: false,
  });

  try {
    await sql.begin(async (tx) => {
      if (mode === "all" || mode === "schema") {
        await runSchema(tx);
      }

      if (mode === "all" || mode === "seed") {
        await seedCards(tx);
        await seedBalanceConfigs(tx);
      }
    });

    console.log("Database initialization completed.");
  } finally {
    await sql.end();
  }
};

main().catch((error) => {
  console.error("db:init failed");
  console.error(error);
  process.exitCode = 1;
});
