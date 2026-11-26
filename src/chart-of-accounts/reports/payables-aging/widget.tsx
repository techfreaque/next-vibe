"use client";

import {
  type CountryLanguage,
  CurrenciesArr,
} from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import { DatePicker } from "next-vibe/ui/components/date-picker";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronDownIcon } from "next-vibe/ui/components/icons/ChevronDownIcon";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Label } from "next-vibe/ui/components/label";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
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
import { parseFormDate } from "next-vibe/unified-ui/widgets/form-fields/_shared/date-value";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useState } from "react";

import { useWorkspaceCompany } from "@/companies/_shared/workspace-company-context";
import { DocumentScopePicker } from "@/finance/document-list-ui";

import type definition from "./definition";
import type { PayablesAgingResponse } from "./definition";
import type { PayablesTranslation } from "./i18n";
import { agingBuckets } from "./model";

type Section = PayablesAgingResponse["approved"];
type Supplier = Section["suppliers"][number];

function PayablesSection({
  kind,
  section,
  t,
  currency,
  locale,
  canOpen,
  onOpen,
}: {
  kind: "approved" | "received" | "disputed";
  section: Section;
  t: PayablesTranslation;
  currency: string;
  locale: CountryLanguage;
  canOpen: boolean;
  onOpen: (id: string) => void;
}): JSX.Element {
  const [selectedKey, setSelectedKey] = useState<string>();
  const selected = section.suppliers.find(
    (supplier) => supplier.key === selectedKey,
  );
  const money = (cents: number): string =>
    formatMoney(cents / 100, currency, locale);
  const supplierName = (supplier: Supplier): string =>
    supplier.supplier || t("widget.unknownSupplier");
  const pick = (key: string): void =>
    setSelectedKey((current) => (current === key ? undefined : key));
  const amount = (cents: number, bold = false): JSX.Element => (
    <Span
      className={[
        "tabular-nums",
        cents === 0 ? "text-muted-foreground" : "text-foreground",
        bold ? "font-semibold" : "",
      ].join(" ")}
    >
      {money(cents)}
    </Span>
  );
  const bucketCells = (
    totals: Section["totals"],
    bold = false,
  ): Record<string, JSX.Element> =>
    Object.fromEntries(
      agingBuckets.map((key) => [key, amount(totals[key], bold)]),
    );

  const heading = t(`${kind}.title`);
  const totalLabel = (
    <Span className="font-semibold">{t("columns.total")}</Span>
  );
  return (
    <SectionGroup title={heading} subtitle={money(section.totals.total)}>
      {section.suppliers.length === 0 ? (
        <EmptyBlock
          title={t(`${kind}.empty`)}
          message={t(`${kind}.emptyDescription`)}
        />
      ) : (
        <Div className="flex min-w-0 flex-col gap-4">
          <RecordTable
            label={heading}
            columns={[
              { id: "supplier", label: t("columns.supplier") },
              ...agingBuckets.map((key) => ({
                id: key,
                label: t(`columns.${key}`),
                numeric: true,
              })),
              { id: "total", label: t("columns.total"), numeric: true },
            ]}
            rows={section.suppliers.map((supplier) => {
              const label = (
                <Div className="flex min-w-32 flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-expanded={selectedKey === supplier.key}
                    className="-ml-2 h-auto min-h-9 justify-start whitespace-normal px-2 text-start font-medium"
                    onClick={() => pick(supplier.key)}
                  >
                    {kind === "disputed" && (
                      <Span
                        className="size-2 shrink-0 rounded-full bg-destructive"
                        aria-hidden="true"
                      />
                    )}
                    {supplierName(supplier)}
                    <ChevronDownIcon
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Button>
                  {supplier.supplierVat && (
                    <Span className="text-xs text-muted-foreground">
                      {supplier.supplierVat}
                    </Span>
                  )}
                </Div>
              );
              return {
                id: supplier.key,
                cells: {
                  supplier: label,
                  ...bucketCells(supplier.totals),
                  total: amount(supplier.totals.total, true),
                },
              };
            })}
            footer={{
              supplier: totalLabel,
              ...bucketCells(section.totals, true),
              total: amount(section.totals.total, true),
            }}
            compact={
              <Div className="flex flex-col gap-2">
                {section.suppliers.map((supplier) => (
                  <ListItem
                    key={supplier.key}
                    avatar={
                      kind === "disputed" ? (
                        <Span
                          className="size-2 shrink-0 rounded-full bg-destructive"
                          aria-hidden="true"
                        />
                      ) : undefined
                    }
                    title={supplierName(supplier)}
                    subtitle={supplier.supplierVat ?? undefined}
                    meta={
                      <Div className="flex min-w-0 flex-col gap-1">
                        {amount(supplier.totals.total, true)}
                        {agingBuckets
                          .filter((key) => supplier.totals[key] !== 0)
                          .map((key) => (
                            <Div
                              key={key}
                              className="flex flex-wrap items-baseline gap-x-2"
                            >
                              <Span>{t(`columns.${key}`)}</Span>
                              {amount(supplier.totals[key])}
                            </Div>
                          ))}
                        <Span className="text-primary">
                          {t("widget.showBills")}
                        </Span>
                      </Div>
                    }
                    selected={selectedKey === supplier.key}
                    actions={
                      <ChevronDownIcon
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                    onClick={() => pick(supplier.key)}
                  />
                ))}
                <Div className="flex items-center justify-between gap-2 border-t px-1 py-2 font-semibold">
                  <Span>{t("columns.total")}</Span>
                  {amount(section.totals.total, true)}
                </Div>
              </Div>
            }
          />
          {selected && (
            <SectionGroup
              title={t("widget.details", { supplier: supplierName(selected) })}
            >
              <Div className="flex min-w-0 flex-col gap-3">
                <DetailGrid columns={3} className="@lg:hidden">
                  {agingBuckets.map((key) => (
                    <DetailField
                      key={key}
                      label={t(`columns.${key}`)}
                      value={money(selected.totals[key])}
                    />
                  ))}
                </DetailGrid>
                {selected.bills.map((bill) => (
                  <ListItem
                    key={bill.id}
                    title={
                      bill.billNumber ||
                      t("widget.datedBill", {
                        date: formatDocDate(bill.billDate, locale),
                      })
                    }
                    subtitle={
                      bill.dueDate
                        ? t("widget.due", {
                            date: formatDocDate(bill.dueDate, locale),
                          })
                        : t("columns.undated")
                    }
                    meta={
                      <Span className="font-medium tabular-nums text-foreground">
                        {money(bill.amountCents)}
                      </Span>
                    }
                    onClick={canOpen ? () => onOpen(bill.id) : undefined}
                  />
                ))}
              </Div>
            </SectionGroup>
          )}
        </Div>
      )}
    </SectionGroup>
  );
}

export function PayablesAgingWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const response = useWidgetResponse();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.GET>();
  const workspace = useWorkspaceCompany();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showInputs = interactive && !responseOnly;
  const companyId = form.watch("companyId");
  const reportCompanyId = companyId || data?.reportCompanyId || undefined;
  const isActiveCompany = Boolean(
    reportCompanyId && workspace?.active?.id === reportCompanyId,
  );
  const currency = form.watch("currency");
  const agingDate = form.watch("agingDate");
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const visibleDate = agingDate ?? data?.reportDate ?? today;
  const reportCurrency = data?.reportCurrency;
  const ready =
    data &&
    reportCurrency &&
    (!showInputs ||
      ((!companyId || data.reportCompanyId === companyId) &&
        (!currency || currency === reportCurrency) &&
        (!agingDate || agingDate === data.reportDate)));
  const openBill = (id: string): void => {
    void import("@/payment/bill/[billId]/get/definition").then(
      ({ default: bill }) => push(bill.GET, { urlPathParams: { billId: id } }),
    );
  };

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => pop()}
              aria-label={t("widget.back")}
            >
              <ChevronLeft className="size-4" />
            </Button>
          )
        }
      />
      {showInputs && (
        <Div className="flex flex-wrap items-end gap-3">
          {!isActiveCompany && (
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
          )}
          <Div className="flex min-w-36 flex-col gap-1.5">
            <Label htmlFor="payables-currency">{t("currency.label")}</Label>
            <Select<string>
              value={currency ?? "default"}
              onValueChange={(value) =>
                form.setValue(
                  "currency",
                  CurrenciesArr.find((code) => code === value),
                  { shouldDirty: true },
                )
              }
            >
              <SelectTrigger id="payables-currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{t("currency.default")}</SelectItem>
                {CurrenciesArr.map((code) => (
                  <SelectItem key={code} value={code}>
                    {t(`currency.codes.${code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Div>
          <Div className="flex w-44 flex-col gap-1.5">
            <Label htmlFor="payables-date">{t("agingDate.label")}</Label>
            <DatePicker
              name="payables-date"
              value={parseFormDate(visibleDate)}
              onChange={(date) => {
                const day = date
                  ? [
                      String(date.getFullYear()).padStart(4, "0"),
                      String(date.getMonth() + 1).padStart(2, "0"),
                      String(date.getDate()).padStart(2, "0"),
                    ].join("-")
                  : undefined;
                form.setValue("agingDate", day, { shouldDirty: true });
              }}
            />
          </Div>
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {response?.success === false ? null : ready ? (
        <>
          <P className="text-sm text-muted-foreground">
            {t("widget.asOf", { date: formatDocDate(data.reportDate, locale) })}
          </P>
          <PayablesSection
            kind="approved"
            section={data.approved}
            t={t}
            currency={reportCurrency}
            locale={locale}
            canOpen={showInputs}
            onOpen={openBill}
          />
          <PayablesSection
            kind="received"
            section={data.received}
            t={t}
            currency={reportCurrency}
            locale={locale}
            canOpen={showInputs}
            onOpen={openBill}
          />
          {data.disputed.suppliers.length > 0 && (
            <PayablesSection
              kind="disputed"
              section={data.disputed}
              t={t}
              currency={reportCurrency}
              locale={locale}
              canOpen={showInputs}
              onOpen={openBill}
            />
          )}
        </>
      ) : data && !reportCompanyId ? (
        <EmptyBlock title={t("company.choose")} message={t("company.empty")} />
      ) : (
        <LoadingBlock message={t("widget.loading")} />
      )}
    </WidgetShell>
  );
}
