/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import textToSpeechDefinitions from "./definition";

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  isStreaming?: boolean; // If true, wait for streaming to complete before auto-playing
  locale: CountryLanguage;
  onError?: (error: string) => void;
  logger: EndpointLogger;
  deductCredits: (creditCost: number, feature: string) => void;
}

interface UseTTSAudioReturn {
  isLoading: boolean;
  isPlaying: boolean;
  playAudio: () => Promise<void>;
  stopAudio: () => void;
  error: string | null;
}

export function useTTSAudio({
  text,
  enabled: _enabled,
  isStreaming: _isStreaming = false,
  locale,
  onError,
  logger,
  deductCredits,
}: UseTTSAudioOptions): UseTTSAudioReturn {
  const { t } = simpleT(locale);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const _hasPlayedRef = useRef(false);
  const isProcessingRef = useRef(false);

  // Use endpoint for type-safe API calls
  const endpoint = useEndpoint(
    textToSpeechDefinitions,
    {
      queryOptions: {
        enabled: false, // Manual control
      },
    },
    logger,
  );

  // Stop audio playback
  const stopAudio = useCallback((): void => {
    logger.debug("TTS: Stopping audio");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [logger]);

  // Play audio
  const playAudio = useCallback(async (): Promise<void> => {
    // Prevent concurrent processing
    if (isProcessingRef.current) {
      logger.debug("TTS: Already processing, skipping");
      return;
    }

    if (!text.trim()) {
      logger.debug("TTS: No text to convert");
      return;
    }

    isProcessingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      logger.debug("TTS: Starting TTS conversion", {
        textLength: text.length,
      });

      // If we already have audio URL, just play it
      if (audioUrl && audioRef.current) {
        logger.debug("TTS: Using cached audio");
        audioRef.current.play().catch((err: Error | null) => {
          logger.error("TTS: Failed to play cached audio", {
            error: err instanceof Error ? err.message : String(err),
          });
          setError(t("app.chat.hooks.tts.failed-to-play"));
        });
        setIsPlaying(true);
        setIsLoading(false);
        isProcessingRef.current = false;
        return;
      }

      // Call TTS API
      logger.debug("TTS: Calling TTS API");

      if (!endpoint.create) {
        const errorMsg = t("app.chat.hooks.tts.endpoint-not-available");
        logger.error("TTS: Endpoint not available", errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        isProcessingRef.current = false;
        return;
      }

      // Set form values
      endpoint.create.form.setValue("text", text);
      endpoint.create.form.setValue("provider", "openai");
      endpoint.create.form.setValue("voice", "MALE");
      endpoint.create.form.setValue("language", "EN");

      // Submit form with callbacks
      await endpoint.create.submitForm({
        onSuccess: ({ responseData }) => {
          const audioDataUrl = responseData.response.audioUrl;
          logger.debug("TTS: Got audio URL", {
            urlLength: audioDataUrl.length,
          });

          // Optimistically update credit balance in UI
          const creditCost = textToSpeechDefinitions.POST.credits ?? 0;
          if (creditCost > 0) {
            deductCredits(creditCost, "tts");
          }

          // Create audio element
          const audio = new Audio(audioDataUrl);
          audioRef.current = audio;
          setAudioUrl(audioDataUrl);

          // Set up event listeners
          audio.addEventListener("ended", (): void => {
            logger.debug("TTS: Audio playback ended");
            setIsPlaying(false);
          });

          audio.addEventListener("error", (err): void => {
            const audioError =
              err instanceof Error
                ? err
                : new Error(t("app.chat.hooks.tts.failed-to-play"));
            logger.error("TTS: Audio playback error", parseError(audioError));
            setError(t("app.chat.hooks.tts.failed-to-play"));
            setIsPlaying(false);
          });

          // Play audio
          logger.debug("TTS: Starting audio playback");
          audio.play().catch((err: Error | null) => {
            logger.error("TTS: Failed to play audio", {
              error: err instanceof Error ? err.message : String(err),
            });
            setError(t("app.chat.hooks.tts.failed-to-play"));
          });
          setIsPlaying(true);
          logger.debug("TTS: Audio playback started successfully");
        },
        onError: ({ error }) => {
          logger.error("TTS: API returned error", {
            errorType: error.errorType,
            errorMessage: error.message,
          });
          const errorMsg =
            error.message || t("app.chat.hooks.tts.failed-to-generate");
          setError(errorMsg);
          onError?.(errorMsg);
        },
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("app.chat.hooks.tts.failed-to-generate");
      logger.error("TTS: Exception during processing", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      logger.debug("TTS: Finished TTS attempt");
      setIsLoading(false);
      // eslint-disable-next-line require-atomic-updates
      isProcessingRef.current = false;
    }
  }, [text, audioUrl, endpoint, logger, t, onError, deductCredits]);

  // Auto-play when streaming completes if enabled
  // TODO: Re-enable auto TTS after fixing timing and UX issues
  // useEffect(() => {
  //   // Only auto-play if:
  //   // 1. Auto-play is enabled
  //   // 2. We haven't played yet
  //   // 3. There's text to play
  //   // 4. Streaming is complete (isStreaming is false)
  //   if (enabled && !hasPlayedRef.current && text.trim() && !isStreaming) {
  //     hasPlayedRef.current = true;
  //     void playAudio();
  //   }
  // }, [enabled, text, isStreaming, playAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    error,
  };
}
