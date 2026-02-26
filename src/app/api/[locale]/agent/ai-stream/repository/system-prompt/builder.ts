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

import { eq } from "drizzle-orm";

import { CharactersRepository } from "@/app/api/[locale]/agent/chat/characters/repository";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { generateFavoritesSummary } from "@/app/api/[locale]/agent/chat/favorites/repository";
import { generateMemorySummary } from "@/app/api/[locale]/agent/chat/memories/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { generateTasksSummary } from "@/app/api/[locale]/system/unified-interface/tasks/cron/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { env } from "@/config/env";
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

  // Incognito mode: never load personal data (memories, tasks, favorites)
  const isIncognito = rootFolderId === "incognito";

  if (userId) {
    const [
      memoriesResult,
      tasksResult,
      favoritesResult,
      characterResult,
      userNameResult,
    ] = await Promise.allSettled([
      // Memories: skip when explicitly excluded or in incognito mode
      !excludeMemories && !isIncognito
        ? generateMemorySummary({ userId, logger })
        : Promise.resolve(""),
      // Tasks: skip in incognito (headless agents still need task context)
      !isIncognito
        ? generateTasksSummary({ userId, logger })
        : Promise.resolve(""),
      // Favorites: skip in incognito
      !isIncognito
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

  // ─── Step 3: Generate system prompt ─────────────────────────────────────

  // A "fresh" user has no memories and no tasks yet — show bootstrap guidance
  const isFreshUser = !memorySummary.trim() && !tasksSummary.trim();

  const appName = t("config.appName");
  const systemPrompt = generateSystemPrompt({
    appName,
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    callMode: callMode ?? false,
    extraInstructions: extraInstructions ?? undefined,
    headless: headless ?? false,
    isPublicUser,
    isAdmin,
    isFreshUser,
    isLocalMode: envClient.NEXT_PUBLIC_LOCAL_MODE,
    isDev: envClient.NODE_ENV !== "production",
    appUrl: envClient.NEXT_PUBLIC_APP_URL,
    instanceId: env.INSTANCE_ID,
    knownInstanceIds: env.KNOWN_INSTANCE_IDS,
    userName,
  });

  // ─── Step 4: Build trailing system message and return ───────────────────

  const trailingSystemMessage = buildTrailingSystemMessage({
    tasksSummary,
    memorySummary,
    favoritesSummary,
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
