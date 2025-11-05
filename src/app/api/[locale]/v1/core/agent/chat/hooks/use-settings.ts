/**
 * Settings Management Hook
 * Handles all chat settings (model, persona, theme, etc.)
 */

import { useCallback, useEffect } from "react";
import { useTheme } from "next-themes";

import type { ModelId } from "../model-access/models";

/**
 * Settings interface
 */
export interface ChatSettings {
  selectedPersona: string;
  selectedModel: ModelId;
  temperature: number;
  maxTokens: number;
  ttsAutoplay: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  viewMode: "linear" | "flat" | "threaded";
  enabledToolIds: string[];
}

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
  setViewMode: (mode: "linear" | "flat" | "threaded") => void;
  setEnabledToolIds: (toolIds: string[]) => void;
}

/**
 * Settings dependencies
 */
interface SettingsDeps {
  chatStore: {
    settings: ChatSettings;
    updateSettings: (updates: Partial<ChatSettings>) => void;
    hydrateSettings: () => void;
  };
}

/**
 * Hook for managing chat settings
 */
export function useSettings(deps: SettingsDeps): SettingsOperations {
  const { chatStore } = deps;
  const { setTheme: setNextTheme } = useTheme();

  // Hydrate settings from localStorage after mount
  useEffect(() => {
    chatStore.hydrateSettings();
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
    (mode: "linear" | "flat" | "threaded") => {
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
