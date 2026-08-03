/**
 * Pre-execution gates: revival circuit-breaker, folder restrictions, tool
 * permission cascade, requiresConfirmation gate.
 */

import "server-only";

import type {
  DefaultFolderId,
  ToolExecutionContext,
} from "next-vibe/core/execution-context";
import { getPreferredName } from "../../core/core-utils/path";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { AiT } from "../../platforms/ai/i18n";

import { CallbackMode } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { RouteExecuteContext } from "./types";

/** Structurally identical to chat/settings' ToolConfigItem — redeclared here so
 * the execute-tool type graph never pulls a full endpoint-definition module. */
export interface ToolConfigItem {
  toolId: string;
  requiresConfirmation: boolean;
}

export interface ResolvedToolPermissions {
  /** Whitelist: null = all tools allowed; array = only these may execute */
  availableTools: ToolConfigItem[] | null;
  /** Union of skill + favorite + folder hard-blocked tool IDs */
  deniedToolIds: Set<string>;
}

export class ExecuteToolGuards {
  /**
   * Revival circuit-breaker: headless revival streams (resume-stream after a
   * wakeUp task completed) must not create new remote WAIT dispatches — each
   * revival would call execute-tool, create a task, wait, resume-stream again,
   * looping forever. When dispatching to a remote instance inside a revival
   * stream, a WAIT callbackMode is auto-upgraded to WAKE_UP so the remote task
   * completes asynchronously and the result is injected via resume-stream.
   * Only revival streams (isRevival=true) are upgraded, NOT all headless
   * streams. In every other case `data` is returned unchanged.
   */
  static applyRevivalGuard(params: {
    data: RouteExecuteRequestOutput;
    toolName: string;
    instanceId: string | undefined;
    toolExecutionContext: ToolExecutionContext;
    logger: EndpointLogger;
  }): RouteExecuteRequestOutput {
    const { data, toolName, instanceId, toolExecutionContext, logger } = params;

    if (instanceId && toolExecutionContext.isRevival) {
      const callbackMode = data.callbackMode ?? CallbackMode.WAIT;
      if (callbackMode === CallbackMode.WAIT) {
        logger.debug(
          "[RouteExecute] Auto-upgrading remote WAIT to WAKE_UP in revival stream (loop prevention)",
          { toolName, instanceId },
        );
        return { ...data, callbackMode: CallbackMode.WAKE_UP };
      }
    }

    return data;
  }

  /**
   * Folder-type restrictions: returns a fail() response when the active folder
   * forbids the requested remote tool or callback mode, otherwise null (the
   * call is allowed to proceed). Blocks remote tools and async callback modes
   * for incognito/public folders (defense in depth — tools-loader also blocks
   * these).
   */
  static async checkFolderRestrictions(params: {
    data: RouteExecuteRequestOutput;
    toolName: string;
    instanceId: string | undefined;
    toolExecutionContext: ToolExecutionContext;
    logger: EndpointLogger;
    t: AiT;
  }): Promise<ResponseType<RouteExecuteResponseOutput> | null> {
    const { data, toolName, instanceId, toolExecutionContext, logger, t } =
      params;

    const { FOLDER_ALLOWS_REMOTE_TOOLS, FOLDER_BLOCKED_CALLBACK_MODES } =
      await import("../../agent/chat/config");

    if (
      instanceId &&
      FOLDER_ALLOWS_REMOTE_TOOLS[toolExecutionContext.rootFolderId] === false
    ) {
      logger.warn("[RouteExecute] Remote tool blocked for restricted folder", {
        toolName,
        instanceId,
        rootFolderId: toolExecutionContext.rootFolderId,
      });
      return fail({
        message: t("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const effectiveCallbackMode = data.callbackMode ?? CallbackMode.WAIT;
    const folderBlockedModes =
      FOLDER_BLOCKED_CALLBACK_MODES[toolExecutionContext.rootFolderId] ?? [];
    if (folderBlockedModes.includes(effectiveCallbackMode)) {
      logger.warn("[RouteExecute] Blocked callbackMode for restricted folder", {
        toolName,
        callbackMode: effectiveCallbackMode,
        rootFolderId: toolExecutionContext.rootFolderId,
      });
      return fail({
        message: t("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    return null;
  }

  /**
   * Resolve the effective execute-tool permission set for a context — a thin
   * adapter over THE central cascade (resolveAgentContext). Returns the CALLABLE
   * superset (pinned ∪ available) + the denied union. The caller (local.ts)
   * already holds the user + rootFolderId from the stream context.
   */
  static async resolveToolPermissions(params: {
    favoriteId: string | undefined;
    skillId: string | undefined;
    user: JwtPayloadType;
    rootFolderId: DefaultFolderId;
    logger: EndpointLogger;
  }): Promise<ResolvedToolPermissions> {
    const { resolveAgentContext } =
      await import("../../agent/skills/resolve-context");
    const resolved = await resolveAgentContext({
      favoriteId: params.favoriteId,
      skillId: params.skillId,
      user: params.user,
      rootFolderId: params.rootFolderId,
      logger: params.logger,
    });
    return {
      availableTools: resolved.availableTools,
      deniedToolIds: resolved.deniedToolIds,
    };
  }

  /**
   * Check whether a specific toolName may be CALLED. `availableTools` is the
   * truth: the resolved callable set for this context. `availableTools === null`
   * means ALL tools for the caller's role are callable (no skill/favorite
   * restriction). When non-null, the tool must be in it. `deniedToolIds` always
   * subtracts. The endpoint's own `allowedRoles` filters on top separately (the
   * route layer). Returns null if permitted, else an error reason.
   */
  static checkToolPermission(
    toolName: string,
    permissions: ResolvedToolPermissions,
  ): "denied" | "not_in_whitelist" | null {
    const preferred = getPreferredName(toolName);

    if (
      permissions.deniedToolIds.has(toolName) ||
      permissions.deniedToolIds.has(preferred)
    ) {
      return "denied";
    }

    if (permissions.availableTools !== null) {
      const allowed = permissions.availableTools.some(
        (t) => t.toolId === toolName || t.toolId === preferred,
      );
      if (!allowed) {
        return "not_in_whitelist";
      }
    }

    return null;
  }

  /**
   * requiresConfirmation gate — applies to the TARGET tool uniformly, wherever
   * it runs (local execute AND remote dispatch). When the target requires
   * confirmation (endpoint definition or the favorite/skill/request confirmation
   * cascade) and this call is not already confirmed, the tool must NOT run:
   * the pending tool message is flipped to waitingForConfirmation and the stream
   * aborts at finish-step (TOOL_CONFIRMATION); phase-2 re-executes confirmed.
   *
   * Skipped for plain headless callers (MCP/CLI/cron — no confirmation UI;
   * the mechanism is stream-only), but NOT for ws-provider receiver loops
   * (relayReceiver): those mirror a live session whose originator has the UI.
   *
   * Returns the waiting placeholder when the gate fires, null to proceed.
   */
  static async applyConfirmationGate(params: {
    toolName: string;
    data: { callbackMode?: string | null };
    toolExecutionContext: ToolExecutionContext;
    logger: EndpointLogger;
  }): Promise<{ status: string; toolName: string } | null> {
    const { toolName, data, toolExecutionContext, logger } = params;
    if (
      data.callbackMode === "approve" ||
      toolExecutionContext.isConfirmedReExecution === true ||
      (toolExecutionContext.headless === true &&
        toolExecutionContext.relayReceiver !== true)
    ) {
      return null;
    }
    const { getEndpoint } = await import("@/generated/endpoints/endpoint");
    const targetEndpoint = await getEndpoint(toolName);
    const contextRequiresConfirmation =
      toolExecutionContext.confirmationOverrides?.some(
        (o) =>
          o.requiresConfirmation &&
          (o.toolId === toolName ||
            (targetEndpoint ? o.toolId === getPreferredName(toolName) : false)),
      ) ?? false;
    logger.debug("[RouteExecute] Confirmation gate evaluated", {
      toolName,
      headless: toolExecutionContext.headless,
      relayReceiver: toolExecutionContext.relayReceiver,
      overrideCount: toolExecutionContext.confirmationOverrides?.length ?? 0,
      overrideToolIds:
        toolExecutionContext.confirmationOverrides
          ?.filter((o) => o.requiresConfirmation)
          .map((o) => o.toolId)
          .join(",") ?? "",
      endpointRequiresConfirmation:
        targetEndpoint?.requiresConfirmation === true,
      contextRequiresConfirmation,
    });
    if (!targetEndpoint?.requiresConfirmation && !contextRequiresConfirmation) {
      return null;
    }
    logger.debug(
      "[RouteExecute] Target requires confirmation - backfilling tool message and halting",
      { toolName },
    );
    // Mutate the pending tool message entry so tool-result-handler builds the
    // final toolCall with waitingForConfirmation=true. Without this it spreads
    // toolCallData.toolCall (waitingForConfirmation=false for execute-tool)
    // and overwrites any DB update made here.
    const callerToolCallId = toolExecutionContext.callerToolCallId;
    if (callerToolCallId && toolExecutionContext.pendingToolMessages) {
      const pending =
        toolExecutionContext.pendingToolMessages.get(callerToolCallId);
      if (pending?.toolCallData) {
        pending.toolCallData.toolCall = {
          ...pending.toolCallData.toolCall,
          requiresConfirmation: true,
          waitingForConfirmation: true,
          isConfirmed: false,
        };
      }
    }
    // Signal the stream to abort at finish-step before the AI response turn.
    toolExecutionContext.stepHasToolsAwaitingConfirmation = true;
    return { status: "waiting_for_confirmation", toolName };
  }

  /**
   * The whole pre-execution gate for a local call, in one entry point: the
   * permission cascade followed by the requiresConfirmation gate.
   *
   * Both gates need an agent context to mean anything — the cascade reads
   * favoriteId/skillId, and the confirmation gate returns early for a plain
   * headless caller because confirmation is a stream-only mechanism. Bundling
   * them here keeps ./local.ts down to one call, so a deployment with neither
   * favorites/skills nor a confirmation UI declines this module rather than
   * editing two inline blocks out of the execution path.
   *
   * Returns a response to short-circuit with, or null to proceed to execution.
   * Ordering is load-bearing and unchanged: permissions first (a denied tool
   * must never reach the confirmation UI), confirmation second.
   */
  static async preflight(params: {
    ctx: RouteExecuteContext;
    callbackMode: string | null | undefined;
    instanceId: string | undefined;
  }): Promise<ResponseType<WidgetData> | null> {
    const { ctx, callbackMode, instanceId } = params;
    const { toolName, user, logger, t, toolExecutionContext } = ctx;

    // Resolve the callable tool set (pinned ∪ available) + denied via THE central
    // cascade (favorite → skill → NO_SKILL/role defaults). Uses the toolExecutionContext's
    // favoriteId/skillId set by the AI loop that called us; folder blocks fold in.
    const permissions = await ExecuteToolGuards.resolveToolPermissions({
      favoriteId: toolExecutionContext.favoriteId,
      skillId: toolExecutionContext.skillId,
      user,
      rootFolderId: toolExecutionContext.rootFolderId,
      logger,
    });

    const permissionBlock = ExecuteToolGuards.checkToolPermission(
      toolName,
      permissions,
    );
    if (permissionBlock !== null) {
      logger.warn("[RouteExecute] execute-tool denied by permission cascade", {
        toolName,
        reason: permissionBlock,
        rootFolderId: toolExecutionContext.rootFolderId,
        deniedToolIds: [...permissions.deniedToolIds],
        whitelistSize: permissions.availableTools?.length ?? null,
      });
      return fail({
        message: t("executeTool.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Enforce requiresConfirmation for the TARGET tool — shared gate with the
    // remote dispatch path: the endpoint definition AND the per-context
    // confirmation cascade both apply uniformly wherever the tool would run.
    if (!instanceId) {
      const gate = await ExecuteToolGuards.applyConfirmationGate({
        toolName,
        data: { callbackMode },
        toolExecutionContext,
        logger,
      });
      if (gate) {
        return success(gate);
      }
    }

    return null;
  }

  private static normalizeItems(
    items:
      | Array<{ toolId: string; requiresConfirmation?: boolean | null }>
      | null
      | undefined,
  ): ToolConfigItem[] | null {
    if (!items) {
      return null;
    }
    return items.map((item) => ({
      toolId: item.toolId,
      requiresConfirmation: item.requiresConfirmation ?? false,
    }));
  }
}
