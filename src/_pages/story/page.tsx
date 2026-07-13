import type { Metadata } from "next";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { metadataGenerator } from "next-vibe/core/i18n/core/metadata";
import { UserRole } from "next-vibe/identity/roles/enum";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Div } from "next-vibe/ui/ui/div";
import { P } from "next-vibe/ui/ui/typography";
import type { JSX } from "react";

import { getMaxToolCountAllPlatforms } from "@/app/api/[locale]/agent/chat/default-tool-counts";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  getAvailableModelCount,
  getAvailableModelCountsByContentLevel,
  getAvailableProviderCount,
  type ModelCountsByContentLevel,
} from "@/app/api/[locale]/agent/models/all-models";
import { envClient } from "@/config/env-client";
import { configScopedTranslation } from "@/config/i18n";

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
  totalModelCount: number;
  totalProviderCount: number;
  modelCountsByTier: ModelCountsByContentLevel;
  hasUser: boolean;
  authError?: string;
}

export async function tanstackLoader({
  params,
}: HomePageProps): Promise<StoryPageData> {
  const { locale } = await params;
  const logger = createEndpointLogger(false, locale);

  const userResponse = await UserRepository.getUserByAuth(
    {
      roles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN],
      detailLevel: UserDetailLevel.MINIMAL,
    },
    locale,
    logger,
  );

  const totalToolCount = getMaxToolCountAllPlatforms();

  if (!userResponse.success) {
    logger.error("Failed to get user for story page", {
      error: userResponse.message,
    });
    return {
      locale,
      totalToolCount,
      totalModelCount: getAvailableModelCount(false, getEnvAvailability()),
      totalProviderCount: getAvailableProviderCount(
        false,
        getEnvAvailability(),
      ),
      modelCountsByTier: getAvailableModelCountsByContentLevel(
        false,
        getEnvAvailability(),
      ),
      hasUser: false,
      authError: userResponse.message,
    };
  }

  const user = userResponse.data;
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);

  return {
    locale,
    totalToolCount,
    totalModelCount: getAvailableModelCount(isAdmin, getEnvAvailability()),
    totalProviderCount: getAvailableProviderCount(
      isAdmin,
      getEnvAvailability(),
    ),
    modelCountsByTier: getAvailableModelCountsByContentLevel(
      isAdmin,
      getEnvAvailability(),
    ),
    hasUser: !user.isPublic,
  };
}

export function TanstackPage({
  locale,
  totalToolCount,
  totalModelCount,
  totalProviderCount,
  modelCountsByTier,
  hasUser,
  authError,
}: StoryPageData): JSX.Element {
  if (authError) {
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
      totalModelCount={totalModelCount}
      totalProviderCount={totalProviderCount}
      modelCountsByTier={modelCountsByTier}
      hasUser={hasUser}
    />
  );
}

export default async function StoryPage({
  params,
}: HomePageProps): Promise<JSX.Element | never> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
