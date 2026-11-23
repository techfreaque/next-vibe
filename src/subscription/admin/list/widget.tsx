"use client";

import {
  formatCurrency,
  formatDate,
} from "next-vibe/core/i18n/core/localization-utils";
import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
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
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
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

import { PaymentStatus } from "@/payment/enum";
import { scopedTranslation as paymentTranslation } from "@/payment/i18n";
import { ProcessorKind } from "@/payment/processor/enum";
import {
  DayRangeInputs,
  type FilterChip,
  FilterChips,
  SegmentGroup,
} from "@/payment/processor/list-controls";
import {
  BillingInterval,
  SubscriptionPlan,
  type SubscriptionPlanValue,
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "@/subscription/enum";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import {
  BillingIntervalAdminFilter,
  type BillingIntervalAdminFilterValue,
  ProviderAdminFilter,
  type ProviderAdminFilterValue,
  SortOrder,
  SubscriptionSortField,
  SubscriptionStatusAdminFilter,
  type SubscriptionStatusAdminFilterValue,
} from "../enum";
import type definition from "./definition";
import type { SubscriptionListResponseOutput } from "./definition";
import { SubscriptionFocus, type SubscriptionFocusValue } from "./enum";

type Subscription =
  SubscriptionListResponseOutput["response"]["subscriptions"][number];

const statusVariants: Record<
  typeof SubscriptionStatusValue,
  StatusPillVariant
> = {
  [SubscriptionStatus.ACTIVE]: "success",
  [SubscriptionStatus.TRIALING]: "info",
  [SubscriptionStatus.CANCELED]: "muted",
  [SubscriptionStatus.PAST_DUE]: "warning",
  [SubscriptionStatus.UNPAID]: "danger",
  [SubscriptionStatus.PAUSED]: "muted",
  [SubscriptionStatus.INCOMPLETE]: "warning",
  [SubscriptionStatus.INCOMPLETE_EXPIRED]: "muted",
};

/** Row status -> the admin filter value that selects it. */
const statusFilterFor: Record<
  typeof SubscriptionStatusValue,
  typeof SubscriptionStatusAdminFilterValue
> = {
  [SubscriptionStatus.ACTIVE]: SubscriptionStatusAdminFilter.ACTIVE,
  [SubscriptionStatus.TRIALING]: SubscriptionStatusAdminFilter.TRIALING,
  [SubscriptionStatus.CANCELED]: SubscriptionStatusAdminFilter.CANCELED,
  [SubscriptionStatus.PAST_DUE]: SubscriptionStatusAdminFilter.PAST_DUE,
  [SubscriptionStatus.UNPAID]: SubscriptionStatusAdminFilter.UNPAID,
  [SubscriptionStatus.PAUSED]: SubscriptionStatusAdminFilter.PAUSED,
  [SubscriptionStatus.INCOMPLETE]: SubscriptionStatusAdminFilter.INCOMPLETE,
  [SubscriptionStatus.INCOMPLETE_EXPIRED]:
    SubscriptionStatusAdminFilter.INCOMPLETE_EXPIRED,
};

const PLANS = [
  SubscriptionPlan.SUBSCRIPTION,
  SubscriptionPlan.PLUS,
  SubscriptionPlan.PRO,
  SubscriptionPlan.ULTRA,
] as const;
const INTERVALS = [
  BillingIntervalAdminFilter.MONTHLY,
  BillingIntervalAdminFilter.YEARLY,
] as const;
const SORT_FIELDS = [
  SubscriptionSortField.CREATED_AT,
  SubscriptionSortField.PERIOD_END,
  SubscriptionSortField.STATUS,
  SubscriptionSortField.USER_EMAIL,
] as const;

/** Form Date -> YYYY-MM-DD for the day inputs. */
const dayOf = (date: Date | undefined): string | undefined =>
  date ? new Date(date).toISOString().slice(0, 10) : undefined;

const PROVIDERS = [
  ProviderAdminFilter.STRIPE,
  ProviderAdminFilter.NOWPAYMENTS,
] as const;

export function SubscriptionListContainer({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { t: tSubscription } = subscriptionTranslation.scopedT(locale);
  const { t: tPayment } = paymentTranslation.scopedT(locale);
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const openRelated = useRelatedEntityNavigation();
  const { pop } = useWidgetNavigation();
  const onPick = usePickerCallback<Subscription>();
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || platform === Platform.MCP;
  const data = useWidgetValue<typeof definition.GET>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Captured once per mount: "overdue" compares period ends to this instant.
  const [renderedAt] = useState(() => Date.now());
  const userId = form.watch("userId");
  const statuses = form.watch("searchFilters.status") ?? [];
  const plan = form.watch("searchFilters.plan");
  const interval = form.watch("searchFilters.interval");
  const provider = form.watch("searchFilters.provider");
  const search = form.watch("searchFilters.search");
  const dateFrom = form.watch("searchFilters.dateFrom");
  const dateTo = form.watch("searchFilters.dateTo");
  const sortBy =
    form.watch("sortingOptions.sortBy") ?? SubscriptionSortField.CREATED_AT;
  const sortOrder = form.watch("sortingOptions.sortOrder") ?? SortOrder.DESC;
  const pagination = data?.paginationInfo;
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const canFilter = isInteractive && Boolean(onSubmit);
  const subscriptions = data?.response.subscriptions ?? [];
  const statusCounts = data?.response.statusCounts ?? [];
  const countTotal = statusCounts.reduce((sum, row) => sum + row.count, 0);

  const changePage = (page: number): void => {
    form.setValue("paginationInfo.page", page, { shouldDirty: true });
    onSubmit?.();
  };
  const setStatuses = (
    next: (typeof SubscriptionStatusAdminFilterValue)[],
  ): void => {
    form.setValue("searchFilters.status", next, { shouldDirty: true });
    form.setValue("searchFilters.focus", undefined, { shouldDirty: true });
    changePage(1);
  };
  const setPlan = (next: typeof SubscriptionPlanValue | undefined): void => {
    form.setValue("searchFilters.plan", next, { shouldDirty: true });
    changePage(1);
  };
  const setInterval = (
    next: typeof BillingIntervalAdminFilterValue | undefined,
  ): void => {
    form.setValue(
      "searchFilters.interval",
      next ?? BillingIntervalAdminFilter.ANY,
      {
        shouldDirty: true,
      },
    );
    changePage(1);
  };
  const setProvider = (
    next: typeof ProviderAdminFilterValue | undefined,
  ): void => {
    form.setValue("searchFilters.provider", next ?? ProviderAdminFilter.ANY, {
      shouldDirty: true,
    });
    changePage(1);
  };
  const setStartedDays = (patch: { from?: string; to?: string }): void => {
    if (patch.from !== undefined) {
      form.setValue(
        "searchFilters.dateFrom",
        patch.from ? new Date(`${patch.from}T00:00:00.000Z`) : undefined,
        { shouldDirty: true },
      );
    }
    if (patch.to !== undefined) {
      form.setValue(
        "searchFilters.dateTo",
        patch.to ? new Date(`${patch.to}T23:59:59.999Z`) : undefined,
        { shouldDirty: true },
      );
    }
    changePage(1);
  };
  const focus = form.watch("searchFilters.focus");
  const setFocus = (next: typeof SubscriptionFocusValue | undefined): void => {
    form.setValue("searchFilters.focus", next, { shouldDirty: true });
    if (next) {
      form.setValue("searchFilters.status", undefined, { shouldDirty: true });
    }
    changePage(1);
  };
  const clearAll = (): void => {
    form.reset({
      paginationInfo: { page: 1, limit: pagination?.limit ?? 20 },
    });
    onSubmit?.();
  };

  const chips: FilterChip[] = [];
  if (userId) {
    chips.push({
      key: "userId",
      label: t("widget.customerFilter"),
      value: subscriptions[0]?.userEmail ?? userId.slice(0, 8),
      onRemove: () => {
        form.setValue("userId", undefined, { shouldDirty: true });
        changePage(1);
      },
    });
  }
  for (const status of statuses) {
    if (status !== SubscriptionStatusAdminFilter.ALL) {
      chips.push({
        key: `status-${status}`,
        label: t("get.status.label"),
        value: t(status),
        onRemove: () =>
          setStatuses(statuses.filter((current) => current !== status)),
      });
    }
  }
  if (focus) {
    chips.push({
      key: "focus",
      label: t("widget.focusLabel"),
      value: t(focus),
      onRemove: () => setFocus(undefined),
    });
  }
  if (plan) {
    chips.push({
      key: "plan",
      label: t("get.plan.label"),
      value: tSubscription(plan),
      onRemove: () => setPlan(undefined),
    });
  }
  if (interval && interval !== BillingIntervalAdminFilter.ANY) {
    chips.push({
      key: "interval",
      label: t("get.interval.label"),
      value: t(interval),
      onRemove: () => setInterval(undefined),
    });
  }
  if (provider && provider !== ProviderAdminFilter.ANY) {
    chips.push({
      key: "provider",
      label: t("get.provider.label"),
      value: t(provider),
      onRemove: () => setProvider(undefined),
    });
  }
  if (dateFrom) {
    chips.push({
      key: "dateFrom",
      label: t("widget.startedFrom"),
      value: formatDate(dateFrom, locale, "PP"),
      onRemove: () => {
        form.setValue("searchFilters.dateFrom", undefined, {
          shouldDirty: true,
        });
        changePage(1);
      },
    });
  }
  if (dateTo) {
    chips.push({
      key: "dateTo",
      label: t("widget.startedTo"),
      value: formatDate(dateTo, locale, "PP"),
      onRemove: () => {
        form.setValue("searchFilters.dateTo", undefined, { shouldDirty: true });
        changePage(1);
      },
    });
  }
  if (search) {
    chips.push({
      key: "search",
      label: t("get.search.label"),
      value: search,
      onRemove: () => {
        form.setValue("searchFilters.search", "", { shouldDirty: true });
        changePage(1);
      },
    });
  }

  const priceLabel = (subscription: Subscription): string | null =>
    subscription.lastPaymentAmount !== null && subscription.lastPaymentCurrency
      ? `${formatCurrency(
          subscription.lastPaymentAmount,
          subscription.lastPaymentCurrency,
          locale,
        )} ${
          subscription.billingInterval === BillingInterval.YEARLY
            ? t("widget.perYear")
            : t("widget.perMonth")
        }`
      : null;

  /** One line answering "what happens next" for this subscription. */
  const nextStep = (
    subscription: Subscription,
  ): { text: string; tone: "default" | "warning" | "danger" | "muted" } => {
    const periodEnd = subscription.currentPeriodEnd
      ? formatDate(subscription.currentPeriodEnd, locale, "PP")
      : t("widget.notRecorded");
    if (subscription.gracePeriodEndsAt) {
      return {
        text: t("widget.graceUntil", {
          date: formatDate(subscription.gracePeriodEndsAt, locale, "PP"),
        }),
        tone: "danger",
      };
    }
    if (subscription.status === SubscriptionStatus.CANCELED) {
      const reason = subscription.cancellationReason
        ? ` · ${tSubscription(subscription.cancellationReason)}`
        : "";
      return {
        text: `${t("widget.canceledOn", {
          date: subscription.canceledAt
            ? formatDate(subscription.canceledAt, locale, "PP")
            : periodEnd,
        })}${reason}`,
        tone: "muted",
      };
    }
    if (subscription.cancelAtPeriodEnd || subscription.cancelAt) {
      return {
        text: t("widget.endsOn", {
          date: subscription.cancelAt
            ? formatDate(subscription.cancelAt, locale, "PP")
            : periodEnd,
        }),
        tone: "warning",
      };
    }
    if (
      (subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.TRIALING) &&
      subscription.lastPaymentAmount === null
    ) {
      return {
        text: t("widget.noChargeStep", { date: periodEnd }),
        tone: "warning",
      };
    }
    if (
      (subscription.status === SubscriptionStatus.ACTIVE ||
        subscription.status === SubscriptionStatus.TRIALING) &&
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd).getTime() < renderedAt
    ) {
      return {
        text: t("widget.renewalOverdue", { date: periodEnd }),
        tone: "warning",
      };
    }
    if (
      subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.TRIALING
    ) {
      return {
        text: t("widget.renewsOn", { date: periodEnd }),
        tone: "default",
      };
    }
    return { text: t("widget.periodEnd", { date: periodEnd }), tone: "muted" };
  };

  const toneClass = {
    default: "text-muted-foreground",
    warning: "text-warning",
    danger: "text-destructive font-medium",
    muted: "text-muted-foreground",
  } as const;

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("get.title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      {data && !isText && (
        <Div className="grid min-w-0 grid-cols-2 gap-3 @3xl:grid-cols-4">
          <Div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-2.5 @md:p-4">
            <Span className="text-xs text-muted-foreground">
              {t("widget.mrr")}
            </Span>
            <Span className="text-xl font-semibold tabular-nums [overflow-wrap:anywhere]">
              {formatCurrency(data.response.summary.mrrUsd, "USD", locale)}
            </Span>
            <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
              {data.response.summary.mrr.length > 0
                ? data.response.summary.mrr
                    .map((row) =>
                      formatCurrency(row.amount, row.currency, locale),
                    )
                    .join(" + ")
                : t("widget.noCharge")}
              {data.response.summary.fxRates.length > 0 &&
                ` · ${t("widget.fxNote", {
                  rates: data.response.summary.fxRates
                    .map((rate) => `${rate.currency} ${rate.usdRate}`)
                    .join(", "),
                })}`}
              {data.response.summary.noCharge > 0 &&
                ` · ${t("widget.pastDueHint", { count: data.response.summary.noCharge })}`}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {t("widget.mrrScope")}
            </Span>
          </Div>
          {[
            {
              key: "renewing",
              label: t("widget.renewingSoon"),
              value: data.response.summary.renewingSoon,
              hint: t("widget.renewingSoonHint"),
              tone: "text-foreground",
              onClick: (): void => setFocus(SubscriptionFocus.RENEWING_SOON),
            },
            {
              key: "ending",
              label: t("widget.ending"),
              value: data.response.summary.ending,
              hint: t("widget.endingHint"),
              tone: "text-warning",
              onClick: (): void => setFocus(SubscriptionFocus.ENDING),
            },
            {
              key: "pastDue",
              label: t("widget.pastDue"),
              value: data.response.summary.pastDue,
              hint: t("widget.pastDueRetry"),
              tone: "text-destructive",
              onClick: (): void =>
                setStatuses([SubscriptionStatusAdminFilter.PAST_DUE]),
            },
          ].map((card) => (
            <Button
              key={card.key}
              type="button"
              variant="ghost"
              disabled={!canFilter || isFetching}
              className="flex h-auto min-w-0 flex-col items-start justify-start gap-1 rounded-xl border bg-card p-2.5 @md:p-4 text-start font-normal disabled:opacity-100"
              onClick={card.onClick}
            >
              <Span className="text-xs text-muted-foreground">
                {card.label}
              </Span>
              <Span
                className={cn(
                  "text-xl font-semibold tabular-nums [overflow-wrap:anywhere]",
                  card.value > 0 ? card.tone : "text-muted-foreground",
                )}
              >
                {card.value}
              </Span>
              <Span className="whitespace-normal text-xs text-muted-foreground">
                {card.hint}
              </Span>
            </Button>
          ))}
        </Div>
      )}
      {data && isText && (
        <Span>
          {[
            `${t("widget.mrr")} ${formatCurrency(data.response.summary.mrrUsd, "USD", locale)}`,
            `${t("widget.renewingSoon")} ${data.response.summary.renewingSoon}`,
            `${t("widget.ending")} ${data.response.summary.ending}`,
            `${t("widget.pastDue")} ${data.response.summary.pastDue}`,
          ].join(" · ")}
        </Span>
      )}
      {canFilter && (
        <Div className="flex min-w-0 flex-col gap-3">
          {!onPick && (
            <Div className="flex flex-wrap gap-x-4 gap-y-1">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="whitespace-normal"
                onClick={() =>
                  openRelated(
                    () =>
                      import("@/payment/processor/definition").then(
                        (module) => module.default.GET,
                      ),
                    {
                      data: {
                        userId,
                        status: PaymentStatus.FAILED,
                        kind: ProcessorKind.SUBSCRIPTION,
                      },
                    },
                  )
                }
              >
                {t("widget.failedPayments")}
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() =>
                  openRelated(() =>
                    import("@/payment/analytics/revenue/definition").then(
                      (module) => module.default.GET,
                    ),
                  )
                }
              >
                {t("widget.revenueReport")}
              </Button>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() =>
                  openRelated(() =>
                    import("../stats/definition").then(
                      (module) => module.default.GET,
                    ),
                  )
                }
              >
                {t("widget.viewStats")}
              </Button>
            </Div>
          )}
          <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-end">
            <Div className="min-w-0 flex-1">
              <TextFieldWidget
                fieldName="searchFilters.search"
                field={children.searchFilters.children.search}
              />
            </Div>
            <Div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isFetching}
                onClick={() =>
                  form.setValue("paginationInfo.page", 1, { shouldDirty: true })
                }
              >
                {t("widget.search")}
              </Button>
              <Button
                type="button"
                variant={filtersOpen ? "secondary" : "outline"}
                size="sm"
                className="@3xl:hidden"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                {filtersOpen ? t("widget.hideFilters") : t("widget.filters")}
              </Button>
            </Div>
          </Div>
          {statusCounts.length > 0 && (
            <SegmentGroup
              label={t("get.status.label")}
              wrap
              value={statuses.length === 1 ? statuses[0] : undefined}
              disabled={isFetching}
              onSelect={(next) => setStatuses(next ? [next] : [])}
              options={[
                {
                  value: undefined,
                  label: t("widget.allCount", { count: countTotal }),
                },
                ...statusCounts.map((row) => ({
                  value: statusFilterFor[row.status],
                  label: `${tSubscription(row.status)} ${row.count}`,
                })),
              ]}
            />
          )}
          <SegmentGroup
            label={t("get.plan.label")}
            value={plan}
            disabled={isFetching}
            onSelect={setPlan}
            options={[
              { value: undefined, label: t("widget.all") },
              ...PLANS.map((option) => ({
                value: option,
                label: `${tSubscription(option)} ${
                  data?.response.planCounts.find((row) => row.plan === option)
                    ?.count ?? 0
                }`,
              })),
            ]}
          />
          {
            <Div
              className={cn(
                "min-w-0 grid-cols-1 gap-x-6 gap-y-3 @3xl:grid @3xl:grid-cols-3",
                filtersOpen ? "grid" : "hidden",
              )}
            >
              <SegmentGroup
                label={t("get.interval.label")}
                value={
                  interval === BillingIntervalAdminFilter.ANY
                    ? undefined
                    : interval
                }
                disabled={isFetching}
                onSelect={setInterval}
                options={[
                  { value: undefined, label: t("widget.all") },
                  ...INTERVALS.map((option) => ({
                    value: option,
                    label: t(option),
                  })),
                ]}
              />
              <SegmentGroup
                label={t("get.provider.label")}
                value={
                  provider === ProviderAdminFilter.ANY ? undefined : provider
                }
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
              <DayRangeInputs
                fromLabel={t("widget.startedFrom")}
                toLabel={t("widget.startedTo")}
                from={dayOf(dateFrom)}
                to={dayOf(dateTo)}
                disabled={isFetching}
                onChange={setStartedDays}
              />
              <SegmentGroup
                label={t("get.sortBy.label")}
                value={sortBy}
                disabled={isFetching}
                onSelect={(next) => {
                  form.setValue(
                    "sortingOptions.sortBy",
                    next ?? SubscriptionSortField.CREATED_AT,
                    {
                      shouldDirty: true,
                    },
                  );
                  changePage(1);
                }}
                options={SORT_FIELDS.map((option) => ({
                  value: option,
                  label: t(option),
                }))}
              />
              <SegmentGroup
                label={t("get.sortOrder.label")}
                value={sortOrder}
                disabled={isFetching}
                onSelect={(next) => {
                  form.setValue(
                    "sortingOptions.sortOrder",
                    next ?? SortOrder.DESC,
                    {
                      shouldDirty: true,
                    },
                  );
                  changePage(1);
                }}
                options={[SortOrder.DESC, SortOrder.ASC].map((option) => ({
                  value: option,
                  label: t(option),
                }))}
              />
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
      {response?.success === false && !isFetching && (
        <EmptyBlock
          className="rounded-xl border"
          title={t("get.errors.server.title")}
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
      {data && subscriptions.length === 0 && (
        <EmptyBlock
          className="rounded-xl border"
          title={t("widget.noMatchingSubscriptions")}
          message={
            chips.length > 0
              ? t("widget.emptyFiltered")
              : t("widget.noSubscriptions")
          }
          action={
            canFilter && chips.length > 0
              ? { label: t("widget.clearFilters"), onClick: clearAll }
              : undefined
          }
        />
      )}
      {data && isText && statusCounts.length > 0 && (
        <Span>
          {[
            t("widget.allCount", { count: countTotal }),
            ...statusCounts.map(
              (row) => `${tSubscription(row.status)} ${row.count}`,
            ),
          ].join(" · ")}
        </Span>
      )}
      {data && isText && subscriptions.length > 0 && (
        <Div className="flex flex-col">
          {subscriptions.map((subscription) => (
            <Span key={subscription.id}>
              {[
                tSubscription(subscription.status),
                subscription.userEmail,
                `${tSubscription(subscription.planId)} ${tSubscription(subscription.billingInterval)}`,
                priceLabel(subscription) ?? t("widget.noCharge"),
                ...(subscription.lastPaymentEstimated
                  ? [t("widget.estimatedCharge")]
                  : []),
                nextStep(subscription).text,
                tPayment(subscription.provider),
                subscription.id,
              ].join(" · ")}
            </Span>
          ))}
        </Div>
      )}
      {data && !isText && subscriptions.length > 0 && (
        <Div
          className={cn(
            "min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card",
            isFetching && "opacity-60",
          )}
        >
          {subscriptions.map((subscription) => {
            const step = nextStep(subscription);
            const price = priceLabel(subscription);
            const meta = [
              tSubscription(subscription.planId),
              tSubscription(subscription.billingInterval),
              tPayment(subscription.provider),
              t("widget.startedOn", {
                date: formatDate(subscription.createdAt, locale, "PP"),
              }),
            ];
            if (subscription.lastPaymentEstimated) {
              meta.push(t("widget.estimatedCharge"));
            }
            if (subscription.lastPaymentAt) {
              meta.push(
                t("widget.lastPaid", {
                  date: formatDate(subscription.lastPaymentAt, locale, "PP"),
                }),
              );
            }
            return (
              <Div
                key={subscription.id}
                className="flex min-w-0 flex-col gap-2 px-3 py-2.5 @md:flex-row @md:items-center @md:gap-4 @md:px-4"
              >
                <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Div className="flex min-w-0 items-baseline justify-between gap-3">
                    <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                      {subscription.userEmail}
                      {subscription.userName && (
                        <Span className="ms-2 text-xs font-normal text-muted-foreground">
                          {subscription.userName}
                        </Span>
                      )}
                    </Span>
                    <Span className="shrink-0 text-sm font-semibold tabular-nums @md:hidden">
                      {price ?? t("widget.noCharge")}
                    </Span>
                  </Div>
                  <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {meta.join(" · ")}
                  </Span>
                  <Span className={cn("text-xs", toneClass[step.tone])}>
                    {step.text}
                    {subscription.paymentFailedAt &&
                      ` · ${t("get.response.subscriptions.paymentFailedAt")} ${formatDate(subscription.paymentFailedAt, locale, "PP")}`}
                  </Span>
                </Div>
                <Div className="flex min-w-0 flex-wrap items-center gap-2 @md:flex-nowrap">
                  <StatusPill
                    className="shrink-0"
                    status={tSubscription(subscription.status)}
                    variant={statusVariants[subscription.status]}
                  />
                  {(subscription.cancelAtPeriodEnd || subscription.cancelAt) &&
                    subscription.status !== SubscriptionStatus.CANCELED && (
                      <StatusPill
                        className="shrink-0"
                        status={t("widget.endingChip")}
                        variant="warning"
                      />
                    )}
                  <Span className="hidden min-w-28 whitespace-nowrap text-right text-sm font-semibold tabular-nums @md:inline">
                    {price ?? t("widget.noCharge")}
                  </Span>
                  {isInteractive && !onPick && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        openRelated(
                          () =>
                            import("@/payment/processor/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: subscription.userId } },
                        )
                      }
                    >
                      {t("widget.payments")}
                    </Button>
                  )}
                  {isInteractive && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        if (onPick) {
                          onPick(subscription);
                          pop();
                          return;
                        }
                        openRelated(
                          () =>
                            import("@/users/view/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: subscription.userId } },
                        );
                      }}
                    >
                      {onPick ? t("widget.pick") : t("widget.customer")}
                    </Button>
                  )}
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
      {pagination && pagination.totalCount > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("widget.pagination", {
              page: pagination.page,
              pages: pagination.pageCount,
              total: pagination.totalCount,
            })}
          </Span>
          {canFilter && (pagination.pageCount > 1 || pagination.page > 1) && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching || pagination.page <= 1}
                onClick={() => changePage(pagination.page - 1)}
              >
                {t("widget.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching || pagination.page >= pagination.pageCount}
                onClick={() => changePage(pagination.page + 1)}
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
