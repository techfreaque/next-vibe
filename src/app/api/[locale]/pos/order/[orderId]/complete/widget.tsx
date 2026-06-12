"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

export function PosOrderCompleteWidget(
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

  const handleBackToList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("@/app/api/[locale]/pos/order/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  // Success: order completed
  if (result?.id) {
    return (
      <Div className="flex flex-col gap-5 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        {/* Sale complete banner */}
        <Div className="flex flex-col items-center gap-2 text-center py-2">
          <Span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {t("orderComplete.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("orderComplete.post.success.description")}
          </Span>
        </Div>

        {/* Summary */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderComplete.post.response.status")}
            </Span>
            <Badge
              variant="default"
              className="text-xs bg-green-600 hover:bg-green-600"
            >
              {t("enums.orderStatus.completed")}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm font-semibold">
              {t("orderComplete.post.response.total")}
            </Span>
            <Span className="text-xl font-mono font-bold tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.total)}
            </Span>
          </Div>
        </Div>

        <Button
          type="button"
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleBackToList}
        >
          {t("orderComplete.post.widget.backToList")}
        </Button>
      </Div>
    );
  }

  // Confirmation screen — show order summary before completing
  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("orderComplete.post.widget.cancel")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* Confirmation header */}
      <Div className="flex flex-col gap-1 text-center py-2">
        <Span className="text-base font-semibold">
          {t("orderComplete.post.widget.confirmTitle")}
        </Span>
        <Span className="text-sm text-muted-foreground">
          {t("orderComplete.post.widget.confirmHint")}
        </Span>
      </Div>

      {/* Big confirm button */}
      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => navigation.pop()}
      >
        {t("orderComplete.post.widget.cancel")}
      </Button>
    </Div>
  );
}
