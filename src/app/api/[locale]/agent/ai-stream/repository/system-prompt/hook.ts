"use client";

import { useMemo } from "react";

import { useCharacter } from "@/app/api/[locale]/agent/chat/characters/[id]/hooks";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { useMemorySummary } from "@/app/api/[locale]/agent/chat/memories/use-memory-summary";
import { useVoiceModeStore } from "@/app/api/[locale]/agent/chat/voice-mode/store";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { generateSystemPrompt } from "./generator";

/**
 * Hook for debug view that handles all data fetching and system prompt generation
 * Fetches character, memories, computes call mode, and generates system prompt
 */
export function useDebugSystemPrompt(params: {
  locale: CountryLanguage;
  rootFolderId?: DefaultFolderId;
  subFolderId?: string | null;
  characterId?: string | null;
  selectedModel?: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): string {
  const {
    locale,
    rootFolderId,
    subFolderId,
    characterId,
    selectedModel,
    user,
    logger,
  } = params;

  // Get call mode setting for current model+character combination
  const getCallMode = useVoiceModeStore((state) => state.getCallMode);
  const isCallMode = useMemo(() => {
    if (!selectedModel) {
      return false;
    }
    const charId = characterId || "default";
    return getCallMode(selectedModel, charId);
  }, [selectedModel, characterId, getCallMode]);

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

  // Fetch memories ONLY when this component is rendered (i.e., debug mode active)
  const { memorySummary } = useMemorySummary({
    enabled: true, // Always enabled since component only renders in debug mode
    user,
    logger,
  });
  return useMemo(() => {
    const { t } = simpleT(locale);
    const appName = t("config.appName");

    // Use the full generateSystemPrompt (not generateClientSystemPrompt)
    // so we can pass callMode and memorySummary
    return generateSystemPrompt({
      appName,
      locale,
      rootFolderId,
      subFolderId,
      characterPrompt,
      memorySummary,
      callMode: isCallMode ?? false,
    });
  }, [
    locale,
    rootFolderId,
    subFolderId,
    characterPrompt,
    isCallMode,
    memorySummary,
  ]);
}
