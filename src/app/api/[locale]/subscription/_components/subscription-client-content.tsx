"use client";

import { useRouter, useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import { Container } from "next-vibe-ui/ui/container";
import { History, TrendingUp } from "next-vibe-ui/ui/icons";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "next-vibe-ui/ui/tabs";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type { CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import type { CreditBalance } from "@/app/api/[locale]/credits/repository";
import { ProductIds, productsRepository } from "@/app/api/[locale]/products/repository-client";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";
import type { CountryLanguage } from "@/i18n/core/config";

import { BuyCreditsTab } from "./buy-credits-tab";
import { CreditBalanceCard } from "./credit-balance-card";
import { HistoryTab } from "./history-tab";
import { OverviewTab } from "./overview-tab";
import { PaymentStatusAlert } from "./payment-status-alert";
import { SubscriptionHeader } from "./subscription-header";
import { SubscriptionStatusCard } from "./subscription-status-card";

export interface SubscriptionClientContentProps {
  locale: CountryLanguage;
  initialCredits: CreditBalance | null;
  initialHistory: CreditsHistoryGetResponseOutput | null;
  initialSubscription: SubscriptionGetResponseOutput | null;
  isAuthenticated: boolean;
  user: JwtPayloadType;
}

export function SubscriptionClientContent({
  locale,
  initialCredits,
  initialHistory,
  initialSubscription,
  isAuthenticated,
  user,
}: SubscriptionClientContentProps): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Get pricing from centralized products repository with proper locale
  const products = productsRepository.getProducts(locale);
  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const YEARLY_SUBSCRIPTION_PRICE = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
    "year",
  ).price;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;
  const FREE_CREDITS = products[ProductIds.FREE_TIER].credits;

  // Handle URL params for payment success/cancel
  useEffect(() => {
    const payment = searchParams.get("payment");
    const type = searchParams.get("type");

    if (payment && type) {
      if (payment === "success") {
        setAlertType("success");
        if (type === "subscription") {
          setAlertMessage(t("app.subscription.subscription.payment.success.subscription"));
        } else if (type === "credits") {
          setAlertMessage(t("app.subscription.subscription.payment.success.credits"));
        }
        setShowAlert(true);
      } else if (payment === "canceled") {
        setAlertType("error");
        if (type === "subscription") {
          setAlertMessage(t("app.subscription.subscription.payment.canceled.subscription"));
        } else if (type === "credits") {
          setAlertMessage(t("app.subscription.subscription.payment.canceled.credits"));
        }
        setShowAlert(true);
      }

      // Clear URL params
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router, t]);

  return (
    <Container className="py-8 flex flex-col gap-8">
      {/* Header with Back Button and Auth Buttons */}
      <SubscriptionHeader locale={locale} isAuthenticated={isAuthenticated} />

      {/* Payment Status Alert */}
      <PaymentStatusAlert
        showAlert={showAlert}
        alertType={alertType}
        alertMessage={alertMessage}
        onClose={() => setShowAlert(false)}
      />

      {/* Header Section */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col gap-4"
      >
        <H1 className="text-4xl font-bold tracking-tight">
          {t("app.subscription.subscription.title")}
        </H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("app.subscription.subscription.description")}
        </P>
      </MotionDiv>

      {/* Credit Balance Overview Card */}
      <CreditBalanceCard
        locale={locale}
        initialCredits={initialCredits}
        freeCredits={FREE_CREDITS}
      />

      {/* Subscription Status Card */}
      {initialSubscription && (
        <SubscriptionStatusCard locale={locale} initialSubscription={initialSubscription} />
      )}

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="buy" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.buy")}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t("app.subscription.subscription.tabs.history")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex flex-col gap-6">
          <OverviewTab
            locale={locale}
            subscriptionPrice={SUBSCRIPTION_PRICE}
            subscriptionCredits={SUBSCRIPTION_CREDITS}
            packPrice={PACK_PRICE}
            packCredits={PACK_CREDITS}
            freeCredits={FREE_CREDITS}
            onSwitchTab={() => setActiveTab("buy")}
          />
        </TabsContent>

        {/* Buy Credits Tab */}
        <TabsContent value="buy" className="flex flex-col gap-6">
          <BuyCreditsTab
            locale={locale}
            isAuthenticated={isAuthenticated}
            initialSubscription={initialSubscription}
            subscriptionPrice={SUBSCRIPTION_PRICE}
            subscriptionCredits={SUBSCRIPTION_CREDITS}
            yearlySubscriptionPrice={YEARLY_SUBSCRIPTION_PRICE}
            packPrice={PACK_PRICE}
            packCredits={PACK_CREDITS}
          />
        </TabsContent>

        {/* Usage History Tab */}
        <TabsContent value="history" className="flex flex-col gap-6">
          <HistoryTab locale={locale} initialData={initialHistory} user={user} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
