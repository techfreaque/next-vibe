"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useWatch } from "react-hook-form";

import { PosOrderStatus, PosPaymentMethodOptions } from "@/pos/enum";

import { outstandingSaleAmount } from "../../display-totals";
import { useOrderPreview } from "../get/use-order-preview";
import type definition from "./definition";

export function PosOrderRemovePaymentWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>()?.result;
  const form = useWidgetForm<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();
  const submitting = useWidgetIsSubmitting();
  const onSubmit = useWidgetOnSubmit();
  const orderId = useWatch({ control: form.control, name: "orderId" });
  const paymentId = useWatch({ control: form.control, name: "paymentId" });
  const order = useOrderPreview(result ? undefined : orderId);

  const money = (amount: number, currency: string | undefined): string =>
    formatMoney(amount, currency ?? "EUR", locale);

  const backToOrder = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
      return;
    }
    const target = result?.orderId ?? orderId;
    if (!target) {
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../get/definition");
      navigation.push(def.default.GET, { urlPathParams: { orderId: target } });
    })();
  };

  const header = (
    <WidgetHeader
      size="page"
      title={t("post.title")}
      subtitle={t("post.description")}
      backButton={
        interactive && (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className="gap-1.5 -ml-1"
            onClick={backToOrder}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("post.widget.back")}
          </Button>
        )
      }
    />
  );

  if (result) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-2xl">
        {header}
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={
            result.remainingPayments === 0
              ? t("post.widget.nothingPaid")
              : t("post.success.description")
          }
        >
          <DetailGrid columns={2}>
            <DetailField
              label={t("post.widget.paidSoFar")}
              value={money(result.totalPaid, result.currency)}
            />
            <DetailField
              label={t("post.widget.stillDue")}
              value={money(result.outstanding, result.currency)}
            />
          </DetailGrid>
        </ResultBanner>
        {interactive && (
          <Div className="flex justify-end">
            <Button type="button" onClick={backToOrder}>
              {t("post.widget.back")}
            </Button>
          </Div>
        )}
      </WidgetShell>
    );
  }

  const payments = order?.payments ?? [];
  const selected = payments.find((payment) => payment.paymentId === paymentId);
  const isOpen = order?.status === PosOrderStatus.OPEN;
  const canConfirm =
    !!onSubmit && !!selected && isOpen && !submitting && !disabled;

  return (
    <WidgetShell layout="page" className="mx-auto max-w-2xl">
      {header}
      <FormAlertWidget field={{}} />
      {!order ? (
        orderId ? (
          <LoadingBlock message={t("post.widget.loading")} />
        ) : null
      ) : !isOpen ? (
        <EmptyBlock title={t("post.widget.notOpen")} />
      ) : payments.length === 0 ? (
        <EmptyBlock title={t("post.widget.noPayments")} />
      ) : (
        <Div className="flex flex-col gap-4">
          <Div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("post.widget.stillDue")}
            </Span>
            <Span className="text-lg font-semibold tabular-nums">
              {money(
                outstandingSaleAmount(order.total, payments),
                order.currency,
              )}
            </Span>
          </Div>
          <Span className="text-sm font-medium">
            {t("post.widget.pickPayment")}
          </Span>
          <Div
            aria-label={t("post.widget.pickPayment")}
            className="flex flex-col gap-2"
          >
            {payments.map((payment) => {
              const label = methodLabel(payment.method);
              const isSelected = payment.paymentId === paymentId;
              return (
                <Button
                  key={payment.paymentId}
                  type="button"
                  aria-pressed={isSelected}
                  variant={isSelected ? "default" : "outline"}
                  disabled={!showActions(interactive, responseOnly)}
                  className="h-auto min-h-12 justify-between gap-3 px-4 py-3"
                  onClick={() =>
                    form.setValue("paymentId", payment.paymentId, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                >
                  <Span className="flex flex-col items-start gap-0.5 text-left">
                    <Span className="text-sm font-semibold">
                      {label ? t(label) : payment.method}
                    </Span>
                    {(payment.reference || payment.change > 0) && (
                      <Span className="text-xs opacity-80">
                        {[
                          payment.reference,
                          payment.change > 0
                            ? t("post.widget.change", {
                                amount: money(payment.change, order.currency),
                              })
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </Span>
                    )}
                  </Span>
                  <Span className="whitespace-nowrap text-base font-semibold tabular-nums">
                    {money(payment.amount, order.currency)}
                  </Span>
                </Button>
              );
            })}
          </Div>
          {showActions(interactive, responseOnly) && (
            <Div className="flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={backToOrder}>
                {t("post.widget.cancel")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={!canConfirm}
                  >
                    {t("post.widget.confirm")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("post.widget.confirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("post.widget.confirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {selected && (
                    <DetailGrid columns={2}>
                      <DetailField
                        label={t("post.paymentId.label")}
                        value={(() => {
                          const label = methodLabel(selected.method);
                          return label ? t(label) : selected.method;
                        })()}
                      />
                      <DetailField
                        label={t("post.widget.amount")}
                        value={money(selected.amount, order.currency)}
                      />
                    </DetailGrid>
                  )}
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t("post.widget.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onSubmit?.()}
                    >
                      {t("post.widget.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}

function showActions(
  interactive: boolean,
  responseOnly: boolean | undefined,
): boolean {
  return interactive && !responseOnly;
}

function methodLabel(
  method: string,
): (typeof PosPaymentMethodOptions)[number]["label"] | undefined {
  return PosPaymentMethodOptions.find((option) => option.value === method)
    ?.label;
}
