"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useTranslation } from "@/i18n/core/client";

import textToSpeechDefinitions from "../../../api/[locale]/v1/core/agent/text-to-speech/definition";

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  locale?: string;
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
  locale = "en",
  onError,
  logger,
}: UseTTSAudioOptions): UseTTSAudioReturn {
  const { t } = useTranslation();
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

  // Debug logging
  useEffect(() => {
    logger.debug("TTS", "Endpoint initialized", {
      hasCreate: !!endpoint.create,
      hasForm: !!endpoint.create?.form,
      hasSubmitForm: !!endpoint.create?.submitForm,
    });
  }, [endpoint, logger]);

  // Reset hasPlayed flag when text changes
  useEffect(() => {
    hasPlayedRef.current = false;
  }, [text]);

  // Clean up audio on unmount
  useEffect(() => {
    return (): void => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = "";
        } catch {
          // Ignore errors during cleanup
        }
        audioRef.current = null;
      }
      isProcessingRef.current = false;
      // Revoke object URL to free memory
      // eslint-disable-next-line i18next/no-literal-string
      if (audioUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioUrl) {
        setAudioUrl(null);
      }
    };
  }, [audioUrl]);

  const stopAudio = useCallback((): void => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        logger.debug("TTS", "Error stopping audio (non-fatal)", error);
      }
      setIsPlaying(false);
    }
    isProcessingRef.current = false;
  }, [logger]);

  const playAudio = useCallback(async (): Promise<void> => {
    logger.debug("TTS", "Play audio called", {
      enabled,
      hasText: !!text.trim(),
      hasEndpointCreate: !!endpoint.create,
      isProcessing: isProcessingRef.current,
    });

    // Prevent concurrent plays using ref (more reliable than state)
    if (isProcessingRef.current) {
      logger.debug("TTS", "Skipping - already processing");
      return;
    }

    if (!enabled || !text.trim()) {
      logger.debug("TTS", "Skipping - not enabled or no text");
      return;
    }

    if (!endpoint.create) {
      const errorMsg = t("app.chat.hooks.tts.endpoint-not-available");
      logger.error("TTS", errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Stop and clean up any existing audio before starting new playback
    if (audioRef.current) {
      logger.debug("TTS", "Cleaning up existing audio before new playback");
      try {
        audioRef.current.pause();
        audioRef.current.src = "";
      } catch (cleanupError) {
        logger.debug("TTS", "Error during cleanup (non-fatal)", cleanupError);
      }
      audioRef.current = null;
    }

    // Mark as processing
    isProcessingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);
      logger.debug("TTS", "Starting TTS conversion", {
        textLength: text.length,
      });

      // Set form values using endpoint
      const languageCode = locale.split("-")[0] || "en";
      logger.debug("TTS", "Setting form values", {
        provider: "openai",
        voice: "MALE",
        languageCode,
      });
      endpoint.create.form.setValue("text", text.trim());
      endpoint.create.form.setValue("provider", "openai");
      endpoint.create.form.setValue("voice", "MALE");
      endpoint.create.form.setValue("language", languageCode);

      // Submit the form
      logger.debug("TTS", "Submitting form");
      await endpoint.create.submitForm(undefined);
      logger.debug("TTS", "Form submitted, checking response", {
        hasResponse: !!endpoint.create.response,
        responseKeys: endpoint.create.response
          ? Object.keys(endpoint.create.response)
          : [],
        responseSuccess: endpoint.create.response?.success,
      });

      // Check response
      if (endpoint.create.response?.success) {
        const audioDataUrl =
          endpoint.create.response.data.response?.audioUrl || "";

        logger.debug("TTS", "Success! Audio URL received", {
          hasUrl: !!audioDataUrl,
          urlLength: audioDataUrl.length,
        });

        if (audioDataUrl) {
          try {
            // Convert base64 data URL to Blob for better browser compatibility
            // Large base64 strings can cause issues with Audio element
            const base64Data = audioDataUrl.split(",")[1];
            const mimeType =
              audioDataUrl.match(/data:([^;]+);/)?.[1] || "audio/mpeg";

            logger.debug("TTS", "Converting base64 to blob", {
              mimeType,
              base64Length: base64Data?.length || 0,
            });

            // Decode base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // Create blob from binary data
            const audioBlob = new Blob([bytes], { type: mimeType });
            const objectUrl = URL.createObjectURL(audioBlob);

            logger.debug("TTS", "Created object URL", {
              blobSize: audioBlob.size,
              objectUrl: objectUrl.substring(0, 50),
            });

            setAudioUrl(objectUrl);

            // Create and play audio
            logger.debug("TTS", "Creating audio element");
            const audio = new Audio(objectUrl);
            audioRef.current = audio;

            audio.onplay = (): void => {
              logger.debug("TTS", "Audio playing");
              setIsPlaying(true);
            };
            audio.onended = (): void => {
              logger.debug("TTS", "Audio ended");
              setIsPlaying(false);
              // Clean up object URL after playback
              URL.revokeObjectURL(objectUrl);
            };
            audio.onerror = (event): void => {
              const errorMsg = t("app.chat.hooks.tts.failed-to-play");
              logger.error("TTS", "Audio element error event", {
                error: event,
                readyState: audio.readyState,
                networkState: audio.networkState,
              });
              setError(errorMsg);
              setIsPlaying(false);
              onError?.(errorMsg);
              // Clean up object URL on error
              URL.revokeObjectURL(objectUrl);
            };

            logger.debug("TTS", "Playing audio");
            await audio.play();
            logger.debug("TTS", "Play() promise resolved");
          } catch (playError) {
            const errorMsg = t("app.chat.hooks.tts.failed-to-play");
            logger.error(
              "TTS",
              "Play() promise rejected or blob conversion failed",
              {
                error: playError,
                errorName:
                  playError instanceof Error ? playError.name : "unknown",
                errorMessage:
                  playError instanceof Error ? playError.message : "unknown",
              },
            );
            setError(errorMsg);
            setIsPlaying(false);
            onError?.(errorMsg);
          }
        }
      } else if (!endpoint.create.response?.success) {
        const errorMsg = t("app.chat.hooks.tts.conversion-failed");
        logger.error("TTS", errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
      } else {
        logger.error("TTS", "No response received");
      }
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
  }, [text, enabled, locale, onError, endpoint, logger, t]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (enabled && !hasPlayedRef.current && text.trim()) {
      hasPlayedRef.current = true;
      void playAudio();
    }
  }, [enabled, text, playAudio]);

  return {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    error,
  };
}
