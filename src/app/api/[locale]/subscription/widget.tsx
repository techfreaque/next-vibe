/**
 * Subscription Widget
 * Displays subscription information - exact copy of SubscriptionStatusCard
 */

"use client";

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
import { useCustomerPortal } from "@/app/api/[locale]/payment/portal/hooks";
import {
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTranslation } from "@/i18n/core/client";

import type definition from "./definition";
import { SubscriptionStatus } from "./enum";

/**
 * Format date for display
 */
function formatDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale);
}

/**
 * Subscription Overview Container Widget
 */
export function SubscriptionOverviewContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const subscription = useWidgetValue<typeof definition.GET>();
  const { locale } = useTranslation();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const portal = useCustomerPortal(logger, user);

  if (!subscription) {
    return <Div />;
  }

  const isCanceled = subscription.status === SubscriptionStatus.CANCELED;
  const isCanceling = !isCanceled && subscription.cancelAt;

  const getProviderIcon = (provider?: string): JSX.Element => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return <Bitcoin className="h-5 w-5 text-orange-500" />;
    }
    return <CreditCard className="h-5 w-5 text-primary" />;
  };

  const getProviderName = (provider?: string): string => {
    if (provider === PaymentProvider.NOWPAYMENTS) {
      return t("enums.paymentProvider.nowpayments");
    }
    return t("enums.paymentProvider.stripe");
  };

  const handleManageSubscription = async (): Promise<void> => {
    if (subscription.provider === PaymentProvider.NOWPAYMENTS) {
      alert(t("manage.nowpayments.info"));
      return;
    }

    portal.create.setValue(
      "returnUrl",
      `${window.location.origin}/${locale}/subscription`,
    );
    await portal.create.submitForm({
      onSuccess: ({ responseData }) => {
        if (responseData.customerPortalUrl) {
          window.location.href = responseData.customerPortalUrl;
        }
      },
      onError: ({ error }) => {
        alert(
          error.message ?? "Failed to open customer portal. Please try again.",
        );
      },
    });
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
                {t("title")}
              </CardTitle>
              <CardDescription>{t("description")}</CardDescription>
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
                  ? t(subscription.status)
                  : isCanceling
                    ? t("enums.status.canceling")
                    : t(subscription.status)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getProviderIcon(subscription.provider)}
                {getProviderName(subscription.provider)}
              </Badge>
            </Div>
          </Div>
        </CardHeader>
        <CardContent>
          {isCanceled ? (
            <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("canceledOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {subscription.canceledAt
                    ? formatDate(subscription.canceledAt, locale)
                    : subscription.endedAt
                      ? formatDate(subscription.endedAt, locale)
                      : t("notAvailable")}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("endedOn")}
                </Div>
                <Div className="text-lg font-semibold">
                  {subscription.endedAt
                    ? formatDate(subscription.endedAt, locale)
                    : subscription.currentPeriodEnd
                      ? formatDate(subscription.currentPeriodEnd, locale)
                      : t("notAvailable")}
                </Div>
              </Div>
            </Div>
          ) : (
            <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("billingInterval")}
                </Div>
                <Div className="text-lg font-semibold capitalize">
                  {t(subscription.billingInterval)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {t("currentPeriodStart")}
                </Div>
                <Div className="text-lg font-semibold">
                  {formatDate(subscription.currentPeriodStart, locale)}
                </Div>
              </Div>
              <Div className="p-4 rounded-lg bg-accent border">
                <Div className="text-sm text-muted-foreground mb-1">
                  {isCanceling ? t("endsOn") : t("nextBillingDate")}
                </Div>
                <Div className="text-lg font-semibold">
                  {isCanceling
                    ? formatDate(subscription.cancelAt!, locale)
                    : subscription.currentPeriodEnd
                      ? formatDate(subscription.currentPeriodEnd, locale)
                      : t("notAvailable")}
                </Div>
              </Div>
            </Div>
          )}

          {/* Cancellation Warning */}
          {isCanceling && (
            <Div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/30">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <Div className="text-sm text-warning-foreground">
                  <Div className="font-semibold mb-1">
                    {t("cancellation.title")}
                  </Div>
                  <Div>
                    {t("cancellation.description", {
                      date: subscription.cancelAt
                        ? formatDate(subscription.cancelAt, locale)
                        : t("notAvailable"),
                    })}
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          {/* Canceled Info */}
          {isCanceled && (
            <Div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <Div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <Div className="text-sm text-destructive-foreground">
                  <Div className="font-semibold mb-1">
                    {t("canceled.title")}
                  </Div>
                  <Div>{t("canceled.description")}</Div>
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
                {subscription.provider === PaymentProvider.NOWPAYMENTS
                  ? t("manage.nowpayments.button")
                  : t("manage.stripe.button")}
              </Button>
            </Div>
          )}
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
