import type { Metadata } from "next";
import type { JSX } from "react";

import {
  type CreditBalance,
  type CreditTransactionOutput,
  creditRepository,
} from "@/app/api/[locale]/credits/repository";
import { subscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { userRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { envClient } from "@/config/env-client";

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

  // Check authentication
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await userRepository.getUserByAuth(
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
  let history: {
    transactions: CreditTransactionOutput[];
    totalCount: number;
  } | null = null;
  let subscription: SubscriptionGetResponseOutput | null = null;

  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const creditsResponse = await creditRepository.getCreditBalanceForUser(
      userResponse.data,
      locale,
      logger,
    );
    credits = creditsResponse.success ? creditsResponse.data : null;
  }

  // Fetch transaction history
  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    if (isAuthenticated && "id" in userResponse.data && userResponse.data.id) {
      // Authenticated users: fetch by userId and leadId
      const historyResponse = await creditRepository.getTransactions(
        userResponse.data.id,
        userResponse.data.leadId,
        50, // limit
        0, // offset
        logger,
      );
      history = historyResponse.success ? historyResponse.data : null;
    } else {
      // Public users: fetch by leadId
      const historyResponse = await creditRepository.getTransactionsByLeadId(
        userResponse.data.leadId,
        50, // limit
        0, // offset
        logger,
      );
      history = historyResponse.success ? historyResponse.data : null;
    }
  }

  if (
    isAuthenticated &&
    userResponse.success &&
    userResponse.data &&
    "id" in userResponse.data &&
    userResponse.data.id
  ) {
    const subscriptionResponse = await subscriptionRepository.getSubscription(
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

  return (
    <HistoryPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      initialCredits={credits}
      initialHistory={history}
      initialSubscription={subscription}
      freeCredits={FREE_CREDITS}
    />
  );
}
