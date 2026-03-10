/**
 * Vibe Sense Seeds
 *
 * Ensures system seed graphs exist in the DB. Idempotent — safe to call
 * on every startup. Uses the auto-generated graph seeds index which
 * discovers graph-seeds.ts files colocated with their domain modules.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, eq } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { allGraphSeeds } from "@/app/api/[locale]/system/generated/graph-seeds-index";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { pipelineGraphs } from "./db";

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

export async function dev(logger: EndpointLogger): Promise<void> {
  logger.debug("Seeding vibe-sense graphs...");
  await ensureSeedGraphs(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export const priority = 5;
