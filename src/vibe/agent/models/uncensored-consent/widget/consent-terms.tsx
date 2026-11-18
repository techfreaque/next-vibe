"use client";

/**
 * The consent text itself: platform stance + what the person confirms.
 * One component so the dialog, the settings card and the CLI read the same.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { scopedTranslation } from "../i18n";

const POINT_KEYS = [
  "dialog.pointAge",
  "dialog.pointContent",
  "dialog.pointNoFilter",
  "dialog.pointResponsible",
] as const;

export function UncensoredConsentTerms({
  locale,
  showStance = true,
}: {
  locale: CountryLanguage;
  showStance?: boolean;
}): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Div className="flex flex-col gap-3">
      {showStance ? (
        <P className="m-0 text-sm leading-relaxed text-muted-foreground">
          {t("dialog.stance")}
        </P>
      ) : null}
      <Div className="flex flex-col gap-2 rounded-xl border border-warning/30 bg-warning/5 p-3 @sm:p-4">
        {POINT_KEYS.map((key) => (
          <Div key={key} className="flex items-start gap-2.5">
            {/* Plain bullet: these are statements, not boxes to tick */}
            <Span
              aria-hidden="true"
              className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-warning"
            />
            <Span className="text-sm leading-snug text-foreground">
              {t(key)}
            </Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}
