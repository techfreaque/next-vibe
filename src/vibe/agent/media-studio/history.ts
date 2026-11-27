import "server-only";

import {
  and,
  count,
  eq,
  gte,
  inArray,
  isNull,
  lt,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { z } from "zod";

import {
  CREATE_KINDS,
  type CreateKind,
} from "@/_pages/create/_shared/create-kinds";
import { v1MediaJobs } from "@/v1/db";
import { V1_MEDIA_JOB_STALE_MS } from "@/v1/shared/constants";

import { chatMessages, chatThreads } from "../chat/db";
import { ThreadStatus } from "../chat/enum";
import { isStorageUrl } from "../chat/storage/storage-url";
import { IMAGE_GEN_ALIAS } from "../image-generation/constants";
import { MUSIC_GEN_ALIAS } from "../music-generation/constants";
import { TRANSCRIBE_AUDIO_ALIAS } from "../speech-to-text/constants";
import { TEXT_TO_SPEECH_ALIAS } from "../text-to-speech/constants";
import { VIDEO_GEN_ALIAS } from "../video-generation/constants";
import { studioGenerations } from "./db";
import { type StudioSettings, studioSettingsSchema } from "./settings";

export interface StudioEntry {
  id: string;
  kind: CreateKind;
  title: string;
  createdAt: string;
  status: "queued" | "running" | "saving" | "completed" | "failed";
  url: string | null;
  transcript: string | null;
  credits: number | null;
  /** Model or voice id the result was made with, when known. */
  model: string | null;
  /** Form values for "Run again" (studio: stored, chat: tool args, API: prompt). */
  settings: StudioSettings | null;
  /** Where it was made: the Studio page, a chat thread or the /v1 API. */
  source: "studio" | "chat" | "api";
  /** Chat results only: the thread that holds it. */
  threadId: string | null;
  rootFolderId: string | null;
}

export interface StudioHistoryPage {
  items: StudioEntry[];
  totalCount: number;
  /** Pass back as `cursor` for the next page; null on the last page. */
  nextCursor: string | null;
}

const TOOL_NAMES = {
  image: IMAGE_GEN_ALIAS,
  video: VIDEO_GEN_ALIAS,
  music: MUSIC_GEN_ALIAS,
  speech: TEXT_TO_SPEECH_ALIAS,
  transcribe: TRANSCRIBE_AUDIO_ALIAS,
};

const storedResult = z.object({
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  creditCost: z.number().optional(),
  response: z.object({ text: z.string() }).optional(),
});
const storedArgs = z.object({
  prompt: z.string().optional(),
  text: z.string().optional(),
  model: z.string().optional(),
  voiceId: z.string().optional(),
  modelId: z.string().optional(),
});

function ownsThread(user: JwtPayloadType): SQL | undefined {
  return user.isPublic
    ? and(isNull(chatThreads.userId), eq(chatThreads.leadId, user.leadId))
    : eq(chatThreads.userId, user.id);
}

function chatFilter(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
): SQL | undefined {
  const tools = kind ? [TOOL_NAMES[kind]] : Object.values(TOOL_NAMES);
  return and(
    ownsThread(user),
    ne(chatThreads.status, ThreadStatus.DELETED),
    ne(chatThreads.rootFolderId, DefaultFolderId.INCOGNITO),
    inArray(
      sql<string>`${chatMessages.metadata}->'toolCall'->>'toolName'`,
      tools,
    ),
    sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
  );
}

function studioFilter(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
): SQL | undefined {
  return and(
    user.isPublic
      ? eq(studioGenerations.leadId, user.leadId)
      : eq(studioGenerations.userId, user.id),
    kind ? eq(studioGenerations.kind, kind) : undefined,
  );
}

/** Only accounts have API jobs, and only video and music run as jobs. */
function apiFilter(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
): SQL | undefined {
  if (user.isPublic || (kind && kind !== "video" && kind !== "music")) {
    return undefined;
  }
  return and(
    eq(v1MediaJobs.userId, user.id),
    eq(v1MediaJobs.status, "completed"),
    kind ? eq(v1MediaJobs.kind, kind) : undefined,
  );
}

/** Position in the newest-first list: millisecond timestamp, then id. */
interface HistoryKey {
  ms: number;
  id: string;
}

const CURSOR_SEPARATOR = "_";

/** Opaque "load more" cursor: the last item a page returned. */
export function encodeHistoryCursor(key: HistoryKey): string {
  return `${key.ms.toString(36)}${CURSOR_SEPARATOR}${key.id}`;
}

export function decodeHistoryCursor(cursor: string): HistoryKey | undefined {
  const at = cursor.indexOf(CURSOR_SEPARATOR);
  const ms = Number.parseInt(cursor.slice(0, at), 36);
  const id = cursor.slice(at + 1);
  return at > 0 && Number.isSafeInteger(ms) && ms >= 0 && id
    ? { ms, id }
    : undefined;
}

/** Negative when `a` comes first (is newer). Ids compare by code unit, like `COLLATE "C"`. */
function compareKeys(a: HistoryKey, b: HistoryKey): number {
  if (a.ms !== b.ms) {
    return b.ms - a.ms;
  }
  return a.id === b.id ? 0 : a.id < b.id ? 1 : -1;
}

function entryKey(entry: StudioEntry): HistoryKey {
  return { ms: Date.parse(entry.createdAt), id: entry.id };
}

/**
 * Rows strictly older than the cursor. Timestamps carry microseconds but the
 * list (and the cursor) only milliseconds, so rows inside the cursor's
 * millisecond fall back to the id.
 */
function olderThan(
  createdAt: PgColumn,
  id: PgColumn,
  cursor: HistoryKey | undefined,
): SQL | undefined {
  if (!cursor) {
    return undefined;
  }
  const start = new Date(cursor.ms);
  return or(
    lt(createdAt, start),
    and(
      gte(createdAt, start),
      lt(createdAt, new Date(cursor.ms + 1)),
      sql`${id}::text COLLATE "C" < ${cursor.id}`,
    ),
  );
}

/** SQL order matching `compareKeys`. */
function newestFirst(createdAt: PgColumn, id: PgColumn): SQL[] {
  return [
    sql`date_trunc('milliseconds', ${createdAt}) DESC`,
    sql`${id}::text COLLATE "C" DESC`,
  ];
}

interface SourcePage {
  entries: StudioEntry[];
  /** Last row read, valid or not; set only when the source has more rows. */
  truncatedAt: HistoryKey | undefined;
}

function sourcePage(
  entries: StudioEntry[],
  rows: { id: string; createdAt: Date }[],
  fetched: number,
): SourcePage {
  const last = rows.at(-1);
  return {
    entries,
    truncatedAt:
      rows.length >= fetched && last
        ? { ms: last.createdAt.getTime(), id: last.id }
        : undefined,
  };
}

async function chatHistory(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
  limit: number,
  cursor: HistoryKey | undefined,
): Promise<SourcePage> {
  const rows = await db
    .select({
      id: chatMessages.id,
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
      title: chatThreads.title,
      threadId: chatThreads.id,
      rootFolderId: chatThreads.rootFolderId,
    })
    .from(chatThreads)
    .innerJoin(chatMessages, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        chatFilter(user, kind),
        olderThan(chatMessages.createdAt, chatMessages.id, cursor),
      ),
    )
    .orderBy(...newestFirst(chatMessages.createdAt, chatMessages.id))
    .limit(limit);
  const entries = rows.flatMap((row): StudioEntry[] => {
    const call = row.metadata?.toolCall;
    const mediaKind = CREATE_KINDS.find(
      (k) => TOOL_NAMES[k] === call?.toolName,
    );
    if (!call || call.error || call.status === "failed" || !mediaKind) {
      return [];
    }
    const parsed = storedResult.safeParse(call.result);
    if (!parsed.success) {
      return [];
    }
    const { imageUrl, videoUrl, audioUrl, response, creditCost } = parsed.data;
    const url = imageUrl ?? videoUrl ?? audioUrl ?? null;
    const transcript = response?.text ?? null;
    if (
      (url && !isStorageUrl(url) && !/^https?:\/\//iu.test(url)) ||
      (!url && !transcript)
    ) {
      return [];
    }
    const args = storedArgs.safeParse(call.args);
    const settings = studioSettingsSchema.safeParse(call.args);
    return [
      {
        id: row.id,
        kind: mediaKind,
        title: (args.data?.prompt ?? args.data?.text ?? row.title).slice(
          0,
          160,
        ),
        status: "completed",
        createdAt: row.createdAt.toISOString(),
        url,
        transcript,
        credits: creditCost ?? null,
        model:
          args.data?.model ?? args.data?.voiceId ?? args.data?.modelId ?? null,
        settings: settings.success ? settings.data : null,
        source: "chat",
        threadId: row.threadId,
        rootFolderId: row.rootFolderId,
      },
    ];
  });
  return sourcePage(entries, rows, limit);
}

async function countRows(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
): Promise<number> {
  const api = apiFilter(user, kind);
  const [studio, chat, jobs] = await Promise.all([
    db
      .select({ n: count() })
      .from(studioGenerations)
      .where(studioFilter(user, kind)),
    db
      .select({ n: count() })
      .from(chatThreads)
      .innerJoin(chatMessages, eq(chatMessages.threadId, chatThreads.id))
      .where(chatFilter(user, kind)),
    api ? db.select({ n: count() }).from(v1MediaJobs).where(api) : [],
  ]);
  return (studio[0]?.n ?? 0) + (chat[0]?.n ?? 0) + (jobs[0]?.n ?? 0);
}

async function studioRows(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
  limit: number,
  cursor: HistoryKey | undefined,
): Promise<SourcePage> {
  const rows = await db
    .select({
      id: studioGenerations.id,
      kind: studioGenerations.kind,
      title: studioGenerations.title,
      createdAt: studioGenerations.createdAt,
      status: studioGenerations.status,
      url: studioGenerations.url,
      transcript: studioGenerations.transcript,
      credits: studioGenerations.credits,
      model: studioGenerations.model,
      settings: studioGenerations.settings,
    })
    .from(studioGenerations)
    .where(
      and(
        studioFilter(user, kind),
        olderThan(studioGenerations.createdAt, studioGenerations.id, cursor),
      ),
    )
    .orderBy(...newestFirst(studioGenerations.createdAt, studioGenerations.id))
    .limit(limit);
  const entries = rows.map((row): StudioEntry => ({
    ...row,
    model: row.model || null,
    settings: row.settings ?? null,
    source: "studio",
    threadId: null,
    rootFolderId: null,
    createdAt: row.createdAt.toISOString(),
    status:
      row.status !== "completed" &&
      row.status !== "failed" &&
      Date.now() - row.createdAt.getTime() > V1_MEDIA_JOB_STALE_MS
        ? "failed"
        : row.status,
  }));
  return sourcePage(entries, rows, limit);
}

async function apiRows(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
  limit: number,
  cursor: HistoryKey | undefined,
): Promise<SourcePage> {
  const api = apiFilter(user, kind);
  if (!api) {
    return { entries: [], truncatedAt: undefined };
  }
  const rows = await db
    .select({
      id: v1MediaJobs.id,
      kind: v1MediaJobs.kind,
      title: v1MediaJobs.prompt,
      createdAt: v1MediaJobs.createdAt,
      url: v1MediaJobs.resultUrl,
      credits: v1MediaJobs.creditsCharged,
      model: v1MediaJobs.model,
    })
    .from(v1MediaJobs)
    .where(and(api, olderThan(v1MediaJobs.createdAt, v1MediaJobs.id, cursor)))
    .orderBy(...newestFirst(v1MediaJobs.createdAt, v1MediaJobs.id))
    .limit(limit);
  const entries = rows.map((row): StudioEntry => ({
    ...row,
    title: row.title.slice(0, 160),
    createdAt: row.createdAt.toISOString(),
    status: "completed",
    transcript: null,
    settings: { prompt: row.title, model: row.model },
    source: "api",
    threadId: null,
    rootFolderId: null,
  }));
  return sourcePage(entries, rows, limit);
}

/**
 * The visitor's generations across the Studio, chat threads and the /v1 API,
 * newest first. Guests see what their lead made; incognito chats are never
 * read (they live in the browser).
 *
 * Two ways to page: `page` (offset, for the CLI and page numbers) or
 * `cursor` (the previous page's `nextCursor`, for "load more"; stable while
 * new results arrive on top). Each source reads one row past the requested
 * window. When a source had more rows, the merged list is only trusted down
 * to the last row that source read, and the next page starts there.
 */
export async function studioHistoryPage(
  user: JwtPayloadType,
  params: {
    kind?: CreateKind;
    page: number;
    limit: number;
    cursor?: string;
  },
): Promise<StudioHistoryPage> {
  if (user.isPublic && !user.leadId) {
    return { items: [], totalCount: 0, nextCursor: null };
  }
  const { kind, limit } = params;
  const cursor = params.cursor ? decodeHistoryCursor(params.cursor) : undefined;
  const offset = cursor ? 0 : (params.page - 1) * limit;
  const fetched = offset + limit + 1;
  const [studio, chat, jobs, totalCount] = await Promise.all([
    studioRows(user, kind, fetched, cursor),
    chatHistory(user, kind, fetched, cursor),
    apiRows(user, kind, fetched, cursor),
    countRows(user, kind),
  ]);
  const boundary = [studio, chat, jobs]
    .flatMap((source) => (source.truncatedAt ? [source.truncatedAt] : []))
    .toSorted(compareKeys)
    .at(0);
  const merged = [...studio.entries, ...chat.entries, ...jobs.entries]
    .toSorted((a, b) => compareKeys(entryKey(a), entryKey(b)))
    .filter(
      (entry) => !boundary || compareKeys(entryKey(entry), boundary) <= 0,
    );
  const items = merged.slice(offset, offset + limit);
  const last = items.at(-1);
  const more = merged.length > offset + limit || boundary !== undefined;
  const next = !more
    ? undefined
    : items.length === limit && last
      ? entryKey(last)
      : boundary;
  return {
    items,
    totalCount,
    nextCursor: next ? encodeHistoryCursor(next) : null,
  };
}

/** First page for the page loaders (SSR). */
export async function recentStudioHistory(
  user: JwtPayloadType,
  kind?: CreateKind,
): Promise<StudioEntry[]> {
  const { items } = await studioHistoryPage(user, {
    kind,
    page: 1,
    limit: kind ? 24 : 6,
  });
  return items;
}
