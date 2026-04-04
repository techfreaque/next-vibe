import type { Metadata } from "next";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import { getMaxToolCountAllPlatforms } from "@/app/api/[locale]/agent/chat/default-tool-counts";
import { getAvailableSkillCount } from "@/app/api/[locale]/agent/chat/skills/config";
import { agentEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  type ModelCountsByContentLevel,
  getAvailableModelCount,
  getAvailableModelCountsByContentLevel,
  getAvailableProviderCount,
} from "@/app/api/[locale]/agent/models/all-models";
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
import { configScopedTranslation } from "@/config/i18n";
import { languageConfig } from "@/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { metadataGenerator } from "@/i18n/core/metadata";

import { HomeClient } from "./_components/home-client";
import { scopedTranslation } from "./i18n";

export const dynamic = "force-dynamic";

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
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  return metadataGenerator(locale, {
    path: "",
    title: t("meta.title", { appName }),
    category: t("meta.category"),
    description: t("meta.description"),
    image: `${envClient.NEXT_PUBLIC_APP_URL}/images/home-hero.jpg`,
    imageAlt: t("meta.imageAlt", { appName }),
    keywords: [t("meta.keywords")],
  });
}

interface StoryPageData {
  locale: CountryLanguage;
  totalToolCount: number;
  totalEndpointCount: number;
  totalModelCount: number;
  totalProviderCount: number;
  totalSkillCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
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

  const user = userResponse.success ? userResponse.data : null;
  const isAdmin = user
    ? !user.isPublic && user.roles.includes(UserRole.ADMIN)
    : false;
  const userRoles = user ? user.roles : [UserRole.PUBLIC];

  return {
    locale,
    totalToolCount,
    totalEndpointCount,
    totalModelCount: getAvailableModelCount(agentEnvAvailability, isAdmin),
    totalProviderCount: getAvailableProviderCount(
      agentEnvAvailability,
      isAdmin,
    ),
    modelCountsByTier: getAvailableModelCountsByContentLevel(
      agentEnvAvailability,
      isAdmin,
    ),
    totalSkillCount: getAvailableSkillCount(userRoles),
    subPrice: products[ProductIds.SUBSCRIPTION].price,
    subCurrency: countryInfo.symbol,
    hasUser: userResponse.success && !!userResponse.data,
  };
}

export function TanstackPage({
  locale,
  totalToolCount,
  totalEndpointCount,
  totalModelCount,
  totalProviderCount,
  totalSkillCount,
  modelCountsByTier,
  subPrice,
  subCurrency,
  hasUser,
}: StoryPageData): JSX.Element {
  if (!hasUser) {
    const { t } = scopedTranslation.scopedT(locale);
    return (
      <Div>
        <Div className="flex items-center justify-center min-h-screen p-4">
          <Div className="max-w-md text-center">
            <P className="text-lg font-semibold mb-2">
              {t("common.error.title")}
            </P>
            <P className="text-sm text-muted-foreground">
              {t("common.error.message")}
            </P>
          </Div>
        </Div>
      </Div>
    );
  }

  return (
    <HomeClient
      locale={locale}
      totalToolCount={totalToolCount}
      totalEndpointCount={totalEndpointCount}
      totalModelCount={totalModelCount}
      totalProviderCount={totalProviderCount}
      totalSkillCount={totalSkillCount}
      modelCountsByTier={modelCountsByTier}
      subPrice={subPrice}
      subCurrency={subCurrency}
    />
  );
}

export default async function StoryPage({
  params,
}: HomePageProps): Promise<JSX.Element | never> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
