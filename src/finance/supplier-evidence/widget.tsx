"use client";

import type { WidgetData } from "next-vibe/core/utils/json";
import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Details } from "next-vibe/ui/components/details";
import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Summary } from "next-vibe/ui/components/summary";
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
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { scopedTranslation as chartTranslation } from "@/chart-of-accounts/i18n";
import bankBillDefinition from "@/payment/bill/[billId]/get/definition";
import { scopedTranslation as paymentTranslation } from "@/payment/i18n";

import { formatObservedProviderBalance } from "../credit-liabilities/format-observed-balance";
import { ReportMonthControl } from "../report-period-control";
import type definition from "./definition";
import { evidenceCurrencies } from "./rules";

const sponsorshipHandoffSchema = z.object({
  operation: z.literal("sponsorship"),
  externalReference: z.uuid(),
  description: z.string().min(1),
  grossAmount: z.coerce.number().positive(),
  currency: evidenceCurrencies,
});

export function SupplierEvidenceListWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tChart } = chartTranslation.scopedT(locale);
  const { t: tPayment } = paymentTranslation.scopedT(locale);
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const companyId = form.watch("companyId");
  const { push } = useWidgetNavigation();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        title={t("suppliers.title")}
        subtitle={data?.companyName ?? t("suppliers.description")}
        size="page"
        actions={
          interactive &&
          companyId && (
            <Button
              type="button"
              onClick={() => {
                void import("./definition").then(({ default: routes }) => {
                  return push(routes.POST, { data: { companyId } });
                });
              }}
            >
              {t("suppliers.record")}
            </Button>
          )
        }
      />
      {interactive && (
        <Div className="flex flex-wrap items-end gap-3">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={field.children.companyId}
          />
          <ReportMonthControl
            month={form.watch("month") ?? data?.monthly?.month}
            label={t("suppliers.month")}
            onChange={(month) => {
              form.setValue("month", month, { shouldDirty: true });
              onSubmit?.();
            }}
          />
          <SubmitButtonWidget<typeof definition.GET>
            field={{ text: "suppliers.run", loadingText: "suppliers.run" }}
          />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <SectionGroup title={t("suppliers.balances")}>
            <P className="text-sm text-muted-foreground">
              {t("suppliers.banked")}
            </P>
            {data.bindings.length === 0 && <P>{t("suppliers.noBindings")}</P>}
            {data.bindings.map((row) => (
              <Div
                key={row.provider}
                className="flex flex-col gap-1 border-t py-3 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4"
              >
                <Div>
                  <P className="font-medium">{t(row.provider)}</P>
                  <P className="text-sm text-muted-foreground">
                    {row.vendorName}
                  </P>
                </Div>
                <Div>
                  <P className="text-sm text-muted-foreground">
                    {t("suppliers.observed")}
                  </P>
                  <P>
                    {formatObservedProviderBalance(row, locale) ??
                      t("suppliers.unavailable")}
                  </P>
                  {row.capturedAt && (
                    <P className="text-sm text-muted-foreground">
                      {formatDocDate(row.capturedAt, locale)}
                    </P>
                  )}
                </Div>
                <Div>
                  <P className="text-sm text-muted-foreground">
                    {t("suppliers.ledgerPrepaid")}
                  </P>
                  <P>
                    {row.ledgerPrepaid === null
                      ? t("suppliers.unavailable")
                      : formatMoney(
                          row.ledgerPrepaid,
                          data.monthly.currency,
                          locale,
                        )}
                  </P>
                </Div>
                <Div>
                  <P className="text-sm text-muted-foreground">
                    {row.spendEvidence
                      ? t(`suppliers.spendBasis.${row.spendEvidence}`)
                      : t("suppliers.interval")}
                  </P>
                  <P>
                    {row.intervalSpendUsd === null
                      ? t("suppliers.unavailable")
                      : formatMoney(row.intervalSpendUsd, "USD", locale)}
                  </P>
                </Div>
              </Div>
            ))}
          </SectionGroup>
          {data.monthly.providerReview.length > 0 && (
            <SectionGroup title={t("suppliers.monthlyReview")}>
              <P className="text-sm text-muted-foreground">
                {t("suppliers.monthlyReviewHint")}
              </P>
              {data.monthly.providerReview.map((row) => (
                <Div
                  key={row.provider}
                  className="flex flex-col gap-2 border-t py-3"
                >
                  <P className="font-medium">{t(row.provider)}</P>
                  <Div className="flex flex-wrap gap-x-4 gap-y-2">
                    <P className="text-sm">
                      {t("suppliers.counterTotal", {
                        amount:
                          row.counterUsd === null
                            ? t("suppliers.unavailable")
                            : formatMoney(row.counterUsd, "USD", locale),
                      })}
                    </P>
                    <P className="text-sm">
                      {t("suppliers.estimatedTotal", {
                        amount:
                          row.estimatedUsd === null
                            ? t("suppliers.unavailable")
                            : formatMoney(row.estimatedUsd, "USD", locale),
                      })}
                    </P>
                    <P className="text-sm">
                      {t("suppliers.unclassifiedTotal", {
                        amount:
                          row.unclassifiedUsd === null
                            ? t("suppliers.unavailable")
                            : formatMoney(row.unclassifiedUsd, "USD", locale),
                      })}
                    </P>
                  </Div>
                  <P className="text-sm text-muted-foreground">
                    {t("suppliers.readingCoverage", {
                      readings: row.readings,
                      missing: row.missingReadings,
                    })}
                  </P>
                  {row.receipts.map(
                    ({ currency, savedGross, count, postedCount }) => (
                      <P key={currency} className="text-sm">
                        {t("suppliers.receiptTotal", {
                          amount: formatMoney(savedGross, currency, locale),
                          count,
                          posted: postedCount,
                        })}
                      </P>
                    ),
                  )}
                  {row.receipts.length === 0 && (
                    <P className="text-sm text-muted-foreground">
                      {t("suppliers.noReceipts")}
                    </P>
                  )}
                </Div>
              ))}
            </SectionGroup>
          )}
          <SectionGroup title={t("suppliers.monthly")}>
            <P className="text-sm text-muted-foreground">
              {new Intl.DateTimeFormat(locale, {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${data.monthly.month}-01T00:00:00Z`))}
            </P>
            {data.monthly.expenses.length === 0 && (
              <P>{t("suppliers.noMonthly")}</P>
            )}
            {data.monthly.expenses.map(({ area, expense }) => (
              <Div
                key={area}
                className="flex flex-wrap justify-between gap-2 border-t py-2"
              >
                <P>{t(`suppliers.area.${area}`)}</P>
                <P className="tabular-nums">
                  {formatMoney(expense, data.monthly.currency, locale)}
                </P>
              </Div>
            ))}
          </SectionGroup>
          {data.monthly.modelEstimates.length > 0 && (
            <SectionGroup title={t("suppliers.estimates")}>
              <P className="text-sm text-muted-foreground">
                {t("suppliers.estimatesHint")}
              </P>
              {data.monthly.modelEstimates.map(
                ({ provider, modelId, estimatedUsd }) => (
                  <Div
                    key={JSON.stringify([provider, modelId])}
                    className="flex flex-wrap justify-between gap-2 border-t py-2"
                  >
                    <Div>
                      <P className="break-words">
                        {modelId ?? t("suppliers.unavailable")}
                      </P>
                      <P className="text-sm text-muted-foreground">
                        {provider}
                      </P>
                    </Div>
                    <P className="tabular-nums">
                      {formatMoney(estimatedUsd, "USD", locale)}
                    </P>
                  </Div>
                ),
              )}
            </SectionGroup>
          )}
          <SectionGroup title={t("suppliers.recent")}>
            {data.records.length === 0 && <P>{t("suppliers.noEvidence")}</P>}
            {data.records.map((row) => (
              <Div
                key={row.id}
                className="flex flex-col gap-2 border-t py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
              >
                <Div className="min-w-0">
                  <P className="font-medium break-words">{row.description}</P>
                  <P className="text-sm text-muted-foreground break-words">
                    {row.vendorName}
                  </P>
                  <P className="text-sm text-muted-foreground break-words">
                    {row.externalReference}
                  </P>
                </Div>
                <Div>
                  <P className="text-sm text-muted-foreground">
                    {t(`suppliers.kind.${row.kind}`)}
                  </P>
                  <P className="text-sm text-muted-foreground">
                    {formatDocDate(row.date, locale)}
                  </P>
                  <P className="font-medium tabular-nums">
                    {formatMoney(row.grossAmount, row.currency, locale)}
                  </P>
                </Div>
                <Div className="flex flex-wrap gap-2">
                  {row.billStatus && (
                    <Badge variant="outline">{tPayment(row.billStatus)}</Badge>
                  )}
                  {row.journalStatus && (
                    <Badge variant="secondary">
                      {tChart(row.journalStatus)}
                    </Badge>
                  )}
                </Div>
                {(row.billId || row.journalEntryId) && (
                  <EvidenceLinks
                    billId={row.billId}
                    journalEntryId={row.journalEntryId}
                  />
                )}
              </Div>
            ))}
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}

function EvidenceLinks({
  billId,
  journalEntryId,
}: {
  billId: string | null;
  journalEntryId: string | null;
}): JSX.Element | null {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { push } = useWidgetNavigation();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  if (!interactive) {
    return null;
  }
  return (
    <Div className="flex flex-wrap gap-2">
      {billId && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void import("@/payment/bill/[billId]/get/definition").then(
              ({ default: routes }) => {
                return push(routes.GET, { urlPathParams: { billId } });
              },
            );
          }}
        >
          {t("suppliers.openBill")}
        </Button>
      )}
      {journalEntryId && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void import("@/chart-of-accounts/journal/[entryId]/get/definition").then(
              ({ default: routes }) => {
                return push(routes.GET, {
                  urlPathParams: { entryId: journalEntryId },
                });
              },
            );
          }}
        >
          {t("suppliers.openJournal")}
        </Button>
      )}
    </Div>
  );
}

export function SupplierEvidenceRecordWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { push, current } = useWidgetNavigation();
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const isInteractive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const interactive = isInteractive && !responseOnly;
  const companyId = form.watch("companyId");
  const operation = form.watch("operation") ?? "bill";
  const externalReference = form.watch("externalReference");
  const handoff = useMemo(
    () => sponsorshipHandoffSchema.safeParse(current?.params.data).data,
    [current?.params.data],
  );
  const showSponsorshipSource = operation === "sponsorship" && !!handoff;
  const bankDraftBillId = form.watch("bankDraftBillId");
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const selectedBillOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { billId: bankDraftBillId ?? "" },
        queryOptions: {
          enabled: interactive && Boolean(bankDraftBillId && companyId),
        },
      },
    }),
    [interactive, bankDraftBillId, companyId],
  );
  const selectedBillQuery = useEndpoint(
    bankBillDefinition,
    selectedBillOptions,
    logger,
    user,
  ).read;
  const detail = selectedBillQuery?.data;
  const selectedBill =
    detail?.id === bankDraftBillId &&
    detail?.companyId === companyId &&
    detail?.bankBookedDate
      ? detail
      : undefined;
  const result = data?.result;
  const manual =
    operation !== "bind" &&
    operation !== "sponsorship" &&
    operation !== "processorFee";
  const hasBillDocument =
    operation === "bill" ||
    operation === "fundBill" ||
    operation === "sponsorship" ||
    operation === "processorFee" ||
    operation === "referral";
  const [labels, setLabels] = useState<
    Partial<Record<"vendorId" | "debitAccountId" | "creditAccountId", string>>
  >({});

  useEffect(() => {
    if (interactive && form.getValues("dryRun") === undefined) {
      form.setValue("dryRun", true);
    }
  }, [form, interactive]);

  useEffect(() => {
    if (operation !== "sponsorship" && handoff) {
      form.setValue("description", undefined);
      form.setValue("grossAmount", undefined);
      form.setValue("currency", undefined);
    }
  }, [form, handoff, operation]);

  const pick = (
    name: "vendorId" | "debitAccountId" | "creditAccountId",
  ): void => {
    if (!companyId) {
      return;
    }
    const pickerCallback = (selection: WidgetData): void => {
      const row = z
        .object({ id: z.uuid(), name: z.string() })
        .safeParse(selection);
      if (row.success) {
        form.setValue(name, row.data.id, { shouldDirty: true });
        setLabels((previous) => ({ ...previous, [name]: row.data.name }));
      }
    };
    const options = {
      data: { companyId },
      renderInModal: true,
      pickerLabelField: "name",
      pickerCallback,
    };
    if (name === "vendorId") {
      void import("@/purchasing/vendor/list/definition").then(
        ({ default: routes }) => {
          return push(routes.GET, options);
        },
      );
    } else {
      void import("@/chart-of-accounts/account/list/definition").then(
        ({ default: routes }) => {
          return push(routes.GET, options);
        },
      );
    }
  };

  const canUseProvider =
    operation === "bind" ||
    operation === "fund" ||
    operation === "fundBill" ||
    operation === "consume";
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        title={t("suppliers.record")}
        subtitle={t("suppliers.recordDescription")}
        size="page"
      />
      {interactive && (
        <Div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={field.children.companyId}
          />
          <SelectFieldWidget
            fieldName="operation"
            field={field.children.operation}
          />
          {bankDraftBillId && (
            <Div className="rounded-md border bg-muted/40 px-3 py-2">
              <P className="text-sm font-medium">
                {t("suppliers.bankTransaction")}
              </P>
              {selectedBill?.bankBookedDate ? (
                <Div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
                  <P>{selectedBill.supplierName}</P>
                  <P className="text-muted-foreground">
                    {formatDocDate(selectedBill.bankBookedDate, locale)}
                  </P>
                  <P className="font-medium tabular-nums">
                    {formatMoney(
                      selectedBill.total,
                      selectedBill.currency,
                      locale,
                    )}
                  </P>
                </Div>
              ) : (
                <P className="text-sm text-muted-foreground">
                  {t(
                    selectedBillQuery?.isLoading
                      ? "suppliers.bankLoading"
                      : "suppliers.bankUnavailable",
                  )}
                </P>
              )}
            </Div>
          )}
          <Div className="flex flex-col items-start gap-2">
            <P className="text-sm font-medium">{t("suppliers.vendor")}</P>
            <Button
              type="button"
              variant="outline"
              disabled={!companyId}
              onClick={() => pick("vendorId")}
            >
              {labels.vendorId ?? t("suppliers.chooseSupplier")}
            </Button>
          </Div>
          {canUseProvider && (
            <SelectFieldWidget
              fieldName="provider"
              field={field.children.provider}
            />
          )}
          {showSponsorshipSource ? (
            <Div className="min-w-0 rounded-md border bg-muted/30 p-3">
              {externalReference === handoff.externalReference && (
                <Div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Div className="min-w-0">
                    <P className="text-xs text-muted-foreground">
                      {t("suppliers.sponsorshipSource")}
                    </P>
                    <P className="break-words text-sm font-medium">
                      {handoff.description}
                    </P>
                  </Div>
                  <P className="text-sm font-semibold tabular-nums">
                    {formatMoney(handoff.grossAmount, handoff.currency, locale)}
                  </P>
                </Div>
              )}
              <Details>
                <Summary className="cursor-pointer text-sm text-muted-foreground">
                  {t("suppliers.reference")}
                </Summary>
                <Div className="mt-2">
                  <TextFieldWidget
                    fieldName="externalReference"
                    field={field.children.externalReference}
                  />
                </Div>
              </Details>
            </Div>
          ) : (
            operation !== "bind" && (
              <TextFieldWidget
                fieldName="externalReference"
                field={field.children.externalReference}
              />
            )
          )}
          {(operation === "sponsorship" ||
            operation === "processorFee" ||
            operation === "referral" ||
            operation === "fund") && (
            <TextFieldWidget
              fieldName="invoiceReference"
              field={field.children.invoiceReference}
            />
          )}
          {(operation === "sponsorship" || operation === "processorFee") && (
            <TextFieldWidget fieldName="date" field={field.children.date} />
          )}
          {manual && (
            <>
              <P className="text-sm text-muted-foreground">
                {t(
                  operation === "referral"
                    ? "suppliers.referralHint"
                    : "suppliers.evidenceHint",
                )}
              </P>
              <TextFieldWidget fieldName="date" field={field.children.date} />
              <TextFieldWidget
                fieldName="grossAmount"
                field={field.children.grossAmount}
              />
              <TextFieldWidget
                fieldName="currency"
                field={field.children.currency}
              />
              <TextFieldWidget
                fieldName="description"
                field={field.children.description}
              />
            </>
          )}
          {hasBillDocument && (
            <Div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Div className="min-w-0 [&_button]:h-auto [&_button]:min-h-9 [&_button]:max-w-full [&_button]:whitespace-normal [&_button]:text-start">
                <EntityPickerFieldWidget
                  fieldName="bankDraftBillId"
                  field={field.children.bankDraftBillId}
                />
              </Div>
              {!bankDraftBillId && (
                <BooleanFieldWidget
                  fieldName="confirmSeparateBankBill"
                  field={field.children.confirmSeparateBankBill}
                />
              )}
              <TextFieldWidget
                fieldName="servicePeriodStart"
                field={field.children.servicePeriodStart}
              />
              <TextFieldWidget
                fieldName="servicePeriodEnd"
                field={field.children.servicePeriodEnd}
              />
            </Div>
          )}
          {hasBillDocument && (
            <>
              <TextFieldWidget
                fieldName="taxAmount"
                field={field.children.taxAmount}
              />
              <P className="text-sm text-muted-foreground">
                {t("suppliers.taxHint")}
              </P>
            </>
          )}
          {operation !== "bind" && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!companyId}
                onClick={() => pick("debitAccountId")}
              >
                {labels.debitAccountId ?? t("suppliers.debit")}
              </Button>
              {!hasBillDocument && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!companyId}
                  onClick={() => pick("creditAccountId")}
                >
                  {labels.creditAccountId ?? t("suppliers.credit")}
                </Button>
              )}
            </Div>
          )}
          <BooleanFieldWidget
            fieldName="dryRun"
            field={field.children.dryRun}
          />
          <FormAlertWidget field={{}} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: bankDraftBillId
                ? form.watch("dryRun") === false
                  ? "suppliers.linkToBankBill"
                  : "suppliers.previewBankLink"
                : form.watch("dryRun") === false
                  ? "suppliers.record"
                  : "suppliers.previewEvidence",
            }}
          />
        </Div>
      )}
      {result && (
        <SectionGroup title={t("suppliers.result")}>
          <P className="font-medium">
            {t(`suppliers.outcome.${result.outcome}`)}
          </P>
          {result.grossAmount && result.currency && (
            <P>{formatMoney(result.grossAmount, result.currency, locale)}</P>
          )}
          {result.date && <P>{formatDocDate(result.date, locale)}</P>}
          <EvidenceLinks
            billId={result.billId}
            journalEntryId={result.journalEntryId}
          />
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
