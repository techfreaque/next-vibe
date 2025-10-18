import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { JSX } from "react";

import { creditRepository } from "@/app/api/[locale]/v1/core/agent/chat/credits/repository";
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
 * Generate metadata for the subscription (credits) page
 */
export async function generateMetadata({
  params,
}: SubscriptionPageProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "subscription",
    title: "meta.subscription.title",
    description: "meta.subscription.description",
    category: "meta.subscription.category",
    image: "https://unbottled.ai/images/subscription-plans.jpg",
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

  // Fetch credit balance
  const creditsResponse = await creditRepository.getBalance(
    userResponse.data.id,
  );
  const credits = creditsResponse.success ? creditsResponse.data : null;

  // Fetch transaction history
  const historyResponse = await creditRepository.getTransactions(
    userResponse.data.id,
    50, // limit
    0, // offset
  );
  const history = historyResponse.success ? historyResponse.data : null;

  return (
    <SubscriptionClientContent
      locale={locale}
      initialCredits={credits}
      initialHistory={history}
    />
  );
}
