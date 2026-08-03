/**
 * Relay CALLER — runRelayBranch: resolves the loop target from the thread's
 * loop column (folder-stamped at creation), forwards the turn to the target
 * instance, writes the caller-side rows, and returns the receiver's turn
 * summary verbatim (push-push: the mirror converges from pushed events).
 */
import "server-only";

import { type JSONSchema7 } from "ai";
import { and, asc, eq, isNull } from "drizzle-orm";
import { getPreferredToolName } from "next-vibe/core/core-utils/path";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { RouteExecuteRepository } from "next-vibe/execute-tool/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { filterUserPermissionRoles } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";
import { remoteConnections } from "next-vibe/remote-connection/db";
import { z } from "zod";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { DefaultFolderId } from "../../../../core/execution-context";
import { getDefaultToolIdsForUser } from "../../../chat/constants";
import {
  CHAT_MESSAGE_COLUMNS,
  chatMessages,
  chatThreads,
} from "../../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../../chat/enum";
import { ApiProvider } from "../../../models/models";
import { getChatModelById } from "../../models";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";
import { buildSystemPrompt } from "../../system-prompt/builder";
import { createUserMessageWithAttachments } from "../intake/messages";
import type { HeadlessAiStreamResult } from "../setup/setup";

async function buildRelayToolSchemas(
  pinnedToolIds: ReadonlyArray<string>,
  user: JwtPayloadType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<
  Array<{ name: string; description: string; parameters: JSONSchema7 }>
> {
  const permissionRoles = filterUserPermissionRoles(user.roles);
  const results: Array<{
    name: string;
    description: string;
    parameters: JSONSchema7;
  }> = [];

  await Promise.all(
    pinnedToolIds.map(async (toolId) => {
      try {
        const endpoint = await getEndpoint(toolId);
        if (!endpoint) {
          return;
        }

        const { t } = endpoint.scopedTranslation.scopedT(locale);
        const description = t(endpoint.description ?? endpoint.title);
        const name = getPreferredToolName(endpoint);

        const { generateInputSchema } =
          await import("next-vibe/platforms/ai/tools-loader");
        const zodSchema = generateInputSchema(endpoint, permissionRoles);
        const parameters: JSONSchema7 = (
          zodSchema instanceof z.ZodObject
            ? z.toJSONSchema(zodSchema, {
                target: "draft-7",
                io: "input",
                unrepresentable: "any",
                override: (ctx) => {
                  if (ctx.zodSchema._zod.def.type === "custom") {
                    ctx.jsonSchema.type = "object";
                  }
                },
              })
            : {}
        ) as JSONSchema7;

        results.push({ name, description, parameters });
      } catch {
        logger.debug("[Relay] Failed to serialize tool schema — skipping", {
          toolId,
        });
      }
    }),
  );

  return results;
}

export interface RelayBranchParams {
  data: AiStreamPostRequestOutput;
  locale: CountryLanguage;
  logger: EndpointLogger;
  user: JwtPayloadType;
  userId: string | undefined;
  leadId: string;
  ipAddress: string | undefined;
  headless: boolean;
  aiStreamT: AiStreamT;
  subAgentDepth: number;
}

/**
 * Attempts to relay the stream to a remote instance.
 * Returns a ResponseType result if the stream was relayed, or null if no remote
 * target was found and the caller should proceed with local execution.
 */
export async function runRelayBranch(
  params: RelayBranchParams,
): Promise<
  | ResponseType<AiStreamPostResponseOutput>
  | ResponseType<HeadlessAiStreamResult>
  | null
> {
  const {
    data,
    locale,
    logger,
    user,
    userId,
    leadId,
    ipAddress,
    headless,
    aiStreamT,
    subAgentDepth,
  } = params;
  // The relay branch runs before the rich stream context exists. Bind the
  // relayed turn's prompt build to the thread by id — the fixtures table
  // (keyed by threadId) anchors record/replay for any external call.
  const { makeHeadlessContext } =
    await import("../../../../core/execution-context");
  const toolExecutionContext = makeHeadlessContext(
    undefined,
    data.threadId,
    data.timezone,
  );

  if (!userId) {
    return null;
  }

  const hasToolConfirmations =
    Array.isArray(data.toolConfirmations) && data.toolConfirmations.length > 0;
  const { ExecuteToolRouting } =
    await import("next-vibe/remote-connection/routing");
  const streamDefinition = (await import("../../stream/definition")).default;

  // Loop location: the thread's persisted column > a ONE-TIME stamp from
  // placement when the thread is being created inside REMOTE/<instance>.
  // The stamp consults the connection's loopLocation setting ('caller' keeps
  // the column NULL → the loop stays here; tools still round-trip). After
  // creation the column rules — placement never routes again.
  let effectiveLoopInstanceId: string | null = null;
  let threadExists = false;
  let threadIsForeignCopy = false;
  if (data.threadId) {
    const [threadRow] = await db
      .select({
        loopInstanceId: chatThreads.loopInstanceId,
        originInstanceId: chatThreads.originInstanceId,
      })
      .from(chatThreads)
      .where(eq(chatThreads.id, data.threadId))
      .limit(1);
    threadExists = Boolean(threadRow);
    threadIsForeignCopy = Boolean(threadRow?.originInstanceId);
    if (!effectiveLoopInstanceId) {
      // Existing thread: its column is authoritative (may be null = local).
      effectiveLoopInstanceId = threadRow?.loopInstanceId ?? null;
    }
  }
  // A FOREIGN copy (executor landing / sync mirror) NEVER relays: the loop
  // runs exactly here by definition. Without this, a wakeUp REVIVAL on the
  // executor once derived a loop target from its own mirror folder and
  // relayed itself BACK to the caller, corrupting both sides.
  if (threadIsForeignCopy) {
    return null;
  }
  // Creation-time Remote-tab sugar applies to BRAND-NEW threads only — an
  // existing thread's NULL column means "runs locally", never re-derive.
  if (
    effectiveLoopInstanceId === null &&
    !threadExists &&
    data.rootFolderId === DefaultFolderId.REMOTE &&
    data.subFolderId
  ) {
    const { ThreadsRepository: ThreadsRepoForDerive } =
      await import("../../../chat/threads/repository");
    // userId matters: the connection's loopLocation setting ('caller' pins the
    // loop here) is part of the derivation, not just the folder name.
    effectiveLoopInstanceId =
      await ThreadsRepoForDerive.deriveLoopInstanceFromFolder(
        data.subFolderId,
        userId,
      );
  }

  let remoteTarget = await ExecuteToolRouting.resolveTarget({
    userId,
    loopInstanceId: effectiveLoopInstanceId ?? undefined,
    modelProvider: data.model
      ? getChatModelById(data.model)?.apiProvider
      : undefined,
    locale,
    logger,
  });

  // True when the target came from the stream/thread's LOOP LOCATION (the
  // thread is a first-class relay: receiver persists a mirror copy). False
  // for the inference-provider fallback (receiver runs incognito).
  const viaLoopRouting = remoteTarget !== null;

  const isIncognito = data.rootFolderId === DefaultFolderId.INCOGNITO;
  const modelIsUnbottled = data.model
    ? getChatModelById(data.model)?.apiProvider === ApiProvider.UNBOTTLED
    : false;

  if (!remoteTarget && (modelIsUnbottled || !isIncognito)) {
    const inferenceTarget = await ExecuteToolRouting.resolveInferenceProvider({
      userId,
      modelProvider: data.model
        ? getChatModelById(data.model)?.apiProvider
        : undefined,
      logger,
    });
    if (inferenceTarget) {
      remoteTarget = modelIsUnbottled
        ? { ...inferenceTarget, useRemoteContext: true }
        : inferenceTarget;
    }
  }

  if (!remoteTarget) {
    return null;
  }

  const relayModelInfo = data.model ? getChatModelById(data.model) : undefined;
  // Cost of THIS originator's markup, captured from validation and deducted after a
  // successful inference-provider relay (see below). null when there is no model.
  let originatorModelCost: number | null = null;
  if (relayModelInfo) {
    const { CreditValidatorHandler } =
      await import("../core/credit-validator-handler");
    const relayCreditCheck = await CreditValidatorHandler.validateCredits({
      user,
      ipAddress,
      modelInfo: relayModelInfo,
      locale,
      logger,
      t: aiStreamT,
    });
    if (!relayCreditCheck.success) {
      return relayCreditCheck;
    }
    originatorModelCost = relayCreditCheck.data.modelCost;
  }

  const localThreadId = data.threadId ?? crypto.randomUUID();
  // The CONNECTION's thread mirroring policy governs whether the executor
  // persists a landing copy and whether thread events cross. Incognito is
  // always transient regardless of the connection setting.
  const [mirrorRow] = userId
    ? await db
        .select({ threadMirrorMode: remoteConnections.threadMirrorMode })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.instanceId, remoteTarget.instanceId),
          ),
        )
        .limit(1)
    : [];
  const threadMirrorMode: "both" | "off" = isIncognito
    ? "off"
    : (mirrorRow?.threadMirrorMode ?? "both");

  // REMOTE-FOLDER relay: the thread behaves AS IF used on the remote — the
  // EXECUTOR owns system prompt, tool catalog and identity (self-instance-id
  // reports the executor). The caller ships prompt+tools ONLY for
  // inference-provider mode (a pure model pipe acting with the CALLER's
  // identity and the caller's tool belt).
  const isRemoteFolderRelay = viaLoopRouting && threadMirrorMode === "both";
  const shipClientPromptAndTools = !isRemoteFolderRelay;
  let relaySystemPrompt: string | undefined;
  let relayToolSchemas:
    | Array<{ name: string; description: string; parameters: JSONSchema7 }>
    | undefined;
  if (shipClientPromptAndTools) {
    const [promptResult, toolSchemas] = await Promise.all([
      buildSystemPrompt({
        toolExecutionContext,
        skillId: data.skill ?? null,
        user,
        logger,
        locale,
        rootFolderId: data.rootFolderId,
        subFolderId: data.subFolderId ?? null,
        callMode: data.voiceMode?.enabled ?? null,
        headless: headless ?? false,
        subAgentDepth,
        threadId: localThreadId,
      }),
      buildRelayToolSchemas(
        ((): string[] => {
          // The favorite's PINNED tools are the catalog for the remote loop
          // (remote-folder mode: the loop runs on the remote with these
          // tools; the tools themselves execute back on the caller). The
          // availableTools whitelist and deniedTools only FILTER the set —
          // the caller-side permission gate (guards.ts) enforces them at
          // execution, and advertising a tool that gate will block sends the
          // relayed model into 403 retry loops.
          const denied = new Set(
            (data.favoriteConfig?.deniedTools ?? []).map((t) => t.toolId),
          );
          const whitelist = data.favoriteConfig?.availableTools;
          const whitelistIds =
            whitelist !== null && whitelist !== undefined
              ? new Set(whitelist.map((t) => t.toolId))
              : null;
          const base =
            data.favoriteConfig?.pinnedTools !== null &&
            data.favoriteConfig?.pinnedTools !== undefined
              ? data.favoriteConfig.pinnedTools.map((t) => t.toolId)
              : [...getDefaultToolIdsForUser(user)];
          return base.filter(
            (id) =>
              !denied.has(id) &&
              (whitelistIds === null || whitelistIds.has(id)),
          );
        })(),
        user,
        locale,
        logger,
      ),
    ]);
    relaySystemPrompt = promptResult.systemPrompt;
    relayToolSchemas = toolSchemas.length > 0 ? toolSchemas : undefined;
  }

  const relayConfirmationOverrides:
    | Array<{ toolId: string; requiresConfirmation: boolean }>
    | undefined = (() => {
    const fromConfig = [
      ...(data.favoriteConfig?.availableTools ?? []),
      ...(data.favoriteConfig?.pinnedTools ?? []),
    ].filter((t) => t.requiresConfirmation);

    return fromConfig.length > 0 ? fromConfig : undefined;
  })();

  const providerPersistsThread = threadMirrorMode === "both";
  const historyRows =
    data.threadId && !providerPersistsThread
      ? await db
          .select(CHAT_MESSAGE_COLUMNS)
          .from(chatMessages)
          .where(eq(chatMessages.threadId, data.threadId))
          .orderBy(asc(chatMessages.createdAt))
      : [];
  const relayMessageHistory = historyRows.length > 0 ? historyRows : [];
  const relayToolConfirmations = hasToolConfirmations
    ? (data.toolConfirmations ?? undefined)
    : undefined;
  // Attachments cross the wire as the base64 shape the stream schema already
  // accepts ("from remote relay POST bodies") — raw File objects would
  // JSON-serialize to {} and fail the peer's validation.
  const relayAttachments =
    data.attachments && data.attachments.length > 0
      ? await Promise.all(
          data.attachments.map(async (f) => ({
            filename: f.name,
            mimeType: f.type,
            data: Buffer.from(await f.arrayBuffer()).toString("base64"),
          })),
        )
      : undefined;

  const skipLocalWrites = threadMirrorMode === "off";
  const localUserMessageId = data.userMessageId ?? crypto.randomUUID();
  if (!skipLocalWrites) {
    // Localized default title (same as any new chat) — the MODEL renames it
    // per-turn via the rename-thread fragment. "Remote Stream" was a hardcoded
    // placeholder that leaked to the UI and broke the new-chat naming.
    const { scopedTranslation: chatScopedTranslation } =
      await import("../../../chat/i18n");
    const defaultTitle = chatScopedTranslation
      .scopedT(locale)
      .t("common.newChat");
    // NB: originInstanceId stays NULL on the CALLER — a non-null origin marks a
    // MIRROR (the relay guard above returns early for those). This IS the origin
    // (source) copy; the receiver stamps its own origin on the landing.
    await db
      .insert(chatThreads)
      .values({
        id: localThreadId,
        userId: userId ?? null,
        leadId: userId ? null : leadId,
        title: defaultTitle,
        rootFolderId: data.rootFolderId,
        folderId: data.subFolderId ?? null,
        // The loop runs on the resolved instance — persist that on the thread
        // so follow-up turns route by COLUMN, never by placement.
        loopInstanceId: viaLoopRouting ? remoteTarget.instanceId : null,
        streamingState: ThreadStreamingState.STREAMING,
      })
      .onConflictDoNothing();
    if (viaLoopRouting) {
      // The thread may pre-exist (created by an earlier local turn) — stamp
      // the routing decision onto it as well.
      await db
        .update(chatThreads)
        .set({ loopInstanceId: remoteTarget.instanceId })
        .where(
          and(
            eq(chatThreads.id, localThreadId),
            isNull(chatThreads.loopInstanceId),
          ),
        )
        .catch(() => undefined);
    }
    // STT turns (audioInput.file): the EXECUTOR transcribes and its user
    // message carries the transcription as content — the caller cannot know
    // it pre-relay. Skip the local write; the receiver's pushed user
    // message-created event lands the transcribed row here (same id).
    if (!data.audioInput?.file) {
      await createUserMessageWithAttachments({
        userMessageId: localUserMessageId,
        operation: data.operation,
        hasToolConfirmations,
        isIncognito: false,
        threadId: localThreadId,
        rootFolderId: data.rootFolderId,
        effectiveRole: ChatMessageRole.USER,
        effectiveContent: data.content,
        effectiveParentMessageId: data.parentMessageId ?? null,
        userId,
        user,
        attachments: data.attachments ?? undefined,
        logger,
        t: aiStreamT,
      });
    }
  }

  // Build the execution context. Two relay shapes:
  //   - LOOP-ROUTED relay (loopInstanceId, mirror='both'): send mode='relay' —
  //     the receiver PERSISTS its copy at REMOTE/<originator>/<folderPath>
  //     (the caller's folder-name chain below its root; for a caller thread
  //     living under REMOTE/<instance> the instance segment is dropped).
  //   - UNBOTTLED / inference-provider: send mode='inference-provider' — the
  //     receiver runs incognito (no DB thread), events post back to the caller.
  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");
  const selfInstanceId = userId
    ? await RemoteConnectionRepository.getLocalInstanceId(userId)
    : null;
  // Identity is NEVER on the wire: the receiver resolves the caller from the
  // connection the request rode in on (token auth / bridge remoteUserId).
  // Placement is SAME-ID (folders sync as first-class items) — no chains.
  const relayExecutionContext = isRemoteFolderRelay
    ? {
        mode: "relay" as const,
        instanceId: selfInstanceId ?? "",
        threadMirrorMode,
        confirmationOverrides: relayConfirmationOverrides,
      }
    : {
        mode: "inference-provider" as const,
        instanceId: selfInstanceId ?? "",
        systemPrompt: relaySystemPrompt,
        tools: relayToolSchemas,
        confirmationOverrides: relayConfirmationOverrides,
      };

  // Materialize the caller's folder chain on the RECEIVER before the relay so
  // that when the receiver creates the mirror thread with `subFolderId`, the
  // SAME-ID folder already exists and the copy lands in its proper subtree
  // (REMOTE/<caller>/private/tests/<case>) instead of falling to the REMOTE
  // root. The chain push is idempotent (same-id upserts) and targets exactly
  // the relay peer. Best-effort; the post-relay pushThreadSync + pull-sync also
  // converge, but doing it up-front removes the create-time placement race.
  if (!user.isPublic && data.subFolderId) {
    const { pushFolderChainToPeer } =
      await import("../../../chat/threads/sync-provider");
    await pushFolderChainToPeer(
      data.subFolderId,
      user.id,
      remoteTarget.instanceId,
      logger,
    ).catch(() => {
      // Best-effort: the post-relay pushThreadSync heals placement.
    });
  }

  const relayResult = await RouteExecuteRepository.runInProcessTyped({
    definition: streamDefinition.POST,
    instanceId: remoteTarget.instanceId,
    user,
    locale,
    logger,
    platform: Platform.AI,
    input: {
      operation: data.operation,
      role: data.role,
      voiceMode: data.voiceMode,
      audioInput: data.audioInput,
      content: data.content,
      model: data.model,
      skill: data.skill,
      // inference-provider: the caller's favorite drives media-model
      // resolution. REMOTE-FOLDER relay: the executor resolves its OWN
      // skill/favorite — remote prompt, remote tools, remote identity.
      favoriteConfig: isRemoteFolderRelay ? null : data.favoriteConfig,
      timezone: data.timezone,
      threadId: localThreadId,
      userMessageId: localUserMessageId,
      parentMessageId: data.parentMessageId ?? undefined,
      // The caller's REAL root rides the wire for transparency; the receiver
      // decides its own landing (REMOTE/<caller>/<folderPath>) regardless.
      rootFolderId: data.rootFolderId,
      // The caller's subfolder MUST ride the wire too — SAME-ID placement on the
      // receiver (receiver.ts) reads data.subFolderId to land the copy under
      // REMOTE/<originator>/<that folder>. Omitting it dropped the subfolder, so
      // a thread created under REMOTE/<instance>/private landed at REMOTE root.
      subFolderId: data.subFolderId ?? null,
      toolConfirmations: relayToolConfirmations,
      attachments: relayAttachments,
      messageHistory: relayMessageHistory,
      executionContext: relayExecutionContext,
    },
  });

  if (!relayResult.success) {
    return relayResult;
  }

  // Billing model, by relay shape:
  //  - inference-provider: this originator is BUYING inference from the provider. It
  //    runs the outer chat experience and charges ITS markup here; the provider
  //    charged its own markup while running the loop → billed on both sides (a chain
  //    of N ws-providers each bills its hop). Deduct the originator's markup now that
  //    the relayed turn succeeded.
  //  - remote-folder relay: the thread belongs to the receiver and the loop runs
  //    there — only that instance bills. The originator does NOT deduct.
  if (!isRemoteFolderRelay && originatorModelCost && originatorModelCost > 0) {
    const { CreditRepository } = await import("@/credits/repository");
    const { scopedTranslation: creditsScopedT } =
      await import("@/credits/i18n");
    const { t: creditsT } = creditsScopedT.scopedT(locale);
    await CreditRepository.deductCreditsForModelUsage(
      user,
      originatorModelCost,
      data.model,
      logger,
      creditsT,
      locale,
    ).catch((err: Error) => {
      logger.error("[Relay] originator inference-provider deduction failed", {
        error: err.message,
      });
    });
  }

  // The relay dispatch (callToolDirect to the remote ai-stream) is synchronous —
  // returning here means the REMOTE loop has FINISHED. Reconcile the LOCAL mirror
  // (set to 'streaming' at relay start) back to idle/waiting now. The relayed
  // stream-finished event would do this too, but only if the cross-instance event
  // makes it back; doing it here is the authoritative, race-free reconcile that
  // every observer (the real client polling the mirror, and the test's
  // waitForThreadSettled) relies on. clearStreamingState re-evaluates any
  // genuinely-pending local work, so it returns 'waiting' only when appropriate.
  if (!skipLocalWrites) {
    const { clearStreamingState } = await import("../core/stream");
    await clearStreamingState(localThreadId, logger, user, undefined).catch(
      () => undefined,
    );
    // PUSH the caller's OWN placement to the receiver: the source thread lives
    // under REMOTE/<peer>/private/tests/<case> (folderId set) and the receiver
    // must land its mirror in the SAME-ID folder, not at the REMOTE root. The
    // ancestor folder chain rides pushThreadSync (idempotent same-id upserts) so
    // a folder created before this connection enabled threads-sync — or before
    // the peer ever saw it — is materialized now, ahead of the thread-updated
    // that references its folderId. Best-effort; the pull-sync also converges.
    if (!user.isPublic) {
      const { pushThreadSync } =
        await import("../../../chat/threads/sync-provider");
      // AWAITED (not fire-and-forget): the mirror's placement must be settled
      // before the caller reports the turn done — an observer that reads the
      // peer right after would otherwise see the mirror at the REMOTE root.
      await pushThreadSync(localThreadId, user.id, logger).catch(() => {
        // Best-effort: pull-sync also converges.
      });
    }
  }

  if (headless) {
    // PUSH-PUSH: the receiver's synchronous response IS the turn summary —
    // no local pull/poll. The local mirror converges from the receiver's
    // pushed events on its own clock.
    return {
      success: true,
      data: {
        threadId: localThreadId,
        lastAiMessageId: relayResult.data.messageId || localUserMessageId,
        lastAiMessageContent: relayResult.data.lastAiMessageContent ?? null,
        lastGeneratedMediaUrl: relayResult.data.lastGeneratedMediaUrl ?? null,
        totalCreditsDeducted: relayResult.data.totalCreditsDeducted ?? 0,
        pinnedToolCount: 0,
      },
    } satisfies ResponseType<HeadlessAiStreamResult>;
  }

  return success({
    success: true,
    messageId: relayResult.data.messageId,
    responseThreadId: localThreadId,
  }) satisfies ResponseType<AiStreamPostResponseOutput>;
}
