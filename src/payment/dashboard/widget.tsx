"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { AlertTriangle } from "next-vibe/ui/components/icons/AlertTriangle";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX } from "react";

import { InvoiceStatus } from "../enum";
import { scopedTranslation as paymentTranslation } from "../i18n";
import type definition from "./definition";
import type { PaymentDashboardResponseOutput } from "./definition";

type RecentInvoice = PaymentDashboardResponseOutput["recentInvoices"][number];

function fmtAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case InvoiceStatus.PAID:
      return "default";
    case InvoiceStatus.OPEN:
      return "secondary";
    case InvoiceStatus.UNCOLLECTIBLE:
      return "destructive";
    default:
      return "outline";
  }
}

function KpiCard({
  label,
  count,
  total,
  currency,
  highlight,
  amounts,
}: {
  label: string;
  count: number;
  total?: number;
  currency: string;
  highlight?: boolean;
  /** Per-currency amounts, preferred over a single total when present */
  amounts?: string;
}): JSX.Element {
  return (
    <Div
      className={`rounded-lg border p-4 flex flex-col gap-1 ${highlight ? "border-destructive bg-destructive/5" : "bg-card"}`}
    >
      <Div className="flex items-center gap-1.5">
        {highlight && (
          <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
        )}
        <Span
          className={`text-xs font-medium ${highlight ? "text-destructive" : "text-muted-foreground"}`}
        >
          {label}
        </Span>
      </Div>
      <Span
        className={`text-2xl font-bold ${highlight ? "text-destructive" : ""}`}
      >
        {count}
      </Span>
      {total !== undefined && (
        <Span className="text-sm tabular-nums text-muted-foreground">
          {amounts ?? fmtAmount(total, currency)}
        </Span>
      )}
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaymentDashboardWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tPayment } = paymentTranslation.scopedT(locale);
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const openRelated = useRelatedEntityNavigation();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;

  const currency = data?.currency ?? "EUR";

  const handleNavNewInvoice = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("@/payment/invoice/create/definition"),
        import("@/payment/invoice/[invoiceId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoice.id,
          }),
        },
      });
    })();
  };

  const handleNavAllInvoices = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/invoice/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavNewEstimate = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("@/payment/estimate/create/definition"),
        import("@/payment/estimate/[estimateId]/get/definition"),
      ]);
      navigate(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            estimateId: responseData.estimate.id,
          }),
        },
      });
    })();
  };

  const handleNavAllEstimates = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/estimate/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavAllBills = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("@/payment/bill/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleViewInvoice =
    (invoiceId: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      void (async (): Promise<void> => {
        const def =
          await import("@/payment/invoice/[invoiceId]/get/definition");
        navigate(def.default.GET, { urlPathParams: { invoiceId } });
      })();
    };

  const perCurrency = (
    key: "open" | "overdue" | "unpaid",
  ): string | undefined =>
    data && data.byCurrency.length > 0
      ? data.byCurrency
          .map((row) => fmtAmount(row[key], row.currency))
          .join(" + ")
      : undefined;

  return (
    <WidgetShell className="min-w-0 gap-6">
      {isInteractive && (
        <Div className="flex flex-wrap items-center justify-between gap-3">
          <Div className="flex min-w-0 flex-col gap-0.5">
            <Span className="text-base font-semibold">
              {t("widget.commercialDocuments")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("widget.subtitle")}
            </Span>
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="whitespace-normal"
            onClick={() =>
              openRelated(() =>
                import("../processor/definition").then(
                  (module) => module.default.GET,
                ),
              )
            }
          >
            {t("widget.processorDiagnostics")}
          </Button>
        </Div>
      )}
      <FormAlertWidget field={{}} />

      {/* Loading state */}
      {!data && (
        <Div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <Span className="text-sm">{t("widget.loading")}</Span>
        </Div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <Div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <KpiCard
              label={t("widget.openInvoices")}
              count={data.openInvoices.count}
              total={data.openInvoices.total}
              currency={currency}
              amounts={perCurrency("open")}
            />
            <KpiCard
              label={t("widget.overdue")}
              count={data.overdueInvoices.count}
              total={data.overdueInvoices.total}
              currency={currency}
              amounts={perCurrency("overdue")}
              highlight={data.overdueInvoices.count > 0}
            />
            <KpiCard
              label={t("widget.unpaidBills")}
              count={data.unpaidBills.count}
              total={data.unpaidBills.total}
              currency={currency}
              amounts={perCurrency("unpaid")}
            />
            <KpiCard
              label={t("widget.draftInvoices")}
              count={data.draftInvoices.count}
              currency={currency}
            />
            <KpiCard
              label={t("widget.estimatesSent")}
              count={data.estimates.sentCount}
              currency={currency}
              amounts={[
                ...(data.estimates.sentByCurrency.length > 0
                  ? [
                      data.estimates.sentByCurrency
                        .map((row) => fmtAmount(row.total, row.currency))
                        .join(" + "),
                    ]
                  : [fmtAmount(0, currency)]),
                t("widget.estimateDrafts", {
                  count: data.estimates.draftCount,
                }),
              ].join(" · ")}
            />
          </Div>

          {/* Quick Actions */}
          <Div className="flex flex-col gap-2">
            <H3 className="text-sm font-semibold text-muted-foreground">
              {t("widget.quickActions")}
            </H3>
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleNavNewInvoice}
                className="gap-1.5"
              >
                <FilePlus className="h-4 w-4" />
                {t("widget.newInvoice")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNavAllInvoices}
                className="gap-1.5"
              >
                {t("widget.allInvoices")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNavNewEstimate}
                className="gap-1.5"
              >
                <FilePlus className="h-4 w-4" />
                {t("widget.newEstimate")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNavAllEstimates}
                className="gap-1.5"
              >
                {t("widget.allEstimates")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNavAllBills}
                className="gap-1.5"
              >
                {t("widget.allBills")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Div>
          </Div>

          {/* Recent Estimates */}
          <Div className="flex flex-col gap-2">
            <H3 className="text-sm font-semibold text-muted-foreground">
              {t("widget.recentEstimates")}
            </H3>
            {data.estimates.recent.length === 0 ? (
              <Div className="rounded-md border border-dashed px-4 py-6 text-center">
                <P className="text-sm text-muted-foreground">
                  {t("widget.noRecentEstimates")}
                </P>
              </Div>
            ) : (
              <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border">
                {data.estimates.recent.map((estimate) => (
                  <Div
                    key={estimate.id}
                    className="flex flex-wrap items-center justify-between gap-2 bg-card px-4 py-3"
                  >
                    <Div className="flex min-w-0 flex-col gap-0.5">
                      <Span className="font-mono text-sm font-semibold">
                        {estimate.estimateNumber}
                      </Span>
                      <Span className="text-xs text-muted-foreground">
                        {[
                          tPayment(estimate.status),
                          ...(estimate.validUntil
                            ? [
                                t("widget.validUntil", {
                                  date: new Date(
                                    estimate.validUntil,
                                  ).toLocaleDateString(locale),
                                }),
                              ]
                            : []),
                        ].join(" · ")}
                      </Span>
                    </Div>
                    <Div className="flex items-center gap-3">
                      <Span className="text-sm font-medium tabular-nums">
                        {fmtAmount(estimate.total, estimate.currency)}
                      </Span>
                      {isInteractive && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openRelated(
                              () =>
                                import("@/payment/estimate/[estimateId]/get/definition").then(
                                  (module) => module.default.GET,
                                ),
                              { urlPathParams: { estimateId: estimate.id } },
                            )
                          }
                        >
                          {t("widget.view")}
                        </Button>
                      )}
                    </Div>
                  </Div>
                ))}
              </Div>
            )}
          </Div>

          {/* Recent Invoices */}
          <Div className="flex flex-col gap-2">
            <H3 className="text-sm font-semibold text-muted-foreground">
              {t("widget.recentInvoices")}
            </H3>

            {data.recentInvoices.length === 0 ? (
              <Div className="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-8 text-center">
                <P className="text-sm font-medium">
                  {t("widget.noRecentInvoices")}
                </P>
                <P className="max-w-prose text-sm text-muted-foreground">
                  {t("widget.notInvoicesHint")}
                </P>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() =>
                    openRelated(() =>
                      import("../processor/definition").then(
                        (module) => module.default.GET,
                      ),
                    )
                  }
                >
                  {t("widget.openTransactions")}
                </Button>
              </Div>
            ) : (
              <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
                {data.recentInvoices.map((inv: RecentInvoice) => (
                  <Div
                    key={inv.id}
                    className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/40 transition-colors"
                  >
                    <Div className="flex flex-col gap-0.5 min-w-0">
                      <Div className="flex items-center gap-2">
                        <Span className="font-mono text-sm font-semibold">
                          #{inv.invoiceSequenceNumber ?? "—"}
                        </Span>
                        {inv.isOverdue && (
                          <Span className="text-xs font-medium text-destructive">
                            {t("widget.overdue")}
                          </Span>
                        )}
                      </Div>
                      <Div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Span className="font-medium tabular-nums text-foreground">
                          {fmtAmount(parseFloat(inv.amount), inv.currency)}
                        </Span>
                        {inv.dueDate && (
                          <Span>
                            {t("widget.due")}{" "}
                            {new Date(inv.dueDate).toLocaleDateString()}
                          </Span>
                        )}
                      </Div>
                    </Div>

                    <Div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={getStatusBadgeVariant(inv.status)}
                        className={
                          inv.status === InvoiceStatus.VOID
                            ? "line-through text-muted-foreground"
                            : inv.status === InvoiceStatus.OPEN && inv.isOverdue
                              ? "border-destructive text-destructive"
                              : ""
                        }
                      >
                        {inv.status === InvoiceStatus.DRAFT
                          ? t("widget.status.draft")
                          : inv.status === InvoiceStatus.OPEN
                            ? t("widget.status.open")
                            : inv.status === InvoiceStatus.PAID
                              ? t("widget.status.paid")
                              : inv.status === InvoiceStatus.VOID
                                ? t("widget.status.void")
                                : inv.status === InvoiceStatus.UNCOLLECTIBLE
                                  ? t("widget.status.uncollectible")
                                  : inv.status}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleViewInvoice(inv.id)}
                      >
                        {t("widget.view")}
                      </Button>
                    </Div>
                  </Div>
                ))}
              </Div>
            )}
          </Div>
        </>
      )}
    </WidgetShell>
  );
}
