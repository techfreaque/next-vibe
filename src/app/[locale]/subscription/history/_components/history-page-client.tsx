"use client";

import { useRouter, useSearchParams } from "next-vibe-ui/hooks/use-navigation";
import { Container } from "next-vibe-ui/ui/container";
import { MotionDiv } from "next-vibe-ui/ui/motion";
import { H1, P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import type { CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import type { CreditBalance } from "@/app/api/[locale]/credits/repository";
import { CreditBalanceCard } from "@/app/api/[locale]/subscription/_components/credit-balance-card";
import { HistoryTab } from "@/app/api/[locale]/subscription/_components/history-tab";
import { PaymentStatusAlert } from "@/app/api/[locale]/subscription/_components/payment-status-alert";
import { SubscriptionHeader } from "@/app/api/[locale]/subscription/_components/subscription-header";
import { SubscriptionStatusCard } from "@/app/api/[locale]/subscription/_components/subscription-status-card";
import { SubscriptionTabsNav } from "@/app/api/[locale]/subscription/_components/subscription-tabs-nav";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface HistoryPageClientProps {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  initialCredits: CreditBalance | null;
  initialHistory: CreditsHistoryGetResponseOutput | null;
  initialSubscription: SubscriptionGetResponseOutput | null;
  freeCredits: number;
}

export function HistoryPageClient({
  locale,
  isAuthenticated,
  initialCredits,
  initialHistory,
  initialSubscription,
  freeCredits,
}: HistoryPageClientProps): JSX.Element {
  const { t } = simpleT(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Handle URL params for payment success/cancel
  useEffect(() => {
    const payment = searchParams.get("payment");
    const type = searchParams.get("type");

    if (payment && type) {
      if (payment === "success") {
        setAlertType("success");
        if (type === "subscription") {
          setAlertMessage(
            t("app.subscription.subscription.payment.success.subscription"),
          );
        } else if (type === "credits") {
          setAlertMessage(
            t("app.subscription.subscription.payment.success.credits"),
          );
        }
        setShowAlert(true);
      } else if (payment === "canceled") {
        setAlertType("error");
        if (type === "subscription") {
          setAlertMessage(
            t("app.subscription.subscription.payment.canceled.subscription"),
          );
        } else if (type === "credits") {
          setAlertMessage(
            t("app.subscription.subscription.payment.canceled.credits"),
          );
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
        freeCredits={freeCredits}
      />

      {/* Subscription Status Card */}
      {initialSubscription && (
        <SubscriptionStatusCard
          locale={locale}
          initialSubscription={initialSubscription}
        />
      )}

      {/* Tabs Navigation */}
      <SubscriptionTabsNav locale={locale} />

      {/* History Tab Content */}
      <HistoryTab locale={locale} initialData={initialHistory} />
    </Container>
  );
}
