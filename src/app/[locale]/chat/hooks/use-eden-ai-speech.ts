"use client";

import { useCallback, useRef, useState } from "react";

interface UseEdenAISpeechOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  lang?: string;
  locale?: string;
}

interface UseEdenAISpeechReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  toggleRecording: () => Promise<void>;
  error: string | null;
  transcript: string | null;
}

export function useEdenAISpeech({
  onTranscript,
  onError,
  lang = "en-US",
  locale = "en",
}: UseEdenAISpeechOptions = {}): UseEdenAISpeechReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscript(null);

      // Request microphone permission
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

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        // Process the recording
        if (audioChunksRef.current.length > 0) {
          await processRecording();
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      let errorMessage = "Failed to start recording";

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Microphone permission denied";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No microphone found";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Microphone is in use";
        }
      }

      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [onError]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processRecording = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorderRef.current?.mimeType || "audio/webm",
      });

      // Convert lang (en-US) to language code (en)
      const languageCode = lang.split("-")[0] || "en";

      // Create FormData
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");
      formData.append("provider", "openai");
      formData.append("language", languageCode);

      // Upload to API
      const response = await fetch(
        `/${locale}/api/v1/core/agent/speech-to-text`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data?.response?.text) {
        const transcribedText = result.data.response.text;
        setTranscript(transcribedText);
        onTranscript?.(transcribedText);
      } else {
        throw new Error(result.message || "Transcription failed");
      }
    } catch (err) {
      console.error("Failed to process recording:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to transcribe audio";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  };

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

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
