/**
 * Unified Messenger Account Create Repository
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { messengerAccounts } from "../db";
import type {
  MessengerAccountCreatePOSTRequestOutput,
  MessengerAccountCreatePOSTResponseOutput,
} from "./definition";
import type { MessengerAccountCreateT } from "./i18n";

export class MessengerAccountCreateRepository {
  static async createAccount(
    data: MessengerAccountCreatePOSTRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MessengerAccountCreateT,
  ): Promise<ResponseType<MessengerAccountCreatePOSTResponseOutput>> {
    try {
      logger.info("Creating messenger account", {
        name: data.name,
        channel: data.channel,
        provider: data.provider,
        userId: user.id,
      });

      // Check name uniqueness
      const existing = await db
        .select({ id: messengerAccounts.id })
        .from(messengerAccounts)
        .where(eq(messengerAccounts.name, data.name))
        .limit(1);

      if (existing.length > 0) {
        return fail({
          message: t("errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const [created] = await db
        .insert(messengerAccounts)
        .values({
          name: data.name,
          description: data.description,
          channel: data.channel,
          provider: data.provider,
          status: data.status,
          priority: data.priority,
          isDefault: data.isDefault,
          // SMTP outbound
          smtpHost: data.smtpHost,
          smtpPort: data.smtpPort,
          smtpSecurityType: data.smtpSecurityType,
          smtpUsername: data.smtpUsername,
          smtpPassword: data.smtpPassword,
          smtpFromEmail: data.smtpFromEmail,
          smtpConnectionTimeout: data.smtpConnectionTimeout,
          smtpMaxConnections: data.smtpMaxConnections,
          smtpRateLimitPerHour: data.smtpRateLimitPerHour,
          // API credentials
          apiKey: data.apiKey,
          apiToken: data.apiToken,
          apiSecret: data.apiSecret,
          fromId: data.fromId,
          webhookUrl: data.webhookUrl,
          // IMAP inbound
          imapHost: data.imapHost,
          imapPort: data.imapPort,
          imapSecure: data.imapSecure,
          imapUsername: data.imapUsername,
          imapPassword: data.imapPassword,
          imapAuthMethod: data.imapAuthMethod ?? null,
          imapSyncEnabled: data.imapSyncEnabled,
          imapSyncInterval: data.imapSyncInterval,
          imapMaxMessages: data.imapMaxMessages,
          // Email routing
          campaignTypes: data.campaignTypes,
          emailJourneyVariants: data.emailJourneyVariants,
          emailCampaignStages: data.emailCampaignStages,
          countries: data.countries,
          languages: data.languages,
          isExactMatch: data.isExactMatch,
          weight: data.weight,
          isFailover: data.isFailover,
          failoverPriority: data.failoverPriority,
          // Audit
          createdBy: user.id,
          updatedBy: user.id,
        })
        .returning();

      if (!created) {
        return fail({
          message: t("errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Messenger account created", { id: created.id });

      return success({
        account: {
          id: created.id,
          name: created.name,
          channel: created.channel,
          provider: created.provider,
          status: created.status,
          smtpFromEmail: created.smtpFromEmail ?? null,
          fromId: created.fromId ?? null,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        },
      });
    } catch (error) {
      logger.error("Error creating messenger account", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
