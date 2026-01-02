/**
 * Lead Auth Repository
 * Centralized repository for all lead ID management and authentication integration
 * Handles lead creation, validation, linking to users, and cookie management
 *
 * Updated for wallet-based credit system (no isPrimary, no leadLinks)
 */

import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { CreditRepository } from "../../credits/repository";
import { leads, userLeadLinks } from "../db";
import { LeadSource, LeadStatus } from "../enum";

/**
 */
export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

/**
 * Lead Auth Repository
 * Static class for all lead ID management and authentication integration
 */
export class LeadAuthRepository {
  /**
   * Ensure public user has a valid leadId
   * Creates new lead if cookie missing or invalid
   */
  static async ensurePublicLeadId(
    cookieLeadId: string | undefined,
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ leadId: string; isNew: boolean }> {
    // If cookie has leadId, validate it
    if (cookieLeadId) {
      const isValid = await LeadAuthRepository.validateLeadId(cookieLeadId, logger);
      if (isValid) {
        logger.debug("Valid lead cookie found", { leadId: cookieLeadId });
        return { leadId: cookieLeadId, isNew: false };
      }
      logger.debug("Invalid lead cookie", { invalidLeadId: cookieLeadId });
    }

    // Create new anonymous lead
    const leadId = await LeadAuthRepository.createAnonymousLead(clientInfo, locale, logger);
    logger.debug("Created new anonymous lead", { leadId });
    return { leadId, isNew: true };
  }

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
      const newLeadId = await LeadAuthRepository.createLeadForUser(userId, locale, logger);
      return {
        leadId: newLeadId,
        shouldUpdateCookie: true,
      };
    }

    const shouldUpdate = cookieLeadId !== userLeadLink.leadId;
    logger.debug("Found lead for user", {
      userId,
      leadId: userLeadLink.leadId,
      shouldUpdateCookie: shouldUpdate,
    });
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
  static async validateLeadId(leadId: string, logger: EndpointLogger): Promise<boolean> {
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
   * Get or create leadId
   * Validates existing leadId or creates new one
   */
  static async getOrCreateLeadId(
    leadId: string | undefined,
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    // If leadId provided, validate it
    if (leadId) {
      const isValid = await LeadAuthRepository.validateLeadId(leadId, logger);
      if (isValid) {
        return leadId;
      }
      logger.debug("Invalid leadId provided, creating new one", {
        invalidLeadId: leadId,
      });
    }

    // Create new lead
    return await LeadAuthRepository.createAnonymousLead(clientInfo, locale, logger);
  }

  /**
   * Create anonymous lead for website visitors
   */
  private static async createAnonymousLead(
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    // Check for existing anonymous lead with same IP within last 5 minutes
    // to prevent duplicate lead creation from multiple simultaneous requests
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const conditions = [
      eq(leads.status, LeadStatus.WEBSITE_USER),
      eq(leads.source, LeadSource.WEBSITE),
      isNull(leads.email), // Anonymous leads have no email
      sql`${leads.createdAt} > ${fiveMinutesAgo}`,
    ];

    if (clientInfo.ipAddress) {
      conditions.push(sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`);
    }

    if (clientInfo.userAgent) {
      conditions.push(sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`);
    }

    const [existingLead] = await db
      .select()
      .from(leads)
      .where(and(...conditions))
      .limit(1);

    if (existingLead) {
      logger.debug("Found existing anonymous lead", {
        leadId: existingLead.id,
      });
      return existingLead.id;
    }

    // Extract country and language from locale
    const { language, country } = getLanguageAndCountryFromLocale(locale);

    // Create new anonymous lead
    const [newLead] = await db
      .insert(leads)
      .values({
        email: null,
        businessName: "",
        contactName: null,
        phone: null,
        website: null,
        country,
        language,
        source: LeadSource.WEBSITE,
        status: LeadStatus.WEBSITE_USER,
        notes: null,
        metadata: {
          anonymous: true,
          createdFromTracking: true,
          userAgent: clientInfo.userAgent ?? null,
          ipAddress: clientInfo.ipAddress ?? null,
          referer: clientInfo.referer ?? null,
          timestamp: new Date().toISOString(),
        },
      })
      .returning();

    logger.debug("Created new anonymous lead", { leadId: newLead.id });

    // Create credit wallet for new lead (triggers via getLeadBalance)
    await CreditRepository.getLeadBalance(newLead.id, logger);

    return newLead.id;
  }

  /**
   * Create lead for user (when user has no leads)
   */
  static async createLeadForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    // Get user email
    const { users } = await import("../../user/db");
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
   * Get all leadIds for a user
   */
  static async getUserLeadIds(userId: string, logger: EndpointLogger): Promise<string[]> {
    try {
      const userLeadRecords = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(eq(userLeadLinks.userId, userId));

      return userLeadRecords.map((record) => record.leadId);
    } catch (error) {
      logger.error("Failed to get user leads", parseError(error).message);
      return [];
    }
  }
}
