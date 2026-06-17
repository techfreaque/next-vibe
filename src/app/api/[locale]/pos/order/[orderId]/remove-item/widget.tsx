"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function PosOrderRemoveItemWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.POST)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;

  if (result?.orderId) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderRemoveItem.post.success.title")}
          </Span>
        </Div>
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderRemoveItem.post.response.orderTotal")}
            </Span>
            <Span className="text-sm font-mono font-bold tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.orderTotal)}
            </Span>
          </Div>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigation.pop()}
        >
          {t("orderRemoveItem.post.widget.backToOrder")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderRemoveItem.post.widget.backToOrder")}
        </Button>
      )}
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
