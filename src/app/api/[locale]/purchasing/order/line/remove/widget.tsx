"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function OrderLineRemoveWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();

  const result = data?.result;

  if (result !== undefined) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-muted/20">
        <Div className="flex flex-col gap-1">
          <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("orderLineRemove.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground mt-0.5">
            {t("orderLineRemove.post.success.description")}
          </Span>
        </Div>

        <Div className="grid grid-cols-3 gap-2 text-sm">
          <Div className="p-3 rounded-lg border">
            <Span className="text-muted-foreground block text-xs">
              {t("orderLineRemove.post.response.subtotal")}
            </Span>
            <Span className="font-medium">{result.subtotal.toFixed(2)}</Span>
          </Div>
          <Div className="p-3 rounded-lg border">
            <Span className="text-muted-foreground block text-xs">
              {t("orderLineRemove.post.response.taxAmount")}
            </Span>
            <Span className="font-medium">{result.taxAmount.toFixed(2)}</Span>
          </Div>
          <Div className="p-3 rounded-lg border bg-muted/30">
            <Span className="text-muted-foreground block text-xs">
              {t("orderLineRemove.post.response.total")}
            </Span>
            <Span className="font-semibold">{result.total.toFixed(2)}</Span>
          </Div>
        </Div>

        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("orderLineRemove.post.widget.backToOrder")}
          </Button>
        )}
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
          {t("orderLineRemove.post.widget.backToOrder")}
        </Button>
      )}

      <Div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
        <Span className="text-sm text-destructive font-medium">
          {t("orderLineRemove.post.widget.warning")}
        </Span>
      </Div>
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderLineRemove.post.title", variant: "destructive" }}
      />
    </Div>
  );
}
