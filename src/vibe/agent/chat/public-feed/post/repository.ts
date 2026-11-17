/**
 * Forum Post Repository
 * Publishes an AI draft verbatim in the public forum, behind guard rails that
 * keep automated posting honest: no self-replies, one AI answer per human
 * post, no reposted drafts, no duplicate titles, an hourly cap per account.
 */

import "server-only";

import { and, asc, count, eq, gt, inArray, ne, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { getChatModelById } from "../../../ai-stream/models";
import { ContentLevel } from "../../../skills/enum";
import { stripThinkTags } from "../../../text-to-speech/content-processing";
import { chatFolders, chatMessages, chatThreads } from "../../db";
import {
  ChatMessageRole,
  ThreadModerationStatus,
  ThreadStatus,
} from "../../enum";
import { scopedTranslation as messagesScopedTranslation } from "../../threads/[threadId]/messages/i18n";
import { MessagesRepository } from "../../threads/[threadId]/messages/repository";
import { scopedTranslation as threadsScopedTranslation } from "../../threads/i18n";
import { ThreadsRepository } from "../../threads/repository";
import { FORUM_POST_MAX_PER_HOUR } from "../constants";
import type {
  ForumPostRequestOutput,
  ForumPostResponseOutput,
} from "./definition";
import type { ForumPostT } from "./i18n";

const HOUR_MS = 60 * 60 * 1000;
const POST_ROLES = [ChatMessageRole.USER, ChatMessageRole.ASSISTANT];

export class ForumPostRepository {
  static async post(
    data: ForumPostRequestOutput,
    user: JwtPayloadType,
    t: ForumPostT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ForumPostResponseOutput>> {
    try {
      if (user.isPublic) {
        return fail({
          message: t("post.errors.unauthorized.description"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // ── 1. The draft: an AI message in one of the caller's own threads ──
      const [draft] = await db
        .select({
          content: chatMessages.content,
          model: chatMessages.model,
          skill: chatMessages.skill,
        })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(
          and(
            eq(chatMessages.id, data.draftMessageId),
            eq(chatMessages.role, ChatMessageRole.ASSISTANT),
            eq(chatMessages.isAI, true),
            eq(chatThreads.userId, user.id),
          ),
        )
        .limit(1);

      if (!draft?.model) {
        return fail({
          message: t("post.guard.draftNotFound", {
            draftMessageId: data.draftMessageId,
          }),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      const draftModel = draft.model;

      const draftModelInfo = getChatModelById(draftModel);
      if (
        data.requireUncensored &&
        draftModelInfo.content !== ContentLevel.UNCENSORED
      ) {
        return fail({
          message: t("post.guard.notUncensored", {
            model: draftModelInfo.name,
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const content = stripThinkTags(draft.content ?? "");
      if (!content) {
        return fail({
          message: t("post.guard.draftEmpty", {
            draftMessageId: data.draftMessageId,
          }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // ── 2. Never post the same draft twice ──
      const [alreadyPosted] = await db
        .select({ threadId: chatMessages.threadId })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(
          and(
            eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
            eq(chatMessages.authorId, user.id),
            eq(chatMessages.isAI, true),
            eq(chatMessages.content, content),
          ),
        )
        .limit(1);
      if (alreadyPosted) {
        return fail({
          message: t("post.guard.draftAlreadyPosted", {
            threadId: alreadyPosted.threadId,
          }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // ── 3. Hourly cap on AI forum posts per account ──
      const [{ recent }] = await db
        .select({ recent: count() })
        .from(chatMessages)
        .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
        .where(
          and(
            eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
            eq(chatMessages.authorId, user.id),
            eq(chatMessages.isAI, true),
            gt(chatMessages.createdAt, new Date(Date.now() - HOUR_MS)),
          ),
        );
      if (recent >= FORUM_POST_MAX_PER_HOUR) {
        return fail({
          message: t("post.guard.rateLimited", {
            limit: FORUM_POST_MAX_PER_HOUR,
          }),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      // ── 4. Target: reply in an existing thread, or open a new one ──
      let threadId: string;
      let folderId: string | null;
      let parentId: string | undefined;
      let isNewThread: boolean;

      if (data.threadId) {
        const target = await ForumPostRepository.resolveReplyTarget(
          data.threadId,
          data.parentId,
          user.id,
          t,
        );
        if (!target.success) {
          return target;
        }
        threadId = data.threadId;
        folderId = target.data.folderId;
        parentId = target.data.parentId;
        isNewThread = false;
      } else {
        const title = data.title?.trim();
        const categoryName = data.category?.trim();
        if (!title || !categoryName) {
          return fail({
            message: t("post.guard.titleRequired"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }

        const categories = await db
          .select({ id: chatFolders.id, name: chatFolders.name })
          .from(chatFolders)
          .where(eq(chatFolders.rootFolderId, DefaultFolderId.PUBLIC));
        const folder = categories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
        );
        if (!folder) {
          return fail({
            message: t("post.guard.categoryNotFound", {
              category: categoryName,
              available: categories.map((c) => c.name).join(", "),
            }),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        const [sameTitle] = await db
          .select({ id: chatThreads.id })
          .from(chatThreads)
          .where(
            and(
              eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
              ne(chatThreads.status, ThreadStatus.DELETED),
              sql`lower(${chatThreads.title}) = lower(${title})`,
            ),
          )
          .limit(1);
        if (sameTitle) {
          return fail({
            message: t("post.guard.duplicateTitle", {
              title,
              threadId: sameTitle.id,
            }),
            errorType: ErrorResponseTypes.CONFLICT,
          });
        }

        const created = await ThreadsRepository.createThread(
          {
            title,
            rootFolderId: DefaultFolderId.PUBLIC,
            subFolderId: folder.id,
            model: draftModel,
            character: draft.skill,
          },
          user,
          threadsScopedTranslation.scopedT(locale).t,
          logger,
          locale,
        );
        if (!created.success) {
          return fail({
            message: t("post.guard.threadCreateFailed", {
              error: created.message,
            }),
            errorType: created.errorType,
          });
        }
        threadId = created.data.threadId;
        folderId = folder.id;
        parentId = undefined;
        isNewThread = true;
      }

      // ── 5. Publish the draft unchanged, attributed to its own model ──
      const posted = await MessagesRepository.createMessage(
        {
          threadId,
          rootFolderId: DefaultFolderId.PUBLIC,
          role: ChatMessageRole.ASSISTANT,
          content,
          parentId,
          model: draftModel,
          skill: draft.skill ?? undefined,
        },
        user,
        messagesScopedTranslation.scopedT(locale).t,
        logger,
        locale,
      );
      if (!posted.success) {
        return fail({
          message: t("post.guard.postFailed", { error: posted.message }),
          errorType: posted.errorType,
        });
      }

      const baseUrl = coreEnv.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
      const threadUrl = folderId
        ? `${baseUrl}/${locale}/threads/${DefaultFolderId.PUBLIC}/${folderId}/${threadId}`
        : `${baseUrl}/${locale}/threads/${DefaultFolderId.PUBLIC}/${threadId}`;

      logger.info("Forum post published", {
        threadId,
        messageId: posted.data.messageId,
        isNewThread,
        model: draftModel,
      });

      return success({
        postedThreadId: threadId,
        messageId: posted.data.messageId,
        isNewThread,
        threadUrl,
        postedModel: draftModelInfo.name,
        postedSkill: draft.skill,
        postsLeftThisHour: Math.max(0, FORUM_POST_MAX_PER_HOUR - recent - 1),
      });
    } catch (error) {
      logger.error("Error publishing forum post", parseError(error));
      return fail({
        message: t("post.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Validate a reply: the thread is a visible public thread, the answered
   * post exists, it is not the caller's own AI post, and the caller has not
   * answered it with an AI post already.
   */
  private static async resolveReplyTarget(
    threadId: string,
    requestedParentId: string | undefined,
    userId: string,
    t: ForumPostT,
  ): Promise<ResponseType<{ folderId: string | null; parentId: string }>> {
    const [thread] = await db
      .select({
        rootFolderId: chatThreads.rootFolderId,
        folderId: chatThreads.folderId,
        status: chatThreads.status,
        moderationStatus: chatThreads.moderationStatus,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, threadId))
      .limit(1);

    if (
      !thread ||
      thread.status === ThreadStatus.DELETED ||
      thread.moderationStatus !== ThreadModerationStatus.VISIBLE
    ) {
      return fail({
        message: t("post.guard.threadNotFound", { threadId }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }
    if (thread.rootFolderId !== DefaultFolderId.PUBLIC) {
      return fail({
        message: t("post.guard.notPublic", { threadId }),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const posts = await db
      .select({
        id: chatMessages.id,
        parentId: chatMessages.parentId,
        authorId: chatMessages.authorId,
        isAI: chatMessages.isAI,
      })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.threadId, threadId),
          inArray(chatMessages.role, POST_ROLES),
        ),
      )
      .orderBy(asc(chatMessages.createdAt));

    const parent = requestedParentId
      ? posts.find((p) => p.id === requestedParentId)
      : posts.at(-1);
    if (!parent) {
      return fail({
        message: requestedParentId
          ? t("post.guard.parentNotFound", {
              parentId: requestedParentId,
              threadId,
            })
          : t("post.guard.emptyThread", { threadId }),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    if (parent.isAI && parent.authorId === userId) {
      return fail({
        message: t("post.guard.selfReply"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    const answered = posts.some(
      (p) => p.parentId === parent.id && p.isAI && p.authorId === userId,
    );
    if (answered) {
      return fail({
        message: t("post.guard.alreadyAnswered"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    return success({ folderId: thread.folderId, parentId: parent.id });
  }
}
