import type { Metadata } from "next";
import type { JSX } from "react";

import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import CallToAction from "./_components/call-to-action";
import Features from "./_components/features";
import Hero from "./_components/hero";
import Process from "./_components/process";
import Stats from "./_components/stats";
import PricingComparison from "./pricing/_components/pricing-comparison-table";
import PricingSection from "./pricing/_components/pricing-section";
import Testimonials from "./testimonials/_components/testimonials";

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
    title: "meta.home.title",
    category: "meta.home.category",
    description: "meta.home.description",
    image: "https://socialmediaservice.com/images/home-hero.jpg",
    imageAlt: "meta.home.imageAlt",
    keywords: ["meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.home.ogTitle",
        description: "meta.home.ogDescription",
        url: `https://socialmediaservice.com/${locale}`,
        type: "website",
        images: [
          {
            url: "https://socialmediaservice.com/images/home-hero.jpg",
            width: 1200,
            height: 630,
            alt: "meta.home.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.home.twitterTitle",
        description: "meta.home.twitterDescription",
        images: ["https://socialmediaservice.com/images/home-hero.jpg"],
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
      roles: [UserRole.CUSTOMER],
      detailLevel: UserDetailLevel.STANDARD,
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
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <Hero locale={locale} />
      {/* <BrandsSection locale={locale} /> */}
      <Features locale={locale} />
      <Stats locale={locale} />
      <Process locale={locale} />
      {/* <PremiumContentShowcase locale={locale} /> */}
      <Testimonials locale={locale} />
      {/* <FreeSocialSetup locale={locale} /> */}
      <PricingSection
        locale={locale}
        currentUser={user}
        currentSubscription={subscription}
        useHomePageLink
        hideFooterAndHeader={false}
        isProcessing={null}
      />
      <PricingComparison locale={locale} />
      {/* <div className="flex justify-center space-x-8 pb-20">
        <SocialMediaImages.Facebook size={32} locale={locale} />
        <SocialMediaImages.Twitter size={32} locale={locale} />
        <SocialMediaImages.Instagram size={32} locale={locale} />
        <SocialMediaImages.LinkedIn size={32} locale={locale} />
        <SocialMediaImages.YouTube size={32} locale={locale} />
      </div> */}
      <CallToAction locale={locale} />
    </main>
  );
}
