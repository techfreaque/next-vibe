"use client";

import { useMemo } from "react";

import { useCharacter } from "@/app/api/[locale]/agent/chat/characters/[id]/hooks";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useFavoritesSummary } from "@/app/api/[locale]/agent/chat/favorites/use-favorites-summary";
import { useMemorySummary } from "@/app/api/[locale]/agent/chat/memories/use-memory-summary";
import { useChatSettings } from "@/app/api/[locale]/agent/chat/settings/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTasksSummary } from "@/app/api/[locale]/system/unified-interface/tasks/cron/use-tasks-summary";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { buildTrailingSystemMessage, generateSystemPrompt } from "./generator";

export interface DebugSystemPromptParts {
  /** Leading system prompt — sent as the static `system` param to the AI (cacheable). */
  systemPrompt: string;
  /** Trailing system message — injected as a system message in the messages array, before the context line. Empty when nothing to inject. */
  trailingSystemMessage: string;
  /** Upcoming assistant context line — always the last message in the array. */
  contextLine: string;
}

/**
 * Hook for debug view that handles all data fetching and system prompt generation
 * Fetches character, memories, tasks, computes call mode, and generates system prompt.
 * Mirrors what the server does in builder.ts so the debug view matches actual behaviour.
 *
 * Returns the three parts separately so the UI can render them as distinct sections.
 */
export function useDebugSystemPrompt(params: {
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
  characterId?: string | null;
  selectedModel?: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): DebugSystemPromptParts {
  const {
    locale,
    rootFolderId,
    subFolderId,
    characterId,
    selectedModel,
    user,
    logger,
  } = params;

  const isPublicUser = user.isPublic;
  const isAdmin =
    !user.isPublic &&
    "roles" in user &&
    user.roles.includes(UserPermissionRole.ADMIN);

  // Get TTS autoplay from chat settings (same source the server uses via data.voiceMode?.enabled)
  const { settings: chatSettings } = useChatSettings(user, logger);
  const isCallMode = chatSettings?.ttsAutoplay ?? false;

  // Fetch character data if characterId is provided (for custom characters)
  const characterEndpoint = useCharacter(characterId || "", user, logger);

  // Get character prompt from fetched data
  const characterPrompt = useMemo(() => {
    if (!characterId) {
      return "";
    }

    const response = characterEndpoint.read?.response;
    if (!response || !response.success) {
      return "";
    }

    return response.data.systemPrompt || "";
  }, [characterId, characterEndpoint.read?.response]);

  // Fetch memories (interactive only — mirrors server behaviour)
  const { memorySummary } = useMemorySummary({
    enabled: true, // Always enabled since component only renders in debug mode
    user,
    logger,
  });

  // Fetch tasks (always — mirrors server behaviour)
  const { tasksSummary } = useTasksSummary({
    enabled: true,
    user,
    logger,
  });

  // Fetch favorites (always — mirrors server behaviour)
  const { favoritesSummary } = useFavoritesSummary({
    enabled: true,
    user,
    logger,
  });

  return useMemo((): DebugSystemPromptParts => {
    const { t } = simpleT(locale);
    const appName = t("config.appName");

    // Build the base system prompt — same as server (leading, cacheable)
    const systemPrompt = generateSystemPrompt({
      appName,
      locale,
      rootFolderId,
      subFolderId,
      characterPrompt,
      callMode: isCallMode,
      isPublicUser,
      isAdmin,
      isLocalMode: envClient.NEXT_PUBLIC_LOCAL_MODE,
      isDev: envClient.NODE_ENV !== "production",
      appUrl: envClient.NEXT_PUBLIC_APP_URL,
    });

    // Build trailing system message — same DRY function as the server
    const trailingSystemMessage = buildTrailingSystemMessage({
      tasksSummary,
      memorySummary,
      favoritesSummary,
    });

    // Upcoming assistant context line — always last in the messages array
    const contextLine = `[Context: ID:<msg-id> | Model:${selectedModel ?? "<model>"} | Character:${characterId ?? "<none>"} | Posted:<timestamp>]`;

    return { systemPrompt, trailingSystemMessage, contextLine };
  }, [
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    isCallMode,
    isPublicUser,
    isAdmin,
    memorySummary,
    tasksSummary,
    favoritesSummary,
    selectedModel,
    characterId,
  ]);
}
