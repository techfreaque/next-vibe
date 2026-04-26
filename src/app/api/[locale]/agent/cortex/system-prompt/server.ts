import "server-only";

import type { ModelMessage } from "ai";

import type { SystemPromptServerParams } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import type { FavoriteSummaryItem } from "@/app/api/[locale]/agent/chat/favorites/system-prompt/prompt";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CronTaskItem } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import { languageConfig } from "@/i18n";
import { getLanguageAndCountryFromLocale } from "@/i18n/core/language-utils";

import { stripFrontmatter, truncateContent } from "../_shared/text-utils";
import type {
  CortexData,
  CortexDirEntry,
  CortexEntry,
  CortexFileEntry,
} from "./prompt";
import { cleanExcerpt } from "./prompt";

// ─── Budget (chars, ~4 chars/token) ──────────────────────────────────────────

const CHAR_BUDGET = {
  memories: 16000,
  documents: 12000,
  threads: 12000,
  skills: 8000,
  tasks: 4000,
} as const;

/**
 * Load Cortex data for the system prompt fragment.
 * Single vector search → partition by mount → parallel DB loads → build unified tree.
 */
export async function loadCortexData(
  params: SystemPromptServerParams,
): Promise<CortexData> {
  const { user, logger, isIncognito, lastUserMessage, locale } = params;

  const { country } = getLanguageAndCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];
  const languageName = countryInfo?.langName;
  const userId = user.isPublic ? undefined : user.id;

  const { getLocaleRoots } = await import("../seeds/templates");
  const localeRoots = getLocaleRoots(locale);

  const empty: CortexData = {
    tree: [],
    threadCounts: {},
    totalThreads: 0,
    uploadCount: 0,
    searchCount: 0,
    genCount: 0,
    taskCount: 0,
    languageName,
    localeRoots,
  };

  // No Cortex data for incognito or unauthenticated users
  if (isIncognito || !userId) {
    return empty;
  }

  try {
    const { getVirtualMountCounts } = await import("../mounts/resolver");

    // 1. Single vector search across all paths (no path filter)
    const allRelevant = lastUserMessage
      ? await vectorSearch({
          userId,
          query: lastUserMessage,
          limit: 40,
          threshold: 0.4,
          excerptLen: 200,
          logger,
        })
      : [];

    // Partition by mount with per-mount thresholds
    const memRelevant = allRelevant.filter((n) =>
      n.path.startsWith("/memories"),
    );
    const docRelevant = allRelevant.filter((n) =>
      n.path.startsWith("/documents"),
    );
    const threadRelevant = allRelevant.filter(
      (n) =>
        /^\/threads\/(private|shared|public)\//.test(n.path) && n.score >= 0.65,
    );
    const skillRelevant = allRelevant.filter(
      (n) => n.path.startsWith("/skills") && n.score >= 0.7,
    );

    // Pre-warm skills/db so it's in the module cache before getVirtualMountCounts
    // calls getSkillCount — otherwise we hit a TDZ circular-dep crash.
    await import("@/app/api/[locale]/agent/chat/skills/db").catch(() => null);

    // 2. Parallel loads — all mounts independent
    const [
      counts,
      memCtx,
      docTree,
      threadPinned,
      skillsFaved,
      skillsCreated,
      tasks,
      favs,
    ] = await Promise.all([
      getVirtualMountCounts(userId),
      loadMemoryContext(userId, localeRoots.memories, locale),
      buildTrimmedDocTree(userId, localeRoots.documents, locale),
      loadPinnedThreads(userId),
      loadFavedSkills(userId),
      loadCreatedSkills(userId),
      loadTasksForCortex(userId, logger),
      loadFavoritesForCortex(userId, logger),
    ]);

    const uploadCount = counts.uploads;
    const searchCount = counts.searches;
    const genCount = counts.gens ?? 0;
    const taskCount = tasks.totalCount;

    // 3. Build unified tree
    const tree: CortexEntry[] = [
      buildMemoriesDir(
        memCtx,
        memRelevant,
        CHAR_BUDGET.memories,
        localeRoots.memories,
      ),
      buildDocumentsDir(
        docRelevant,
        docTree,
        CHAR_BUDGET.documents,
        localeRoots.documents,
        counts.documents ?? 0,
      ),
      buildThreadsDir(threadPinned, threadRelevant, counts.threads),
      buildSkillsDir(
        skillsFaved,
        skillsCreated,
        skillRelevant,
        CHAR_BUDGET.skills,
      ),
      buildTasksDir(tasks),
      buildFavoritesDir(favs.items, favs.activeId),
    ];

    return {
      tree,
      threadCounts: counts.threads.byRoot,
      totalThreads: counts.threads.total,
      uploadCount,
      searchCount,
      genCount,
      taskCount,
      languageName,
      localeRoots,
    };
  } catch (error) {
    logger.error("Failed to load Cortex data for system prompt", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return empty;
  }
}

// ─── Embedding Query Builder ──────────────────────────────────────────────────

const EMBEDDING_QUERY_MAX_MESSAGES = 8;
const EMBEDDING_QUERY_PER_MESSAGE_BUDGET = 800;

function extractTextFromMessage(msg: ModelMessage): string {
  if (msg.role === "system") {
    return msg.content;
  }
  if (msg.role === "user" || msg.role === "assistant") {
    const c = msg.content;
    if (typeof c === "string") {
      return c;
    }
    if (!Array.isArray(c)) {
      return "";
    }
    const parts: string[] = [];
    for (const part of c) {
      if (part.type === "text") {
        parts.push(part.text);
      } else if (part.type === "tool-call") {
        parts.push(
          `[tool:${part.toolName}] ${JSON.stringify(part.input).slice(0, 200)}`,
        );
      } else if (part.type === "tool-result") {
        const output = part.output;
        if (output.type === "text") {
          parts.push(`[result:${part.toolName}] ${output.value}`);
        } else if (output.type === "json") {
          parts.push(
            `[result:${part.toolName}] ${JSON.stringify(output.value).slice(0, 300)}`,
          );
        }
      }
    }
    return parts.join(" ");
  }
  if (msg.role === "tool") {
    const parts: string[] = [];
    for (const part of msg.content) {
      if (part.type === "tool-result") {
        const output = part.output;
        if (output.type === "text") {
          parts.push(`[result:${part.toolName}] ${output.value}`);
        } else if (output.type === "json") {
          parts.push(
            `[result:${part.toolName}] ${JSON.stringify(output.value).slice(0, 300)}`,
          );
        }
      }
    }
    return parts.join(" ");
  }
  return "";
}

const ROLE_LABELS: Record<string, string> = {
  user: "User",
  assistant: "Assistant",
  tool: "Tool",
  system: "System",
};

export function buildEmbeddingQuery(
  messages: ReadonlyArray<ModelMessage>,
): string {
  return messages
    .slice(-EMBEDDING_QUERY_MAX_MESSAGES)
    .map((m) => {
      const text = extractTextFromMessage(m).trim();
      if (!text) {
        return null;
      }
      const label = ROLE_LABELS[m.role] ?? m.role;
      return `${label}: ${text.slice(0, EMBEDDING_QUERY_PER_MESSAGE_BUDGET)}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

// ─── Shared Vector Search ─────────────────────────────────────────────────────

/** Path-type weighting — memories and skills are higher signal */
const PATH_TYPE_WEIGHTS: Record<string, number> = {
  memories: 1.2,
  skills: 1.1,
  documents: 1.0,
  threads: 1.0,
  tasks: 1.0,
};

function getPathTypeWeight(path: string): number {
  const mount = path.replace(/^\//, "").split("/")[0] ?? "";
  return PATH_TYPE_WEIGHTS[mount] ?? 1.0;
}

function getRecencyFactor(updatedAt: Date): number {
  const ageDays = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, 1 - ageDays / 30);
}

interface RelevantNode {
  path: string;
  excerpt: string;
  score: number;
}

interface VectorSearchOpts {
  userId: string;
  query: string;
  pathPrefix?: string;
  pathPrefixes?: string[];
  excludePrefixes?: string[];
  limit?: number;
  threshold?: number;
  excerptLen?: number;
  logger: EndpointLogger;
}

/**
 * Run a vector similarity search within cortex_nodes.
 * Returns ranked results with adjusted scores (recency + path weight).
 */
async function vectorSearch(opts: VectorSearchOpts): Promise<RelevantNode[]> {
  const {
    userId,
    query,
    pathPrefix,
    pathPrefixes,
    excludePrefixes = [],
    limit = 10,
    threshold = 0.4,
    excerptLen = 150,
    logger,
  } = opts;

  try {
    const { generateEmbedding } = await import("../embeddings/service");
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    const { db } = await import("@/app/api/[locale]/system/db");
    const { cortexNodes } = await import("../db");
    const { CortexNodeType } = await import("../enum");
    const { eq, and, isNotNull, notLike, like, or, sql } =
      await import("drizzle-orm");

    const embeddingStr = `[${queryEmbedding.join(",")}]`;

    // Build path filter conditions
    const pathConditions = [];
    if (pathPrefix) {
      pathConditions.push(like(cortexNodes.path, `${pathPrefix}/%`));
    } else if (pathPrefixes && pathPrefixes.length > 0) {
      pathConditions.push(
        or(...pathPrefixes.map((p) => like(cortexNodes.path, `${p}/%`))),
      );
    }

    const excludeConditions = excludePrefixes.map((p) =>
      notLike(cortexNodes.path, `${p}/%`),
    );

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
          ...pathConditions,
          ...excludeConditions,
        ),
      )
      .orderBy(
        sql`${cortexNodes.embedding} <=> ${sql.raw(`'${embeddingStr}'::vector`)}`,
      )
      .limit(limit * 3); // fetch extra, filter after scoring

    return rows
      .filter((r) => r.similarity > threshold) // filter on raw similarity before boosts
      .map((r) => {
        const recencyBoost = 0.1 * getRecencyFactor(r.updatedAt);
        const pathWeight = getPathTypeWeight(r.path);
        const adjustedScore = (r.similarity + recencyBoost) * pathWeight;
        const rawExcerpt = truncateContent(
          stripFrontmatter(r.content ?? ""),
          excerptLen,
        );
        return {
          path: r.path,
          excerpt: rawExcerpt,
          score: Math.round(adjustedScore * 100) / 100,
        };
      })
      .toSorted((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    logger.warn("Vector search failed — skipping", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

// ─── Memory Context ───────────────────────────────────────────────────────────

interface MemoryFile {
  path: string;
  content: string;
  priority: number;
  pinned: boolean;
}

async function loadMemoryContext(
  userId: string,
  memoriesPath: string,
  locale: string,
): Promise<{
  pinned: MemoryFile[];
  recent: MemoryFile[];
  totalCount: number;
  archivedCount: number;
}> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { eq, and, like, sql } = await import("drizzle-orm");

  const allFiles = await db
    .select({
      path: cortexNodes.path,
      content: cortexNodes.content,
      frontmatter: cortexNodes.frontmatter,
      updatedAt: cortexNodes.updatedAt,
    })
    .from(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        eq(cortexNodes.nodeType, CortexNodeType.FILE),
        like(cortexNodes.path, `${memoriesPath}/%`),
      ),
    )
    .orderBy(sql`${cortexNodes.updatedAt} DESC`);

  let archivedCount = 0;
  const pinned: MemoryFile[] = [];
  const active: MemoryFile[] = [];
  const existingPaths = new Set<string>();

  for (const file of allFiles) {
    existingPaths.add(file.path);
    const fm = file.frontmatter as Record<
      string,
      string | number | boolean | string[]
    > | null;
    if (fm?.archived === true || fm?.isArchived === true) {
      archivedCount++;
      continue;
    }
    const rawContent = file.content ?? "";
    if (!rawContent.trim()) {
      continue;
    }
    const mem: MemoryFile = {
      path: file.path,
      content: rawContent,
      priority: typeof fm?.priority === "number" ? fm.priority : 0,
      pinned: fm?.pinned === true,
    };
    if (mem.pinned) {
      pinned.push(mem);
    } else {
      active.push(mem);
    }
  }

  // Overlay virtual template files — only if they have meaningful content (not pure placeholders)
  try {
    const { getMemoryTemplates } = await import("../seeds/templates");
    const templates = getMemoryTemplates(
      locale as Parameters<typeof getMemoryTemplates>[0],
    );
    for (const tpl of templates) {
      // Only inject if not in DB yet and it's a direct file under memoriesPath/*/*.md
      if (existingPaths.has(tpl.path)) {
        continue;
      }
      // Only inject templates whose canonical path starts with /memories/
      if (!tpl.path.startsWith("/memories/")) {
        continue;
      }
      // Skip deep sub-paths (only identity/expertise/context/life direct files)
      const segments = tpl.path.split("/").filter(Boolean);
      if (segments.length !== 3) {
        continue;
      }
      if (!tpl.content.trim()) {
        continue;
      }
      active.push({
        path: tpl.path,
        content: tpl.content,
        priority: 0,
        pinned: false,
      });
      existingPaths.add(tpl.path);
    }
  } catch {
    // Templates optional — don't fail memory load
  }

  const recent = active.toSorted(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );

  return {
    pinned,
    recent,
    totalCount: pinned.length + active.length,
    archivedCount,
  };
}

// ─── Document Tree ─────────────────────────────────────────────────────────────

interface TrimmedDocDir {
  path: string;
  fileCount: number;
  shownFiles: string[];
  hiddenCount: number;
}

const DOC_TREE_MAX_SHOWN_PER_DIR = 6;

async function buildTrimmedDocTree(
  userId: string,
  documentsPath: string,
  locale: string,
): Promise<TrimmedDocDir[]> {
  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { sql } = await import("drizzle-orm");

  // Escape documentsPath for regex (e.g. /documents → \/documents)
  const escapedDocsPath = documentsPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Single query: get top-level dirs + their file counts + recent files via window function
  const rows = await db.execute(sql`
    WITH top_dirs AS (
      SELECT path
      FROM ${cortexNodes}
      WHERE user_id = ${userId}
        AND node_type = ${CortexNodeType.DIR}
        AND path ~ ${`^${escapedDocsPath}/[^/]+$`}
      ORDER BY sort_order ASC, path ASC
    ),
    files AS (
      SELECT
        f.path AS file_path,
        regexp_replace(f.path, '/[^/]+$', '') AS parent_dir,
        COUNT(*) OVER (PARTITION BY regexp_replace(f.path, '/[^/]+$', '')) AS dir_count,
        ROW_NUMBER() OVER (PARTITION BY regexp_replace(f.path, '/[^/]+$', '') ORDER BY f.updated_at DESC) AS rn
      FROM ${cortexNodes} f
      WHERE f.user_id = ${userId}
        AND f.node_type = ${CortexNodeType.FILE}
        AND f.path ~ ${`^${escapedDocsPath}/[^/]+/`}
    )
    SELECT
      d.path AS dir_path,
      COALESCE(f.dir_count, 0)::int AS file_count,
      f.file_path,
      f.rn
    FROM top_dirs d
    LEFT JOIN files f ON f.parent_dir = d.path AND f.rn <= ${DOC_TREE_MAX_SHOWN_PER_DIR}
    ORDER BY d.path ASC, f.rn ASC
  `);

  // Group rows by dir_path
  const dirMap = new Map<string, { fileCount: number; files: string[] }>();
  for (const row of rows.rows) {
    const dirPath = String(row.dir_path);
    const fileCount = Number(row.file_count ?? 0);
    if (!dirMap.has(dirPath)) {
      dirMap.set(dirPath, { fileCount, files: [] });
    }
    if (row.file_path) {
      dirMap.get(dirPath)!.files.push(String(row.file_path));
    }
  }

  const result: TrimmedDocDir[] = [...dirMap.entries()].map(
    ([dirPath, { fileCount, files }]) => ({
      path: dirPath,
      fileCount,
      shownFiles: files,
      hiddenCount: Math.max(0, fileCount - files.length),
    }),
  );

  // Overlay virtual document templates subdir if not already in DB
  try {
    const { getDocumentTemplates } = await import("../seeds/templates");
    const localeParam = locale as Parameters<typeof getDocumentTemplates>[0];
    const docTemplates = getDocumentTemplates(localeParam);
    const templateDirPath = `${documentsPath}/templates`;

    // NOTE: Do NOT inject empty default subdirs — they're clutter until the user has files there.

    // Inject template files into the templates subdir
    const templateDirEntry = result.find((d) => d.path === templateDirPath);
    const existingTemplatePaths = new Set(templateDirEntry?.shownFiles ?? []);
    const virtualTemplateFiles = docTemplates
      .filter((t) => !existingTemplatePaths.has(t.path))
      .map((t) => t.path);

    if (virtualTemplateFiles.length > 0) {
      if (templateDirEntry) {
        templateDirEntry.shownFiles.push(...virtualTemplateFiles);
        templateDirEntry.fileCount += virtualTemplateFiles.length;
      } else {
        result.push({
          path: templateDirPath,
          fileCount: virtualTemplateFiles.length,
          shownFiles: virtualTemplateFiles.slice(0, DOC_TREE_MAX_SHOWN_PER_DIR),
          hiddenCount: Math.max(
            0,
            virtualTemplateFiles.length - DOC_TREE_MAX_SHOWN_PER_DIR,
          ),
        });
      }
    }
  } catch {
    // Templates optional — don't fail doc tree
  }

  return result;
}

// ─── Thread Pinned ─────────────────────────────────────────────────────────────

interface PinnedThread {
  id: string;
  title: string;
  preview: string | null;
  rootFolderId: string;
}

async function loadPinnedThreads(userId: string): Promise<PinnedThread[]> {
  try {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { chatThreads } = await import("../../chat/db");
    const { eq, and } = await import("drizzle-orm");

    const rows = await db
      .select({
        id: chatThreads.id,
        title: chatThreads.title,
        preview: chatThreads.preview,
        rootFolderId: chatThreads.rootFolderId,
      })
      .from(chatThreads)
      .where(and(eq(chatThreads.userId, userId), eq(chatThreads.pinned, true)))
      .limit(5);

    return rows;
  } catch {
    return [];
  }
}

// ─── Skills: Faved + Created ───────────────────────────────────────────────────

interface SkillRecord {
  id: string;
  name: string;
  slug: string;
  systemPrompt: string | null;
}

async function loadFavedSkills(userId: string): Promise<SkillRecord[]> {
  try {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { chatFavorites } = await import("../../chat/favorites/db");
    const { eq } = await import("drizzle-orm");

    // Step 1: get skillIds from favorites — filter to UUID-format only (custom skills)
    const favRows = await db
      .select({ skillId: chatFavorites.skillId })
      .from(chatFavorites)
      .where(eq(chatFavorites.userId, userId))
      .limit(30);

    if (favRows.length === 0) {
      return [];
    }

    // System skill IDs are slugs (e.g. "quality-tester"), custom skill IDs are UUIDs
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const skillIds = favRows
      .map((r) => r.skillId)
      .filter((id) => UUID_RE.test(id));

    // Step 2: fetch skill details separately (avoids TDZ circular init with join)
    const { customSkills } = await import("../../chat/skills/db");
    const { inArray } = await import("drizzle-orm");

    const skillRows = await db
      .select({
        id: customSkills.id,
        name: customSkills.name,
        slug: customSkills.slug,
        systemPrompt: customSkills.systemPrompt,
      })
      .from(customSkills)
      .where(inArray(customSkills.id, skillIds))
      .limit(20);

    return skillRows;
  } catch {
    return [];
  }
}

async function loadCreatedSkills(userId: string): Promise<SkillRecord[]> {
  try {
    const { db } = await import("@/app/api/[locale]/system/db");
    const { customSkills } = await import("../../chat/skills/db");
    const { SkillOwnershipType } = await import("../../chat/skills/enum");
    const { eq, and, ne, sql } = await import("drizzle-orm");

    const rows = await db
      .select({
        id: customSkills.id,
        name: customSkills.name,
        slug: customSkills.slug,
        systemPrompt: customSkills.systemPrompt,
      })
      .from(customSkills)
      .where(
        and(
          eq(customSkills.userId, userId),
          ne(customSkills.ownershipType, SkillOwnershipType.SYSTEM),
        ),
      )
      .orderBy(sql`${customSkills.updatedAt} DESC`)
      .limit(10);

    return rows;
  } catch {
    return [];
  }
}

// ─── Task Summary ─────────────────────────────────────────────────────────────

async function loadTasksForCortex(
  userId: string,
  logger: EndpointLogger,
): Promise<{ items: CronTaskItem[]; totalCount: number }> {
  try {
    const { CronTasksRepository } =
      await import("@/app/api/[locale]/system/unified-interface/tasks/cron/repository");
    const items = await CronTasksRepository.loadTaskItems({ userId, logger });
    return { items, totalCount: items.length };
  } catch {
    return { items: [], totalCount: 0 };
  }
}

// ─── Favorites Summary ────────────────────────────────────────────────────────

async function loadFavoritesForCortex(
  userId: string,
  logger: EndpointLogger,
): Promise<{ items: FavoriteSummaryItem[]; activeId: string | null }> {
  try {
    // Dynamic imports only — skip DEFAULT_SKILLS/skills/config/skills/i18n (pull in UI widget chain → TDZ)
    // Default skill IDs are friendly slugs (e.g. "thea", "vibe-coder") — non-UUID, treated as canonical.
    const [
      { chatFavorites },
      { chatSettings },
      { db: favDb },
      { asc: favAsc, eq: favEq, inArray: favInArray },
    ] = await Promise.all([
      import("@/app/api/[locale]/agent/chat/favorites/db"),
      import("@/app/api/[locale]/agent/chat/settings/db"),
      import("@/app/api/[locale]/system/db"),
      import("drizzle-orm"),
    ]);

    const [settingsRow] = await favDb
      .select({ activeFavoriteId: chatSettings.activeFavoriteId })
      .from(chatSettings)
      .where(favEq(chatSettings.userId, userId))
      .limit(1);
    const activeFavoriteId = settingsRow?.activeFavoriteId ?? null;

    const rows = await favDb
      .select()
      .from(chatFavorites)
      .where(favEq(chatFavorites.userId, userId))
      .orderBy(favAsc(chatFavorites.position));

    if (rows.length === 0) {
      return { items: [], activeId: null };
    }

    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // Only look up custom skills (UUID-based IDs); default skills are already canonical slugs
    const skillNameMap = new Map<string, string>();
    const skillSlugMap = new Map<string, string>();
    const customSkillUuids = [
      ...new Set(rows.map((r) => r.skillId).filter((id) => UUID_RE.test(id))),
    ];

    if (customSkillUuids.length > 0) {
      const { customSkills: customSkillsTable } =
        await import("@/app/api/[locale]/agent/chat/skills/db");
      const customSkillsList = await favDb
        .select({
          id: customSkillsTable.id,
          slug: customSkillsTable.slug,
          name: customSkillsTable.name,
        })
        .from(customSkillsTable)
        .where(favInArray(customSkillsTable.id, customSkillUuids));
      for (const s of customSkillsList) {
        skillNameMap.set(s.id, s.name);
        if (s.slug) {
          skillSlugMap.set(s.id, s.slug);
        }
      }
    }

    const items: FavoriteSummaryItem[] = rows.map((row) => {
      // For default skills: skillId IS the canonical slug (e.g. "thea")
      // For custom skills: resolve UUID → slug via skillSlugMap
      const canonicalSkillId = skillSlugMap.get(row.skillId) ?? row.skillId;
      const rawSlug = row.slug || row.id;
      const externalId =
        rawSlug && !UUID_RE.test(rawSlug) ? rawSlug : canonicalSkillId;
      // Use the favorite's own slug as display name (e.g. "thea-brilliant" > "thea" for system prompt)
      const displayName = row.customVariantName ?? externalId;
      const sel = row.modelSelection as { manualModelId?: string } | null;
      const resolvedModelId = sel?.manualModelId ?? null;
      return {
        id: externalId,
        name: displayName,
        skillId: canonicalSkillId,
        characterName: displayName,
        modelId: resolvedModelId,
        modelInfo: "",
        isActive: row.slug === activeFavoriteId || row.id === activeFavoriteId,
        position: row.position,
        useCount: row.useCount,
        lastUsedAt: row.lastUsedAt,
      };
    });

    const activeItem = items.find((f) => f.isActive);
    return { items, activeId: activeItem?.id ?? null };
  } catch (err) {
    logger.warn("loadFavoritesForCortex failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return { items: [], activeId: null };
  }
}

// ─── Tree Builders ────────────────────────────────────────────────────────────

function buildMemoriesDir(
  memCtx: Awaited<ReturnType<typeof loadMemoryContext>>,
  relevant: RelevantNode[],
  budgetChars: number,
  memoriesPath: string,
): CortexDirEntry {
  const { pinned, recent, totalCount, archivedCount } = memCtx;

  const countNote =
    archivedCount > 0 ? `${totalCount} · ${archivedCount} archived` : undefined;

  // Build ordered list of ALL files (structure), then assign content by priority within budget
  // Priority for content: pinned > relevant > recency (by priority desc)
  const relevantPaths = new Set(relevant.map((n) => n.path));
  const pinnedPaths = new Set(pinned.map((m) => m.path));

  // Ordered list: pinned first, then relevant (not pinned), then recent (not pinned/relevant)
  const orderedForContent: Array<{
    path: string;
    kind: "pinned" | "relevant" | "recent";
  }> = [
    ...pinned.map((m) => ({ path: m.path, kind: "pinned" as const })),
    ...relevant
      .filter((n) => !pinnedPaths.has(n.path))
      .map((n) => ({ path: n.path, kind: "relevant" as const })),
    ...recent
      .filter((m) => !pinnedPaths.has(m.path) && !relevantPaths.has(m.path))
      .map((m) => ({ path: m.path, kind: "recent" as const })),
  ];

  // Assign content budget
  const contentMap = new Map<string, string>(); // path → excerpt
  let usedChars = 0;
  let remainingRecentItems = orderedForContent.filter(
    (x) => x.kind === "recent",
  ).length;

  for (const item of orderedForContent) {
    if (usedChars >= budgetChars) {
      break;
    }
    const remaining = budgetChars - usedChars;
    let excerpt = "";
    if (item.kind === "pinned") {
      const m = pinned.find((x) => x.path === item.path)!;
      excerpt = cleanExcerpt(m.content).slice(0, Math.min(300, remaining));
    } else if (item.kind === "relevant") {
      const n = relevant.find((x) => x.path === item.path)!;
      excerpt = cleanExcerpt(n.excerpt).slice(0, Math.min(200, remaining));
    } else {
      const m = recent.find((x) => x.path === item.path)!;
      // Per-file budget = remaining / unprocessed recent items (tracked incrementally)
      const perBudget =
        remainingRecentItems > 0
          ? Math.floor(remaining / remainingRecentItems)
          : remaining;
      remainingRecentItems--;
      excerpt = cleanExcerpt(m.content).slice(
        0,
        Math.min(400, Math.max(40, perBudget)),
      );
    }
    contentMap.set(item.path, excerpt);
    usedChars += excerpt.length + 30;
  }

  // Show all files that fit within budget — no arbitrary hard cap
  const shownPaths = orderedForContent
    .filter((x) => contentMap.has(x.path))
    .map((x) => x.path);
  const hiddenCount = Math.max(0, orderedForContent.length - shownPaths.length);

  const children: CortexFileEntry[] = shownPaths.map((path) => {
    const isPinned = pinnedPaths.has(path);
    const relevantNode = relevant.find((n) => n.path === path);
    const score = relevantNode?.score;
    return {
      kind: "file",
      path,
      displayName: baseName(path),
      excerpt: contentMap.get(path) ?? "",
      pinned: isPinned || undefined,
      score,
    };
  });

  return {
    kind: "dir",
    path: memoriesPath,
    displayName: `${memoriesPath.replace(/^\//, "")}/`,
    totalCount,
    children,
    hiddenCount,
    countNote,
  };
}

function buildDocumentsDir(
  relevant: RelevantNode[],
  docTree: TrimmedDocDir[],
  budgetChars: number,
  documentsPath: string,
  totalCount: number,
): CortexDirEntry {
  // Build content map for relevant docs (budget-limited)
  const contentMap = new Map<string, { excerpt: string; score: number }>();
  let usedChars = 0;
  for (const n of relevant) {
    if (usedChars >= budgetChars) {
      break;
    }
    const excerpt = cleanExcerpt(n.excerpt).slice(0, 150);
    contentMap.set(n.path, { excerpt, score: n.score });
    usedChars += excerpt.length + 30;
  }

  // Dir tree — each top-level subdir with its files, content for relevant. Skip empty dirs.
  const children: CortexEntry[] = [];
  for (const dir of docTree) {
    if (dir.fileCount === 0 && dir.shownFiles.length === 0) {
      continue; // Don't show empty subdirs — clutter
    }
    const dirName = dir.path.split("/").pop() ?? dir.path;
    const subChildren: CortexFileEntry[] = dir.shownFiles.map((filePath) => {
      const hit = contentMap.get(filePath);
      return {
        kind: "file",
        path: filePath,
        displayName: baseName(filePath),
        excerpt: hit?.excerpt ?? "",
        score: hit?.score,
      };
    });

    children.push({
      kind: "dir",
      path: dir.path,
      displayName: `${dirName}/`,
      totalCount: dir.fileCount,
      children: subChildren,
      hiddenCount: dir.hiddenCount,
    });
  }

  // Use actual shown file count if DB count is 0 (e.g. only virtual template files shown)
  const effectiveTotal =
    totalCount > 0
      ? totalCount
      : docTree.reduce((sum, d) => sum + d.fileCount, 0);

  return {
    kind: "dir",
    path: documentsPath,
    displayName: `${documentsPath.replace(/^\//, "")}/`,
    totalCount: effectiveTotal,
    children,
    hiddenCount: 0,
  };
}

function buildThreadsDir(
  pinned: PinnedThread[],
  relevant: RelevantNode[],
  threadCounts: { total: number; byRoot: Record<string, number> },
): CortexDirEntry {
  const { total, byRoot } = threadCounts;

  const USER_FOLDERS = new Set(["private", "shared", "public"]);
  const userCounts = Object.entries(byRoot).filter(
    ([root, c]) => c > 0 && USER_FOLDERS.has(root),
  );
  const systemTotal = Object.entries(byRoot)
    .filter(([root, c]) => c > 0 && !USER_FOLDERS.has(root))
    .reduce((sum, [, c]) => sum + c, 0);
  const userTotal = userCounts.reduce((sum, [, c]) => sum + c, 0);
  const parts = userCounts.map(([root, c]) => `${root}: ${c}`);
  const sysNote = systemTotal > 0 ? ` · ${systemTotal} background` : "";
  const countNote = userTotal > 0 ? `${parts.join(", ")}${sysNote}` : undefined;

  const children: CortexFileEntry[] = [];
  const shownPaths = new Set<string>();

  // Pinned threads
  for (const t of pinned) {
    const excerpt = t.preview ? cleanExcerpt(t.preview).slice(0, 150) : "";
    children.push({
      kind: "file",
      path: `/threads/${t.rootFolderId}/${t.id}`,
      displayName: t.title,
      excerpt,
      pinned: true,
    });
    shownPaths.add(t.id);
  }

  // Relevant threads (from vector search on cortexNodes)
  for (const n of relevant) {
    const slug = n.path.replace(/^\/threads\/[^/]+\//, "").replace(/\.md$/, "");
    if (shownPaths.has(slug)) {
      continue;
    }
    const excerpt = cleanExcerpt(n.excerpt)
      .replace(/^(Folder|user|assistant|tool):[^·]*·?\s*/i, "")
      .slice(0, 120);
    children.push({
      kind: "file",
      path: n.path,
      displayName: slug,
      excerpt,
      score: n.score,
    });
    shownPaths.add(slug);
  }

  return {
    kind: "dir",
    path: "/threads",
    displayName: "threads/",
    totalCount: total,
    children,
    hiddenCount: 0,
    countNote,
  };
}

function buildSkillsDir(
  faved: SkillRecord[],
  created: SkillRecord[],
  relevant: RelevantNode[],
  budgetChars: number,
): CortexDirEntry {
  const favedIds = new Set(faved.map((s) => s.id));
  const createdIds = new Set(created.map((s) => s.id));

  const children: CortexFileEntry[] = [];
  let usedChars = 0;
  const shownIds = new Set<string>();

  // Faved skills first
  for (const s of faved) {
    if (usedChars >= budgetChars) {
      break;
    }
    const excerpt = s.systemPrompt ? skillExcerpt(s.systemPrompt) : "";
    const slug = s.slug || s.id;
    children.push({
      kind: "file",
      path: `/skills/${slug}`,
      displayName: `${s.name} (${slug})`,
      excerpt,
      favored: true,
      created: createdIds.has(s.id),
    });
    usedChars += excerpt.length + 50;
    shownIds.add(s.id);
  }

  // Created-only skills (not faved)
  for (const s of created) {
    if (shownIds.has(s.id)) {
      continue;
    }
    if (usedChars >= budgetChars) {
      break;
    }
    const excerpt = s.systemPrompt ? skillExcerpt(s.systemPrompt) : "";
    const slug = s.slug || s.id;
    children.push({
      kind: "file",
      path: `/skills/${slug}`,
      displayName: `${s.name} (${slug})`,
      excerpt,
      created: true,
      favored: favedIds.has(s.id),
    });
    usedChars += excerpt.length + 50;
    shownIds.add(s.id);
  }

  // Relevant from vector search (user skills in cortexNodes — skip default/ system skills)
  for (const n of relevant) {
    if (n.path.startsWith("/skills/default/")) {
      continue;
    }
    // Extract skill ID from path (e.g. /skills/<uuid>.md or /skills/<uuid>/...)
    const pathParts = n.path.replace(/^\/skills\//, "").split("/");
    const maybeId = pathParts[0]?.replace(/\.md$/, "") ?? "";
    if (shownIds.has(maybeId)) {
      continue;
    }
    if (usedChars >= budgetChars) {
      break;
    }
    const skillBasename =
      n.path.split("/").pop()?.replace(/\.md$/, "") ?? n.path;
    const excerpt = cleanExcerpt(n.excerpt).slice(0, 100);
    children.push({
      kind: "file",
      path: n.path,
      displayName: skillBasename,
      excerpt,
      score: n.score,
    });
    usedChars += excerpt.length + 50;
    shownIds.add(maybeId);
  }

  const favedCount = faved.length;
  const createdCount = created.length;
  // Show user-visible count (faved + created-only), not total cortexNodes count
  const visibleCount =
    favedCount + created.filter((s) => !favedIds.has(s.id)).length;

  return {
    kind: "dir",
    path: "/skills",
    displayName: "skills/",
    totalCount: visibleCount,
    children,
    hiddenCount: 0,
    countNote:
      createdCount > 0 && favedCount > 0
        ? `${createdCount} created · ${favedCount} faved`
        : createdCount > 0
          ? `${createdCount} created`
          : favedCount > 0
            ? `${favedCount} faved`
            : undefined,
  };
}

function buildTasksDir(tasks: {
  items: CronTaskItem[];
  totalCount: number;
}): CortexDirEntry {
  const { items, totalCount } = tasks;

  const MAX_TASKS_SHOWN = 8;
  // Deduplicate by shortId (loadTaskItems may return duplicates)
  const seen = new Set<string>();
  const deduped = items.filter((t) => {
    if (seen.has(t.shortId)) {
      return false;
    }
    seen.add(t.shortId);
    return true;
  });
  const shown = deduped.slice(0, MAX_TASKS_SHOWN);

  const children: CortexFileEntry[] = shown.map((t) => {
    const shortName = t.displayName
      .replace(/\s*—.*$/, "")
      .replace(/\s+-\s+.+$/, "")
      .trim()
      .slice(0, 50);
    const statusFlag = t.enabled ? "" : " [disabled]";
    const errorNote =
      t.consecutiveFailures > 0
        ? ` ⚠ ${t.consecutiveFailures} consecutive failure${t.consecutiveFailures === 1 ? "" : "s"}`
        : t.errorCount > 0
          ? ` ⚠ ${t.errorCount} error${t.errorCount === 1 ? "" : "s"}`
          : "";
    const lastRun = t.lastExecutedAt
      ? ` last:${t.lastExecutionStatus ?? "?"}@${t.lastExecutedAt.slice(0, 10)}`
      : "";
    const excerpt =
      `${t.schedule ?? ""}${statusFlag}${lastRun}${errorNote}`.trim();
    return {
      kind: "file",
      path: `/tasks/${t.shortId}`,
      displayName: `${shortName}`,
      excerpt,
    };
  });

  return {
    kind: "dir",
    path: "/tasks",
    displayName: "tasks/",
    totalCount,
    children,
    hiddenCount: Math.max(0, totalCount - MAX_TASKS_SHOWN),
  };
}

function buildFavoritesDir(
  items: FavoriteSummaryItem[],
  activeId: string | null,
): CortexDirEntry {
  const MAX_FAVS_SHOWN = 10;
  const shown = items.slice(0, MAX_FAVS_SHOWN);

  const children: CortexFileEntry[] = shown.map((f) => {
    const activeFlag = f.isActive ? " [ACTIVE]" : "";
    const model = f.modelId ?? f.modelInfo;
    const skillNote = f.skillId ? ` skill:${f.skillId}` : "";
    const uses = f.useCount > 0 ? ` uses:${f.useCount}` : "";
    const excerpt = `model:${model}${skillNote}${uses}${activeFlag}`.trim();
    return {
      kind: "file",
      path: `/favorites/${f.id}`,
      displayName: f.name,
      excerpt,
    };
  });

  const activeItem = items.find((f) => f.id === activeId);
  const countNote = activeItem ? `active: ${activeItem.name}` : undefined;

  return {
    kind: "dir",
    path: "/favorites",
    displayName: "favorites/",
    totalCount: items.length,
    children,
    hiddenCount: Math.max(0, items.length - MAX_FAVS_SHOWN),
    countNote,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function baseName(path: string): string {
  return path.split("/").pop() ?? path;
}

/** Extract a short excerpt from a skill system prompt, stripping "You are X," opener */
function skillExcerpt(systemPrompt: string): string {
  const cleaned = cleanExcerpt(systemPrompt)
    // Strip "You are X, ..." opener — the name already shown in displayName
    .replace(/^you are [^,.]+[,.]?\s*/i, "")
    .trim();
  return cleaned.slice(0, 100);
}

// ─── Debug: Raw Embedding Scores ─────────────────────────────────────────────

export interface RawEmbeddingScore {
  path: string;
  baseSimilarity: number;
  recencyBoost: number;
  pathWeight: number;
  adjustedScore: number;
  passesThreshold: boolean;
}

export async function loadRawEmbeddingScores(
  userId: string,
  userMessage: string,
): Promise<{ scores: RawEmbeddingScore[]; embeddingGenerated: boolean }> {
  const { generateEmbedding } = await import("../embeddings/service");
  const queryEmbedding = await generateEmbedding(userMessage);
  if (!queryEmbedding) {
    return { scores: [], embeddingGenerated: false };
  }

  const { db } = await import("@/app/api/[locale]/system/db");
  const { cortexNodes } = await import("../db");
  const { CortexNodeType } = await import("../enum");
  const { eq, and, isNotNull, sql } = await import("drizzle-orm");

  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const rows = await db
    .select({
      path: cortexNodes.path,
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
    .limit(20);

  const scores: RawEmbeddingScore[] = rows.map((r) => {
    const baseSimilarity = r.similarity;
    const recencyBoost = 0.1 * getRecencyFactor(r.updatedAt);
    const pathWeight = getPathTypeWeight(r.path);
    const adjustedScore = (baseSimilarity + recencyBoost) * pathWeight;
    return {
      path: r.path,
      baseSimilarity: Math.round(baseSimilarity * 1000) / 1000,
      recencyBoost: Math.round(recencyBoost * 1000) / 1000,
      pathWeight,
      adjustedScore: Math.round(adjustedScore * 1000) / 1000,
      passesThreshold: adjustedScore > 0.4,
    };
  });

  return { scores, embeddingGenerated: true };
}
