"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { formatDocDate } from "next-vibe/unified-ui/_shared/format-money";
import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { scopedTranslation as paymentTranslation } from "@/payment/i18n";
import { SubscriptionStatus } from "@/subscription/enum";
import { scopedTranslation as subscriptionTranslation } from "@/subscription/i18n";

import type { CompanySubscriptionGetResponseOutput } from "./get/definition";
import { scopedTranslation } from "./get/i18n";

export function OwnerPlanSummary({
  planData,
  details = false,
}: {
  planData: Pick<
    CompanySubscriptionGetResponseOutput,
    | "plan"
    | "billingInterval"
    | "status"
    | "currentPeriodStart"
    | "currentPeriodEnd"
    | "cancelAtPeriodEnd"
    | "provider"
  > & {
    cancelAt?: Date | string;
    canceledAt?: Date | string;
    endedAt?: Date | string;
  };
  details?: boolean;
}): JSX.Element | null {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: subscriptionT } = subscriptionTranslation.scopedT(locale);
  const { t: paymentT } = paymentTranslation.scopedT(locale);
  const { plan, billingInterval, status, provider } = planData;

  if (!plan || !billingInterval || !status || !provider) {
    return null;
  }
  return (
    <SectionGroup title={subscriptionT(plan)}>
      <DetailGrid columns={2}>
        <DetailField
          label={t("view.status")}
          value={
            <StatusPill
              status={subscriptionT(status)}
              variant={
                status === SubscriptionStatus.ACTIVE ? "success" : "muted"
              }
            />
          }
        />
        <DetailField
          label={t("view.interval")}
          value={subscriptionT(billingInterval)}
        />
        <DetailField
          label={t("view.periodStart")}
          value={
            planData.currentPeriodStart
              ? formatDocDate(planData.currentPeriodStart, locale)
              : t("view.unavailable")
          }
        />
        <DetailField
          label={t("view.periodEnd")}
          value={
            planData.currentPeriodEnd
              ? formatDocDate(planData.currentPeriodEnd, locale)
              : t("view.unavailable")
          }
        />
        {details && (
          <DetailField label={t("view.provider")} value={paymentT(provider)} />
        )}
        {planData.cancelAtPeriodEnd && (
          <DetailField
            label={t("view.cancellation")}
            value={t("view.endOfPeriod")}
          />
        )}
        {details && planData.cancelAt && (
          <DetailField
            label={t("view.scheduled")}
            value={formatDocDate(planData.cancelAt, locale)}
          />
        )}
        {details && planData.canceledAt && (
          <DetailField
            label={t("view.canceled")}
            value={formatDocDate(planData.canceledAt, locale)}
          />
        )}
        {details && planData.endedAt && (
          <DetailField
            label={t("view.ended")}
            value={formatDocDate(planData.endedAt, locale)}
          />
        )}
      </DetailGrid>
    </SectionGroup>
  );
}
