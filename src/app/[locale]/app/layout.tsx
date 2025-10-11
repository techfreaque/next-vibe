import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { JSX, ReactNode } from "react";

import { onboardingRepository } from "@/app/api/[locale]/v1/core/onboarding/repository";
import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/definition";
import { userRolesRepository } from "@/app/api/[locale]/v1/core/user/user-roles/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";

import { AppLayoutClient } from "./_components/app-layout";

interface AppLayoutProps {
  params: Promise<{ locale: CountryLanguage }>;
  children: ReactNode;
}

/**
 * Generate metadata for the app pages with translations
 */
export async function generateMetadata({
  params,
}: AppLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return metadataGenerator(locale, {
    path: "app",
    title: "meta.app.title",
    description: "meta.app.description",
    category: "meta.app.category",
    image: "https://socialmediaservice.com/images/app-hero.jpg",
    imageAlt: "meta.app.imageAlt",
    keywords: [
      "meta.app.keywords.app",
      "meta.app.keywords.dashboard",
      "meta.app.keywords.socialMedia",
      "meta.app.keywords.management",
    ],
    additionalMetadata: {
      openGraph: {
        title: "meta.app.ogTitle",
        description: "meta.app.ogDescription",
        url: `https://socialmediaservice.com/${locale}`,
        type: "website",
        images: [
          {
            url: "https://socialmediaservice.com/images/app-hero.jpg",
            width: 1200,
            height: 630,
            alt: "meta.app.imageAlt",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.app.twitterTitle",
        description: "meta.app.twitterDescription",
        images: ["https://socialmediaservice.com/images/app-hero.jpg"],
      },
    },
  });
}

export default async function AppLayout({
  children,
  params,
}: AppLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);
  // Check authentication on the server side
  const userResponse = await userRepository.getUserByAuth(
    {
      detailLevel: UserDetailLevel.COMPLETE,
    },
    logger,
  );
  // Redirect if not authenticated
  if (!userResponse.success) {
    redirect(`/${locale}/user/login?callbackUrl=/${locale}/app/subscription`);
  }
  const user = userResponse.data;

  const userRolesResponse = await userRolesRepository.hasRole(
    user.id,
    UserRole.ADMIN,
    logger,
  );
  const isAdmin = userRolesResponse.success && userRolesResponse.data;

  // Get onboarding status
  const onboardingResponse = await onboardingRepository.getOnboardingStatus(
    user.id,
    logger,
  );
  const onboardingStatus = onboardingResponse.success
    ? onboardingResponse.data
    : null;

  return (
    <AppLayoutClient
      locale={locale}
      user={user}
      onboardingStatus={onboardingStatus}
      isAdmin={isAdmin}
    >
      {children}
    </AppLayoutClient>
  );
}
