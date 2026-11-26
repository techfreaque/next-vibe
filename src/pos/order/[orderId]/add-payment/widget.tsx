"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Banknote } from "next-vibe/ui/components/icons/Banknote";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
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
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect } from "react";

import { PosPaymentMethod, PosPaymentMethodOptions } from "@/pos/enum";

import { cashChangeDue, outstandingSaleAmount } from "../../display-totals";
import { formatPosSettlement } from "../../format-settlement";
import { useOrderPreview } from "../get/use-order-preview";
import type definition from "./definition";

interface PosOrderAddPaymentWidgetProps {
  field: (typeof definition.POST)["fields"];
}

const methodIcons = {
  [PosPaymentMethod.CASH]: Banknote,
  [PosPaymentMethod.CARD]: CreditCard,
  [PosPaymentMethod.TRANSFER]: Wallet,
  [PosPaymentMethod.OTHER]: MoreHorizontal,
};

export function PosOrderAddPaymentWidget({
  field,
}: PosOrderAddPaymentWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const result = data?.result;

  const orderId = form.watch("orderId");
  const bodyOrderId = form.watch("details.orderId");
  useEffect(() => {
    if (orderId && orderId !== bodyOrderId) {
      form.setValue("details.orderId", orderId, { shouldValidate: true });
    }
  }, [bodyOrderId, form, orderId]);
  const preview = useOrderPreview(result ? undefined : orderId);
  const selectedMethod = form?.watch("details.method") ?? PosPaymentMethod.CASH;
  const amount = Number(form?.watch("details.amount") ?? 0);

  const handleBackToOrder = (): void => {
    const submittedOrderId = form.getValues("details.orderId");
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, {
        urlPathParams: { orderId: submittedOrderId },
      });
    })();
  };

  // Success state
  if (result?.id) {
    const isPaid = Math.round(result.outstanding * 10_000) === 0;
    return (
      <WidgetShell layout="page">
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
              {formatPosSettlement(result.amount, result?.currency, locale)}
            </Span>
          </Div>
          {result.change > 0 ? (
            <Div className="flex items-center justify-between px-4 py-3">
              <Span className="text-sm text-muted-foreground">
                {t("orderAddPayment.post.widget.changeLabel")}
              </Span>
              <Span className="text-sm font-mono font-semibold tabular-nums">
                {formatPosSettlement(result.change, result?.currency, locale)}
              </Span>
            </Div>
          ) : null}
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("orderAddPayment.post.response.totalPaid")}
            </Span>
            <Span className="text-sm font-mono font-semibold tabular-nums">
              {formatPosSettlement(result.totalPaid, result?.currency, locale)}
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
                {formatPosSettlement(
                  result.outstanding,
                  result?.currency,
                  locale,
                )}
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
          {t("orderAddPayment.post.widget.backToOrder")}
        </Button>
      </WidgetShell>
    );
  }

  // Payment form
  const isCash = selectedMethod === PosPaymentMethod.CASH;
  const remaining = preview
    ? outstandingSaleAmount(preview.total, preview.payments ?? [])
    : undefined;
  const changePreview =
    isCash && preview && amount > 0
      ? cashChangeDue(amount, preview.total, preview.payments ?? [])
      : 0;

  return (
    <WidgetShell layout="page">
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
      <EntityPickerFieldWidget
        fieldName="orderId"
        field={field.children.orderId}
      />

      {remaining !== undefined && preview && (
        <Div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3">
          <Span className="text-sm font-semibold">
            {t("workflow.amountDue")}
          </Span>
          <Span className="text-xl font-semibold tabular-nums">
            {formatPosSettlement(remaining, preview.currency, locale)}
          </Span>
        </Div>
      )}

      {/* Payment method selector — large tap targets */}
      <Div className="flex flex-col gap-2">
        <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("orderAddPayment.post.method.label")}
        </Span>
        <Div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PosPaymentMethodOptions.map((option) => {
            const MethodIcon = methodIcons[option.value];
            const isSelected = selectedMethod === option.value;
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="h-16 flex-col gap-1 text-sm font-semibold"
                onClick={() =>
                  form.setValue("details.method", option.value, {
                    shouldDirty: true,
                  })
                }
                type="button"
              >
                <MethodIcon className="h-5 w-5" />
                <Span className="text-xs">{t(option.value)}</Span>
              </Button>
            );
          })}
        </Div>
      </Div>

      {/* Amount */}
      <NumberFieldWidget
        fieldName="details.amount"
        presentation="money"
        currency={preview?.currency}
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
            {formatPosSettlement(changePreview, preview?.currency, locale)}
          </Span>
        </Div>
      ) : null}

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "orderGet.get.widget.addPayment" }}
      />
    </WidgetShell>
  );
}
