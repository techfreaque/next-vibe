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
        <Div className="p-3 bg-info/10 border border-info/20 rounded-md">
          <P className="text-sm text-info">
            {displayLabel}: <Span className="font-semibold">{value}</Span>
          </P>
        </Div>
      );
    case "highlight":
      return (
        <Div className="p-4 rounded-lg border border-success/30 bg-success/10">
          <Div className="flex items-center gap-2">
            <Span className="text-sm text-success font-medium">
              {displayLabel}:
            </Span>
            <Span className="text-sm text-success-foreground font-semibold">
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
            className="bg-info/10 text-info border-info/20"
          >
            {value}
          </Badge>
        </Div>
      );
  }
}
