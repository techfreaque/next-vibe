/**
 * System Prompt Builder
 *
 * Server-only orchestration layer. Resolves user context, loads dynamic data
 * in parallel (character, memories, tasks), detects admin / fresh-user state,
 * then delegates to the isomorphic generator for actual prompt construction.
 *
 * Flow:
 *   Step 1 — Resolve user context (userId, isAdmin, isPublicUser)
 *   Step 2 — Load dynamic data in parallel (character prompt, memories, tasks)
 *   Step 3 — Detect fresh-user state, generate system prompt
 *   Step 4 — Return result
 */

import "server-only";

import { eq, sql } from "drizzle-orm";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { buildTrailingSystemMessage, generateSystemPrompt } from "./generator";

/**
 * Result returned by buildSystemPrompt.
 * Memories and tasks are returned separately so the caller can inject them
 * as distinct system messages (they appear between [Context:] tags in the thread).
 */
export interface SystemPromptResult {
  systemPrompt: string;
  /** Pre-built trailing system message string (tasks + memories + favorites).
   *  Injected as a single system message right before the [Context:] line.
   *  Empty string = nothing to inject. */
  trailingSystemMessage: string;
  /** Raw summaries — kept for compacting token calculation and debug view */
  memorySummary: string;
  tasksSummary: string;
  favoritesSummary: string;
}

export async function buildSystemPrompt(params: {
  characterId: string | null | undefined;
  user: JwtPayloadType;
  logger: EndpointLogger;
  t: TFunction;
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  callMode: boolean | null | undefined;
  extraInstructions?: string;
  headless?: boolean;
  excludeMemories?: boolean;
  threadId: string | null;
  voiceTranscription?: {
    wasTranscribed: boolean;
    confidence: number | null;
  } | null;
}): Promise<SystemPromptResult> {
  const {
    characterId,
    user,
    logger,
    t,
    locale,
    rootFolderId,
    subFolderId,
    callMode,
    extraInstructions,
    headless,
    excludeMemories,
    threadId,
    voiceTranscription,
  } = params;

  // ─── Step 1: Resolve user context ───────────────────────────────────────

  const userId = user.isPublic ? undefined : user.id;
  const isPublicUser = user.isPublic;

  // Admin check: derive from JWT roles (roles are signed into the token at login, trusted)
  const isAdmin =
    !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

  logger.debug("Building system prompt", {
    hasCharacterId: !!characterId,
    hasUserId: !!userId,
    isAdmin,
    isPublicUser,
    rootFolderId,
    subFolderId,
    callMode,
  });

  // ─── Step 2: Load dynamic data in parallel ───────────────────────────────

  let characterPrompt = "";
  let memorySummary = "";
  let tasksSummary = "";
  let favoritesSummary = "";
  let userName = "";
  let remoteInstancesContext = "";

  // Incognito mode: never load personal data (memories, tasks, favorites)
  const isIncognito = rootFolderId === "incognito";
  // Public/shared folders: filter out private data to prevent leaking into visible threads
  const isExposedFolder =
    rootFolderId === "public" || rootFolderId === "shared";

  if (userId) {
    const [
      { generateMemorySummary },
      { generateTasksSummary },
      { generateFavoritesSummary },
      { CharactersRepository },
    ] = await Promise.all([
      import("@/app/api/[locale]/agent/chat/memories/repository"),
      import("@/app/api/[locale]/system/unified-interface/tasks/cron/repository"),
      import("@/app/api/[locale]/agent/chat/favorites/repository"),
      import("@/app/api/[locale]/agent/chat/characters/repository"),
    ]);

    const [
      memoriesResult,
      tasksResult,
      favoritesResult,
      characterResult,
      userNameResult,
    ] = await Promise.allSettled([
      // Memories: skip in incognito; in public/shared only load public memories
      !excludeMemories && !isIncognito
        ? generateMemorySummary({
            userId,
            logger,
            rootFolderId,
          })
        : Promise.resolve(""),
      // Tasks: skip in incognito and public/shared (private user tasks should never leak)
      !isIncognito && !isExposedFolder
        ? generateTasksSummary({ userId, logger })
        : Promise.resolve(""),
      // Favorites: skip in incognito and public/shared
      !isIncognito && !isExposedFolder
        ? generateFavoritesSummary({ userId, locale, logger })
        : Promise.resolve(""),
      // Character: only if a characterId was provided
      characterId
        ? CharactersRepository.getCharacterById(
            { id: characterId },
            user,
            logger,
            locale,
          )
        : Promise.resolve(null),
      // User name: fetch for personalization
      db
        .select({
          privateName: usersTable.privateName,
          publicName: usersTable.publicName,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1)
        .then((rows) => rows[0] ?? null),
    ]);

    // --- Memories ---
    if (memoriesResult.status === "fulfilled") {
      memorySummary = memoriesResult.value;
      if (memorySummary) {
        logger.debug("Loaded user memories for system prompt", {
          userId,
          length: memorySummary.length,
        });
      }
    } else {
      logger.error("Failed to load memories", {
        userId,
        error: String(memoriesResult.reason),
      });
    }

    // --- Tasks ---
    if (tasksResult.status === "fulfilled") {
      tasksSummary = tasksResult.value;
      if (tasksSummary) {
        logger.debug("Loaded user tasks for system prompt", {
          userId,
          length: tasksSummary.length,
        });
      }
    } else {
      logger.error("Failed to load tasks summary", {
        userId,
        error: String(tasksResult.reason),
      });
    }

    // --- Favorites ---
    if (favoritesResult.status === "fulfilled") {
      favoritesSummary = favoritesResult.value;
      if (favoritesSummary) {
        logger.debug("Loaded user favorites for system prompt", {
          userId,
          length: favoritesSummary.length,
        });
      }
    } else {
      logger.error("Failed to load favorites summary", {
        userId,
        error: String(favoritesResult.reason),
      });
    }

    // --- Character ---
    if (characterResult.status === "fulfilled") {
      const result = characterResult.value;
      if (result !== null) {
        if (result.success) {
          const prompt = result.data.systemPrompt;
          if (prompt?.trim()) {
            characterPrompt = prompt.trim();
          } else {
            logger.debug(
              "Character has empty system prompt, using default behavior",
            );
          }
        } else {
          logger.warn("Character not found, using default", {
            characterId,
            error: result.message,
          });
        }
      }
    } else {
      logger.error("Failed to load character, using default", {
        characterId,
        error: String(characterResult.reason),
      });
    }

    // --- User Name ---
    if (userNameResult.status === "fulfilled" && userNameResult.value) {
      const { privateName, publicName } = userNameResult.value;
      // Use private name for private/incognito/cron folders, public name for public/shared
      userName =
        rootFolderId === "public" || rootFolderId === "shared"
          ? publicName
          : privateName;
    }
  } else if (characterId) {
    // Public users can still reference a character (e.g. default ones)
    try {
      const { CharactersRepository } =
        await import("@/app/api/[locale]/agent/chat/characters/repository");
      const result = await CharactersRepository.getCharacterById(
        { id: characterId },
        user,
        logger,
        locale,
      );

      if (result.success) {
        const prompt = result.data.systemPrompt;
        if (prompt?.trim()) {
          characterPrompt = prompt.trim();
        }
      } else {
        logger.warn("Character not found for public user, using default", {
          characterId,
          error: result.message,
        });
      }
    } catch (error) {
      logger.error("Failed to load character for public user, using default", {
        characterId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── Step 2b: Load remote instance context ──────────────────────────────

  let instanceId: string | null = null;
  let knownInstanceIds: string[] = [];

  if (userId && !isIncognito && !isExposedFolder) {
    try {
      const { getAllActiveConnections, getLocalInstanceId } =
        await import("@/app/api/[locale]/user/remote-connection/repository");
      const [connections, localId] = await Promise.all([
        getAllActiveConnections(userId),
        getLocalInstanceId(),
      ]);
      instanceId = localId;
      if (connections.length > 0) {
        knownInstanceIds = connections.map((c) => c.instanceId);
        const lines = connections.map(
          (c) =>
            `- "${c.friendlyName}" (id: "${c.instanceId}") — use help(instanceId="${c.instanceId}") to discover tools, execute-tool(toolName, instanceId="${c.instanceId}", input) to run them`,
        );
        remoteInstancesContext = `## Remote Instances\n\nUser has ${connections.length} connected local instance${connections.length === 1 ? "" : "s"}:\n\n${lines.join("\n")}\n\nRemote tool results are async — you receive {taskId, status:"pending"}. Acknowledge and move on.`;
      }
    } catch (error) {
      logger.debug("Failed to load remote instances for system prompt", {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── Step 3: Generate system prompt ─────────────────────────────────────

  // A "fresh" user has no memories and no tasks yet — show bootstrap guidance
  const isFreshUser = !memorySummary.trim() && !tasksSummary.trim();

  const appName = t("config.appName");
  // Merge extra instructions with remote instance context (if any)
  const combinedExtraInstructions = [
    extraInstructions,
    remoteInstancesContext || undefined,
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemPrompt = generateSystemPrompt({
    appName,
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    callMode: callMode ?? false,
    extraInstructions: combinedExtraInstructions || undefined,
    headless: headless ?? false,
    isPublicUser,
    isAdmin,
    isFreshUser,
    isLocalMode: envClient.NEXT_PUBLIC_LOCAL_MODE,
    isDev: envClient.NODE_ENV !== "production",
    appUrl: envClient.NEXT_PUBLIC_APP_URL,
    instanceId: instanceId ?? undefined,
    knownInstanceIds:
      knownInstanceIds.length > 0 ? knownInstanceIds : undefined,
    userName,
  });

  // ─── Step 4: Build trailing system message and return ───────────────────

  // Fetch completed background (task-done) results for this thread so the
  // model is informed about async remote tasks that finished since last turn.
  let completedTasksSummary = "";
  if (threadId && userId && !isIncognito && !isExposedFolder) {
    try {
      const completedRows = await db
        .select({
          id: cronTasks.id,
          displayName: cronTasks.displayName,
          result: cronTaskExecutions.result,
          taskInput: cronTasks.taskInput,
        })
        .from(cronTasks)
        .innerJoin(
          cronTaskExecutions,
          eq(cronTaskExecutions.taskId, cronTasks.id),
        )
        .where(
          sql`
            ${cronTasks.userId} = ${userId}
            AND ${cronTaskExecutions.status} = 'completed'
            AND ${cronTasks.taskInput}->>'__callbackMode' = 'task-done'
            AND ${cronTasks.taskInput}->>'__threadId' = ${threadId}
            AND ${cronTaskExecutions.result} IS NOT NULL
          `,
        )
        .limit(10);

      if (completedRows.length > 0) {
        const lines = completedRows.map((row) => {
          const resultStr = row.result
            ? JSON.stringify(row.result).slice(0, 500)
            : "(no output)";
          return `- **${row.displayName}** (id: ${row.id}): ${resultStr}`;
        });
        completedTasksSummary = `The following background tasks completed:\n\n${lines.join("\n")}`;
      }
    } catch (error) {
      logger.debug("Failed to load completed background tasks", {
        threadId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const trailingSystemMessage = buildTrailingSystemMessage({
    tasksSummary,
    memorySummary,
    favoritesSummary,
    completedTasksSummary: completedTasksSummary || null,
    voiceTranscription,
  });

  return {
    systemPrompt,
    trailingSystemMessage,
    memorySummary,
    tasksSummary,
    favoritesSummary,
  };
}
