"use client";

import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
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
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  RelatedEntitiesPanel,
  useRelatedEntityNavigation,
} from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { DateTimeFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/datetime-field/widget";
import { MultiSelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/multiselect-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type { JSX } from "react";

import { PaymentProvider, PaymentStatus } from "@/payment/enum";
import { scopedTranslation as paymentTranslation } from "@/payment/i18n";
import {
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "@/subscription/enum";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import type definition from "./definition";
import type { SubscriptionListResponseOutput } from "./definition";

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
  const data = useWidgetValue<typeof definition.GET>();
  const userId = form.watch("userId");
  const pagination = data?.paginationInfo;
  const isFetching = endpointMutations?.read?.isFetching ?? false;
  const canFilter = isInteractive && Boolean(onSubmit);

  const changePage = (page: number): void => {
    form.setValue("paginationInfo.page", page, { shouldDirty: true });
    onSubmit?.();
  };

  return (
    <WidgetShell className="min-w-0">
      <WidgetHeader
        title={t("get.title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      {canFilter && (
        <>
          {!onPick && (
            <Div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="whitespace-normal"
                onClick={() =>
                  openRelated(
                    () =>
                      import("@/payment/processor/definition").then(
                        (module) => module.default.GET,
                      ),
                    { data: { userId, status: PaymentStatus.FAILED } },
                  )
                }
              >
                {t("widget.failedPayments")}
              </Button>
              <Button
                type="button"
                variant="ghost"
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
          {userId && (
            <Div className="flex flex-wrap items-center gap-2 text-sm">
              <Span className="break-all">
                {t("widget.customerScope", { id: userId })}
              </Span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => {
                  form.reset({ ...form.getValues(), userId: undefined });
                  changePage(1);
                }}
              >
                {t("widget.clearScope")}
              </Button>
            </Div>
          )}
          <TextFieldWidget
            fieldName="searchFilters.search"
            field={children.searchFilters.children.search}
          />
          <Div className="grid min-w-0 grid-cols-1 gap-3 @md:grid-cols-3">
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
          <Div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2">
            <DateTimeFieldWidget
              fieldName="searchFilters.dateFrom"
              field={children.searchFilters.children.dateFrom}
            />
            <DateTimeFieldWidget
              fieldName="searchFilters.dateTo"
              field={children.searchFilters.children.dateTo}
            />
            <SelectFieldWidget
              fieldName="sortingOptions.sortBy"
              field={children.sortingOptions.children.sortBy}
            />
            <SelectFieldWidget
              fieldName="sortingOptions.sortOrder"
              field={children.sortingOptions.children.sortOrder}
            />
          </Div>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isFetching}
              onClick={() =>
                form.setValue("paginationInfo.page", 1, { shouldDirty: true })
              }
            >
              {t("widget.apply")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isFetching}
              onClick={() => {
                void endpointMutations?.read?.refetch();
              }}
            >
              {t("widget.refresh")}
            </Button>
          </Div>
        </>
      )}
      <FormAlertWidget field={children.formAlert} />
      {!data && !response && <LoadingBlock message={t("widget.loading")} />}
      {data && (
        <RelatedEntitiesPanel
          title={t("get.response.title")}
          emptyTitle={t("widget.noMatchingSubscriptions")}
          items={data.response.subscriptions.map((subscription) => {
            const renews =
              subscription.provider === PaymentProvider.STRIPE &&
              subscription.providerSubscriptionId &&
              (subscription.status === SubscriptionStatus.ACTIVE ||
                subscription.status === SubscriptionStatus.TRIALING);
            const periodLabel = subscription.cancelAtPeriodEnd
              ? "widget.scheduledEnd"
              : renews
                ? "widget.renewal"
                : "get.response.subscriptions.currentPeriodEnd";

            const badges = (
              <StatusPill
                status={tSubscription(subscription.status)}
                variant={statusVariants[subscription.status]}
              />
            );
            const details = [
              tSubscription(subscription.planId),
              tSubscription(subscription.billingInterval),
              tPayment(subscription.provider),
              `${t("get.response.subscriptions.createdAt")} ${formatDate(subscription.createdAt, locale, "PP")}`,
              `${t(periodLabel)} ${
                subscription.currentPeriodEnd
                  ? formatDate(subscription.currentPeriodEnd, locale, "PP")
                  : t("widget.notRecorded")
              }`,
            ];
            if (subscription.gracePeriodEndsAt) {
              details.push(
                `${t("get.response.subscriptions.gracePeriodEndsAt")} ${formatDate(subscription.gracePeriodEndsAt, locale, "PP p")}`,
              );
            }
            if (subscription.canceledAt) {
              details.push(
                `${t("get.response.subscriptions.canceledAt")} ${formatDate(subscription.canceledAt, locale, "PP")}`,
              );
            }
            if (subscription.cancellationReason) {
              details.push(tSubscription(subscription.cancellationReason));
            }
            const firstFailure = subscription.paymentFailedAt
              ? ` · ${t("get.response.subscriptions.paymentFailedAt")} ${formatDate(subscription.paymentFailedAt, locale, "PP p")}`
              : undefined;
            const meta = (
              <>
                <Span>{details.join(" · ")}</Span>
                {firstFailure && (
                  <Span className="font-medium text-destructive">
                    {firstFailure}
                  </Span>
                )}
                {isInteractive && !onPick && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="whitespace-normal"
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
                    {t("widget.paymentAttempts")}
                  </Button>
                )}
              </>
            );
            return {
              id: subscription.id,
              title: subscription.userName || subscription.userEmail,
              subtitle: subscription.userName
                ? subscription.userEmail
                : undefined,
              badges,
              meta,
              action: isInteractive
                ? {
                    label: onPick ? t("widget.pick") : t("widget.customer"),
                    onClick: () => {
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
                    },
                  }
                : undefined,
            };
          })}
        />
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
