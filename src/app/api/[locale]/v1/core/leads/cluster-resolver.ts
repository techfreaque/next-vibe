/**
 * Lead Cluster Resolver
 *
 * Handles resolution of linked lead clusters without relying on isPrimary flags.
 * Leads can be linked in complex many-to-many relationships through:
 * - leadLinks table (lead-to-lead links)
 * - userLeads table (user-to-lead links)
 *
 * The "canonical" lead for a cluster is always the OLDEST lead by createdAt timestamp.
 */

import "server-only";

import { eq, or, inArray } from "drizzle-orm";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import { leads, leadLinks, userLeads } from "./db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

/**
 * Find all leads in a cluster starting from a single leadId
 * Uses breadth-first search to traverse the lead link graph
 */
export async function getAllLinkedLeadIds(
  startLeadId: string,
  logger?: EndpointLogger,
): Promise<string[]> {
  const visited = new Set<string>();
  const queue: string[] = [startLeadId];
  visited.add(startLeadId);

  while (queue.length > 0) {
    const currentLeadId = queue.shift()!;

    // Find all leads linked to current lead (bidirectional)
    const links = await db
      .select()
      .from(leadLinks)
      .where(
        or(
          eq(leadLinks.primaryLeadId, currentLeadId),
          eq(leadLinks.linkedLeadId, currentLeadId),
        ),
      );

    for (const link of links) {
      const nextLeadId =
        link.primaryLeadId === currentLeadId
          ? link.linkedLeadId
          : link.primaryLeadId;

      if (!visited.has(nextLeadId)) {
        visited.add(nextLeadId);
        queue.push(nextLeadId);
      }
    }
  }

  logger?.debug("Resolved lead cluster", {
    startLeadId,
    clusterSize: visited.size,
    leadIds: [...visited],
  });

  return [...visited];
}

/**
 * Find all leads linked to a userId
 */
export async function getAllLeadsForUser(
  userId: string,
  logger?: EndpointLogger,
): Promise<string[]> {
  const userLeadLinks = await db
    .select({ leadId: userLeads.leadId })
    .from(userLeads)
    .where(eq(userLeads.userId, userId));

  const leadIds = userLeadLinks.map((link) => link.leadId);

  logger?.debug("Found leads for user", {
    userId,
    leadCount: leadIds.length,
    leadIds,
  });

  return leadIds;
}

/**
 * Find the oldest (canonical) lead in a cluster
 * The oldest lead by createdAt is the source of truth for:
 * - Credit balance (leadCredits table)
 * - Transaction history (creditTransactions table)
 */
export async function findOldestLeadInCluster(
  leadIds: string[],
  logger?: EndpointLogger,
): Promise<string | null> {
  if (leadIds.length === 0) {
    return null;
  }

  if (leadIds.length === 1) {
    return leadIds[0];
  }

  // Get all leads and find oldest by createdAt
  const allLeads = await db
    .select({ id: leads.id, createdAt: leads.createdAt })
    .from(leads)
    .where(inArray(leads.id, leadIds))
    .orderBy(leads.createdAt); // ASC - oldest first

  if (allLeads.length === 0) {
    logger?.error("No leads found for cluster", { leadIds });
    return null;
  }

  const oldestLead = allLeads[0];

  logger?.debug("Found oldest lead in cluster", {
    oldestLeadId: oldestLead.id,
    createdAt: oldestLead.createdAt,
    clusterSize: leadIds.length,
  });

  return oldestLead.id;
}

/**
 * Get the canonical leadId for a user
 * Finds all leads for user, then returns the oldest one
 */
export async function getCanonicalLeadForUser(
  userId: string,
  logger?: EndpointLogger,
): Promise<string | null> {
  const leadIds = await getAllLeadsForUser(userId, logger);

  if (leadIds.length === 0) {
    logger?.warn("No leads found for user", { userId });
    return null;
  }

  return findOldestLeadInCluster(leadIds, logger);
}

/**
 * Get the full cluster starting from any leadId
 * Returns the oldest leadId and all leadIds in the cluster
 */
export async function resolveLeadCluster(
  leadId: string,
  logger?: EndpointLogger,
): Promise<{ oldestLeadId: string; allLeadIds: string[] }> {
  const allLeadIds = await getAllLinkedLeadIds(leadId, logger);
  const oldestLeadId = await findOldestLeadInCluster(allLeadIds, logger);

  if (!oldestLeadId) {
    // Fallback: if we can't find oldest, use the provided leadId
    logger?.warn("Could not find oldest lead, using provided leadId", {
      leadId,
    });
    return { oldestLeadId: leadId, allLeadIds: [leadId] };
  }

  return { oldestLeadId, allLeadIds };
}
