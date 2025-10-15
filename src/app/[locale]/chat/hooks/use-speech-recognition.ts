"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  checkMicrophonePermission,
  checkSpeechRecognitionSupport,
  detectDevice,
} from "../lib/utils/speech-utils";

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  maxRetries?: number;
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
  error: string | null;
  supportReason?: string;
}

export function useSpeechRecognition({
  continuous = false,
  interimResults = true,
  lang = "en-US",
  onTranscript,
  onError,
  maxRetries = 3,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [supportReason, setSupportReason] = useState<string | undefined>(undefined);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deviceInfoRef = useRef(detectDevice());

  // Track mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initialize speech recognition with comprehensive checks
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Comprehensive support check
    const supportCheck = checkSpeechRecognitionSupport();

    if (!supportCheck.supported) {
      setIsSupported(false);
      setSupportReason(supportCheck.reason);
      if (supportCheck.reason) {
        console.info(`Speech recognition not available: ${supportCheck.reason}`);
      }
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setSupportReason("Speech recognition API not found");
      return;
    }

    setIsSupported(true);
    setSupportReason(undefined);

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

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isMountedRef.current) return;

      console.log("[Speech] Result event received:", event.results.length);

      let finalTranscript = "";
      let interim = "";

      try {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (!result || !result[0]) continue;

          const transcriptPart = result[0].transcript;
          console.log(`[Speech] Transcript part: "${transcriptPart}" (final: ${result.isFinal})`);

          if (result.isFinal) {
            finalTranscript += transcriptPart + " ";
          } else {
            interim += transcriptPart;
          }
        }

        if (finalTranscript) {
          console.log(`[Speech] Final transcript: "${finalTranscript}"`);
          setTranscript((prev) => {
            const newTranscript = (prev + finalTranscript).trim();
            console.log(`[Speech] Setting transcript: "${newTranscript}"`);
            if (isMountedRef.current) {
              onTranscript?.(newTranscript, true);
            }
            return newTranscript;
          });
          setInterimTranscript("");
          // Reset retry count on successful recognition
          retryCountRef.current = 0;
        } else if (interim) {
          console.log(`[Speech] Interim transcript: "${interim}"`);
          setInterimTranscript(interim);
          if (isMountedRef.current) {
            setTranscript((prev) => {
              onTranscript?.((prev + " " + interim).trim(), false);
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("[Speech] Error processing speech result:", err);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (!isMountedRef.current) return;

      console.log(`[Speech] Error event: ${event.error}`);

      // Ignore aborted errors (they're expected during cleanup)
      if (event.error === "aborted") {
        console.log("[Speech] Aborted (expected during cleanup)");
        if (isMountedRef.current) {
          setIsRecording(false);
        }
        shouldRestartRef.current = false;
        isStartingRef.current = false;
        isStoppingRef.current = false;
        return;
      }

      console.error("[Speech] Recognition error:", event.error);

      const errorMessages: Record<string, string> = {
        "no-speech": "No speech detected. Please try again.",
        "audio-capture": "Microphone not available. Please check your settings.",
        "not-allowed":
          "Microphone permission denied. Please allow microphone access.",
        network: "Network error. Please check your connection.",
        "service-not-allowed": "Speech recognition service not allowed.",
        "bad-grammar": "Speech recognition error. Please try again.",
        "language-not-supported": "Language not supported.",
      };

      const errorMessage =
        errorMessages[event.error] ||
        `Speech recognition error: ${event.error}`;

      if (isMountedRef.current) {
        setError(errorMessage);
        onError?.(errorMessage);
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
      } else if (event.error === "no-speech" && retryCountRef.current < maxRetries) {
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

    recognition.onend = () => {
      if (!isMountedRef.current) return;

      console.log("[Speech] Recognition ended. Should restart:", shouldRestartRef.current, "Retry count:", retryCountRef.current);

      isStartingRef.current = false;
      isStoppingRef.current = false;

      // Auto-restart if continuous and still should be recording
      if (shouldRestartRef.current && (continuous || retryCountRef.current > 0)) {
        console.log("[Speech] Auto-restarting recognition...");
        // Small delay before restart to avoid rapid cycling
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }

        retryTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current || !shouldRestartRef.current) return;

          try {
            console.log("[Speech] Starting recognition again...");
            recognition.start();
          } catch (e) {
            console.error("[Speech] Failed to restart recognition:", e);
            if (isMountedRef.current) {
              setIsRecording(false);
            }
            shouldRestartRef.current = false;
            retryCountRef.current = 0;
          }
        }, 200);
      } else {
        console.log("[Speech] Not restarting - stopping recording");
        if (isMountedRef.current) {
          setIsRecording(false);
        }
        shouldRestartRef.current = false;
        retryCountRef.current = 0;
      }
    };

    recognition.onstart = () => {
      if (!isMountedRef.current) return;

      console.log("[Speech] Recognition started");
      isStartingRef.current = false;
      if (isMountedRef.current) {
        setIsRecording(true);
        setError(null);
      }
    };

    recognition.onaudiostart = () => {
      if (!isMountedRef.current) return;
      console.log("[Speech] Audio input started");
      // Clear error when audio starts successfully
      if (isMountedRef.current) {
        setError(null);
      }
    };

    recognition.onaudioend = () => {
      if (!isMountedRef.current) return;
      console.log("[Speech] Audio input ended");
    };

    recognition.onsoundstart = () => {
      console.log("[Speech] Sound detected");
    };

    recognition.onsoundend = () => {
      console.log("[Speech] Sound ended");
    };

    recognition.onspeechstart = () => {
      console.log("[Speech] Speech detected");
    };

    recognition.onspeechend = () => {
      console.log("[Speech] Speech ended");
    };

    recognition.onnomatch = () => {
      console.log("[Speech] No match found");
    };

      recognitionRef.current = recognition;

      return () => {
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
            console.error("Error aborting recognition:", e);
          }
        }
      };
    } catch (err) {
      console.error("Error initializing speech recognition:", err);
      setIsSupported(false);
      setSupportReason("Failed to initialize speech recognition");
    }
  }, [continuous, interimResults, lang, onTranscript, onError, maxRetries]);

  const startRecording = useCallback(async () => {
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
      const permissionState = await checkMicrophonePermission();

      if (permissionState === "denied") {
        const errorMessage = "Microphone permission denied. Please allow microphone access in your browser settings.";
        if (isMountedRef.current) {
          setError(errorMessage);
          onError?.(errorMessage);
        }
        isStartingRef.current = false;
        return;
      }

      // Request microphone permission if needed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Request with specific constraints for better compatibility
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          });

          // Stop the stream immediately - we just needed it for permission
          stream.getTracks().forEach(track => track.stop());
        } catch (permErr) {
          let errorMessage = "Microphone access denied";

          if (permErr instanceof Error) {
            if (permErr.name === "NotAllowedError") {
              errorMessage = "Microphone permission denied. Please allow microphone access.";
            } else if (permErr.name === "NotFoundError") {
              errorMessage = "No microphone found. Please connect a microphone.";
            } else if (permErr.name === "NotReadableError") {
              errorMessage = "Microphone is already in use by another application.";
            }
          }

          if (isMountedRef.current) {
            setError(errorMessage);
            onError?.(errorMessage);
          }
          isStartingRef.current = false;
          return;
        }
      }

      // Start recognition
      console.log("[Speech] Starting recognition with lang:", lang);
      recognitionRef.current.start();
    } catch (e) {
      isStartingRef.current = false;

      if (e instanceof Error && e.message.includes("already started")) {
        console.log("[Speech] Already started, ignoring");
        // Already recording, ignore
        return;
      }

      console.error("[Speech] Failed to start:", e);
      const errorMessage = "Failed to start recording. Please try again.";
      if (isMountedRef.current) {
        setError(errorMessage);
        onError?.(errorMessage);
      }
    }
  }, [isSupported, isRecording, onError, lang]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || isStoppingRef.current) return;

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
      console.error("Error stopping recognition:", e);
    }
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isRecording || isStartingRef.current) {
      stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const resetTranscript = useCallback(() => {
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
    error,
    supportReason,
  };
}
