/**
 * SMS Service Repository
 * Sends SMS notifications through the unified MessengerProvider interface.
 * Finds the default active SMS messaging account and routes through the provider registry.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { messengerAccounts } from "../accounts/db";
import type { CampaignType } from "../accounts/enum";
import { MessengerAccountStatus } from "../accounts/enum";
import { MessageChannel } from "../accounts/enum";
import { getProviderByMessengerAccountId } from "../providers/registry";
import type { EmailSendT } from "../send/i18n";

/**
 * SMS Send Request Type
 */
interface SmsSendProps {
  to: string;
  message: string;
  campaignType?: (typeof CampaignType)[keyof typeof CampaignType];
  leadId?: string;
  templateName?: string;
}

/**
 * SMS Send Response Type
 */
interface SmsSendResponse {
  result: {
    success: boolean;
    messageId: string;
    sentAt: string;
    provider?: string;
    cost?: number;
  };
}

/**
 * SMS Service Repository
 * Finds the default active SMS account and sends through the provider registry.
 */
export class SmsServiceRepository {
  static async sendSms(
    data: SmsSendProps,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: EmailSendT,
  ): Promise<ResponseType<SmsSendResponse>> {
    try {
      logger.debug("SMS service: Sending SMS notification", {
        to: data.to,
        messageLength: data.message.length,
        campaignType: data.campaignType ?? "unknown",
        userId: user.id,
      });

      // Find the default active SMS account from unified messenger_accounts
      const [account] = await db
        .select({ id: messengerAccounts.id })
        .from(messengerAccounts)
        .where(
          and(
            eq(messengerAccounts.channel, MessageChannel.SMS),
            eq(messengerAccounts.status, MessengerAccountStatus.ACTIVE),
          ),
        )
        .orderBy(messengerAccounts.priority)
        .limit(1);

      if (!account) {
        logger.warn("SMS service: No active SMS account configured", {
          to: data.to,
        });
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Route through provider registry
      const providerResult = await getProviderByMessengerAccountId(account.id);
      if (!providerResult.success) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const result = await providerResult.data.send(
        {
          to: data.to,
          text: data.message,
          leadId: data.leadId,
          userId: user.id,
        },
        logger,
        "en-US",
      );

      if (!result.success) {
        return fail({
          message: t("errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.debug("SMS service: SMS sent successfully", {
        messageId: result.data.messageId,
        to: data.to,
        provider: providerResult.data.name,
      });

      return success({
        result: {
          success: true,
          messageId: result.data.messageId,
          sentAt: new Date().toISOString(),
          provider: providerResult.data.name,
        },
      });
    } catch (error) {
      logger.error("SMS service: Critical error", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
