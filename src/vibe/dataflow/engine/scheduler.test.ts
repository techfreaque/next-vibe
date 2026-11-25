import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock, setSystemTime } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../../core/i18n/core/config";
import { createEndpointLogger } from "../../logger/server";
import { TASK_TIMEOUTS } from "../../tasks/constants";
import { pipelineGraphs, pipelineRuns } from "../db";
import { GraphOwnerType, RunStatus } from "../enum";

const pg = new PGlite();
const db = drizzle(pg);
mock.module("../../database", () => ({ db }));

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE pipeline_graphs (
      id uuid PRIMARY KEY, slug text NOT NULL, name text NOT NULL, description text,
      owner_type text NOT NULL, owner_id uuid, parent_version_id uuid,
      config jsonb NOT NULL, is_active boolean NOT NULL DEFAULT true,
      created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now(),
      archived_at timestamp
    );
    CREATE TABLE pipeline_runs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      graph_id uuid NOT NULL REFERENCES pipeline_graphs(id),
      graph_version_id uuid NOT NULL REFERENCES pipeline_graphs(id),
      started_at timestamp NOT NULL DEFAULT now(), finished_at timestamp,
      status text NOT NULL, error_count integer NOT NULL DEFAULT 0,
      node_count integer NOT NULL DEFAULT 0, created_at timestamp NOT NULL DEFAULT now()
    );
  `);
});

afterAll(async () => {
  await pg.close();
});

it("reaps stale graph runs and schedules the newly unblocked graph", async () => {
  const { runDueGraphs } = await import("./scheduler");
  const { completeRun } = await import("../store/runs");
  const now = new Date();
  const cutoff = new Date(now.getTime() - 2 * TASK_TIMEOUTS.MEDIUM);
  const staleStart = new Date(cutoff.getTime() - 1);
  const staleGraph = crypto.randomUUID();
  const freshGraph = crypto.randomUUID();
  const completedGraph = crypto.randomUUID();
  const staleRun = crypto.randomUUID();
  const freshRun = crypto.randomUUID();
  const completedRun = crypto.randomUUID();
  const logger = createEndpointLogger(false, defaultLocale);

  await db.insert(pipelineGraphs).values(
    [
      { id: staleGraph, slug: "stale", schedule: "*/5 * * * *" },
      { id: freshGraph, slug: "fresh", schedule: "*/5 * * * *" },
      { id: completedGraph, slug: "completed", schedule: "0 */6 * * *" },
    ].map<typeof pipelineGraphs.$inferInsert>(({ id, slug, schedule }) => ({
      id,
      slug,
      name: slug,
      ownerType: GraphOwnerType.SYSTEM,
      config: { trigger: { type: "cron", schedule }, nodes: {}, edges: [] },
    })),
  );
  await db.insert(pipelineRuns).values([
    {
      id: staleRun,
      graphId: staleGraph,
      graphVersionId: staleGraph,
      startedAt: staleStart,
      status: RunStatus.RUNNING,
    },
    {
      id: freshRun,
      graphId: freshGraph,
      graphVersionId: freshGraph,
      startedAt: cutoff,
      status: RunStatus.RUNNING,
    },
    {
      id: completedRun,
      graphId: completedGraph,
      graphVersionId: completedGraph,
      startedAt: staleStart,
      finishedAt: cutoff,
      status: RunStatus.COMPLETED,
      nodeCount: 3,
    },
  ]);

  setSystemTime(now);
  try {
    expect(await runDueGraphs(logger)).toEqual({
      graphsChecked: 3,
      graphsExecuted: 1,
      errors: [],
    });
    await completeRun(staleRun, RunStatus.COMPLETED, 0, 5);
  } finally {
    setSystemTime();
  }

  const rows = await db.select().from(pipelineRuns);
  expect(rows).toHaveLength(4);
  expect(rows.find(({ id }) => id === staleRun)).toMatchObject({
    status: RunStatus.FAILED,
    finishedAt: now,
    errorCount: 1,
    nodeCount: 0,
  });
  expect(rows.find(({ id }) => id === freshRun)).toMatchObject({
    status: RunStatus.RUNNING,
    finishedAt: null,
  });
  expect(rows.find(({ id }) => id === completedRun)).toMatchObject({
    status: RunStatus.COMPLETED,
    finishedAt: cutoff,
    nodeCount: 3,
  });
  expect(
    rows.find(({ id, graphId }) => id !== staleRun && graphId === staleGraph),
  ).toMatchObject({ status: RunStatus.COMPLETED, errorCount: 0 });
});
