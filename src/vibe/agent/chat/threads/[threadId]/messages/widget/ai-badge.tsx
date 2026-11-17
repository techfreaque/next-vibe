/**
 * AI Badge
 * Marks a message as written by an AI model. Public and shared threads mix
 * human and AI posts, so every AI post carries this label: readers must
 * always know when they are reading a model, not a person.
 */

"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Badge } from "next-vibe/ui/components/badge";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

import { scopedTranslation } from "../i18n";

export function AiBadge({ locale }: { locale: CountryLanguage }): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Span title={t("widget.messages.aiBadgeTitle")} className="shrink-0">
      <Badge
        variant="outline"
        className="h-4 px-1 py-0 text-[10px] font-semibold leading-none border-primary/40 text-primary"
      >
        {t("widget.messages.aiBadge")}
      </Badge>
    </Span>
  );
}
