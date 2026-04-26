/**
 * AI Stream Run Repository
 *
 * 1. Execute pre-calls sequentially (split flat args → urlPathParams + data)
 * 2. Build a context block from results, prepend to user prompt
 * 3. Run headless AI stream (no SSE, DB persistence only)
 * 4. Read last assistant message from DB, strip think-tags
 * 5. Return text + token counts + per-call results
 */

import "server-only";

import { and, eq, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { getDefaultToolIdsForUser } from "@/app/api/[locale]/agent/chat/constants";
import { chatMessages, chatThreads } from "@/app/api/[locale]/agent/chat/db";
import {
  chatFavorites,
  FAVORITE_CONFIG_COLUMNS,
  type FavoriteConfig,
} from "@/app/api/[locale]/agent/chat/favorites/db";
import {
  buildFavoriteConfig,
  resolveFavoriteConfig,
} from "@/app/api/[locale]/agent/chat/favorites/repository";
import { NO_SKILL_ID } from "@/app/api/[locale]/agent/chat/skills/constants";
import { SkillsRepository } from "@/app/api/[locale]/agent/chat/skills/repository";
import { db } from "@/app/api/[locale]/system/db";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { HeadlessPreCall } from "../repository/headless";
import { runHeadlessAiStream } from "../repository/headless";
import type { AiStreamT } from "../stream/i18n";
import type {
  AiStreamRunPostRequestOutput,
  AiStreamRunPostResponseOutput,
} from "./definition";

export class AiStreamRunRepository {
  /**
   * Strip <think>...</think> reasoning tags from AI message content.
   * Handles both complete tags and incomplete (streaming-cut) trailing tags.
   */
  private static stripThinkTags(content: string): string {
    let result = content.replace(/<think>[\s\S]*?<\/think>/gi, "");
    result = result.replace(/<think>[\s\S]*$/i, "");
    // Strip orphaned closing tags left when opening tag was in a prior DB chunk
    result = result.replace(/<\/think>/gi, "");
    return result.trim();
  }

  /**
   * Execute a single pre-call and return its result.
   * Args are passed as flat merged data - RouteExecutionExecutor auto-splits
   * urlPathParams from data using the endpoint's requestUrlPathParamsSchema.
   */
  private static async executePreCall(
    routeId: string,
    mergedArgs: Record<string, WidgetData>,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    streamContext: ToolExecutionContext,
  ): Promise<
    ResponseType<{
      routeId: string;
      args: Record<string, WidgetData>;
      data: Record<string, WidgetData>;
    }>
  > {
    logger.debug("[AiStreamRun] Executing pre-call", { routeId });

    const result = await RouteExecutionExecutor.executeGenericHandler<
      Record<string, WidgetData>
    >({
      toolName: routeId,
      data: mergedArgs,
      user,
      locale,
      logger,
      platform: Platform.AI,
      streamContext,
    });

    if (!result.success) {
      return fail({
        message:
          result.message ?? "app.api.agent.ai-stream.run.errors.preCallFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success({
      routeId,
      args: mergedArgs,
      data: result.data,
    });
  }

  static async run(
    data: AiStreamRunPostRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiStreamT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<AiStreamRunPostResponseOutput>> {
    try {
      const {
        prompt,
        model,
        skill,
        favoriteId,
        preCalls,
        instructions,
        maxTurns,
        availableTools,
        pinnedTools,
        appendThreadId,
        rootFolderId: rootFolderIdRaw,
        subFolderId,
        excludeMemories,
      } = data;

      const rootFolderId = rootFolderIdRaw ?? DefaultFolderId.CRON;

      // Derive thread mode from fields:
      // incognito rootFolder → no persistence; appendThreadId present → append; else → new
      const isIncognito = rootFolderId === DefaultFolderId.INCOGNITO;
      const headlessThreadMode: "none" | "new" | "append" = isIncognito
        ? "none"
        : appendThreadId
          ? "append"
          : "new";

      // ── Step 1: Execute pre-calls sequentially ──────────────────────────
      const preCallResults: Array<{
        routeId: string;
        args: Record<string, WidgetData>;
        success: boolean;
        data?: WidgetData;
        error?: string;
        executionTimeMs?: number;
      }> = [];

      const preCallAbortController = new AbortController();

      if (preCalls && preCalls.length > 0) {
        for (const call of preCalls) {
          const startTime = Date.now();
          const result = await AiStreamRunRepository.executePreCall(
            call.routeId,
            call.args as Record<string, WidgetData>,
            user,
            locale,
            logger,
            {
              rootFolderId,
              threadId: undefined,
              aiMessageId: undefined,
              currentToolMessageId: undefined,
              callerToolCallId: undefined,
              pendingToolMessages: undefined,
              pendingTimeoutMs: undefined,
              leafMessageId: undefined,
              skillId: undefined,
              favoriteId: undefined,
              headless: undefined,
              subAgentDepth: streamContext.subAgentDepth ?? 0,
              waitingForRemoteResult: undefined,
              pendingEscalatedTaskId: undefined,
              cancelPendingStreamTimer: undefined,
              abortSignal: preCallAbortController.signal,
              escalateToTask: undefined,
              callerCallbackMode: undefined,
              onEscalatedTaskCancel: undefined,
              isRevival: false,
              providerOverride: undefined,
            },
          );
          preCallResults.push({
            routeId: result.success ? result.data.routeId : call.routeId,
            args: result.success
              ? result.data.args
              : (call.args as Record<string, WidgetData>),
            success: result.success,
            data: result.success ? result.data.data : undefined,
            error: result.success ? undefined : result.message,
            executionTimeMs: Date.now() - startTime,
          });
        }
      }

      logger.debug("[AiStreamRun] Running headless stream", {
        model,
        promptLength: prompt.length,
        preCallCount: preCallResults.length,
      });

      // Map to HeadlessPreCall format for proper tool message injection
      const headlessPreCalls: HeadlessPreCall[] = preCallResults.map(
        (r): HeadlessPreCall => ({
          routeId: r.routeId,
          args: r.args,
          result: r.data ?? null,
          success: r.success,
          error: r.error,
          executionTimeMs: r.executionTimeMs,
        }),
      );

      // ── Step 2: Resolve tool config from favorite ────────────────────────
      // Resolve parent's favorite on demand from favoriteId (picks up latest DB state).
      const parentFavConfig = await resolveFavoriteConfig(
        streamContext.favoriteId,
        user.isPublic ? undefined : user.id,
      );
      let resolvedPinnedTools = pinnedTools;
      let resolvedAvailableTools = availableTools;
      if (!pinnedTools && parentFavConfig?.pinnedTools) {
        resolvedPinnedTools = parentFavConfig.pinnedTools.map((entry) => ({
          toolId: entry.toolId,
          requiresConfirmation: entry.requiresConfirmation ?? false,
        }));
      }
      if (!availableTools && parentFavConfig?.availableTools) {
        resolvedAvailableTools = parentFavConfig.availableTools.map(
          (entry) => ({
            toolId: entry.toolId,
            requiresConfirmation: entry.requiresConfirmation ?? false,
          }),
        );
      }

      // ── Step 2b: Resolve tool config from skill definition if needed ─────
      // When skill is set and tools are still not resolved, load from the skill's
      // availableTools / pinnedTools config (same as interactive chat does).
      if (skill && (!resolvedPinnedTools || !resolvedAvailableTools)) {
        const skillDef = await SkillsRepository.getSkillById(
          { id: skill },
          user,
          logger,
          locale,
        );
        if (skillDef.success) {
          const {
            availableTools: skillAvailableTools,
            pinnedTools: skillPinnedTools,
          } = skillDef.data;
          if (!resolvedAvailableTools && skillAvailableTools) {
            resolvedAvailableTools = skillAvailableTools.map((entry) => ({
              toolId: entry.toolId,
              requiresConfirmation: entry.requiresConfirmation ?? false,
            }));
          }
          if (!resolvedPinnedTools && skillPinnedTools) {
            resolvedPinnedTools = skillPinnedTools.map((entry) => ({
              toolId: entry.toolId,
              requiresConfirmation: entry.requiresConfirmation ?? false,
            }));
          }
        }
      }

      // When tools is still not provided, inject base tools (same as interactive chat defaults)
      // so the AI can call execute-tool, web-search, fetch-url, memories, etc.
      const defaultTools = getDefaultToolIdsForUser(user).map((id) => ({
        toolId: id,
        requiresConfirmation: false,
      }));

      // ── Sub-agent favorite override ──────────────────────────────────────
      // When called from within an active stream (via execute-tool), check if
      // the invoking favorite has a subAgentFavoriteId set. If so, the sub-agent
      // inherits that favorite's full config instead of the parent's.
      // null = task isolation (default); set = power-user override.
      let effectiveFavoriteId = favoriteId;
      let subAgentOverrideConfig: FavoriteConfig | null = null;
      if (streamContext.favoriteId) {
        const userId = user.isPublic ? undefined : user.id;
        if (userId) {
          const [invokingFavorite] = await db
            .select({ subAgentFavoriteId: chatFavorites.subAgentFavoriteId })
            .from(chatFavorites)
            .where(
              and(
                or(
                  eq(chatFavorites.id, streamContext.favoriteId),
                  eq(chatFavorites.slug, streamContext.favoriteId),
                ),
                eq(chatFavorites.userId, userId),
              ),
            )
            .limit(1);

          if (invokingFavorite?.subAgentFavoriteId) {
            effectiveFavoriteId = invokingFavorite.subAgentFavoriteId;
            // Load the override favorite's full config
            const [overrideFav] = await db
              .select(FAVORITE_CONFIG_COLUMNS)
              .from(chatFavorites)
              .where(
                and(
                  eq(chatFavorites.id, invokingFavorite.subAgentFavoriteId),
                  eq(chatFavorites.userId, userId),
                ),
              )
              .limit(1);
            if (overrideFav) {
              subAgentOverrideConfig = overrideFav;
            }
          }
        }
      }

      // ── Companion soul injection ─────────────────────────────────────────
      // When ai-run is called from within an active AI stream (via execute-tool),
      // streamContext.skillId holds the calling companion's skill ID.
      // If that companion has a companionPrompt set, prepend it to instructions
      // so the sub-agent inherits the companion's soul fragment.
      // Works at any nesting depth: each level's streamContext.skillId is the
      // immediate caller, so the soul always travels one hop at a time.
      let effectiveInstructions = instructions;
      if (streamContext.skillId) {
        const companionPrompt = await SkillsRepository.getCompanionPrompt(
          streamContext.skillId,
        );
        if (companionPrompt) {
          effectiveInstructions = effectiveInstructions
            ? `${companionPrompt}\n\n${effectiveInstructions}`
            : companionPrompt;
        }
      }

      // ── Step 3: Run headless AI stream ──────────────────────────────────
      // Pre-call results are injected as proper tool messages in the thread
      // Increment sub-agent depth: parent's depth + 1
      const parentDepth = streamContext.subAgentDepth ?? 0;

      // Build FavoriteConfig for sub-agent headless stream.
      // If subAgentFavoriteId override fired, use that favorite's full config.
      // Otherwise inherit ALL model selections + context from parent's resolved config.
      // Only tool config may differ (sub-agent resolves its own tools above).
      const parentConfig = subAgentOverrideConfig ?? parentFavConfig;
      const headlessFavoriteConfig: FavoriteConfig = buildFavoriteConfig({
        ...(parentConfig ?? {}),
        id: effectiveFavoriteId ?? parentConfig?.id ?? "ai-run",
        skillId: skill ?? parentConfig?.skillId ?? NO_SKILL_ID,
        availableTools: resolvedAvailableTools ?? null,
        pinnedTools: resolvedPinnedTools ?? defaultTools,
      });

      const streamResult = await runHeadlessAiStream({
        favoriteId: effectiveFavoriteId,
        model,
        skill,
        prompt,
        favoriteConfig: headlessFavoriteConfig,
        headlessInstructions: effectiveInstructions,
        maxTurns,
        threadId: appendThreadId,
        subFolderId,
        rootFolderId,
        subAgentDepth: parentDepth + 1,
        preCalls: headlessPreCalls.length > 0 ? headlessPreCalls : undefined,
        excludeMemories: excludeMemories ?? false,
        user,
        locale,
        logger,
        t,
        // Emit partial tool result with threadId so the parent UI can start
        // rendering sub-thread messages before the headless stream finishes.
        onThreadCreated: streamContext.emitPartialToolResult
          ? async (subThreadId: string): Promise<void> => {
              await streamContext.emitPartialToolResult!({
                threadId: subThreadId,
              });
            }
          : undefined,
        // Propagate parent cancellation: when the parent stream is aborted,
        // the sub-agent stream stops too.
        abortSignal: streamContext.abortSignal,
      });

      if (!streamResult.success) {
        return streamResult;
      }

      const { lastAiMessageId, threadId, lastAiMessageContent } =
        streamResult.data;

      // ── Step 4: Read message content + tokens from DB ───────────────────
      // For incognito mode, messages aren't persisted - use in-memory content directly.
      // For persistent modes, DB read also provides token metadata.
      let rawText: string | null = lastAiMessageContent ?? null;
      let promptTokens: number | null = null;
      let completionTokens: number | null = null;
      let creditCost: number | null = null;

      if (!isIncognito) {
        const [aiMessage] = await db
          .select({
            content: chatMessages.content,
            metadata: chatMessages.metadata,
          })
          .from(chatMessages)
          .where(eq(chatMessages.id, lastAiMessageId))
          .limit(1);

        rawText = aiMessage?.content ?? rawText;
        promptTokens = aiMessage?.metadata?.promptTokens ?? null;
        completionTokens = aiMessage?.metadata?.completionTokens ?? null;
        creditCost = aiMessage?.metadata?.creditCost ?? null;
      }

      const text = rawText
        ? AiStreamRunRepository.stripThinkTags(rawText)
        : null;
      const resultThreadId =
        (headlessThreadMode !== "none" ? threadId : null) ?? null;

      // ── Step 5: Fetch thread metadata if persisted ───────────────────────
      let threadTitle: string | null = null;
      let threadCreatedAt: string | null = null;

      if (resultThreadId) {
        const [thread] = await db
          .select({
            title: chatThreads.title,
            createdAt: chatThreads.createdAt,
          })
          .from(chatThreads)
          .where(eq(chatThreads.id, resultThreadId))
          .limit(1);

        threadTitle = thread?.title ?? null;
        threadCreatedAt = thread?.createdAt?.toISOString() ?? null;
      }

      logger.debug("[AiStreamRun] Complete", {
        lastAiMessageId,
        threadId: resultThreadId,
        textLength: text?.length ?? 0,
        promptTokens,
        completionTokens,
      });

      return success({
        text,
        threadId: resultThreadId,
        lastAiMessageId: headlessThreadMode !== "none" ? lastAiMessageId : null,
        threadTitle,
        threadCreatedAt,
        promptTokens,
        completionTokens,
        creditCost,
        preCallResults: preCallResults.map((r) => ({
          routeId: r.routeId,
          success: r.success,
          error: r.error ?? null,
        })),
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[AiStreamRun] Failed", { error: msg });
      return fail({
        message: t("errors.unexpectedError", { error: msg }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
