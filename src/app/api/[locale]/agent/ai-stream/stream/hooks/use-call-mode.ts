/**
 * Call Mode Hook
 * Wires VoiceActivityDetector to the send-message flow for continuous voice (call) mode.
 * When chatMode === "call", VAD runs continuously and auto-sends speech segments as audio messages.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ChatMode } from "@/app/api/[locale]/agent/models/enum";
import { VoiceActivityDetector, type VadConfig } from "./voice-mode/vad";
import { useVoiceModeStore } from "./voice-mode/store";

export interface UseCallModeOptions {
  /** Current chat mode */
  chatMode: ChatMode;
  /** Whether AI is currently generating a response (pauses listening during response) */
  isAIResponding: boolean;
  /** Called when VAD detects end of a speech segment with accumulated audio */
  onSpeechEnd: (audioFile: File) => void | Promise<void>;
  /** Optional VAD configuration overrides */
  vadConfig?: Partial<Omit<VadConfig, "onSpeechEnd" | "onSpeechStart">>;
  logger: EndpointLogger;
}

export interface UseCallModeReturn {
  /** Whether call mode VAD is active */
  isCallModeActive: boolean;
  /** Whether VAD detected speech is in progress */
  isSpeaking: boolean;
}

/**
 * Hook that manages call mode: activates VAD when chatMode === "call" and
 * auto-sends audio blobs when speech ends.
 */
export function useCallMode({
  chatMode,
  isAIResponding,
  onSpeechEnd,
  vadConfig,
  logger,
}: UseCallModeOptions): UseCallModeReturn {
  const isCallModeActive = chatMode === "call";
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const isRunningRef = useRef(false);

  const { setRecording, setSpeaking, runtime } = useVoiceModeStore();
  const isSpeaking = runtime.isRecording;

  const onSpeechEndRef = useRef(onSpeechEnd);
  onSpeechEndRef.current = onSpeechEnd;

  const handleSpeechEnd = useCallback(
    (audioBlob: Blob): void => {
      setSpeaking(false);
      setRecording(false);
      const audioFile = new File([audioBlob], "call-recording.wav", {
        type: "audio/wav",
      });
      void onSpeechEndRef.current(audioFile);
    },
    [setSpeaking, setRecording],
  );

  const handleSpeechStart = useCallback((): void => {
    setRecording(true);
    setSpeaking(true);
  }, [setRecording, setSpeaking]);

  // Start VAD when call mode becomes active (and AI is not responding)
  useEffect(() => {
    if (!isCallModeActive || isAIResponding) {
      // Destroy existing VAD if AI starts responding (pause listening)
      if (vadRef.current) {
        vadRef.current.destroy();
        vadRef.current = null;
        isRunningRef.current = false;
        setRecording(false);
        setSpeaking(false);
      }
      return;
    }

    if (isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    vadRef.current = new VoiceActivityDetector({
      onSpeechEnd: handleSpeechEnd,
      onSpeechStart: handleSpeechStart,
      silenceThresholdMs: vadConfig?.silenceThresholdMs,
      speechThresholdRms: vadConfig?.speechThresholdRms,
      minSpeechDurationMs: vadConfig?.minSpeechDurationMs,
    });

    vadRef.current.start().catch((err) => {
      logger.error("[CallMode] Failed to start VAD", parseError(err));
      isRunningRef.current = false;
      vadRef.current = null;
    });

    return (): void => {
      vadRef.current?.destroy();
      vadRef.current = null;
      isRunningRef.current = false;
    };
  }, [
    isCallModeActive,
    isAIResponding,
    handleSpeechEnd,
    handleSpeechStart,
    vadConfig?.silenceThresholdMs,
    vadConfig?.speechThresholdRms,
    vadConfig?.minSpeechDurationMs,
    logger,
    setRecording,
    setSpeaking,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      vadRef.current?.destroy();
      vadRef.current = null;
    };
  }, []);

  return {
    isCallModeActive,
    isSpeaking,
  };
}
