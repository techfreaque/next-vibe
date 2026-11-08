/**
 * Chat Moderation Repository
 * Admin-only: list reported / hidden public-feed + shared threads, then
 * dismiss (restore), remove, or ban the author.
 */

import "server-only";

import { and, desc, eq, gte, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatThreads, threadReports } from "../db";
import type { ThreadReportReason } from "../enum";
import { ThreadModerationAction, ThreadModerationStatus } from "../enum";
import { isAdmin } from "../permissions/permissions";
import type {
  ChatModerationGetResponseOutput,
  ChatModerationPatchRequestOutput,
  ChatModerationPatchResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";

type ReportReason =
  (typeof ThreadReportReason)[keyof typeof ThreadReportReason];

const BAN_REASON = "Banned by moderation: content policy violation";

export class ChatModerationRepository {
  static async listReported(
    data: { minReports?: number; limit?: number; offset?: number },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ChatModerationGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const minReports = data.minReports ?? 1;
      const limit = data.limit ?? 50;
      const offset = data.offset ?? 0;

      const rows = await db
        .select({
          id: chatThreads.id,
          title: chatThreads.title,
          rootFolderId: chatThreads.rootFolderId,
          authorId: chatThreads.userId,
          authorName: users.publicName,
          authorBanned: users.isBanned,
          moderationStatus: chatThreads.moderationStatus,
          reportCount: chatThreads.reportCount,
          updatedAt: chatThreads.updatedAt,
        })
        .from(chatThreads)
        .leftJoin(users, eq(chatThreads.userId, users.id))
        .where(
          and(
            inArray(chatThreads.rootFolderId, [
              DefaultFolderId.PUBLIC,
              DefaultFolderId.SHARED,
            ]),
            or(
              gte(chatThreads.reportCount, minReports),
              ne(chatThreads.moderationStatus, ThreadModerationStatus.VISIBLE),
            ),
          ),
        )
        .orderBy(
          // Under review first, then removed, then visible-with-reports
          sql`case ${chatThreads.moderationStatus} when ${ThreadModerationStatus.UNDER_REVIEW} then 0 when ${ThreadModerationStatus.REMOVED} then 1 else 2 end`,
          desc(chatThreads.reportCount),
        )
        .limit(limit)
        .offset(offset);

      const reports =
        rows.length === 0
          ? []
          : await db
              .select({
                threadId: threadReports.threadId,
                reason: threadReports.reason,
                note: threadReports.note,
              })
              .from(threadReports)
              .where(
                and(
                  inArray(
                    threadReports.threadId,
                    rows.map((r) => r.id),
                  ),
                  isNull(threadReports.resolvedAt),
                ),
              )
              .orderBy(desc(threadReports.createdAt));

      const threads = rows.map((row) => {
        const mine = reports.filter((r) => r.threadId === row.id);
        const tally = new Map<ReportReason, number>();
        for (const r of mine) {
          tally.set(r.reason, (tally.get(r.reason) ?? 0) + 1);
        }
        const reasons = [...tally.entries()]
          .toSorted((a, b) => b[1] - a[1])
          .map(([reason]) => reason);
        return {
          id: row.id,
          title: row.title,
          rootFolderId: row.rootFolderId,
          authorId: row.authorId ?? null,
          authorName: row.authorName ?? null,
          authorBanned: row.authorBanned ?? false,
          moderationStatus: row.moderationStatus,
          reportCount: row.reportCount,
          reasons,
          latestNote: mine.find((r) => r.note)?.note ?? null,
          updatedAt: row.updatedAt.toISOString(),
        };
      });

      return success({ threads, totalCount: threads.length });
    } catch (error) {
      logger.error(
        "ChatModerationRepository.listReported failed",
        parseError(error),
      );
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async moderate(
    data: ChatModerationPatchRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ChatModerationPatchResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const [thread] = await db
        .select({
          id: chatThreads.id,
          userId: chatThreads.userId,
          moderationStatus: chatThreads.moderationStatus,
          reportCount: chatThreads.reportCount,
        })
        .from(chatThreads)
        .where(eq(chatThreads.id, data.id))
        .limit(1);

      if (!thread) {
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const resolve = async (): Promise<void> => {
        await db
          .update(threadReports)
          .set({ resolvedAt: new Date() })
          .where(
            and(
              eq(threadReports.threadId, thread.id),
              isNull(threadReports.resolvedAt),
            ),
          );
      };

      if (data.action === ThreadModerationAction.DISMISS) {
        await resolve();
        await db
          .update(chatThreads)
          .set({
            moderationStatus: ThreadModerationStatus.VISIBLE,
            reportCount: 0,
          })
          .where(eq(chatThreads.id, thread.id));
        return success({
          patchId: thread.id,
          patchStatus: ThreadModerationStatus.VISIBLE,
          patchReportCount: 0,
          authorBanned: false,
        });
      }

      let authorBanned = false;
      if (data.action === ThreadModerationAction.BAN_AUTHOR) {
        if (!thread.userId) {
          return fail({
            message: t("patch.errors.noAuthor.title"),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }
        if (await isAdmin(thread.userId, logger, locale)) {
          return fail({
            message: t("patch.errors.forbidden.title"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        await db
          .update(users)
          .set({ isBanned: true, bannedReason: BAN_REASON })
          .where(eq(users.id, thread.userId));
        authorBanned = true;
        logger.warn(`Author ${thread.userId} banned via moderation`);
      }

      await resolve();
      await db
        .update(chatThreads)
        .set({ moderationStatus: ThreadModerationStatus.REMOVED })
        .where(eq(chatThreads.id, thread.id));

      return success({
        patchId: thread.id,
        patchStatus: ThreadModerationStatus.REMOVED,
        patchReportCount: thread.reportCount,
        authorBanned,
      });
    } catch (error) {
      logger.error(
        "ChatModerationRepository.moderate failed",
        parseError(error),
      );
      return fail({
        message: t("patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
