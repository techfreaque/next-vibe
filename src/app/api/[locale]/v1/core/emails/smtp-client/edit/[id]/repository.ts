/**
 * SMTP Account Edit Repository
 * Business logic for editing SMTP accounts
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../../user/auth/types";
import { smtpAccounts } from "../../db";
import type { CampaignType, SmtpSecurityType } from "../../enum";
import type {
  SmtpAccountEditGETResponseOutput,
  SmtpAccountEditPUTResponseOutput,
} from "./definition";

// Explicit interface for update data (bypassing broken PUT type from definition)
interface SmtpAccountUpdateData {
  id: string;
  name?: string;
  description?: string;
  host?: string;
  port?: number;
  securityType?: (typeof SmtpSecurityType)[keyof typeof SmtpSecurityType];
  username?: string;
  password?: string;
  fromEmail?: string;
  priority?: number;
  isDefault?: boolean;
  campaignTypes?: Array<(typeof CampaignType)[keyof typeof CampaignType]>;
}

/**
 * SMTP Account Edit Repository Interface
 */
export interface SmtpAccountEditRepository {
  getSmtpAccount(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditGETResponseOutput>>;

  updateSmtpAccount(
    data: SmtpAccountUpdateData,
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
    urlPathParams: { id: string },
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditGETResponseOutput>> {
    try {
      logger.debug("Getting SMTP account", {
        accountId: urlPathParams.id,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.id, urlPathParams.id))
        .limit(1);

      if (!account) {
        return fail({
          message:
            "app.api.v1.core.emails.smtpClient.edit.id.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { accountId: urlPathParams.id },
        });
      }

      // Transform to response format - match endpoint definition exactly
      const response: SmtpAccountEditGETResponseOutput = {
        account: {
          id: account.id,
          name: account.name,
          description: account.description || undefined,
          host: account.host,
          port: account.port,
          securityType: account.securityType,
          username: account.username,
          fromEmail: account.fromEmail,
          status: account.status,
          healthCheckStatus: account.healthCheckStatus,
          priority: account.priority || undefined,
          totalEmailsSent: account.totalEmailsSent || 0,
          lastUsedAt: account.lastUsedAt?.toISOString() || null,
          createdAt: account.createdAt.toISOString(),
          updatedAt: account.updatedAt.toISOString(),
        },
      };

      logger.info("SMTP account retrieved successfully", {
        accountId: account.id,
        name: account.name,
        userId: user.id,
      });

      return success(response);
    } catch (error) {
      logger.error("Error getting SMTP account", parseError(error));
      return fail({
        message:
          "app.api.v1.core.emails.smtpClient.edit.id.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Update SMTP account
   */
  async updateSmtpAccount(
    data: SmtpAccountUpdateData,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountEditPUTResponseOutput>> {
    try {
      logger.info("Updating SMTP account", {
        accountId: data.id,
        updates: Object.keys(data).filter((k) => k !== "id"),
        userId: user.id,
      });

      // Check if account exists
      const [existingAccount] = await db
        .select()
        .from(smtpAccounts)
        .where(eq(smtpAccounts.id, data.id))
        .limit(1);

      if (!existingAccount) {
        return fail({
          message:
            "app.api.v1.core.emails.smtpClient.edit.id.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { accountId: data.id },
        });
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

      // Update the account - prepare update data excluding id field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...updateFields } = data;
      const updateData: Partial<typeof smtpAccounts.$inferInsert> = {
        ...updateFields,
        updatedAt: new Date(),
      };

      const [updatedAccount] = await db
        .update(smtpAccounts)
        .set(updateData)
        .where(eq(smtpAccounts.id, data.id))
        .returning();

      if (!updatedAccount) {
        return fail({
          message:
            "app.api.v1.core.emails.smtpClient.edit.id.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              "app.api.v1.core.emails.smtpClient.edit.id.errors.server.description",
          },
        });
      }

      // Transform to response format - match endpoint definition exactly
      const response: SmtpAccountEditPUTResponseOutput = {
        account: {
          id: updatedAccount.id,
          name: updatedAccount.name,
          description: updatedAccount.description || undefined,
          host: updatedAccount.host,
          port: updatedAccount.port,
          securityType: updatedAccount.securityType,
          username: updatedAccount.username,
          fromEmail: updatedAccount.fromEmail,
          status: updatedAccount.status,
          healthCheckStatus: updatedAccount.healthCheckStatus,
          priority: updatedAccount.priority || undefined,
          totalEmailsSent: updatedAccount.totalEmailsSent || 0,
          lastUsedAt: updatedAccount.lastUsedAt?.toISOString() || null,
          createdAt: updatedAccount.createdAt.toISOString(),
          updatedAt: updatedAccount.updatedAt.toISOString(),
        },
      };

      logger.info("SMTP account updated successfully", {
        accountId: updatedAccount.id,
        name: updatedAccount.name,
        userId: user.id,
      });

      return success(response);
    } catch (error) {
      logger.error("Error updating SMTP account", parseError(error));

      // Check for unique constraint violations
      const errorMessage = parseError(error).message;
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        return fail({
          message:
            "app.api.v1.core.emails.smtpClient.edit.id.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
          messageParams: { error: errorMessage },
        });
      }

      return fail({
        message:
          "app.api.v1.core.emails.smtpClient.edit.id.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }
}

/**
 * Export singleton instance
 */
export const smtpAccountEditRepository = new SmtpAccountEditRepositoryImpl();
