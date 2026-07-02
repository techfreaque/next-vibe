"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatSimpleDate } from "next-vibe/core/i18n/core/localization-utils";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { assignUrl, getCurrentOrigin } from "next-vibe/ui/web/lib/location";
import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/web/ui/card";
import { Div } from "next-vibe/ui/web/ui/div";
import { AlertCircle } from "next-vibe/ui/web/ui/icons/AlertCircle";
import { Bitcoin } from "next-vibe/ui/web/ui/icons/Bitcoin";
import { CreditCard } from "next-vibe/ui/web/ui/icons/CreditCard";
import { ExternalLink } from "next-vibe/ui/web/ui/icons/ExternalLink";
import type { JSX } from "react";

import { scopedTranslation as appScopedTranslation } from "@/app/[locale]/i18n";
import { scopedTranslation as pageSubscriptionScopedTranslation } from "@/app/[locale]/subscription/i18n";
import { PaymentProvider } from "@/app/api/[locale]/payment/enum";
import { scopedTranslation as paymentScopedTranslation } from "@/app/api/[locale]/payment/i18n";
import { useCustomerPortal } from "@/app/api/[locale]/payment/portal/hooks";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { scopedTranslation as subscriptionScopedTranslation } from "@/app/api/[locale]/subscription/i18n";

interface SubscriptionStatusCardProps {
  locale: CountryLanguage;
  initialSubscription: SubscriptionGetResponseOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
}

export function SubscriptionStatusCard({
  locale,
  initialSubscription,
  user,
  logger,
}: SubscriptionStatusCardProps): JSX.Element {
  const { t } = pageSubscriptionScopedTranslation.scopedT(locale);
  const { t: appT } = appScopedTranslation.scopedT(locale);
  const { t: subscriptionT } = subscriptionScopedTranslation.scopedT(locale);
  const { t: paymentT } = paymentScopedTranslation.scopedT(locale);
  const portal = useCustomerPortal(logger, user);

  const isCanceled = initialSubscription.status === SubscriptionStatus.CANCELED;
  const isCanceling = !isCanceled && initialSubscription.cancelAt;

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
      alert(t("subscription.manage.nowpayments.info"));
      return;
    }

    portal.create.setValue(
      "returnUrl",
      `${getCurrentOrigin()}/${locale}/subscription`,
    );
    await portal.create.submitForm({
      onSuccess: ({ responseData }) => {
        if (responseData.customerPortalUrl) {
          assignUrl(responseData.customerPortalUrl);
        }
      },
      onError: ({ error }) => {
        alert(error.message ?? t("subscription.manage.portal.error"));
      },
    });
  };

  return (
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
                  ? formatSimpleDate(
                      new Date(initialSubscription.canceledAt),
                      locale,
                    )
                  : initialSubscription.endedAt
                    ? formatSimpleDate(
                        new Date(initialSubscription.endedAt),
                        locale,
                      )
                    : appT("common.notAvailable")}
              </Div>
            </Div>
            <Div className="p-4 rounded-lg bg-accent border">
              <Div className="text-sm text-muted-foreground mb-1">
                {t("subscription.endedOn")}
              </Div>
              <Div className="text-lg font-semibold">
                {initialSubscription.endedAt
                  ? formatSimpleDate(
                      new Date(initialSubscription.endedAt),
                      locale,
                    )
                  : initialSubscription.currentPeriodEnd
                    ? formatSimpleDate(
                        new Date(initialSubscription.currentPeriodEnd),
                        locale,
                      )
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
                {formatSimpleDate(
                  new Date(initialSubscription.currentPeriodStart),
                  locale,
                )}
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
                  ? formatSimpleDate(
                      new Date(initialSubscription.cancelAt!),
                      locale,
                    )
                  : initialSubscription.currentPeriodEnd
                    ? formatSimpleDate(
                        new Date(initialSubscription.currentPeriodEnd),
                        locale,
                      )
                    : appT("common.notAvailable")}
              </Div>
            </Div>
          </Div>
        )}

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
                      ? formatSimpleDate(
                          new Date(initialSubscription.cancelAt),
                          locale,
                        )
                      : appT("common.notAvailable"),
                  })}
                </Div>
              </Div>
            </Div>
          </Div>
        )}

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
  );
}
