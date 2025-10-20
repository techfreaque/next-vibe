"use client";

import { format } from "date-fns";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";
import { useState } from "react";

import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";
import { SubscriptionStatus } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface SubscriptionBannerProps {
  subscription: SubscriptionGetResponseOutput;
  locale: CountryLanguage;
}

export default function SubscriptionBanner({
  subscription,
  locale,
}: SubscriptionBannerProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { t } = simpleT(locale);

  if (!isOpen) {
    return null;
  }

  const getStatusColor = (): string => {
    switch (subscription.status) {
      case SubscriptionStatus.ACTIVE:
        return cn(
          "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
        );
      case SubscriptionStatus.PAST_DUE:
        return cn(
          "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
        );
      case SubscriptionStatus.CANCELED:
        return cn(
          "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        );
      default:
        return cn(
          "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
        );
    }
  };

  const getStatusIcon = (): JSX.Element => {
    switch (subscription.status) {
      case SubscriptionStatus.ACTIVE:
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case SubscriptionStatus.PAST_DUE:
        return (
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        );
      case SubscriptionStatus.CANCELED:
        return (
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      default:
        return (
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  const getStatusMessage = (): string => {
    switch (subscription.status) {
      case SubscriptionStatus.ACTIVE:
        return t("app.story.pricing.subscriptionBanner.status.active", {
          planName: subscription.plan
            ? subscription.plan.charAt(0).toUpperCase() +
              subscription.plan.slice(1)
            : // eslint-disable-next-line i18next/no-literal-string
              "Unknown",
        });
      case SubscriptionStatus.PAST_DUE:
        return t("app.story.pricing.subscriptionBanner.status.pastDue");
      case SubscriptionStatus.CANCELED:
        return t("app.story.pricing.subscriptionBanner.status.canceled");
      default:
        return t("app.story.pricing.subscriptionBanner.status.pending");
    }
  };

  const getActionButton = (): JSX.Element => {
    switch (subscription.status) {
      case SubscriptionStatus.ACTIVE:
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/account/subscription`)}
          >
            {t("app.story.pricing.subscriptionBanner.actions.manage")}
          </Button>
        );
      case SubscriptionStatus.PAST_DUE:
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push(`/${locale}/account/billing`)}
          >
            {t("app.story.pricing.subscriptionBanner.actions.updatePayment")}
          </Button>
        );
      case SubscriptionStatus.CANCELED:
        return (
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/pricing")}
          >
            {t("app.story.pricing.subscriptionBanner.actions.resubscribe")}
          </Button>
        );
      default:
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/${locale}/account/subscription`)}
          >
            {t("app.story.pricing.subscriptionBanner.actions.viewDetails")}
          </Button>
        );
    }
  };

  return (
    <div className={`py-3 px-4 ${getStatusColor()} border-b`}>
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm">
            {getStatusMessage()}
            {subscription.currentPeriodEnd &&
              subscription.status === SubscriptionStatus.ACTIVE && (
                <span className="ml-1">
                  {t("app.story.pricing.subscriptionBanner.nextBillingDate", {
                    date: format(
                      new Date(subscription.currentPeriodEnd),
                      t("app.story.pricing.subscriptionBanner.dateFormat"),
                    ),
                  })}
                </span>
              )}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getActionButton()}
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            {t("app.story.pricing.subscriptionBanner.dismissButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}
