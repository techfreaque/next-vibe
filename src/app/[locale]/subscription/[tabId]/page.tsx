/**
 * Subscription Page - Dynamic Tab Route
 * Handles /subscription/overview, /subscription/buy, /subscription/history
 */

import { notFound } from "next/navigation";
import type { JSX } from "react";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { SubscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import { SubscriptionPageClient } from "./page-client";

interface SubscriptionPageProps {
  params: Promise<{
    locale: CountryLanguage;
    tabId: string;
  }>;
}

const VALID_TABS = ["overview", "buy", "history"];

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps): Promise<JSX.Element> {
  const { locale, tabId } = await params;

  // Validate tab
  if (!VALID_TABS.includes(tabId)) {
    notFound();
  }

  const logger = createEndpointLogger(false, Date.now(), locale);

  // Get user
  const userResponse = await UserRepository.getUserByAuth({}, locale, logger);
  if (!userResponse.success) {
    notFound();
  }
  const user = userResponse.data;
  const isAuthenticated = user && !user.isPublic && "id" in user && user.id;

  // Fetch subscription data
  let initialSubscription = null;
  if (isAuthenticated) {
    const subscriptionResponse = await SubscriptionRepository.getSubscription(
      user.id,
      logger,
      locale,
    );
    initialSubscription = subscriptionResponse.success
      ? subscriptionResponse.data
      : null;
  }

  // Fetch credits data
  let initialCredits = null;
  if (isAuthenticated) {
    const creditsResponse = await CreditRepository.getBalance(
      { userId: user.id },
      logger,
    );
    initialCredits = creditsResponse.success ? creditsResponse.data : null;
  }

  // Fetch history data if on history tab
  let initialHistory = null;
  if (isAuthenticated && tabId === "history") {
    const historyResponse = await CreditRepository.getTransactionHistory(
      { paginationInfo: { page: 1, limit: 50 } },
      user,
      logger,
      locale,
    );
    initialHistory = historyResponse.success ? historyResponse.data : null;
  }

  return (
    <SubscriptionPageClient
      locale={locale}
      user={user}
      isAuthenticated={!!isAuthenticated}
      activeTab={tabId}
      initialSubscription={initialSubscription}
      initialCredits={initialCredits}
      initialHistory={initialHistory}
    />
  );
}
