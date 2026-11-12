/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  isBrowserNetworkLossMessage,
  parseError,
} from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getVisibilityState } from "next-vibe/ui/lib/dom";
import { isOnline } from "next-vibe/ui/lib/media";
import { useEndpointCreate } from "next-vibe/unified-ui/hooks/use-endpoint-create";
import { useCallback } from "react";

import { scopedTranslation as chatScopedTranslation } from "../chat/i18n";
import {
  classifyPlayRejection,
  describeAudioElement,
} from "./audio-diagnostics";
import { chunkTextForTTS } from "./chunking";
import { DEFAULT_TTS_VOICE_ID } from "./constants";
import textToSpeechDefinitions from "./definition";
import { type TtsModelId } from "./models";
import { getTtsRefs, resetTtsRefs, useTtsStore } from "./tts-store";

/** One retry for a browser-level network failure, after a short pause. */
const TTS_MAX_ATTEMPTS = 2;
const TTS_RETRY_DELAY_MS = 1500;

interface ChunkFetchResult {
  audio: HTMLAudioElement | null;
  /** Display message when the fetch failed; null on success or cancel. */
  error: string | null;
}

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  isStreaming?: boolean; // If true, wait for streaming to complete before auto-playing
  locale: CountryLanguage;
  voiceId?: TtsModelId; // Voice model ID to use for TTS
  onError?: (error: string) => void;
  user: JwtPayloadType;
  logger: EndpointLogger;
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

  // Fetch audio for a specific chunk. A browser-level fetch failure ("Failed
  // to fetch" / NetworkError - connection blip, tab backgrounded on mobile,
  // proxy drop) is retried once while online; anything else fails at once.
  // Named function expression so the retry can recurse without reading the
  // binding during its own initialization.
  const fetchChunkAudio = useCallback(
    function fetchChunk(
      chunkIndex: number,
      chunkText: string,
      attempt = 1,
    ): Promise<ChunkFetchResult> {
      if (!ttsForm) {
        return Promise.resolve({ audio: null, error: null });
      }

      const refs = getTtsRefs(messageId);
      const startedAt = Date.now();

      logger.debug(
        `TTS: Fetching chunk ${chunkIndex + 1}/${refs.chunks.length}`,
        {
          chunkLength: chunkText.length,
          attempt,
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
              attempt,
            });

            const audio = new Audio(audioDataUrl);
            resolve({ audio, error: null });
          },
          onError: ({ error: endpointError }) => {
            const refs2 = getTtsRefs(messageId);
            // Check if this was an abort
            if (refs2.abortController?.signal.aborted) {
              logger.debug(`TTS: Chunk ${chunkIndex + 1} was cancelled`);
              resolve({ audio: null, error: null });
              return;
            }

            const isNetworkLoss = isBrowserNetworkLossMessage(
              endpointError.message,
            );
            const online = isOnline();
            if (isNetworkLoss && attempt < TTS_MAX_ATTEMPTS && online) {
              logger.debug(
                `TTS: Network loss on chunk ${chunkIndex + 1}, retrying once`,
                { elapsedMs: Date.now() - startedAt },
              );
              setTimeout(() => {
                // Cancelled (stop/cancelLoading reset the refs) meanwhile
                if (!getTtsRefs(messageId).isProcessing) {
                  resolve({ audio: null, error: null });
                  return;
                }
                void fetchChunk(chunkIndex, chunkText, attempt + 1).then(
                  resolve,
                );
              }, TTS_RETRY_DELAY_MS);
              return;
            }

            logger.error(`TTS: Failed to fetch chunk ${chunkIndex + 1}`, {
              errorType: endpointError.errorType,
              errorMessage: endpointError.message,
              isNetworkLoss,
              attempt,
              chunkIndex,
              chunkLength: chunkText.length,
              totalChunks: refs2.chunks.length,
              elapsedMs: Date.now() - startedAt,
              voiceId: voicePreference,
              // Network-loss triage: offline -> user connectivity; hidden ->
              // backgrounded tab; online + visible -> server/proxy drop.
              online,
              visibilityState: getVisibilityState(),
            });
            const errorMsg =
              endpointError.message || t("hooks.tts.failed-to-generate");
            setStore(messageId, { error: errorMsg });
            onError?.(errorMsg);
            resolve({ audio: null, error: errorMsg });
          },
        });
      });
    },
    [ttsForm, logger, messageId, t, onError, voicePreference, setStore],
  );

  // Play next chunk in the queue - references refs directly, no stale closure issues.
  // Named function expression so the recursive calls don't read the binding during its own initialization.
  const playNextChunk = useCallback(
    function playQueuedChunk(): void {
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
            ).then(({ audio: nextAudio, error: prefetchError }) => {
              if (nextAudio) {
                const r = getTtsRefs(messageId);
                r.audioQueue[nextFetchIndex] = nextAudio;
                r.currentFetchingIndex++;

                if (
                  r.isProcessing &&
                  r.currentPlayingIndex === nextFetchIndex
                ) {
                  playQueuedChunk();
                }
              } else {
                const r = getTtsRefs(messageId);
                // error null = cancelled, not a failure
                if (prefetchError !== null) {
                  logger.error(
                    `TTS: Failed to prefetch chunk ${nextFetchIndex + 1}`,
                    {
                      error: prefetchError,
                      chunkIndex: nextFetchIndex,
                      totalChunks: r.chunks.length,
                      currentPlayingIndex: r.currentPlayingIndex,
                      voiceId: voicePreference,
                    },
                  );
                } else {
                  logger.debug(
                    `TTS: Prefetch of chunk ${nextFetchIndex + 1} cancelled`,
                  );
                }
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
            playQueuedChunk();
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
          {
            ...describeAudioElement(audio),
            // network vs decode vs unsupported source, from audio.error.code
            chunkIndex: nextIndex,
            totalChunks: getTtsRefs(messageId).chunks.length,
            voiceId: voicePreference,
            messageId,
          },
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
          logger.debug(
            `TTS: Audio.play() succeeded for chunk ${nextIndex + 1}`,
          );
          return undefined;
        })
        .catch((err: Error | null) => {
          const errMsg = err instanceof Error ? err.message : String(err);
          // Browser autoplay policy blocks audio outside user gesture — expected when
          // autoplay is enabled and user hasn't interacted recently.
          const isAutoplayBlocked =
            errMsg.includes("user gesture") ||
            errMsg.includes("NotAllowedError");
          if (isAutoplayBlocked) {
            logger.warn(
              `TTS: Autoplay blocked by browser for chunk ${nextIndex + 1}`,
              {
                ...describeAudioElement(audio),
                error: errMsg,
                failureKind: classifyPlayRejection(err),
                errorName: err instanceof Error ? err.name : null,
                chunkIndex: nextIndex,
                totalChunks: getTtsRefs(messageId).chunks.length,
                voiceId: voicePreference,
                messageId,
              },
            );
          } else {
            logger.error(`TTS: Failed to play chunk ${nextIndex + 1}`, {
              ...describeAudioElement(audio),
              error: errMsg,
              failureKind: classifyPlayRejection(err),
              errorName: err instanceof Error ? err.name : null,
              chunkIndex: nextIndex,
              totalChunks: getTtsRefs(messageId).chunks.length,
              voiceId: voicePreference,
              messageId,
            });
          }

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
    },
    [logger, messageId, t, fetchChunkAudio, setStore, voicePreference],
  );

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

      const { audio: firstAudio, error: firstError } = await fetchChunkAudio(
        0,
        chunks[0]!,
      );

      if (!firstAudio) {
        if (firstError !== null) {
          logger.error("TTS: Failed to fetch first chunk", {
            error: firstError,
            totalChunks: chunks.length,
            voiceId: voicePreference,
          });
        }
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
    voicePreference,
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
