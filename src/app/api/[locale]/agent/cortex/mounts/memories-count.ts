import "server-only";

import { and, count as drizzleCount, eq, like } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import { MEMORIES_PREFIX } from "../repository";

/**
 * Count memory files in the user's cortex workspace.
 */
export async function countMemories(userId: string): Promise<number> {
  const result = await db
    .select({ count: drizzleCount() })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        eq(cortexNodes.nodeType, CortexNodeType.FILE),
        like(cortexNodes.path, `${MEMORIES_PREFIX}/%`),
      ),
    );
  return result[0]?.count ?? 0;
}
