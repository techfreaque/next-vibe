/**
 * Unified Inbox Move Repository
 * Routes moveMessage through the MessengerProvider interface — channel-agnostic.
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
  InboxMoveRequestOutput,
  InboxMoveResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class InboxMoveRepository {
  static async move(
    data: InboxMoveRequestOutput,
    logger: EndpointLogger,
    t: ModuleT,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxMoveResponseOutput>> {
    try {
      logger.info("inbox.move: Processing request", {
        accountId: data.accountId,
        uid: data.uid,
        fromFolder: data.fromFolder,
        toFolder: data.toFolder,
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

      const result = await providerResult.data.moveMessage(
        data.accountId,
        data.uid,
        data.fromFolder,
        data.toFolder,
        logger,
        locale,
      );

      if (!result.success) {
        return result;
      }

      logger.info("inbox.move: Completed", {
        uid: data.uid,
        fromFolder: data.fromFolder,
        toFolder: data.toFolder,
      });

      return success({ moved: true });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("inbox.move: Critical error", parsed);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsed.message },
      });
    }
  }
}
