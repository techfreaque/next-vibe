import type { Metadata } from "next";
import type { JSX } from "react";

import { creditRepository } from "@/app/api/[locale]/v1/core/credits/repository";
import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { translations } from "@/config/i18n/en";

import { SubscriptionClientContent } from "./_components/subscription-client-content";

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

  // For authenticated users, fetch their data
  let credits: CreditBalance | null = null;
  let history: {
    transactions: CreditTransaction[];
    totalCount: number;
  } | null = null;
  let subscription: SubscriptionData | null = null;

  if (
    isAuthenticated &&
    userResponse.data &&
    "id" in userResponse.data &&
    userResponse.data.id &&
    userResponse.data.leadId
  ) {
    const userId = userResponse.data.id;
    const leadId = userResponse.data.leadId;

    // Fetch credit balance
    const creditsResponse = await creditRepository.getCreditBalanceForUser(
      {
        id: userId,
        leadId,
        isPublic: false,
      },
      logger,
    );
    credits = creditsResponse.success ? creditsResponse.data : null;

    // Fetch transaction history
    const historyResponse = await creditRepository.getTransactions(
      userId,
      50, // limit
      0, // offset
    );
    history = historyResponse.success ? historyResponse.data : null;

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

// Type definitions for the data structures
interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

interface CreditTransaction {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  modelId: string | null;
  messageId: string | null;
  createdAt: string;
}

interface SubscriptionData {
  id: string;
  userId: string;
  plan: string;
  billingInterval: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}
