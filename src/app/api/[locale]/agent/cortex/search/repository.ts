import "server-only";

/**
 * Cortex Search Repository
 * Hybrid search: FTS (keyword) + vector (semantic) with score-based ranking.
 * Falls back to FTS-only when embeddings are unavailable.
 */

import { and, eq, isNotNull, like, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CortexSearchT } from "./i18n";
import { truncateContent } from "../_shared/text-utils";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import { isValidPath, normalizePath } from "../repository";

/** Weight for FTS vs vector scoring (FTS 0.4, Vector 0.6) */
const FTS_WEIGHT = 0.4;
const VECTOR_WEIGHT = 0.6;

interface SearchParams {
  userId: string;
  user: JwtPrivatePayloadType;
  query: string;
  path: string;
  maxResults: number;
  logger: EndpointLogger;
  t: CortexSearchT;
  locale: CountryLanguage;
}

interface SearchResult {
  resultPath: string;
  excerpt: string;
  score: number;
  updatedAt: string;
}

type SearchMode = "hybrid" | "keyword";

export class CortexSearchRepository {
  static async search({
    userId,
    user,
    query,
    path: rawPath,
    maxResults,
    logger,
    t,
    locale,
  }: SearchParams): Promise<
    ResponseType<{
      responseQuery: string;
      results: SearchResult[];
      total: number;
      searchMode: SearchMode;
    }>
  > {
    const path = normalizePath(rawPath);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // Filesystem backend for preview-mode admin
    if (!user.isPublic) {
      const { isFilesystemMode } = await import("../fs-provider");
      if (isFilesystemMode(user)) {
        const { ensureMountPopulated, ensureDataRoot } =
          await import("../fs-provider/fs-populate");
        if (path === "/") {
          await ensureDataRoot();
        } else {
          const segments = path.split("/").filter(Boolean);
          if (segments.length > 0) {
            await ensureMountPopulated(`/${segments[0]}`, userId, logger);
          }
        }
        const { fsSearch } = await import("../fs-provider/fs-search");
        return fsSearch(path, query, maxResults, { t });
      }
    }

    try {
      // Check if any embeddings exist for this user (determines hybrid vs keyword-only)
      const hasEmbeddings = await checkEmbeddingsExist(userId);

      // Run searches in parallel when possible
      const [ftsResults, vectorResults] = await Promise.all([
        runFtsSearch(userId, query, path, maxResults * 2),
        hasEmbeddings
          ? runVectorSearch(
              userId,
              query,
              path,
              maxResults * 2,
              logger,
              user,
              locale,
            )
          : Promise.resolve([]),
      ]);

      const searchMode: SearchMode =
        vectorResults.length > 0 ? "hybrid" : "keyword";

      // Merge and rank results
      const merged = mergeResults(ftsResults, vectorResults, maxResults);

      return success({
        responseQuery: query,
        results: merged,
        total: merged.length,
        searchMode,
      });
    } catch (error) {
      logger.error("Cortex search failed", parseError(error), {
        query,
        path,
      });
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Check if any embeddings exist for this user (quick existence check).
 */
async function checkEmbeddingsExist(userId: string): Promise<boolean> {
  const result = await db
    .select({ id: cortexNodes.id })
    .from(cortexNodes)
    .where(
      and(eq(cortexNodes.userId, userId), isNotNull(cortexNodes.embedding)),
    )
    .limit(1);
  return result.length > 0;
}

interface ScoredResult {
  path: string;
  excerpt: string;
  score: number;
  updatedAt: Date;
  source: "fts" | "vector";
}

/**
 * Run full-text search using PostgreSQL tsvector.
 */
async function runFtsSearch(
  userId: string,
  query: string,
  path: string,
  limit: number,
): Promise<ScoredResult[]> {
  const tsQuery = sql`plainto_tsquery('english', ${query})`;
  const tsVector = sql`to_tsvector('english', COALESCE(${cortexNodes.content}, '') || ' ' || ${cortexNodes.path})`;

  const conditions = [
    eq(cortexNodes.userId, userId),
    eq(cortexNodes.nodeType, CortexNodeType.FILE),
    sql`${tsVector} @@ ${tsQuery}`,
  ];

  if (path !== "/") {
    conditions.push(like(cortexNodes.path, `${path}%`));
  }

  const rows = await db
    .select({
      path: cortexNodes.path,
      updatedAt: cortexNodes.updatedAt,
      rank: sql<number>`ts_rank(${tsVector}, ${tsQuery})`,
      headline: sql<string>`ts_headline('english', COALESCE(${cortexNodes.content}, ''), ${tsQuery}, 'MaxFragments=1,MaxWords=30,MinWords=10')`,
    })
    .from(cortexNodes)
    .where(and(...conditions))
    .orderBy(sql`ts_rank(${tsVector}, ${tsQuery}) DESC`)
    .limit(limit);

  // Normalize FTS scores to 0-1 range
  const maxRank = Math.max(...rows.map((r) => r.rank), 0.001);

  return rows.map((row) => ({
    path: row.path,
    excerpt: row.headline ?? "",
    score: row.rank / maxRank, // Normalized to 0-1
    updatedAt: row.updatedAt,
    source: "fts" as const,
  }));
}

/**
 * Run vector similarity search using pgvector cosine distance.
 */
async function runVectorSearch(
  userId: string,
  query: string,
  path: string,
  limit: number,
  logger: EndpointLogger,
  user: JwtPrivatePayloadType,
  locale: CountryLanguage,
): Promise<ScoredResult[]> {
  // Generate embedding for the query
  const { generateEmbedding } = await import("../embeddings/service");
  const queryEmbedding = await generateEmbedding(query);

  if (!queryEmbedding) {
    logger.info("Vector search skipped — embedding generation failed");
    return [];
  }

  // Deduct credits for query embedding
  try {
    const { CreditRepository } =
      await import("@/app/api/[locale]/credits/repository");
    const { scopedTranslation: creditsScopedTranslation } =
      await import("@/app/api/[locale]/credits/i18n");
    const { t: tCredits } = creditsScopedTranslation.scopedT(locale);
    const { EMBEDDING_CREDIT_COST } = await import("../embeddings/service");
    await CreditRepository.deductCreditsForFeature(
      user,
      EMBEDDING_CREDIT_COST,
      CortexCreditFeature.SEARCH,
      logger,
      tCredits,
      locale,
    );
  } catch {
    // Best-effort credit deduction
  }

  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const conditions = [
    eq(cortexNodes.userId, userId),
    eq(cortexNodes.nodeType, CortexNodeType.FILE),
    isNotNull(cortexNodes.embedding),
  ];

  if (path !== "/") {
    conditions.push(like(cortexNodes.path, `${path}%`));
  }

  const rows = await db
    .select({
      path: cortexNodes.path,
      content: cortexNodes.content,
      updatedAt: cortexNodes.updatedAt,
      similarity: sql<number>`1 - (${cortexNodes.embedding} <=> ${sql.raw(`'${embeddingStr}'::vector`)})`,
    })
    .from(cortexNodes)
    .where(and(...conditions))
    .orderBy(
      sql`${cortexNodes.embedding} <=> ${sql.raw(`'${embeddingStr}'::vector`)}`,
    )
    .limit(limit);

  return rows.map((row) => ({
    path: row.path,
    excerpt: truncateContent(row.content ?? "", 150),
    score: row.similarity, // Already 0-1 (cosine similarity)
    updatedAt: row.updatedAt,
    source: "vector" as const,
  }));
}

/**
 * Merge FTS and vector results with weighted scoring.
 * Deduplicates by path, combines scores from both sources.
 */
function mergeResults(
  ftsResults: ScoredResult[],
  vectorResults: ScoredResult[],
  limit: number,
): SearchResult[] {
  const resultMap = new Map<
    string,
    { ftsScore: number; vectorScore: number; excerpt: string; updatedAt: Date }
  >();

  // Add FTS results
  for (const r of ftsResults) {
    resultMap.set(r.path, {
      ftsScore: r.score,
      vectorScore: 0,
      excerpt: r.excerpt,
      updatedAt: r.updatedAt,
    });
  }

  // Merge vector results
  for (const r of vectorResults) {
    const existing = resultMap.get(r.path);
    if (existing) {
      existing.vectorScore = r.score;
      // Prefer FTS excerpt (has highlighted keywords)
    } else {
      resultMap.set(r.path, {
        ftsScore: 0,
        vectorScore: r.score,
        excerpt: r.excerpt,
        updatedAt: r.updatedAt,
      });
    }
  }

  // Compute combined scores and sort
  const combined = [...resultMap.entries()]
    .map(([resultPath, data]) => ({
      resultPath,
      excerpt: data.excerpt,
      score:
        Math.round(
          (data.ftsScore * FTS_WEIGHT + data.vectorScore * VECTOR_WEIGHT) * 100,
        ) / 100,
      updatedAt: data.updatedAt.toISOString(),
    }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);

  return combined;
}
