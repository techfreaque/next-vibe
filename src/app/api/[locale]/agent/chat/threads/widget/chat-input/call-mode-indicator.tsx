"use client";

/**
 * Call Mode Indicator Component
 * Shows when call mode is active with description
 */

import { Div } from "next-vibe-ui/ui/div";
import { Phone } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CallModeIndicatorProps {
  /** Whether to show the indicator */
  show: boolean;
  /** User locale */
  locale: CountryLanguage;
}

export function CallModeIndicator({
  show,
  locale,
}: CallModeIndicatorProps): JSX.Element | null {
  const { t } = simpleT(locale);

  if (!show) {
    return null;
  }

  return (
    <Div className="flex items-center justify-between mb-2 px-1">
      <Div className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        <Span className="text-xs font-medium text-green-700 dark:text-green-300">
          {t("app.chat.voiceMode.callMode")} -{" "}
          {t("app.chat.voiceMode.callModeDescription")}
        </Span>
      </Div>
    </Div>
  );
}
