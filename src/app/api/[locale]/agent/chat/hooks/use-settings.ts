/**
 * Settings Management Hook
 * Handles all chat settings (model, character, theme, etc.)
 */

import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { DEFAULT_TTS_VOICE } from "@/app/api/[locale]/agent/text-to-speech/enum";

import { getCharacterById } from "../characters/config";
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
  characters: Record<string, { voice?: typeof TtsVoiceValue }>;
}): SettingsOperations {
  const { chatStore, characters } = deps;
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
      // Update TTS voice based on character's voice preference
      // Try characters from API first, fallback to static config
      const selectedChar = characters[character] ?? getCharacterById(character);
      const voicePreference = selectedChar?.voice ?? DEFAULT_TTS_VOICE;

      // Update selected character and voice together
      updateSettings({
        selectedCharacter: character,
        ttsVoice: voicePreference,
      });
    },
    [updateSettings, characters],
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

  return {
    settings: chatStore.settings,
    setSelectedCharacter,
    setSelectedModel,
    setTemperature,
    setMaxTokens,
    setTTSAutoplay,
    setTTSVoice,
    setTheme,
    setViewMode,
    setEnabledTools,
  };
}
