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

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { CountryLanguage } from "../../core/i18n/core/config";
import type { GenericHandlerBase } from "../../core/route/handler";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { AiT } from "../../platforms/ai/i18n";
import type { Platform } from "../../platforms/platforms";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import { parseDispatchEnvelope } from "./envelope";
import { ExecuteToolGuards } from "./guards";
import { LocalExecution } from "./local";
import { logToolLine } from "./log-line";
// THE SEAM: every non-local branch (remote dispatch, APPROVE, DETACH/WAKE_UP)
// and the model cascade they need. A local-only deployment (CLI + MCP, no task
// system, no remote instances) points this single import at ./orchestration-local
// and drops orchestration.ts + remote.ts + completion.ts + local-async.ts.
import { orchestrateNonLocal, resolveModelIdIfNeeded } from "./orchestration";
import type { RouteExecuteDispatchContext } from "./types-dispatch";

export class RouteExecuteRepository {
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiT,
    toolExecutionContext: ToolExecutionContext,
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
    const _execStart = Date.now();
    let _toolName = data.toolName;
    try {
      // Bail out immediately if the stream was cancelled before tool execution started.
      // The abort signal fires when StreamRegistry.cancel() is called - any DB writes
      // or network calls after this point would create orphaned rows.
      if (toolExecutionContext.abortSignal.aborted) {
        logger.debug(
          "[RouteExecute] Stream was cancelled before tool execution started - skipping",
          { toolName: data.toolName },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Normalize execute-tool's own envelope words (instance prefix,
      // callbackMode) — see ./envelope for why that is a dispatch concern.
      const envelope = parseDispatchEnvelope({ data, user, logger });
      const { toolName, instanceId, input } = envelope;
      data = envelope.data;
      _toolName = toolName;

      // Remote execution path - create a one-shot task for the target instance.
      // Revival circuit-breaker: auto-upgrade remote WAIT → WAKE_UP in revival
      // streams (loop prevention). See applyRevivalGuard for the full rationale.
      data = ExecuteToolGuards.applyRevivalGuard({
        data,
        toolName,
        instanceId,
        toolExecutionContext,
        logger,
      });

      // Folder-type restrictions: block remote tools and async callback modes
      // for incognito/public folders (defense in depth - tools-loader also blocks these).
      const folderRestriction = await ExecuteToolGuards.checkFolderRestrictions(
        {
          data,
          toolName,
          instanceId,
          toolExecutionContext,
          logger,
          t,
        },
      );
      if (folderRestriction) {
        return folderRestriction;
      }

      const callbackMode = data.callbackMode ?? null;

      // Model cascade — only remote/WAKE_UP need it, so it resolves behind the
      // same seam as the branches that consume it (null on the local WAIT path).
      const resolvedModelId = await resolveModelIdIfNeeded({
        instanceId,
        callbackMode,
        user,
        toolExecutionContext,
      });

      // Shared context for every phase handler. toolName/instanceId are already
      // post-prefix; resolvedModelId is the cascade result stored for revival.
      // Built as the dispatch variant — LocalExecution asks only for the local
      // RouteExecuteContext this intersects, so one object serves both sides.
      const ctx: RouteExecuteDispatchContext = {
        toolName,
        resolvedModelId,
        user,
        locale,
        logger,
        t,
        toolExecutionContext,
        platform,
        preloadedHandler,
        urlPathParams,
      };

      // Everything that is NOT "run it here, now, inline" — remote dispatch,
      // APPROVE, DETACH/WAKE_UP — lives behind this one seam. Returns a response
      // to short-circuit, or null to fall through to the local WAIT path below.
      const nonLocal = await orchestrateNonLocal({
        ctx,
        data,
        input,
        instanceId,
        callbackMode,
        user,
        logger,
        toolName,
      });
      if (nonLocal) {
        logToolLine(
          logger,
          toolName,
          callbackMode,
          Date.now() - _execStart,
          nonLocal,
          platform,
        );
        return nonLocal;
      }

      // Local WAIT: confirmation gate + inline execution.
      const waitResult = await LocalExecution.execute({
        ctx,
        data,
        input,
        instanceId,
        callbackMode,
      });
      logToolLine(
        logger,
        toolName,
        callbackMode,
        Date.now() - _execStart,
        waitResult,
        platform,
      );
      if (!waitResult.success) {
        return waitResult;
      }
      // Wrap local WAIT data in `result` to satisfy the route schema.
      // Preserves isErrorResponse / performance for CLI exit codes and timing.
      return success(
        { result: waitResult.data },
        {
          ...(waitResult.isErrorResponse && { isErrorResponse: true }),
          ...(waitResult.performance && {
            performance: waitResult.performance,
          }),
        },
      );
    } catch (error) {
      const msg = parseError(error).message;
      logToolLine(
        logger,
        _toolName,
        data.callbackMode ?? null,
        Date.now() - _execStart,
        { success: false, message: msg },
        platform,
      );
      logger.error("[RouteExecute] Failed", {
        toolName: data.toolName,
        error: msg,
        stack: error instanceof Error ? (error.stack ?? "") : "",
      });
      return fail({
        message: t("executeTool.post.errors.unknown.detail", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
