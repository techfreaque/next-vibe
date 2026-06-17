"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
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
import type { JSX } from "react";

import {
  PosPaymentMethod,
  PosPaymentMethodOptions,
} from "@/app/api/[locale]/pos/enum";

import type definition from "./definition";

interface PosOrderAddPaymentWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type MethodKey = keyof typeof PosPaymentMethod;

function methodIcon(methodKey: MethodKey): string {
  if (methodKey === "CASH") {
    return "💵";
  }
  if (methodKey === "CARD") {
    return "💳";
  }
  if (methodKey === "TRANSFER") {
    return "🏦";
  }
  return "···";
}

export function PosOrderAddPaymentWidget({
  field,
}: PosOrderAddPaymentWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;

  const selectedMethod = form?.watch("details.method") ?? PosPaymentMethod.CASH;
  const amount = Number(form?.watch("details.amount") ?? 0);

  const handleMethodSelect = (method: string): void => {
    form?.setValue(
      "details.method",
      method as (typeof PosPaymentMethodOptions)[number]["value"],
    );
  };

  const handleBackToOrder = (): void => {
    navigation.pop();
  };

  // Success state
  if (result?.id) {
    const isPaid = result.outstanding <= 0.005;
    return (
      <Div className="flex flex-col gap-5">
        {/* Payment recorded banner */}
        <Div
          className={`rounded-lg border px-4 py-4 flex items-start gap-3 ${isPaid ? "border-green-500/30 bg-green-500/10" : "border-muted"}`}
        >
          <Span
            className={`text-xl leading-none mt-0.5 ${isPaid ? "text-green-500" : "text-muted-foreground"}`}
          >
            {isPaid ? "✓" : "·"}
          </Span>
          <Div className="flex flex-col gap-0.5">
            <Span
              className={`text-sm font-semibold ${isPaid ? "text-green-700 dark:text-green-400" : ""}`}
            >
              {t("orderAddPayment.post.success.title")}
            </Span>
            {isPaid ? (
              <Span className="text-xs text-muted-foreground">
                {t("orderAddPayment.post.widget.fullyPaid")}
              </Span>
            ) : null}
          </Div>
        </Div>

        {/* Payment summary */}
        <Div className="rounded-lg border overflow-hidden divide-y">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <Badge variant="outline" className="text-xs">
              {t(result.method as Parameters<typeof t>[0])}
            </Badge>
            <Span className="text-sm font-mono font-bold tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.amount)}
            </Span>
          </Div>
          {result.change > 0 ? (
            <Div className="flex items-center justify-between px-4 py-3">
              <Span className="text-sm text-muted-foreground">
                {t("orderAddPayment.post.widget.changeLabel")}
              </Span>
              <Span className="text-sm font-mono font-semibold tabular-nums">
                {new Intl.NumberFormat(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(result.change)}
              </Span>
            </Div>
          ) : null}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderAddPayment.post.response.totalPaid")}
            </Span>
            <Span className="text-sm font-mono font-semibold tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(result.totalPaid)}
            </Span>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderAddPayment.post.response.outstanding")}
            </Span>
            {isPaid ? (
              <Badge
                variant="default"
                className="text-xs bg-green-600 hover:bg-green-600"
              >
                ✓ {t("orderAddPayment.post.widget.fullyPaid")}
              </Badge>
            ) : (
              <Span className="text-sm font-mono font-semibold text-destructive tabular-nums">
                {new Intl.NumberFormat(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(result.outstanding)}
              </Span>
            )}
          </Div>
        </Div>

        <Button
          type="button"
          variant={isPaid ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={handleBackToOrder}
        >
          {isPaid
            ? t("orderAddPayment.post.widget.backToOrder")
            : t("orderAddPayment.post.widget.addAnotherPayment")}
        </Button>
      </Div>
    );
  }

  // Payment form
  const isCash = selectedMethod === PosPaymentMethod.CASH;
  // Change is the difference between tendered amount and what would be due
  // We don't know the outstanding here without extra context,
  // so we show raw amount for now — the server validates
  const changePreview = isCash && amount > 0 ? Math.max(0, amount) : 0;

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
          {t("orderAddPayment.post.widget.backToOrder")}
        </Button>
      )}
      <FormAlertWidget field={{}} />

      {/* Payment method selector — large tap targets */}
      <Div className="flex flex-col gap-2">
        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("orderAddPayment.post.method.label")}
        </Span>
        <Div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PosPaymentMethodOptions.map((option) => {
            const methodKey = (
              Object.keys(PosPaymentMethod) as MethodKey[]
            ).find((k) => PosPaymentMethod[k] === option.value);
            const isSelected = selectedMethod === option.value;
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-16 flex-col gap-1 text-sm font-semibold"
                onClick={() => handleMethodSelect(option.value)}
                type="button"
              >
                <Span className="text-xl">
                  {methodKey !== undefined ? methodIcon(methodKey) : "···"}
                </Span>
                <Span className="text-xs">{option.label}</Span>
              </Button>
            );
          })}
        </Div>
      </Div>

      {/* Amount */}
      <NumberFieldWidget
        fieldName="details.amount"
        field={withValue(
          field.children.details.children.amount,
          undefined,
          null,
        )}
      />

      {/* Change preview for cash only */}
      {isCash && changePreview > 0 ? (
        <Div className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3">
          <Div className="flex flex-col gap-0.5">
            <Span className="text-xs text-muted-foreground">
              {t("orderAddPayment.post.widget.changeLabel")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("orderAddPayment.post.widget.changeHint")}
            </Span>
          </Div>
          <Span className="text-base font-mono font-bold tabular-nums">
            {new Intl.NumberFormat(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(changePreview)}
          </Span>
        </Div>
      ) : null}

      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
