/**
 * SMTP Account Create Repository
 * Business logic for creating SMTP accounts
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

// Removed unused imports
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import type { JwtPayloadType } from "../../../user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { db, smtpAccounts } from "../db";
// SmtpAccountResponseType doesn't exist - we'll create the response directly
import type {
  SmtpAccountCreateRequestTypeOutput,
  SmtpAccountCreateResponseTypeOutput,
} from "./definition";

/**
 * SMTP Account Create Repository Interface
 */
interface SmtpAccountCreateRepository {
  createSmtpAccount(
    data: SmtpAccountCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountCreateResponseTypeOutput>>;
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
    data: SmtpAccountCreateRequestTypeOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<SmtpAccountCreateResponseTypeOutput>> {
    try {
      logger.debug("Creating SMTP account", {
        name: data.name,
        userId: user.isPublic ? "public" : user.id,
      });

      // For create endpoint, we don't have isDefault in request, so skip this logic

      // Create the account
      const [newAccount] = await db
        .insert(smtpAccounts)
        .values({
          name: data.name,
          description: data.description,
          host: data.host,
          port: data.port,
          securityType: data.securityType,
          username: data.username,
          password: data.password,
          fromEmail: data.fromEmail,
        })
        .returning();

      if (!newAccount) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.create.errors.server.title",
          ErrorResponseTypes.INTERNAL_ERROR,
          {
            error:
              "app.api.v1.core.emails.smtpClient.create.errors.server.description",
          },
        );
      }

      // Transform to response format
      const responseAccount: SmtpAccountCreateResponseTypeOutput = {
        account: {
          id: newAccount.id,
          name: newAccount.name,
          description: newAccount.description || undefined,
          host: newAccount.host,
          port: newAccount.port,
          securityType: newAccount.securityType,
          username: newAccount.username,
          fromEmail: newAccount.fromEmail,
          status: newAccount.status,
          healthCheckStatus: newAccount.healthCheckStatus,
          priority: newAccount.priority || undefined,
          totalEmailsSent: newAccount.totalEmailsSent || 0,
          createdAt: newAccount.createdAt.toISOString(),
          updatedAt: newAccount.updatedAt.toISOString(),
        },
      };

      logger.debug("SMTP account created successfully", {
        accountId: newAccount.id,
        name: newAccount.name,
        userId: user.isPublic ? "public" : user.id,
      });

      return createSuccessResponse(responseAccount);
    } catch (error) {
      logger.error("Error creating SMTP account", error);

      // Check for unique constraint violations
      const errorMessage = parseError(error).message;
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        return createErrorResponse(
          "app.api.v1.core.emails.smtpClient.create.errors.conflict.title",
          ErrorResponseTypes.CONFLICT,
          {
            error:
              "app.api.v1.core.emails.smtpClient.create.errors.conflict.description",
          },
        );
      }

      return createErrorResponse(
        "app.api.v1.core.emails.smtpClient.create.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const smtpAccountCreateRepository =
  new SmtpAccountCreateRepositoryImpl();
