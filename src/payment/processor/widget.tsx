"use client";

import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type { JSX } from "react";

import { CheckoutMode, PaymentStatus, type PaymentStatusValue } from "../enum";
import type definitions from "./definition";
import {
  ProcessorView,
  type ProcessorViewValue,
  WebhookProcessing,
} from "./enum";

const paymentStatusVariants: Record<
  typeof PaymentStatusValue,
  StatusPillVariant
> = {
  [PaymentStatus.PENDING]: "warning",
  [PaymentStatus.PROCESSING]: "info",
  [PaymentStatus.SUCCEEDED]: "success",
  [PaymentStatus.FAILED]: "danger",
  [PaymentStatus.CANCELED]: "muted",
  [PaymentStatus.REFUNDED]: "muted",
};

export function PaymentProcessorWidget({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const onSubmit = useWidgetOnSubmit();
  const data = useWidgetValue<typeof definitions.GET>();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const { endpointMutations } = useWidgetContext();
  const navigate = useRelatedEntityNavigation();
  const userId = form.watch("userId");
  const transactionId = form.watch("transactionId");
  const formView = form.watch("view");
  const view = data?.resultView ?? formView ?? ProcessorView.TRANSACTIONS;
  const isWebhooks = view === ProcessorView.WEBHOOKS;
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const canFilter = isInteractive && Boolean(onSubmit);

  const submitPage = (page: number): void => {
    form.setValue("page", page, { shouldDirty: true });
    onSubmit?.();
  };

  const setView = (nextView: typeof ProcessorViewValue): void => {
    form.setValue("view", nextView, { shouldDirty: true });
    form.setValue("query", "", { shouldDirty: true });
    submitPage(1);
  };

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      {canFilter && (
        <>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={!isWebhooks ? "default" : "outline"}
              size="sm"
              disabled={isFetching}
              onClick={() => setView(ProcessorView.TRANSACTIONS)}
            >
              {t(ProcessorView.TRANSACTIONS)}
            </Button>
            {!userId && !transactionId && (
              <Button
                type="button"
                variant={isWebhooks ? "default" : "outline"}
                size="sm"
                disabled={isFetching}
                onClick={() => setView(ProcessorView.WEBHOOKS)}
              >
                {t(ProcessorView.WEBHOOKS)}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="whitespace-normal"
              onClick={() =>
                navigate(() =>
                  import("../dashboard/definition").then(
                    (module) => module.default.GET,
                  ),
                )
              }
            >
              {t("widget.commercial")}
            </Button>
          </Div>
          {(userId || transactionId) && (
            <Div className="flex flex-wrap items-center gap-2 text-sm">
              {userId && (
                <Span className="break-all">
                  {t("widget.customerScope", { id: userId })}
                </Span>
              )}
              {transactionId && (
                <Span className="break-all">
                  {t("widget.transactionScope", { id: transactionId })}
                </Span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => {
                  form.reset({
                    ...form.getValues(),
                    userId: undefined,
                    transactionId: undefined,
                  });
                  submitPage(1);
                }}
              >
                {t("widget.clearScope")}
              </Button>
            </Div>
          )}
          <TextFieldWidget
            fieldName="query"
            field={{
              ...children.query,
              placeholder: isWebhooks
                ? "widget.webhookSearch"
                : "widget.transactionSearch",
            }}
          />
          <Div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2">
            <SelectFieldWidget fieldName="provider" field={children.provider} />
            {isWebhooks ? (
              <SelectFieldWidget
                fieldName="processing"
                field={children.processing}
              />
            ) : (
              <SelectFieldWidget fieldName="status" field={children.status} />
            )}
          </Div>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={isFetching}
              size="sm"
              onClick={() => form.setValue("page", 1, { shouldDirty: true })}
            >
              {t("widget.apply")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isFetching}
              size="sm"
              onClick={() => {
                form.reset({
                  view,
                  userId,
                  transactionId,
                  page: 1,
                  limit: data?.pageSize ?? 20,
                });
                onSubmit?.();
              }}
            >
              {t("widget.clearFilters")}
            </Button>
          </Div>
        </>
      )}
      <FormAlertWidget field={{}} />
      {!data && !response && <LoadingBlock message={t("widget.loading")} />}
      {data &&
        (isWebhooks ? (
          <RelatedEntitiesPanel
            title={t(ProcessorView.WEBHOOKS)}
            subtitle={t("widget.processingDetail")}
            emptyTitle={t("widget.emptyWebhooks")}
            items={data.webhooks.map((event) => {
              const badges = (
                <StatusPill
                  status={t(
                    event.processed
                      ? WebhookProcessing.PROCESSED
                      : WebhookProcessing.UNPROCESSED,
                  )}
                  variant={event.processed ? "success" : "warning"}
                />
              );
              const details = [
                event.provider
                  ? t(event.provider)
                  : t("widget.unknownProvider"),
                `${t("widget.received")} ${formatDate(event.createdAt, locale, "PP p")}`,
              ];
              if (event.processedAt) {
                details.push(
                  `${t("widget.processedAt")} ${formatDate(event.processedAt, locale, "PP p")}`,
                );
              }
              const meta = <Span>{details.join(" · ")}</Span>;
              return {
                id: event.id,
                title: event.eventType,
                subtitle: event.providerEventId,
                badges,
                meta,
              };
            })}
          />
        ) : (
          <RelatedEntitiesPanel
            title={t(ProcessorView.TRANSACTIONS)}
            emptyTitle={t("widget.emptyTransactions")}
            items={data.transactions.map((transaction) => {
              const badges = (
                <StatusPill
                  status={t(transaction.status)}
                  variant={paymentStatusVariants[transaction.status]}
                />
              );
              const paymentKind = transaction.renewal
                ? "widget.renewal"
                : transaction.mode === CheckoutMode.SUBSCRIPTION
                  ? "widget.subscription"
                  : transaction.mode === CheckoutMode.SETUP
                    ? "widget.setup"
                    : "widget.oneTime";
              const details = [
                formatCurrency(
                  transaction.amount,
                  transaction.currency,
                  locale,
                ),
                t(transaction.provider),
                t(paymentKind),
                formatDate(transaction.createdAt, locale, "PP p"),
              ];
              if (
                new Date(transaction.updatedAt).getTime() !==
                new Date(transaction.createdAt).getTime()
              ) {
                details.push(
                  `${t("widget.updated")} ${formatDate(transaction.updatedAt, locale, "PP p")}`,
                );
              }
              if (transaction.providerInvoiceId) {
                details.push(
                  `${t("widget.reference")} ${transaction.providerInvoiceId}`,
                );
              }
              const meta = (
                <>
                  <Span className="break-words">{details.join(" · ")}</Span>
                  {isInteractive && transaction.refundEligible && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(
                          () =>
                            import("../refund/definition").then(
                              (module) => module.default.POST,
                            ),
                          {
                            data: { transactionId: transaction.id },
                            renderInModal: true,
                            popNavigationOnSuccess: 1,
                          },
                        )
                      }
                    >
                      {t("widget.refund")}
                    </Button>
                  )}
                </>
              );
              return {
                id: transaction.id,
                title: transaction.userEmail,
                subtitle: transaction.id,
                badges,
                meta,
                action: isInteractive
                  ? {
                      label: t("widget.customer"),
                      onClick: () =>
                        navigate(
                          () =>
                            import("@/users/view/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: transaction.userId } },
                        ),
                    }
                  : undefined,
              };
            })}
          />
        ))}
      {data && data.total > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("widget.pagination", {
              page: data.currentPage,
              pages: data.pageCount,
              total: data.total,
            })}
          </Span>
          {canFilter && (data.pageCount > 1 || data.currentPage > 1) && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching || data.currentPage <= 1}
                onClick={() => submitPage(data.currentPage - 1)}
              >
                {t("widget.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching || data.currentPage >= data.pageCount}
                onClick={() => submitPage(data.currentPage + 1)}
              >
                {t("widget.next")}
              </Button>
            </Div>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
