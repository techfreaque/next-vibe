"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
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
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import { evidenceCurrencies } from "@/finance/supplier-evidence/rules";

import type definitions from "./definition";

export function ReviewList({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.GET>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const companyId = form?.watch("companyId");
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const showActions = interactive && !responseOnly;
  const { push } = useWidgetNavigation();

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      {showActions && (
        <EntityPickerFieldWidget
          field={children.companyId}
          fieldName="companyId"
        />
      )}
      <FormAlertWidget field={{}} />
      {data?.reviews.length === 0 && (
        <EmptyBlock title={t(companyId ? "empty" : "selectCompany")} />
      )}
      {data?.reviews.map((row) => (
        <SectionGroup
          key={row.id}
          title={row.reference || row.vendor}
          subtitle={row.reference ? row.vendor : undefined}
        >
          <Div className="flex flex-col gap-3">
            <Div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={row.status === "posted" ? "secondary" : "outline"}
              >
                {t(row.status)}
              </Badge>
              {row.documentDate && (
                <P className="text-sm text-muted-foreground">
                  {formatDocDate(row.documentDate, locale)}
                </P>
              )}
              {row.currency && row.grossAmount && (
                <P className="font-medium tabular-nums">
                  {formatMoney(Number(row.grossAmount), row.currency, locale)}
                </P>
              )}
            </Div>
            {row.taxPending && <P className="text-sm">{t("taxPending")}</P>}
            {row.issue && (
              <P className="text-sm text-muted-foreground">{t(row.issue)}</P>
            )}
            {row.aiReviewRequested && row.status === "review" && (
              <P className="text-sm text-muted-foreground">
                {t("aiReviewRequested")}
              </P>
            )}
            {showActions && (
              <Div className="flex flex-wrap gap-2">
                {Array.from({ length: row.fileCount })
                  .keys()
                  .toArray()
                  .map((index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void import("./attachment/definition").then(
                          ({ default: evidence }) =>
                            push(evidence.GET, {
                              data: { reviewId: row.id, index },
                            }),
                        );
                      }}
                    >{`${t("file")} ${index + 1}`}</Button>
                  ))}
                {row.taxPending && (
                  <Button
                    type="button"
                    onClick={() => {
                      void import("./definition").then(({ default: mailbox }) =>
                        push(mailbox.POST, {
                          data: {
                            reviewId: row.id,
                            confirmTax: true,
                            reference: row.reference ?? undefined,
                            date: row.documentDate ?? undefined,
                            currency: evidenceCurrencies.safeParse(row.currency)
                              .data,
                            grossAmount: row.grossAmount ?? undefined,
                          },
                        }),
                      );
                    }}
                  >
                    {t("confirmTax")}
                  </Button>
                )}
                {row.billId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const billId = row.billId;
                      if (!billId) {
                        return;
                      }
                      void import("@/payment/bill/[billId]/get/definition").then(
                        ({ default: bill }) =>
                          push(bill.GET, { urlPathParams: { billId } }),
                      );
                    }}
                  >
                    {t("openBill")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      void import("./definition").then(({ default: mailbox }) =>
                        push(mailbox.POST, {
                          data: {
                            reviewId: row.id,
                            manual: row.status === "review",
                            reference: row.reference ?? undefined,
                            date: row.documentDate ?? undefined,
                            currency: evidenceCurrencies.safeParse(row.currency)
                              .data,
                            grossAmount: row.grossAmount ?? undefined,
                            taxAmount: row.taxAmount ?? undefined,
                          },
                        }),
                      );
                    }}
                  >
                    {t("approveTitle")}
                  </Button>
                )}
              </Div>
            )}
          </Div>
        </SectionGroup>
      ))}
    </WidgetShell>
  );
}

export function ReviewApproval({
  field: { children },
}: {
  field: typeof definitions.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  const data = useWidgetValue<typeof definitions.POST>();
  const form = useWidgetForm<typeof definitions.POST>();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const { push, pop, canGoBack } = useWidgetNavigation();
  const manual = form?.watch("manual");
  const confirmTax = form?.watch("confirmTax");
  const locale = useWidgetLocale();
  const reference = form?.watch("reference");
  const date = form?.watch("date");
  const currency = form?.watch("currency");
  const gross = form?.watch("grossAmount");
  const reviewId = form?.watch("reviewId");

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t(confirmTax ? "confirmTax" : "approveTitle")}
        backButton={
          canGoBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              {t("back")}
            </Button>
          )
        }
      />
      <FormAlertWidget field={{}} />
      {interactive && !responseOnly && !data?.billId && (
        <Div className="flex flex-col gap-4">
          {!form?.watch("reviewId") && (
            <TextFieldWidget field={children.reviewId} fieldName="reviewId" />
          )}
          {confirmTax && (
            <SectionGroup
              title={t("taxPending")}
              subtitle={t("confirmTaxHint")}
            >
              <Div className="flex flex-col gap-3">
                {reference && (
                  <P className="text-sm font-medium">{reference}</P>
                )}
                {currency && gross && (
                  <P className="text-sm">
                    {t("gross")} {formatMoney(Number(gross), currency, locale)}
                  </P>
                )}
                {date && (
                  <P className="text-sm">{formatDocDate(date, locale)}</P>
                )}
                {reviewId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="self-start"
                    onClick={() => {
                      void import("./attachment/definition").then(
                        ({ default: evidence }) =>
                          push(evidence.GET, { data: { reviewId, index: 0 } }),
                      );
                    }}
                  >
                    {t("evidence")}
                  </Button>
                )}
                <TextFieldWidget
                  field={children.taxAmount}
                  fieldName="taxAmount"
                />
              </Div>
            </SectionGroup>
          )}
          {manual && !confirmTax && (
            <SectionGroup title={t("evidence")} subtitle={t("manual")}>
              <Div className="grid gap-3 @lg:grid-cols-2">
                <TextFieldWidget
                  field={children.reference}
                  fieldName="reference"
                />
                <TextFieldWidget field={children.date} fieldName="date" />
                <TextFieldWidget
                  field={children.currency}
                  fieldName="currency"
                />
                <TextFieldWidget
                  field={children.grossAmount}
                  fieldName="grossAmount"
                />
                <TextFieldWidget
                  field={children.taxAmount}
                  fieldName="taxAmount"
                />
              </Div>
            </SectionGroup>
          )}
          <SubmitButtonWidget<typeof definitions.POST>
            field={{
              text: confirmTax ? "confirmTax" : "approve",
              className: "self-end min-h-11",
            }}
          />
        </Div>
      )}
      {data?.billId && (
        <SectionGroup title={t("posted")}>
          {interactive && !responseOnly && (
            <Button
              type="button"
              onClick={() => {
                const billId = data.billId;
                void import("@/payment/bill/[billId]/get/definition").then(
                  ({ default: bill }) =>
                    push(bill.GET, { urlPathParams: { billId } }),
                );
              }}
            >
              {t("openBill")}
            </Button>
          )}
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
