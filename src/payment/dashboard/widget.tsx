"use client";

import { KpiGrid, KpiTile } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ArrowRight } from "next-vibe/ui/components/icons/ArrowRight";
import { FilePlus } from "next-vibe/ui/components/icons/FilePlus";
import { FileText } from "next-vibe/ui/components/icons/FileText";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { documentStatusVariant } from "@/finance/document-status";

import {
  EstimateStatus,
  type EstimateStatusValue,
  InvoiceStatus,
  type InvoiceStatusValue,
} from "../enum";
import { scopedTranslation as paymentTranslation } from "../i18n";
import type definition from "./definition";
import type { PaymentDashboardResponseOutput } from "./definition";

type RecentInvoice = PaymentDashboardResponseOutput["recentInvoices"][number];
type RecentEstimate =
  PaymentDashboardResponseOutput["estimates"]["recent"][number];

function customerCell(row: RecentInvoice): JSX.Element {
  return (
    <Span className="block max-w-64 truncate">{row.customerName ?? "-"}</Span>
  );
}

function isCreditNote(row: RecentInvoice): boolean {
  return Number(row.amount) < 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaymentDashboardWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tPayment } = paymentTranslation.scopedT(locale);
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;

  const newInvoice = (): void => {
    void Promise.all([
      import("@/payment/invoice/create/definition"),
      import("@/payment/invoice/[invoiceId]/get/definition"),
    ]).then(([createDef, getDef]) =>
      navigation.push(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            invoiceId: responseData.invoice.id,
          }),
        },
      }),
    );
  };

  const newEstimate = (): void => {
    void Promise.all([
      import("@/payment/estimate/create/definition"),
      import("@/payment/estimate/[estimateId]/get/definition"),
    ]).then(([createDef, getDef]) =>
      navigation.push(createDef.default.POST, {
        renderInModal: true,
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            estimateId: responseData.estimate.id,
          }),
        },
      }),
    );
  };

  const openInvoices = (
    status?: "overdue" | typeof InvoiceStatusValue,
  ): void => {
    void import("@/payment/invoice/list/definition").then((def) =>
      navigation.push(def.default.GET, status ? { data: { status } } : {}),
    );
  };

  const openEstimates = (status?: typeof EstimateStatusValue): void => {
    void import("@/payment/estimate/list/definition").then((def) =>
      navigation.push(def.default.GET, status ? { data: { status } } : {}),
    );
  };

  const openBills = (): void => {
    void import("@/payment/bill/list/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const openProcessor = (): void => {
    void import("../processor/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const openInvoice = (invoiceId: string): void => {
    void import("@/payment/invoice/[invoiceId]/get/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { invoiceId } }),
    );
  };

  const openEstimate = (estimateId: string): void => {
    void import("@/payment/estimate/[estimateId]/get/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { estimateId } }),
    );
  };

  const header = (
    <WidgetHeader
      size="page"
      title={t("widget.commercialDocuments")}
      subtitle={t("widget.subtitle")}
      actions={
        isInteractive ? (
          <>
            <Button type="button" variant="outline" onClick={newEstimate}>
              <FilePlus className="mr-1.5 h-4 w-4" />
              {t("widget.newEstimate")}
            </Button>
            <Button type="button" onClick={newInvoice}>
              <FilePlus className="mr-1.5 h-4 w-4" />
              {t("widget.newInvoice")}
            </Button>
          </>
        ) : undefined
      }
    />
  );

  if (!data) {
    return (
      <WidgetShell layout="page">
        {header}
        <FormAlertWidget field={{}} />
        <LoadingBlock message={t("widget.loading")} />
      </WidgetShell>
    );
  }

  const currency = data.currency;
  const otherCurrencies = (
    key: "open" | "overdue" | "unpaid",
  ): string | undefined => {
    const amounts = data.byCurrency
      .filter((row) => row.currency !== currency && row[key] > 0)
      .map((row) => formatMoney(row[key], row.currency, locale));
    return amounts.length ? `+ ${amounts.join(" + ")}` : undefined;
  };
  const hint = (count: number, key: "open" | "overdue" | "unpaid"): string =>
    [
      count === 1
        ? t("widget.documentCountOne")
        : t("widget.documentCount", { count }),
      otherCurrencies(key),
    ]
      .filter(Boolean)
      .join(" · ");
  const estimateAmounts = data.estimates.sentByCurrency
    .map((row) => formatMoney(row.total, row.currency, locale))
    .join(" + ");

  const invoiceNumber = (row: RecentInvoice): string =>
    row.invoiceNumber ??
    (row.invoiceSequenceNumber === null
      ? t("widget.status.draft")
      : `#${row.invoiceSequenceNumber}`);
  const invoiceStatus = (row: RecentInvoice): JSX.Element => (
    <StatusPill
      status={row.status}
      variant={
        row.status === InvoiceStatus.VOID
          ? "muted"
          : documentStatusVariant(row.status, { overdue: row.isOverdue })
      }
      label={
        row.isOverdue
          ? t("widget.overdue")
          : isCreditNote(row) && row.status === InvoiceStatus.OPEN
            ? t("widget.creditNote")
            : tPayment(row.status)
      }
      className={`whitespace-nowrap ${row.status === InvoiceStatus.VOID ? "line-through" : ""}`}
    />
  );
  const dueCell = (row: RecentInvoice): JSX.Element =>
    row.dueDate ? (
      <Span
        className={
          row.isOverdue
            ? "whitespace-nowrap font-medium text-destructive"
            : "whitespace-nowrap text-foreground"
        }
      >
        {formatDocDate(row.dueDate, locale)}
      </Span>
    ) : (
      <Span className="text-muted-foreground">-</Span>
    );
  const money = (amount: number, code: string, muted = false): JSX.Element => (
    <Span
      className={`whitespace-nowrap tabular-nums ${muted ? "text-muted-foreground" : ""}`}
    >
      {formatMoney(amount, code, locale)}
    </Span>
  );

  const numberCell = (row: RecentInvoice): JSX.Element => (
    <Span className="whitespace-nowrap font-semibold">
      {invoiceNumber(row)}
    </Span>
  );
  const openCell = (row: RecentInvoice): JSX.Element => (
    <Span
      className={`whitespace-nowrap tabular-nums ${row.amountDue > 0 ? (row.isOverdue ? "font-semibold text-destructive" : "font-semibold") : "text-muted-foreground"}`}
    >
      {formatMoney(row.amountDue, row.currency, locale)}
    </Span>
  );

  const estimateRow = (row: RecentEstimate): JSX.Element => (
    <ListItem
      key={row.id}
      className="min-h-14 rounded-none border-0 border-b last:border-b-0"
      title={row.estimateNumber}
      subtitle={[
        row.customerName,
        row.validUntil
          ? t("widget.validUntil", {
              date: formatDocDate(row.validUntil, locale),
            })
          : null,
      ]
        .filter(Boolean)
        .join(" · ")}
      badges={
        <StatusPill
          status={row.status}
          variant={documentStatusVariant(row.status)}
          label={tPayment(row.status)}
        />
      }
      meta={
        <Span className="font-semibold tabular-nums text-foreground">
          {formatMoney(row.total, row.currency, locale)}
        </Span>
      }
      onClick={isInteractive ? (): void => openEstimate(row.id) : undefined}
    />
  );

  return (
    <WidgetShell layout="page">
      {header}
      <FormAlertWidget field={{}} />

      <KpiGrid columns={5}>
        <KpiTile
          wrapLabel
          label={t("widget.openInvoices")}
          value={data.openInvoices.total}
          format="currency"
          currency={currency}
          locale={locale}
          hint={hint(data.openInvoices.count, "open")}
          onClick={isInteractive ? (): void => openInvoices() : undefined}
        />
        <KpiTile
          wrapLabel
          label={t("widget.overdue")}
          value={data.overdueInvoices.total}
          format="currency"
          currency={currency}
          locale={locale}
          tone={data.overdueInvoices.count > 0 ? "negative" : "default"}
          hint={hint(data.overdueInvoices.count, "overdue")}
          onClick={
            isInteractive ? (): void => openInvoices("overdue") : undefined
          }
        />
        <KpiTile
          wrapLabel
          label={t("widget.unpaidBills")}
          value={data.unpaidBills.total}
          format="currency"
          currency={currency}
          locale={locale}
          hint={hint(data.unpaidBills.count, "unpaid")}
          onClick={isInteractive ? openBills : undefined}
        />
        <KpiTile
          wrapLabel
          label={t("widget.draftInvoices")}
          value={data.draftInvoices.count}
          locale={locale}
          hint={t("widget.draftHint")}
          onClick={
            isInteractive
              ? (): void => openInvoices(InvoiceStatus.DRAFT)
              : undefined
          }
        />
        <KpiTile
          wrapLabel
          label={t("widget.estimatesSent")}
          value={data.estimates.sentCount}
          locale={locale}
          hint={[
            estimateAmounts || null,
            data.estimates.draftCount === 1
              ? t("widget.estimateDraftOne")
              : t("widget.estimateDrafts", {
                  count: data.estimates.draftCount,
                }),
          ]
            .filter(Boolean)
            .join(" · ")}
          onClick={
            isInteractive
              ? (): void => openEstimates(EstimateStatus.SENT)
              : undefined
          }
        />
      </KpiGrid>

      <Div className="flex min-w-0 flex-col gap-6">
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="flex items-center justify-between gap-2">
            <Span className="text-base font-semibold">
              {t("widget.recentInvoices")}
            </Span>
            {isInteractive && data.recentInvoices.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-10"
                onClick={(): void => openInvoices()}
              >
                {t("widget.allInvoices")}
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            )}
          </Div>
          {data.recentInvoices.length === 0 ? (
            <EmptyBlock
              icon={<FileText className="h-6 w-6" />}
              title={t("widget.noRecentInvoices")}
              message={t("widget.notInvoicesHint")}
              action={
                isInteractive
                  ? { label: t("widget.newInvoice"), onClick: newInvoice }
                  : undefined
              }
              secondaryAction={
                isInteractive
                  ? {
                      label: t("widget.openTransactions"),
                      onClick: openProcessor,
                      variant: "ghost",
                    }
                  : undefined
              }
            />
          ) : (
            <RecordTable
              label={t("widget.recentInvoices")}
              columns={[
                { id: "number", label: t("widget.columns.number") },
                { id: "customer", label: t("widget.columns.customer") },
                { id: "due", label: t("widget.due") },
                { id: "status", label: t("widget.columns.status") },
                {
                  id: "total",
                  label: t("widget.columns.total"),
                  numeric: true,
                },
                { id: "open", label: t("widget.columns.open"), numeric: true },
              ]}
              rows={data.recentInvoices.map((row) => ({
                id: row.id,
                onOpen: isInteractive
                  ? (): void => openInvoice(row.id)
                  : undefined,
                cells: {
                  number: numberCell(row),
                  customer: customerCell(row),
                  due: dueCell(row),
                  status: invoiceStatus(row),
                  total: money(Number(row.amount), row.currency),
                  open: openCell(row),
                },
              }))}
              compact={
                <Div className="overflow-hidden rounded-lg border bg-card">
                  {data.recentInvoices.map((row) => (
                    <ListItem
                      key={row.id}
                      className="min-h-14 rounded-none border-0 border-b last:border-b-0"
                      title={row.customerName ?? invoiceNumber(row)}
                      subtitle={[
                        row.customerName ? invoiceNumber(row) : null,
                        row.dueDate
                          ? `${t("widget.due")} ${formatDocDate(row.dueDate, locale)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      badges={invoiceStatus(row)}
                      meta={
                        <Span className="font-semibold tabular-nums text-foreground">
                          {formatMoney(
                            Number(row.amount),
                            row.currency,
                            locale,
                          )}
                        </Span>
                      }
                      onClick={
                        isInteractive
                          ? (): void => openInvoice(row.id)
                          : undefined
                      }
                    />
                  ))}
                </Div>
              }
            />
          )}
        </Div>

        <Div className="grid min-w-0 gap-6 @3xl:grid-cols-[1.6fr_1fr]">
          <Div className="flex min-w-0 flex-col gap-3">
            <Div className="flex items-center justify-between gap-2">
              <Span className="text-base font-semibold">
                {t("widget.recentEstimates")}
              </Span>
              {isInteractive && data.estimates.recent.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="min-h-10"
                  onClick={(): void => openEstimates()}
                >
                  {t("widget.allEstimates")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
            </Div>
            {data.estimates.recent.length === 0 ? (
              <EmptyBlock
                icon={<FileText className="h-6 w-6" />}
                title={t("widget.noRecentEstimates")}
                message={t("widget.noRecentEstimatesHint")}
                action={
                  isInteractive
                    ? { label: t("widget.newEstimate"), onClick: newEstimate }
                    : undefined
                }
              />
            ) : (
              <Div className="overflow-hidden rounded-lg border bg-card">
                {data.estimates.recent.map(estimateRow)}
              </Div>
            )}
          </Div>
          {isInteractive && (
            <Div className="flex h-fit flex-col gap-2 rounded-lg border bg-card p-4">
              <Span className="text-sm font-semibold">
                {t("widget.quickActions")}
              </Span>
              <Div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10 justify-between"
                  onClick={openBills}
                >
                  {t("widget.allBills")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-10 justify-between"
                  onClick={openProcessor}
                >
                  {t("widget.processorDiagnostics")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Div>
            </Div>
          )}
        </Div>
      </Div>
    </WidgetShell>
  );
}
