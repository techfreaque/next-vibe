import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import CallToAction from "./_components/call-to-action";
import Features from "./_components/features";
import Footer from "./_components/footer";
import Hero from "./_components/hero";
import Process from "./_components/process";
import PricingSection from "./pricing/_components/pricing-section";

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
    image: "https://unbottled.ai/images/home-hero.jpg",
    imageAlt: "app.meta.home.imageAlt",
    keywords: ["app.meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.home.ogTitle",
        description: "app.meta.home.ogDescription",
        url: `https://unbottled.ai/${locale}`,
        type: "website",
        images: [
          {
            url: "https://unbottled.ai/images/home-hero.jpg",
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
        images: ["https://unbottled.ai/images/home-hero.jpg"],
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
      locale,
      roles: [UserRole.CUSTOMER],
      detailLevel: UserDetailLevel.COMPLETE,
    },
    logger,
  );
  const user = userResponse.success ? userResponse.data : undefined;
  const subscriptionResponse = user
    ? await subscriptionRepository.getSubscription(user.id, logger)
    : undefined;
  const subscription = subscriptionResponse?.success
    ? subscriptionResponse.data
    : null;

  return (
    <Div
      role="main"
      className="flex min-h-screen flex-col w-full"
    >
      {/* Hero Section */}
      <Hero locale={locale} />

      {/* Features Section */}
      <Features locale={locale} />

      {/* Pricing Section */}
      <PricingSection
        locale={locale}
        currentUser={user}
        currentSubscription={subscription}
        useHomePageLink
        hideFooterAndHeader={false}
        isProcessing={null}
      />

      {/* How It Works */}
      <Process locale={locale} />

      {/* Call to Action */}
      <CallToAction locale={locale} />

      {/* Footer */}
      <Footer locale={locale} />
    </Div>
  );
}
