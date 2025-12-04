import type { Metadata } from "next";
import type { JSX } from "react";

import {
  type CreditBalance,
  creditRepository,
} from "@/app/api/[locale]/credits/repository";
import { subscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { userRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { type SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { envClient } from "@/config/env-client";

import { BuyCreditsPageClient } from "./_components/buy-credits-page-client";

interface BuyCreditsPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the buy credits page
 */
export async function generateMetadata({
  params,
}: BuyCreditsPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "subscription/buy-credits",
    title: "app.subscription.meta.buyCredits.title",
    description: "app.subscription.meta.buyCredits.description",
    category: "app.subscription.meta.subscription.category",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/subscription-plans.jpg`,
    imageAlt: "app.subscription.meta.subscription.imageAlt",
    keywords: [
      "app.subscription.meta.subscription.keywords.subscription",
      "app.subscription.meta.subscription.keywords.billing",
      "app.subscription.meta.subscription.keywords.plans",
    ],
  });
}

export default async function BuyCreditsPage({
  params,
}: BuyCreditsPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  const { t } = simpleT(locale);

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
  let subscription: SubscriptionGetResponseOutput | null = null;

  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const creditsResponse = await creditRepository.getCreditBalanceForUser(
      userResponse.data,
      logger,
    );
    credits = creditsResponse.success ? creditsResponse.data : null;
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
    );
    subscription = subscriptionResponse.success
      ? subscriptionResponse.data
      : null;
  }

  // Get pricing
  const products = productsRepository.getProducts(locale);
  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;
  const FREE_CREDITS = products[ProductIds.FREE_TIER].credits;

  return (
    <BuyCreditsPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      initialCredits={credits}
      initialSubscription={subscription}
      subscriptionPrice={SUBSCRIPTION_PRICE}
      subscriptionCredits={SUBSCRIPTION_CREDITS}
      packPrice={PACK_PRICE}
      packCredits={PACK_CREDITS}
      freeCredits={FREE_CREDITS}
      t={t}
    />
  );
}
