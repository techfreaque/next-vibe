"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe/ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import { type JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderConvertToBillWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  const handleViewBill = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    const billId = result?.billId;
    if (!billId) {
      return;
    }
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/payment/bill/[billId]/get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { billId },
      });
    })();
  };

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("orderConvertToBill.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("orderConvertToBill.post.success.description")}
          </Span>
        </Div>
        <Div className="flex gap-2">
          <Button type="button" size="sm" onClick={handleViewBill}>
            {t("orderConvertToBill.post.widget.viewBill")}
          </Button>
          {navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => navigation.pop()}
            >
              {t("orderConvertToBill.post.widget.back")}
            </Button>
          )}
        </Div>
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
          {t("orderConvertToBill.post.widget.back")}
        </Button>
      )}

      <Div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <Span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
          {t("orderConvertToBill.post.description")}
        </Span>
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderConvertToBill.post.title" }}
      />
    </Div>
  );
}
