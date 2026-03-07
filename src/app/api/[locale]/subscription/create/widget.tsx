/**
 * Subscription Create Widget
 * Complete subscription pricing card with billing options and payment provider dialog
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe-ui/ui/dialog";
import { Div } from "next-vibe-ui/ui/div";
import { Bitcoin } from "next-vibe-ui/ui/icons/Bitcoin";
import { Calendar } from "next-vibe-ui/ui/icons/Calendar";
import { CreditCard } from "next-vibe-ui/ui/icons/CreditCard";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Link } from "next-vibe-ui/ui/link";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/agent/models/models";
import {
  PaymentProvider,
  type PaymentProviderValue,
} from "@/app/api/[locale]/payment/enum";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/api/[locale]/subscription/enum";
import { useSubscription } from "@/app/api/[locale]/subscription/hooks";
import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { useTranslation } from "@/i18n/core/client";

import FormAlertWidget from "../../system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import type definition from "./definition";
import type { SubscriptionCreatePostResponseOutput } from "./definition";

/**
 * Props for custom widget
 */
interface CustomWidgetProps {
  field: {
    value: SubscriptionCreatePostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

/**
 * Format price with currency
 */
function formatPrice(price: number, locale: string, currency: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  return formatter.format(price);
}

/**
 * Subscription Create Container Widget
 */
export function SubscriptionCreateContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const { locale } = useTranslation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const logger = useWidgetLogger();
  const user = useWidgetUser();

  // Get current subscription status
  const subscriptionEndpoint = useSubscription(logger, user);
  const currentSubscription = subscriptionEndpoint.read?.data;
  const isLoadingSubscription = subscriptionEndpoint.read?.isLoading ?? true;

  const products = productsRepository.getProducts(locale);
  const subscriptionProduct = products[ProductIds.SUBSCRIPTION];
  const subscriptionPrice = subscriptionProduct.price;
  const subscriptionCredits = subscriptionProduct.credits;
  const yearlyProduct = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
    "year",
  );
  const yearlySubscriptionPrice = yearlyProduct.price;

  const isAuthenticated = !user.isPublic;
  const hasActiveSubscription =
    currentSubscription?.status === SubscriptionStatus.ACTIVE;

  // Billing interval state for pricing display
  const [billingInterval, setBillingInterval] = useState<
    typeof BillingInterval.MONTHLY | typeof BillingInterval.YEARLY
  >(BillingInterval.MONTHLY);

  // Payment provider modal state
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  // Get current subscription price based on billing interval
  const currentSubscriptionPrice =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice
      : subscriptionPrice;

  // Calculate monthly equivalent for yearly subscription
  const monthlyEquivalent =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice / 12
      : subscriptionPrice;

  // Crypto (NOWPayments) requires yearly billing — minimum transaction value.
  const isCryptoDisabled = billingInterval !== BillingInterval.YEARLY;

  const handleSubscribe = (): void => {
    setIsProviderModalOpen(true);
  };

  const handleProviderSelect = (
    provider: typeof PaymentProviderValue,
  ): void => {
    setIsProviderModalOpen(false);

    // Set form values
    form.setValue("plan", SubscriptionPlan.SUBSCRIPTION);
    form.setValue("billingInterval", billingInterval);
    form.setValue("provider", provider);

    // Submit form
    onSubmit?.();
  };

  // Redirect when checkout URL is available
  useEffect(() => {
    if (field.value?.checkoutUrl) {
      window.location.href = field.value.checkoutUrl;
    }
  }, [field.value]);
  return (
    <>
      {/* Payment Provider Selection Modal */}
      <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("checkout.form.fields.provider.label")}
            </DialogTitle>
            <DialogDescription>
              {t("checkout.form.fields.provider.description")}
            </DialogDescription>
          </DialogHeader>
          <Div className="grid gap-4 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => handleProviderSelect(PaymentProvider.STRIPE)}
            >
              <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">{t("buy.provider.stripe")}</Div>
                <Div className="text-sm text-muted-foreground">
                  {t("buy.provider.stripeDescription")}
                </Div>
              </Div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => handleProviderSelect(PaymentProvider.NOWPAYMENTS)}
              disabled={isCryptoDisabled}
            >
              <Bitcoin className="h-6 w-6 text-orange-500 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {t("buy.provider.nowpayments")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {t("buy.provider.nowpaymentsDescription")}
                </Div>
              </Div>
            </Button>
          </Div>
        </DialogContent>
      </Dialog>

      <Card className="relative overflow-hidden border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("buy.subscription.title")}
          </CardTitle>
          <CardDescription>
            {t("buy.subscription.description", {
              subPrice: formatPrice(
                currentSubscriptionPrice,
                locale,
                subscriptionProduct.currency,
              ),
              subCredits: subscriptionCredits,
              modelCount: TOTAL_MODEL_COUNT,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Billing Interval Toggle */}
          <Div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              type="button"
              variant={
                billingInterval === BillingInterval.MONTHLY
                  ? "default"
                  : "ghost"
              }
              size="sm"
              onClick={() => setBillingInterval(BillingInterval.MONTHLY)}
              className="flex-1"
            >
              {t("billing.monthly")}
            </Button>
            <Button
              type="button"
              variant={
                billingInterval === BillingInterval.YEARLY ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setBillingInterval(BillingInterval.YEARLY)}
              className="flex-1"
            >
              {t("billing.yearly")}
            </Button>
          </Div>

          {/* Pricing Display */}
          <Div className="flex flex-col gap-2">
            <Div className="flex items-baseline gap-1">
              <Div className="text-4xl font-bold">
                {formatPrice(
                  currentSubscriptionPrice,
                  locale,
                  subscriptionProduct.currency,
                )}
              </Div>
              <Div className="text-sm text-muted-foreground">
                {billingInterval === BillingInterval.YEARLY
                  ? t("buy.subscription.perYear")
                  : t("buy.subscription.perMonth")}
              </Div>
            </Div>
            {billingInterval === BillingInterval.YEARLY && (
              <Div className="text-sm text-green-600 dark:text-green-400">
                {t("buy.subscription.yearlyEquivalent", {
                  monthlyPrice: formatPrice(
                    monthlyEquivalent,
                    locale,
                    subscriptionProduct.currency,
                  ),
                })}
              </Div>
            )}
          </Div>

          {/* Features */}
          <Div className="flex flex-col gap-3 text-sm">
            <Div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <Span>
                {t("buy.subscription.features.credits", {
                  count: subscriptionCredits,
                })}
              </Span>
            </Div>
            <Div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <Span>
                {t("buy.subscription.features.expiry", {
                  modelCount: TOTAL_MODEL_COUNT,
                })}
              </Span>
            </Div>
            <Div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <Span>{t("buy.subscription.features.bestFor")}</Span>
            </Div>
          </Div>

          {/* Action Button or Form */}
          {!isAuthenticated ? (
            <Div className="flex gap-2">
              <Button variant="ghost" asChild className="flex-1 hidden sm:flex">
                <Link href={`/${locale}/user/login`}>{t("buy.login")}</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-blue-600 bg-linear-to-br from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
                size="lg"
              >
                <Link href={`/${locale}/user/signup`}>{t("buy.signup")}</Link>
              </Button>
            </Div>
          ) : isLoadingSubscription ? null : hasActiveSubscription ? (
            <Div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Div className="text-sm text-green-700 dark:text-green-300">
                {t("buy.subscription.buttonAlreadySubscribed")}
              </Div>
            </Div>
          ) : (
            <>
              <FormAlertWidget field={{}} />
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handleSubscribe}
              >
                {t("buy.subscription.button")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
