/**
 * Lead Auth Repository
 * Centralized repository for all lead ID management and authentication integration
 * Handles lead creation, validation, linking to users, and cookie management
 *
 * Updated for wallet-based credit system (no isPrimary, no leadLinks)
 */

import "server-only";

import { eq, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../core/i18n/core/language-utils";
import type { ResponseType } from "../../core/route/response.schema";
import { success } from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import type { EndpointLogger } from "../../logger/types";

import { leadLeadLinks, leads, userLeadLinks } from "./db";
import { LeadSource, LeadStatus } from "./enum";

/**
 * Lead Auth Repository
 * Static class for all lead ID management and authentication integration
 */
export class LeadAuthRepository {
  /**
   * Get leadId for authenticated user
   * With wallet-based system, we just get any linked lead (no primary concept)
   */
  static async getAuthenticatedUserLeadId(
    userId: string,
    cookieLeadId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ leadId: string; shouldUpdateCookie: boolean }> {
    // Get any leadId linked to this user
    const [userLeadLink] = await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId))
      .limit(1);

    if (!userLeadLink) {
      logger.debug("No lead found for user, creating one", { userId });
      const newLeadId = await LeadAuthRepository.createLeadForUser(
        userId,
        locale,
        logger,
      );
      return {
        leadId: newLeadId,
        shouldUpdateCookie: true,
      };
    }

    const shouldUpdate = cookieLeadId !== userLeadLink.leadId;
    logger.debug(`Found lead ${userLeadLink.leadId} for user ${userId}`);
    return {
      leadId: userLeadLink.leadId,
      shouldUpdateCookie: shouldUpdate,
    };
  }

  /**
   * Link leadId to user
   * Uses userLeadLinks table with UNIQUE constraint (prevents duplicates)
   */
  static async linkLeadToUser(
    leadId: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      await db
        .insert(userLeadLinks)
        .values({
          userId,
          leadId,
          linkReason: "signup",
        })
        .onConflictDoNothing();

      // Update lead status to SIGNED_UP if not already
      await db
        .update(leads)
        .set({
          status: LeadStatus.SIGNED_UP,
          signedUpAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId));

      logger.debug("Linked lead to user", { leadId, userId });
      return success();
    } catch (error) {
      logger.error("Failed to link lead to user", parseError(error).message);
      return success(); // Don't fail the operation
    }
  }

  /**
   * Validate that leadId exists in database
   */
  static async validateLeadId(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      const [lead] = await db
        .select({ id: leads.id })
        .from(leads)
        .where(eq(leads.id, leadId))
        .limit(1);

      return !!lead;
    } catch (error) {
      logger.error("Failed to validate leadId", parseError(error).message);
      return false;
    }
  }

  /**
   * Create lead for user (when user has no leads)
   */
  private static async createLeadForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    // Get user email
    const { users } = await import("../user/db");
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const { language, country } = getLanguageAndCountryFromLocale(locale);

    if (!user) {
      logger.error("User not found during lead creation", { userId });
      // Create fallback lead
      const [fallbackLead] = await db
        .insert(leads)
        .values({
          email: null,
          businessName: "",
          status: LeadStatus.SIGNED_UP,
          source: LeadSource.WEBSITE,
          country,
          language,
          metadata: {
            fallbackCreated: true,
            reason: "User not found during lead creation",
            userId,
          },
        })
        .returning();

      await db.insert(userLeadLinks).values({
        userId,
        leadId: fallbackLead.id,
        linkReason: "manual",
      });

      return fallbackLead.id;
    }

    // Check if a lead already exists with this email
    const [existingLead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.email, user.email))
      .limit(1);

    if (existingLead) {
      logger.debug("Lead already exists for user email, linking it", {
        userId,
        leadId: existingLead.id,
        email: user.email,
      });

      // Link existing lead to user (use onConflictDoNothing to handle race conditions)
      await db
        .insert(userLeadLinks)
        .values({
          userId,
          leadId: existingLead.id,
          linkReason: "login",
        })
        .onConflictDoNothing();

      return existingLead.id;
    }

    // Create new lead with user email
    const [newLead] = await db
      .insert(leads)
      .values({
        email: user.email,
        businessName: "",
        status: LeadStatus.SIGNED_UP,
        source: LeadSource.WEBSITE,
        country,
        language,
      })
      .returning();

    await db
      .insert(userLeadLinks)
      .values({
        userId,
        leadId: newLead.id,
        linkReason: "signup",
      })
      .onConflictDoNothing();

    logger.debug("Created lead for user", { userId, leadId: newLead.id });

    return newLead.id;
  }

  /**
   * Get all leadIds reachable from a given leadId via the leadLeadLinks graph.
   * Used at signup/login to merge all IP-linked lead wallets into the user pool.
   */
  static async getLinkedLeadIds(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    try {
      // Traverse the undirected leadLeadLinks graph from this lead
      const visited = new Set<string>([leadId]);
      const queue = [leadId];

      while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbors = await db
          .select({
            other: sql<string>`CASE WHEN ${leadLeadLinks.leadId1} = ${current} THEN ${leadLeadLinks.leadId2} ELSE ${leadLeadLinks.leadId1} END`,
          })
          .from(leadLeadLinks)
          .where(
            or(
              eq(leadLeadLinks.leadId1, current),
              eq(leadLeadLinks.leadId2, current),
            ),
          );

        for (const { other } of neighbors) {
          if (!visited.has(other)) {
            visited.add(other);
            queue.push(other);
          }
        }
      }

      // Return all linked leads excluding the starting lead itself
      return [...visited].filter((id) => id !== leadId);
    } catch (error) {
      logger.error("Failed to get linked lead IDs", parseError(error).message);
      return [];
    }
  }
}
