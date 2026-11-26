"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { formatQuantity } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";

/** Signed quantity preview: says whether the adjustment adds or writes off. */
export function AdjustPreview(): JSX.Element | null {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const delta = useWidgetForm<typeof definition.POST>().watch("quantity");
  if (typeof delta !== "number" || !Number.isFinite(delta) || delta === 0) {
    return null;
  }
  const adds = delta > 0;
  return (
    <Div
      className={`flex flex-wrap items-baseline justify-between gap-2 rounded-xl border p-4 ${adds ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}
    >
      <Span className="text-sm text-muted-foreground">
        {t(
          adds
            ? "stockAdjust.post.widget.positiveHint"
            : "stockAdjust.post.widget.negativeHint",
        )}
      </Span>
      <Span
        className={`text-lg font-semibold tabular-nums ${adds ? "text-success" : "text-warning"}`}
      >
        {adds ? "+" : ""}
        {formatQuantity(delta, locale)}
      </Span>
    </Div>
  );
}
