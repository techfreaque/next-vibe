import "server-only";

/**
 * Cortex Search Repository
 * Hybrid search: FTS (keyword) + vector (semantic) with score-based ranking.
 * Falls back to FTS-only when embeddings are unavailable.
 */
import { and, eq, isNotNull, like, sql } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { truncateContent } from "../_shared/text-utils";
import { cortexNodes } from "../db";
import { CortexCreditFeature, CortexNodeType } from "../enum";
import { isValidPath, normalizePath } from "../repository";
import type { CortexSearchResponseOutput } from "./definition";
import type { CortexSearchT } from "./i18n";

/** Weight for FTS vs vector scoring (FTS 0.4, Vector 0.6) */
const FTS_WEIGHT = 0.4;
const VECTOR_WEIGHT = 0.6;

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
    toolExecutionContext,
  }: {
    userId: string;
    user: JwtPrivatePayloadType;
    query: string;
    path: string;
    maxResults: number;
    logger: EndpointLogger;
    t: CortexSearchT;
    locale: CountryLanguage;
    /** Fixture chain of the calling stream — the embedding call binds it. */
    toolExecutionContext: ToolExecutionContext;
  }): Promise<ResponseType<CortexSearchResponseOutput>> {
    const path = normalizePath(rawPath);

    if (!isValidPath(path)) {
      return fail({
        message: t("get.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      // Check if any embeddings exist for this user (determines hybrid vs keyword-only)
      const hasEmbeddings = await checkEmbeddingsExist(userId);

      // Run all searches in parallel
      const [ftsResults, vectorResults, virtualResults, templateResults] =
        await Promise.all([
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
                toolExecutionContext,
              )
            : Promise.resolve([]),
          // Tasks virtual mount (not in cortexNodes)
          shouldSearchVirtual(path)
            ? runVirtualSearch(userId, query, maxResults)
            : Promise.resolve([]),
          // Template files (not in DB)
          shouldSearchTemplates(path)
            ? runTemplateSearch(query, path, locale, maxResults)
            : Promise.resolve([]),
        ]);

      const searchMode: "hybrid" | "keyword" =
        vectorResults.length > 0 ? "hybrid" : "keyword";

      // Merge DB results (FTS + vector), then append virtual/template hits
      const merged = mergeResults(
        ftsResults,
        vectorResults,
        virtualResults,
        templateResults,
        maxResults,
      );

      // Resolve excerpts from source for virtual-mount hits whose index row has
      // no content (only the final top-N, so source reads stay bounded).
      const results = await resolveExcerpts(userId, merged, locale);

      return success({
        responseQuery: query,
        results,
        total: results.length,
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

/**
 * Run full-text search using PostgreSQL tsvector.
 */
async function runFtsSearch(
  userId: string,
  query: string,
  path: string,
  limit: number,
): Promise<
  {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[]
> {
  const tsQuery = sql`plainto_tsquery('english', ${query})`;
  const tsVector = sql`to_tsvector('english', COALESCE(${cortexNodes.content}, '') || ' ' || ${cortexNodes.path})`;

  const conditions = [
    eq(cortexNodes.userId, userId),
    eq(cortexNodes.nodeType, CortexNodeType.FILE),
    eq(cortexNodes.isDeleted, false),
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
  toolExecutionContext: ToolExecutionContext,
): Promise<
  {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[]
> {
  // Generate embedding for the query
  const { generateEmbedding } = await import("../embeddings/service");
  const queryEmbedding = await generateEmbedding(query, toolExecutionContext);

  if (!queryEmbedding) {
    logger.info("Vector search skipped - embedding generation failed");
    return [];
  }

  // Deduct credits for query embedding
  try {
    const { CreditRepository } = await import("@/credits/repository");
    const { scopedTranslation: creditsScopedTranslation } =
      await import("@/credits/i18n");
    const { t: tCredits } = creditsScopedTranslation.scopedT(locale);
    const { scopedTranslation: cortexScopedTranslation } =
      await import("../i18n");
    const { t: tCortex } = cortexScopedTranslation.scopedT(locale);
    const { EMBEDDING_CREDIT_COST } = await import("../embeddings/service");
    await CreditRepository.deductCreditsForFeature(
      user,
      EMBEDDING_CREDIT_COST,
      tCortex(CortexCreditFeature.SEARCH),
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
    eq(cortexNodes.isDeleted, false),
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

  // cortex_nodes is an index: content is NULL for virtual mounts. The excerpt
  // is resolved from the source AFTER merge, only for the final top-N (see
  // resolveExcerpts). Native paths still carry content in the column, so use it
  // directly when present to avoid an extra read.
  return rows.map((row) => ({
    path: row.path,
    excerpt: row.content !== null ? truncateContent(row.content, 150) : "",
    score: row.similarity, // Already 0-1 (cosine similarity)
    updatedAt: row.updatedAt,
    source: "vector" as const,
  }));
}

/**
 * Fill in missing excerpts for the final result set by resolving content from
 * its source. Virtual-mount hits have no excerpt (content is NULL in the index)
 * — resolve them live via the mount resolver. Native hits already have an
 * excerpt from the column. Resolves only the final top-N to bound source reads.
 */
async function resolveExcerpts(
  userId: string,
  results: CortexSearchResponseOutput["results"],
  locale: CountryLanguage,
): Promise<CortexSearchResponseOutput["results"]> {
  const { getMountPrefix, isNativePath } = await import("../repository");
  const { resolveVirtualRead } = await import("../mounts/resolver");

  return Promise.all(
    results.map(
      async (r): Promise<CortexSearchResponseOutput["results"][number]> => {
        if (r.excerpt.trim().length > 0 || isNativePath(r.resultPath, locale)) {
          return r;
        }
        const mountPrefix = getMountPrefix(r.resultPath, locale);
        if (mountPrefix === null) {
          return r;
        }
        const resolved = await resolveVirtualRead(
          userId,
          r.resultPath,
          mountPrefix,
          false,
          locale,
        ).catch(() => null);
        return resolved
          ? { ...r, excerpt: truncateContent(resolved.content, 150) }
          : r;
      },
    ),
  );
}

/** Whether tasks virtual mount should be searched (tasks not synced to cortexNodes) */
function shouldSearchVirtual(path: string): boolean {
  if (path === "/") {
    return true;
  }
  return path.startsWith("/tasks");
}

/** Whether template files should be included */
function shouldSearchTemplates(path: string): boolean {
  if (path === "/") {
    return true;
  }
  return path.startsWith("/memories") || path.startsWith("/documents");
}

/**
 * Direct DB search across tasks virtual mount.
 * Searches, uploads, and gens are synced to cortexNodes on creation
 * so they're found by the FTS+vector search above without extra queries.
 */
async function runVirtualSearch(
  userId: string,
  query: string,
  limit: number,
): Promise<
  {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[]
> {
  const taskHits = await import("../mounts/tasks")
    .then((m) => m.searchTasks(userId, query, limit).catch(() => []))
    .catch(() => []);

  return taskHits.map((hit) => ({
    path: hit.path,
    excerpt: hit.excerpt,
    score: 0.6,
    updatedAt: hit.updatedAt,
    source: "fts" as const,
  }));
}

/**
 * Search template files (memories + documents) - not in cortexNodes.
 */
async function runTemplateSearch(
  query: string,
  path: string,
  locale: CountryLanguage,
  limit: number,
): Promise<
  {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[]
> {
  const { getAllTemplates } = await import("../seeds/templates");
  const lq = query.toLowerCase();
  const templates = getAllTemplates(locale);
  const now = new Date();
  const results: {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[] = [];

  for (const tpl of templates) {
    if (path !== "/" && !tpl.path.startsWith(path)) {
      continue;
    }
    const text = `${tpl.path} ${tpl.content}`.toLowerCase();
    if (text.includes(lq)) {
      // Find excerpt around match
      const idx = text.indexOf(lq);
      const start = Math.max(0, idx - 60);
      const raw = tpl.content.slice(start, start + 150);
      results.push({
        path: tpl.path,
        excerpt: raw.replaceAll(/\s+/g, " ").trim(),
        score: 0.5,
        updatedAt: now,
        source: "fts",
      });
    }
  }

  return results.slice(0, limit);
}

/**
 * Merge FTS, vector, virtual, and template results with weighted scoring.
 * Deduplicates by path, combines scores from both sources.
 */
function mergeResults(
  ftsResults: {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[],
  vectorResults: {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[],
  virtualResults: {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[],
  templateResults: {
    path: string;
    excerpt: string;
    score: number;
    updatedAt: Date;
    source: "fts" | "vector";
  }[],
  limit: number,
): CortexSearchResponseOutput["results"] {
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

  // Compute combined scores and sort DB results
  const combined = [...resultMap.entries()]
    .map(([resultPath, data]) => ({
      resultPath,
      excerpt: data.excerpt,
      score:
        Math.round(
          (data.ftsScore * FTS_WEIGHT + data.vectorScore * VECTOR_WEIGHT) * 100,
        ) / 100,
      updatedAt: data.updatedAt,
    }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit);

  // Append virtual and template results (dedup against DB results)
  const seen = new Set(combined.map((r) => r.resultPath));
  for (const r of [...virtualResults, ...templateResults]) {
    if (seen.has(r.path)) {
      continue;
    }
    seen.add(r.path);
    combined.push({
      resultPath: r.path,
      excerpt: r.excerpt,
      score: r.score,
      updatedAt: r.updatedAt,
    });
  }

  return combined.slice(0, limit);
}
