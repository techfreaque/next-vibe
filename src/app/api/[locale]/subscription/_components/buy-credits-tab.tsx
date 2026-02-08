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
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import {
  AlertCircle,
  Bitcoin,
  Calendar,
  CreditCard,
  Info,
  Sparkles,
  TrendingUp,
  Zap,
} from "next-vibe-ui/ui/icons";
import { Link } from "next-vibe-ui/ui/link";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import { useCreditPurchase } from "@/app/api/[locale]/credits/hooks";
import purchaseDefinitions from "@/app/api/[locale]/credits/purchase/definition";
import { useSubscriptionCheckout } from "@/app/api/[locale]/payment/checkout/hooks";
import {
  PaymentProvider,
  type PaymentProviderValue,
} from "@/app/api/[locale]/payment/enum";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/api/[locale]/subscription/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { TOTAL_MODEL_COUNT } from "../../agent/models/models";
import type { JwtPayloadType } from "../../user/auth/types";
import { formatPrice } from "./types";

interface BuyCreditsTabProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  initialSubscription: SubscriptionGetResponseOutput | null;
  subscriptionPrice: number;
  subscriptionCredits: number;
  packPrice: number;
  packCredits: number;
  yearlySubscriptionPrice: number;
  user: JwtPayloadType;
}

export function BuyCreditsTab({
  locale,
  isAuthenticated,
  initialSubscription,
  subscriptionPrice,
  subscriptionCredits,
  packPrice,
  packCredits,
  yearlySubscriptionPrice,
  user,
}: BuyCreditsTabProps): JSX.Element {
  const { t } = useTranslation();

  // Modal and provider state
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"subscription" | "credits">(
    "subscription",
  );
  const [billingInterval, setBillingInterval] = useState<
    typeof BillingInterval.MONTHLY | typeof BillingInterval.YEARLY
  >(BillingInterval.MONTHLY);

  // Initialize hooks
  const logger = createEndpointLogger(false, Date.now(), locale);
  const subscriptionCheckoutEndpoint = useSubscriptionCheckout(logger, user);
  const creditPurchaseEndpoint = useCreditPurchase(user, logger);

  const handleSubscribe = (): void => {
    setModalType("subscription");
    setIsProviderModalOpen(true);
  };

  const handleBuyCredits = (): void => {
    // Check if quantity is sufficient for crypto (minimum 4 packs)
    if (creditPurchaseEndpoint.create) {
      const quantity =
        creditPurchaseEndpoint.create.form.getValues("quantity") || 1;
      // Ensure minimum quantity is met
      if (quantity < 1) {
        creditPurchaseEndpoint.create.form.setValue("quantity", 1);
      }
    }
    setModalType("credits");
    setIsProviderModalOpen(true);
  };

  const handleProviderSelect = (
    provider: typeof PaymentProviderValue,
  ): void => {
    setIsProviderModalOpen(false);

    if (modalType === "subscription") {
      if (!subscriptionCheckoutEndpoint.create) {
        return;
      }

      subscriptionCheckoutEndpoint.create.form.reset({
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: billingInterval,
        provider: provider,
      });

      void subscriptionCheckoutEndpoint.create.onSubmit();
    } else {
      if (!creditPurchaseEndpoint.create) {
        return;
      }

      creditPurchaseEndpoint.create.form.setValue("provider", provider);
      void creditPurchaseEndpoint.create.onSubmit();
    }
  };

  // Check if crypto payments are disabled
  const isCryptoDisabled =
    modalType === "subscription" && billingInterval === BillingInterval.MONTHLY;

  // Check if crypto is disabled for credit packs (below minimum)
  const creditQuantity =
    creditPurchaseEndpoint.create?.form.watch("quantity") || 1;
  const isCryptoDisabledForCredits =
    modalType === "credits" && creditQuantity < 5;

  // Get current subscription price based on billing interval
  const currentSubscriptionPrice =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice
      : subscriptionPrice;

  // Calculate monthly price for yearly subscription
  const monthlyEquivalent =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice / 12
      : subscriptionPrice;

  return (
    <>
      {/* Payment Provider Selection Modal */}
      <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("app.api.subscription.checkout.form.fields.provider.label")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "app.api.subscription.checkout.form.fields.provider.description",
              )}
            </DialogDescription>
          </DialogHeader>
          <Div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => handleProviderSelect(PaymentProvider.STRIPE)}
            >
              <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {t("app.api.payment.enums.paymentProvider.stripe")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {t(
                    "app.subscription.subscription.buy.provider.stripe.description",
                  )}
                </Div>
              </Div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => handleProviderSelect(PaymentProvider.NOWPAYMENTS)}
              disabled={isCryptoDisabled || isCryptoDisabledForCredits}
            >
              <Bitcoin className="h-6 w-6 text-orange-500 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {t("app.api.payment.enums.paymentProvider.nowpayments")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {t(
                    "app.subscription.subscription.buy.provider.nowpayments.description",
                  )}
                </Div>
              </Div>
            </Button>
            {isCryptoDisabled && (
              <Div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Div className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <Span>
                    {t(
                      "app.subscription.subscription.buy.provider.cryptoMonthlyDisabled",
                    )}
                  </Span>
                </Div>
              </Div>
            )}
            {isCryptoDisabledForCredits && (
              <Div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Div className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <Span>
                    {t(
                      "app.subscription.subscription.buy.provider.cryptoMinimumPacks",
                      {
                        minPacks: 5,
                        minValue: formatPrice(packPrice * 5, locale),
                      },
                    )}
                  </Span>
                </Div>
              </Div>
            )}
          </Div>
        </DialogContent>
      </Dialog>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Subscription Option */}
        <Card className="relative overflow-hidden border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("app.subscription.subscription.buy.subscription.title")}
            </CardTitle>
            <CardDescription>
              {t("app.subscription.subscription.buy.subscription.description", {
                subPrice: formatPrice(currentSubscriptionPrice, locale),
                subCredits: subscriptionCredits,
                modelCount: TOTAL_MODEL_COUNT,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Billing Interval Toggle */}
            <Div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={
                  billingInterval === BillingInterval.MONTHLY
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={() => setBillingInterval(BillingInterval.MONTHLY)}
                className="flex-1"
              >
                {t("app.api.subscription.billing.monthly")}
              </Button>
              <Button
                variant={
                  billingInterval === BillingInterval.YEARLY
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={() => setBillingInterval(BillingInterval.YEARLY)}
                className="flex-1"
              >
                {t("app.api.subscription.billing.yearly")}
              </Button>
            </Div>

            <Div className="flex flex-col gap-2">
              <Div className="flex items-baseline gap-1">
                <Div className="text-4xl font-bold">
                  {formatPrice(currentSubscriptionPrice, locale)}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {billingInterval === BillingInterval.YEARLY
                    ? t(
                        "app.subscription.subscription.buy.subscription.perYear",
                      )
                    : t(
                        "app.subscription.subscription.buy.subscription.perMonth",
                      )}
                </Div>
              </Div>
              {billingInterval === BillingInterval.YEARLY && (
                <Div className="text-sm text-green-600 dark:text-green-400">
                  {t(
                    "app.subscription.subscription.buy.subscription.yearlyEquivalent",
                    {
                      monthlyPrice: formatPrice(monthlyEquivalent, locale),
                    },
                  )}
                </Div>
              )}
            </Div>

            <Div className="flex flex-col gap-3 text-sm">
              <Div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.subscription.features.credits",
                    {
                      count: subscriptionCredits,
                    },
                  )}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.subscription.features.expiry",
                    {
                      modelCount: TOTAL_MODEL_COUNT,
                    },
                  )}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.subscription.features.bestFor",
                  )}
                </Span>
              </Div>
            </Div>

            {!isAuthenticated ? (
              <Div className="flex gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="flex-1 hidden sm:flex"
                >
                  <Link href={`/${locale}/user/login`}>
                    {t("app.story._components.nav.user.login")}
                  </Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-blue-600 bg-linear-to-br from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
                  size="lg"
                >
                  <Link href={`/${locale}/user/signup`}>
                    {t("app.story._components.nav.user.signup")}
                  </Link>
                </Button>
              </Div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubscribe}
                disabled={
                  subscriptionCheckoutEndpoint.create?.isSubmitting ||
                  initialSubscription?.status === SubscriptionStatus.ACTIVE
                }
              >
                {subscriptionCheckoutEndpoint.create?.isSubmitting
                  ? "Loading..."
                  : initialSubscription?.status === SubscriptionStatus.ACTIVE
                    ? t(
                        "app.subscription.subscription.buy.subscription.buttonAlreadySubscribed",
                      )
                    : t(
                        "app.subscription.subscription.buy.subscription.button",
                      )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Credit Pack Option */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("app.subscription.subscription.buy.pack.title")}
            </CardTitle>
            <CardDescription>
              {t("app.subscription.subscription.buy.pack.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Div className="flex items-baseline gap-1">
              <Div className="text-4xl font-bold">
                {formatPrice(packPrice, locale)}
              </Div>
              <Div className="text-sm text-muted-foreground">
                {t("app.subscription.subscription.buy.pack.perPack")}
              </Div>
            </Div>

            <Div className="flex flex-col gap-3 text-sm">
              <Div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-600" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.pack.features.credits",
                    {
                      count: packCredits,
                    },
                  )}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <Span>
                  {t("app.subscription.subscription.buy.pack.features.expiry")}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <Span>
                  {t("app.subscription.subscription.buy.pack.features.bestFor")}
                </Span>
              </Div>
            </Div>

            {/* Quantity Selector Form - Only show for active subscribers */}
            {creditPurchaseEndpoint.create &&
              initialSubscription?.status === SubscriptionStatus.ACTIVE && (
                <Form
                  form={creditPurchaseEndpoint.create.form}
                  onSubmit={creditPurchaseEndpoint.create.onSubmit}
                  className="flex flex-col gap-3"
                >
                  <Div className="w-full">
                    <EndpointFormField
                      name="quantity"
                      control={creditPurchaseEndpoint.create.form.control}
                      endpoint={purchaseDefinitions.POST}
                      locale={locale}
                      theme={{
                        style: "none",
                        showAllRequired: false,
                      }}
                    />
                  </Div>

                  <Button
                    type="button"
                    onClick={handleBuyCredits}
                    className="w-full"
                    size="lg"
                    variant="outline"
                    disabled={creditPurchaseEndpoint.create.isSubmitting}
                  >
                    {creditPurchaseEndpoint.create.isSubmitting
                      ? "Loading..."
                      : t(
                          "app.subscription.subscription.buy.pack.button.submit",
                        )}
                  </Button>
                </Form>
              )}

            {/* Message for non-subscribers */}
            {(!initialSubscription ||
              initialSubscription.status !== SubscriptionStatus.ACTIVE) && (
              <Div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <Div className="text-sm text-amber-700 dark:text-amber-300">
                  <Info className="h-4 w-4 inline mr-2" />
                  {t(
                    "app.subscription.subscription.buy.pack.requiresSubscription",
                  )}
                </Div>
              </Div>
            )}
          </CardContent>
        </Card>
      </MotionDiv>
    </>
  );
}
