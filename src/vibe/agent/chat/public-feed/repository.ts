/**
 * Public Feed Repository
 * Fetches enriched public threads with aggregated message stats
 */

import "server-only";

import { and, count, desc, eq, gt, ilike, ne, sql } from "drizzle-orm";
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
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatFolder } from "../db";
import { chatFolders, chatMessages, chatThreads } from "../db";
import { ThreadModerationStatus, ThreadStatus } from "../enum";
import { canViewThread } from "../permissions/permissions";
import type {
  PublicFeedGetRequestOutput,
  PublicFeedGetResponseOutput,
} from "./definition";
import { FeedSortMode } from "./definition";
import type { PublicFeedT } from "./i18n";

/** Rising = created within this window with a non-negative score. */
const RISING_HOURS = 24;

/** Escape LIKE wildcards so a search for "50%" matches literally. */
function escapeLike(value: string): string {
  return value.replaceAll(/[\\%_]/g, (c) => `\\${c}`);
}

export class PublicFeedRepository {
  static async getFeed(
    data: PublicFeedGetRequestOutput,
    user: JwtPayloadType,
    t: PublicFeedT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PublicFeedGetResponseOutput>> {
    try {
      const sortMode = data.sortMode ?? FeedSortMode.HOT;
      const page = data.page ?? 1;
      const limit = data.limit ?? 20;
      const search = data.search;

      logger.debug("Fetching public feed", {
        sortMode,
        page: String(page),
        limit: String(limit),
        search,
        userId: user.id,
        locale,
      });

      const offset = (page - 1) * limit;

      // Build search condition
      const searchCondition = search
        ? ilike(chatThreads.title, `%${escapeLike(search)}%`)
        : undefined;

      // Rising's age window lives in SQL so pages and totals agree with it
      const risingCondition =
        sortMode === FeedSortMode.RISING
          ? gt(
              chatThreads.createdAt,
              new Date(Date.now() - RISING_HOURS * 60 * 60 * 1000),
            )
          : undefined;

      const baseCondition = and(
        eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
        ne(chatThreads.status, ThreadStatus.DELETED),
        // Reported past the threshold (under review) or removed: never listed
        eq(chatThreads.moderationStatus, ThreadModerationStatus.VISIBLE),
        searchCondition,
        risingCondition,
      );

      // Get total count
      const [{ total }] = await db
        .select({ total: count() })
        .from(chatThreads)
        .where(baseCondition);

      // Aggregated message stats subquery
      const statsSubquery = db
        .select({
          threadId: chatMessages.threadId,
          messageCount: sql<number>`count(*)::int`.as("message_count"),
          totalUpvotes:
            sql<number>`coalesce(sum(${chatMessages.upvotes}), 0)::int`.as(
              "total_upvotes",
            ),
          totalDownvotes:
            sql<number>`coalesce(sum(${chatMessages.downvotes}), 0)::int`.as(
              "total_downvotes",
            ),
          authorCount:
            sql<number>`count(distinct ${chatMessages.authorId})::int`.as(
              "author_count",
            ),
          modelNames: sql<string[] | null>`coalesce(
            array_remove(
              array_agg(distinct ${chatMessages.model}),
              null
            ),
            '{}'::text[]
          )`.as("model_names"),
        })
        .from(chatMessages)
        .groupBy(chatMessages.threadId)
        .as("stats");

      // Fetch threads with joins
      const dbThreads = await db
        .select({
          thread: chatThreads,
          folderName: chatFolders.name,
          authorName: users.publicName,
          messageCount: statsSubquery.messageCount,
          totalUpvotes: statsSubquery.totalUpvotes,
          totalDownvotes: statsSubquery.totalDownvotes,
          authorCount: statsSubquery.authorCount,
          modelNames: statsSubquery.modelNames,
        })
        .from(chatThreads)
        .leftJoin(chatFolders, eq(chatThreads.folderId, chatFolders.id))
        .leftJoin(users, eq(chatThreads.userId, users.id))
        .leftJoin(statsSubquery, eq(chatThreads.id, statsSubquery.threadId))
        .where(baseCondition)
        .orderBy(
          sortMode === FeedSortMode.HOT
            ? sql`(coalesce(${statsSubquery.totalUpvotes}, 0) - coalesce(${statsSubquery.totalDownvotes}, 0)) / power(extract(epoch from (now() - ${chatThreads.createdAt})) / 3600 + 2, 1.5) desc`
            : desc(chatThreads.createdAt),
        )
        .limit(limit)
        .offset(offset);

      // Same visibility rules as the sidebar: a public thread (or its folder
      // chain) may restrict who can view it - never leak those into the feed
      const publicFolders = await db
        .select()
        .from(chatFolders)
        .where(eq(chatFolders.rootFolderId, DefaultFolderId.PUBLIC));
      const folderMap: Record<string, ChatFolder> = {};
      for (const folder of publicFolders) {
        folderMap[folder.id] = folder;
      }
      const visibleThreads = [];
      for (const row of dbThreads) {
        const folder = row.thread.folderId
          ? (folderMap[row.thread.folderId] ?? null)
          : null;
        if (
          await canViewThread(
            user,
            row.thread,
            folder,
            logger,
            locale,
            folderMap,
          )
        ) {
          visibleThreads.push(row);
        }
      }

      const filteredThreads =
        sortMode === FeedSortMode.RISING
          ? visibleThreads.filter(
              (row) => (row.totalUpvotes ?? 0) - (row.totalDownvotes ?? 0) >= 0,
            )
          : visibleThreads;

      const items = filteredThreads.map((row) => {
        const upvotes = row.totalUpvotes ?? 0;
        const downvotes = row.totalDownvotes ?? 0;
        return {
          id: row.thread.id,
          title: row.thread.title,
          description: row.thread.description ?? null,
          folderId: row.thread.folderId ?? null,
          folderName: row.folderName ?? null,
          authorId: row.thread.userId ?? null,
          authorName: row.authorName ?? null,
          messageCount: row.messageCount ?? 0,
          authorCount: row.authorCount ?? 0,
          upvotes,
          downvotes,
          score: upvotes - downvotes,
          modelNames: row.modelNames ?? [],
          streamingState: row.thread.streamingState,
          createdAt: row.thread.createdAt,
          updatedAt: row.thread.updatedAt,
        };
      });

      const pageCount = Math.ceil(total / limit);

      return success({
        items,
        totalCount: total,
        pageCount,
        currentPage: page,
        pageSize: limit,
      });
    } catch (error) {
      logger.error("Error fetching public feed", parseError(error));
      return fail({
        message: t("get.errors.server.detail", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
