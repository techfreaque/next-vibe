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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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
  }, []);

  const processRecording = useCallback(async (): Promise<void> => {
    const currentEndpoint = endpointRef.current;
    logger.debug("STT: Processing recording", {
      hasEndpointCreate: !!currentEndpoint?.create,
    });

    if (!currentEndpoint?.create) {
      const errorMsg = t("hooks.stt.endpoint-not-available");
      logger.error("STT: Endpoint not available", errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      logger.debug("STT: Starting processing");

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });

      // Bail out if blob is too small (silent/empty recording)
      if (audioBlob.size < 1000) {
        logger.debug("STT: Audio too short/silent, skipping transcription", {
          blobSize: audioBlob.size,
        });
        setIsProcessing(false);
        return;
      }

      // Create a File object from the blob
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type,
      });

      // Set form values and submit
      logger.debug("STT: Submitting audio", {
        fileSize: audioFile.size,
        provider: "openai",
      });

      // Set form values - set the nested object structure directly
      currentEndpoint.create.form.setValue("fileUpload", { file: audioFile });

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

            setTranscript(transcribedText);
            onTranscript?.(transcribedText);
            setIsProcessing(false);
            cleanup();
          } else {
            const errorMessage = t("hooks.stt.transcription-failed");
            logger.error("STT: Transcription failed", errorMessage);
            setError(errorMessage);
            onError?.(errorMessage);
            setIsProcessing(false);
            cleanup();
          }
        },
        onError: ({ error: apiError }) => {
          // Use the error message directly (already human-readable from server)
          const errorMessage =
            apiError.message ?? t("hooks.stt.transcription-failed");
          logger.error("STT: API returned error", {
            errorType: apiError.errorType,
            errorMessage: apiError.message,
            translatedMessage: errorMessage,
          });
          setError(errorMessage);
          onError?.(errorMessage);
          setIsProcessing(false);
          cleanup();
        },
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : t("hooks.stt.transcription-failed");
      logger.error("STT: Exception during transcription", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
      setIsProcessing(false);
      cleanup();
    }
  }, [logger, t, onTranscript, onError, cleanup]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Clear any previous errors when starting a new recording
      setError(null);

      logger.debug("STT: Requesting microphone access");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      logger.debug("STT: Creating MediaRecorder");
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event): void => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          logger.debug("STT: Audio chunk received", {
            size: event.data.size,
          });
        }
      };

      mediaRecorder.onstop = (): void => {
        logger.debug("STT: Recording stopped, processing...");
        void processRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      logger.debug("STT: Recording started");
    } catch (err) {
      const errorMsg =
        err instanceof DOMException || err instanceof Error
          ? getMicrophoneErrorMessage(err, t)
          : t("hooks.stt.failed-to-start");
      logger.error("STT: Failed to start recording", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
      cleanup();
    }
  }, [logger, t, onError, cleanup, processRecording]);

  const stopRecording = useCallback((): void => {
    logger.debug("STT: Stop recording called");
    if (mediaRecorderRef.current && isRecording) {
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

          // Create File object - always set an explicit audio MIME type so
          // server-side validation (file.type.startsWith("audio/")) passes even
          // when the browser doesn't propagate the codec string through FormData.
          const audioFile = new File([audioBlob], "recording.webm", {
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
   * Cancel recording and discard all audio data
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

    // Clean up everything
    cleanup();
    setIsRecording(false);
    setIsPaused(false);
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
  };
}
