/**
 * Voice Mode Store
 * Zustand store for voice mode state management
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_VOICE_MODE,
  DEFAULT_VOICE_RUNTIME_STATE,
  getCallModeKey,
  VOICE_MODE_STORAGE_KEY,
  type VoiceInputMode,
  type VoiceMode,
  type VoiceRuntimeState,
} from "./types";

/**
 * Voice mode store state
 */
interface VoiceModeState {
  /** Persisted voice mode settings */
  settings: VoiceMode;
  /** Runtime state (not persisted) */
  runtime: VoiceRuntimeState;

  // Settings actions
  setInputMode: (mode: VoiceInputMode) => void;
  setAutoPlayTTS: (autoPlay: boolean) => void;
  /** Set call mode for a specific model+persona combination */
  setCallMode: (modelId: string, personaId: string, enabled: boolean) => void;
  /** Get call mode for a specific model+persona combination */
  getCallMode: (modelId: string, personaId: string) => boolean;

  // Runtime actions
  setRecording: (recording: boolean) => void;
  setTranscribing: (transcribing: boolean) => void;
  setAIResponding: (responding: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setTranscriptionPreview: (text: string | null) => void;
  resetRuntime: () => void;
}

/**
 * Voice mode store
 * Persists settings to localStorage, runtime state is ephemeral
 */
export const useVoiceModeStore = create<VoiceModeState>()(
  persist(
    (set) => ({
      settings: DEFAULT_VOICE_MODE,
      runtime: DEFAULT_VOICE_RUNTIME_STATE,

      // Settings actions
      setInputMode: (mode): void => {
        set((state) => ({
          settings: { ...state.settings, inputMode: mode },
        }));
      },

      setAutoPlayTTS: (autoPlay): void => {
        set((state) => ({
          settings: { ...state.settings, autoPlayTTS: autoPlay },
        }));
      },

      setCallMode: (modelId, personaId, enabled): void => {
        const key = getCallModeKey(modelId, personaId);
        set((state) => ({
          settings: {
            ...state.settings,
            callModeByConfig: {
              ...state.settings.callModeByConfig,
              [key]: enabled,
            },
          },
        }));
      },

      getCallMode: (modelId, personaId): boolean => {
        const key = getCallModeKey(modelId, personaId);
        return useVoiceModeStore.getState().settings.callModeByConfig[key] ?? false;
      },

      // Runtime actions
      setRecording: (recording): void => {
        set((state) => ({
          runtime: { ...state.runtime, isRecording: recording },
        }));
      },

      setTranscribing: (transcribing): void => {
        set((state) => ({
          runtime: { ...state.runtime, isTranscribing: transcribing },
        }));
      },

      setAIResponding: (responding): void => {
        set((state) => ({
          runtime: { ...state.runtime, isAIResponding: responding },
        }));
      },

      setSpeaking: (speaking): void => {
        set((state) => ({
          runtime: { ...state.runtime, isSpeaking: speaking },
        }));
      },

      setTranscriptionPreview: (text): void => {
        set((state) => ({
          runtime: { ...state.runtime, transcriptionPreview: text },
        }));
      },

      resetRuntime: (): void => {
        set(() => ({
          runtime: DEFAULT_VOICE_RUNTIME_STATE,
        }));
      },
    }),
    {
      name: VOICE_MODE_STORAGE_KEY,
      // Only persist settings, not runtime state
      partialize: (state) => ({ settings: state.settings }),
      // Migrate old storage format to new format
      merge: (persisted, current) => {
        const persistedState = persisted as { settings?: Partial<VoiceMode> } | undefined;
        return {
          ...current,
          settings: {
            ...current.settings,
            ...persistedState?.settings,
            // Ensure callModeByConfig exists (migrate from old callMode)
            callModeByConfig: persistedState?.settings?.callModeByConfig ?? {},
          },
        };
      },
    },
  ),
);

/**
 * Hook to get voice mode settings
 */
export function useVoiceMode(): VoiceMode {
  return useVoiceModeStore((state) => state.settings);
}

/**
 * Hook to get voice runtime state
 */
export function useVoiceRuntimeState(): VoiceRuntimeState {
  return useVoiceModeStore((state) => state.runtime);
}
