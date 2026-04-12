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
import { AlertCircle } from "next-vibe-ui/ui/icons/AlertCircle";
import { Bitcoin } from "next-vibe-ui/ui/icons/Bitcoin";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { ExternalLink } from "next-vibe-ui/ui/icons/ExternalLink";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import type { JSX } from "react";

import { PaymentProvider } from "@/app/api/[locale]/payment/enum";
import { scopedTranslation as paymentScopedTranslation } from "@/app/api/[locale]/payment/i18n";
import portalEndpoints from "@/app/api/[locale]/payment/portal/definition";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { scopedTranslation as subscriptionScopedTranslation } from "@/app/api/[locale]/subscription/i18n";
import { scopedTranslation as pageSubscriptionScopedTranslation } from "@/app/[locale]/subscription/i18n";
import { scopedTranslation as appScopedTranslation } from "@/app/[locale]/i18n";
import type { CountryLanguage } from "@/i18n/core/config";

import { formatDate } from "./types";

interface SubscriptionStatusCardProps {
  locale: CountryLanguage;
  initialSubscription: SubscriptionGetResponseOutput;
}

export function SubscriptionStatusCard({
  locale,
  initialSubscription,
}: SubscriptionStatusCardProps): JSX.Element {
  const { t } = pageSubscriptionScopedTranslation.scopedT(locale);
  const { t: appT } = appScopedTranslation.scopedT(locale);
  const { t: subscriptionT } = subscriptionScopedTranslation.scopedT(locale);
  const { t: paymentT } = paymentScopedTranslation.scopedT(locale);

  // Check if subscription is fully canceled
  const isCanceled = initialSubscription.status === SubscriptionStatus.CANCELED;
  const isCanceling = !isCanceled && initialSubscription.cancelAt;

  // Get provider icon and name
  const getProviderIcon = (provider?: string): JSX.Element => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return <Bitcoin className="h-5 w-5 text-orange-500" />;
    }
    return <CreditCard className="h-5 w-5 text-primary" />;
  };

  const getProviderName = (provider?: string): string => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return paymentT(PaymentProvider.NOWPAYMENTS);
    }
    return paymentT(PaymentProvider.STRIPE);
  };

  const handleManageSubscription = async (): Promise<void> => {
    if (initialSubscription.provider === PaymentProvider.NOWPAYMENTS) {
      // For NOWPayments, inform user about email-based management
      alert(t("subscription.manage.nowpayments.info"));
      return;
    }

    // For Stripe, create portal session and redirect
    try {
      const response = await fetch(
        `/api/${locale}/${portalEndpoints.POST.path.join("/")}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            returnUrl: `${window.location.origin}/${locale}/subscription`,
          }),
        },
      );

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
                {t("subscription.title")}
              </CardTitle>
              <CardDescription>{t("subscription.description")}</CardDescription>
            </Div>
            <Div className="flex gap-2">
              <Badge
                className={
                  isCanceled
                    ? "bg-destructive text-destructive-foreground"
                    : isCanceling
                      ? "bg-warning text-warning-foreground"
                      : "bg-success text-success-foreground"
                }
              >
                {isCanceled
                  ? subscriptionT(initialSubscription.status)
                  : isCanceling
                    ? subscriptionT("enums.status.canceling")
                    : subscriptionT(initialSubscription.status)}
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
                  {t("subscription.canceledOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {initialSubscription.canceledAt
                    ? formatDate(initialSubscription.canceledAt, locale)
                    : initialSubscription.endedAt
                      ? formatDate(initialSubscription.endedAt, locale)
                      : appT("common.notAvailable")}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("subscription.endedOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {initialSubscription.endedAt
                    ? formatDate(initialSubscription.endedAt, locale)
                    : initialSubscription.currentPeriodEnd
                      ? formatDate(initialSubscription.currentPeriodEnd, locale)
                      : appT("common.notAvailable")}
                </Div>
              </Div>
            </Div>
          ) : (
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("subscription.billingInterval")}
                </Div>
                <Div className="text-lg font-semibold capitalize">
                  {subscriptionT(initialSubscription.billingInterval)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("subscription.currentPeriodStart")}
                </Div>
                <Div className="text-lg font-semibold">
                  {formatDate(initialSubscription.currentPeriodStart, locale)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {isCanceling
                    ? t("subscription.endsOn")
                    : t("subscription.nextBillingDate")}
                </Div>
                <Div className="text-lg font-semibold">
                  {isCanceling
                    ? formatDate(initialSubscription.cancelAt!, locale)
                    : initialSubscription.currentPeriodEnd
                      ? formatDate(initialSubscription.currentPeriodEnd, locale)
                      : appT("common.notAvailable")}
                </Div>
              </Div>
            </Div>
          )}

          {/* Cancellation Warning - only show for active subscriptions being canceled */}
          {isCanceling && (
            <Div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/30">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <Div className="text-sm text-warning">
                  <Div className="font-semibold mb-1">
                    {t("subscription.cancellation.title")}
                  </Div>
                  <Div>
                    {t("subscription.cancellation.description", {
                      date: initialSubscription.cancelAt
                        ? formatDate(initialSubscription.cancelAt, locale)
                        : appT("common.notAvailable"),
                    })}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          {/* Canceled Info - show for fully canceled subscriptions */}
          {isCanceled && (
            <Div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <Div className="text-sm text-destructive">
                  <Div className="font-semibold mb-1">
                    {t("subscription.canceled.title")}
                  </Div>
                  <Div>{t("subscription.canceled.description")}</Div>
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
                  ? t("subscription.manage.nowpayments.button")
                  : t("subscription.manage.stripe.button")}
              </Button>
            </Div>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
