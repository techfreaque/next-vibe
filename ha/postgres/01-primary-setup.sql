-- Run on SERVER 1 (primary), DB `postgres`.
-- Prereq (set in postgresql.conf / container command, needs ONE restart):
--   wal_level = logical
--   max_replication_slots >= 10   (already 10)
--   max_wal_senders       >= 10   (already 10)
--
-- Idempotent: safe to re-run.

-- 1. A dedicated replication role, reachable only over WireGuard (pg_hba).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'unbottled_repl') THEN
    -- Password is injected by setup-replication.sh (REPL_PASSWORD), never hard-coded here.
    EXECUTE format('CREATE ROLE unbottled_repl WITH REPLICATION LOGIN PASSWORD %L',
                   current_setting('unbottled.repl_password', true));
  END IF;
END $$;

-- Grant read on everything the publication will carry.
GRANT USAGE ON SCHEMA public TO unbottled_repl;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO unbottled_repl;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO unbottled_repl;

-- 2. Publication for ALL tables. FOR ALL TABLES auto-includes new tables, so a
-- future migration that adds a table is replicated without touching this.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'unbottled_pub') THEN
    CREATE PUBLICATION unbottled_pub FOR ALL TABLES;
  END IF;
END $$;

-- NOTE on sequences: logical replication does NOT replicate sequence values.
-- After a failover, bump every sequence on the replica past its table's max id
-- before the app writes (ha/postgres/failback.md handles this). The app uses
-- UUID/text ids for most rows, but any serial/identity columns need this.
