"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

interface PosSessionCloseWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PosSessionCloseWidget({
  field,
}: PosSessionCloseWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;

  const fmt = (n: number): string =>
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  // Read sessionId from form for display purposes (no state needed)
  const sessionId = form?.getValues("details.sessionId") ?? "";

  const handleBackToTerminals = (): void => {
    navigation.pop();
  };

  if (result?.id) {
    // Determine variance badge color
    const absVariance = Math.abs(result.variance);
    const varianceBadgeClass =
      absVariance <= 1.0
        ? "bg-green-600 hover:bg-green-600 text-white"
        : absVariance <= 5.0
          ? "bg-amber-500 hover:bg-amber-500 text-white"
          : "bg-destructive hover:bg-destructive text-destructive-foreground";

    return (
      <Div className="flex flex-col gap-5">
        {/* Success banner */}
        <Div className="rounded-lg border border-muted bg-muted/20 px-4 py-4 flex items-start gap-3">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold">
              {t("sessionClose.post.success.title")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("sessionClose.post.success.description")}
            </Span>
          </Div>
        </Div>

        {/* Cash Reconciliation Table */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          {/* Header */}
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Span className="text-sm font-semibold">
              {t("sessionClose.post.widget.reconciliationTitle")}
            </Span>
            <Div className="flex items-center gap-2">
              <Span className="text-xs text-muted-foreground">
                {String(result.orderCount)}{" "}
                {t("sessionClose.post.widget.orderCount")}
              </Span>
              <Badge variant="secondary" className="text-xs">
                {t("enums.sessionStatus.closed")}
              </Badge>
            </Div>
          </Div>

          {/* Opening float */}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionClose.post.widget.openingFloat")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {fmt(result.expectedFloat - result.cashSalesTotal)}
            </Span>
          </Div>

          {/* Cash sales */}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionClose.post.widget.cashSales")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {fmt(result.cashSalesTotal)}
            </Span>
          </Div>

          {/* Expected closing float */}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionClose.post.widget.expectedClosingFloat")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {fmt(result.expectedFloat)}
            </Span>
          </Div>

          {/* Actual closing float */}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionClose.post.widget.actualClosingFloat")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {result.closingFloat !== null && result.closingFloat !== undefined
                ? fmt(result.closingFloat)
                : "—"}
            </Span>
          </Div>

          {/* Variance — prominent */}
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/10">
            <Span className="text-sm font-semibold">
              {t("sessionClose.post.widget.variance")}
            </Span>
            <Badge
              className={`text-sm font-mono tabular-nums ${varianceBadgeClass}`}
            >
              {result.variance >= 0 ? "+" : ""}
              {fmt(result.variance)}
            </Badge>
          </Div>

          {/* Closed at */}
          {result.closedAt ? (
            <Div className="flex items-center justify-between px-4 py-3">
              <Span className="text-sm text-muted-foreground">
                {t("sessionClose.post.response.closedAt")}
              </Span>
              <Span className="text-sm tabular-nums">
                {new Date(result.closedAt).toLocaleString(locale)}
              </Span>
            </Div>
          ) : null}
        </Div>

        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full"
          onClick={handleBackToTerminals}
        >
          {t("sessionClose.post.widget.backToTerminals")}
        </Button>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      <FormAlertWidget field={{}} />

      {/* Session summary header — shows status without UUID */}
      <Div className="rounded-lg border overflow-hidden divide-y">
        <Div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
          <Span className="text-sm font-semibold">
            {t("sessionClose.post.widget.sessionSummary")}
          </Span>
          <Badge
            variant="default"
            className="text-xs bg-blue-600 hover:bg-blue-600"
          >
            {t("enums.sessionStatus.open")}
          </Badge>
        </Div>
        {sessionId ? (
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionClose.post.widget.sessionReady")}
            </Span>
            <Badge variant="outline" className="text-xs">
              {t("sessionClose.post.widget.active")}
            </Badge>
          </Div>
        ) : null}
      </Div>

      {/* Closing float input */}
      <Div className="flex flex-col gap-1">
        <NumberFieldWidget
          fieldName="details.closingFloat"
          field={withValue(
            field.children.details.children.closingFloat,
            undefined,
            null,
          )}
        />
        <Span className="text-xs text-muted-foreground px-1">
          {t("sessionClose.post.widget.floatHint")}
        </Span>
      </Div>

      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={handleBackToTerminals}
      >
        {t("sessionClose.post.widget.backToTerminals")}
      </Button>
    </Div>
  );
}
