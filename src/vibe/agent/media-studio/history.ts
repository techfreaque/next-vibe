import "server-only";

import { and, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm";
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

export interface StudioEntry {
  id: string;
  kind: CreateKind;
  title: string;
  createdAt: string;
  status: "queued" | "running" | "saving" | "completed" | "failed";
  url: string | null;
  transcript: string | null;
  credits: number | null;
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
});

async function chatHistory(
  user: JwtPayloadType,
  kind: CreateKind | undefined,
  limit: number,
): Promise<StudioEntry[]> {
  const tools = kind ? [TOOL_NAMES[kind]] : Object.values(TOOL_NAMES);
  const rows = await db
    .select({
      id: chatMessages.id,
      metadata: chatMessages.metadata,
      createdAt: chatMessages.createdAt,
      title: chatThreads.title,
    })
    .from(chatThreads)
    .innerJoin(chatMessages, eq(chatMessages.threadId, chatThreads.id))
    .where(
      and(
        user.isPublic
          ? and(isNull(chatThreads.userId), eq(chatThreads.leadId, user.leadId))
          : eq(chatThreads.userId, user.id),
        ne(chatThreads.status, ThreadStatus.DELETED),
        ne(chatThreads.rootFolderId, DefaultFolderId.INCOGNITO),
        inArray(
          sql<string>`${chatMessages.metadata}->'toolCall'->>'toolName'`,
          tools,
        ),
        sql`${chatMessages.metadata}->'toolCall'->'result' IS NOT NULL`,
      ),
    )
    .orderBy(desc(chatMessages.createdAt))
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
      },
    ];
  });
}

export async function recentStudioHistory(
  user: JwtPayloadType,
  kind?: CreateKind,
): Promise<StudioEntry[]> {
  const limit = kind ? 24 : 6;
  const [studio, chat, api] = await Promise.all([
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
      })
      .from(studioGenerations)
      .where(
        and(
          user.isPublic
            ? eq(studioGenerations.leadId, user.leadId)
            : eq(studioGenerations.userId, user.id),
          kind ? eq(studioGenerations.kind, kind) : undefined,
        ),
      )
      .orderBy(desc(studioGenerations.createdAt), desc(studioGenerations.id))
      .limit(limit),
    chatHistory(user, kind, limit),
    !user.isPublic && (!kind || kind === "video" || kind === "music")
      ? db
          .select({
            id: v1MediaJobs.id,
            kind: v1MediaJobs.kind,
            title: v1MediaJobs.prompt,
            createdAt: v1MediaJobs.createdAt,
            url: v1MediaJobs.resultUrl,
            credits: v1MediaJobs.creditsCharged,
          })
          .from(v1MediaJobs)
          .where(
            and(
              eq(v1MediaJobs.userId, user.id),
              eq(v1MediaJobs.status, "completed"),
              kind ? eq(v1MediaJobs.kind, kind) : undefined,
            ),
          )
          .orderBy(desc(v1MediaJobs.createdAt))
          .limit(limit)
      : [],
  ]);
  const entries: StudioEntry[] = [
    ...studio.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      status:
        row.status !== "completed" &&
        row.status !== "failed" &&
        Date.now() - row.createdAt.getTime() > V1_MEDIA_JOB_STALE_MS
          ? ("failed" as const)
          : row.status,
    })),
    ...chat,
    ...api.map((row) => ({
      ...row,
      title: row.title.slice(0, 160),
      createdAt: row.createdAt.toISOString(),
      status: "completed" as const,
      transcript: null,
    })),
  ];
  return entries
    .toSorted(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    )
    .slice(0, limit);
}
