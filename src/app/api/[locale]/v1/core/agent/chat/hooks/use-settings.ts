/**
 * Settings Management Hook
 * Handles all chat settings (model, persona, theme, etc.)
 */

import { useCallback, useEffect } from "react";
import { useTheme } from "next-themes";

import type { ModelId } from "../model-access/models";
import type { ChatSettings } from "./store";

/**
 * Settings operations interface
 */
export interface SettingsOperations {
  settings: ChatSettings;
  setSelectedPersona: (persona: string) => void;
  setSelectedModel: (model: ModelId) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  setTTSAutoplay: (autoplay: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
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

  // Hydrate settings from localStorage after mount
  useEffect(() => {
    void chatStore.hydrateSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedPersona = useCallback(
    (persona: string) => {
      chatStore.updateSettings({ selectedPersona: persona });
    },
    [chatStore],
  );

  const setSelectedModel = useCallback(
    (model: ModelId) => {
      chatStore.updateSettings({ selectedModel: model });
    },
    [chatStore],
  );

  const setTemperature = useCallback(
    (temp: number) => {
      chatStore.updateSettings({ temperature: temp });
    },
    [chatStore],
  );

  const setMaxTokens = useCallback(
    (tokens: number) => {
      chatStore.updateSettings({ maxTokens: tokens });
    },
    [chatStore],
  );

  const setTTSAutoplay = useCallback(
    (autoplay: boolean) => {
      chatStore.updateSettings({ ttsAutoplay: autoplay });
    },
    [chatStore],
  );

  const setSidebarCollapsed = useCallback(
    (collapsed: boolean) => {
      chatStore.updateSettings({ sidebarCollapsed: collapsed });
    },
    [chatStore],
  );

  const setTheme = useCallback(
    (newTheme: "light" | "dark") => {
      setNextTheme(newTheme);
      chatStore.updateSettings({ theme: newTheme });
    },
    [chatStore, setNextTheme],
  );

  const setViewMode = useCallback(
    (mode: ChatSettings["viewMode"]) => {
      chatStore.updateSettings({ viewMode: mode });
    },
    [chatStore],
  );

  const setEnabledToolIds = useCallback(
    (toolIds: string[]) => {
      chatStore.updateSettings({ enabledToolIds: toolIds });
    },
    [chatStore],
  );

  return {
    settings: chatStore.settings,
    setSelectedPersona,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setSidebarCollapsed,
    setTheme,
    setViewMode,
    setEnabledToolIds,
  };
}
