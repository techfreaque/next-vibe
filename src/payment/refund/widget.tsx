"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import {
  useEndpoint,
  type UseEndpointOptions,
} from "next-vibe/unified-ui/hooks/use-endpoint";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useMemo, useRef, useState } from "react";
import { z } from "zod";

import processorDefinitions from "../processor/definition";
import { ProcessorView } from "../processor/enum";
import type definition from "./definition";

const transactionIdSchema = z.uuid();

interface RefundReview {
  amount: number | undefined;
  reason: string | undefined;
}

function RefundTransactionReview({
  transactionId,
  fields,
}: {
  transactionId: string;
  fields: typeof definition.POST.fields.children;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const { isSubmitting } = useWidgetContext();
  const [review, setReview] = useState<RefundReview | null>(null);
  const confirmed = useRef(false);
  const options = useMemo<UseEndpointOptions<typeof processorDefinitions>>(
    () => ({
      read: {
        initialState: {
          view: ProcessorView.TRANSACTIONS,
          transactionId,
          userId: undefined,
          status: undefined,
          provider: undefined,
          kind: undefined,
          currency: undefined,
          from: undefined,
          to: undefined,
          processing: undefined,
          query: undefined,
          page: 1,
          limit: 1,
        },
        queryOptions: { staleTime: 0 },
      },
    }),
    [transactionId],
  );
  const { read } = useEndpoint(processorDefinitions, options, logger, user);
  const transaction = read?.data?.transactions.find(
    (row) => row.id === transactionId,
  );
  const isFetching = read?.isFetching ?? false;
  const canReview = Boolean(
    transaction?.refundEligible && onSubmit && !isFetching && !isSubmitting,
  );

  if (read?.response?.success === false) {
    return (
      <EmptyBlock
        title={t("widget.lookupFailed")}
        message={read.response.message}
        action={{
          label: t("widget.retryLookup"),
          onClick: () => {
            void read.refetch();
          },
        }}
      />
    );
  }

  if (!transaction) {
    return isFetching || read?.isLoading ? (
      <LoadingBlock size="sm" message={t("widget.lookupLoading")} />
    ) : (
      <EmptyBlock title={t("widget.transactionMissing")} />
    );
  }

  const startReview = async (): Promise<void> => {
    if (!canReview) {
      return;
    }
    const valid = await form.trigger();
    if (
      !valid ||
      form.getValues("transactionId")?.toLowerCase() !== transaction.id
    ) {
      return;
    }
    const { amount, reason } = form.getValues();
    if (amount !== undefined && amount > transaction.amount) {
      form.setError("amount", { message: t("widget.amountExceedsCharge") });
      return;
    }
    confirmed.current = false;
    setReview({ amount, reason });
  };

  const submitReview = (): void => {
    const current = form.getValues();
    if (
      !review ||
      !canReview ||
      confirmed.current ||
      current.transactionId?.toLowerCase() !== transaction.id ||
      current.amount !== review.amount ||
      current.reason !== review.reason
    ) {
      return;
    }
    confirmed.current = true;
    setReview(null);
    onSubmit?.();
  };

  return (
    <>
      <SectionGroup title={t("widget.transactionDetails")}>
        <DetailGrid>
          <DetailField
            label={t("widget.customerEmail")}
            value={transaction.userEmail}
          />
          <DetailField
            label={t("widget.transactionDate")}
            value={formatDate(transaction.createdAt, locale, "PP p")}
          />
          <DetailField
            label={t("widget.originalAmount")}
            value={formatCurrency(
              transaction.amount,
              transaction.currency,
              locale,
            )}
          />
          <DetailField
            label={t("post.response.refund.currency")}
            value={transaction.currency}
          />
        </DetailGrid>
      </SectionGroup>
      {transaction.refundEligible ? (
        <>
          <NumberFieldWidget
            fieldName="amount"
            field={fields.amount}
            presentation="money"
          />
          <Span className="text-sm text-muted-foreground">
            {t("widget.amountHelp", { currency: transaction.currency })}
          </Span>
          <TextareaFieldWidget fieldName="reason" field={fields.reason} />
          <Button
            type="button"
            variant="destructive"
            className="self-start"
            disabled={!canReview}
            onClick={startReview}
          >
            {t("widget.review")}
          </Button>
          <AlertDialog
            open={review !== null}
            onOpenChange={(open) => {
              if (!open) {
                setReview(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("widget.confirmTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("widget.confirmDescription", {
                    email: transaction.userEmail,
                  })}{" "}
                  {review?.amount === undefined
                    ? t("widget.confirmRemaining", {
                        currency: transaction.currency,
                      })
                    : t("widget.confirmAmount", {
                        amount: formatCurrency(
                          review.amount,
                          transaction.currency,
                          locale,
                        ),
                        currency: transaction.currency,
                      })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setReview(null)}>
                  {t("widget.cancel")}
                </AlertDialogCancel>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canReview}
                  onClick={submitReview}
                >
                  {t("widget.confirm")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <Span className="text-sm text-muted-foreground">
          {t("post.errors.validation.ineligible")}
        </Span>
      )}
    </>
  );
}

export function PaymentRefundWidget({
  field: { children },
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const value = useWidgetValue<typeof definition.POST>();
  const { push } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const form = useWidgetForm<typeof definition.POST>();
  const transactionId = transactionIdSchema
    .safeParse(form.watch("transactionId"))
    .data?.toLowerCase();
  const refund = value?.refund;
  const currency = CurrenciesArr.find((code) => code === refund?.currency);

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={t("widget.title")}
        backButton={
          !responseOnly && <NavigateButtonWidget field={children.backButton} />
        }
      />
      <FormAlertWidget field={{}} />
      {refund ? (
        <SectionGroup
          title={t("post.response.refund.title")}
          subtitle={value?.message ?? undefined}
        >
          <DetailGrid>
            <DetailField
              label={t("post.response.refund.stripeRefundId")}
              value={refund.stripeRefundId}
              mono
            />
            <DetailField
              label={t("post.response.refund.amount")}
              value={
                currency
                  ? formatCurrency(refund.amount, currency, locale)
                  : `${refund.amount.toLocaleString(locale)} ${refund.currency}`
              }
            />
            <DetailField
              label={t("post.response.refund.status")}
              value={refund.status}
            />
            <DetailField
              label={t("post.response.refund.reason")}
              value={refund.reason}
            />
            <DetailField
              label={t("post.response.refund.createdAt")}
              value={formatDate(refund.createdAt, locale, "PP p")}
            />
          </DetailGrid>
        </SectionGroup>
      ) : (
        !responseOnly && (
          <>
            {transactionId ? (
              <RefundTransactionReview
                key={transactionId}
                transactionId={transactionId}
                fields={children}
              />
            ) : (
              <EmptyBlock
                title={t("widget.chooseTransaction")}
                message={t("widget.enterTransaction")}
                action={{
                  label: t("widget.chooseTransaction"),
                  onClick: () =>
                    push(processorDefinitions.GET, {
                      data: { view: ProcessorView.TRANSACTIONS },
                    }),
                }}
              />
            )}
          </>
        )
      )}
    </WidgetShell>
  );
}
