/**
 * Pre-execution gates: revival circuit-breaker, folder restrictions, tool
 * permission cascade, requiresConfirmation gate.
 */

import "server-only";

import { getPreferredName } from "next-vibe/core/core-utils/path";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";

import type {
  DefaultFolderId,
  ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";

import { CallbackMode } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { ResolvedToolPermissions, ToolConfigItem } from "./types";

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
    streamContext: ToolExecutionContext;
    logger: EndpointLogger;
  }): RouteExecuteRequestOutput {
    const { data, toolName, instanceId, streamContext, logger } = params;

    if (instanceId && streamContext.isRevival) {
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
    streamContext: ToolExecutionContext;
    logger: EndpointLogger;
    t: AiT;
  }): Promise<ResponseType<RouteExecuteResponseOutput> | null> {
    const { data, toolName, instanceId, streamContext, logger, t } = params;

    const { FOLDER_ALLOWS_REMOTE_TOOLS, FOLDER_BLOCKED_CALLBACK_MODES } =
      await import("@/app/api/[locale]/agent/chat/config");

    if (
      instanceId &&
      FOLDER_ALLOWS_REMOTE_TOOLS[streamContext.rootFolderId] === false
    ) {
      logger.warn("[RouteExecute] Remote tool blocked for restricted folder", {
        toolName,
        instanceId,
        rootFolderId: streamContext.rootFolderId,
      });
      return fail({
        message: t("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const effectiveCallbackMode = data.callbackMode ?? CallbackMode.WAIT;
    const folderBlockedModes =
      FOLDER_BLOCKED_CALLBACK_MODES[streamContext.rootFolderId] ?? [];
    if (folderBlockedModes.includes(effectiveCallbackMode)) {
      logger.warn("[RouteExecute] Blocked callbackMode for restricted folder", {
        toolName,
        callbackMode: effectiveCallbackMode,
        rootFolderId: streamContext.rootFolderId,
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
      await import("@/app/api/[locale]/agent/skills/resolve-context");
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
    streamContext: ToolExecutionContext;
    logger: EndpointLogger;
  }): Promise<{ status: string; toolName: string } | null> {
    const { toolName, data, streamContext, logger } = params;
    if (
      data.callbackMode === "approve" ||
      streamContext.isConfirmedReExecution === true ||
      (streamContext.headless === true && streamContext.relayReceiver !== true)
    ) {
      return null;
    }
    const { getEndpoint } = await import("@/generated/endpoints/endpoint");
    const targetEndpoint = await getEndpoint(toolName);
    const contextRequiresConfirmation =
      streamContext.confirmationOverrides?.some(
        (o) =>
          o.requiresConfirmation &&
          (o.toolId === toolName ||
            (targetEndpoint ? o.toolId === getPreferredName(toolName) : false)),
      ) ?? false;
    logger.debug("[RouteExecute] Confirmation gate evaluated", {
      toolName,
      headless: streamContext.headless,
      relayReceiver: streamContext.relayReceiver,
      overrideCount: streamContext.confirmationOverrides?.length ?? 0,
      overrideToolIds:
        streamContext.confirmationOverrides
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
    const callerToolCallId = streamContext.callerToolCallId;
    if (callerToolCallId && streamContext.pendingToolMessages) {
      const pending = streamContext.pendingToolMessages.get(callerToolCallId);
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
    streamContext.stepHasToolsAwaitingConfirmation = true;
    return { status: "waiting_for_confirmation", toolName };
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
