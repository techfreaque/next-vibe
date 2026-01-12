/**
 * Settings Management Hook
 * Handles all chat settings (model, character, theme, etc.)
 */

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { useCharacter } from "../characters/[id]/hooks";
import type { ChatSettings } from "./store";

/**
 * Settings operations interface
 */
export interface SettingsOperations {
  settings: ChatSettings;
  setSelectedCharacter: (character: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setActiveFavoriteId: (id: string | null) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setTTSVoice: (voice: typeof TtsVoiceValue) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: ChatSettings["viewMode"]) => void;
  setEnabledTools: (
    tools: Array<{ id: string; requiresConfirmation: boolean }>,
  ) => void;
}

/**
 * Hook for managing chat settings
 */
export function useSettings(deps: {
  chatStore: {
    settings: ChatSettings;
    updateSettings: (updates: Partial<ChatSettings>) => void;
    hydrateSettings: () => Promise<void>;
  };
  logger: EndpointLogger;
}): SettingsOperations {
  const { chatStore, logger } = deps;
  const { setTheme: setNextTheme } = useTheme();

  // Extract stable functions to avoid React Compiler warnings
  const updateSettings = chatStore.updateSettings;
  const hydrateSettings = chatStore.hydrateSettings;

  // Fetch full character details for selected character
  const selectedCharacterData = useCharacter(
    chatStore.settings.selectedCharacter,
    logger,
  );

  // Hydrate settings from localStorage after mount
  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

  // Auto-update voice when character data loads
  useEffect(() => {
    const characterVoice = selectedCharacterData.read?.data?.voice;
    if (characterVoice && characterVoice !== chatStore.settings.ttsVoice) {
      updateSettings({ ttsVoice: characterVoice });
    }
  }, [
    selectedCharacterData.read?.data?.voice,
    chatStore.settings.ttsVoice,
    updateSettings,
  ]);

  // Zustand store methods are stable, so we only depend on the specific method
  const setSelectedCharacter = useCallback(
    (character: string) => {
      updateSettings({ selectedCharacter: character });
    },
    [updateSettings],
  );

  const setSelectedModel = useCallback(
    (model: ModelId) => {
      updateSettings({ selectedModel: model });
    },
    [updateSettings],
  );

  const setTemperature = useCallback(
    (temp: number) => {
      updateSettings({ temperature: temp });
    },
    [updateSettings],
  );

  const setMaxTokens = useCallback(
    (tokens: number) => {
      updateSettings({ maxTokens: tokens });
    },
    [updateSettings],
  );

  const setTTSAutoplay = useCallback(
    (autoplay: boolean) => {
      updateSettings({ ttsAutoplay: autoplay });
    },
    [updateSettings],
  );

  const setTTSVoice = useCallback(
    (voice: typeof TtsVoiceValue) => {
      updateSettings({ ttsVoice: voice });
    },
    [updateSettings],
  );

  const setTheme = useCallback(
    (newTheme: "light" | "dark") => {
      setNextTheme(newTheme);
      updateSettings({ theme: newTheme });
    },
    [updateSettings, setNextTheme],
  );

  const setViewMode = useCallback(
    (mode: ChatSettings["viewMode"]) => {
      updateSettings({ viewMode: mode });
    },
    [updateSettings],
  );

  const setEnabledTools = useCallback(
    (tools: Array<{ id: string; requiresConfirmation: boolean }>) => {
      updateSettings({ enabledTools: tools });
    },
    [updateSettings],
  );

  const setActiveFavoriteId = useCallback(
    (id: string | null) => {
      updateSettings({ activeFavoriteId: id });
    },
    [updateSettings],
  );

  return {
    settings: chatStore.settings,
    setSelectedCharacter,
    setSelectedModel,
    setActiveFavoriteId,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setTTSVoice,
    setTheme,
    setViewMode,
    setEnabledTools,
  };
}
