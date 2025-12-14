import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { threadsRepository } from "@/app/api/[locale]/agent/chat/threads/repository";
import {
  ProductIds,
  productsRepository,
  TOTAL_MODEL_COUNT,
} from "@/app/api/[locale]/products/repository-client";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/subscription/definition";
import { subscriptionRepository } from "@/app/api/[locale]/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { userRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { metadataGenerator } from "@/i18n/core/metadata";

import CallToAction from "./_components/call-to-action";
import Features from "./_components/features";
import Hero from "./_components/hero";
import { StoryPricingSection } from "./_components/story-pricing-section";

interface HomePageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the homepage with translations
 */
export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "",
    title: "app.meta.home.title",
    category: "app.meta.home.category",
    description: "app.meta.home.description",
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: "app.meta.home.imageAlt",
    keywords: ["app.meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.home.ogTitle",
        description: "app.meta.home.ogDescription",
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}`,
        type: "website",
        images: [
          {
            url: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
            width: 1200,
            height: 630,
            alt: "app.meta.home.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.home.twitterTitle",
        description: "app.meta.home.twitterDescription",
        images: [`${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`],
      },
    },
  });
}

export default async function HomePage({
  params,
}: HomePageProps): Promise<JSX.Element> {
  const { locale } = await params;

  // Create logger for server-side operations
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Get user with proper error handling
  const userResponse = await userRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER],
      detailLevel: UserDetailLevel.MINIMAL,
    },
    locale,
    logger,
  );

  // Check if user is authenticated (not public)
  const isAuthenticated =
    userResponse?.success &&
    userResponse.data &&
    !userResponse.data.isPublic &&
    "id" in userResponse.data &&
    !!userResponse.data.id;

  // For authenticated users, fetch subscription data
  let subscription: SubscriptionGetResponseOutput | null = null;

  if (
    isAuthenticated &&
    userResponse.data &&
    "id" in userResponse.data &&
    userResponse.data.id
  ) {
    const subscriptionResponse = await subscriptionRepository.getSubscription(
      userResponse.data.id,
      logger,
      locale,
    );
    subscription = subscriptionResponse?.success
      ? subscriptionResponse.data
      : null;
  }

  // Fetch stats for hero section (cached for 24h)
  const activeUserCountResponse =
    await userRepository.getActiveUserCount(logger);
  const totalConversationsResponse =
    await threadsRepository.getTotalConversationsCount(logger);

  const activeUserCount = activeUserCountResponse.success
    ? activeUserCountResponse.data
    : 0;
  const totalConversations = totalConversationsResponse.success
    ? totalConversationsResponse.data
    : 0;

  // Get pricing information for features section
  const products = productsRepository.getProducts(locale);
  const country = getCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];

  const SUBSCRIPTION_PRICE = products[ProductIds.SUBSCRIPTION].price;
  const SUBSCRIPTION_CREDITS = products[ProductIds.SUBSCRIPTION].credits;
  const PACK_PRICE = products[ProductIds.CREDIT_PACK].price;
  const PACK_CREDITS = products[ProductIds.CREDIT_PACK].credits;

  // Get currency symbol from languageConfig
  const CURRENCY_SYMBOL = countryInfo.symbol;

  return (
    <Div role="main" className="flex min-h-screen flex-col w-full">
      {/* Hero Section */}
      <Hero
        locale={locale}
        activeUserCount={activeUserCount}
        totalConversations={totalConversations}
      />

      {/* Features Section */}
      <Features
        locale={locale}
        modelCount={TOTAL_MODEL_COUNT}
        subPrice={SUBSCRIPTION_PRICE}
        subCredits={SUBSCRIPTION_CREDITS}
        subCurrency={CURRENCY_SYMBOL}
        packPrice={PACK_PRICE}
        packCredits={PACK_CREDITS}
        packCurrency={CURRENCY_SYMBOL}
      />

      {/* Pricing Section with Overview and Buy Credits */}
      <StoryPricingSection
        locale={locale}
        isAuthenticated={isAuthenticated}
        initialSubscription={subscription}
      />

      {/* Call to Action */}
      <CallToAction locale={locale} />
    </Div>
  );
}

// Type definition for subscription data
