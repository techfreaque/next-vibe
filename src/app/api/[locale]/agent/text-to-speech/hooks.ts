/**
 * Text-to-Speech Hooks
 * React hooks for TTS functionality
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { useCallback, useEffect, useRef, useState } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { TTS_COST_PER_CHARACTER } from "../../products/repository-client";
import { chunkTextForTTS } from "./chunking";
import textToSpeechDefinitions from "./definition";
import type { TtsVoiceValue } from "./enum";
import { DEFAULT_TTS_VOICE } from "./enum";

interface UseTTSAudioOptions {
  text: string;
  enabled: boolean;
  isStreaming?: boolean; // If true, wait for streaming to complete before auto-playing
  locale: CountryLanguage;
  voice?: typeof TtsVoiceValue; // Voice to use for TTS (defaults to MALE if not provided)
  onError?: (error: string) => void;
  logger: EndpointLogger;
  deductCredits: (creditCost: number, feature: string) => void;
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
  voice,
  onError,
  logger,
  deductCredits,
}: UseTTSAudioOptions): UseTTSAudioReturn {
  const { t } = simpleT(locale);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  // Use voice from props (set by chat settings)
  const voicePreference = voice ?? DEFAULT_TTS_VOICE;

  // Refs for audio management
  const audioQueueRef = useRef<(HTMLAudioElement | null)[]>([]);
  const currentPlayingIndexRef = useRef(0);
  const currentFetchingIndexRef = useRef(0);
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prefetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chunksRef = useRef<string[]>([]);

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

  // Get loading state directly from the mutation
  const isLoading = endpoint.create?.isSubmitting ?? false;

  // Cancel loading (interrupt API request and playback)
  const cancelLoading = useCallback((): void => {
    logger.debug("TTS: Cancelling loading and playback", {
      currentPlayingIndex: currentPlayingIndexRef.current,
      currentFetchingIndex: currentFetchingIndexRef.current,
      totalChunks: chunksRef.current.length,
      audioQueueLength: audioQueueRef.current.length,
    });

    // Abort current fetch
    if (abortControllerRef.current) {
      logger.debug("TTS: Aborting current fetch request");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear prefetch timer
    if (prefetchTimerRef.current) {
      logger.debug("TTS: Clearing prefetch timer");
      clearTimeout(prefetchTimerRef.current);
      prefetchTimerRef.current = null;
    }

    // Stop all audio playback
    const audioCount = audioQueueRef.current.filter((a) => a !== null).length;
    logger.debug(`TTS: Stopping ${audioCount} audio elements`);
    audioQueueRef.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    // Clear audio queue
    audioQueueRef.current = [];

    // Reset state
    isProcessingRef.current = false;
    currentPlayingIndexRef.current = 0;
    currentFetchingIndexRef.current = 0;
    chunksRef.current = [];
    setIsPlaying(false);
    setCurrentChunk(0);
    setTotalChunks(0);

    logger.debug("TTS: Cancel complete, all state reset");
  }, [logger]);

  // Stop audio playback
  const stopAudio = useCallback((): void => {
    logger.debug("TTS: Stopping audio");

    // Stop currently playing audio
    const currentAudio = audioQueueRef.current[currentPlayingIndexRef.current];
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setIsPlaying(false);
  }, [logger]);

  // Fetch audio for a specific chunk
  const fetchChunkAudio = useCallback(
    (chunkIndex: number, chunkText: string): Promise<HTMLAudioElement | null> => {
      if (!endpoint.create) {
        return Promise.resolve(null);
      }

      logger.debug(`TTS: Fetching chunk ${chunkIndex + 1}/${chunksRef.current.length}`, {
        chunkLength: chunkText.length,
      });

      // Create new AbortController for this chunk
      abortControllerRef.current = new AbortController();

      return new Promise((resolve) => {
        // Set form values for this chunk
        endpoint.create!.form.setValue("text", chunkText);
        endpoint.create!.form.setValue("voice", voicePreference);

        // Submit form
        void endpoint.create!.submitForm({
          onSuccess: ({ responseData }) => {
            const audioDataUrl = responseData.audioUrl;
            logger.debug(`TTS: Got audio for chunk ${chunkIndex + 1}`, {
              urlLength: audioDataUrl.length,
            });

            // Optimistically update credit balance in UI
            // Calculate credits based on character count
            const characterCount = chunkText.length;
            const creditCost = characterCount * TTS_COST_PER_CHARACTER;
            if (creditCost > 0) {
              deductCredits(creditCost, "tts");
            }

            // Create audio element
            const audio = new Audio(audioDataUrl);
            resolve(audio);
          },
          onError: ({ error }) => {
            // Check if this was an abort
            if (abortControllerRef.current?.signal.aborted) {
              logger.debug(`TTS: Chunk ${chunkIndex + 1} was cancelled`);
              resolve(null);
              return;
            }

            logger.error(`TTS: Failed to fetch chunk ${chunkIndex + 1}`, {
              errorType: error.errorType,
              errorMessage: error.message,
            });
            const errorMsg = error.message || t("app.chat.hooks.tts.failed-to-generate");
            setError(errorMsg);
            onError?.(errorMsg);
            resolve(null);
          },
        });
      });
    },
    [endpoint, logger, t, onError, deductCredits, voicePreference],
  );

  // Play next chunk in the queue
  const playNextChunk = useCallback((): void => {
    const nextIndex = currentPlayingIndexRef.current;
    const audio = audioQueueRef.current[nextIndex];

    logger.info(`TTS: playNextChunk called`, {
      nextIndex,
      totalChunks: chunksRef.current.length,
      hasAudio: !!audio,
      queueState: audioQueueRef.current.map((a, i) => ({
        index: i,
        hasAudio: !!a,
      })),
    });

    if (!audio) {
      logger.info(`TTS: No audio available for chunk ${nextIndex + 1}`);
      return;
    }

    logger.info(`TTS: Playing chunk ${nextIndex + 1}/${chunksRef.current.length}`);
    setCurrentChunk(nextIndex + 1);
    setIsPlaying(true);

    // Schedule prefetch of next chunk based on current audio duration
    const schedulePrefetch = (): void => {
      const duration = audio.duration;

      if (!duration || isNaN(duration)) {
        logger.info(`TTS: Chunk ${nextIndex + 1} duration not available yet, will retry`);
        return;
      }

      logger.info(`TTS: Chunk ${nextIndex + 1} duration: ${duration}s`, {
        currentFetchingIndex: currentFetchingIndexRef.current,
        totalChunks: chunksRef.current.length,
      });

      // Schedule prefetch of next chunk (2 seconds before this one ends)
      const PREFETCH_MARGIN = 2; // seconds
      const prefetchDelay = Math.max(0, (duration - PREFETCH_MARGIN) * 1000);

      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }

      logger.info(`TTS: Scheduling prefetch`, {
        nextFetchIndex: currentFetchingIndexRef.current,
        prefetchDelay: `${prefetchDelay}ms`,
        willPrefetch: currentFetchingIndexRef.current < chunksRef.current.length,
      });

      prefetchTimerRef.current = setTimeout(() => {
        const nextFetchIndex = currentFetchingIndexRef.current;
        if (nextFetchIndex < chunksRef.current.length) {
          logger.info(`TTS: Prefetch timer fired, fetching chunk ${nextFetchIndex + 1}`);
          void fetchChunkAudio(nextFetchIndex, chunksRef.current[nextFetchIndex]!).then(
            (nextAudio) => {
              if (nextAudio) {
                logger.info(`TTS: Prefetched chunk ${nextFetchIndex + 1} successfully`, {
                  isProcessing: isProcessingRef.current,
                  currentPlayingIndex: currentPlayingIndexRef.current,
                  nextFetchIndex,
                  shouldAutoPlay:
                    isProcessingRef.current && currentPlayingIndexRef.current === nextFetchIndex,
                });
                audioQueueRef.current[nextFetchIndex] = nextAudio;
                currentFetchingIndexRef.current++;

                // If we're waiting for this chunk to play, start playing it now
                // Check: we're still processing AND the current playing index matches this chunk
                if (isProcessingRef.current && currentPlayingIndexRef.current === nextFetchIndex) {
                  logger.info(`TTS: Auto-playing fetched chunk ${nextFetchIndex + 1}`);
                  playNextChunk();
                } else {
                  logger.info(`TTS: NOT auto-playing chunk ${nextFetchIndex + 1}`, {
                    reason: isProcessingRef.current ? "playing index mismatch" : "not processing",
                    isProcessing: isProcessingRef.current,
                    currentPlayingIndex: currentPlayingIndexRef.current,
                    nextFetchIndex,
                  });
                }
              } else {
                logger.error(`TTS: Failed to prefetch chunk ${nextFetchIndex + 1}`);
              }
              return undefined;
            },
          );
        } else {
          logger.info(`TTS: No more chunks to prefetch`);
        }
      }, prefetchDelay);
    };

    // Define loadedmetadata handler (may or may not be used)
    const onLoadedMetadata = (): void => {
      schedulePrefetch();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };

    // Try to schedule prefetch immediately if duration is available
    if (audio.duration && !isNaN(audio.duration)) {
      schedulePrefetch();
    } else {
      // If duration not available yet, wait for loadedmetadata event
      audio.addEventListener("loadedmetadata", onLoadedMetadata);
    }

    // Set up event listeners
    const onEnded = (): void => {
      logger.info(`TTS: Chunk ${nextIndex + 1} playback ended`, {
        currentPlayingIndex: currentPlayingIndexRef.current,
        totalChunks: chunksRef.current.length,
      });

      // Remove event listeners to prevent memory leaks
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onAudioError);

      // Move to next chunk
      currentPlayingIndexRef.current++;

      logger.debug(`TTS: Moving to next chunk`, {
        newPlayingIndex: currentPlayingIndexRef.current,
        totalChunks: chunksRef.current.length,
      });

      // Check if there are more chunks to play
      logger.info(`TTS: Checking for more chunks`, {
        currentPlayingIndex: currentPlayingIndexRef.current,
        totalChunks: chunksRef.current.length,
        hasMoreChunks: currentPlayingIndexRef.current < chunksRef.current.length,
      });

      if (currentPlayingIndexRef.current < chunksRef.current.length) {
        const nextAudio = audioQueueRef.current[currentPlayingIndexRef.current];
        logger.info(`TTS: Next chunk status`, {
          nextIndex: currentPlayingIndexRef.current,
          hasNextAudio: !!nextAudio,
          isProcessing: isProcessingRef.current,
        });

        if (nextAudio) {
          // Next chunk is ready, play it immediately
          logger.info(
            `TTS: Next chunk ${currentPlayingIndexRef.current + 1} is ready, playing now`,
          );
          playNextChunk();
        } else {
          // Next chunk not ready yet, wait for it
          logger.info(
            `TTS: Waiting for chunk ${currentPlayingIndexRef.current + 1} to be fetched`,
            {
              isProcessing: isProcessingRef.current,
              currentFetchingIndex: currentFetchingIndexRef.current,
            },
          );
          setIsPlaying(false);
        }
      } else {
        // All chunks played
        logger.info("TTS: All chunks played, stopping");
        setIsPlaying(false);
        isProcessingRef.current = false;
      }
    };

    const onAudioError = (): void => {
      const audioError = new Error(t("app.chat.hooks.tts.failed-to-play"));
      logger.error(`TTS: Chunk ${nextIndex + 1} playback error`, parseError(audioError));

      // Remove event listeners
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onAudioError);

      setError(t("app.chat.hooks.tts.failed-to-play"));
      setIsPlaying(false);
      isProcessingRef.current = false;
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onAudioError);

    // Play audio
    logger.debug(`TTS: Starting audio.play() for chunk ${nextIndex + 1}`);
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

        // Remove event listeners
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onAudioError);
        audio.removeEventListener("loadedmetadata", onLoadedMetadata);

        setError(t("app.chat.hooks.tts.failed-to-play"));
        setIsPlaying(false);
        isProcessingRef.current = false;
      });
  }, [logger, t, fetchChunkAudio]);

  // Main play audio function - orchestrates chunked generation
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

    if (!endpoint.create) {
      const errorMsg = t("app.chat.hooks.tts.endpoint-not-available");
      logger.error("TTS: Endpoint not available", errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    isProcessingRef.current = true;
    setError(null);

    try {
      logger.info("TTS: Starting playAudio", {
        originalTextLength: text.length,
        originalTextPreview: text.slice(0, 100),
      });

      // Text has already been processed by processMessageGroupForTTS
      // (think tags stripped, markdown removed, line breaks converted to pauses)
      if (!text.trim()) {
        logger.info("TTS: No text to process");
        isProcessingRef.current = false;
        return;
      }

      // Split text into chunks
      const chunks = chunkTextForTTS(text);
      chunksRef.current = chunks;

      logger.info("TTS: Text chunked", {
        numChunks: chunks.length,
        chunkLengths: chunks.map((c) => c.length),
        firstChunkPreview: chunks[0]?.slice(0, 50),
      });

      // Initialize state
      setTotalChunks(chunks.length);
      setCurrentChunk(0);
      audioQueueRef.current = Array.from({ length: chunks.length }, () => null);
      currentPlayingIndexRef.current = 0;
      currentFetchingIndexRef.current = 1; // Will fetch chunk 1 after chunk 0 starts playing

      // Fetch first chunk
      logger.debug("TTS: Fetching first chunk", {
        chunkIndex: 0,
        chunkLength: chunks[0]!.length,
      });

      const firstAudio = await fetchChunkAudio(0, chunks[0]!);

      if (!firstAudio) {
        logger.error("TTS: Failed to fetch first chunk");
        isProcessingRef.current = false;
        return;
      }

      logger.debug("TTS: First chunk fetched successfully", {
        audioDuration: firstAudio.duration,
      });

      // Store first audio in queue
      audioQueueRef.current[0] = firstAudio;

      // Start playing first chunk (this will trigger prefetching of next chunks)
      logger.debug("TTS: Starting playback of first chunk");
      playNextChunk();
    } catch (err) {
      // Check if this was an abort
      if (abortControllerRef.current?.signal.aborted) {
        logger.debug("TTS: Request was cancelled by user");
        return;
      }

      const errorMsg =
        err instanceof Error ? err.message : t("app.chat.hooks.tts.failed-to-generate");
      logger.error("TTS: Exception during processing", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
      isProcessingRef.current = false;
    }
  }, [text, endpoint, logger, t, onError, fetchChunkAudio, playNextChunk]);

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
      // Stop all audio in queue
      audioQueueRef.current.forEach((audio) => {
        if (audio) {
          audio.pause();
        }
      });

      // Clear prefetch timer
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }

      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
