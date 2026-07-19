"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-context";
import { getAvailableModelCount } from "next-vibe/agent/models/all-models";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import { assignUrl } from "next-vibe/ui/lib/location";
import { Button } from "next-vibe/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/ui/dialog";
import { Div } from "next-vibe/ui/ui/div";
import { AlertCircle } from "next-vibe/ui/ui/icons/AlertCircle";
import { Bitcoin } from "next-vibe/ui/ui/icons/Bitcoin";
import { Calendar } from "next-vibe/ui/ui/icons/Calendar";
import { Coins } from "next-vibe/ui/ui/icons/Coins";
import { CreditCard } from "next-vibe/ui/ui/icons/CreditCard";
import { Database } from "next-vibe/ui/ui/icons/Database";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/ui/icons/ExternalLink";
import { Info } from "next-vibe/ui/ui/icons/Info";
import { Minus } from "next-vibe/ui/ui/icons/Minus";
import { Plus } from "next-vibe/ui/ui/icons/Plus";
import { Sparkles } from "next-vibe/ui/ui/icons/Sparkles";
import { TrendingUp } from "next-vibe/ui/ui/icons/TrendingUp";
import { Zap } from "next-vibe/ui/ui/icons/Zap";
import { ExternalLink, Link } from "next-vibe/ui/ui/link";
import { Span } from "next-vibe/ui/ui/span";
import { H3 } from "next-vibe/ui/ui/typography";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import adminAddDefinitions from "@/credits/admin-add/definition";
import { CreditsTabHeader } from "@/credits/credits-tab-header";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import publicCapDefinitions from "@/credits/public-cap/definition";
import { scopedTranslation as publicCapScopedTranslation } from "@/credits/public-cap/i18n";
import purchaseDefinitions from "@/credits/purchase/definition";
import { scopedTranslation as purchaseScopedTranslation } from "@/credits/purchase/i18n";
import { PaymentProvider, type PaymentProviderValue } from "@/payment/enum";
import { ProductIds, productsRepository } from "@/products/platform-products";

import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "../enum";
import { useSubscription } from "../hooks";
import type definition from "./definition";

const MIN_QTY = 1;
const MIN_QTY_CRYPTO = 5;

function formatPrice(price: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    price,
  );
}

function usageColor(percent: number): string {
  return percent >= 90
    ? "text-destructive"
    : percent >= 70
      ? "text-warning"
      : "text-success";
}

export function SubscriptionCreateContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const subValue = useWidgetValue<typeof definition.POST>();

  const { locale: currentLocale } = useTranslation();
  const { t: tCredits } = creditsScopedTranslation.scopedT(currentLocale);
  const { t: tCap } = publicCapScopedTranslation.scopedT(currentLocale);
  const { t: tPurchase } = purchaseScopedTranslation.scopedT(currentLocale);

  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const isAuthenticated = !user.isPublic;
  const availability = useProviderAvailability();
  const totalModelCount = getAvailableModelCount(isAdmin, availability);

  const subscriptionEndpoint = useSubscription(logger, user);
  const currentSubscription = subscriptionEndpoint.read?.data;
  const isLoadingSubscription = subscriptionEndpoint.read?.isLoading ?? false;
  const hasActiveSubscription =
    currentSubscription?.status === SubscriptionStatus.ACTIVE;

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
  const packProduct = products[ProductIds.CREDIT_PACK];
  const packPrice = packProduct.price;
  const packCredits = packProduct.credits;

  const [billingInterval, setBillingInterval] = useState<
    typeof BillingInterval.MONTHLY | typeof BillingInterval.YEARLY
  >(BillingInterval.MONTHLY);
  const [isSubProviderModalOpen, setIsSubProviderModalOpen] = useState(false);
  const [isPackProviderModalOpen, setIsPackProviderModalOpen] = useState(false);

  const currentSubscriptionPrice =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice
      : subscriptionPrice;
  const monthlyEquivalent =
    billingInterval === BillingInterval.YEARLY
      ? yearlySubscriptionPrice / 12
      : subscriptionPrice;
  const isCryptoSubDisabled = billingInterval !== BillingInterval.YEARLY;

  // Subscription submit — uses widget's own form/submit from context
  useEffect(() => {
    if (subValue?.checkoutUrl) {
      assignUrl(subValue.checkoutUrl);
    }
  }, [subValue?.checkoutUrl]);

  const handleSubscribe = (): void => {
    setIsSubProviderModalOpen(true);
  };

  const handleSubProviderSelect = (
    provider: typeof PaymentProviderValue,
  ): void => {
    setIsSubProviderModalOpen(false);
    form.setValue("plan", SubscriptionPlan.SUBSCRIPTION, { shouldDirty: true });
    form.setValue("billingInterval", billingInterval, { shouldDirty: true });
    form.setValue("provider", provider, { shouldDirty: true });
    onSubmit?.();
  };

  // Admin-add credits endpoint
  const adminAddEndpoint = useEndpoint(
    adminAddDefinitions,
    isAdmin
      ? {
          create: {
            formOptions: {
              defaultValues: {
                targetUserId: "id" in user && user.id ? user.id : "",
                amount: 100,
              },
            },
          },
        }
      : {},
    logger,
    user,
  );
  const adminForm = adminAddEndpoint.create?.form;
  const adminSubmit = adminAddEndpoint.create?.onSubmit;
  const adminResponse = adminAddEndpoint.create?.response;
  const adminValue =
    adminResponse?.success === true ? adminResponse.data : undefined;
  const adminIsSubmitting = adminAddEndpoint.create?.isSubmitting ?? false;
  const adminAmount = adminForm?.watch("amount") ?? 100;
  const adminTargetUserId = adminForm?.watch("targetUserId");
  const isSelf =
    !adminTargetUserId || ("id" in user && user.id === adminTargetUserId);

  function setAdminAmount(next: number): void {
    adminForm?.setValue("amount", Math.max(1, next), { shouldValidate: true });
  }

  // Public cap read
  const publicCapEndpoint = useEndpoint(
    publicCapDefinitions,
    { read: { queryOptions: { enabled: isAdmin } } },
    logger,
    user,
  );
  const capData = publicCapEndpoint.read?.data;
  const spendToday = capData?.spendToday ?? 0;
  const capAmount = capData?.capAmount ?? 0;
  const remainingToday = capData?.remainingToday ?? 0;
  const percentUsed = capData?.percentUsed ?? 0;
  const capExceeded = capData?.capExceeded ?? false;

  // Public cap update
  const publicCapUpdateEndpoint = useEndpoint(
    publicCapDefinitions,
    { create: { formOptions: { defaultValues: { capAmount: 500 } } } },
    logger,
    user,
  );
  const capForm = publicCapUpdateEndpoint.create?.form;
  const capSubmit = publicCapUpdateEndpoint.create?.onSubmit;
  const capPostResponse = publicCapUpdateEndpoint.create?.response;
  const capPostValue =
    capPostResponse?.success === true ? capPostResponse.data : undefined;
  const capAmount2 = capForm?.watch("capAmount") || 500;

  function setCapAmount(next: number): void {
    capForm?.setValue("capAmount", Math.max(1, next), { shouldValidate: true });
  }

  // Purchase credit pack
  const purchaseEndpoint = useEndpoint(purchaseDefinitions, {}, logger, user);
  const packForm = purchaseEndpoint.create?.form;
  const packSubmit = purchaseEndpoint.create?.onSubmit;
  const packResponse = purchaseEndpoint.create?.response;
  const packValue =
    packResponse?.success === true ? packResponse.data : undefined;
  const packIsSubmitting = purchaseEndpoint.create?.isSubmitting ?? false;
  const packQty = packForm?.watch("quantity") ?? 1;
  const isCryptoPackDisabled = packQty < MIN_QTY_CRYPTO;
  const totalPrice = packPrice * packQty;
  const totalCredits = packCredits * packQty;

  function setPackQty(next: number): void {
    packForm?.setValue("quantity", Math.max(MIN_QTY, next), {
      shouldValidate: true,
    });
  }

  const handlePackBuy = (): void => {
    setIsPackProviderModalOpen(true);
  };

  const handlePackProviderSelect = (
    provider: typeof PaymentProviderValue,
  ): void => {
    setIsPackProviderModalOpen(false);
    packForm?.setValue("provider", provider);
    void packSubmit?.();
  };

  useEffect(() => {
    if (packValue?.checkoutUrl) {
      assignUrl(packValue.checkoutUrl);
    }
  }, [packValue?.checkoutUrl]);

  return (
    <WidgetShell>
      <CreditsTabHeader activeTab="buy" />

      {/* Subscription provider modal */}
      <Dialog
        open={isSubProviderModalOpen}
        onOpenChange={setIsSubProviderModalOpen}
      >
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
              onClick={() => handleSubProviderSelect(PaymentProvider.STRIPE)}
            >
              <CreditCard className="h-6 w-6 text-primary mr-3" />
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
              onClick={() =>
                handleSubProviderSelect(PaymentProvider.NOWPAYMENTS)
              }
              disabled={isCryptoSubDisabled}
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
            {isCryptoSubDisabled && (
              <Div className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/15 p-3 text-sm text-warning">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                {t("buy.provider.cryptoMonthlyDisabled")}
              </Div>
            )}
          </Div>
        </DialogContent>
      </Dialog>

      {/* Pack provider modal */}
      <Dialog
        open={isPackProviderModalOpen}
        onOpenChange={setIsPackProviderModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tPurchase("post.provider.label")}</DialogTitle>
            <DialogDescription>
              {tPurchase("post.provider.description")}
            </DialogDescription>
          </DialogHeader>
          <Div className="grid gap-4 py-4">
            <Button
              type="button"
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() => handlePackProviderSelect(PaymentProvider.STRIPE)}
            >
              <CreditCard className="h-6 w-6 text-primary mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {tPurchase("post.provider.stripe")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {tPurchase("post.provider.stripeDescription")}
                </Div>
              </Div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto p-4 justify-start"
              onClick={() =>
                handlePackProviderSelect(PaymentProvider.NOWPAYMENTS)
              }
              disabled={isCryptoPackDisabled}
            >
              <Bitcoin className="h-6 w-6 text-orange-500 mr-3" />
              <Div className="text-left">
                <Div className="font-semibold">
                  {tPurchase("post.provider.nowpayments")}
                </Div>
                <Div className="text-sm text-muted-foreground">
                  {tPurchase("post.provider.nowpaymentsDescription")}
                </Div>
              </Div>
            </Button>
            {isCryptoPackDisabled && (
              <Div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                {tPurchase("post.provider.cryptoMinimumDisabled", {
                  min: MIN_QTY_CRYPTO,
                })}
              </Div>
            )}
          </Div>
        </DialogContent>
      </Dialog>

      {/* Admin tools */}
      {isAdmin && (
        <>
          {/* Admin-add credits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                {isSelf
                  ? tCredits("adminAdd.post.container.selfTitle")
                  : tCredits("adminAdd.post.container.title")}
              </CardTitle>
              <CardDescription>
                {isSelf
                  ? tCredits("adminAdd.post.container.selfDescription")
                  : tCredits("adminAdd.post.container.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormAlertWidget field={{}} />
              {adminValue?.message && (
                <Div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success-foreground">
                  {adminValue.message}
                </Div>
              )}
              <Div className="flex flex-col gap-2">
                <Span className="text-sm font-medium text-muted-foreground">
                  {tCredits("adminAdd.post.amount.label")}
                </Span>
                <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-14 w-14 rounded-none border-r border-border flex-shrink-0"
                    onClick={() => setAdminAmount(adminAmount - 100)}
                    disabled={adminAmount <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
                    <Span className="text-2xl font-bold tabular-nums">
                      {adminAmount}
                    </Span>
                    <Span className="text-xs text-muted-foreground">
                      credits
                    </Span>
                  </Div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-14 w-14 rounded-none border-l border-border flex-shrink-0"
                    onClick={() => setAdminAmount(adminAmount + 100)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </Div>
              </Div>
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => void adminSubmit?.()}
                disabled={adminIsSubmitting}
              >
                {tCredits("adminAdd.post.container.selfTitle")}
              </Button>
            </CardContent>
          </Card>

          {/* Public cap status */}
          <Card className={capExceeded ? "border-destructive" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                {tCap("get.container.title")}
              </CardTitle>
              <CardDescription>
                {tCap("get.container.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Div className="flex flex-col gap-2">
                <Div className="flex justify-between text-sm">
                  <Span className="text-muted-foreground">
                    {tCap("get.spendToday.content")}:{" "}
                    <Span className="font-semibold text-foreground">
                      {spendToday.toLocaleString()}
                    </Span>
                  </Span>
                  <Span className="text-muted-foreground">
                    {tCap("get.capAmount.content")}:{" "}
                    <Span className="font-semibold text-foreground">
                      {capAmount.toLocaleString()}
                    </Span>
                  </Span>
                </Div>
                <Div className="flex justify-between text-xs text-muted-foreground">
                  <Span className={`font-semibold ${usageColor(percentUsed)}`}>
                    {percentUsed.toFixed(1)}% {tCap("get.percentUsed.content")}
                  </Span>
                  {capExceeded ? (
                    <Span className="text-destructive font-medium">
                      {tCap("get.capExceeded.content")}
                    </Span>
                  ) : (
                    <Span>
                      {tCap("get.remainingToday.content")}:{" "}
                      {remainingToday.toLocaleString()}
                    </Span>
                  )}
                </Div>
              </Div>
              <Div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: tCap("get.spendToday.content"),
                    value: spendToday.toLocaleString(),
                    color: "text-warning",
                    bg: "bg-warning/10",
                  },
                  {
                    label: tCap("get.remainingToday.content"),
                    value: remainingToday.toLocaleString(),
                    color: "text-success",
                    bg: "bg-success/10",
                  },
                  {
                    label: tCap("get.capAmount.content"),
                    value: capAmount.toLocaleString(),
                    color: "text-info",
                    bg: "bg-info/10",
                  },
                ].map((stat) => (
                  <Div
                    key={stat.label}
                    className={`flex flex-col items-center p-3 rounded-lg ${stat.bg} gap-1`}
                  >
                    <H3 className={`text-xl font-bold ${stat.color}`}>
                      {stat.value}
                    </H3>
                    <Span className="text-xs text-muted-foreground text-center">
                      {stat.label}
                    </Span>
                  </Div>
                ))}
              </Div>
            </CardContent>
          </Card>

          {/* Public cap update */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                {tCap("post.title")}
              </CardTitle>
              <CardDescription>{tCap("post.description")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormAlertWidget field={{}} />
              {capPostValue?.message && (
                <Div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success-foreground">
                  {capPostValue.message}
                </Div>
              )}
              <Div className="flex flex-col gap-2">
                <Span className="text-sm font-medium text-muted-foreground">
                  {tCap("post.capAmount.label")}
                </Span>
                <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-14 w-14 rounded-none border-r border-border flex-shrink-0"
                    onClick={() => setCapAmount(capAmount2 - 100)}
                    disabled={capAmount2 <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
                    <Span className="text-2xl font-bold tabular-nums">
                      {capAmount2.toLocaleString()}
                    </Span>
                    <Span className="text-xs text-muted-foreground">
                      credits/day
                    </Span>
                  </Div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="h-14 w-14 rounded-none border-l border-border flex-shrink-0"
                    onClick={() => setCapAmount(capAmount2 + 100)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </Div>
              </Div>
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => void capSubmit?.()}
              >
                {tCap("post.title")}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Subscription + Credit Pack grid */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscription card */}
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
                modelCount: totalModelCount,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
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
                  billingInterval === BillingInterval.YEARLY
                    ? "default"
                    : "ghost"
                }
                size="sm"
                onClick={() => setBillingInterval(BillingInterval.YEARLY)}
                className="flex-1"
              >
                {t("billing.yearly")}
              </Button>
            </Div>
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
                <Div className="text-sm text-success">
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
                <Calendar className="h-4 w-4 text-warning" />
                <Span>
                  {t("buy.subscription.features.expiry", {
                    modelCount: totalModelCount,
                  })}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <Span>{t("buy.subscription.features.bestFor")}</Span>
              </Div>
            </Div>
            {!isAuthenticated ? (
              <Div className="flex gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="flex-1 hidden sm:flex"
                >
                  <Link href={`/${locale}/user/login`}>{t("buy.login")}</Link>
                </Button>
                <Button asChild className="flex-1" size="lg">
                  <Link href={`/${locale}/user/signup`}>{t("buy.signup")}</Link>
                </Button>
              </Div>
            ) : isLoadingSubscription ? null : hasActiveSubscription ? (
              <Div className="p-3 rounded-lg bg-success/10 border border-success/30">
                <Div className="text-sm text-success-foreground">
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

        {/* Credit pack card */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">
              {tPurchase("post.pack.title")}
            </CardTitle>
            <CardDescription>
              {tPurchase("post.pack.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Div className="flex items-baseline gap-1">
              <Div className="text-4xl font-bold">
                {formatPrice(packPrice, locale, packProduct.currency)}
              </Div>
              <Div className="text-sm text-muted-foreground">
                {tPurchase("post.pack.perPack")}
              </Div>
            </Div>
            <Div className="flex flex-col gap-3 text-sm">
              <Div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-success" />
                <Span>
                  {tPurchase("post.pack.features.credits", {
                    count: packCredits,
                  })}
                </Span>
              </Div>
              <Div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-success" />
                <Span>{tPurchase("post.pack.features.expiry")}</Span>
              </Div>
              <Div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-info" />
                <Span>{tPurchase("post.pack.features.bestFor")}</Span>
              </Div>
            </Div>
            {hasActiveSubscription ? (
              <Div className="flex flex-col gap-4">
                <FormAlertWidget field={{}} />
                <Div className="flex flex-col gap-2">
                  <Span className="text-sm font-medium text-muted-foreground">
                    {tPurchase("post.quantity.label")}
                  </Span>
                  <Div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      className="h-14 w-14 rounded-none border-r border-border flex-shrink-0"
                      onClick={() => setPackQty(packQty - 1)}
                      disabled={packQty <= MIN_QTY}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <Div className="flex-1 flex flex-col items-center justify-center h-14 select-none">
                      <Span className="text-2xl font-bold tabular-nums">
                        {packQty}
                      </Span>
                      <Span className="text-xs text-muted-foreground">
                        {packQty === 1 ? "pack" : "packs"}
                      </Span>
                    </Div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      className="h-14 w-14 rounded-none border-l border-border flex-shrink-0"
                      onClick={() => setPackQty(packQty + 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </Div>
                  {packQty > 1 && (
                    <Div className="text-sm text-muted-foreground px-1">
                      {tPurchase("post.pack.totalSummary", {
                        totalCredits: totalCredits.toLocaleString(locale),
                        totalPrice: formatPrice(
                          totalPrice,
                          locale,
                          packProduct.currency,
                        ),
                      })}
                    </Div>
                  )}
                </Div>
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handlePackBuy}
                  disabled={packIsSubmitting}
                >
                  {tPurchase("post.submit.text")}
                </Button>
                {packValue?.checkoutUrl && (
                  <Div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <Div className="text-sm font-medium mb-2">
                      {tPurchase("post.redirecting")}
                    </Div>
                    <Button variant="outline" className="w-full" asChild>
                      <ExternalLink
                        href={packValue.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                        {tPurchase("post.openCheckout")}
                      </ExternalLink>
                    </Button>
                  </Div>
                )}
              </Div>
            ) : (
              <Div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
                <Div className="text-sm text-warning">
                  <Info className="h-4 w-4 inline mr-2" />
                  {tPurchase("post.pack.requiresSubscription")}
                </Div>
              </Div>
            )}
          </CardContent>
        </Card>
      </Div>
    </WidgetShell>
  );
}
