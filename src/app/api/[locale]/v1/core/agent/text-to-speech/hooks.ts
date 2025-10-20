/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
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
        audioRef.current.play().catch((err) => {
          logger.error("TTS", "Failed to play cached audio", err);
          setError(t("app.chat.hooks.tts.failed-to-play"));
        });
        setIsPlaying(true);
        setIsLoading(false);
        isProcessingRef.current = false;
        return;
      }

      // Call TTS API
      logger.debug("TTS", "Calling TTS API");
      const result = await endpoint.POST.mutateAsync({
        text,
        provider: "openai",
        voice: "MALE",
        language: "EN",
      });

      if (!result.success || !result.data) {
        logger.error("TTS", "TTS API returned error", result.error);
        const errorMsg =
          result.error?.message || t("app.chat.hooks.tts.failed-to-generate");
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        isProcessingRef.current = false;
        return;
      }

      const audioDataUrl = result.data.response.audioUrl;
      logger.debug("TTS", "Got audio URL", { urlLength: audioDataUrl.length });

      // Create audio element
      const audio = new Audio(audioDataUrl);
      audioRef.current = audio;
      setAudioUrl(audioDataUrl);

      // Set up event listeners
      audio.onended = (): void => {
        logger.debug("TTS", "Audio playback ended");
        setIsPlaying(false);
      };

      audio.onerror = (err): void => {
        logger.error("TTS", "Audio playback error", err);
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
      logger.error("TTS", "Exception during TTS", err);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      logger.debug("TTS", "Finished TTS attempt");
      setIsLoading(false);
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
    return () => {
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
