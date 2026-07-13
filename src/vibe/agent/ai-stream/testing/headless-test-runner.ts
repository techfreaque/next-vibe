/**
 * Headless Test Runner
 * Thin wrapper around the ai-stream/stream POST endpoint for integration tests.
 * Provides sensible test defaults so individual tests stay concise.
 */

import "server-only";

import type { HeadlessAiStreamResult } from "next-vibe/agent/ai-stream/repository/setup/setup";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import {
  DefaultFolderId,
  rootlessStreamContext,
} from "next-vibe/agent/chat/config";
import type { ChatMessage, MessageMetadata } from "next-vibe/agent/chat/db";
import {
  ChatMessageRole,
  ThreadStreamingState,
} from "next-vibe/agent/chat/enum";
import { NO_SKILL_ID } from "next-vibe/agent/skills/constants";
import type { FavoriteConfig } from "next-vibe/agent/skills/favorites/db";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";

import { env } from "@/env/env";

import type { ChatModelId } from "../models";

/**
 * Resolve a test user by email+password using endpoints only.
 * Runs the login like a web request: a real lead exists before the call.
 */
export async function resolveUser(
  email: string,
  password: string = env.VIBE_ADMIN_USER_PASSWORD,
): Promise<JwtPrivatePayloadType | null> {
  const resolved = await resolveUserAndToken(email, password);
  return resolved?.user ?? null;
}

/**
 * Same as resolveUser but also returns the raw JWT string.
 * Needed when the token must be stored in a remote connection row for relay auth.
 */
export async function resolveUserAndToken(
  email: string,
  password: string = env.VIBE_ADMIN_USER_PASSWORD,
): Promise<{ user: JwtPrivatePayloadType; token: string } | null> {
  const logger = createEndpointLogger(false, defaultLocale);
  const loginDef = (await import("@/user/public/login/definition")).default;
  // Log in exactly like a web client: POST the public login endpoint.
  // sendTestRequest resolves the public caller (admin leadId) for us — no
  // fabricated lead row, no direct DB write.
  const loginResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: loginDef.POST,
    data: { email, password, rememberMe: false },
  });
  if (!loginResult.success) {
    return null;
  }
  const token = loginResult.data?.["token"];
  if (typeof token !== "string" || !token) {
    return null;
  }
  const verifyResult = await AuthRepository.verifyJwt(
    token,
    logger,
    defaultLocale,
  );
  if (!verifyResult.success) {
    return null;
  }
  return { user: verifyResult.data, token };
}

/**
 * Get or create a chat folder by name under a given root + optional parent.
 * Idempotent: lists existing folders via endpoint, creates if not found.
 */
export async function getOrCreateFolder(
  user: JwtPrivatePayloadType,
  rootFolderId: DefaultFolderId,
  name: string,
  parentId: string | null = null,
): Promise<string> {
  const listDef = (
    await import("next-vibe/agent/chat/folders/[rootFolderId]/definition")
  ).default;
  const listResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: listDef.GET,
    urlPathParams: { rootFolderId },
    user,
  });
  if (listResult.success) {
    const folders = listResult.data?.["folders"];
    if (Array.isArray(folders)) {
      const existing = (
        folders as Array<{
          id: string;
          name: string;
          parentId: string | null;
        }>
      ).find(
        (f) => f.name === name && (f.parentId ?? null) === (parentId ?? null),
      );
      if (existing) {
        return existing.id;
      }
    }
  }

  const createDef = (
    await import("next-vibe/agent/chat/folders/[rootFolderId]/create/definition")
  ).default;
  const createResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: createDef.POST,
    data: { name, parentId: parentId ?? undefined },
    urlPathParams: { rootFolderId },
    user,
  });
  if (!createResult.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `getOrCreateFolder: failed to create folder "${name}": ${createResult.message}`,
    );
  }
  const folderId = createResult.data?.["folderId"];
  if (typeof folderId !== "string") {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `getOrCreateFolder: folder create returned no folderId for "${name}"`,
    );
  }
  return folderId;
}

export interface TestStreamParams {
  prompt: string;
  user: JwtPayloadType;
  /**
   * Fixture record/replay context for the case — travels the whole chain
   * (streamContext → providers/media/remote dispatch) and anchors on the
   * thread at creation. Explicit, never ambient.
   */
  streamContext: ToolExecutionContext;
  threadId?: string;
  skill?: string;
  /**
   * Root folder override. Defaults to DefaultFolderId.PRIVATE — ALL test
   * threads live at PRIVATE/tests/<case>/ unless a REMOTE-folder suite
   * overrides explicitly.
   * Loop location is a thread/connection property — placement never routes.
   */
  rootFolderId?: DefaultFolderId;
  /**
   * Subfolder UUID within the root folder.
   */
  subFolderId?: string;

  /**
   * Explicit parent message ID for retry/branch tests.
   * When set, the user message is created as a child of this message
   * instead of the thread's most recent message.
   *
   * UI equivalent: pass message.parentId here and operation "retry"/"edit"
   * to exactly replicate what branchMessage/retryMessage hooks do.
   */
  explicitParentMessageId?: string;
  /**
   * Override the stream operation. Mirrors the UI's operation field.
   * - "retry": same as UI retryMessage (uses message.parentId as parent)
   * - "edit": same as UI branchMessage (uses message.parentId as parent)
   * - "send": default - new user message (uses last message or explicitParentMessageId)
   * When not provided, headless.ts auto-resolves based on threadId presence.
   */
  operationOverride?: "send" | "retry" | "edit";
  /** File attachments to include with the user message (images, audio, PDFs, video) */
  attachments?: File[];
  /**
   * Audio file for STT transcription (voice UI flow - NOT the attachment gap-fill path).
   * When provided, the audio is transcribed via SpeechToTextRepository before the AI runs.
   * The transcribed text becomes the user message content (no variants, no gap-fill).
   * Use this to test the dedicated STT path; use `attachments` for the audioVisionModel path.
   */
  audioInput?: File | null;
  /**
   * Use a pre-created favorite to load model + skill + the full FavoriteConfig.
   * The favorite's config (model, media-gen models, tools, confirmation gates)
   * is fetched via the favorites/[id] GET endpoint and sent in the stream POST
   * body — exactly as a real client does. Configure any per-test model/tool
   * overrides ON the favorite (favorites PATCH), not via separate knobs.
   */
  favoriteId?: string;
  /**
   * Tool confirmations to send with the stream — the real UI confirm flow.
   * Each entry confirms/rejects a pending tool call by its message ID. When
   * provided, no new user message is created (matches the endpoint contract).
   */
  toolConfirmations?: Array<{
    messageId: string;
    confirmed: boolean;
    updatedArgs?: Record<string, string | number | boolean | null>;
  }> | null;
  /**
   * Pre-resolved favorite config override. Normally omit — favoriteId resolves
   * the config via the GET endpoint. Used only when a test already holds the
   * exact config to send (avoids a redundant fetch).
   */
  favoriteConfig?: FavoriteConfig | null;
  /** Abort signal to cancel the stream. Defaults to a never-aborting signal. */
  abortSignal?: AbortSignal;
  /**
   * How long to wait for the thread to settle (idle|waiting) before failing.
   * Defaults to 120_000ms. Heavy media turns (image-to-video/image-to-image)
   * send multi-megabyte requests whose post-tool model turn legitimately runs
   * longer than the default — and on first recording the live media polling plus
   * that turn must all complete within this window for the fixtures to persist.
   * Raise it for those cases so both recording and replay finish cleanly.
   */
  settleTimeoutMs?: number;
  /** The user's IANA timezone for the stream POST body. Defaults to "UTC" only
   *  for incidental callers; suites pass the user's real zone. */
  timezone?: string;
}

/** Slim message shape - only fields we assert on */
export interface SlimMessage {
  id: string;
  role: string;
  parentId: string | null;
  sequenceId: string | null;
  content: string | null;
  createdAt: Date;
  model: string | null;
  isAI: boolean;
  toolCall: {
    toolName?: string;
    args?: WidgetData;
    result?: WidgetData;
    isDeferred?: boolean;
    toolCallId?: string;
    originalToolCallId?: string;
    status?: "pending" | "completed" | "failed";
    remoteTaskId?: string;
    callbackMode?: string;
    waitingForConfirmation?: boolean;
    isConfirmed?: boolean;
    /** Structured tool error — surfaced in assertions so a failed tool call
     *  reports its real reason instead of a bare "null result". */
    error?: NonNullable<MessageMetadata["toolCall"]>["error"];
  } | null;
  generatedMedia: { type: string; url?: string | null }[] | null;
  /** True when this is a compacting summary message */
  isCompacting: boolean;
  /** Attachment metadata from user messages */
  attachments: MessageMetadata["attachments"] | null;
  /** Gap-fill variants (text descriptions of media) */
  variants: MessageMetadata["variants"] | null;
  /** Token usage metadata (assistant messages only) */
  promptTokens: number | null;
  completionTokens: number | null;
  creditCost: number | null;
  finishReason: string | null;
  /** True when this user message is queued waiting for an active stream to finish */
  isQueued: boolean;
}

export interface TestStreamResult {
  result: ResponseType<HeadlessAiStreamResult>;
  /** Messages from DB (only when result.success && threadId present) */
  messages: SlimMessage[];
  /**
   * Number of tool schemas loaded into the AI context window.
   * Mirrors result.data.pinnedToolCount - pulled out for convenient assertion.
   * 0 when stream failed.
   */
  pinnedToolCount: number;
}

/**
 * Narrow a ToolCallResult to a plain record for field access in tests.
 * Returns null if the result is not a non-array object.
 */
export function toolResultRecord(
  result: WidgetData | undefined,
): Record<string, WidgetData> | null {
  if (
    result !== null &&
    result !== undefined &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    !(result instanceof Date)
  ) {
    return result;
  }
  return null;
}

function slimMessages(
  rows: {
    id: string;
    role: string;
    parentId: string | null;
    sequenceId: string | null;
    content: string | null;
    createdAt: Date;
    model: string | null;
    isAI: boolean;
    metadata: MessageMetadata;
  }[],
): SlimMessage[] {
  return rows.map((r) => ({
    id: r.id,
    role: r.role,
    parentId: r.parentId,
    sequenceId: r.sequenceId,
    content: r.content,
    createdAt: r.createdAt,
    model: r.model,
    isAI: r.isAI,
    toolCall: r.metadata?.toolCall
      ? {
          toolName: r.metadata.toolCall.toolName,
          args: r.metadata.toolCall.args,
          result: r.metadata.toolCall.result,
          isDeferred: r.metadata.toolCall.isDeferred === true,
          toolCallId: r.metadata.toolCall.toolCallId,
          originalToolCallId: r.metadata.toolCall.originalToolCallId,
          status: r.metadata.toolCall.status,
          remoteTaskId: r.metadata.toolCall.remoteTaskId,
          callbackMode: r.metadata.toolCall.callbackMode,
          waitingForConfirmation:
            r.metadata.toolCall.waitingForConfirmation === true
              ? true
              : undefined,
          isConfirmed:
            r.metadata.toolCall.isConfirmed === true ? true : undefined,
          error: r.metadata.toolCall.error,
        }
      : null,
    generatedMedia: r.metadata?.generatedMedia
      ? [
          {
            type: r.metadata.generatedMedia.type,
            url: r.metadata.generatedMedia.url,
          },
        ]
      : null,
    isCompacting: r.metadata?.isCompacting === true,
    attachments: r.metadata?.attachments ?? null,
    variants: r.metadata?.variants ?? null,
    promptTokens: r.metadata?.promptTokens ?? null,
    completionTokens: r.metadata?.completionTokens ?? null,
    creditCost: r.metadata?.creditCost ?? null,
    finishReason: r.metadata?.finishReason ?? null,
    isQueued: r.metadata?.isQueued === true,
  }));
}

/** Fetch all messages for a thread via the messages endpoint as SlimMessage[] */
export async function fetchThreadMessages(
  threadId: string,
  user: JwtPayloadType,
  rootFolderId: DefaultFolderId = DefaultFolderId.PRIVATE,
): Promise<SlimMessage[]> {
  const msgsDef = (
    await import("next-vibe/agent/chat/threads/[threadId]/messages/definition")
  ).default;
  const result = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: msgsDef.GET,
    data: { rootFolderId },
    urlPathParams: { threadId },
    user,
  });
  if (!result.success) {
    return [];
  }
  const raw = result.data?.["messages"];
  if (!Array.isArray(raw)) {
    return [];
  }
  return slimMessages(
    (raw as ChatMessage[])
      .map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        metadata: r.metadata ?? {},
      }))
      .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
  );
}

/** Fetch the current streamingState for a thread via the messages endpoint. */
export async function fetchThreadStreamingState(
  threadId: string,
  user: JwtPayloadType,
): Promise<string | undefined> {
  const msgsDef = (
    await import("next-vibe/agent/chat/threads/[threadId]/messages/definition")
  ).default;
  const result = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: msgsDef.GET,
    data: { rootFolderId: DefaultFolderId.PRIVATE },
    urlPathParams: { threadId },
    user,
  });
  if (!result.success) {
    return undefined;
  }
  const state = result.data?.["streamingState"];
  return typeof state === "string" ? state : undefined;
}

/**
 * Poll until a thread's streamingState returns to 'idle'.
 * Use after runTestStream when the stream aborted into 'waiting' state
 * (queue WAIT mode: task in flight, revival pending).
 *
 * When the revival stream finishes, streamingState transitions idle|waiting → idle.
 * Re-fetches messages once idle so callers get the post-revival thread state.
 *
 * Throws if the thread does not become idle within maxWaitMs.
 */
export async function waitForThreadIdle(
  threadId: string,
  user: JwtPayloadType,
  maxWaitMs = 90_000,
  rootFolderId: DefaultFolderId = DefaultFolderId.PRIVATE,
): Promise<SlimMessage[]> {
  // Tight poll: a thread is usually already idle (the loop checks up-front, so an
  // idle thread returns with zero sleep) or becomes idle within a few ms of the
  // stream returning under fixture replay. 25ms picks up the transition fast with
  // negligible DB load; the old 100ms added dead wait on every not-yet-idle step.
  const pollIntervalMs = 25;
  const start = Date.now();
  const msgsDef = (
    await import("next-vibe/agent/chat/threads/[threadId]/messages/definition")
  ).default;
  while (Date.now() - start < maxWaitMs) {
    const result = await sendTestRequest({
      streamContext: rootlessStreamContext(),
      endpoint: msgsDef.GET,
      data: { rootFolderId },
      urlPathParams: { threadId },
      user,
    });
    if (
      result.success &&
      result.data?.["streamingState"] === ThreadStreamingState.IDLE
    ) {
      return fetchThreadMessages(threadId, user, rootFolderId);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `waitForThreadIdle: thread ${threadId} did not become idle within ${maxWaitMs}ms`,
  );
}

/**
 * Poll until a thread's streamingState SETTLES — 'idle' (turn finished) or
 * 'waiting' (turn paused for async work: detach/wakeUp/queue WAIT). Returns the
 * thread's messages once settled. Mirrors the fire-and-forget client: the POST
 * returns immediately and the stream runs in the background; the caller observes
 * the thread settle into idle (done) or waiting (paused, revival pending).
 *
 * Throws if the thread does not settle within maxWaitMs.
 */
export async function waitForThreadSettled(
  threadId: string,
  user: JwtPayloadType,
  maxWaitMs = 120_000,
  rootFolderId: DefaultFolderId = DefaultFolderId.PRIVATE,
): Promise<SlimMessage[]> {
  const pollIntervalMs = 500;
  const start = Date.now();
  const msgsDef = (
    await import("next-vibe/agent/chat/threads/[threadId]/messages/definition")
  ).default;
  while (Date.now() - start < maxWaitMs) {
    const result = await sendTestRequest({
      streamContext: rootlessStreamContext(),
      endpoint: msgsDef.GET,
      data: { rootFolderId },
      urlPathParams: { threadId },
      user,
    });
    const state = result.success ? result.data?.["streamingState"] : undefined;
    if (state === "idle" || state === "waiting") {
      return fetchThreadMessages(threadId, user, rootFolderId);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, pollIntervalMs);
    });
  }
  // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
  throw new Error(
    `waitForThreadSettled: thread ${threadId} did not settle (idle|waiting) within ${maxWaitMs}ms`,
  );
}

/** Fetch the thread title via endpoint */
/**
 * Fetch a thread's title + description via the thread [threadId] GET endpoint
 * — the endpoint resolves remote threads exactly like the messages GET, so
 * this works unchanged for cross-instance suites. `title` is NOT NULL (defaults
 * to the translated "New Chat"); `description` is nullable (null until an
 * auto-title/rename sets it).
 */
export async function fetchThreadMeta(
  threadId: string,
  user: JwtPayloadType,
  rootFolderId: DefaultFolderId = DefaultFolderId.PRIVATE,
): Promise<{ title: string | null; description: string | null }> {
  const threadDef = (
    await import("next-vibe/agent/chat/threads/[threadId]/definition")
  ).default;
  const result = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: threadDef.GET,
    data: { rootFolderId },
    urlPathParams: { threadId },
    user,
  });
  if (!result.success) {
    return { title: null, description: null };
  }
  const title = result.data?.["title"];
  const description = result.data?.["description"];
  return {
    title: typeof title === "string" ? title : null,
    description: typeof description === "string" ? description : null,
  };
}

export async function fetchThreadTitle(
  threadId: string,
  user: JwtPayloadType,
  rootFolderId: DefaultFolderId = DefaultFolderId.PRIVATE,
): Promise<string | null> {
  return (await fetchThreadMeta(threadId, user, rootFolderId)).title;
}

/**
 * Fetch a favorite's full config via the favorites/[id] GET endpoint and
 * resolve the chat model it would use — exactly the data the web client holds
 * in its store and sends in the stream POST body. The action (the stream)
 * still goes through the endpoint; this only assembles the request payload a
 * real client would send.
 */
export async function fetchFavoriteConfigAndModel(
  favoriteId: string,
  user: JwtPayloadType,
): Promise<{
  favoriteConfig: FavoriteConfig;
  model: ChatModelId;
  skill: string;
}> {
  const favByIdDef = (
    await import("next-vibe/agent/skills/favorites/[id]/definition")
  ).default;
  const getResult = await sendTestRequest({
    streamContext: rootlessStreamContext(),
    endpoint: favByIdDef.GET,
    urlPathParams: { id: favoriteId },
    user,
  });
  if (!getResult.success) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `fetchFavoriteConfigAndModel: favorites GET failed for ${favoriteId}: ${getResult.message}`,
    );
  }
  const data = getResult.data;
  // The favorites GET merges the variant into skillId ("slug__variant"); split
  // it back out so the config carries the same variantId the DB row has.
  const { parseSkillId: parseSkillIdForVariant } =
    await import("next-vibe/agent/chat/slugify");
  const favoriteConfig: FavoriteConfig = {
    id: favoriteId,
    skillId: data.skillId,
    variantId: parseSkillIdForVariant(data.skillId).variantId,
    modelSelection: data.modelSelection ?? null,
    voiceModelSelection: data.voiceModelSelection ?? null,
    sttModelSelection: data.sttModelSelection ?? null,
    imageVisionModelSelection: data.imageVisionModelSelection ?? null,
    videoVisionModelSelection: data.videoVisionModelSelection ?? null,
    audioVisionModelSelection: data.audioVisionModelSelection ?? null,
    imageGenModelSelection: data.imageGenModelSelection ?? null,
    musicGenModelSelection: data.musicGenModelSelection ?? null,
    videoGenModelSelection: data.videoGenModelSelection ?? null,
    availableTools: data.availableTools ?? null,
    pinnedTools: data.pinnedTools ?? null,
    deniedTools: data.deniedTools ?? null,
    compactTrigger: data.compactTrigger ?? null,
    memoryLimit: data.memoryLimit ?? null,
    promptAppend: data.promptAppend ?? null,
  };

  const skill = favoriteConfig.skillId || NO_SKILL_ID;

  // Resolve the model the favorite would run — same cascade the client uses:
  // favorite modelSelection → skill variant modelSelection.
  const { getBestChatModel } = await import("../models");
  const { getInstanceAvailability } =
    await import("next-vibe/agent/env-availability");
  const availability = await getInstanceAvailability();
  let model: ChatModelId | undefined;
  if (favoriteConfig.modelSelection) {
    model = getBestChatModel(
      favoriteConfig.modelSelection,
      user,
      availability,
    )?.id;
  }
  if (!model && skill !== NO_SKILL_ID) {
    const logger = createEndpointLogger(false, defaultLocale);
    const { SkillsRepository } =
      await import("next-vibe/agent/skills/repository");
    const { parseSkillId } = await import("next-vibe/agent/chat/slugify");
    const skillResult = await SkillsRepository.getSkillById(
      { id: skill },
      user,
      logger,
      defaultLocale,
    );
    if (skillResult.success) {
      const variants = skillResult.data.variants;
      const variantId =
        favoriteConfig.variantId ??
        parseSkillId(favoriteConfig.skillId).variantId;
      const variant = variants
        ? variantId
          ? variants.find((v) => v.id === variantId)
          : (variants.find((v) => v.isDefault) ?? variants[0])
        : null;
      if (variant?.modelSelection) {
        model = getBestChatModel(
          variant.modelSelection,
          user,
          availability,
        )?.id;
      }
    }
  }
  if (!model) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      `fetchFavoriteConfigAndModel: could not resolve a chat model for favorite ${favoriteId} (skill ${skill})`,
    );
  }

  return { favoriteConfig, model, skill };
}

/**
 * Drive the real AI stream end-to-end through the `ai-stream/stream` POST
 * endpoint via sendTestRequest — exactly like a web client:
 *   1. Resolve the favorite's config + model (the client's store contents).
 *   2. POST the stream endpoint (fire-and-forget; returns {messageId, threadId}).
 *   3. Poll the thread's streamingState to 'idle' (WS completion equivalent).
 *   4. Read messages via the messages endpoint and reconstruct the result.
 *
 * No headless shortcut, no synthetic tool injection, no per-call model/tool
 * overrides — anything a real user configures lives on the favorite.
 */
export async function runTestStream(
  params: TestStreamParams,
): Promise<TestStreamResult> {
  const {
    prompt,
    user,
    threadId,
    skill: skillParam,
    rootFolderId: rootFolderIdOverride,
    subFolderId,
    explicitParentMessageId,
    attachments,
    audioInput,
    favoriteId,
    toolConfirmations,
    favoriteConfig: paramFavoriteConfig,
    operationOverride: callerOperationOverride,
    settleTimeoutMs,
    streamContext,
    timezone = "UTC",
  } = params;

  const rootFolderId = rootFolderIdOverride ?? DefaultFolderId.PRIVATE;
  const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
  const hasToolConfirmations =
    Array.isArray(toolConfirmations) && toolConfirmations.length > 0;

  // ── Resolve favorite config + model + skill (client store equivalent) ──
  let favoriteConfig: FavoriteConfig | null = paramFavoriteConfig ?? null;
  let model: ChatModelId | undefined;
  let skill = skillParam;
  if (favoriteId && !favoriteConfig) {
    const resolved = await fetchFavoriteConfigAndModel(favoriteId, user);
    favoriteConfig = resolved.favoriteConfig;
    model = resolved.model;
    skill = skillParam ?? resolved.skill;
  } else if (favoriteConfig) {
    const { getBestChatModel } = await import("../models");
    const { getInstanceAvailability } =
      await import("next-vibe/agent/env-availability");
    if (favoriteConfig.modelSelection) {
      model = getBestChatModel(
        favoriteConfig.modelSelection,
        user,
        await getInstanceAvailability(),
      )?.id;
    }
    skill = skillParam ?? favoriteConfig.skillId ?? NO_SKILL_ID;
  }
  if (!model) {
    // oxlint-disable-next-line restricted-syntax -- intentional throw in test helper
    throw new Error(
      "runTestStream: no model resolved — pass a favoriteId or a favoriteConfig with a resolvable model",
    );
  }
  const effectiveSkill = skill ?? NO_SKILL_ID;

  // ── Operation (client send/retry/edit) ──
  const operation: "send" | "retry" | "edit" =
    callerOperationOverride ?? "send";

  // ── Stream POST body — identical to createAndSendUserMessage (shared.ts) ──
  const userMessageId = hasToolConfirmations ? null : crypto.randomUUID();

  const streamDef = (
    await import("next-vibe/agent/ai-stream/stream/definition")
  ).default;

  // Real clients always pass parentMessageId = current leaf of the thread.
  // When callers don't provide explicitParentMessageId but do provide threadId
  // (continuing an existing thread), resolve the leaf from DB so the new user
  // message is chained correctly instead of creating a second root.
  let resolvedParentMessageId: string | null = explicitParentMessageId ?? null;
  if (!resolvedParentMessageId && threadId && operation === "send") {
    const existingMessages = await fetchThreadMessages(
      threadId,
      user,
      rootFolderId,
    );
    if (existingMessages.length > 0) {
      // Find the leaf: the message with no child
      const childSet = new Set(
        existingMessages.flatMap((m) => (m.parentId ? [m.parentId] : [])),
      );
      const leaf = existingMessages.find((m) => !childSet.has(m.id));
      resolvedParentMessageId = leaf?.id ?? null;
    }
  }

  const postResult = await sendTestRequest({
    endpoint: streamDef.POST,
    user,
    streamContext,
    data: {
      operation,
      rootFolderId,
      subFolderId: subFolderId ?? null,
      threadId: threadId ?? crypto.randomUUID(),
      userMessageId,
      parentMessageId: resolvedParentMessageId,
      content: prompt,
      role: ChatMessageRole.USER,
      model,
      skill: effectiveSkill,
      favoriteConfig,
      toolConfirmations: toolConfirmations ?? null,
      messageHistory: [],
      attachments: attachments && attachments.length > 0 ? attachments : null,
      audioInput: { file: audioInput ?? null },
      voiceMode: { enabled: false },
      resumeToken: null,
      timezone,
      executionContext: { mode: "local" as const },
    },
  });

  if (!postResult.success) {
    return { result: postResult, messages: [], pinnedToolCount: 0 };
  }

  const responseThreadId =
    typeof postResult.data?.["responseThreadId"] === "string"
      ? postResult.data["responseThreadId"]
      : (threadId ?? "");

  // ── Incognito: nothing persisted; the POST response is the whole story ──
  if (isIncognito || !responseThreadId) {
    return {
      result: {
        success: true,
        data: {
          threadId: isIncognito ? undefined : responseThreadId,
          lastAiMessageId:
            typeof postResult.data?.["messageId"] === "string"
              ? postResult.data["messageId"]
              : "",
          lastAiMessageContent: null,
          lastGeneratedMediaUrl: null,
          totalCreditsDeducted: 0,
          pinnedToolCount: 0,
        },
      },
      messages: [],
      pinnedToolCount: 0,
    };
  }

  // ── Wait for the stream to SETTLE (streamingState → 'idle' or 'waiting') ──
  // 'idle' = the turn finished. 'waiting' = the turn paused for async work
  // (detach/wakeUp/queue WAIT) — that is a legitimate settled state the caller's
  // wrapper (runStream) then drives to completion via revival. The real client
  // is fire-and-forget too; it never blocks for idle on a paused thread.
  const messages = await waitForThreadSettled(
    responseThreadId,
    user,
    settleTimeoutMs ?? 120_000,
    rootFolderId,
  );

  // ── Reconstruct the result by walking THIS turn's branch (no timestamps) ──
  // Branches can be created at any time so createdAt comparisons are wrong.
  // Instead: the POST response returned the first message ID this turn created
  // (postResult.data.messageId). Walk DOWN from the anchor using child links,
  // and at any branch point pick the child whose subtree contains that first
  // new message ID — that child is always on THIS turn's branch.
  const byId = new Map(messages.map((m) => [m.id, m]));
  const childrenOf = new Map<string, SlimMessage[]>();
  for (const m of messages) {
    if (m.parentId) {
      const list = childrenOf.get(m.parentId) ?? [];
      list.push(m);
      childrenOf.set(m.parentId, list);
    }
  }
  // The first new message ID this turn created — our branch marker.
  const firstNewMessageId =
    typeof postResult.data?.["messageId"] === "string"
      ? postResult.data["messageId"]
      : null;

  // Build ancestor set: walk UP from firstNewMessageId. Every node on the path
  // from the anchor to firstNewMessageId is reachable — used to pick the right
  // child at any branch point without timestamps.
  const reachable = new Set<string>();
  if (firstNewMessageId) {
    let cur: SlimMessage | undefined = byId.get(firstNewMessageId);
    while (cur) {
      reachable.add(cur.id);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
  }

  // For confirmation turns (userMessageId=null, no explicit parent), postResult
  // returns messageId=aiMessageId — the first message this turn created.
  // Use it as the anchor so chain-walk can still find the correct leaf.
  const anchorId =
    userMessageId ?? explicitParentMessageId ?? firstNewMessageId ?? null;
  // Walk DOWN from anchor to the leaf of this turn's branch.
  let leaf: SlimMessage | undefined = anchorId ? byId.get(anchorId) : undefined;
  if (anchorId) {
    const visited = new Set<string>();
    let cursor = leaf;
    while (cursor) {
      const kids: SlimMessage[] = (childrenOf.get(cursor.id) ?? []).filter(
        (k) => !visited.has(k.id),
      );
      if (kids.length === 0) {
        break;
      }
      visited.add(cursor.id);
      // At a branch point, pick the child on THIS turn's branch (reachable set).
      // If none match (no firstNewMessageId, or walk past it), use kids[0].
      const branchChild = kids.find((k) => reachable.has(k.id));
      const next: SlimMessage = branchChild ?? kids[0]!;
      cursor = next;
      leaf = next;
    }
  }
  // The answer content/media come from the last ASSISTANT on the walked chain.
  // Walk the chain from the leaf up to find the nearest ASSISTANT.
  let answerAi: SlimMessage | undefined;
  {
    let cursor: SlimMessage | undefined = leaf;
    while (cursor) {
      if (cursor.role === ChatMessageRole.ASSISTANT) {
        answerAi = cursor;
        break;
      }
      cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined;
    }
  }
  // Derive lastGeneratedMediaUrl: check assistant generatedMedia first (tool-call path),
  // then look for a synthetic tool message in this turn's branch whose result has a
  // "file" property (native image/video/audio gen path — emitSyntheticToolMessage
  // does NOT set metadata.generatedMedia, only metadata.toolCall.result.file).
  let lastGeneratedMediaUrl: string | null =
    answerAi?.generatedMedia?.[0]?.url ?? null;
  if (!lastGeneratedMediaUrl && anchorId) {
    // Walk the branch from anchor to leaf collecting tool messages.
    let cursor: SlimMessage | undefined = byId.get(anchorId);
    const visited = new Set<string>();
    while (cursor) {
      if (cursor.role === ChatMessageRole.TOOL) {
        const res = toolResultRecord(cursor.toolCall?.result);
        if (res && typeof res["file"] === "string" && res["file"]) {
          lastGeneratedMediaUrl = res["file"];
        }
      }
      visited.add(cursor.id);
      const kids = (childrenOf.get(cursor.id) ?? []).filter(
        (k) => !visited.has(k.id),
      );
      const branchKid = kids.find((k) => reachable.has(k.id)) ?? kids[0];
      cursor = branchKid;
    }
  }
  // Only count credits for messages created in THIS turn. `messages` contains all
  // thread messages; summing everything double-counts prior turns' costs.
  // Walk the subtree rooted at firstNewMessageId to collect this-turn message IDs.
  const thisTurnIds = new Set<string>();
  if (firstNewMessageId) {
    // If compacting fired, it inserted a compacting-assistant node as the parent of
    // firstNewMessageId. Include it too so its credit cost is counted.
    const firstNewMsg = byId.get(firstNewMessageId);
    if (firstNewMsg?.parentId) {
      const parent = byId.get(firstNewMsg.parentId);
      if (parent?.isCompacting) {
        thisTurnIds.add(parent.id);
      }
    }
    const queue: string[] = [firstNewMessageId];
    while (queue.length > 0) {
      const id = queue.shift()!;
      thisTurnIds.add(id);
      for (const child of childrenOf.get(id) ?? []) {
        if (!thisTurnIds.has(child.id)) {
          queue.push(child.id);
        }
      }
    }
  }
  const thisTurnMessages =
    thisTurnIds.size > 0
      ? messages.filter((m) => thisTurnIds.has(m.id))
      : messages;
  const totalCreditsDeducted = thisTurnMessages.reduce(
    (sum, m) => sum + (m.creditCost ?? 0),
    0,
  );

  return {
    result: {
      success: true,
      data: {
        threadId: responseThreadId,
        // Anchor for the next turn = this turn's true leaf (chain-walked).
        lastAiMessageId: leaf?.id ?? answerAi?.id ?? "",
        lastAiMessageContent: answerAi?.content ?? null,
        lastGeneratedMediaUrl,
        totalCreditsDeducted,
        pinnedToolCount: 0,
      },
    },
    messages,
    pinnedToolCount: 0,
  };
}
