import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { getMaxToolCountAllPlatforms } from "@/app/api/[locale]/agent/chat/default-tool-counts";
import {
  ProductIds,
  productsRepository,
} from "@/app/api/[locale]/products/repository-client";
import { endpointsMeta } from "@/app/api/[locale]/system/generated/endpoints-meta/en";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { metadataGenerator } from "@/i18n/core/metadata";
import { simpleT } from "@/i18n/core/shared";

import { Architecture } from "./_components/architecture";
import CallToAction from "./_components/call-to-action";
import { CapabilityShowcase } from "./_components/capability-showcase";
import { CloudVsSelfHost } from "./_components/cloud-vs-selfhost";
import Hero from "./_components/hero";
import { OpenClawComparison } from "./_components/openclaw-comparison";
import { ProblemStatement } from "./_components/problem-statement";
import { StatsStrip } from "./_components/stats-strip";

// Revalidate every hour (ISR)
export const revalidate = 3600;

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
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: "app.meta.home.imageAlt",
    keywords: ["app.meta.home.keywords"],
    additionalMetadata: {
      openGraph: {
        title: "app.meta.home.ogTitle",
        description: "app.meta.home.ogDescription",
        url: `${envClient.NEXT_PUBLIC_APP_URL}/${locale}`,
        type: "website",
        images: [
          {
            url: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
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
        images: [`${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`],
      },
    },
  });
}

export default async function StoryPage({
  params,
}: HomePageProps): Promise<JSX.Element | never> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}

interface StoryPageData {
  locale: CountryLanguage;
  totalToolCount: number;
  totalEndpointCount: number;
  subPrice: number;
  subCurrency: string;
  hasUser: boolean;
}

export async function tanstackLoader({
  params,
}: HomePageProps): Promise<StoryPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, Date.now(), locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
      detailLevel: UserDetailLevel.MINIMAL,
    },
    locale,
    logger,
  );

  const totalToolCount = getMaxToolCountAllPlatforms();
  const totalEndpointCount = endpointsMeta.length;
  const products = productsRepository.getProducts(locale);
  const country = getCountryFromLocale(locale);
  const countryInfo = languageConfig.countryInfo[country];

  return {
    locale,
    totalToolCount,
    totalEndpointCount,
    subPrice: products[ProductIds.SUBSCRIPTION].price,
    subCurrency: countryInfo.symbol,
    hasUser: userResponse.success && !!userResponse.data,
  };
}

export function TanstackPage({
  locale,
  totalToolCount,
  totalEndpointCount,
  subPrice,
  subCurrency,
  hasUser,
}: StoryPageData): JSX.Element {
  if (!hasUser) {
    const { t } = simpleT(locale);
    return (
      <Div>
        <Div className="flex items-center justify-center min-h-screen p-4">
          <Div className="max-w-md text-center">
            <P className="text-lg font-semibold mb-2">
              {t("app.common.error.title")}
            </P>
            <P className="text-sm text-muted-foreground">
              {t("app.common.error.message")}
            </P>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <Div role="main" className="flex min-h-screen flex-col w-full">
      <Hero locale={locale} totalToolCount={totalToolCount} />
      <ProblemStatement locale={locale} />
      <CapabilityShowcase locale={locale} totalToolCount={totalToolCount} />
      <Architecture locale={locale} />
      <OpenClawComparison locale={locale} totalToolCount={totalToolCount} />
      <CloudVsSelfHost
        locale={locale}
        subPrice={subPrice}
        subCurrency={subCurrency}
      />
      <StatsStrip locale={locale} totalEndpointCount={totalEndpointCount} />
      <CallToAction locale={locale} />
    </Div>
  );
}
