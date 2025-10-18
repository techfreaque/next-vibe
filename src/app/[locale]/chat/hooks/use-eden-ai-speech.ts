"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useTranslation } from "@/i18n/core/client";

import speechToTextDefinitions from "../../../api/[locale]/v1/core/agent/speech-to-text/definition";

interface UseEdenAISpeechOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  lang?: string;
  locale?: string;
  logger: EndpointLogger;
}

interface UseEdenAISpeechReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleRecording: () => Promise<void>;
  error: string | null;
  transcript: string | null;
}

export function useEdenAISpeech({
  onTranscript,
  onError,
  lang = "en-US",
  logger,
}: UseEdenAISpeechOptions): UseEdenAISpeechReturn {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
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

  // Debug logging
  useEffect(() => {
    logger.debug("STT", "Endpoint initialized", {
      hasCreate: !!endpoint.create,
      hasForm: !!endpoint.create?.form,
      hasSubmitForm: !!endpoint.create?.submitForm,
    });
  }, [endpoint, logger]);

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
    logger.debug("STT", "Processing recording", {
      hasEndpointCreate: !!endpoint.create,
    });

    if (!endpoint.create) {
      const errorMsg = t("app.chat.hooks.stt.endpoint-not-available");
      logger.error("STT", errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      logger.debug("STT", "Starting processing");

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });

      // Convert lang (en-US) to language code (en)
      const languageCode = lang.split("-")[0] || "en";

      // Create a File object from the blob
      const audioFile = new File([audioBlob], "recording.webm", {
        type: audioBlob.type,
      });

      // Set form values using endpoint
      logger.debug("STT", "Setting form values", {
        fileSize: audioFile.size,
        provider: "openai",
        languageCode,
      });
      endpoint.create.form.setValue("fileUpload.file", audioFile);
      endpoint.create.form.setValue("provider", "openai");
      endpoint.create.form.setValue("language", languageCode);

      // Submit the form
      logger.debug("STT", "Submitting form");
      await endpoint.create.submitForm(undefined);
      logger.debug("STT", "Form submitted, checking response");

      // Check response
      if (endpoint.create.response?.success) {
        const transcribedText =
          endpoint.create.response.data.response?.text || "";
        logger.debug("STT", "Success! Transcription received", {
          textLength: transcribedText.length,
        });
        setTranscript(transcribedText);
        onTranscript?.(transcribedText);
      } else if (endpoint.create.error) {
        const errorMessage =
          endpoint.create.error.message ||
          t("app.chat.hooks.stt.transcription-failed");
        logger.error("STT", errorMessage, { error: errorMessage });
        setError(errorMessage);
        onError?.(errorMessage);
      } else {
        logger.error("STT", "No response received");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("app.chat.hooks.stt.transcription-failed");
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  }, [lang, onTranscript, onError, endpoint, logger, t]);

  const startRecording = useCallback(async (): Promise<void> => {
    logger.debug("STT", "Starting recording");
    try {
      setError(null);
      setTranscript(null);

      // Request microphone permission
      logger.debug("STT", "Requesting microphone permission");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder with appropriate MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorder.ondataavailable = (event): void => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = (): void => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track): void => track.stop());
          streamRef.current = null;
        }

        // Process the recording
        if (audioChunksRef.current.length > 0) {
          void processRecording();
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      logger.debug("STT", "Recording started successfully");
    } catch (err) {
      logger.error("STT", "Failed to start recording", err);
      let errorMessage = t("app.chat.hooks.stt.failed-to-start");

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = t("app.chat.hooks.stt.permission-denied");
        } else if (err.name === "NotFoundError") {
          errorMessage = t("app.chat.hooks.stt.no-microphone");
        } else if (err.name === "NotReadableError") {
          errorMessage = t("app.chat.hooks.stt.microphone-in-use");
        }
      }

      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError, processRecording, logger, t]);

  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return (): void => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    toggleRecording,
    error,
    transcript,
  };
}
