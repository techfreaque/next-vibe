import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import {
  AlertCircle,
  Bitcoin,
  CreditCard,
  ExternalLink,
} from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { PaymentProvider } from "@/app/api/[locale]/payment/enum";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { SubscriptionStatus } from "../enum";
import { formatDate } from "./types";

interface SubscriptionStatusCardProps {
  locale: CountryLanguage;
  initialSubscription: SubscriptionGetResponseOutput;
}

export function SubscriptionStatusCard({
  locale,
  initialSubscription,
}: SubscriptionStatusCardProps): JSX.Element {
  const { t } = useTranslation();

  // Check if subscription is fully canceled
  const isCanceled = initialSubscription.status === SubscriptionStatus.CANCELED;
  const isCanceling = !isCanceled && initialSubscription.cancelAt;

  // Get provider icon and name
  const getProviderIcon = (provider?: string): JSX.Element => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return <Bitcoin className="h-5 w-5 text-orange-500" />;
    }
    return <CreditCard className="h-5 w-5 text-blue-600" />;
  };

  const getProviderName = (provider?: string): string => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return t("app.api.payment.enums.paymentProvider.nowpayments");
    }
    return t("app.api.payment.enums.paymentProvider.stripe");
  };

  const handleManageSubscription = async (): Promise<void> => {
    if (initialSubscription.provider === PaymentProvider.NOWPAYMENTS) {
      // For NOWPayments, inform user about email-based management
      alert(t("app.subscription.subscription.manage.nowpayments.info"));
      return;
    }

    // For Stripe, create portal session and redirect
    try {
      const response = await fetch(`/api/${locale}/payment/portal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/${locale}/subscription`,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.customerPortalUrl) {
        window.location.href = result.data.customerPortalUrl;
      } else if (result.data?.message) {
        alert(result.data.message);
      } else {
        alert("Failed to open customer portal. Please try again.");
      }
    } catch {
      alert("Failed to open customer portal. Please try again.");
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-primary">
        <CardHeader>
          <Div className="flex items-start justify-between">
            <Div className="flex flex-col gap-1">
              <CardTitle className="flex items-center gap-3">
                <Div className="p-2 rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </Div>
                {t("app.subscription.subscription.title")}
              </CardTitle>
              <CardDescription>
                {t("app.subscription.subscription.description")}
              </CardDescription>
            </Div>
            <Div className="flex gap-2">
              <Badge
                className={
                  isCanceled
                    ? "bg-red-600 text-white"
                    : isCanceling
                      ? "bg-amber-600 text-white"
                      : "bg-green-600 text-white"
                }
              >
                {isCanceled
                  ? t(initialSubscription.status)
                  : isCanceling
                    ? t("app.api.subscription.enums.status.canceling")
                    : t(initialSubscription.status)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getProviderIcon(initialSubscription.provider)}
                {getProviderName(initialSubscription.provider)}
              </Badge>
            </Div>
          </Div>
        </CardHeader>
        <CardContent>
          {isCanceled ? (
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("app.subscription.subscription.canceledOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {initialSubscription.canceledAt
                    ? formatDate(initialSubscription.canceledAt, locale)
                    : initialSubscription.endedAt
                      ? formatDate(initialSubscription.endedAt, locale)
                      : t("app.common.notAvailable")}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("app.subscription.subscription.endedOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {initialSubscription.endedAt
                    ? formatDate(initialSubscription.endedAt, locale)
                    : initialSubscription.currentPeriodEnd
                      ? formatDate(initialSubscription.currentPeriodEnd, locale)
                      : t("app.common.notAvailable")}
                </Div>
              </Div>
            </Div>
          ) : (
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("app.subscription.subscription.billingInterval")}
                </Div>
                <Div className="text-lg font-semibold capitalize">
                  {t(initialSubscription.billingInterval)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("app.subscription.subscription.currentPeriodStart")}
                </Div>
                <Div className="text-lg font-semibold">
                  {formatDate(initialSubscription.currentPeriodStart, locale)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {isCanceling
                    ? t("app.subscription.subscription.endsOn")
                    : t("app.subscription.subscription.nextBillingDate")}
                </Div>
                <Div className="text-lg font-semibold">
                  {isCanceling
                    ? formatDate(initialSubscription.cancelAt!, locale)
                    : initialSubscription.currentPeriodEnd
                      ? formatDate(initialSubscription.currentPeriodEnd, locale)
                      : t("app.common.notAvailable")}
                </Div>
              </Div>
            </Div>
          )}

          {/* Cancellation Warning - only show for active subscriptions being canceled */}
          {isCanceling && (
            <Div className="mt-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <Div className="text-sm text-amber-800 dark:text-amber-200">
                  <Div className="font-semibold mb-1">
                    {t("app.subscription.subscription.cancellation.title")}
                  </Div>
                  <Div>
                    {t(
                      "app.subscription.subscription.cancellation.description",
                      {
                        date: initialSubscription.cancelAt
                          ? formatDate(initialSubscription.cancelAt, locale)
                          : t("app.common.notAvailable"),
                      },
                    )}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          {/* Canceled Info - show for fully canceled subscriptions */}
          {isCanceled && (
            <Div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <Div className="text-sm text-red-800 dark:text-red-200">
                  <Div className="font-semibold mb-1">
                    {t("app.subscription.subscription.canceled.title")}
                  </Div>
                  <Div>
                    {t("app.subscription.subscription.canceled.description")}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          {/* Management Button */}
          {!isCanceled && (
            <Div className="mt-6 pt-4 border-t">
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {initialSubscription.provider === PaymentProvider.NOWPAYMENTS
                  ? t("app.subscription.subscription.manage.nowpayments.button")
                  : t("app.subscription.subscription.manage.stripe.button")}
              </Button>
            </Div>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
