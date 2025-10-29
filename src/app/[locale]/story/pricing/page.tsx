import type { Metadata } from "next";
import type { JSX } from "react";

import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import CallToAction from "../_components/call-to-action";
// import Testimonials from "../testimonials/_components/testimonials"; // Removed - testimonials component deleted
import CreditPricingSection from "./_components/credit-pricing";
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
    title: "app.meta.pricing.title",
    category: "app.meta.billing.category",
    description: "app.meta.pricing.description",
    image: "https://unbottled.ai/images/pricing-hero.jpg",
    imageAlt: "app.meta.pricing.imageAlt",
    keywords: ["app.meta.pricing.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.pricing.ogTitle",
        description: "app.meta.pricing.ogDescription",
        url: "https://unbottled.ai/pricing",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "app.meta.pricing.twitterTitle",
        description: "app.meta.pricing.twitterDescription",
      },
    },
  });
};

export default async function PricingPage({
  params,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  // Fetch user data
  const userResponse = await userRepository.getUserByAuth(
    {
      locale,
      detailLevel: UserDetailLevel.COMPLETE,
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
      <CreditPricingSection
        locale={locale}
        currentUser={user}
        useHomePageLink
      />

      {/* <Testimonials locale={locale} /> */}
      <CallToAction locale={locale} />
    </>
  );
}
