/**
 * Custom Widget for Subscription Admin List
 * Table widget with status badges, filtering, and pagination
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { MultiSelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import type { CountryLanguage } from "@/i18n/core/config";
import { formatSimpleDate } from "@/i18n/core/localization-utils";

import type definition from "./definition";
import type { SubscriptionListResponseOutput } from "./definition";
import type { SubscriptionAdminListT } from "./i18n";

type Subscription = NonNullable<
  SubscriptionListResponseOutput["response"]
>["subscriptions"][number];

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const statusVariantMap: Record<string, string> = {
  active: "bg-success/10 text-success",
  trialing: "bg-info/10 text-info",
  canceled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  past_due: "bg-warning/10 text-warning",
  unpaid: "bg-destructive/10 text-destructive",
  paused: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function SubscriptionRow({
  subscription,
  locale,
  t,
}: {
  subscription: Subscription;
  locale: CountryLanguage;
  t: SubscriptionAdminListT;
}): React.JSX.Element {
  // Extract last part of enum value for display
  const statusLabel =
    subscription.status.split(".").pop() ?? subscription.status;
  const statusVariant =
    statusVariantMap[statusLabel.toLowerCase()] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <Div className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
      {/* Avatar with initials */}
      <Div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
        {(subscription.userEmail || "?").slice(0, 2).toUpperCase()}
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm truncate">
            {subscription.userName ?? subscription.userEmail}
          </Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              statusVariant,
            )}
          >
            {statusLabel}
          </Span>
          {subscription.cancelAtPeriodEnd && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              {t("get.response.subscriptions.cancelAtPeriodEnd")}
            </Span>
          )}
        </Div>

        <Div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
          {subscription.userEmail && (
            <Span className="truncate max-w-[200px]">
              {subscription.userEmail}
            </Span>
          )}
          <Span>{subscription.billingInterval.split(".").pop()}</Span>
          <Span>{subscription.provider.split(".").pop()}</Span>
        </Div>

        {subscription.createdAt && (
          <Div className="text-xs text-muted-foreground mt-0.5">
            {t("get.response.subscriptions.createdAt")}{" "}
            {formatSimpleDate(subscription.createdAt, locale)}
            {subscription.currentPeriodEnd && (
              <>
                {` \u2022 `}
                {t("get.response.subscriptions.currentPeriodEnd")}{" "}
                {formatSimpleDate(subscription.currentPeriodEnd, locale)}
              </>
            )}
          </Div>
        )}

        {subscription.cancellationReason && (
          <Div className="text-xs text-muted-foreground mt-0.5 italic">
            {subscription.cancellationReason.split(".").pop()}
          </Div>
        )}
      </Div>
    </Div>
  );
}

export function SubscriptionListContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();

  const data = useWidgetValue<typeof definition.GET>();
  const subscriptionList = data?.response?.subscriptions ?? [];
  const isLoading = data === null || data === undefined;

  const currentPage = data?.paginationInfo?.page ?? 1;
  const totalPages = data?.paginationInfo?.pageCount ?? 1;
  const totalCount = data?.paginationInfo?.totalCount ?? 0;

  const handlePageChange = useCallback(
    (page: number): void => {
      form.setValue("paginationInfo.page", page);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const statsDef = await import("../stats/definition");
      navigate(statsDef.default.GET);
    })();
  }, [navigate]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base mr-auto">
          {t("get.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          title="Statistics"
          className="gap-1"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Search */}
      <Div className="px-4 pt-3 pb-1">
        <TextFieldWidget
          fieldName={"searchFilters.search"}
          field={children.searchFilters.children.search}
        />
      </Div>

      {/* Filters */}
      <Div className="px-4 pt-2 pb-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
        <MultiSelectFieldWidget
          fieldName="searchFilters.status"
          field={children.searchFilters.children.status}
        />
        <SelectFieldWidget
          fieldName="searchFilters.interval"
          field={children.searchFilters.children.interval}
        />
        <SelectFieldWidget
          fieldName="searchFilters.provider"
          field={children.searchFilters.children.provider}
        />
      </Div>

      {/* Sort */}
      <Div className="px-4 pb-2 grid grid-cols-2 gap-2">
        <SelectFieldWidget
          fieldName="sortingOptions.sortBy"
          field={children.sortingOptions.children.sortBy}
        />
        <SelectFieldWidget
          fieldName="sortingOptions.sortOrder"
          field={children.sortingOptions.children.sortOrder}
        />
      </Div>

      {/* Subscription list */}
      <Div className="px-4 pb-2 overflow-y-auto max-h-[min(700px,calc(100dvh-340px))]">
        {isLoading ? (
          <Div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </Div>
        ) : subscriptionList.length > 0 ? (
          <Div className="flex flex-col gap-2">
            {subscriptionList.map((subscription) => (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
                locale={locale}
                t={t}
              />
            ))}
          </Div>
        ) : (
          <Div className="text-center text-muted-foreground py-12">
            {t("widget.noSubscriptions")}
          </Div>
        )}
      </Div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
          <Span>
            {t("get.page.label")} {currentPage} / {totalPages} ({totalCount})
          </Span>
          <Div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
