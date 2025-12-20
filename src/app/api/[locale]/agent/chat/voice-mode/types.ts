/**
 * Voice Mode Types
 * Types and constants for voice/call mode functionality
 */

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
   * Call mode enabled per model+persona combination
   * Key format: `${modelId}:${personaId}`
   */
  callModeByConfig: Record<string, boolean>;
}

/**
 * Create a key for model+persona combination
 */
export function getCallModeKey(modelId: string, personaId: string): string {
  return `${modelId}:${personaId}`;
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
  callModeByConfig: {},
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
