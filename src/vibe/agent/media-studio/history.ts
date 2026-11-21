import "server-only";

import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNull,
  ne,
  type SQL,
  sql,
} from "drizzle-orm";
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

async function chatHistory(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
  limit: number,
): Promise<StudioEntry[]> {
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
    .where(chatFilter(user, kind))
    .orderBy(desc(chatMessages.createdAt), desc(chatMessages.id))
    .limit(limit);
  return rows.flatMap((row) => {
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
        source: "chat" as const,
        threadId: row.threadId,
        rootFolderId: row.rootFolderId,
      },
    ];
  });
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

/**
 * The visitor's generations across the Studio, chat threads and the /v1 API,
 * newest first. Guests see what their lead made; incognito chats are never
 * read (they live in the browser). Each source is read up to the end of the
 * requested page, merged, then sliced, so pages stay stable across sources.
 */
export async function studioHistoryPage(
  user: JwtPayloadType,
  params: { kind?: CreateKind; page: number; limit: number },
): Promise<StudioHistoryPage> {
  const { kind, page, limit } = params;
  const offset = (page - 1) * limit;
  const depth = offset + limit;
  const api = apiFilter(user, kind);
  const [studio, chat, jobs, totalCount] = await Promise.all([
    db
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
      .where(studioFilter(user, kind))
      .orderBy(desc(studioGenerations.createdAt), desc(studioGenerations.id))
      .limit(depth),
    chatHistory(user, kind, depth),
    api
      ? db
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
          .where(api)
          .orderBy(desc(v1MediaJobs.createdAt), desc(v1MediaJobs.id))
          .limit(depth)
      : [],
    countRows(user, kind),
  ]);
  const entries: StudioEntry[] = [
    ...studio.map((row) => ({
      ...row,
      model: row.model || null,
      settings: row.settings ?? null,
      source: "studio" as const,
      threadId: null,
      rootFolderId: null,
      createdAt: row.createdAt.toISOString(),
      status:
        row.status !== "completed" &&
        row.status !== "failed" &&
        Date.now() - row.createdAt.getTime() > V1_MEDIA_JOB_STALE_MS
          ? ("failed" as const)
          : row.status,
    })),
    ...chat,
    ...jobs.map((row) => ({
      ...row,
      title: row.title.slice(0, 160),
      createdAt: row.createdAt.toISOString(),
      status: "completed" as const,
      transcript: null,
      settings: { prompt: row.title, model: row.model },
      source: "api" as const,
      threadId: null,
      rootFolderId: null,
    })),
  ];
  return {
    items: entries
      .toSorted(
        (a, b) =>
          b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
      )
      .slice(offset, depth),
    totalCount,
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
