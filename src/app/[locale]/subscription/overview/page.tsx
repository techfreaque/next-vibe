import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/credits/definition";
import { CreditRepository } from "@/app/api/[locale]/credits/repository";
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

import { OverviewPageClient } from "./_components/overview-page-client";

interface OverviewPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the subscription overview page
 */
export async function generateMetadata({
  params,
}: OverviewPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "subscription/overview",
    title: "app.subscription.meta.overview.title",
    description: "app.subscription.meta.overview.description",
    category: "app.subscription.meta.subscription.category",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/subscription-plans.jpg`,
    imageAlt: "app.subscription.meta.subscription.imageAlt",
    keywords: [
      "app.subscription.meta.subscription.keywords.subscription",
      "app.subscription.meta.subscription.keywords.pricing",
    ],
  });
}

export default async function OverviewPage({
  params,
}: OverviewPageProps): Promise<JSX.Element> {
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
  let credits: CreditsGetResponseOutput;
  let subscription: SubscriptionGetResponseOutput | null = null;

  if (userResponse.success && userResponse.data && userResponse.data.leadId) {
    const creditsResponse = await CreditRepository.getCreditBalanceForUser(
      userResponse.data,
      locale,
      logger,
    );
    if (!creditsResponse.success) {
      credits = {
        total: 0,
        free: 0,
        expiring: 0,
        permanent: 0,
        earned: 0,
        expiresAt: null,
      };
    } else {
      credits = creditsResponse.data;
    }
  } else {
    credits = {
      total: 0,
      free: 0,
      expiring: 0,
      permanent: 0,
      earned: 0,
      expiresAt: null,
    };
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
  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;
  const FREE_CREDITS = products[ProductIds.FREE_TIER].credits;

  if (!userResponse.success) {
    return <Div>{t("app.subscription.overview.errors.failedToLoadUser")}</Div>;
  }

  return (
    <OverviewPageClient
      locale={locale}
      isAuthenticated={isAuthenticated}
      initialCredits={credits}
      initialSubscription={subscription}
      subscriptionPrice={SUBSCRIPTION_PRICE}
      subscriptionCredits={SUBSCRIPTION_CREDITS}
      packPrice={PACK_PRICE}
      packCredits={PACK_CREDITS}
      freeCredits={FREE_CREDITS}
      user={userResponse.data}
    />
  );
}
