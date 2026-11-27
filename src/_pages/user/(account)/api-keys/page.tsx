/**
 * API keys - account page for creating, listing and revoking /v1 keys.
 * The api-keys endpoint widget does the work; this page adds the account
 * chrome and a signed-out state.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { getAvailableChatModelCount } from "next-vibe/agent/models/all-models";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { canonicalPageUrl } from "next-vibe/core/i18n/core/metadata";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import type { JSX } from "react";

import { getApiAccessPrices } from "@/api-keys/access";
import { translations as configTranslations } from "@/env/i18n/en";

import { scopedTranslation as pageT } from "./i18n";
import { ApiKeysPageClient } from "./page-client";

interface ApiKeysPageProps {
  params: Promise<{
    locale: CountryLanguage;
  }>;
}

export interface ApiKeysPageData {
  locale: CountryLanguage;
  isAuthenticated: boolean;
  user: JwtPayloadType;
  platform: Platform;
  modelCount: number;
  subPrice: string;
}

export async function generateMetadata({
  params,
}: ApiKeysPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = pageT.scopedT(locale);
  const modelCount = getAvailableChatModelCount(
    false,
    await getEnvAvailability(),
  );
  return {
    title: t("metaTitle", { appName: configTranslations.appName }),
    description: t("description", { modelCount }),
    alternates: { canonical: canonicalPageUrl(locale, "user/api-keys") },
    robots: { index: false, follow: true },
  };
}

export async function tanstackLoader({
  params,
}: ApiKeysPageProps): Promise<ApiKeysPageData> {
  const { locale } = await params;

  const logger = createEndpointLogger(false, locale);
  const user = await AuthRepository.getAuthMinimalUser(
    [UserRole.CUSTOMER, UserRole.PUBLIC, UserRole.ADMIN],
    { platform: Platform.NEXT_PAGE, locale },
    logger,
  );
  const isAuthenticated = !user.isPublic && !!user.id;
  const isAdmin = !user.isPublic && user.roles.includes(UserRole.ADMIN);
  const modelCount = getAvailableChatModelCount(
    isAdmin,
    await getEnvAvailability(),
  );

  return {
    locale,
    isAuthenticated,
    user,
    platform: Platform.NEXT_PAGE,
    modelCount,
    subPrice: getApiAccessPrices(locale).subPrice,
  };
}

export function TanstackPage(data: ApiKeysPageData): JSX.Element {
  return <ApiKeysPageClient {...data} />;
}

export default async function ApiKeysPage({
  params,
}: ApiKeysPageProps): Promise<JSX.Element> {
  const data = await tanstackLoader({ params });
  return <TanstackPage {...data} />;
}
