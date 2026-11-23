/**
 * Conversion walls, server side: a person's chat send was refused for
 * missing credits (402) after the client's own guard let it through (stale
 * balance). Stored as a lead engagement next to the client-reported walls
 * (wall-beacon.ts), so the admin funnel counts every wall in one place.
 * Never fails the caller.
 */

import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leadEngagements } from "next-vibe/identity/lead/db";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import { WALL_META } from "./wall-meta";

export async function recordServerCreditWall(
  event: {
    leadId: string;
    isPublic: boolean;
    model: string;
  },
  logger: EndpointLogger,
): Promise<void> {
  try {
    await db.insert(leadEngagements).values({
      leadId: event.leadId,
      engagementType: EngagementTypes.CREDIT_WALL,
      metadata: {
        [WALL_META.model]: event.model,
        [WALL_META.who]: event.isPublic ? "guest" : "account",
        [WALL_META.via]: "server",
      },
    });
  } catch (error) {
    logger.error("Failed to record credit wall", parseError(error), {
      leadId: event.leadId,
    });
  }
}
