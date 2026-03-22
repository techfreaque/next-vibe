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
import {
  formatCount,
  formatSense,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import { GraphOwnerType } from "./enum";
import { pipelineGraphs } from "./db";

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

  logger.info(
    formatSense(
      `${formatCount(allGraphSeeds.length, "graph")} ready${created > 0 ? ` (${String(created)} new)` : ""}`,
    ),
  );
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
