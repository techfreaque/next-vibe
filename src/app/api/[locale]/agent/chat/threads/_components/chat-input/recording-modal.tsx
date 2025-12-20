"use client";

/**
 * Recording Modal Component
 * Displays recording UI with waveform and action buttons
 * Used by both ChatInput and MessageEditor
 */

import { cn } from "next-vibe/shared/utils";
import { AudioWaveform } from "next-vibe-ui/ui/audio-waveform";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2, Pause, Play, Send, Type, X } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface RecordingModalProps {
  /** Whether currently recording */
  isRecording: boolean;
  /** Whether recording is paused */
  isPaused: boolean;
  /** Whether STT is processing */
  isProcessing: boolean;
  /** Media stream for waveform */
  stream: MediaStream | null;
  /** Whether there's existing input (hides send voice button) */
  hasExistingInput: boolean;
  /** Cancel recording */
  onCancel: () => void;
  /** Toggle pause/resume */
  onTogglePause: () => void;
  /** Stop and transcribe to input */
  onTranscribeToInput: () => void;
  /** Stop and send voice directly */
  onSendVoice: () => void;
  /** User locale */
  locale: CountryLanguage;
}

export function RecordingModal({
  isRecording,
  isPaused,
  isProcessing,
  stream,
  hasExistingInput,
  onCancel,
  onTogglePause,
  onTranscribeToInput,
  onSendVoice,
  locale,
}: RecordingModalProps): JSX.Element | null {
  const { t } = simpleT(locale);

  // Don't render if not recording/processing
  if (!isRecording && !isProcessing) {
    return null;
  }

  return (
    <Div className="mb-3 p-4 bg-background border border-border rounded-lg shadow-lg">
      {isRecording && stream ? (
        <Div className="flex flex-col items-center gap-4">
          {/* Status indicator */}
          <Div className="flex items-center gap-3">
            <Span className="relative flex h-3 w-3">
              {isPaused ? (
                <Span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500" />
              ) : (
                <>
                  <Span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <Span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                </>
              )}
            </Span>
            <Span
              className={cn(
                "text-base font-medium",
                isPaused
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-destructive",
              )}
            >
              {isPaused
                ? t("app.chat.voiceMode.recording.paused")
                : t("app.chat.voiceMode.callOverlay.listening")}
            </Span>
          </Div>

          {/* Waveform visualization */}
          <AudioWaveform
            stream={stream}
            isPaused={isPaused}
            className="h-12 w-full max-w-xs"
          />

          {/* Action buttons */}
          <Div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Cancel */}
            <Button
              type="button"
              size="default"
              variant="ghost"
              onClick={onCancel}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
              {t("app.chat.voiceMode.actions.cancel")}
            </Button>

            {/* Pause/Resume */}
            <Button
              type="button"
              size="default"
              variant="outline"
              onClick={onTogglePause}
              className="gap-2"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  {t("app.chat.voiceMode.recording.resume")}
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  {t("app.chat.voiceMode.recording.pause")}
                </>
              )}
            </Button>

            {/* To Input */}
            <Button
              type="button"
              size="default"
              variant="secondary"
              onClick={onTranscribeToInput}
              className="gap-2"
            >
              <Type className="h-4 w-4" />
              {t("app.chat.voiceMode.actions.toInput")}
            </Button>

            {/* Send Voice (only when no existing input) */}
            {!hasExistingInput && (
              <Button
                type="button"
                size="default"
                variant="default"
                onClick={onSendVoice}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {t("app.chat.voiceMode.actions.sendVoice")}
              </Button>
            )}
          </Div>
        </Div>
      ) : (
        // Processing state
        <Div className="flex items-center justify-center gap-3 py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <Span className="text-base text-muted-foreground">
            {t("app.chat.input.speechInput.transcribing")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
