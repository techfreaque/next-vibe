import { MotionDiv } from "next-vibe-ui/ui/motion";
import { useState } from "react";
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
import { Button } from "next-vibe-ui/ui/button";
import type { JSX } from "react";
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
import { Span } from "next-vibe-ui/ui/span";
import { useTranslation } from "@/i18n/core/client";
import { useCreditPurchase } from "@/app/api/[locale]/v1/core/credits/hooks";
import purchaseDefinitions from "@/app/api/[locale]/v1/core/credits/purchase/definition";
import { useSubscriptionCheckout } from "@/app/api/[locale]/v1/core/payment/checkout/hooks";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/api/[locale]/v1/core/subscription/enum";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import {
  type PaymentProviderValue,
  PaymentProvider,
} from "@/app/api/[locale]/v1/core/payment/enum";
import { formatPrice } from "./types";
import { TOTAL_MODEL_COUNT } from "@/app/api/[locale]/v1/core/products/repository-client";

interface BuyCreditsTabProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  initialSubscription: SubscriptionGetResponseOutput | null;
  subscriptionPrice: number;
  subscriptionCredits: number;
  packPrice: number;
  packCredits: number;
}

export function BuyCreditsTab({
  locale,
  isAuthenticated,
  initialSubscription,
  subscriptionPrice,
  subscriptionCredits,
  packPrice,
  packCredits,
}: BuyCreditsTabProps): JSX.Element {
  const { t } = useTranslation();

  // Modal and provider state
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"subscription" | "credits">(
    "subscription",
  );

  // Initialize hooks
  const logger = createEndpointLogger(false, Date.now(), locale);
  const subscriptionCheckoutEndpoint = useSubscriptionCheckout(logger);
  const creditPurchaseEndpoint = useCreditPurchase(logger);

  const handleSubscribe = (): void => {
    setModalType("subscription");
    setIsProviderModalOpen(true);
  };

  const handleBuyCredits = (): void => {
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
        billingInterval: BillingInterval.MONTHLY,
        provider: provider,
      });

      void subscriptionCheckoutEndpoint.create.submitForm(undefined);
    } else {
      if (!creditPurchaseEndpoint.create) {
        return;
      }

      creditPurchaseEndpoint.create.form.setValue("provider", provider);
      void creditPurchaseEndpoint.create.submitForm(undefined);
    }
  };

  return (
    <>
      {/* Payment Provider Selection Modal */}
      <Dialog open={isProviderModalOpen} onOpenChange={setIsProviderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t(
                "app.api.v1.core.subscription.checkout.form.fields.provider.label",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                "app.api.v1.core.subscription.checkout.form.fields.provider.description",
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
                  {t("app.api.v1.core.payment.enums.paymentProvider.stripe")}
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
            >
              <Bitcoin className="h-6 w-6 text-orange-500 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {t(
                    "app.api.v1.core.payment.enums.paymentProvider.nowpayments",
                  )}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {t(
                    "app.subscription.subscription.buy.provider.nowpayments.description",
                  )}
                </Div>
              </Div>
            </Button>
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
                subPrice: formatPrice(subscriptionPrice, locale),
                subCredits: subscriptionCredits,
                modelCount: TOTAL_MODEL_COUNT,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Div className="flex items-baseline gap-1">
              <Div className="text-4xl font-bold">
                {formatPrice(subscriptionPrice, locale)}
              </Div>
              <Div className="text-sm text-muted-foreground">
                {t("app.subscription.subscription.buy.subscription.perMonth")}
              </Div>
            </Div>

            <Div className="flex flex-col gap-3 text-sm">
              <Div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.subscription.features.credits",
                    { count: subscriptionCredits },
                  )}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600" />
                <Span>
                  {t(
                    "app.subscription.subscription.buy.subscription.features.expiry",
                    { modelCount: TOTAL_MODEL_COUNT },
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
                  className="flex-1 bg-blue-600 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 hover:from-cyan-600 hover:to-blue-700"
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
                      endpointFields={purchaseDefinitions.POST.fields}
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
