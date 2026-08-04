/**
 * Relay RECEIVER — runWsProviderStream: runs the relayed loop headless under
 * the connection owner. relay mode persists a landing copy (SAME-ID folder
 * placement) when the connection's threadMirrorMode allows; inference-provider
 * NEVER persists here regardless of settings.
 */
import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { ToolSet } from "ai";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";
import { remoteConnections } from "next-vibe/remote-connection/db";
import type { NextRequest } from "next-vibe/ui/lib/request";

import type { ToolExecutionContext } from "../../../../core/execution-context";
import { DefaultFolderId } from "../../../../core/execution-context";
import { chatFolders, chatThreads } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import { getChatModelById } from "../../models";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../../stream/definition";
import type { AiStreamT } from "../../stream/i18n";

/**
 * Rebuild the caller's sub-chain (leaf `subFolderId` and its content ancestors)
 * under THIS instance's OWN PRIVATE root, preserving the SAME folder ids.
 *
 * The executor ran the loop, so its copy is a first-class PRIVATE thread here —
 * not a REMOTE mirror. The caller ships the leaf folder id; that leaf + its
 * ancestors were pushed to this instance (as a REMOTE-rooted mirror scaffold) by
 * the relay caller's folder-chain push. We take those SAME ids, drop the
 * instance-tab and the `private`/`background` scaffold segments (they only exist
 * to nest a REMOTE mirror), and re-root the remaining content chain (e.g.
 * tests/<case>) directly under PRIVATE. Returns the leaf folder id (now PRIVATE)
 * for the thread to land in, or null if nothing resolved.
 */
async function materializeOwnPrivateChain(
  leafFolderId: string,
  userId: string,
): Promise<string | null> {
  // Walk the pushed chain leaf→root, collecting content rows (skip the reserved
  // scaffold names and the REMOTE instance-tab folder whose parent is null).
  const chain: Array<{ id: string; name: string }> = [];
  let currentId: string | null = leafFolderId;
  for (let depth = 0; depth < 32 && currentId; depth++) {
    const [row]: Array<{
      id: string;
      name: string;
      parentId: string | null;
      rootFolderId: string;
    }> = await db
      .select({
        id: chatFolders.id,
        name: chatFolders.name,
        parentId: chatFolders.parentId,
        rootFolderId: chatFolders.rootFolderId,
      })
      .from(chatFolders)
      .where(and(eq(chatFolders.id, currentId), eq(chatFolders.userId, userId)))
      .limit(1);
    if (!row) {
      break;
    }
    // Instance-tab boundary (REMOTE root, no parent) — stop, it's scaffold.
    if (row.rootFolderId === DefaultFolderId.REMOTE && row.parentId === null) {
      break;
    }
    // Reserved scaffold segments are receiver-local — never content.
    if (row.name !== "private" && row.name !== "background") {
      chain.unshift({ id: row.id, name: row.name });
    }
    currentId = row.parentId;
  }
  if (chain.length === 0) {
    return null;
  }
  // Re-root the content chain directly under PRIVATE, SAME ids, root→leaf.
  let parentId: string | null = null;
  let leafId: string | null = null;
  for (const seg of chain) {
    await db
      .insert(chatFolders)
      .values({
        id: seg.id,
        userId,
        rootFolderId: DefaultFolderId.PRIVATE,
        name: seg.name,
        parentId,
      })
      .onConflictDoUpdate({
        target: chatFolders.id,
        set: {
          rootFolderId: DefaultFolderId.PRIVATE,
          parentId,
          updatedAt: new Date(),
        },
      })
      .catch(() => undefined);
    parentId = seg.id;
    leafId = seg.id;
  }
  return leafId;
}

/**
 * WS-Provider stream branch — runs when the caller sends `instanceId` + `tools`.
 *
 * Extracted from ws-provider/stream/repository.ts (WsProviderStreamRepository.stream).
 * Called from the top of createAiStream() when the request is a remote relay.
 */

// ============================================================================
// WS-PROVIDER BRANCH
// ============================================================================

export async function runWsProviderStream(params: {
  data: AiStreamPostRequestOutput;
  /** The relay execution context, narrowed by the caller's mode check. */
  executionContext: Extract<
    AiStreamPostRequestOutput["executionContext"],
    { mode: "inference-provider" | "relay" }
  >;
  locale: CountryLanguage;
  logger: EndpointLogger;
  /** Provider's own auth user — the loop runs as the connection owner on this
   *  instance; the wire carries no caller identity. */
  user: JwtPayloadType;
  request?: NextRequest;
  t: AiStreamT;
}): Promise<ResponseType<AiStreamPostResponseOutput>> {
  const { data, executionContext, locale, logger, request, t } = params;
  try {
    // 1. Resolve threadId - use existing or generate new
    const threadId = data.threadId ?? crypto.randomUUID();

    const ctx = executionContext;
    const callerInstanceId = ctx.instanceId;
    // Prompt + tools ride the wire ONLY for inference-provider (a pure model
    // pipe with the caller's belt). Relay executors own their prompt/tools.
    const providerSystemPrompt =
      ctx.mode === "inference-provider" ? ctx.systemPrompt : undefined;
    const providerTools =
      ctx.mode === "inference-provider" ? ctx.tools : undefined;
    // relay mode persists the thread at the mirrored BACKGROUND location;
    // inference-provider stays incognito (no DB thread on this side).
    // Persist the landing ONLY when the connection's mirror policy allows —
    // inference-provider NEVER persists here regardless of any setting.
    const isRelayPersist =
      ctx.mode === "relay" && ctx.threadMirrorMode !== "off";
    // DB-ownership user. The persisted thread/messages + folder chain live on THIS
    // (provider) node, so they must be owned by a user that EXISTS here — the
    // provider's own auth user (params.user), NOT the foreign caller (whose userId
    // has no row in this node's users table → FK violation).
    const dbOwnerUser = params.user;

    // 2. Loop identity = the authenticated request user. Both legs already
    //    deliver the CONNECTION OWNER here (the direct leg authenticates with
    //    the connection token; the event leg resolves the connection's local
    //    user) — identity never rides the wire. The owner has a wallet on
    //    this node (bills this instance's markup), owns the persisted thread,
    //    and owns the reverse connection for tool call-backs.
    if (dbOwnerUser.isPublic) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }
    const loopUser: JwtPrivatePayloadType = {
      id: dbOwnerUser.id,
      leadId: dbOwnerUser.leadId ?? dbOwnerUser.id,
      isPublic: false,
      roles: [UserPermissionRole.ADMIN],
    };

    // 3. Build single execute-tool override from client-provided specs.
    //    The caller (Atlas) sends tool schemas in executionContext.tools. Instead of
    //    delegating each as a separate CoreTool, we register only execute-tool and
    //    inject the tool catalog into the system prompt. The AI calls:
    //      execute-tool({ toolName: "callerInstanceId__toolName", input })
    //    execute-tool on this node dispatches to the caller via reverse-WS.
    let toolsOverride: ToolSet | undefined;
    // The context the override tools are bound to — see toolsContext param.
    let receiverToolsContext: ToolExecutionContext | undefined;
    let catalogExtra = "";

    // Toolless models (supportsTools:false — native image gen) get NO tool
    // machinery at all: setup.ts already refuses the toolsOverride for them,
    // and the catalog text must not reach the system prompt either — a prompt
    // that says "call generate_image({...}) directly" makes the model emit a
    // (provider-rejected) tool call instead of producing its native output.
    const receiverModelSupportsTools = data.model
      ? getChatModelById(data.model)?.supportsTools !== false
      : true;

    if (
      receiverModelSupportsTools &&
      providerTools &&
      providerTools.length > 0
    ) {
      // Capability gate: validate specs against caller's declared capability snapshot
      // using the CALLER's userId (not the admin's) — that's who owns the connection.
      let allowedToolNames: Set<string> | null = null;
      const [connRow] = await db
        .select({ capabilities: remoteConnections.capabilities })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, loopUser.id),
            eq(remoteConnections.instanceId, callerInstanceId),
          ),
        )
        .limit(1);
      if (connRow?.capabilities && connRow.capabilities.length > 0) {
        allowedToolNames = new Set(connRow.capabilities.map((c) => c.toolName));
      }

      const catalogLines: string[] = [
        "<tool-catalog>",
        "Caller tools below are registered natively — call them DIRECTLY by name (e.g. generate_image({...})).",
        'Only for async callback modes use: execute-tool({ toolName: "<name>", input, callbackMode }) — callbackMode: detach=fire-forget+taskId | wakeUp=async-revival | endLoop=stop-turn',
        "",
      ];

      const toolSpecs = providerTools;

      for (const spec of toolSpecs) {
        if (allowedToolNames !== null && !allowedToolNames.has(spec.name)) {
          logger.warn(
            "[WsProvider] Dropping tool spec not in capability snapshot",
            { toolName: spec.name, instanceId: callerInstanceId },
          );
          continue;
        }
        catalogLines.push(`${spec.name} — ${spec.description} | input: any`);
      }
      catalogLines.push("</tool-catalog>");
      catalogExtra = catalogLines.join("\n");

      // Register only execute-tool as the single meta-tool.
      const { loadTools } = await import("next-vibe/platforms/ai/tools-loader");
      const { makeHeadlessContext } =
        await import("../../../../core/execution-context");
      // Carry the caller's skill/favorite identity into the tool context: the
      // executing side's fieldDefaults (e.g. media-model resolution) cascade
      // from it, and it crosses the wire as callerSkillId/callerFavoriteId on
      // round-trip dispatches back to the caller.
      // The receiver runs under the SAME threadId as the caller; the harness
      // wrote a fixtures-table row for that id on THIS instance too, so binding
      // the tool context by threadId replays recorded calls on this side.
      const headlessCtx = {
        ...makeHeadlessContext(undefined, threadId, data.timezone),
        skillId: data.skill ?? undefined,
        favoriteId: data.favoriteConfig?.id ?? undefined,
      };
      receiverToolsContext = headlessCtx;
      // Identity execute-tool runs under:
      //  - relay: loopUser (the provider's own user). The loop persists locally and
      //    a callback-mode tool (detach/wakeUp) creates a cron_tasks row whose
      //    user_id FK must reference a user that EXISTS on THIS node — callerUser's
      //    foreign id has no row here → FK 500. The remoteConnection back to the
      //    caller is also owned by loopUser, so capability/connection lookups resolve.
      //  - inference-provider: callerUser, so capability checks and connection lookups
      //    use the original requesting user's identity (incognito, no local persist).
      const loaded = await loadTools({
        requestedTools: [EXECUTE_TOOL_ALIAS],
        user: loopUser,
        locale,
        logger,
        systemPrompt: "",
        toolExecutionContext: headlessCtx,
      });
      if (loaded.tools) {
        toolsOverride = loaded.tools;
        // Default UNPREFIXED, instance-less calls back to the CALLER. The
        // catalog instructs `<callerInstanceId>__<name>`, but the model often
        // follows tool-help listings (unprefixed names) — without this rewrite
        // those calls silently execute against the PROVIDER's own catalog
        // (wrong side: model-pipe mode means every tool is the caller's).
        const baseExecuteTool = loaded.tools[EXECUTE_TOOL_ALIAS];
        const baseExecute = baseExecuteTool?.execute;
        if (baseExecuteTool && baseExecute) {
          toolsOverride = {
            ...loaded.tools,
            [EXECUTE_TOOL_ALIAS]: {
              ...baseExecuteTool,
              execute: (
                args: Record<string, WidgetData>,
                options: Parameters<NonNullable<CoreTool["execute"]>>[1],
              ): ReturnType<NonNullable<CoreTool["execute"]>> => {
                const requestedName = args["toolName"];
                const explicitInstance = args["instanceId"];
                const needsRewrite =
                  typeof requestedName === "string" &&
                  requestedName.length > 0 &&
                  !requestedName.includes("__") &&
                  (explicitInstance === undefined ||
                    explicitInstance === null ||
                    explicitInstance === "");
                const effectiveArgs = needsRewrite
                  ? {
                      ...args,
                      toolName: `${callerInstanceId}__${requestedName}`,
                    }
                  : args;
                return baseExecute(effectiveArgs, options);
              },
            },
          };

          // Register EVERY caller tool spec as a first-class CoreTool with its
          // real schema, executing through the same execute-tool round-trip.
          // With only the meta-tool + a text catalog the model has to EXPLORE
          // (tool-help turns, prefix guessing) before every call — extra slow
          // turns and fixture drift. Direct mode gives the model native tools;
          // the model-pipe receiver must look identical.
          const { jsonSchema, tool: makeTool } = await import("ai");
          for (const spec of toolSpecs) {
            if (
              (allowedToolNames !== null && !allowedToolNames.has(spec.name)) ||
              spec.name === EXECUTE_TOOL_ALIAS ||
              toolsOverride[spec.name]
            ) {
              continue;
            }
            const prefixedName = `${callerInstanceId}__${spec.name}`;
            toolsOverride[spec.name] = makeTool({
              description: spec.description,
              inputSchema: jsonSchema<Record<string, WidgetData>>(
                spec.parameters,
              ),
              execute: async (
                args: Record<string, WidgetData>,
                options: Parameters<NonNullable<CoreTool["execute"]>>[1],
              ): Promise<WidgetData> => {
                const envelope = await baseExecute(
                  { toolName: prefixedName, input: args },
                  options,
                );
                // The round-trip returns the execute-tool ENVELOPE ({result})
                // — a native tool surfaces the tool's own result to the model.
                if (
                  envelope &&
                  typeof envelope === "object" &&
                  !Array.isArray(envelope) &&
                  "result" in envelope
                ) {
                  const unwrapped: Record<string, WidgetData> = envelope;
                  return unwrapped["result"];
                }
                return envelope;
              },
            });
          }
        }
      }
    }

    // 4. Parent message ID — pass through as-is.
    //    Incognito streams have no local thread state to resolve compacting chains against.
    const resolvedParentMessageId: string | null = data.parentMessageId ?? null;

    // 4b. Relay landing folder — the EXECUTOR ran the loop, so this copy is
    //     HERMES's OWN thread, not a foreign mirror. It lives in the executor's
    //     REAL PRIVATE folder at the SAME sub-chain the caller used
    //     (private/tests/<case>), NOT under REMOTE/<caller>/…. The caller's side
    //     is the mirror (REMOTE/hermes/private/…); on THIS instance it is a
    //     first-class private thread with origin=NULL and loop=local.
    //     inference-provider stays incognito (no DB thread; caller owns storage).
    let landingRootFolderId: DefaultFolderId = DefaultFolderId.INCOGNITO;
    let landingSubFolderId: string | null = null;
    if (isRelayPersist) {
      landingRootFolderId = DefaultFolderId.PRIVATE;
      // Rebuild the caller's sub-chain (tests/<case>) under THIS instance's own
      // PRIVATE root, preserving the SAME folder ids (folders are same-id synced).
      // The caller ships its subFolderId (the leaf); we materialize that leaf and
      // its ancestors under PRIVATE here and land the thread at the leaf.
      if (data.subFolderId) {
        landingSubFolderId = await materializeOwnPrivateChain(
          data.subFolderId,
          loopUser.id,
        );
      }
      // This is our OWN thread: origin must be NULL (a non-null origin marks a
      // mirror and would re-place it under REMOTE + block the loop from relaying).
      if (data.threadId) {
        await db
          .update(chatThreads)
          .set({
            originInstanceId: null,
            rootFolderId: DefaultFolderId.PRIVATE,
            folderId: landingSubFolderId,
          })
          .where(eq(chatThreads.id, data.threadId))
          .catch(() => undefined);
      }
    }

    // 5. Build AiStream-compatible data object.
    //    relay mode: persist under REMOTE/<originator>/<...folderPath>.
    //    inference-provider: INCOGNITO — no DB writes; caller owns thread storage.
    const aiStreamData: AiStreamPostRequestOutput = {
      operation: "send",
      rootFolderId: landingRootFolderId,
      subFolderId: landingSubFolderId,
      threadId,
      userMessageId: data.userMessageId ?? crypto.randomUUID(),
      parentMessageId: resolvedParentMessageId,
      leafMessageId: null,
      content: data.content,
      role: ChatMessageRole.USER,
      model: data.model,
      skill: data.skill,
      // Caller-forwarded favorite: media-model selections + favoriteId for
      // fieldDefaults resolution on tool round-trips back to the caller.
      favoriteConfig: data.favoriteConfig ?? null,
      toolConfirmations: data.toolConfirmations ?? null,
      messageHistory: data.messageHistory ?? [],
      attachments: data.attachments ?? [],
      resumeToken: null,
      voiceMode: { enabled: false },
      // STT happens ON THE EXECUTOR: the wire audio file rides through so the
      // receiver's operation handler transcribes and the user message carries
      // the transcription (the caller defers its local user write for this).
      audioInput: data.audioInput ?? { file: null },
      timezone: data.timezone,
      imageSize: undefined,
      imageQuality: undefined,
      musicDuration: undefined,
      executionContext: { mode: "local" as const },
    };

    // 6. Call createAiStream with the single execute-tool override.
    //    Tool catalog (from caller specs) is appended to extraInstructions.
    const extraParts = [providerSystemPrompt, catalogExtra].filter(
      (s): s is string => typeof s === "string" && s.length > 0,
    );
    const extraInstructions =
      extraParts.length > 0 ? extraParts.join("\n\n") : undefined;

    // Pass callerUser (not the provider's admin user) so:
    //   - WS event emission targets the caller's channel (publishWsEvent uses user.id)
    //   - pushRemoteEvent fans events to the caller's connected peers
    //   - execute-tool capability checks use callerUser's remoteConnections
    // Dynamic import: index.ts statically imports runRelayBranch from this file,
    // so a static import of "../index" here would create an import cycle.
    const { AiStreamRepository } = await import("../index");
    const result = await AiStreamRepository.createAiStream({
      data: aiStreamData,
      locale,
      logger,
      user: loopUser,
      request,
      // awaitResult = run the FULL agent loop (every tool round) to completion
      // and return only when the thread is settled. The relay caller dispatches
      // this via runInProcessTyped and treats the return as "the remote loop
      // finished" — with awaitResult:false the call would return after the first
      // turn, before tool rounds complete, and the caller would mirror back a
      // partial thread.
      awaitResult: true,
      // The receiver loop mirrors a live session — confirmation gates apply.
      relayReceiver: true,
      // The executor's copy is FOREIGN-ORIGIN: owned by the caller, placed at
      // REMOTE/<caller>/<folderPath>, loop local (it runs right here).
      ...(isRelayPersist ? { originInstanceId: callerInstanceId } : {}),
      // Model-pipe mode (caller supplied its tool specs): the relayed caller
      // context is the AUTHORITATIVE identity — this node's own System
      // Context must not name itself as the acting instance.
      suppressSelfIdentity: Boolean(providerTools && providerTools.length > 0),
      // The caller OWNS this thread — rename-thread must round-trip to it so the
      // owner's title updates (the mirror titles stay in parity).
      relayCallerInstanceId: isRelayPersist ? callerInstanceId : undefined,
      subAgentDepth: 0,
      t,
      extraInstructions,
      // No skip: the loop runs as the connection-owner (loopUser), who has a wallet
      // on THIS node, so normal validation + billing applies for BOTH modes. This is
      // what makes inference-provider bill on both sides (each hop bills its own
      // markup) and remote-folder bill only on the instance that runs the loop.
      confirmationOverridesOverride:
        ctx.confirmationOverrides
          ?.filter(
            (o): o is { toolId: string; requiresConfirmation: boolean } =>
              typeof o.toolId === "string" &&
              typeof o.requiresConfirmation === "boolean",
          )
          .map((o) => ({
            toolId: o.toolId,
            requiresConfirmation: o.requiresConfirmation,
          })) ?? null,
      ...(toolsOverride ? { toolsOverride } : {}),
      // The override tools' closures hold receiverToolsContext — the stream
      // wires its live pendingToolMessages onto it (park anchors + revival).
      ...(receiverToolsContext ? { toolsContext: receiverToolsContext } : {}),
    });

    if (!result.success) {
      return fail({
        message: result.message,
        errorType: result.errorType ?? ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // 7. Return the FULL turn summary. headless:true statically returns
    // HeadlessAiStreamResult — the caller builds its own response from THIS
    // (push-push: the synchronous response is the only backchannel besides
    // events; the caller never pulls our thread).
    return success({
      success: true,
      messageId: result.data.lastAiMessageId ?? "",
      responseThreadId: result.data.threadId ?? threadId,
      totalTokens: undefined,
      finishReason: undefined,
      lastAiMessageContent: result.data.lastAiMessageContent ?? null,
      lastGeneratedMediaUrl: result.data.lastGeneratedMediaUrl ?? null,
      totalCreditsDeducted: result.data.totalCreditsDeducted,
    });
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("[WsProvider] Unexpected error", {
      error: parsedError,
    });
    return fail({
      message: t("errors.unexpectedError", {
        error: parsedError.message,
      }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
