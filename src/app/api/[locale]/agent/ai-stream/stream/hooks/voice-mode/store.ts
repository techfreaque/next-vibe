/**
 * Voice Mode Store
 * Zustand store for voice mode state management
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ChatMode } from "@/app/api/[locale]/agent/models/enum";

// ─── Voice Mode Types ─────────────────────────────────────────────────────────

/**
 * Voice input mode - how voice input is handled
 * - transcribe: Record audio → transcribe → put text in input field (current behavior)
 * - talk: Record audio → transcribe → immediately send to AI
 */
export type VoiceInputMode = "transcribe" | "talk";

/**
 * Voice mode state
 * Controls voice/call mode behavior
 */
export interface VoiceMode {
  /** Whether voice mode features are enabled */
  enabled: boolean;
  /** How voice input is handled */
  inputMode: VoiceInputMode;
  /** Auto-play TTS for AI responses */
  autoPlayTTS: boolean;
  /**
   * Chat mode per model+skill combination
   * Key format: `${modelId}:${skillId}`
   */
  chatModeByConfig: Record<string, ChatMode>;
}

/**
 * Create a key for model+skill combination
 */
export function getCallModeKey(modelId: string, skillId: string): string {
  return `${modelId}:${skillId}`;
}

/**
 * Voice mode runtime state (not persisted)
 */
export interface VoiceRuntimeState {
  /** Currently recording audio */
  isRecording: boolean;
  /** Processing STT */
  isTranscribing: boolean;
  /** AI is generating response */
  isAIResponding: boolean;
  /** TTS is playing */
  isSpeaking: boolean;
  /** Current transcription preview (while recording) */
  transcriptionPreview: string | null;
}

/**
 * Default voice mode settings
 */
export const DEFAULT_VOICE_MODE: VoiceMode = {
  enabled: true,
  inputMode: "transcribe",
  autoPlayTTS: false,
  chatModeByConfig: {},
};

/**
 * Default voice runtime state
 */
export const DEFAULT_VOICE_RUNTIME_STATE: VoiceRuntimeState = {
  isRecording: false,
  isTranscribing: false,
  isAIResponding: false,
  isSpeaking: false,
  transcriptionPreview: null,
};

/**
 * Storage keys for voice mode persistence
 */
export const VOICE_MODE_STORAGE_KEY = "chat-voice-mode" as const;

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
  /** Set chat mode for a specific model+skill combination */
  setChatMode: (modelId: string, skillId: string, mode: ChatMode) => void;
  /** Get chat mode for a specific model+skill combination */
  getChatMode: (modelId: string, skillId: string) => ChatMode;

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

      setChatMode: (modelId, skillId, mode): void => {
        const key = getCallModeKey(modelId, skillId);
        set((state) => ({
          settings: {
            ...state.settings,
            chatModeByConfig: {
              ...state.settings.chatModeByConfig,
              [key]: mode,
            },
          },
        }));
      },

      getChatMode: (modelId, skillId): ChatMode => {
        const key = getCallModeKey(modelId, skillId);
        return (
          useVoiceModeStore.getState().settings.chatModeByConfig[key] ?? "text"
        );
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
        const persistedState = persisted as
          | {
              settings?: Partial<VoiceMode> & {
                callModeByConfig?: Record<string, boolean>;
              };
            }
          | undefined;

        // Migrate old boolean callModeByConfig to ChatMode chatModeByConfig
        const oldCallMode = persistedState?.settings?.callModeByConfig;
        const migratedChatMode: Record<string, ChatMode> = {};
        if (oldCallMode) {
          for (const [key, val] of Object.entries(oldCallMode)) {
            migratedChatMode[key] = val ? "voice" : "text";
          }
        }

        return {
          ...current,
          settings: {
            ...current.settings,
            ...persistedState?.settings,
            chatModeByConfig: {
              ...migratedChatMode,
              ...(persistedState?.settings?.chatModeByConfig ?? {}),
            },
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
