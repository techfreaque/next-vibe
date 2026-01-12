import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { type CreditsHistoryGetResponseOutput } from "@/app/api/[locale]/credits/history/definition";
import {
  type CreditBalance,
  CreditRepository,
} from "@/app/api/[locale]/credits/repository";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { SubscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { HistoryPageClient } from "./_components/history-page-client";

interface HistoryPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the history page
 */
export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "subscription/history",
    title: "app.subscription.meta.history.title",
    description: "app.subscription.meta.history.description",
    category: "app.subscription.meta.subscription.category",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/subscription-plans.jpg`,
    imageAlt: "app.subscription.meta.subscription.imageAlt",
    keywords: ["app.subscription.meta.subscription.keywords.billing"],
  });
}

export default async function HistoryPage({
  params,
}: HistoryPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

  // Check authentication
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER],
      detailLevel: UserDetailLevel.MINIMAL,
    },
    locale,
    logger,
  );

  const isAuthenticated =
    userResponse?.success &&
    userResponse.data &&
    !userResponse.data.isPublic &&
    "id" in userResponse.data &&
    !!userResponse.data.id;

  // Fetch data
  let credits: CreditBalance | null = null;
  let history: CreditsHistoryGetResponseOutput | null = null;
  let subscription: SubscriptionGetResponseOutput | null = null;

  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const creditsResponse = await CreditRepository.getCreditBalanceForUser(
      userResponse.data,
      locale,
      logger,
    );
    credits = creditsResponse.success ? creditsResponse.data : null;
  }

  // Fetch transaction history
  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const historyResponse = await CreditRepository.getTransactionHistory(
      { paginationInfo: { page: 1, limit: 50 } },
      userResponse.data,
      logger,
    );
    history = historyResponse.success ? historyResponse.data : null;
  }

  if (
    isAuthenticated &&
    userResponse.success &&
    userResponse.data &&
    "id" in userResponse.data &&
    userResponse.data.id
  ) {
    const subscriptionResponse = await SubscriptionRepository.getSubscription(
      userResponse.data.id,
      logger,
      locale,
    );
    subscription = subscriptionResponse.success
      ? subscriptionResponse.data
      : null;
  }

  // Get pricing
  const products = productsRepository.getProducts(locale);
  const FREE_CREDITS = products[ProductIds.FREE_TIER].credits;

  if (!userResponse.success) {
    return <Div>{t("app.subscription.history.errors.failedToLoadUser")}</Div>;
  }

  return (
    <HistoryPageClient
      user={userResponse.data}
      locale={locale}
      isAuthenticated={isAuthenticated}
      initialCredits={credits}
      initialHistory={history}
      initialSubscription={subscription}
      freeCredits={FREE_CREDITS}
    />
  );
}
