/**
 * Route Execute Repository
 * Delegates execution to RouteExecutionExecutor.executeGenericHandler.
 * Auth is enforced by the target route handler.
 *
 * On success: returns success(result.data) - model gets the target's data flat.
 * On failure: propagates the target's fail() - model gets the error.
 *
 * Remote execution (instanceId provided):
 * Creates a one-shot cron task targeting the remote instance and returns
 * {taskId, status: "pending"} immediately. The local instance picks it up
 * on the next pulse.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { AiT } from "@/app/api/[locale]/system/unified-interface/ai/i18n";
import { broadcastToolResult } from "@/app/api/[locale]/system/unified-interface/execute-tool/handlers/remote-transport";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { RemoteEventHandlerProps } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CallbackModeValue } from "./constants";
import { CallbackMode } from "./constants";
import executeDefinition, {
  type RouteExecuteRequestOutput,
  type RouteExecuteResponseInput,
} from "./definition";
import { checkFolderRestrictions } from "./handlers/folder-restrictions";
import { handleLocalDetach } from "./handlers/local-detach";
import { handleLocalExecute } from "./handlers/local-execute";
import { handleLocalWakeUp } from "./handlers/local-wakeup";
import { handleRemoteDispatch } from "./handlers/remote-dispatch";
import { applyRevivalGuard } from "./handlers/revival-guard";
import type { RouteExecuteContext } from "./handlers/types";

export class RouteExecuteRepository {
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiT,
    streamContext: ToolExecutionContext,
    platform: Platform,
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      // Bail out immediately if the stream was cancelled before tool execution started.
      // The abort signal fires when StreamRegistry.cancel() is called - any DB writes
      // or network calls after this point would create orphaned rows.
      if (streamContext.abortSignal.aborted) {
        logger.debug(
          "[RouteExecute] Stream was cancelled before tool execution started - skipping",
          { toolName: data.toolName },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Split prefixed tool ID: "hermes__ssh_exec_POST" → instanceId="hermes", toolName="ssh_exec_POST"
      // Prefixed form takes precedence over explicit instanceId prop
      let toolName = data.toolName;
      let instanceId = data.instanceId;
      const separatorIdx = toolName.indexOf("__");
      if (separatorIdx !== -1) {
        instanceId = toolName.slice(0, separatorIdx);
        toolName = toolName.slice(separatorIdx + 2);
      }

      const { input } = data;

      // Resolve the active chat model from the favorite/skill cascade.
      // Stored in wakeUpModelId so resume-stream can use it for revival.
      const userId = !user.isPublic && "id" in user ? user.id : undefined;
      const { resolveFavoriteConfig } =
        await import("@/app/api/[locale]/agent/skills/favorites/repository");
      const { resolveSkillVariant } =
        await import("@/app/api/[locale]/agent/skills/resolver");
      const { resolveChatModelId } =
        await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
      const execFav = await resolveFavoriteConfig(
        streamContext.favoriteId,
        userId,
      );
      const { parseSkillId } =
        await import("@/app/api/[locale]/agent/chat/slugify");
      const execSkill = await resolveSkillVariant(
        streamContext.skillId,
        execFav ? parseSkillId(execFav.skillId).variantId : null,
      );
      const resolvedModelId = resolveChatModelId(
        execFav?.modelSelection ?? undefined,
        execSkill?.modelSelection ?? undefined,
        user,
        getEnvAvailability(),
      );

      // Remote execution path - create a one-shot task for the target instance.
      // Revival circuit-breaker: auto-upgrade remote WAIT → WAKE_UP in revival
      // streams (loop prevention). See applyRevivalGuard for the full rationale.
      data = applyRevivalGuard({
        data,
        toolName,
        instanceId,
        streamContext,
        logger,
      });

      // Folder-type restrictions: block remote tools and async callback modes
      // for incognito/public folders (defense in depth - tools-loader also blocks these).
      const folderRestriction = await checkFolderRestrictions({
        data,
        toolName,
        instanceId,
        streamContext,
        logger,
        t,
      });
      if (folderRestriction) {
        return folderRestriction;
      }

      // Shared context for every phase handler. toolName/instanceId are already
      // post-prefix; resolvedModelId is the cascade result stored for revival.
      const ctx: RouteExecuteContext = {
        toolName,
        resolvedModelId,
        user,
        locale,
        logger,
        t,
        streamContext,
        platform,
      };

      if (instanceId && !user.isPublic) {
        const remoteResult = await handleRemoteDispatch({
          ctx,
          data,
          input,
          instanceId,
          execFav,
          execSkill,
        });
        if (remoteResult.kind === "return") {
          return remoteResult.value;
        }
      }

      const callbackMode = data.callbackMode ?? null;

      // APPROVE: return immediately - the stream-part-handler already set
      // stepHasToolsAwaitingConfirmation=true which aborts at finish-step.
      // This result is a placeholder; the real result is injected by resume-stream
      // after the user confirms/cancels (which could be days later).
      // The stream fully ends after finish-step abort - no lingering state.
      if (callbackMode === CallbackMode.APPROVE) {
        logger.debug(
          "[RouteExecute] APPROVE mode - returning placeholder (stream aborts at finish-step)",
          { toolName },
        );
        return success({
          result: { status: "waiting_for_confirmation", toolName },
        });
      }

      // Local background: execute inline, store result in task execution history,
      // return { taskId, status: "pending" } to AI. handleTaskCompletion emits
      // the TASK_COMPLETED WS event and inserts the deferred result message.
      if (callbackMode === CallbackMode.DETACH) {
        return handleLocalDetach({ ctx, input });
      }

      // Local wakeUp: create task row in RUNNING state (so pulse never picks it up),
      // fire execution fire-and-forget, return {taskId, status: "pending"} to the AI.
      // AI completes its current turn. In the background: execute → handleTaskCompletion
      // (schedules resume-stream enabled cron task) → delete task row.
      // resume-stream fires on next pulse, checks isStreaming=false, revives thread.
      if (callbackMode === CallbackMode.WAKE_UP) {
        return handleLocalWakeUp({ ctx, input });
      }

      // Local WAIT: confirmation gate + inline execution.
      return handleLocalExecute({ ctx, data, input, instanceId, callbackMode });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[RouteExecute] Failed", { error: msg });
      return fail({
        message: t("executeTool.post.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }

  /**
   * In-process entry point — execute any tool on any instance from any surface.
   *
   * All non-HTTP callers (CLI remote leg, MCP remote tools, relay handlers, tests)
   * use this instead of calling RouteExecutionExecutor.executeGenericHandler() directly.
   * This ensures every surface shares the same remote dispatch, callback mode handling,
   * platform filtering, and long-running task infrastructure.
   *
   * - toolName may be prefixed "hermes__ssh_exec_POST" to target a remote instance.
   * - platform controls permission gating and response shaping.
   * - For local tools: delegates to executeGenericHandler() with no overhead.
   * - For remote tools: uses direct-HTTP or reverse-WS paths per connection config.
   */
  static async runInProcess(params: {
    toolName: string;
    input?: Record<string, WidgetData>;
    instanceId?: string;
    callbackMode?: CallbackModeValue;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
    platform: Platform;
  }): Promise<ResponseType<WidgetData>> {
    const { scopedTranslation } =
      await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
    const { t } = scopedTranslation.scopedT(params.locale);
    const result = await RouteExecuteRepository.execute(
      {
        toolName: params.toolName,
        input: (params.input ?? {}) as RouteExecuteRequestOutput["input"],
        instanceId: params.instanceId,
        callbackMode: params.callbackMode ?? CallbackMode.WAIT,
      },
      params.user,
      params.locale,
      params.logger,
      t,
      params.streamContext,
      params.platform,
    );
    if (!result.success) {
      return result;
    }
    // RouteExecuteResponseInput is a plain serialisable object — safe to round-trip to WidgetData.
    const data: WidgetData = JSON.parse(JSON.stringify(result.data));
    return success(data);
  }

  /**
   * Type-safe variant of runInProcess. Pass a definition instead of a raw toolName string.
   * The toolName is derived from definition.aliases[0] or path+method, and the input/response
   * types are inferred from definition.types.
   *
   * logger defaults to a throwaway endpoint logger; streamContext defaults to makeHeadlessContext().
   * All other params (locale, platform, user) must be explicit.
   */
  static async runInProcessTyped<TDef extends CreateApiEndpointAny>(
    params: {
      definition: TDef;
      instanceId?: string;
      callbackMode?: CallbackModeValue;
      user: JwtPayloadType;
      locale: CountryLanguage;
      logger?: EndpointLogger;
      streamContext?: ToolExecutionContext;
      platform?: Platform;
    } & (TDef["types"]["RequestOutput"] extends never
      ? { input?: never }
      : { input: TDef["types"]["RequestOutput"] }) &
      (TDef["types"]["UrlVariablesOutput"] extends never
        ? { urlPathParams?: never }
        : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
  ): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
    const { definition, input, urlPathParams, ...rest } = params;
    const logger =
      rest.logger ?? createEndpointLogger(false, Date.now(), rest.locale);
    const streamContext = rest.streamContext ?? makeHeadlessContext();
    const rawToolName =
      (definition.aliases?.[0] as string | undefined) ??
      `${definition.path.join("_")}_${definition.method}`;
    // Strip Next.js path param brackets: [threadId] → threadId (matches generated route-handler keys)
    const toolName = rawToolName.replace(/\[([^\]]+)\]/g, "$1");

    // When instanceId or callbackMode is set, route through execute() so remote dispatch,
    // incognito blocking, callback mode handling, and task creation all apply.
    // The execute() → runInProcess() path wraps the response in { result: ... } for
    // MCP/AI display, but for typed calls we need the raw endpoint data. We recover it
    // by going through executeGenericHandler after execute() has already validated routing.
    if (rest.instanceId ?? rest.callbackMode) {
      const routingResult = await RouteExecuteRepository.runInProcess({
        toolName,
        input: {
          ...(input as Record<string, WidgetData> | undefined),
          ...(urlPathParams as Record<string, WidgetData> | undefined),
        },
        instanceId: rest.instanceId,
        callbackMode: rest.callbackMode,
        user: rest.user,
        locale: rest.locale,
        logger,
        streamContext,
        platform: rest.platform ?? Platform.NEXT_API,
      });
      // runInProcess wraps inline WAIT results as { result: <data> } for MCP/AI display.
      // For typed callers we unwrap to return the raw endpoint data (matching local path).
      if (
        routingResult.success &&
        typeof routingResult.data === "object" &&
        routingResult.data !== null &&
        !Array.isArray(routingResult.data) &&
        "result" in routingResult.data
      ) {
        return success(
          (routingResult.data as { result: WidgetData }).result,
        ) as ResponseType<TDef["types"]["ResponseOutput"]>;
      }
      return routingResult as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    // Local WAIT path: call executeGenericHandler directly for the raw typed response.
    // If urlPathParams is explicitly provided, pass them pre-split to executeGenericHandler
    // (bypasses splitArgs, exactly matching what CLI callers do).
    // If urlPathParams is not provided, merge everything into data and let splitArgs auto-split
    // (matching AI/MCP flat-args convention).
    const hasExplicitUrlPathParams = urlPathParams !== undefined;
    const resolvedData: Record<string, WidgetData> = hasExplicitUrlPathParams
      ? (input as Record<string, WidgetData>)
      : {
          ...(input as Record<string, WidgetData>),
          ...(urlPathParams as Record<string, WidgetData> | undefined),
        };
    const resolvedUrlPathParams: Record<string, WidgetData> | undefined =
      hasExplicitUrlPathParams
        ? (urlPathParams as Record<string, WidgetData>)
        : undefined;
    return RouteExecutionExecutor.executeGenericHandler<
      TDef["types"]["ResponseOutput"]
    >({
      toolName,
      data: resolvedData,
      urlPathParams: resolvedUrlPathParams,
      user: rest.user,
      locale: rest.locale,
      logger,
      platform: rest.platform ?? Platform.NEXT_API,
      streamContext,
    });
  }

  /**
   * Route a typed endpoint call through the user's configured inference provider.
   * Resolves the provider via RemoteTransport.resolveInferenceProvider, then calls
   * runInProcessTyped with the connection's instanceId and the real user.
   * Returns fail() if the user is public or no provider is configured.
   */
  static async runAsSystemProvider<TDef extends CreateApiEndpointAny>(
    params: {
      definition: TDef;
      user: JwtPayloadType;
      locale: CountryLanguage;
      logger?: EndpointLogger;
      streamContext?: ToolExecutionContext;
      platform?: Platform;
    } & (TDef["types"]["RequestOutput"] extends never
      ? { input?: never }
      : { input: TDef["types"]["RequestOutput"] }) &
      (TDef["types"]["UrlVariablesOutput"] extends never
        ? { urlPathParams?: never }
        : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
  ): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
    const {
      definition,
      input,
      urlPathParams,
      user,
      locale,
      streamContext,
      platform,
    } = params;
    const logger =
      params.logger ?? createEndpointLogger(false, Date.now(), locale);
    const { scopedTranslation: spT } =
      await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
    const { t: spt } = spT.scopedT(locale);

    if (user.isPublic || !("id" in user)) {
      return fail({
        message: spt("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      }) as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    const { RemoteTransport } =
      await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/transport");
    const inferenceTarget = await RemoteTransport.resolveInferenceProvider({
      userId: user.id,
      logger,
    });
    if (!inferenceTarget) {
      return fail({
        message: spt("executeTool.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      }) as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    return RouteExecuteRepository.runInProcessTyped({
      definition,
      input,
      urlPathParams,
      instanceId: inferenceTarget.instanceId,
      user,
      locale,
      logger,
      streamContext,
      platform: platform ?? Platform.AI,
    } as Parameters<typeof RouteExecuteRepository.runInProcessTyped>[0]);
  }

  /**
   * Execute a tool locally and POST tool-execute-result back to a remote /ws/broadcast.
   *
   * Used by relay handlers (HeadlessRelayProcessor) when the
   * remote AI loop sends a tool-execute-request and needs the result to continue.
   * Centralises what was previously duplicated in both handlers.
   */
  static async executeLocalAndBroadcast(params: {
    toolName: string;
    input: Record<string, WidgetData>;
    callId: string;
    broadcastUrl: string;
    broadcastChannel: string;
    authHeader: string;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
    platform: Platform;
  }): Promise<void> {
    const {
      toolName,
      input,
      callId,
      broadcastUrl,
      broadcastChannel,
      authHeader,
      user,
      locale,
      logger,
      streamContext,
      platform,
    } = params;

    let result: WidgetData | undefined;
    let error: string | undefined;

    try {
      const response =
        await RouteExecutionExecutor.executeGenericHandler<WidgetData>({
          toolName,
          data: input,
          user,
          locale,
          logger,
          platform,
          streamContext,
        });
      if (response.success) {
        result = response.data;
      } else {
        error =
          "message" in response
            ? String(response.message)
            : "Tool execution failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      logger.warn("[RouteExecute] executeLocalAndBroadcast tool threw", {
        toolName,
        callId,
        error,
      });
    }

    await broadcastToolResult({
      broadcastUrl,
      broadcastChannel,
      authHeader,
      callId,
      result,
      error,
      logger,
    });
  }

  // ── Shared wire-event handlers (onRemoteEvent for execute-tool/route.ts) ──────

  /**
   * Validate and execute an inbound tool-execute-request wire payload.
   *
   * Called from two paths — same code:
   *   - onRemoteEvent["tool-execute-request"] in execute-tool/route.ts  (reverse-WS)
   *   - connector.ts tool-execute-request dispatch block  (outbound WS hub subscriber)
   *
   * Resolves the reverse-entry row for reportTo internally (no caller plumbing).
   * Result is published back on the hub channel system/tool-dispatch/{req.userId}
   * so the originating connector picks it up via onRemoteEvent["tool-execute-result"].
   */
  static async handleIncomingToolRequest(params: {
    raw: WsWireMessage["data"];
    executedByInstance: string;
    logger: EndpointLogger;
    localUserId?: string;
  }): Promise<void> {
    const { raw, executedByInstance, logger, localUserId } = params;
    const { executeIncomingToolRequest, ToolExecuteRequestSchema } =
      await import("@/app/api/[locale]/system/unified-interface/execute-tool/tool-executor");
    const parsed = ToolExecuteRequestSchema.safeParse(raw);
    if (!parsed.success) {
      logger.warn(
        "[RouteExecute] tool-execute-request: invalid payload — dropped",
        { issues: parsed.error.issues.map((i) => i.message) },
      );
      return;
    }
    const req = parsed.data;

    // Resolve reverse entry to get reportTo (remoteUrl + token + leadId).
    const { remoteConnections } =
      await import("@/app/api/[locale]/remote-connection/db");
    const { RemoteConnectionRepository } =
      await import("@/app/api/[locale]/remote-connection/repository");
    const { and: andOp, desc: descOp, eq: eqOp } = await import("drizzle-orm");
    const userId = localUserId ?? req.userId;
    const [row] = await db
      .select()
      .from(remoteConnections)
      .where(
        andOp(
          eqOp(remoteConnections.userId, userId),
          eqOp(remoteConnections.isActive, true),
          eqOp(remoteConnections.isReverseEntry, true),
        ),
      )
      .orderBy(descOp(remoteConnections.updatedAt))
      .limit(1);
    if (!row?.token) {
      logger.warn(
        "[RouteExecute] tool-execute-request: no reverse entry — dropped",
        { userId },
      );
      return;
    }
    const reportTo: ToolReportTarget = {
      remoteUrl: row.remoteUrl,
      token: RemoteConnectionRepository.decryptToken(row.token),
      leadId: row.leadId,
    };

    const outcome = await executeIncomingToolRequest({
      req,
      reportTo,
      executedByInstance,
      logger,
      localUserId,
    });
    if (!outcome) {
      return;
    }

    // Publish result back on hub so connector receives via onRemoteEvent["tool-execute-result"].
    const { publish } =
      await import("@/app/api/[locale]/system/unified-interface/websocket/server");
    publish(`system/tool-dispatch/${req.userId}`, "tool-execute-result", {
      callId: outcome.callId,
      status: outcome.status,
      output: outcome.output,
      error: outcome.status === "failed" ? outcome.summary : null,
      durationMs: outcome.durationMs,
    });
  }

  /**
   * Validate and apply an inbound tool-execute-result wire payload.
   * Completes the pending-call registry entry so the blocked
   * awaitPendingCallResult() call resumes.
   *
   * Extracted from connector.ts:handleToolExecuteResult() — callers pass only
   * the raw data and a logger; no connection context needed.
   */
  static async handleToolResult(
    raw: WsWireMessage["data"],
    logger: EndpointLogger,
  ): Promise<void> {
    const parsed = z
      .object({
        callId: z.string().min(1),
        status: z.enum(["completed", "failed"]),
        output: z.record(z.string(), WidgetDataSchema).nullable(),
        error: z.string().nullable().optional(),
      })
      .safeParse(raw);
    if (!parsed.success) {
      logger.warn(
        "[RouteExecute] tool-execute-result: invalid payload — dropped",
      );
      return;
    }
    const { completePendingCall } =
      await import("@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/transport/pending-calls");
    const outcome = completePendingCall(parsed.data.callId, {
      status: parsed.data.status,
      output: parsed.data.output,
    });
    logger.debug("[RouteExecute] tool-execute-result applied", {
      callId: parsed.data.callId,
      status: parsed.data.status,
      outcome: outcome.kind,
    });
  }
}

/**
 * Dispatch a tool-execute-request or tool-execute-result wire payload.
 *
 * Called by connector.ts and websocket/server.ts — avoids constructing a
 * typed RemoteEventContext (urlPathParams is `never` for execute-tool).
 */
export async function dispatchToolWireEvent(
  event: "tool-execute-request" | "tool-execute-result",
  payload: WsWireMessage["data"],
  instanceId: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  if (event === "tool-execute-request") {
    await RouteExecuteRepository.handleIncomingToolRequest({
      raw: payload,
      executedByInstance: instanceId,
      logger,
      localUserId: userId,
    });
  } else {
    await RouteExecuteRepository.handleToolResult(payload, logger);
  }
}
