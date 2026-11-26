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
import { Banknote } from "next-vibe/ui/components/icons/Banknote";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { MoreHorizontal } from "next-vibe/ui/components/icons/MoreHorizontal";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RotateCcw } from "next-vibe/ui/components/icons/RotateCcw";
import { Wallet } from "next-vibe/ui/components/icons/Wallet";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import {
  PosOrderStatus,
  PosPaymentMethod,
  PosPaymentMethodOptions,
} from "@/pos/enum";

import { planPosRefund } from "./amounts";
import definitions, {
  type PosOrderRefundsGetResponseOutput,
} from "./definition";

type RefundSummary = PosOrderRefundsGetResponseOutput["result"];

const methodIcons = {
  [PosPaymentMethod.CASH]: Banknote,
  [PosPaymentMethod.CARD]: CreditCard,
  [PosPaymentMethod.TRANSFER]: Wallet,
  [PosPaymentMethod.OTHER]: MoreHorizontal,
};

const UNITS = 10_000;

function toUnits(value: number): number {
  return Math.round(value * UNITS);
}

function methodLabel(
  method: string,
): (typeof PosPaymentMethodOptions)[number]["label"] | undefined {
  return PosPaymentMethodOptions.find((option) => option.value === method)
    ?.label;
}

async function openOrder(
  navigation: ReturnType<typeof useWidgetNavigation>,
  orderId: string,
): Promise<void> {
  const def = await import("../get/definition");
  navigation.push(def.default.GET, { urlPathParams: { orderId } });
}

/** GET: what was sold, what went back, and the way into a new refund. */
export function PosOrderRefundsWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const summary = useWidgetValue<typeof definitions.GET>()?.result;
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const money = (amount: number): string =>
    formatMoney(amount, summary?.currency, locale);

  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else if (summary) {
      void openOrder(navigation, summary.orderId);
    }
  };
  const canRefund =
    !!summary &&
    summary.status === PosOrderStatus.COMPLETED &&
    summary.refundableTotal > 0;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        subtitle={summary?.orderNumber ?? t("get.description")}
        backButton={
          interactive && (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="gap-1.5 -ml-1"
              onClick={back}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("get.widget.back")}
            </Button>
          )
        }
        actions={
          interactive &&
          canRefund && (
            <Button
              type="button"
              className="gap-1.5"
              onClick={() =>
                navigation.push(definitions.POST, {
                  urlPathParams: { orderId: summary.orderId },
                })
              }
            >
              <RotateCcw className="h-4 w-4" />
              {t("get.widget.startRefund")}
            </Button>
          )
        }
      />
      {!summary ? (
        <LoadingBlock message={t("get.widget.loading")} />
      ) : (
        <Div className="flex flex-col gap-4">
          {summary.status !== PosOrderStatus.COMPLETED ? (
            <ResultBanner
              variant="warning"
              title={t("get.widget.notCompleted")}
            />
          ) : summary.refundableTotal === 0 ? (
            <ResultBanner
              variant="info"
              title={t("get.widget.fullyRefunded")}
            />
          ) : null}
          <DetailGrid columns={3} className="rounded-xl border bg-card p-4">
            <DetailField
              label={t("get.response.total")}
              value={money(summary.total)}
            />
            <DetailField
              label={t("get.response.refundedTotal")}
              value={money(summary.refundedTotal)}
            />
            <DetailField
              label={t("get.response.refundableTotal")}
              value={money(summary.refundableTotal)}
            />
          </DetailGrid>

          <SectionGroup title={t("get.response.lines")}>
            <Div className="flex flex-col divide-y">
              {summary.lines.map((line) => (
                <Div
                  key={line.orderItemId}
                  className="flex min-w-0 flex-col gap-0.5 py-3"
                >
                  <Div className="flex items-baseline justify-between gap-3">
                    <Span className="min-w-0 truncate text-sm font-medium">
                      {line.description}
                    </Span>
                    <Span className="whitespace-nowrap text-sm font-semibold tabular-nums">
                      {money(line.lineTotal)}
                    </Span>
                  </Div>
                  <Span className="text-[13px] text-muted-foreground tabular-nums">
                    {[
                      t("post.widget.sold", {
                        quantity: formatQuantity(line.quantity, locale),
                      }),
                      line.refundedQuantity > 0
                        ? t("post.widget.alreadyRefunded", {
                            quantity: formatQuantity(
                              line.refundedQuantity,
                              locale,
                            ),
                          })
                        : undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Span>
                </Div>
              ))}
            </Div>
          </SectionGroup>

          <SectionGroup title={t("get.widget.history")}>
            {summary.refunds.length === 0 ? (
              <EmptyBlock size="compact" title={t("get.widget.noRefunds")} />
            ) : (
              <Div className="flex flex-col divide-y">
                {summary.refunds.map((refund) => {
                  const label = methodLabel(refund.method);
                  return (
                    <Div
                      key={refund.refundId}
                      className="flex items-start justify-between gap-3 py-2"
                    >
                      <Div className="flex min-w-0 flex-col gap-0.5">
                        <Span className="whitespace-nowrap text-sm font-semibold">
                          {refund.refundNumber}
                        </Span>
                        <Span className="text-xs text-muted-foreground">
                          {[
                            formatDocDate(refund.createdAt, locale),
                            refund.reason,
                          ].join(" · ")}
                        </Span>
                      </Div>
                      <Div className="flex flex-col items-end gap-1">
                        <Span className="whitespace-nowrap text-sm font-semibold tabular-nums">
                          {money(refund.total)}
                        </Span>
                        {label && (
                          <StatusPill variant="muted" status={t(label)} />
                        )}
                      </Div>
                    </Div>
                  );
                })}
              </Div>
            )}
          </SectionGroup>
        </Div>
      )}
    </WidgetShell>
  );
}

/** POST: refund form with qty steppers, method, reason and live total. */
export function PosOrderRefundWidget({
  field: { children },
}: {
  field: (typeof definitions.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const result = useWidgetValue<typeof definitions.POST>()?.result;
  const form = useWidgetForm<typeof definitions.POST>();
  const navigation = useWidgetNavigation();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();
  const submitting = useWidgetIsSubmitting();
  const onSubmit = useWidgetOnSubmit();
  const showActions = interactive && !responseOnly;

  const orderId = useWatch({ control: form.control, name: "orderId" });
  const method =
    useWatch({ control: form.control, name: "method" }) ??
    PosPaymentMethod.CASH;
  const reason = useWatch({ control: form.control, name: "reason" })?.trim();

  const readOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { orderId: orderId ?? "" },
        queryOptions: {
          enabled:
            showActions && !result && z.uuid().safeParse(orderId).success,
          staleTime: 0,
        },
      },
    }),
    [orderId, showActions, result],
  );
  const read = useEndpoint(
    useMemo(() => ({ GET: definitions.GET }), []),
    readOptions,
    logger,
    user,
  ).read;
  const loaded = read?.data?.result;
  const summary: RefundSummary | undefined =
    loaded?.orderId === orderId ? loaded : undefined;

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selection = useMemo(
    () =>
      (summary?.lines ?? []).flatMap((line) => {
        const quantity = quantities[line.orderItemId] ?? 0;
        return quantity > 0
          ? [{ orderItemId: line.orderItemId, quantity }]
          : [];
      }),
    [quantities, summary],
  );
  const plan = useMemo(
    () =>
      summary && selection.length > 0
        ? planPosRefund(
            summary.lines.map((line) => ({
              orderItemId: line.orderItemId,
              quantity: line.quantity,
              lineTotal: line.lineTotal,
              taxAmount: line.taxAmount,
              refundedQuantity: line.refundedQuantity,
              refundedLineTotal: line.refundedLineTotal,
              refundedTaxAmount: line.refundedTaxAmount,
            })),
            selection,
            summary,
            {
              subtotal: summary.refundedSubtotal,
              taxAmount: summary.refundedTaxAmount,
              total: summary.refundedTotal,
            },
          )
        : undefined,
    [selection, summary],
  );

  // Keep the request in sync with the steppers and the default drawer.
  const cashSessionId = summary?.cashSession?.sessionId;
  const isCash = method === PosPaymentMethod.CASH;
  useEffect(() => {
    form.setValue("lines", selection.length > 0 ? selection : undefined, {
      shouldDirty: true,
    });
  }, [form, selection]);
  useEffect(() => {
    if (!form.getValues("method")) {
      form.setValue("method", PosPaymentMethod.CASH);
    }
  }, [form]);
  useEffect(() => {
    form.setValue("sessionId", isCash ? cashSessionId : undefined);
  }, [form, isCash, cashSessionId]);

  const money = (amount: number, currency?: string): string =>
    formatMoney(amount, currency ?? summary?.currency, locale);
  const back = (): void => {
    if (navigation.canGoBack) {
      navigation.pop();
    } else if (orderId) {
      void openOrder(navigation, orderId);
    }
  };

  const header = (
    <WidgetHeader
      size="page"
      title={t("post.title")}
      subtitle={summary?.orderNumber ?? t("post.description")}
      backButton={
        interactive && (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className="gap-1.5 -ml-1"
            onClick={back}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("post.widget.back")}
          </Button>
        )
      }
    />
  );

  if (result) {
    const label = methodLabel(result.method);
    return (
      <WidgetShell layout="page">
        {header}
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t("post.success.description")}
        >
          <DetailGrid columns={3}>
            <DetailField
              label={t("post.response.refundNumber")}
              value={result.refundNumber}
            />
            <DetailField
              label={t("post.response.total")}
              value={money(result.total, result.currency)}
            />
            <DetailField
              label={t("post.response.method")}
              value={label ? t(label) : result.method}
            />
            <DetailField
              label={t("post.response.refundedTotal")}
              value={money(result.refundedTotal, result.currency)}
            />
            {result.stockReturned > 0 ? (
              <DetailField
                label={t("post.response.stockReturned")}
                value={formatQuantity(result.stockReturned, locale)}
              />
            ) : null}
          </DetailGrid>
        </ResultBanner>
        {interactive && (
          <Div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void openOrder(navigation, result.orderId)}
            >
              {t("post.widget.newSale")}
            </Button>
            <Button
              type="button"
              onClick={() =>
                navigation.push(definitions.GET, {
                  urlPathParams: { orderId: result.orderId },
                })
              }
            >
              {t("post.widget.viewRefunds")}
            </Button>
          </Div>
        )}
      </WidgetShell>
    );
  }

  if (!summary) {
    return (
      <WidgetShell layout="page">
        {header}
        <FormAlertWidget field={{}} />
        {orderId && <LoadingBlock message={t("post.widget.loading")} />}
      </WidgetShell>
    );
  }

  if (summary.status !== PosOrderStatus.COMPLETED) {
    return (
      <WidgetShell layout="page">
        {header}
        <EmptyBlock title={t("messages.notCompleted")} />
      </WidgetShell>
    );
  }
  if (summary.refundableTotal === 0) {
    return (
      <WidgetShell layout="page">
        {header}
        <EmptyBlock title={t("messages.nothingLeft")} />
      </WidgetShell>
    );
  }

  const setQuantity = (orderItemId: string, quantity: number): void =>
    setQuantities((current) => ({
      ...current,
      [orderItemId]: Math.max(0, Math.round(quantity * UNITS) / UNITS),
    }));
  const selectAll = (): void =>
    setQuantities(
      Object.fromEntries(
        summary.lines.map((line) => [
          line.orderItemId,
          line.refundableQuantity,
        ]),
      ),
    );
  const allSelected = summary.lines.every(
    (line) =>
      toUnits(quantities[line.orderItemId] ?? 0) ===
      toUnits(line.refundableQuantity),
  );

  const cash = summary.cashSession;
  const drawerShort =
    isCash &&
    !!cash &&
    !!plan?.ok &&
    Math.round(cash.available * 100) < Math.round(plan.total * 100);
  const planError =
    plan && !plan.ok
      ? plan.reason === "invalidLine"
        ? t("messages.invalidLine")
        : t(`messages.${plan.reason}`)
      : undefined;
  const selectedLabel = methodLabel(method);
  const canConfirm =
    !!onSubmit &&
    !!plan?.ok &&
    !!reason &&
    reason.length <= 500 &&
    (!isCash || (!!cash && !drawerShort)) &&
    !submitting &&
    !disabled;

  return (
    <WidgetShell layout="page">
      {header}
      <FormAlertWidget field={{}} />
      <Div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_320px]">
        <Div className="flex min-w-0 flex-col gap-4">
          <SectionGroup title={t("post.widget.items")}>
            <Div className="flex flex-col gap-1">
              {showActions && (
                <Div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      allSelected ? setQuantities({}) : selectAll()
                    }
                  >
                    {allSelected
                      ? t("post.widget.clear")
                      : t("post.widget.selectAll")}
                  </Button>
                </Div>
              )}
              <Div className="flex flex-col divide-y">
                {summary.lines.map((line) => {
                  const quantity = quantities[line.orderItemId] ?? 0;
                  const max = line.refundableQuantity;
                  const done = max === 0;
                  return (
                    <Div
                      key={line.orderItemId}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <Span className="truncate text-sm font-medium">
                          {line.description}
                        </Span>
                        <Span className="text-xs text-muted-foreground tabular-nums">
                          {[
                            t("post.widget.sold", {
                              quantity: formatQuantity(line.quantity, locale),
                            }),
                            money(line.unitPrice),
                            line.refundedQuantity > 0
                              ? t("post.widget.alreadyRefunded", {
                                  quantity: formatQuantity(
                                    line.refundedQuantity,
                                    locale,
                                  ),
                                })
                              : undefined,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </Span>
                      </Div>
                      {done ? (
                        <StatusPill
                          variant="muted"
                          status={t("post.widget.nothingLeft")}
                        />
                      ) : (
                        <Div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-10 w-10"
                            disabled={!showActions || quantity <= 0}
                            aria-label={t("post.widget.decrease", {
                              item: line.description,
                            })}
                            onClick={() =>
                              setQuantity(line.orderItemId, quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Span className="w-14 text-center text-base font-semibold tabular-nums">
                            {formatQuantity(quantity, locale)}
                          </Span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-10 w-10"
                            disabled={!showActions || quantity >= max}
                            aria-label={t("post.widget.increase", {
                              item: line.description,
                            })}
                            onClick={() =>
                              setQuantity(
                                line.orderItemId,
                                Math.min(max, quantity + 1),
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={!showActions || quantity === max}
                            onClick={() => setQuantity(line.orderItemId, max)}
                          >
                            {t("post.widget.all")}
                          </Button>
                        </Div>
                      )}
                    </Div>
                  );
                })}
              </Div>
            </Div>
          </SectionGroup>

          <Div className="flex flex-col gap-2">
            <Span className="text-sm font-medium">
              {t("post.method.label")}
            </Span>
            <Div
              aria-label={t("post.method.label")}
              className="grid grid-cols-2 gap-2 @md:grid-cols-4"
            >
              {PosPaymentMethodOptions.map((option) => {
                const Icon = methodIcons[option.value];
                const selected = method === option.value;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    variant={selected ? "default" : "outline"}
                    disabled={!showActions}
                    className="h-14 flex-col gap-1"
                    onClick={() =>
                      form.setValue("method", option.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <Span className="text-xs font-semibold">
                      {t(option.label)}
                    </Span>
                  </Button>
                );
              })}
            </Div>
            {isCash &&
              (cash ? (
                <Span className="text-sm text-muted-foreground">
                  {[
                    t("post.widget.cashFrom", { terminal: cash.terminalName }),
                    t("post.widget.drawerAvailable", {
                      amount: money(cash.available),
                    }),
                  ].join(" · ")}
                </Span>
              ) : (
                <Span className="text-sm text-destructive">
                  {t("post.widget.noCashSession", {
                    currency: summary.currency,
                  })}
                </Span>
              ))}
            {drawerShort && (
              <Span className="text-sm text-destructive">
                {t("post.widget.drawerShort")}
              </Span>
            )}
          </Div>

          <TextareaFieldWidget fieldName="reason" field={children.reason} />
        </Div>

        <Div className="flex flex-col gap-3 @3xl:sticky @3xl:top-4 @3xl:self-start">
          <SectionGroup title={t("post.widget.summary")}>
            <Div className="flex flex-col gap-2">
              <Div className="flex items-center justify-between text-sm">
                <Span className="text-muted-foreground">
                  {t("post.widget.net")}
                </Span>
                <Span className="tabular-nums">
                  {money(plan?.ok ? plan.subtotal : 0)}
                </Span>
              </Div>
              <Div className="flex items-center justify-between text-sm">
                <Span className="text-muted-foreground">
                  {t("post.widget.vat")}
                </Span>
                <Span className="tabular-nums">
                  {money(plan?.ok ? plan.taxAmount : 0)}
                </Span>
              </Div>
              <Div className="flex items-center justify-between border-t pt-2">
                <Span className="text-sm font-semibold">
                  {t("post.widget.total")}
                </Span>
                <Span className="text-xl font-semibold tabular-nums">
                  {money(plan?.ok ? plan.total : 0)}
                </Span>
              </Div>
              {selection.length === 0 && (
                <Span className="text-xs text-muted-foreground">
                  {t("post.widget.pickItems")}
                </Span>
              )}
              {planError && (
                <Span className="text-xs text-destructive">{planError}</Span>
              )}
              {plan?.ok && !reason && (
                <Span className="text-xs text-muted-foreground">
                  {t("post.widget.reasonMissing")}
                </Span>
              )}
            </Div>
          </SectionGroup>

          {showActions && (
            <Div className="flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={back}>
                {t("post.widget.cancel")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" disabled={!canConfirm}>
                    {t("post.widget.confirm")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("post.widget.confirmTitle", {
                        amount: money(plan?.ok ? plan.total : 0),
                      })}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("post.widget.confirmDescription", {
                        method: selectedLabel ? t(selectedLabel) : method,
                      })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {reason && (
                    <DetailGrid columns={2}>
                      <DetailField
                        label={t("post.reason.label")}
                        value={reason}
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
      </Div>
    </WidgetShell>
  );
}
