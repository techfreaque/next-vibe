"use client";

import { useProviderAvailability } from "next-vibe/agent/env-availability-store";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import { useTranslation } from "next-vibe/core/i18n/core/client";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Button } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { AlertCircle } from "next-vibe/ui/components/icons/AlertCircle";
import { Bitcoin } from "next-vibe/ui/components/icons/Bitcoin";
import { Coins } from "next-vibe/ui/components/icons/Coins";
import { CreditCard } from "next-vibe/ui/components/icons/CreditCard";
import { Database } from "next-vibe/ui/components/icons/Database";
import { ExternalLink as ExternalLinkIcon } from "next-vibe/ui/components/icons/ExternalLink";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Lock } from "next-vibe/ui/components/icons/Lock";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Sparkles } from "next-vibe/ui/components/icons/Sparkles";
import { ExternalLink } from "next-vibe/ui/components/link";
import { Skeleton } from "next-vibe/ui/components/skeleton";
import { Span } from "next-vibe/ui/components/span";
import { H3 } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { assignUrl } from "next-vibe/ui/lib/location";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { executeQuery } from "next-vibe/unified-ui/hooks/query-executor";
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
import { getPricingParams } from "@/products/repository-client";

import subscriptionDefinitions from "../definition";
import {
  BillingInterval,
  SubscriptionPlan,
  type SubscriptionPlanValue,
  SubscriptionStatus,
} from "../enum";
import { useSubscription } from "../hooks";
import { getPlanOfferState } from "../plan-offers";
import type definition from "./definition";
import { type PlanInterval, PlanPicker } from "./plan-picker";
import { PricingFaq } from "./pricing-faq";

const MIN_QTY = 1;
// Crypto minimum is ~$25 of credits (5 packs).
const MIN_CRYPTO_CREDITS = 2500;

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
  const subSubmitting = useWidgetIsSubmitting();
  const subValue = useWidgetValue<typeof definition.POST>();

  const { locale: currentLocale } = useTranslation();
  const { t: tCredits } = creditsScopedTranslation.scopedT(currentLocale);
  const { t: tCap } = publicCapScopedTranslation.scopedT(currentLocale);
  const { t: tPurchase } = purchaseScopedTranslation.scopedT(currentLocale);

  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const isAuthenticated = !user.isPublic;
  const availability = useProviderAvailability();
  const totalModelCount = getAvailableChatModelCount(isAdmin, availability);

  const subscriptionEndpoint = useSubscription(logger, user);
  const currentSubscription = subscriptionEndpoint.read?.data;
  const isLoadingSubscription = subscriptionEndpoint.read?.isLoading ?? false;

  const offerState = getPlanOfferState({
    isPublic: user.isPublic,
    subscription: currentSubscription,
  });
  const pricing = getPricingParams(locale);

  const products = productsRepository.getProducts(locale);
  const packProduct = products[ProductIds.CREDIT_PACK];
  const packPrice = packProduct.price;
  const packCredits = packProduct.credits;

  // The plan the user picked, waiting for a payment method.
  const [pendingPlan, setPendingPlan] = useState<{
    plan: typeof SubscriptionPlanValue;
    interval: PlanInterval;
  } | null>(null);
  const [isSubProviderModalOpen, setIsSubProviderModalOpen] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [subscriptionCheckError, setSubscriptionCheckError] = useState("");
  const [isPackProviderModalOpen, setIsPackProviderModalOpen] = useState(false);

  // Crypto plans are one-off invoices. Starter monthly is below what crypto
  // payments accept, so Starter takes crypto yearly; bigger plans monthly too.
  const isCryptoSubDisabled =
    pendingPlan?.interval !== BillingInterval.YEARLY &&
    pendingPlan?.plan === SubscriptionPlan.SUBSCRIPTION;

  // Subscription submit — uses widget's own form/submit from context
  useEffect(() => {
    if (subValue?.checkoutUrl) {
      assignUrl(subValue.checkoutUrl);
    }
  }, [subValue?.checkoutUrl]);

  const handleSubscribe = (
    plan: typeof SubscriptionPlanValue,
    interval: PlanInterval,
  ): void => {
    setCheckingSubscription(true);
    setSubscriptionCheckError("");
    // The button only shows when the cached subscription read says "none",
    // but that read can be stale or failed (prod: a user subscribed on Nov 7,
    // got "already subscribed" from checkout on Nov 8). Re-check before
    // opening checkout; an active subscription flips the card to the
    // "already subscribed" state instead of a doomed checkout.
    void executeQuery({
      endpoint: subscriptionDefinitions.GET,
      logger,
      user,
      locale,
      requestData: undefined,
      pathParams: undefined,
    }).then((fresh) => {
      setCheckingSubscription(false);
      if (!fresh.success) {
        setSubscriptionCheckError(fresh.message);
        return undefined;
      }
      if (fresh.data.status === SubscriptionStatus.ACTIVE) {
        // Recovered: the cached read was stale and showed a subscribe button
        // to an already-subscribed user.
        logger.warn("Subscribe clicked with stale subscription cache", {
          component: "SubscriptionCreateContainer",
          operation: "handleSubscribe",
          freshStatus: fresh.data.status,
        });
        // Sync the cached read so the card switches to "already subscribed".
        void subscriptionEndpoint.read?.refetch();
        return undefined;
      }
      setPendingPlan({ plan, interval });
      setIsSubProviderModalOpen(true);
      return undefined;
    });
  };

  const handleSubProviderSelect = (
    provider: typeof PaymentProviderValue,
  ): void => {
    setIsSubProviderModalOpen(false);
    if (!pendingPlan) {
      return;
    }
    form.setValue("plan", pendingPlan.plan, { shouldDirty: true });
    form.setValue("billingInterval", pendingPlan.interval, {
      shouldDirty: true,
    });
    form.setValue("provider", provider, { shouldDirty: true });
    onSubmit?.();
  };

  // Admin-add credits endpoint
  const adminAddEndpoint = useEndpoint(
    { POST: adminAddDefinitions.POST },
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
    {
      read: { queryOptions: { enabled: isAdmin } },
      create: { formOptions: { defaultValues: { capAmount: 500 } } },
    },
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
  const totalPrice = packPrice * packQty;
  const totalCredits = packCredits * packQty;
  const isCryptoPackDisabled = totalCredits < MIN_CRYPTO_CREDITS;
  const minCryptoPacks = Math.ceil(MIN_CRYPTO_CREDITS / packCredits);

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
    packForm?.setValue("productId", ProductIds.CREDIT_PACK);
    packForm?.setValue("provider", provider);
    void packSubmit?.();
  };

  useEffect(() => {
    if (packValue?.checkoutUrl) {
      assignUrl(packValue.checkoutUrl);
    }
  }, [packValue?.checkoutUrl]);
  const packError =
    packResponse?.success === false ? packResponse.message : null;

  const planPicker = (
    <PlanPicker
      key={`${offerState.currentTier ?? "none"}-${offerState.currentInterval ?? "none"}`}
      locale={locale}
      state={offerState}
      subscription={currentSubscription}
      modelCount={totalModelCount}
      onStart={handleSubscribe}
      startPending={
        checkingSubscription ||
        subSubmitting === true ||
        Boolean(subValue?.checkoutUrl)
      }
      startError={
        subscriptionCheckError ? (
          <Div role="alert" className="text-sm text-destructive">
            {subscriptionCheckError}
          </Div>
        ) : (
          <FormAlertWidget field={{}} />
        )
      }
    />
  );

  const packCard = (
    <Card data-testid="pack-card" className="overflow-hidden rounded-xl">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <Div className="flex min-w-0 flex-col gap-4">
          <Div className="flex items-start gap-3">
            <Span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Coins className="h-5 w-5" />
            </Span>
            <Div className="flex min-w-0 flex-col gap-0.5">
              <H3 className="m-0 text-lg font-semibold tracking-tight">
                {t("tiers.topUp.heading")}
              </H3>
              <Span className="text-sm text-muted-foreground">
                {t("tiers.topUp.subheading")}
              </Span>
            </Div>
          </Div>
          <Div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Span className="text-3xl font-semibold tabular-nums tracking-tight">
              {pricing.packPrice}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {tPurchase("post.pack.perPack")}
            </Span>
            <Span className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              {tPurchase("post.pack.features.credits", {
                count: packCredits.toLocaleString(locale),
              })}
            </Span>
          </Div>
        </Div>
        <Div className="flex w-full flex-col gap-3 md:w-80 md:shrink-0">
          <Div className="flex items-center overflow-hidden rounded-lg border border-border">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-12 w-12 shrink-0 rounded-none border-r border-border px-0"
              onClick={() => setPackQty(packQty - 1)}
              disabled={packQty <= MIN_QTY}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Div className="flex h-12 flex-1 select-none flex-col items-center justify-center">
              <Span className="text-xl font-bold tabular-nums leading-tight">
                {packQty}
              </Span>
              <Span className="text-xs text-muted-foreground">
                {tPurchase("post.pack.qtyCredits", {
                  count: totalCredits.toLocaleString(locale),
                })}
              </Span>
            </Div>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-12 w-12 shrink-0 rounded-none border-l border-border px-0"
              onClick={() => setPackQty(packQty + 1)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Div>
          <Button
            type="button"
            className="h-11 w-full"
            data-testid="pack-buy"
            onClick={handlePackBuy}
            disabled={packIsSubmitting || Boolean(packValue?.checkoutUrl)}
          >
            {packIsSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {packQty > 1
              ? tPurchase("post.pack.totalSummary", {
                  totalCredits: totalCredits.toLocaleString(locale),
                  totalPrice: formatPrice(
                    totalPrice,
                    locale,
                    packProduct.currency,
                  ),
                })
              : tPurchase("post.submit.text")}
          </Button>
          {packError && (
            <Div
              role="alert"
              className="flex items-start gap-1.5 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <Span>{packError}</Span>
            </Div>
          )}
          {packValue?.checkoutUrl && (
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
          )}
        </Div>
      </CardContent>
    </Card>
  );

  return (
    <WidgetShell className="gap-6">
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
                  min: minCryptoPacks,
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
                      {tPurchase("post.pack.qtyCredits", { count: "" }).trim()}
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
                      {capAmount2.toLocaleString(locale)}
                    </Span>
                    <Span className="text-xs text-muted-foreground">
                      {tCap("get.perDayUnit")}
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

      {isAuthenticated && isLoadingSubscription ? (
        <Div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </Div>
        </Div>
      ) : offerState.mode === "topUp" ? (
        <>
          {packCard}
          {planPicker}
        </>
      ) : (
        <>
          {planPicker}
          <Div
            data-testid="packs-locked"
            className="flex items-start gap-3 rounded-xl border border-dashed border-border px-4 py-3.5"
          >
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <Div className="flex min-w-0 flex-col gap-0.5">
              <Span className="text-sm font-medium">
                {t("tiers.packsLocked.title", {
                  price: pricing.packPrice,
                  credits: pricing.packCredits,
                })}
              </Span>
              <Span className="text-sm text-muted-foreground">
                {t("tiers.packsLocked.body")}
              </Span>
            </Div>
          </Div>
        </>
      )}
      <PricingFaq locale={locale} />
    </WidgetShell>
  );
}
