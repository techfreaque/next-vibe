/**
 * SMTP Account Edit Repository
 * Business logic for editing SMTP accounts
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType } from "../../../../user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { db, smtpAccounts } from "../../db";
// SmtpAccountResponseType doesn't exist - we'll use the actual response types
import type {
  SmtpAccountEditGETRequestOutput,
  SmtpAccountEditGETResponseOutput,
  SmtpAccountEditPUTRequestOutput,
  SmtpAccountEditPUTResponseOutput,
} from "./definition";

/**
 * SMTP Account Edit Repository Interface
 */
export interface SmtpAccountEditRepository {
  getSmtpAccount(
    accountId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditGETResponseOutput>>;

  updateSmtpAccount(
    accountId: string,
    data: SmtpAccountEditPUTRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditPUTResponseOutput>>;
}

/**
 * SMTP Account Edit Repository Implementation
 * Handles all business logic for editing SMTP accounts
 */
class SmtpAccountEditRepositoryImpl implements SmtpAccountEditRepository {
  /**
   * Get SMTP account by ID
   */
  async getSmtpAccount(
    accountId: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditGETResponseOutput>> {
    try {
      logger.debug("Getting SMTP account", {
        accountId,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.id, accountId))
        .limit(1);

      if (!account) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.edit.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
          { accountId },
        );
      }

      // Transform to response format
      const responseAccount: SmtpAccountEditGETResponseOutput = {
        id: account.id,
        name: account.name,
        description: account.description || undefined,
        host: account.host,
        port: account.port,
        securityType: account.securityType,
        username: account.username,
        fromEmail: account.fromEmail,
        connectionTimeout: account.connectionTimeout || undefined,
        maxConnections: account.maxConnections || undefined,
        rateLimitPerHour: account.rateLimitPerHour || undefined,
        status: account.status,
        isDefault: account.isDefault || undefined,
        priority: account.priority || undefined,
        healthCheckStatus: account.healthCheckStatus,
        consecutiveFailures: account.consecutiveFailures || 0,
        lastHealthCheck: account.lastHealthCheck?.toISOString() || null,
        lastFailureAt: account.lastFailureAt?.toISOString() || null,
        lastFailureReason: account.lastFailureReason,
        emailsSentToday: account.emailsSentToday || 0,
        emailsSentThisMonth: account.emailsSentThisMonth || 0,
        totalEmailsSent: account.totalEmailsSent || 0,
        lastUsedAt: account.lastUsedAt?.toISOString() || null,
        metadata: account.metadata || undefined,
        // Add new multi-select fields to response
        campaignTypes: account.campaignTypes || [],
        emailJourneyVariants: account.emailJourneyVariants || [],
        emailCampaignStages: account.emailCampaignStages || [],
        countries: account.countries || [],
        languages: account.languages || [],
        isExactMatch: false,
        weight: 1,
        isFailover: false,
        failoverPriority: 0,

        createdBy: account.createdBy,
        updatedBy: account.updatedBy,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
      };

      logger.info("SMTP account retrieved successfully", {
        accountId: account.id,
        name: account.name,
        userId: user.id,
      });

      return createSuccessResponse(responseAccount);
    } catch (error) {
      logger.error("Error getting SMTP account", error);
      return createErrorResponse(
        "app.api.v1.core.emails.smtpClient.edit.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Update SMTP account
   */
  async updateSmtpAccount(
    data: SmtpAccountEditPUTRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditPUTResponseOutput>> {
    try {
      logger.info("Updating SMTP account", {
        accountId: data.id,
        updates: Object.keys(data),
        userId: user.id,
      });

      // Check if account exists
      const [existingAccount] = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.id, data.id))
        .limit(1);

      if (!existingAccount) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.edit.errors.not_found.title",
          ErrorResponseTypes.NOT_FOUND,
          { accountId: data.id },
        );
      }

      // Check if setting as default and unset other defaults for overlapping campaign types
      if (data.isDefault) {
        const campaignTypesToCheck =
          data.campaignTypes || existingAccount.campaignTypes;
        if (
          campaignTypesToCheck &&
          Array.isArray(campaignTypesToCheck) &&
          campaignTypesToCheck.length > 0
        ) {
          // For multi-select campaign types, we need to check for any overlapping types
          for (const campaignType of campaignTypesToCheck) {
            await db
              .update(smtpAccounts)
              .set({
                isDefault: false,
                updatedAt: new Date(),
              })
              .where(
                and(
                  sql`${smtpAccounts.campaignTypes} @> ${JSON.stringify([campaignType])}`,
                  eq(smtpAccounts.isDefault, true),
                  sql`id != ${data.id}`, // Don't update the current account
                ),
              );
          }
        }
      }

      // Update the account
      const [updatedAccount] = await db
        .update(smtpAccounts)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(smtpAccounts.id, data.id))
        .returning();

      if (!updatedAccount) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.edit.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            error:
              "app.api.v1.core.emails.smtpClient.edit.errors.server.description",
          },
        );
      }

      // Transform to response format
      const responseAccount: SmtpAccountEditGETResponseOutput = {
        id: updatedAccount.id,
        name: updatedAccount.name,
        description: updatedAccount.description || undefined,
        host: updatedAccount.host,
        port: updatedAccount.port,
        securityType: updatedAccount.securityType,
        username: updatedAccount.username,
        fromEmail: updatedAccount.fromEmail,
        connectionTimeout: updatedAccount.connectionTimeout || undefined,
        maxConnections: updatedAccount.maxConnections || undefined,
        rateLimitPerHour: updatedAccount.rateLimitPerHour || undefined,
        status: updatedAccount.status,
        isDefault: updatedAccount.isDefault || undefined,
        priority: updatedAccount.priority || undefined,
        healthCheckStatus: updatedAccount.healthCheckStatus,
        consecutiveFailures: updatedAccount.consecutiveFailures || 0,
        lastHealthCheck: updatedAccount.lastHealthCheck?.toISOString() || null,
        lastFailureAt: updatedAccount.lastFailureAt?.toISOString() || null,
        lastFailureReason: updatedAccount.lastFailureReason,
        emailsSentToday: updatedAccount.emailsSentToday || 0,
        emailsSentThisMonth: updatedAccount.emailsSentThisMonth || 0,
        totalEmailsSent: updatedAccount.totalEmailsSent || 0,
        lastUsedAt: updatedAccount.lastUsedAt?.toISOString() || null,
        metadata: updatedAccount.metadata || undefined,
        // Add new multi-select fields to response
        campaignTypes: updatedAccount.campaignTypes || [],
        emailJourneyVariants: updatedAccount.emailJourneyVariants || [],
        emailCampaignStages: updatedAccount.emailCampaignStages || [],
        countries: updatedAccount.countries || [],
        languages: updatedAccount.languages || [],
        isExactMatch: false,
        weight: 1,
        isFailover: false,
        failoverPriority: 0,

        createdBy: updatedAccount.createdBy,
        updatedBy: updatedAccount.updatedBy,
        createdAt: updatedAccount.createdAt.toISOString(),
        updatedAt: updatedAccount.updatedAt.toISOString(),
      };

      logger.info("SMTP account updated successfully", {
        accountId: updatedAccount.id,
        name: updatedAccount.name,
        userId: user.id,
      });

      return createSuccessResponse(responseAccount);
    } catch (error) {
      logger.error("Error updating SMTP account", error);

      // Check for unique constraint violations
      const errorMessage = parseError(error).message;
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.edit.errors.conflict.title",
          ErrorResponseTypes.CONFLICT,
          {
            error:
              "app.api.v1.core.emails.smtpClient.edit.errors.conflict.description",
          },
        );
      }

      return createErrorResponse(
        "app.api.v1.core.emails.smtpClient.edit.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: errorMessage },
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const smtpAccountEditRepository = new SmtpAccountEditRepositoryImpl();
