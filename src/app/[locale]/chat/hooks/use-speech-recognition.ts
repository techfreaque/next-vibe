"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { TranslationKey } from "@/i18n/core/static-types";

import {
  checkMicrophonePermission,
  checkSpeechRecognitionSupport,
  detectDevice,
  getSpeechErrorTranslationKey,
} from "../lib/utils/speech-utils";

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorKey: TranslationKey) => void;
  maxRetries?: number;
  logger: EndpointLogger;
}

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleRecording: () => Promise<void>;
  resetTranscript: () => void;
  errorKey: TranslationKey | null;
  supportReasonKey?: TranslationKey;
}

export function useSpeechRecognition({
  continuous = false,
  interimResults = true,
  lang = "en-US",
  onTranscript,
  onError,
  maxRetries = 3,
  logger,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [supportReasonKey, setSupportReasonKey] = useState<
    TranslationKey | undefined
  >(undefined);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<number | null>(null);
  const deviceInfoRef = useRef(detectDevice());

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true;
    return (): void => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize speech recognition with comprehensive checks
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Comprehensive support check
    const supportCheck = checkSpeechRecognitionSupport();

    if (!supportCheck.supported) {
      setIsSupported(false);
      setSupportReasonKey(supportCheck.reasonKey);
      if (supportCheck.reasonKey) {
        logger.info(
          "Speech",
          `Speech recognition not available: ${supportCheck.reasonKey}`,
        );
      }
      return;
    }

    const SpeechRecognitionAPI =
      (
        window as Window & {
          // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
          SpeechRecognition?: unknown;
          // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
          webkitSpeechRecognition?: unknown;
        }
      ).SpeechRecognition ||
      (
        window as Window & {
          // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
          SpeechRecognition?: unknown;
          // eslint-disable-next-line no-restricted-syntax -- Browser API check requires unknown type
          webkitSpeechRecognition?: unknown;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setSupportReasonKey("app.chat.speechRecognition.errors.apiNotFound");
      return;
    }

    setIsSupported(true);
    setSupportReasonKey(undefined);

    try {
      const recognition = new SpeechRecognitionAPI();

      // Configure based on device type
      const device = deviceInfoRef.current;

      // iOS Safari requires specific settings
      if (device.isIOS) {
        recognition.continuous = false; // iOS works better with single-shot
        recognition.interimResults = interimResults;
      } else {
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
      }

      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent): void => {
        if (!isMountedRef.current) {
          return;
        }

        logger.debug("Speech", "Result event received", {
          resultCount: event.results.length,
        });

        let finalTranscript = "";
        let interim = "";

        try {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (!result?.[0]) {
              continue;
            }

            const transcriptPart = result[0].transcript;
            logger.debug(
              "Speech",
              `Transcript part: "${transcriptPart}" (final: ${result.isFinal})`,
            );

            if (result.isFinal) {
              finalTranscript += `${transcriptPart} `;
            } else {
              interim += transcriptPart;
            }
          }

          if (finalTranscript) {
            logger.debug("Speech", `Final transcript: "${finalTranscript}"`);
            setTranscript((prev) => {
              const newTranscript = (prev + finalTranscript).trim();
              logger.debug("Speech", `Setting transcript: "${newTranscript}"`);
              if (isMountedRef.current) {
                onTranscript?.(newTranscript, true);
              }
              return newTranscript;
            });
            setInterimTranscript("");
            // Reset retry count on successful recognition
            retryCountRef.current = 0;
          } else if (interim) {
            logger.debug("Speech", `Interim transcript: "${interim}"`);
            setInterimTranscript(interim);
            if (isMountedRef.current) {
              setTranscript((prev) => {
                onTranscript?.(`${prev} ${interim}`.trim(), false);
                return prev;
              });
            }
          }
        } catch (err) {
          logger.error("Speech", "Error processing speech result", err);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent): void => {
        if (!isMountedRef.current) {
          return;
        }

        logger.debug("Speech", `Error event: ${event.error}`);

        // Ignore aborted errors (they're expected during cleanup)
        if (event.error === "aborted") {
          logger.debug("Speech", "Aborted (expected during cleanup)");
          if (isMountedRef.current) {
            setIsRecording(false);
          }
          shouldRestartRef.current = false;
          isStartingRef.current = false;
          isStoppingRef.current = false;
          return;
        }

        logger.error("Speech", "Recognition error", event.error);

        const errorTranslationKey = getSpeechErrorTranslationKey(event.error);

        if (isMountedRef.current) {
          setErrorKey(errorTranslationKey);
          onError?.(errorTranslationKey);
        }

        // Don't restart on fatal errors
        if (
          event.error === "audio-capture" ||
          event.error === "not-allowed" ||
          event.error === "service-not-allowed" ||
          event.error === "language-not-supported"
        ) {
          if (isMountedRef.current) {
            setIsRecording(false);
          }
          shouldRestartRef.current = false;
          isStartingRef.current = false;
          retryCountRef.current = 0;
        } else if (
          event.error === "no-speech" &&
          retryCountRef.current < maxRetries
        ) {
          // Retry on no-speech if under retry limit
          retryCountRef.current++;
          shouldRestartRef.current = true;
        } else {
          // Stop after max retries
          if (isMountedRef.current) {
            setIsRecording(false);
          }
          shouldRestartRef.current = false;
          isStartingRef.current = false;
          retryCountRef.current = 0;
        }
      };

      recognition.onend = (): void => {
        if (!isMountedRef.current) {
          return;
        }

        logger.debug("Speech", "Recognition ended", {
          shouldRestart: shouldRestartRef.current,
          retryCount: retryCountRef.current,
        });

        isStartingRef.current = false;
        isStoppingRef.current = false;

        // Auto-restart if continuous and still should be recording
        if (
          shouldRestartRef.current &&
          (continuous || retryCountRef.current > 0)
        ) {
          logger.debug("Speech", "Auto-restarting recognition...");
          // Small delay before restart to avoid rapid cycling
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = window.setTimeout(() => {
            if (!isMountedRef.current || !shouldRestartRef.current) {
              return;
            }

            try {
              logger.debug("Speech", "Starting recognition again...");
              recognition.start();
            } catch (e) {
              logger.error("Speech", "Failed to restart recognition", e);
              if (isMountedRef.current) {
                setIsRecording(false);
              }
              shouldRestartRef.current = false;
              retryCountRef.current = 0;
            }
          }, 200);
        } else {
          logger.debug("Speech", "Not restarting - stopping recording");
          if (isMountedRef.current) {
            setIsRecording(false);
          }
          shouldRestartRef.current = false;
          retryCountRef.current = 0;
        }
      };

      recognition.onstart = (): void => {
        if (!isMountedRef.current) {
          return;
        }

        logger.debug("Speech", "Recognition started");
        isStartingRef.current = false;
        if (isMountedRef.current) {
          setIsRecording(true);
          setErrorKey(null);
        }
      };

      recognition.onaudiostart = (): void => {
        if (!isMountedRef.current) {
          return;
        }
        logger.debug("Speech", "Audio input started");
        // Clear error when audio starts successfully
        if (isMountedRef.current) {
          setErrorKey(null);
        }
      };

      recognition.onaudioend = (): void => {
        if (!isMountedRef.current) {
          return;
        }
        logger.debug("Speech", "Audio input ended");
      };

      recognition.onsoundstart = (): void => {
        logger.debug("Speech", "Sound detected");
      };

      recognition.onsoundend = (): void => {
        logger.debug("Speech", "Sound ended");
      };

      recognition.onspeechstart = (): void => {
        logger.debug("Speech", "Speech detected");
      };

      recognition.onspeechend = (): void => {
        logger.debug("Speech", "Speech ended");
      };

      recognition.onnomatch = (): void => {
        logger.debug("Speech", "No match found");
      };

      recognitionRef.current = recognition;

      return (): void => {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }

        shouldRestartRef.current = false;
        isStartingRef.current = false;
        isStoppingRef.current = false;

        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {
            logger.error("Speech", "Error aborting recognition", e);
          }
        }
      };
    } catch (err) {
      logger.error("Speech", "Error initializing speech recognition", err);
      setIsSupported(false);
      setSupportReasonKey(
        "app.chat.speechRecognition.errors.initializationFailed",
      );
    }
  }, [
    continuous,
    interimResults,
    lang,
    onTranscript,
    onError,
    maxRetries,
    logger,
  ]);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!recognitionRef.current || !isSupported || isStartingRef.current) {
      return;
    }

    // Prevent multiple simultaneous starts
    if (isRecording || isStartingRef.current) {
      return;
    }

    try {
      isStartingRef.current = true;
      shouldRestartRef.current = true;
      retryCountRef.current = 0;

      // Check permission state first
      const permissionState = await checkMicrophonePermission(logger);

      if (permissionState === "denied") {
        const errorTranslationKey: TranslationKey =
          "app.chat.speechRecognition.errors.notAllowed";
        if (isMountedRef.current) {
          setErrorKey(errorTranslationKey);
          onError?.(errorTranslationKey);
        }
        isStartingRef.current = false;
        return;
      }

      // Request microphone permission if needed
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          // Request with specific constraints for better compatibility
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });

          // Stop the stream immediately - we just needed it for permission
          stream.getTracks().forEach((track): void => track.stop());
        } catch (permErr) {
          let errorTranslationKey: TranslationKey =
            "app.chat.speechRecognition.errors.microphoneAccessDenied";

          if (permErr instanceof Error) {
            if (permErr.name === "NotAllowedError") {
              errorTranslationKey =
                "app.chat.speechRecognition.errors.microphonePermissionDenied";
            } else if (permErr.name === "NotFoundError") {
              errorTranslationKey =
                "app.chat.speechRecognition.errors.noMicrophoneFound";
            } else if (permErr.name === "NotReadableError") {
              errorTranslationKey =
                "app.chat.speechRecognition.errors.microphoneInUse";
            }
          }

          if (isMountedRef.current) {
            setErrorKey(errorTranslationKey);
            onError?.(errorTranslationKey);
          }
          isStartingRef.current = false;
          return;
        }
      }

      // Start recognition
      logger.debug("Speech", "Starting recognition with lang", { lang });
      recognitionRef.current.start();
    } catch (e) {
      isStartingRef.current = false;

      // eslint-disable-next-line i18next/no-literal-string -- Checking error message from browser API
      if (e instanceof Error && e.message.includes("already started")) {
        logger.debug("Speech", "Already started, ignoring");
        // Already recording, ignore
        return;
      }

      logger.error("Speech", "Failed to start recognition", e);
      const errorTranslationKey: TranslationKey =
        "app.chat.speechRecognition.errors.startFailed";
      if (isMountedRef.current) {
        setErrorKey(errorTranslationKey);
        onError?.(errorTranslationKey);
      }
    }
  }, [isSupported, isRecording, onError, lang, logger]);

  const stopRecording = useCallback((): void => {
    if (!recognitionRef.current || isStoppingRef.current) {
      return;
    }

    try {
      isStoppingRef.current = true;
      shouldRestartRef.current = false;
      retryCountRef.current = 0;

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      recognitionRef.current.stop();
    } catch (e) {
      isStoppingRef.current = false;
      logger.error("Speech", "Error stopping recognition", e);
    }
  }, [logger]);

  const toggleRecording = useCallback(async (): Promise<void> => {
    if (isRecording || isStartingRef.current) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const resetTranscript = useCallback((): void => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    isRecording,
    isSupported,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    toggleRecording,
    resetTranscript,
    errorKey,
    supportReasonKey,
  };
}
