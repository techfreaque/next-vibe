"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Mic } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

/**
 * TranscribingIndicator - Loading animation for speech-to-text transcription
 * Shows a microphone icon with animated sound waves
 */
export function TranscribingIndicator({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = simpleT(locale);
  return (
    <Div className="flex items-center gap-3 py-1">
      {/* Microphone icon */}
      <Div className="relative flex items-center justify-center">
        <Mic className="w-5 h-5 text-blue-500 z-10" />
      </Div>

      {/* Animated sound waves - fixed height container */}
      <Div className="flex items-center gap-1 h-5">
        <Div
          className={cn(
            "w-1 h-3 rounded-full bg-blue-500",
            "animate-[wave_1s_ease-in-out_infinite]",
            "[animation-delay:0ms]",
          )}
        />
        <Div
          className={cn(
            "w-1 h-5 rounded-full bg-blue-500",
            "animate-[wave_1s_ease-in-out_infinite]",
            "[animation-delay:150ms]",
          )}
        />
        <Div
          className={cn(
            "w-1 h-4 rounded-full bg-blue-500",
            "animate-[wave_1s_ease-in-out_infinite]",
            "[animation-delay:300ms]",
          )}
        />
        <Div
          className={cn(
            "w-1 h-5 rounded-full bg-blue-500",
            "animate-[wave_1s_ease-in-out_infinite]",
            "[animation-delay:450ms]",
          )}
        />
        <Div
          className={cn(
            "w-1 h-3 rounded-full bg-blue-500",
            "animate-[wave_1s_ease-in-out_infinite]",
            "[animation-delay:600ms]",
          )}
        />
      </Div>

      {/* Transcribing text */}
      <Div className="text-sm text-muted-foreground animate-pulse">
        {t("app.api.agent.chat.threads.messages.transcribing")}
      </Div>
    </Div>
  );
}
