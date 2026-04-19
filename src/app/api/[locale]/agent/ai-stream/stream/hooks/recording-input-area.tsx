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
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pause } from "next-vibe-ui/ui/icons/Pause";
import { Play } from "next-vibe-ui/ui/icons/Play";
import { Send } from "next-vibe-ui/ui/icons/Send";
import { Type } from "next-vibe-ui/ui/icons/Type";
import { X } from "next-vibe-ui/ui/icons/X";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { scopedTranslation as aiStreamScopedTranslation } from "../i18n";

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
  /** The existing input text to show as read-only preview */
  existingInputText?: string;
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

export function RecordingInputArea({
  isRecording,
  isPaused,
  isProcessing,
  stream,
  hasExistingInput,
  existingInputText,
  onCancel,
  onTogglePause,
  onTranscribeToInput,
  onSendVoice,
  locale,
}: RecordingModalProps): JSX.Element | null {
  const { t } = aiStreamScopedTranslation.scopedT(locale);

  // Don't render if not recording/processing
  if (!isRecording && !isProcessing) {
    return null;
  }

  return (
    <Div className="mb-3 p-4 bg-background border border-border rounded-lg shadow-lg">
      {/* Show existing input text as read-only preview while recording */}
      {hasExistingInput && existingInputText && (
        <Div className="mb-3 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground whitespace-pre-wrap break-words max-h-24 overflow-y-auto">
          {existingInputText}
        </Div>
      )}

      {isRecording && stream ? (
        <Div className="flex flex-col items-center gap-4">
          {/* Status indicator */}
          <Div className="flex items-center gap-3">
            <Span className="relative flex h-3 w-3">
              {isPaused ? (
                <Span className="relative inline-flex rounded-full h-3 w-3 bg-warning" />
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
                isPaused ? "text-warning" : "text-destructive",
              )}
            >
              {isPaused
                ? t("voiceMode.recording.paused")
                : t("voiceMode.callOverlay.listening")}
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
              {t("voiceMode.actions.cancel")}
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
                  {t("voiceMode.recording.resume")}
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  {t("voiceMode.recording.pause")}
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
              {t("voiceMode.actions.toInput")}
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
                {t("voiceMode.actions.sendVoice")}
              </Button>
            )}
          </Div>
        </Div>
      ) : (
        // Processing state
        <Div className="flex items-center justify-center gap-3 py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <Span className="text-base text-muted-foreground">
            {t("input.speechInput.transcribing")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
