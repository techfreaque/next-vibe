"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Label } from "next-vibe/ui/components/label";
import { ListItem } from "next-vibe/ui/components/list-item";
import { RecordTable } from "next-vibe/ui/components/record-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import { useToolCompanyId } from "@/companies/_shared/workspace-company-context";
import { DocumentScopePicker } from "@/finance/document-list-ui";
import { reportDay } from "@/finance/report-period";
import { ReportAsOfControl } from "@/finance/report-period-control";

import type { ChartOfAccountsTranslationKey } from "../../i18n";
import type definition from "./definition";
import type { ReceivablesAgingResponseOutput } from "./definition";

const relatedReports: readonly {
  label: ChartOfAccountsTranslationKey;
  load: () => Promise<{
    default: {
      GET: Parameters<ReturnType<typeof useWidgetNavigation>["push"]>[0];
    };
  }>;
}[] = [
  {
    label: "reports.nav.profitLoss",
    load: () => import("../profit-loss/definition"),
  },
  {
    label: "reports.nav.balanceSheet",
    load: () => import("../balance-sheet/definition"),
  },
  {
    label: "reports.nav.trialBalance",
    load: () => import("../trial-balance/definition"),
  },
  {
    label: "reports.nav.taxReport",
    load: () => import("../tax-report/definition"),
  },
] as const;

export function ReceivablesAgingWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const response = useWidgetResponse();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const toolCompanyId = useToolCompanyId();
  const companyId = form.watch("companyId");
  const reportCompanyId = companyId || data?.reportCompanyId || undefined;
  const isActiveCompany = Boolean(
    reportCompanyId && toolCompanyId === reportCompanyId,
  );
  const currency = form.watch("currency");
  const date = form.watch("asOfDate");
  const [expanded, setExpanded] = useState<string>();
  const reportDate = data?.asOfDateResponse
    ? new Date(data.asOfDateResponse)
    : null;
  const ready =
    response?.success !== false &&
    data?.reportCurrency &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (!currency || currency === data.reportCurrency) &&
        (!date || date === reportDate?.toISOString().slice(0, 10))));
  const bands = [
    {
      key: "current",
      items: data?.bucketsCurrentItems ?? [],
      total: data?.totalsCurrent ?? 0,
    },
    {
      key: "days1to30",
      items: data?.bucketsDays1to30Items ?? [],
      total: data?.totalsDays1to30 ?? 0,
    },
    {
      key: "days31to60",
      items: data?.bucketsDays31to60Items ?? [],
      total: data?.totalsDays31to60 ?? 0,
    },
    {
      key: "days61to90",
      items: data?.bucketsDays61to90Items ?? [],
      total: data?.totalsDays61to90 ?? 0,
    },
    {
      key: "over90",
      items: data?.bucketsOver90Items ?? [],
      total: data?.totalsOver90 ?? 0,
    },
  ] as const;
  type Item = ReceivablesAgingResponseOutput["bucketsCurrentItems"][number];
  const customers = new Map<
    string,
    { id: string; name: string; bands: number[]; total: number; items: Item[] }
  >();
  for (const [index, band] of bands.entries()) {
    for (const item of band.items) {
      const id = item.customerId ?? item.invoiceId;
      const customer = customers.get(id) ?? {
        id,
        name:
          item.customerName ??
          item.invoiceNumber ??
          t("receivablesAging.response.invoiceId"),
        bands: [0, 0, 0, 0, 0],
        total: 0,
        items: [],
      };
      const cents = Math.round(item.amount * 100);
      customer.bands[index] += cents;
      customer.total += cents;
      customer.items.push(item);
      customers.set(id, customer);
    }
  }
  const ordered = [...customers.values()].toSorted(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name, locale),
  );

  const denomination = data?.reportCurrency;
  const money = (amount: number): string =>
    denomination ? formatMoney(amount, denomination, locale) : "";
  const openInvoice = (id: string): void => {
    void import("@/payment/invoice/[invoiceId]/get/definition").then((mod) =>
      navigation.push(mod.default.GET, { urlPathParams: { invoiceId: id } }),
    );
  };
  const toggleCustomer = (id: string): void =>
    setExpanded((previous) => (previous === id ? undefined : id));
  const invoices = (items: Item[]): JSX.Element => (
    <Div className="flex flex-col gap-1">
      {items.map((item) => (
        <ListItem
          key={item.invoiceId}
          className="border-0"
          title={item.invoiceNumber ?? t("receivablesAging.response.invoiceId")}
          subtitle={
            item.dueDate
              ? `${t("receivablesAging.response.dueDate")} ${formatDocDate(item.dueDate, locale)}`
              : undefined
          }
          meta={<Span className="tabular-nums">{money(item.amount)}</Span>}
          onClick={interactive ? () => openInvoice(item.invoiceId) : undefined}
        />
      ))}
    </Div>
  );
  const reportMenu = interactive && (
    <Select
      value=""
      onValueChange={(value: string) => {
        const report = relatedReports.find((item) => item.label === value);
        if (report) {
          void report.load().then((mod) =>
            navigation.push(mod.default.GET, {
              data: {
                companyId: reportCompanyId,
              },
            }),
          );
        }
      }}
    >
      <SelectTrigger
        aria-label={t("reports.switchReport")}
        className="w-auto min-w-32"
      >
        <SelectValue placeholder={t("reports.switchReport")} />
      </SelectTrigger>
      <SelectContent>
        {relatedReports.map((report) => (
          <SelectItem key={report.label} value={report.label}>
            {t(report.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const visibleDate = date || reportDate?.toISOString().slice(0, 10) || today;
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("receivablesAging.title")}
        subtitle={t("receivablesAging.description")}
        actions={reportMenu}
      />
      {showInputs && (
        <Div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3">
          {!isActiveCompany && (
            <Div className="flex min-w-40 flex-col gap-1">
              <Span className="text-sm font-medium">
                {t("receivablesAging.companyId.label")}
              </Span>
              <DocumentScopePicker
                kind="company"
                required
                value={reportCompanyId}
                appliedLabel={
                  data?.reportCompanyId === reportCompanyId
                    ? data?.reportCompanyName
                    : undefined
                }
                onSelect={(id) =>
                  form.setValue("companyId", id, { shouldDirty: true })
                }
              />
            </Div>
          )}
          <Div className="min-w-28">
            <Label htmlFor="aging-currency">
              {t("receivablesAging.response.currency")}
            </Label>
            <Select
              value={currency || denomination || ""}
              onValueChange={(value: string) => {
                const code = CurrenciesArr.find(
                  (candidate) => candidate === value,
                );
                if (code) {
                  form.setValue("currency", code, { shouldDirty: true });
                }
              }}
            >
              <SelectTrigger id="aging-currency">
                <SelectValue
                  placeholder={t("receivablesAging.response.currency")}
                />
              </SelectTrigger>
              <SelectContent>
                {CurrenciesArr.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          <ReportAsOfControl
            label={t("receivablesAging.asOfDate.label")}
            day={visibleDate}
            onChange={(day) =>
              form.setValue("asOfDate", reportDay(day), { shouldDirty: true })
            }
          />
          <SubmitButtonWidget<typeof definition.GET>
            field={{
              text: "reports.widget.run",
              loadingText: "reports.widget.running",
              size: "sm",
              className: "w-auto",
            }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {ready && data && denomination && (
        <>
          <Div className="flex flex-wrap items-end justify-between gap-3">
            <Div className="flex flex-col gap-1">
              <Span className="text-sm text-muted-foreground">
                {t("receivablesAging.widget.totalRow")} {denomination}
              </Span>
              <Span className="text-3xl font-semibold tabular-nums">
                {money(data.totalsTotal)}
              </Span>
            </Div>
            <Span className="text-sm text-muted-foreground">
              {data.reportCompanyName}{" "}
              {reportDate && formatDocDate(reportDate, locale)}
            </Span>
          </Div>
          {ordered.length === 0 ? (
            <EmptyBlock title={t("receivablesAging.widget.noData")} />
          ) : (
            <>
              <RecordTable
                label={t("receivablesAging.title")}
                columns={[
                  {
                    id: "customer",
                    label: t("receivablesAging.response.customerId"),
                  },
                  ...bands.map((band) => ({
                    id: band.key,
                    label: t(`receivablesAging.response.${band.key}`),
                    numeric: true,
                  })),
                  {
                    id: "total",
                    label: t("receivablesAging.response.total"),
                    numeric: true,
                  },
                ]}
                rows={ordered.map((customer) => {
                  const name = (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCustomer(customer.id)}
                    >
                      {customer.name}
                    </Button>
                  );
                  const amounts = Object.fromEntries(
                    bands.map((band, i) => [
                      band.key,
                      money(customer.bands[i] / 100),
                    ]),
                  );
                  return {
                    id: customer.id,
                    cells: {
                      customer: name,
                      ...amounts,
                      total: money(customer.total / 100),
                    },
                    expanded:
                      expanded === customer.id
                        ? invoices(customer.items)
                        : undefined,
                  };
                })}
                footer={{
                  customer: t("receivablesAging.widget.totalRow"),
                  ...Object.fromEntries(
                    bands.map((band) => [band.key, money(band.total)]),
                  ),
                  total: money(data.totalsTotal),
                }}
                compact={
                  <Div className="flex flex-col divide-y rounded-lg border bg-card">
                    {ordered.map((customer) => (
                      <Div key={customer.id}>
                        <ListItem
                          title={customer.name}
                          meta={
                            <Span className="font-medium tabular-nums">
                              {money(customer.total / 100)}
                            </Span>
                          }
                          subtitle={bands
                            .flatMap((band, i) =>
                              customer.bands[i]
                                ? [
                                    `${t(`receivablesAging.response.${band.key}`)} · ${money(customer.bands[i] / 100)}`,
                                  ]
                                : [],
                            )
                            .join(" / ")}
                          onClick={() => toggleCustomer(customer.id)}
                        />
                        {(!interactive || expanded === customer.id) &&
                          invoices(customer.items)}
                      </Div>
                    ))}
                  </Div>
                }
              />
            </>
          )}
        </>
      )}
      {!ready &&
        response?.success !== false &&
        !reportCompanyId &&
        showInputs && (
          <EmptyBlock title={t("receivablesAging.widget.selectCompany")} />
        )}
    </WidgetShell>
  );
}
