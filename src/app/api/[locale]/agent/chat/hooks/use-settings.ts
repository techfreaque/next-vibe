/**
 * Settings Management Hook
 * Handles all chat settings (model, character, theme, etc.)
 */

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

import type { ModelId } from "../model-access/models";
import type { ChatSettings } from "./store";

/**
 * Settings operations interface
 */
export interface SettingsOperations {
  settings: ChatSettings;
  setSelectedCharacter: (character: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  setViewMode: (mode: ChatSettings["viewMode"]) => void;
  setEnabledToolIds: (toolIds: string[]) => void;
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
}): SettingsOperations {
  const { chatStore } = deps;
  const { setTheme: setNextTheme } = useTheme();

  // Extract stable functions to avoid React Compiler warnings
  const updateSettings = chatStore.updateSettings;
  const hydrateSettings = chatStore.hydrateSettings;

  // Hydrate settings from localStorage after mount
  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

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

  const setEnabledToolIds = useCallback(
    (toolIds: string[]) => {
      updateSettings({ enabledToolIds: toolIds });
    },
    [updateSettings],
  );

  return {
    settings: chatStore.settings,
    setSelectedCharacter,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setTheme,
    setViewMode,
    setEnabledToolIds,
  };
}
