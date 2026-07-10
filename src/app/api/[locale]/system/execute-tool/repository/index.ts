/**
 * Route Execute Repository — single execution path for all surfaces.
 *
 * All tool execution flows through here: AI stream, MCP relay, CLI remote leg,
 * test suites. Remote dispatch, callback modes, task creation, folder restrictions,
 * and revival guards are all applied here — no caller duplicates this logic.
 *
 * On success: returns success(result.data) — model gets the target's data flat.
 * On failure: propagates the target's fail() — model gets the error.
 *
 * Remote execution (instanceId provided): execute-tool branches on the
 * connection's transportMode. direct-http WAIT/END_LOOP is a synchronous
 * runInProcessTyped call (result inline). Everything else emits the
 * definition-driven tool-execute-request event; the RECEIVER owns the task and
 * returns tool-execute-result. detach/wakeUp return {taskId, hint} immediately;
 * the requester holds only an in-memory pending call (no cross-instance task).
 */

import "server-only";

import { desc, lt, sql as sqlFn } from "drizzle-orm";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type {
  GenericHandlerBase,
  RemoteEventHandlerProps,
} from "next-vibe/core/route/handler";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";
import { dbUserIdToOwner } from "next-vibe/tasks/cron/db";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { chatMessages } from "@/app/api/[locale]/agent/chat/db";
import {
  bold,
  maybeColorize,
  semantic,
} from "@/app/api/[locale]/system/logger/colors";

import type { CallbackModeValue } from "../constants";
import { CallbackMode, CallbackModeDB } from "../constants";
import { pendingCallResults } from "../db";
import executeDefinition, {
  type RouteExecuteRequestOutput,
  type RouteExecuteResponseOutput,
} from "../definition";
import { TaskCompletion } from "./completion";
import { RouteExecutionExecutor } from "./core";
import { ExecuteToolGuards } from "./guards";
import { LocalExecution } from "./local";
import { PendingCalls } from "./pending-calls";
import { RemoteDispatch } from "./remote";
import { ResultSignals } from "./result-signals";
import type { RouteExecuteContext } from "./types";

export class RouteExecuteRepository {
  /**
   * At-least-once delivery guard for inbound tool-execute-requests: callIds
   * currently executing in THIS process. The reverse-ws hub can deliver one
   * request to several lingering connector sockets (reconnect churn), and each
   * delivery would spawn a full duplicate execution. Entries are removed when
   * the execution settles, so deterministic callIds (fixture mode) can re-run
   * across test runs.
   */
  static readonly inFlightIncomingCalls = new Set<string>();

  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiT,
    streamContext: ToolExecutionContext,
    platform: Platform,
    /**
     * Optional pre-loaded handler for the local WAIT path. MCP (hot-reload) and
     * CLI pass the handler they already imported so the executor reuses it
     * instead of a second dynamic import. Ignored for remote/async modes (those
     * never touch the local in-process handler).
     */
    preloadedHandler?: GenericHandlerBase | null,
    /**
     * Optional pre-split URL path params for the local WAIT path. CLI parses
     * args into data + urlPathParams itself; passing them pre-split skips the
     * executor's arg-splitting step. Ignored for remote/async modes.
     */
    urlPathParams?: Record<string, WidgetData>,
  ): Promise<ResponseType<RouteExecuteResponseOutput>> {
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

      // Public callers: force WAIT mode, block remote execution
      if (user.isPublic) {
        data = {
          ...data,
          callbackMode: CallbackMode.WAIT,
          instanceId: undefined,
        };
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

      let { input } = data;

      // Misplaced callbackMode hoist: models regularly put callbackMode INSIDE
      // the target tool's input ({toolName: "generate_image", input: {prompt,
      // callbackMode: "detach"}, callbackMode: "wait"}). callbackMode is
      // execute-tool's OWN contract word — no target tool declares it — so the
      // intent is unambiguous: hoist it to the envelope (input's value wins
      // over an absent or default-"wait" envelope value) and strip it from the
      // input so target-schema validation never sees it. Skip nested
      // execute-tool inputs — there the inner envelope owns its callbackMode.
      if (
        toolName !== "execute-tool" &&
        input !== null &&
        typeof input === "object" &&
        !Array.isArray(input) &&
        "callbackMode" in input
      ) {
        const misplaced = CallbackModeDB.find(
          (m) => m === String(input["callbackMode"]),
        );
        const cleanInput = { ...input };
        delete cleanInput["callbackMode"];
        input = cleanInput;
        if (
          misplaced &&
          (data.callbackMode === undefined ||
            data.callbackMode === null ||
            data.callbackMode === CallbackMode.WAIT)
        ) {
          logger.debug(
            "[RouteExecute] Hoisted misplaced callbackMode from input to envelope",
            { toolName, misplaced, envelopeMode: data.callbackMode ?? null },
          );
          data = { ...data, callbackMode: misplaced, input };
        } else {
          data = { ...data, input };
        }
      }

      // Remote execution path - create a one-shot task for the target instance.
      // Revival circuit-breaker: auto-upgrade remote WAIT → WAKE_UP in revival
      // streams (loop prevention). See applyRevivalGuard for the full rationale.
      data = ExecuteToolGuards.applyRevivalGuard({
        data,
        toolName,
        instanceId,
        streamContext,
        logger,
      });

      // Folder-type restrictions: block remote tools and async callback modes
      // for incognito/public folders (defense in depth - tools-loader also blocks these).
      const folderRestriction = await ExecuteToolGuards.checkFolderRestrictions(
        {
          data,
          toolName,
          instanceId,
          streamContext,
          logger,
          t,
        },
      );
      if (folderRestriction) {
        return folderRestriction;
      }

      const callbackMode = data.callbackMode ?? null;

      // Resolve the active chat model from the favorite/skill cascade — LAZY:
      // only remote dispatch (media-model + capability context) and WAKE_UP
      // (wakeUpModelId for revival routing) need it. Plain local WAIT/endLoop/
      // detach/approve must not pay the dynamic imports + DB lookups per call.
      const needsCascade =
        Boolean(instanceId && !user.isPublic) ||
        callbackMode === CallbackMode.WAKE_UP;
      const resolvedModelId = needsCascade
        ? await TaskCompletion.resolveStreamModelId(streamContext, user)
        : null;

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
        preloadedHandler,
        urlPathParams,
      };

      if (instanceId && !user.isPublic) {
        const remoteResult = await RemoteDispatch.dispatch({
          ctx,
          data,
          input,
          instanceId,
        });
        if (remoteResult.kind === "return") {
          return remoteResult.value;
        }
      }

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

      // Local async (DETACH / WAKE_UP): RUNNING task row + fire-and-forget
      // goroutine, returns { taskId } to the AI immediately. One shared flow —
      // the modes differ only in the completion policy (detach: no revival,
      // no backfill; wakeUp: revival with deferred result). See ./local.ts.
      if (
        callbackMode === CallbackMode.DETACH ||
        callbackMode === CallbackMode.WAKE_UP
      ) {
        return LocalExecution.executeAsync({ ctx, input, mode: callbackMode });
      }

      // Local WAIT: confirmation gate + inline execution.
      return LocalExecution.execute({
        ctx,
        data,
        input,
        instanceId,
        callbackMode,
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[RouteExecute] Failed", {
        toolName: data.toolName,
        error: msg,
        stack: error instanceof Error ? (error.stack ?? "") : "",
      });
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
    /**
     * Pre-loaded handler for the local WAIT path (MCP hot-reload, CLI handler
     * reuse). Forwarded to execute(); ignored for remote/async modes.
     */
    preloadedHandler?: GenericHandlerBase | null;
    /**
     * Pre-split URL path params for the local WAIT path (CLI). Forwarded to
     * execute(); ignored for remote/async modes.
     */
    urlPathParams?: Record<string, WidgetData>;
  }): Promise<ResponseType<WidgetData>> {
    const { scopedTranslation } = await import("next-vibe/platforms/ai/i18n");
    const { t } = scopedTranslation.scopedT(params.locale);
    const result = await RouteExecuteRepository.execute(
      {
        toolName: params.toolName,
        input: params.input ?? {},
        instanceId: params.instanceId,
        callbackMode: params.callbackMode ?? CallbackMode.WAIT,
      },
      params.user,
      params.locale,
      params.logger,
      t,
      params.streamContext,
      params.platform,
      params.preloadedHandler,
      params.urlPathParams,
    );
    if (!result.success) {
      return result;
    }
    // RouteExecuteResponseOutput is a plain serialisable object — safe to round-trip to WidgetData.
    const data: WidgetData = JSON.parse(JSON.stringify(result.data));
    // Preserve the target's isErrorResponse / performance metadata (CLI uses
    // isErrorResponse for exit codes, performance for its execution summary).
    return success(data, {
      ...(result.isErrorResponse && { isErrorResponse: true }),
      ...(result.performance && { performance: result.performance }),
    });
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
      logger: EndpointLogger;
      streamContext?: ToolExecutionContext;
      platform?: Platform;
    } & (TDef["types"]["RequestOutput"] extends never
      ? { input?: never }
      : // RequestOutput for in-process callers; RequestInput additionally for
        // wire callers — a remote dispatch serializes the input to JSON and the
        // PEER parses it, so pre-transform shapes (e.g. base64 attachments
        // instead of File) are the correct thing to send across instances.
        {
          input: TDef["types"]["RequestOutput"] | TDef["types"]["RequestInput"];
        }) &
      (TDef["types"]["UrlVariablesOutput"] extends never
        ? { urlPathParams?: never }
        : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
  ): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
    const { definition, input, urlPathParams, ...rest } = params;
    const logger = rest.logger ?? createEndpointLogger(false, rest.locale);
    const streamContext =
      rest.streamContext ??
      // no user context — UTC (dates not user-facing here)
      makeHeadlessContext(undefined, undefined, "UTC");
    const rawToolName =
      definition.aliases?.[0] ??
      `${definition.path.join("_")}_${definition.method}`;
    // Strip Next.js path param brackets: [threadId] → threadId (matches generated route-handler keys)
    const toolName = rawToolName.replace(/\[([^\]]+)\]/g, "$1");

    // When instanceId or callbackMode is set, route through execute() so remote dispatch,
    // incognito blocking, callback mode handling, and task creation all apply.
    // The execute() → runInProcess() path wraps the response in { result: ... } for
    // MCP/AI display, but for typed calls we need the raw endpoint data. We recover it
    // by unwrapping after execute() has already validated routing.
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
        return success(routingResult.data.result) as ResponseType<
          TDef["types"]["ResponseOutput"]
        >;
      }
      return routingResult as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    // Local WAIT path: call executeGenericHandler directly for the raw typed response.
    // If urlPathParams is explicitly provided, pass them pre-split to executeGenericHandler
    // (bypasses the auto arg-splitting, exactly matching what CLI callers do).
    // If urlPathParams is not provided, merge everything into data and let the
    // executor auto-split (matching AI/MCP flat-args convention).
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
   * Resolves the provider via ExecuteToolRouting.resolveInferenceProvider, then
   * calls runInProcessTyped with the connection's instanceId and the real user.
   * Returns fail() if the user is public or no provider is configured.
   */
  static async runAsSystemProvider<TDef extends CreateApiEndpointAny>(
    params: {
      definition: TDef;
      user: JwtPayloadType;
      locale: CountryLanguage;
      logger: EndpointLogger;
      streamContext: ToolExecutionContext;
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
    const logger = params.logger ?? createEndpointLogger(false, locale);
    const { scopedTranslation: spT } =
      await import("next-vibe/platforms/ai/i18n");
    const { t: spt } = spT.scopedT(locale);

    if (user.isPublic || !("id" in user)) {
      return fail({
        message: spt("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      }) as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    const { ExecuteToolRouting } =
      await import("@/app/api/[locale]/remote-connection/routing");
    const inferenceTarget = await ExecuteToolRouting.resolveInferenceProvider({
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

  // ── Shared wire-event handlers (onRemoteEvent for execute-tool/route.ts) ──────

  /**
   * Run an inbound tool-execute-request from a peer — the RECEIVER side.
   *
   * Called from onRemoteEvent["tool-execute-request"] in execute-tool/route.ts.
   * The receiver OWNS the work as its own local task; the requester holds no
   * cross-instance task. The result returns to the requester as a
   * `tool-execute-result` event keyed by `roundtrip.callId`, which the requester's
   * onRemoteEvent["tool-execute-result"] resolves via handleToolResult.
   *
   * Branches on the caller's original callbackMode (a declared requestField):
   *   - WAIT/END_LOOP → run inline, emit the result when done (requester is
   *     blocked on PendingCalls.awaitResult).
   *   - detach/wakeUp → run headless in the background, return immediately, emit
   *     the result on completion (requester parked / fire-and-forget).
   */
  static async handleIncomingToolRequest(
    props: RemoteEventHandlerProps<
      typeof executeDefinition.POST,
      "tool-execute-request"
    >,
  ): Promise<void> {
    const { requestData, payload: roundtrip, user, logger } = props;
    const localUserId = user.id;

    // At-least-once delivery guard: the reverse-ws hub can deliver the same
    // tool-execute-request to MULTIPLE lingering connector sockets (reconnect
    // churn leaves stale subscriptions until they time out) — each delivery
    // would spawn a full duplicate execution (double loops, PK collisions on
    // deterministic thread ids, double billing). Dedupe by callId while the
    // first execution is in flight.
    if (RouteExecuteRepository.inFlightIncomingCalls.has(roundtrip.callId)) {
      logger.debug(
        "[RouteExecute] handleIncomingToolRequest: duplicate delivery — skipped",
        { callId: roundtrip.callId },
      );
      return;
    }
    RouteExecuteRepository.inFlightIncomingCalls.add(roundtrip.callId);

    const owner = dbUserIdToOwner(localUserId);
    const taskUserCtx = await resolveTaskOwnerUser(
      owner,
      defaultLocale,
      logger,
    );
    if (!taskUserCtx) {
      logger.warn(
        "[RouteExecute] handleIncomingToolRequest: failed to resolve user",
        { localUserId },
      );
      RouteExecuteRepository.inFlightIncomingCalls.delete(roundtrip.callId);
      return;
    }

    const { scopedTranslation } = await import("next-vibe/platforms/ai/i18n");
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const abortController = new AbortController();
    const callbackMode = requestData.callbackMode ?? CallbackMode.WAIT;
    const isAsyncMode =
      callbackMode === CallbackMode.DETACH ||
      callbackMode === CallbackMode.WAKE_UP;

    const relayResult = async (
      result: ResponseType<RouteExecuteResponseOutput>,
    ): Promise<void> => {
      logger.debug("[RouteExecute] relaying result to requester", {
        callId: roundtrip.callId,
        success: result.success,
        originInstanceId: props.originInstanceId ?? null,
      });
      RouteExecuteRepository.inFlightIncomingCalls.delete(roundtrip.callId);
      // Fan the result back over the RECEIVER's local connections (keyed by
      // our local userId, NOT the requester's id — the bridge resolves the
      // back leg from our remoteConnections rows). The requester matches by
      // callId, not userId.
      await RouteExecuteRepository.emitToolResult(
        roundtrip.callId,
        localUserId,
        result,
        logger,
        // Address the result to the REQUESTER's connection — the SENDING
        // instance (originInstanceId). props.instanceId is the event's TARGET
        // (this instance): using it addressed the reply to ourselves and the
        // requester never received the result (observed: direct-suite tool
        // dispatches timing out after 90s with the execution long finished).
        props.originInstanceId,
      );
    };

    // ONE receiver context for every mode. Caller identity + fixture context
    // ride the roundtrip payload (the event's payloadType) — never the public
    // request schema — and continue down THIS execution chain.
    //
    // detach/wakeUp additions: the RECEIVER owns the work as a REAL local
    // async task — same executor, same task row, same goroutine as a local
    // dispatch. The task-row ID is the requester's callId
    // (remoteDispatchCallId) so ONE identity names the work on both instances,
    // and the receiver's task history is the durable result store (await-task
    // finds it after the requester's in-memory tombstone expires — parity with
    // local detach). onAsyncTaskSettled relays the settled outcome back as the
    // tool-execute-result event; the requester's parked semantics (revival /
    // fire-and-forget) live on ITS side, driven by that event.
    const receiverCtx: ToolExecutionContext = {
      // no user context — UTC (dates not user-facing here); wire payload carries
      // only the fixture-scope threadId, not the caller's timezone.
      ...makeHeadlessContext(
        abortController.signal,
        roundtrip.streamContext,
        "UTC",
      ),
      skillId: roundtrip.callerSkillId ?? undefined,
      favoriteId: roundtrip.callerFavoriteId ?? undefined,
      ...(isAsyncMode
        ? {
            remoteDispatchCallId: roundtrip.callId,
            onAsyncTaskSettled: async (outcome): Promise<void> => {
              await relayResult(
                outcome.status === "completed"
                  ? success({ result: outcome.output ?? {} })
                  : fail({
                      message: t("executeTool.post.errors.unknown.title"),
                      errorType: ErrorResponseTypes.INTERNAL_ERROR,
                      messageParams: {
                        error: outcome.errorMessage ?? "Tool execution failed",
                      },
                    }),
              );
            },
          }
        : {}),
    };

    const runExecute = (): Promise<ResponseType<RouteExecuteResponseOutput>> =>
      RouteExecuteRepository.execute(
        {
          toolName: requestData.toolName,
          input: requestData.input,
          instanceId: undefined,
          callbackMode: isAsyncMode ? callbackMode : CallbackMode.WAIT,
        },
        taskUserCtx.user,
        defaultLocale,
        logger,
        t,
        receiverCtx,
        // Gate under the CALLER's original surface — the RELAY dispatches
        // ai-stream itself (AI_TOOL_OFF), which must not be gated as an AI
        // tool call. AI-model calls arrive with callerPlatform=AI.
        roundtrip.callerPlatform ?? Platform.AI,
      );

    if (isAsyncMode) {
      const dispatched = await runExecute();
      if (!dispatched.success) {
        // Dispatch itself failed (guards, task insert) — relay immediately so
        // the requester's pending call resolves instead of hitting deadline.
        await relayResult(dispatched);
      }
      return;
    }

    // WAIT/END_LOOP: the requester blocks on the result — but NOT on this
    // delivery call. The bridge transport awaits this handler, so running the
    // tool inline here would hold the sender's transport POST open for the
    // whole execution — an unbounded loop (ai-stream, timeoutMs: 0) would hit
    // the sender's fetch timeout, which is exactly the HTTP-ceiling problem
    // the event protocol exists to avoid. Ack delivery immediately; the
    // requester's WAIT resolves via the tool-execute-result event.
    void (async (): Promise<void> => {
      await relayResult(await runExecute());
    })().catch((error: Error) => {
      RouteExecuteRepository.inFlightIncomingCalls.delete(roundtrip.callId);
      logger.error(
        "[RouteExecute] handleIncomingToolRequest: WAIT execution failed",
        { callId: roundtrip.callId, error: error.message },
      );
    });
  }

  /**
   * Validate and apply an inbound tool-execute-result wire payload.
   * Completes the pending-call registry entry so the blocked
   * PendingCalls.awaitResult() call resumes.
   */
  static async handleToolResult(
    props: RemoteEventHandlerProps<
      typeof executeDefinition.POST,
      "tool-execute-result"
    >,
  ): Promise<void> {
    const { responseData, logger } = props;
    const { taskId, result, hint } = responseData;
    if (!taskId) {
      logger.warn(
        "[RouteExecute] tool-execute-result: missing taskId — dropped",
      );
      return;
    }
    // `result` arrives as untyped wire JSON — narrow to the output-object contract.
    let output = PendingCalls.toOutputObject(result);
    // Explicit wire status; hint-presence fallback only for peers on the old
    // wire shape (a success carrying a hint is misread as failed there).
    const status: "completed" | "failed" =
      responseData.status ?? (hint ? "failed" : "completed");
    // Failure fidelity: emitToolResult carries the peer's fail() message in
    // `hint` (result is null on failure). Surface it as output.message so the
    // requester's WAIT/inline mapping shows the REAL remote error instead of
    // an opaque "Tool Not Found".
    if (status === "failed" && hint && output?.["message"] === undefined) {
      output = { ...(output ?? {}), message: hint };
    }

    // Publish the result to the dispatching call's pub/sub channel FIRST. The
    // dispatcher subscribed INLINE when it sent the request (ResultSignals) — the
    // bus crosses PROCESSES (proxy ↔ app; a test harness running the loop out of
    // the server process), so this resolves the waiter wherever it lives, without
    // relying on the in-memory PendingCalls being in THIS process.
    ResultSignals.deliver(taskId, { status, output, hint }, props.user, logger);

    const outcome = PendingCalls.complete(taskId, { status, output });

    if (outcome.kind === "completed") {
      // WAIT/END_LOOP callers are already unblocked by PendingCalls.complete's
      // waiters. A wakeUp (or auto-upgraded WAIT) has a parked resume-stream
      // task — enable+fire it now. Detach has no parked task so this is a no-op.
      await TaskCompletion.enableAndFireParkedResumeTask({
        taskId,
        status,
        output,
        locale: props.locale,
        logger,
        abortSignal: new AbortController().signal,
      });
      return;
    }

    if (outcome.kind === "unknown") {
      // No in-memory pending call in THIS process. The cross-process WAIT waiter
      // was ALREADY resolved above by ResultSignals.deliver (KeyedRemoteSignal
      // over the WS hub / bridge) — the transient signal fires only if a waiter is
      // subscribed RIGHT NOW. A DETACHED result has no live waiter: await-task
      // retrieves it minutes later, so it needs a DURABLE store. Persist it for
      // PendingCalls.getReconciled (await-task's cross-process read). WAIT never
      // depends on this row — it is resolved live by the signal.
      await db
        .insert(pendingCallResults)
        .values({ callId: taskId, status, output })
        .onConflictDoNothing()
        .catch((err: Error) => {
          logger.warn("[RouteExecute] failed to persist detached tool result", {
            callId: taskId,
            error: err.message,
          });
        });
      // Opportunistic purge of unconsumed stale rows (no await-task ever came).
      void db
        .delete(pendingCallResults)
        .where(
          lt(pendingCallResults.createdAt, new Date(Date.now() - 3_600_000)),
        )
        .catch(() => undefined);

      // Parked-thread wakeUp: revive the thread from its tool message.
      await RouteExecuteRepository.reviveFromToolMessage(
        taskId,
        status,
        output,
        logger,
      );
    }
  }

  /**
   * Relay a finished tool result back to the requester as a `tool-execute-result`
   * event keyed by callId. createEndpointEmitter fans it out via the bridge over
   * the back connection's leg; the requester's handleToolResult resolves the
   * pending call (and fires revival for wakeUp).
   */
  private static async emitToolResult(
    callId: string,
    localUserId: string,
    result: ResponseType<RouteExecuteResponseOutput>,
    logger: EndpointLogger,
    /** The requester connection (our local name for it). Addressed frame:
     *  other peers of this account never see the result. undefined = legacy
     *  broadcast (restart-revival fallback where the requester row is unknown). */
    targetInstanceId: string | undefined,
  ): Promise<void> {
    const resultData: WidgetData = result.success
      ? (JSON.parse(
          JSON.stringify(result.data.result ?? result.data),
        ) as WidgetData)
      : {
          // Failure fidelity across the wire: carry the ORIGINAL errorType so
          // the requester's inline mapping reconstructs the real failure
          // (e.g. 403 insufficient-credits) instead of a generic 5xx wrapper.
          message:
            "message" in result
              ? String(result.message)
              : "Tool execution failed",
          errorKey: result.errorType.errorKey,
          errorCode: result.errorType.errorCode,
        };
    const hint = result.success
      ? undefined
      : "message" in result
        ? String(result.message)
        : "Tool execution failed";

    // Explicit outcome on the wire — the requester must never have to infer
    // failure from hint presence (a success can legitimately carry a hint).
    const resultPayload: Pick<
      RouteExecuteResponseOutput,
      "hint" | "result" | "status" | "taskId"
    > = {
      taskId: callId,
      result: resultData,
      hint,
      status: result.success ? "completed" : "failed",
    };

    const { createEndpointEmitter } =
      await import("next-vibe/realtime/emitter");
    // Emit as OUR local user so pushRemoteEvent finds our back-connection rows
    // (keyed by our userId). The requester matches the result by callId.
    const localUser: JwtPayloadType = {
      id: localUserId,
      leadId: localUserId,
      isPublic: false as const,
      roles: [],
    };
    createEndpointEmitter(
      executeDefinition.POST,
      logger,
      localUser,
      targetInstanceId ? { targetInstanceId } : undefined,
    )("tool-execute-result", { responseData: resultPayload });
  }

  /**
   * Restart-safe revival fallback: when no in-memory pending call exists (the
   * requester process restarted), find the parked tool message that stored this
   * callId and revive from its persisted metadata. resume-stream reconstructs the
   * remaining context (skill/favorite/leaf) from the thread itself.
   *
   * WAKE_UP is correct by construction here: revival only targets PARKED
   * messages — wakeUp dispatches (./remote.ts), the WAIT auto-upgrade, and
   * await-task parks (await-task/repository.ts) all want exactly this
   * deferred-insert + revival-ack treatment. Detach never stores a callId —
   * its no-revival contract survives requester restarts. An inline WAIT stores
   * its anchor with pendingCallInline=true (the stream is live and blocked in
   * PendingCalls.awaitResult): those are skipped — the durable handoff row
   * written by handleToolResult delivers the result to the live waiter, and
   * reviving would double-deliver.
   */
  private static async reviveFromToolMessage(
    callId: string,
    status: "completed" | "failed",
    output: Record<string, WidgetData> | null,
    logger: EndpointLogger,
  ): Promise<void> {
    // Deterministic callIds (fixture mode strips the random tail) recur across
    // streams, so several historical tool messages can carry this pendingCallId.
    // Newest-first + skip already-settled messages targets the CURRENTLY parked
    // dispatch instead of no-op-reviving a stale thread from an earlier run.
    const candidates = await db
      .select()
      .from(chatMessages)
      .where(
        sqlFn`${chatMessages.metadata}->'toolCall'->>'pendingCallId' = ${callId}`,
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(5);
    const msg =
      candidates.find((m) => {
        const s = m.metadata?.toolCall?.status;
        return s !== "completed" && s !== "failed";
      }) ?? candidates[0];
    if (msg?.metadata?.toolCall?.pendingCallInline === true) {
      logger.debug(
        "[RouteExecute] tool-execute-result: anchor belongs to a LIVE inline WAIT — handoff row delivers, skipping revival",
        { callId, toolMessageId: msg.id },
      );
      return;
    }
    if (!msg?.authorId || msg.authorId === "local") {
      logger.debug(
        "[RouteExecute] tool-execute-result: no pending call and no revivable tool message — dropped",
        { callId },
      );
      return;
    }

    const ownerCtx = await resolveTaskOwnerUser(
      dbUserIdToOwner(msg.authorId),
      defaultLocale,
      logger,
    );
    if (!ownerCtx) {
      return;
    }

    await TaskCompletion.handle({
      toolMessageId: msg.id,
      threadId: msg.threadId,
      callbackMode: CallbackMode.WAKE_UP,
      status,
      output,
      taskId: callId,
      modelId: msg.model,
      ownerUser: ownerCtx.user,
      logger,
      directResumeLocale: defaultLocale,
      abortSignal: new AbortController().signal,
      subAgentDepth: 0,
    });
  }
}
