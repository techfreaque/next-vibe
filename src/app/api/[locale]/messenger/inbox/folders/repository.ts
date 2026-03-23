/**
 * Unified Inbox Folders Repository
 * Routes listFolders through the MessengerProvider interface - channel-agnostic.
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
  InboxFoldersRequestOutput,
  InboxFoldersResponseOutput,
} from "./definition";
import type { InboxFoldersT } from "./i18n";

export class InboxFoldersRepository {
  static async list(
    data: InboxFoldersRequestOutput,
    logger: EndpointLogger,
    t: InboxFoldersT,
    locale: CountryLanguage,
  ): Promise<ResponseType<InboxFoldersResponseOutput>> {
    try {
      logger.info("inbox.folders: Processing request", {
        accountId: data.accountId,
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

      const result = await providerResult.data.listFolders(
        data.accountId,
        logger,
        locale,
      );

      if (!result.success) {
        return result;
      }

      return success({
        folders: result.data.map((folder) => ({
          path: folder.path,
          name: folder.name,
          displayName: folder.displayName,
          specialUseType: folder.specialUseType,
          messageCount: folder.messageCount,
          unseenCount: folder.unseenCount,
        })),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("inbox.folders: Critical error", parsed);
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsed.message },
      });
    }
  }
}
