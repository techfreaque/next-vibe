/**
 * Pre-execution gates: revival circuit-breaker, folder restrictions, tool
 * permission cascade, requiresConfirmation gate.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { getPreferredName } from "next-vibe/core/core-utils/path";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { TOOL_HELP_ALIAS } from "next-vibe/help-tool/constants";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { AiT } from "next-vibe/platforms/ai/i18n";

import type {
  DefaultFolderId,
  ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { FOLDER_DENIED_TOOL_IDS } from "@/app/api/[locale]/agent/chat/config";
import { isUuid } from "@/app/api/[locale]/agent/chat/slugify";
import { IMAGE_GEN_ALIAS } from "@/app/api/[locale]/agent/image-generation/constants";
import { MUSIC_GEN_ALIAS } from "@/app/api/[locale]/agent/music-generation/constants";
import { DEFAULT_SKILLS } from "@/app/api/[locale]/agent/skills/config";
import { customSkills } from "@/app/api/[locale]/agent/skills/db";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
} from "@/app/api/[locale]/agent/skills/favorites/db";
import { VIDEO_GEN_ALIAS } from "@/app/api/[locale]/agent/video-generation/constants";

import { AWAIT_TASK_ALIAS } from "../await-task/constants";
import { CallbackMode } from "../constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseOutput,
} from "../definition";
import type { ResolvedToolPermissions, ToolConfigItem } from "./types";

export class ExecuteToolGuards {
  /**
   * Tools that are always accessible regardless of the availableTools whitelist.
   *
   * Two groups:
   *  1. Infrastructure tools (tool-help, await-task) the AI needs to function —
   *     discovery + task management. Blocking them breaks basic agent operation.
   *  2. Media-generation tools (generate_image/video/music). Their availability is
   *     governed by the favorite/skill's mediaGen MODEL selection, not the regular
   *     availableTools whitelist: stream-setup.ts:filterUnavailableMediaTools only
   *     offers them to the model when a gen model is configured (and resolves the
   *     model at execution via media-gen-resolution.ts). A media tool that reaches
   *     execute-tool was therefore already legitimately offered, so re-blocking it
   *     via the availableTools whitelist is wrong — and inconsistent with the
   *     detach/wakeUp paths, which never ran this check. (Direct-mode T5d: the
   *     thea-cheap favorite configures imageGen but omits generate_image from
   *     availableTools, so the WAIT call was blocked while the detach call ran.)
   *
   * All exempt tools can still be hard-blocked via deniedTools when required.
   */
  private static readonly WHITELIST_EXEMPT_TOOLS = new Set<string>([
    TOOL_HELP_ALIAS,
    AWAIT_TASK_ALIAS,
    IMAGE_GEN_ALIAS,
    MUSIC_GEN_ALIAS,
    VIDEO_GEN_ALIAS,
  ]);

  /**
   * Whether a tool bypasses availableTools whitelists (infrastructure + media
   * tools — see WHITELIST_EXEMPT_TOOLS above). Used by the relay catalog
   * builder so it applies the SAME exemption the execution gate uses: a
   * whitelist must not strip tool-help/await-task/media from the advertised
   * catalog when the gate would allow them anyway.
   */
  static isWhitelistExemptTool(toolName: string): boolean {
    return (
      ExecuteToolGuards.WHITELIST_EXEMPT_TOOLS.has(toolName) ||
      ExecuteToolGuards.WHITELIST_EXEMPT_TOOLS.has(getPreferredName(toolName))
    );
  }

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
   * Resolve the effective tool permission set for a given context.
   *
   * Cascade (first non-null availableTools wins):
   *   1. Favorite's availableTools
   *   2. Skill's availableTools (resolved from favorite.skillId, then fallback skillId param)
   *   3. null (all tools allowed)
   *
   * Denied tools accumulate from all levels (union); folder-level hard blocks
   * (FOLDER_DENIED_TOOL_IDS) are applied last.
   *
   * Called by handleLocalExecute (to gate every tool call through
   * execute-tool) and by stream-setup.ts (to resolve the tool config before
   * stream start).
   */
  static async resolveToolPermissions(params: {
    favoriteId: string | undefined;
    skillId: string | undefined;
    userId: string | undefined;
    rootFolderId: DefaultFolderId;
  }): Promise<ResolvedToolPermissions> {
    const { favoriteId, skillId, userId, rootFolderId } = params;
    const deniedToolIds = new Set<string>();

    // Resolve favorite
    let fav: {
      skillId: string | null;
      availableTools: Array<{
        toolId: string;
        requiresConfirmation?: boolean | null;
      }> | null;
      deniedTools: Array<{
        toolId: string;
        requiresConfirmation?: boolean | null;
      }> | null;
    } | null = null;

    if (favoriteId && userId) {
      const condition = isUuid(favoriteId)
        ? eq(chatFavorites.id, favoriteId)
        : eq(chatFavorites.slug, favoriteId);
      const [row] = await db
        .select({
          skillId: FAVORITE_CONFIG_COLUMNS.skillId,
          availableTools: FAVORITE_CONFIG_COLUMNS.availableTools,
          deniedTools: FAVORITE_CONFIG_COLUMNS.deniedTools,
        })
        .from(chatFavorites)
        .where(condition)
        .limit(1);
      fav = row ?? null;
    }

    // Effective skillId: from favorite first, then caller-supplied fallback
    const effectiveSkillId = fav?.skillId ?? skillId ?? null;

    // Collect skill-level denied tools
    if (effectiveSkillId) {
      const defaultSkill = DEFAULT_SKILLS.find(
        (s) => s.id === effectiveSkillId,
      );
      if (defaultSkill) {
        for (const t of defaultSkill.deniedTools ?? []) {
          deniedToolIds.add(t.toolId);
        }
      } else {
        const cond = isUuid(effectiveSkillId)
          ? eq(customSkills.id, effectiveSkillId)
          : eq(customSkills.slug, effectiveSkillId);
        const [skillRow] = await db
          .select({ deniedTools: customSkills.deniedTools })
          .from(customSkills)
          .where(cond)
          .limit(1);
        for (const t of skillRow?.deniedTools ?? []) {
          deniedToolIds.add(t.toolId);
        }
      }
    }

    // Stack favorite denied tools
    for (const t of fav?.deniedTools ?? []) {
      deniedToolIds.add(t.toolId);
    }

    // Folder-level hard blocks
    for (const toolId of FOLDER_DENIED_TOOL_IDS[rootFolderId] ?? []) {
      deniedToolIds.add(toolId);
    }

    // 1. Favorite availableTools
    if (fav?.availableTools !== null && fav?.availableTools !== undefined) {
      return {
        availableTools: ExecuteToolGuards.normalizeItems(fav.availableTools),
        deniedToolIds,
      };
    }

    // 2. Skill availableTools
    if (effectiveSkillId) {
      const defaultSkill = DEFAULT_SKILLS.find(
        (s) => s.id === effectiveSkillId,
      );
      if (defaultSkill?.availableTools) {
        return {
          availableTools: ExecuteToolGuards.normalizeItems(
            defaultSkill.availableTools,
          ),
          deniedToolIds,
        };
      }

      if (!defaultSkill) {
        const cond = isUuid(effectiveSkillId)
          ? eq(customSkills.id, effectiveSkillId)
          : eq(customSkills.slug, effectiveSkillId);
        const [skillRow] = await db
          .select({ availableTools: customSkills.availableTools })
          .from(customSkills)
          .where(cond)
          .limit(1);
        if (
          skillRow?.availableTools !== null &&
          skillRow?.availableTools !== undefined
        ) {
          return {
            availableTools: ExecuteToolGuards.normalizeItems(
              skillRow.availableTools,
            ),
            deniedToolIds,
          };
        }
      }
    }

    // 3. All tools allowed
    return { availableTools: null, deniedToolIds };
  }

  /**
   * Check whether a specific toolName is permitted by the resolved permissions.
   * Returns null if permitted, or an error reason string if blocked.
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
      // Infrastructure tools are always accessible — blocking them via whitelist
      // breaks basic agent operation (tool discovery, task management).
      if (ExecuteToolGuards.isWhitelistExemptTool(toolName)) {
        return null;
      }

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
