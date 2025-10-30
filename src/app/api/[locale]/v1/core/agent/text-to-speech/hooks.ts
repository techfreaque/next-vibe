/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import textToSpeechDefinitions from "./definition";

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  locale: CountryLanguage;
  onError?: (error: string) => void;
  logger: EndpointLogger;
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
  enabled,
  locale,
  onError,
  logger,
}: UseTTSAudioOptions): UseTTSAudioReturn {
  const { t } = simpleT(locale);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);
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
    logger.debug("TTS", "Stopping audio");
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
      logger.debug("TTS", "Already processing, skipping");
      return;
    }

    if (!text.trim()) {
      logger.debug("TTS", "No text to convert");
      return;
    }

    isProcessingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      logger.debug("TTS", "Starting TTS conversion", {
        textLength: text.length,
      });

      // If we already have audio URL, just play it
      if (audioUrl && audioRef.current) {
        logger.debug("TTS", "Using cached audio");
        audioRef.current.play().catch((err: Error | null) => {
          logger.error("TTS", "Failed to play cached audio", {
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
      logger.debug("TTS", "Calling TTS API");

      if (!endpoint.create) {
        const errorMsg = t("app.chat.hooks.tts.endpoint-not-available");
        logger.error("TTS", errorMsg);
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

      // Submit form
      await endpoint.create.form.handleSubmit(async () => {
        // Form submission is handled by the endpoint
      })();

      // Wait a bit for the response to be available
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });

      const result = endpoint.create.response;

      if (!result?.success || !result.data) {
        logger.error(
          "TTS",
          "TTS API returned error",
          endpoint.create.error
            ? parseError(endpoint.create.error)
            : new Error("Unknown error"),
        );
        const errorMsg =
          endpoint.create.error?.message ||
          t("app.chat.hooks.tts.failed-to-generate");
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        // eslint-disable-next-line require-atomic-updates
        isProcessingRef.current = false;
        return;
      }

      const audioDataUrl = result.data.response.audioUrl;
      logger.debug("TTS", "Got audio URL", { urlLength: audioDataUrl.length });

      // Create audio element
      const audio = new Audio(audioDataUrl);
      // eslint-disable-next-line require-atomic-updates
      audioRef.current = audio;
      setAudioUrl(audioDataUrl);

      // Set up event listeners
      audio.onended = (): void => {
        logger.debug("TTS", "Audio playback ended");
        setIsPlaying(false);
      };

      audio.onerror = (err): void => {
        const audioError =
          err instanceof Error
            ? err
            : new Error(t("app.chat.hooks.tts.failed-to-play"));
        logger.error("TTS", "Audio playback error", parseError(audioError));
        setError(t("app.chat.hooks.tts.failed-to-play"));
        setIsPlaying(false);
      };

      // Play audio
      logger.debug("TTS", "Starting audio playback");
      await audio.play();
      setIsPlaying(true);
      logger.debug("TTS", "Audio playback started successfully");
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("app.chat.hooks.tts.failed-to-generate");
      logger.error("TTS", "Exception during TTS", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      logger.debug("TTS", "Finished TTS attempt");
      setIsLoading(false);
      // eslint-disable-next-line require-atomic-updates
      isProcessingRef.current = false;
    }
  }, [text, audioUrl, endpoint, logger, t, onError]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (enabled && !hasPlayedRef.current && text.trim()) {
      hasPlayedRef.current = true;
      void playAudio();
    }
  }, [enabled, text, playAudio]);

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
