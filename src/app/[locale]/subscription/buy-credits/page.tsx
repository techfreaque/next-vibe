import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
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
  const user = userResponse?.success ? userResponse.data : undefined;

  if (!user) {
    const { t } = simpleT(locale);
    return (
      <Div className="flex items-center justify-center min-h-[100vh]">
        <Div className="max-w-md text-center">
          <P className="text-lg font-semibold mb-2">
            {t("app.subscription.buyCredits.error.title")}
          </P>
          <P className="text-sm text-muted-foreground">
            {t("app.subscription.buyCredits.error.message")}
          </P>
        </Div>
      </Div>
    );
  }

  const isAuthenticated = user !== undefined && !user.isPublic;

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

  // Get yearly subscription price
  const yearlySubscription = productsRepository.getProduct(
    ProductIds.SUBSCRIPTION,
    locale,
    "year",
  );
  const YEARLY_SUBSCRIPTION_PRICE = yearlySubscription.price;

  return (
    <BuyCreditsPageClient
      user={user}
      locale={locale}
      isAuthenticated={isAuthenticated}
      initialCredits={credits}
      initialSubscription={subscription}
      subscriptionPrice={SUBSCRIPTION_PRICE}
      subscriptionCredits={SUBSCRIPTION_CREDITS}
      packPrice={PACK_PRICE}
      packCredits={PACK_CREDITS}
      freeCredits={FREE_CREDITS}
      yearlySubscriptionPrice={YEARLY_SUBSCRIPTION_PRICE}
    />
  );
}
