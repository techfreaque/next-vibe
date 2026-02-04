"use client";

import { cn } from "next-vibe/shared/utils";
import { AudioWaveform } from "next-vibe-ui/ui/audio-waveform";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2, Mic, MicOff, X } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "next-vibe-ui/ui/tooltip";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import React, { useEffect } from "react";

import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { useEdenAISpeech } from "@/app/api/[locale]/agent/speech-to-text/hooks";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SpeechInputButtonProps {
  /** Optional custom transcript handler. If not provided, appends to main chat input from context */
  onTranscript?: (text: string) => void;
  disabled?: boolean;
  locale: CountryLanguage;
  user: JwtPayloadType;
  className?: string;
  logger: EndpointLogger;
  dataTour?: string;
}

export function SpeechInputButton({
  onTranscript: customOnTranscript,
  disabled = false,
  locale,
  user,
  className,
  logger,
  dataTour,
}: SpeechInputButtonProps): JSX.Element {
  const { deductCredits, input, setInput } = useChatContext();

  // Default onTranscript handler that appends to existing input
  const defaultOnTranscript = (text: string): void => {
    const newValue = input ? `${input} ${text}`.trim() : text;
    setInput(newValue);
  };

  // Use custom handler if provided, otherwise use default
  const onTranscript = customOnTranscript || defaultOnTranscript;
  const { t } = simpleT(locale);

  // Calculate STT credit cost per minute for display
  const sttCreditCostPerMinute = (FEATURE_COSTS.STT * 60).toFixed(2);

  const {
    isRecording,
    isProcessing,
    toggleRecording,
    error,
    transcript,
    stream,
    clearError,
  } = useEdenAISpeech({
    onTranscript,
    onError: (err: string) => {
      logger.error("app.chat.speech.error", err);
    },
    locale,
    user,
    logger,
    deductCredits,
  });

  // Log transcript changes
  useEffect(() => {
    if (transcript) {
      logger.debug("app.chat.speech.transcript", { transcript });
    }
  }, [transcript, logger]);

  const isActive = isRecording || isProcessing;
  const isDisabled = disabled || isProcessing;

  const handleToggleRecording = async (): Promise<void> => {
    // Clear error when starting a new recording (retry behavior)
    if (!isRecording && error) {
      clearError();
    }
    await toggleRecording();
  };

  return (
    <TooltipProvider>
      <Div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "ghost"}
              data-tour={dataTour}
              onClick={handleToggleRecording}
              disabled={isDisabled}
              className={cn(
                "h-9 w-9 shrink-0 transition-all",
                isActive && "animate-pulse",
                className,
              )}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end" sideOffset={8}>
            {isRecording
              ? t("app.chat.input.speechInput.stopRecording")
              : isProcessing
                ? t("app.chat.input.speechInput.processing")
                : t("app.chat.input.speechInput.startVoiceInput", {
                    cost: sttCreditCostPerMinute,
                  })}
          </TooltipContent>
        </Tooltip>

        {/* Recording indicator with live waveform */}
        {isRecording && (
          <Div className="absolute bottom-full right-0 mb-2 p-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
            <Div className="flex items-center gap-3">
              <AudioWaveform stream={stream} />
              <Span className="text-xs font-medium text-foreground">
                {t("app.chat.input.speechInput.recordingClickToStop")}
              </Span>
            </Div>
          </Div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <Div className="absolute bottom-full right-0 mb-2 p-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
            <Div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <Span className="text-xs font-medium text-foreground">
                {t("app.chat.input.speechInput.transcribing")}
              </Span>
            </Div>
          </Div>
        )}

        {/* Error message - persistent until dismissed */}
        {error && !isRecording && !isProcessing && (
          <Div className="absolute bottom-full right-0 mb-2 p-3 bg-popover border-2 border-destructive rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
            <Div className="flex items-start gap-2">
              <P className="text-xs text-destructive flex-1 font-medium">
                {error}
              </P>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={clearError}
                className="h-5 w-5 p-0 hover:bg-destructive/10 shrink-0"
                aria-label="Dismiss error"
              >
                <X className="h-3 w-3 text-destructive" />
              </Button>
            </Div>
          </Div>
        )}
      </Div>
    </TooltipProvider>
  );
}
