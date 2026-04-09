/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { useCallback } from "react";

import { scopedTranslation as chatScopedTranslation } from "@/app/api/[locale]/agent/chat/i18n";
import { useEndpointCreate } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint-create";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { type TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";

import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { chunkTextForTTS } from "./chunking";
import textToSpeechDefinitions from "./definition";
import { getTtsRefs, resetTtsRefs, useTtsStore } from "./tts-store";

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  isStreaming?: boolean; // If true, wait for streaming to complete before auto-playing
  locale: CountryLanguage;
  voiceId?: TtsModelId; // Voice model ID to use for TTS
  onError?: (error: string) => void;
  user: JwtPayloadType;
  logger: EndpointLogger;
  deductCredits: (creditCost: number, feature: string) => void;
  /** Stable identifier for persisting state across unmounts */
  messageId: string;
}

interface UseTTSAudioReturn {
  isLoading: boolean;
  isPlaying: boolean;
  playAudio: () => Promise<void>;
  stopAudio: () => void;
  cancelLoading: () => void;
  error: string | null;
  currentChunk: number;
  totalChunks: number;
}

export function useTTSAudio({
  text,
  locale,
  voiceId,
  onError,
  user,
  logger,
  deductCredits,
  messageId,
}: UseTTSAudioOptions): UseTTSAudioReturn {
  const { t } = chatScopedTranslation.scopedT(locale);

  // Read reactive state from the persistent store
  const storeState = useTtsStore((s) => s.messages[messageId]);
  const setStore = useTtsStore((s) => s.set);
  const resetStore = useTtsStore((s) => s.reset);

  const isPlaying = storeState?.isPlaying ?? false;
  const isLoading = storeState?.isLoading ?? false;
  const currentChunk = storeState?.currentChunk ?? 0;
  const totalChunks = storeState?.totalChunks ?? 0;
  const error = storeState?.error ?? null;

  // Use voiceId from props (set by chat settings)
  const voicePreference = voiceId ?? DEFAULT_TTS_VOICE_ID;

  // Use endpoint create directly - avoids shared instance key problem that causes
  // infinite re-renders when multiple messages each call useTTSAudio simultaneously.
  const ttsForm = useEndpointCreate(
    textToSpeechDefinitions.POST,
    logger,
    user,
    locale,
    {},
  );

  // Cancel loading (interrupt API request and playback)
  const cancelLoading = useCallback((): void => {
    const refs = getTtsRefs(messageId);

    logger.debug("TTS: Cancelling loading and playback", {
      currentPlayingIndex: refs.currentPlayingIndex,
      currentFetchingIndex: refs.currentFetchingIndex,
      totalChunks: refs.chunks.length,
      audioQueueLength: refs.audioQueue.length,
    });

    // Abort current fetch
    if (refs.abortController) {
      logger.debug("TTS: Aborting current fetch request");
      refs.abortController.abort();
      refs.abortController = null;
    }

    // Clear prefetch timer
    if (refs.prefetchTimer) {
      logger.debug("TTS: Clearing prefetch timer");
      clearTimeout(refs.prefetchTimer);
      refs.prefetchTimer = null;
    }

    // Stop all audio playback
    const audioCount = refs.audioQueue.filter((a) => a !== null).length;
    logger.debug(`TTS: Stopping ${audioCount} audio elements`);
    refs.audioQueue.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    resetTtsRefs(messageId);
    resetStore(messageId);

    logger.debug("TTS: Cancel complete, all state reset");
  }, [logger, messageId, resetStore]);

  // Stop audio playback
  const stopAudio = useCallback((): void => {
    logger.debug("TTS: Stopping audio");

    const refs = getTtsRefs(messageId);
    const currentAudio = refs.audioQueue[refs.currentPlayingIndex];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setStore(messageId, { isPlaying: false });
  }, [logger, messageId, setStore]);

  // Fetch audio for a specific chunk
  const fetchChunkAudio = useCallback(
    (
      chunkIndex: number,
      chunkText: string,
    ): Promise<HTMLAudioElement | null> => {
      if (!ttsForm) {
        return Promise.resolve(null);
      }

      const refs = getTtsRefs(messageId);

      logger.debug(
        `TTS: Fetching chunk ${chunkIndex + 1}/${refs.chunks.length}`,
        {
          chunkLength: chunkText.length,
        },
      );

      // Create new AbortController for this chunk
      refs.abortController = new AbortController();

      return new Promise((resolve) => {
        // Set form values for this chunk
        ttsForm.form.setValue("text", chunkText);
        ttsForm.form.setValue("voiceId", voicePreference);

        // Submit form
        void ttsForm.submitForm({
          onSuccess: ({ responseData }) => {
            const audioDataUrl = responseData.audioUrl;
            logger.debug(`TTS: Got audio for chunk ${chunkIndex + 1}`, {
              urlLength: audioDataUrl.length,
            });

            // Optimistically update credit balance in UI using actual cost from server
            const creditCost = responseData.creditCost ?? 0;
            if (creditCost > 0) {
              deductCredits(creditCost, "tts");
            }

            const audio = new Audio(audioDataUrl);
            resolve(audio);
          },
          onError: ({ error: endpointError }) => {
            const refs2 = getTtsRefs(messageId);
            // Check if this was an abort
            if (refs2.abortController?.signal.aborted) {
              logger.debug(`TTS: Chunk ${chunkIndex + 1} was cancelled`);
              resolve(null);
              return;
            }

            logger.error(`TTS: Failed to fetch chunk ${chunkIndex + 1}`, {
              errorType: endpointError.errorType,
              errorMessage: endpointError.message,
            });
            const errorMsg =
              endpointError.message || t("hooks.tts.failed-to-generate");
            setStore(messageId, { error: errorMsg });
            onError?.(errorMsg);
            resolve(null);
          },
        });
      });
    },
    [
      ttsForm,
      logger,
      messageId,
      t,
      onError,
      deductCredits,
      voicePreference,
      setStore,
    ],
  );

  // Play next chunk in the queue - defined as a stable ref-based function
  // We use a plain function (not useCallback) because it calls itself recursively
  // and references refs directly - no stale closure issues.
  const playNextChunk = useCallback((): void => {
    const refs = getTtsRefs(messageId);
    const nextIndex = refs.currentPlayingIndex;
    const audio = refs.audioQueue[nextIndex];

    logger.debug(`TTS: playNextChunk called`, {
      nextIndex,
      totalChunks: refs.chunks.length,
      hasAudio: !!audio,
    });

    if (!audio) {
      logger.debug(`TTS: No audio available for chunk ${nextIndex + 1}`);
      return;
    }

    logger.debug(`TTS: Playing chunk ${nextIndex + 1}/${refs.chunks.length}`);
    setStore(messageId, { currentChunk: nextIndex + 1, isPlaying: true });

    // Schedule prefetch of next chunk based on current audio duration
    const schedulePrefetch = (): void => {
      const duration = audio.duration;

      if (!duration || isNaN(duration)) {
        return;
      }

      const PREFETCH_MARGIN = 2; // seconds
      const prefetchDelay = Math.max(0, (duration - PREFETCH_MARGIN) * 1000);

      if (refs.prefetchTimer) {
        clearTimeout(refs.prefetchTimer);
      }

      refs.prefetchTimer = setTimeout(() => {
        const currentRefs = getTtsRefs(messageId);
        const nextFetchIndex = currentRefs.currentFetchingIndex;
        if (nextFetchIndex < currentRefs.chunks.length) {
          void fetchChunkAudio(
            nextFetchIndex,
            currentRefs.chunks[nextFetchIndex]!,
          ).then((nextAudio) => {
            if (nextAudio) {
              const r = getTtsRefs(messageId);
              r.audioQueue[nextFetchIndex] = nextAudio;
              r.currentFetchingIndex++;

              if (r.isProcessing && r.currentPlayingIndex === nextFetchIndex) {
                playNextChunk();
              }
            } else {
              logger.error(
                `TTS: Failed to prefetch chunk ${nextFetchIndex + 1}`,
              );
            }
            return undefined;
          });
        }
      }, prefetchDelay);
    };

    const onLoadedMetadata = (): void => {
      schedulePrefetch();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };

    if (audio.duration && !isNaN(audio.duration)) {
      schedulePrefetch();
    } else {
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
    }

    const onEnded = (): void => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onAudioError);

      const refs2 = getTtsRefs(messageId);
      refs2.currentPlayingIndex++;

      if (refs2.currentPlayingIndex < refs2.chunks.length) {
        const nextAudio = refs2.audioQueue[refs2.currentPlayingIndex];
        if (nextAudio) {
          playNextChunk();
        } else {
          setStore(messageId, { isPlaying: false });
        }
      } else {
        // All chunks played
        logger.debug("TTS: All chunks played, stopping");
        setStore(messageId, { isPlaying: false });
        refs2.isProcessing = false;
      }
    };

    const onAudioError = (): void => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onAudioError);

      const audioError = new Error(t("hooks.tts.failed-to-play"));
      logger.error(
        `TTS: Chunk ${nextIndex + 1} playback error`,
        parseError(audioError),
      );

      setStore(messageId, {
        error: t("hooks.tts.failed-to-play"),
        isPlaying: false,
      });

      const refs2 = getTtsRefs(messageId);
      refs2.isProcessing = false;
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onAudioError);

    void audio
      .play()
      .then(() => {
        logger.debug(`TTS: Audio.play() succeeded for chunk ${nextIndex + 1}`);
        return undefined;
      })
      .catch((err: Error | null) => {
        logger.error(`TTS: Failed to play chunk ${nextIndex + 1}`, {
          error: err instanceof Error ? err.message : String(err),
        });

        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onAudioError);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);

        setStore(messageId, {
          error: t("hooks.tts.failed-to-play"),
          isPlaying: false,
        });

        const refs2 = getTtsRefs(messageId);
        refs2.isProcessing = false;
      });
  }, [logger, messageId, t, fetchChunkAudio, setStore]);

  // Main play audio function
  const playAudio = useCallback(async (): Promise<void> => {
    const refs = getTtsRefs(messageId);

    if (refs.isProcessing) {
      logger.debug("TTS: Already processing, skipping");
      return;
    }

    if (!text.trim()) {
      logger.debug("TTS: No text to convert");
      return;
    }

    if (!ttsForm) {
      const errorMsg = t("hooks.tts.endpoint-not-available");
      logger.error("TTS: Endpoint not available", errorMsg);
      setStore(messageId, { error: errorMsg });
      onError?.(errorMsg);
      return;
    }

    refs.isProcessing = true;
    setStore(messageId, { error: null, isLoading: true });

    try {
      logger.debug("TTS: Starting playAudio", {
        originalTextLength: text.length,
        originalTextPreview: text.slice(0, 100),
      });

      if (!text.trim()) {
        logger.debug("TTS: No text to process");
        refs.isProcessing = false;
        setStore(messageId, { isLoading: false });
        return;
      }

      const chunks = chunkTextForTTS(text);
      refs.chunks = chunks;

      logger.debug("TTS: Text chunked", {
        numChunks: chunks.length,
        chunkLengths: chunks.map((c) => c.length),
        firstChunkPreview: chunks[0]?.slice(0, 50),
      });

      setStore(messageId, { totalChunks: chunks.length, currentChunk: 0 });
      refs.audioQueue = Array.from({ length: chunks.length }, () => null);
      refs.currentPlayingIndex = 0;
      refs.currentFetchingIndex = 1;

      const firstAudio = await fetchChunkAudio(0, chunks[0]!);

      if (!firstAudio) {
        logger.error("TTS: Failed to fetch first chunk");
        refs.isProcessing = false;
        setStore(messageId, { isLoading: false });
        return;
      }

      refs.audioQueue[0] = firstAudio;
      setStore(messageId, { isLoading: false });
      playNextChunk();
    } catch (err) {
      const refs2 = getTtsRefs(messageId);
      if (refs2.abortController?.signal.aborted) {
        logger.debug("TTS: Request was cancelled by user");
        return;
      }

      const errorMsg =
        err instanceof Error ? err.message : t("hooks.tts.failed-to-generate");
      logger.error("TTS: Exception during processing", parseError(err));
      setStore(messageId, { error: errorMsg, isLoading: false });
      onError?.(errorMsg);
      refs2.isProcessing = false;
    }
  }, [
    text,
    ttsForm,
    logger,
    messageId,
    t,
    onError,
    fetchChunkAudio,
    playNextChunk,
    setStore,
  ]);

  return {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    cancelLoading,
    error,
    currentChunk,
    totalChunks,
  };
}
