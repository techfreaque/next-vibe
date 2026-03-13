/**
 * Unified Messenger Send Repository
 * Routes all sends through the MessengerProvider interface — channel-agnostic.
 * Caller supplies accountId (from messenger_accounts); provider is resolved automatically.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { getProviderByMessengerAccountId } from "../providers/registry";
import type {
  MessengerSendRequestOutput,
  MessengerSendResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class MessengerSendRepository {
  static async send(
    data: MessengerSendRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ModuleT,
    locale: CountryLanguage,
  ): Promise<ResponseType<MessengerSendResponseOutput>> {
    try {
      logger.info("Messenger send: Processing request", {
        accountId: data.accountId,
        to: data.to,
        subject: data.subject,
        userId: user.id,
      });

      const providerResult = await getProviderByMessengerAccountId(
        data.accountId,
      );
      if (!providerResult.success) {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const provider = providerResult.data;

      const sendResult = await provider.send(
        {
          to: data.to,
          toName: data.toName,
          subject: data.subject,
          text: data.text,
          html: data.html,
          replyTo: data.replyTo,
          senderName: data.senderName,
          leadId: data.leadId,
          campaignId: data.campaignId,
          userId: user.id,
        },
        logger,
        locale,
      );

      if (!sendResult.success) {
        logger.error("Messenger send: Provider send failed", {
          error: sendResult.message,
          accountId: data.accountId,
          to: data.to,
        });
        return sendResult;
      }

      logger.info("Messenger send: Completed", {
        messageId: sendResult.data.messageId,
        provider: provider.name,
        channel: provider.channel,
      });

      return success({
        response: {
          messageId: sendResult.data.messageId,
          accountName: sendResult.data.accountName,
          channel: String(provider.channel),
          provider: provider.name,
          sentAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Messenger send: Critical error", parsedError);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
