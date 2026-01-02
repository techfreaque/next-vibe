/**
 * Thread Search Repository
 * Handles full-text search operations for threads
 */

import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { chatThreads } from "../../db";
import { ThreadStatus } from "../../enum";
import type { ThreadSearchGetRequestOutput, ThreadSearchGetResponseOutput } from "./definition";

/**
 * Search threads using PostgreSQL full-text search
 */
export async function searchThreads(
  userId: string,
  params: ThreadSearchGetRequestOutput,
): Promise<ThreadSearchGetResponseOutput> {
  const {
    query,
    pagination = { page: 1, limit: 20 },
    sortBy = "relevance",
    includeArchived = false,
  } = params;

  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  // Build the search query using websearch_to_tsquery for natural language search
  const searchQuery = sql`websearch_to_tsquery('english', ${query})`;

  // Build WHERE conditions
  const conditions = [
    eq(chatThreads.userId, userId),
    sql`${chatThreads.searchVector} @@ ${searchQuery}`,
  ];

  // Exclude archived threads unless explicitly requested
  if (!includeArchived) {
    conditions.push(sql`${chatThreads.status} != ${ThreadStatus.ARCHIVED}`);
  }

  // Calculate relevance rank
  const rankExpression = sql<number>`ts_rank(${chatThreads.searchVector}, ${searchQuery})`;

  // Generate headline (snippet with highlighted matches)
  const headlineExpression = sql<string>`ts_headline(
    'english',
    COALESCE(${chatThreads.title}, '') || ' ' || COALESCE(${chatThreads.preview}, ''),
    ${searchQuery},
    'MaxWords=50, MinWords=25, ShortWord=3, HighlightAll=false, MaxFragments=3'
  )`;

  // Build ORDER BY clause
  const orderBy =
    sortBy === "relevance"
      ? [desc(rankExpression), desc(chatThreads.updatedAt)]
      : [desc(chatThreads.updatedAt), desc(rankExpression)];

  // Execute search query
  const results = await db
    .select({
      id: chatThreads.id,
      title: chatThreads.title,
      preview: chatThreads.preview,
      rank: rankExpression,
      headline: headlineExpression,
      status: chatThreads.status,
      createdAt: chatThreads.createdAt,
      updatedAt: chatThreads.updatedAt,
    })
    .from(chatThreads)
    .where(and(...conditions))
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(chatThreads)
    .where(and(...conditions));

  const totalResults = countResult?.count ?? 0;

  // Format results
  const formattedResults = results.map((result) => ({
    id: result.id,
    threadTitle: result.title,
    preview: result.preview,
    rank: result.rank,
    headline: result.headline,
    status: result.status,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  }));

  return {
    results: formattedResults,
    totalResults,
  };
}
