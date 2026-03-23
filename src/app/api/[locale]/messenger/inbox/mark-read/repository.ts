/**
 * Unified Inbox Mark-Read Repository
 * Routes markRead through the MessengerProvider interface - channel-agnostic.
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
  InboxMarkReadRequestOutput,
  InboxMarkReadResponseOutput,
} from "./definition";
import type { InboxMarkReadT } from "./i18n";

export class InboxMarkReadRepository {
  static async markRead(
    data: InboxMarkReadRequestOutput,
    logger: EndpointLogger,
    t: InboxMarkReadT,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMarkReadResponseOutput>> {
    try {
      logger.info("inbox.markRead: Processing request", {
        accountId: data.accountId,
        uid: data.uid,
        folderPath: data.folderPath,
        isRead: data.isRead,
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

      const result = await providerResult.data.markRead(
        data.accountId,
        data.uid,
        data.folderPath,
        data.isRead,
        logger,
        locale,
      );

      if (!result.success) {
        return result;
      }

      logger.info("inbox.markRead: Completed", {
        uid: data.uid,
        isRead: data.isRead,
      });

      return success({ updated: true });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("inbox.markRead: Critical error", parsed);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsed.message },
      });
    }
  }
}
