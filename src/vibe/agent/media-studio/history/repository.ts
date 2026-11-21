import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { studioHistoryPage } from "../history";
import { MEDIA_HISTORY_MAX_LIMIT } from "./constants";
import type {
  MediaHistoryRequestOutput,
  MediaHistoryResponseOutput,
} from "./definition";
import type { MediaHistoryT } from "./i18n";

export class MediaHistoryRepository {
  static async list(
    data: MediaHistoryRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MediaHistoryT,
  ): Promise<ResponseType<MediaHistoryResponseOutput>> {
    const limit = Math.min(
      Math.max(Math.floor(data.paginationInfo.limit), 1),
      MEDIA_HISTORY_MAX_LIMIT,
    );
    const page = Math.max(Math.floor(data.paginationInfo.page), 1);
    try {
      const { items, totalCount } = await studioHistoryPage(user, {
        kind: data.kind,
        page,
        limit,
      });
      return success({
        items: items.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })),
        paginationInfo: {
          totalCount,
          pageCount: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      logger.error("Could not load Media Studio history", {
        ...parseError(error),
        kind: data.kind,
        page,
      });
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}
