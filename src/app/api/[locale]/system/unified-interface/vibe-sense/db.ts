/**
 * Vibe Sense - Database Schema
 *
 * Tables for graphs, time-series datapoints, evaluator signals, and backtests.
 *
 * NOTE: Using text() with enum constraint instead of pgEnum() - translation keys
 * exceed PostgreSQL's 63-byte enum label limit.
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { DataPoint } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { ResolutionValues } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { users } from "@/app/api/[locale]/user/db";
import {
  BacktestActionMode,
  BacktestActionModeDB,
  GraphOwnerTypeDB,
  RunStatus,
  RunStatusDB,
} from "./enum";
import type { GraphConfig } from "./graph/types";

// ─── Graphs ───────────────────────────────────────────────────────────────────

/**
 * Pipeline Graphs - versioned DAG configs.
 * Each row is a version of a graph. Active version is marked with isActive=true.
 * Edits create new rows (branches) - never mutate existing versions.
 */
export const pipelineGraphs = pgTable(
  "pipeline_graphs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-readable slug, shared across versions (e.g. "lead-funnel") */
    slug: text("slug").notNull(),
    /** Display name */
    name: text("name").notNull(),
    description: text("description"),
    /** Owner type: system (seeds), admin, user */
    ownerType: text("owner_type", { enum: GraphOwnerTypeDB }).notNull(),
    /** Null for system graphs */
    ownerId: uuid("owner_id").references(() => users.id, {
      onDelete: "set null",
    }),
    /** Parent version this was branched from. Null for root versions. */
    parentVersionId: uuid("parent_version_id"),
    /** The full graph DAG config as JSON */
    config: jsonb("config").$type<GraphConfig>().notNull(),
    /** Whether this is the active (displayed) version for this slug+owner */
    isActive: boolean("is_active").notNull().default(true),
    /** Set when graph is archived (soft delete). Null = not archived. */
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pipeline_graphs_slug").on(table.slug),
    index("idx_pipeline_graphs_owner").on(table.ownerId),
    index("idx_pipeline_graphs_active").on(table.isActive),
  ],
);

export const selectPipelineGraphSchema = createSelectSchema(pipelineGraphs);
export const insertPipelineGraphSchema = createInsertSchema(pipelineGraphs);
export type PipelineGraph = z.infer<typeof selectPipelineGraphSchema>;
export type NewPipelineGraph = z.infer<typeof insertPipelineGraphSchema>;

// ─── Datapoints ───────────────────────────────────────────────────────────────

/**
 * Pipeline Datapoints - time series values.
 * Only written for nodes with persist: "always" or persist: "snapshot".
 * persist: "never" nodes are computed on read from nearest persisted ancestor.
 */
export const pipelineDatapoints = pgTable(
  "pipeline_datapoints",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Indicator node id, e.g. "leads.created" */
    nodeId: text("node_id").notNull(),
    /** Graph id this datapoint belongs to. Null = shared/global */
    graphId: uuid("graph_id").references(() => pipelineGraphs.id, {
      onDelete: "cascade",
    }),
    timestamp: timestamp("timestamp").notNull(),
    value: text("value").notNull(), // stored as string, parsed to number on read
    meta: jsonb("meta").$type<DataPoint["meta"]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_pipeline_datapoints_unique").on(
      table.nodeId,
      table.graphId,
      table.timestamp,
    ),
    index("idx_pipeline_datapoints_node_ts").on(table.nodeId, table.timestamp),
    index("idx_pipeline_datapoints_graph").on(table.graphId),
  ],
);

export const selectPipelineDatapointSchema =
  createSelectSchema(pipelineDatapoints);
export type PipelineDatapoint = z.infer<typeof selectPipelineDatapointSchema>;

// ─── Signals ──────────────────────────────────────────────────────────────────

/**
 * Pipeline Signals - evaluator fire history.
 * Always persisted regardless of input persist modes - the audit trail.
 */
export const pipelineSignals = pgTable(
  "pipeline_signals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Evaluator node id within the graph */
    evaluatorId: text("evaluator_id").notNull(),
    graphId: uuid("graph_id")
      .notNull()
      .references(() => pipelineGraphs.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp").notNull(),
    fired: boolean("fired").notNull(),
    meta: jsonb("meta").$type<
      Record<string, string | number | boolean | null>
    >(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pipeline_signals_evaluator_ts").on(
      table.evaluatorId,
      table.timestamp,
    ),
    index("idx_pipeline_signals_graph").on(table.graphId),
  ],
);

export const selectPipelineSignalSchema = createSelectSchema(pipelineSignals);
export type PipelineSignal = z.infer<typeof selectPipelineSignalSchema>;

// ─── Backtest Runs ────────────────────────────────────────────────────────────

export const pipelineBacktestRuns = pgTable(
  "pipeline_backtest_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    graphId: uuid("graph_id")
      .notNull()
      .references(() => pipelineGraphs.id, { onDelete: "cascade" }),
    /** Graph version id this backtest ran against */
    graphVersionId: uuid("graph_version_id")
      .notNull()
      .references(() => pipelineGraphs.id, { onDelete: "cascade" }),
    rangeFrom: timestamp("range_from").notNull(),
    rangeTo: timestamp("range_to").notNull(),
    resolution: text("resolution", { enum: ResolutionValues }).notNull(),
    /** simulate = actions recorded not executed */
    actionMode: text("action_mode", {
      enum: BacktestActionModeDB,
    })
      .notNull()
      .default(BacktestActionMode.SIMULATE),
    /** Whether all source data was available - null until run completes */
    eligible: boolean("eligible"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_pipeline_backtest_runs_graph").on(table.graphId)],
);

export const selectPipelineBacktestRunSchema =
  createSelectSchema(pipelineBacktestRuns);
export type PipelineBacktestRun = z.infer<
  typeof selectPipelineBacktestRunSchema
>;

// ─── Backtest Results ─────────────────────────────────────────────────────────

export const pipelineBacktestResults = pgTable(
  "pipeline_backtest_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id")
      .notNull()
      .references(() => pipelineBacktestRuns.id, { onDelete: "cascade" }),
    nodeId: text("node_id").notNull(),
    timestamp: timestamp("timestamp").notNull(),
    value: text("value").notNull(),
    /** true for signal results (evaluator fired), null for series results */
    fired: boolean("fired"),
    meta: jsonb("meta").$type<
      Record<string, string | number | boolean | null>
    >(),
  },
  (table) => [
    index("idx_pipeline_backtest_results_run").on(table.runId),
    index("idx_pipeline_backtest_results_node_ts").on(
      table.nodeId,
      table.timestamp,
    ),
  ],
);

export const selectPipelineBacktestResultSchema = createSelectSchema(
  pipelineBacktestResults,
);
export type PipelineBacktestResult = z.infer<
  typeof selectPipelineBacktestResultSchema
>;

// ─── Execution Runs ──────────────────────────────────────────────────────────

/**
 * Pipeline Runs - execution history for scheduled and on-demand graph runs.
 * Tracks when each graph ran, whether it succeeded, node/error counts.
 */
export const pipelineRuns = pgTable(
  "pipeline_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    graphId: uuid("graph_id")
      .notNull()
      .references(() => pipelineGraphs.id, { onDelete: "cascade" }),
    /** Specific graph version that was executed */
    graphVersionId: uuid("graph_version_id")
      .notNull()
      .references(() => pipelineGraphs.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    finishedAt: timestamp("finished_at"),
    status: text("status", {
      enum: RunStatusDB,
    })
      .notNull()
      .default(RunStatus.RUNNING),
    errorCount: integer("error_count").notNull().default(0),
    nodeCount: integer("node_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pipeline_runs_graph").on(table.graphId),
    index("idx_pipeline_runs_started").on(table.startedAt),
  ],
);

export const selectPipelineRunSchema = createSelectSchema(pipelineRuns);
export const insertPipelineRunSchema = createInsertSchema(pipelineRuns);
export type PipelineRun = z.infer<typeof selectPipelineRunSchema>;
export type NewPipelineRun = z.infer<typeof insertPipelineRunSchema>;

// ─── Relations ────────────────────────────────────────────────────────────────

export const pipelineGraphsRelations = relations(
  pipelineGraphs,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [pipelineGraphs.ownerId],
      references: [users.id],
    }),
    datapoints: many(pipelineDatapoints),
    signals: many(pipelineSignals),
    backtestRuns: many(pipelineBacktestRuns),
    runs: many(pipelineRuns),
  }),
);

export const pipelineRunsRelations = relations(pipelineRuns, ({ one }) => ({
  graph: one(pipelineGraphs, {
    fields: [pipelineRuns.graphId],
    references: [pipelineGraphs.id],
  }),
}));

export const pipelineDatapointsRelations = relations(
  pipelineDatapoints,
  ({ one }) => ({
    graph: one(pipelineGraphs, {
      fields: [pipelineDatapoints.graphId],
      references: [pipelineGraphs.id],
    }),
  }),
);

export const pipelineSignalsRelations = relations(
  pipelineSignals,
  ({ one }) => ({
    graph: one(pipelineGraphs, {
      fields: [pipelineSignals.graphId],
      references: [pipelineGraphs.id],
    }),
  }),
);

export const pipelineBacktestRunsRelations = relations(
  pipelineBacktestRuns,
  ({ one, many }) => ({
    graph: one(pipelineGraphs, {
      fields: [pipelineBacktestRuns.graphId],
      references: [pipelineGraphs.id],
    }),
    results: many(pipelineBacktestResults),
  }),
);

export const pipelineBacktestResultsRelations = relations(
  pipelineBacktestResults,
  ({ one }) => ({
    run: one(pipelineBacktestRuns, {
      fields: [pipelineBacktestResults.runId],
      references: [pipelineBacktestRuns.id],
    }),
  }),
);

// ─── Snapshot TTL ─────────────────────────────────────────────────────────────

/**
 * Snapshot cache table - per-node TTL cache for persist: "snapshot" nodes.
 * Keyed by nodeId + range hash.
 */
export const pipelineSnapshots = pgTable(
  "pipeline_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nodeId: text("node_id").notNull(),
    /** SHA-256 hash of (nodeId + rangeFrom + rangeTo + resolution) */
    cacheKey: text("cache_key").notNull().unique(),
    data: jsonb("data")
      .$type<{
        points: Array<{
          timestamp: string;
          value: number;
          meta?: Record<string, string | number | boolean | null>;
        }>;
      }>()
      .notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pipeline_snapshots_key").on(table.cacheKey),
    index("idx_pipeline_snapshots_expires").on(table.expiresAt),
  ],
);

export const selectPipelineSnapshotSchema =
  createSelectSchema(pipelineSnapshots);
export type PipelineSnapshot = z.infer<typeof selectPipelineSnapshotSchema>;

// ─── Retention Metadata ───────────────────────────────────────────────────────

/**
 * Tracks retention config per node for the cleanup scheduler.
 */
export const pipelineRetentionConfig = pgTable("pipeline_retention_config", {
  nodeId: text("node_id").primaryKey(),
  maxRows: integer("max_rows"),
  maxAgeDays: integer("max_age_days"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
