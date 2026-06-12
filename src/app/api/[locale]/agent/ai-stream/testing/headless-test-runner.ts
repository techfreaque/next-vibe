/**
 * Headless Test Runner
 * Thin wrapper around runHeadlessAiStream for integration tests.
 * Provides sensible test defaults so individual tests stay concise.
 */

import "server-only";

import type {
  HeadlessAiStreamResult,
  HeadlessPreCall,
} from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { runHeadlessAiStream } from "@/app/api/[locale]/agent/ai-stream/repository/headless";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { FavoriteConfig } from "@/app/api/[locale]/agent/chat/favorites/db";
import type {
  ChatMessage,
  MessageMetadata,
} from "@/app/api/[locale]/agent/chat/db";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { ApiProvider } from "@/app/api/[locale]/agent/models/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { RouteExecuteRepository } from "@/app/api/[locale]/system/unified-interface/execute-tool/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";
import { scopedTranslation } from "../stream/i18n";

/**
 * Resolve a test user by email+password using endpoints only.
 * Runs the login like a web request: a real lead exists before the call.
 */
export async function resolveUser(
  email: string,
  password: string = env.VIBE_ADMIN_USER_PASSWORD,
): Promise<JwtPrivatePayloadType | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const loginDef =
    await import("@/app/api/[locale]/user/public/login/definition");
  // The login's public caller needs a REAL lead row — fabricated ids produce
  // lead-conversion warnings on every login. One marker lead is reused.
  const { db: dbConn } = await import("@/app/api/[locale]/system/db");
  const { leads } = await import("@/app/api/[locale]/leads/db");
  const { LeadStatus, LeadSource } =
    await import("@/app/api/[locale]/leads/enum");
  const { eq: eqLead } = await import("drizzle-orm");
  const TEST_LEAD_EMAIL = "test-runner@local.invalid";
  let [testLead] = await dbConn
    .select({ id: leads.id })
    .from(leads)
    .where(eqLead(leads.email, TEST_LEAD_EMAIL))
    .limit(1);
  if (!testLead) {
    [testLead] = await dbConn
      .insert(leads)
      .values({
        email: TEST_LEAD_EMAIL,
        businessName: "",
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        country: "US",
        language: "en",
      })
      .returning({ id: leads.id });
  }
  const publicUser: JwtPayloadType = {
    isPublic: true,
    leadId: testLead!.id,
    roles: [],
  };
  const loginResult = await RouteExecuteRepository.runInProcessTyped({
    definition: loginDef.default.POST,
    input: { email, password, rememberMe: false },
    user: publicUser,
    locale: defaultLocale,
    platform: Platform.NEXT_API,
    logger,
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
  return verifyResult.data;
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
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);

  const listDef =
    await import("@/app/api/[locale]/agent/chat/folders/[rootFolderId]/definition");
  const listResult = await RouteExecuteRepository.runInProcessTyped({
    definition: listDef.default.GET,
    input: undefined,
    urlPathParams: { rootFolderId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
    logger,
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

  const createDef =
    await import("@/app/api/[locale]/agent/chat/folders/[rootFolderId]/create/definition");
  const createResult = await RouteExecuteRepository.runInProcessTyped({
    definition: createDef.default.POST,
    input: { name, parentId: parentId ?? undefined },
    urlPathParams: { rootFolderId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
    logger,
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
  threadId?: string;
  skill?: string;
  /**
   * Root folder override. Defaults to DefaultFolderId.BACKGROUND.
   * Use DefaultFolderId.REMOTE + subFolderId to test remote-folder routing and thread mirroring.
   */
  rootFolderId?: DefaultFolderId;
  /**
   * Subfolder UUID. Required when rootFolderId is REMOTE so the thread is
   * placed in the instance subfolder and routing rules can match it.
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
   * Use a pre-created favorite to load model + skill.
   * Takes precedence over skill field when provided.
   */
  favoriteId?: string;
  /**
   * Pre-fetched tool call results to inject before the AI runs.
   * Appears in the thread DB as tool messages the AI can reason about.
   */
  preCalls?: HeadlessPreCall[];
  /**
   * When true, use wakeup-resume operation (no CONTINUE prompt).
   * Used to simulate revival after a wakeUp-mode deferred tool completes.
   */
  wakeUpRevival?: boolean;
  /**
   * Override resolved media gen models for this test.
   * Bypasses the user-settings cascade so tests run a specific provider.
   */
  mediaModelOverrides?: {
    imageGenModelSelection?: ImageGenModelSelection;
    musicGenModelSelection?: MusicGenModelSelection;
    videoGenModelSelection?: VideoGenModelSelection;
  };
  /** Favorite config override for the headless stream */
  favoriteConfig?: FavoriteConfig | null;
  /**
   * Force all model resolution (chat + image/music/video gen) to a specific API provider.
   * Used by UNBOTTLED self-relay tests to route all inference through the UNBOTTLED provider.
   */
  providerOverride?: ApiProvider;
  /** Abort signal to cancel the stream. Defaults to a never-aborting signal. */
  abortSignal?: AbortSignal;
  /**
   * Override available tools with custom requiresConfirmation settings.
   * Used in integration tests to configure confirmation gates for specific tools.
   */
  availableTools?: Array<{
    toolId: string;
    requiresConfirmation: boolean;
  }> | null;
  /**
   * Override the effective compact trigger token threshold.
   * Pass Number.MAX_SAFE_INTEGER to disable compacting entirely.
   * Used in integration tests to prevent compacting from consuming fixture slots.
   */
  compactTriggerOverride?: number;
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
): Promise<SlimMessage[]> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const msgsDef =
    await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition");
  const result = await RouteExecuteRepository.runInProcessTyped({
    definition: msgsDef.default.GET,
    input: { rootFolderId: DefaultFolderId.BACKGROUND },
    urlPathParams: { threadId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
    logger,
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
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const msgsDef =
    await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition");
  const result = await RouteExecuteRepository.runInProcessTyped({
    definition: msgsDef.default.GET,
    input: { rootFolderId: DefaultFolderId.BACKGROUND },
    urlPathParams: { threadId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
    logger,
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
): Promise<SlimMessage[]> {
  const pollIntervalMs = 500;
  const start = Date.now();
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const msgsDef =
    await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/definition");
  while (Date.now() - start < maxWaitMs) {
    const result = await RouteExecuteRepository.runInProcessTyped({
      definition: msgsDef.default.GET,
      input: { rootFolderId: DefaultFolderId.BACKGROUND },
      urlPathParams: { threadId },
      user,
      locale: defaultLocale,
      platform: Platform.AI,
      logger,
    });
    if (result.success && result.data?.["streamingState"] === "idle") {
      return fetchThreadMessages(threadId, user);
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

/** Fetch the thread title via endpoint */
export async function fetchThreadTitle(
  threadId: string,
  user: JwtPayloadType,
): Promise<string | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const threadDef =
    await import("@/app/api/[locale]/agent/chat/threads/[threadId]/definition");
  const result = await RouteExecuteRepository.runInProcessTyped({
    definition: threadDef.default.GET,
    input: { rootFolderId: DefaultFolderId.BACKGROUND },
    urlPathParams: { threadId },
    user,
    locale: defaultLocale,
    platform: Platform.AI,
    logger,
  });
  if (!result.success) {
    return null;
  }
  const title = result.data?.["title"];
  return typeof title === "string" ? title : null;
}

export async function runTestStream(
  params: TestStreamParams,
): Promise<TestStreamResult> {
  const {
    prompt,
    user,
    threadId,
    skill,
    rootFolderId: rootFolderIdOverride,
    subFolderId,
    explicitParentMessageId,
    attachments,
    audioInput,
    favoriteId,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    providerOverride,
    favoriteConfig: paramFavoriteConfig,
    operationOverride: callerOperationOverride,
    abortSignal = new AbortController().signal,
    availableTools,
    compactTriggerOverride,
  } = params;

  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const { t } = scopedTranslation.scopedT(defaultLocale);

  // Resolve effective operationOverride:
  // - wakeUpRevival takes precedence (needs wakeup-resume, handled in headless.ts)
  // - caller-provided override (retry/edit) is used as-is when wakeUpRevival is false
  // - fallback: "send" for append turns (threadId present), undefined for new threads
  const resolvedOperationOverride = wakeUpRevival
    ? undefined // headless.ts resolves to wakeup-resume automatically
    : callerOperationOverride
      ? callerOperationOverride
      : threadId
        ? "send"
        : undefined;

  const result = await runHeadlessAiStream({
    prompt,
    favoriteId,
    skill: skill ?? (favoriteId ? undefined : NO_SKILL_ID),
    threadId,
    operationOverride: resolvedOperationOverride,
    rootFolderId: rootFolderIdOverride ?? DefaultFolderId.BACKGROUND,
    subFolderId,
    subAgentDepth: 0,
    user,
    locale: defaultLocale,
    logger,
    t,
    explicitParentMessageId,
    attachments,
    audioInput,
    preCalls,
    wakeUpRevival,
    mediaModelOverrides,
    providerOverride,
    favoriteConfig: paramFavoriteConfig ?? null,
    abortSignal,
    availableTools: availableTools ?? null,
    compactTriggerOverride,
  });

  let messages: SlimMessage[] = [];

  if (result.success && result.data.threadId) {
    messages = await fetchThreadMessages(result.data.threadId, user);
  }

  return {
    result,
    messages,
    pinnedToolCount: result.success ? result.data.pinnedToolCount : 0,
  };
}
