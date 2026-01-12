/**
 * SMTP Account Create Repository
 * Business logic for creating SMTP accounts
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { smtpAccounts } from "../db";
// SmtpAccountResponseType doesn't exist - we'll create the response directly
import type {
  SmtpAccountCreateRequestOutput,
  SmtpAccountCreateResponseOutput,
} from "./definition";

/**
 * SMTP Account Create Repository Interface
 */
interface SmtpAccountCreateRepository {
  createSmtpAccount(
    data: SmtpAccountCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountCreateResponseOutput>>;
}

/**
 * SMTP Account Create Repository Class
 * Handles all business logic for creating SMTP accounts
 */
class SmtpAccountCreateRepositoryImpl implements SmtpAccountCreateRepository {
  /**
   * Create a new SMTP account
   */
  async createSmtpAccount(
    data: SmtpAccountCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountCreateResponseOutput>> {
    try {
      logger.debug("Creating SMTP account", {
        name: data.accountInfo.name,
        userId: user.isPublic ? "public" : user.id,
      });

      // For create endpoint, we don't have isDefault in request, so skip this logic

      // Create the account
      const [newAccount] = await db
        .insert(smtpAccounts)
        .values({
          name: data.accountInfo.name,
          description: data.accountInfo.description,
          host: data.serverConfig.host,
          port: data.serverConfig.port,
          securityType: data.serverConfig.securityType,
          username: data.authentication.username,
          password: data.authentication.password,
          fromEmail: data.emailConfig.fromEmail,
          campaignTypes: data.emailConfig.campaignTypes,
          emailJourneyVariants: data.emailConfig.emailJourneyVariants,
          emailCampaignStages: data.emailConfig.emailCampaignStages,
          countries: data.emailConfig.countries,
          languages: data.emailConfig.languages,
        })
        .returning();

      if (!newAccount) {
        return fail({
          message: "app.api.emails.smtpClient.create.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: "app.api.emails.smtpClient.create.errors.server.description",
          },
        });
      }

      // Transform to response format with proper nested structure
      const responseAccount: SmtpAccountCreateResponseOutput = {
        account: {
          accountSummary: {
            id: newAccount.id,
            name: newAccount.name,
            description: newAccount.description || undefined,
            status: newAccount.status,
          },
          connectionDetails: {
            host: newAccount.host,
            port: newAccount.port,
            securityType: newAccount.securityType,
            username: newAccount.username,
            fromEmail: newAccount.fromEmail,
            healthCheckStatus: newAccount.healthCheckStatus,
            campaignTypes: newAccount.campaignTypes || undefined,
            emailJourneyVariants: newAccount.emailJourneyVariants || undefined,
            emailCampaignStages: newAccount.emailCampaignStages || undefined,
            countries: newAccount.countries || undefined,
            languages: newAccount.languages || undefined,
          },
          performanceMetrics: {
            priority: newAccount.priority || undefined,
            totalEmailsSent: newAccount.totalEmailsSent || 0,
            createdAt: newAccount.createdAt.toISOString(),
            updatedAt: newAccount.updatedAt.toISOString(),
          },
        },
      };

      logger.debug("SMTP account created successfully", {
        accountId: newAccount.id,
        name: newAccount.name,
        userId: user.isPublic ? "public" : user.id,
      });

      return success(responseAccount);
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Error creating SMTP account", parseError(error));

      // Check for unique constraint violations
      // PostgreSQL error code 23505 = unique_violation
      const isUniqueViolation =
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate") ||
        (typeof error === "object" &&
          error !== null &&
          "cause" in error &&
          typeof error.cause === "object" &&
          error.cause !== null &&
          "code" in error.cause &&
          error.cause.code === "23505");

      if (isUniqueViolation) {
        return fail({
          message: "app.api.emails.smtpClient.create.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
          messageParams: {
            error:
              "app.api.emails.smtpClient.create.errors.conflict.description",
          },
        });
      }

      return fail({
        message: "app.api.emails.smtpClient.create.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}

/**
 * Export singleton instance
 */
export const smtpAccountCreateRepository =
  new SmtpAccountCreateRepositoryImpl();
