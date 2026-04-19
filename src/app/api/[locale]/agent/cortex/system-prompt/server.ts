import "server-only";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  CortexData,
  CortexMemory,
  CortexRelevantNode,
  TrimmedDirNode,
} from "./prompt";
import {
  stripFrontmatter,
  truncateContent as truncateForContext,
} from "../_shared/text-utils";

/**
 * Load Cortex data for the system prompt fragment.
 * Fetches document tree + counts from all virtual mounts + memories content.
 */
export async function loadCortexData(
  params: SystemPromptServerParams,
): Promise<CortexData> {
  const { user, logger, isIncognito, memoryLimit, lastUserMessage } = params;
  const userId = user.isPublic ? undefined : user.id;

  const empty: CortexData = {
    compactTree: "",
    documentCount: 0,
    threadCounts: {},
    totalThreads: 0,
    activeMemories: 0,
    archivedMemories: 0,
    skillCount: 0,
    taskCount: 0,
    uploadCount: 0,
    searchCount: 0,
    memories: [],
    trimmedDirs: [],
    skillNames: [],
    dirPurposes: {},
  };

  // No Cortex data for incognito or unauthenticated users
  if (isIncognito || !userId) {
    return empty;
  }

  try {
    const { getVirtualMountCounts } = await import("../mounts/resolver");
    const counts = await getVirtualMountCounts(userId);

    // Parallel: build doc tree + load memories + vector context + skill names + dir purposes
    const [
      trimmedDirs,
      compactTree,
      memoriesResult,
      relevantContext,
      skillNames,
      dirPurposes,
    ] = await Promise.all([
      buildTrimmedDocTree(userId),
      buildCompactDocTree(userId, counts.documents),
      loadMemoriesFromCortex(userId, memoryLimit ?? null),
      lastUserMessage
        ? loadRelevantContext(userId, lastUserMessage, logger)
        : Promise.resolve([]),
      loadSkillNames(userId),
      loadDirPurposes(userId),
    ]);

    return {
      compactTree,
      documentCount: counts.documents,
      threadCounts: counts.threads.byRoot,
      totalThreads: counts.threads.total,
      activeMemories: memoriesResult.activeCount,
      archivedMemories: memoriesResult.archivedCount,
      skillCount: counts.skills,
      taskCount: counts.tasks,
      uploadCount: counts.uploads,
      searchCount: counts.searches,
      memories: memoriesResult.memories,
      nearLimit: memoriesResult.nearLimit,
      totalTokens: memoriesResult.totalTokens,
      relevantContext: relevantContext.length > 0 ? relevantContext : undefined,
      trimmedDirs,
      skillNames,
      dirPurposes,
    };
  } catch (error) {
    logger.error("Failed to load Cortex data for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return empty;
  }
}

/**
 * Build a compact tree of /documents/ file paths for the system prompt.
 */
async function buildCompactDocTree(
  userId: string,
  docCount: number,
): Promise<string> {
  if (docCount === 0) {
    return "";
  }

  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { eq, and, like } = await import("drizzle-orm");
  const { basename } = await import("../repository");

  const docFiles = await db
    .select({ path: cortexNodes.path })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        eq(cortexNodes.nodeType, CortexNodeType.FILE),
        like(cortexNodes.path, "/documents/%"),
      ),
    )
    .orderBy(cortexNodes.updatedAt)
    .limit(20);

  const lines = docFiles.map((f) => {
    const parts = f.path.replace("/documents/", "").split("/");
    return parts.length > 1
      ? `  ${parts.slice(0, -1).join("/")}/${basename(f.path)}`
      : `  ${basename(f.path)}`;
  });

  return lines.join("\n");
}

/**
 * Load memory files from /memories/ in cortex_nodes.
 * Parses frontmatter for priority, tags, archived status.
 */
async function loadMemoriesFromCortex(
  userId: string,
  memoryLimit: number | null,
): Promise<{
  memories: CortexMemory[];
  activeCount: number;
  archivedCount: number;
  nearLimit: boolean;
  totalTokens: number;
}> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { MEMORIES_PREFIX } = await import("../repository");
  const { eq, and, like } = await import("drizzle-orm");

  const allMemoryFiles = await db
    .select({
      path: cortexNodes.path,
      content: cortexNodes.content,
      frontmatter: cortexNodes.frontmatter,
      createdAt: cortexNodes.createdAt,
    })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        eq(cortexNodes.nodeType, CortexNodeType.FILE),
        like(cortexNodes.path, `${MEMORIES_PREFIX}/%`),
      ),
    )
    .orderBy(cortexNodes.createdAt);

  let archivedCount = 0;
  const activeMemories: CortexMemory[] = [];

  for (const file of allMemoryFiles) {
    const fm = file.frontmatter as Record<
      string,
      string | number | boolean | string[]
    > | null;
    const isArchived = fm?.archived === true || fm?.isArchived === true;

    if (isArchived) {
      archivedCount++;
      continue;
    }

    const priority = typeof fm?.priority === "number" ? fm.priority : 0;
    const tags = Array.isArray(fm?.tags) ? (fm.tags as string[]) : [];

    activeMemories.push({
      path: file.path,
      content: file.content ?? "",
      priority,
      tags,
      createdAt: file.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  }

  // Token counting
  const totalChars = activeMemories.reduce(
    (sum, m) => sum + m.content.length,
    0,
  );
  const totalTokens = Math.ceil(totalChars / 4);
  const limit = memoryLimit ?? 10000;
  const nearLimit = totalTokens >= limit * 0.9;

  return {
    memories: activeMemories,
    activeCount: activeMemories.length,
    archivedCount,
    nearLimit,
    totalTokens,
  };
}

/**
 * Load relevant cortex nodes via vector search based on the user's message.
 * Returns top 5 most similar nodes across all of cortex (documents, memories, skills, tasks).
 * Gracefully returns empty if embeddings aren't available.
 */
/** Path-type weighting boosts for context relevance */
const PATH_TYPE_WEIGHTS: Record<string, number> = {
  memories: 1.2,
  skills: 1.1,
  documents: 1.0,
  threads: 1.0,
  tasks: 1.0,
};

/** Get path-type weight for a cortex path */
function getPathTypeWeight(path: string): number {
  const mount = path.replace(/^\//, "").split("/")[0] ?? "";
  return PATH_TYPE_WEIGHTS[mount] ?? 1.0;
}

/** Calculate recency factor: 1.0 for today, decaying over 30 days to 0.0 */
function getRecencyFactor(updatedAt: Date): number {
  const ageMs = Date.now() - updatedAt.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - ageDays / 30);
}

async function loadRelevantContext(
  userId: string,
  userMessage: string,
  logger: EndpointLogger,
): Promise<CortexRelevantNode[]> {
  try {
    const { generateEmbedding } = await import("../embeddings/service");
    const queryEmbedding = await generateEmbedding(userMessage);

    if (!queryEmbedding) {
      return []; // No API key or embedding failed
    }

    const { db } = await import("@/app/api/[locale]/system/db");
    const { cortexNodes } = await import("../db");
    const { CortexNodeType } = await import("../enum");
    const { eq, and, isNotNull, sql } = await import("drizzle-orm");

    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    const rows = await db
      .select({
        path: cortexNodes.path,
        content: cortexNodes.content,
        updatedAt: cortexNodes.updatedAt,
        similarity: sql<number>`1 - (${cortexNodes.embedding} <=> ${sql.raw(`'${embeddingStr}'::vector`)})`,
      })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          isNotNull(cortexNodes.embedding),
        ),
      )
      .orderBy(
        sql`${cortexNodes.embedding} <=> ${sql.raw(`'${embeddingStr}'::vector`)}`,
      )
      .limit(12);

    // Apply recency boost and path-type weighting, then filter and rank
    return rows
      .map((r) => {
        const baseSimilarity = r.similarity;
        const recencyBoost = 0.1 * getRecencyFactor(r.updatedAt);
        const pathWeight = getPathTypeWeight(r.path);
        const adjustedScore = (baseSimilarity + recencyBoost) * pathWeight;
        return {
          path: r.path,
          excerpt: truncateForContext(stripFrontmatter(r.content ?? ""), 300),
          score: Math.round(adjustedScore * 100) / 100,
        };
      })
      .filter((r) => r.score > 0.2)
      .toSorted((a, b) => b.score - a.score)
      .slice(0, 8);
  } catch (error) {
    logger.warn("Vector context injection failed — skipping", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

// ─── New loaders ──────────────────────────────────────────────────────────────

/**
 * Max total file rows shown across all subdirs in the document tree.
 * Spread evenly per top-level subdir so heavy users don't explode context.
 */
const DOC_TREE_MAX_ROWS = 40;

/**
 * Build a trimmed document tree: top-level subdirs with even slot allocation.
 * Returns structured nodes so prompt.ts can render them flexibly.
 */
async function buildTrimmedDocTree(userId: string): Promise<TrimmedDirNode[]> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { eq, and, like, sql, asc } = await import("drizzle-orm");

  // Get all top-level /documents/ subdirs
  const topDirs = await db
    .select({
      path: cortexNodes.path,
      frontmatter: cortexNodes.frontmatter,
    })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        eq(cortexNodes.nodeType, CortexNodeType.DIR),
        // direct children of /documents only: exactly one more path segment
        sql`${cortexNodes.path} ~ '^/documents/[^/]+$'`,
      ),
    )
    .orderBy(asc(cortexNodes.sortOrder), asc(cortexNodes.path));

  if (topDirs.length === 0) {
    return [];
  }

  const perDirSlots = Math.max(
    2,
    Math.floor(DOC_TREE_MAX_ROWS / topDirs.length),
  );

  const results: TrimmedDirNode[] = [];

  for (const dir of topDirs) {
    // Count total files under this dir (any depth)
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          like(cortexNodes.path, `${dir.path}/%`),
        ),
      );
    const fileCount = Number(countResult[0]?.count ?? 0);

    // Fetch the most-recently-updated files up to perDirSlots
    const recentFiles = await db
      .select({ path: cortexNodes.path })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          like(cortexNodes.path, `${dir.path}/%`),
        ),
      )
      .orderBy(sql`${cortexNodes.updatedAt} DESC`)
      .limit(perDirSlots);

    const fm = dir.frontmatter as Record<
      string,
      string | number | boolean | null
    > | null;
    const purpose = typeof fm?.purpose === "string" ? fm.purpose : undefined;

    results.push({
      path: dir.path,
      fileCount,
      shownFiles: recentFiles.map((f) => f.path),
      hiddenCount: Math.max(0, fileCount - recentFiles.length),
      purpose,
    });
  }

  return results;
}

/**
 * Load top skill names for inline display in the workspace tree.
 * Queries materialized cortex_nodes for /skills/ files and extracts the name
 * from frontmatter (set during virtual mount materialization).
 */
async function loadSkillNames(userId: string): Promise<string[]> {
  try {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { cortexNodes } = await import("../db");
    const { CortexNodeType } = await import("../enum");
    const { eq, and, like, sql } = await import("drizzle-orm");

    const rows = await db
      .select({ frontmatter: cortexNodes.frontmatter })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          like(cortexNodes.path, "/skills/%"),
          // Exclude built-in default skills — too many, not personal
          sql`${cortexNodes.path} NOT LIKE '/skills/default/%'`,
        ),
      )
      .limit(6);

    const names: string[] = [];
    for (const row of rows) {
      const fm = row.frontmatter as Record<
        string,
        string | number | boolean | null
      > | null;
      const name = typeof fm?.name === "string" ? fm.name : null;
      if (name) {
        names.push(name);
      }
    }
    return names;
  } catch {
    return [];
  }
}

/**
 * Load purpose labels for /documents/ subdirectories.
 * Returns a map of path → purpose string for inline display.
 */
async function loadDirPurposes(
  userId: string,
): Promise<Record<string, string>> {
  try {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { cortexNodes } = await import("../db");
    const { CortexNodeType } = await import("../enum");
    const { eq, and, sql } = await import("drizzle-orm");

    const rows = await db
      .select({ path: cortexNodes.path, frontmatter: cortexNodes.frontmatter })
      .from(cortexNodes)
      .where(
        and(
          eq(cortexNodes.userId, userId),
          eq(cortexNodes.nodeType, CortexNodeType.DIR),
          sql`${cortexNodes.path} ~ '^/documents/[^/]+$'`,
        ),
      );

    const result: Record<string, string> = {};
    for (const row of rows) {
      const fm = row.frontmatter as Record<
        string,
        string | number | boolean | null
      > | null;
      if (typeof fm?.purpose === "string") {
        result[row.path] = fm.purpose;
      }
    }
    return result;
  } catch {
    return {};
  }
}
