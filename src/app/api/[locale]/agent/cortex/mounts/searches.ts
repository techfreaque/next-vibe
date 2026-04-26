import "server-only";

/**
 * Searches Virtual Mount
 * Exposes past web search results as markdown files at /searches/<YYYY-MM>/<query-slug>-<messageId>.md
 * Reconstructed from chatMessages where metadata.toolCall.toolName = "web-search"
 */

import { and, desc, eq, isNotNull, or, sql } from "drizzle-orm";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  age?: string;
  source?: string;
}

interface SearchToolCallResult {
  usedProvider?: string;
  output?: string;
  results?: SearchResult[];
}

interface SearchRow {
  messageId: string;
  query: string;
  provider: string;
  output: string | undefined;
  results: SearchResult[];
  threadId: string;
  threadTitle: string;
  searchedAt: Date;
}

/**
 * Slugify a string for use as a path segment
 */
function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "search"
  );
}

/**
 * Format a date as YYYY-MM for month folder organization
 */
function toMonthFolder(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Search tool names — covers all variants used across providers and API versions
 */
const SEARCH_TOOL_NAMES = [
  "web-search",
  "brave-search",
  "kagi-search",
  "agent_brave-search_GET",
  "v1_core_agent_brave-search_GET",
] as const;

/**
 * Load all web search tool calls for a user
 */
async function loadUserSearches(userId: string): Promise<SearchRow[]> {
  const rows = await db
    .select({
      messageId: chatMessages.id,
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
      threadId: chatMessages.threadId,
      threadTitle: chatThreads.title,
    })
    .from(chatMessages)
    .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        eq(chatThreads.userId, userId),
        isNotNull(chatMessages.metadata),
        or(
          ...SEARCH_TOOL_NAMES.map(
            (name) =>
              sql`TRIM(${chatMessages.metadata}->'toolCall'->>'toolName') = ${name}`,
          ),
        ),
        sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(500);

  const searches: SearchRow[] = [];

  for (const row of rows) {
    const meta = row.metadata as {
      toolCall?: {
        toolName: string;
        args?: { query?: string };
        result?: SearchToolCallResult;
      };
    } | null;

    if (!meta?.toolCall) {
      continue;
    }
    const { args, result } = meta.toolCall;
    const query = args?.query;
    if (!query || !result) {
      continue;
    }

    searches.push({
      messageId: row.messageId,
      query,
      provider: result.usedProvider ?? "unknown",
      output: result.output,
      results: result.results ?? [],
      threadId: row.threadId,
      threadTitle: row.threadTitle ?? "Untitled",
      searchedAt: row.createdAt,
    });
  }

  return searches;
}

/**
 * Read a search result file rendered as markdown.
 * Path: /searches/<YYYY-MM>/<query-slug>-<messageId>.md
 */
export async function readSearchPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  // searches / YYYY-MM / query-slug-messageId.md
  if (segments.length < 3) {
    return null;
  }

  const monthSegment = segments[1];
  const filenameSegment = segments[2];
  if (!monthSegment || !filenameSegment) {
    return null;
  }

  // Validate month format YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(monthSegment)) {
    return null;
  }

  // Extract message ID from filename (UUID before optional .md extension)
  const filenameBase = filenameSegment.replace(/\.md$/i, "");
  const uuidMatch = filenameBase.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (!uuidMatch) {
    return null;
  }
  const messageId = uuidMatch[1];

  const allSearches = await loadUserSearches(userId);
  const search = allSearches.find((s) => s.messageId === messageId);
  if (!search) {
    return null;
  }

  const { truncateContent } = await import("../_shared/text-utils");

  const frontmatterLines = [
    "---",
    `query: "${search.query.replace(/"/g, '\\"')}"`,
    `provider: "${search.provider}"`,
    `threadId: "${search.threadId}"`,
    `threadTitle: "${search.threadTitle.replace(/"/g, '\\"')}"`,
    `searchedAt: "${search.searchedAt.toISOString()}"`,
    `resultCount: ${search.results.length}`,
    "---",
  ];

  const contentLines: string[] = [
    frontmatterLines.join("\n"),
    "",
    `# ${search.query}`,
    "",
  ];

  if (search.output) {
    contentLines.push("## AI Answer", "", search.output, "");
  }

  if (search.results.length > 0) {
    contentLines.push("## Results", "");
    for (let i = 0; i < search.results.length; i++) {
      const result = search.results[i];
      if (!result) {
        continue;
      }
      const snippet = truncateContent(result.snippet, 200);
      const meta = [result.source, result.age].filter(Boolean).join(" · ");
      contentLines.push(
        `${i + 1}. **[${result.title}](${result.url})**${meta ? ` — ${meta}` : ""}`,
        `   ${snippet}`,
        "",
      );
    }
  }

  return {
    content: contentLines.join("\n"),
    nodeType: "file",
    updatedAt: search.searchedAt.toISOString(),
  };
}

/**
 * List searches at a virtual path
 */
export async function listSearchPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path === "/searches") {
    // Return month folders that have searches
    const allSearches = await loadUserSearches(userId);

    const monthSet = new Set<string>();
    const monthUpdated = new Map<string, Date>();
    for (const s of allSearches) {
      const month = toMonthFolder(s.searchedAt);
      monthSet.add(month);
      const existing = monthUpdated.get(month);
      if (!existing || s.searchedAt > existing) {
        monthUpdated.set(month, s.searchedAt);
      }
    }

    return [...monthSet]
      .toSorted()
      .toReversed()
      .map((month) => ({
        name: month,
        path: `/searches/${month}`,
        nodeType: "dir" as const,
        size: null,
        updatedAt: (monthUpdated.get(month) ?? new Date()).toISOString(),
      }));
  }

  const segments = path.split("/").filter(Boolean);

  // /searches/<YYYY-MM>
  if (segments.length === 2) {
    const monthSegment = segments[1];
    if (!monthSegment || !/^\d{4}-\d{2}$/.test(monthSegment)) {
      return [];
    }

    const allSearches = await loadUserSearches(userId);
    const monthSearches = allSearches.filter(
      (s) => toMonthFolder(s.searchedAt) === monthSegment,
    );

    return monthSearches.map((s) => {
      const slug = `${slugify(s.query)}-${s.messageId}`;
      return {
        name: `${slug}.md`,
        path: `/searches/${monthSegment}/${slug}.md`,
        nodeType: "file" as const,
        size: null,
        updatedAt: s.searchedAt.toISOString(),
      };
    });
  }

  return [];
}

export interface VirtualSearchHit {
  path: string;
  excerpt: string;
  updatedAt: Date;
}

/**
 * Direct keyword search across web search results — one DB query, no file-by-file reads.
 */
export async function searchSearches(
  userId: string,
  query: string,
  limit: number,
): Promise<VirtualSearchHit[]> {
  const pattern = `%${query}%`;
  const rows = await db
    .select({
      messageId: chatMessages.id,
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
      threadId: chatMessages.threadId,
      threadTitle: chatThreads.title,
    })
    .from(chatMessages)
    .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        eq(chatThreads.userId, userId),
        isNotNull(chatMessages.metadata),
        or(
          ...SEARCH_TOOL_NAMES.map(
            (name) =>
              sql`TRIM(${chatMessages.metadata}->'toolCall'->>'toolName') = ${name}`,
          ),
        ),
        sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
        or(
          sql`${chatMessages.metadata}->'toolCall'->'args'->>'query' ILIKE ${pattern}`,
          sql`${chatMessages.metadata}->'toolCall'->'result'->>'output' ILIKE ${pattern}`,
        ),
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  const hits: VirtualSearchHit[] = [];
  for (const row of rows) {
    const meta = row.metadata as {
      toolCall?: {
        toolName: string;
        args?: { query?: string };
        result?: SearchToolCallResult;
      };
    } | null;
    if (!meta?.toolCall?.args?.query) {
      continue;
    }
    const q = meta.toolCall.args.query;
    const month = toMonthFolder(row.createdAt);
    const slug = `${slugify(q)}-${row.messageId}`;
    const path = `/searches/${month}/${slug}.md`;
    const excerpt = (meta.toolCall.result?.output ?? q).slice(0, 150);
    hits.push({ path, excerpt, updatedAt: row.createdAt });
  }
  return hits;
}

/**
 * Get search counts by month
 */
export async function getSearchCounts(
  userId: string,
): Promise<{ total: number; byMonth: Record<string, number> }> {
  const allSearches = await loadUserSearches(userId);

  const byMonth: Record<string, number> = {};
  for (const s of allSearches) {
    const month = toMonthFolder(s.searchedAt);
    byMonth[month] = (byMonth[month] ?? 0) + 1;
  }

  return { total: allSearches.length, byMonth };
}
