import "server-only";

/**
 * Gens Virtual Mount
 * Exposes AI-generated media (images, audio, video) as markdown files
 * at /gens/<type>/<YYYY-MM>/<prompt-slug>-<messageId>.md
 * Reconstructed from chatMessages where toolCall.toolName is a generation tool.
 */

import { and, desc, eq, isNotNull, or, sql } from "drizzle-orm";

import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { db } from "@/app/api/[locale]/system/db";

import type { VirtualListEntry, VirtualReadResult } from "./resolver";

/**
 * Generation tool names and their media types
 */
const GEN_TOOLS = {
  generate_image: "images",
  generate_music: "audio",
  generate_video: "video",
} as const;

type GenType = (typeof GEN_TOOLS)[keyof typeof GEN_TOOLS];
type GenToolName = keyof typeof GEN_TOOLS;

const GEN_TYPE_FOLDERS: GenType[] = ["images", "audio", "video"];

function isGenType(value: string): value is GenType {
  return GEN_TYPE_FOLDERS.includes(value as GenType);
}

function getGenToolNames(): string[] {
  return Object.keys(GEN_TOOLS);
}

interface GenRow {
  messageId: string;
  toolName: GenToolName;
  prompt: string;
  mediaType: GenType;
  mediaUrl: string;
  creditCost?: number;
  durationSeconds?: number;
  threadId: string;
  threadTitle: string;
  generatedAt: Date;
}

interface GenToolResult {
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  url?: string;
  creditCost?: number;
  durationSeconds?: number;
}

/**
 * Slugify a string for path segments
 */
function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "gen"
  );
}

/**
 * Format a date as YYYY-MM for month folder organization
 */
function toMonthFolder(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Extract media URL from a generation tool result
 */
function extractMediaUrl(result: GenToolResult): string | null {
  return (
    result.audioUrl ?? result.imageUrl ?? result.videoUrl ?? result.url ?? null
  );
}

/**
 * Load all AI-generated media for a user from tool messages
 */
async function loadUserGens(userId: string): Promise<GenRow[]> {
  const toolNames = getGenToolNames();

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
          ...toolNames.map(
            (name) =>
              sql`${chatMessages.metadata}->'toolCall'->>'toolName' = ${name}`,
          ),
        ),
        sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(500);

  const gens: GenRow[] = [];

  for (const row of rows) {
    const meta = row.metadata as {
      toolCall?: {
        toolName: string;
        args?: { prompt?: string };
        result?: GenToolResult;
        status?: string;
      };
    } | null;

    if (!meta?.toolCall) {
      continue;
    }

    const { toolName, args, result, status } = meta.toolCall;
    if (status === "failed" || !result) {
      continue;
    }

    const prompt = args?.prompt;
    if (!prompt) {
      continue;
    }

    const mediaUrl = extractMediaUrl(result);
    if (!mediaUrl) {
      continue;
    }

    const genToolName = toolName as GenToolName;
    const mediaType = GEN_TOOLS[genToolName];
    if (!mediaType) {
      continue;
    }

    gens.push({
      messageId: row.messageId,
      toolName: genToolName,
      prompt,
      mediaType,
      mediaUrl,
      creditCost: result.creditCost,
      durationSeconds: result.durationSeconds,
      threadId: row.threadId,
      threadTitle: row.threadTitle ?? "Untitled",
      generatedAt: row.createdAt,
    });
  }

  return gens;
}

/**
 * Read a generated media file rendered as markdown.
 * Path: /gens/<type>/<YYYY-MM>/<prompt-slug>-<messageId>.md
 */
export async function readGenPath(
  userId: string,
  path: string,
): Promise<VirtualReadResult | null> {
  const segments = path.split("/").filter(Boolean);
  // gens / type / YYYY-MM / prompt-slug-messageId.md
  if (segments.length < 4) {
    return null;
  }

  const typeSegment = segments[1];
  const monthSegment = segments[2];
  const filenameSegment = segments[3];

  if (
    !typeSegment ||
    !isGenType(typeSegment) ||
    !monthSegment ||
    !filenameSegment
  ) {
    return null;
  }

  if (!/^\d{4}-\d{2}$/.test(monthSegment)) {
    return null;
  }

  // Extract message ID (UUID before optional .md extension)
  const filenameBase = filenameSegment.replace(/\.md$/i, "");
  const uuidMatch = filenameBase.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  if (!uuidMatch) {
    return null;
  }
  const messageId = uuidMatch[1];

  const allGens = await loadUserGens(userId);
  const gen = allGens.find((g) => g.messageId === messageId);
  if (!gen) {
    return null;
  }

  const mediaLabel =
    gen.mediaType === "images"
      ? "Image"
      : gen.mediaType === "audio"
        ? "Audio"
        : "Video";

  const frontmatterLines = [
    "---",
    `prompt: "${gen.prompt.replace(/"/g, '\\"')}"`,
    `mediaType: "${gen.mediaType}"`,
    `mediaUrl: "${gen.mediaUrl}"`,
    `tool: "${gen.toolName}"`,
    `threadId: "${gen.threadId}"`,
    `threadTitle: "${gen.threadTitle.replace(/"/g, '\\"')}"`,
    `generatedAt: "${gen.generatedAt.toISOString()}"`,
    ...(gen.creditCost !== undefined ? [`creditCost: ${gen.creditCost}`] : []),
    ...(gen.durationSeconds !== undefined
      ? [`durationSeconds: ${gen.durationSeconds}`]
      : []),
    "---",
  ];

  const lines = [
    frontmatterLines.join("\n"),
    "",
    `# ${gen.prompt.slice(0, 80)}`,
    "",
    `**${mediaLabel}:** [View](${gen.mediaUrl})`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Type | ${gen.mediaType} |`,
    `| Tool | \`${gen.toolName}\` |`,
    `| Thread | ${gen.threadTitle} |`,
    `| Generated | ${gen.generatedAt.toISOString().slice(0, 10)} |`,
    ...(gen.creditCost !== undefined
      ? [`| Credits | ${gen.creditCost} |`]
      : []),
    ...(gen.durationSeconds !== undefined
      ? [`| Duration | ${gen.durationSeconds}s |`]
      : []),
  ];

  return {
    content: lines.join("\n"),
    nodeType: "file",
    updatedAt: gen.generatedAt.toISOString(),
  };
}

/**
 * List gens at a virtual path
 */
export async function listGenPath(
  userId: string,
  path: string,
): Promise<VirtualListEntry[]> {
  if (path === "/gens") {
    // Return type folders that have content
    return GEN_TYPE_FOLDERS.map((folder) => ({
      name: folder,
      path: `/gens/${folder}`,
      nodeType: "dir" as const,
      size: null,
      updatedAt: new Date().toISOString(),
    }));
  }

  const segments = path.split("/").filter(Boolean);

  // /gens/<type>
  if (segments.length === 2) {
    const typeSegment = segments[1];
    if (!typeSegment || !isGenType(typeSegment)) {
      return [];
    }

    const allGens = await loadUserGens(userId);
    const typeGens = allGens.filter((g) => g.mediaType === typeSegment);

    // Group by month
    const monthSet = new Set<string>();
    const monthUpdated = new Map<string, Date>();
    for (const g of typeGens) {
      const month = toMonthFolder(g.generatedAt);
      monthSet.add(month);
      const existing = monthUpdated.get(month);
      if (!existing || g.generatedAt > existing) {
        monthUpdated.set(month, g.generatedAt);
      }
    }

    return [...monthSet]
      .toSorted()
      .toReversed()
      .map((month) => ({
        name: month,
        path: `/gens/${typeSegment}/${month}`,
        nodeType: "dir" as const,
        size: null,
        updatedAt: (monthUpdated.get(month) ?? new Date()).toISOString(),
      }));
  }

  // /gens/<type>/<YYYY-MM>
  if (segments.length === 3) {
    const typeSegment = segments[1];
    const monthSegment = segments[2];
    if (
      !typeSegment ||
      !isGenType(typeSegment) ||
      !monthSegment ||
      !/^\d{4}-\d{2}$/.test(monthSegment)
    ) {
      return [];
    }

    const allGens = await loadUserGens(userId);
    const monthGens = allGens.filter(
      (g) =>
        g.mediaType === typeSegment &&
        toMonthFolder(g.generatedAt) === monthSegment,
    );

    return monthGens.map((g) => {
      const slug = `${slugify(g.prompt)}-${g.messageId}`;
      return {
        name: `${slug}.md`,
        path: `/gens/${typeSegment}/${monthSegment}/${slug}.md`,
        nodeType: "file" as const,
        size: null,
        updatedAt: g.generatedAt.toISOString(),
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
 * Direct keyword search across AI-generated media — one DB query, no file-by-file reads.
 * Matches against prompt text.
 */
export async function searchGens(
  userId: string,
  query: string,
  limit: number,
): Promise<VirtualSearchHit[]> {
  const pattern = `%${query}%`;
  const toolNames = getGenToolNames();
  const rows = await db
    .select({
      messageId: chatMessages.id,
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(chatThreads, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        eq(chatThreads.userId, userId),
        isNotNull(chatMessages.metadata),
        or(
          ...toolNames.map(
            (name) =>
              sql`${chatMessages.metadata}->'toolCall'->>'toolName' = ${name}`,
          ),
        ),
        sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
        sql`${chatMessages.metadata}->'toolCall'->'args'->>'prompt' ILIKE ${pattern}`,
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  const hits: VirtualSearchHit[] = [];
  for (const row of rows) {
    const meta = row.metadata as {
      toolCall?: {
        toolName: string;
        args?: { prompt?: string };
        result?: GenToolResult;
        status?: string;
      };
    } | null;
    if (!meta?.toolCall?.args?.prompt) {
      continue;
    }
    const { toolName, args, result, status } = meta.toolCall;
    if (status === "failed" || !result) {
      continue;
    }
    const prompt = args?.prompt ?? "";
    const genToolName = toolName as GenToolName;
    const mediaType = GEN_TOOLS[genToolName];
    if (!mediaType) {
      continue;
    }
    const month = toMonthFolder(row.createdAt);
    const slug = `${slugify(prompt)}-${row.messageId}`;
    const path = `/gens/${mediaType}/${month}/${slug}.md`;
    hits.push({
      path,
      excerpt: prompt.slice(0, 150),
      updatedAt: row.createdAt,
    });
  }
  return hits;
}

/**
 * Get gen counts by type
 */
export async function getGenCounts(
  userId: string,
): Promise<{ total: number; byType: Record<string, number> }> {
  const allGens = await loadUserGens(userId);

  const byType: Record<string, number> = {};
  for (const g of allGens) {
    byType[g.mediaType] = (byType[g.mediaType] ?? 0) + 1;
  }

  return { total: allGens.length, byType };
}
