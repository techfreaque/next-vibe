import type { Metadata } from "next";
import type { JSX } from "react";

import {
  type CreditBalance,
  type CreditTransactionOutput,
  creditRepository,
} from "@/app/api/[locale]/v1/core/credits/repository";
import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { translations } from "@/config/i18n/en";

import { SubscriptionClientContent } from "./_components/subscription-client-content";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";

interface SubscriptionPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the subscription (credits) page
 */
export async function generateMetadata({
  params,
}: SubscriptionPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "subscription",
    title: "app.subscription.meta.subscription.title",
    description: "app.subscription.meta.subscription.description",
    category: "app.subscription.meta.subscription.category",
    image: `${translations.websiteUrl}/images/subscription-plans.jpg`,
    imageAlt: "app.subscription.meta.subscription.imageAlt",
    keywords: [
      "app.subscription.meta.subscription.keywords.subscription",
      "app.subscription.meta.subscription.keywords.billing",
      "app.subscription.meta.subscription.keywords.plans",
      "app.subscription.meta.subscription.keywords.pricing",
    ],
  });
}

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Check authentication - allow public users to view the page
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Always allow access - fetch user data if authenticated
  const userResponse = await userRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER],
      detailLevel: UserDetailLevel.MINIMAL,
    },
    locale,
    logger,
  );

  // Check if user is authenticated (not public)
  // If getUserByAuth fails or returns no data, treat as public user
  const isAuthenticated =
    userResponse?.success &&
    userResponse.data &&
    !userResponse.data.isPublic &&
    "id" in userResponse.data &&
    !!userResponse.data.id;

  // Fetch data for both authenticated and public users
  let credits: CreditBalance | null = null;
  let history: {
    transactions: CreditTransactionOutput[];
    totalCount: number;
  } | null = null;
  let subscription: SubscriptionGetResponseOutput | null = null;

  // Fetch credit balance for all users (both authenticated and public)
  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const creditsResponse = await creditRepository.getCreditBalanceForUser(
      userResponse.data,
      logger,
    );
    credits = creditsResponse.success ? creditsResponse.data : null;
  }

  // Fetch transaction history for all users (both authenticated and public)
  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    if (isAuthenticated && "id" in userResponse.data && userResponse.data.id) {
      // Authenticated users: fetch by userId
      const historyResponse = await creditRepository.getTransactions(
        userResponse.data.id,
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
      );
      history = historyResponse.success ? historyResponse.data : null;
    }
  }

  // For authenticated users only, fetch subscription data
  if (
    isAuthenticated &&
    userResponse.success &&
    userResponse.data &&
    "id" in userResponse.data &&
    userResponse.data.id
  ) {
    const userId = userResponse.data.id;

    // Fetch subscription data
    const subscriptionResponse = await subscriptionRepository.getSubscription(
      userId,
      logger,
    );
    subscription = subscriptionResponse.success
      ? subscriptionResponse.data
      : null;
  }

  return (
    <SubscriptionClientContent
      locale={locale}
      initialCredits={credits}
      initialHistory={history}
      initialSubscription={subscription}
      isAuthenticated={isAuthenticated}
    />
  );
}
