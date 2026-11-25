/**
 * Vibe Sense Seeds
 *
 * Ensures system seed graphs exist in the DB. Idempotent - safe to call
 * on every startup. Uses the auto-generated graph seeds index which
 * discovers graph-seeds.ts files colocated with their domain modules.
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import { and, eq, isNull, notInArray } from "drizzle-orm";

import { allGraphSeeds } from "@/generated/dataflow/graph-seeds-index";

import { parseError } from "../core/utils/parse-error";
import { db } from "../database";
import { maybeColorize, semantic } from "../logger/colors";
import type { EndpointLogger } from "../logger/types";
import { pipelineGraphs } from "./db";
import { GraphOwnerType } from "./enum";

/**
 * Ensure all seed graphs exist. Inserts missing ones, updates existing.
 */
async function ensureSeedGraphs(logger: EndpointLogger): Promise<void> {
  let created = 0;

  for (const seed of allGraphSeeds) {
    try {
      const [existing] = await db
        .select({ id: pipelineGraphs.id })
        .from(pipelineGraphs)
        .where(
          and(
            eq(pipelineGraphs.slug, seed.slug),
            eq(pipelineGraphs.ownerType, GraphOwnerType.SYSTEM),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .update(pipelineGraphs)
          .set({
            config: seed.config,
            name: seed.name,
            description: seed.description,
          })
          .where(eq(pipelineGraphs.id, existing.id));
        continue;
      }

      await db.insert(pipelineGraphs).values({
        slug: seed.slug,
        name: seed.name,
        description: seed.description,
        ownerType: GraphOwnerType.SYSTEM,
        ownerId: null,
        parentVersionId: null,
        config: seed.config,
        isActive: true,
      });

      created++;
    } catch (error) {
      logger.error(`Failed to seed graph: ${seed.slug}`, parseError(error));
    }
  }

  const archived = await archiveRetiredSeedGraphs(logger);

  logger.info(
    `📊 ${maybeColorize(`${semantic.sense}${allGraphSeeds.length} vibe sense graphs ready${created > 0 ? ` (${String(created)} new)` : ""}${archived > 0 ? ` (${String(archived)} retired)` : ""}`, semantic.sense)}`,
  );
}

/**
 * Archive system graphs whose seed no longer exists. A removed or renamed seed
 * otherwise stays listed forever with its old config, which the engine can no
 * longer run ("No data in this range"). Archive is a soft delete: rows and
 * datapoints stay. Admin/user branches are never touched.
 */
async function archiveRetiredSeedGraphs(
  logger: EndpointLogger,
): Promise<number> {
  const seedSlugs = allGraphSeeds.map((seed) => seed.slug);
  // An empty seed index means a broken build, not "retire everything".
  if (seedSlugs.length === 0) {
    return 0;
  }
  try {
    const retired = await db
      .update(pipelineGraphs)
      .set({ archivedAt: new Date(), isActive: false })
      .where(
        and(
          eq(pipelineGraphs.ownerType, GraphOwnerType.SYSTEM),
          isNull(pipelineGraphs.archivedAt),
          notInArray(pipelineGraphs.slug, seedSlugs),
        ),
      )
      .returning({ slug: pipelineGraphs.slug });
    if (retired.length > 0) {
      logger.info(
        `Retired vibe sense graphs without a seed: ${retired.map((row) => row.slug).join(", ")}`,
      );
    }
    return retired.length;
  } catch (error) {
    logger.error("Failed to retire old seed graphs", parseError(error));
    return 0;
  }
}

export async function dev(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export async function prod(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export async function test(logger: EndpointLogger): Promise<void> {
  await ensureSeedGraphs(logger);
}

export const priority = 5;
