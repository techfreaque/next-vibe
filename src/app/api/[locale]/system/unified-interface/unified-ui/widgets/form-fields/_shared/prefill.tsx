/**
 * Shared prefill display utilities for form field widgets
 */

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import type { TParams } from "@/i18n/core/static-types";

import type { PrefillDisplayConfig } from "./types";

/**
 * Render prefilled readonly display
 * Shows the prefilled value with styled card/badge based on prefillDisplay config
 */
export function renderPrefillDisplay<TKey extends string>(
  value: string,
  label: TKey | undefined,
  prefillDisplay: PrefillDisplayConfig<TKey>,
  t: <K extends string>(key: K, params?: TParams) => string,
): JSX.Element {
  const displayLabel = prefillDisplay.labelKey
    ? t(prefillDisplay.labelKey)
    : label
      ? t(label)
      : "";

  switch (prefillDisplay.variant) {
    case "card":
      return (
        <Div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <P className="text-sm text-blue-700 dark:text-blue-300">
            {displayLabel}: <Span className="font-semibold">{value}</Span>
          </P>
        </Div>
      );
    case "highlight":
      return (
        <Div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-950/30">
          <Div className="flex items-center gap-2">
            <Span className="text-sm text-green-700 dark:text-green-400 font-medium">
              {displayLabel}:
            </Span>
            <Span className="text-sm text-green-800 dark:text-green-300 font-semibold">
              {value}
            </Span>
          </Div>
        </Div>
      );
    case "badge":
    default:
      return (
        <Div className="flex items-center gap-2">
          <Span className="text-sm text-muted-foreground">{displayLabel}:</Span>
          <Badge
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          >
            {value}
          </Badge>
        </Div>
      );
  }
}
