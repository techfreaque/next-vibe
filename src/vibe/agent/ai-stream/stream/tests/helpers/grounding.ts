/**
 * Grounding assertions for the AI-stream suites.
 *
 * The AI's self-report (STEP_OK) is a claim, not evidence: a model can write
 * STEP_OK next to a media URL it made up, and the compacting summarizer can
 * recap task ids that never existed. These helpers check every claim the AI
 * writes against what the platform actually recorded:
 *
 * - Media URLs the AI (or a compacting recap) writes must come from a real
 *   tool row / user message of the thread.
 * - Media URLs inside tool results must resolve to a stored file.
 * - Task ids the AI or a recap mentions must exist (tool rows or cron_tasks).
 * - Native (file-part) media tool rows must be settled (status "completed").
 *
 * Run after every main-thread step so a fabrication is caught at the step
 * that introduced it, not several steps later.
 */

import "server-only";

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { cronTasks } from "next-vibe/tasks/cron/db";
import { expect } from "vitest";
import { z } from "zod";

import { getStorageAdapter } from "../../../../chat/storage/index";
import {
  findStorageUrls,
  isStorageUrl,
  toPortableStorageUrl,
} from "../../../../chat/storage/storage-url";
import { parseStorageUrl } from "../../../../chat/storage/url-utils";
import { IMAGE_GEN_ALIAS } from "../../../../image-generation/constants";
import { AUDIO_GEN_TOOL_NAME } from "../../../../music-generation/constants";
import { VIDEO_GEN_TOOL_NAME } from "../../../../video-generation/constants";
import { cacheDir } from "../../../testing/fetch-cache";
import type { SlimMessage } from "../../../testing/headless-test-runner";
import { toolResultRecord } from "../../../testing/headless-test-runner";
import { stripReasoning } from "./prompts";

/** Recorded fixture request: OpenAI-style `messages` or Gemini `contents`. */
const recordedMessageSchema = z.looseObject({ role: z.string().optional() });
const recordedRequestSchema = z.object({
  body: z.object({
    messages: z.array(recordedMessageSchema).optional(),
    contents: z.array(recordedMessageSchema).optional(),
  }),
});

/** Task ids minted by generateTaskId (execute-tool/repository/task-id.ts). */
const TASK_ID_PATTERN =
  /\b(?:local-bg|local-wu|remote-ws|remote-direct)-[A-Za-z0-9-]*[A-Za-z0-9]/g;

/** Absolute URLs and root-relative storage paths. */
const URL_PATTERN =
  /(?:https?:\/\/[^\s"'<>()[\]\\`]+|\/api\/[A-Za-z]{2}-[A-Za-z]+\/[^\s"'<>()[\]\\`]+)/g;

const MEDIA_EXTENSION =
  /\.(?:png|jpe?g|webp|gif|mp4|webm|mov|mp3|wav|ogg|m4a|flac)(?:$|[?#])/i;

const NATIVE_MEDIA_TOOL_NAMES = new Set<string>([
  IMAGE_GEN_ALIAS,
  VIDEO_GEN_TOOL_NAME,
  AUDIO_GEN_TOOL_NAME,
]);

/** Strip trailing sentence punctuation a URL picks up from prose/markdown. */
function cleanUrl(url: string): string {
  return url.replace(/[.,;:!?*_]+$/, "");
}

/** Comparable form: portable storage path, no query/fragment. */
function normalizeUrl(url: string): string {
  return toPortableStorageUrl(cleanUrl(url)).replace(/[?#].*$/, "");
}

function isMediaUrl(url: string): boolean {
  return isStorageUrl(url) || MEDIA_EXTENSION.test(url);
}

function mediaUrlsIn(text: string): string[] {
  return (text.match(URL_PATTERN) ?? [])
    .map(cleanUrl)
    .filter((u) => isMediaUrl(u));
}

function taskIdsIn(text: string): string[] {
  return text.match(TASK_ID_PATTERN) ?? [];
}

/**
 * Task-id mentions in AI text. A mention followed by an ellipsis
 * ("local-bg-chatcmpl-tool-...") is an abbreviation: it is grounded when it
 * prefixes a real id, never by itself.
 */
function taskIdMentionsIn(
  text: string,
): { id: string; abbreviated: boolean }[] {
  const mentions: { id: string; abbreviated: boolean }[] = [];
  for (const match of text.matchAll(TASK_ID_PATTERN)) {
    const after = text.slice(
      (match.index ?? 0) + match[0].length,
      (match.index ?? 0) + match[0].length + 4,
    );
    mentions.push({
      id: match[0],
      abbreviated: /^-?(?:\.\.\.|…)/.test(after),
    });
  }
  return mentions;
}

/** Everything the platform (not the AI) put into the thread. */
function groundTruthText(messages: SlimMessage[]): string {
  const parts: string[] = [];
  for (const m of messages) {
    if (m.role === "tool" && m.toolCall) {
      parts.push(JSON.stringify(m.toolCall));
    } else if (m.role === "user") {
      parts.push(m.content ?? "");
      if (m.attachments) {
        parts.push(JSON.stringify(m.attachments));
      }
    }
    if (m.generatedMedia) {
      parts.push(JSON.stringify(m.generatedMedia));
    }
    if (m.variants) {
      parts.push(JSON.stringify(m.variants));
    }
  }
  return parts.join("\n");
}

/**
 * Text the AI authored as a claim: assistant answers and compacting recaps,
 * reasoning stripped (a model musing about an id mid-thought is not a claim).
 */
function aiAuthored(
  messages: SlimMessage[],
): { msg: SlimMessage; text: string }[] {
  return messages
    .filter((m) => m.role === "assistant")
    .map((msg) => ({ msg, text: stripReasoning(msg.content ?? "") }))
    .filter(({ text }) => text !== "");
}

function stripOrigin(url: string): string {
  return url.replace(/^https?:\/\/[^/]+/, "");
}

/**
 * An AI-shortened URL ("http://localhost:3000/api/.../dfc24e3b-...png") is
 * grounded when one real URL contains every visible fragment, in order. A
 * bare ellipsis with no distinguishing fragment never grounds anything.
 */
function abbreviationGrounded(url: string, truthPaths: string[]): boolean {
  const fragments = stripOrigin(url)
    .split(/\.\.\.|…/)
    .filter((f) => f.length > 0);
  if (fragments.length < 2) {
    return false;
  }
  return truthPaths.some((real) => {
    let from = 0;
    for (const fragment of fragments) {
      const at = real.indexOf(fragment, from);
      if (at === -1) {
        return false;
      }
      from = at + fragment.length;
    }
    return true;
  });
}

/**
 * The non-assistant parts of a recorded request (tool results, user turns,
 * system context), serialized. Assistant history is excluded: a URL the model
 * itself invented in an earlier turn rides every later request and must not
 * ground itself.
 */
function nonAssistantInputs(reqJson: string): string[] {
  const parsed = recordedRequestSchema.safeParse(JSON.parse(reqJson));
  if (!parsed.success) {
    return [];
  }
  const messages = parsed.data.body.messages ?? parsed.data.body.contents ?? [];
  return messages
    .filter((m) => m.role !== "assistant" && m.role !== "model")
    .map((m) => JSON.stringify(m));
}

/**
 * URLs the model was actually SHOWN in this run's fixture folder: every
 * recorded request body (`*-req.json`) is the model input of one call.
 * Storage file ids are minted per upload, so on replay a recorded answer
 * cites the file id of the RECORDING run while the live tool row holds a
 * fresh one. What the answer must be grounded in is the input the model saw
 * when it wrote it, which is exactly the recorded request.
 */
function recordedModelInputUrls(fixturePrefix: string): string[] {
  const dir = cacheDir(fixturePrefix);
  if (!existsSync(dir)) {
    return [];
  }
  const urls: string[] = [];
  for (const file of readdirSync(dir)) {
    if (!/^\d{4}-.*-req\.json$/.test(file)) {
      continue;
    }
    for (const text of nonAssistantInputs(
      readFileSync(join(dir, file), "utf-8"),
    )) {
      for (const url of text.match(URL_PATTERN) ?? []) {
        urls.push(normalizeUrl(url));
      }
    }
  }
  return urls;
}

/**
 * Every media URL the AI wrote (answer or compacting recap) must exist in a
 * tool row / user message of this thread, or (replay) in the recorded model
 * input it was produced from. Catches "STEP_OK, here is your image:
 * <made-up URL>".
 */
export function assertAiMediaUrlsGrounded(
  messages: SlimMessage[],
  stepName: string,
  fixturePrefix?: string,
): void {
  const truth = new Set(
    (groundTruthText(messages).match(URL_PATTERN) ?? []).map(normalizeUrl),
  );
  let recorded: Set<string> | null = null;
  const isGrounded = (url: string): boolean => {
    if (
      truth.has(normalizeUrl(url)) ||
      abbreviationGrounded(url, [...truth].map(stripOrigin))
    ) {
      return true;
    }
    if (!fixturePrefix) {
      return false;
    }
    recorded ??= new Set(recordedModelInputUrls(fixturePrefix));
    return (
      recorded.has(normalizeUrl(url)) ||
      abbreviationGrounded(url, [...recorded].map(stripOrigin))
    );
  };
  for (const { msg, text } of aiAuthored(messages)) {
    for (const url of mediaUrlsIn(text)) {
      expect(
        isGrounded(url),
        `[${stepName}] ${msg.isCompacting ? "compacting recap" : "assistant"} ${msg.id} cites media URL ${url} that no tool result, user message or recorded model input contains (fabricated URL)`,
      ).toBe(true);
    }
  }
}

/**
 * Every task id the AI wrote (answer or compacting recap) must exist: in a
 * tool row of the thread (taskId result / remoteTaskId / await-task args) or
 * as a cron_tasks row. Catches recaps that invent task ids.
 */
export async function assertAiTaskIdsGrounded(
  messages: SlimMessage[],
  stepName: string,
): Promise<void> {
  const truth = new Set(taskIdsIn(groundTruthText(messages)));
  const missing = new Map<string, SlimMessage>();
  for (const { msg, text } of aiAuthored(messages)) {
    for (const { id, abbreviated } of taskIdMentionsIn(text)) {
      if (abbreviated) {
        const prefixesReal = [...truth].some((real) =>
          real.startsWith(`${id}-`),
        );
        expect(
          prefixesReal || truth.has(id),
          `[${stepName}] ${msg.isCompacting ? "compacting recap" : "assistant"} ${msg.id} cites abbreviated task id ${id}… that prefixes no task id in the thread's tool rows (invented task id)`,
        ).toBe(true);
        continue;
      }
      if (!truth.has(id) && !missing.has(id)) {
        missing.set(id, msg);
      }
    }
  }
  if (missing.size === 0) {
    return;
  }
  const rows = await db
    .select({ id: cronTasks.id })
    .from(cronTasks)
    .where(inArray(cronTasks.id, [...missing.keys()]));
  const inDb = new Set(rows.map((r) => r.id));
  for (const [id, msg] of missing) {
    expect(
      inDb.has(id),
      `[${stepName}] ${msg.isCompacting ? "compacting recap" : "assistant"} ${msg.id} cites task id ${id} that exists in no tool row of the thread and no cron_tasks row (invented task id)`,
    ).toBe(true);
  }
}

/**
 * Every storage URL inside a tool RESULT must resolve to a stored file. A
 * tool that reports an imageUrl/videoUrl/audioUrl the storage never got is a
 * broken result even when the AI happily confirms it.
 */
export async function assertToolMediaStored(
  messages: SlimMessage[],
  stepName: string,
): Promise<void> {
  const storage = getStorageAdapter();
  const checked = new Set<string>();
  for (const m of messages) {
    if (m.role !== "tool" || m.toolCall?.result === undefined) {
      continue;
    }
    for (const url of findStorageUrls(JSON.stringify(m.toolCall.result))) {
      const portable = normalizeUrl(url);
      if (checked.has(portable)) {
        continue;
      }
      checked.add(portable);
      const parsed = parseStorageUrl(portable);
      expect(
        parsed,
        `[${stepName}] tool row ${m.id} (${m.toolCall.toolName}) has unparseable storage URL ${url}`,
      ).not.toBeNull();
      if (!parsed) {
        continue;
      }
      const data = await storage.readFileAsBase64(
        parsed.fileId,
        parsed.threadId,
      );
      expect(
        (data ?? "").length,
        `[${stepName}] tool row ${m.id} (${m.toolCall.toolName}) returned ${url} but no such file is in storage`,
      ).toBeGreaterThan(0);
    }
  }
}

/**
 * Native (file-part) media tool rows are synthesised with a final result, so
 * they must be settled: status "completed", a media URL under `file`.
 */
export function assertNativeMediaRowsSettled(
  messages: SlimMessage[],
  stepName: string,
): void {
  for (const m of messages) {
    const tc = m.toolCall;
    if (m.role !== "tool" || !tc?.toolName) {
      continue;
    }
    if (!NATIVE_MEDIA_TOOL_NAMES.has(tc.toolName)) {
      continue;
    }
    const result = toolResultRecord(tc.result);
    const args = toolResultRecord(tc.args);
    const isNative =
      typeof result?.["file"] === "string" && args?.["prompt"] === "";
    if (!isNative) {
      continue;
    }
    expect(
      tc.status,
      `[${stepName}] native ${tc.toolName} tool row ${m.id} must be settled with status "completed" (got ${String(tc.status)})`,
    ).toBe("completed");
  }
}

/** All grounding checks for one thread snapshot. */
export async function assertThreadGrounded(
  messages: SlimMessage[],
  stepName: string,
  opts: { checkStorage: boolean; fixturePrefix?: string },
): Promise<void> {
  assertAiMediaUrlsGrounded(messages, stepName, opts.fixturePrefix);
  await assertAiTaskIdsGrounded(messages, stepName);
  assertNativeMediaRowsSettled(messages, stepName);
  if (opts.checkStorage) {
    await assertToolMediaStored(messages, stepName);
  }
}
