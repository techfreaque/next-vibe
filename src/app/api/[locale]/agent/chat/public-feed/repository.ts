/**
 * Public Feed Repository
 * Fetches enriched public threads with aggregated message stats
 */

import "server-only";

import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import { DefaultFolderId } from "../config";
import { chatFolders, chatMessages, chatThreads } from "../db";
import type {
  PublicFeedGetRequestOutput,
  PublicFeedGetResponseOutput,
} from "./definition";
import { FeedSortMode } from "./definition";
import type { PublicFeedT } from "./i18n";

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
        ? ilike(chatThreads.title, `%${search}%`)
        : undefined;

      const baseCondition = and(
        eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
        searchCondition,
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
          modelNames: sql<string[]>`coalesce(
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
          id: chatThreads.id,
          title: chatThreads.title,
          preview: chatThreads.preview,
          folderId: chatThreads.folderId,
          streamingState: chatThreads.streamingState,
          createdAt: chatThreads.createdAt,
          updatedAt: chatThreads.updatedAt,
          userId: chatThreads.userId,
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

      // For rising: filter to threads < 24h old with non-negative score
      const RISING_HOURS = 24;
      const filteredThreads =
        sortMode === FeedSortMode.RISING
          ? dbThreads.filter((row) => {
              const ageHours =
                (Date.now() - row.createdAt.getTime()) / (1000 * 60 * 60);
              const score = (row.totalUpvotes ?? 0) - (row.totalDownvotes ?? 0);
              return ageHours < RISING_HOURS && score >= 0;
            })
          : dbThreads;

      const items = filteredThreads.map((row) => {
        const upvotes = row.totalUpvotes ?? 0;
        const downvotes = row.totalDownvotes ?? 0;
        return {
          id: row.id,
          title: row.title,
          preview: row.preview ?? null,
          folderId: row.folderId ?? null,
          folderName: row.folderName ?? null,
          authorId: row.userId ?? null,
          authorName: row.authorName ?? null,
          messageCount: row.messageCount ?? 0,
          authorCount: row.authorCount ?? 0,
          upvotes,
          downvotes,
          score: upvotes - downvotes,
          modelNames: (row.modelNames as string[] | null) ?? [],
          streamingState: row.streamingState,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
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
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
