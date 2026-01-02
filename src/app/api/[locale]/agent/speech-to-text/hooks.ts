/**
 * Speech-to-Text Hooks
 * React hooks for STT functionality
 */

"use client";

import { parseError } from "next-vibe/shared/utils/parse-error";
import { useCallback, useRef, useState } from "react";

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import speechToTextDefinitions from "./definition";

interface UseEdenAISpeechOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  locale: CountryLanguage;
  logger: EndpointLogger;
  deductCredits: (creditCost: number, feature: string) => void;
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

export function useEdenAISpeech({
  onTranscript,
  onError,
  locale,
  logger,
  deductCredits,
}: UseEdenAISpeechOptions): UseEdenAISpeechReturn {
  const { t } = simpleT(locale);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Use endpoint for type-safe API calls
  const endpoint = useEndpoint(
    speechToTextDefinitions,
    {
      queryOptions: {
        enabled: false, // Manual control
      },
    },
    logger,
  );

  // Cleanup function
  const cleanup = useCallback((): void => {
    // Stop media recorder if active
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
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
    logger.debug("STT: Processing recording", {
      hasEndpointCreate: !!endpoint.create,
    });

    if (!endpoint.create) {
      const errorMsg = t("app.chat.hooks.stt.endpoint-not-available");
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
      endpoint.create.form.setValue("fileUpload", { file: audioFile });

      // Submit form with callbacks
      await endpoint.create.submitForm({
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

            // Optimistically update credit balance in UI
            const creditCost = speechToTextDefinitions.POST.credits ?? 0;
            if (creditCost > 0) {
              deductCredits(creditCost, "stt");
            }

            setTranscript(transcribedText);
            onTranscript?.(transcribedText);
            setIsProcessing(false);
            cleanup();
          } else {
            const errorMessage = t("app.chat.hooks.stt.transcription-failed");
            logger.error("STT: Transcription failed", errorMessage);
            setError(errorMessage);
            onError?.(errorMessage);
            setIsProcessing(false);
            cleanup();
          }
        },
        onError: ({ error }) => {
          // Translate the error message if it's a translation key
          const errorMessage = error.message
            ? t(error.message, error.messageParams)
            : t("app.chat.hooks.stt.transcription-failed");
          logger.error("STT: API returned error", {
            errorType: error.errorType,
            errorMessage: error.message,
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
        err instanceof Error ? err.message : t("app.chat.hooks.stt.transcription-failed");
      logger.error("STT: Exception during transcription", parseError(err));
      setError(errorMsg);
      onError?.(errorMsg);
      setIsProcessing(false);
      cleanup();
    }
  }, [endpoint, logger, t, onTranscript, onError, cleanup, deductCredits]);

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
        err instanceof Error ? err.message : t("app.chat.hooks.stt.permission-denied");
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
  const stopRecordingAndGetBlob = useCallback(async (): Promise<File | null> => {
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Create File object
        const audioFile = new File([audioBlob], "recording.webm", {
          type: audioBlob.type,
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
