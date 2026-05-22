/**
 * Speech-to-Text Hooks
 * React hooks for STT functionality
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  type ChatT,
  scopedTranslation as chatScopedTranslation,
} from "@/app/api/[locale]/agent/chat/i18n";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import speechToTextDefinitions from "./definition";

interface UseEdenAISpeechOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  locale: CountryLanguage;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

interface UseEdenAISpeechReturn {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  /** Stop recording and return raw audio blob without transcribing */
  stopRecordingAndGetBlob: () => Promise<File | null>;
  /** Cancel recording and discard all audio data */
  cancelRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  toggleRecording: () => Promise<void>;
  togglePause: () => void;
  error: string | null;
  transcript: string | null;
  stream: MediaStream | null;
  clearError: () => void;
  /** Whether there is a saved audio file available to retry */
  hasSavedAudio: boolean;
  /** Retry transcription using the saved audio file from the last failed attempt */
  retryTranscription: () => Promise<void>;
  /** Download the saved audio file from the last failed attempt */
  downloadSavedAudio: () => void;
}

/**
 * Detect device platform from userAgent for device-specific microphone hints
 */
function getDevicePlatform():
  | "ios"
  | "android"
  | "mac"
  | "windows"
  | "generic" {
  if (typeof navigator === "undefined") {
    return "generic";
  }
  const ua = navigator.userAgent;
  // iOS check must come before Mac check (iPad reports as Macintosh with touch)
  if (
    /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && "ontouchend" in document)
  ) {
    return "ios";
  }
  if (/Android/.test(ua)) {
    return "android";
  }
  if (/Macintosh|Mac OS X/.test(ua)) {
    return "mac";
  }
  if (/Windows/.test(ua)) {
    return "windows";
  }
  return "generic";
}

/**
 * Map getUserMedia errors to device-specific, actionable i18n messages
 */
function getMicrophoneErrorMessage(
  err: DOMException | Error,
  t: ChatT,
): string {
  const name = err.name;

  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError": {
      const platform = getDevicePlatform();
      const permissionKeys = {
        ios: "hooks.stt.permission-denied-ios",
        android: "hooks.stt.permission-denied-android",
        mac: "hooks.stt.permission-denied-mac",
        windows: "hooks.stt.permission-denied-windows",
        generic: "hooks.stt.permission-denied",
      } as const;
      return t(permissionKeys[platform]);
    }
    case "NotFoundError":
    case "DevicesNotFoundError":
      return t("hooks.stt.no-microphone");
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return t("hooks.stt.microphone-in-use");
    case "TypeError":
    case "NotSupportedError":
      return t("hooks.stt.not-supported");
    default:
      return t("hooks.stt.failed-to-start");
  }
}

// Silence detection thresholds (module-level constants, stable across renders)
const SILENCE_THRESHOLD_RMS = 0.015; // RMS below this = silence
const SILENCE_DURATION_MS = 1500; // seal chunk after 1.5s of silence
const MIN_CHUNK_MS = 3000; // never seal a chunk shorter than 3s
const MAX_CHUNK_MS = 4 * 60 * 1000; // force-seal at 4 minutes

export function useEdenAISpeech({
  onTranscript,
  onError,
  locale,
  user,
  logger,
}: UseEdenAISpeechOptions): UseEdenAISpeechReturn {
  const { t } = useMemo(() => chatScopedTranslation.scopedT(locale), [locale]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [hasSavedAudio, setHasSavedAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // Raw MediaRecorder blobs for the current in-progress chunk
  const audioChunksRef = useRef<Blob[]>([]);
  // Completed silence-sealed chunks ready for submission
  const sealedChunksRef = useRef<File[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  // AnalyserNode for silence detection
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceRafRef = useRef<number | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  // True while the user is actively recording (false once stopRecording is called).
  // Used by onstop to distinguish mid-recording chunk cycles from the final stop.
  const activeRecordingRef = useRef<boolean>(false);
  // Saved chunks retained on failure so the user can retry without re-recording
  const savedAudioFilesRef = useRef<File[] | null>(null);

  // Use endpoint for type-safe API calls
  // Use a ref so processRecording doesn't need endpoint in its dep array
  const endpointRef = useRef<ReturnType<
    typeof useEndpoint<typeof speechToTextDefinitions>
  > | null>(null);
  const endpoint = useEndpoint(
    speechToTextDefinitions,
    {
      read: {
        queryOptions: {
          enabled: false, // Manual control
        },
      },
    },
    logger,
    user,
  );

  endpointRef.current = endpoint;

  // Cleanup function
  const cleanup = useCallback((): void => {
    // Stop silence detection
    if (silenceRafRef.current !== null) {
      cancelAnimationFrame(silenceRafRef.current);
      silenceRafRef.current = null;
    }
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    silenceStartRef.current = null;

    // Signal final stop so onstop doesn't cycle to a new recorder
    activeRecordingRef.current = false;

    // Stop media recorder if active
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    // Stop all media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track): void => track.stop());
      streamRef.current = null;
    }

    // Clear audio chunks
    audioChunksRef.current = [];
    sealedChunksRef.current = [];
  }, []);

  /**
   * Submit audio chunks for transcription.
   * Shared by processRecording (fresh recording) and retryTranscription (saved files).
   */
  const submitAudioFiles = useCallback(
    async (audioFiles: File[]): Promise<void> => {
      const currentEndpoint = endpointRef.current;
      if (!currentEndpoint?.create) {
        const errorMsg = t("hooks.stt.endpoint-not-available");
        logger.error("STT: Endpoint not available", errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
        setIsProcessing(false);
        return;
      }

      if (audioFiles.every((f) => f.size === 0)) {
        logger.error("STT: No valid audio files to submit");
        setError(t("hooks.stt.transcription-failed"));
        onError?.(t("hooks.stt.transcription-failed"));
        setIsProcessing(false);
        return;
      }

      logger.debug("STT: Submitting to endpoint", {
        chunkCount: audioFiles.length,
        totalSize: audioFiles.reduce((s, f) => s + f.size, 0),
      });

      // Set form values
      currentEndpoint.create.form.setValue("fileUpload", { files: audioFiles });

      // Submit form with callbacks
      await currentEndpoint.create.submitForm({
        onSuccess: ({ responseData }) => {
          logger.debug("STT: Response received", {
            responseData: JSON.stringify(responseData),
            hasResponse: !!responseData.response,
            keys: Object.keys(responseData),
          });

          if (responseData.response?.success) {
            const transcribedText = responseData.response.text;
            logger.debug("STT: Transcription received successfully", {
              textLength: transcribedText.length,
            });

            // Success: discard saved audio
            savedAudioFilesRef.current = null;
            setHasSavedAudio(false);
            setTranscript(transcribedText);
            onTranscript?.(transcribedText);
            setIsProcessing(false);
            cleanup();
          } else {
            const errorMessage = t("hooks.stt.transcription-failed");
            logger.error("STT: Transcription failed", errorMessage);
            // Keep savedAudioFileRef so user can retry
            setError(errorMessage);
            onError?.(errorMessage);
            setIsProcessing(false);
          }
        },
        onError: ({ error: apiError }) => {
          // Use the error message directly (already human-readable from server)
          // Apply messageParams to interpolate {{placeholders}} in the translated string
          const rawMessage =
            apiError.message ?? t("hooks.stt.transcription-failed");
          const errorMessage = (
            apiError.messageParams
              ? Object.entries(apiError.messageParams).reduce(
                  (msg, [key, val]) =>
                    msg.replaceAll(`{{${key}}}`, String(val)),
                  rawMessage as string,
                )
              : rawMessage
          ) as TranslatedKeyType;
          logger.error("STT: API returned error", {
            errorType: apiError.errorType,
            errorMessage: apiError.message,
            chunkCount: audioFiles.length,
          });
          // Keep savedAudioFilesRef so user can retry
          setError(errorMessage);
          onError?.(errorMessage);
          setIsProcessing(false);
        },
      });
    },
    [logger, t, onTranscript, onError, cleanup],
  );

  /**
   * Seal the current in-progress audioChunksRef into a File and push to sealedChunksRef.
   * Called on silence boundary and on stop.
   */
  const sealCurrentChunk = useCallback((): void => {
    if (audioChunksRef.current.length === 0) {
      return;
    }
    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const blob = new Blob(audioChunksRef.current, { type: mimeType });
    // Discard chunks too small to contain real audio (just container headers)
    if (blob.size < 5000) {
      audioChunksRef.current = [];
      return;
    }
    const ext = mimeType.includes("ogg")
      ? "ogg"
      : mimeType.includes("mp4") || mimeType.includes("mpeg")
        ? "mp4"
        : "webm";
    const idx = sealedChunksRef.current.length;
    sealedChunksRef.current.push(
      new File([blob], `chunk-${idx}.${ext}`, { type: mimeType }),
    );
    audioChunksRef.current = [];
    logger.debug("STT: Chunk sealed", { idx, size: blob.size });
  }, [logger]);

  const processRecording = useCallback(async (): Promise<void> => {
    logger.debug("STT: Processing recording");

    try {
      setIsProcessing(true);
      setError(null);

      // Stop VAD loop
      if (silenceRafRef.current !== null) {
        cancelAnimationFrame(silenceRafRef.current);
        silenceRafRef.current = null;
      }

      // Seal any remaining audio as the final chunk
      sealCurrentChunk();

      const allChunks = sealedChunksRef.current;

      if (allChunks.every((f) => f.size < 500)) {
        const errorMsg = t("hooks.stt.audio-too-short");
        setError(errorMsg);
        onError?.(errorMsg);
        setIsProcessing(false);
        cleanup();
        return;
      }

      logger.debug("STT: Submitting chunks", {
        chunkCount: allChunks.length,
        totalSize: allChunks.reduce((s, f) => s + f.size, 0),
      });

      // Save chunks so user can retry on failure
      savedAudioFilesRef.current = allChunks;
      setHasSavedAudio(true);

      await submitAudioFiles(allChunks);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("hooks.stt.transcription-failed");
      logger.error("STT: Exception during transcription", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
      setIsProcessing(false);
      // Don't cleanup so savedAudioFilesRef is preserved for retry
    }
  }, [logger, t, onError, cleanup, submitAudioFiles, sealCurrentChunk]);

  /** Retry transcription using the saved chunks from the last failed attempt */
  const retryTranscription = useCallback(async (): Promise<void> => {
    const audioFiles = savedAudioFilesRef.current;
    if (!audioFiles?.length) {
      logger.warn("STT: retryTranscription called but no saved audio");
      return;
    }
    logger.debug("STT: Retrying transcription", {
      chunkCount: audioFiles.length,
      totalSize: audioFiles.reduce((s, f) => s + f.size, 0),
    });
    setIsProcessing(true);
    setError(null);
    await submitAudioFiles(audioFiles);
  }, [logger, submitAudioFiles]);

  /** Download all saved chunks concatenated as a single file */
  const downloadSavedAudio = useCallback((): void => {
    const audioFiles = savedAudioFilesRef.current;
    if (!audioFiles?.length) {
      logger.warn("STT: downloadSavedAudio called but no saved audio");
      return;
    }
    const mimeType = audioFiles[0].type || "audio/webm";
    const ext = mimeType.includes("ogg")
      ? "ogg"
      : mimeType.includes("mp4") || mimeType.includes("mpeg")
        ? "mp4"
        : mimeType.includes("wav")
          ? "wav"
          : "webm";
    const blob = new Blob(audioFiles, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    logger.debug("STT: Audio downloaded", {
      fileName: a.download,
      chunks: audioFiles.length,
      size: blob.size,
    });
  }, [logger]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Clear any previous errors and chunk state
      setError(null);
      sealedChunksRef.current = [];
      audioChunksRef.current = [];
      silenceStartRef.current = null;

      logger.debug("STT: Requesting microphone access");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up AnalyserNode for RMS-based silence detection
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      logger.debug("STT: Creating MediaRecorder");
      // Prefer audio/webm;codecs=opus - supported on Chrome/Edge (Windows/Linux/Mac).
      // Fall back to browser default if not supported (Firefox uses audio/ogg;codecs=opus).
      const preferredMime = "audio/webm;codecs=opus";
      const mediaRecorder = MediaRecorder.isTypeSupported(preferredMime)
        ? new MediaRecorder(stream, { mimeType: preferredMime })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunkStartTime = { value: Date.now() };

      // startChunkRecorder: creates a fresh MediaRecorder on the existing stream.
      // Each stop() produces one complete, self-contained WebM file (proper EBML header).
      // Concatenating timeslice blobs produces fragmented WebM that some providers reject.
      const startChunkRecorder = (): void => {
        const rec = MediaRecorder.isTypeSupported(preferredMime)
          ? new MediaRecorder(stream, { mimeType: preferredMime })
          : new MediaRecorder(stream);
        mediaRecorderRef.current = rec;
        audioChunksRef.current = [];

        rec.ondataavailable = (event): void => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        rec.onstop = (): void => {
          // Only seal if this stop was a mid-recording chunk cycle (not the final stop).
          // The final stop is detected via activeRecordingRef being false.
          if (activeRecordingRef.current) {
            sealCurrentChunk();
            chunkStartTime.value = Date.now();
            silenceStartRef.current = null;
            startChunkRecorder();
          } else {
            logger.debug("STT: Final recording stopped, processing...");
            void processRecording();
          }
        };

        rec.start();
      };

      activeRecordingRef.current = true;
      startChunkRecorder();
      setIsRecording(true);
      logger.debug("STT: Recording started");

      // VAD loop using requestAnimationFrame - AnalyserNode stays connected to stream
      // across recorder restarts, so silence detection continues uninterrupted.
      const dataArray = new Float32Array(analyser.fftSize);
      const tick = (): void => {
        if (!activeRecordingRef.current) {
          return;
        }

        analyser.getFloatTimeDomainData(dataArray);
        let sum = 0;
        for (const s of dataArray) {
          sum += s * s;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const now = Date.now();
        const chunkAge = now - chunkStartTime.value;

        if (mediaRecorderRef.current?.state === "paused") {
          // Don't detect silence while paused
          silenceStartRef.current = null;
          silenceRafRef.current = requestAnimationFrame(tick);
          return;
        }

        if (rms < SILENCE_THRESHOLD_RMS) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = now;
          }
          const silenceDuration = now - silenceStartRef.current;
          const shouldSeal =
            (silenceDuration >= SILENCE_DURATION_MS &&
              chunkAge >= MIN_CHUNK_MS) ||
            chunkAge >= MAX_CHUNK_MS;

          if (shouldSeal && mediaRecorderRef.current?.state === "recording") {
            logger.debug("STT: Silence detected, cycling recorder for chunk", {
              silenceDuration,
              chunkAge,
            });
            // Stop current recorder - onstop will seal chunk and start a new recorder
            mediaRecorderRef.current.stop();
          }
        } else {
          silenceStartRef.current = null;
        }

        silenceRafRef.current = requestAnimationFrame(tick);
      };

      silenceRafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      const errorMsg =
        err instanceof DOMException || err instanceof Error
          ? getMicrophoneErrorMessage(err, t)
          : t("hooks.stt.failed-to-start");
      logger.error("STT: Failed to start recording", {
        error: parseError(err).message,
      });
      setError(errorMsg);
      onError?.(errorMsg);
      cleanup();
    }
  }, [logger, t, onError, cleanup, processRecording, sealCurrentChunk]);

  const stopRecording = useCallback((): void => {
    logger.debug("STT: Stop recording called");
    if (mediaRecorderRef.current && isRecording) {
      // Signal final stop before calling stop() so onstop routes to processRecording
      activeRecordingRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording, logger]);

  /**
   * Stop recording and return raw audio blob without transcribing
   * Used for direct audio submission to ai-stream
   */
  const stopRecordingAndGetBlob =
    useCallback(async (): Promise<File | null> => {
      logger.debug("STT: Stop recording and get blob called");

      if (!mediaRecorderRef.current || !isRecording) {
        logger.warn("STT: Cannot get blob - not recording");
        return null;
      }

      return new Promise((resolve) => {
        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder) {
          resolve(null);
          return;
        }

        // Override the onstop handler for blob extraction
        mediaRecorder.onstop = (): void => {
          logger.debug("STT: Recording stopped for blob extraction", {
            chunksCount: audioChunksRef.current.length,
          });

          // Create audio blob from chunks
          const mimeType = mediaRecorder.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType,
          });

          // Create File object with correct extension for the actual container
          const blobExt = mimeType.includes("ogg")
            ? "ogg"
            : mimeType.includes("mp4") || mimeType.includes("mpeg")
              ? "mp4"
              : "webm";
          const audioFile = new File([audioBlob], `recording.${blobExt}`, {
            type: mimeType,
          });

          logger.debug("STT: Audio file created", {
            size: audioFile.size,
            type: audioFile.type,
          });

          // Cleanup without processing
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          audioChunksRef.current = [];
          mediaRecorderRef.current = null;

          setIsRecording(false);
          setIsPaused(false);

          // Note: Don't restore handler since we nullified mediaRecorderRef

          resolve(audioFile);
        };

        // Stop recording to trigger onstop
        mediaRecorder.stop();
      });
    }, [isRecording, logger]);

  const pauseRecording = useCallback((): void => {
    logger.debug("STT: Pause recording called");
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, [isRecording, isPaused, logger]);

  const resumeRecording = useCallback((): void => {
    logger.debug("STT: Resume recording called");
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, [isRecording, isPaused, logger]);

  const togglePause = useCallback((): void => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  }, [isPaused, pauseRecording, resumeRecording]);

  /**
   * Cancel recording and discard all audio data (including any saved retry file)
   * Does not trigger transcription or any processing
   */
  const cancelRecording = useCallback((): void => {
    logger.debug("STT: Cancel recording called");

    // Override onstop to prevent processing
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = (): void => {
        logger.debug("STT: Recording cancelled - discarding audio");
      };
    }

    // Discard saved audio too
    savedAudioFilesRef.current = null;
    setHasSavedAudio(false);

    // Clean up everything
    cleanup();
    setIsRecording(false);
    setIsPaused(false);
    setError(null);
  }, [cleanup, logger]);

  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    isRecording,
    isPaused,
    isProcessing,
    startRecording,
    stopRecording,
    stopRecordingAndGetBlob,
    cancelRecording,
    pauseRecording,
    resumeRecording,
    toggleRecording,
    togglePause,
    error,
    transcript,
    stream: streamRef.current,
    clearError,
    hasSavedAudio,
    retryTranscription,
    downloadSavedAudio,
  };
}
