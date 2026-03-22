/**
 * Unified Messenger Account Edit Repository (GET + PUT)
 */

import "server-only";

import { and, eq, ne } from "drizzle-orm";
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

import { messengerAccounts } from "../../db";
import type {
  MessengerAccountEditDELETEResponseOutput,
  MessengerAccountEditGETResponseOutput,
  MessengerAccountEditPUTRequestOutput,
  MessengerAccountEditPUTResponseOutput,
} from "./definition";
import type { MessengerAccountEditT } from "./i18n";

export class MessengerAccountEditRepository {
  private static mapAccount(
    account: typeof messengerAccounts.$inferSelect,
  ): MessengerAccountEditGETResponseOutput {
    return {
      id: account.id,
      name: account.name,
      description: account.description ?? null,
      channel: account.channel,
      provider: account.provider,
      status: account.status,
      healthStatus: account.healthStatus ?? null,
      isDefault: account.isDefault ?? false,
      priority: account.priority ?? 0,
      smtpHost: account.smtpHost ?? null,
      smtpPort: account.smtpPort ?? null,
      smtpSecurityType: account.smtpSecurityType ?? null,
      smtpUsername: account.smtpUsername ?? null,
      smtpFromEmail: account.smtpFromEmail ?? null,
      smtpFromName: account.smtpFromName ?? null,
      smtpConnectionTimeout: account.smtpConnectionTimeout ?? null,
      smtpMaxConnections: account.smtpMaxConnections ?? null,
      smtpRateLimitPerHour: account.smtpRateLimitPerHour ?? null,
      fromId: account.fromId ?? null,
      webhookUrl: account.webhookUrl ?? null,
      imapHost: account.imapHost ?? null,
      imapPort: account.imapPort ?? null,
      imapSecure: account.imapSecure ?? null,
      imapUsername: account.imapUsername ?? null,
      imapAuthMethod: account.imapAuthMethod ?? null,
      imapSyncEnabled: account.imapSyncEnabled ?? false,
      imapSyncInterval: account.imapSyncInterval ?? null,
      imapMaxMessages: account.imapMaxMessages ?? null,
      imapLastSyncAt: account.imapLastSyncAt ?? null,
      messagesSentTotal: account.messagesSentTotal ?? 0,
      lastUsedAt: account.lastUsedAt ?? null,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
  static async getAccount(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MessengerAccountEditT,
  ): Promise<ResponseType<MessengerAccountEditGETResponseOutput>> {
    try {
      logger.debug("Getting messenger account", {
        id: urlPathParams.id,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, urlPathParams.id))
        .limit(1);

      if (!account) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(MessengerAccountEditRepository.mapAccount(account));
    } catch (error) {
      logger.error("Error getting messenger account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async updateAccount(
    data: MessengerAccountEditPUTRequestOutput & { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MessengerAccountEditT,
  ): Promise<ResponseType<MessengerAccountEditPUTResponseOutput>> {
    try {
      logger.info("Updating messenger account", {
        id: data.id,
        userId: user.id,
      });

      // Check account exists
      const [existing] = await db
        .select()
        .from(messengerAccounts)
        .where(eq(messengerAccounts.id, data.id))
        .limit(1);

      if (!existing) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check name uniqueness if changed
      if (data.name && data.name !== existing.name) {
        const nameConflict = await db
          .select({ id: messengerAccounts.id })
          .from(messengerAccounts)
          .where(
            and(
              eq(messengerAccounts.name, data.name),
              ne(messengerAccounts.id, data.id),
            ),
          )
          .limit(1);

        if (nameConflict.length > 0) {
          return fail({
            message: t("errors.conflict.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
      }

      const updateValues: Partial<typeof messengerAccounts.$inferInsert> = {
        updatedBy: user.id,
        updatedAt: new Date(),
      };

      // Only update fields that were provided (non-null, non-undefined)
      if (data.name !== undefined && data.name !== null) {
        updateValues.name = data.name;
      }
      if (data.description !== undefined) {
        updateValues.description = data.description;
      }
      if (data.channel !== undefined && data.channel !== null) {
        updateValues.channel = data.channel;
      }
      if (data.provider !== undefined && data.provider !== null) {
        updateValues.provider = data.provider;
      }
      if (data.status !== undefined && data.status !== null) {
        updateValues.status = data.status;
      }
      if (data.priority !== undefined) {
        updateValues.priority = data.priority;
      }
      if (data.isDefault !== undefined) {
        updateValues.isDefault = data.isDefault;
      }
      // SMTP
      if (data.smtpHost !== undefined) {
        updateValues.smtpHost = data.smtpHost ?? null;
      }
      if (data.smtpPort !== undefined) {
        updateValues.smtpPort = data.smtpPort;
      }
      if (data.smtpSecurityType !== undefined) {
        updateValues.smtpSecurityType = data.smtpSecurityType ?? null;
      }
      if (data.smtpUsername !== undefined) {
        updateValues.smtpUsername = data.smtpUsername ?? null;
      }
      if (data.smtpPassword !== undefined && data.smtpPassword !== null) {
        updateValues.smtpPassword = data.smtpPassword;
      }
      if (data.smtpFromEmail !== undefined) {
        updateValues.smtpFromEmail = data.smtpFromEmail ?? null;
      }
      if (data.smtpFromName !== undefined) {
        updateValues.smtpFromName = data.smtpFromName ?? null;
      }
      if (data.smtpConnectionTimeout !== undefined) {
        updateValues.smtpConnectionTimeout = data.smtpConnectionTimeout;
      }
      if (data.smtpMaxConnections !== undefined) {
        updateValues.smtpMaxConnections = data.smtpMaxConnections;
      }
      if (data.smtpRateLimitPerHour !== undefined) {
        updateValues.smtpRateLimitPerHour = data.smtpRateLimitPerHour;
      }
      // API creds — only update if non-empty string provided
      if (data.apiKey) {
        updateValues.apiKey = data.apiKey;
      }
      if (data.apiToken) {
        updateValues.apiToken = data.apiToken;
      }
      if (data.apiSecret) {
        updateValues.apiSecret = data.apiSecret;
      }
      if (data.fromId !== undefined) {
        updateValues.fromId = data.fromId ?? null;
      }
      if (data.webhookUrl !== undefined) {
        updateValues.webhookUrl = data.webhookUrl ?? null;
      }
      // IMAP
      if (data.imapHost !== undefined) {
        updateValues.imapHost = data.imapHost ?? null;
      }
      if (data.imapPort !== undefined) {
        updateValues.imapPort = data.imapPort;
      }
      if (data.imapSecure !== undefined) {
        updateValues.imapSecure = data.imapSecure;
      }
      if (data.imapUsername !== undefined) {
        updateValues.imapUsername = data.imapUsername ?? null;
      }
      if (data.imapPassword) {
        updateValues.imapPassword = data.imapPassword;
      }
      if (data.imapAuthMethod !== undefined) {
        updateValues.imapAuthMethod = data.imapAuthMethod ?? null;
      }
      if (data.imapSyncEnabled !== undefined) {
        updateValues.imapSyncEnabled = data.imapSyncEnabled;
      }
      if (data.imapSyncInterval !== undefined) {
        updateValues.imapSyncInterval = data.imapSyncInterval;
      }
      if (data.imapMaxMessages !== undefined) {
        updateValues.imapMaxMessages = data.imapMaxMessages;
      }
      // Email routing
      if (data.campaignTypes !== undefined) {
        updateValues.campaignTypes = data.campaignTypes;
      }
      if (data.emailJourneyVariants !== undefined) {
        updateValues.emailJourneyVariants = data.emailJourneyVariants;
      }
      if (data.emailCampaignStages !== undefined) {
        updateValues.emailCampaignStages = data.emailCampaignStages;
      }
      if (data.countries !== undefined) {
        updateValues.countries = data.countries;
      }
      if (data.languages !== undefined) {
        updateValues.languages = data.languages;
      }
      if (data.isExactMatch !== undefined) {
        updateValues.isExactMatch = data.isExactMatch;
      }
      if (data.weight !== undefined) {
        updateValues.weight = data.weight;
      }
      if (data.isFailover !== undefined) {
        updateValues.isFailover = data.isFailover;
      }
      if (data.failoverPriority !== undefined) {
        updateValues.failoverPriority = data.failoverPriority;
      }

      const [updated] = await db
        .update(messengerAccounts)
        .set(updateValues)
        .where(eq(messengerAccounts.id, data.id))
        .returning();

      if (!updated) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Messenger account updated", { id: updated.id });
      return success(MessengerAccountEditRepository.mapAccount(updated));
    } catch (error) {
      logger.error("Error updating messenger account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static async deleteAccount(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MessengerAccountEditT,
  ): Promise<ResponseType<MessengerAccountEditDELETEResponseOutput>> {
    try {
      logger.info("Deleting messenger account", {
        id: urlPathParams.id,
        userId: user.id,
      });

      const [deleted] = await db
        .delete(messengerAccounts)
        .where(eq(messengerAccounts.id, urlPathParams.id))
        .returning();

      if (!deleted) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      logger.info("Messenger account deleted", { id: urlPathParams.id });
      return success({
        name: deleted.name,
        channel: deleted.channel,
      });
    } catch (error) {
      logger.error("Error deleting messenger account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
