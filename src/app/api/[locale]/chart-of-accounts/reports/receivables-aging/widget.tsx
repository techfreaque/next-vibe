"use client";

import { Button, type ButtonMouseEvent } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Span } from "next-vibe/ui/web/ui/span";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SubmitButtonWidget } from "next-vibe/unified-ui/interactive/submit-button/widget";
import type { JSX } from "react";

import invoiceGetDefinitions from "@/app/api/[locale]/payment/invoice/[invoiceId]/get/definition";

import type definition from "./definition";
import type { ReceivablesAgingResponseOutput } from "./definition";

interface ReceivablesAgingWidgetProps {
  field: (typeof definition.GET)["fields"];
}

type AgingItem = NonNullable<
  ReceivablesAgingResponseOutput["bucketsCurrentItems"]
>[number];

function formatAmount(n: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString();
}

interface BucketConfig {
  label: string;
  items: AgingItem[];
  total: number;
  colorClass: string;
  headerClass: string;
}

function BucketSection({
  bucket,
  onViewInvoice,
  viewInvoiceLabel,
}: {
  bucket: BucketConfig;
  onViewInvoice: (invoiceId: string) => (e: ButtonMouseEvent) => void;
  viewInvoiceLabel: string;
}): JSX.Element {
  return (
    <Div className="rounded-md border overflow-hidden">
      <Div
        className={`px-3 py-2 border-b text-xs font-semibold flex items-center justify-between ${bucket.headerClass}`}
      >
        <Span>{bucket.label}</Span>
        <Span className={`font-mono text-sm font-bold ${bucket.colorClass}`}>
          {formatAmount(bucket.total)}
        </Span>
      </Div>
      {bucket.items.length > 0 ? (
        bucket.items.map((item) => (
          <Div
            key={item.invoiceId}
            className="flex items-center gap-2 px-3 py-1.5 border-b last:border-b-0 text-xs hover:bg-muted/40 transition-colors"
          >
            <Span className="font-mono text-muted-foreground w-28 shrink-0 truncate">
              {item.invoiceId}
            </Span>
            <Span className="flex-1 truncate text-muted-foreground">
              {item.customerId}
            </Span>
            <Span className="text-muted-foreground shrink-0">
              {formatDate(item.dueDate)}
            </Span>
            <Span className="font-mono font-medium shrink-0 w-20 text-right">
              {formatAmount(item.amount)}
            </Span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 h-6 px-2 text-xs"
              onClick={onViewInvoice(item.invoiceId)}
            >
              {viewInvoiceLabel}
            </Button>
          </Div>
        ))
      ) : (
        <Div className="px-3 py-2 text-xs text-muted-foreground italic" />
      )}
    </Div>
  );
}

export function ReceivablesAgingWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: ReceivablesAgingWidgetProps,
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const handleViewInvoice =
    (invoiceId: string) =>
    (e: ButtonMouseEvent): void => {
      e.stopPropagation();
      navigation.push(invoiceGetDefinitions.GET, {
        urlPathParams: { invoiceId },
      });
    };

  const handleNavProfitLoss = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../profit-loss/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavBalanceSheet = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../balance-sheet/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavTrialBalance = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../trial-balance/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNavTaxReport = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../tax-report/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const buckets: BucketConfig[] = data
    ? [
        {
          label: t("receivablesAging.response.current"),
          items: data.bucketsCurrentItems ?? [],
          total: data.totalsCurrent ?? 0,
          colorClass: "text-emerald-600 dark:text-emerald-400",
          headerClass:
            "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300",
        },
        {
          label: t("receivablesAging.response.days1to30"),
          items: data.bucketsDays1to30Items ?? [],
          total: data.totalsDays1to30 ?? 0,
          colorClass: "text-yellow-600 dark:text-yellow-400",
          headerClass:
            "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300",
        },
        {
          label: t("receivablesAging.response.days31to60"),
          items: data.bucketsDays31to60Items ?? [],
          total: data.totalsDays31to60 ?? 0,
          colorClass: "text-orange-600 dark:text-orange-400",
          headerClass:
            "bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300",
        },
        {
          label: t("receivablesAging.response.days61to90"),
          items: data.bucketsDays61to90Items ?? [],
          total: data.totalsDays61to90 ?? 0,
          colorClass: "text-red-600 dark:text-red-400",
          headerClass:
            "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300",
        },
        {
          label: t("receivablesAging.response.over90"),
          items: data.bucketsOver90Items ?? [],
          total: data.totalsOver90 ?? 0,
          colorClass: "text-red-800 dark:text-red-300",
          headerClass:
            "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200",
        },
      ]
    : [];

  return (
    <Div className="flex flex-col gap-4">
      <Div className="flex items-center justify-between gap-3 flex-wrap">
        <SubmitButtonWidget<typeof definition.GET>
          field={{
            size: "sm",
            variant: "default",
            text: "reports.widget.run" as const,
            loadingText: "reports.widget.running" as const,
          }}
        />
        <Div className="flex gap-1 flex-wrap">
          <Button size="sm" variant="ghost" onClick={handleNavProfitLoss}>
            {t("reports.nav.profitLoss")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavBalanceSheet}>
            {t("reports.nav.balanceSheet")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavTrialBalance}>
            {t("reports.nav.trialBalance")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleNavTaxReport}>
            {t("reports.nav.taxReport")}
          </Button>
        </Div>
      </Div>

      {data?.bucketsCurrentItems !== undefined ? (
        <Div className="flex flex-col gap-3">
          {data.asOfDateResponse && (
            <Span className="text-sm text-muted-foreground">
              {t("receivablesAging.widget.asOf")}{" "}
              {formatDate(data.asOfDateResponse)}
            </Span>
          )}

          <Div className="grid grid-cols-5 gap-2 rounded-md border p-3 bg-muted/20">
            {buckets.map((bucket) => (
              <Div
                key={bucket.label}
                className="flex flex-col gap-0.5 text-center"
              >
                <Span
                  className={`text-sm font-bold font-mono ${bucket.colorClass}`}
                >
                  {formatAmount(bucket.total)}
                </Span>
                <Span className="text-xs text-muted-foreground leading-tight">
                  {bucket.label}
                </Span>
              </Div>
            ))}
          </Div>

          <Div className="flex items-center justify-between rounded-md border px-3 py-2 font-semibold text-sm">
            <Span>{t("receivablesAging.widget.totalRow")}</Span>
            <Span className="font-mono">
              {formatAmount(data.totalsTotal ?? 0)}
            </Span>
          </Div>

          {buckets.map((bucket) => (
            <BucketSection
              key={bucket.label}
              bucket={bucket}
              onViewInvoice={handleViewInvoice}
              viewInvoiceLabel={t("receivablesAging.widget.viewInvoice")}
            />
          ))}
        </Div>
      ) : (
        <Div className="text-center py-10 text-sm text-muted-foreground border border-dashed rounded-md">
          {t("receivablesAging.widget.selectCompany")}
        </Div>
      )}
    </Div>
  );
}
