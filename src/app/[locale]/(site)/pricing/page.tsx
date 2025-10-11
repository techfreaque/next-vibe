import type { Metadata } from "next";
import type { JSX } from "react";

import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import CallToAction from "../_components/call-to-action";
import Testimonials from "../testimonials/_components/testimonials";
import PricingComparisonTable from "./_components/pricing-comparison-table";
import PricingSection from "./_components/pricing-section";
import SubscriptionBanner from "./_components/subscription-banner";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the Pricing page with translations
 */
export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "pricing",
    title: "meta.pricing.title",
    category: "meta.billing.category",
    description: "meta.pricing.description",
    image: "https://socialmediaservice.com/images/pricing-hero.jpg",
    imageAlt: "meta.pricing.imageAlt",
    keywords: ["meta.pricing.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "meta.pricing.ogTitle",
        description: "meta.pricing.ogDescription",
        url: "https://socialmediaservice.com/pricing",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.pricing.twitterTitle",
        description: "meta.pricing.twitterDescription",
      },
    },
  });
};

export default async function PricingPage({
  params,
}: Props): Promise<JSX.Element> {
  const logger = createEndpointLogger(false, Date.now(), locale);
  const { locale } = await params;

  // Fetch user data
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );
  const user = userResponse.success ? userResponse.data : undefined;

  // Fetch subscription data
  const subscriptionResponse = user
    ? await subscriptionRepository.getSubscription(user.id, logger)
    : undefined;
  const subscription = subscriptionResponse?.success
    ? subscriptionResponse.data
    : null;

  return (
    <>
      {user && subscription && (
        <SubscriptionBanner locale={locale} subscription={subscription} />
      )}
      <PricingSection
        locale={locale}
        currentUser={user}
        currentSubscription={subscription}
        useHomePageLink
        hideFooterAndHeader={false}
        isProcessing={null}
      />

      <Testimonials locale={locale} />
      <PricingComparisonTable locale={locale} />
      <CallToAction locale={locale} />
    </>
  );
}
