export const createEnumStatements = [
  `
  DO $$ BEGIN
    CREATE TYPE card_type AS ENUM ('milestone', 'dynamic', 'crisis', 'recovery', 'knowledge', 'ending');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  `,
  `
  DO $$ BEGIN
    CREATE TYPE run_status AS ENUM ('active', 'won', 'lost', 'abandoned');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  `,
  `
  DO $$ BEGIN
    CREATE TYPE game_route AS ENUM ('agency', 'diy', 'mixed', 'undecided');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  `,
];

export const createTableStatements = [
  `
  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT,
    body TEXT NOT NULL,
    phase TEXT NOT NULL,
    category TEXT NOT NULL,
    card_type card_type NOT NULL DEFAULT 'dynamic',
    character_id TEXT NOT NULL,
    stress_level TEXT,
    trigger_type TEXT,
    trigger_probability DOUBLE PRECISION,
    route_tags JSONB,
    requirements JSONB,
    choices JSONB NOT NULL,
    weight INTEGER NOT NULL DEFAULT 100,
    priority INTEGER NOT NULL DEFAULT 0,
    cooldown_turns INTEGER NOT NULL DEFAULT 0,
    once_per_run BOOLEAN NOT NULL DEFAULT FALSE,
    repeatable BOOLEAN NOT NULL DEFAULT TRUE,
    min_pressure INTEGER,
    max_pressure INTEGER,
    educational_tags JSONB,
    learning_goal TEXT,
    misconception_tag TEXT,
    guide_entry_id TEXT,
    set_flags JSONB,
    remove_flags JSONB,
    followup_arc TEXT,
    meta JSONB,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS balance_configs (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    seed TEXT,
    status run_status NOT NULL DEFAULT 'active',
    current_phase TEXT NOT NULL,
    current_day INTEGER NOT NULL DEFAULT 0,
    route game_route NOT NULL DEFAULT 'undecided',
    stats_snapshot JSONB NOT NULL,
    flags JSONB NOT NULL,
    pressure INTEGER NOT NULL DEFAULT 0,
    runtime_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS run_card_history (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE RESTRICT,
    turn_index INTEGER NOT NULL,
    choice_id TEXT NOT NULL,
    stats_before JSONB NOT NULL,
    stats_after JSONB NOT NULL,
    pressure_before INTEGER NOT NULL,
    pressure_after INTEGER NOT NULL,
    flags_before JSONB,
    flags_after JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  `,
];

export const createIndexStatements = [
  `
  CREATE INDEX IF NOT EXISTS run_card_history_run_turn_idx
  ON run_card_history (run_id, turn_index);
  `,
  `
  CREATE INDEX IF NOT EXISTS run_card_history_card_idx
  ON run_card_history (card_id);
  `,
  `
  CREATE INDEX IF NOT EXISTS cards_published_priority_idx
  ON cards (published, priority DESC);
  `,
];
