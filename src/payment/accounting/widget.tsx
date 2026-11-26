"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import definition from "./definition";

export function AccountingListWidget({
  field: { children },
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const companyId = form.watch("companyId");
  const openMapping = (): void => {
    void (async (): Promise<void> => {
      const { default: mapping } = await import("./mapping/definition");
      push(mapping.POST, { data: { companyId } });
    })();
  };
  const openRecognition = (evidenceId: string): void => {
    void (async (): Promise<void> => {
      const { default: recognition } = await import("./recognition/definition");
      push(recognition.POST, { data: { companyId, evidenceId, dryRun: true } });
    })();
  };
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("intro")}
        actions={
          interactive && !responseOnly ? (
            <Button type="button" variant="outline" onClick={openMapping}>
              {t("configure")}
            </Button>
          ) : undefined
        }
      />
      {interactive && !responseOnly && (
        <Div className="flex flex-wrap items-end gap-3">
          <EntityPickerFieldWidget
            fieldName="companyId"
            field={children.companyId}
          />
          <SubmitButtonWidget field={{ text: "submit" }} />
        </Div>
      )}
      <FormAlertWidget field={{}} />
      {data && (
        <>
          <SectionGroup title={t("merchant")}>
            <DetailGrid columns={3}>
              {data.stripeTestMerchant && (
                <DetailField
                  label={t("stripeTest")}
                  value={data.stripeTestMerchant}
                />
              )}
              {data.stripeLiveMerchant && (
                <DetailField
                  label={t("stripeLive")}
                  value={data.stripeLiveMerchant}
                />
              )}
              {data.nowMerchant && (
                <DetailField
                  label={t("nowMerchant")}
                  value={data.nowMerchant}
                />
              )}
            </DetailGrid>
          </SectionGroup>
          <SectionGroup title={t("sources")}>
            {data.rows.length === 0 ? (
              <EmptyBlock title={t("empty")} />
            ) : (
              data.rows.map((row) => (
                <Div
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b py-3 last:border-b-0"
                >
                  <Div className="flex min-w-0 flex-col gap-1">
                    <Span className="font-medium break-all">
                      {row.externalId}
                    </Span>
                    <Span className="text-xs text-muted-foreground">
                      {t(
                        row.sourceKind === "sale"
                          ? "saleType"
                          : row.sourceKind === "fee"
                            ? "feeType"
                            : "refundType",
                      )}
                    </Span>
                  </Div>
                  {(() => {
                    const amount =
                      row.sourceKind === "fee" ? row.feeMinor : row.grossMinor;
                    return amount === null ? null : (
                      <Span className="tabular-nums">
                        {formatMoney(amount / 100, row.currency, locale)}
                      </Span>
                    );
                  })()}
                  {interactive &&
                    !responseOnly &&
                    row.sourceKind === "sale" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openRecognition(row.id)}
                      >
                        {t("recognitionTitle")}
                      </Button>
                    )}
                  {interactive && !responseOnly && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        push(definition.POST, {
                          data: {
                            companyId,
                            evidenceIds: row.id,
                            dryRun: true,
                          },
                        })
                      }
                    >
                      {t("review")}
                    </Button>
                  )}
                </Div>
              ))
            )}
          </SectionGroup>
        </>
      )}
    </WidgetShell>
  );
}

export function AccountingReconcileWidget({
  field: { children },
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const companyId = form.watch("companyId");
  const { push } = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const openFeeEntry = (externalReference: string): void => {
    void (async (): Promise<void> => {
      const { default: supplierEvidence } =
        await import("@/finance/supplier-evidence/definition");
      push(supplierEvidence.POST, {
        data: {
          companyId,
          externalReference,
          operation: "processorFee",
          dryRun: true,
        },
      });
    })();
  };
  const openFeeBill = (billId: string): void => {
    void (async (): Promise<void> => {
      const { default: bill } =
        await import("@/payment/bill/[billId]/get/definition");
      push(bill.GET, { urlPathParams: { billId } });
    })();
  };
  const openInvoice = (invoiceId: string): void => {
    void (async (): Promise<void> => {
      const { default: invoice } =
        await import("@/payment/invoice/[invoiceId]/get/definition");
      push(invoice.GET, { urlPathParams: { invoiceId } });
    })();
  };
  const openJournal = (entryId: string): void => {
    void (async (): Promise<void> => {
      const { default: journal } =
        await import("@/chart-of-accounts/journal/[entryId]/get/definition");
      push(journal.GET, { urlPathParams: { entryId } });
    })();
  };
  return (
    <WidgetShell layout="page">
      <WidgetHeader size="page" title={t("review")} subtitle={t("intro")} />
      <Div className="grid grid-cols-1 gap-3 @lg:grid-cols-2">
        <EntityPickerFieldWidget
          fieldName="companyId"
          field={children.companyId}
        />
        <TextFieldWidget fieldName="evidenceIds" field={children.evidenceIds} />
      </Div>
      <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget field={{ text: "submit", className: "self-end" }} />
      {data && (
        <SectionGroup title={t("sources")}>
          {data.results.map((row) => (
            <Div
              key={row.id}
              className="flex flex-col gap-2 border-b py-3 last:border-b-0"
            >
              <Span className="font-medium">{t(row.status)}</Span>
              {interactive &&
                !responseOnly &&
                row.status === "feeNeedsBill" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openFeeEntry(row.id)}
                  >
                    {t("openFeeEntry")}
                  </Button>
                )}
              {interactive && !responseOnly && row.billId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (row.billId) {
                      openFeeBill(row.billId);
                    }
                  }}
                >
                  {t("openFeeBill")}
                </Button>
              )}
              {interactive && !responseOnly && row.invoiceId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (row.invoiceId) {
                      openInvoice(row.invoiceId);
                    }
                  }}
                >
                  {t("openInvoice")}
                </Button>
              )}
              {interactive && !responseOnly && row.journalEntryId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (row.journalEntryId) {
                      openJournal(row.journalEntryId);
                    }
                  }}
                >
                  {t("openJournal")}
                </Button>
              )}
              {row.creditsConsumed !== undefined &&
                row.creditsGranted !== undefined && (
                  <DetailGrid columns={2}>
                    <DetailField
                      label={t("creditsGranted")}
                      value={new Intl.NumberFormat(locale).format(
                        row.creditsGranted,
                      )}
                    />
                    <DetailField
                      label={t("creditsConsumed")}
                      value={new Intl.NumberFormat(locale).format(
                        row.creditsConsumed,
                      )}
                    />
                  </DetailGrid>
                )}
              {row.currency &&
                row.recognizedMinor !== undefined &&
                row.remainingLiabilityMinor !== undefined && (
                  <DetailGrid columns={2}>
                    <DetailField
                      label={t("recognizedRevenue")}
                      value={formatMoney(
                        row.recognizedMinor / 100,
                        row.currency,
                        locale,
                      )}
                    />
                    <DetailField
                      label={t("remainingLiability")}
                      value={formatMoney(
                        row.remainingLiabilityMinor / 100,
                        row.currency,
                        locale,
                      )}
                    />
                  </DetailGrid>
                )}
              {row.status === "ready" && row.currency && (
                <DetailGrid columns={3}>
                  {row.grossMinor !== undefined && (
                    <DetailField
                      label={t("gross")}
                      value={formatMoney(
                        row.grossMinor / 100,
                        row.currency,
                        locale,
                      )}
                    />
                  )}
                  {row.taxMinor !== undefined && (
                    <DetailField
                      label={t("tax")}
                      value={formatMoney(
                        row.taxMinor / 100,
                        row.currency,
                        locale,
                      )}
                    />
                  )}
                  {typeof row.feeMinor === "number" && (
                    <DetailField
                      label={t("fee")}
                      value={formatMoney(
                        row.feeMinor / 100,
                        row.currency,
                        locale,
                      )}
                    />
                  )}
                </DetailGrid>
              )}
              {(!interactive || responseOnly) &&
                (row.invoiceId || row.journalEntryId) && (
                  <DetailField
                    label={t("receipt")}
                    value={[row.invoiceId, row.journalEntryId]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                )}
            </Div>
          ))}
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
