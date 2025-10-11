/**
 * Business Info Overview Page
 * Dashboard showing completion status of all business information sections
 */

import "server-only";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { BusinessInfoOverviewClient } from "./_components/business-info-overview-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: CountryLanguage }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return metadataGenerator(locale, {
    path: "app/business-info",
    title: "meta.businessInfo.title",
    description: "meta.businessInfo.description",
    category: "meta.businessInfo.category",
    image: "https://socialmediaservice.com/images/business-info-hero.jpg",
    imageAlt: "meta.businessInfo.imageAlt",
    keywords: [
      "meta.businessInfo.keywords.businessInformation",
      "meta.businessInfo.keywords.profileManagement",
      "meta.businessInfo.keywords.businessSetup",
      "meta.businessInfo.keywords.socialMediaStrategy",
      "meta.businessInfo.keywords.consultationPreferences",
    ],
    additionalMetadata: {
      openGraph: {
        title: "meta.businessInfo.ogTitle",
        description: "meta.businessInfo.ogDescription",
        url: `https://socialmediaservice.com/${locale}/app/business-info`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "meta.businessInfo.twitterTitle",
        description: "meta.businessInfo.twitterDescription",
      },
    },
  });
}

interface PageProps {
  params: Promise<{ locale: CountryLanguage }>;
}

export default async function BusinessInfoOverviewPage({
  params,
}: PageProps): Promise<ReactElement> {
  const { locale } = await params;

  const logger = createEndpointLogger(false, Date.now(), locale);
  const userResponse = await userRepository.getUserByAuth({}, logger);

  const user = userResponse.success ? userResponse.data : undefined;
  if (!user?.id) {
    redirect(`/${locale}/user/login`);
  }

  const { t } = simpleT(locale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("businessInfo.overview.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("businessInfo.overview.description")}
        </p>
      </div>

      {/* Client Component for Dynamic Data */}
      <BusinessInfoOverviewClient locale={locale} />
    </div>
  );
}
