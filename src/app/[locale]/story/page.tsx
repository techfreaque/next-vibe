import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import type { SubscriptionGetResponseOutput } from "@/app/api/[locale]/v1/core/subscription/definition";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { translations } from "@/config/i18n/en";

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
    image: `${translations.websiteUrl}/images/home-hero.jpg`,
    imageAlt: "app.meta.home.imageAlt",
    keywords: ["app.meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.home.ogTitle",
        description: "app.meta.home.ogDescription",
        url: `${translations.websiteUrl}/${locale}`,
        type: "website",
        images: [
          {
            url: `${translations.websiteUrl}/images/home-hero.jpg`,
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
        images: [`${translations.websiteUrl}/images/home-hero.jpg`],
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
    );
    subscription = subscriptionResponse?.success
      ? subscriptionResponse.data
      : null;
  }

  return (
    <Div role="main" className="flex min-h-screen flex-col w-full">
      {/* Hero Section */}
      <Hero locale={locale} />

      {/* Features Section */}
      <Features locale={locale} />

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
