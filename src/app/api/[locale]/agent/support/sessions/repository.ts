import "server-only";

import { inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { supportSessions } from "../db";
import type { SupportT } from "../i18n";
import type { SessionsResponseOutput } from "./definition";

export class SessionsRepository {
  static async listSessions(
    logger: EndpointLogger,
    t: SupportT,
  ): Promise<ResponseType<SessionsResponseOutput>> {
    try {
      const rows = await db
        .select({
          id: supportSessions.id,
          threadId: supportSessions.threadId,
          initiatorInstanceUrl: supportSessions.initiatorInstanceUrl,
          supporterInstanceUrl: supportSessions.supporterInstanceUrl,
          status: supportSessions.status,
          createdAt: supportSessions.createdAt,
        })
        .from(supportSessions)
        .where(inArray(supportSessions.status, ["pending", "active"]))
        .orderBy(supportSessions.createdAt);

      return success({
        sessions: rows.map((row) => ({
          ...row,
          createdAt: row.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      logger.error("list sessions failed", parseError(error));
      return fail({
        message: t("sessions.errors.fetchFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
      });
    }
  }
}
