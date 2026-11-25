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
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  formatDocDate,
  formatMoney,
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
import { DateFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/date-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, useMemo, useState } from "react";
import { z } from "zod";

import {
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { scopedTranslation as accountingTranslation } from "@/chart-of-accounts/i18n";
import journalDefinition from "@/chart-of-accounts/journal/[entryId]/get/definition";
import { formatAccountingDateInput } from "@/chart-of-accounts/shared/calendar-date";
import { journalLineType } from "@/chart-of-accounts/shared/journal-validation";

import type definition from "./definition";

export function InvoiceReversePaymentWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const { t: accountingT } = accountingTranslation.scopedT(locale);
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const user = useWidgetUser();
  const navigation = useWidgetNavigation();
  const logger = useWidgetLogger();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();
  const disabled = useWidgetDisabled();
  const submitting = useWidgetIsSubmitting();
  const onSubmit = useWidgetOnSubmit();
  const showActions = interactive && !responseOnly;
  const invoiceId = form.watch("invoiceId");
  const entryId = form.watch("paymentEntryId");
  const [prefilledEntry] = useState(() => entryId);
  const reason = form.watch("reason")?.trim();
  const date = form.watch("reversalDate");
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const reversalDate =
    date === undefined ? today : formatAccountingDateInput(date);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { entryId },
        queryOptions: {
          enabled: showActions && z.uuid().safeParse(entryId).success,
        },
      },
    }),
    [entryId, showActions],
  );
  const loaded = useEndpoint(journalDefinition, options, logger, user).read
    ?.data?.result;
  const original = loaded?.id === entryId ? loaded : undefined;
  const originalStatus =
    original?.status === JournalEntryStatus.REVERSED ||
    original?.status === "REVERSED"
      ? JournalEntryStatus.REVERSED
      : original?.status === JournalEntryStatus.POSTED ||
          original?.status === "POSTED"
        ? JournalEntryStatus.POSTED
        : undefined;
  const originalReceipt =
    original?.sourceId === invoiceId &&
    (original?.sourceType === JournalSourceType.AR_PAYMENT ||
      original?.sourceType === "AR_PAYMENT");
  const originalDay = formatAccountingDateInput(original?.date);
  const validReversalDate = Boolean(
    reversalDate &&
    originalDay &&
    reversalDate >= originalDay &&
    reversalDate <= today,
  );
  const debitTotals = new Map<string, number>();
  for (const line of original?.lines ?? []) {
    if (journalLineType(line.lineType) === LineType.DEBIT) {
      debitTotals.set(
        line.currency,
        (debitTotals.get(line.currency) ?? 0) + line.amount,
      );
    }
  }
  const displayAmount = [...debitTotals]
    .map(([currency, amount]) => formatMoney(amount, currency, locale))
    .join(" · ");
  const canConfirm =
    onSubmit &&
    originalReceipt &&
    originalStatus === JournalEntryStatus.POSTED &&
    validReversalDate &&
    !!reason &&
    reason.length <= 500 &&
    !submitting &&
    !disabled;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("title")}
        subtitle={t("description")}
      />
      <FormAlertWidget field={{}} />
      {data?.reversalId ? (
        <ResultBanner
          variant="success"
          title={t("success.title")}
          message={t("success.description")}
        >
          <DetailGrid>
            <DetailField
              label={t("reversal")}
              value={data.reversalEntryNumber}
            />
          </DetailGrid>
          {showActions && (
            <Button
              type="button"
              size="sm"
              onClick={() =>
                navigation.push(journalDefinition.GET, {
                  urlPathParams: { entryId: data.reversalId },
                })
              }
            >
              {t("viewReversal")}
            </Button>
          )}
          {showActions && navigation.canGoBack && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => navigation.pop()}
            >
              {t("viewInvoice")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        showActions && (
          <Div className="flex flex-col gap-4">
            {!prefilledEntry && (
              <TextFieldWidget
                fieldName="paymentEntryId"
                field={children.paymentEntryId}
              />
            )}
            {original && (
              <DetailGrid columns={3}>
                <DetailField
                  label={t("entryId")}
                  value={original.entryNumber}
                />
                <DetailField
                  label={t("originalDate")}
                  value={formatDocDate(original.date, locale)}
                />
                {displayAmount && (
                  <DetailField
                    label={t("receiptAmount")}
                    value={displayAmount}
                  />
                )}
                {originalStatus && (
                  <DetailField
                    label={t("postingStatus")}
                    value={accountingT(originalStatus)}
                  />
                )}
              </DetailGrid>
            )}
            {original && (!originalReceipt || !originalStatus) && (
              <Span className="text-sm text-destructive">
                {t("invalidReceipt")}
              </Span>
            )}
            <DateFieldWidget
              utcCalendarDay
              fieldName="reversalDate"
              field={children.reversalDate}
            />
            {originalDay && date !== undefined && !validReversalDate && (
              <Span className="text-sm text-destructive">
                {t("invalidDate")}
              </Span>
            )}
            <TextareaFieldWidget fieldName="reason" field={children.reason} />
            <Div className="flex flex-wrap items-center justify-end gap-2">
              {navigation.canGoBack && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigation.pop()}
                >
                  {t("cancel")}
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={!canConfirm}
                  >
                    {t("title")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <DetailGrid>
                    {reversalDate && (
                      <DetailField
                        label={t("date")}
                        value={formatDocDate(reversalDate, locale)}
                      />
                    )}
                    <DetailField label={t("reason")} value={reason} />
                  </DetailGrid>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onSubmit?.()}
                    >
                      {t("confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Div>
          </Div>
        )
      )}
    </WidgetShell>
  );
}
