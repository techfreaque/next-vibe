-- Custom SQL migration file, put your code below! --

-- ─── Vibe Sense: migrate enum values to i18n keys ────────────────────────────
--
-- The vibe-sense DB columns previously stored short raw strings.
-- They now store scoped i18n translation keys (the values of the
-- createEnumOptions enum objects).
--
-- Tables affected:
--   pipeline_graphs          → owner_type
--   pipeline_backtest_runs   → action_mode
--   pipeline_runs            → status

-- pipeline_graphs.owner_type
UPDATE pipeline_graphs SET owner_type = 'enums.graphOwnerType.system' WHERE owner_type = 'system';
UPDATE pipeline_graphs SET owner_type = 'enums.graphOwnerType.admin'  WHERE owner_type = 'admin';
UPDATE pipeline_graphs SET owner_type = 'enums.graphOwnerType.user'   WHERE owner_type = 'user';

-- pipeline_backtest_runs.action_mode
UPDATE pipeline_backtest_runs SET action_mode = 'enums.backtestActionMode.simulate' WHERE action_mode = 'simulate';
UPDATE pipeline_backtest_runs SET action_mode = 'enums.backtestActionMode.execute'  WHERE action_mode = 'execute';

-- Update the column DEFAULT to the new value
ALTER TABLE pipeline_backtest_runs ALTER COLUMN action_mode SET DEFAULT 'enums.backtestActionMode.simulate';

-- pipeline_runs.status
UPDATE pipeline_runs SET status = 'enums.runStatus.running'   WHERE status = 'running';
UPDATE pipeline_runs SET status = 'enums.runStatus.completed' WHERE status = 'completed';
UPDATE pipeline_runs SET status = 'enums.runStatus.failed'    WHERE status = 'failed';

-- Update the column DEFAULT to the new value
ALTER TABLE pipeline_runs ALTER COLUMN status SET DEFAULT 'enums.runStatus.running';