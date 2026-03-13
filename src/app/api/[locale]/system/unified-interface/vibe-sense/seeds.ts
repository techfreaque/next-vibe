/**
 * Vibe Sense Seeds
 *
 * Ensures system seed graphs exist in the DB. Idempotent — safe to call
 * on every startup. Uses the auto-generated graph seeds index which
 * discovers graph-seeds.ts files colocated with their domain modules.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { allGraphSeeds } from "@/app/api/[locale]/system/generated/graph-seeds-index";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { pipelineDatapoints, pipelineGraphs } from "./db";
import { runGraph } from "./engine/runner";

/**
 * Ensure all seed graphs exist. Inserts missing ones, updates existing.
 * Returns the number of seeds newly created.
 */
async function ensureSeedGraphs(logger: EndpointLogger): Promise<number> {
  let created = 0;

  for (const seed of allGraphSeeds) {
    try {
      // Check if already exists
      const [existing] = await db
        .select({ id: pipelineGraphs.id })
        .from(pipelineGraphs)
        .where(
          and(
            eq(pipelineGraphs.slug, seed.slug),
            eq(pipelineGraphs.ownerType, "system"),
          ),
        )
        .limit(1);

      if (existing) {
        // Update config if it changed (e.g. was empty from prior bad insert)
        await db
          .update(pipelineGraphs)
          .set({
            config: seed.config,
            name: seed.name,
            description: seed.description,
          })
          .where(eq(pipelineGraphs.id, existing.id));
        logger.debug(`Updated seed graph config: ${seed.slug}`);
        continue;
      }

      // Insert seed
      await db.insert(pipelineGraphs).values({
        slug: seed.slug,
        name: seed.name,
        description: seed.description,
        ownerType: "system",
        ownerId: null,
        parentVersionId: null,
        config: seed.config,
        isActive: true,
      });

      created++;
      logger.info(`Seeded graph: ${seed.slug}`);
    } catch (error) {
      logger.error(`Failed to seed graph: ${seed.slug}`, parseError(error));
    }
  }

  if (created > 0) {
    logger.info(`Seeded ${String(created)} new graph(s)`);
  }

  return created;
}

/**
 * Backfill historical data for active system graphs.
 *
 * For each active system graph, check if any datapoints exist already.
 * If not, run the graph in weekly chunks going back 365 days so the
 * chart view has real historical data from day one.
 *
 * Only runs when there are no datapoints at all — safe to call repeatedly.
 */
async function backfillGraphHistory(logger: EndpointLogger): Promise<void> {
  // Check if any datapoints exist at all — skip backfill if already populated
  const existing = await db
    .select({ id: pipelineDatapoints.id })
    .from(pipelineDatapoints)
    .limit(1);

  if (existing.length > 0) {
    logger.debug("[vibe-sense] Datapoints already exist — skipping backfill");
    return;
  }

  // Load all active system graphs
  const graphs = await db
    .select({
      id: pipelineGraphs.id,
      slug: pipelineGraphs.slug,
      config: pipelineGraphs.config,
    })
    .from(pipelineGraphs)
    .where(
      and(
        eq(pipelineGraphs.isActive, true),
        eq(pipelineGraphs.ownerType, "system"),
        isNull(pipelineGraphs.archivedAt),
      ),
    );

  if (graphs.length === 0) {
    logger.debug("[vibe-sense] No active system graphs to backfill");
    return;
  }

  const BACKFILL_DAYS = 365;
  const CHUNK_DAYS = 7; // Run in weekly chunks to avoid huge single queries
  const now = new Date();
  const start = new Date(now.getTime() - BACKFILL_DAYS * 24 * 60 * 60 * 1000);

  logger.info(
    `[vibe-sense] Backfilling ${String(graphs.length)} graph(s) over ${String(BACKFILL_DAYS)} days...`,
  );

  for (const graph of graphs) {
    let chunkErrors = 0;
    let chunkFrom = new Date(start);

    while (chunkFrom < now) {
      const chunkTo = new Date(
        Math.min(
          chunkFrom.getTime() + CHUNK_DAYS * 24 * 60 * 60 * 1000,
          now.getTime(),
        ),
      );

      try {
        await runGraph(
          graph.id,
          graph.config,
          { from: chunkFrom, to: chunkTo },
          undefined,
          { readOnly: false },
        );
      } catch (error) {
        chunkErrors++;
        logger.error(
          `[vibe-sense] Backfill chunk failed for ${graph.slug}`,
          parseError(error),
        );
      }

      chunkFrom = chunkTo;
    }

    logger.info(
      `[vibe-sense] Backfilled ${graph.slug}${chunkErrors > 0 ? ` (${String(chunkErrors)} chunk errors)` : ""}`,
    );
  }

  logger.info("[vibe-sense] Backfill complete");
}

export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("Seeding vibe-sense graphs...");
  await ensureSeedGraphs(logger);
  await backfillGraphHistory(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export const priority = 5;
