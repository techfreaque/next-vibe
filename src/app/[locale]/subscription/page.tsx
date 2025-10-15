import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { JSX } from "react";

import { paymentRepository } from "@/app/api/[locale]/v1/core/payment/repository";
import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { SubscriptionClientContent } from "./_components/subscription-client-content";

interface SubscriptionPageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

/**
 * Generate metadata for the subscription page
 */
export async function generateMetadata({
  params,
}: SubscriptionPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "app/subscription",
    title: "meta.subscription.title",
    description: "meta.subscription.description",
    category: "meta.subscription.category",
    image: "https://socialmediaservice.com/images/subscription-plans.jpg",
    imageAlt: "meta.subscription.imageAlt",
    keywords: [
      "meta.subscription.keywords.subscription",
      "meta.subscription.keywords.billing",
      "meta.subscription.keywords.plans",
      "meta.subscription.keywords.pricing",
    ],
  });
}

export default async function SubscriptionPage({
  params,
}: SubscriptionPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  // Check authentication first
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );

  // Redirect if not authenticated
  if (!userResponse?.success || !userResponse.data) {
    redirect(`/${locale}/user/login?callbackUrl=/${locale}/subscription`);
  }

  // Fetch subscription data on the server
  const subscriptionResponse = await subscriptionRepository.getSubscription(
    userResponse.data.id,
    logger,
  );
  const subscription = subscriptionResponse.success
    ? subscriptionResponse.data
    : null;

  // Fetch payment info on the server
  const paymentResponse = await paymentRepository.getPaymentInfo(
    {
      limit: 10,
      offset: 0,
    },
    userResponse.data,
    locale,
    logger,
  );
  const paymentInfo = paymentResponse.success ? paymentResponse.data : null;

  // Fetch billing history on the server
  const billingHistoryResponse = await paymentRepository.getBillingHistory(
    userResponse.data.id,
    {
      limit: 40,
      offset: 0,
    },
    logger,
  );
  const billingHistory = billingHistoryResponse.success
    ? billingHistoryResponse.data
    : null;

  return (
    <SubscriptionClientContent
      locale={locale}
      user={userResponse.data}
      initialSubscription={subscription}
      initialPaymentInfo={paymentInfo}
      initialBillingHistory={billingHistory}
    />
  );
}
