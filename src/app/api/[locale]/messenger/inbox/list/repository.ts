/**
 * Unified Inbox List Repository
 * Routes listInbox through the MessengerProvider interface - channel-agnostic.
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
import type { CountryLanguage } from "@/i18n/core/config";

import { getProviderByMessengerAccountId } from "../../providers/registry";
import type {
  InboxListRequestOutput,
  InboxListResponseOutput,
} from "./definition";
import type { InboxListT } from "./i18n";

export class InboxListRepository {
  static async list(
    data: InboxListRequestOutput,
    logger: EndpointLogger,
    t: InboxListT,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxListResponseOutput>> {
    try {
      logger.info("inbox.list: Processing request", {
        accountId: data.accountId,
        folderPath: data.folderPath,
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

      const result = await providerResult.data.listInbox(
        data.accountId,
        data.folderPath,
        logger,
        locale,
      );

      if (!result.success) {
        return result;
      }

      return success({
        messages: result.data.map((msg) => ({
          uid: msg.uid,
          messageId: msg.messageId,
          subject: msg.subject,
          from: msg.from,
          to: msg.to,
          date: msg.date,
          isRead: msg.isRead,
          isFlagged: msg.isFlagged,
          folderPath: msg.folderPath,
          bodyText: msg.bodyText,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("inbox.list: Critical error", parsed);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsed.message },
      });
    }
  }
}
