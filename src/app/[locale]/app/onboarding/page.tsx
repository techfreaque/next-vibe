import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { JSX } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { businessDataRepository } from "@/app/api/[locale]/v1/core/business-data/repository";
import { consultationRepository } from "@/app/api/[locale]/v1/core/consultation/repository";
import { onboardingRepository } from "@/app/api/[locale]/v1/core/onboarding/repository";
import { subscriptionRepository } from "@/app/api/[locale]/v1/core/subscription/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import ErrorFallback from "../../_components/error-fallback";
import { OnboardingFlow } from "./_components/onboarding-flow";

interface Props {
  params: Promise<{ locale: CountryLanguage }>;
  searchParams: Promise<{
    step?: "pricing" | "consultation" | "questions";
    checkout?: "success" | "failed" | "cancelled";
    payment?: "success" | "cancelled";
  }>;
}

/**
 * Generate metadata for the Onboarding page with translations
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return metadataGenerator(locale, {
    path: "app/onboarding",
    title: "onboarding.title",
    description: "onboarding.description",
    category: "meta.dashboard.category",
    image: "https://socialmediaservice.com/images/onboarding-hero.jpg",
    imageAlt: "meta.dashboard.imageAlt",
    keywords: ["meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "onboarding.title",
        description: "onboarding.description",
        url: `https://socialmediaservice.com/${locale}/app/onboarding`,
        type: "website",
        images: [
          {
            url: "https://socialmediaservice.com/images/onboarding-hero.jpg",
            width: 1200,
            height: 630,
            alt: "meta.dashboard.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "onboarding.title",
        description: "onboarding.description",
        images: ["https://socialmediaservice.com/images/onboarding-hero.jpg"],
      },
    },
  });
}

/**
 * Production-Ready Onboarding Page Component
 *
 * Server component that only handles authentication.
 * All business logic, data operations, and state management are handled
 * by API hooks in the client-side components.
 */
export default async function OnboardingPage({
  params,
  searchParams,
}: Props): Promise<JSX.Element> {
  const { locale } = await params;
  const { step, checkout, payment } = await searchParams;

  // Check authentication on the server side
  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.STANDARD,
    },
    logger,
  );

  // Redirect if not authenticated
  if (!userResponse?.success) {
    logger.error(
      "[OnboardingPage] User not authenticated, redirecting to login",
    );
    redirect(`/${locale}/user/login?callbackUrl=/${locale}/app/onboarding`);
  }

  const userData = userResponse.data;
  const userId = userData.id;

  const [
    onboardingStatusResponse,
    businessDataResponse,
    subscriptionResponse,
    consultationStatusResponse,
  ] = await Promise.all([
    onboardingRepository.getOnboardingStatus(userId, logger),
    businessDataRepository.getAllBusinessData(userId, userData, locale, logger),
    subscriptionRepository.getSubscription(userId, logger),
    consultationRepository.getConsultationStatus(userId, logger),
  ]);

  // Extract data with fallbacks
  const onboardingStatus = onboardingStatusResponse?.success
    ? onboardingStatusResponse.data
    : {
        userId,
        isCompleted: false,
        currentStep: "profile" as const,
        completedSteps: [],
      };

  const businessDataCompletionStatus = businessDataResponse?.success
    ? businessDataResponse.data
    : null;

  const subscription = subscriptionResponse?.success
    ? subscriptionResponse.data
    : null;

  const consultationStatus = consultationStatusResponse?.success
    ? consultationStatusResponse.data
    : null;

  return (
    <ErrorBoundary locale={locale} fallback={<ErrorFallback />}>
      <OnboardingFlow
        locale={locale}
        initialOnboardingStatus={onboardingStatus}
        initialBusinessDataCompletionStatus={businessDataCompletionStatus}
        initialSubscription={subscription}
        initialConsultationStatus={consultationStatus}
        urlParams={{
          step,
          checkout,
          payment,
        }}
      />
    </ErrorBoundary>
  );
}
