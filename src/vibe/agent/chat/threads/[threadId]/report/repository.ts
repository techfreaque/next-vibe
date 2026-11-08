/**
 * Thread Report Repository
 * Submit a report against a PUBLIC-feed or SHARED thread. Rate-limited per
 * lead and per IP; auto-hides (UNDER_REVIEW) at the threshold.
 */

import "server-only";

import { and, count, eq, gt, inArray, isNull } from "drizzle-orm";
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
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { NextRequest } from "next-vibe/ui/lib/request";

import { chatFolders, chatThreads, threadReports } from "../../../db";
import {
  ThreadModerationStatus,
  ThreadReportReason,
  ThreadStatus,
} from "../../../enum";
import {
  THREAD_AUTO_HIDE_REPORT_THRESHOLD,
  THREAD_AUTO_HIDE_SEVERE_THRESHOLD,
  THREAD_REPORT_MAX_PER_IP,
  THREAD_REPORT_MAX_PER_LEAD,
  THREAD_REPORT_WINDOW_MS,
} from "../../../moderation/constants";
import { hashReporterIp } from "../../../moderation/hash-ip";
import { canViewThread } from "../../../permissions/permissions";
import type { ThreadReportPostResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const SEVERE_REASONS = [
  ThreadReportReason.CSAM_FLAG,
  ThreadReportReason.ILLEGAL,
];

export class ThreadReportRepository {
  static async submitReport(
    urlPathParams: { threadId: string },
    data: {
      reason: (typeof ThreadReportReason)[keyof typeof ThreadReportReason];
      note?: string | undefined;
      messageId?: string | undefined;
    },
    user: JwtPayloadType,
    request: NextRequest | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ThreadReportPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { threadId } = urlPathParams;
      const userId = user.isPublic ? undefined : user.id;
      const reporterKey = userId ?? user.leadId;

      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);

      if (
        !thread ||
        thread.status === ThreadStatus.DELETED ||
        (thread.rootFolderId !== DefaultFolderId.PUBLIC &&
          thread.rootFolderId !== DefaultFolderId.SHARED)
      ) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only content the reporter can actually see can be reported
      let folder = null;
      if (thread.folderId) {
        [folder] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
      }
      if (!(await canViewThread(user, thread, folder, logger, locale))) {
        return fail({
          message: t("post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Authors cannot report their own content
      if (
        (userId && thread.userId === userId) ||
        (!thread.userId && thread.leadId === user.leadId)
      ) {
        return fail({
          message: t("post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Rate limit per lead and per IP (rolling window)
      const ip = request
        ? request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          undefined
        : undefined;
      const ipHash = ip ? hashReporterIp(ip) : null;
      const since = new Date(Date.now() - THREAD_REPORT_WINDOW_MS);

      const [{ leadRecent }] = await db
        .select({ leadRecent: count() })
        .from(threadReports)
        .where(
          and(
            eq(threadReports.reporterLeadId, user.leadId),
            gt(threadReports.createdAt, since),
          ),
        );
      let ipRecent = 0;
      if (ipHash) {
        const [row] = await db
          .select({ ipRecent: count() })
          .from(threadReports)
          .where(
            and(
              eq(threadReports.ipHash, ipHash),
              gt(threadReports.createdAt, since),
            ),
          );
        ipRecent = row?.ipRecent ?? 0;
      }
      if (
        leadRecent >= THREAD_REPORT_MAX_PER_LEAD ||
        ipRecent >= THREAD_REPORT_MAX_PER_IP
      ) {
        logger.warn("Thread report rate limit hit", {
          leadId: user.leadId,
          ipHash: ipHash ?? "none",
        });
        return fail({
          message: t("post.errors.rateLimited.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Idempotent: one report per reporter per thread
      const inserted = await db
        .insert(threadReports)
        .values({
          threadId,
          messageId: data.messageId ?? null,
          reporterKey,
          reporterUserId: userId ?? null,
          reporterLeadId: user.leadId,
          ipHash,
          reason: data.reason,
          note: data.note?.trim() || null,
        })
        .onConflictDoNothing()
        .returning({ id: threadReports.id });

      if (inserted.length === 0) {
        return fail({
          message: t("post.errors.conflict.title"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // Recount open reports (distinct reporters, by the unique index)
      const openWhere = and(
        eq(threadReports.threadId, threadId),
        isNull(threadReports.resolvedAt),
      );
      const [{ open }] = await db
        .select({ open: count() })
        .from(threadReports)
        .where(openWhere);
      const [{ severe }] = await db
        .select({ severe: count() })
        .from(threadReports)
        .where(and(openWhere, inArray(threadReports.reason, SEVERE_REASONS)));

      const shouldHide =
        thread.moderationStatus === ThreadModerationStatus.VISIBLE &&
        (open >= THREAD_AUTO_HIDE_REPORT_THRESHOLD ||
          severe >= THREAD_AUTO_HIDE_SEVERE_THRESHOLD);

      if (shouldHide) {
        logger.warn(
          `Thread ${threadId} auto-hidden: open=${open} severe=${severe}`,
        );
      }

      await db
        .update(chatThreads)
        .set({
          reportCount: open,
          ...(shouldHide
            ? { moderationStatus: ThreadModerationStatus.UNDER_REVIEW }
            : {}),
        })
        .where(eq(chatThreads.id, threadId));

      return success({
        reported: true,
        reportCount: open,
        hidden:
          shouldHide ||
          thread.moderationStatus !== ThreadModerationStatus.VISIBLE,
      });
    } catch (error) {
      logger.error(
        "ThreadReportRepository.submitReport failed",
        parseError(error),
      );
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
