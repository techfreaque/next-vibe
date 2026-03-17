/**
 * Voice Recording Hook
 * Handles voice recording state, STT, and submission logic
 * Used by both ChatInput and MessageEditor
 */

import { useCallback, useMemo, useRef } from "react";

import { useEdenAISpeech } from "@/app/api/[locale]/agent/speech-to-text/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

/** Voice input mode - determines what happens after recording stops */
type VoiceInputMode = "toInput" | "directSubmit";

interface UseVoiceRecordingOptions {
  /** Current input value */
  currentValue: string;
  /** Callback to update input value */
  onValueChange: (value: string) => void;
  /** Callback to submit with text content */
  onSubmitText?: (text: string) => void | Promise<void>;
  /** Callback to submit with audio file */
  onSubmitAudio?: (file: File) => void | Promise<void>;
  /** Callback for deducting credits */
  deductCredits: (amount: number, feature: string) => void;
  /** User */
  user: JwtPayloadType;
  /** Logger instance */
  logger: EndpointLogger;
  /** User locale */
  locale: CountryLanguage;
}

export interface UseVoiceRecordingReturn {
  /** Whether currently recording */
  isRecording: boolean;
  /** Whether recording is paused */
  isPaused: boolean;
  /** Whether STT is processing */
  isProcessing: boolean;
  /** Current error message */
  error: string | null;
  /** Media stream for waveform visualization */
  stream: MediaStream | null;
  /** Start recording */
  startRecording: () => Promise<void>;
  /** Stop and transcribe to input */
  transcribeToInput: () => void;
  /** Stop and submit audio directly */
  submitAudioDirectly: () => Promise<void>;
  /** Cancel recording without saving */
  cancelRecording: () => void;
  /** Toggle pause/resume */
  togglePause: () => void;
  /** Clear error */
  clearError: () => void;
  /** Whether there's existing input (affects UI) */
  hasExistingInput: boolean;
}

/**
 * Hook for voice recording functionality
 * Encapsulates all voice recording state and handlers
 */
export function useVoiceRecording({
  currentValue,
  onValueChange,
  onSubmitText,
  onSubmitAudio,
  deductCredits,
  user,
  logger,
  locale,
}: UseVoiceRecordingOptions): UseVoiceRecordingReturn {
  // Track which voice mode was used when starting recording
  const voiceModeRef = useRef<VoiceInputMode>("toInput");

  // Stable ref for currentValue — avoids onTranscript depending on it
  const currentValueRef = useRef(currentValue);
  currentValueRef.current = currentValue;

  // Stable callbacks for useEdenAISpeech — must not be inline arrows
  const onTranscript = useCallback(
    (text: string) => {
      const mode = voiceModeRef.current;
      if (mode === "directSubmit" && onSubmitText) {
        void onSubmitText(text);
      } else {
        const cur = currentValueRef.current;
        const newValue = cur ? `${cur}\n${text}` : text;
        onValueChange(newValue);
      }
    },
    [onValueChange, onSubmitText],
  );

  const onError = useCallback(
    (err: string) => {
      logger.error("Voice input error", err);
    },
    [logger],
  );

  // STT hook
  const {
    isRecording,
    isPaused,
    isProcessing,
    stopRecording,
    stopRecordingAndGetBlob,
    cancelRecording: cancelSTT,
    togglePause,
    error,
    stream,
    clearError,
    startRecording: startSTT,
  } = useEdenAISpeech({
    onTranscript,
    onError,
    locale,
    user,
    logger,
    deductCredits,
  });

  // Start recording
  const startRecording = useCallback(async (): Promise<void> => {
    if (error) {
      clearError();
    }
    voiceModeRef.current = "toInput";
    await startSTT();
  }, [error, clearError, startSTT]);

  // Stop recording and transcribe to input
  const transcribeToInput = useCallback((): void => {
    voiceModeRef.current = "toInput";
    stopRecording();
  }, [stopRecording]);

  // Stop recording and submit audio directly
  const submitAudioDirectly = useCallback(async (): Promise<void> => {
    if (!onSubmitAudio) {
      logger.warn("submitAudioDirectly called but no onSubmitAudio handler");
      return;
    }

    logger.debug("Direct submit: Getting audio blob");
    const audioFile = await stopRecordingAndGetBlob();

    if (!audioFile) {
      logger.error("Direct submit: Failed to get audio file");
      return;
    }

    logger.debug("Direct submit: Sending audio", {
      fileSize: audioFile.size,
      fileType: audioFile.type,
    });

    await onSubmitAudio(audioFile);
  }, [stopRecordingAndGetBlob, onSubmitAudio, logger]);

  // Cancel recording
  const cancelRecording = useCallback((): void => {
    cancelSTT();
  }, [cancelSTT]);

  const hasExistingInput = currentValue.trim().length > 0;

  return useMemo(
    () => ({
      isRecording,
      isPaused,
      isProcessing,
      error,
      stream,
      startRecording,
      transcribeToInput,
      submitAudioDirectly,
      cancelRecording,
      togglePause,
      clearError,
      hasExistingInput,
    }),
    [
      isRecording,
      isPaused,
      isProcessing,
      error,
      stream,
      startRecording,
      transcribeToInput,
      submitAudioDirectly,
      cancelRecording,
      togglePause,
      clearError,
      hasExistingInput,
    ],
  );
}
