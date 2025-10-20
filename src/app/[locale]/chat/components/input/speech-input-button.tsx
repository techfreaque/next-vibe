"use client";

import { Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { useEdenAISpeech } from "@/app/api/[locale]/v1/core/agent/speech-to-text/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import { Button } from "@/packages/next-vibe-ui/web/ui";

interface SpeechInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  lang?: string;
  locale: CountryLanguage;
  className?: string;
  logger: EndpointLogger;
}

export function SpeechInputButton({
  onTranscript,
  disabled = false,
  lang = "en-US",
  locale,
  className,
  logger,
}: SpeechInputButtonProps): JSX.Element {
  const { t } = simpleT(locale);
  const [displayError, setDisplayError] = useState<string | null>(null);

  const { isRecording, isProcessing, toggleRecording, error, transcript } =
    useEdenAISpeech({
      onTranscript,
      onError: (err: string) => {
        logger.error("app.chat.speech.error", err);
      },
      lang,
      locale,
      logger,
    });

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout((): void => {
        setDisplayError(null);
      }, 5000);
      return (): void => clearTimeout(timer);
    }
  }, [error]);

  // Log transcript changes
  useEffect(() => {
    if (transcript) {
      logger.debug("app.chat.speech.transcript", { transcript });
    }
  }, [transcript, logger]);

  const isActive = isRecording || isProcessing;
  const isDisabled = disabled || isProcessing;

  return (
    <div className="relative">
      <Button
        type="button"
        size="icon"
        variant={isRecording ? "destructive" : "ghost"}
        onClick={toggleRecording}
        disabled={isDisabled}
        className={cn(
          "h-9 w-9 flex-shrink-0 transition-all",
          isActive && "animate-pulse",
          className,
        )}
        title={
          isRecording
            ? t("app.chat.input.speechInput.stopRecording")
            : isProcessing
              ? t("app.chat.input.speechInput.processing")
              : t("app.chat.input.speechInput.startVoiceInput")
        }
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              {t("app.chat.input.speechInput.recordingClickToStop")}
            </span>
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
            <span className="text-xs font-medium text-foreground">
              {t("app.chat.input.speechInput.transcribing")}
            </span>
          </div>
        </div>
      )}

      {/* Error message */}
      {displayError && !isRecording && !isProcessing && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-destructive/10 border border-destructive rounded-md shadow-lg z-10 min-w-[200px] max-w-[300px]">
          <p className="text-xs text-destructive">{displayError}</p>
        </div>
      )}
    </div>
  );
}
