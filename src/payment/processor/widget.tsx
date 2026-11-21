"use client";

import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import {
  StatusPill,
  type StatusPillVariant,
} from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { type JSX, useState } from "react";

import {
  PaymentProvider,
  type PaymentProviderValue,
  PaymentStatus,
  type PaymentStatusValue,
} from "../enum";
import type definitions from "./definition";
import {
  ProcessorKind,
  type ProcessorKindValue,
  ProcessorView,
  type ProcessorViewValue,
  WebhookProcessing,
  type WebhookProcessingValue,
} from "./enum";
import {
  DayRangeInputs,
  type FilterChip,
  FilterChips,
  formatUtc,
  SegmentGroup,
} from "./list-controls";

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

const STATUSES = [
  PaymentStatus.SUCCEEDED,
  PaymentStatus.FAILED,
  PaymentStatus.PENDING,
  PaymentStatus.PROCESSING,
  PaymentStatus.REFUNDED,
  PaymentStatus.CANCELED,
] as const;
const KINDS = [
  ProcessorKind.PACK,
  ProcessorKind.NEW_SUBSCRIPTION,
  ProcessorKind.RENEWAL,
] as const;
const PROVIDERS = [
  PaymentProvider.STRIPE,
  PaymentProvider.NOWPAYMENTS,
] as const;
const PROCESSING = [
  WebhookProcessing.UNPROCESSED,
  WebhookProcessing.PROCESSED,
] as const;

const shortId = (id: string): string => id.slice(0, 8);

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [phoneFilters, setPhoneFilters] = useState(false);
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || platform === Platform.MCP;

  const userId = form.watch("userId");
  const transactionId = form.watch("transactionId");
  const status = form.watch("status");
  const provider = form.watch("provider");
  const kind = form.watch("kind");
  const currency = form.watch("currency");
  const from = form.watch("from");
  const to = form.watch("to");
  const processing = form.watch("processing");
  const query = form.watch("query");
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
  const setStatus = (next: typeof PaymentStatusValue | undefined): void => {
    form.setValue("status", next, { shouldDirty: true });
    submitPage(1);
  };
  const setKind = (next: typeof ProcessorKindValue | undefined): void => {
    form.setValue("kind", next, { shouldDirty: true });
    submitPage(1);
  };
  const setProvider = (next: typeof PaymentProviderValue | undefined): void => {
    form.setValue("provider", next, { shouldDirty: true });
    submitPage(1);
  };
  const setCurrency = (
    next: (typeof CurrenciesArr)[number] | undefined,
  ): void => {
    form.setValue("currency", next, { shouldDirty: true });
    submitPage(1);
  };
  const setProcessing = (
    next: typeof WebhookProcessingValue | undefined,
  ): void => {
    form.setValue("processing", next, { shouldDirty: true });
    submitPage(1);
  };
  const setDays = (patch: { from?: string; to?: string }): void => {
    if (patch.from !== undefined) {
      form.setValue("from", patch.from || undefined, { shouldDirty: true });
    }
    if (patch.to !== undefined) {
      form.setValue("to", patch.to || undefined, { shouldDirty: true });
    }
    submitPage(1);
  };
  const clearAll = (): void => {
    form.reset({
      view,
      page: 1,
      limit: data?.pageSize ?? 20,
    });
    onSubmit?.();
  };

  const chips: FilterChip[] = [];
  if (userId) {
    chips.push({
      key: "userId",
      label: t("search.userId"),
      value: data?.transactions[0]?.userEmail ?? shortId(userId),
      onRemove: () => {
        form.setValue("userId", undefined, { shouldDirty: true });
        submitPage(1);
      },
    });
  }
  if (transactionId) {
    chips.push({
      key: "transactionId",
      label: t("search.transactionId"),
      value: shortId(transactionId),
      onRemove: () => {
        form.setValue("transactionId", undefined, { shouldDirty: true });
        submitPage(1);
      },
    });
  }
  if (!isWebhooks && status) {
    chips.push({
      key: "status",
      label: t("search.status"),
      value: t(status),
      onRemove: () => setStatus(undefined),
    });
  }
  if (!isWebhooks && kind) {
    chips.push({
      key: "kind",
      label: t("search.kind"),
      value: t(kind),
      onRemove: () => setKind(undefined),
    });
  }
  if (provider) {
    chips.push({
      key: "provider",
      label: t("search.provider"),
      value: t(provider),
      onRemove: () => setProvider(undefined),
    });
  }
  if (!isWebhooks && currency) {
    chips.push({
      key: "currency",
      label: t("search.currency"),
      value: currency,
      onRemove: () => setCurrency(undefined),
    });
  }
  if (!isWebhooks && from) {
    chips.push({
      key: "from",
      label: t("search.from"),
      value: formatDate(new Date(`${from}T00:00:00Z`), locale, "PP"),
      onRemove: () => setDays({ from: "" }),
    });
  }
  if (!isWebhooks && to) {
    chips.push({
      key: "to",
      label: t("search.to"),
      value: formatDate(new Date(`${to}T00:00:00Z`), locale, "PP"),
      onRemove: () => setDays({ to: "" }),
    });
  }
  if (isWebhooks && processing) {
    chips.push({
      key: "processing",
      label: t("search.processing"),
      value: t(processing),
      onRemove: () => setProcessing(undefined),
    });
  }
  if (query) {
    chips.push({
      key: "query",
      label: t("search.query"),
      value: query,
      onRemove: () => {
        form.setValue("query", "", { shouldDirty: true });
        submitPage(1);
      },
    });
  }

  const openCustomer = (id: string): void =>
    navigate(
      () =>
        import("@/users/view/definition").then((module) => module.default.GET),
      { data: { userId: id } },
    );

  const rows = data ? (isWebhooks ? data.webhooks : data.transactions) : [];

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      {canFilter && (
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="flex flex-wrap items-center gap-2">
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
              variant="link"
              size="sm"
              className="ms-auto h-auto whitespace-normal px-0"
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
          <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-end">
            <Div className="min-w-0 flex-1">
              <TextFieldWidget
                fieldName="query"
                field={{
                  ...children.query,
                  placeholder: isWebhooks
                    ? "widget.webhookSearch"
                    : "widget.transactionSearch",
                }}
              />
            </Div>
            <Button
              type="submit"
              disabled={isFetching}
              size="sm"
              onClick={() => form.setValue("page", 1, { shouldDirty: true })}
            >
              {t("widget.search")}
            </Button>
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start @3xl:hidden"
            onClick={() => setPhoneFilters((open) => !open)}
          >
            {phoneFilters
              ? t("widget.hideFiltersPhone")
              : t("widget.showFilters")}
          </Button>
          {
            <Div
              className={cn(
                "min-w-0 grid-cols-1 gap-x-6 gap-y-3 @3xl:grid @3xl:grid-cols-2",
                phoneFilters ? "grid" : "hidden",
              )}
            >
              {isWebhooks ? (
                <SegmentGroup
                  label={t("search.processing")}
                  value={processing}
                  disabled={isFetching}
                  onSelect={setProcessing}
                  options={[
                    { value: undefined, label: t("widget.all") },
                    ...PROCESSING.map((option) => ({
                      value: option,
                      label: t(option),
                    })),
                  ]}
                />
              ) : (
                <>
                  <SegmentGroup
                    label={t("search.status")}
                    value={status}
                    disabled={isFetching}
                    onSelect={setStatus}
                    options={[
                      { value: undefined, label: t("widget.all") },
                      ...STATUSES.map((option) => ({
                        value: option,
                        label: t(option),
                      })),
                    ]}
                  />
                  <SegmentGroup
                    label={t("search.kind")}
                    value={kind}
                    disabled={isFetching}
                    onSelect={setKind}
                    options={[
                      { value: undefined, label: t("widget.all") },
                      ...KINDS.map((option) => ({
                        value: option,
                        label: t(option),
                      })),
                    ]}
                  />
                  <SegmentGroup
                    label={t("search.currency")}
                    value={currency}
                    disabled={isFetching}
                    onSelect={setCurrency}
                    options={[
                      { value: undefined, label: t("widget.all") },
                      ...CurrenciesArr.map((option) => ({
                        value: option,
                        label: option,
                      })),
                    ]}
                  />
                </>
              )}
              <SegmentGroup
                label={t("search.provider")}
                value={provider}
                disabled={isFetching}
                onSelect={setProvider}
                options={[
                  { value: undefined, label: t("widget.all") },
                  ...PROVIDERS.map((option) => ({
                    value: option,
                    label: t(option),
                  })),
                ]}
              />
              {!isWebhooks && (
                <DayRangeInputs
                  fromLabel={t("search.from")}
                  toLabel={t("search.to")}
                  from={from}
                  to={to}
                  disabled={isFetching}
                  onChange={setDays}
                />
              )}
            </Div>
          }
          <FilterChips
            title={t("widget.activeFilters")}
            chips={chips}
            clearLabel={t("widget.clearFilters")}
            removeLabel={t("widget.removeFilter")}
            disabled={isFetching}
            onClear={clearAll}
          />
        </Div>
      )}
      {!data && response?.success === false && (
        <EmptyBlock
          className="rounded-xl border"
          title={t("errorTitles.server")}
          message={response.message}
          action={
            isInteractive
              ? {
                  label: t("widget.retry"),
                  onClick: () => void endpointMutations?.read?.refetch(),
                }
              : undefined
          }
        />
      )}
      {!data && response?.success !== false && (
        <LoadingBlock message={t("widget.loading")} />
      )}
      {data && !isWebhooks && data.total > 0 && (
        <Div className="grid min-w-0 grid-cols-2 gap-3 @3xl:grid-cols-4">
          <Div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4">
            <Span className="text-xs text-muted-foreground">
              {t("widget.matching")}
            </Span>
            <Span className="text-2xl font-semibold tabular-nums">
              {new Intl.NumberFormat(locale).format(data.total)}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {chips.length > 0
                ? chips
                    .map((chip) => `${chip.label}: ${chip.value}`)
                    .join(" · ")
                : t("widget.matchingHint")}
            </Span>
          </Div>
          {(!status || status === PaymentStatus.SUCCEEDED) &&
            data.totals.map((total) => (
              <Button
                key={total.currency}
                type="button"
                variant="ghost"
                disabled={!canFilter || currency === total.currency}
                className="flex h-auto min-w-0 flex-col items-start justify-start gap-1 rounded-xl border bg-card p-4 text-start font-normal disabled:opacity-100"
                onClick={() => setCurrency(total.currency)}
              >
                <Span className="text-xs text-muted-foreground">
                  {t("widget.collected", { currency: total.currency })}
                </Span>
                <Span
                  className={cn(
                    "text-2xl font-semibold tabular-nums",
                    total.gross > 0 ? "text-success" : "text-muted-foreground",
                  )}
                >
                  {formatCurrency(total.gross, total.currency, locale)}
                </Span>
                <Span className="whitespace-normal text-xs tabular-nums text-muted-foreground">
                  {t("widget.netLine", {
                    refunded: formatCurrency(
                      total.refundedAmount,
                      total.currency,
                      locale,
                    ),
                    net: formatCurrency(
                      total.collected,
                      total.currency,
                      locale,
                    ),
                  })}
                </Span>
                <Span className="whitespace-normal text-xs text-muted-foreground">
                  {t("widget.collectedHint", {
                    succeeded: total.succeeded,
                    failed: total.failed,
                    refunded: total.refunded,
                  })}
                </Span>
              </Button>
            ))}
        </Div>
      )}
      {data && rows.length === 0 && (
        <EmptyBlock
          className="rounded-xl border"
          title={
            isWebhooks
              ? t("widget.emptyWebhooks")
              : t("widget.emptyTransactions")
          }
          message={
            chips.length > 0 ? t("widget.emptyFiltered") : t("widget.emptyAll")
          }
          action={
            canFilter && chips.length > 0
              ? { label: t("widget.clearFilters"), onClick: clearAll }
              : undefined
          }
        />
      )}
      {data && isText && rows.length > 0 && (
        <Div className="flex flex-col">
          {isWebhooks
            ? data.webhooks.map((event) => (
                <Span key={event.id}>
                  {[
                    t(
                      event.processed
                        ? WebhookProcessing.PROCESSED
                        : WebhookProcessing.UNPROCESSED,
                    ),
                    event.eventType,
                    event.provider
                      ? t(event.provider)
                      : t("widget.unknownProvider"),
                    event.providerEventId,
                    formatUtc(event.createdAt, locale),
                  ].join(" · ")}
                </Span>
              ))
            : data.transactions.map((transaction) => (
                <Span key={transaction.id}>
                  {[
                    formatCurrency(
                      transaction.amount,
                      transaction.currency,
                      locale,
                    ),
                    t(transaction.status),
                    transaction.userEmail,
                    transaction.kind ? t(transaction.kind) : t("widget.setup"),
                    t(transaction.provider),
                    formatUtc(transaction.createdAt, locale),
                    transaction.id,
                  ].join(" · ")}
                </Span>
              ))}
        </Div>
      )}
      {data && !isText && !isWebhooks && data.transactions.length > 0 && (
        <Span className="text-xs text-muted-foreground">
          {t("widget.refundRule")}
        </Span>
      )}
      {data && !isText && !isWebhooks && data.transactions.length > 0 && (
        <Div
          className={cn(
            "min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card",
            isFetching && "opacity-60",
          )}
        >
          {data.transactions.map((transaction) => {
            const meta = [
              transaction.kind ? t(transaction.kind) : t("widget.setup"),
              t(transaction.provider),
              formatUtc(transaction.createdAt, locale),
              `#${shortId(transaction.id)}`,
            ];
            if (transaction.providerInvoiceId) {
              meta.push(
                `${t("widget.invoiceRef")} ${transaction.providerInvoiceId}`,
              );
            }
            return (
              <Div key={transaction.id} className="flex min-w-0 flex-col">
                <Div className="flex min-w-0 flex-col gap-2 px-3 py-2.5 @md:flex-row @md:items-center @md:gap-4 @md:px-4">
                  <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Div className="flex min-w-0 items-baseline justify-between gap-3">
                      <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                        {transaction.userEmail}
                      </Span>
                      <Span className="shrink-0 text-sm font-semibold tabular-nums @md:hidden">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency,
                          locale,
                        )}
                      </Span>
                    </Div>
                    <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                      {meta.join(" · ")}
                    </Span>
                  </Div>
                  <Div className="flex min-w-0 flex-wrap items-center gap-2 @md:flex-nowrap">
                    <StatusPill
                      status={t(transaction.status)}
                      variant={paymentStatusVariants[transaction.status]}
                    />
                    <Span className="hidden min-w-24 whitespace-nowrap text-right text-sm font-semibold tabular-nums @md:inline">
                      {formatCurrency(
                        transaction.amount,
                        transaction.currency,
                        locale,
                      )}
                    </Span>
                    {isInteractive && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() =>
                          setExpandedId((current) =>
                            current === transaction.id ? null : transaction.id,
                          )
                        }
                      >
                        {expandedId === transaction.id
                          ? t("widget.hideDetails")
                          : t("widget.details")}
                      </Button>
                    )}
                    {isInteractive && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => openCustomer(transaction.userId)}
                      >
                        {t("widget.customer")}
                      </Button>
                    )}
                    {isInteractive && transaction.refundEligible && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
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
                    {isInteractive && transaction.refundBlock && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        disabled
                        title={t(transaction.refundBlock)}
                      >
                        {t("widget.refund")}
                      </Button>
                    )}
                  </Div>
                </Div>
                {isInteractive && transaction.refundBlock && (
                  <Span className="px-3 pb-2 text-xs text-muted-foreground @md:px-4 @md:text-right">
                    {t("widget.refundBlocked", {
                      reason: t(transaction.refundBlock),
                    })}
                  </Span>
                )}
                {expandedId === transaction.id && (
                  <DetailGrid
                    columns={3}
                    className="border-t bg-muted/20 px-3 py-3 @md:px-4"
                  >
                    <DetailField
                      label={t("response.id")}
                      value={transaction.id}
                      mono
                      copyable
                    />
                    <DetailField
                      label={t("response.userId")}
                      value={transaction.userId}
                      mono
                      copyable
                    />
                    <DetailField
                      label={t("response.providerInvoiceId")}
                      value={
                        transaction.providerInvoiceId ?? t("widget.notRecorded")
                      }
                      mono
                    />
                    <DetailField
                      label={t("response.createdAt")}
                      value={formatUtc(transaction.createdAt, locale, "PPpp")}
                    />
                    <DetailField
                      label={t("response.updatedAt")}
                      value={formatUtc(transaction.updatedAt, locale, "PPpp")}
                    />
                    <DetailField
                      label={t("response.refundEligible")}
                      value={
                        transaction.refundEligible
                          ? t("widget.refundYes")
                          : t("widget.refundNo")
                      }
                    />
                  </DetailGrid>
                )}
              </Div>
            );
          })}
        </Div>
      )}
      {data && !isText && isWebhooks && data.webhooks.length > 0 && (
        <Div
          className={cn(
            "min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card",
            isFetching && "opacity-60",
          )}
        >
          {data.webhooks.map((event) => {
            const meta = [
              event.provider ? t(event.provider) : t("widget.unknownProvider"),
              event.providerEventId,
              `${t("widget.received")} ${formatUtc(event.createdAt, locale)}`,
            ];
            if (event.processedAt) {
              meta.push(
                `${t("widget.processedAt")} ${formatUtc(event.processedAt, locale)}`,
              );
            }
            return (
              <Div
                key={event.id}
                className="flex min-w-0 flex-col gap-1.5 px-3 py-2.5 @md:flex-row @md:items-center @md:gap-4 @md:px-4"
              >
                <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                    {event.eventType}
                  </Span>
                  <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {meta.join(" · ")}
                  </Span>
                </Div>
                <StatusPill
                  status={t(
                    event.processed
                      ? WebhookProcessing.PROCESSED
                      : WebhookProcessing.UNPROCESSED,
                  )}
                  variant={event.processed ? "success" : "warning"}
                />
              </Div>
            );
          })}
        </Div>
      )}
      {data && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("widget.pagination", {
              page: data.currentPage,
              pages: Math.max(data.pageCount, 1),
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
