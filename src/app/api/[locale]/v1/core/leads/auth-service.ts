/**
 * Lead Auth Service
 * Centralized service for all lead ID management and authentication integration
 * Handles lead creation, validation, linking to users, and cookie management
 */

import "server-only";

import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { LEAD_ID_COOKIE_NAME } from "next-vibe/shared/constants";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { Environment, parseError } from "next-vibe/shared/utils";

import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { db } from "../system/db";
import type { EndpointLogger } from "../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { leadLinks, leads, userLeads } from "./db";
import { LeadSource, LeadStatus } from "./enum";

/**
 * Client information for lead creation
 */
export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

/**
 * Lead Auth Service Implementation
 */
class LeadAuthServiceImpl {
  /**
   * Ensure public user has a valid leadId
   * Creates new lead if cookie missing or invalid
   * @returns leadId and whether it was newly created
   */
  async ensurePublicLeadId(
    cookieLeadId: string | undefined,
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ leadId: string; isNew: boolean }> {
    try {
      // If cookie has leadId, validate it
      if (cookieLeadId) {
        const isValid = await this.validateLeadId(cookieLeadId, logger);
        if (isValid) {
          logger.debug("app.api.v1.core.leads.auth.public.validCookie", {
            leadId: cookieLeadId,
          });
          return { leadId: cookieLeadId, isNew: false };
        }
        logger.debug("app.api.v1.core.leads.auth.public.invalidCookie", {
          invalidLeadId: cookieLeadId,
        });
      }

      // Create new anonymous lead
      const leadId = await this.createAnonymousLead(clientInfo, locale, logger);
      logger.debug("app.api.v1.core.leads.auth.public.created", { leadId });
      return { leadId, isNew: true };
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.public.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Get primary leadId for authenticated user
   * Compares with cookie and determines if cookie should be updated
   * @returns primary leadId and whether cookie should be updated
   */
  async getAuthenticatedUserLeadId(
    userId: string,
    cookieLeadId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ leadId: string; shouldUpdateCookie: boolean }> {
    try {
      // Get primary leadId from user_leads table
      const [primaryUserLead] = await db
        .select()
        .from(userLeads)
        .where(and(eq(userLeads.userId, userId), eq(userLeads.isPrimary, true)))
        .limit(1);

      if (primaryUserLead) {
        const shouldUpdate = cookieLeadId !== primaryUserLead.leadId;
        logger.debug("app.api.v1.core.leads.auth.authenticated.primaryFound", {
          userId,
          leadId: primaryUserLead.leadId,
          shouldUpdateCookie: shouldUpdate,
        });
        return {
          leadId: primaryUserLead.leadId,
          shouldUpdateCookie: shouldUpdate,
        };
      }

      // No primary lead found - this shouldn't happen for authenticated users
      // Create one as fallback with proper locale
      logger.warn("app.api.v1.core.leads.auth.authenticated.noPrimary", {
        userId,
      });
      const leadId = await this.createLeadForUser(userId, locale, logger);
      return { leadId, shouldUpdateCookie: true };
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.authenticated.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Link leadId to user
   * Handles multiple leadIds per user
   * First linked lead becomes primary
   */
  async linkLeadToUser(
    leadId: string,
    userId: string,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Check if this link already exists
      const [existing] = await db
        .select()
        .from(userLeads)
        .where(and(eq(userLeads.userId, userId), eq(userLeads.leadId, leadId)))
        .limit(1);

      if (existing) {
        logger.debug("app.api.v1.core.leads.auth.link.alreadyExists", {
          leadId,
          userId,
        });
        return;
      }

      // Check if user has any leads (to determine if this should be primary)
      const existingLeads = await db
        .select()
        .from(userLeads)
        .where(eq(userLeads.userId, userId));

      const isPrimary = existingLeads.length === 0;

      // Create the link
      await db.insert(userLeads).values({
        userId,
        leadId,
        isPrimary,
      });

      // Update lead status to SIGNED_UP if not already
      await db
        .update(leads)
        .set({
          status: LeadStatus.SIGNED_UP,
          signedUpAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId));

      logger.debug("app.api.v1.core.leads.auth.link.created", {
        leadId,
        userId,
        isPrimary,
      });
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.link.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Validate that leadId exists in database
   */
  async validateLeadId(
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
      logger.error("app.api.v1.core.leads.auth.validate.error", parseError(error).message);
      return false;
    }
  }

  /**
   * Get or create leadId
   * Validates existing leadId or creates new one
   */
  async getOrCreateLeadId(
    leadId: string | undefined,
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    try {
      // If leadId provided, validate it
      if (leadId) {
        const isValid = await this.validateLeadId(leadId, logger);
        if (isValid) {
          return leadId;
        }
        logger.debug("app.api.v1.core.leads.auth.getOrCreate.invalid", {
          invalidLeadId: leadId,
        });
      }

      // Create new lead
      return await this.createAnonymousLead(clientInfo, locale, logger);
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.getOrCreate.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Create anonymous lead for website visitors
   */
  private async createAnonymousLead(
    clientInfo: ClientInfo,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    try {
      // Check for existing anonymous lead with same IP and user agent within last 5 minutes
      // to prevent duplicate lead creation from multiple simultaneous requests
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      // Build conditions array, only adding metadata checks if values exist
      const conditions = [
        eq(leads.status, LeadStatus.WEBSITE_USER),
        eq(leads.source, LeadSource.WEBSITE),
        isNull(leads.email), // Anonymous leads have no email
        sql`${leads.createdAt} > ${fiveMinutesAgo}`,
      ];

      if (clientInfo.ipAddress) {
        conditions.push(
          sql`${leads.metadata}->>'ipAddress' = ${clientInfo.ipAddress}`,
        );
      }

      if (clientInfo.userAgent) {
        conditions.push(
          sql`${leads.metadata}->>'userAgent' = ${clientInfo.userAgent}`,
        );
      }

      const [existingLead] = await db
        .select()
        .from(leads)
        .where(and(...conditions))
        .limit(1);

      if (existingLead) {
        logger.debug("app.api.v1.core.leads.auth.create.existingFound", {
          leadId: existingLead.id,
        });
        return existingLead.id;
      }

      // Extract country and language from locale using proper utility
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

      logger.debug("app.api.v1.core.leads.auth.create.success", {
        leadId: newLead.id,
      });
      return newLead.id;
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.create.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Create lead for user (fallback when user has no leads)
   * Public method - used by user repository to ensure all users have leadId
   */
  async createLeadForUser(
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    try {
      // Get user email
      const { users } = await import("../user/db");
      const [user] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
        throw new Error(`User not found: ${userId}`);
      }

      // Parse locale to get country and language using proper utility
      const { language, country } = getLanguageAndCountryFromLocale(locale);

      // Create lead with proper locale from request context
      const leadData = {
        email: user.email,
        businessName: "",
        status: LeadStatus.SIGNED_UP,
        source: LeadSource.WEBSITE,
        country,
        language,
      };
      const [newLead] = await db.insert(leads).values(leadData).returning();

      // Link to user as primary
      await db.insert(userLeads).values({
        userId,
        leadId: newLead.id,
        isPrimary: true,
      });

      logger.debug("app.api.v1.core.leads.auth.createForUser.success", {
        userId,
        leadId: newLead.id,
      });
      return newLead.id;
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.createForUser.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Set leadId cookie (server-side)
   */
  async setLeadIdCookie(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      const cookiesStore = await cookies();
      cookiesStore.set({
        name: LEAD_ID_COOKIE_NAME,
        value: leadId,
        httpOnly: false, // Needs to be readable by client
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });

      logger.debug("app.api.v1.core.leads.auth.cookie.set", { leadId });
      return createSuccessResponse(undefined);
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.cookie.error", parseError(error).message);
      return createErrorResponse(
        "app.api.v1.core.leads.auth.cookie.error",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get all leadIds for a user
   */
  async getUserLeadIds(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    try {
      const userLeadRecords = await db
        .select({ leadId: userLeads.leadId })
        .from(userLeads)
        .where(eq(userLeads.userId, userId))
        .orderBy(desc(userLeads.isPrimary), userLeads.linkedAt);

      return userLeadRecords.map((record) => record.leadId);
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.getUserLeads.error", parseError(error).message);
      return [];
    }
  }

  /**
   * Link two leadIds together (e.g., cookie leadId + email campaign leadId)
   * This creates a bidirectional link so we can find all related leads
   */
  async linkLeads(
    primaryLeadId: string,
    linkedLeadId: string,
    reason: string,
    metadata: Record<string, string | number | boolean>,
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Don't link a lead to itself
      if (primaryLeadId === linkedLeadId) {
        logger.debug("app.api.v1.core.leads.auth.linkLeads.sameId", {
          leadId: primaryLeadId,
        });
        return;
      }

      // Check if link already exists (either direction)
      const [existingLink] = await db
        .select()
        .from(leadLinks)
        .where(
          or(
            and(
              eq(leadLinks.primaryLeadId, primaryLeadId),
              eq(leadLinks.linkedLeadId, linkedLeadId),
            ),
            and(
              eq(leadLinks.primaryLeadId, linkedLeadId),
              eq(leadLinks.linkedLeadId, primaryLeadId),
            ),
          ),
        )
        .limit(1);

      if (existingLink) {
        logger.debug("app.api.v1.core.leads.auth.linkLeads.alreadyExists", {
          primaryLeadId,
          linkedLeadId,
        });
        return;
      }

      // Create the link
      await db.insert(leadLinks).values({
        primaryLeadId,
        linkedLeadId,
        linkReason: reason,
        metadata,
      });

      logger.debug("app.api.v1.core.leads.auth.linkLeads.created", {
        primaryLeadId,
        linkedLeadId,
        reason,
      });
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.linkLeads.error", parseError(error).message);
      // eslint-disable-next-line no-restricted-syntax
      throw error;
    }
  }

  /**
   * Get all linked leadIds for a given leadId
   * Returns all leads that are linked to this lead (in either direction)
   */
  async getLinkedLeadIds(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    try {
      // Get all links where this leadId is either primary or linked
      const links = await db
        .select()
        .from(leadLinks)
        .where(
          or(
            eq(leadLinks.primaryLeadId, leadId),
            eq(leadLinks.linkedLeadId, leadId),
          ),
        );

      // Extract all unique leadIds (excluding the input leadId)
      const linkedIds = new Set<string>();
      for (const link of links) {
        if (link.primaryLeadId !== leadId) {
          linkedIds.add(link.primaryLeadId);
        }
        if (link.linkedLeadId !== leadId) {
          linkedIds.add(link.linkedLeadId);
        }
      }

      return Array.from(linkedIds);
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.getLinkedLeads.error", parseError(error).message);
      return [];
    }
  }

  /**
   * Get all leadIds in a lead cluster (including the input leadId)
   * This recursively finds all linked leads
   */
  async getAllLinkedLeadIds(
    leadId: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    try {
      const visited = new Set<string>();
      const toVisit = [leadId];
      const allLeadIds = new Set<string>([leadId]);

      while (toVisit.length > 0) {
        const currentLeadId = toVisit.pop()!;
        if (visited.has(currentLeadId)) {
          continue;
        }
        visited.add(currentLeadId);

        const linked = await this.getLinkedLeadIds(currentLeadId, logger);
        for (const linkedId of linked) {
          allLeadIds.add(linkedId);
          if (!visited.has(linkedId)) {
            toVisit.push(linkedId);
          }
        }
      }

      return Array.from(allLeadIds);
    } catch (error) {
      logger.error("app.api.v1.core.leads.auth.getAllLinkedLeads.error", parseError(error).message);
      return [leadId]; // Return at least the input leadId
    }
  }
}

// Export singleton instance
export const leadAuthService = new LeadAuthServiceImpl();
