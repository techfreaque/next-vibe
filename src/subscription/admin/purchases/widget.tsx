/**
 * Subscription Admin Purchases Widget
 * Credit packs held by accounts: who got how many credits, from where, and
 * how much is left.
 */

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

import { CreditPackType, CreditPackTypeDB } from "@/credits/enum";
import { scopedTranslation as creditsTranslation } from "@/credits/i18n";
import {
  DayRangeInputs,
  type FilterChip,
  FilterChips,
  SegmentGroup,
} from "@/payment/processor/list-controls";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import {
  CreditPackSourceAdminFilter,
  type CreditPackSourceAdminFilterValue,
  CreditPackTypeAdminFilter,
  type CreditPackTypeAdminFilterValue,
} from "../enum";
import type definition from "./definition";
import type { PurchasesGetResponseOutput } from "./definition";
import { PackRemainingFilter, type PackRemainingFilterValue } from "./enum";

type Purchase = NonNullable<
  PurchasesGetResponseOutput["response"]
>["purchases"][number];

const packVariants: Record<string, StatusPillVariant> = {
  [CreditPackType.SUBSCRIPTION]: "info",
  [CreditPackType.PERMANENT]: "success",
  [CreditPackType.BONUS]: "default",
  [CreditPackType.EARNED]: "warning",
};

const SOURCES = [
  CreditPackSourceAdminFilter.STRIPE_PURCHASE,
  CreditPackSourceAdminFilter.STRIPE_SUBSCRIPTION,
  CreditPackSourceAdminFilter.ADMIN_GRANT,
  CreditPackSourceAdminFilter.REFERRAL_EARNING,
] as const;

const sourceKeys = {
  permanent_purchase: "widget.source.pack",
  permanent: "widget.source.pack",
  subscription_purchase: "widget.source.subscription",
  subscription: "widget.source.subscription",
  bonus: "widget.source.bonus",
  admin_grant: "widget.source.bonus",
  referral_earning: "widget.source.referral",
  dispute_won_restore: "widget.source.dispute",
} as const;

/** Form Date -> YYYY-MM-DD for the day inputs. */
const dayOf = (date: Date | undefined): string | undefined =>
  date ? new Date(date).toISOString().slice(0, 10) : undefined;

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function PurchasesContainer({ field }: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const { t: tCredits } = creditsTranslation.scopedT(locale);
  const { t: tSubscription } = subscriptionTranslation.scopedT(locale);
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const response = useWidgetResponse();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const navigate = useRelatedEntityNavigation();
  const platform = useWidgetPlatform();
  const isText = isCliPlatform(platform) || platform === Platform.MCP;
  const data = useWidgetValue<typeof definition.GET>();
  const [renderedAt] = useState(() => Date.now());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const canFilter = isInteractive && Boolean(onSubmit);
  const purchases = data?.response?.purchases ?? [];
  const pagination = data?.paginationInfo;
  const packTypes = form.watch("searchFilters.packType") ?? [];
  const packType = packTypes.length === 1 ? packTypes[0] : undefined;
  const source = form.watch("searchFilters.source");
  const search = form.watch("searchFilters.search");
  const remaining = form.watch("searchFilters.remaining");
  const dateFrom = form.watch("searchFilters.dateFrom");
  const dateTo = form.watch("searchFilters.dateTo");

  const changePage = (page: number): void => {
    form.setValue("paginationInfo.page", page, { shouldDirty: true });
    onSubmit?.();
  };
  const setPackType = (
    next: typeof CreditPackTypeAdminFilterValue | undefined,
  ): void => {
    form.setValue("searchFilters.packType", next ? [next] : [], {
      shouldDirty: true,
    });
    changePage(1);
  };
  const setSource = (
    next: typeof CreditPackSourceAdminFilterValue | undefined,
  ): void => {
    form.setValue(
      "searchFilters.source",
      next ?? CreditPackSourceAdminFilter.ANY,
      {
        shouldDirty: true,
      },
    );
    changePage(1);
  };
  const setDays = (patch: { from?: string; to?: string }): void => {
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
  const setRemaining = (
    next: typeof PackRemainingFilterValue | undefined,
  ): void => {
    form.setValue("searchFilters.remaining", next, { shouldDirty: true });
    changePage(1);
  };
  const clearAll = (): void => {
    form.reset({
      paginationInfo: { page: 1, limit: pagination?.limit ?? 20 },
    });
    onSubmit?.();
  };

  const chips: FilterChip[] = [];
  if (packType && packType !== CreditPackTypeAdminFilter.ANY) {
    chips.push({
      key: "packType",
      label: t("get.response.purchases.packType"),
      value: t(packType),
      onRemove: () => setPackType(undefined),
    });
  }
  if (source && source !== CreditPackSourceAdminFilter.ANY) {
    chips.push({
      key: "source",
      label: t("get.response.purchases.source"),
      value: t(source),
      onRemove: () => setSource(undefined),
    });
  }
  if (remaining) {
    chips.push({
      key: "remaining",
      label: t("get.hasRemaining.label"),
      value: t(remaining),
      onRemove: () => setRemaining(undefined),
    });
  }
  if (dateFrom) {
    chips.push({
      key: "dateFrom",
      label: t("get.dateFrom.label"),
      value: formatDate(dateFrom, locale, "PP"),
      onRemove: () => setDays({ from: "" }),
    });
  }
  if (dateTo) {
    chips.push({
      key: "dateTo",
      label: t("get.dateTo.label"),
      value: formatDate(dateTo, locale, "PP"),
      onRemove: () => setDays({ to: "" }),
    });
  }
  if (search) {
    chips.push({
      key: "search",
      label: t("widget.searchLabel"),
      value: search,
      onRemove: () => {
        form.setValue("searchFilters.search", "", { shouldDirty: true });
        changePage(1);
      },
    });
  }

  const numbers = new Intl.NumberFormat(locale.split("-")[0], {
    maximumFractionDigits: 2,
  });
  const typeLabel = (purchase: Purchase): string => {
    const key = CreditPackTypeDB.find((value) => value === purchase.packType);
    return key ? tCredits(key) : purchase.packType;
  };
  const sourceLabel = (purchase: Purchase): string => {
    const key = Object.entries(sourceKeys).find(
      ([stored]) => stored === purchase.source,
    )?.[1];
    return key ? t(key) : purchase.source || typeLabel(purchase);
  };
  const paidLabel = (purchase: Purchase): string =>
    purchase.paidAmount !== null && purchase.paidCurrency
      ? t("widget.paid", {
          amount: formatCurrency(
            purchase.paidAmount,
            purchase.paidCurrency,
            locale,
          ),
        })
      : purchase.source === "admin_grant" ||
          purchase.packType === CreditPackType.BONUS ||
          purchase.packType === CreditPackType.EARNED
        ? t("widget.grantedFree")
        : t("widget.noLinkedPayment");
  const expiresSoon = (purchase: Purchase): boolean =>
    purchase.expiresAt !== null &&
    purchase.remaining > 0 &&
    new Date(purchase.expiresAt).getTime() >= renderedAt &&
    new Date(purchase.expiresAt).getTime() - renderedAt <=
      7 * 24 * 60 * 60 * 1000;
  const expiryLabel = (purchase: Purchase): string =>
    purchase.expiresAt
      ? new Date(purchase.expiresAt).getTime() < renderedAt
        ? t("widget.expiredOn", {
            date: formatDate(purchase.expiresAt, locale, "PP"),
          })
        : t("widget.expiresOn", {
            date: formatDate(purchase.expiresAt, locale, "PP"),
          })
      : t("widget.neverExpires");
  const summary = data?.response?.summary;
  const expiryCount = summary?.expiringPacks ?? 0;
  const expiryCredits = summary?.expiringCredits ?? 0;
  const expiryText = t("widget.expiringCredits", {
    credits: numbers.format(expiryCredits),
  });

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("get.title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      {summary && (
        <Button
          type="button"
          variant={
            remaining === PackRemainingFilter.EXPIRING_SOON
              ? "secondary"
              : "outline"
          }
          aria-pressed={remaining === PackRemainingFilter.EXPIRING_SOON}
          disabled={!canFilter || isFetching}
          className="h-auto min-w-0 justify-start gap-3 whitespace-normal p-3 text-start"
          onClick={() =>
            setRemaining(
              remaining === PackRemainingFilter.EXPIRING_SOON
                ? undefined
                : PackRemainingFilter.EXPIRING_SOON,
            )
          }
        >
          <Span
            className={cn(
              "text-xl font-semibold tabular-nums",
              expiryCount > 0 && "text-warning",
            )}
          >
            {numbers.format(expiryCount)}
          </Span>
          <Div className="flex min-w-0 flex-col gap-0.5">
            <Span className="text-sm font-medium">
              {t(PackRemainingFilter.EXPIRING_SOON)}
            </Span>
            <Span className="text-xs font-normal text-muted-foreground">
              {expiryText}
            </Span>
          </Div>
        </Button>
      )}
      {data?.response && !isText && (
        <Div className="grid min-w-0 grid-cols-2 gap-2 @3xl:grid-cols-4">
          {[
            {
              key: "count",
              label: t("widget.packs"),
              value: numbers.format(pagination?.totalCount ?? 0),
              hint: t("widget.packsHint"),
            },
            {
              key: "credits",
              label: t("widget.creditsTotal"),
              value: numbers.format(data.response.summary.credits),
              hint: t("widget.creditsTotalHint"),
            },
            {
              key: "remaining",
              label: t("widget.remainingTotal"),
              value: numbers.format(data.response.summary.remaining),
              hint: t("widget.remainingTotalHint"),
            },
            {
              key: "paid",
              label: t("widget.paidTotal"),
              value:
                data.response.summary.paid.length > 0
                  ? data.response.summary.paid
                      .map((row) =>
                        formatCurrency(row.amount, row.currency, locale),
                      )
                      .join(" · ")
                  : t("widget.noPaid"),
              hint:
                data.response.summary.unmatchedPaidPacks > 0
                  ? t("widget.unmatched", {
                      count: data.response.summary.unmatchedPaidPacks,
                    })
                  : t("widget.paidTotalHint"),
            },
          ].map((card) => (
            <Div
              key={card.key}
              className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-2.5 @md:p-4"
            >
              <Span className="text-xs text-muted-foreground">
                {card.label}
              </Span>
              <Span className="text-base font-semibold tabular-nums [overflow-wrap:anywhere] @md:text-lg">
                {card.value}
              </Span>
              <Span className="text-xs text-muted-foreground">{card.hint}</Span>
            </Div>
          ))}
        </Div>
      )}
      {summary && isText && (
        <Span>
          {[
            `${t("widget.packs")} ${numbers.format(pagination?.totalCount ?? 0)}`,
            `${t("widget.remainingTotal")} ${numbers.format(summary.remaining)}`,
            `${t(PackRemainingFilter.EXPIRING_SOON)} ${numbers.format(expiryCount)}`,
            expiryText,
          ].join(" · ")}
        </Span>
      )}
      {canFilter && (
        <Div className="flex min-w-0 flex-col gap-3">
          <Div className="flex min-w-0 flex-col gap-2 @md:flex-row @md:items-end">
            <Div className="min-w-0 flex-1">
              <TextFieldWidget
                fieldName="searchFilters.search"
                field={children.searchFilters.children.search}
              />
            </Div>
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
          </Div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={filtersOpen}
            className="self-start @3xl:hidden"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {tCredits(
              filtersOpen
                ? "history.get.hideFilters"
                : "history.get.showFilters",
            )}
          </Button>
          <Div
            className={cn(
              "min-w-0 flex-col gap-3 @3xl:flex",
              filtersOpen ? "flex" : "hidden",
            )}
          >
            <SegmentGroup
              label={t("widget.kind")}
              value={
                source === CreditPackSourceAdminFilter.ANY ? undefined : source
              }
              disabled={isFetching}
              onSelect={setSource}
              options={[
                {
                  value: undefined,
                  label: t("enums.creditPackSourceFilter.any"),
                },
                ...SOURCES.map((option) => ({
                  value: option,
                  label: t(option),
                })),
              ]}
            />
            <Div className="flex min-w-0 flex-wrap items-end gap-x-6 gap-y-3">
              <SegmentGroup
                label={t("get.hasRemaining.label")}
                value={remaining}
                disabled={isFetching}
                onSelect={setRemaining}
                options={[
                  {
                    value: undefined,
                    label: t("enums.creditPackTypeFilter.any"),
                  },
                  {
                    value: PackRemainingFilter.LEFT,
                    label: t(PackRemainingFilter.LEFT),
                  },
                  {
                    value: PackRemainingFilter.USED_UP,
                    label: t(PackRemainingFilter.USED_UP),
                  },
                  {
                    value: PackRemainingFilter.EXPIRING_SOON,
                    label: t(PackRemainingFilter.EXPIRING_SOON),
                  },
                ]}
              />
              <DayRangeInputs
                fromLabel={t("get.dateFrom.label")}
                toLabel={t("get.dateTo.label")}
                from={dayOf(dateFrom)}
                to={dayOf(dateTo)}
                disabled={isFetching}
                onChange={setDays}
              />
            </Div>
          </Div>
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
                  label: t("widget.refresh"),
                  onClick: () => void endpointMutations?.read?.refetch(),
                }
              : undefined
          }
        />
      )}
      {!data && response?.success !== false && (
        <LoadingBlock message={t("widget.loading")} />
      )}
      {data && purchases.length === 0 && (
        <EmptyBlock
          className="rounded-xl border"
          title={
            chips.length > 0
              ? t("widget.noMatchingPurchases")
              : t("widget.noPurchases")
          }
          action={
            canFilter && chips.length > 0
              ? { label: t("widget.clearFilters"), onClick: clearAll }
              : undefined
          }
        />
      )}
      {data && isText && purchases.length > 0 && (
        <Div className="flex flex-col">
          {purchases.map((purchase) => (
            <Span key={purchase.id}>
              {[
                purchase.userEmail,
                typeLabel(purchase),
                sourceLabel(purchase),
                paidLabel(purchase),
                t("widget.leftOf", {
                  remaining: numbers.format(purchase.remaining),
                  total: numbers.format(purchase.originalAmount),
                }),
                formatDate(purchase.createdAt, locale, "PP"),
                expiryLabel(purchase),
              ].join(" · ")}
            </Span>
          ))}
        </Div>
      )}
      {data && !isText && purchases.length > 0 && (
        <Div
          className={cn(
            "min-w-0 divide-y divide-border overflow-hidden rounded-xl border bg-card",
            isFetching && "opacity-60",
          )}
        >
          {purchases.map((purchase) => {
            const usedShare =
              purchase.originalAmount > 0
                ? Math.min(
                    100,
                    Math.max(
                      0,
                      ((purchase.originalAmount - purchase.remaining) /
                        purchase.originalAmount) *
                        100,
                    ),
                  )
                : 0;
            return (
              <Div
                key={purchase.id}
                className="flex min-w-0 flex-col gap-2 px-3 py-2.5 @3xl:flex-row @3xl:items-center @3xl:gap-4 @md:px-4"
              >
                <Div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Span className="min-w-0 text-sm font-medium [overflow-wrap:anywhere]">
                    {purchase.userEmail}
                  </Span>
                  <Span className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
                    {[
                      ...(purchase.planId
                        ? [
                            t("widget.plan", {
                              plan: tSubscription(purchase.planId),
                            }),
                          ]
                        : []),
                      formatDate(purchase.createdAt, locale, "PP"),
                      expiryLabel(purchase),
                    ].join(" · ")}
                  </Span>
                  {expiresSoon(purchase) && (
                    <Span className="text-xs font-medium text-warning">
                      {t("widget.expiresSoon", {
                        count: numbers.format(purchase.remaining),
                      })}
                    </Span>
                  )}
                </Div>
                <Div className="flex min-w-0 flex-wrap items-center gap-2">
                  <StatusPill
                    className="shrink-0"
                    status={sourceLabel(purchase)}
                    variant={packVariants[purchase.packType] ?? "muted"}
                  />
                  <Span className="min-w-0 text-sm font-semibold tabular-nums @md:w-28 @md:text-right">
                    {paidLabel(purchase)}
                  </Span>
                  <Div className="flex w-36 flex-col gap-1">
                    <Span className="text-right text-xs tabular-nums text-muted-foreground">
                      {t("widget.leftOf", {
                        remaining: numbers.format(purchase.remaining),
                        total: numbers.format(purchase.originalAmount),
                      })}
                    </Span>
                    <Div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <Div
                        style={{
                          width: `${100 - usedShare}%`,
                          height: "100%",
                          backgroundColor: "hsl(var(--primary))",
                        }}
                      />
                    </Div>
                  </Div>
                  {isInteractive && purchase.paymentId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        navigate(
                          () =>
                            import("@/payment/processor/definition").then(
                              (module) => module.default.GET,
                            ),
                          {
                            data: {
                              transactionId: purchase.paymentId ?? undefined,
                            },
                          },
                        )
                      }
                    >
                      {t("widget.openPayment")}
                    </Button>
                  )}
                  {isInteractive && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        navigate(
                          () =>
                            import("@/credits/history/definition").then(
                              (module) => module.default.GET,
                            ),
                          {
                            data: {
                              targetUserId: purchase.userId,
                              packId: purchase.id,
                              paginationInfo: { page: 1, limit: 20 },
                            },
                          },
                        )
                      }
                    >
                      {tCredits("history.get.openLedger")}
                    </Button>
                  )}
                  {isInteractive && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() =>
                        navigate(
                          () =>
                            import("@/users/view/definition").then(
                              (module) => module.default.GET,
                            ),
                          { data: { userId: purchase.userId } },
                        )
                      }
                    >
                      {t("widget.customer")}
                    </Button>
                  )}
                </Div>
              </Div>
            );
          })}
        </Div>
      )}
      {pagination && (pagination.totalCount ?? 0) > 0 && (
        <Div className="flex flex-wrap items-center justify-between gap-2">
          <Span className="text-sm text-muted-foreground">
            {t("widget.pagination", {
              page: pagination.page ?? 1,
              pages: pagination.pageCount ?? 1,
              total: pagination.totalCount ?? 0,
            })}
          </Span>
          {canFilter && (pagination.pageCount ?? 1) > 1 && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching || (pagination.page ?? 1) <= 1}
                onClick={() => changePage((pagination.page ?? 1) - 1)}
              >
                {t("widget.previous")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  isFetching ||
                  (pagination.page ?? 1) >= (pagination.pageCount ?? 1)
                }
                onClick={() => changePage((pagination.page ?? 1) + 1)}
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
