import "server-only";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { parseError } from "next-vibe/core/utils/parse-error";

import { notifications, type NotificationMetadata } from "./db";
import { NotificationType, type NotificationTypeValue } from "./enum";
import { scopedTranslation, type NotificationsT } from "./i18n";

import type { NotificationsListGetResponseOutput } from "./list/definition";
import type { NotificationsReadPostResponseOutput } from "./read/definition";
import type { NotificationsUnreadCountGetResponseOutput } from "./unread-count/definition";

/** What an event source hands over. Copy is rendered here, in the user's locale. */
export interface NotifyParams {
  userId: string;
  type: typeof NotificationTypeValue;
  /** Template params: `name` (subject), `amount` (credits) */
  params: { name?: string; amount?: number };
  /** In-app href without locale prefix */
  link: string | null;
  /** Stable id of the thing that happened; same key = same notification */
  dedupeKey: string;
  metadata?: NotificationMetadata;
}

function resolveCopy(
  type: typeof NotificationTypeValue,
  t: NotificationsT,
  params: NotifyParams["params"],
): { title: string; body: string | null } {
  const vars = {
    name: params.name ?? t("templates.fallbackTaskName"),
    amount: params.amount ?? 0,
  };
  switch (type) {
    case NotificationType.TASK_COMPLETE:
      return {
        title: t("templates.taskComplete.title", vars),
        body: t("templates.taskComplete.body"),
      };
    case NotificationType.TASK_FAILED:
      return {
        title: t("templates.taskFailed.title", vars),
        body: t("templates.taskFailed.body"),
      };
    case NotificationType.EARNING:
      return {
        title: t("templates.earning.title", vars),
        body: t("templates.earning.body"),
      };
    case NotificationType.DREAMER_RESULT:
      return {
        title: t("templates.dreamerResult.title", vars),
        body: t("templates.dreamerResult.body"),
      };
    case NotificationType.CREDIT_LOW:
      return {
        title: t("templates.creditLow.title"),
        body: t("templates.creditLow.body", vars),
      };
    case NotificationType.SYSTEM:
      return { title: t("templates.system.title", vars), body: null };
  }
}

export class NotificationsRepository {
  /**
   * Persist one notification for one user. Idempotent per (userId, dedupeKey):
   * resolves true when created, false for a repeat. Never throws -
   * a failed notification must not break the event that triggered it.
   */
  static async notify(
    params: NotifyParams,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      const [recipient] = await db
        .select({ locale: users.locale })
        .from(users)
        .where(eq(users.id, params.userId))
        .limit(1);
      if (!recipient) {
        return false;
      }
      const { t } = scopedTranslation.scopedT(recipient.locale);
      const copy = resolveCopy(params.type, t, params.params);
      const inserted = await db
        .insert(notifications)
        .values({
          userId: params.userId,
          type: params.type,
          title: copy.title,
          body: copy.body,
          link: params.link,
          dedupeKey: params.dedupeKey,
          metadata: params.metadata ?? {},
        })
        .onConflictDoNothing()
        .returning({ id: notifications.id });
      return inserted.length > 0;
    } catch (error) {
      logger.error("Failed to create notification", parseError(error), {
        userId: params.userId,
        type: params.type,
      });
      return false;
    }
  }

  static async list(
    data: { paginationInfo: { page: number; limit: number } },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: NotificationsT,
  ): Promise<ResponseType<NotificationsListGetResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const { page, limit } = data.paginationInfo;
    try {
      const rows = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, user.id))
        .orderBy(notifications.read, desc(notifications.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);
      const [totals] = await db
        .select({
          total: count(),
          unread: sql<number>`count(*) filter (where ${notifications.read} = false)`,
        })
        .from(notifications)
        .where(eq(notifications.userId, user.id));
      const totalCount = totals?.total ?? 0;
      return success({
        notifications: rows.map((row) => ({
          id: row.id,
          type: row.type,
          title: row.title,
          body: row.body,
          link: row.link,
          read: row.read,
          createdAt: row.createdAt,
        })),
        unreadCount: Number(totals?.unread ?? 0),
        paginationInfo: {
          totalCount,
          pageCount: Math.max(1, Math.ceil(totalCount / limit)),
        },
      });
    } catch (error) {
      logger.error("Failed to list notifications", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async unreadCount(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: NotificationsT,
  ): Promise<ResponseType<NotificationsUnreadCountGetResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    try {
      const [row] = await db
        .select({ unread: count() })
        .from(notifications)
        .where(
          and(eq(notifications.userId, user.id), eq(notifications.read, false)),
        );
      return success({ unreadCount: row?.unread ?? 0 });
    } catch (error) {
      logger.error("Failed to count notifications", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Mark one (own) notification, or all of the user's, as read. */
  static async markRead(
    data: { id?: string | undefined; all?: boolean | undefined },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: NotificationsT,
  ): Promise<ResponseType<NotificationsReadPostResponseOutput>> {
    if (user.isPublic) {
      return fail({
        message: t("errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    if (!data.id && !data.all) {
      return fail({
        message: t("errors.idOrAllRequired"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      const scope = data.all
        ? and(eq(notifications.userId, user.id), eq(notifications.read, false))
        : and(
            eq(notifications.userId, user.id),
            eq(notifications.id, data.id ?? ""),
            eq(notifications.read, false),
          );
      const updated = await db
        .update(notifications)
        .set({ read: true })
        .where(scope)
        .returning({ id: notifications.id });
      return success({ updatedCount: updated.length });
    } catch (error) {
      logger.error("Failed to mark notifications read", parseError(error));
      return fail({
        message: t("errors.serverError.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
