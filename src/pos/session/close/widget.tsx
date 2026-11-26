"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { formatPosSettlement } from "../../order/format-settlement";
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
    formatPosSettlement(n, result?.currency, locale);

  // Read sessionId from form for display purposes (no state needed)
  const sessionId = form?.getValues("details.sessionId") ?? "";

  const handleBackToTerminals = (): void => {
    navigation.pop();
  };

  if (result?.id) {
    // Determine variance badge color
    const absVariance = Math.abs(result.variance);
    const varianceBadgeClass =
      absVariance === 0
        ? "bg-green-600 hover:bg-green-600 text-white"
        : absVariance <= 5.0
          ? "bg-amber-500 hover:bg-amber-500 text-white"
          : "bg-destructive hover:bg-destructive text-destructive-foreground";

    return (
      <WidgetShell layout="page">
        {/* Success banner */}
        <Div className="rounded-lg border border-muted bg-muted/20 px-4 py-4 flex items-start gap-3">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-sm font-semibold">
              {t("sessionClose.post.success.title")}
            </Span>
            <Div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {result.terminalName && <Span>{result.terminalName}</Span>}
              {result.companyName && <Span>{result.companyName}</Span>}
            </Div>
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
                {t("sessionClose.post.widget.orderCount", {
                  count: new Intl.NumberFormat(locale).format(
                    result.orderCount,
                  ),
                })}
              </Span>
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
          {result.closingFloat !== null &&
            result.closingFloat !== undefined && (
              <Div className="flex items-center justify-between px-4 py-3">
                <Span className="text-sm text-muted-foreground">
                  {t("sessionClose.post.widget.actualClosingFloat")}
                </Span>
                <Span className="text-sm font-mono tabular-nums">
                  {fmt(result.closingFloat)}
                </Span>
              </Div>
            )}

          {/* Variance — prominent */}
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/10">
            <Span className="text-sm font-semibold">
              {t("sessionClose.post.widget.variance")}
            </Span>
            <Badge
              className={`text-sm font-mono tabular-nums ${varianceBadgeClass}`}
            >
              {result.variance > 0 ? "+" : ""}
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
      </WidgetShell>
    );
  }

  return (
    <WidgetShell layout="page">
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
          presentation="money"
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

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "sessionGet.get.widget.closeSession" }}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={handleBackToTerminals}
      >
        {t("sessionClose.post.widget.backToTerminals")}
      </Button>
    </WidgetShell>
  );
}
