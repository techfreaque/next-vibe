/* eslint-disable i18next/no-literal-string */
import "server-only";

import type { sql as sqlTag } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { languageConfig } from "next-vibe/core/i18n";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { parseError } from "next-vibe/core/utils/parse-error";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CronTaskItem } from "next-vibe/tasks/cron/tasks/definition";

import type { SystemPromptFragment } from "../ai-stream/system-prompt/types";
import type { chatMessages as chatMessagesTable } from "../chat/db";
import type { ChatMessageRole as chatMessageRoleValue } from "../chat/enum";
import type { FavoriteSummaryItem } from "../skills/favorites/favorites-formatter";
import { stripFrontmatter, truncateContent } from "./_shared/text-utils";
import {
  CORTEX_EXEC_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
  CORTEX_TERMINALS_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "./constants";
import type { cortexNodes as cortexNodesTable } from "./db";
import type { CortexNodeType as cortexNodeTypeValue } from "./enum";

// Type-only imports above give vectorSearchPglite's parameters real types
// instead of `any`; the actual modules are still loaded dynamically at call
// time in vectorSearch(), matching the rest of this file's lazy-import style
// — a type-only import is fully erased and never triggers a runtime import.
type SqlTagType = typeof sqlTag;
type CortexNodesTableType = typeof cortexNodesTable;
type ChatMessagesTableType = typeof chatMessagesTable;
type CortexNodeTypeShape = typeof cortexNodeTypeValue;
type ChatMessageRoleShape = typeof chatMessageRoleValue;

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single file entry in the cortex tree */
export interface CortexFileEntry {
  kind: "file";
  /** Canonical path e.g. /memories/identity/name.md */
  path: string;
  /** Display name - basename without extension */
  displayName: string;
  /** Content to show inline below the filename (empty = filename only) */
  excerpt: string;
  /** Adjusted similarity score 0-1 (from vector search) */
  score?: number;
  /** From cortexNodes frontmatter pinned:true */
  pinned?: boolean;
  /** Skill is in chatFavorites for this user */
  favored?: boolean;
  /** Skill is user-authored (customSkills) */
  created?: boolean;
}

/** A directory entry in the cortex tree */
export interface CortexDirEntry {
  kind: "dir";
  /** Canonical path e.g. /memories or /documents/inbox */
  path: string;
  /** Display name shown as header e.g. "memories/" */
  displayName: string;
  /** Total file count in this mount/dir */
  totalCount: number;
  /** Files/subdirs to show (pinned + relevant + recent up to budget) */
  children: CortexEntry[];
  /** Items beyond budget not shown */
  hiddenCount: number;
  /** For threads: archived/background count note */
  countNote?: string;
}

export type CortexEntry = CortexFileEntry | CortexDirEntry;

// ─── Fragment ─────────────────────────────────────────────────────────────────

export const cortexFragment: SystemPromptFragment = {
  id: "cortex",
  placement: "trailing",
  priority: 190,
  build: async (params) => {
    const { user, logger, isIncognito, locale, headless, rootFolderId } =
      params;

    const { country } = getLanguageAndCountryFromLocale(locale);
    const countryInfo = languageConfig.countryInfo[country];
    const languageName = countryInfo?.langName;
    const userId = user.isPublic ? undefined : user.id;

    const { getLocaleRoots } = await import("./seeds/templates");
    const localeRoots = getLocaleRoots(locale);

    const emptyBase = {
      tree: [] as CortexEntry[],
      threadCounts: {} as Record<string, number>,
      totalThreads: 0,
      uploadCount: 0,
      searchCount: 0,
      genCount: 0,
      taskCount: 0,
      languageName,
      localeRoots,
    };

    const isPublicFolder = rootFolderId === "public";
    const blockCortex =
      !userId || (!headless && (isIncognito || isPublicFolder));

    if (blockCortex) {
      let unavailableNote: string;
      if (isIncognito && userId) {
        unavailableNote =
          "Not available in incognito - nothing leaves the browser by design. Switch to your private folder to access memories and tasks.";
      } else if (isIncognito) {
        unavailableNote =
          "Not available in incognito. Create a free account and use the private folder to get persistent memory across conversations.";
      } else if (isPublicFolder && userId) {
        unavailableNote =
          "Not available in the public folder. Switch to your private folder to access memories and tasks.";
      } else {
        unavailableNote =
          "Not available without an account. Sign in and use the private folder to access persistent memory.";
      }
      return renderCortexFragment({ unavailableNote });
    }

    try {
      const { getVirtualMountCounts } = await import("./mounts/resolver");
      const currentThreadId = params.threadId;

      // Exclude the current thread from results via clean path prefix match.
      const threadExcludePrefixes = currentThreadId
        ? [
            `/threads/private/${currentThreadId}`,
            `/threads/shared/${currentThreadId}`,
            `/threads/public/${currentThreadId}`,
          ]
        : [];

      // Await the just-written user message's embed (FIRED at write time,
      // overlapped with setup work) so its stored vector is present for the
      // search below — no race, and the message write itself never blocked on
      // the embedding. Best-effort: a failed embed just means one fewer vector.
      if (params.messageEmbedReady) {
        await params.messageEmbedReady.catch(() => undefined);
      }

      // Cortex search uses this thread's STORED message embeddings (written at
      // message-write time) as its query vectors — no embedding is generated
      // here. It's a single SQL query; an empty thread (no vectors yet) yields
      // no relevant nodes, which is fine (cortex data is optional).
      const allRelevant = currentThreadId
        ? await vectorSearch({
            userId,
            threadId: currentThreadId,
            excludePrefixes: threadExcludePrefixes,
            limit: 40,
            threshold: 0.4,
            excerptLen: 200,
            logger,
          })
        : [];

      const memRelevant = allRelevant.filter((n) =>
        n.path.startsWith("/memories"),
      );
      const docRelevant = allRelevant.filter((n) =>
        n.path.startsWith("/documents"),
      );
      // Thread exclusion is now handled in vectorSearch via excludePrefixes —
      // the path prefix cleanly covers all thread chunk paths.
      const threadRelevant = allRelevant.filter(
        (n) =>
          /^\/threads\/(private|shared|public)\//.test(n.path) &&
          n.score >= 0.65,
      );
      const skillRelevant = allRelevant.filter(
        (n) => n.path.startsWith("/skills") && n.score >= 0.7,
      );

      await import("../skills/db").catch(() => null);

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
        getVirtualMountCounts(
          userId,
          !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN),
        ),
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

      const memoriesDir = buildMemoriesDir(
        memCtx,
        memRelevant,
        CHAR_BUDGET.memories,
        localeRoots.memories,
      );
      const memoriesUsed = memoriesDir.children.reduce(
        (sum, c) => sum + (c.kind === "file" ? c.excerpt.length + 30 : 0),
        0,
      );
      const docBudget = Math.min(
        CHAR_BUDGET.memoriesAndDocuments - memoriesUsed,
        CHAR_BUDGET.documents,
      );
      const documentsDir = buildDocumentsDir(
        docRelevant,
        docTree,
        Math.max(0, docBudget),
        localeRoots.documents,
        counts.documents ?? 0,
      );
      const tree: CortexEntry[] = [
        memoriesDir,
        documentsDir,
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

      const data = {
        ...emptyBase,
        tree,
        threadCounts: counts.threads.byRoot,
        totalThreads: counts.threads.total,
        uploadCount,
        searchCount,
        genCount,
        taskCount,
      };

      return renderCortexFragment(data);
    } catch (error) {
      logger.error("Failed to load Cortex data for system prompt", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  },
};

// ─── Render Data Type + Pure Renderer ────────────────────────────────────────

/** Data shape produced internally by cortexFragment.build — testable without full params */
export interface CortexRenderData {
  tree: CortexEntry[];
  threadCounts: Record<string, number>;
  totalThreads: number;
  uploadCount: number;
  searchCount: number;
  genCount: number;
  taskCount: number;
  languageName: string | undefined;
  localeRoots: { memories: string; documents: string };
}

/** Unavailable cortex state — no data, just a reason string */
export interface CortexUnavailableData {
  unavailableNote: string;
}

/** Pure renderer: called by cortexFragment.build after data assembly, exported for tests */
export function renderCortexFragment(
  data: CortexRenderData | CortexUnavailableData,
): string {
  if ("unavailableNote" in data) {
    return `## Cortex\n${data.unavailableNote}`;
  }

  const memoriesPath = data.localeRoots.memories;
  const documentsPath = data.localeRoots.documents;

  const memDir = data.tree.find(
    (e) => e.kind === "dir" && e.path === memoriesPath,
  ) as CortexDirEntry | undefined;
  const docDir = data.tree.find(
    (e) => e.kind === "dir" && e.path === documentsPath,
  ) as CortexDirEntry | undefined;
  const skillDir = data.tree.find(
    (e) => e.kind === "dir" && e.path === "/skills",
  ) as CortexDirEntry | undefined;
  const favDir = data.tree.find(
    (e) => e.kind === "dir" && e.path === "/favorites",
  ) as CortexDirEntry | undefined;

  const isEmptyWorkspace =
    (memDir?.totalCount ?? 0) === 0 &&
    (docDir?.totalCount ?? 0) === 0 &&
    data.totalThreads === 0 &&
    (skillDir?.totalCount ?? 0) === 0 &&
    (favDir?.totalCount ?? 0) === 0 &&
    data.uploadCount === 0 &&
    data.searchCount === 0;

  const langNote = data.languageName
    ? `**Language:** Write all content in ${data.languageName} - the user's language.\n`
    : "";

  const emptyNotice = isEmptyWorkspace
    ? `\n> Empty workspace - learn the user's name, role, goals. Write to ${memoriesPath}/identity/ right now.\n`
    : "";

  const treeStr = renderCortexTree(data);

  return `## Cortex (Your Persistent Brain)
Shared memory between you and the user. Persists across conversations. You read and write files directly.
${langNote}${emptyNotice}
${treeStr}

**Tools:** \`${CORTEX_WRITE_ALIAS}\` (create/overwrite) · \`cortex-edit\` (targeted edits — prefer over write) · \`${CORTEX_READ_ALIAS}\` · \`${CORTEX_SEARCH_ALIAS}\` · \`${CORTEX_LIST_ALIAS}\` (+ move/delete/mkdir/tree - \`tool-help query="cortex"\`)
**Write proactively:** After learning something new about the user, write it. After completing a task, document it. After spotting a stale memory, update it. Use \`cortex-edit\` to update existing files, \`${CORTEX_WRITE_ALIAS}\` only for new files or full rewrites.
**Rules:** One idea per file. <200 words. Names: \`specific-kebab-case.md\`. Consolidate duplicates. Archive (\`archived: true\` frontmatter) over deleting. Pin critical files (\`pinned: true\`) - always shown.
**Writable:** ${memoriesPath}/ (knowledge) · ${documentsPath}/ (working files) · /skills/ (custom skills)
**Read-only:** /threads/ · /uploads/ · /searches/ · /gens/ · /favorites/ · /tasks/ · /ssh/ - use \`${CORTEX_READ_ALIAS}\` or \`${CORTEX_LIST_ALIAS}\` only
**SSH/Machines:** \`${CORTEX_LIST_ALIAS}(path="/ssh")\` → machines + their mounts. \`${CORTEX_EXEC_ALIAS}(path="/ssh/<machine>", command="...")\` → run commands (only /ssh/ paths). \`${CORTEX_TERMINALS_ALIAS}\` → active terminals with cwd. Mounts at \`/ssh/<machine>/<mount>/\` → shortcuts to configured dirs (terminal retains full machine access). Default mount sets initial cwd for new sessions. \`${CORTEX_LIST_ALIAS}(path="/ssh/<machine>/<mount>/")\` → browse mount. \`${CORTEX_READ_ALIAS}(path="/ssh/<machine>/path")\` → read file.`;
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

/** Clean an excerpt for inline display: strip heading, collapse newlines, trim */
export function cleanExcerpt(text: string): string {
  return stripFrontmatter(text)
    .replace(/^#+\s+[^\n]*\n?/, "") // strip leading heading
    .replaceAll(/\n+/g, " · ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

// ─── Tree Renderer ────────────────────────────────────────────────────────────

const TREE_BRANCH = "├──";
const TREE_LAST = "└──";
const TREE_PIPE = "│   ";
const TREE_SPACE = "    ";

/**
 * Render the unified cortex folder tree.
 * Files with content show it on a second line below the filename:
 *   ├── name.md [📌]
 *   │   Full content excerpt here...
 * Files without content show just the filename:
 *   ├── name.md [80%]
 */
export function renderCortexTree(data: {
  tree: CortexEntry[];
  uploadCount: number;
  searchCount: number;
  genCount: number;
}): string {
  const { tree, uploadCount, searchCount, genCount } = data;

  // Only show non-empty dirs
  const visibleDirs = tree.filter(
    (e): e is CortexDirEntry =>
      e.kind === "dir" && (e.totalCount > 0 || e.children.length > 0),
  );

  // Append uploads/searches/gens as leaf summary lines at root level
  const extraLeafs: string[] = [];
  if (uploadCount > 0) {
    extraLeafs.push(
      `/uploads/ (${uploadCount} - images, documents, audio, video)`,
    );
  }
  if (searchCount > 0) {
    extraLeafs.push(`/searches/ (${searchCount} - by month)`);
  }
  if (genCount > 0) {
    extraLeafs.push(`/gens/ (${genCount} - images, audio, video)`);
  }

  const lines: string[] = ["/ (cortex)"];

  for (let i = 0; i < visibleDirs.length; i++) {
    const dir = visibleDirs[i]!;
    const isLast = i === visibleDirs.length - 1 && extraLeafs.length === 0;
    const branch = isLast ? TREE_LAST : TREE_BRANCH;
    const childIndent = isLast ? TREE_SPACE : TREE_PIPE;

    // Dir header line: "├── memories/ (48 · 4 archived)"
    const countStr = dir.countNote ?? String(dir.totalCount);
    lines.push(`${branch} ${dir.displayName} (${countStr})`);

    // Children
    const children = dir.children;
    const hasHiddenAfter = dir.hiddenCount > 0;
    for (let j = 0; j < children.length; j++) {
      const child = children[j]!;
      const childIsLast = j === children.length - 1 && !hasHiddenAfter;
      const childBranch = childIsLast ? TREE_LAST : TREE_BRANCH;
      const contentIndent =
        childIndent + (childIsLast ? TREE_SPACE : TREE_PIPE);

      if (child.kind === "file") {
        const fileLines = renderFileEntryLines(child);
        lines.push(`${childIndent}${childBranch} ${fileLines[0]}`);
        for (let l = 1; l < fileLines.length; l++) {
          lines.push(`${contentIndent}${fileLines[l]}`);
        }
      } else {
        // Sub-directory (e.g. documents/inbox/, documents/templates/)
        const subHeader = renderSubDirHeader(child);
        lines.push(`${childIndent}${childBranch} ${subHeader}`);
        const subIndent = childIndent + (childIsLast ? TREE_SPACE : TREE_PIPE);
        const subHasHidden = child.hiddenCount > 0;
        for (let k = 0; k < child.children.length; k++) {
          const subChild = child.children[k]!;
          const subChildIsLast =
            k === child.children.length - 1 && !subHasHidden;
          const subChildBranch = subChildIsLast ? TREE_LAST : TREE_BRANCH;
          const subContentIndent =
            subIndent + (subChildIsLast ? TREE_SPACE : TREE_PIPE);
          if (subChild.kind === "file") {
            const subFileLines = renderFileEntryLines(subChild);
            lines.push(`${subIndent}${subChildBranch} ${subFileLines[0]}`);
            for (let l = 1; l < subFileLines.length; l++) {
              lines.push(`${subContentIndent}${subFileLines[l]}`);
            }
          }
        }
        if (subHasHidden) {
          lines.push(`${subIndent}${TREE_LAST} +${child.hiddenCount} more`);
        }
      }
    }

    // Hidden count
    if (hasHiddenAfter) {
      lines.push(`${childIndent}${TREE_LAST} +${dir.hiddenCount} more`);
    }
  }

  // Extra leaf entries at root level
  for (let i = 0; i < extraLeafs.length; i++) {
    const isLast = i === extraLeafs.length - 1;
    const branch = isLast ? TREE_LAST : TREE_BRANCH;
    lines.push(`${branch} ${extraLeafs[i]}`);
  }

  return lines.join("\n");
}

function renderSubDirHeader(dir: CortexDirEntry): string {
  return `${dir.displayName} (${dir.totalCount} files)`;
}

/**
 * Render a file entry as 1 or 2 lines.
 * Line 1: filename with badges/score
 * Line 2 (optional): inline content excerpt
 */
function renderFileEntryLines(entry: CortexFileEntry): string[] {
  const pinMark = entry.pinned ? "[📌] " : "";

  let scoreSuffix = "";
  if (entry.score !== undefined && !entry.pinned) {
    scoreSuffix = ` [${Math.round(entry.score * 100)}%]`;
  }

  let badge = "";
  if (entry.favored && entry.created) {
    badge = " (★ created)";
  } else if (entry.favored) {
    badge = " (★)";
  } else if (entry.created) {
    badge = " (created)";
  }

  const firstLine = `${pinMark}${entry.displayName}${scoreSuffix}${badge}`;

  if (!entry.excerpt) {
    return [firstLine];
  }

  return [firstLine, entry.excerpt];
}

// ─── Budget (chars, ~4 chars/token) ──────────────────────────────────────────
// Total cortex context target ≈ 30k tokens (~120k chars) spread across domains.
// Memories (the user's own facts) get the largest slice; docs share a combined
// cap with memories; threads (conversation recall) and skills follow; tasks are
// a small always-current slice. Sum of individual caps ≈ 113k chars ≈ 28k
// tokens, with memoriesAndDocuments holding that pair to 45k chars.
const CHAR_BUDGET = {
  memories: 30000,
  documents: 20000,
  memoriesAndDocuments: 45000,
  threads: 30000,
  skills: 25000,
  tasks: 8000,
} as const;

// ─── Shared Vector Search ─────────────────────────────────────────────────────

/** Path-type weighting - memories and skills are higher signal */
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
  /**
   * The current thread. Its recent (post-compaction) user/assistant message
   * embeddings — written AT MESSAGE-WRITE TIME — are the query vectors. The
   * search NEVER generates a query embedding: message vectors already exist in
   * chatMessages.embedding, joined directly in the search SQL below.
   */
  threadId: string | null | undefined;
  /** How many recent message vectors to use as the MaxSim query set. */
  queryVectorLimit?: number;
  userId: string;
  pathPrefix?: string;
  pathPrefixes?: string[];
  excludePrefixes?: string[];
  limit?: number;
  threshold?: number;
  excerptLen?: number;
  logger: EndpointLogger;
}

/**
 * Vector similarity search within cortex_nodes using MaxSim, in ONE SQL query:
 * a node's score = max cosine similarity across the current thread's recent
 * stored message embeddings. There is NO query-embedding API call — the query
 * vectors are read from chatMessages.embedding (written at message-write time)
 * inside the same statement via a CTE. Returns [] when the thread has no stored
 * message vectors yet (brand-new thread) — cortex data is optional.
 */
async function vectorSearch(opts: VectorSearchOpts): Promise<RelevantNode[]> {
  const {
    userId,
    threadId,
    queryVectorLimit = 4,
    pathPrefix,
    pathPrefixes,
    excludePrefixes = [],
    limit = 10,
    threshold = 0.4,
    excerptLen = 150,
    logger,
  } = opts;

  if (!threadId) {
    return [];
  }

  try {
    const { db, isPglite } = await import("next-vibe/database");
    const { cortexNodes } = await import("./db");
    const { chatMessages } = await import("../chat/db");
    const { CortexNodeType } = await import("./enum");
    const { ChatMessageRole } = await import("../chat/enum");
    const { sql } = await import("drizzle-orm");

    // PGlite has no pgvector extension — migrations already downgrade the
    // `vector(1024)` column to plain `text` (see migrate/repository.ts), so
    // the stored value ("[0.1,0.2,...]", pgvector's own text format) is
    // identical either way. Only the `<=>` cosine-distance OPERATOR below
    // needs a substitute: compute it in JS instead of in SQL.
    if (isPglite) {
      return vectorSearchPglite({
        db,
        cortexNodes,
        chatMessages,
        CortexNodeType,
        ChatMessageRole,
        sql,
        userId,
        threadId,
        queryVectorLimit,
        pathPrefix,
        pathPrefixes,
        excludePrefixes,
        limit,
        threshold,
        excerptLen,
      });
    }

    // Path filters as raw SQL fragments (fed into the single statement below).
    const pathFilter =
      pathPrefix !== undefined
        ? sql`AND n.path LIKE ${`${pathPrefix}/%`}`
        : pathPrefixes && pathPrefixes.length > 0
          ? sql`AND (${sql.join(
              pathPrefixes.map((p) => sql`n.path LIKE ${`${p}/%`}`),
              sql` OR `,
            )})`
          : sql``;
    const excludeFilter =
      excludePrefixes.length > 0
        ? sql`AND ${sql.join(
            excludePrefixes.map((p) => sql`n.path NOT LIKE ${`${p}/%`}`),
            sql` AND `,
          )}`
        : sql``;

    // ONE query: `qv` = this thread's recent post-compaction user/assistant
    // message embeddings (written at message-write time). MaxSim scores each
    // cortex node against them via a LATERAL max over qv — no vectors ever leave
    // the DB, and no query embedding is generated. `boundary` excludes messages
    // at/before the last compaction (already summarized in the prompt).
    // db.execute returns RAW pg rows — timestamps arrive as strings and numerics
    // may arrive as strings too (unlike drizzle's typed .select()). Type them as
    // such and coerce at the use site.
    const rows = await db.execute<{
      path: string;
      content: string | null;
      updatedAt: string;
      similarity: string | number;
    }>(sql`
      WITH boundary AS (
        SELECT max(created_at) AS ts
        FROM ${chatMessages}
        WHERE thread_id = ${threadId}
          AND role = ${ChatMessageRole.ASSISTANT}
          AND (metadata->>'isCompacting')::boolean = true
      ),
      qv AS (
        SELECT embedding
        FROM ${chatMessages}, boundary
        WHERE thread_id = ${threadId}
          AND embedding IS NOT NULL
          AND role IN (${ChatMessageRole.USER}, ${ChatMessageRole.ASSISTANT})
          AND (boundary.ts IS NULL OR created_at > boundary.ts)
        ORDER BY created_at DESC
        LIMIT ${queryVectorLimit}
      )
      SELECT n.path AS path,
             n.content AS content,
             n.updated_at AS "updatedAt",
             (SELECT max(1 - (n.embedding <=> qv.embedding)) FROM qv) AS similarity
      FROM ${cortexNodes} n
      WHERE n.user_id = ${userId}
        AND n.node_type = ${CortexNodeType.FILE}
        AND n.embedding IS NOT NULL
        AND EXISTS (SELECT 1 FROM qv)
        ${pathFilter}
        ${excludeFilter}
      ORDER BY (SELECT min(n.embedding <=> qv.embedding) FROM qv) ASC
      LIMIT ${limit * 3}
    `);

    return scoreVectorRows(
      rows.rows.map((r) => ({
        path: r.path,
        content: r.content,
        similarity: Number(r.similarity),
        updatedAt: new Date(r.updatedAt),
      })),
      threshold,
      excerptLen,
      limit,
    );
  } catch (error) {
    logger.error("Vector search failed — memories skipped for this turn", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/** Raw candidate row shape shared by both the pgvector SQL path and the PGlite JS fallback. */
interface VectorSearchRow {
  path: string;
  content: string | null;
  similarity: number;
  updatedAt: Date;
}

/** Threshold filter, recency/path-weighted scoring, sort, and top-N slice — identical for both search paths. */
function scoreVectorRows(
  rows: VectorSearchRow[],
  threshold: number,
  excerptLen: number,
  limit: number,
): RelevantNode[] {
  return rows
    .filter((r) => r.similarity > threshold)
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
}

/** Parse pgvector's text representation ("[0.1,0.2,...]") into a plain number array. */
function parseEmbeddingText(value: string): number[] {
  return value.replace(/^\[/, "").replace(/]$/, "").split(",").map(Number);
}

/** Cosine similarity — `1 - cosineDistance`, i.e. exactly what pgvector's `<=>` operator inverts. */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

interface VectorSearchPgliteArgs extends Omit<VectorSearchOpts, "logger"> {
  db: NodePgDatabase<Record<string, never>>;
  cortexNodes: CortexNodesTableType;
  chatMessages: ChatMessagesTableType;
  CortexNodeType: CortexNodeTypeShape;
  ChatMessageRole: ChatMessageRoleShape;
  sql: SqlTagType;
}

/**
 * PGlite equivalent of the pgvector MaxSim query above — same semantics
 * (boundary-excluded query vectors, max-cosine-similarity per node, same
 * path/exclude filtering), computed in JS since PGlite has no `<=>` operator.
 * Only reached for PGlite; real Postgres always uses the single-SQL path.
 */
async function vectorSearchPglite(
  args: VectorSearchPgliteArgs,
): Promise<RelevantNode[]> {
  const {
    db,
    cortexNodes,
    chatMessages,
    CortexNodeType,
    ChatMessageRole,
    sql,
    userId,
    threadId,
    queryVectorLimit = 4,
    pathPrefix,
    pathPrefixes,
    excludePrefixes = [],
    limit = 10,
    threshold = 0.4,
    excerptLen = 150,
  } = args;

  const boundaryRows = await db.execute<{ ts: string | null }>(sql`
    SELECT max(created_at) AS ts
    FROM ${chatMessages}
    WHERE thread_id = ${threadId}
      AND role = ${ChatMessageRole.ASSISTANT}
      AND (metadata->>'isCompacting')::boolean = true
  `);
  const boundaryTs = boundaryRows.rows[0]?.ts ?? null;

  const qvRows = await db.execute<{ embedding: string }>(sql`
    SELECT embedding
    FROM ${chatMessages}
    WHERE thread_id = ${threadId}
      AND embedding IS NOT NULL
      AND role IN (${ChatMessageRole.USER}, ${ChatMessageRole.ASSISTANT})
      ${boundaryTs ? sql`AND created_at > ${boundaryTs}` : sql``}
    ORDER BY created_at DESC
    LIMIT ${queryVectorLimit}
  `);
  // Mirrors the SQL path's `AND EXISTS (SELECT 1 FROM qv)` — no stored
  // message vectors yet (brand-new thread) means no memory to surface.
  if (qvRows.rows.length === 0) {
    return [];
  }
  const queryVectors = qvRows.rows.map((r: { embedding: string }) =>
    parseEmbeddingText(r.embedding),
  );

  const nodeRows = await db.execute<{
    path: string;
    content: string | null;
    updatedAt: string;
    embedding: string;
  }>(sql`
    SELECT path, content, updated_at AS "updatedAt", embedding
    FROM ${cortexNodes}
    WHERE user_id = ${userId}
      AND node_type = ${CortexNodeType.FILE}
      AND embedding IS NOT NULL
  `);

  const prefixes = pathPrefix ? [pathPrefix] : (pathPrefixes ?? null);
  const rows: VectorSearchRow[] = nodeRows.rows
    .filter(
      (r: { path: string }) =>
        (!prefixes || prefixes.some((p) => r.path.startsWith(`${p}/`))) &&
        !excludePrefixes.some((p) => r.path.startsWith(`${p}/`)),
    )
    .map(
      (r: {
        path: string;
        content: string | null;
        updatedAt: string;
        embedding: string;
      }) => {
        const nodeVector = parseEmbeddingText(r.embedding);
        const similarity = Math.max(
          ...queryVectors.map((qv) => cosineSimilarity(nodeVector, qv)),
        );
        return {
          path: r.path,
          content: r.content,
          similarity,
          updatedAt: new Date(r.updatedAt),
        };
      },
    )
    // Same ORDER BY MIN(distance) ASC / LIMIT limit*3 as the SQL path,
    // expressed the equivalent way: distance = 1 - similarity, so ordering
    // by max similarity descending is identical.
    .toSorted((a, b) => b.similarity - a.similarity)
    .slice(0, limit * 3);

  return scoreVectorRows(rows, threshold, excerptLen, limit);
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
  const { db } = await import("next-vibe/database");
  const { cortexNodes } = await import("./db");
  const { CortexNodeType } = await import("./enum");
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

  // Overlay virtual template files - only if they have meaningful content (not pure placeholders)
  try {
    const { getMemoryTemplates } = await import("./seeds/templates");
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
    // Templates optional - don't fail memory load
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
  const { db } = await import("next-vibe/database");
  const { cortexNodes } = await import("./db");
  const { CortexNodeType } = await import("./enum");
  const { sql } = await import("drizzle-orm");

  // Escape documentsPath for regex (e.g. /documents → \/documents)
  const escapedDocsPath = documentsPath.replaceAll(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );

  // Single query: get top-level dirs + their file counts + recent files via window function
  const rows = await db.execute<{
    dir_path: string;
    file_count: number;
    file_path: string | null;
    rn: number;
  }>(sql`
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
    const { getDocumentTemplates } = await import("./seeds/templates");
    const localeParam = locale as Parameters<typeof getDocumentTemplates>[0];
    const docTemplates = getDocumentTemplates(localeParam);
    const templateDirPath = `${documentsPath}/templates`;

    // NOTE: Do NOT inject empty default subdirs - they're clutter until the user has files there.

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
    // Templates optional - don't fail doc tree
  }

  return result;
}

// ─── Thread Pinned ─────────────────────────────────────────────────────────────

interface PinnedThread {
  id: string;
  title: string;
  description: string | null;
  rootFolderId: string;
}

async function loadPinnedThreads(userId: string): Promise<PinnedThread[]> {
  try {
    const { db } = await import("next-vibe/database");
    const { chatThreads } = await import("../chat/db");
    const { eq, and } = await import("drizzle-orm");

    const rows = await db
      .select({
        id: chatThreads.id,
        title: chatThreads.title,
        description: chatThreads.description,
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
    const { db } = await import("next-vibe/database");
    const { chatFavorites } = await import("../skills/favorites/db");
    const { eq } = await import("drizzle-orm");

    // Step 1: get skillIds from favorites - filter to UUID-format only (custom skills)
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
    const { customSkills } = await import("../skills/db");
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
    const { db } = await import("next-vibe/database");
    const { customSkills } = await import("../skills/db");
    const { SkillOwnershipType } = await import("../skills/enum");
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
      await import("next-vibe/tasks/cron/repository");
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
    // Dynamic imports only - skip DEFAULT_SKILLS/skills/config/skills/i18n (pull in UI widget chain → TDZ)
    // Default skill IDs are friendly slugs (e.g. "thea", "vibe-coder") - non-UUID, treated as canonical.
    const [
      { chatFavorites },
      { chatSettings },
      { db: favDb },
      { asc: favAsc, eq: favEq, inArray: favInArray },
    ] = await Promise.all([
      import("../skills/favorites/db"),
      import("../chat/settings/db"),
      import("next-vibe/database"),
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
      const { customSkills: customSkillsTable } = await import("../skills/db");
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

  // Show all files that fit within budget - no arbitrary hard cap
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

  // Dir tree - each top-level subdir with its files, content for relevant. Skip empty dirs.
  const children: CortexEntry[] = [];
  for (const dir of docTree) {
    if (dir.fileCount === 0 && dir.shownFiles.length === 0) {
      continue; // Don't show empty subdirs - clutter
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
    const excerpt = t.description
      ? cleanExcerpt(t.description).slice(0, 150)
      : "";
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

  // Relevant from vector search (custom skills in cortexNodes)
  for (const n of relevant) {
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
    // Strip "You are X, ..." opener - the name already shown in displayName
    .replace(/^you are [^,.]+[,.]?\s*/i, "")
    .trim();
  return cleaned.slice(0, 100);
}

// ─── Raw Embedding Scores (for debug endpoint) ────────────────────────────────

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
  logger: EndpointLogger,
): Promise<
  { scores: RawEmbeddingScore[]; embeddingGenerated: boolean } | undefined
> {
  try {
    const { generateEmbedding } = await import("./embeddings/service");
    // Debug endpoint (no stream) — explicit thread-less context routes live.
    const { makeHeadlessContext } =
      await import("next-vibe/core/execution-context");
    const queryEmbedding = await generateEmbedding(
      userMessage,
      // no user context — UTC (dates not user-facing here)
      makeHeadlessContext(undefined, undefined, "UTC"),
    );
    if (!queryEmbedding) {
      return { scores: [], embeddingGenerated: false };
    }

    const { db } = await import("next-vibe/database");
    const { cortexNodes } = await import("./db");
    const { CortexNodeType } = await import("./enum");
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
  } catch (error) {
    logger.error("Failed to loadRawEmbeddingScores", parseError(error));
    return undefined;
  }
}
